"use client";

import { useState, useEffect, Suspense, useMemo, useRef } from "react";
import { MessageSquare, Send, User, Package, Clock, Paperclip, X, FileIcon, Eye, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendMessage, markMessagesAsRead, getInbox } from "@/lib/actions";
import { useNotifications } from "./notification-provider";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

export function MessagesClient(props: { initialMessages: any[], userId: string, targetUser?: any }) {
  return (
    <Suspense fallback={<div className="h-[75vh] flex items-center justify-center font-heading font-bold text-primary">Loading Inbox...</div>}>
      <MessagesContent {...props} />
    </Suspense>
  );
}

function MessagesContent({ initialMessages, userId, targetUser }: { initialMessages: any[], userId: string, targetUser?: any }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState(initialMessages);
  
  // Sync state with props when server revalidates
  useEffect(() => {
    setMessages(prev => {
      // Optimized check: compare IDs and read status instead of entire objects (which include huge base64 strings)
      if (prev.length === initialMessages.length && 
          prev.every((m, i) => m.id === initialMessages[i]?.id && m.read === initialMessages[i]?.read)) {
        return prev;
      }
      return initialMessages;
    });
  }, [initialMessages]);

  const [reply, setReply] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const { refreshUnreadCount } = useNotifications();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get("userId");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Poll for new messages every 10 seconds
  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        const freshMessages = await getInbox(userId);
        setMessages(prev => {
          if (prev.length === freshMessages.length && 
              prev.every((m, i) => m.id === freshMessages[i]?.id && m.read === freshMessages[i]?.read)) {
            return prev;
          }
          return freshMessages;
        });
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset input value to allow selecting same file again if cleared
    e.target.value = "";
  };

  interface Thread {
    key: string;
    partner: any;
    product: any;
    messages: any[];
    lastMessage: any;
  }

  // Memoize threads to prevent infinite loops and unnecessary re-renders
  const threads = useMemo<Thread[]>(() => {
    const threadsMap = (messages || []).reduce((acc: Record<string, Thread>, m) => {
      const partnerId = m.senderId === userId ? m.receiverId : m.senderId;
      const threadKey = `${[userId, partnerId].sort().join("-")}-${m.productId || "general"}`;
      
      if (!acc[threadKey]) {
        acc[threadKey] = {
          key: threadKey,
          partner: m.senderId === userId ? m.receiver : m.sender,
          product: m.product,
          messages: [],
          lastMessage: m
        };
      }
      acc[threadKey].messages.push(m);
      if (new Date(m.createdAt) > new Date(acc[threadKey].lastMessage.createdAt)) {
        acc[threadKey].lastMessage = m;
      }
      return acc;
    }, {});

    return Object.values(threadsMap).sort((a: Thread, b: Thread) => 
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );
  }, [messages, userId]);

  const [selectedThreadKey, setSelectedThreadKey] = useState<string | null>(null);

  // Set initial selection
  useEffect(() => {
    if (!selectedThreadKey) {
      if (targetUserId) {
        const threadToSelect = threads.find((t: any) => t.partner.id === targetUserId);
        if (threadToSelect) {
          setSelectedThreadKey(threadToSelect.key);
          setIsMobileChatView(true);
          return;
        } else if (targetUser) {
          // If a target user was passed but no thread exists, select the "ghost" thread
          setSelectedThreadKey(`ghost-${targetUser.id}`);
          setIsMobileChatView(true);
          return;
        }
      }
      
      if (threads.length > 0) {
        setSelectedThreadKey(threads[0].key);
      }
    }
  }, [threads, targetUserId, selectedThreadKey, targetUser]);

  const activeThread: any = useMemo(() => {
    if (selectedThreadKey?.startsWith("ghost-") && targetUser) {
      return {
        key: selectedThreadKey,
        partner: targetUser,
        product: null,
        messages: [],
        lastMessage: { content: "Start a new conversation..." }
      };
    }
    return threads.find((t: any) => t.key === selectedThreadKey);
  }, [threads, selectedThreadKey, targetUser]);
  
  const [isMobileChatView, setIsMobileChatView] = useState(false);

  // Sync mobile view with initial selection or changes
  useEffect(() => {
    if (selectedThreadKey && !isMobileChatView && window.innerWidth < 768) {
      // Don't auto-switch on first mobile load to show list, 
      // but if they click from some other action we handle it in the onClick
    }
  }, [selectedThreadKey]);

  const activeMessages = useMemo(() => 
    activeThread ? [...activeThread.messages].sort((a: any, b: any) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    ) : [],
  [activeThread]);

  useEffect(() => {
    if (activeThread && userId) {
      const hasUnread = activeThread.messages.some((m: any) => m.receiverId === userId && !m.read);
      if (!hasUnread) return;

      const markAsRead = async () => {
        await markMessagesAsRead(userId, activeThread.partner.id);
        refreshUnreadCount();
      };
      markAsRead();
    }
  }, [activeThread, userId, refreshUnreadCount]);

  const handleReply = async () => {
    if ((!reply.trim() && !attachment) || isSending || !activeThread) return;
    
    if (session?.user && !(session.user as any).emailVerified) {
      toast.error("Please verify your email to send messages.");
      return;
    }

    setIsSending(true);
    try {
      const isGhost = selectedThreadKey?.startsWith("ghost-");
      const partnerId = isGhost ? selectedThreadKey?.split("ghost-")[1] : activeThread.partner.id;

      const res = await sendMessage(
        userId, 
        partnerId, 
        reply.trim(), 
        activeThread.product?.id, 
        attachment || undefined
      );
      
      if (res.success) {
        setMessages(prev => [res.message, ...prev]);
        setReply("");
        setAttachment(null);
        toast.success("Message sent!");
        
        if (isGhost) {
          // Calculate the new thread key to match what useMemo threads does
          const newThreadKey = `${[userId, partnerId].sort().join("-")}-${activeThread.product?.id || "general"}`;
          setSelectedThreadKey(newThreadKey);
        }

        refreshUnreadCount();
      } else {
        toast.error(res.error || "Failed to send message");
      }
    } catch (err) {
      toast.error("An error occurred while sending. Please check your connection.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-0">
      <div className="flex flex-col md:flex-row gap-8 min-h-[80vh] md:min-h-[75vh]">
        {/* Thread List */}
        <div className={cn(
          "w-full md:w-80 space-y-6",
          isMobileChatView ? "hidden md:block" : "block"
        )}>
          <h1 className="text-3xl font-heading font-bold text-primary px-2">Your <span className="serif italic text-accent font-normal">Inbox</span></h1>
          
          <div className="space-y-3 max-h-[70vh] md:max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
            {threads.length === 0 && !selectedThreadKey?.startsWith("ghost-") ? (
              <div className="py-12 text-center bg-white rounded-3xl border border-primary/5">
                <MessageSquare className="w-8 h-8 text-primary/10 mx-auto mb-3" />
                <p className="text-xs font-bold text-primary/30 uppercase tracking-widest">No messages yet</p>
              </div>
            ) : (
              <>
                {selectedThreadKey?.startsWith("ghost-") && targetUser && (
                   <button
                    key={selectedThreadKey}
                    className="w-full p-5 rounded-3xl border text-left transition-all bg-primary text-white border-primary shadow-xl shadow-primary/20"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 font-bold">
                        <Image src={targetUser.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUser.name}`} alt={targetUser.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 text-white">
                        <span className="text-xs font-bold truncate block">{targetUser.name}</span>
                        <span className="text-[9px] font-black uppercase tracking-tight text-accent">New Circle</span>
                      </div>
                    </div>
                    <p className="text-xs text-white/60">Start a new conversation...</p>
                  </button>
                )}
                {threads.map((t: any) => (
                  <button
                    key={t.key}
                    onClick={() => {
                      setSelectedThreadKey(t.key);
                      setIsMobileChatView(true);
                    }}
                    className={cn(
                      "w-full p-5 rounded-3xl border text-left transition-all group",
                      selectedThreadKey === t.key 
                        ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" 
                        : "bg-white border-primary/5 hover:border-accent/40 hover:bg-cream/50"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 font-bold text-primary">
                        <Image src={t.partner.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.partner.name}`} alt={t.partner.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={cn(
                          "text-xs font-bold truncate block",
                          selectedThreadKey === t.key ? "text-white" : "text-primary"
                        )}>{t.partner.name}</span>
                        {t.product && (
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-tight truncate block",
                            selectedThreadKey === t.key ? "text-accent" : "text-accent/60"
                          )}>Re: {t.product.name}</span>
                        )}
                      </div>
                    </div>
                    <p className={cn(
                      "text-xs line-clamp-1",
                      selectedThreadKey === t.key ? "text-white/60" : "text-charcoal/40"
                    )}>{t.lastMessage.content || (t.lastMessage.attachment ? "Sent an attachment" : "")}</p>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={cn(
          "flex-1 flex flex-col bg-white rounded-[2.5rem] md:rounded-[3rem] border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden",
          !isMobileChatView ? "hidden md:flex" : "flex"
        )}>
          {activeThread ? (
            <>
              {/* Header */}
              <div className="p-5 md:p-8 bg-primary/5 border-b border-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <button 
                    onClick={() => setIsMobileChatView(false)}
                    className="md:hidden p-2 -ml-2 text-primary hover:bg-primary/5 rounded-full"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white">
                    <Image 
                      src={activeThread.partner.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeThread.partner.name}`} 
                      alt="" fill className="object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg md:text-xl font-heading font-bold text-primary truncate">
                      {activeThread.partner.name}
                    </h2>
                    <p className="text-[9px] md:text-[10px] text-charcoal/40 font-bold uppercase tracking-widest leading-none truncate">
                      {activeThread.product ? `Inquiry for ${activeThread.product.name}` : "General Conversation"}
                    </p>
                  </div>
                </div>
                {activeThread.product && (
                  <div className="hidden sm:flex items-center gap-3 bg-white p-2 pr-4 rounded-2xl border border-primary/5 shadow-sm">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm">
                      <Image src={activeThread.product.images[0]} alt="" fill className="object-cover" />
                    </div>
                    <div className="max-w-[150px]">
                      <p className="text-[10px] font-black text-accent uppercase tracking-widest leading-none mb-1">Treasure</p>
                      <p className="text-xs font-bold text-primary truncate uppercase">{activeThread.product.name}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Message History */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6 flex flex-col custom-scrollbar bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.02)_1px,transparent_1px)] bg-[size:24px_24px]"
              >
                {activeMessages.map((m: any) => (
                  <div 
                    key={m.id}
                    className={cn(
                      "flex flex-col gap-1 max-w-[80%]",
                      m.senderId === userId ? "items-end ml-auto" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "p-3 md:p-4 px-5 md:px-6 rounded-[1.5rem] md:rounded-[2rem] text-sm font-medium leading-relaxed relative group/msg",
                      m.senderId === userId 
                        ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10" 
                        : "bg-cream/50 text-primary rounded-tl-none border border-primary/5"
                    )}>
                      {m.attachment && (
                        <div className="mb-2 rounded-xl md:rounded-2xl overflow-hidden border border-white/20 bg-black/5 min-w-[180px] md:min-w-[200px]">
                          {m.attachment.startsWith("data:image") ? (
                            <div className="relative w-full aspect-video">
                              <Image src={m.attachment} alt="Attached" fill className="object-cover" unoptimized />
                              <a 
                                href={m.attachment} 
                                download="attachment"
                                className="absolute inset-0 bg-black/40 opacity-0 md:group-hover/msg:opacity-100 transition-opacity flex items-center justify-center gap-2"
                              >
                                <Eye className="w-5 h-5 text-white" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">View Image</span>
                              </a>
                            </div>
                          ) : (
                            <div className="p-3 md:p-4 flex items-center gap-3 bg-white/10">
                              <FileIcon className="w-5 h-5 md:w-6 md:h-6" />
                              <a 
                                href={m.attachment} 
                                download="document"
                                className="text-xs font-bold underline truncate"
                              >View Document</a>
                            </div>
                          )}
                        </div>
                      )}
                      {m.content}
                    </div>
                    <span className="text-[9px] font-black text-primary/20 uppercase tracking-widest px-2">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 md:p-8 bg-white border-t border-primary/5 space-y-3">
                {/* Attachment Preview */}
                <AnimatePresence>
                  {attachment && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden border-2 border-accent shadow-xl group"
                    >
                      {attachment.startsWith("data:image") ? (
                        <Image src={attachment} alt="Preview" fill className="object-cover" unoptimized />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-cream gap-1">
                          <FileIcon className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                          <span className="text-[8px] font-black text-accent uppercase tracking-widest">Document</span>
                        </div>
                      )}
                      <button 
                        onClick={() => setAttachment(null)}
                        className="absolute inset-0 bg-accent/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="flex flex-col md:relative">
                  <textarea 
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleReply();
                      }
                    }}
                    placeholder={`Reply to ${activeThread.partner.name}...`}
                    className="w-full h-24 md:h-32 p-4 md:p-6 pr-4 md:pr-20 bg-cream/30 border border-primary/10 rounded-[1.25rem] md:rounded-[2rem] focus:outline-none focus:border-accent transition-all font-medium text-primary resize-none text-sm md:text-base mb-3 md:mb-0"
                  />
                  <div className="flex md:absolute bottom-4 right-4 items-center justify-end gap-2 md:gap-3">
                    <input 
                      type="file" 
                      id="file-attachment" 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    <label 
                      htmlFor="file-attachment"
                      className="h-10 w-10 md:h-12 md:w-12 bg-white text-primary/40 border border-primary/10 rounded-full flex items-center justify-center hover:text-accent hover:border-accent transition-all cursor-pointer shadow-sm"
                    >
                      <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
                    </label>
                    <button 
                      onClick={handleReply}
                      disabled={isSending || (!reply.trim() && !attachment)}
                      className={cn(
                        "h-10 md:h-12 px-6 md:px-8 bg-accent text-white font-bold rounded-full hover:bg-accent-light transition-all shadow-xl shadow-accent/20 flex items-center gap-2 disabled:opacity-50 text-xs md:text-sm",
                        session?.user && !(session.user as any).emailVerified && "opacity-50 cursor-not-allowed bg-charcoal/40"
                      )}
                    >
                      {session?.user && !(session.user as any).emailVerified ? "Verify email to reply" : isSending ? "..." : "Reply"}
                      {!isSending && <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
              <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-primary/10 font-bold text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-primary">No Conversation Selected</h3>
              <p className="text-charcoal/40 max-w-xs">Choose a conversation from the sidebar to view messages and respond.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
