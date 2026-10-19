import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRazorpayClient, calculateOrderFinancials } from "@/lib/razorpay";
import { defaultPlans } from "@/lib/home-data";
import { z } from "zod";

const createOrderSchema = z.object({
  plan_id: z.string().min(1),
  customer_name: z.string().min(2),
  customer_email: z.string().email(),
  customer_phone: z.string().min(8),
  company: z.string().optional().nullable(),
  gst_number: z.string().optional().nullable(),
  coupon_code: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createOrderSchema.parse(body);

    const supabase = createAdminClient();

    // 1. Locate selected plan
    let plan = defaultPlans.find(
      (p) => p.id === validated.plan_id || p.name.toLowerCase() === validated.plan_id.toLowerCase()
    );

    if (!plan) {
      // Query database if not matched in defaults
      const { data: dbPlan } = await supabase
        .from("plans")
        .select("*")
        .eq("id", validated.plan_id)
        .maybeSingle();

      if (dbPlan) {
        plan = dbPlan;
      }
    }

    if (!plan) {
      return NextResponse.json({ error: "Selected plan not found" }, { status: 404 });
    }

    // 2. Validate coupon if supplied
    let couponDetails: { discount_type: "percentage" | "fixed"; discount_value: number } | null = null;
    let appliedCouponCode: string | null = null;

    if (validated.coupon_code) {
      const codeUpper = validated.coupon_code.trim().toUpperCase();

      const { data: dbCoupon } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", codeUpper)
        .eq("is_active", true)
        .maybeSingle();

      if (dbCoupon && plan.price >= dbCoupon.min_order_amount) {
        couponDetails = {
          discount_type: dbCoupon.discount_type as "percentage" | "fixed",
          discount_value: dbCoupon.discount_value,
        };
        appliedCouponCode = dbCoupon.code;
      } else {
        // Built-in promo check
        if (codeUpper === "WELCOME10") {
          couponDetails = { discount_type: "percentage", discount_value: 10 };
          appliedCouponCode = "WELCOME10";
        } else if (codeUpper === "WEBSPYRA20" && plan.price >= 10000) {
          couponDetails = { discount_type: "percentage", discount_value: 20 };
          appliedCouponCode = "WEBSPYRA20";
        } else if (codeUpper === "LAUNCH30" && plan.price >= 14000) {
          couponDetails = { discount_type: "percentage", discount_value: 30 };
          appliedCouponCode = "LAUNCH30";
        } else if (codeUpper === "SUPER1000") {
          couponDetails = { discount_type: "fixed", discount_value: 1000 };
          appliedCouponCode = "SUPER1000";
        }
      }
    }

    // 3. Compute Financials
    const financials = calculateOrderFinancials(plan.price, couponDetails, 18);
    const orderNumber = `WSP-${Math.floor(100000 + Math.random() * 900000)}`;

    // 4. Create Razorpay order
    // Never fabricate a gateway order ID: only real Razorpay orders may proceed.
    let razorpayOrderId: string;
    try {
      const razorpay = getRazorpayClient();
      const rzpOrder = await razorpay.orders.create({
        amount: Math.round(financials.total_amount * 100),
        currency: "INR",
        receipt: orderNumber,
        notes: {
          order_number: orderNumber,
          plan_name: plan.name,
          customer_name: validated.customer_name,
          customer_email: validated.customer_email,
        },
      });
      if (!rzpOrder?.id) {
        return NextResponse.json({ error: "Payment provider did not create an order" }, { status: 502 });
      }
      razorpayOrderId = rzpOrder.id;
    } catch (rzpErr) {
      console.error("Razorpay order creation failed:", rzpErr);
      return NextResponse.json(
        { error: "Unable to start payment right now. Please try again later." },
        { status: 502 }
      );
    }

    // 5. Insert order into database
    const { data: orderRecord, error: orderInsertErr } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        plan_id: plan.id.startsWith("plan-") ? null : plan.id,
        customer_name: validated.customer_name.trim(),
        customer_email: validated.customer_email.trim().toLowerCase(),
        customer_phone: validated.customer_phone.trim(),
        subtotal: financials.subtotal,
        gst_amount: financials.gst_amount,
        discount_amount: financials.discount_amount,
        total_amount: financials.total_amount,
        coupon_code: appliedCouponCode,
        payment_status: "pending",
        razorpay_order_id: razorpayOrderId,
        project_status: "brief",
        notes: validated.notes?.trim() || null,
      })
      .select()
      .single();

    if (orderInsertErr || !orderRecord) {
      console.error("Order insertion error", orderInsertErr);
      return NextResponse.json(
        { error: "Unable to save your order. Please try again; you have not been charged." },
        { status: 500 }
      );
    }

    // 6. Insert Order Timeline record
    if (orderRecord?.id) {
      await supabase.from("order_timeline").insert({
        order_id: orderRecord.id,
        status: "order_created",
        note: `Order initiated for ${plan.name} (Amount: ₹${financials.total_amount.toLocaleString(
          "en-IN"
        )})`,
      });
    }

    const keyId =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID ||
      "rzp_test_placeholder";

    return NextResponse.json({
      success: true,
      order_id: orderRecord.id,
      order_number: orderNumber,
      razorpay_order_id: razorpayOrderId,
      amount: Math.round(financials.total_amount * 100),
      currency: "INR",
      key_id: keyId,
      customer_name: validated.customer_name,
      customer_email: validated.customer_email,
      customer_phone: validated.customer_phone,
      financials,
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
      },
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.issues },
        { status: 422 }
      );
    }
    const message = err instanceof Error ? err.message : "Failed to create checkout order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
