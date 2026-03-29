"use client";

import React, { useState, useRef, useEffect } from "react";
import { BrandLogo } from "./ui/brand-logo";
import { X, Send, Sparkles, Loader2, Bot, User, Rocket, Briefcase, ArrowRight, ExternalLink, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "./auth-provider";
import Link from "next/link";

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
  id: string;
  role: "user" | "agent";
  content: string;
  results?: ResultItem[];
}

export default function AiAssistant() {
  const { user } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"select" | "startup" | "job" | "search">("select");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [finalLink, setFinalLink] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, mode, isOpen]);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setMode("select");
      setMessages([]);
      setInputMessage("");
      setIsComplete(false);
      setFinalLink("");
    }
  }, [isOpen]);

  const selectMode = async (selectedMode: "startup" | "job" | "search") => {
    if (selectedMode === "job") {
       if (!user) {
         toast.error("Please sign in first to post a job.");
         return;
       }
       setCheckingAuth(true);
       try {
         const res = await fetch("/api/radar-startups/me");
         const data = await res.json();
         if (!data.startups || data.startups.length === 0) {
            toast.error("You need to launch a startup first before posting a job!");
            setMode("startup");
            setMessages([
              { id: "init-s1", role: "agent", content: "I noticed you don't have a startup yet! You need to launch one before you can post a job. Let's get your startup launched on Radar first." },
              { id: "init-s2", role: "agent", content: "What are you building? Just chat with me naturally (e.g., 'We built an AI tool to summarize meetings...')" }
            ]);
            setCheckingAuth(false);
            return;
         }
       } catch (e) {
         toast.error("Failed to verify validation");
         setCheckingAuth(false);
         return;
       }
       setCheckingAuth(false);

       setMode("job");
       setMessages([
          { id: "init-j1", role: "agent", content: "Hi! 🏢 Let's get your open role posted." },
          { id: "init-j2", role: "agent", content: "What role are you hiring for? (e.g., 'Looking for a Senior Frontend dev for VidGen. $120k remote.')" }
       ]);
    } else if (selectedMode === "startup") {
       setMode("startup");
       setMessages([
          { id: "init-s1", role: "agent", content: "Hey there! 👋 Let's get your startup launched on Radar." },
          { id: "init-s2", role: "agent", content: "What are you building? Just chat with me naturally." }
       ]);
    } else {
       setMode("search");
       setMessages([
          { id: "init-r1", role: "agent", content: "Welcome to AI Launch Radar. I'm here to help you find startups and news from our registry. How can I help?" }
       ]);
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading || isComplete) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");
    setIsLoading(true);

    const apiRoute = mode === "search" ? "/api/chat" : (mode === "startup" ? "/api/agents/chat/startup" : "/api/agents/chat/job");

    try {
      const payload = mode === "search" ? { message: inputMessage } : { messages: [...messages, newMsg] };
      const response = await fetch(apiRoute, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status === 429) {
        setMessages((prev) => [
          ...prev,
          { 
            id: Date.now().toString() + "-error", 
            role: "agent", 
            content: "Oops! 🚦 I've hit my daily AI processing limit (quota exceeded). \n\nPlease try again tomorrow, or you can launch your startup manually via our submission form." 
          },
        ]);
        return;
      }

      if (data.error) throw new Error(data.error);
      
      if (mode === "search") {
          setMessages((prev) => [
            ...prev,
            { id: Date.now().toString() + "-agent", role: "agent", content: data.message, results: data.results },
          ]);
      } else {
          setMessages((prev) => [
            ...prev,
            { id: Date.now().toString() + "-agent", role: "agent", content: data.reply },
          ]);

          if (data.isComplete) {
            setIsComplete(true);
            setFinalLink(mode === "startup" ? (data.startup?.link || "/") : (data.job?.applyLink || "/"));
            toast.success(mode === "startup" ? "Startup launched successfully!" : "Job posted successfully!");
          }
      }

    } catch (error) {
       toast.error("Failed to connect to agent. Please try again.");
       setMessages((prev) => [
         ...prev,
         { id: Date.now().toString() + "-agent", role: "agent", content: "Oops, my circuits just overloaded. Mind trying that again?" },
       ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[110] flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 flex h-[400px] sm:h-[500px] max-h-[calc(100vh-160px)] w-[320px] sm:w-[380px] flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 shadow-lg text-white">
                   <BrandLogo className="w-10 h-10" textClassName="text-xl" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight uppercase">Builds AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 space-y-6 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/10 p-5 scroll-smooth flex flex-col scrollbar-hide"
            >
              {mode === "select" ? (
                 <div className="flex-1 flex flex-col items-center justify-center -mt-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
                       <h2 className="text-lg font-bold mb-1 text-slate-900 dark:text-white">What do you want to build?</h2>
                       <p className="text-xs text-slate-500 dark:text-slate-400">Choose an action below to start chatting.</p>
                    </motion.div>

                    <div className="flex flex-col gap-3 w-full">
                       <button 
                         onClick={() => selectMode("startup")}
                         className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-500 hover:shadow-md transition-all group w-full text-left"
                       >
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shrink-0">
                             <Rocket className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">Launch a Startup</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">List your product in the directory</p>
                          </div>
                       </button>

                       <button 
                         onClick={() => selectMode("job")}
                         disabled={checkingAuth}
                         className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 hover:shadow-md disabled:opacity-50 transition-all group w-full text-left"
                       >
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all shrink-0">
                             {checkingAuth ? <Loader2 className="w-5 h-5 animate-spin" /> : <Briefcase className="w-5 h-5" />}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">Post a Job</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">Hire talent for your startup</p>
                          </div>
                       </button>
                       
                       <button 
                         onClick={() => selectMode("search")}
                         className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all group w-full text-left"
                       >
                          <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all shrink-0">
                             <Search className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">Ask Radar AI</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">Search the database for AI news and startups</p>
                          </div>
                       </button>
                    </div>
                 </div>
              ) : (
                  <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                      <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                      {msg.role === "agent" && (
                          <BrandLogo className="w-6 h-6 rounded-lg mb-1" textClassName="text-[12px]" />
                      )}
                      <div 
                          className={`max-w-[85%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                              msg.role === "user" 
                              ? "bg-slate-900 text-white rounded-br-none dark:bg-slate-100 dark:text-slate-900" 
                              : "bg-white text-slate-800 border border-slate-100 rounded-bl-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                          }`}
                      >
                          <span dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </div>
                      
                      {msg.results && msg.results.length > 0 && (
                        <div className="mt-3 flex w-full flex-col gap-2 relative left-0 z-10">
                          {msg.results.map((res, ridx) => (
                            <a 
                              key={ridx}
                              href={res.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="group flex flex-col gap-1 rounded-[1.2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 transition-all hover:border-indigo-400 hover:shadow-md w-[85%] max-w-sm mb-1 ml-9"
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${res.type === 'news' ? 'text-blue-500' : 'text-emerald-500'}`}>
                                  {res.type}
                                </span>
                                <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                              </div>
                              <h4 className="line-clamp-1 text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors tracking-tight mt-1">{res.title}</h4>
                              <p className="line-clamp-2 text-[11px] text-slate-500 leading-relaxed italic mt-0.5">{res.content}</p>
                            </a>
                          ))}
                        </div>
                      )}
                      
                      </motion.div>
                  ))}
                  
                  {isLoading && (
                      <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-end gap-2 justify-start"
                      >
                          <BrandLogo className="w-6 h-6 rounded-lg mb-1" textClassName="text-[12px]" />
                          <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-white border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                             <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                          </div>
                      </motion.div>
                  )}
                  </AnimatePresence>
              )}

              {isComplete && (
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="mt-6 flex justify-center pb-2"
                 >
                   <a href={finalLink.startsWith('http') ? finalLink : `https://${finalLink}`} target="_blank" rel="noreferrer">
                     <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold py-3 px-6 rounded-full shadow-lg shadow-indigo-500/20 group transition-all">
                        {mode === "startup" ? "Visit Startup Site" : "View Job Details"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </button>
                   </a>
                 </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className={`border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 p-4 transition-opacity ${mode === "select" ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  disabled={isLoading || isComplete || mode === "select"}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={mode === "select" ? "Select an option..." : isComplete ? "Chat finished!" : "Chat here..."}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 pr-12 text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-all focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-50"
                  autoFocus={mode !== "select"}
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputMessage.trim() || isLoading || isComplete || mode === "select"}
                  className={`absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                    inputMessage.trim() && !isLoading && !isComplete
                      ? 'bg-indigo-500 text-white hover:opacity-90 shadow-md transform scale-100' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 transform scale-95'
                  }`}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 ml-0.5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex h-14 w-14 items-center justify-center shadow-xl transition-all duration-500 hover:scale-110 active:scale-95 z-50 ${
          isOpen 
            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rotate-90 rounded-full' 
            : 'bg-slate-900 text-white rounded-2xl hover:shadow-slate-900/30'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <BrandLogo />
            <Sparkles className="absolute -right-2 -top-2 h-6 w-6 animate-pulse text-yellow-300" />
            
            <div className="absolute right-20 hidden flex-col items-end gap-1 group-hover:flex animate-in fade-in slide-in-from-right-4">
               <div className="whitespace-nowrap rounded-xl bg-slate-900 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white shadow-2xl">
                 Builds AI Assistant
               </div>
            </div>
          </>
        )}
      </button>
    </div>
  );
}
