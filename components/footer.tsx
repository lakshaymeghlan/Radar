"use client";

import { useState, useEffect } from 'react';
import { RefreshCw, Check, Clock, Twitter, Linkedin, Github } from 'lucide-react';
import { BrandLogo } from './ui/brand-logo';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export const Footer = () => {
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
      await fetch('/api/fetch-news');
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
    <footer className="relative w-full border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all pt-20 pb-12 overflow-hidden">
      {/* Background Decorative Blob */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <BrandLogo />
              <span className="text-2xl font-black tracking-tighter text-slate-950 dark:text-white">Builds</span>
            </div>
            <p className="max-w-xs text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
              The home for early-stage builders. Bridging the gap between frontier technology and human collaborative innovation.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <Twitter className="w-4 h-4" />, href: "#" },
                { icon: <Linkedin className="w-4 h-4" />, href: "#" },
                { icon: <Github className="w-4 h-4" />, href: "#" }
              ].map((social, i) => (
                <a key={i} href={social.href} className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-[#009ED1] hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-all border border-slate-200 dark:border-slate-800">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Platform Status */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Ecosystem Status</h4>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">Network</span>
                <div className="flex items-center gap-2 text-emerald-500 font-black text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  Operational
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pt-2">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">Data Freshness</span>
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  {lastSync || "Updating..."}
                </div>
              </div>
            </div>
          </div>

          {/* Sync & Action */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Control Center</h4>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className={`group flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${isDone
                  ? 'bg-teal-500 text-white shadow-teal-200 shadow-xl'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-emerald-500/50 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg'
                } disabled:opacity-50`}
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Syncing
                </>
              ) : isDone ? (
                <>
                  <Check className="w-4 h-4" />
                  Updated
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                  Manual Sync
                </>
              )}
            </button>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-widest">v1.2.0-stable build-742</p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-widest">
            <BrandLogo className="w-6 h-6 rounded-lg" textClassName="text-[10px]" />
            <span>by</span>
            <span className="text-slate-900 dark:text-white italic font-serif text-sm ml-1">Lakshay Meghlan</span>
          </div>

          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Feedback</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
