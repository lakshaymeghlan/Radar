"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { User, Mail, MapPin, Globe, Loader2, Camera, Save, Rocket, Plus, BriefcaseBusiness, ExternalLink, CheckCircle2, Trash2, ArrowLeft, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JobModal } from "@/components/job-modal";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [myStartups, setMyStartups] = useState<any[]>([]);
  const [likedStartups, setLikedStartups] = useState<any[]>([]);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [receivedApplications, setReceivedApplications] = useState<any[]>([]);
  const [sentApplications, setSentApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedStartupForJob, setSelectedStartupForJob] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'applicants' | 'my-applications'>('content');
  
  // New link state for dynamic fields
  const [tempLinks, setTempLinks] = useState<{ label: string; url: string }[]>([]);
  const [tempProjects, setTempProjects] = useState<{ title: string; url: string; description?: string }[]>([]);

  const fetchData = async () => {
    try {
      const [profileRes, startupsRes, likedRes, jobsRes, receivedRes, sentRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/radar-startups/me"),
        fetch("/api/radar-startups/liked"),
        fetch("/api/jobs/me"),
        fetch("/api/applications?type=received"),
        fetch("/api/applications?type=sent")
      ]);
      
      const profileData = await profileRes.json();
      if (profileData.user) {
        setProfile(profileData.user);
        setTempLinks(profileData.user.links || []);
        setTempProjects(profileData.user.projects || []);
      }

      const startupsData = await startupsRes.json();
      if (startupsData.startups) setMyStartups(startupsData.startups);

      const likedData = await likedRes.json();
      if (likedData.startups) setLikedStartups(likedData.startups);

      const jobsData = await jobsRes.json();
      if (jobsData.jobs) setMyJobs(jobsData.jobs);

      const subResData = await receivedRes.json();
      if (subResData.applications) setReceivedApplications(subResData.applications);

      const sentResData = await sentRes.json();
      if (sentResData.applications) setSentApplications(sentResData.applications);

    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBack = () => {
    // Edge case: if directly landed on the page, history length is 1 or 2
    if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      router.push("/");
    }
  };


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          links: tempLinks,
          projects: tempProjects
        }),
      });

      if (res.ok) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteStartup = async (id: string) => {
    if (!confirm("Are you sure? This will also delete all associated jobs.")) return;
    try {
      const res = await fetch(`/api/radar-startups/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Startup deleted.");
        fetchData();
      } else {
        toast.error("Delete failed.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Job posting deleted.");
        fetchData();
      } else {
        toast.error("Delete failed.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">You need to be logged in to view this page.</h1>
        <p className="text-slate-500 mb-8 max-w-md">Sign in to manage your profile, list startups, and post jobs.</p>
        <Button onClick={() => window.location.href = "/"}>Go Back Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-6 -ml-4 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white gap-2 transition-colors rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/3 flex flex-col gap-8">
            <Card className="overflow-hidden border-slate-200 dark:border-emerald-500/20 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl">
              <div className="h-24 bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-800" />
              <CardContent className="relative pt-12 pb-6 px-6 text-center">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-950 bg-slate-100 dark:bg-slate-900 overflow-hidden shadow-xl">
                  {profile?.image || profile?.avatar ? (
                    <img 
                      src={profile.image || profile.avatar} 
                      alt={profile.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                      <User className="w-10 h-10 text-slate-400" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center gap-4 mt-2">
                  <h2 className="text-2xl font-bold">{profile?.name}</h2>
                  
                  {/* Role Toggle */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-emerald-500/10 shadow-sm">
                    <button 
                      onClick={async () => {
                        // Optimistic update
                        setProfile({ ...profile, role: 'builder' });
                        window.dispatchEvent(new CustomEvent('switch-role', { detail: 'builder' }));
                      }}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        profile?.role === 'builder' ? 'bg-white dark:bg-emerald-500 text-slate-900 dark:text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Builder
                    </button>
                    <button 
                      onClick={async () => {
                        // Optimistic update
                        setProfile({ ...profile, role: 'explorer' });
                        window.dispatchEvent(new CustomEvent('switch-role', { detail: 'explorer' }));
                      }}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        profile?.role === 'explorer' ? 'bg-white dark:bg-emerald-500 text-slate-900 dark:text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Explorer
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-2 ml-1">My Startups</h3>
              <div className="grid grid-cols-1 gap-3">
                {myStartups.length > 0 ? (
                  myStartups.map((startup) => (
                    <div key={startup._id} className="p-4 rounded-2xl border border-slate-200 dark:border-emerald-500/10 bg-white/50 dark:bg-slate-900/40 hover:border-emerald-500/30 transition-all group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 truncate">
                          <h4 className="font-bold text-sm truncate">{startup.name}</h4>
                          {startup.status === 'verified' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                        </div>
                        <div className="flex items-center gap-2">
                           <button 
                             onClick={() => deleteStartup(startup._id)}
                             className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-all p-1"
                           >
                             <Trash2 className="w-3.5 h-3.5" />
                           </button>
                           <Link href={startup.link} target="_blank" className="text-slate-400 hover:text-emerald-500 shrink-0">
                             <ExternalLink className="w-3 h-3" />
                           </Link>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mb-4">{startup.tagline || "Built on Radar"}</p>
                      
                      <div className="flex flex-col gap-2">
                        <Button 
                          onClick={() => {
                            setSelectedStartupForJob(startup._id);
                            setIsJobModalOpen(true);
                          }}
                          size="sm" 
                          variant="outline" 
                          className="w-full text-[10px] h-9 gap-2 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl"
                        >
                          <BriefcaseBusiness className="w-3 h-3" /> List a Job
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4">No startups listed yet.</p>
                )}
                <Button 
                  onClick={() => window.location.href = "/"}
                  variant="outline" 
                  className="w-full justify-start gap-2 border-dashed border-2 hover:border-emerald-500 hover:text-emerald-500 transition-all mt-4 rounded-2xl h-12"
                >
                  <Plus className="w-4 h-4" /> List New Startup
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-2 ml-1 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Liked Startups
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {likedStartups.length > 0 ? (
                  likedStartups.map((startup) => (
                    <div key={startup._id} className="p-4 rounded-2xl border border-slate-200 dark:border-rose-500/10 bg-white/50 dark:bg-slate-900/40 hover:border-rose-500/30 transition-all group">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm truncate">{startup.name}</h4>
                        <Link href={startup.link} target="_blank" className="text-slate-400 hover:text-emerald-500 shrink-0">
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{startup.tagline || "Built on Radar"}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4">No liked startups yet.</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-2 ml-1">My Job Postings</h3>
              <div className="grid grid-cols-1 gap-3">
                {myJobs.length > 0 ? (
                  myJobs.map((job) => (
                    <div key={job._id} className="p-4 rounded-2xl border border-slate-200 dark:border-emerald-500/5 bg-white/30 dark:bg-slate-900/20 hover:border-emerald-500/20 transition-all group">
                       <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-[12px]">{job.title}</h4>
                          <button 
                            onClick={() => deleteJob(job._id)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-all"
                          >
                             <Trash2 className="w-3.5 h-3.5" />
                          </button>
                       </div>
                       <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <Badge variant="secondary" className="px-1.5 py-0 rounded-md text-[8px] bg-slate-100 dark:bg-slate-800">{job.type}</Badge>
                          <span>{job.location}</span>
                       </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4">No job postings listed yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:w-2/3">
             <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8 p-1 sm:p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl w-full sm:w-fit border border-slate-200 dark:border-slate-800 shadow-sm">
               <button
                 onClick={() => setActiveTab('content')}
                 className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all ${
                   activeTab === 'content'
                     ? 'bg-white dark:bg-emerald-500 text-slate-900 dark:text-white shadow-md sm:shadow-xl'
                     : 'text-slate-500 hover:text-slate-900 dark:hover:text-emerald-400'
                 }`}
               >
                 Profile & Content
               </button>
               {profile?.role === 'builder' && (
                 <button
                   onClick={() => setActiveTab('applicants')}
                   className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all ${
                     activeTab === 'applicants'
                       ? 'bg-white dark:bg-emerald-500 text-slate-900 dark:text-white shadow-md sm:shadow-xl'
                       : 'text-slate-500 hover:text-slate-900 dark:hover:text-emerald-400'
                   }`}
                 >
                   Applicants {receivedApplications.length > 0 && `(${receivedApplications.length})`}
                 </button>
               )}
               {profile?.role === 'explorer' && (
                 <button
                   onClick={() => setActiveTab('my-applications')}
                   className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all ${
                     activeTab === 'my-applications'
                       ? 'bg-white dark:bg-emerald-500 text-slate-900 dark:text-white shadow-md sm:shadow-xl'
                       : 'text-slate-500 hover:text-slate-900 dark:hover:text-emerald-400'
                   }`}
                 >
                   My Applications {sentApplications.length > 0 && `(${sentApplications.length})`}
                 </button>
               )}
             </div>

             {activeTab === 'content' ? (
               <Card className="border-slate-200 dark:border-emerald-500/20 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl mb-8">
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                   <div>
                     <CardTitle className="text-2xl font-bold tracking-tight">Profile Details</CardTitle>
                     <CardDescription>Update your personal information.</CardDescription>
                   </div>
                   <Button 
                     onClick={() => setIsEditing(!isEditing)} 
                     variant={isEditing ? "ghost" : "outline"}
                     className="rounded-xl"
                   >
                     {isEditing ? "Cancel" : "Edit Profile"}
                   </Button>
                 </CardHeader>
                <CardContent>
                  <form id="profile-form" onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                        <Input 
                          disabled={!isEditing}
                          value={profile?.name || ""}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className="bg-slate-50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Tagline</label>
                        <Input 
                          disabled={!isEditing}
                          placeholder="e.g. Building the future of AI"
                          value={profile?.tagline || ""}
                          onChange={(e) => setProfile({...profile, tagline: e.target.value})}
                          className="bg-slate-50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                        {profile?.role === 'explorer' ? 'About My Intent' : 'Background Summary'}
                      </label>
                      <Textarea 
                        disabled={!isEditing}
                        placeholder={profile?.role === 'explorer' ? "What kind of opportunities are you looking for? What's your vision?" : "Your experience, background, and what drives you..."}
                        value={profile?.bio || ""}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        className="min-h-[120px] bg-slate-50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800 rounded-xl"
                      />
                    </div>

                    {/* Role-Specific Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                      {profile?.role === 'builder' ? (
                        <>
                          <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Identity Tags</label>
                            <div className="flex flex-wrap gap-2">
                              {['Early Stage Founder', 'Experienced Founder', 'First-Time Builder', 'Open to Advisory'].map(tag => (
                                <button
                                  key={tag}
                                  type="button"
                                  disabled={!isEditing}
                                  onClick={() => {
                                    const currentTags = profile?.identityTags || [];
                                    if (currentTags.includes(tag)) {
                                      setProfile({...profile, identityTags: currentTags.filter((t: string) => t !== tag)});
                                    } else {
                                      setProfile({...profile, identityTags: [...currentTags, tag]});
                                    }
                                  }}
                                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                                    profile?.identityTags?.includes(tag)
                                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                      : 'bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                  } ${!isEditing && 'opacity-60 cursor-default'}`}
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Education</label>
                            <Input 
                              disabled={!isEditing}
                              placeholder="Where did you study?"
                              value={profile?.education || ""}
                              onChange={(e) => setProfile({...profile, education: e.target.value})}
                              className="bg-slate-50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800 rounded-xl"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Current Status</label>
                            <select
                              disabled={!isEditing}
                              value={profile?.status || ""}
                              onChange={(e) => setProfile({...profile, status: e.target.value})}
                              className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-60"
                            >
                              <option value="">Select Status</option>
                              <option value="student">Student</option>
                              <option value="professional">Working Professional</option>
                              <option value="looking">Actively Looking</option>
                            </select>
                          </div>
                          <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Achievements</label>
                            <Input 
                              disabled={!isEditing}
                              placeholder="Top achievements or skills..."
                              value={profile?.achievements || ""}
                              onChange={(e) => setProfile({...profile, achievements: e.target.value})}
                              className="bg-slate-50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800 rounded-xl"
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Dynamic Links Section */}
                    <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">External Identity Links</label>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => setTempLinks([...tempLinks, { label: "", url: "" }])}
                            className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Link
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {tempLinks.map((link, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input 
                              disabled={!isEditing}
                              placeholder="Label"
                              value={link.label}
                              onChange={(e) => {
                                const newLinks = [...tempLinks];
                                newLinks[idx].label = e.target.value;
                                setTempLinks(newLinks);
                              }}
                              className="w-1/3 bg-slate-50 dark:bg-slate-950/50 rounded-xl"
                            />
                            <Input 
                              disabled={!isEditing}
                              placeholder="URL"
                              value={link.url}
                              onChange={(e) => {
                                const newLinks = [...tempLinks];
                                newLinks[idx].url = e.target.value;
                                setTempLinks(newLinks);
                              }}
                              className="flex-1 bg-slate-50 dark:bg-slate-950/50 rounded-xl"
                            />
                            {isEditing && (
                              <button 
                                type="button" 
                                onClick={() => setTempLinks(tempLinks.filter((_, i) => i !== idx))}
                                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Projects Section */}
                    <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Highlight Projects</label>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => setTempProjects([...tempProjects, { title: "", url: "" }])}
                            className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Project
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {tempProjects.map((proj, idx) => (
                          <div key={idx} className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                            <div className="flex gap-2">
                              <Input 
                                disabled={!isEditing}
                                placeholder="Project Title"
                                value={proj.title}
                                onChange={(e) => {
                                  const newProjs = [...tempProjects];
                                  newProjs[idx].title = e.target.value;
                                  setTempProjects(newProjs);
                                }}
                                className="flex-1 bg-white dark:bg-slate-950 rounded-xl"
                              />
                              {isEditing && (
                                <button 
                                  type="button" 
                                  onClick={() => setTempProjects(tempProjects.filter((_, i) => i !== idx))}
                                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <Input 
                              disabled={!isEditing}
                              placeholder="Project URL"
                              value={proj.url}
                              onChange={(e) => {
                                const newProjs = [...tempProjects];
                                newProjs[idx].url = e.target.value;
                                setTempProjects(newProjs);
                              }}
                              className="bg-white dark:bg-slate-950 rounded-xl"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input 
                            disabled={!isEditing}
                            placeholder="City, Country"
                            value={profile?.location || ""}
                            onChange={(e) => setProfile({...profile, location: e.target.value})}
                            className="pl-10 bg-slate-50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800 rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Main Website</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input 
                            disabled={!isEditing}
                            placeholder="https://yourwebsite.com"
                            value={profile?.socials?.website || ""}
                            onChange={(e) => setProfile({...profile, socials: {...(profile.socials || {}), website: e.target.value}})}
                            className="pl-10 bg-slate-50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <CardFooter className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-6">
                        <Button 
                          type="submit" 
                          form="profile-form" 
                          disabled={isSaving}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                          Save Changes
                        </Button>
                      </CardFooter>
                    </motion.div>
                  )}
                </AnimatePresence>
             </Card>
             ) : (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="mb-8">
                   <h2 className="text-3xl font-sans font-light tracking-tight mb-2">Applicants</h2>
                   <p className="text-slate-500 dark:text-slate-400">Review builders interested in joining your ventures.</p>
                 </div>
                 
                 {receivedApplications.length > 0 ? (
                   <div className="grid grid-cols-1 gap-6">
                     {receivedApplications.map((app) => (
                       <Card key={app._id} className="overflow-hidden border-slate-200 dark:border-emerald-500/10 bg-white/50 dark:bg-slate-950/40 backdrop-blur-md">
                         <CardHeader className="pb-4">
                           <div className="flex justify-between items-start">
                             <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-lg font-bold text-emerald-500">
                                 {app.applicant.name.charAt(0)}
                               </div>
                               <div>
                                 <h4 className="text-lg font-bold">{app.applicant.name}</h4>
                                 <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Applied for <span className="font-bold">{app.job.title}</span></p>
                               </div>
                             </div>
                             <Badge variant="outline" className="text-[9px] uppercase tracking-widest px-2 py-1 rounded-lg">
                               {new Date(app.createdAt).toLocaleDateString()}
                             </Badge>
                           </div>
                         </CardHeader>
                         <CardContent className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                             <div className="space-y-2">
                               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Future Vision / Intent</p>
                               <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">"{app.vision}"</p>
                             </div>
                             <div className="space-y-2">
                               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Projects</p>
                               <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{app.projects}</p>
                             </div>
                           </div>
                           <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Resume / Profile</p>
                             <Link href={app.resume} target="_blank" className="text-sm text-emerald-600 hover:underline flex items-center gap-2">
                               View Social / Resume Portfolio <ExternalLink className="w-3 h-3" />
                             </Link>
                           </div>
                         </CardContent>
                       </Card>
                     ))}
                   </div>
                 ) : (
                   <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] bg-slate-50/10">
                     <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-4">
                       <BriefcaseBusiness className="w-6 h-6 text-slate-300" />
                     </div>
                     <p className="text-slate-500">No applications received yet.</p>
                   </div>
                 )}
               </div>
             )}
             
             {activeTab === 'my-applications' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8">
                    <h2 className="text-3xl font-sans font-light tracking-tight mb-2">My Applications</h2>
                    <p className="text-slate-500 dark:text-slate-400">Track the status of your applications.</p>
                  </div>

                  {sentApplications.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {sentApplications.map((app) => (
                        <Card key={app._id} className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-bold text-lg">{app.job.title}</h4>
                                <p className="text-sm text-slate-500">{app.job.company}</p>
                              </div>
                              <Badge className="bg-emerald-500/10 text-emerald-600 border-transparent uppercase text-[8px] tracking-widest px-3">
                                {app.status}
                              </Badge>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Your Vision</p>
                               <p className="text-sm text-slate-600 dark:text-slate-400 italic line-clamp-2">"{app.vision}"</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-slate-50/10 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                      <p className="text-slate-500">You haven't applied to any jobs yet.</p>
                    </div>
                  )}
               </div>
             )}
          </div>
        </div>
      </motion.div>

      <JobModal 
        isOpen={isJobModalOpen} 
        onClose={() => {
           setIsJobModalOpen(false);
           fetchData();
        }} 
        startupId={selectedStartupForJob} 
      />
    </div>
  );
}
