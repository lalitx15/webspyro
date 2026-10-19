import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyWebhookSignature } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";

    // 1. Verify webhook HMAC signature
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const payload = event.payload?.payment?.entity || event.payload?.order?.entity;

    if (!payload) {
      return NextResponse.json({ received: true });
    }

    const orderNumber = payload.notes?.order_number || payload.receipt;
    const paymentId = payload.id;
    const supabase = createAdminClient();

    if (orderNumber) {
      const { data: order } = await supabase
        .from("orders")
        .select("id, payment_status")
        .eq("order_number", orderNumber)
        .maybeSingle();

      if (order) {
        if (eventType === "payment.captured" || eventType === "order.paid") {
          await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              razorpay_payment_id: paymentId,
              updated_at: new Date().toISOString(),
            })
            .eq("id", order.id);

          await supabase.from("order_timeline").insert({
            order_id: order.id,
            status: "webhook_payment_captured",
            note: `Payment captured via Razorpay Webhook (ID: ${paymentId})`,
          });
        } else if (eventType === "payment.failed") {
          await supabase
            .from("orders")
            .update({
              payment_status: "failed",
              updated_at: new Date().toISOString(),
            })
            .eq("id", order.id);

          await supabase.from("order_timeline").insert({
            order_id: order.id,
            status: "webhook_payment_failed",
            note: `Payment failed: ${payload.error_description || "Card or UPI declined"}`,
          });
        } else if (eventType === "refund.processed") {
          await supabase
            .from("orders")
            .update({
              payment_status: "refunded",
              updated_at: new Date().toISOString(),
            })
            .eq("id", order.id);

          await supabase.from("order_timeline").insert({
            order_id: order.id,
            status: "webhook_refund_processed",
            note: `Refund processed for payment ID: ${paymentId}`,
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook handling failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
