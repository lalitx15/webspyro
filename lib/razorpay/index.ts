import Razorpay from "razorpay";
import crypto from "crypto";

/** Create a Razorpay client only when real server-side credentials are configured. */
export function getRazorpayClient(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay server credentials are not configured");
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

function safeCompareHex(expected: string, actual: string): boolean {
  if (!/^[a-f0-9]+$/i.test(actual) || expected.length !== actual.length) return false;
  const expectedBuffer = Buffer.from(expected, "hex");
  const actualBuffer = Buffer.from(actual, "hex");
  return expectedBuffer.length === actualBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

/** Verify Razorpay's payment signature. Missing credentials always fail closed. */
export function verifyRazorpaySignature({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return false;
  }

  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  return safeCompareHex(generatedSignature, razorpay_signature);
}

/** Verify the raw Razorpay webhook body. Missing credentials always fail closed. */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret?: string
): boolean {
  const webhookSecret = secret || process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret || !signature) return false;

  const generatedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  return safeCompareHex(generatedSignature, signature);
}

export interface OrderFinancials {
  subtotal: number;
  discount_amount: number;
  taxable_amount: number;
  gst_amount: number;
  total_amount: number;
  gst_percentage: number;
}

/** Calculates GST and discount financials. */
export function calculateOrderFinancials(
  basePrice: number,
  coupon?: { discount_type: "percentage" | "fixed"; discount_value: number } | null,
  gstPercentage = 18
): OrderFinancials {
  const subtotal = Math.max(0, basePrice);
  let discount_amount = 0;

  if (coupon) {
    if (coupon.discount_type === "percentage") {
      discount_amount = Math.round((subtotal * coupon.discount_value) / 100);
    } else {
      discount_amount = Math.min(coupon.discount_value, subtotal);
    }
  }

  const taxable_amount = Math.max(0, subtotal - discount_amount);
  const gst_amount = Math.round((taxable_amount * gstPercentage) / 100);
  const total_amount = taxable_amount + gst_amount;

  return {
    subtotal,
    discount_amount,
    taxable_amount,
    gst_amount,
    total_amount,
    gst_percentage: gstPercentage,
  };
}
