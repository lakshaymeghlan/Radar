import { motion } from "framer-motion";

export const BrandLogo = ({ className = "w-10 h-10", textClassName = "text-xl" }) => {
  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-slate-900 dark:bg-emerald-500 text-white font-black shadow-lg shadow-slate-900/20 dark:shadow-emerald-500/30 ${className}`}>
      <span className={textClassName}>B</span>
      {/* Glossy overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
    </div>
  );
};
