"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sliders,
  Save,
  Building2,
  Mail,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  DollarSign,
  Share2,
  Eye,
  RefreshCw,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { MediaUpload } from "@/components/admin/media-upload";
import { useToast } from "@/components/ui/toast";
import { SiteSettings } from "@/types";

export default function AdminSettingsPage() {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<"brand" | "contact" | "business" | "social">("brand");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState<SiteSettings>({
    id: "",
    site_name: "Webspyra",
    tagline: "Next-Gen Web Development Agency",
    logo_url: "",
    logo_inverted_url: "",
    favicon_url: "",
    contact_email: "contact@webspyra.com",
    contact_phone: "+91 98765 43210",
    whatsapp_number: "+91 98765 43210",
    whatsapp_default_message: "Hi Webspyra, I am looking for a new website. How can we proceed further?",
    address: "Cyber City, Gurugram, Haryana, India",
    map_embed_url: "",
    working_hours: "Mon - Sat: 9:00 AM - 7:00 PM",
    currency: "INR",
    gst_percentage: 18,
    live_chat_enabled: true,
    social_links: {
      instagram: "https://instagram.com/webspyra",
      facebook: "https://facebook.com/webspyra",
      x: "https://x.com/webspyra",
      linkedin: "https://linkedin.com/company/webspyra",
      youtube: "https://youtube.com/@webspyra",
    },
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setSettings({
              ...data.settings,
              social_links: data.settings.social_links || {},
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
        error("Error loading settings", "Using local defaults instead.");
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, [error]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update settings");
      }

      success(
        "Settings Saved Successfully!",
        "Your brand and site settings have been updated across the website."
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving settings";
      error("Failed to save", msg);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSocialLink = (platform: string, url: string) => {
    setSettings((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: url,
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="w-8 h-8 text-accent animate-spin" />
        <p className="text-sm font-medium text-textSecondary">Loading brand and site settings...</p>
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
              <Sliders className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold font-heading text-textPrimary">Brand & Site Settings</h1>
          </div>
          <p className="text-sm text-textSecondary mt-1">
            Configure dynamic brand logos, contact info, working hours, GST, social links, and live chat.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-accent text-white font-medium hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save All Changes
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-borderGlass overflow-x-auto pb-px">
        {[
          { id: "brand", label: "Brand & Logo", icon: Sparkles },
          { id: "contact", label: "Contact & Address", icon: Building2 },
          { id: "business", label: "Business & Chat", icon: DollarSign },
          { id: "social", label: "Social Links", icon: Share2 },
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

      <form onSubmit={handleSave} className="space-y-8">
        {/* TAB 1: Brand & Logo */}
        {activeTab === "brand" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-3xl bg-surface backdrop-blur-xl border border-borderGlass shadow-glass space-y-6">
                <h3 className="text-lg font-bold font-heading text-textPrimary flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  General Identity
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                      Brand / Company Name
                    </label>
                    <input
                      type="text"
                      value={settings.site_name}
                      onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none transition-all text-sm font-medium text-textPrimary"
                      placeholder="e.g. Webspyra"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                      Brand Tagline
                    </label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none transition-all text-sm font-medium text-textPrimary"
                      placeholder="e.g. Next-Gen Web Development Agency"
                    />
                  </div>
                </div>
              </div>

              {/* Logo Uploads */}
              <div className="p-6 rounded-3xl bg-surface backdrop-blur-xl border border-borderGlass shadow-glass space-y-6">
                <h3 className="text-lg font-bold font-heading text-textPrimary flex items-center gap-2">
                  <Eye className="w-5 h-5 text-accent" />
                  Logos & Graphics
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                      Primary Logo (Light BG)
                    </label>
                    <MediaUpload
                      bucket="brand-assets"
                      value={settings.logo_url || ""}
                      onChange={(url) => setSettings({ ...settings, logo_url: url })}
                      label="Upload Primary Logo"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                      Inverted Logo (Dark BG)
                    </label>
                    <MediaUpload
                      bucket="brand-assets"
                      value={settings.logo_inverted_url || ""}
                      onChange={(url) => setSettings({ ...settings, logo_inverted_url: url })}
                      label="Upload Dark Logo"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                      Site Favicon
                    </label>
                    <MediaUpload
                      bucket="brand-assets"
                      value={settings.favicon_url || ""}
                      onChange={(url) => setSettings({ ...settings, favicon_url: url })}
                      label="Upload Favicon (.png/.ico)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Brand Preview Card */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-surface backdrop-blur-xl border border-borderGlass shadow-glass space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  Live Header Preview
                </h4>
                <div className="p-4 rounded-2xl bg-white/80 border border-borderGlass shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {settings.logo_url ? (
                        <div className="relative h-7 w-28">
                          <Image
                            src={settings.logo_url}
                            alt={settings.site_name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 font-heading font-extrabold text-lg text-textPrimary tracking-tight">
                          <span className="w-3 h-3 rounded-full bg-accent inline-block" />
                          {settings.site_name || "Webspyra"}
                        </div>
                      )}
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-accent/10 text-accent">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-textSecondary italic">
                    &quot;{settings.tagline || "High performance digital experiences."}&quot;
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Dark Mode / Inverted Preview</span>
                  <div className="flex items-center gap-2 pt-1">
                    {settings.logo_inverted_url ? (
                      <div className="relative h-6 w-24">
                        <Image
                          src={settings.logo_inverted_url}
                          alt={settings.site_name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <span className="font-heading font-bold text-base text-white">
                        {settings.site_name || "Webspyra"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Contact & Address */}
        {activeTab === "contact" && (
          <div className="p-6 rounded-3xl bg-surface backdrop-blur-xl border border-borderGlass shadow-glass space-y-6">
            <h3 className="text-lg font-bold font-heading text-textPrimary flex items-center gap-2">
              <Building2 className="w-5 h-5 text-accent" />
              Contact & Location Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                  Official Support Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-textMuted absolute left-4 top-3.5" />
                  <input
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none transition-all text-sm font-medium text-textPrimary"
                    placeholder="contact@webspyra.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-textMuted absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={settings.contact_phone}
                    onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none transition-all text-sm font-medium text-textPrimary"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                  WhatsApp Number (with Country Code)
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-emerald-500 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={settings.whatsapp_number}
                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none transition-all text-sm font-medium text-textPrimary"
                    placeholder="+919876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                  Working Hours / Response Times
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-textMuted absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={settings.working_hours || ""}
                    onChange={(e) => setSettings({ ...settings, working_hours: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none transition-all text-sm font-medium text-textPrimary"
                    placeholder="Mon - Sat: 9:00 AM - 7:00 PM"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                  Default WhatsApp Pre-filled Message
                </label>
                <input
                  type="text"
                  value={settings.whatsapp_default_message || ""}
                  onChange={(e) => setSettings({ ...settings, whatsapp_default_message: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none transition-all text-sm font-medium text-textPrimary"
                  placeholder="Hi Webspyra, I am looking for a new website. How can we proceed further?"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                  Physical Office Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-rose-500 absolute left-4 top-3.5" />
                  <textarea
                    rows={2}
                    value={settings.address || ""}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none transition-all text-sm font-medium text-textPrimary"
                    placeholder="Cyber City, DLF Phase 2, Gurugram, Haryana 122002, India"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                  Google Map Embed URL (iframe src)
                </label>
                <input
                  type="url"
                  value={settings.map_embed_url || ""}
                  onChange={(e) => setSettings({ ...settings, map_embed_url: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none transition-all text-sm font-medium text-textPrimary"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Business & Chat */}
        {activeTab === "business" && (
          <div className="p-6 rounded-3xl bg-surface backdrop-blur-xl border border-borderGlass shadow-glass space-y-6">
            <h3 className="text-lg font-bold font-heading text-textPrimary flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-accent" />
              Financial & Chat Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                  Primary Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none transition-all text-sm font-medium text-textPrimary"
                >
                  <option value="INR">INR (₹ - Indian Rupee)</option>
                  <option value="USD">USD ($ - US Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                  <option value="AED">AED (AED - UAE Dirham)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                  Applicable GST / Tax Rate (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={settings.gst_percentage}
                  onChange={(e) => setSettings({ ...settings, gst_percentage: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none transition-all text-sm font-medium text-textPrimary"
                />
                <p className="text-[11px] text-textMuted mt-1">Standard Indian GST is 18%.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                  Live Chat Widget
                </label>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, live_chat_enabled: !settings.live_chat_enabled })}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/70 border border-borderGlass hover:bg-white transition-all text-sm font-medium text-textPrimary w-full"
                >
                  {settings.live_chat_enabled ? (
                    <ToggleRight className="w-7 h-7 text-accent" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-textMuted" />
                  )}
                  <span>
                    {settings.live_chat_enabled ? "Enabled (Visible on site)" : "Disabled (Hidden)"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Social Links */}
        {activeTab === "social" && (
          <div className="p-6 rounded-3xl bg-surface backdrop-blur-xl border border-borderGlass shadow-glass space-y-6">
            <h3 className="text-lg font-bold font-heading text-textPrimary flex items-center gap-2">
              <Share2 className="w-5 h-5 text-accent" />
              Social Media Accounts
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/webspyra" },
                { key: "facebook", label: "Facebook URL", placeholder: "https://facebook.com/webspyra" },
                { key: "x", label: "X (Twitter) URL", placeholder: "https://x.com/webspyra" },
                { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/webspyra" },
                { key: "youtube", label: "YouTube Channel URL", placeholder: "https://youtube.com/@webspyra" },
                { key: "github", label: "GitHub Profile / Org", placeholder: "https://github.com/webspyra" },
              ].map((item) => (
                <div key={item.key}>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                    {item.label}
                  </label>
                  <input
                    type="url"
                    value={settings.social_links?.[item.key as keyof typeof settings.social_links] || ""}
                    onChange={(e) => updateSocialLink(item.key, e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-borderGlass focus:border-accent focus:outline-none transition-all text-sm font-medium text-textPrimary"
                    placeholder={item.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-borderGlass">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-accent text-white font-medium hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Brand & Site Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
