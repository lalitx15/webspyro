"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users2,
  ShoppingBag,
  UserCheck,
  FolderKanban,
  MessageSquare,
  RefreshCw,
  Layers,
  Sparkles,
  Briefcase,
  FileText,
  Star,
  HelpCircle,
  Image as ImageIcon,
  Sliders,
  Globe,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "CRM & Sales",
    items: [
      { title: "Leads & Enquiries", href: "/admin/leads", icon: Users2, badge: "New" },
      { title: "Orders & Invoices", href: "/admin/orders", icon: ShoppingBag },
      { title: "Clients", href: "/admin/clients", icon: UserCheck },
    ],
  },
  {
    title: "Operations",
    items: [
      { title: "Projects Tracker", href: "/admin/projects", icon: FolderKanban },
      { title: "Live Chat Inbox", href: "/admin/chat", icon: MessageSquare, badge: 2, badgeColor: "bg-accent text-white" },
      { title: "Renewals", href: "/admin/renewals", icon: RefreshCw },
    ],
  },
  {
    title: "Content CMS",
    items: [
      { title: "Plans & Pricing", href: "/admin/plans", icon: Layers },
      { title: "Services", href: "/admin/services", icon: Sparkles },
      { title: "Portfolio", href: "/admin/portfolio", icon: Briefcase },
      { title: "Blog Articles", href: "/admin/blog", icon: FileText },
      { title: "Testimonials", href: "/admin/testimonials", icon: Star },
      { title: "FAQs & Banners", href: "/admin/faqs", icon: HelpCircle },
      { title: "Media Library", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    title: "Settings",
    items: [
      { title: "Brand & Site", href: "/admin/settings", icon: Sliders },
      { title: "SEO Manager", href: "/admin/seo", icon: Globe },
      { title: "Users & Roles", href: "/admin/users", icon: ShieldCheck },
    ],
  },
];

interface AdminSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AdminSidebar({ isMobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { profile, user, signOut } = useAuth();

  const sidebarContent = (
    <div className="flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 flex-shrink-0">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent to-[#5B8CFF] flex items-center justify-center text-white font-extrabold shadow-md shadow-accent/20 text-base">
            W
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
                WEBSPYRA
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-accent mt-0.5">
                Admin Control
              </span>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
        {navSections.map((sec) => (
          <div key={sec.title} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-3 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase mb-2">
                {sec.title}
              </h4>
            )}
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href || pathname?.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  className={`group flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? "bg-accent text-white shadow-sm shadow-accent/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="flex-1 truncate">{item.title}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        item.badgeColor || (isActive ? "bg-white/20 text-white" : "bg-teal-50 text-teal-700 border border-teal-200/60")
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / Profile Box */}
      <div className="p-3 border-t border-slate-100 flex-shrink-0 bg-slate-50/50">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-accent rounded-xl hover:bg-white transition-colors mb-2"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {!isCollapsed && <span>View Live Website</span>}
        </Link>

        <div className="flex items-center justify-between px-2 pt-2 border-t border-slate-200/60">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-200 to-indigo-200 border border-white flex items-center justify-center font-bold text-slate-700 text-xs flex-shrink-0">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "A"}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 truncate leading-none">
                  {profile?.full_name || "Admin Manager"}
                </p>
                <p className="text-[10px] text-slate-400 truncate mt-1">
                  {user?.email || "admin@webspyra.com"}
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => signOut()}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-slate-200/80 shadow-[4px_0_24px_rgba(15,23,42,0.02)] transition-all duration-300 z-30 sticky top-0 h-screen ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-72 bg-white h-full z-10 shadow-2xl flex flex-col"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
