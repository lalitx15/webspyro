"use client";

import React, { useEffect, useState } from "react";
import { Phone, MessageCircle, FileText, Menu } from "lucide-react";
import { getSiteSettings, defaultSiteSettings } from "@/lib/site-data";
import { SiteSettings } from "@/types";

export interface MobileBottomBarProps {
  onOpenQuote?: () => void;
  onOpenMenu?: () => void;
}

export function MobileBottomBar({ onOpenQuote, onOpenMenu }: MobileBottomBarProps) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    getSiteSettings().then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  const handleQuote = () => {
    if (onOpenQuote) {
      onOpenQuote();
    } else {
      const enquire = document.getElementById("enquire");
      if (enquire) {
        enquire.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "/#enquire";
      }
    }
  };

  const cleanPhone = settings.contact_phone.replace(/\s+/g, "");
  const cleanWhatsApp = settings.whatsapp_number.replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    settings.whatsapp_default_message || "Hi Webspyra, I am looking for a new website."
  )}`;

  return (
    <aside
      aria-label="Mobile quick actions"
      className="fixed bottom-3 inset-x-4 z-40 lg:hidden pointer-events-none select-none safe-area-bottom"
    >
      <div className="pointer-events-auto max-w-md mx-auto glass-pill bg-white/90 shadow-2xl border border-white/95 rounded-pill px-4 py-2 flex items-center justify-around">
        {/* 1. Call */}
        <a
          href={`tel:${cleanPhone}`}
          className="flex flex-col items-center justify-center gap-0.5 text-textSecondary hover:text-accent transition-colors py-1 px-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-accent shadow-sm">
            <Phone className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Call</span>
        </a>

        {/* 2. WhatsApp */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 text-textSecondary hover:text-[#0F766E] transition-colors py-1 px-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-[#EDFAF8] flex items-center justify-center text-[#0D9488] shadow-sm">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">WhatsApp</span>
        </a>

        {/* 3. Get Quote (Primary Highlight) */}
        <button
          onClick={handleQuote}
          className="flex flex-col items-center justify-center gap-0.5 text-textPrimary hover:text-accent transition-colors py-1 px-2 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-accent-grad flex items-center justify-center text-white shadow-glow">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-extrabold tracking-tight text-accent">Get Quote</span>
        </button>

        {/* 4. Menu */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center gap-0.5 text-textSecondary hover:text-accent transition-colors py-1 px-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-textSecondary shadow-sm">
            <Menu className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Menu</span>
        </button>
      </div>
    </aside>
  );
}
