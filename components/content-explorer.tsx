"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { NewsCard } from '@/components/ui/news-card';
import { Sparkles, LayoutGrid, Plus, Cpu, Code2, Rocket, ArrowRight, BriefcaseBusiness } from 'lucide-react';
import WarpShaderHero from '@/components/ui/wrap-shader';
import { CommentModal } from './comment-modal';
import { RadarModal } from './radar-modal';
import { MessageModal } from './message-modal';
import { useAuth } from './auth-provider';
import { JobCard } from './ui/job-card';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-require-auth';
import { ApplicationModal } from './application-modal';
import { motion, AnimatePresence } from 'framer-motion';

export interface NewsItem {
// ... existing ...
  _id: string;
  toolName: string;
  company: string;
  summary: string;
  link: string;
  date: string;
}

export interface StartupItem {
  _id: string;
  name: string;
  description: string;
  link: string;
  source: string;
  tags?: string[];
  date: string;
  isLiked?: boolean;
}

interface ContentExplorerProps {
  initialNews: NewsItem[];
  initialStartups: StartupItem[];
  children?: React.ReactNode;
}

const UPDATES_CATEGORIES = [
  'All', 
  'Claude', 
  'OpenAI', 
  'Google AI', 
  'Meta AI', 
  'LangChain', 
  'GitHub',
  'TechCrunch',
  'DeepMind',
  'Hugging Face'
];

const STARTUP_CATEGORIES = [
  'All',
  'AI',
  'Blockchain',
  'Web3',
  'SaaS',
  'Tech',
  'Fintech',
  'DevTools',
  'Consumer',
  'Ecommerce'
];

const JOB_CATEGORIES = ['All', 'Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];

function ContentExplorerContent({ initialNews, initialStartups, children }: ContentExplorerProps) {
  const { user } = useAuth();
  const { requireAuth } = useRequireAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramMode = searchParams.get('mode') as 'updates' | 'startups' | 'jobs' | null;

  const [mode, setMode] = useState<'updates' | 'startups' | 'jobs'>('updates');
  const [startupSubMode, setStartupSubMode] = useState<'curated' | 'radar'>('radar');

  useEffect(() => {
    if (paramMode && ['updates', 'startups', 'jobs'].includes(paramMode)) {
      setMode(paramMode);
    } else if (!user) {
      setMode('startups');
    } else if (user.role === 'explorer') {
      setMode('jobs');
    } else if (user.role === 'builder') {
      setMode('startups');
    }
  }, [user, paramMode]);
  const [radarStartups, setRadarStartups] = useState<StartupItem[]>([]);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [displayCount, setDisplayCount] = useState(20);
  const [selectedItem, setSelectedItem] = useState<{ id: string; title: string } | null>(null);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [isLoadingRadar, setIsLoadingRadar] = useState(false);
  const [isRadarModalOpen, setIsRadarModalOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<{ id: string; name: string } | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<{ id: string; title: string; company: string } | null>(null);

  const handleApplyClick = (jobId: string, jobTitle: string, company: string) => {
    setSelectedJob({ id: jobId, title: jobTitle, company: company });
    setIsApplicationModalOpen(true);
  };

  const handleMessageClick = (targetId: string, founderId: string) => {
    // We need to find the founder's name. For simplicity if we don't have it, we show "Founder"
    // In a real app we'd fetch or pass the name
    setSelectedRecipient({ id: founderId, name: "Founder" });
  };

  const fetchRadar = async () => {
    setIsLoadingRadar(true);
    try {
      const res = await fetch("/api/radar-startups");
      const data = await res.json();
      if (data.startups) {
        setRadarStartups(data.startups.map((s: any) => ({
          ...s,
          _id: s._id.toString(),
          founderId: s.founderId?.toString(), // Ensure founderId is a string
          date: s.createdAt,
          source: 'Radar community'
        })));
      }
    } catch (err) {
      console.error("Failed to fetch radar startups");
    } finally {
      setIsLoadingRadar(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (data.jobs) {
        setAllJobs(data.jobs);
      }
    } catch (err) {
      console.error("Failed to fetch jobs");
    }
  };

  useEffect(() => {
    if (mode === 'startups' && startupSubMode === 'radar') {
      fetchRadar();
    }
    if (mode === 'jobs') {
      fetchJobs();
    }
  }, [mode, startupSubMode]);

  const filteredNews = useMemo(() => {
    let news = initialNews;
    if (activeCategory !== 'All') {
      news = initialNews.filter((item) => {
        if (activeCategory === 'Claude') {
          return item.company === 'Claude' || item.company === 'Anthropic';
        }
        return item.company === activeCategory;
      });
    }
    return news;
  }, [activeCategory, initialNews]);

  const filteredCuratedStartups = useMemo(() => {
    let startups = initialStartups;
    if (activeCategory !== 'All') {
      startups = initialStartups.filter((item) => {
        return item.tags?.includes(activeCategory);
      });
    }
    return startups;
  }, [activeCategory, initialStartups]);

  const filteredRadarStartups = useMemo(() => {
    let startups = radarStartups;
    if (activeCategory !== 'All') {
      startups = radarStartups.filter((item) => {
        return item.tags?.includes(activeCategory);
      });
    }
    return startups;
  }, [activeCategory, radarStartups]);

  const filteredJobs = useMemo(() => {
    let jobs = allJobs;
    if (activeCategory !== 'All') {
      // Jobs don't have categories in same way, but we can match type or title
      jobs = allJobs.filter((item) => {
        return item.type?.includes(activeCategory) || item.title?.includes(activeCategory);
      });
    }
    return jobs;
  }, [activeCategory, allJobs]);

  const displayedContent = useMemo(() => {
    if (mode === 'updates') {
      return filteredNews.slice(0, displayCount).map(item => ({
        id: item._id,
        title: item.toolName,
        subtitle: item.company === 'Anthropic' ? 'Claude' : item.company,
        description: item.summary,
        link: item.link,
        date: new Date(item.date),
        type: 'update'
      }));
    } else if (mode === 'startups') {
      const source = startupSubMode === 'curated' ? filteredCuratedStartups : filteredRadarStartups;
      return source.slice(0, displayCount).map(item => ({
        id: item._id,
        title: item.name,
        subtitle: item.source,
        description: item.description.replace(/<[^>]*>?/gm, ''),
        link: item.link,
        date: new Date(item.date),
        type: 'startup',
        isRadar: startupSubMode === 'radar',
        upvotesCount: (item as any).upvotes || 0,
        verified: (item as any).status === 'verified',
        isLiked: item.isLiked || false,
        founderId: (item as any).founderId
      }));
    } else {
      return filteredJobs.slice(0, displayCount).map(item => ({
        id: item._id,
        title: item.title,
        subtitle: item.company || "Stealth Startup",
        description: item.description,
        link: item.applyLink || "#",
        date: new Date(item.createdAt),
        type: 'job',
        jobType: item.type,
        location: item.location,
        founderId: item.founderId
      }));
    }
  }, [mode, startupSubMode, filteredNews, filteredCuratedStartups, filteredRadarStartups, filteredJobs, displayCount]);

  useEffect(() => {
    const fetchCounts = async () => {
      const ids = displayedContent.map(item => item.id);
      if (ids.length === 0) return;

      try {
        const res = await fetch("/api/comments/counts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetIds: ids }),
        });
        const data = await res.json();
        setCommentCounts(prev => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Failed to fetch comment counts");
      }
    };
    fetchCounts();
  }, [displayedContent]);

  const handleModeChange = (newMode: 'updates' | 'startups' | 'jobs') => {
    setMode(newMode);
    setStartupSubMode('radar');
    setDisplayCount(20);
    setActiveCategory('All');
    
    // Update URL without refreshing
    const params = new URLSearchParams(searchParams.toString());
    params.set('mode', newMode);
    router.push(`/?${params.toString()}#content-section`, { scroll: false });
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 20);
  };

  const handleCommentClick = (id: string, title: string) => {
    setSelectedItem({ id, title });
  };

  const hasMore = mode === 'updates' 
    ? displayCount < filteredNews.length 
    : mode === 'startups'
      ? displayCount < (startupSubMode === 'curated' ? filteredCuratedStartups.length : filteredRadarStartups.length)
      : displayCount < filteredJobs.length;

  const availableModes = (!user)
    ? ['updates', 'startups'] as const
    : user.role === 'explorer'
      ? ['jobs', 'startups', 'updates'] as const
      : ['startups', 'updates'] as const;

  const currentCategories = mode === 'updates' ? UPDATES_CATEGORIES : (mode === 'startups' ? STARTUP_CATEGORIES : JOB_CATEGORIES);

  return (
    <>
      <WarpShaderHero onModeChange={handleModeChange} activeMode={mode} userRole={user?.role} />

      <motion.section 
        id="content-section" 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24 transition-opacity duration-500"
        suppressHydrationWarning
      >
        <div className="flex flex-col space-y-10 sm:space-y-16 mb-12 sm:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-10">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 text-primary dark:text-emerald-400">
                <div className="p-2 bg-primary/5 dark:bg-emerald-500/10 rounded-lg sm:rounded-xl">
                  {mode === 'updates' ? <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : (mode === 'jobs' ? <BriefcaseBusiness className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />)}
                </div>
                <span className="text-[10px] sm:text-[12px] font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase tracking-widest">
                  {mode === 'updates' ? 'Evolution Stream' : (mode === 'jobs' ? 'Opportunity Flow' : 'Startup Builds')}
                </span>
              </div>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-sans font-light text-slate-950 dark:text-white tracking-tighter leading-[1.1] sm:leading-none animate-in fade-in duration-700">
                {mode === 'updates' ? (
                  <>Recent AI <span className="font-serif italic text-primary dark:text-emerald-400 dark:text-glow">Updates</span></>
                ) : mode === 'jobs' ? (
                  <>Open <span className="font-serif italic text-primary dark:text-emerald-400 dark:text-glow">Roles</span></>
                ) : (
                  <>Recent <span className="font-serif italic text-primary dark:text-emerald-400 dark:text-glow">Startups</span></>
                )}
              </h2>
              
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {availableModes.map((m) => (
                  <button
                    key={m}
                    onClick={() => handleModeChange(m)}
                    className={`relative px-3 sm:px-4 py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all ${
                      mode === m
                        ? 'text-emerald-500'
                        : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="relative z-10">{m}</span>
                    {mode === m && (
                      <motion.div
                        layoutId="activeMode"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
                
                {user?.role === 'builder' && (
                  <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg sm:rounded-xl">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                      {radarStartups.some(s => (s as any).founderId === user?.id) ? `${Math.floor(Math.random() * 50) + 12} views` : "Post startup"}
                    </span>
                  </div>
                )}
              </div>

              {mode === 'startups' && (
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl w-fit border border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => setStartupSubMode('curated')}
                      className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all ${
                        startupSubMode === 'curated'
                          ? 'bg-white dark:bg-emerald-500 text-slate-900 dark:text-white shadow-lg sm:shadow-xl'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-emerald-400'
                      }`}
                    >
                      Curated
                    </button>
                    <button
                      onClick={() => setStartupSubMode('radar')}
                      className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all ${
                        startupSubMode === 'radar'
                          ? 'bg-white dark:bg-emerald-500 text-slate-900 dark:text-white shadow-lg sm:shadow-xl'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-emerald-400'
                      }`}
                    >
                      Community
                    </button>
                  </div>

                  {startupSubMode === 'radar' && (
                    <button
                      onClick={() => requireAuth(() => setIsRadarModalOpen(true))}
                      className="group flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      List Startup
                    </button>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest">Coding</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border hidden sm:block" />
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest">Agents</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border hidden sm:block" />
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest">Launches</span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm font-light max-w-xs md:text-right leading-relaxed border-l-2 border-border pl-4 sm:pl-6 md:border-l-0 md:pl-0">
              {mode === 'updates' 
                ? 'A real-time signal tracker covering the last 7 days of agentic AI, coding assistants, and frontier tech.'
                : startupSubMode === 'curated'
                  ? 'Curated snapshot of the most promising ventures from AI, Blockchain, and Tech ecosystem from the last 2 years.'
                  : 'Startups built by the community. Up-and-coming projects listed by founders themselves on the Radar.'}
            </p>
          </div>
          
          <div className="w-full animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-start py-2 border-y border-border/50">
              <div className="flex items-center gap-2 mr-4 sm:mr-6 text-muted-foreground">
                <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Signal Source:</span>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {currentCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveCategory(category);
                      setDisplayCount(20);
                    }}
                    className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all duration-700 border ${
                      activeCategory === category
                        ? 'bg-foreground dark:bg-primary text-background dark:text-primary-foreground border-foreground dark:border-primary shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)] dark:shadow-emerald-500/40 scale-105 dark:text-glow'
                        : 'bg-background dark:bg-slate-900/40 text-muted-foreground border-border/50 hover:border-border hover:text-foreground hover:bg-secondary/50 transition-colors'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-[400px] flex flex-col items-center">
          <AnimatePresence mode="wait">
            {displayedContent.length > 0 ? (
              <motion.div 
                key={mode + startupSubMode + activeCategory}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { 
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05
                    }
                  },
                  exit: { opacity: 0, transition: { duration: 0.2 } }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full mb-24 transition-all duration-500"
                suppressHydrationWarning
              >
                {displayedContent.map((item) => (
                  <motion.div 
                    key={item.id} 
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
                    }}
                    className="h-full"
                  >
                    {item.type === 'job' ? (
                      <JobCard 
                        id={item.id}
                        title={item.title}
                        company={item.subtitle}
                        description={item.description}
                        location={(item as any).location}
                        jobType={(item as any).jobType}
                        date={item.date}
                        founderId={(item as any).founderId}
                        onMessageClick={handleMessageClick}
                        onApplyClick={() => handleApplyClick(item.id, item.title, item.subtitle)}
                      />
                    ) : (
                      <NewsCard
                        id={item.id}
                        toolName={item.title}
                        company={item.subtitle}
                        summary={item.description}
                        link={item.link}
                        date={item.date}
                        hasComments={(commentCounts[item.id] || 0) > 0}
                        onCommentClick={handleCommentClick}
                        isRadar={(item as any).isRadar}
                        upvotesCount={(item as any).upvotesCount}
                        verified={(item as any).verified}
                        initialLiked={(item as any).isLiked}
                        founderId={(item as any).founderId}
                        onMessageClick={handleMessageClick}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-40 rounded-[60px] border border-dashed border-slate-200 bg-slate-50/20 w-full"
              >
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-8">
                  <Sparkles className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-light text-xl mb-8">
                  No recent signals detected for <span className="text-slate-900 font-medium">{activeCategory}</span>.
                </p>
                <button 
                  onClick={() => setActiveCategory('All')}
                  className="px-8 py-3 bg-white border border-slate-200 rounded-full text-slate-900 text-xs font-bold tracking-widest uppercase hover:border-teal-500 hover:text-teal-600 transition-all duration-700 shadow-sm"
                >
                  Reset Radar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {hasMore && (
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoadMore}
              className="group flex items-center gap-4 px-12 py-6 bg-foreground border border-border rounded-full text-background text-xs font-black tracking-[0.2em] uppercase hover:bg-emerald-500 transition-all duration-700 shadow-2xl shadow-foreground/10 mt-20"
            >
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Plus className="w-4 h-4" />
              </motion.div>
              Scan More Signals
            </motion.button>
          )}
        </div>
      </motion.section>

      {children}

      <RadarModal 
        isOpen={isRadarModalOpen} 
        onClose={() => setIsRadarModalOpen(false)} 
        onSuccess={fetchRadar}
      />

      <CommentModal 
        isOpen={!!selectedItem} 
        onClose={() => {
          setSelectedItem(null);
        }} 
        targetId={selectedItem?.id || ""} 
        targetTitle={selectedItem?.title || ""} 
      />

      <MessageModal 
        isOpen={!!selectedRecipient}
        onClose={() => setSelectedRecipient(null)}
        recipientId={selectedRecipient?.id || ""}
        recipientName={selectedRecipient?.name || ""}
      />

      <ApplicationModal 
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        jobId={selectedJob?.id || ""}
        jobTitle={selectedJob?.title || ""}
        companyName={selectedJob?.company || ""}
      />
    </>
  );
}

export function ContentExplorer(props: ContentExplorerProps) {
  return (
    <Suspense fallback={null}>
      <ContentExplorerContent {...props} />
    </Suspense>
  );
}
