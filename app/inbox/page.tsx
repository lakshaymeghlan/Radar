"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import { Loader2, Send, User, MessageSquare, Search, ArrowLeft, MoreVertical, Paperclip, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";
import { ProfilePreviewModal } from "@/components/profile-preview-modal";

export default function InboxPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUser, setPreviewUser] = useState<any>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
      }
    } catch (err) {
      toast.error("Failed to fetch inbox");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    setIsLoadingMessages(true);
    try {
      const res = await fetch(`/api/messages/${convId}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      toast.error("Failed to load messages");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSelectConv = (conv: any) => {
    setSelectedConv(conv);
    fetchMessages(conv._id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv || isSending) return;

    setIsSending(true);
    try {
      const otherUserId = selectedConv.participants.find((id: string) => id !== user?.id);
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: otherUserId,
          content: newMessage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...messages, data.message]);
        setNewMessage("");
        // Refresh conversations to update last message
        fetchConversations();
      }
    } catch (err) {
      toast.error("Failed to send");
    } finally {
      setIsSending(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 px-6 text-center">
        <div className="max-w-md space-y-6">
          <h1 className="text-3xl font-bold">Please Sign In</h1>
          <p className="text-slate-500">You need to be logged in to access your direct messages.</p>
          <a href="/" className="inline-block px-8 py-3 bg-indigo-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs">Go Home</a>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-white pt-24 flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto w-full flex overflow-hidden border-t border-slate-100 dark:border-slate-800">
        
        {/* Conversations Sidebar */}
        <div className={`w-full md:w-80 lg:w-96 flex-col border-r border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10 ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
             <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-500">
                  <MessageSquare className="w-5 h-5" />
                </div>
             </div>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search conversations..." 
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-sm text-slate-400">No messages yet.</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv._id}
                  onClick={() => handleSelectConv(conv)}
                  className={`w-full text-left p-6 flex items-start gap-4 hover:bg-white dark:hover:bg-slate-800/50 transition-all border-b border-slate-50 dark:border-slate-900 ${selectedConv?._id === conv._id ? 'bg-white dark:bg-slate-800/80 shadow-sm' : ''}`}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-100 dark:border-slate-700">
                      {conv.otherUser?.avatar ? (
                        <img src={conv.otherUser.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center uppercase font-bold text-slate-400">
                          {conv.otherUser?.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    {conv.lastMessage && !conv.lastMessage.read && conv.lastMessage.recipientId === user.id && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-950" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-sm truncate">{conv.otherUser?.name || "Unknown"}</h3>
                      {conv.lastMessage && (
                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                          {format(new Date(conv.lastMessage.createdAt), "HH:mm")}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate ${conv.lastMessage?.read || conv.lastMessage?.senderId === user.id ? 'text-slate-500' : 'text-slate-900 dark:text-white font-bold'}`}>
                      {conv.lastMessage?.content || "Starting a conversation..."}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-white dark:bg-[#020617] ${!selectedConv ? 'hidden md:flex' : 'flex'}`}>
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-20">
                <div 
                  className="flex items-center gap-4 cursor-pointer group"
                  onClick={() => {
                    setPreviewUser(selectedConv.otherUser);
                    setIsPreviewOpen(true);
                  }}
                >
                  <button onClick={(e) => { e.stopPropagation(); setSelectedConv(null); }} className="md:hidden p-2 -ml-2 text-slate-400">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 overflow-hidden group-hover:ring-2 ring-indigo-500/30 transition-all">
                     {selectedConv.otherUser?.avatar ? (
                        <img src={selectedConv.otherUser.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center uppercase font-bold text-slate-400 text-sm">
                          {selectedConv.otherUser?.name?.charAt(0)}
                        </div>
                      )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-sm group-hover:text-indigo-500 transition-colors">{selectedConv.otherUser?.name}</h2>
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black leading-none">View Profile Context</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <MoreVertical className="w-5 h-5" />
                   </button>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                 {isLoadingMessages ? (
                   <div className="flex justify-center py-20">
                     <Loader2 className="w-8 h-8 animate-spin text-slate-200" />
                   </div>
                 ) : messages.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                      <p className="text-sm">Start your journey together.</p>
                   </div>
                 ) : (
                   messages.map((msg, i) => {
                     const isMine = msg.senderId === user.id;
                     return (
                       <motion.div
                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         key={msg._id}
                         className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                       >
                         <div className={`max-w-[70%] group relative`}>
                            <div className={`px-5 py-3 rounded-2xl ${isMine ? 'bg-indigo-500 text-white rounded-br-none shadow-lg shadow-indigo-500/10' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none'}`}>
                               <p className="text-sm leading-relaxed">{msg.content}</p>
                            </div>
                            <p className={`text-[9px] mt-1.5 font-bold uppercase tracking-widest text-slate-400 ${isMine ? 'text-right' : 'text-left'}`}>
                              {format(new Date(msg.createdAt), "HH:mm")}
                              {isMine && msg.read && <span className="ml-2 text-indigo-400">Read</span>}
                            </p>
                         </div>
                       </motion.div>
                     );
                   })
                 )}
              </div>

              {/* Chat Input */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-800">
                <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 pl-6 rounded-[24px]">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your signal..." 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" className="p-3 text-slate-400 hover:text-indigo-500 transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSending || !newMessage.trim()}
                      className="bg-indigo-500 text-white p-3 rounded-2xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 hover:bg-indigo-600 transition-all"
                    >
                      {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in fade-in duration-1000">
              <div className="w-32 h-32 rounded-[40px] bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800">
                <MessageSquare className="w-12 h-12 text-slate-200 dark:text-slate-800" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-bold tracking-tight">Direct Founder Inbox</h2>
                <p className="text-slate-500 text-sm max-w-sm font-light">
                  Select a candidate or founder to start a direct secure communication line.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      <ProfilePreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        user={previewUser} 
      />
    </main>
  );
}
