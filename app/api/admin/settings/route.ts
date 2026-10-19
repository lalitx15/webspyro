import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data: settings, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching site_settings:", error);
    }

    // Default fallback settings
    const defaultSettings = {
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
        github: "https://github.com/webspyra",
      },
    };

    return NextResponse.json({
      success: true,
      settings: settings || defaultSettings,
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

    // Verify existing settings
    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    let result;
    if (existing?.id) {
      result = await supabase
        .from("site_settings")
        .update({
          site_name: body.site_name,
          tagline: body.tagline,
          logo_url: body.logo_url || null,
          logo_inverted_url: body.logo_inverted_url || null,
          favicon_url: body.favicon_url || null,
          contact_email: body.contact_email,
          contact_phone: body.contact_phone,
          whatsapp_number: body.whatsapp_number,
          whatsapp_default_message: body.whatsapp_default_message,
          address: body.address,
          map_embed_url: body.map_embed_url || null,
          working_hours: body.working_hours,
          currency: body.currency || "INR",
          gst_percentage: Number(body.gst_percentage) || 18,
          live_chat_enabled: Boolean(body.live_chat_enabled),
          social_links: body.social_links || {},
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from("site_settings")
        .insert({
          site_name: body.site_name,
          tagline: body.tagline,
          logo_url: body.logo_url || null,
          logo_inverted_url: body.logo_inverted_url || null,
          favicon_url: body.favicon_url || null,
          contact_email: body.contact_email,
          contact_phone: body.contact_phone,
          whatsapp_number: body.whatsapp_number,
          whatsapp_default_message: body.whatsapp_default_message,
          address: body.address,
          map_embed_url: body.map_embed_url || null,
          working_hours: body.working_hours,
          currency: body.currency || "INR",
          gst_percentage: Number(body.gst_percentage) || 18,
          live_chat_enabled: Boolean(body.live_chat_enabled),
          social_links: body.social_links || {},
        })
        .select()
        .single();
    }

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, settings: result.data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
