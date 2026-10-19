"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { ChatConversation, ChatMessage } from "@/types";
import { createBrowserClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface VisitorInfo {
  name: string;
  phone: string;
  email: string;
}

interface ChatContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  conversation: ChatConversation | null;
  messages: ChatMessage[];
  unreadCount: number;
  isTyping: boolean;
  visitorInfo: VisitorInfo;
  saveVisitorInfo: (info: Partial<VisitorInfo>) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  sendTyping: (typing: boolean) => void;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Web Audio API gentle notification chime
function playNotificationChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Audio playback blocked by browser gesture policies
  }
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [visitorInfo, setVisitorInfoState] = useState<VisitorInfo>({
    name: "",
    phone: "",
    email: "",
  });

  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  // 1. Initialize visitor session ID from localStorage
  useEffect(() => {
    let sId = localStorage.getItem("webspyra_chat_session_id");
    if (!sId) {
      sId = `vst_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("webspyra_chat_session_id", sId);
    }
    setSessionId(sId);

    const savedInfo = localStorage.getItem("webspyra_chat_visitor_info");
    if (savedInfo) {
      try {
        setVisitorInfoState(JSON.parse(savedInfo));
      } catch {}
    }
  }, []);

  // 2. Fetch existing conversation & messages on load
  useEffect(() => {
    if (!sessionId) return;

    let isMounted = true;
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/chat?sessionId=${encodeURIComponent(sessionId)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted) return;

        if (data.conversation) {
          setConversation(data.conversation);
          setMessages(data.messages || []);

          // Count unread messages from admin/system
          const unread = (data.messages || []).filter(
            (m: ChatMessage) => m.sender_type !== "visitor" && !m.is_read
          ).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  // 3. Mark messages as read when panel is opened
  const markMessagesRead = useCallback(async (convId: string) => {
    try {
      setUnreadCount(0);
      setMessages((prev) =>
        prev.map((m) =>
          m.sender_type !== "visitor" ? { ...m, is_read: true } : m
        )
      );
      await fetch("/api/chat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mark_read",
          conversation_id: convId,
          sender_type: "visitor",
        }),
      });
    } catch {}
  }, []);

  // 4. Set up Supabase Realtime channel for active conversation
  useEffect(() => {
    if (!conversation?.id) return;

    const supabase = createBrowserClient();
    const convId = conversation.id;

    // Listen to changes on chat_messages table
    const channel = supabase
      .channel(`chat_realtime_${convId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${convId}`,
        },
        (payload: { new: ChatMessage }) => {
          const newMsg = payload.new;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });

          if (newMsg.sender_type !== "visitor") {
            playNotificationChime();
            if (isOpenRef.current) {
              markMessagesRead(convId);
            } else {
              setUnreadCount((c) => c + 1);
            }
          }
        }
      )
      .on("broadcast", { event: "typing" }, (payload: { payload?: { sender?: string; typing?: boolean } }) => {
        if (payload?.payload?.sender === "admin") {
          setIsTyping(true);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
          }, 3000);
        }
      })
      .subscribe();

    realtimeChannelRef.current = channel;

    return () => {
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversation?.id, markMessagesRead]);

  // 5. Open / Close controls
  const openChat = useCallback(() => {
    setIsOpen(true);
    if (conversation?.id) {
      markMessagesRead(conversation.id);
    }
  }, [conversation?.id, markMessagesRead]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next && conversation?.id) {
        markMessagesRead(conversation.id);
      }
      return next;
    });
  }, [conversation?.id, markMessagesRead]);

  // 6. Save or update visitor contact information
  const saveVisitorInfo = async (info: Partial<VisitorInfo>) => {
    const updated = { ...visitorInfo, ...info };
    setVisitorInfoState(updated);
    localStorage.setItem("webspyra_chat_visitor_info", JSON.stringify(updated));

    if (sessionId) {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "start_conversation",
            visitor_session_id: sessionId,
            visitor_name: updated.name || undefined,
            visitor_phone: updated.phone || undefined,
            visitor_email: updated.email || undefined,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.conversation) {
            setConversation(data.conversation);
          }
        }
      } catch (e) {
        console.error("Error saving visitor info", e);
      }
    }
  };

  // 7. Send message with optimistic update and auto-conversation creation
  const sendMessage = async (content: string) => {
    const cleanContent = content.trim();
    if (!cleanContent) return;

    let activeConv = conversation;

    // Create conversation if it doesn't exist yet
    if (!activeConv) {
      setIsLoading(true);
      try {
        const initRes = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "start_conversation",
            visitor_session_id: sessionId,
            visitor_name: visitorInfo.name || undefined,
            visitor_phone: visitorInfo.phone || undefined,
            visitor_email: visitorInfo.email || undefined,
          }),
        });

        if (initRes.ok) {
          const initData = await initRes.json();
          activeConv = initData.conversation;
          setConversation(activeConv);
        }
      } catch (err) {
        console.error("Failed to create conversation", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!activeConv?.id) return;

    // Optimistic message
    const tempId = `temp_${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      conversation_id: activeConv.id,
      sender_type: "visitor",
      content: cleanContent,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    // Send to API
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_message",
          conversation_id: activeConv.id,
          sender_type: "visitor",
          content: cleanContent,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          // Replace optimistic message with actual DB message
          setMessages((prev) =>
            prev.map((m) => (m.id === tempId ? data.message : m))
          );
        }
      }
    } catch (err) {
      console.error("Failed to deliver message", err);
    }
  };

  // 8. Broadcast typing status
  const sendTyping = (typing: boolean) => {
    if (!realtimeChannelRef.current) return;
    try {
      realtimeChannelRef.current.send({
        type: "broadcast",
        event: "typing",
        payload: { sender: "visitor", typing },
      });
    } catch {}
  };

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        openChat,
        closeChat,
        toggleChat,
        conversation,
        messages,
        unreadCount,
        isTyping,
        visitorInfo,
        saveVisitorInfo,
        sendMessage,
        sendTyping,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return ctx;
}
