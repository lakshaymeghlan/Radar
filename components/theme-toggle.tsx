'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative flex h-9 w-16 items-center rounded-full bg-slate-200 p-1 transition-colors duration-500 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
      aria-label="Toggle theme"
    >
      {/* Track Background Textures */}
      <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-tighter opacity-20">
        <Moon className="h-3 w-3" />
        <Sun className="h-3 w-3" />
      </div>

      {/* Sliding Toggle Head */}
      <div
        className={`z-10 flex h-7 w-7 transform items-center justify-center rounded-full bg-white shadow-lg transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          theme === 'dark' ? 'translate-x-7 rotate-[360deg] bg-slate-900' : 'translate-x-0 bg-white'
        }`}
      >
        {theme === 'dark' ? (
          <Moon className="h-4 w-4 text-emerald-400 fill-emerald-400" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500 fill-amber-500" />
        )}
      </div>
      
      {/* Decorative Glow Ring */}
      <div className={`absolute inset-0 rounded-full ring-2 transition-all duration-500 ${
        theme === 'dark' ? 'ring-emerald-500/20' : 'ring-amber-500/10'
      }`} />
    </button>
  );
}
