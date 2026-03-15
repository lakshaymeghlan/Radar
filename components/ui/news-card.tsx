import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowRight, MessageSquare, Heart, CheckCircle2, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface NewsCardProps {
  id: string;
  toolName: string;
  company: string;
  summary: string;
  link: string;
  date: Date;
  hasComments?: boolean;
  onCommentClick: (id: string, title: string) => void;
  isRadar?: boolean;
  upvotesCount?: number;
  verified?: boolean;
  initialLiked?: boolean;
  onMessageClick?: (id: string, founderId: string) => void;
  founderId?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  id,
  toolName,
  company,
  summary,
  link,
  date,
  hasComments,
  onCommentClick,
  isRadar,
  upvotesCount = 0,
  verified = false,
  initialLiked = false,
  onMessageClick,
  founderId,
}) => {
  const [upvotes, setUpvotes] = React.useState(upvotesCount);
  const [isUpvoted, setIsUpvoted] = React.useState(initialLiked);

  React.useEffect(() => {
    setIsUpvoted(initialLiked);
  }, [initialLiked]);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isRadar) return;

    try {
      const res = await fetch(`/api/radar-startups/${id}/upvote`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setUpvotes(prev => data.upvoted ? prev + 1 : prev - 1);
        setIsUpvoted(data.upvoted);
      }
    } catch (e) {
      console.error("Upvote failed");
    }
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));

  return (
    <Card className="bg-white dark:bg-slate-950 rounded-[32px] border border-slate-100/50 dark:border-slate-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 flex flex-col h-full group overflow-hidden hover:-translate-y-2 border-b-4 hover:border-b-teal-500/20 dark:hover:border-b-emerald-500/10">
      <CardHeader className="pb-4 pt-8 px-8">
        <div className="flex justify-between items-center mb-6">
          <Badge className="bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800 font-black text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full group-hover:bg-teal-50 dark:group-hover:bg-emerald-500/10 group-hover:text-teal-600 dark:group-hover:text-emerald-400 transition-colors duration-500">
            {company}
          </Badge>
          <div className="flex items-center gap-4">
            {isRadar && (
              <button 
                onClick={handleUpvote}
                className={`flex items-center gap-1.5 transition-all duration-500 font-bold text-[10px] uppercase tracking-widest ${
                  isUpvoted 
                    ? 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-3 py-2 rounded-full border border-rose-200 dark:border-rose-500/20' 
                    : 'text-slate-400 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isUpvoted ? 'fill-rose-500' : ''}`} />
                {upvotes > 0 && <span>{upvotes}</span>}
              </button>
            )}
            {isRadar && founderId && onMessageClick && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  onMessageClick(id, founderId);
                }}
                className="p-2 rounded-full text-slate-300 dark:text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all duration-500"
                title="Message Founder"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={(e) => {
                e.preventDefault();
                onCommentClick(id, toolName);
              }}
              className={`relative p-2 rounded-full transition-all duration-500 ${
                hasComments 
                  ? 'text-teal-500 dark:text-emerald-400 bg-teal-50 dark:bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse' 
                  : 'text-slate-300 dark:text-slate-600 hover:text-teal-500 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              {hasComments && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 dark:bg-emerald-400 rounded-full border-2 border-white dark:border-slate-950" />
              )}
            </button>
            <span className="text-[10px] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-widest">{formattedDate}</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-light text-slate-900 dark:text-white tracking-tight leading-[1.25] group-hover:text-teal-700 dark:group-hover:text-emerald-400 transition-colors duration-500 flex items-center gap-2">
          {toolName}
          {verified && (
            <span title="Verified Startup">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow px-8">
        <p className="text-slate-500 dark:text-slate-400 text-[14px] leading-relaxed line-clamp-4 font-light tracking-normal">
          {summary}
        </p>
      </CardContent>
      <CardFooter className="pt-6 pb-10 px-8">
        <Link 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between text-slate-800 dark:text-white text-[11px] font-bold tracking-widest uppercase py-4 px-6 bg-slate-50 dark:bg-slate-900 rounded-2xl group-hover:bg-teal-600 dark:group-hover:bg-emerald-500 group-hover:text-white transition-all duration-700"
        >
          Read More
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
        </Link>
      </CardFooter>
    </Card>
  );
};
