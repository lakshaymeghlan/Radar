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
    : ["#f8fdfc", "#79d8cdff", "#ccfbf1", "#f0fdfa"];

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
            <p className="text-muted-foreground dark:text-gray-300 text-xl md:text-2xl font-sans font-light leading-relaxed max-w-2xl mx-auto tracking-tight">
              Daily AI tools and updates. <br className="hidden md:block" />
              Clear. Structured. <span className="text-primary dark:text-emerald-400 font-medium font-serif italic dark:text-glow">Noise-free signal</span> for the AI era.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-8">
            <button 
              onClick={() => handleModeClick('updates')}
              className={`group px-12 py-6 rounded-full font-bold uppercase tracking-widest text-[11px] transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl ${
                activeMode === 'updates'
                  ? 'bg-primary text-primary-foreground shadow-primary/20'
                  : 'bg-background/40 dark:bg-slate-900/60 backdrop-blur-xl border border-border text-foreground hover:bg-background/80 shadow-black/10'
              }`}
            >
              Explore Updates
              <span className={`inline-block ml-3 transition-transform ${activeMode === 'updates' ? 'translate-y-1' : 'group-hover:translate-y-1'}`}>↓</span>
            </button>
            <button 
              onClick={() => handleModeClick('startups')}
              className={`group px-10 py-5 rounded-full font-bold uppercase tracking-widest text-[11px] transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl ${
                activeMode === 'startups'
                  ? 'bg-foreground text-background shadow-foreground/10'
                  : 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-foreground/10 text-foreground hover:bg-white/60 shadow-slate-200/20'
              }`}
            >
              Explore Startups
              <span className={`inline-block ml-2 transition-transform ${activeMode === 'startups' ? 'translate-y-1' : 'group-hover:translate-y-1'}`}>↓</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
