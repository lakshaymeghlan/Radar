"use client";

import { Warp } from "@paper-design/shaders-react"

interface WarpShaderHeroProps {
  onModeChange?: (mode: 'updates' | 'startups') => void;
  activeMode?: 'updates' | 'startups';
}

export default function WarpShaderHero({ onModeChange, activeMode = 'updates' }: WarpShaderHeroProps) {
  const scrollToContent = () => {
    document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleModeClick = (mode: 'updates' | 'startups') => {
    if (onModeChange) {
      onModeChange(mode);
      // Small delay to ensure state updates before scrolling
      setTimeout(scrollToContent, 100);
    }
  };

  return (
    <div className="relative min-h-[90vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Warp
          style={{ height: "100%", width: "100%" }}
          proportion={0.45}
          softness={1}
          distortion={0.25}
          swirl={0.8}
          swirlIterations={10}
          shape="checks"
          shapeScale={0.1}
          scale={1}
          rotation={0}
          speed={1}
          colors={["hsl(190, 60%, 92%)", "hsl(175, 40%, 45%)", "hsl(200, 50%, 90%)", "hsl(180, 45%, 85%)"]}
        />
      </div>

      <div className="relative z-10 min-h-[90vh] flex items-center justify-center px-8">
        <div className="max-w-4xl w-full text-center space-y-10">
          <div className="space-y-4">
            <h1 className="text-slate-900 text-6xl md:text-8xl font-sans font-light tracking-tighter text-balance leading-[1.1]">
              AI Launch Radar
            </h1>
            <p className="text-slate-600 text-xl md:text-2xl font-sans font-light leading-relaxed max-w-2xl mx-auto tracking-tight">
              Daily AI tools and updates. <br className="hidden md:block" />
              Clear. Structured. <span className="text-teal-600 font-medium">Noise-free signal</span> for the AI era.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-6">
            <button 
              onClick={() => handleModeClick('updates')}
              className={`group px-10 py-5 rounded-full font-medium transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl ${
                activeMode === 'updates'
                  ? 'bg-slate-900 text-white shadow-slate-900/20'
                  : 'bg-white/40 backdrop-blur-md border border-white/50 text-slate-800 hover:bg-white/60 shadow-slate-200/50'
              }`}
            >
              Explore Updates
              <span className={`inline-block ml-2 transition-transform ${activeMode === 'updates' ? 'translate-y-1' : 'group-hover:translate-y-1'}`}>↓</span>
            </button>
            <button 
              onClick={() => handleModeClick('startups')}
              className={`group px-10 py-5 rounded-full font-medium transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl ${
                activeMode === 'startups'
                  ? 'bg-slate-900 text-white shadow-slate-900/20'
                  : 'bg-white/40 backdrop-blur-md border border-white/50 text-slate-800 hover:bg-white/60 shadow-slate-200/50'
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

