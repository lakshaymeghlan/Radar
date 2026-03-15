"use client";

import React, { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { useAuth } from "./auth-provider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  startupId?: string;
  jobId?: string;
}

export const MessageModal: React.FC<MessageModalProps> = ({ 
  isOpen, 
  onClose, 
  recipientId, 
  recipientName, 
  startupId, 
  jobId 
}) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId,
          content,
          startupId,
          jobId
        }),
      });

      if (res.ok) {
        toast.success("Message sent successfully!");
        setContent("");
        onClose();
        router.push("/inbox");
      } else {
        toast.error("Failed to send message");
      }
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Message {recipientName}</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black mt-1">Direct Outreach</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Your Message</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Hi! I saw your startup on Radar and would love to connect..."
                className="w-full min-h-[200px] p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[24px] focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-900 dark:text-white transition-all resize-none placeholder:text-slate-400 font-light leading-relaxed"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="flex-[2] px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Send Secret Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
