"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X, Star, CheckCircle2, XCircle } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { DataTable, Column } from "@/components/admin/data-table";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { Button } from "@/components/ui/button";
import { MediaUpload } from "@/components/admin/media-upload";
import { createBrowserClient } from "@/lib/supabase/client";

interface TestimonialItem {
  id: string;
  client_name: string;
  role_title: string;
  company: string;
  avatar_url?: string;
  rating: number;
  content: string;
  project_type: string;
  is_approved: boolean;
  is_featured: boolean;
  sort_order: number;
}

const initialMockTestimonials: TestimonialItem[] = [
  {
    id: "test-1",
    client_name: "Vikram Malhotra",
    role_title: "Managing Director",
    company: "Apex Logistics Ltd",
    avatar_url: "/testimonials/vikram.webp",
    rating: 5,
    content: "Webspyra completely redefined how our clients interact with us online. The booking engine is ultra fast and our inbound leads doubled within 30 days of launch.",
    project_type: "Web Application",
    is_approved: true,
    is_featured: true,
    sort_order: 1,
  },
  {
    id: "test-2",
    client_name: "Dr. Ananya Sen",
    role_title: "Founder & Lead Dermatologist",
    company: "Senskin Clinic",
    avatar_url: "/testimonials/ananya.webp",
    rating: 5,
    content: "The soft pastel design aesthetic matches our clinic's premium aesthetic perfectly. Patients love the fast appointment booking on mobile.",
    project_type: "Business Website",
    is_approved: true,
    is_featured: true,
    sort_order: 2,
  },
  {
    id: "test-3",
    client_name: "Sameer Joshi",
    role_title: "Head of Marketing",
    company: "Artisanal Bakes",
    avatar_url: "/testimonials/sameer.webp",
    rating: 5,
    content: "Razorpay payment integration was completely seamless. We had our entire online bakery store live in under 10 days with zero bugs.",
    project_type: "E-Commerce Store",
    is_approved: true,
    is_featured: false,
    sort_order: 3,
  },
  {
    id: "test-4",
    client_name: "Pooja Verma",
    role_title: "Co-Founder",
    company: "FinEdge Wealth",
    avatar_url: "/testimonials/pooja.webp",
    rating: 4,
    content: "Great attention to detail and animations. The team was responsive on WhatsApp and delivered ahead of our scheduled investor pitch.",
    project_type: "Web Application",
    is_approved: false,
    is_featured: false,
    sort_order: 4,
  },
];

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialMockTestimonials);
  const [filterApproved, setFilterApproved] = useState<"all" | "approved" | "pending">("all");
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<TestimonialItem | null>(null);

  const supabase = useMemo(() => createBrowserClient(), []);

  const fetchTestimonials = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setTestimonials(data as unknown as TestimonialItem[]);
      }
    } catch {
      // Demo safety
    }
  }, [supabase]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleAddNew = () => {
    setEditingItem({
      id: `test-${Date.now()}`,
      client_name: "",
      role_title: "Founder",
      company: "",
      avatar_url: "",
      rating: 5,
      content: "",
      project_type: "Business Website",
      is_approved: true,
      is_featured: false,
      sort_order: testimonials.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: TestimonialItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleToggleApproval = async (item: TestimonialItem) => {
    const nextApproved = !item.is_approved;
    const updated = testimonials.map((t) =>
      t.id === item.id ? { ...t, is_approved: nextApproved } : t
    );
    setTestimonials(updated);

    try {
      await supabase.from("testimonials").update({ is_approved: nextApproved }).eq("id", item.id);
    } catch {
      // Demo fallback
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.client_name || !editingItem.content) return;

    const exists = testimonials.some((t) => t.id === editingItem.id);
    let updated: TestimonialItem[];

    if (exists) {
      updated = testimonials.map((t) => (t.id === editingItem.id ? editingItem : t));
    } else {
      updated = [...testimonials, editingItem];
    }

    setTestimonials(updated);
    setIsModalOpen(false);

    try {
      await supabase.from("testimonials").upsert({
        id: editingItem.id,
        client_name: editingItem.client_name,
        role_title: editingItem.role_title,
        company: editingItem.company,
        avatar_url: editingItem.avatar_url || null,
        rating: editingItem.rating,
        content: editingItem.content,
        project_type: editingItem.project_type,
        is_approved: editingItem.is_approved,
        is_featured: editingItem.is_featured,
        sort_order: editingItem.sort_order,
      });
    } catch {
      // Demo fallback
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const next = testimonials.filter((t) => t.id !== confirmDelete.id);
    setTestimonials(next);
    setConfirmDelete(null);

    try {
      await supabase.from("testimonials").delete().eq("id", confirmDelete.id);
    } catch {
      // Demo fallback
    }
  };

  const filteredTestimonials = useMemo(() => {
    if (filterApproved === "approved") return testimonials.filter((t) => t.is_approved);
    if (filterApproved === "pending") return testimonials.filter((t) => !t.is_approved);
    return testimonials;
  }, [testimonials, filterApproved]);

  const columns: Column<TestimonialItem>[] = [
    {
      key: "client_name",
      header: "Client & Company",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden relative flex-shrink-0 border border-slate-200">
            {item.avatar_url ? (
              <Image src={item.avatar_url} alt={item.client_name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 text-xs">
                {item.client_name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 leading-snug">{item.client_name}</h4>
            <p className="text-[11px] text-slate-400">
              {item.role_title}, {item.company}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (item) => (
        <div className="flex items-center gap-0.5 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < item.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      key: "content",
      header: "Review Excerpt",
      render: (item) => (
        <p className="text-xs text-slate-600 max-w-sm line-clamp-2 italic leading-relaxed">
          &quot;{item.content}&quot;
        </p>
      ),
    },
    {
      key: "is_approved",
      header: "Moderation Status",
      render: (item) => (
        <button
          onClick={() => handleToggleApproval(item)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
            item.is_approved
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
              : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
          }`}
          title="Click to toggle approval"
        >
          {item.is_approved ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approved</span>
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5" />
              <span>Pending Review</span>
            </>
          )}
        </button>
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
            title="Edit Review"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setConfirmDelete(item)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Delete Review"
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
        title="Client Testimonials & Reviews"
        subtitle="Review, approve, and showcase verified client feedback."
      />

      <div className="px-4 sm:px-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterApproved("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterApproved === "all" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All Reviews ({testimonials.length})
            </button>
            <button
              onClick={() => setFilterApproved("approved")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterApproved === "approved" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Approved ({testimonials.filter((t) => t.is_approved).length})
            </button>
            <button
              onClick={() => setFilterApproved("pending")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterApproved === "pending" ? "bg-amber-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Needs Moderation ({testimonials.filter((t) => !t.is_approved).length})
            </button>
          </div>

          <Button
            variant="primary"
            onClick={handleAddNew}
            className="text-xs px-3.5 py-1.5 h-9 rounded-2xl gap-1.5 shadow-md shadow-accent/20 font-bold self-end sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Testimonial</span>
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={filteredTestimonials}
          searchPlaceholder="Search reviews by client, company, content..."
          searchKeys={["client_name", "company", "content"]}
        />
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />

          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {testimonials.some((t) => t.id === editingItem.id) ? "Edit Testimonial" : "Add Testimonial"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Publish verified client quotes and star ratings.
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
                  <label className="font-bold text-slate-700 block mb-1">Client Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.client_name}
                    onChange={(e) => setEditingItem({ ...editingItem, client_name: e.target.value })}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.company}
                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                    placeholder="e.g. Apex Logistics Ltd"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Designation / Role</label>
                  <input
                    type="text"
                    value={editingItem.role_title}
                    onChange={(e) => setEditingItem({ ...editingItem, role_title: e.target.value })}
                    placeholder="e.g. Managing Director"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rating (Stars)</label>
                  <select
                    value={editingItem.rating}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent font-bold"
                  >
                    <option value={5}>5 Stars - Outstanding</option>
                    <option value={4}>4 Stars - Great</option>
                    <option value={3}>3 Stars - Average</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Testimonial Quote *</label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.content}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  placeholder="Paste client's review text here..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent resize-none leading-relaxed"
                />
              </div>

              <MediaUpload
                bucket="avatars"
                label="Client Avatar Photo"
                value={editingItem.avatar_url}
                onChange={(url) => setEditingItem({ ...editingItem, avatar_url: url })}
              />

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.is_approved}
                      onChange={(e) => setEditingItem({ ...editingItem, is_approved: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600"
                    />
                    <span className="font-bold text-slate-800">Approved & Live</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.is_featured}
                      onChange={(e) => setEditingItem({ ...editingItem, is_featured: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                    />
                    <span className="font-bold text-slate-800">Featured</span>
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
                    Save Review
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
        title="Delete Testimonial?"
        description={`Are you sure you want to delete the review by "${confirmDelete?.client_name}"?`}
        confirmText="Delete Review"
        variant="danger"
      />
    </div>
  );
}
