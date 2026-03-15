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
    const systemPrompt = `You are the Radar Hiring Agent, an AI designed to help founders and recruiters create a job listing quickly via chat.
Your goal is to extract EXACTLY these 6 fields from the conversation:
1. title (e.g. Senior Frontend Engineer)
2. company (The startup hiring)
3. location (e.g. Remote, NY, SF)
4. type (e.g. Full-time, Contract, Internship)
5. description (A 2-4 sentence summary of the role and requirements without fluff)
6. applyLink (Valid URL or email address to apply)

Analyze the conversation history.
IF AND ONLY IF you have confident answers for ALL 6 fields, output ONLY a raw JSON object string with those exactly lowercase keys. No markdown blocks, no other text.
IF ANY field is missing, act like a friendly human (like on WhatsApp). Write a short, casual reply (max 2 sentences) asking the user for 1 or 2 of the missing details. Do not ask for everything at once. Be conversational and speed up the process!`;

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
      throw new Error("Failed to get response from Gemini");
    }

    const replyText = data.candidates[0].content.parts[0].text.trim();

    try {
      const cleanJsonStr = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
      if (cleanJsonStr.startsWith('{') && cleanJsonStr.endsWith('}')) {
        const jobData = JSON.parse(cleanJsonStr);
        const requiredKeys = ['title', 'company', 'location', 'type', 'description', 'applyLink'];
        const isValid = requiredKeys.every(key => jobData[key] && jobData[key] !== "null");

        if (isValid) {
          const { getSession } = await import('@/lib/auth');
          const session = await getSession();
          const { ObjectId } = await import('mongodb');

          const client = await clientPromise;
          const db = client.db();
          
          const fullJob = {
            ...jobData,
            date: new Date(),
            createdAt: new Date(),
            source: 'Agent Submission',
            status: 'active',
            founderId: session?.user?.id ? new ObjectId(session.user.id) : null,
          };

          const result = await db.collection('jobs').insertOne(fullJob);
          
          return NextResponse.json({
            isComplete: true,
            job: fullJob,
            jobId: result.insertedId,
            reply: `Awesome! 🎉 I've successfully posted the **${jobData.title}** role at ${jobData.company} on Radar.`
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
    console.error('Job Agent Error:', error);
    return NextResponse.json({ error: 'Agent failed to respond' }, { status: 500 });
  }
}
