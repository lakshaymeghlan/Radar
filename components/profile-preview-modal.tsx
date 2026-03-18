"use client";

import React from "react";
import { X, User, MapPin, Globe, Github, Linkedin, ExternalLink, Sparkles, Rocket, GraduationCap, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { Button } from "./ui/button";

interface ProfilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export const ProfilePreviewModal: React.FC<ProfilePreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  user 
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-950 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header/Cover */}
        <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-slate-900 dark:to-indigo-950/50 shrink-0" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative px-8 pb-8 pt-16 overflow-y-auto custom-scrollbar">
          {/* Avatar Area */}
          <div className="absolute -top-12 left-8 w-24 h-24 rounded-3xl border-4 border-white dark:border-slate-950 bg-slate-100 dark:bg-slate-900 shadow-xl overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800">
                <User className="w-10 h-10 text-slate-300" />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
               <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
               <p className="text-sm text-indigo-500 font-medium tracking-tight h-5">
                 {user.tagline || (user.role === 'builder' ? "Founder & Builder" : "Frontier Explorer")}
               </p>
               <div className="flex flex-wrap gap-2 pt-2">
                  <Badge className={`${user.role === 'builder' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-teal-500/10 text-teal-600'} border-transparent text-[8px] px-2 py-0.5 uppercase tracking-widest`}>
                    {user.role}
                  </Badge>
                  {user.identityTags?.map((tag: string) => (
                    <Badge key={tag} className="bg-indigo-500/10 text-indigo-600 border-transparent text-[8px] px-2 py-0.5 uppercase tracking-widest">
                      {tag}
                    </Badge>
                  ))}
               </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
               <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
                 "{user.bio || "No description provided yet. Focused on building high-signal intelligence."}"
               </p>
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-2 gap-4">
               {user.education && (
                 <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 truncate">{user.education}</span>
                 </div>
               )}
               {user.status && (
                 <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <Rocket className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 truncate capitalize">{user.status}</span>
                 </div>
               )}
            </div>

            {/* Key Links */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Identity Sources</label>
              <div className="flex flex-wrap gap-2">
                {user.socials?.website && (
                  <Link href={user.socials.website} target="_blank" className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-500 transition-all">
                    <Globe className="w-4 h-4" />
                  </Link>
                )}
                {user.socials?.github && (
                  <Link href={user.socials.github} target="_blank" className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-900 dark:hover:bg-white text-slate-400 hover:text-white transition-all">
                    <Github className="w-4 h-4" />
                  </Link>
                )}
                {user.socials?.linkedin && (
                  <Link href={user.socials.linkedin} target="_blank" className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-600/10 text-slate-400 hover:text-indigo-600 transition-all">
                    <Linkedin className="w-4 h-4" />
                  </Link>
                )}
                {user.links?.map((link: any, idx: number) => (
                  <Link key={idx} href={link.url} target="_blank" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-500 transition-all text-[10px] font-bold uppercase tracking-wider">
                    <LinkIcon className="w-3 h-3" /> {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Highlight Projects */}
            {user.projects && user.projects.length > 0 && (
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Notable Projects</label>
                <div className="space-y-3">
                   {user.projects.slice(0, 2).map((proj: any, idx: number) => (
                     <div key={idx} className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{proj.title}</h4>
                          <Link href={proj.url} target="_blank" className="text-slate-400 hover:text-indigo-500">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        {proj.description && <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{proj.description}</p>}
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 dark:border-slate-800 shrink-0">
           <Link href={`/profile/${user._id || user.id}`} className="w-full">
             <Button className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all">
               View Full Identity Page
             </Button>
           </Link>
        </div>
      </motion.div>
    </div>
  );
};

const LinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);
