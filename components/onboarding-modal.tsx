"use client";

import React, { useState } from "react";
import { Rocket, Search, Loader2 } from "lucide-react";
import { useAuth } from "./auth-provider";

export const OnboardingModal = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only show if user is logged in but doesn't have a role
  if (!user || user.role) return null;

  const handleSelectRole = async (role: "builder" | "explorer") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user);
      } else {
        setError(data.error || "Failed to save role");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-700">
      <div className="relative w-full max-w-2xl p-12 bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] animate-in zoom-in-95 duration-500 overflow-hidden">
        {/* Design accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 blur-[100px] -ml-32 -mb-32 rounded-full" />

        <div className="relative text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-sans font-light text-slate-900 dark:text-white mb-4 tracking-tighter">
            How do you want to <br />
            <span className="font-serif italic text-emerald-500">use Radar?</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-light text-lg">
            Elevate your journey in the AI-powered ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {/* Builder */}
          <button
            onClick={() => handleSelectRole("builder")}
            disabled={loading}
            className="group relative flex flex-col items-start p-8 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[32px] text-left hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-2xl transition-all duration-700 disabled:opacity-50"
          >
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center mb-6 shadow-sm group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-110 transition-all duration-500">
              <Rocket className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-emerald-500 transition-colors">Builder</h3>
            <p className="text-slate-500 dark:text-slate-400 font-light text-sm leading-relaxed mb-6">
              You create, hire, and launch. Manage your startups and find the best talent.
            </p>
            <div className="mt-auto px-4 py-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Creates • Hires • Launches
            </div>
          </button>

          {/* Explorer */}
          <button
            onClick={() => handleSelectRole("explorer")}
            disabled={loading}
            className="group relative flex flex-col items-start p-8 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[32px] text-left hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-2xl transition-all duration-700 disabled:opacity-50"
          >
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center mb-6 shadow-sm group-hover:bg-teal-500 group-hover:text-white group-hover:scale-110 transition-all duration-500">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-teal-500 transition-colors">Explorer</h3>
            <p className="text-slate-500 dark:text-slate-400 font-light text-sm leading-relaxed mb-6">
              You discover, apply, and learn. Explore startups and connect with founders.
            </p>
            <div className="mt-auto px-4 py-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Discovers • Applies • Learns
            </div>
          </button>
        </div>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-[2px] rounded-[48px]">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
          </div>
        )}

        {error && (
          <p className="mt-8 text-center text-sm font-medium text-rose-500">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
