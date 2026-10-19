"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ArrowUp, MessagesSquare } from "lucide-react";
import { getSiteSettings, defaultSiteSettings } from "@/lib/site-data";
import { SiteSettings } from "@/types";
import { useChat } from "@/lib/chat-context";

export interface FloatingWidgetsProps {
  onOpenChat?: () => void;
}

export function FloatingWidgets({ onOpenChat }: FloatingWidgetsProps) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    getSiteSettings().then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  const { toggleChat, unreadCount } = useChat();

  const cleanWhatsApp = settings.whatsapp_number.replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    settings.whatsapp_default_message || "Hi Webspyra, I am looking for a new website."
  )}`;

  return (
    <div className="fixed right-4 sm:right-6 bottom-6 z-40 flex flex-col items-center gap-3 select-none">
      {/* 1. Floating AI Live Chat Button - Clean Cyber Tech Pill/Circle */}
      {settings.live_chat_enabled && (
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            if (onOpenChat) onOpenChat();
            else toggleChat();
          }}
          aria-label="Open AI Live Chat"
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-[0_4px_20px_rgba(6,182,212,0.45)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.6)] border border-cyan-300/40 flex items-center justify-center cursor-pointer relative group transition-all"
        >
          <MessagesSquare className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-[9px] font-black text-white shadow-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </motion.button>
      )}

      {/* 2. Floating WhatsApp Button - Clean Official Emerald Branding */}
      <motion.a
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-12 h-12 rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_25px_rgba(37,211,102,0.6)] border border-emerald-300/40 flex items-center justify-center cursor-pointer relative group transition-all"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 pointer-events-none" />
        <MessageCircle className="w-6 h-6 fill-white text-white transition-transform group-hover:scale-110" />
      </motion.a>
    </div>
  );
}
