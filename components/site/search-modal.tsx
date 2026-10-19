"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Globe,
  Briefcase,
  BookOpen,
  Layers,
  ArrowRight,
  Clock,
} from "lucide-react";
import { servicesData, portfolioData, blogPostsData } from "@/lib/inner-pages-data";
import { ourWorkItems } from "@/lib/portfolio-data";

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  category: "Service" | "Portfolio" | "Blog" | "Page";
  url: string;
  desc: string;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wsp_recent_searches");
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch {}
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + K or Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Search logic across services, portfolio, blog, and main pages
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase().trim();
    const hits: SearchResult[] = [];

    // 1. Static Pages
    const pages = [
      { id: "pg-home", title: "Home Page — Webspyra", desc: "Award-winning web development agency and services", url: "/" },
      { id: "pg-pricing", title: "Pricing & Comparison Plans", desc: "Transparent website & e-commerce packages with zero hidden costs", url: "/pricing" },
      { id: "pg-quote", title: "Get Instant Quote Wizard", desc: "Calculate your project cost and delivery timeline in 30 seconds", url: "/get-quote" },
      { id: "pg-about", title: "About Webspyra", desc: "Our engineering philosophy, team, and customer success story", url: "/about" },
      { id: "pg-contact", title: "Contact Us & Direct Callback", desc: "Connect with our senior architects via phone, WhatsApp, or email", url: "/contact" },
      { id: "pg-faq", title: "Frequently Asked Questions", desc: "Answers regarding hosting, domain ownership, and turnaround times", url: "/faq" },
    ];
    pages.forEach((p) => {
      if (p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)) {
        hits.push({ ...p, category: "Page" });
      }
    });

    // 2. Services
    servicesData.forEach((s) => {
      if (
        s.title.toLowerCase().includes(q) ||
        s.short_desc.toLowerCase().includes(q) ||
        s.tech_stack.some((t) => t.toLowerCase().includes(q))
      ) {
        hits.push({
          id: s.id,
          title: s.title,
          category: "Service",
          url: `/services/${s.slug}`,
          desc: s.short_desc,
        });
      }
    });

    // 3. Our Work & Portfolio
    ourWorkItems.forEach((p) => {
      if (
        p.title.toLowerCase().includes(q) ||
        p.client_name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category_label.toLowerCase().includes(q) ||
        p.tech_stack.some((t) => t.toLowerCase().includes(q))
      ) {
        hits.push({
          id: p.id,
          title: p.title,
          category: "Portfolio",
          url: `/portfolio#cat-${p.category}`,
          desc: `${p.category_label} • ${p.tagline}`,
        });
      }
    });

    // 4. Blog Posts
    blogPostsData.forEach((b) => {
      if (
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        hits.push({
          id: b.id,
          title: b.title,
          category: "Blog",
          url: `/blog/${b.slug}`,
          desc: b.excerpt,
        });
      }
    });

    setResults(hits);
  }, [query]);

  const handleSelectResult = (url: string, term?: string) => {
    if (term) {
      try {
        const updated = Array.from(new Set([term, ...recentSearches])).slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("wsp_recent_searches", JSON.stringify(updated));
      } catch {}
    }
    onClose();
    router.push(url);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("wsp_recent_searches");
    } catch {}
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl rounded-3xl bg-white/95 backdrop-blur-2xl shadow-2xl border border-white/80 overflow-hidden z-10 text-textPrimary"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
              <Search className="w-5 h-5 text-accent shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services, portfolio, blog, or pricing..."
                className="w-full bg-transparent text-base sm:text-lg text-textPrimary placeholder:text-textMuted focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 text-textMuted hover:text-textPrimary"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-textSecondary uppercase tracking-widest border border-slate-200">
                ESC
              </span>
            </div>

            {/* Results or Suggestions List */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
              {results.length > 0 ? (
                <div className="space-y-1.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-textMuted px-2">
                    {results.length} Search Result{results.length > 1 ? "s" : ""}
                  </p>
                  {results.map((res) => {
                    const icon =
                      res.category === "Service" ? (
                        <Globe className="w-4 h-4 text-accent" />
                      ) : res.category === "Portfolio" ? (
                        <Briefcase className="w-4 h-4 text-[#0F766E]" />
                      ) : res.category === "Blog" ? (
                        <BookOpen className="w-4 h-4 text-[#7C3AED]" />
                      ) : (
                        <Layers className="w-4 h-4 text-rose" />
                      );

                    return (
                      <div
                        key={res.id}
                        onClick={() => handleSelectResult(res.url, query)}
                        className="p-3.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-all flex items-start justify-between group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            {icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-display font-bold text-sm sm:text-base text-textPrimary group-hover:text-accent transition-colors">
                                {res.title}
                              </h4>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-pill bg-slate-100 text-textSecondary">
                                {res.category}
                              </span>
                            </div>
                            <p className="text-xs text-textSecondary line-clamp-1 mt-0.5">
                              {res.desc}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-textMuted group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 mt-2" />
                      </div>
                    );
                  })}
                </div>
              ) : query.trim() ? (
                <div className="py-12 text-center space-y-2">
                  <p className="font-display font-bold text-base text-textPrimary">
                    No matching results found for &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-xs text-textSecondary">
                    Try searching for &quot;E-Commerce&quot;, &quot;SEO&quot;, &quot;Pricing&quot;, or &quot;Next.js&quot;.
                  </p>
                </div>
              ) : (
                /* Recent searches & Quick jumps */
                <div className="space-y-5">
                  {recentSearches.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> Recent Searches
                        </span>
                        <button
                          type="button"
                          onClick={clearRecent}
                          className="text-xs text-textMuted hover:text-danger"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 px-2">
                        {recentSearches.map((term, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setQuery(term)}
                            className="px-3 py-1.5 rounded-pill bg-slate-100 hover:bg-slate-200 text-xs text-textPrimary font-medium transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Quick Links */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-textMuted px-2">
                      Popular Links
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Link
                        href="/services"
                        onClick={onClose}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center gap-3 transition-colors text-xs font-semibold"
                      >
                        <Globe className="w-4 h-4 text-accent" />
                        Explore All 6 Services
                      </Link>
                      <Link
                        href="/portfolio"
                        onClick={onClose}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center gap-3 transition-colors text-xs font-semibold"
                      >
                        <Briefcase className="w-4 h-4 text-[#0F766E]" />
                        Client Case Studies
                      </Link>
                      <Link
                        href="/pricing"
                        onClick={onClose}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center gap-3 transition-colors text-xs font-semibold"
                      >
                        <Layers className="w-4 h-4 text-[#B45309]" />
                        Plans & Renewal Pricing
                      </Link>
                      <Link
                        href="/get-quote"
                        onClick={onClose}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center gap-3 transition-colors text-xs font-semibold"
                      >
                        <ArrowRight className="w-4 h-4 text-rose" />
                        Instant 30s Quote Wizard
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Note */}
            <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-textMuted">
              <span>Press <strong className="font-semibold text-textPrimary">ESC</strong> to exit</span>
              <span>Webspyra Real-Time Search</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
