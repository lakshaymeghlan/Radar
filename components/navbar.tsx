"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { RefreshCw, Check, Clock, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setLastSync(new Date().toLocaleTimeString());
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    setIsDone(false);
    try {
      // Sync News
      await fetch('/api/fetch-news');
      // Sync Startups
      await fetch('/api/fetch-startups');
      
      setIsDone(true);
      setLastSync(new Date().toLocaleTimeString());
      setTimeout(() => {
        setIsDone(false);
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <nav className="fixed top-0 z-[100] w-full px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-3 rounded-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)]">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-500">
            R
          </div>
          <span className="text-xl font-bold tracking-tighter text-slate-900">
            Radar
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          {lastSync && (
            <div className="hidden md:flex items-center gap-2 text-slate-400">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Last Sync: {lastSync}</span>
            </div>
          )}
          
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-500 ${
              isDone 
                ? 'bg-teal-500 text-white shadow-teal-200 shadow-lg' 
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200'
            } disabled:opacity-50`}
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                Syncing Systems...
              </>
            ) : isDone ? (
              <>
                <Check className="w-3 h-3" />
                Database Updated
              </>
            ) : (
              <>
                <RefreshCw className="w-3 h-3" />
                Update Radar
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
