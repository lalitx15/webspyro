import { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://webspyra.com";
  const now = new Date();

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/get-quote`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    const supabase = createPublicClient();

    // 2. Dynamic Services
    const { data: services } = await supabase
      .from("services")
      .select("slug, updated_at")
      .eq("is_active", true);

    const serviceRoutes: MetadataRoute.Sitemap = (services || []).map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: s.updated_at ? new Date(s.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // 3. Dynamic Portfolio Projects
    const { data: portfolio } = await supabase
      .from("portfolio_projects")
      .select("slug, updated_at")
      .eq("is_featured", true);

    const portfolioRoutes: MetadataRoute.Sitemap = (portfolio || []).map((p) => ({
      url: `${baseUrl}/portfolio/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    // 4. Dynamic Blog Articles
    const { data: blogs } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("is_published", true);

    const blogRoutes: MetadataRoute.Sitemap = (blogs || []).map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: b.updated_at ? new Date(b.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [...staticRoutes, ...serviceRoutes, ...portfolioRoutes, ...blogRoutes];
  } catch (e) {
    console.error("Error generating dynamic sitemap:", e);
    return staticRoutes;
  }
}
