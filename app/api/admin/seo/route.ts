import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerClient();

    // 1. Fetch Global SEO Settings
    const { data: globalSeo, error: globalErr } = await supabase
      .from("seo_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (globalErr && globalErr.code !== "PGRST116") {
      console.error("Error fetching global SEO settings:", globalErr);
    }

    // Default fallback
    const defaultGlobal = {
      default_title: "Webspyra | Premium Web Development & Digital Solutions",
      title_template: "%s | Webspyra",
      default_description: "Award-winning web development agency creating fast, responsive, and animated business websites.",
      default_og_image: "/og-image.png",
      ga4_id: "",
      search_console_code: "",
      meta_pixel_id: "",
      robots_txt: `User-agent: *\nAllow: /\n\nSitemap: https://webspyra.com/sitemap.xml`,
    };

    // 2. Fetch Per-Page SEO Overrides
    const { data: pages, error: pagesErr } = await supabase
      .from("page_seo")
      .select("*")
      .order("page_path", { ascending: true });

    if (pagesErr) {
      console.error("Error fetching page SEO overrides:", pagesErr);
    }

    return NextResponse.json({
      success: true,
      global: globalSeo || defaultGlobal,
      pages: pages || [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    const { action } = body;

    // Action: Update Global SEO Settings
    if (action === "update_global") {
      const { data: existing } = await supabase
        .from("seo_settings")
        .select("id")
        .limit(1)
        .maybeSingle();

      let result;
      if (existing?.id) {
        result = await supabase
          .from("seo_settings")
          .update({
            default_title: body.default_title,
            title_template: body.title_template,
            default_description: body.default_description,
            default_og_image: body.default_og_image || null,
            ga4_id: body.ga4_id || null,
            search_console_code: body.search_console_code || null,
            meta_pixel_id: body.meta_pixel_id || null,
            robots_txt: body.robots_txt || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("seo_settings")
          .insert({
            default_title: body.default_title,
            title_template: body.title_template,
            default_description: body.default_description,
            default_og_image: body.default_og_image || null,
            ga4_id: body.ga4_id || null,
            search_console_code: body.search_console_code || null,
            meta_pixel_id: body.meta_pixel_id || null,
            robots_txt: body.robots_txt || null,
          })
          .select()
          .single();
      }

      if (result.error) {
        return NextResponse.json({ success: false, error: result.error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, global: result.data });
    }

    // Action: Update or Upsert Single Page SEO
    if (action === "update_page") {
      const pageData = body.page;
      if (!pageData.page_path) {
        return NextResponse.json({ success: false, error: "page_path is required" }, { status: 400 });
      }

      let parsedJsonLd = null;
      if (pageData.json_ld) {
        try {
          parsedJsonLd = typeof pageData.json_ld === "string" ? JSON.parse(pageData.json_ld) : pageData.json_ld;
        } catch {
          return NextResponse.json({ success: false, error: "Invalid JSON-LD schema syntax" }, { status: 400 });
        }
      }

      let result;
      if (pageData.id) {
        result = await supabase
          .from("page_seo")
          .update({
            page_path: pageData.page_path,
            title: pageData.title,
            description: pageData.description,
            og_image: pageData.og_image || null,
            canonical_url: pageData.canonical_url || null,
            json_ld: parsedJsonLd,
            updated_at: new Date().toISOString(),
          })
          .eq("id", pageData.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("page_seo")
          .upsert(
            {
              page_path: pageData.page_path,
              title: pageData.title,
              description: pageData.description,
              og_image: pageData.og_image || null,
              canonical_url: pageData.canonical_url || null,
              json_ld: parsedJsonLd,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "page_path" }
          )
          .select()
          .single();
      }

      if (result.error) {
        return NextResponse.json({ success: false, error: result.error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, page: result.data });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing page SEO ID" }, { status: 400 });
    }

    const { error } = await supabase.from("page_seo").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
