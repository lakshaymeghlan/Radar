"use client";

import React, { useState, useEffect } from "react";
import { Bell, X, Check, Loader2, MessageSquare, Heart, Briefcase, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error("Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "comment_reply": return <MessageSquare className="w-4 h-4 text-sky-500" />;
      case "startup_voted": return <Heart className="w-4 h-4 text-rose-500" />;
      case "job_posted": return <Briefcase className="w-4 h-4 text-emerald-500" />;
      default: return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-emerald-500 transition-all rounded-full hover:bg-slate-100 dark:hover:bg-slate-900"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950 text-[8px] text-white font-bold flex items-center justify-center">
             {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-80 max-h-[480px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-[200]"
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">Notifications</h3>
              <div className="flex items-center gap-2">
                 <button onClick={markAllAsRead} className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-widest">Mark all as read</button>
                 <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <X className="w-4 h-4" />
                 </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[400px]">
              {isLoading && notifications.length === 0 ? (
                <div className="p-10 flex flex-col items-center justify-center text-slate-400">
                   <Loader2 className="w-6 h-6 animate-spin mb-2" />
                   <p className="text-xs">Scanning signals...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-10 flex flex-col items-center justify-center text-center">
                   <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                      <Bell className="w-5 h-5 text-slate-300" />
                   </div>
                   <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Clear Horizon</p>
                   <p className="text-xs text-slate-400 leading-relaxed">No new notifications detected on your radar.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                  {notifications.map((n) => (
                    <div 
                      key={n._id}
                      onClick={() => markAsRead(n._id)}
                      className={`p-4 flex gap-3 transition-colors cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/50 ${!n.isRead ? "bg-emerald-500/5 dark:bg-emerald-500/[0.03]" : ""}`}
                    >
                      <div className="shrink-0 mt-1">
                         {getIcon(n.type)}
                      </div>
                      <div className="flex-grow">
                        <p className={`text-xs leading-relaxed ${!n.isRead ? "text-slate-900 dark:text-white font-medium" : "text-slate-500 dark:text-slate-400"}`}>
                          {n.message}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      {!n.isRead && (
                         <div className="shrink-0 mt-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                         </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-3 bg-slate-50 dark:bg-slate-800/30 text-center border-t border-slate-100 dark:border-slate-800">
               <button className="text-[10px] font-bold text-slate-400 hover:text-slate-900 dark:hover:text-emerald-500 uppercase tracking-widest transition-colors">See all activity</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
