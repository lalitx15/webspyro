"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Receipt,
  RefreshCw,
  UserCheck,
  LogOut,
  Menu,
  X,
  MessageCircle,
  MessagesSquare,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useChat } from "@/lib/chat-context";
import { ChatProvider } from "@/lib/chat-context";
import { ChatPanel } from "@/components/site/chat-panel";
import { Button } from "@/components/ui/button";

const PORTAL_NAV_ITEMS = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/projects", label: "My Projects", icon: FolderGit2, badge: "Active" },
  { href: "/portal/orders", label: "Orders & Invoices", icon: Receipt },
  { href: "/portal/renewals", label: "Renewals & Cloud", icon: RefreshCw },
  { href: "/portal/profile", label: "Profile & GST", icon: UserCheck },
];

function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut, isLoading } = useAuth();
  const { openChat } = useChat();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Client Display Data (with fallbacks if user signed in as guest/demo)
  const displayName = profile?.full_name || user?.user_metadata?.full_name || "Valued Client";
  const displayEmail = user?.email || profile?.email || "client@webspyra.com";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-page-gradient flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-accent-grad text-white flex items-center justify-center font-bold text-xl shadow-glow mx-auto animate-pulse">
            W
          </div>
          <p className="text-sm font-semibold text-slate-600">Loading your client workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-page-gradient text-slate-800 flex">
      {/* 1. Desktop Glass Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col justify-between bg-white/80 backdrop-blur-2xl border-r border-white/80 p-6 sticky top-0 h-screen shadow-xs z-30">
        <div className="space-y-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-accent-grad text-white flex items-center justify-center font-bold text-base shadow-md">
              W
            </span>
            <div>
              <span className="font-display font-black text-xl text-slate-900 tracking-tight">
                WEBSPYRA
              </span>
              <span className="block text-[9px] font-bold text-accent tracking-widest uppercase">
                Client Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {PORTAL_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-accent text-white shadow-glow font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && !isActive && (
                    <span className="px-2 py-0.5 rounded-full bg-mint-light text-slate-800 text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Support Widget Card in Sidebar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Dedicated Architect</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Have questions regarding staging, features, or timelines?
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="primary"
                size="sm"
                onClick={openChat}
                leftIcon={<MessagesSquare className="w-3.5 h-3.5" />}
                className="w-full text-xs h-7"
              >
                Live Chat
              </Button>
              <a
                href="https://wa.me/919876543210?text=Hi%20Webspyra,%20I'm%20messaging%20from%20my%20client%20portal."
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-xl bg-white border border-slate-200 text-success hover:bg-success hover:text-white transition-colors"
                title="WhatsApp Direct"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* User Profile Mini Footer */}
        <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-accent-grad text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
              {avatarLetter}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs text-slate-900 truncate">{displayName}</p>
              <p className="text-[11px] text-slate-400 truncate">{displayEmail}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="p-2 rounded-xl text-slate-400 hover:text-rose hover:bg-rose/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* 2. Main Portal Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-white/80 px-5 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Drawer Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 bg-white lg:hidden text-slate-700"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <h1 className="font-display font-bold text-base sm:text-lg text-slate-900 truncate">
              {PORTAL_NAV_ITEMS.find((n) => n.href === pathname)?.label || "Client Workspace"}
            </h1>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <span>Main Website</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            <Button
              variant="secondary"
              size="sm"
              onClick={openChat}
              leftIcon={<MessagesSquare className="w-3.5 h-3.5 text-accent" />}
              className="text-xs"
            >
              Support
            </Button>
          </div>
        </header>

        {/* Mobile Slide-Out Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden">
            <div className="w-72 h-full bg-white p-6 flex flex-col justify-between shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-xl text-slate-900">
                    WEBSPYRA
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {PORTAL_NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold ${
                        pathname === item.href
                          ? "bg-accent text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                leftIcon={<LogOut className="w-4 h-4" />}
                className="text-rose hover:bg-rose/10 w-full justify-start"
              >
                Sign Out
              </Button>
            </div>
          </div>
        )}

        {/* Page Body */}
        <main className="flex-1 p-5 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Realtime Live Chat Integration for Client Portal */}
      <ChatPanel />
    </div>
  );
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <PortalShell>{children}</PortalShell>
    </ChatProvider>
  );
}
