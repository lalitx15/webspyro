"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChatConversation, ChatMessage } from "@/types";
import { createBrowserClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export function useAdminChat() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisitorTyping, setIsVisitorTyping] = useState(false);

  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch conversations list
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/chat");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (e) {
      console.error("Failed to load admin conversations", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // 2. Fetch messages for active conversation
  const fetchMessages = useCallback(async (convId: string) => {
    try {
      const res = await fetch(`/api/chat?conversationId=${encodeURIComponent(convId)}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);

        // Mark visitor messages as read
        await fetch("/api/chat", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "mark_read",
            conversation_id: convId,
            sender_type: "admin",
          }),
        });

        // Update local conversation unread count
        setConversations((prev) =>
          prev.map((c) => (c.id === convId ? { ...c, unread_count: 0 } : c))
        );
      }
    } catch (e) {
      console.error("Failed to fetch messages for conversation", e);
    }
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    } else {
      setMessages([]);
    }
  }, [activeConversationId, fetchMessages]);

  // 3. Realtime subscriptions for conversations and messages
  useEffect(() => {
    const supabase = createBrowserClient();

    // Global listener for new chat messages
    const globalMsgChannel = supabase
      .channel("admin_chat_global")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload: { new: ChatMessage }) => {
          const newMsg = payload.new;

          // If message belongs to active conversation, append it
          if (newMsg.conversation_id === activeConversationId) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });

            // If visitor message, auto mark read
            if (newMsg.sender_type === "visitor") {
              fetch("/api/chat", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  action: "mark_read",
                  conversation_id: activeConversationId,
                  sender_type: "admin",
                }),
              });
            }
          }

          // Update conversation in list
          setConversations((prev) => {
            const exists = prev.find((c) => c.id === newMsg.conversation_id);
            if (!exists) {
              fetchConversations();
              return prev;
            }

            return prev
              .map((c) => {
                if (c.id === newMsg.conversation_id) {
                  const isCurrentActive = c.id === activeConversationId;
                  const newUnread =
                    !isCurrentActive && newMsg.sender_type === "visitor"
                      ? (c.unread_count || 0) + 1
                      : c.unread_count || 0;
                  return {
                    ...c,
                    last_message_at: newMsg.created_at,
                    last_message: newMsg.content,
                    unread_count: newUnread,
                  };
                }
                return c;
              })
              .sort(
                (a, b) =>
                  new Date(b.last_message_at).getTime() -
                  new Date(a.last_message_at).getTime()
              );
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_conversations" },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(globalMsgChannel);
    };
  }, [activeConversationId, fetchConversations]);

  // 4. Realtime channel for visitor typing on active conversation
  useEffect(() => {
    if (!activeConversationId) return;

    const supabase = createBrowserClient();
    const convChannel = supabase
      .channel(`chat_realtime_${activeConversationId}`)
      .on("broadcast", { event: "typing" }, (payload: { payload?: { sender?: string; typing?: boolean } }) => {
        if (payload?.payload?.sender === "visitor") {
          setIsVisitorTyping(Boolean(payload.payload.typing));
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            setIsVisitorTyping(false);
          }, 3000);
        }
      })
      .subscribe();

    realtimeChannelRef.current = convChannel;

    return () => {
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [activeConversationId]);

  // 5. Send admin message
  const sendAdminMessage = async (content: string) => {
    if (!activeConversationId || !content.trim()) return;

    const trimmed = content.trim();
    const tempId = `temp_admin_${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      conversation_id: activeConversationId,
      sender_type: "admin",
      content: trimmed,
      is_read: true,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_message",
          conversation_id: activeConversationId,
          sender_type: "admin",
          content: trimmed,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          setMessages((prev) =>
            prev.map((m) => (m.id === tempId ? data.message : m))
          );
        }
      }
    } catch (e) {
      console.error("Failed to send admin message", e);
    }
  };

  // 6. Broadcast admin typing
  const sendAdminTyping = (typing: boolean) => {
    if (!realtimeChannelRef.current) return;
    try {
      realtimeChannelRef.current.send({
        type: "broadcast",
        event: "typing",
        payload: { sender: "admin", typing },
      });
    } catch {}
  };

  // 7. Update status (e.g. resolve or close)
  const updateStatus = async (convId: string, status: "open" | "closed" | "resolved") => {
    try {
      const res = await fetch("/api/chat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_status",
          conversation_id: convId,
          status,
        }),
      });

      if (res.ok) {
        setConversations((prev) =>
          prev.map((c) => (c.id === convId ? { ...c, status } : c))
        );
      }
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || null;

  const totalUnread = conversations.reduce(
    (sum, c) => sum + (c.unread_count || 0),
    0
  );

  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    activeConversation,
    messages,
    isLoading,
    isVisitorTyping,
    totalUnread,
    sendAdminMessage,
    sendAdminTyping,
    updateStatus,
    refreshConversations: fetchConversations,
  };
}
