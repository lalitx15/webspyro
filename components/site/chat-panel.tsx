"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Sparkles,
  MessageCircle,
  Clock,
  Check,
  CheckCheck,
  ShieldCheck,
} from "lucide-react";
import { useChat } from "@/lib/chat-context";
import { Button } from "@/components/ui/button";

const QUICK_PROMPTS = [
  "💰 How much does a business website cost?",
  "⚡ What is your typical delivery timeline?",
  "🛒 Do you build Shopify or custom e-commerce stores?",
  "📞 I want to talk to a web consultant.",
];

export function ChatPanel() {
  const {
    isOpen,
    closeChat,
    messages,
    sendMessage,
    isTyping,
    sendTyping,
    visitorInfo,
    saveVisitorInfo,
  } = useChat();

  const [input, setInput] = useState("");
  const [showLeadPrompt, setShowLeadPrompt] = useState(false);
  const [nameInput, setNameInput] = useState(visitorInfo.name || "");
  const [phoneInput, setPhoneInput] = useState(visitorInfo.phone || "");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }
  }, [isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setInput("");
    sendTyping(false);
    await sendMessage(trimmed);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    sendTyping(e.target.value.length > 0);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() && !phoneInput.trim()) return;
    saveVisitorInfo({ name: nameInput.trim(), phone: phoneInput.trim() });
    setShowLeadPrompt(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-end sm:p-6 pb-20 sm:pb-6">
        {/* Backdrop for mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeChat}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs sm:hidden pointer-events-auto"
        />

        {/* Chat Window Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: "spring", damping: 28, stiffness: 360 }}
          className="pointer-events-auto w-full sm:w-[390px] h-[82dvh] sm:h-[580px] max-h-[620px] rounded-t-[32px] sm:rounded-[32px] bg-white/95 backdrop-blur-2xl border border-white/80 shadow-2xl flex flex-col overflow-hidden relative"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-mint-light/80 via-sky-light/80 to-periwinkle-light/80 border-b border-white/60 flex items-center justify-between relative shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-accent-grad text-white flex items-center justify-center font-bold text-base shadow-md">
                  W
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-white ring-1 ring-success/30 animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-bold text-sm sm:text-base text-textPrimary">
                    Webspyra Live Support
                  </h3>
                  <span className="px-1.5 py-0.5 rounded-full bg-success/15 text-success text-[10px] font-semibold">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-textSecondary flex items-center gap-1">
                  <Clock className="w-3 h-3 text-accent" /> Replies typically in &lt; 5 mins
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <a
                href="https://wa.me/918958889538?text=Hi%20Webspyra,%20I'm%20chatting%20from%20your%20website"
                target="_blank"
                rel="noopener noreferrer"
                title="Switch to WhatsApp"
                className="p-2 rounded-full hover:bg-white/60 text-slate-600 hover:text-success transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <button
                onClick={closeChat}
                aria-label="Close live chat"
                className="p-2 rounded-full hover:bg-white/60 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Optional Quick Contact Capture Banner */}
          {!visitorInfo.phone && (
            <div className="px-4 py-2 bg-peach-light/40 border-b border-peach/20 flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-1.5 truncate">
                <Sparkles className="w-3.5 h-3.5 text-rose shrink-0" />
                <span>Save contact for instant follow-up?</span>
              </span>
              <button
                onClick={() => setShowLeadPrompt(!showLeadPrompt)}
                className="text-accent font-semibold hover:underline shrink-0 text-xs ml-2"
              >
                {showLeadPrompt ? "Hide" : "Add Details"}
              </button>
            </div>
          )}

          {/* Collapsible Contact Input Form */}
          <AnimatePresence>
            {showLeadPrompt && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleSaveContact}
                className="p-3 bg-white/95 border-b border-slate-100 flex flex-col gap-2 shrink-0 overflow-hidden text-xs"
              >
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-accent bg-slate-50/50"
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp No."
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-accent bg-slate-50/50"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLeadPrompt(false)}
                    className="text-xs h-7 px-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="text-xs h-7 px-3"
                  >
                    Save
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-slate-50/40">
            {/* Welcome Greeting */}
            <div className="p-3.5 rounded-2xl bg-white/90 border border-white shadow-xs space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2 text-accent font-semibold">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Welcome to Webspyra!</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                We craft high-converting business websites, custom web apps, and online stores. Send us a message or choose a prompt below to get started immediately:
              </p>

              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-accent hover:text-white transition-colors text-[11px] text-slate-700 text-left cursor-pointer border border-slate-200/60"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Message History */}
            {messages.map((msg) => {
              const isVisitor = msg.sender_type === "visitor";
              const isSystem = msg.sender_type === "system";

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <span className="px-3 py-1.5 rounded-full bg-sky-light/50 border border-sky/30 text-[11px] text-slate-600 max-w-[90%] text-center">
                      {msg.content}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${
                    isVisitor ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isVisitor && (
                    <div className="w-6 h-6 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center shrink-0 mb-1">
                      W
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isVisitor
                        ? "bg-accent-grad text-white rounded-br-xs"
                        : "bg-white text-slate-800 border border-slate-100 rounded-bl-xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    <div
                      className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${
                        isVisitor ? "text-white/70" : "text-slate-400"
                      }`}
                    >
                      <span>
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isVisitor && (
                        <span>
                          {msg.is_read ? (
                            <CheckCheck className="w-3 h-3 text-white" />
                          ) : (
                            <Check className="w-3 h-3 text-white/70" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  W
                </div>
                <div className="px-3 py-2 rounded-2xl bg-white border border-slate-100 rounded-bl-xs flex items-center gap-1 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] text-slate-400 ml-1">Typing...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
              className="flex-1 px-3.5 py-2 rounded-full border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-accent bg-slate-50/60 text-slate-800 placeholder:text-slate-400"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send message"
              className="w-9 h-9 rounded-full bg-accent-grad text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Secure Branding Badge */}
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-success" />
              <span>256-bit SSL Encrypted</span>
            </span>
            <span>Webspyra Realtime Support</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
