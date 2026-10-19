"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Edit2, Trash2, X, Sparkles, Globe } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { DataTable, Column } from "@/components/admin/data-table";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { MediaUpload } from "@/components/admin/media-upload";
import { createBrowserClient } from "@/lib/supabase/client";

interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  icon: string;
  short_description: string;
  long_description: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  seo_title?: string;
  seo_description?: string;
}

const initialMockServices: ServiceItem[] = [
  {
    id: "serv-1",
    title: "Business Websites",
    slug: "business-websites",
    icon: "Layout",
    short_description: "Ultra-fast corporate and service showcase websites engineered with Soft Pastel aesthetics.",
    long_description: "<h3>Engineered for High-Conversion Business Presence</h3><p>We build award-winning business websites utilizing Next.js 14, Tailwind CSS, and Framer Motion. Every single layout is strictly responsive with 100% app-like touch handling on phones and tablets.</p>",
    image_url: "/services/business-web.webp",
    sort_order: 1,
    is_active: true,
    seo_title: "Custom Business Website Design & Development | Webspyra",
    seo_description: "Award-winning business website design and high-converting web presence for startups and corporates.",
  },
  {
    id: "serv-2",
    title: "E-Commerce Stores",
    slug: "ecommerce-websites",
    icon: "ShoppingBag",
    short_description: "High-speed storefronts with automated Razorpay checkout, GST invoices, and coupon engines.",
    long_description: "<h3>Scale Your Product Sales with Instant Checkout</h3><p>Turn visitors into loyal buyers with a lightning-fast store. Integrated with Razorpay UPI, dynamic promo codes, automated inventory tracking, and client order portals.</p>",
    image_url: "/services/ecommerce.webp",
    sort_order: 2,
    is_active: true,
    seo_title: "E-Commerce Website Development with Razorpay | Webspyra",
    seo_description: "Launch your high-performance online store with automated payments, customer portal, and GST invoicing.",
  },
  {
    id: "serv-3",
    title: "Custom Web Applications",
    slug: "web-applications",
    icon: "Code",
    short_description: "Scalable SaaS platforms, customer portals, internal CRM systems, and database workflows.",
    long_description: "<h3>Cloud-Native SaaS & Custom Dashboards</h3><p>Full-stack web applications built on Supabase, PostgreSQL, and Next.js. Real-time updates, granular role-based access control, and fluid charts.</p>",
    image_url: "/services/webapp.webp",
    sort_order: 3,
    is_active: true,
    seo_title: "Custom Web Application Development | Webspyra",
    seo_description: "Bespoke SaaS, client portals, and cloud web applications with real-time database architecture.",
  },
  {
    id: "serv-4",
    title: "SEO & Growth Marketing",
    slug: "seo-growth",
    icon: "TrendingUp",
    short_description: "First-page Google rankings, technical Core Web Vitals audit, and social conversion funnels.",
    long_description: "<h3>Dominate Google Search with 100/100 Core Web Vitals</h3><p>Our search optimization blends modern JSON-LD structured data, dynamic XML sitemaps, semantic HTML, and high-converting copy.</p>",
    image_url: "/services/seo.webp",
    sort_order: 4,
    is_active: true,
    seo_title: "SEO & Digital Growth Marketing Services | Webspyra",
    seo_description: "Technical SEO audits, local Google rankings, and high-performance marketing funnels.",
  },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>(initialMockServices);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<ServiceItem | null>(null);

  const supabase = useMemo(() => createBrowserClient(), []);

  const fetchServices = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setServices(data as unknown as ServiceItem[]);
      }
    } catch {
      // Demo safety
    }
  }, [supabase]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleAddNew = () => {
    setEditingService({
      id: `serv-${Date.now()}`,
      title: "",
      slug: "",
      icon: "Sparkles",
      short_description: "",
      long_description: "<p>Write detailed service scope and benefits here...</p>",
      image_url: "",
      sort_order: services.length + 1,
      is_active: true,
      seo_title: "",
      seo_description: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (service: ServiceItem) => {
    setEditingService({ ...service });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title) return;

    const exists = services.some((s) => s.id === editingService.id);
    let updated: ServiceItem[];

    if (exists) {
      updated = services.map((s) => (s.id === editingService.id ? editingService : s));
    } else {
      updated = [...services, editingService];
    }

    setServices(updated);
    setIsModalOpen(false);

    try {
      await supabase.from("services").upsert({
        id: editingService.id,
        title: editingService.title,
        slug: editingService.slug || editingService.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        icon: editingService.icon,
        short_description: editingService.short_description,
        long_description: editingService.long_description,
        image_url: editingService.image_url || null,
        sort_order: editingService.sort_order,
        is_active: editingService.is_active,
      });
    } catch {
      // Demo safety
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const next = services.filter((s) => s.id !== confirmDelete.id);
    setServices(next);
    setConfirmDelete(null);

    try {
      await supabase.from("services").delete().eq("id", confirmDelete.id);
    } catch {
      // Demo safety
    }
  };

  const columns: Column<ServiceItem>[] = [
    {
      key: "title",
      header: "Service & Slug",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-accent font-bold text-xs flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 leading-snug">{item.title}</h4>
            <p className="text-[11px] text-slate-400 font-mono">/services/{item.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "short_description",
      header: "Brief Overview",
      render: (item) => (
        <p className="text-xs text-slate-500 max-w-md line-clamp-2 leading-relaxed">
          {item.short_description}
        </p>
      ),
    },
    {
      key: "sort_order",
      header: "Order",
      sortable: true,
      render: (item) => <span className="font-bold text-slate-700 text-xs">#{item.sort_order}</span>,
    },
    {
      key: "is_active",
      header: "Status",
      render: (item) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
            item.is_active
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {item.is_active ? "Published" : "Draft"}
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
            onClick={() => handleEdit(item)}
            className="p-1.5 text-slate-400 hover:text-accent rounded-lg hover:bg-blue-50 transition-colors"
            title="Edit Service"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setConfirmDelete(item)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Delete Service"
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
        title="Services & Capabilities CMS"
        subtitle="Manage public agency services, detailed scope of work, and SEO descriptions."
      />

      <div className="px-4 sm:px-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Live Service Offerings</h3>
            <p className="text-xs text-slate-400">Total {services.length} services configured</p>
          </div>
          <Button
            variant="primary"
            onClick={handleAddNew}
            className="text-xs px-3.5 py-1.5 h-9 rounded-2xl gap-1.5 shadow-md shadow-accent/20 font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={services}
          searchPlaceholder="Search services by title, slug, description..."
          searchKeys={["title", "slug", "short_description"]}
        />
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />

          <div className="relative w-full max-w-3xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 max-h-[92vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {services.some((s) => s.id === editingService.id) ? "Edit Service" : "Add New Service"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Write comprehensive service descriptions and configure search metadata.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={editingService.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                      setEditingService({ ...editingService, title, slug });
                    }}
                    placeholder="e.g. E-Commerce Stores"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingService.slug}
                    onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                    placeholder="e.g. ecommerce-websites"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Summary (Cards & Previews)</label>
                <textarea
                  rows={2}
                  required
                  value={editingService.short_description}
                  onChange={(e) =>
                    setEditingService({ ...editingService, short_description: e.target.value })
                  }
                  placeholder="One or two sentences explaining the core value proposition..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                />
              </div>

              {/* TipTap Rich Text Editor for Long Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Detailed Service Content (TipTap Rich Text)
                </label>
                <RichTextEditor
                  content={editingService.long_description}
                  onChange={(html) => setEditingService({ ...editingService, long_description: html })}
                  minHeight="200px"
                />
              </div>

              {/* Media Upload */}
              <div className="space-y-1">
                <MediaUpload
                  label="Cover / Featured Illustration"
                  value={editingService.image_url}
                  onChange={(url) => setEditingService({ ...editingService, image_url: url })}
                />
              </div>

              {/* SEO Fields */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                  <Globe className="w-3.5 h-3.5 text-accent" />
                  <span>Search Engine Optimization (SEO)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">SEO Title Tag</label>
                    <input
                      type="text"
                      value={editingService.seo_title || ""}
                      onChange={(e) => setEditingService({ ...editingService, seo_title: e.target.value })}
                      placeholder="Custom browser title..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Meta Description</label>
                    <input
                      type="text"
                      value={editingService.seo_description || ""}
                      onChange={(e) =>
                        setEditingService({ ...editingService, seo_description: e.target.value })
                      }
                      placeholder="Snippet shown on Google..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.is_active}
                    onChange={(e) => setEditingService({ ...editingService, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <span className="font-bold text-slate-800">Publish Service Live</span>
                </label>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsModalOpen(false)}
                    className="text-xs px-4 py-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="text-xs px-5 py-2 shadow-md shadow-accent/20 font-bold"
                  >
                    Save Service
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete Service Offering?"
        description={`Are you sure you want to delete "${confirmDelete?.title}"? All associated case study links and slug routes will be removed.`}
        confirmText="Delete Service"
        variant="danger"
      />
    </div>
  );
}
