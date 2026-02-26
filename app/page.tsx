import { Navbar } from '@/components/navbar';
import WarpShaderHero from '@/components/ui/wrap-shader';
import { NewsFeed, NewsItem } from '@/components/news-feed';
import { getDb } from '@/lib/mongodb';
import { ArrowDown, Cpu, Sparkles, Globe } from 'lucide-react';
import Link from 'next/link';

async function getNews(): Promise<NewsItem[]> {
  try {
    const db = await getDb();
    const news = await db.collection('news')
      .find({})
      .sort({ date: -1 })
      .limit(100)
      .toArray();
    
    return news.map(item => ({
      _id: item._id.toString(),
      toolName: item.toolName || '',
      company: item.company || '',
      summary: item.summary || '',
      link: item.link || '',
      date: item.date instanceof Date ? item.date.toISOString() : new Date(item.date).toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [];
  }
}

export default async function Home() {
  const news = await getNews();

  return (
    <main className="min-h-screen bg-white selection:bg-teal-100 selection:text-teal-900">
      <Navbar />
      
      {/* Hero Section */}
      <WarpShaderHero />

      {/* Glass Divider */}
      <div className="flex justify-center -mt-20 mb-20 relative z-20">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 animate-bounce cursor-pointer hover:scale-110 transition-transform duration-500">
          <ArrowDown className="w-6 h-6 text-teal-600" />
        </div>
      </div>

      <NewsFeed initialNews={news} />

      {/* Premium Stats/About Section */}
      <section className="max-w-7xl mx-auto px-6 py-32 border-t border-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          <div className="space-y-4">
            <Cpu className="w-8 h-8 text-teal-600" />
            <h3 className="text-xl font-light text-slate-900 tracking-tight">Real-time Intelligence</h3>
            <p className="text-slate-500 text-sm font-light leading-relaxed">Automated signal detection across 12+ industry leading AI research laboratories.</p>
          </div>
          <div className="space-y-4">
            <Sparkles className="w-8 h-8 text-teal-600" />
            <h3 className="text-xl font-light text-slate-900 tracking-tight">Structured Signal</h3>
            <p className="text-slate-500 text-sm font-light leading-relaxed">We strip away the marketing fluff to show you the functional architecture of what was launched.</p>
          </div>
          <div className="space-y-4">
            <Globe className="w-8 h-8 text-teal-600" />
            <h3 className="text-xl font-light text-slate-900 tracking-tight">Global Reach</h3>
            <p className="text-slate-500 text-sm font-light leading-relaxed">Tracking launches from San Francisco to Paris, ensuring nothing escapes the radar.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-32 bg-slate-50/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="mb-12">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">
              R
            </div>
            <span className="text-slate-900 font-bold text-3xl tracking-tighter">Radar</span>
          </div>
          
          <p className="text-slate-400 text-lg font-light max-w-xl mb-16 leading-relaxed">
            A premium, editorial-style intelligence platform tracking the rapid evolution of artificial intelligence.
          </p>

          <div className="flex flex-col items-center gap-10">
            <div className="flex gap-12 text-[11px] text-slate-400 uppercase tracking-[0.3em] font-black items-center">
              <a href="#" className="hover:text-teal-600 transition-colors">Twitter</a>
              <a href="#" className="hover:text-teal-600 transition-colors">Newsletter</a>
              <Link href="/startups" className="px-5 py-2 bg-slate-900 text-white rounded-full hover:bg-teal-600 transition-all duration-500 shadow-lg shadow-slate-200">
                Explore Startups
              </Link>
            </div>

            <div className="pt-12 border-t border-slate-200 w-full max-w-lg">
              <p className="text-slate-400 text-sm font-light tracking-tight">
                Crafted with engineering excellence by <br />
                <span className="text-slate-900 font-serif italic text-xl mt-2 inline-block">Lakshay meghlan</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
