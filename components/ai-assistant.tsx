'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RadarLogo } from './ui/radar-logo';
import { X, Send, ExternalLink, Sparkles, Loader2 } from 'lucide-react';

interface ResultItem {
  id: string;
  type: 'news' | 'startup';
  title: string;
  subtitle: string;
  content: string;
  link: string;
  date: string;
}

interface Message {
  role: 'user' | 'bot';
  content: string;
  results?: ResultItem[];
  timestamp: Date;
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: "Welcome to AI Launch Radar. I'm here to help you find startups and news from our registry. How can I help?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'bot',
        content: data.message,
        results: data.results,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "I'm having a bit of trouble reaching the registry. Please try again in a moment!",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* 1. CHAT WINDOW - MATCHING LIGHT/TEAL THEME */}
      {isOpen && (
        <div className="mb-4 flex h-[550px] w-[350px] flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl backdrop-blur-xl transition-all duration-300 sm:w-[400px] animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-background/50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground shadow-lg">
                <RadarLogo className="h-6 w-6" color="var(--background)" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground tracking-tight uppercase">Radar Search</h3>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Registry Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 space-y-6 overflow-y-auto bg-secondary/30 p-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border"
          >
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-foreground text-background font-medium' 
                      : 'bg-card text-foreground border border-border/50'
                  }`}
                >
                  {msg.content}
                </div>
                
                {/* RESULTS (Refined Cards) */}
                {msg.results && msg.results.length > 0 && (
                  <div className="mt-4 flex w-full flex-col gap-3">
                    {msg.results.map((res, ridx) => (
                      <a 
                        key={ridx}
                        href={res.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex flex-col gap-1.5 rounded-2xl border border-border/50 bg-card p-4 transition-all hover:border-emerald-500/50 hover:shadow-md hover:translate-y-[-2px]"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${res.type === 'news' ? 'text-blue-500' : 'text-emerald-500'}`}>
                            {res.type}
                          </span>
                          <div className="rounded-full bg-secondary p-1 group-hover:bg-emerald-500/10">
                            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-emerald-500" />
                          </div>
                        </div>
                        <h4 className="line-clamp-1 text-sm font-bold text-foreground group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{res.title}</h4>
                        <p className="line-clamp-2 text-[11px] text-muted-foreground line-height-relaxed italic">{res.content}</p>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading */}
            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm border border-slate-100">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 animate-pulse">Searching Records...</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border bg-background p-5">
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about AI startups or news..."
                className="w-full rounded-2xl border border-border bg-secondary px-5 py-3 pr-14 text-sm text-foreground placeholder-muted-foreground transition-all focus:bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <button 
                onClick={handleSend}
                disabled={!query.trim() || isLoading}
                className={`absolute right-2 flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                  query.trim() && !isLoading 
                    ? 'bg-foreground text-background hover:opacity-90 shadow-md translate-x-0' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CHAT BUBBLE - NOW SOLID BLACK TO MATCH NAVBAR */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl transition-all duration-500 hover:scale-110 active:scale-95 ${
          isOpen 
            ? 'bg-slate-900 text-white rotate-90 rounded-full' 
            : 'bg-slate-900 text-white hover:shadow-emerald-500/20'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <RadarLogo color="white" className="h-7 w-7" />
            <Sparkles className="absolute -right-2 -top-2 h-6 w-6 animate-pulse text-emerald-400" />
            
            {/* Tooltip */}
            <div className="absolute right-20 hidden whitespace-nowrap rounded-xl bg-slate-900 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white shadow-2xl group-hover:block animate-in fade-in slide-in-from-right-4">
              Search Registry
            </div>
          </>
        )}
      </button>
    </div>
  );
}
