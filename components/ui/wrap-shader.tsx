"use client";

import { Warp } from "@paper-design/shaders-react"
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface WarpShaderHeroProps {
  onModeChange?: (mode: 'updates' | 'startups') => void;
  activeMode?: 'updates' | 'startups';
}

export default function WarpShaderHero({ onModeChange, activeMode = 'updates' }: WarpShaderHeroProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const scrollToContent = () => {
    document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleModeClick = (mode: 'updates' | 'startups') => {
    if (onModeChange) {
      onModeChange(mode);
      setTimeout(scrollToContent, 100);
    }
  };

  // RADAR VOID COLORS - Gray/White on Black for Dark Mode
  const colors = mounted && resolvedTheme === 'dark' 
    ? ["#020617", "#1e293b", "#334155", "#020617"]
    : ["#f8fdfc", "#86ddd3ff", "#ccfbf1", "#f0fdfa"];

  return (
    <div className="relative min-h-[90vh] w-full overflow-hidden transition-colors duration-700 bg-background">
      <div className="absolute inset-0">
        <Warp
          style={{ height: "100%", width: "100%" }}
          proportion={0.4}
          softness={0.9}
          distortion={0.3}
          swirl={1.2}
          swirlIterations={12}
          shape="checks"
          shapeScale={0.08}
          scale={1}
          rotation={0}
          speed={1}
          colors={colors}
        />
        {/* Dark Mode Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background dark:to-background" />
      </div>

      <div className="relative z-10 min-h-[90vh] flex items-center justify-center px-8">
        <div className="max-w-4xl w-full text-center space-y-12">
          <div className="space-y-6">
            <h1 className="text-foreground dark:text-white text-6xl md:text-9xl font-sans font-light tracking-tighter text-balance leading-none animate-in fade-in slide-in-from-top-4 duration-1000 dark:text-glow">
              AI Launch Radar
            </h1>
            <p className="text-muted-foreground dark:text-gray-300 text-xl md:text-2xl font-sans font-light leading-relaxed max-w-3xl mx-auto tracking-tight">
              Tracking the frontier of <span className="text-slate-900 dark:text-white font-medium">Artificial Intelligence</span> and <span className="text-slate-900 dark:text-white font-medium">Startup launches</span>. <br className="hidden md:block" />
              Clear. Structured. <span className="text-primary dark:text-emerald-400 font-medium font-serif italic dark:text-glow">High-signal intelligence</span> for the next era.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-8">
            <button 
              onClick={() => handleModeClick('updates')}
              className={`group relative overflow-hidden px-12 py-6 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl ${
                activeMode === 'updates'
                  ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 shadow-slate-900/20 dark:shadow-emerald-500/40'
                  : 'bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-emerald-500/20 text-slate-900 dark:text-white hover:bg-white/60 dark:hover:bg-slate-800/80 shadow-black/5'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative flex items-center justify-center gap-3 font-semibold">
                Explore AI Updates
                <span className={`transition-transform duration-500 ${activeMode === 'updates' ? 'translate-y-1' : 'group-hover:translate-y-1'}`}>↓</span>
              </span>
            </button>

            <button 
              onClick={() => handleModeClick('startups')}
              className={`group relative overflow-hidden px-12 py-6 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl ${
                activeMode === 'startups'
                  ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 shadow-slate-900/20 dark:shadow-emerald-500/40'
                  : 'bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-emerald-500/20 text-slate-900 dark:text-white hover:bg-white/60 dark:hover:bg-slate-800/80 shadow-black/5'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative flex items-center justify-center gap-3 font-semibold">
                Explore Startups
                <span className={`transition-transform duration-500 ${activeMode === 'startups' ? 'translate-y-1' : 'group-hover:translate-y-1'}`}>↓</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
