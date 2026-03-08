"use client";

import React, { useState } from "react";
import { X, Briefcase, DollarSign, MapPin, Type, Loader2, List } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  startupId: string | null;
}

export const JobModal: React.FC<JobModalProps> = ({ isOpen, onClose, startupId }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Full-time");
  const [salaryRange, setSalaryRange] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !startupId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type,
          salaryRange,
          location,
          description,
          startupId,
        }),
      });

      if (res.ok) {
        toast.success("Job posted successfully!");
        onClose();
        // Reset form
        setTitle("");
        setSalaryRange("");
        setLocation("");
        setDescription("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to post job");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
            Post a Job
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Find the right talent for your startup. Detail the role and what you're looking for.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Job Title</label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lead Frontend Engineer"
                  className="pl-12"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Job Type</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:text-white appearance-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Job Description</label>
            <Textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will they do? Responsibilities, Requirements..."
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Salary Range</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  placeholder="e.g. $80k - $120k / yr"
                  className="pl-12"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Remote, SF, NY"
                  className="pl-12"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-slate-900 dark:bg-emerald-500 hover:bg-slate-800 dark:hover:bg-emerald-400 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 dark:shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Job Posting"}
          </Button>
        </form>
      </div>
    </div>
  );
};
