"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { User, MapPin, Globe, Loader2, ArrowLeft, ExternalLink, CheckCircle2, Heart, Rocket, Sparkles, MessageSquare, GraduationCap, Github, Linkedin, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { toast } from "sonner";

export default function FounderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFounder = async () => {
      try {
        const id = params.id;
        const res = await fetch(`/api/profile/${id}`);
        const result = await res.json();
        if (result.user) {
          setData(result);
        }
      } catch (err) {
        console.error("Failed to fetch profile");
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchFounder();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 pt-20">
        <h1 className="text-3xl font-bold mb-4">Identity Not Found</h1>
        <p className="text-slate-500 mb-8 max-w-sm font-light">The profile you're looking for doesn't exist or is currently restricted.</p>
        <Button onClick={() => router.push("/")} className="rounded-2xl px-10">Back to Feed</Button>
      </div>
    );
  }

  const { user, startups } = data;
  const isBuilder = user.role === 'builder';

  return (
    <main className="min-h-screen bg-background dark:bg-[#020617] transition-colors duration-700">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-8 -ml-4 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white gap-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar info - 4 columns */}
            <div className="lg:col-span-4 space-y-8">
              <Card className="overflow-hidden border-slate-200 dark:border-emerald-500/10 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl shadow-xl rounded-[48px]">
                <div className="h-32 bg-gradient-to-br from-indigo-500 to-teal-700 dark:from-slate-900/50 dark:to-indigo-950/50" />
                <CardContent className="relative pt-16 pb-8 px-8 text-center">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-[32px] border-8 border-white dark:border-slate-950 bg-slate-100 dark:bg-slate-900 shadow-2xl overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800">
                        <User className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-2 tracking-tight">{user.name}</h1>
                  <p className="text-sm font-medium text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-6">
                    {user.tagline || (isBuilder ? "Visionary Builder" : "Frontier Explorer")}
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    <Badge variant="secondary" className="bg-slate-100 dark:bg-emerald-500/10 text-slate-600 dark:text-emerald-400 border-transparent text-[10px] py-1 px-3">
                      {user.role}
                    </Badge>
                    {user.identityTags?.map((tag: string) => (
                      <Badge key={tag} className="bg-indigo-500/10 text-indigo-600 border-transparent text-[10px] py-1 px-3 uppercase tracking-widest">
                        {tag}
                      </Badge>
                    ))}
                    {user.status && (
                      <Badge variant="outline" className="border-indigo-500/30 text-indigo-600 text-[10px] py-1 px-3 capitalize">
                        {user.status}
                      </Badge>
                    )}
                  </div>
 
                   <div className="grid grid-cols-1 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    {user.location && (
                      <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
                        <MapPin className="w-3.5 h-3.5" />
                        {user.location}
                      </div>
                    )}
                    {user.education && (
                      <div className="flex items-center justify-center gap-2 text-slate-500 text-xs text-center px-4">
                        <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                        {user.education}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Identity Sources Sidebar */}
              <div className="space-y-4 px-6 py-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Identity Sources</label>
                <div className="flex flex-wrap gap-3">
                   {user.socials?.website && (
                     <Link href={user.socials.website} target="_blank" className="p-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-500 transition-all shadow-sm border border-slate-100 dark:border-slate-800">
                        <Globe className="w-5 h-5" />
                     </Link>
                   )}
                   {user.socials?.github && (
                     <Link href={user.socials.github} target="_blank" className="p-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-900 dark:hover:bg-white text-slate-400 hover:text-white transition-all shadow-sm border border-slate-100 dark:border-slate-800">
                        <Github className="w-5 h-5" />
                     </Link>
                   )}
                    {user.socials?.linkedin && (
                     <Link href={user.socials.linkedin} target="_blank" className="p-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-600/10 text-slate-400 hover:text-indigo-600 transition-all shadow-sm border border-slate-100 dark:border-slate-800">
                        <Linkedin className="w-5 h-5" />
                     </Link>
                   )}
                   {user.links?.map((link: any, idx: number) => (
                     <Link key={idx} href={link.url} target="_blank" className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-all shadow-sm border border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest flex-1 min-w-[140px]">
                        <ExternalLink className="w-3.5 h-3.5" /> {link.label}
                     </Link>
                   ))}
                </div>
              </div>
            </div>

            {/* Main Content Area - 8 columns */}
            <div className="lg:col-span-8 space-y-16">
              <section className="space-y-8">
                <div className="flex items-center gap-3 text-indigo-500 mb-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">{isBuilder ? 'The Background' : 'The Mission'}</span>
                </div>
                <h2 className="text-5xl font-sans font-light tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Building the <span className="font-serif italic text-indigo-500">future edge</span> of reality.
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                    {user.bio || "Heads down focused on high-signal creation. Check back for deeper insights soon."}
                  </p>
                </div>
                {user.achievements && (
                  <div className="flex items-start gap-4 p-6 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-[32px] border border-indigo-500/20">
                     <Trophy className="w-6 h-6 text-indigo-500 shrink-0 mt-1" />
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Key Achievements</p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.achievements}</p>
                     </div>
                  </div>
                )}
              </section>

              {/* Projects/Startups Section */}
              <section className="space-y-10">
                <div className="flex items-center gap-3 text-emerald-500 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <Rocket className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">{isBuilder ? 'Active Ventures' : 'Project Portfolio'}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Public Startups (for Builders) */}
                  {startups.map((startup: any) => (
                    <Card key={startup._id} className="group hover:translate-y-[-4px] transition-all duration-500 border-slate-200 dark:border-emerald-500/10 dark:bg-slate-950/30 overflow-hidden rounded-[32px] shadow-sm hover:shadow-xl">
                      <CardContent className="p-8">
                         <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                               <h3 className="font-bold text-xl text-slate-900 dark:text-white">{startup.name}</h3>
                               {startup.status === 'verified' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                            </div>
                            <Link href={startup.link} target="_blank" className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                               <ExternalLink className="w-5 h-5" />
                            </Link>
                         </div>
                         <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-8 leading-relaxed">
                            {startup.description.replace(/<[^>]*>?/gm, '')}
                         </p>
                         <div className="flex flex-wrap gap-2">
                            {startup.tags?.slice(0, 3).map((tag: string) => (
                              <span key={tag} className="text-[9px] font-bold uppercase tracking-widest text-slate-400 py-1.5 px-3 bg-slate-100 dark:bg-slate-900 rounded-xl">
                                {tag}
                              </span>
                            ))}
                         </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Highlight Projects (Personal) */}
                  {user.projects?.map((proj: any, idx: number) => (
                    <Card key={idx} className="group hover:translate-y-[-4px] transition-all duration-500 border-indigo-200 dark:border-indigo-500/10 dark:bg-slate-950/30 overflow-hidden rounded-[32px] shadow-sm hover:shadow-xl">
                      <CardContent className="p-8">
                         <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white capitalize">{proj.title}</h3>
                            <Link href={proj.url} target="_blank" className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                               <ExternalLink className="w-5 h-5" />
                            </Link>
                         </div>
                         <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                            {proj.description || "Experimental development and research into the next intelligence frontier."}
                         </p>
                         <Badge className="bg-indigo-500/5 text-indigo-500 border-indigo-500/20 text-[9px] font-black tracking-widest uppercase py-1 px-3">
                           Experimental Output
                         </Badge>
                      </CardContent>
                    </Card>
                  ))}

                  {startups.length === 0 && (!user.projects || user.projects.length === 0) && (
                    <div className="col-span-full py-16 text-center bg-slate-50 dark:bg-slate-900/40 rounded-[48px] border border-dashed border-slate-200 dark:border-slate-800">
                      <Rocket className="w-10 h-10 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                      <p className="text-slate-400 text-sm font-light">No public ventures or highlight projects listed yet.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Call to Action Bar */}
              <div className="pt-12">
                <Card className="bg-indigo-600 dark:bg-indigo-500 text-white p-12 rounded-[48px] overflow-hidden relative group shadow-2xl shadow-indigo-500/20 border-none">
                  <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="text-center md:text-left">
                      <h3 className="text-3xl font-bold mb-3 tracking-tight">Interested in collaborating?</h3>
                      <p className="text-indigo-100 max-w-sm font-light leading-relaxed">Connect with {user.name.split(' ')[0]} to discuss ventures, roles, or potential contributions.</p>
                    </div>
                    <Button 
                      className="bg-white text-indigo-600 hover:bg-slate-50 rounded-2xl px-12 h-16 uppercase tracking-widest text-xs font-black group-hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
                      onClick={() => {
                        // This should trigger message modal
                        window.dispatchEvent(new CustomEvent("open-auth-modal"));
                        toast.info("Message modal routing active soon.");
                      }}
                    >
                      <MessageSquare className="w-5 h-5 mr-3 mb-0.5" /> Message Now
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
