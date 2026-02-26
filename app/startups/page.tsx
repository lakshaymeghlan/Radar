import { Navbar } from '@/components/navbar';
import { getDb } from '@/lib/mongodb';
import { Rocket, ExternalLink, Globe, Calendar } from 'lucide-react';
import Link from 'next/link';

async function getStartups() {
  try {
    const db = await getDb();
    const startups = await db.collection('startups')
      .find({})
      .sort({ date: -1 })
      .limit(60)
      .toArray();
    
    return startups.map(s => ({
      ...s,
      _id: s._id.toString(),
      date: s.date.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch startups:', error);
    return [];
  }
}

export default async function StartupsPage() {
  const startups = await getStartups();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Premium Hero */}
      <section className="pt-40 pb-20 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm animate-bounce">
              <Rocket className="w-4 h-4 text-teal-600" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500">2025 Launch Radar</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-light text-slate-900 tracking-tighter leading-none">
              Upcoming <span className="font-serif italic text-teal-700">Startups</span>
            </h1>
            <p className="max-w-2xl text-slate-400 text-lg font-light leading-relaxed">
              Curated snapshot of the most promising ventures emerging from YC, BetaList, and the global ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Startup Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        {startups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {startups.map((startup: any) => (
              <div 
                key={startup._id} 
                className="group p-8 rounded-[40px] bg-white border border-slate-100 hover:border-teal-500/20 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-2 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 rounded-3xl bg-slate-50 group-hover:bg-teal-50 transition-colors duration-500">
                    <Globe className="w-5 h-5 text-slate-400 group-hover:text-teal-600" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(startup.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-light text-slate-900 mb-4 tracking-tight group-hover:text-teal-700 transition-colors">
                  {startup.name}
                </h3>
                
                <p className="text-slate-400 text-sm font-light leading-relaxed flex-grow line-clamp-4 mb-8">
                  {startup.description.replace(/<[^>]*>?/gm, '')}
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{startup.source}</span>
                  <Link 
                    href={startup.link} 
                    target="_blank"
                    className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-teal-600 transition-all duration-500 shadow-xl shadow-slate-900/10"
                  >
                    Explore <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-slate-50/30 rounded-[60px] border border-dashed border-slate-200">
            <p className="text-slate-400 font-light">The startup radar is warming up. Try updating the radar above.</p>
          </div>
        )}
      </section>
      
      {/* Footer Branding */}
      <footer className="py-20 text-center border-t border-slate-50 bg-slate-50/20">
        <p className="text-slate-400 text-sm font-light">
          Visionary mapping by <span className="text-slate-900 font-serif italic text-lg">Lakshay meghlan</span>
        </p>
      </footer>
    </main>
  );
}
