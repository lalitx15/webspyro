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
            ? "h-16 sm:h-20 bg-black/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
            : "h-16 sm:h-20 bg-transparent border-b border-transparent shadow-none"
        )}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* 1. Brand Logo: Mobile (Phone) Text-Only vs Desktop Dragon Emblem + Typography */}
          <Link href="/" className="flex items-center group select-none shrink-0 py-1">
            {/* Mobile (phone): Text-only Logo with comfortable left padding */}
            <div className="block md:hidden pl-1 sm:pl-0">
              <Image
                src="/images/logo-mobile.png"
                alt={settings.site_name || "WebSpyra"}
                width={150}
                height={92}
                priority
                className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
            {/* Desktop / Tablet: Dragon Emblem + Web Spyra Typography */}
            <div className="hidden md:block">
              <Image
                src="/images/logo-desktop.png"
                alt={settings.site_name || "WebSpyra"}
                width={220}
                height={95}
                priority
                className="h-10 sm:h-11 lg:h-12 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
          </Link>

          {/* 2. Apple-Style Dynamic Interactive Dock Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center justify-center">
            <Dock
              panelHeight={42}
              magnification={58}
              distance={80}
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
                        : "!text-white/80 text-white hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                    )}
                  >
                    <DockLabel>{item.title}</DockLabel>
                    <DockIcon className="w-5 h-5">{item.icon}</DockIcon>
                  </DockItem>
                );
              })}
            </Dock>
          </nav>

          {/* 3. Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Call Us Now Button */}
            <a
              href="tel:+918958889538"
              className="inline-flex sm:hidden items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 !text-white text-white text-xs font-bold shadow-sm active:scale-95 transition-all select-none"
              aria-label="Call Us Now: +91 89588 89538"
            >
              <PhoneCall className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
              <span className="!text-white text-white font-bold">Call Us</span>
            </a>

            {/* Desktop Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search website"
              className="hidden lg:flex w-9 h-9 rounded-full items-center justify-center text-white hover:text-cyan-400 hover:border-cyan-400/40 transition-all cursor-pointer bg-white/[0.08] border border-white/15 shadow-sm"
            >
              <Search className="w-4 h-4 text-white" />
            </button>

            {/* Direct Phone Link (Professional White Text) */}
            <a
              href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`}
              className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/20 bg-white/[0.08] hover:bg-white/15 hover:border-cyan-400/50 !text-white text-white text-xs font-bold transition-all shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="!text-white text-white font-bold tracking-wide">{settings.contact_phone}</span>
            </a>

            {/* Client Portal Link (Professional White Text) */}
            <Link href="/portal" className="hidden sm:inline-flex items-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-full border border-white/20 bg-white/[0.08] hover:bg-white/15 hover:border-cyan-400/50 !text-white text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="!text-white text-white font-bold tracking-wide">Client Portal</span>
              </button>
            </Link>

            {/* Primary Action Button */}
            <div className="hidden sm:block">
              <button
                type="button"
                onClick={handleQuoteClick}
                className="group px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-[0_2px_15px_rgba(6,182,212,0.35)] hover:shadow-[0_4px_22px_rgba(6,182,212,0.55)] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Free Quote</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-white hover:text-cyan-400 bg-white/10 hover:bg-white/15 border border-white/20 transition-colors cursor-pointer shadow-sm"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
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

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-white/20 bg-white/10 !text-white text-white font-bold text-xs hover:border-cyan-400 transition-all shadow-sm"
                  style={{ color: "#ffffff" }}
                >
                  <User className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="!text-white text-white font-bold" style={{ color: "#ffffff" }}>Client Portal</span>
                </Link>
                <a
                  href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-white/20 bg-white/10 !text-white text-white font-bold text-xs hover:border-cyan-400 transition-all shadow-sm"
                  style={{ color: "#ffffff" }}
                >
                  <PhoneCall className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="!text-white text-white font-bold" style={{ color: "#ffffff" }}>Call Us</span>
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
