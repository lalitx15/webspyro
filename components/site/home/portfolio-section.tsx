"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Laptop,
  Tablet,
  Smartphone,
  Sparkles,
  ArrowRight,
  Eye,
  Globe,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { SectionReveal } from "@/components/ui/section-reveal";
import { GradientBars } from "@/components/ui/gradient-bars";
import { ourWorkItems, OurWorkItem } from "@/lib/portfolio-data";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";

// Curated authentic website homepage mockups by category & project for guaranteed 100% visual previews
const categoryHeroImages: Record<string, string> = {
  ecommerce: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80",
  healthcare: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&auto=format&fit=crop&q=80",
  food: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80",
  fitness: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&auto=format&fit=crop&q=80",
  salon: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1000&auto=format&fit=crop&q=80",
  education: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&auto=format&fit=crop&q=80",
  interior: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80",
  corporate: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80",
};

const specificProjectImages: Record<string, string> = {
  "work-plumeform": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80",
  "work-wonder-theme": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80",
  "work-blunt-umbrellas": "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=1000&auto=format&fit=crop&q=80",
  "work-ring-pop": "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=1000&auto=format&fit=crop&q=80",
  "work-chumbak": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1000&auto=format&fit=crop&q=80",
  "work-mcaffeine": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000&auto=format&fit=crop&q=80",
  "work-juicy-chemistry": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1000&auto=format&fit=crop&q=80",
  "work-crossword": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1000&auto=format&fit=crop&q=80",
  "work-giva": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&auto=format&fit=crop&q=80",
  "work-newme": "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1000&auto=format&fit=crop&q=80",
  "work-care-hospitals": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1000&auto=format&fit=crop&q=80",
  "work-apollo-cradle": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&auto=format&fit=crop&q=80",
  "work-artemis": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1000&auto=format&fit=crop&q=80",
  "work-beloved-cafe": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000&auto=format&fit=crop&q=80",
  "work-biryani-blues": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1000&auto=format&fit=crop&q=80",
  "work-anytime-fitness": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&auto=format&fit=crop&q=80",
  "work-gold-gym": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1000&auto=format&fit=crop&q=80",
  "work-enrich-salon": "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1000&auto=format&fit=crop&q=80",
  "work-jawed-habib": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000&auto=format&fit=crop&q=80",
};

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<OurWorkItem | null>(null);
  const [deviceFrame, setDeviceFrame] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewMode, setPreviewMode] = useState<"mockup" | "interactive">("mockup");
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImgError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  const getFallbackImage = (item: OurWorkItem) => {
    if (imgErrors[item.id]) {
      return categoryHeroImages[item.category] || categoryHeroImages.ecommerce;
    }
    return (
      specificProjectImages[item.id] ||
      categoryHeroImages[item.category] ||
      categoryHeroImages.ecommerce
    );
  };

  const homeCategories = [
    { id: "all", label: "All Featured" },
    { id: "ecommerce", label: "E-Commerce" },
    { id: "healthcare", label: "Healthcare" },
    { id: "food", label: "Food & Dining" },
    { id: "fitness", label: "Gym & Fitness" },
    { id: "salon", label: "Salon & Spa" },
    { id: "corporate", label: "Corporate & Tech" },
  ];

  const featuredItems =
    activeCategory === "all"
      ? ourWorkItems.slice(0, 9)
      : ourWorkItems.filter((i) => i.category === activeCategory).slice(0, 9);

  const cleanDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    }
  };

  return (
    <section id="portfolio" className="relative overflow-hidden bg-[#07090e] text-white border-b border-neutral-900 py-20 md:py-28">
      {/* Dynamic Animated GradientBars Background */}
      <GradientBars
        numBars={15}
        gradientFrom="rgb(255, 60, 0)"
        gradientTo="transparent"
        animationDuration={2}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <SectionReveal>
              <div className="inline-flex items-center gap-2">
                <Badge variant="blue" pulseDot>
                  Recent Case Studies
                </Badge>
                <Badge variant="mint" className="text-slate-950 font-black bg-[#dcfce7] border-emerald-400">
                  50+ Live Client Deployments
                </Badge>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.1}>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.18]">
                Our Work — <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">Websites that set brands apart.</span>
              </h2>
            </SectionReveal>

            <SectionReveal delay={0.15}>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                Explore real projects engineered for market leaders across E-Commerce, Multi-Speciality Healthcare, Cloud Kitchens, Gyms, and Tech across India.
              </p>
            </SectionReveal>
          </div>

          {/* Quick View All Link */}
          <SectionReveal delay={0.2}>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform hover:scale-105"
            >
              <span>View All 50+ Projects in Our Work</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </SectionReveal>
        </div>

        {/* Filter Category Pills */}
        <SectionReveal delay={0.25} className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          {homeCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)] font-black scale-105"
                    : "bg-neutral-900/90 text-slate-300 hover:text-white hover:bg-neutral-800 border border-neutral-800"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </SectionReveal>

        {/* Project Showcase Grid - Eye-catching cards with guaranteed preview screenshots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {featuredItems.map((item) => {
            const domain = cleanDomain(item.live_url);
            const displayImage = getFallbackImage(item);

            return (
              <GlassCard
                key={item.id}
                enableTilt
                glowColor={item.badge_color || "blue"}
                className="overflow-hidden flex flex-col justify-between h-auto rounded-2xl bg-gradient-to-b from-[#101726]/95 via-[#0b0f19]/95 to-[#060812]/98 border border-neutral-700/80 hover:border-cyan-400/90 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.25)] transition-all duration-300 group"
              >
                <div>
                  {/* Browser Mockup Top Bar */}
                  <div className="h-8 px-3.5 bg-[#080d1a] border-b border-neutral-800/80 flex items-center justify-between select-none">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-[11px] font-mono text-cyan-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="truncate max-w-[150px]">{domain}</span>
                    </div>
                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                      LIVE
                    </span>
                  </div>

                  {/* Screenshot / Live Preview Frame with guaranteed Image */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-950 flex items-center justify-center">
                    <Image
                      src={displayImage}
                      alt={`${item.title} website homepage preview`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      onError={() => handleImgError(item.id)}
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                      unoptimized
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-black/20 pointer-events-none" />

                    {/* Category Badge on Preview */}
                    <span className="absolute top-3 left-3 text-[11px] font-black px-3 py-1 rounded-full bg-black/85 text-cyan-300 border border-cyan-500/40 shadow-lg backdrop-blur-md">
                      {item.badge}
                    </span>

                    {/* Hover Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2.5 p-3 backdrop-blur-[2px]">
                      <button
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="px-4 py-2 rounded-xl bg-cyan-400 text-black font-black text-xs shadow-lg flex items-center gap-1.5 hover:bg-cyan-300 transition-all cursor-pointer transform hover:scale-105"
                      >
                        <Eye className="w-3.5 h-3.5 text-black" />
                        <span>Quick Preview</span>
                      </button>
                      <a
                        href={item.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-white text-black font-black text-xs shadow-lg flex items-center gap-1.5 hover:bg-slate-200 transition-all cursor-pointer transform hover:scale-105"
                      >
                        <span>Visit Site ↗</span>
                      </a>
                    </div>
                  </div>

                  {/* Card Content with High-Contrast Typography */}
                  <div className="p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display font-extrabold text-lg sm:text-xl text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      {item.metrics && (
                        <span className="text-[11px] font-black text-cyan-300 bg-cyan-950/90 px-2.5 py-0.5 rounded-full shrink-0 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                          {item.metrics}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-[13px] text-slate-200 font-normal line-clamp-2 leading-relaxed">
                      {item.tagline}
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tech_stack.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-neutral-900/90 text-slate-300 border border-neutral-700/80"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Preview & Visit Buttons */}
                <div className="p-3.5 bg-neutral-950/90 border-t border-neutral-800/80 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="flex-1 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold border border-neutral-700 hover:border-cyan-400/60 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Live Preview</span>
                  </button>

                  <a
                    href={item.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.35)]"
                  >
                    <span>Visit Site</span>
                    <ExternalLink className="w-3.5 h-3.5 text-black" />
                  </a>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* View All Button Row */}
        <div className="pt-2 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-sm border border-neutral-700 hover:border-cyan-400 shadow-lg transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]"
          >
            <span>Explore All 50+ Projects Across 8 Industries in Our Work</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </Link>
        </div>

        {/* Trust Strip - Redesigned, Eye-Catching & Animated */}
        <SectionReveal delay={0.3} className="pt-4">
          <div className="relative p-6 sm:p-9 rounded-3xl bg-gradient-to-br from-[#0c1326]/95 via-[#070b16]/95 to-[#05070e]/98 border-2 border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.2)] backdrop-blur-2xl overflow-hidden">
            {/* Ambient Background Glow Spotlights */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

            {/* Top Badge */}
            <div className="flex items-center justify-center mb-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[11px] font-extrabold text-cyan-300 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Verified Client Performance Across India
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center text-center relative z-10">
              {/* Stat 1: 4.9/5 Rating */}
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-amber-400/50 transition-all space-y-2 group">
                <div className="flex items-center justify-center gap-1 text-amber-400 text-lg sm:text-xl">
                  {"★".repeat(5)}
                </div>
                <div className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                  <CountUp to={4.9} decimals={1} duration={2} /> / 5.0
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-bold">
                  Client Satisfaction
                </p>
                <p className="text-[11px] text-amber-300/80 font-medium">
                  500+ Verified Reviews on Google & Trustpilot
                </p>
              </div>

              {/* Stat 2: 50+ Active Stores */}
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-cyan-400/50 transition-all space-y-2 group">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 text-[10px] font-extrabold">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  LIVE DEPLOYMENTS
                </div>
                <div className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-cyan-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.7)]">
                  <CountUp to={50} suffix="+" duration={2} />
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-bold">
                  Active Live Stores & Portals
                </p>
                <p className="text-[11px] text-cyan-300/80 font-medium">
                  Scalable Web & App Architectures Running
                </p>
              </div>

              {/* Stat 3: 99.9% Cloud Uptime */}
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-emerald-400/50 transition-all space-y-2 group">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 text-[10px] font-extrabold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  HIGH AVAILABILITY
                </div>
                <div className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-emerald-400 drop-shadow-[0_0_25px_rgba(16,185,129,0.7)]">
                  <CountUp to={99.9} decimals={1} suffix="%" duration={2.2} />
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-bold">
                  Cloud Server Uptime
                </p>
                <p className="text-[11px] text-emerald-300/80 font-medium">
                  Zero-Downtime AWS & Vercel Edge Infra
                </p>
              </div>
            </div>

            {/* Bottom Trust Line */}
            <div className="mt-6 pt-5 border-t border-neutral-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] sm:text-xs text-slate-300 font-semibold text-center">
              <span className="flex items-center gap-1.5">
                <span className="text-cyan-400">⚡</span> Sub-Second Load Speeds
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">🛡️</span> Bank-Grade SSL & Security
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400">🔒</span> 100% On-Time Delivery Guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-cyan-400">💬</span> 24/7 Priority Support
              </span>
            </div>
          </div>
        </SectionReveal>

        {/* Live Preview Modal with Device Switcher */}
        <Modal
          isOpen={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          title={selectedItem?.title || "Website Preview"}
          description={selectedItem ? `${selectedItem.category_label} • ${selectedItem.tagline}` : ""}
          maxWidth="2xl"
        >
          {selectedItem && (
            <div className="space-y-4 pt-2">
              {/* Device Frame Toolbar & View Mode Switcher */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2 rounded-xl bg-slate-100 border border-slate-200">
                {/* Device Selector */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setDeviceFrame("desktop")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      deviceFrame === "desktop"
                        ? "bg-white text-black shadow-xs"
                        : "text-slate-600 hover:text-black"
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5 text-accent" /> Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeviceFrame("tablet")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      deviceFrame === "tablet"
                        ? "bg-white text-black shadow-xs"
                        : "text-slate-600 hover:text-black"
                    }`}
                  >
                    <Tablet className="w-3.5 h-3.5 text-accent" /> Tablet
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeviceFrame("mobile")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      deviceFrame === "mobile"
                        ? "bg-white text-black shadow-xs"
                        : "text-slate-600 hover:text-black"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-accent" /> Mobile
                  </button>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("mockup")}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                      previewMode === "mockup"
                        ? "bg-white text-black shadow-xs"
                        : "text-slate-600 hover:text-black"
                    }`}
                  >
                    Full View
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("interactive")}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                      previewMode === "interactive"
                        ? "bg-white text-black shadow-xs"
                        : "text-slate-600 hover:text-black"
                    }`}
                  >
                    Live iFrame
                  </button>
                </div>
              </div>

              {/* Simulated Device Frame */}
              <div className="w-full flex justify-center py-2 sm:py-3 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
                <div
                  className={`transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-white relative flex flex-col ${
                    deviceFrame === "desktop"
                      ? "w-full max-w-2xl h-[460px]"
                      : deviceFrame === "tablet"
                      ? "w-[440px] h-[480px]"
                      : "w-[290px] h-[490px]"
                  }`}
                >
                  {/* Browser Address Bar */}
                  <div className="h-8 px-3 bg-slate-900 text-slate-300 text-[11px] font-mono flex items-center justify-between gap-2 shrink-0 border-b border-slate-800">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    </div>
                    
                    <div className="flex-1 max-w-sm mx-auto px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-between text-[10px] text-slate-200">
                      <span className="flex items-center gap-1 truncate">
                        <span className="text-emerald-400 font-sans">🔒</span>
                        <span>https://{cleanDomain(selectedItem.live_url)}</span>
                      </span>
                      <span className="text-[9px] text-emerald-400 font-sans font-bold uppercase tracking-wider ml-1">
                        Active
                      </span>
                    </div>

                    <a
                      href={selectedItem.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 shrink-0"
                      title="Open website in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Device Content */}
                  <div className="relative w-full flex-1 overflow-y-auto bg-slate-50 scrollbar-thin">
                    {previewMode === "mockup" ? (
                      <div className="relative w-full min-h-full bg-slate-100">
                        <Image
                          src={getFallbackImage(selectedItem)}
                          alt={`${selectedItem.title} full webpage preview`}
                          width={1000}
                          height={800}
                          className="w-full h-auto object-cover object-top"
                          unoptimized
                        />
                        <div className="sticky bottom-2 right-2 text-right p-2 pointer-events-none">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-black/80 text-white text-[10px] font-bold shadow-md backdrop-blur-xs">
                            ↕ Scroll to explore full page
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col">
                        <div className="p-2 bg-amber-50 border-b border-amber-200 text-amber-900 text-[11px] font-medium flex items-center justify-between gap-2">
                          <span>
                            ⚠️ External sites may block embedded framing (X-Frame-Options). For 100% interactive access, visit directly:
                          </span>
                          <a
                            href={selectedItem.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold underline text-amber-950 whitespace-nowrap"
                          >
                            Open Link ↗
                          </a>
                        </div>
                        <iframe
                          src={selectedItem.live_url}
                          title={selectedItem.title}
                          className="w-full flex-1 border-0"
                          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <a
                  href={selectedItem.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-black text-white text-xs font-extrabold shadow-sm hover:bg-slate-800 transition-colors"
                >
                  <span>Visit Live {cleanDomain(selectedItem.live_url)}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                </a>

                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setSelectedItem(null);
                    window.location.href = "/pricing";
                  }}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto font-bold shadow-glow"
                >
                  View Packages & Pricing
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
}
