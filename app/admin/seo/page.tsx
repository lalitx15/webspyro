"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Globe,
  Save,
  Search,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Code,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Share2,
  FileCode,
  Layers,
  Sparkles,
} from "lucide-react";
import { MediaUpload } from "@/components/admin/media-upload";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { SeoSettings, PageSeo } from "@/types";

export default function AdminSeoPage() {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<"global" | "pages" | "analytics" | "robots">("global");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Global SEO state
  const [globalSeo, setGlobalSeo] = useState<SeoSettings>({
    id: "",
    default_title: "Webspyra | Premium Web Development & Digital Solutions",
    title_template: "%s | Webspyra",
    default_description:
      "Award-winning web development agency creating fast, responsive, and animated business websites.",
    default_og_image: "",
    ga4_id: "",
    search_console_code: "",
    meta_pixel_id: "",
    robots_txt: `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /portal/\nDisallow: /api/\n\nSitemap: https://webspyra.com/sitemap.xml`,
  });

  // Pages SEO state
  const [pages, setPages] = useState<PageSeo[]>([]);
  const [pageSearch, setPageSearch] = useState("");

  // Modal State for Per-Page SEO
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Partial<PageSeo>>({
    page_path: "",
    title: "",
    description: "",
    og_image: "",
    canonical_url: "",
    json_ld: null,
  });
  const [rawJsonLd, setRawJsonLd] = useState("");
  const [jsonError, setJsonError] = useState("");

  // Load SEO Settings & Pages
  useEffect(() => {
    async function loadSeoData() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/seo");
        if (res.ok) {
          const data = await res.json();
          if (data.global) setGlobalSeo(data.global);
          if (data.pages) setPages(data.pages);
        }
      } catch (err) {
        console.error("Failed to fetch SEO settings:", err);
        error("Error loading SEO settings", "Using standard SEO defaults.");
      } finally {
        setIsLoading(false);
      }
    }

    loadSeoData();
  }, [error]);

  // Save Global SEO
  const handleSaveGlobal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setIsSaving(true);
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_global",
          ...globalSeo,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update global SEO");
      }

      success(
        "Global SEO Updated!",
        "Meta tags, analytics IDs, and robots.txt have been saved."
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving SEO";
      error("Save Failed", msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Open modal for new page or edit
  const openPageModal = (page?: PageSeo) => {
    if (page) {
      setEditingPage(page);
      setRawJsonLd(page.json_ld ? JSON.stringify(page.json_ld, null, 2) : "");
    } else {
      setEditingPage({
        page_path: "/",
        title: "",
        description: "",
        og_image: "",
        canonical_url: "",
        json_ld: null,
      });
      setRawJsonLd("");
    }
    setJsonError("");
    setIsPageModalOpen(true);
  };

  // Save Per-Page SEO
  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();

    let parsedJson = null;
    if (rawJsonLd.trim()) {
      try {
        parsedJson = JSON.parse(rawJsonLd);
      } catch {
        setJsonError("Invalid JSON syntax. Please verify JSON-LD format.");
        return;
      }
    }

    try {
      setIsSaving(true);
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_page",
          page: {
            ...editingPage,
            json_ld: parsedJson,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save page SEO");
      }

      const { page: savedPage } = await res.json();

      setPages((prev) => {
        const exists = prev.some((p) => p.page_path === savedPage.page_path);
        if (exists) {
          return prev.map((p) => (p.page_path === savedPage.page_path ? savedPage : p));
        }
        return [...prev, savedPage];
      });

      setIsPageModalOpen(false);
      success(
        "Page SEO Saved!",
        `SEO metadata for ${savedPage.page_path} has been updated.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving page SEO";
      error("Failed to save page SEO", msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete page override
  const handleDeletePage = async (id: string, path: string) => {
    if (!confirm(`Are you sure you want to delete SEO override for ${path}?`)) return;

    try {
      const res = await fetch(`/api/admin/seo?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete page SEO");

      setPages((prev) => prev.filter((p) => p.id !== id));
      success(
        "Override Removed",
        `SEO for ${path} will now use global defaults.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error deleting";
      error("Delete Failed", msg);
    }
  };

  const filteredPages = pages.filter((p) =>
    p.page_path.toLowerCase().includes(pageSearch.toLowerCase()) ||
    p.title.toLowerCase().includes(pageSearch.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="w-8 h-8 text-accent animate-spin" />
        <p className="text-sm font-medium text-textSecondary">Loading SEO Manager & Metadata...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-borderGlass pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-accent/10 text-accent">
              <Globe className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold font-heading text-textPrimary">SEO & Analytics Engine</h1>
          </div>
          <p className="text-sm text-textSecondary mt-1">
            Manage global and per-page meta tags, OpenGraph images, robots.txt, dynamic XML sitemap, GA4, and Meta Pixel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/70 border border-borderGlass text-xs font-semibold text-textPrimary hover:bg-white transition-all shadow-sm"
          >
            <FileCode className="w-3.5 h-3.5 text-accent" />
            View sitemap.xml
            <ExternalLink className="w-3 h-3 text-textMuted" />
          </a>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/70 border border-borderGlass text-xs font-semibold text-textPrimary hover:bg-white transition-all shadow-sm"
          >
            <Code className="w-3.5 h-3.5 text-accent" />
            View robots.txt
            <ExternalLink className="w-3 h-3 text-textMuted" />
          </a>
          <button
            onClick={() => handleSaveGlobal()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-accent text-white text-sm font-medium hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Global SEO
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-borderGlass overflow-x-auto pb-px">
        {[
          { id: "global", label: "Global Meta & SERP", icon: Globe },
          { id: "pages", label: "Per-Page SEO Overrides", icon: Layers },
          { id: "analytics", label: "Analytics & Tracking Pixels", icon: Sparkles },
          { id: "robots", label: "Robots.txt Editor", icon: FileCode },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? "border-accent text-accent font-semibold"
                  : "border-transparent text-textSecondary hover:text-textPrimary hover:border-textMuted/40"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Global Meta & SERP Simulator */}
      {activeTab === "global" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-surface backdrop-blur-xl border border-borderGlass shadow-glass space-y-6">
              <h3 className="text-lg font-bold font-heading text-textPrimary flex items-center gap-2">
                <Globe className="w-5 h-5 text-accent" />
                Global Meta Tags
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-textSecondary">
                      Default Meta Title
                    </label>
                    <span className={`text-[11px] font-mono ${globalSeo.default_title.length > 60 ? "text-amber-500 font-bold" : "text-textMuted"}`}>
                      {globalSeo.default_title.length}/60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={globalSeo.default_title}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, default_title: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none transition-all text-sm font-medium text-textPrimary"
                    placeholder="Webspyra | Premium Web Development & Digital Solutions"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                    Title Template
                  </label>
                  <input
                    type="text"
                    value={globalSeo.title_template}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, title_template: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none transition-all text-sm font-medium text-textPrimary"
                    placeholder="%s | Webspyra"
                  />
                  <p className="text-[11px] text-textMuted mt-1">Use %s where the dynamic page title will be inserted.</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-textSecondary">
                      Default Meta Description
                    </label>
                    <span className={`text-[11px] font-mono ${globalSeo.default_description.length > 160 ? "text-amber-500 font-bold" : "text-textMuted"}`}>
                      {globalSeo.default_description.length}/160 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={globalSeo.default_description}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, default_description: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none transition-all text-sm font-medium text-textPrimary"
                    placeholder="Award-winning web development agency creating fast, responsive, and animated business websites."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                    Default OpenGraph Social Image (1200x630 px)
                  </label>
                  <MediaUpload
                    bucket="brand-assets"
                    value={globalSeo.default_og_image || ""}
                    onChange={(url) => setGlobalSeo({ ...globalSeo, default_og_image: url })}
                    label="Upload 1200x630 Social Banner"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SERP & Social Preview Card */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-surface backdrop-blur-xl border border-borderGlass shadow-glass space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                <Search className="w-4 h-4" />
                Google SERP Simulator
              </h4>
              <div className="p-4 rounded-2xl bg-white border border-borderGlass shadow-sm space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-accent">
                    W
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-medium text-slate-800 leading-tight">Webspyra</span>
                    <span className="text-[10px] text-slate-400 font-mono">https://webspyra.com</span>
                  </div>
                </div>
                <h5 className="text-[15px] font-semibold text-[#1a0dab] hover:underline cursor-pointer line-clamp-1 leading-snug">
                  {globalSeo.default_title || "Webspyra | Premium Web Development & Digital Solutions"}
                </h5>
                <p className="text-[12px] text-[#4d5156] line-clamp-2 leading-relaxed">
                  {globalSeo.default_description || "Award-winning web development agency creating fast, responsive, and animated business websites."}
                </p>
              </div>

              {/* Social Card Preview */}
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5 pt-2">
                <Share2 className="w-4 h-4" />
                Social Card Preview
              </h4>
              <div className="rounded-2xl border border-borderGlass bg-white overflow-hidden shadow-sm">
                <div className="relative aspect-[1200/630] w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                  {globalSeo.default_og_image ? (
                    <Image
                      src={globalSeo.default_og_image}
                      alt="Social Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Sparkles className="w-8 h-8 text-accent mx-auto mb-2 opacity-50" />
                      <span className="text-xs font-medium text-textMuted">Default Social Graphic</span>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-0.5">
                  <span className="text-[10px] uppercase font-mono text-slate-400">WEBSPYRA.COM</span>
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">{globalSeo.default_title}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{globalSeo.default_description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Per-Page SEO Overrides */}
      {activeTab === "pages" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-textMuted absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search page paths or titles..."
                value={pageSearch}
                onChange={(e) => setPageSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/70 border border-borderGlass focus:border-accent focus:outline-none transition-all text-sm font-medium"
              />
            </div>

            <button
              onClick={() => openPageModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-sm font-medium hover:shadow-lg hover:shadow-accent/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Page Override
            </button>
          </div>

          <div className="overflow-hidden rounded-3xl bg-surface backdrop-blur-xl border border-borderGlass shadow-glass">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/40 border-b border-borderGlass text-xs font-semibold text-textSecondary uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Page Path</th>
                    <th className="py-4 px-6">Meta Title</th>
                    <th className="py-4 px-6">Description</th>
                    <th className="py-4 px-6">Schema JSON-LD</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderGlass">
                  {filteredPages.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-textSecondary">
                        <Layers className="w-8 h-8 text-textMuted mx-auto mb-2 opacity-50" />
                        No page-specific SEO overrides configured yet.
                        <p className="text-xs text-textMuted mt-1">
                          All pages are currently using the Global SEO settings. Click &quot;Add Page Override&quot; to customize individual routes.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredPages.map((p) => (
                      <tr key={p.id} className="hover:bg-white/40 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs font-semibold text-accent">
                          {p.page_path}
                        </td>
                        <td className="py-4 px-6 font-medium text-textPrimary max-w-[200px] truncate">
                          {p.title}
                        </td>
                        <td className="py-4 px-6 text-textSecondary max-w-[280px] truncate text-xs">
                          {p.description}
                        </td>
                        <td className="py-4 px-6">
                          {p.json_ld ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Configured
                            </span>
                          ) : (
                            <span className="text-[11px] text-textMuted">None</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => openPageModal(p)}
                            className="p-2 rounded-xl text-textSecondary hover:text-accent hover:bg-accent/10 transition-colors"
                            title="Edit Page SEO"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePage(p.id, p.page_path)}
                            className="p-2 rounded-xl text-textSecondary hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Override"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Analytics & Tracking Pixels */}
      {activeTab === "analytics" && (
        <div className="p-6 rounded-3xl bg-surface backdrop-blur-xl border border-borderGlass shadow-glass space-y-6">
          <h3 className="text-lg font-bold font-heading text-textPrimary flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Analytics & Verification Tracking
          </h3>
          <p className="text-sm text-textSecondary">
            When configured, these scripts and verification meta tags are automatically injected into the head across all public pages.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                Google Analytics 4 (GA4) Measurement ID
              </label>
              <input
                type="text"
                value={globalSeo.ga4_id || ""}
                onChange={(e) => setGlobalSeo({ ...globalSeo, ga4_id: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none transition-all text-sm font-medium font-mono text-textPrimary"
                placeholder="G-XXXXXXXXXX"
              />
              <p className="text-[11px] text-textMuted mt-1">Found in Google Analytics &gt; Admin &gt; Data Streams.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                Meta / Facebook Pixel ID
              </label>
              <input
                type="text"
                value={globalSeo.meta_pixel_id || ""}
                onChange={(e) => setGlobalSeo({ ...globalSeo, meta_pixel_id: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none transition-all text-sm font-medium font-mono text-textPrimary"
                placeholder="123456789012345"
              />
              <p className="text-[11px] text-textMuted mt-1">Found in Meta Events Manager &gt; Data Sources.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                Google Search Console Verification Token
              </label>
              <input
                type="text"
                value={globalSeo.search_console_code || ""}
                onChange={(e) => setGlobalSeo({ ...globalSeo, search_console_code: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none transition-all text-sm font-medium font-mono text-textPrimary"
                placeholder="e.g. abcd1234efgh5678ijkl (HTML tag content value)"
              />
              <p className="text-[11px] text-textMuted mt-1">
                Enter the &quot;content&quot; attribute value from the Google Search Console HTML verification tag.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Robots.txt Editor */}
      {activeTab === "robots" && (
        <div className="p-6 rounded-3xl bg-surface backdrop-blur-xl border border-borderGlass shadow-glass space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-heading text-textPrimary flex items-center gap-2">
                <FileCode className="w-5 h-5 text-accent" />
                Robots.txt Configuration
              </h3>
              <p className="text-sm text-textSecondary mt-1">
                Directly configure crawl instructions for Googlebot, Bingbot, and search engine crawlers.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setGlobalSeo({
                  ...globalSeo,
                  robots_txt: `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /portal/\nDisallow: /api/\n\nSitemap: https://webspyra.com/sitemap.xml`,
                })
              }
              className="text-xs text-accent hover:underline font-semibold"
            >
              Reset to Recommended
            </button>
          </div>

          <div>
            <textarea
              rows={8}
              value={globalSeo.robots_txt || ""}
              onChange={(e) => setGlobalSeo({ ...globalSeo, robots_txt: e.target.value })}
              className="w-full p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs border border-slate-800 focus:outline-none focus:ring-1 focus:ring-accent leading-relaxed"
              placeholder="User-agent: *&#10;Allow: /"
            />
          </div>
        </div>
      )}

      {/* MODAL: Edit Page SEO */}
      <Modal
        isOpen={isPageModalOpen}
        onClose={() => setIsPageModalOpen(false)}
        title={editingPage.id ? "Edit Page SEO Metadata" : "Add Page SEO Override"}
        description="Configure specific meta tags, canonical link, and JSON-LD structured data for this route."
        maxWidth="lg"
      >
        <form onSubmit={handleSavePage} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-1.5">
              Page Route Path *
            </label>
            <input
              type="text"
              required
              value={editingPage.page_path || ""}
              onChange={(e) => setEditingPage({ ...editingPage, page_path: e.target.value })}
              placeholder="/services/web-development"
              className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-1.5">
              Meta Title *
            </label>
            <input
              type="text"
              required
              value={editingPage.title || ""}
              onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
              placeholder="Custom Page Title | Webspyra"
              className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-1.5">
              Meta Description *
            </label>
            <textarea
              rows={2}
              required
              value={editingPage.description || ""}
              onChange={(e) => setEditingPage({ ...editingPage, description: e.target.value })}
              placeholder="Custom description for search engines and social cards..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-1.5">
              Canonical URL (Optional)
            </label>
            <input
              type="url"
              value={editingPage.canonical_url || ""}
              onChange={(e) => setEditingPage({ ...editingPage, canonical_url: e.target.value })}
              placeholder="https://webspyra.com/services/web-development"
              className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none text-sm font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-textSecondary">
                JSON-LD Structured Data Schema (Optional)
              </label>
              {jsonError && (
                <span className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {jsonError}
                </span>
              )}
            </div>
            <textarea
              rows={4}
              value={rawJsonLd}
              onChange={(e) => {
                setRawJsonLd(e.target.value);
                setJsonError("");
              }}
              placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "Service",\n  "name": "Web Development"\n}`}
              className="w-full p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs border border-slate-800 focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-borderGlass">
            <button
              type="button"
              onClick={() => setIsPageModalOpen(false)}
              className="px-5 py-2 rounded-full border border-borderGlass text-sm font-medium hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-accent text-white text-sm font-medium hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Page SEO
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
