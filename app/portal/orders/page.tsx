"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Receipt,
  Printer,
  CheckCircle2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
  orderNumber: string;
  planName: string;
  date: string;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  paymentId: string;
  status: "paid" | "pending";
}

const DEMO_ORDERS: OrderItem[] = [
  {
    orderNumber: "WSP-100234",
    planName: "Classic Growth Website Plan",
    date: "17 Oct 2026",
    subtotal: 14999,
    gstAmount: 2700,
    totalAmount: 17699,
    paymentId: "pay_100234_verified",
    status: "paid",
  },
];

export default function OrdersPage() {
  const [orders] = useState<OrderItem[]>(DEMO_ORDERS);
  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");

  const filteredOrders = orders.filter((o) => {
    if (filter === "paid") return o.status === "paid";
    if (filter === "pending") return o.status === "pending";
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Orders & Tax Invoices
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access your GST tax invoices for business tax credit and accounting.
          </p>
        </div>

        <Link href="/pricing">
          <Button variant="secondary" size="md">
            View All Plans & Pricing
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(["all", "paid", "pending"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-colors ${
              filter === tab
                ? "bg-accent text-white shadow-glow"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {tab} Orders
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <GlassCard key={order.orderNumber} className="p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-lg text-accent">
                    {order.orderNumber}
                  </span>
                  <Badge variant="mint">
                    <CheckCircle2 className="w-3 h-3 text-success inline mr-1" />
                    PAID
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Placed on {order.date} • Gateway Ref: {order.paymentId}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link href={`/checkout/invoice/${order.orderNumber}`}>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Printer className="w-4 h-4" />}
                    className="shadow-glow"
                  >
                    Print Tax Invoice
                  </Button>
                </Link>
              </div>
            </div>

            {/* Price Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Package</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block truncate">
                  {order.planName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Base Fee</span>
                <span className="font-medium text-slate-700 text-sm mt-0.5 block">
                  ₹{order.subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">GST (18%)</span>
                <span className="font-medium text-slate-700 text-sm mt-0.5 block">
                  ₹{order.gstAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Total Paid</span>
                <span className="font-extrabold text-slate-900 text-base mt-0.5 block">
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </GlassCard>
        ))}

        {filteredOrders.length === 0 && (
          <GlassCard className="p-12 text-center space-y-3">
            <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700">No Orders Found</h3>
            <p className="text-xs text-slate-500">
              You haven&apos;t placed any orders matching this filter.
            </p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
