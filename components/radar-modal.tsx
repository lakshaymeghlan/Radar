"use client";

import React, { useState } from "react";
import { X, Rocket, Link as LinkIcon, Tag, Type, Loader2, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

interface RadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RadarModal: React.FC<RadarModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/radar-startups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          tagline,
          description,
          link,
          tags: tags.split(",").map(t => t.trim()).filter(t => t),
        }),
      });

      if (res.ok) {
        toast.success("Startup listed on Radar!");
        onSuccess();
        onClose();
        // Reset form
        setName("");
        setTagline("");
        setDescription("");
        setLink("");
        setTags("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to list startup");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
            <Rocket className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight border-glow">
            List your Startup
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Showcase your project to the Radar community and find early adopters.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Startup Name</label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme AI"
                  className="pl-12"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">One-liner / Tagline</label>
              <div className="relative">
                <Rocket className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. GPT-4 for spreadsheets"
                  className="pl-12"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Full Description</label>
            <Textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does your startup do? Who is it for?"
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Website URL</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  required
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://acme.ai"
                  className="pl-12"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Tags (comma separated)</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="AI, SaaS, B2H"
                  className="pl-12"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-slate-900 dark:bg-emerald-500 hover:bg-slate-800 dark:hover:bg-emerald-400 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 dark:shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish to Radar"}
          </Button>
        </form>
      </div>
    </div>
  );
};
