"use client";

import { Warp } from "@paper-design/shaders-react"
import { useTheme } from "next-themes";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface WarpShaderHeroProps {
  onModeChange?: (mode: 'updates' | 'startups' | 'jobs') => void;
  activeMode?: 'updates' | 'startups' | 'jobs';
  userRole?: string;
}

export default function WarpShaderHero({ onModeChange, activeMode = 'updates', userRole }: WarpShaderHeroProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsInView(window.scrollY < window.innerHeight);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContent = () => {
    document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ORIGINAL RADAR COLORS
  const colors = mounted && resolvedTheme === 'dark' 
    ? ["#020617", "#1e293b", "#334155", "#020617"]
    : ["#f8fdfc", "#86ddd3ff", "#ccfbf1", "#f0fdfa"];

  return (
    <div 
      className="relative min-h-screen w-full overflow-hidden transition-colors duration-700 bg-background gpu-accelerated"
      suppressHydrationWarning
    >
      <div className="absolute inset-0">
        {isInView && (
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
            speed={1} // ALWAYS MOVING
            colors={colors}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background dark:to-background" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-24 sm:pt-32 pb-20 flex flex-col items-center">
        <div className="flex flex-col items-center text-center space-y-8 sm:space-y-12 mb-12 sm:mb-20">
          <div className="space-y-4 sm:space-y-6">
            <span className="inline-block px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {userRole === 'builder' ? 'Founder Dashboard' : 'Join the ecosystem'}
            </span>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-sans font-light text-slate-950 dark:text-white leading-[0.9] tracking-[-0.04em] animate-in fade-in slide-in-from-bottom-8 duration-700">
              {userRole === 'builder' ? (
                <>Scale your <br className="hidden sm:block" /><span className="font-serif italic text-emerald-500 dark:text-glow">next big thing</span></>
              ) : (
                <>The home for <br className="hidden sm:block" /><span className="font-serif italic text-emerald-500 dark:text-glow">early-stage builders</span></>
              )}
            </h1>
            <p className="max-w-2xl text-lg sm:text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-light leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
              {userRole === 'builder' 
                ? "Post your startup. Find your first hires. Manage your growth all in one place."
                : "Post your startup. Find your first hires. Join early-stage teams before everyone else."
              }
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 pt-4 sm:pt-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 w-full sm:w-auto">
            {userRole === 'builder' ? (
              <>
                <button 
                  onClick={() => window.location.href = '/profile#startups'}
                  className="group relative w-full sm:w-auto px-8 sm:px-12 py-5 sm:py-6 rounded-2xl bg-slate-950 dark:bg-emerald-500 text-white dark:text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 shadow-2xl dark:shadow-emerald-500/40"
                >
                  <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center justify-center gap-3 font-semibold">
                    Post your Startup
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
                <button 
                   onClick={() => window.location.href = '/profile#applicants'}
                   className="group w-full sm:w-auto px-8 sm:px-12 py-5 sm:py-6 rounded-2xl border-2 border-slate-200 dark:border-emerald-500/20 text-slate-900 dark:text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] hover:bg-slate-50 dark:hover:bg-emerald-500/10 transition-all hover:border-slate-300 dark:hover:border-emerald-500/40"
                >
                  Manage Hires
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent("open-auth-modal"))}
                  className="group relative w-full sm:w-auto px-8 sm:px-12 py-5 sm:py-6 rounded-2xl bg-slate-950 dark:bg-emerald-500 text-white dark:text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 shadow-2xl dark:shadow-emerald-500/40"
                >
                  <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center justify-center gap-3 font-semibold">
                    Claim founder profile
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group w-full sm:w-auto px-8 sm:px-12 py-5 sm:py-6 rounded-2xl border-2 border-slate-200 dark:border-emerald-500/20 text-slate-900 dark:text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] hover:bg-slate-50 dark:hover:bg-emerald-500/10 transition-all hover:border-slate-300 dark:hover:border-emerald-500/40"
                >
                  Start exploring
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
