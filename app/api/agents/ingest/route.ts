import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import * as cheerio from 'cheerio';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Helper: Scrape description from URL
async function scrapeUrlForLearning(url: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); 
    const res = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AI-IngestBot/1.0',
      }
    });
    clearTimeout(timeoutId);

    const html = await res.text();
    const $ = cheerio.load(html);
    
    // Clean up to just text that matters for Gemini
    $('script, style, noscript, nav, footer, header').remove();
    const textContent = $('body').text().replace(/\s+/g, ' ').substring(0, 15000); // 15k chars is plenty for Gemini Flash
    
    return { textContent };
  } catch (error) {
    console.error(`Failed to scrape ${url}:`, error);
    return { textContent: null };
  }
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !url.startsWith('http')) {
      return NextResponse.json({ error: 'Please provide a valid URL' }, { status: 400 });
    }

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Missing Gemini API Key' }, { status: 500 });
    }

    // 1. Scrape context
    const { textContent } = await scrapeUrlForLearning(url);
    
    if (!textContent) {
      return NextResponse.json({ error: 'Failed to scrape URL for context' }, { status: 400 });
    }

    // 2. Pass to Gemini
    const prompt = `You are an expert AI Developer Educator. I am passing you raw scraped text from an AI tool's official website or GitHub repo documentation.
    Your job is to read it, understand the tool, and return a perfectly formatted JSON object to populate our "Learn AI" knowledge hub.
    
    Target URL: ${url}
    Raw Scraped Text Context: ${textContent}
    
    Identify what this tool is. Strictly follow this JSON schema:
    {
      "name": "Tool Name (e.g., Claude Code, Cursor, LangChain)",
      "slug": "url-friendly-lowercase-name",
      "category": "Broad Category (e.g., CLI, Framework, IDE, Video Gen)",
      "tagline": "1 punchy sentence describing what it does",
      "what_it_is": "A detailed 2-3 paragraph explanation of what the tool actually does, stripped of marketing fluff. Be technical but clear.",
      "setup_instructions": [
         "npm install -g example (if applicable)",
         "example --init (if applicable)"
      ],
      "use_cases": [
         "Use Case 1 (e.g., Automated Refactoring)",
         "Use Case 2"
      ],
      "official_url": "${url}"
    }
    
    Do NOT return markdown (like \`\`\`json). Return raw valid JSON.`;

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
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("Failed to get response from Gemini");
    }

    const replyText = data.candidates[0].content.parts[0].text.trim();
    const cleanJsonStr = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
    const toolData = JSON.parse(cleanJsonStr);

    // 3. Save to DB
    const client = await clientPromise;
    const db = client.db();
    
    const hash = crypto.createHash('sha256').update(toolData.slug || toolData.name).digest('hex');
    
    const learnDocument = {
      ...toolData,
      slug: toolData.slug || toolData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      hash,
      createdAt: new Date(),
    };

    const result = await db.collection('learn_tools').updateOne(
      { slug: learnDocument.slug },
      { $set: learnDocument },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: `Successfully ingested ${toolData.name}`,
      data: learnDocument
    });

  } catch (error) {
    console.error('Ingest Agent Error:', error);
    return NextResponse.json({ error: 'Ingestion failed' }, { status: 500 });
  }
}
