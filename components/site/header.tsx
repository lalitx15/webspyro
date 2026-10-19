"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  PhoneCall,
  Menu,
  X,
  ArrowRight,
  Search,
  User,
  Home as HomeIcon,
  Tag,
  Briefcase,
  BookOpen,
  Info,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSiteSettings, defaultSiteSettings } from "@/lib/site-data";
import { SiteSettings } from "@/types";
import { cn } from "@/lib/utils";
import { SearchModal } from "./search-modal";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";

export interface HeaderProps {
  onOpenQuoteModal?: () => void;
}

export function Header({ onOpenQuoteModal }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    getSiteSettings().then((data) => {
      if (data) setSettings(data);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const dockNavItems = [
    {
      title: "Home",
      icon: <HomeIcon className="w-full h-full" />,
      href: "/",
    },
    {
      title: "Pricing",
      icon: <Tag className="w-full h-full" />,
      href: "/pricing",
    },
    {
      title: "Our Work",
      icon: <Briefcase className="w-full h-full" />,
      href: "/portfolio",
    },
    {
      title: "Blog",
      icon: <BookOpen className="w-full h-full" />,
      href: "/blog",
    },
    {
      title: "About",
      icon: <Info className="w-full h-full" />,
      href: "/about",
    },
    {
      title: "Contact",
      icon: <Mail className="w-full h-full" />,
      href: "/contact",
    },
  ];

  const handleQuoteClick = () => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal();
    } else {
      const enquireElement = document.getElementById("enquire");
      if (enquireElement) {
        enquireElement.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "/#enquire";
      }
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
          isScrolled || pathname !== "/"
            ? "h-11 sm:h-12 bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-[0_2px_15px_rgb(0,0,0,0.35)]"
            : "h-11 sm:h-12 bg-transparent border-b border-transparent shadow-none"
        )}
      >
        <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 flex items-center justify-between py-0 sm:py-0.5">
          
          {/* 1. Brand Logo: Mobile (Phone) Text-Only vs Desktop Dragon Emblem + Typography */}
          <Link href="/" className="flex items-center group select-none shrink-0 py-0.5">
            {/* Mobile (phone): Text-only Logo */}
            <div className="block md:hidden">
              <Image
                src="/images/logo-mobile.png"
                alt={settings.site_name || "WebSpyra"}
                width={140}
                height={87}
                priority
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
            {/* Desktop / Tablet: Dragon Emblem + Web Spyra Typography */}
            <div className="hidden md:block">
              <Image
                src="/images/logo-desktop.png"
                alt={settings.site_name || "WebSpyra"}
                width={200}
                height={86}
                priority
                className="h-8 lg:h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
          </Link>

          {/* 2. Apple-Style Dynamic Interactive Dock Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center justify-center">
            <Dock
              panelHeight={32}
              magnification={46}
              distance={75}
              className="bg-transparent border-0 px-0 py-0 shadow-none"
            >
              {dockNavItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <DockItem
                    key={item.title}
                    onClick={() => router.push(item.href)}
                    className={cn(
                      "aspect-square rounded-full transition-all bg-transparent border-0 shadow-none",
                      isActive
                        ? "text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.9)]"
                        : "text-neutral-300 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                    )}
                  >
                    <DockLabel>{item.title}</DockLabel>
                    <DockIcon>{item.icon}</DockIcon>
                  </DockItem>
                );
              })}
            </Dock>
          </nav>

          {/* 3. Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search website"
              className="w-7 h-7 flex items-center justify-center text-neutral-300 hover:text-cyan-400 transition-all cursor-pointer bg-transparent border-0 shadow-none"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Direct Phone Link */}
            <a
              href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`}
              className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[11px] font-semibold text-neutral-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-cyan-400" />
              <span>{settings.contact_phone}</span>
            </a>

            {/* Client Portal Link */}
            <Link href="/portal" className="hidden sm:inline-flex">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<User className="w-3 h-3 text-cyan-400" />}
                className="h-7 px-2.5 text-[11px] font-semibold text-neutral-300 hover:text-white hover:bg-white/10 border border-white/10"
              >
                Portal
              </Button>
            </Link>

            {/* Primary Action Button */}
            <div className="hidden sm:block">
              <button
                type="button"
                onClick={handleQuoteClick}
                className="group px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-[10px] tracking-wider uppercase shadow-[0_2px_10px_rgba(6,182,212,0.3)] hover:shadow-[0_4px_16px_rgba(6,182,212,0.45)] transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Free Quote</span>
                <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden w-7 h-7 flex items-center justify-center text-white hover:text-cyan-400 transition-colors cursor-pointer bg-transparent border-0 shadow-none"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4 text-white" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl lg:hidden flex flex-col justify-between p-6 sm:p-8"
          >
            {/* Top Bar of Mobile Menu */}
            <div className="flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center"
              >
                <Image
                  src="/images/logo-mobile.png"
                  alt={settings.site_name || "WebSpyra"}
                  width={140}
                  height={87}
                  className="h-8 w-auto object-contain"
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-neutral-900 border border-white/15 flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links in Mobile Menu */}
            <div className="flex flex-col gap-3 my-auto py-6">
              {dockNavItems.map((item, idx) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 text-xl sm:text-2xl font-bold py-2.5 px-4 rounded-xl transition-all",
                        isActive
                          ? "text-cyan-400 bg-cyan-950/40 border border-cyan-500/20"
                          : "text-neutral-300 hover:text-white"
                      )}
                    >
                      <span className="w-6 h-6">{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Actions of Mobile Menu */}
            <div className="space-y-4 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleQuoteClick();
                }}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-center flex items-center justify-center gap-2 shadow-lg"
              >
                <span>GET A FREE WEBSITE QUOTE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-6 text-sm text-neutral-200 pt-2 font-medium">
                <Link
                  href="/portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Client Portal
                </Link>
                <span className="text-neutral-400">•</span>
                <a
                  href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {settings.contact_phone}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export default Header;
