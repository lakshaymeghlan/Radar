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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedStartupForJob, setSelectedStartupForJob] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [profileRes, startupsRes, likedRes, jobsRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/radar-startups/me"),
        fetch("/api/radar-startups/liked"),
        fetch("/api/jobs/me")
      ]);
      
      const profileData = await profileRes.json();
      if (profileData.user) setProfile(profileData.user);

      const startupsData = await startupsRes.json();
      if (startupsData.startups) setMyStartups(startupsData.startups);

      const likedData = await likedRes.json();
      if (likedData.startups) setLikedStartups(likedData.startups);

      const jobsData = await jobsRes.json();
      if (jobsData.jobs) setMyJobs(jobsData.jobs);

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
        body: JSON.stringify(profile),
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
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                      <User className="w-10 h-10 text-slate-400" />
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-1">{profile?.name}</h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <p className="text-sm text-slate-500 dark:text-emerald-500/70 font-medium uppercase tracking-wider">
                    {profile?.tagline || "Early Stage Founder"}
                  </p>
                  {myStartups.length > 0 && (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[8px] px-2 py-0.5">Verified Founder</Badge>
                  )}
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
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                        <Input 
                          disabled={!isEditing}
                          value={profile?.name || ""}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Tagline</label>
                        <Input 
                          disabled={!isEditing}
                          placeholder="e.g. Building the future of AI"
                          value={profile?.tagline || ""}
                          onChange={(e) => setProfile({...profile, tagline: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Bio</label>
                      <Textarea 
                        disabled={!isEditing}
                        placeholder="Tell the community about yourself..."
                        value={profile?.bio || ""}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        className="min-h-[120px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input 
                            disabled={!isEditing}
                            placeholder="City, Country"
                            value={profile?.location || ""}
                            onChange={(e) => setProfile({...profile, location: e.target.value})}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Website</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input 
                            disabled={!isEditing}
                            placeholder="https://yourwebsite.com"
                            value={profile?.socials?.website || ""}
                            onChange={(e) => setProfile({...profile, socials: {...(profile.socials || {}), website: e.target.value}})}
                            className="pl-10"
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
