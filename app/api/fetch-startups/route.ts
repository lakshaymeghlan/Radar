import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import clientPromise from '@/lib/mongodb';

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  }
});

const STARTUP_SOURCES = [
  { name: 'YC Blog', url: 'https://www.ycombinator.com/blog/rss' },
  { name: 'BetaList', url: 'https://betalist.com/rss' },
  { name: 'EU-Startups', url: 'https://www.eu-startups.com/feed/' },
  { name: 'Startup Barn', url: 'https://startupbarn.io/feed/' },
  { name: 'Hacker News Show', url: 'https://hnrss.github.io/show' },
];

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('startups');

  let syncedCount = 0;

  for (const source of STARTUP_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url).catch(() => null);
      if (!feed) continue;
      
      for (const item of feed.items) {
        const startup = {
          name: item.title?.split(':')[0].trim(),
          description: item.contentSnippet || item.content || item.description || '',
          link: item.link,
          source: source.name,
          date: item.pubDate ? new Date(item.pubDate) : new Date(),
          createdAt: new Date(),
        };

        // Filter for 2025 startups if possible, or just recent ones
        const year = new Date(startup.date).getFullYear();
        if (year < 2024) continue; // Keep only recent/upcoming

        const result = await collection.updateOne(
          { link: startup.link },
          { $setOnInsert: startup },
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
