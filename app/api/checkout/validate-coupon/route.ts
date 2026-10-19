import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const validateCouponSchema = z.object({
  code: z.string().min(2).max(30),
  subtotal: z.number().positive(),
});

// Default active fallback coupons
const DEFAULT_COUPONS = [
  {
    code: "WELCOME10",
    discount_type: "percentage" as const,
    discount_value: 10,
    min_order_amount: 5000,
  },
  {
    code: "WEBSPYRA20",
    discount_type: "percentage" as const,
    discount_value: 20,
    min_order_amount: 10000,
  },
  {
    code: "LAUNCH30",
    discount_type: "percentage" as const,
    discount_value: 30,
    min_order_amount: 14000,
  },
  {
    code: "SUPER1000",
    discount_type: "fixed" as const,
    discount_value: 1000,
    min_order_amount: 8000,
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = validateCouponSchema.parse(body);
    const normalizedCode = validated.code.trim().toUpperCase();

    const supabase = createAdminClient();

    // 1. Try querying Supabase coupons table
    const { data: dbCoupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", normalizedCode)
      .eq("is_active", true)
      .maybeSingle();

    if (dbCoupon) {
      if (dbCoupon.valid_until && new Date(dbCoupon.valid_until) < new Date()) {
        return NextResponse.json(
          { valid: false, error: "This promo coupon has expired." },
          { status: 400 }
        );
      }

      if (dbCoupon.max_uses && dbCoupon.current_uses >= dbCoupon.max_uses) {
        return NextResponse.json(
          { valid: false, error: "This coupon usage limit has been reached." },
          { status: 400 }
        );
      }

      if (validated.subtotal < dbCoupon.min_order_amount) {
        return NextResponse.json(
          {
            valid: false,
            error: `Minimum order amount of ₹${dbCoupon.min_order_amount.toLocaleString(
              "en-IN"
            )} required for this coupon.`,
          },
          { status: 400 }
        );
      }

      const discountAmount =
        dbCoupon.discount_type === "percentage"
          ? Math.round((validated.subtotal * dbCoupon.discount_value) / 100)
          : Math.min(dbCoupon.discount_value, validated.subtotal);

      return NextResponse.json({
        valid: true,
        code: dbCoupon.code,
        discount_type: dbCoupon.discount_type,
        discount_value: dbCoupon.discount_value,
        discount_amount: discountAmount,
      });
    }

    // 2. Check built-in promotional codes fallback
    const fallbackCoupon = DEFAULT_COUPONS.find((c) => c.code === normalizedCode);
    if (fallbackCoupon) {
      if (validated.subtotal < fallbackCoupon.min_order_amount) {
        return NextResponse.json(
          {
            valid: false,
            error: `Minimum package value of ₹${fallbackCoupon.min_order_amount.toLocaleString(
              "en-IN"
            )} required for this coupon.`,
          },
          { status: 400 }
        );
      }

      const discountAmount =
        fallbackCoupon.discount_type === "percentage"
          ? Math.round((validated.subtotal * fallbackCoupon.discount_value) / 100)
          : Math.min(fallbackCoupon.discount_value, validated.subtotal);

      return NextResponse.json({
        valid: true,
        code: fallbackCoupon.code,
        discount_type: fallbackCoupon.discount_type,
        discount_value: fallbackCoupon.discount_value,
        discount_amount: discountAmount,
      });
    }

    return NextResponse.json(
      { valid: false, error: "Invalid coupon code. Try WELCOME10 or WEBSPYRA20." },
      { status: 400 }
    );
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { valid: false, error: "Please enter a valid coupon code." },
        { status: 422 }
      );
    }
    const msg = err instanceof Error ? err.message : "Coupon validation error";
    return NextResponse.json({ valid: false, error: msg }, { status: 500 });
  }
}
