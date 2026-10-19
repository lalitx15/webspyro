"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Copy,
  Check,
  Trash2,
  Eye,
  X,
  Search,
  FolderOpen,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@/lib/supabase/client";

interface MediaFile {
  id: string;
  name: string;
  bucket: string;
  size: string;
  url: string;
  created_at: string;
}

const initialMockMedia: MediaFile[] = [
  {
    id: "med-1",
    name: "hero-gradient-art.webp",
    bucket: "brand-assets",
    size: "248 KB",
    url: "/media/hero-art.webp",
    created_at: "2026-10-15T09:30:00.000Z",
  },
  {
    id: "med-2",
    name: "apex-logistics-preview.webp",
    bucket: "portfolio-images",
    size: "412 KB",
    url: "/portfolio/apex-logistics.webp",
    created_at: "2026-10-14T14:15:00.000Z",
  },
  {
    id: "med-3",
    name: "senskin-clinic-mockup.webp",
    bucket: "portfolio-images",
    size: "385 KB",
    url: "/portfolio/senskin.webp",
    created_at: "2026-10-14T11:20:00.000Z",
  },
  {
    id: "med-4",
    name: "glassmorphism-ux-article.webp",
    bucket: "blog-images",
    size: "520 KB",
    url: "/blog/glassmorphism-ux.webp",
    created_at: "2026-10-12T16:45:00.000Z",
  },
  {
    id: "med-5",
    name: "mobile-performance-chart.webp",
    bucket: "blog-images",
    size: "310 KB",
    url: "/blog/mobile-performance.webp",
    created_at: "2026-10-10T12:00:00.000Z",
  },
  {
    id: "med-6",
    name: "webspyra-logo-dark.svg",
    bucket: "brand-assets",
    size: "18 KB",
    url: "/brand/logo-dark.svg",
    created_at: "2026-10-01T08:00:00.000Z",
  },
];

const BUCKETS = [
  { id: "all", label: "All Buckets" },
  { id: "brand-assets", label: "Brand Assets" },
  { id: "portfolio-images", label: "Portfolio Images" },
  { id: "blog-images", label: "Blog Images" },
  { id: "media-library", label: "General Media" },
];

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaFile[]>(initialMockMedia);
  const [selectedBucket, setSelectedBucket] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaFile | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<MediaFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const supabase = useMemo(() => createBrowserClient(), []);

  // Fetch Storage files
  const fetchStorageFiles = useCallback(async () => {
    try {
      const bucketName = selectedBucket === "all" ? "media-library" : selectedBucket;
      const { data, error } = await supabase.storage.from(bucketName).list();

      if (!error && data && data.length > 0) {
        const mapped: MediaFile[] = data.map((item) => {
          const { data: pubData } = supabase.storage.from(bucketName).getPublicUrl(item.name);
          return {
            id: item.id || item.name,
            name: item.name,
            bucket: bucketName,
            size: `${(item.metadata?.size ? item.metadata.size / 1024 : 120).toFixed(0)} KB`,
            url: pubData.publicUrl,
            created_at: item.created_at || new Date().toISOString(),
          };
        });

        // Merge unique
        const existingNames = new Set(initialMockMedia.map((m) => m.name));
        const newOnes = mapped.filter((m) => !existingNames.has(m.name));
        setMediaList([...newOnes, ...initialMockMedia]);
      }
    } catch {
      // Demo safety
    }
  }, [supabase, selectedBucket]);

  useEffect(() => {
    fetchStorageFiles();
  }, [fetchStorageFiles]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const targetBucket = selectedBucket === "all" ? "media-library" : selectedBucket;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

        const { data } = await supabase.storage
          .from(targetBucket)
          .upload(safeName, file, { upsert: true });

        const objectUrl = data
          ? supabase.storage.from(targetBucket).getPublicUrl(data.path).data.publicUrl
          : URL.createObjectURL(file);

        const newEntry: MediaFile = {
          id: `upload-${Date.now()}-${i}`,
          name: file.name,
          bucket: targetBucket,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          url: objectUrl,
          created_at: new Date().toISOString(),
        };

        setMediaList((prev) => [newEntry, ...prev]);
      }
    } catch {
      // Demo safety
    } finally {
      setIsUploading(false);
    }
  };

  const copyUrl = (item: MediaFile) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setMediaList((prev) => prev.filter((m) => m.id !== confirmDelete.id));
    const target = confirmDelete;
    setConfirmDelete(null);

    try {
      await supabase.storage.from(target.bucket).remove([target.name]);
    } catch {
      // Demo safety
    }
  };

  // Filtered files
  const filteredList = useMemo(() => {
    return mediaList.filter((item) => {
      const matchesBucket = selectedBucket === "all" || item.bucket === selectedBucket;
      const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesBucket && matchesQuery;
    });
  }, [mediaList, selectedBucket, searchQuery]);

  return (
    <div className="space-y-6">
      <AdminHeader
        onMobileMenuToggle={() => {}}
        title="Supabase Media & Storage Library"
        subtitle="Manage uploaded screenshots, blog hero graphics, branding assets, and client files."
      />

      <div className="px-4 sm:px-6 space-y-6 max-w-7xl mx-auto">
        {/* Upload Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileUpload(e.dataTransfer.files);
          }}
          className="bg-white rounded-3xl p-6 border-2 border-dashed border-slate-200 hover:border-accent hover:bg-blue-50/20 transition-all text-center space-y-2 cursor-pointer shadow-2xs"
          onClick={() => document.getElementById("media-file-input")?.click()}
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-accent flex items-center justify-center mx-auto">
            <UploadCloud className={`w-6 h-6 ${isUploading ? "animate-bounce" : ""}`} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              {isUploading ? "Uploading to Cloud Storage..." : "Drag & drop files to upload"}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Target bucket: <strong className="text-accent">{selectedBucket === "all" ? "media-library" : selectedBucket}</strong> • WEBP, PNG, JPG, SVG up to 25MB
            </p>
          </div>
          <input
            id="media-file-input"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
          {/* Buckets Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {BUCKETS.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBucket(b.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedBucket === b.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search file name..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredList.map((item) => {
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Hover Overlay Buttons */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPreviewMedia(item)}
                      className="p-2 bg-white text-slate-800 rounded-xl shadow-md hover:bg-slate-100 transition-colors"
                      title="Preview Image"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyUrl(item)}
                      className="p-2 bg-white text-slate-800 rounded-xl shadow-md hover:bg-slate-100 transition-colors"
                      title="Copy Public URL"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(item)}
                      className="p-2 bg-rose-600 text-white rounded-xl shadow-md hover:bg-rose-700 transition-colors"
                      title="Delete File"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info Footer */}
                <div className="p-3 text-xs space-y-1">
                  <p className="font-bold text-slate-800 truncate" title={item.name}>
                    {item.name}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                      {item.bucket}
                    </span>
                    <span>{item.size}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredList.length === 0 && (
            <div className="col-span-full py-16 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No media files found</h4>
              <p className="text-xs text-slate-400">
                Upload images or try selecting another bucket.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FULL PREVIEW LIGHTBOX */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setPreviewMedia(null)} className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm" />

          <div className="relative w-full max-w-3xl bg-white rounded-3xl p-5 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 truncate">{previewMedia.name}</h4>
                <p className="text-xs text-slate-400">{previewMedia.bucket} • {previewMedia.size}</p>
              </div>
              <button
                onClick={() => setPreviewMedia(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
              <Image src={previewMedia.url} alt={previewMedia.name} fill className="object-contain" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <input
                type="text"
                readOnly
                value={previewMedia.url}
                className="flex-1 mr-3 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-600"
              />
              <Button
                variant="primary"
                onClick={() => copyUrl(previewMedia)}
                className="text-xs px-3.5 py-1.5 h-8 gap-1 font-bold"
              >
                {copiedId === previewMedia.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === previewMedia.id ? "Copied!" : "Copy URL"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete Storage Asset?"
        description={`Are you sure you want to permanently delete "${confirmDelete?.name}" from ${confirmDelete?.bucket}? Any active pages or blog posts using this URL will show a broken image.`}
        confirmText="Delete File"
        variant="danger"
      />
    </div>
  );
}
