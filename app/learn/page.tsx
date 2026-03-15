import { Navbar } from '@/components/navbar';
import { BookOpen, ExternalLink, Code2, Search, Zap, Rocket, Workflow, Image as ImageIcon, Video, Headset, TrendingUp, Gem } from 'lucide-react';

const CATEGORIES = [
  {
    title: "AI Coding / Developer Tools",
    icon: <Code2 className="w-5 h-5" />,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    tools: [
      { name: "Cursor AI IDE", useCase: "AI pair programmer that edits whole codebases and writes features.", link: "https://cursor.sh" },
      { name: "Antigravity AI", useCase: "Autonomous coding agents that plan, implement, and test code tasks.", link: "https://antigravityai.io" },
      { name: "Continue.dev", useCase: "AI chat inside VS Code for code editing and debugging.", link: "https://continue.dev" },
      { name: "Sweep AI", useCase: "Converts GitHub issues into code automatically.", link: "https://sweep.dev" },
      { name: "Mutable AI", useCase: "Refactor and generate production code.", link: "https://mutable.ai" },
      { name: "Sourcegraph Cody", useCase: "Search and understand huge repositories.", link: "https://sourcegraph.com/cody" },
    ]
  },
  {
    title: "AI Research / Knowledge Tools",
    icon: <Search className="w-5 h-5" />,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    tools: [
      { name: "Perplexity AI", useCase: "AI search with cited answers for research.", link: "https://perplexity.ai" },
      { name: "NotebookLM", useCase: "Summarize documents and create insights from sources.", link: "https://notebooklm.google" },
      { name: "Elicit AI", useCase: "Summarize academic papers quickly.", link: "https://elicit.com" },
      { name: "Scite AI", useCase: "Check whether research papers support or contradict claims.", link: "https://scite.ai" },
    ]
  },
  {
    title: "Productivity AI Tools",
    icon: <Zap className="w-5 h-5" />,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    tools: [
      { name: "Goblin Tools", useCase: "Breaks complex tasks into small steps.", link: "https://goblin.tools" },
      { name: "Reclaim AI", useCase: "Auto-schedule tasks and meetings.", link: "https://reclaim.ai" },
      { name: "Krisp", useCase: "Removes noise and generates meeting transcripts.", link: "https://krisp.ai" },
      { name: "Motion", useCase: "Auto-plans your day using AI.", link: "https://usemotion.com" },
      { name: "Tana", useCase: "Graph-based notes and personal knowledge base.", link: "https://tana.inc" },
      { name: "Mem AI", useCase: "Organizes notes automatically using AI.", link: "https://mem.ai" },
    ]
  },
  {
    title: "AI Startup / Builder Tools",
    icon: <Rocket className="w-5 h-5" />,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    tools: [
      { name: "Durable AI", useCase: "Generate full websites in seconds.", link: "https://durable.co" },
      { name: "Mixo", useCase: "Validate startup ideas quickly.", link: "https://mixo.io" },
      { name: "Typedream", useCase: "Create SaaS websites quickly.", link: "https://typedream.com" },
      { name: "Builder.ai", useCase: "Build apps without coding.", link: "https://builder.ai" },
    ]
  },
  {
    title: "AI Automation Tools",
    icon: <Workflow className="w-5 h-5" />,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    tools: [
      { name: "Zapier AI", useCase: "Automate workflows across apps.", link: "https://zapier.com" },
      { name: "Make", useCase: "Connect apps and automate tasks visually.", link: "https://make.com" },
      { name: "Browse AI", useCase: "Extract data from websites automatically.", link: "https://browse.ai" },
      { name: "Kadoa", useCase: "Scrape data using natural language prompts.", link: "https://kadoa.com" },
    ]
  },
  {
    title: "AI Image / Design Tools",
    icon: <ImageIcon className="w-5 h-5" />,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    tools: [
      { name: "Clipdrop", useCase: "Remove backgrounds and objects from images.", link: "https://clipdrop.co" },
      { name: "Cleanup Pictures", useCase: "Remove objects from photos easily.", link: "https://cleanup.pictures" },
      { name: "Ideogram AI", useCase: "Create images with accurate text.", link: "https://ideogram.ai" },
      { name: "Leonardo AI", useCase: "Generate game assets and illustrations.", link: "https://leonardo.ai" },
      { name: "Kittl AI", useCase: "Create logos and social graphics.", link: "https://kittl.com" },
    ]
  },
  {
    title: "AI Video / Audio Tools",
    icon: <Video className="w-5 h-5" />,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    tools: [
      { name: "Runway ML", useCase: "Text-to-video and advanced editing tools.", link: "https://runwayml.com" },
      { name: "Pika AI", useCase: "Generate cinematic AI clips.", link: "https://pika.art" },
      { name: "Descript", useCase: "Edit videos by editing text transcripts.", link: "https://descript.com" },
      { name: "ElevenLabs", useCase: "Realistic voice synthesis.", link: "https://elevenlabs.io" },
      { name: "Soundraw", useCase: "Generate royalty-free music.", link: "https://soundraw.io" },
    ]
  },
  {
    title: "AI Learning / Personal Tools",
    icon: <Headset className="w-5 h-5" />,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    tools: [
      { name: "LangoTalk", useCase: "Practice speaking languages with AI.", link: "https://langotalk.org" },
      { name: "TalkBerry", useCase: "Practice job interviews with AI avatars.", link: "https://talkberry.ai" },
      { name: "Rewind AI", useCase: "Search everything you've seen on your computer.", link: "https://rewind.ai" },
    ]
  },
  {
    title: "AI Marketing / Business Tools",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    tools: [
      { name: "QuickReply AI", useCase: "Automate Shopify and WhatsApp support.", link: "https://quickreply.ai" },
      { name: "Tome AI", useCase: "Generate pitch decks from prompts.", link: "https://tome.app" },
      { name: "ChatSlide", useCase: "Turn ideas into slides automatically.", link: "https://chatslide.ai" },
    ]
  },
  {
    title: "More Hidden Gems",
    icon: <Gem className="w-5 h-5" />,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    tools: [
      { name: "Podwise", link: "https://podwise.xyz" },
      { name: "Read AI", link: "https://read.ai" },
      { name: "Taskade AI", link: "https://taskade.com" },
      { name: "Proactor AI", link: "https://proactor.ai" },
      { name: "Vozo AI", link: "https://vozo.ai" },
      { name: "Makeform AI", link: "https://makeform.ai" },
      { name: "JobRight AI", link: "https://jobright.ai" },
      { name: "Crevas AI", link: "https://crevas.ai" },
      { name: "MyFlourish AI", link: "https://myflourish.ai" },
      { name: "Tactiq", link: "https://tactiq.io" },
    ]
  }
];

export default function LearnAIPage() {
  return (
    <main className="min-h-screen bg-background dark:bg-[#020617] text-foreground dark:text-white pb-32">
      <Navbar />

      <div className="pt-32 px-6 max-w-5xl mx-auto">
        <div className="mb-16 flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 border border-indigo-500/20">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
            The AI Learning Hub
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            A curated list of the absolute best AI tools, platforms, and products available right now. 
            Level up your productivity, coding, and workflow.
          </p>
        </div>

        <div className="flex flex-col gap-12 w-full">
          {CATEGORIES.map((category, idx) => (
            <div key={idx} className="flex flex-col space-y-6">
               <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                 <div className={`w-10 h-10 rounded-xl ${category.bg} flex items-center justify-center ${category.color} shrink-0`}>
                   {category.icon}
                 </div>
                 <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                   {category.title}
                 </h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                 {category.tools.map((tool, toolIdx) => (
                    <a 
                      key={toolIdx} 
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full hover:border-[#22c55e]/50 hover:shadow-lg transition-all"
                    >
                       <div>
                          <div className="flex items-start justify-between mb-2">
                             <h3 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-[#22c55e] transition-colors">{tool.name}</h3>
                             <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-[#22c55e]/10 group-hover:text-[#22c55e] transition-colors shrink-0">
                               <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#22c55e]" />
                             </div>
                          </div>
                          {tool.useCase && (
                             <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                {tool.useCase}
                             </p>
                          )}
                       </div>
                       <span className="text-xs font-medium text-slate-400 group-hover:text-[#22c55e] transition-colors mt-auto truncate">
                         {tool.link.replace('https://', '')}
                       </span>
                    </a>
                 ))}
               </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
