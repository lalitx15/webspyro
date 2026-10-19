export interface OrderFinancials {
  subtotal: number;
  discount_amount: number;
  taxable_amount: number;
  gst_amount: number;
  total_amount: number;
  gst_percentage: number;
}

/** Shared pure financial calculation; safe to import from browser and server code. */
export function calculateOrderFinancials(
  basePrice: number,
  coupon?: { discount_type: "percentage" | "fixed"; discount_value: number } | null,
  gstPercentage = 18
): OrderFinancials {
  const subtotal = Number.isFinite(basePrice) ? Math.max(0, basePrice) : 0;
  const discountValue = coupon && Number.isFinite(coupon.discount_value) ? Math.max(0, coupon.discount_value) : 0;
  const discount_amount = coupon
    ? coupon.discount_type === "percentage"
      ? Math.min(subtotal, Math.round((subtotal * Math.min(100, discountValue)) / 100))
      : Math.min(discountValue, subtotal)
    : 0;
  const taxable_amount = Math.max(0, subtotal - discount_amount);
  const safeGstPercentage = Number.isFinite(gstPercentage) ? Math.max(0, Math.min(100, gstPercentage)) : 18;
  const gst_amount = Math.round((taxable_amount * safeGstPercentage) / 100);
  return { subtotal, discount_amount, taxable_amount, gst_amount, total_amount: taxable_amount + gst_amount, gst_percentage: safeGstPercentage };
}
