import { getDb } from '@/lib/mongodb';
import { Navbar } from '@/components/navbar';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Terminal, Code, CheckCircle2, ChevronRight } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getToolBySlug(slug: string) {
  const db = await getDb();
  const tool = await db.collection('learn_tools').findOne({ slug });
  
  if (!tool) return null;
  
  return {
    _id: tool._id.toString(),
    name: tool.name || '',
    slug: tool.slug || '',
    category: tool.category || '',
    tagline: tool.tagline || '',
    what_it_is: tool.what_it_is || '',
    setup_instructions: tool.setup_instructions || [],
    use_cases: tool.use_cases || [],
    official_url: tool.official_url || '',
  };
}

export default async function ToolDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background dark:bg-[#020617] text-foreground dark:text-white pb-32">
      <Navbar />

      <div className="pt-32 px-6 max-w-4xl mx-auto">
        <Link href="/learn" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors mb-8 group">
           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Learn AI
        </Link>
        
        {/* Header Record */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
           <div>
             <div className="flex items-center gap-3 mb-3">
               <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                 {tool.category}
               </span>
               <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                 <CheckCircle2 className="w-3 h-3" /> Structurally Enriched
               </span>
             </div>
             <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">{tool.name}</h1>
             <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">{tool.tagline}</p>
           </div>
           
           <a href={tool.official_url} target="_blank" rel="noreferrer" className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 text-sm font-bold shadow-xl shadow-slate-200 dark:shadow-slate-800/50 transition-all">
              <ExternalLink className="w-4 h-4" /> Official Docs
           </a>
        </div>

        {/* Content Structure */}
        <div className="space-y-12">
            
            {/* What it is */}
            <section className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-sm">
               <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                 What it Actually Does <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-4" />
               </h2>
               <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-loose prose-p:text-slate-700 dark:prose-p:text-slate-300">
                  <p>{tool.what_it_is}</p>
               </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Setup Steps */}
               <section className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-500/20 backdrop-blur-xl rounded-3xl p-8 shadow-sm">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-500 mb-6 flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> Quick Setup
                  </h2>
                  <div className="space-y-4">
                     {tool.setup_instructions.length > 0 ? (
                        tool.setup_instructions.map((step: string, index: number) => (
                           <div key={index} className="flex flex-col gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Step {index + 1}</span>
                              <div className="w-full bg-slate-900 dark:bg-[#0a0a0a] rounded-xl p-4 overflow-x-auto border border-slate-800 shadow-inner group relative">
                                  <code className="text-[13px] text-emerald-400 font-mono select-all block leading-relaxed">{step}</code>
                              </div>
                           </div>
                        ))
                     ) : (
                       <p className="text-sm text-slate-500 italic">No command line setup required.</p>
                     )}
                  </div>
               </section>

               {/* Use Cases */}
               <section className="bg-white/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-sm">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                    <Code className="w-4 h-4" /> Best Use Cases
                  </h2>
                  <ul className="space-y-4">
                     {tool.use_cases.map((useCase: string, index: number) => (
                        <li key={index} className="flex gap-3 text-slate-700 dark:text-slate-300">
                           <ChevronRight className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                           <span className="leading-relaxed">{useCase}</span>
                        </li>
                     ))}
                  </ul>
               </section>
            </div>
            
        </div>
      </div>
    </main>
  );
}
