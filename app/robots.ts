import { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";

export default async function robots(): Promise<MetadataRoute.Robots> {
  try {
    const supabase = createPublicClient();
    const { data: seo } = await supabase
      .from("seo_settings")
      .select("robots_txt")
      .limit(1)
      .maybeSingle();

    const disallowPaths = seo?.robots_txt?.includes("Disallow:")
      ? ["/admin/", "/portal/", "/api/"]
      : ["/admin/", "/portal/", "/api/"];

    return {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: disallowPaths,
      },
      sitemap: "https://webspyra.com/sitemap.xml",
    };
  } catch {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/portal/", "/api/"],
      },
      sitemap: "https://webspyra.com/sitemap.xml",
    };
  }
}
