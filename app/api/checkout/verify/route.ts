import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { z } from "zod";

const verifyPaymentSchema = z.object({
  order_number: z.string().min(5),
  razorpay_order_id: z.string().min(5),
  razorpay_payment_id: z.string().min(5),
  razorpay_signature: z.string().min(5),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = verifyPaymentSchema.parse(body);

    // 1. Verify HMAC SHA256 Signature
    const isValid = verifyRazorpaySignature({
      razorpay_order_id: validated.razorpay_order_id,
      razorpay_payment_id: validated.razorpay_payment_id,
      razorpay_signature: validated.razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature verification failed." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 2. Locate order in database
    const { data: order, error: orderLookupError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", validated.order_number)
      .maybeSingle();

    if (orderLookupError) {
      console.error("Order lookup failed during payment verification:", orderLookupError);
      return NextResponse.json({ error: "Unable to verify this order right now" }, { status: 500 });
    }
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (order.razorpay_order_id !== validated.razorpay_order_id) {
      return NextResponse.json({ error: "Payment order does not match this checkout" }, { status: 400 });
    }
    if (order.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        order_number: validated.order_number,
        payment_id: order.razorpay_payment_id,
        message: "Payment was already verified.",
      });
    }
    {
      // 3. Update Order status to paid
      const { error: paymentUpdateError } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          razorpay_payment_id: validated.razorpay_payment_id,
          razorpay_signature: validated.razorpay_signature,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      if (paymentUpdateError) {
        console.error("Failed to persist verified payment:", paymentUpdateError);
        return NextResponse.json({ error: "Payment was verified but order status could not be updated. Please contact support." }, { status: 500 });
      }

      // 4. Log timeline event
      await supabase.from("order_timeline").insert({
        order_id: order.id,
        status: "payment_confirmed",
        note: `Payment of ₹${order.total_amount} verified via Razorpay ID: ${validated.razorpay_payment_id}`,
      });

      // 5. If coupon was used, increment usage count
      if (order.coupon_code) {
        const { data: cp } = await supabase
          .from("coupons")
          .select("id, current_uses")
          .eq("code", order.coupon_code)
          .maybeSingle();

        if (cp) {
          await supabase
            .from("coupons")
            .update({ current_uses: (cp.current_uses || 0) + 1 })
            .eq("id", cp.id);
        }
      }

      // 6. Automatically initialize client project tracker entry
      await supabase.from("client_projects").insert({
        order_id: order.id,
        title: `${order.customer_name}'s Website Project`,
        current_stage: "brief",
      });
    }

    return NextResponse.json({
      success: true,
      order_number: validated.order_number,
      payment_id: validated.razorpay_payment_id,
      message: "Payment successfully verified and recorded.",
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Verification payload failed validation", details: err.issues },
        { status: 422 }
      );
    }
    const message = err instanceof Error ? err.message : "Payment verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
