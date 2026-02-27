import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import clientPromise from '@/lib/mongodb';

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  }
});

const STARTUP_SOURCES = [
  { name: 'YC Blog', url: 'https://www.ycombinator.com/blog/rss', category: 'SaaS' },
  { name: 'BetaList', url: 'https://betalist.com/rss', category: 'Consumer' },
  { name: 'Product Hunt', url: 'https://www.producthunt.com/feed', category: 'Tech' },
  { name: 'CryptoPanic', url: 'https://cryptopanic.com/news/rss/', category: 'Blockchain' },
  { name: 'TechCrunch Startups', url: 'https://techcrunch.com/category/startups/feed/', category: 'Tech' },
  { name: 'AI News', url: 'https://www.artificialintelligence-news.com/feed/', category: 'AI' },
  { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', category: 'AI' },
  { name: 'Hacker News Show', url: 'https://hnrss.github.io/show', category: 'DevTools' },
  { name: 'Wired Business', url: 'https://www.wired.com/feed/category/business/latest/rss', category: 'Tech' },
  { name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss/tag/startups', category: 'Blockchain' },
];

const CATEGORIES = ['AI', 'Blockchain', 'SaaS', 'Fintech', 'Ecommerce', 'Web3', 'DevTools', 'Consumer', 'Tech'];

function detectTags(text: string): string[] {
  const tags: string[] = [];
  const textLower = text.toLowerCase();
  
  if (textLower.match(/\bai\b|artificial intelligence|machine learning|llm|gpt|neural|deepseek|openai|anthropic|claude|gemini/)) {
    tags.push('AI');
  }
  if (textLower.match(/blockchain|crypto|web3|ethereum|bitcoin|solana|defi|nft|wallet|decentralized/)) {
    tags.push('Blockchain');
    tags.push('Web3');
  }
  if (textLower.match(/saas|software as a service|enterprise|b2b|work|business/)) {
    tags.push('SaaS');
  }
  if (textLower.match(/fintech|finance|banking|payment|trading|invest/)) {
    tags.push('Fintech');
  }
  if (textLower.match(/ecommerce|shopping|retail|marketplace|store/)) {
    tags.push('Ecommerce');
  }
  if (textLower.match(/devtools|developer tools|coding|api|infrastructure|github|sdk|framework/)) {
    tags.push('DevTools');
  }
  if (textLower.match(/consumer|social|app|mobile|lifestyle/)) {
    tags.push('Consumer');
  }
  
  return tags;
}

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('startups');

  let syncedCount = 0;
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  for (const source of STARTUP_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url).catch(() => null);
      if (!feed) continue;
      
      for (const item of feed.items) {
        const title = item.title?.split(':')[0].trim() || '';
        const description = (item.contentSnippet || item.content || item.description || '').replace(/<[^>]*>?/gm, '');
        const tags = detectTags(title + ' ' + description);
        
        // Add source category as a default if no keywords matched
        if (tags.length === 0) {
          tags.push(source.category);
        } else if (!tags.includes(source.category) && source.category !== 'Tech') {
          // Also add source category if it's specific
          tags.push(source.category);
        }

        // Always add 'Tech' as a broad category if it fits general tech profile
        if (!tags.includes('Tech')) {
          tags.push('Tech');
        }

        const startup = {
          name: title,
          description: description,
          link: item.link,
          source: source.name,
          tags: Array.from(new Set(tags)), // Ensure unique tags
          date: item.pubDate ? new Date(item.pubDate) : new Date(),
          createdAt: new Date(),
        };

        if (startup.date < twoYearsAgo) continue;

        const result = await collection.updateOne(
          { link: startup.link },
          { $set: startup }, // Use $set to update tags if existing
          { upsert: true }
        );
        if (result.upsertedCount > 0) syncedCount++;
      }
    } catch (e) {
      console.error(`Error fetching startups from ${source.name}:`, e);
    }
  }

  return NextResponse.json({ syncedCount });
}

