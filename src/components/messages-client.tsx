"use client";

import { useState, useEffect, Suspense } from "react";
import { MessageSquare, Send, User, Package, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendMessage } from "@/lib/actions";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

export function MessagesClient(props: { initialMessages: any[], userId: string }) {
  return (
    <Suspense fallback={<div className="h-[75vh] flex items-center justify-center font-heading font-bold text-primary">Loading Inbox...</div>}>
      <MessagesContent {...props} />
    </Suspense>
  );
}

function MessagesContent({ initialMessages, userId }: { initialMessages: any[], userId: string }) {
  const [messages, setMessages] = useState(initialMessages);
  const [reply, setReply] = useState("");
  const [isSending, setIsSending] = useState(false);
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get("userId");

  // Group messages into threads
  const threadsMap = messages.reduce((acc: any, m) => {
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
    // Ensure we keep the latest message for the thread preview
    if (new Date(m.createdAt) > new Date(acc[threadKey].lastMessage.createdAt)) {
      acc[threadKey].lastMessage = m;
    }
    return acc;
  }, {});

  const threads = Object.values(threadsMap).sort((a: any, b: any) => 
    new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  );

  const [selectedThreadKey, setSelectedThreadKey] = useState<string | null>(
    threads.length > 0 ? (threads[0] as any).key : null
  );

  useEffect(() => {
    if (targetUserId) {
      const threadToSelect = threads.find((t: any) => t.partner.id === targetUserId);
      if (threadToSelect) {
        setSelectedThreadKey(threadToSelect.key);
      }
    }
  }, [targetUserId, threads]);

  const activeThread: any = threads.find((t: any) => t.key === selectedThreadKey);
  const activeMessages = activeThread ? [...activeThread.messages].sort((a: any, b: any) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  ) : [];

  const handleReply = async () => {
    if (!reply.trim() || !activeThread) return;
    
    setIsSending(true);
    const res = await sendMessage(userId, activeThread.partner.id, reply, activeThread.product?.id);
    if (res.success) {
      setMessages([res.message, ...messages]);
      setReply("");
    }
    setIsSending(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 min-h-[75vh]">
        {/* Thread List */}
        <div className="w-full md:w-80 space-y-4">
          <h1 className="text-3xl font-heading font-bold text-primary mb-8 px-2">Your <span className="serif italic text-accent font-normal">Inbox</span></h1>
          
          <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
            {threads.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-3xl border border-primary/5">
                <MessageSquare className="w-8 h-8 text-primary/10 mx-auto mb-3" />
                <p className="text-xs font-bold text-primary/30 uppercase tracking-widest">No messages yet</p>
              </div>
            ) : (
              threads.map((t: any) => (
                <button
                  key={t.key}
                  onClick={() => setSelectedThreadKey(t.key)}
                  className={cn(
                    "w-full p-5 rounded-3xl border text-left transition-all group",
                    selectedThreadKey === t.key 
                      ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" 
                      : "bg-white border-primary/5 hover:border-accent/40 hover:bg-cream/50"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/20">
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
                  )}>{t.lastMessage.content}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white rounded-[3rem] border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden">
          {activeThread ? (
            <>
              {/* Header */}
              <div className="p-6 md:p-8 bg-primary/5 border-b border-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                    <Image 
                      src={activeThread.partner.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeThread.partner.name}`} 
                      alt="" fill className="object-cover" 
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-primary">
                      {activeThread.partner.name}
                    </h2>
                    <p className="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest leading-none">
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

              {/* Message History Bubble List */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 flex flex-col custom-scrollbar">
                {activeMessages.map((m: any) => (
                  <div 
                    key={m.id}
                    className={cn(
                      "flex flex-col gap-1 max-w-[80%]",
                      m.senderId === userId ? "items-end ml-auto" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "p-4 px-6 rounded-[2rem] text-sm font-medium leading-relaxed",
                      m.senderId === userId 
                        ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10" 
                        : "bg-cream/50 text-primary rounded-tl-none border border-primary/5"
                    )}>
                      {m.content}
                    </div>
                    <span className="text-[9px] font-black text-primary/20 uppercase tracking-widest px-2">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-6 md:p-8 bg-white border-t border-primary/5">
                <div className="relative">
                  <textarea 
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder={`Reply to ${activeThread.partner.name}...`}
                    className="w-full h-32 p-6 bg-cream/30 border border-primary/10 rounded-[2rem] focus:outline-none focus:border-accent transition-all font-medium text-primary resize-none"
                  />
                  <button 
                    onClick={handleReply}
                    disabled={isSending || !reply.trim()}
                    className="absolute bottom-4 right-4 h-12 px-8 bg-accent text-white font-bold rounded-full hover:bg-accent-light transition-all shadow-xl shadow-accent/20 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSending ? "Sending..." : "Reply"}
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
              <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-primary/10" />
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
