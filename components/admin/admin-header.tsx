"use client";

import React from "react";
import Link from "next/link";
import { Menu, Bell, MessageSquare, Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  onMobileMenuToggle: () => void;
  title?: string;
  subtitle?: string;
  onNewLeadClick?: () => void;
}

export function AdminHeader({
  onMobileMenuToggle,
  title = "Dashboard",
  subtitle = "Welcome back, here is what is happening today.",
  onNewLeadClick,
}: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Toggle mobile sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden sm:block text-[11px] text-slate-400 mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Quick actions, notifications, status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* System operational badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-[11px] font-bold text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Realtime Engine Active</span>
        </div>

        {/* Live Chat inbox button */}
        <Link
          href="/admin/chat"
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          title="Live Chat Conversations"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full ring-2 ring-white" />
        </Link>

        {/* Notification Bell */}
        <button
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>

        {/* External Site Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-accent bg-slate-100 hover:bg-blue-50 rounded-xl transition-colors"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3 h-3" />
        </Link>

        {/* New Lead Quick Action */}
        {onNewLeadClick ? (
          <Button
            variant="primary"
            onClick={onNewLeadClick}
            className="text-xs px-3.5 py-1.5 h-8 gap-1.5 shadow-sm shadow-accent/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Lead</span>
          </Button>
        ) : (
          <Link href="/admin/leads?action=new">
            <Button
              variant="primary"
              className="text-xs px-3.5 py-1.5 h-8 gap-1.5 shadow-sm shadow-accent/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Lead</span>
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
