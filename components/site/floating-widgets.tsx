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
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    getSiteSettings().then((data) => {
      if (data) setSettings(data);
    });

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setShowBackToTop(scrollTop > 280);
      setScrollPercentage(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cleanWhatsApp = settings.whatsapp_number.replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    settings.whatsapp_default_message || "Hi Webspyra, I am looking for a new website."
  )}`;

  // Circular progress calculation
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollPercentage / 100) * circumference;

  const { toggleChat, unreadCount } = useChat();

  return (
    <div className="fixed right-4 sm:right-6 bottom-6 z-40 flex flex-col items-center gap-3 select-none">
      {/* 1. Back to Top Button with Animated Progress Ring */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="w-12 h-12 rounded-full glass-panel bg-white/90 shadow-card hover:shadow-card-hover flex items-center justify-center text-textPrimary hover:text-accent cursor-pointer group transition-transform relative"
          >
            {/* SVG Progress Ring */}
            <svg className="w-12 h-12 -rotate-90 absolute inset-0 pointer-events-none">
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-slate-200"
                strokeWidth="2.5"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-accent transition-all duration-150"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform text-accent" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. Floating Live Chat Bubble */}
      {settings.live_chat_enabled && (
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            if (onOpenChat) onOpenChat();
            else toggleChat();
          }}
          aria-label="Open Live Chat"
          className="w-13 h-13 rounded-full bg-accent-grad text-white shadow-glow hover:shadow-glow-lg flex items-center justify-center cursor-pointer relative"
        >
          <MessagesSquare className="w-6 h-6" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-rose border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </motion.button>
      )}

      {/* 3. Floating WhatsApp Button with Pulsing Ping Ring */}
      <motion.a
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-13 h-13 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl flex items-center justify-center cursor-pointer relative group"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40 pointer-events-none" />
        <MessageCircle className="w-6 h-6 fill-white text-white" />
      </motion.a>
    </div>
  );
}
