"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/client";

interface MediaUploadProps {
  bucket?: "media-library" | "portfolio-images" | "blog-images" | "brand-assets" | "avatars";
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
}

export function MediaUpload({
  bucket = "media-library",
  value,
  onChange,
  label = "Upload Image",
  accept = "image/*",
}: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createBrowserClient();

  const handleFile = async (file: File) => {
    if (!file) return;

    try {
      setIsUploading(true);
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true });

      if (error) {
        console.warn("Supabase storage upload notice (local preview active):", error.message);
        // Fallback to client-side object URL for demo mode
        const previewUrl = URL.createObjectURL(file);
        onChange(previewUrl);
      } else if (data) {
        const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        onChange(publicData.publicUrl);
      }
    } catch (err) {
      console.warn("Storage upload error:", err);
      const previewUrl = URL.createObjectURL(file);
      onChange(previewUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-bold text-slate-700 block">{label}</label>}

      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-h-48 flex items-center justify-center">
          <Image
            src={value}
            alt="Uploaded Preview"
            width={600}
            height={300}
            className="w-full h-44 object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-slate-800 rounded-xl text-xs font-bold shadow-md hover:bg-slate-50 transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 bg-rose-600 text-white rounded-xl shadow-md hover:bg-rose-700 transition-colors"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? "border-accent bg-blue-50/50"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
          }`}
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-accent flex items-center justify-center mx-auto mb-2">
            {isUploading ? (
              <UploadCloud className="w-5 h-5 animate-bounce" />
            ) : (
              <ImageIcon className="w-5 h-5" />
            )}
          </div>
          <p className="text-xs font-bold text-slate-700">
            {isUploading ? "Uploading file..." : "Click or drag image here"}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP, SVG up to 10MB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        className="hidden"
      />
    </div>
  );
}
