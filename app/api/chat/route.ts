import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db();

    // SIMPLE KEYWORD EXTRACTION (NO AI REQUIRED)
    // We clean the message and turn it into a regex search
    const cleanQuery = message.toLowerCase().trim()
      .replace(/what's|what is|tell me about|search for|find|show me|any news on|about|latest/g, '')
      .trim();
    
    // Fallback if message was just a greeting
    if (cleanQuery.length < 2) {
      return NextResponse.json({
        message: "Hello! I'm your AI Radar assistant. You can ask me about specific companies (like 'Claude' or 'OpenAI'), topics ('AI Agents'), or search for startups!",
        results: []
      });
    }

    const searchRegex = new RegExp(cleanQuery, 'i');

    // CONCURRENT SEARCH ACROSS COLLECTIONS
    const [newsResults, startupResults] = await Promise.all([
      db.collection('news').find({
        $or: [
          { title: searchRegex },
          { summary: searchRegex },
          { company: searchRegex },
          { toolName: searchRegex }
        ]
      }).sort({ date: -1 }).limit(3).toArray(),
      
      db.collection('startups').find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { tags: searchRegex }
        ]
      }).sort({ date: -1 }).limit(3).toArray()
    ]);

    const totalResultsCount = newsResults.length + startupResults.length;

    // BOT RESPONSE GENERATOR - STICKING TO INTERNAL DATA
    let botMessage = "";
    if (totalResultsCount === 0) {
      botMessage = `I searched our internal radar database for "${cleanQuery}" but couldn't find any direct matches. Try searching for a different startup name or tech sector!`;
    } else {
      const newsFound = newsResults.length > 0;
      const startupsFound = startupResults.length > 0;
      
      if (newsFound && startupsFound) {
        botMessage = `I've found these entries in our database for "${cleanQuery}":`;
      } else if (newsFound) {
        botMessage = `Here is the latest news record from our database on "${cleanQuery}":`;
      } else {
        botMessage = `I found a matching startup in our registry for "${cleanQuery}":`;
      }
    }

    // MAP RESULTS TO A UNIFIED FORMAT FOR THE CHAT UI
    const formattedResults = [
      ...newsResults.map(n => ({
        id: n._id,
        type: 'news',
        title: n.title,
        subtitle: n.company,
        content: n.summary,
        link: n.link,
        date: n.date
      })),
      ...startupResults.map(s => ({
        id: s._id,
        type: 'startup',
        title: s.name,
        subtitle: s.source,
        content: s.description,
        link: s.link,
        date: s.date
      }))
    ];

    return NextResponse.json({
      message: botMessage,
      results: formattedResults
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
}
