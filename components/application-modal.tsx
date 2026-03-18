"use client";

import React, { useState, useEffect } from "react";
import { X, Send, Loader2, Sparkles, BookOpen, Link as LinkIcon, Plus, Trash2, Github, Linkedin, Globe } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useAuth } from "./auth-provider";
import { motion, AnimatePresence } from "framer-motion";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  companyName: string;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({ 
  isOpen, 
  onClose, 
  jobId, 
  jobTitle, 
  companyName 
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Structured inputs from profile/autofill
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [customLinks, setCustomLinks] = useState<{ label: string; url: string }[]>([]);
  
  // Contextual questions
  const [interestReason, setInterestReason] = useState("");
  
  // Optional structured checkboxes
  const [preferences, setPreferences] = useState({
    remote: false,
    immediate: false,
    earlyRisk: false
  });

  // Autofill effect
  useEffect(() => {
    if (isOpen && user) {
      setPortfolioUrl(user.socials?.website || "");
      setGithubUrl(user.socials?.github || "");
      setLinkedinUrl(user.socials?.linkedin || "");
      setCustomLinks(user.links || []);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleAddLink = () => {
    setCustomLinks([...customLinks, { label: "", url: "" }]);
  };

  const handleUpdateLink = (index: number, field: "label" | "url", value: string) => {
    const newLinks = [...customLinks];
    newLinks[index][field] = value;
    setCustomLinks(newLinks);
  };

  const handleRemoveLink = (index: number) => {
    setCustomLinks(customLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const applicationData = {
        jobId,
        portfolioUrl,
        githubUrl,
        linkedinUrl,
        customLinks,
        interestReason,
        preferences,
        // legacy compat
        resume: linkedinUrl || portfolioUrl,
        vision: interestReason,
        projects: user?.projects?.map(p => p.title).join(", ") || ""
      };

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Application sent! Contextualizing for the builder...");
        onClose();
      } else {
        toast.error(data.error || "Failed to submit application");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 rounded-t-[32px]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-500">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">High Intent Interaction</span>
            </div>
            <h2 className="text-3xl font-sans font-light text-slate-900 dark:text-white tracking-tight">
              Apply to <span className="font-serif italic text-indigo-500">{jobTitle}</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-10 custom-scrollbar">
          {/* Identity Sources */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Identity Sources ⚡ (Autofilled)</label>
              <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">Smart Sync Active</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  placeholder="Portfolio URL"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                />
              </div>
              <div className="relative">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  placeholder="GitHub URL"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                />
              </div>
              <div className="relative md:col-span-2">
                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  placeholder="LinkedIn URL"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                />
              </div>
            </div>

            {/* Dynamic Custom Links */}
            <div className="space-y-4">
              <AnimatePresence>
                {customLinks.map((link, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={idx} 
                    className="flex gap-2"
                  >
                    <input
                      placeholder="Label (e.g. Behance)"
                      value={link.label}
                      onChange={(e) => handleUpdateLink(idx, "label", e.target.value)}
                      className="w-1/3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                    <input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => handleUpdateLink(idx, "url", e.target.value)}
                      className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                    <button 
                      type="button"
                      onClick={() => handleRemoveLink(idx)}
                      className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button
                type="button"
                onClick={handleAddLink}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500 hover:text-indigo-400 transition-colors ml-1"
              >
                <Plus className="w-4 h-4" /> Add custom link
              </button>
            </div>
          </div>

          {/* Contextual Intent */}
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Why are you interested in joining {companyName}?</label>
            <Textarea
              required
              placeholder="What specifically interests you about their vision? Keep it authentic."
              value={interestReason}
              onChange={(e) => setInterestReason(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-indigo-500 min-h-[140px] resize-none p-5 text-sm leading-relaxed"
            />
          </div>

          {/* Structured Preferences */}
          <div className="space-y-6 bg-slate-50/50 dark:bg-slate-950/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50">
             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Logistics & Fit</label>
             <div className="grid grid-cols-1 gap-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-200 dark:border-slate-700 transition-all checked:bg-indigo-500"
                      checked={preferences.remote}
                      onChange={(e) => setPreferences({...preferences, remote: e.target.checked})}
                    />
                    <div className="pointer-events-none absolute left-1 opacity-0 peer-checked:opacity-100 text-white">
                      <Send className="h-3 w-3" />
                    </div>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">I am looking for a remote-first role</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-200 dark:border-slate-700 transition-all checked:bg-indigo-500"
                      checked={preferences.immediate}
                      onChange={(e) => setPreferences({...preferences, immediate: e.target.checked})}
                    />
                    <div className="pointer-events-none absolute left-1 opacity-1 peer-checked:opacity-100 text-white">
                      <Send className="h-3 w-3 opacity-0 peer-checked:opacity-100" />
                    </div>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">I am available to start immediately</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-200 dark:border-slate-700 transition-all checked:bg-indigo-500"
                      checked={preferences.earlyRisk}
                      onChange={(e) => setPreferences({...preferences, earlyRisk: e.target.checked})}
                    />
                    <div className="pointer-events-none absolute left-1 opacity-0 peer-checked:opacity-100 text-white">
                      <Send className="h-3 w-3" />
                    </div>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Comfortable with high-growth, early-stage risk</span>
                </label>
             </div>
          </div>

          <div className="pt-4 sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-100 dark:border-slate-800 -mx-8 px-8 py-6">
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-7 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-bold rounded-[24px] shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Apply in Content
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
