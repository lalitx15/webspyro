"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Edit2, Trash2, X, Globe, Eye, FileText } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { DataTable, Column } from "@/components/admin/data-table";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { MediaUpload } from "@/components/admin/media-upload";
import { createBrowserClient } from "@/lib/supabase/client";

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  tags: string[];
  reading_time: string;
  is_published: boolean;
  published_at: string;
  seo_title?: string;
  seo_description?: string;
}

const initialMockPosts: BlogPostItem[] = [
  {
    id: "post-1",
    title: "Why Soft Pastel Glassmorphism Outconverts Flat Corporate Websites in 2026",
    slug: "why-soft-pastel-glassmorphism-converts",
    excerpt: "Discover the psychological impact of Apple Vision Pro-inspired translucent aesthetics, depth, and micro-animations on consumer trust and checkout rates.",
    content: "<h2>The Evolution of Agency Aesthetics</h2><p>For nearly a decade, corporate web design was dominated by harsh dark modes or flat, sterile white grids. In 2026, modern customers demand depth, tactile feedback, and sensory warmth.</p><h3>The Psychological Trigger of Translucency</h3><p>When users see frosted glass cards floating gracefully with subtle spring physics over soft pastel gradients, subconscious perception of product quality increases by over 40%.</p>",
    cover_image: "/blog/glassmorphism-ux.webp",
    category: "Design & UX",
    tags: ["UI/UX", "Glassmorphism", "Conversion Rate", "Next.js"],
    reading_time: "5 min read",
    is_published: true,
    published_at: "2026-10-12T10:00:00.000Z",
    seo_title: "Soft Pastel Glassmorphism in 2026 Web Design | Webspyra",
    seo_description: "Learn how soft pastel aesthetics and micro-animations double lead conversions.",
  },
  {
    id: "post-2",
    title: "Eliminating Mobile Lag: How Next.js 14 and 100dvh Deliver True Native App Feel",
    slug: "eliminating-mobile-lag-nextjs-100dvh",
    excerpt: "A deep technical breakdown of touch-action manipulation, preventing iOS viewport auto-zoom, and 60fps Framer Motion execution.",
    content: "<h2>Zero Browser Zoom, 100% App Feel</h2><p>Browsers on iOS and Android frequently suffer from double-tap zooming, navigation bar shifting, and elastic bounce back that ruin the feeling of a professional product.</p><p>By enforcing touch-action manipulation, gesture listeners, and safe area insets, your web application runs indistinguishable from native App Store binaries.</p>",
    cover_image: "/blog/mobile-performance.webp",
    category: "Engineering",
    tags: ["Performance", "Mobile", "Next.js", "PWA"],
    reading_time: "7 min read",
    is_published: true,
    published_at: "2026-10-08T14:30:00.000Z",
    seo_title: "Next.js 14 Mobile App-Like Performance Guide | Webspyra",
    seo_description: "How to eliminate touch lag, viewport shifting, and deliver 60fps web apps.",
  },
  {
    id: "post-3",
    title: "The Ultimate Guide to Razorpay UPI Checkout Optimization for Indian E-Commerce",
    slug: "razorpay-upi-checkout-optimization-guide",
    excerpt: "How automated GST invoicing, 1-click UPI intents, and instantaneous webhook reconciliation decrease drop-offs by 34%.",
    content: "<h2>Friction is the Killer of Online Sales</h2><p>In the Indian market, requiring customers to type credit card numbers or wait for slow bank OTPs results in an immediate 35% cart abandonment.</p><p>Implementing direct UPI app switches, pre-calculated GST summaries, and dynamic coupon discount recalculations ensures lightning-fast checkouts.</p>",
    cover_image: "/blog/razorpay-guide.webp",
    category: "E-Commerce",
    tags: ["Razorpay", "UPI", "E-Commerce", "Growth"],
    reading_time: "6 min read",
    is_published: true,
    published_at: "2026-09-28T09:15:00.000Z",
    seo_title: "Razorpay UPI Checkout Optimization Guide | Webspyra",
    seo_description: "Streamline online payments in India with 1-click UPI and automated GST invoicing.",
  },
];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostItem[]>(initialMockPosts);
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<BlogPostItem | null>(null);
  const [tagInput, setTagInput] = useState("");

  const supabase = useMemo(() => createBrowserClient(), []);

  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setPosts(data as unknown as BlogPostItem[]);
      }
    } catch {
      // Demo safety
    }
  }, [supabase]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleAddNew = () => {
    setEditingPost({
      id: `post-${Date.now()}`,
      title: "",
      slug: "",
      excerpt: "",
      content: "<p>Start writing your high-quality article with TipTap...</p>",
      cover_image: "",
      category: "Design & UX",
      tags: ["Webspyra", "Web Dev"],
      reading_time: "5 min read",
      is_published: true,
      published_at: new Date().toISOString(),
      seo_title: "",
      seo_description: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (post: BlogPostItem) => {
    setEditingPost({ ...post });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editingPost.title) return;

    const exists = posts.some((p) => p.id === editingPost.id);
    let updated: BlogPostItem[];

    if (exists) {
      updated = posts.map((p) => (p.id === editingPost.id ? editingPost : p));
    } else {
      updated = [editingPost, ...posts];
    }

    setPosts(updated);
    setIsModalOpen(false);

    try {
      await supabase.from("blog_posts").upsert({
        id: editingPost.id,
        title: editingPost.title,
        slug: editingPost.slug || editingPost.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        excerpt: editingPost.excerpt,
        content: editingPost.content,
        cover_image: editingPost.cover_image || null,
        category: editingPost.category,
        tags: editingPost.tags,
        reading_time: editingPost.reading_time,
        is_published: editingPost.is_published,
        published_at: editingPost.published_at,
      });
    } catch {
      // Demo fallback
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const next = posts.filter((p) => p.id !== confirmDelete.id);
    setPosts(next);
    setConfirmDelete(null);

    try {
      await supabase.from("blog_posts").delete().eq("id", confirmDelete.id);
    } catch {
      // Demo fallback
    }
  };

  const columns: Column<BlogPostItem>[] = [
    {
      key: "title",
      header: "Article & Slug",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-10 rounded-xl bg-slate-100 overflow-hidden relative flex-shrink-0 border border-slate-200">
            {item.cover_image ? (
              <Image src={item.cover_image} alt={item.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <FileText className="w-4 h-4" />
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 leading-snug line-clamp-1 max-w-md">
              {item.title}
            </h4>
            <p className="text-[11px] text-slate-400 font-mono">/blog/{item.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (item) => (
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-accent border border-blue-200">
          {item.category}
        </span>
      ),
    },
    {
      key: "reading_time",
      header: "Reading Time",
      render: (item) => <span className="text-xs text-slate-500 font-medium">{item.reading_time}</span>,
    },
    {
      key: "published_at",
      header: "Published",
      sortable: true,
      render: (item) => (
        <div className="text-xs text-slate-500">
          <p className="font-medium text-slate-700">
            {new Date(item.published_at).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <span
            className={`text-[10px] font-bold uppercase ${
              item.is_published ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            {item.is_published ? "Live" : "Draft"}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/blog/${item.slug}`}
            target="_blank"
            className="p-1.5 text-slate-400 hover:text-accent rounded-lg hover:bg-slate-100 transition-colors"
            title="Preview Live Article"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => handleEdit(item)}
            className="p-1.5 text-slate-400 hover:text-accent rounded-lg hover:bg-blue-50 transition-colors"
            title="Edit Article"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setConfirmDelete(item)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Delete Article"
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
        title="Blog & Articles CMS"
        subtitle="Author technical articles, thought leadership, and SEO content with TipTap."
      />

      <div className="px-4 sm:px-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Articles & Insights</h3>
            <p className="text-xs text-slate-400">Total {posts.length} published blogs</p>
          </div>
          <Button
            variant="primary"
            onClick={handleAddNew}
            className="text-xs px-3.5 py-1.5 h-9 rounded-2xl gap-1.5 shadow-md shadow-accent/20 font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Write New Post</span>
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={posts}
          searchPlaceholder="Search articles by title, slug, category..."
          searchKeys={["title", "slug", "category", "excerpt"]}
        />
      </div>

      {/* FULL-SIZE EDITOR MODAL */}
      {isModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />

          <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 max-h-[94vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {posts.some((p) => p.id === editingPost.id) ? "Edit Article" : "Compose New Article"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  TipTap rich text editor with headings, formatted quotes, and live cover image preview.
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
                  <label className="font-bold text-slate-700 block mb-1">Article Headline *</label>
                  <input
                    type="text"
                    required
                    value={editingPost.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                      setEditingPost({ ...editingPost, title, slug });
                    }}
                    placeholder="e.g. Why Soft Pastel Aesthetics Win in 2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingPost.slug}
                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                    placeholder="e.g. why-soft-pastel-aesthetics-win"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={editingPost.category}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="Design & UX">Design & UX</option>
                    <option value="Engineering">Engineering</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="SEO & Growth">SEO & Growth</option>
                    <option value="Agency News">Agency News</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estimated Reading Time</label>
                  <input
                    type="text"
                    value={editingPost.reading_time}
                    onChange={(e) => setEditingPost({ ...editingPost, reading_time: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Excerpt (Meta & Card Summary) *</label>
                <textarea
                  rows={2}
                  required
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  placeholder="Compelling 2-3 sentence overview of the article..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent resize-none leading-relaxed"
                />
              </div>

              {/* TipTap Rich Text Editor */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Body Content (TipTap WYSIWYG Editor)
                </label>
                <RichTextEditor
                  content={editingPost.content}
                  onChange={(html) => setEditingPost({ ...editingPost, content: html })}
                  minHeight="260px"
                />
              </div>

              {/* Cover Image Upload */}
              <MediaUpload
                bucket="blog-images"
                label="Article Hero Cover Image"
                value={editingPost.cover_image}
                onChange={(url) => setEditingPost({ ...editingPost, cover_image: url })}
              />

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a topic tag..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      if (tagInput.trim()) {
                        setEditingPost({
                          ...editingPost,
                          tags: [...editingPost.tags, tagInput.trim()],
                        });
                        setTagInput("");
                      }
                    }}
                    className="text-xs px-3"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {editingPost.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-xl text-[11px]"
                    >
                      <span>#{t}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingPost.tags.filter((_, i) => i !== idx);
                          setEditingPost({ ...editingPost, tags: updated });
                        }}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* SEO Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                  <Globe className="w-3.5 h-3.5 text-accent" />
                  <span>Article SEO Optimization</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Custom SEO Title</label>
                    <input
                      type="text"
                      value={editingPost.seo_title || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, seo_title: e.target.value })}
                      placeholder="Title for Google search results..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Meta Description</label>
                    <input
                      type="text"
                      value={editingPost.seo_description || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, seo_description: e.target.value })}
                      placeholder="Description for social shares & search..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPost.is_published}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, is_published: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <span className="font-bold text-slate-800">Publish Article Live</span>
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
                    Save Article
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
        title="Delete Article?"
        description={`Are you sure you want to permanently delete "${confirmDelete?.title}"?`}
        confirmText="Delete Article"
        variant="danger"
      />
    </div>
  );
}
