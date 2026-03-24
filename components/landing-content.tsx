"use client";

import React from "react";

export const LandingContent: React.FC = () => {
  const handleOpenAuth = () => {
    window.dispatchEvent(new CustomEvent("open-auth-modal"));
  };

  const handleExplore = () => {
    document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Minimal Role Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-border/50 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-emerald-500/10">
            <h3 className="text-xl font-bold mb-4">Builder</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Post your startup</li>
              <li>• Find your first hires</li>
              <li>• Build in public</li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-emerald-500/5">
            <h3 className="text-xl font-bold mb-4">Explorer</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Discover early startups</li>
              <li>• Apply before LinkedIn</li>
              <li>• Join meaningful teams</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};
