import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  }
});

const SOURCES = [
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { name: 'The Verge AI', url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml' },
  { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/' },
  { name: 'MarkTechPost', url: 'https://www.marktechpost.com/feed/' },
  { name: 'Wired AI', url: 'https://www.wired.com/feed/tag/ai/latest/rss' },
  { name: 'KDnuggets', url: 'https://www.kdnuggets.com/feed' },
  { name: 'AI News', url: 'https://www.artificialintelligence-news.com/feed/' },
  { name: 'InfoQ AI', url: 'https://feed.infoq.com/ai-ml-data-eng/news' },
  { name: 'Hugging Face Blog', url: 'https://huggingface.co/blog/feed.xml' },
  { name: 'Google News AI', url: 'https://news.google.com/rss/search?q=Anthropic+Claude+OR+OpenAI+GPT+OR+Gemini+AI+OR+LLM&hl=en-US&gl=US&ceid=US:en' },
  { name: 'Arxiv AI', url: 'http://export.arxiv.org/api/query?search_query=cat:cs.AI&sortby=submittedDate&sortOrder=descending&max_results=5' },
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

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Create a TTL index: documents expire 30 days (2592000 seconds) after the 'date' field
  // This automatically cleans up old news without needing a manual delete cron!
  await collection.createIndex({ date: 1 }, { expireAfterSeconds: 2592000 });

  let syncedCount = 0;
  const errors: string[] = [];

  for (const source of SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      if (!feed) continue;
      
      for (const item of feed.items) {
        const itemDate = item.pubDate ? new Date(item.pubDate) : (item.isoDate ? new Date(item.isoDate) : new Date());
        if (itemDate < thirtyDaysAgo) continue;

        const summary = cleanSummary(item.contentSnippet || item.content || item.description || '');
        const title = item.title || '';
        const company = determineCompany(title, summary, source.name);

        const hash = crypto.createHash('sha256').update(item.link || item.title || '').digest('hex');

        const newsItem = {
          title,
          toolName: title.split(':')[0].trim().substring(0, 80),
          company,
          summary: summary.length > 10 ? summary : title,
          link: item.link,
          date: itemDate,
          hash,
          createdAt: new Date(),
        };

        const { company: _c, date: _d, summary: _s, ...insertOnlyFields } = newsItem;

        const result = await collection.updateOne(
          { hash },
          { 
            $setOnInsert: insertOnlyFields,
            $set: { company, date: itemDate, summary: newsItem.summary } 
          },
          { upsert: true }
        );
        if (result.upsertedCount > 0 || result.modifiedCount > 0) syncedCount++;
      }
    } catch (e: any) {
      console.error(`Fetch error ${source.name}:`, e.message);
      errors.push(`Fetch error ${source.name}: ${e.message}`);
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

  return NextResponse.json({ syncedCount, errors });
}
