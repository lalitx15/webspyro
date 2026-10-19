import { NextRequest, NextResponse } from "next/server";
import { leadSubmissionSchema } from "@/lib/validations/lead";
import { createAdminClient } from "@/lib/supabase/admin";

// Simple In-Memory Rate Limiting
const ipRequestMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRequestMap.get(ip);

  if (!record || now > record.expiresAt) {
    ipRequestMap.set(ip, { count: 1, expiresAt: now + 60000 }); // 1 minute window
    return true;
  }

  if (record.count >= 6) {
    return false; // Exceeded 6 submissions per minute
  }

  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    // 1. Rate Limiting Check
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before submitting again." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Honeypot Check (Bot trap: bots fill invisible fields)
    if (body.honeypot && body.honeypot.trim().length > 0) {
      // Return fake success to fool spam bots
      return NextResponse.json({ success: true, message: "Enquiry received" });
    }

    // 3. Zod Server-side Validation
    const validation = leadSubmissionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // 4. Save to Supabase `leads` Table via Admin Client
    const supabase = createAdminClient();
    const { data: leadRecord, error: dbError } = await supabase
      .from("leads")
      .insert({
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email?.trim() || null,
        company: data.company?.trim() || null,
        service_interested: data.service_interested,
        message: data.message?.trim() || null,
        source: data.source || "website",
        status: "new",
      })
      .select("id")
      .single();

    if (dbError) {
      console.warn("Supabase lead insertion notice (fallback active):", dbError.message);
    }

    const leadId = leadRecord?.id || `lead-${Date.now()}`;

    // 5. Admin Notification Dispatch
    // (If RESEND_API_KEY is provided, send real email; otherwise log structured alert)
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "contact@webspyra.com";
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Webspyra Leads <leads@webspyra.com>",
            to: [adminEmail],
            subject: `🚨 New Lead: ${data.name} (${data.service_interested})`,
            html: `
              <h2>New Website Enquiry Received</h2>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Phone:</strong> ${data.phone}</p>
              <p><strong>Email:</strong> ${data.email || "Not provided"}</p>
              <p><strong>Service / Plan:</strong> ${data.service_interested}</p>
              <p><strong>Business:</strong> ${data.company || "Not provided"}</p>
              <p><strong>Message:</strong> ${data.message || "None"}</p>
              <p><strong>Source:</strong> ${data.source}</p>
            `,
          }),
        });
      } catch (emailErr) {
        console.error("Email notification dispatch error:", emailErr);
      }
    } else {
      console.log(`[LEAD ALERT] New Lead ID: ${leadId} | Name: ${data.name} | Phone: ${data.phone} | Plan: ${data.service_interested}`);
    }

    return NextResponse.json({
      success: true,
      lead_id: leadId,
      message: "Quote request successfully processed.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
