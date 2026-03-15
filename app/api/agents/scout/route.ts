import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import * as cheerio from 'cheerio';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Allow it to run for up to 5 minutes on Vercel Pro (if applicable)

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Helper: Fetch top Show HN stories
async function getShowHNStories(limit = 10) {
  try {
    const res = await fetch(`${HN_API_BASE}/showstories.json`);
    const storyIds = await res.json();
    return storyIds.slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch Show HN:', error);
    return [];
  }
}

// Helper: Fetch a single HN story item
async function getHNItem(id: number) {
  try {
    const res = await fetch(`${HN_API_BASE}/item/${id}.json`);
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch HN item ${id}:`, error);
    return null;
  }
}

// Helper: Scrape description from URL
async function scrapeUrl(url: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    const res = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AI-ScoutBot/1.0',
      }
    });
    clearTimeout(timeoutId);

    const html = await res.text();
    const $ = cheerio.load(html);
    
    const title = $('title').text().trim();
    let description = $('meta[name="description"]').attr('content')?.trim();
    
    if (!description) {
      description = $('meta[property="og:description"]').attr('content')?.trim();
    }
    
    if (!description) {
      // Fallback: grab first meaningful paragraph
      description = $('p').first().text().trim().substring(0, 300);
    }
    
    return { title, description };
  } catch (error) {
    console.error(`Failed to scrape ${url}:`, error);
    return { title: null, description: null };
  }
}

// Helper: Ask Gemini to analyze the startup
async function analyzeStartupWithLLM(title: string | null, description: string | null, originalTitle: string) {
  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    console.warn("No GOOGLE_GEMINI_API_KEY found, returning raw data");
    return null;
  }

  const prompt = `
    You are an expert AI startup analyst for a platform called Radar. 
    Review the following extracted website title and description for a new startup.
    Your job is to clean it up, make it sound professional (without marketing fluff), 
    determine if it's an AI or Tech startup, and return structured JSON.
    
    Website Title: ${title || originalTitle}
    Description: ${description || 'No description provided'}
    Original HackerNews Post Title: ${originalTitle}
    
    Strictly follow this JSON schema:
    {
      "name": "Clean name of the product/startup",
      "description": "A refined, 2-3 sentence descriptive pitch without marketing jargon.",
      "tags": ["AI", "DevTools"], // Max 3 tags. Examples: AI, SaaS, Fintech, Consumer, Blockchain, DevTools
      "confidence": 95 // How confident are you this is a real startup (0-100)
    }
    
    Do NOT return markdown. Only return pure JSON.
  `;

  try {
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    };

    const res = await fetch(`${GEMINI_API_URL}?key=${process.env.GOOGLE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      const jsonStr = data.candidates[0].content.parts[0].text;
      return JSON.parse(jsonStr);
    }
    return null;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    // Optionally check for auth headers if you want to secure it
    // const authHeader = req.headers.get('Authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    const client = await clientPromise;
    const db = client.db();
    const startupsCollection = db.collection('startups');

    const storyIds = await getShowHNStories(15);
    const results = [];

    for (const id of storyIds) {
      const item = await getHNItem(id);
      
      // We only care about entries that have links
      if (!item || !item.url) continue;

      // Deduplication check: Create a deterministic hash from the URL
      const hash = crypto.createHash('sha256').update(item.url).digest('hex');
      const exists = await startupsCollection.findOne({ hash });
      
      if (exists) {
        continue;
      }

      console.log(`[Scout] Investigating: ${item.title}`);
      
      // 1. Scrape the URL
      const { title: siteTitle, description: siteDesc } = await scrapeUrl(item.url);
      
      // 2. Pass to LLM (if key exists)
      let finalData = {
        name: siteTitle || item.title.replace(/^Show HN: /, ''),
        description: siteDesc || "Discovered via Show HN",
        tags: ['Tech'],
      };

      if (process.env.GOOGLE_GEMINI_API_KEY) {
        const aiAnalysis = await analyzeStartupWithLLM(siteTitle, siteDesc, item.title);
        if (aiAnalysis) {
            // Only accept if confidence is high enough
            if (aiAnalysis.confidence >= 50) {
               finalData = {
                 name: aiAnalysis.name || finalData.name,
                 description: aiAnalysis.description || finalData.description,
                 tags: aiAnalysis.tags && aiAnalysis.tags.length > 0 ? aiAnalysis.tags : finalData.tags,
               };
            }
        }
      }

      // 3. Prepare Database Entry
      const startupEntry = {
        ...finalData,
        link: item.url,
        source: 'HN Scout Agent',
        date: new Date(item.time * 1000),
        createdAt: new Date(),
        hash,
        status: 'pending_approval', // Very important: sets it aside for admin review
      };

      // 4. Save to DB
      await startupsCollection.insertOne(startupEntry);
      results.push(startupEntry);

      // Be nice to the API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json({
        success: true,
        scoutedCount: results.length,
        items: results.map(r => r.name)
    });
    
  } catch (error) {
    console.error('Agent route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
