import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowRight, BriefcaseBusiness, MapPin, MessageCircle, ExternalLink, User } from 'lucide-react';
import Link from 'next/link';
import { useRequireAuth } from '@/lib/hooks/use-require-auth';
import { motion } from 'framer-motion';

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  jobType: string;
  date: Date;
  onMessageClick?: (id: string, founderId: string) => void;
  onApplyClick?: () => void;
  founderId?: string;
}

export const JobCard: React.FC<JobCardProps> = ({
  id,
  title,
  company,
  description,
  location,
  jobType,
  date,
  onMessageClick,
  onApplyClick,
  founderId,
}) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));

  const { requireAuth } = useRequireAuth();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="bg-white dark:bg-slate-950 rounded-[24px] sm:rounded-[32px] border border-slate-100/50 dark:border-slate-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 flex flex-col h-full group overflow-hidden border-b-4 hover:border-b-indigo-500/20 dark:hover:border-b-indigo-500/10">
        <CardHeader className="pb-4 pt-6 sm:pt-8 px-5 sm:px-8">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <Badge className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20 font-black text-[8px] sm:text-[9px] tracking-[0.2em] uppercase px-2 sm:px-3 py-1 sm:py-1.5 rounded-full object-contain shrink-0">
              {jobType}
            </Badge>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {founderId && onMessageClick && (
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault();
                    requireAuth(() => onMessageClick(id, founderId));
                  }}
                  className="p-1.5 sm:p-2 rounded-full text-slate-300 dark:text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all duration-500"
                  title="Message Founder"
                >
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </motion.button>
              )}
              <span className="text-[9px] sm:text-[10px] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-widest hidden sm:inline">{formattedDate}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 mb-2">
            {founderId ? (
              <Link href={`/founders/${founderId}`} className="flex items-center gap-2 group/founder w-fit">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover/founder:text-indigo-500 group-hover/founder:bg-indigo-500/10 transition-all border border-slate-100 dark:border-slate-800">
                  <User className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-indigo-500 transition-colors">
                  {company}
                </span>
              </Link>
            ) : (
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{company}</span>
            )}
            <CardTitle className="text-xl sm:text-2xl font-light text-slate-900 dark:text-white tracking-tight leading-[1.25] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-500 pt-1 sm:pt-0">
              {title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2 text-slate-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="text-[8px] sm:text-[10px] font-medium uppercase tracking-wider">{location}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
            <div className="flex items-center gap-1">
              <BriefcaseBusiness className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="text-[8px] sm:text-[10px] font-medium uppercase tracking-wider whitespace-nowrap">{jobType}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow px-5 sm:px-8 pt-2 sm:pt-4">
          <p className="text-slate-500 dark:text-slate-400 text-[13px] sm:text-[14px] leading-relaxed line-clamp-3 font-light tracking-normal italic">
            "{description.substring(0, 150)}..."
          </p>
        </CardContent>
        <CardFooter className="pt-4 sm:pt-6 pb-6 sm:pb-10 px-5 sm:px-8">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => requireAuth(() => {
              if (onApplyClick) onApplyClick();
              else if (founderId && onMessageClick) onMessageClick(id, founderId);
            })}
            className="w-full flex items-center justify-between text-slate-800 dark:text-white text-[10px] sm:text-[11px] font-bold tracking-widest uppercase py-3 sm:py-4 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900 rounded-xl sm:rounded-2xl group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 group-hover:text-white transition-all duration-700"
          >
            Contact / Apply
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
