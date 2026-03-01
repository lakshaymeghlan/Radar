import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface NewsCardProps {
  toolName: string;
  company: string;
  summary: string;
  link: string;
  date: Date;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  toolName,
  company,
  summary,
  link,
  date,
}) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));

  return (
    <Card className="bg-card dark:bg-slate-900/40 rounded-[32px] border border-border/50 shadow-sm hover:shadow-2xl dark:hover:shadow-emerald-500/20 transition-all duration-700 flex flex-col h-full group overflow-hidden hover:-translate-y-2 border-b-4 hover:border-b-primary/20 dark:hover:border-b-emerald-500/50 dark:card-glow">
      <CardHeader className="pb-4 pt-8 px-8">
        <div className="flex justify-between items-center mb-6">
          <Badge className="bg-secondary dark:bg-emerald-500/10 text-muted-foreground dark:text-emerald-400 border-border dark:border-emerald-500/20 font-black text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full group-hover:bg-primary/10 group-hover:text-primary dark:group-hover:text-white transition-colors duration-500">
            {company}
          </Badge>
          <span className="text-[10px] text-muted-foreground/50 dark:text-gray-500 font-bold uppercase tracking-widest">{formattedDate}</span>
        </div>
        <CardTitle className="text-2xl font-light text-foreground dark:text-white tracking-tight leading-[1.25] group-hover:text-primary dark:group-hover:text-emerald-400 transition-colors duration-500 dark:text-glow">
          {toolName}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow px-8">
        <p className="text-muted-foreground dark:text-gray-400 text-[14px] leading-relaxed line-clamp-4 font-light tracking-normal italic dark:not-italic">
          {summary}
        </p>
      </CardContent>
      <CardFooter className="pt-6 pb-10 px-8">
        <Link 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between text-foreground dark:text-white text-[11px] font-bold tracking-widest uppercase py-4 px-6 bg-secondary dark:bg-slate-800 rounded-2xl group-hover:bg-primary dark:group-hover:bg-emerald-500 group-hover:text-primary-foreground dark:group-hover:text-white transition-all duration-700 shadow-sm"
        >
          Read More
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
        </Link>
      </CardFooter>
    </Card>
  );
};
