import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    // Prepare prompt
    const systemPrompt = `You are the Radar Onboarding Agent, a friendly AI helping founders launch their startup on the Radar platform.
Your goal is to extract EXACTLY these 7 fields from the conversation:
1. name (Startup name)
2. tagline (Max 50 chars, catchy)
3. description (Detailed 2-3 sentences without marketing fluff)
4. link (Valid URL)
5. category (e.g. AI, DevTools, SaaS, Consumer, Fintech, Blockchain)
6. founder (Founder name or handle)
7. pricing (e.g. Free, $10/mo, Custom)

Analyze the conversation history.
IF AND ONLY IF you have confident answers for ALL 7 fields, output ONLY a raw JSON object string with those exactly lowercase keys. No markdown blocks, no other text.
IF ANY field is missing, act like a friendly human (like on WhatsApp). Write a short, casual reply (max 2 sentences) asking the user for 1 or 2 of the missing details. Do not ask for everything at once. Be conversational and encouraging!`;

    const formattedMessages = messages.map(msg => `${msg.role === 'user' ? 'User' : 'Agent'}: ${msg.content}`).join('\n');
    const finalPrompt = `${systemPrompt}\n\nConversation so far:\n${formattedMessages}\n\nAgent:`;

    const payload = {
      contents: [{ parts: [{ text: finalPrompt }] }],
    };

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!data.candidates || data.candidates.length === 0) {
      if (data.error?.code === 429) {
        return NextResponse.json({ 
          error: 'Gemini Quota Exceeded. Free tier limit for 2.5-flash is 20 requests/day. Please try again tomorrow.',
          quotaExceeded: true 
        }, { status: 429 });
      }
      console.error("Gemini Error:", data);
      throw new Error(`Failed to get response from Gemini`);
    }

    const replyText = data.candidates[0].content.parts[0].text.trim();

    // Check if the reply is a JSON object
    try {
      const cleanJsonStr = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
      if (cleanJsonStr.startsWith('{') && cleanJsonStr.endsWith('}')) {
        const startupData = JSON.parse(cleanJsonStr);
        const requiredKeys = ['name', 'tagline', 'description', 'link', 'category', 'founder', 'pricing'];
        const isValid = requiredKeys.every(key => startupData[key] && startupData[key] !== "null");

        if (isValid) {
          const { getSession } = await import('@/lib/auth');
          const session = await getSession();
          const { ObjectId } = await import('mongodb');

          const client = await clientPromise;
          const db = client.db();
          
          const fullStartup = {
            ...startupData,
            tags: [startupData.category, "AI", "Startup"],
            date: new Date(),
            createdAt: new Date(),
            source: 'Agent Submission',
            status: 'verified',
            founderId: session?.user?.id ? new ObjectId(session.user.id) : null,
            founderName: session?.user?.name || startupData.founder,
            upvotes: 0,
          };

          const result = await db.collection('radar_startups').insertOne(fullStartup);
          
          return NextResponse.json({
            isComplete: true,
            startup: fullStartup,
            startupId: result.insertedId,
            reply: `Boom! 🚀 I've successfully launched **${startupData.name}** on Radar.`
          });
        }
      }
    } catch (e) {
      // Not JSON
    }

    return NextResponse.json({
      isComplete: false,
      reply: replyText
    });

  } catch (error) {
    console.error('Startup Agent Error:', error);
    return NextResponse.json({ error: 'Agent failed to respond' }, { status: 500 });
  }
}
