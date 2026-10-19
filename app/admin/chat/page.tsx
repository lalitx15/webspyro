"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  Search,
  Inbox,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { useAdminChat } from "@/hooks/use-admin-chat";

export default function AdminChatPage() {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    messages,
    isLoading,
    isVisitorTyping,
    sendAdminMessage,
    updateStatus,
  } = useAdminChat();

  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isVisitorTyping]);

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  const filteredConversations = conversations.filter((c) => {
    const matchesFilter = filter === "all" || c.status === filter;
    const name = c.visitor_name || "Visitor";
    const email = c.visitor_email || "";
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;

    await sendAdminMessage(inputText.trim());
    setInputText("");
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        onMobileMenuToggle={() => {}}
        title="Real-Time Live Chat Inbox"
        subtitle="Communicate directly with active website visitors and answer sales inquiries."
      />

      <div className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] overflow-hidden flex flex-col md:flex-row h-[78vh]">
          {/* LEFT: Conversations List */}
          <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
            {/* Search & Filter Header */}
            <div className="p-4 border-b border-slate-200/80 space-y-3 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="flex items-center gap-1">
                {(["all", "open", "resolved"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                      filter === tab
                        ? "bg-slate-900 text-white shadow-2xs"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {isLoading ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  Connecting to Supabase Realtime...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                  <Inbox className="w-8 h-8 mx-auto text-slate-300" />
                  <p>No chat conversations in {filter}.</p>
                </div>
              ) : (
                filteredConversations.map((c) => {
                  const isActive = c.id === activeConversationId;
                  const isUnread = (c.unread_count || 0) > 0;

                  return (
                    <div
                      key={c.id}
                      onClick={() => setActiveConversationId(c.id)}
                      className={`p-4 transition-colors cursor-pointer select-none ${
                        isActive
                          ? "bg-blue-50/70 border-l-4 border-accent"
                          : "hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent/20 to-indigo-100 text-accent font-bold text-xs flex items-center justify-center">
                            {(c.visitor_name || "V").charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-800 leading-snug">
                              {c.visitor_name || "Website Prospect"}
                            </h4>
                            <p className="text-[10px] text-slate-400">
                              {c.visitor_email || c.visitor_phone || "Direct Visitor"}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {new Date(c.last_message_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {c.last_message && (
                        <p className="mt-2 text-xs text-slate-600 line-clamp-1">
                          {c.last_message}
                        </p>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            c.status === "open"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {c.status}
                        </span>

                        {isUnread && (
                          <span className="px-1.5 py-0.2 rounded-full bg-accent text-white text-[10px] font-bold">
                            {c.unread_count} new
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT: Active Chat Room */}
          <div className="flex-1 flex flex-col h-full bg-white">
            {activeConv ? (
              <>
                {/* Room Header */}
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-[#5B8CFF] text-white flex items-center justify-center font-bold text-sm">
                      {(activeConv.visitor_name || "V").charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {activeConv.visitor_name || "Website Prospect"}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        {activeConv.visitor_phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{activeConv.visitor_phone}</span>
                          </span>
                        )}
                        {activeConv.visitor_email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{activeConv.visitor_email}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateStatus(
                          activeConv.id,
                          activeConv.status === "open" ? "resolved" : "open"
                        )
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activeConv.status === "open"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-blue-50 text-accent border border-blue-200 hover:bg-blue-100"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{activeConv.status === "open" ? "Mark Resolved" : "Re-open Chat"}</span>
                    </button>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
                  {messages.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-400">
                      No messages in this chat session yet.
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isAdmin = m.sender_type === "admin";

                      return (
                        <div
                          key={m.id}
                          className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-1 shadow-2xs ${
                              isAdmin
                                ? "bg-accent text-white rounded-br-xs"
                                : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                            }`}
                          >
                            <p>{m.content}</p>
                            <p
                              className={`text-[9px] text-right font-medium ${
                                isAdmin ? "text-blue-100" : "text-slate-400"
                              }`}
                            >
                              {new Date(m.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {isVisitorTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200/80 rounded-2xl py-2 px-3 text-xs text-slate-500 italic flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span>Visitor is typing...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Form */}
                <form
                  onSubmit={handleSend}
                  className="p-4 border-t border-slate-200 flex items-center gap-2 bg-white"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your reply to visitor..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!inputText.trim()}
                    className="text-xs px-4 py-2.5 h-10 gap-1.5 font-bold shadow-md shadow-accent/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Send</span>
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-accent flex items-center justify-center">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800">Select a Conversation</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Choose any live visitor thread from the left sidebar to start real-time messaging.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
