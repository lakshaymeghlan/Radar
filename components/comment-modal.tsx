"use client";

import React, { useState, useEffect } from "react";
import { X, Send, Loader2, MessageSquare, Trash2, Edit2, Check, RotateCcw } from "lucide-react";
import { useAuth } from "./auth-provider";

interface Comment {
  _id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetTitle: string;
}

export const CommentModal: React.FC<CommentModalProps> = ({ isOpen, onClose, targetId, targetTitle }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && targetId) {
      fetchComments();
    }
  }, [isOpen, targetId]);

  const fetchComments = async () => {
    setFetching(true);
    try {
      const res = await fetch(`/api/comments?targetId=${targetId}`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId, content: newComment }),
      });

      if (res.ok) {
        const addedComment = await res.json();
        setComments([addedComment, ...comments]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });

      if (res.ok) {
        setComments(comments.filter(c => c._id !== commentId));
      }
    } catch (err) {
      console.error("Failed to delete comment");
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  const handleUpdate = async (commentId: string) => {
    if (!editContent.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, content: editContent }),
      });

      if (res.ok) {
        setComments(comments.map(c => 
          c._id === commentId ? { ...c, content: editContent, updatedAt: new Date().toISOString() } : c
        ));
        setEditingId(null);
      }
    } catch (err) {
      console.error("Failed to update comment");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{targetTitle}</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Discussions</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {fetching ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="w-8 h-8 text-slate-200 dark:text-slate-700 animate-spin" />
              <p className="text-sm text-slate-400 font-medium">Loading conversation...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-slate-200 dark:text-slate-700" />
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-bold">No comments yet</p>
                <p className="text-sm text-slate-500 mt-1">Be the first to share your thoughts!</p>
              </div>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="group animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold shrink-0">
                    {comment.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{comment.userName}</span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(comment.createdAt).toLocaleDateString()}
                          {comment.updatedAt && " (edited)"}
                        </span>
                      </div>
                      
                      {user && user.id === comment.userId && editingId !== comment._id && (
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => startEdit(comment)}
                            className="p-1.5 text-slate-400 hover:text-teal-500 dark:hover:text-emerald-400 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(comment._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {editingId === comment._id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm text-slate-900 dark:text-white min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(comment._id)}
                            className="px-4 py-2 bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-2"
                          >
                            <Check className="w-3 h-3" /> Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold flex items-center gap-2"
                          >
                            <RotateCcw className="w-3 h-3" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800/50">
                        {comment.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800">
          {user ? (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-emerald-500 transition-all outline-none text-slate-900 dark:text-white text-sm"
              />
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="px-6 py-3 bg-slate-900 dark:bg-emerald-500 hover:bg-slate-800 dark:hover:bg-emerald-400 text-white font-bold rounded-2xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center shrink-0"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
              <p className="text-sm text-slate-500">
                Please <span className="font-bold text-slate-900 dark:text-white">Sign In</span> to join the discussion.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
