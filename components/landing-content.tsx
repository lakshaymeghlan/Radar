"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rocket, Users, Globe, Telescope, Zap, Briefcase, ArrowRight, Search } from "lucide-react";

export const LandingContent: React.FC = () => {
  const handleOpenAuth = () => {
    window.dispatchEvent(new CustomEvent("open-auth-modal"));
  };

  const handleExplore = () => {
    document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Premium Mission & Role Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 sm:py-32 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <span className="text-[#009ED1] font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Our Mission</span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Bridging the gap between <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-[#009ED1]">Ideas and Impact.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 text-lg sm:text-xl font-medium leading-relaxed">
            Whether you're crafting the next big thing or looking to join a mission that matters, Builds is your launchpad for collaborative innovation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto relative z-10">
          {/* Builder Card */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="group relative p-10 rounded-[2.5rem] bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-emerald-500/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Rocket className="w-32 h-32 -rotate-12" />
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-8 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
              <Rocket className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">The Builder</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
              For visionaries turning coffee into code. Launch your MVP, gather feedback, and assemble your dream team in public.
            </p>

            <ul className="space-y-5 mb-10">
              {[
                { icon: <Zap className="w-4 h-4" />, text: "Post your startup to our global directory" },
                { icon: <Users className="w-4 h-4" />, text: "Find your first hires and co-founders" },
                { icon: <Globe className="w-4 h-4" />, text: "Build in public with a supportive community" }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                  <span className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    {item.icon}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>

            <button onClick={handleOpenAuth} className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
              Start Building <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Explorer Card */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ y: -8 }}
            className="group relative p-10 rounded-[2.5rem] bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-blue-500/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Telescope className="w-32 h-32 rotate-12" />
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#009ED1]/10 flex items-center justify-center text-[#009ED1] mb-8 border border-[#009ED1]/20 group-hover:bg-[#009ED1] group-hover:text-white transition-all duration-500">
              <Telescope className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">The Explorer</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
              For talent hunting for the next big challenge. Discover stealth startups and apply to roles before they hit the mainstream.
            </p>

            <ul className="space-y-5 mb-10">
              {[
                { icon: <Search className="w-4 h-4" />, text: "Discover early-stage startups and MVPs" },
                { icon: <Briefcase className="w-4 h-4" />, text: "Apply to exclusive roles before LinkedIn" },
                { icon: <Users className="w-4 h-4" />, text: "Join meaningful teams and build the future" }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                  <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    {item.icon}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>

            <button onClick={handleExplore} className="flex items-center gap-2 text-[#009ED1] font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
              Start Exploring <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
};
