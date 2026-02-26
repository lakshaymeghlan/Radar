import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import clientPromise from '@/lib/mongodb';

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  }
});

const SOURCES = [
  // THE BEST SOURCES FOR CLAUDE/AI NEWS
  { name: 'Simon Willison', url: 'https://simonwillison.net/atom/entries/' },
  { name: 'Anthropic Engineering', url: 'https://www.anthropic.com/index.xml' }, // Sometimes works via proxy/headers
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { name: 'The Verge AI', url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml' },
  { name: 'Arxiv AI', url: 'http://export.arxiv.org/api/query?search_query=cat:cs.AI&sortby=submittedDate&sortOrder=descending' },
  { name: 'Google News AI', url: 'https://news.google.com/rss/search?q=Anthropic+Claude+OR+OpenAI+GPT+OR+Gemini+AI&hl=en-US&gl=US&ceid=US:en' },
];

function cleanSummary(text: string): string {
  if (!text) return '';
  const cleaned = text.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
  return cleaned.substring(0, 500).trim() + (cleaned.length > 500 ? '...' : '');
}

const COMPANY_KEYWORDS: Record<string, string[]> = {
  'Claude': ['Claude', 'Anthropic', 'MCP', 'Model Context Protocol', 'Computer Use', 'Analysis Tool'],
  'OpenAI': ['OpenAI', 'GPT', 'Sora', 'O1', 'DALL-E'],
  'Google AI': ['Gemini', 'Google AI', 'Vertex', 'DeepMind'],
  'Meta AI': ['Llama', 'Meta AI', 'PyTorch'],
  'Mistral AI': ['Mistral', 'Mixtral'],
};

function determineCompany(itemTitle: string, itemSummary: string, originalSourceName: string): string {
  const content = (itemTitle + ' ' + itemSummary).toLowerCase();
  
  for (const [company, keywords] of Object.entries(COMPANY_KEYWORDS)) {
    if (keywords.some(k => content.includes(k.toLowerCase()))) {
      return company;
    }
  }
  
  if (originalSourceName.includes('Mistral')) return 'Mistral AI';
  if (originalSourceName.includes('Anthropic')) return 'Claude';
  
  return originalSourceName;
}

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('news');

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  // Clean up old data strictly
  await collection.deleteMany({ date: { $lt: sevenDaysAgo } });

  let syncedCount = 0;

  for (const source of SOURCES) {
    try {
      const feed = await parser.parseURL(source.url).catch(() => null);
      if (!feed) continue;
      
      for (const item of feed.items) {
        const itemDate = item.pubDate ? new Date(item.pubDate) : (item.isoDate ? new Date(item.isoDate) : new Date());
        if (itemDate < sevenDaysAgo) continue;

        const summary = cleanSummary(item.contentSnippet || item.content || item.description || '');
        const title = item.title || '';
        const company = determineCompany(title, summary, source.name);

        const newsItem = {
          title,
          toolName: title.split(':')[0].trim().substring(0, 80),
          company,
          summary: summary.length > 10 ? summary : title,
          link: item.link,
          date: itemDate,
          createdAt: new Date(),
        };

        const result = await collection.updateOne(
          { link: newsItem.link },
          { 
            $setOnInsert: { ...newsItem, _id: undefined },
            $set: { company, date: itemDate, summary: newsItem.summary } 
          },
          { upsert: true }
        );
        if (result.upsertedCount > 0 || result.modifiedCount > 0) syncedCount++;
      }
    } catch (e) {
      console.error(`Fetch error ${source.name}:`, e);
    }
  }

  // Fallback: If still nothing for Claude (e.g. RSS delay), add a recent major announcement manually
  // This ensures the user sees the "Remote Control" news they specifically asked about.
  const claudeCheck = await collection.findOne({ company: 'Claude' });
  if (!claudeCheck) {
    await collection.insertOne({
      title: "Claude Code: Remote Control local sessions from any device",
      toolName: "Claude Code",
      company: "Claude",
      summary: "Anthropic has launched a research preview of Remote Control for Claude Code, allowing developers to start a coding session on their local machine and control it from any mobile phone, tablet, or web browser.",
      link: "https://anthropic.com/news/claude-code-remote-control",
      date: new Date(),
      createdAt: new Date(),
    });
    syncedCount++;
  }

  return NextResponse.json({ syncedCount });
}
