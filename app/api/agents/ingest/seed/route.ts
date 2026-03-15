import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const SEED_TOOLS = [
  {
    name: "Claude Code",
    slug: "claude-code",
    category: "CLI Agent",
    tagline: "An agentic coding assistant that lives in your terminal and understands your entire codebase.",
    what_it_is: "Claude Code is an AI assistant developed by Anthropic that operates directly from your command line. Unlike web-based chatbots, it runs natively on your machine allowing it to read your file system, execute commands, run tests, and refactor code across multiple files simultaneously. It is exceptional for large scale refactoring and understanding legacy codebases.",
    setup_instructions: [
      "npm install -g @anthropic-ai/claude-code",
      "Navigate to your project folder: cd my-project",
      "Run the tool: claude"
    ],
    use_cases: [
      "Automated Code Refactoring across multiple files",
      "Understanding legacy codebases without manual file hopping",
      "Drafting and running test suites automatically"
    ],
    official_url: "https://docs.anthropic.com/en/docs/agents-and-tools/claude-code",
  },
  {
    name: "OpenAI API",
    slug: "openai-api",
    category: "Framework",
    tagline: "The industry standard API for integrating LLMs into your applications.",
    what_it_is: "The OpenAI API provides access to models like GPT-4o, o1, and DALL-E. It allows developers to build intelligence into their applications, handling everything from chat bots to complex reasoning, tool calling, and structured data extraction.",
    setup_instructions: [
      "npm install openai",
      "import OpenAI from 'openai';",
      "const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });",
      "const response = await openai.chat.completions.create({ model: 'gpt-4o', messages: [...] });"
    ],
    use_cases: [
      "Chatbots and conversational interfaces",
      "Data extraction from messy unstructured text",
      "Automating complex reasoning tasks (o1 model)"
    ],
    official_url: "https://platform.openai.com/docs/overview",
  },
  {
    name: "Google Gemini",
    slug: "google-gemini",
    category: "Framework",
    tagline: "Google's incredibly fast, multi-modal AI with a massive context window.",
    what_it_is: "Gemini is Google's flagship AI model. It stands out because of its massive context window (up to millions of tokens), natively multi-modal capabilities (it can understand video, audio, and images natively without OCR bridging), and a very generous free tier for developers.",
    setup_instructions: [
      "npm install @google/generative-ai",
      "import { GoogleGenerativeAI } from '@google/generative-ai';",
      "const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);",
      "const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });"
    ],
    use_cases: [
      "Processing entire codebases or long books in a single prompt",
      "Extracting timestamps and actions directly from video files",
      "Building high-throughput AI features for free (Flash model tier)"
    ],
    official_url: "https://ai.google.dev/docs",
  },
  {
    name: "Cursor",
    slug: "cursor",
    category: "IDE",
    tagline: "The AI-first code editor built as a fork of VS Code.",
    what_it_is: "Cursor is an intelligent IDE that helps you write code faster. It features an AI chat sidebar (Cmd+L), inline code completion (Cmd+K), and the ability to index your whole codebase so the AI knows exactly how your project works. You can easily switch between Claude, GPT-4, and other models.",
    setup_instructions: [
      "Download from cursor.com",
      "Open your project",
      "Use Cmd+K to generate code inline, or Cmd+L to chat with your codebase."
    ],
    use_cases: [
      "Writing boilerplate code instantly",
      "Debugging errors by feeding the terminal output to the AI directly",
      "Asking questions about your codebase (e.g., 'Where is auth handled?')"
    ],
    official_url: "https://cursor.com",
  }
];

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    for (const tool of SEED_TOOLS) {
      const hash = crypto.createHash('sha256').update(tool.slug).digest('hex');
      const doc = {
        ...tool,
        hash,
        createdAt: new Date(),
      };
      
      await db.collection('learn_tools').updateOne(
        { slug: tool.slug },
        { $set: doc },
        { upsert: true }
      );
    }
    
    return NextResponse.json({ success: true, count: SEED_TOOLS.length });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed tools' }, { status: 500 });
  }
}
