import { createBrowserClient } from "@/lib/supabase/client";
import { SiteSettings } from "@/types";

export const defaultSiteSettings: SiteSettings = {
  id: "default-settings",
  site_name: "Webspyra",
  tagline: "Next-Gen Web Development Agency",
  logo_url: null,
  logo_inverted_url: null,
  favicon_url: null,
  contact_email: "lalit@webspyro.com",
  secondary_email: "lalitx15@gmail.com",
  contact_phone: "+91 89588 89538",
  whatsapp_number: "+91 89588 89538",
  whatsapp_default_message:
    "Hi Webspyra, I am looking for a new website. How can we proceed further?",
  address: "Noida Sector 62, Noida, India",
  map_embed_url: "",
  working_hours: "24/7",
  currency: "INR",
  gst_percentage: 18,
  live_chat_enabled: true,
  social_links: {
    instagram: "https://instagram.com/webspyra",
    facebook: "https://facebook.com/webspyra",
    x: "https://x.com/webspyra",
    linkedin: "https://linkedin.com/company/webspyra",
  },
};

export const defaultAnnouncements = [
  {
    id: "ann-1",
    text: "🔥 Limited Period Deal: Flat 30% OFF on all Website Packages with Free Domain & Cloud Hosting!",
    link: "/#pricing",
  },
  {
    id: "ann-2",
    text: "⚡ Lightning Fast Delivery: Complete Professional Website ready in 5 to 7 working days!",
    link: "/#pricing",
  },
  {
    id: "ann-3",
    text: "📱 100% Mobile & Tablet Optimized: App-like experience with zero lag guaranteed.",
    link: "/#services",
  },
];

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) {
      return defaultSiteSettings;
    }
    return { ...defaultSiteSettings, ...data };
  } catch {
    return defaultSiteSettings;
  }
}

export async function getAnnouncements() {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from("announcement_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultAnnouncements;
    }
    return data;
  } catch {
    return defaultAnnouncements;
  }
}
