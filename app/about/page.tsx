"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rocket, Target, Users, ShieldCheck, Globe, Code2 } from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-40 pb-32">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            The Vision for Radar
          </div>
          <h1 className="text-5xl md:text-7xl font-sans font-light tracking-tighter leading-none mb-8 text-slate-900 dark:text-white">
            We are building the <span className="font-serif italic text-emerald-500 dark:text-glow">Launchpad</span> for AI Builders.
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            The AI landscape is moving too fast for traditional aggregators. Radar is built to be the signal in the noise—a place where real builders find real users.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-emerald-500">
               <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Focus on Signal, Not Hype</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-light">
               We don't just list every tool. We curate real-time updates from frontier sources and provide a platform for verified indie founders to showcase their work without the noise of mass-marketing.
            </p>
          </section>

          <section className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-emerald-500">
               <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Trust & Verification</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-light">
               To prevent scams and low-quality listings, our **Verification System** ensures that every founder on the Radar is a real builder. We check for active development and community credibility.
            </p>
          </section>

          <section className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-emerald-500">
               <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Community Driven hiring</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-light">
               We believe the next big AI breakthroughs will come from small, agile teams. Our integrated job board connects talented individuals with the founders building on the Radar.
            </p>
          </section>

          <section className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-emerald-500">
               <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Built for Developers</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-light">
               Radar is built by developers, for developers. Our goal is to provide the clean, efficient UI that builders need to monitor the pulse of the AI world.
            </p>
          </section>
        </div>
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
           className="mt-40 space-y-16"
        >
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-sans font-light tracking-tighter text-slate-900 dark:text-white mb-6">
              Our <span className="font-serif italic text-emerald-500 dark:text-glow">Future</span> Vision
            </h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full mb-12 opacity-50" />
            <p className="max-w-3xl mx-auto text-lg text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              We started as a simple AI launch tracking tool. Our destination is to become the **Operating System for AI Founders**—providing the infrastructure, funding network, and talent pool required to build the next generation of intelligent software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="p-8 rounded-[40px] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 transition-all duration-500">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-4">Phase 01</span>
                <h4 className="text-xl font-bold mb-3">Network of Intelligence</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                  Expanding our data sources beyond curated lists to include real-time code commits, neural-network architectural changes, and venture capital signals.
                </p>
             </div>
             <div className="p-8 rounded-[40px] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 transition-all duration-500">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-4">Phase 02</span>
                <h4 className="text-xl font-bold mb-3">Founder's CRM</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                  A suite of tools for indie founders to manage early users, collect feedback through the Radar, and track their growth metrics directly on their profiles.
                </p>
             </div>
             <div className="p-8 rounded-[40px] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 transition-all duration-500">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-4">Phase 03</span>
                <h4 className="text-xl font-bold mb-3">Decentralized Venture</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                  Moving towards a model where the Radar community itself can participate in the funding and governance of the most promising AI startups.
                </p>
             </div>
          </div>
        </motion.div>

        <div className="mt-32 p-12 rounded-[50px] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-center">
           <h2 className="text-3xl font-bold mb-6">Want to be part of the future?</h2>
           <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">List your startup on the Radar today and join a community of world-class AI builders.</p>
           <button 
             onClick={() => window.location.href = "/"}
             className="px-8 py-4 bg-slate-900 dark:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 dark:shadow-emerald-500/20 hover:scale-105 transition-all"
           >
             Get Started on Radar
           </button>
        </div>
      </main>
    </div>
  );
}
