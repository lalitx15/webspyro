"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X, Star, ExternalLink } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { DataTable, Column } from "@/components/admin/data-table";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { Button } from "@/components/ui/button";
import { MediaUpload } from "@/components/admin/media-upload";
import { createBrowserClient } from "@/lib/supabase/client";

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  category: "business" | "ecommerce" | "webapp";
  client: string;
  live_url?: string;
  image_url: string;
  tech_stack: string[];
  challenge?: string;
  solution?: string;
  result_stats?: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

const initialMockPortfolio: PortfolioItem[] = [
  {
    id: "proj-1",
    title: "Apex Logistics Global Fleet",
    slug: "apex-logistics",
    category: "webapp",
    client: "Apex Logistics Ltd",
    live_url: "https://apexlogistics.demo",
    image_url: "/portfolio/apex-logistics.webp",
    tech_stack: ["Next.js 14", "Tailwind CSS", "Framer Motion", "Supabase"],
    challenge: "Legacy slow portal with high drop-off rates and clunky shipment tracking.",
    solution: "Built a reactive, real-time portal with automated notifications and instant live tracking.",
    result_stats: "+140% faster bookings, 99.98% uptime, 4.9/5 client rating",
    is_featured: true,
    is_active: true,
    sort_order: 1,
  },
  {
    id: "proj-2",
    title: "Senskin Dermatology & Laser Clinic",
    slug: "senskin-clinic",
    category: "business",
    client: "Senskin Healthcare",
    live_url: "https://senskin.demo",
    image_url: "/portfolio/senskin.webp",
    tech_stack: ["Next.js 14", "Tailwind CSS", "Lucide Icons", "PostgreSQL"],
    challenge: "Outdated mobile experience resulting in poor conversion on local search.",
    solution: "Re-engineered with Soft Pastel glassmorphism, instant doctor booking, and sub-second load times.",
    result_stats: "+220% mobile consultation inquiries, #1 on local Google Maps",
    is_featured: true,
    is_active: true,
    sort_order: 2,
  },
  {
    id: "proj-3",
    title: "Artisanal Bakes Direct-to-Consumer",
    slug: "artisanal-bakes",
    category: "ecommerce",
    client: "Artisanal Bakes & Café",
    live_url: "https://artisanalbakes.demo",
    image_url: "/portfolio/artisanal-bakes.webp",
    tech_stack: ["Next.js 14", "Razorpay", "Supabase", "Tailwind CSS"],
    challenge: "High checkout abandonment due to multi-step slow payment gateway.",
    solution: "Streamlined 1-click Razorpay UPI checkout with dynamic coupon discounts.",
    result_stats: "₹18.4L monthly online revenue, 3.2x repeat order rate",
    is_featured: false,
    is_active: true,
    sort_order: 3,
  },
  {
    id: "proj-4",
    title: "FinEdge Wealth Advisory Hub",
    slug: "finedge-wealth",
    category: "webapp",
    client: "FinEdge Advisors",
    live_url: "https://finedge.demo",
    image_url: "/portfolio/finedge.webp",
    tech_stack: ["Next.js 14", "Recharts", "TypeScript", "Tailwind CSS"],
    challenge: "Needed interactive calculators and wealth simulation dashboards.",
    solution: "Custom interactive Recharts financial charts with instant lead capture funnels.",
    result_stats: "+85% user session duration, 64 qualified HNI leads/mo",
    is_featured: false,
    is_active: true,
    sort_order: 4,
  },
];

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioItem[]>(initialMockPortfolio);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingProject, setEditingProject] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<PortfolioItem | null>(null);
  const [techTagInput, setTechTagInput] = useState("");

  const supabase = useMemo(() => createBrowserClient(), []);

  const fetchPortfolio = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setProjects(data as unknown as PortfolioItem[]);
      }
    } catch {
      // Demo safety
    }
  }, [supabase]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const handleAddNew = () => {
    setEditingProject({
      id: `proj-${Date.now()}`,
      title: "",
      slug: "",
      category: "business",
      client: "",
      live_url: "",
      image_url: "",
      tech_stack: ["Next.js 14", "Tailwind CSS"],
      challenge: "",
      solution: "",
      result_stats: "",
      is_featured: false,
      is_active: true,
      sort_order: projects.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (project: PortfolioItem) => {
    setEditingProject({ ...project });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title) return;

    const exists = projects.some((p) => p.id === editingProject.id);
    let updated: PortfolioItem[];

    if (exists) {
      updated = projects.map((p) => (p.id === editingProject.id ? editingProject : p));
    } else {
      updated = [...projects, editingProject];
    }

    setProjects(updated);
    setIsModalOpen(false);

    try {
      await supabase.from("portfolio_projects").upsert({
        id: editingProject.id,
        title: editingProject.title,
        slug: editingProject.slug || editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category: editingProject.category,
        client: editingProject.client,
        live_url: editingProject.live_url || null,
        image_url: editingProject.image_url,
        tech_stack: editingProject.tech_stack,
        is_featured: editingProject.is_featured,
        is_active: editingProject.is_active,
        sort_order: editingProject.sort_order,
      });
    } catch {
      // Demo fallback
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const next = projects.filter((p) => p.id !== confirmDelete.id);
    setProjects(next);
    setConfirmDelete(null);

    try {
      await supabase.from("portfolio_projects").delete().eq("id", confirmDelete.id);
    } catch {
      // Demo fallback
    }
  };

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  const columns: Column<PortfolioItem>[] = [
    {
      key: "title",
      header: "Project & Client",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-10 rounded-xl bg-slate-100 overflow-hidden relative flex-shrink-0 border border-slate-200">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                No Img
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-slate-900 leading-snug">{item.title}</h4>
              {item.is_featured && (
                <span className="p-0.5 text-amber-500 bg-amber-50 rounded" title="Featured Case Study">
                  <Star className="w-3 h-3 fill-amber-500" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">{item.client}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (item) => (
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${
            item.category === "ecommerce"
              ? "bg-purple-50 text-purple-700 border border-purple-200"
              : item.category === "webapp"
              ? "bg-teal-50 text-teal-700 border border-teal-200"
              : "bg-blue-50 text-accent border border-blue-200"
          }`}
        >
          {item.category}
        </span>
      ),
    },
    {
      key: "tech_stack",
      header: "Tech Stack",
      render: (item) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {item.tech_stack.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
          {item.tech_stack.length > 3 && (
            <span className="text-[10px] text-slate-400">+{item.tech_stack.length - 3}</span>
          )}
        </div>
      ),
    },
    {
      key: "live_url",
      header: "Live Link",
      render: (item) =>
        item.live_url ? (
          <a
            href={item.live_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
          >
            <span>Visit</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-slate-400 text-xs">Private Staging</span>
        ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (item) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
            item.is_active
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-slate-100 text-slate-400"
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
            title="Edit Project"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setConfirmDelete(item)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Delete Project"
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
        title="Portfolio Showcase CMS"
        subtitle="Manage client case studies, live previews, tech tags, and metrics."
      />

      <div className="px-4 sm:px-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === "all" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => setSelectedCategory("business")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === "business" ? "bg-accent text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Business Websites
            </button>
            <button
              onClick={() => setSelectedCategory("ecommerce")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === "ecommerce" ? "bg-purple-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              E-Commerce
            </button>
            <button
              onClick={() => setSelectedCategory("webapp")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === "webapp" ? "bg-teal-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Web Apps
            </button>
          </div>

          <Button
            variant="primary"
            onClick={handleAddNew}
            className="text-xs px-3.5 py-1.5 h-9 rounded-2xl gap-1.5 shadow-md shadow-accent/20 font-bold self-end sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={filteredProjects}
          searchPlaceholder="Search portfolio by title, client, tech tag..."
          searchKeys={["title", "client"]}
        />
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 max-h-[92vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {projects.some((p) => p.id === editingProject.id) ? "Edit Case Study" : "Add Portfolio Project"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure live demo URLs, screenshots, tech tags, and quantifiable results.
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
                  <label className="font-bold text-slate-700 block mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                      setEditingProject({ ...editingProject, title, slug });
                    }}
                    placeholder="e.g. Apex Logistics Global Fleet"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.client}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    placeholder="e.g. Apex Logistics Ltd"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        category: e.target.value as "business" | "ecommerce" | "webapp",
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent capitalize"
                  >
                    <option value="business">Business Website</option>
                    <option value="ecommerce">E-Commerce Store</option>
                    <option value="webapp">Web Application</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={editingProject.slug}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    placeholder="e.g. apex-logistics"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Live URL (optional)</label>
                  <input
                    type="url"
                    value={editingProject.live_url || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, live_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <MediaUpload
                bucket="portfolio-images"
                label="Case Study Cover Image / Screenshot"
                value={editingProject.image_url}
                onChange={(url) => setEditingProject({ ...editingProject, image_url: url })}
              />

              {/* Tech Stack Chips */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Tech Stack Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techTagInput}
                    onChange={(e) => setTechTagInput(e.target.value)}
                    placeholder="e.g. Next.js 14, Razorpay, Supabase..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      if (techTagInput.trim()) {
                        setEditingProject({
                          ...editingProject,
                          tech_stack: [...editingProject.tech_stack, techTagInput.trim()],
                        });
                        setTechTagInput("");
                      }
                    }}
                    className="text-xs px-3"
                  >
                    Add Tag
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {editingProject.tech_stack.map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-xl text-[11px] font-medium"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingProject.tech_stack.filter((_, idx) => idx !== i);
                          setEditingProject({ ...editingProject, tech_stack: updated });
                        }}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Case Study Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Challenge Summary</label>
                  <textarea
                    rows={2}
                    value={editingProject.challenge || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, challenge: e.target.value })}
                    placeholder="What problem did the client face?"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Engineering Solution</label>
                  <textarea
                    rows={2}
                    value={editingProject.solution || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                    placeholder="How did Webspyra solve it?"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Quantifiable Result Metrics</label>
                <input
                  type="text"
                  value={editingProject.result_stats || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, result_stats: e.target.value })}
                  placeholder="e.g. +140% faster bookings, 99.98% uptime, 4.9/5 rating"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent font-semibold text-emerald-700"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.is_featured}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, is_featured: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                    />
                    <span className="font-bold text-slate-800">Featured on Home Slider</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.is_active}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, is_active: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-accent focus:ring-accent"
                    />
                    <span className="font-bold text-slate-800">Published</span>
                  </label>
                </div>

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
                    Save Project
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
        title="Delete Portfolio Case Study?"
        description={`Are you sure you want to delete "${confirmDelete?.title}"? It will no longer appear on public showcases.`}
        confirmText="Delete Project"
        variant="danger"
      />
    </div>
  );
}
