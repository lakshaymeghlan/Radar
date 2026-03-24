"use client";

import React, { useState } from "react";
import { X, Loader2, Github, Linkedin, Chrome } from "lucide-react";
// We'll use signIn from next-auth/react
import { signIn } from "next-auth/react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOAuthLogin = async (provider: string) => {
    setLoadingProvider(provider);
    try {
      await signIn(provider, { callbackUrl: window.location.origin });
    } catch (err) {
      console.error("Failed to sign in:", err);
    } finally {
      // For OAuth providers, the page usually redirects, but we clear state just in case
      setTimeout(() => setLoadingProvider(null), 5000);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md p-10 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 dark:bg-emerald-500 flex items-center justify-center text-white text-3xl mx-auto mb-8 shadow-2xl">
            B
          </div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-none">
            Claim Your Identity
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-light">
            Join the ecosystem of India&apos;s <span className="text-slate-900 dark:text-white font-medium">early-stage builders.</span>
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleOAuthLogin("google")}
            disabled={!!loadingProvider}
            className="w-full py-4 px-6 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm group"
          >
            {loadingProvider === "google" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
            <span className="tracking-wide">Continue with Google</span>
          </button>

          <button
            onClick={() => handleOAuthLogin("linkedin")}
            disabled={!!loadingProvider}
            className="w-full py-4 px-6 bg-[#0077b5] text-white rounded-2xl font-bold flex items-center justify-center gap-4 hover:opacity-90 transition-all shadow-lg shadow-[#0077b5]/10 group"
          >
            {loadingProvider === "linkedin" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform fill-white" />
            )}
            <span className="tracking-wide">Continue with LinkedIn</span>
          </button>

          <button
            onClick={() => handleOAuthLogin("github")}
            disabled={!!loadingProvider}
            className="w-full py-4 px-6 bg-slate-900 dark:border dark:border-slate-800 text-white rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-lg group"
          >
            {loadingProvider === "github" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
            <span className="tracking-wide">Continue with GitHub</span>
          </button>
        </div>

        <p className="mt-12 text-center text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] font-black">
          No password required — join securely.
        </p>
      </div>
    </div>
  );
};
