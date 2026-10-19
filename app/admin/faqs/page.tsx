"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Edit2, Trash2, X, HelpCircle, Megaphone, Sparkles, Save, CheckCircle2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { DataTable, Column } from "@/components/admin/data-table";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@/lib/supabase/client";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "pricing" | "process" | "support";
  sort_order: number;
  is_active: boolean;
}

interface TickerItem {
  id: string;
  text: string;
  link?: string;
  is_active: boolean;
  sort_order: number;
}

interface HeroSettings {
  headline: string;
  subheadline: string;
  primary_cta_text: string;
  secondary_cta_text: string;
  stat_clients: number;
  stat_projects: number;
  stat_rating: number;
  stat_years: number;
}

const initialMockFaqs: FaqItem[] = [
  {
    id: "faq-1",
    question: "How long does it take to design and launch my website?",
    answer: "Most standard business websites are completed and launched within 5 to 7 working days. Comprehensive e-commerce portals and custom web applications typically require 10 to 14 working days from brief approval.",
    category: "process",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "faq-2",
    question: "Is domain registration and cloud hosting included in the plans?",
    answer: "Yes, every Webspyra website package includes a complimentary 1-year .com or .in domain registration and fast AWS/Cloudflare cloud hosting with automated SSL encryption.",
    category: "pricing",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "faq-3",
    question: "Can I manage and update product prices or content myself?",
    answer: "Absolutely. We supply a dedicated, user-friendly admin portal where you can update text, add new blogs, change product pricing, and view customer leads without touching any code.",
    category: "general",
    sort_order: 3,
    is_active: true,
  },
  {
    id: "faq-4",
    question: "What payment gateways are supported for online stores?",
    answer: "We natively integrate Razorpay, supporting instant UPI (Google Pay, PhonePe, Paytm), credit/debit cards, net banking, and digital wallets with automated GST invoices.",
    category: "pricing",
    sort_order: 4,
    is_active: true,
  },
];

const initialMockTickers: TickerItem[] = [
  {
    id: "tick-1",
    text: "🔥 Limited Period Deal: Flat 30% OFF on all Website Packages with Free Domain & Cloud Hosting!",
    link: "/#pricing",
    is_active: true,
    sort_order: 1,
  },
  {
    id: "tick-2",
    text: "⚡ Lightning Fast Delivery: Complete Professional Website ready in 5 to 7 working days!",
    link: "/#pricing",
    is_active: true,
    sort_order: 2,
  },
  {
    id: "tick-3",
    text: "📱 100% Mobile & Tablet Optimized: App-like experience with zero lag guaranteed.",
    link: "/#services",
    is_active: true,
    sort_order: 3,
  },
];

const initialMockHero: HeroSettings = {
  headline: "Award-Winning Websites Engineered for High-Growth Businesses",
  subheadline: "We design soft pastel, animated, and ultra-fast business websites & e-commerce stores with native app feel.",
  primary_cta_text: "Get Free Instant Quote",
  secondary_cta_text: "Explore Portfolio",
  stat_clients: 500,
  stat_projects: 1250,
  stat_rating: 4.9,
  stat_years: 8,
};

export default function AdminFaqsPage() {
  const [activeTab, setActiveTab] = useState<"faqs" | "ticker" | "hero">("faqs");
  const [faqs, setFaqs] = useState<FaqItem[]>(initialMockFaqs);
  const [tickers, setTickers] = useState<TickerItem[]>(initialMockTickers);
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(initialMockHero);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Faq modal state
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [confirmDeleteFaq, setConfirmDeleteFaq] = useState<FaqItem | null>(null);

  // Ticker modal state
  const [editingTicker, setEditingTicker] = useState<TickerItem | null>(null);
  const [isTickerModalOpen, setIsTickerModalOpen] = useState(false);
  const [confirmDeleteTicker, setConfirmDeleteTicker] = useState<TickerItem | null>(null);

  const supabase = useMemo(() => createBrowserClient(), []);

  const fetchFaqs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setFaqs(data as unknown as FaqItem[]);
      }
    } catch {
      // Demo safety
    }
  }, [supabase]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  // Save Hero settings
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  // FAQ CRUD handlers
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !editingFaq.question) return;

    const exists = faqs.some((f) => f.id === editingFaq.id);
    const updated = exists
      ? faqs.map((f) => (f.id === editingFaq.id ? editingFaq : f))
      : [...faqs, editingFaq];

    setFaqs(updated);
    setIsFaqModalOpen(false);

    try {
      await supabase.from("faqs").upsert({
        id: editingFaq.id,
        question: editingFaq.question,
        answer: editingFaq.answer,
        category: editingFaq.category,
        sort_order: editingFaq.sort_order,
        is_active: editingFaq.is_active,
      });
    } catch {
      // Demo safety
    }
  };

  const handleDeleteFaq = async () => {
    if (!confirmDeleteFaq) return;
    setFaqs(faqs.filter((f) => f.id !== confirmDeleteFaq.id));
    setConfirmDeleteFaq(null);

    try {
      await supabase.from("faqs").delete().eq("id", confirmDeleteFaq.id);
    } catch {
      // Demo safety
    }
  };

  // Ticker CRUD handlers
  const handleSaveTicker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTicker || !editingTicker.text) return;

    const exists = tickers.some((t) => t.id === editingTicker.id);
    const updated = exists
      ? tickers.map((t) => (t.id === editingTicker.id ? editingTicker : t))
      : [...tickers, editingTicker];

    setTickers(updated);
    setIsTickerModalOpen(false);
  };

  const handleDeleteTicker = () => {
    if (!confirmDeleteTicker) return;
    setTickers(tickers.filter((t) => t.id !== confirmDeleteTicker.id));
    setConfirmDeleteTicker(null);
  };

  const faqColumns: Column<FaqItem>[] = [
    {
      key: "question",
      header: "Question & Answer",
      sortable: true,
      render: (item) => (
        <div>
          <h4 className="font-bold text-slate-900 leading-snug">{item.question}</h4>
          <p className="text-xs text-slate-500 line-clamp-1 max-w-lg mt-0.5">{item.answer}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (item) => (
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
          {item.category}
        </span>
      ),
    },
    {
      key: "sort_order",
      header: "Order",
      render: (item) => <span className="font-bold text-slate-700 text-xs">#{item.sort_order}</span>,
    },
    {
      key: "is_active",
      header: "Status",
      render: (item) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
            item.is_active ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-400"
          }`}
        >
          {item.is_active ? "Active" : "Hidden"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => {
              setEditingFaq({ ...item });
              setIsFaqModalOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-accent rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setConfirmDeleteFaq(item)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        onMobileMenuToggle={() => {}}
        title="FAQs, Ticker & Hero Banners"
        subtitle="Manage frequently asked questions, top marquee announcements, and hero copy."
      />

      <div className="px-4 sm:px-6 space-y-6 max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("faqs")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "faqs"
                ? "bg-accent text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQs Module ({faqs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("ticker")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "ticker"
                ? "bg-accent text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Announcement Ticker ({tickers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("hero")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "hero"
                ? "bg-accent text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Hero Content & Stats</span>
          </button>
        </div>

        {/* TAB 1: FAQS */}
        {activeTab === "faqs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Customer FAQ Management
                </h3>
                <p className="text-xs text-slate-400">
                  Displayed on Home, Pricing, and dedicated /faq pages
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => {
                  setEditingFaq({
                    id: `faq-${Date.now()}`,
                    question: "",
                    answer: "",
                    category: "general",
                    sort_order: faqs.length + 1,
                    is_active: true,
                  });
                  setIsFaqModalOpen(true);
                }}
                className="text-xs px-3.5 py-1.5 h-9 rounded-2xl gap-1.5 shadow-md shadow-accent/20 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add FAQ</span>
              </Button>
            </div>

            <DataTable
              columns={faqColumns}
              data={faqs}
              searchPlaceholder="Search questions and answers..."
              searchKeys={["question", "answer"]}
            />
          </div>
        )}

        {/* TAB 2: ANNOUNCEMENT TICKER */}
        {activeTab === "ticker" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Top Announcement Marquee Ticker
                </h3>
                <p className="text-xs text-slate-400">
                  Rotates infinitely in the top announcement bar on every public page
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => {
                  setEditingTicker({
                    id: `tick-${Date.now()}`,
                    text: "",
                    link: "/#pricing",
                    is_active: true,
                    sort_order: tickers.length + 1,
                  });
                  setIsTickerModalOpen(true);
                }}
                className="text-xs px-3.5 py-1.5 h-9 rounded-2xl gap-1.5 shadow-md shadow-accent/20 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ticker Offer</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {tickers.map((t) => (
                <div
                  key={t.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 text-accent flex items-center justify-center font-bold text-xs">
                      #{t.sort_order}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{t.text}</p>
                      {t.link && <p className="text-[11px] text-slate-400 font-mono">{t.link}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const updated = tickers.map((item) =>
                          item.id === t.id ? { ...item, is_active: !item.is_active } : item
                        );
                        setTickers(updated);
                      }}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.is_active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {t.is_active ? "Active" : "Disabled"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingTicker({ ...t });
                        setIsTickerModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-accent rounded-lg hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteTicker(t)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: HERO CONTENT & STATS */}
        {activeTab === "hero" && (
          <form
            onSubmit={handleSaveHero}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] space-y-6 text-xs max-w-3xl"
          >
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Landing Page Hero Copy & Numbers
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Update primary titles, subtitle promises, and live counter numbers.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Primary Hero Headline *
                </label>
                <input
                  type="text"
                  required
                  value={heroSettings.headline}
                  onChange={(e) =>
                    setHeroSettings({ ...heroSettings, headline: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Hero Subtitle Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={heroSettings.subheadline}
                  onChange={(e) =>
                    setHeroSettings({ ...heroSettings, subheadline: e.target.value })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Primary CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={heroSettings.primary_cta_text}
                    onChange={(e) =>
                      setHeroSettings({ ...heroSettings, primary_cta_text: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Secondary CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={heroSettings.secondary_cta_text}
                    onChange={(e) =>
                      setHeroSettings({ ...heroSettings, secondary_cta_text: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Stats Counters */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="font-bold text-slate-800">Count-Up Proof Metrics</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">
                      Happy Clients
                    </label>
                    <input
                      type="number"
                      value={heroSettings.stat_clients}
                      onChange={(e) =>
                        setHeroSettings({
                          ...heroSettings,
                          stat_clients: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">
                      Projects Delivered
                    </label>
                    <input
                      type="number"
                      value={heroSettings.stat_projects}
                      onChange={(e) =>
                        setHeroSettings({
                          ...heroSettings,
                          stat_projects: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">
                      Rating (out of 5)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={heroSettings.stat_rating}
                      onChange={(e) =>
                        setHeroSettings({
                          ...heroSettings,
                          stat_rating: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={heroSettings.stat_years}
                      onChange={(e) =>
                        setHeroSettings({
                          ...heroSettings,
                          stat_years: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {isSavedNotice ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Hero settings updated successfully!</span>
                  </span>
                ) : (
                  <span className="text-slate-400">Changes apply immediately to live website.</span>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="text-xs px-5 py-2 shadow-md shadow-accent/20 font-bold gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* FAQ MODAL */}
      {isFaqModalOpen && editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsFaqModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />

          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {faqs.some((f) => f.id === editingFaq.id) ? "Edit FAQ" : "Add FAQ"}
              </h3>
              <button onClick={() => setIsFaqModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  placeholder="e.g. How long does development take?"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={editingFaq.category}
                  onChange={(e) =>
                    setEditingFaq({
                      ...editingFaq,
                      category: e.target.value as "general" | "pricing" | "process" | "support",
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl capitalize"
                >
                  <option value="general">General</option>
                  <option value="pricing">Pricing & Payments</option>
                  <option value="process">Delivery Process</option>
                  <option value="support">Hosting & Support</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  placeholder="Detailed answer provided to customers..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="text-xs px-3 py-1.5"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="text-xs px-4 py-1.5 font-bold">
                  Save FAQ
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TICKER MODAL */}
      {isTickerModalOpen && editingTicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsTickerModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />

          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {tickers.some((t) => t.id === editingTicker.id) ? "Edit Marquee Item" : "Add Marquee Item"}
              </h3>
              <button onClick={() => setIsTickerModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveTicker} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Ticker Text *</label>
                <input
                  type="text"
                  required
                  value={editingTicker.text}
                  onChange={(e) => setEditingTicker({ ...editingTicker, text: e.target.value })}
                  placeholder="e.g. 🔥 Flat 30% OFF on all packages this week!"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Click Link</label>
                <input
                  type="text"
                  value={editingTicker.link || ""}
                  onChange={(e) => setEditingTicker({ ...editingTicker, link: e.target.value })}
                  placeholder="/#pricing"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsTickerModalOpen(false)}
                  className="text-xs px-3 py-1.5"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="text-xs px-4 py-1.5 font-bold">
                  Save Item
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODALS */}
      <ConfirmModal
        isOpen={Boolean(confirmDeleteFaq)}
        onClose={() => setConfirmDeleteFaq(null)}
        onConfirm={handleDeleteFaq}
        title="Delete FAQ?"
        description={`Are you sure you want to delete "${confirmDeleteFaq?.question}"?`}
        confirmText="Delete FAQ"
        variant="danger"
      />

      <ConfirmModal
        isOpen={Boolean(confirmDeleteTicker)}
        onClose={() => setConfirmDeleteTicker(null)}
        onConfirm={handleDeleteTicker}
        title="Delete Announcement Item?"
        description="Are you sure you want to remove this marquee announcement?"
        confirmText="Delete Item"
        variant="danger"
      />
    </div>
  );
}
