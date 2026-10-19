"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Laptop,
  Tablet,
  Smartphone,
  Search,
  ArrowRight,
  Eye,
  Globe,
  Sparkles,
} from "lucide-react";
import { PublicLayout, useQuoteModal } from "@/components/site";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { SectionReveal } from "@/components/ui/section-reveal";
import { OrbsBackground } from "@/components/ui/orbs-background";
import { ourWorkItems, ourWorkCategories, OurWorkItem } from "@/lib/portfolio-data";

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

export default function OurWorkPage() {
  const { openQuoteModal } = useQuoteModal();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
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
    return specificProjectImages[item.id] || categoryHeroImages[item.category] || categoryHeroImages.ecommerce;
  };

  // Filter items based on active category and search query
  const filteredItems = useMemo(() => {
    return ourWorkItems.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        item.title.toLowerCase().includes(q) ||
        item.client_name.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.live_url.toLowerCase().includes(q) ||
        item.category_label.toLowerCase().includes(q) ||
        item.tech_stack.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  // Group items by category for section display
  const categorizedSections = useMemo(() => {
    const categoriesToRender =
      activeCategory === "all"
        ? ourWorkCategories.filter((c) => c.id !== "all")
        : ourWorkCategories.filter((c) => c.id === activeCategory);

    return categoriesToRender
      .map((cat) => {
        const items = filteredItems.filter((item) => item.category === cat.id);
        return {
          category: cat,
          items,
        };
      })
      .filter((sec) => sec.items.length > 0);
  }, [activeCategory, filteredItems]);

  const cleanDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    }
  };

  return (
    <PublicLayout>
      <div className="relative min-h-screen pt-24 sm:pt-28 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <OrbsBackground variant="hero" />

        {/* 1. Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <SectionReveal>
            <div className="inline-flex items-center gap-2">
              <Badge variant="blue" pulseDot>
                50+ Live Client Deployments
              </Badge>
              <Badge variant="mint">100% Handwritten Code</Badge>
              <Badge variant="peach">Zero Builder Junk</Badge>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <h1
              className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold text-black tracking-tight leading-[1.12]"
              style={{ color: "#000000" }}
            >
              Our Work — Websites Built for Real Business Growth
            </h1>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <p
              className="text-sm sm:text-base md:text-lg text-black font-semibold max-w-2xl mx-auto leading-relaxed"
              style={{ color: "#000000" }}
            >
              Explore our live client showcase across E-Commerce, Multi-Speciality Hospitals, Food Chains, Fitness Tech, Luxury Salons, and Tech SaaS. Click any card to preview or visit live.
            </p>
          </SectionReveal>

          {/* Consultation CTA */}
          <SectionReveal delay={0.2} className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => openQuoteModal()}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="shadow-glow font-bold"
            >
              Start Your Project With Us
            </Button>
            <a
              href="https://wa.me/918958889538?text=Hi%20Webspyra,%20I%20saw%20your%20work%20portfolio.%20I%20want%20to%20build%20a%20website%20for%20my%20business."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-50 text-black font-extrabold text-xs sm:text-sm transition-all shadow-sm"
              style={{ color: "#000000" }}
            >
              💬 WhatsApp Us Directly
            </a>
          </SectionReveal>
        </div>

        {/* 2. Category Filter Switcher & Search Bar */}
        <SectionReveal delay={0.25} className="space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Horizontal Scrollable Category Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-none shadow-inner max-w-full">
              {ourWorkCategories.map((cat) => {
                const count =
                  cat.id === "all"
                    ? ourWorkItems.length
                    : ourWorkItems.filter((i) => i.category === cat.id).length;
                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? "bg-black text-white shadow-md scale-102"
                        : "text-slate-800 hover:text-black hover:bg-white/70"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by brand or tech..."
                className="w-full h-10 sm:h-11 pl-10 pr-4 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-black font-semibold focus:outline-none focus:border-black focus:ring-1 focus:ring-black shadow-xs placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-xs text-slate-500 hover:text-black font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </SectionReveal>

        {/* 3. Categorized Sections Grid */}
        {categorizedSections.length > 0 ? (
          <div className="space-y-12 sm:space-y-16">
            {categorizedSections.map((section) => (
              <section
                key={section.category.id}
                id={`cat-${section.category.id}`}
                className="space-y-5"
              >
                {/* Category Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b-2 border-slate-200 pb-3">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-black text-xs font-extrabold uppercase tracking-wider mb-1">
                      <span>{section.category.icon}</span>
                      <span>{section.category.label}</span>
                      <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-black text-white font-black">
                        {section.items.length} Sites
                      </span>
                    </div>
                    <h2
                      className="font-display text-xl sm:text-3xl font-extrabold text-black tracking-tight"
                      style={{ color: "#000000" }}
                    >
                      {section.category.label}
                    </h2>
                  </div>
                  <span className="text-xs text-slate-700 font-bold">
                    Showing {section.items.length} live project{section.items.length > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {section.items.map((item) => {
                    const domain = cleanDomain(item.live_url);
                    const previewUrl = getFallbackImage(item);
                    const hasImgError = Boolean(imgErrors[item.id]);

                    return (
                      <GlassCard
                        key={item.id}
                        enableTilt
                        glowColor={item.badge_color || "blue"}
                        className="overflow-hidden flex flex-col justify-between h-auto rounded-2xl bg-white border-2 border-slate-300 shadow-md hover:shadow-xl hover:border-black transition-all group"
                      >
                        <div>
                          {/* Browser Mockup Top Bar */}
                          <div className="h-7 px-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between select-none">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                            </div>
                            <span className="text-[10px] font-extrabold text-slate-600 truncate max-w-[170px]">
                              {domain}
                            </span>
                            <div className="w-8 flex justify-end">
                              <Globe className="w-3 h-3 text-slate-400" />
                            </div>
                          </div>

                          {/* Screenshot / Live Preview Frame */}
                          <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                            {!hasImgError ? (
                              <Image
                                src={previewUrl}
                                alt={`${item.title} website preview`}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                onError={() => handleImgError(item.id)}
                                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-tr from-slate-900 to-slate-800 text-white">
                                <Sparkles className="w-6 h-6 text-cyan-400 mb-1" />
                                <span className="font-display font-extrabold text-base text-white">
                                  {item.title}
                                </span>
                                <span className="text-[11px] text-slate-300 font-semibold mt-0.5">
                                  {domain}
                                </span>
                              </div>
                            )}

                            {/* Badge on Preview */}
                            <span className="absolute top-2.5 left-2.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/95 text-black border border-slate-300 shadow-xs backdrop-blur-md">
                              {item.badge}
                            </span>

                            {/* Overlay Live Preview Button on Hover */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-3">
                              <button
                                type="button"
                                onClick={() => setSelectedItem(item)}
                                className="px-3 py-1.5 rounded-xl bg-white text-black font-extrabold text-xs shadow-lg flex items-center gap-1.5 hover:bg-slate-100 transition-all cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-accent" />
                                <span>Preview</span>
                              </button>
                              <a
                                href={item.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-black text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5 hover:bg-slate-800 transition-all cursor-pointer"
                              >
                                <span>Visit ↗</span>
                              </a>
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-3.5 sm:p-4 space-y-2">
                            <div className="flex items-center justify-between gap-1.5">
                              <h3
                                className="font-display font-extrabold text-base sm:text-lg text-black group-hover:text-accent transition-colors line-clamp-1"
                                style={{ color: "#000000" }}
                              >
                                {item.title}
                              </h3>
                              {item.metrics && (
                                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0 border border-emerald-300">
                                  {item.metrics}
                                </span>
                              )}
                            </div>

                            <p
                              className="text-xs text-black font-semibold line-clamp-2 leading-relaxed"
                              style={{ color: "#000000" }}
                            >
                              {item.tagline}
                            </p>

                            {/* Tech Stack Pills */}
                            <div className="flex flex-wrap gap-1 pt-1">
                              {item.tech_stack.map((t, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-black border border-slate-200"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom: Live Visit & Preview Options */}
                        <div className="p-3 sm:p-3.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedItem(item)}
                            className="flex-1 py-1.5 px-2.5 rounded-xl bg-white hover:bg-slate-100 text-black text-xs font-bold border border-slate-300 flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-accent" />
                            <span>Preview</span>
                          </button>

                          <a
                            href={item.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-1.5 px-2.5 rounded-xl bg-black hover:bg-slate-900 text-white text-xs font-extrabold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                          >
                            <span>Visit Website</span>
                            <ExternalLink className="w-3 h-3 text-cyan-400" />
                          </a>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 bg-slate-50 rounded-3xl border border-slate-200 p-8">
            <p className="font-display font-extrabold text-xl text-black">
              No live websites found matching &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="text-xs text-slate-700 font-bold">
              Try searching by brand name, industry or category keywords.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="font-bold"
            >
              Reset Filters & Show All
            </Button>
          </div>
        )}

        {/* 4. Bottom Consultation Banner */}
        <SectionReveal className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-neutral-900 to-black text-white text-center space-y-4 shadow-2xl border border-neutral-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for a website of this caliber?</span>
          </div>
          <h3 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
            Let us build your next flagship digital experience.
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium">
            From direct-to-consumer e-commerce and local clinics to multi-chain brands, our handwritten Next.js code delivers lightning speeds and measurable sales.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => openQuoteModal()}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-bold shadow-glow"
            >
              Get Free Instant Proposal
            </Button>
            <a
              href="tel:+918958889538"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm transition-all"
            >
              📞 Call +91 8958889538
            </a>
          </div>
        </SectionReveal>

        {/* 5. Interactive Live Preview Modal */}
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

                {/* View Mode Toggle: Visual Mockup vs Live Iframe */}
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

                  {/* Device Content: Visual Mockup or Live Iframe */}
                  <div className="relative w-full flex-1 overflow-y-auto bg-slate-50 scrollbar-thin">
                    {previewMode === "mockup" ? (
                      <div className="relative w-full min-h-full bg-slate-100">
                        {/* High-resolution top-down full capture */}
                        <Image
                          src={`https://image.thum.io/get/width/1000/noanim/${selectedItem.live_url}`}
                          alt={`${selectedItem.title} full webpage preview`}
                          width={1000}
                          height={1800}
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
                    const projectTitle = selectedItem.title;
                    setSelectedItem(null);
                    openQuoteModal(projectTitle);
                  }}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto font-bold shadow-glow"
                >
                  Build Similar Website With Us
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </PublicLayout>
  );
}
