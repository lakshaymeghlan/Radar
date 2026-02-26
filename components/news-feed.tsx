"use client";

import { useState, useMemo } from 'react';
import { NewsCard } from '@/components/ui/news-card';
import { Sparkles, LayoutGrid, Plus, Cpu, Code2, Rocket } from 'lucide-react';

export interface NewsItem {
  _id: string;
  toolName: string;
  company: string;
  summary: string;
  link: string;
  date: string;
}

interface NewsFeedProps {
  initialNews: NewsItem[];
}

const CATEGORIES = [
  'All', 
  'Claude', 
  'OpenAI', 
  'Google AI', 
  'Meta AI', 
  'LangChain', 
  'GitHub',
  'TechCrunch',
  'DeepMind',
  'Hugging Face'
];

export function NewsFeed({ initialNews }: NewsFeedProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [displayCount, setDisplayCount] = useState(20);

  const filteredNews = useMemo(() => {
    let news = initialNews;
    
    if (activeCategory !== 'All') {
      news = initialNews.filter((item) => {
        if (activeCategory === 'Claude') {
          return item.company === 'Claude' || item.company === 'Anthropic';
        }
        return item.company === activeCategory;
      });
    }
    
    return news;
  }, [activeCategory, initialNews]);

  const displayedNews = useMemo(() => {
    return filteredNews.slice(0, displayCount);
  }, [filteredNews, displayCount]);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 20);
  };

  return (
    <section id="updates" className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col space-y-16 mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-teal-600">
              <div className="p-2 bg-teal-50 rounded-xl">
                <Rocket className="w-4 h-4" />
              </div>
              <span className="text-[12px] font-black tracking-[0.3em] uppercase">Evolution Stream</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-sans font-light text-slate-900 tracking-tighter leading-none">
              Daily <span className="font-serif italic text-teal-700">Intelligence</span> Log
            </h2>
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-slate-400">
                <Code2 className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-widest">Coding</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-200" />
              <div className="flex items-center gap-2 text-slate-400">
                <Cpu className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-widest">Agents</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-200" />
              <div className="flex items-center gap-2 text-slate-400">
                <Rocket className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-widest">Launches</span>
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-sm font-light max-w-xs md:text-right leading-relaxed border-l-2 border-slate-50 pl-6 md:border-l-0 md:pl-0">
            A real-time signal tracker covering the last 7 days of agentic AI, coding assistants, and frontier tech.
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="w-full">
          <div className="flex flex-wrap gap-3 items-center justify-start py-2 border-y border-slate-50">
            <div className="flex items-center gap-2 mr-6 text-slate-400">
              <LayoutGrid className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Signal Source:</span>
            </div>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setDisplayCount(20);
                }}
                className={`px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-700 border ${
                  activeCategory === category
                    ? 'bg-slate-900 text-white border-slate-900 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)] scale-105'
                    : 'bg-white text-slate-400 border-slate-100/50 hover:border-slate-300 hover:text-slate-800 hover:bg-slate-50/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-[400px] flex flex-col items-center">
        {displayedNews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full mb-24">
              {displayedNews.map((item) => (
                <div key={item._id} className="animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
                  <NewsCard
                    toolName={item.toolName}
                    company={item.company === 'Anthropic' ? 'Claude' : item.company}
                    summary={item.summary}
                    link={item.link}
                    date={new Date(item.date)}
                  />
                </div>
              ))}
            </div>
            
            {displayCount < filteredNews.length && (
              <button 
                onClick={handleLoadMore}
                className="group flex items-center gap-4 px-12 py-6 bg-slate-900 border border-slate-800 rounded-full text-white text-xs font-black tracking-[0.2em] uppercase hover:bg-teal-600 hover:border-teal-500 transition-all duration-700 shadow-2xl shadow-slate-900/30"
              >
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-180" />
                Scan More Signals
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 rounded-[60px] border border-dashed border-slate-200 bg-slate-50/20 w-full">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-8">
              <Sparkles className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-light text-xl mb-8">
              No recent signals detected for <span className="text-slate-900 font-medium">{activeCategory}</span>.
            </p>
            <button 
              onClick={() => setActiveCategory('All')}
              className="px-8 py-3 bg-white border border-slate-200 rounded-full text-slate-900 text-xs font-bold tracking-widest uppercase hover:border-teal-500 hover:text-teal-600 transition-all duration-700 shadow-sm"
            >
              Reset Radar
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
