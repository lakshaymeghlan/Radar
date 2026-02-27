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
    <Card className="bg-white rounded-[32px] border border-slate-100/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 flex flex-col h-full group overflow-hidden hover:-translate-y-2 border-b-4 hover:border-b-teal-500/20">
      <CardHeader className="pb-4 pt-8 px-8">
        <div className="flex justify-between items-center mb-6">
          <Badge className="bg-slate-50 text-slate-400 border-slate-100 font-black text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors duration-500">
            {company}
          </Badge>
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{formattedDate}</span>
        </div>
        <CardTitle className="text-2xl font-light text-slate-900 tracking-tight leading-[1.25] group-hover:text-teal-700 transition-colors duration-500">
          {toolName}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow px-8">
        <p className="text-slate-500 text-[14px] leading-relaxed line-clamp-4 font-light tracking-normal">
          {summary}
        </p>
      </CardContent>
      <CardFooter className="pt-6 pb-10 px-8">
        <Link 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between text-slate-800 text-[11px] font-bold tracking-widest uppercase py-4 px-6 bg-slate-50 rounded-2xl group-hover:bg-teal-600 group-hover:text-white transition-all duration-700"
        >
          Read More
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
        </Link>
      </CardFooter>
    </Card>
  );
};
