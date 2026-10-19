"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Download,
  Printer,
  X,
  CreditCard,
  Send,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Order, PaymentStatus, ProjectStatus } from "@/types";
import { createBrowserClient } from "@/lib/supabase/client";

const initialMockOrders: Order[] = [
  {
    id: "ord-1",
    order_number: "WSP-10492",
    customer_name: "Vikram Malhotra",
    customer_email: "vikram@apexlogistics.in",
    customer_phone: "+91 98201 54321",
    subtotal: 54999,
    gst_amount: 9900,
    discount_amount: 0,
    total_amount: 64899,
    payment_status: "paid",
    razorpay_order_id: "order_Q1w2E3r4T5y6",
    razorpay_payment_id: "pay_K8j7H6g5F4d3",
    project_status: "development",
    notes: "Client opted for AWS Mumbai region hosting. Target launch 28th October.",
    created_at: "2026-10-17T09:02:00.000Z",
    plan: {
      id: "plan-4",
      name: "Ultimate E-Commerce Suite",
      category: "ecommerce",
      old_price: 89999,
      price: 54999,
      gst_percentage: 18,
      is_popular: true,
      renewal_price: 9999,
      delivery_days: 14,
      sort_order: 4,
      is_active: true,
    },
  },
  {
    id: "ord-2",
    order_number: "WSP-10491",
    customer_name: "Dr. Ananya Sen",
    customer_email: "ananya@senskin.clinic",
    customer_phone: "+91 99345 67890",
    subtotal: 24999,
    gst_amount: 4500,
    discount_amount: 0,
    total_amount: 29499,
    payment_status: "paid",
    razorpay_order_id: "order_M7n6B5v4C3x2",
    razorpay_payment_id: "pay_P9o8I7u6Y5t4",
    project_status: "review",
    notes: "Doctor bio and photos approved. Waiting for domain DNS propagation.",
    created_at: "2026-10-16T15:20:00.000Z",
    plan: {
      id: "plan-2",
      name: "Growth Business Pro",
      category: "business",
      old_price: 39999,
      price: 24999,
      gst_percentage: 18,
      is_popular: true,
      renewal_price: 4999,
      delivery_days: 7,
      sort_order: 2,
      is_active: true,
    },
  },
  {
    id: "ord-3",
    order_number: "WSP-10490",
    customer_name: "Sameer Joshi",
    customer_email: "sameer@artisanalbakes.in",
    customer_phone: "+91 97123 45678",
    subtotal: 15999,
    gst_amount: 2880,
    discount_amount: 0,
    total_amount: 18879,
    payment_status: "pending",
    razorpay_order_id: "order_Z9x8C7v6B5n4",
    project_status: "brief",
    notes: "Awaiting UPI payment completion on Razorpay.",
    created_at: "2026-10-15T11:45:00.000Z",
    plan: {
      id: "plan-1",
      name: "Startup Launchpad",
      category: "business",
      old_price: 24999,
      price: 15999,
      gst_percentage: 18,
      is_popular: false,
      renewal_price: 3499,
      delivery_days: 5,
      sort_order: 1,
      is_active: true,
    },
  },
  {
    id: "ord-4",
    order_number: "WSP-10489",
    customer_name: "Rohan Singhal",
    customer_email: "rohan@finedge.com",
    customer_phone: "+91 98711 22334",
    subtotal: 34999,
    gst_amount: 6300,
    discount_amount: 3500,
    coupon_code: "FESTIVE30",
    total_amount: 37799,
    payment_status: "paid",
    razorpay_order_id: "order_L1k2J3h4G5f6",
    razorpay_payment_id: "pay_A1s2D3f4G5h6",
    project_status: "live",
    notes: "Project completed and handed over to client. AMC initiated.",
    created_at: "2026-10-10T14:10:00.000Z",
    plan: {
      id: "plan-3",
      name: "E-Commerce Starter",
      category: "ecommerce",
      old_price: 54999,
      price: 34999,
      gst_percentage: 18,
      is_popular: false,
      renewal_price: 6999,
      delivery_days: 10,
      sort_order: 3,
      is_active: true,
    },
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialMockOrders);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newNote, setNewNote] = useState("");

  const supabase = useMemo(() => createBrowserClient(), []);

  const fetchOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, plan:plans(*)")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setOrders(data as unknown as Order[]);
      }
    } catch {
      // Demo safety
    }
  }, [supabase]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdatePaymentStatus = async (orderId: string, status: PaymentStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, payment_status: status } : o));
    setOrders(updated);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, payment_status: status });
    }

    try {
      await supabase.from("orders").update({ payment_status: status }).eq("id", orderId);
    } catch {
      // Demo safety
    }
  };

  const handleUpdateProjectStatus = async (orderId: string, status: ProjectStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, project_status: status } : o));
    setOrders(updated);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, project_status: status });
    }

    try {
      await supabase.from("orders").update({ project_status: status }).eq("id", orderId);
    } catch {
      // Demo safety
    }
  };

  const handleAddOrderNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedOrder) return;

    const existingNotes = selectedOrder.notes ? `${selectedOrder.notes}\n` : "";
    const appended = `${existingNotes}[${new Date().toLocaleDateString("en-IN")}] ${newNote.trim()}`;

    const updated = orders.map((o) => (o.id === selectedOrder.id ? { ...o, notes: appended } : o));
    setOrders(updated);
    setSelectedOrder({ ...selectedOrder, notes: appended });
    setNewNote("");

    try {
      await supabase.from("orders").update({ notes: appended }).eq("id", selectedOrder.id);
    } catch {
      // Demo safety
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Order Number",
      "Customer Name",
      "Customer Phone",
      "Customer Email",
      "Plan Name",
      "Subtotal (INR)",
      "GST (INR)",
      "Total Amount (INR)",
      "Payment Status",
      "Razorpay Payment ID",
      "Project Stage",
      "Date",
    ];

    const rows = orders.map((o) => [
      o.order_number,
      `"${o.customer_name}"`,
      `"${o.customer_phone}"`,
      `"${o.customer_email}"`,
      `"${o.plan?.name || "Custom"}"`,
      o.subtotal,
      o.gst_amount,
      o.total_amount,
      o.payment_status,
      `"${o.razorpay_payment_id || ""}"`,
      o.project_status,
      `"${new Date(o.created_at).toLocaleDateString("en-IN")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `webspyra-orders-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = useMemo(() => {
    if (filterStatus === "all") return orders;
    return orders.filter((o) => o.payment_status === filterStatus);
  }, [orders, filterStatus]);

  const columns: Column<Order>[] = [
    {
      key: "order_number",
      header: "Order & Invoice",
      sortable: true,
      render: (item) => (
        <div>
          <button
            onClick={() => setSelectedOrder(item)}
            className="font-bold text-slate-900 hover:text-accent font-mono transition-colors text-xs"
          >
            {item.order_number}
          </button>
          <p className="text-[10px] text-slate-400">
            {new Date(item.created_at).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      ),
    },
    {
      key: "customer_name",
      header: "Client Details",
      sortable: true,
      render: (item) => (
        <div>
          <h4 className="font-bold text-slate-800 leading-snug text-xs">{item.customer_name}</h4>
          <p className="text-[11px] text-slate-400">{item.customer_phone}</p>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Package Purchased",
      render: (item) => (
        <span className="font-semibold text-slate-700 text-xs">
          {item.plan?.name || "Web Development"}
        </span>
      ),
    },
    {
      key: "total_amount",
      header: "Total Amount",
      sortable: true,
      render: (item) => (
        <div>
          <span className="font-extrabold text-slate-900 text-xs">
            ₹{item.total_amount.toLocaleString("en-IN")}
          </span>
          <p className="text-[10px] text-slate-400">incl. ₹{item.gst_amount} GST</p>
        </div>
      ),
    },
    {
      key: "payment_status",
      header: "Payment",
      sortable: true,
      render: (item) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
            item.payment_status === "paid"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : item.payment_status === "pending"
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {item.payment_status}
        </span>
      ),
    },
    {
      key: "project_status",
      header: "Project Pipeline",
      render: (item) => (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-accent capitalize border border-blue-200">
          {item.project_status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/checkout/invoice/${item.order_number}`}
            target="_blank"
            className="p-1.5 text-slate-400 hover:text-accent rounded-lg hover:bg-slate-100 transition-colors"
            title="View Tax Invoice"
          >
            <Printer className="w-3.5 h-3.5" />
          </Link>
          <Button
            variant="secondary"
            onClick={() => setSelectedOrder(item)}
            className="text-[11px] px-2.5 py-1 h-7 rounded-lg"
          >
            Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        onMobileMenuToggle={() => {}}
        title="Orders & Razorpay Transactions"
        subtitle="Track payment captures, verified UPI signatures, GST invoicing, and project kickoff."
      />

      <div className="px-4 sm:px-6 space-y-6 max-w-7xl mx-auto">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === "all" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setFilterStatus("paid")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === "paid" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Paid ({orders.filter((o) => o.payment_status === "paid").length})
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === "pending" ? "bg-amber-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Pending ({orders.filter((o) => o.payment_status === "pending").length})
            </button>
          </div>

          <Button
            variant="secondary"
            onClick={handleExportCSV}
            className="text-xs px-3.5 py-1.5 h-9 rounded-2xl gap-1.5 font-bold self-end sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Orders CSV</span>
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={filteredOrders}
          searchPlaceholder="Search orders by number, client, email..."
          searchKeys={["order_number", "customer_name", "customer_email", "customer_phone"]}
          onRowClick={(item) => setSelectedOrder(item)}
        />
      </div>

      {/* ORDER DETAILS DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl z-10 flex flex-col border-l border-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <span className="font-mono text-xs font-bold text-accent">
                  {selectedOrder.order_number}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  {selectedOrder.customer_name}
                </h3>
                <p className="text-xs text-slate-400">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString("en-IN")}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Financial Summary Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Package Base Price:</span>
                  <span className="font-semibold">₹{selectedOrder.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18% Integrated):</span>
                  <span className="font-semibold">+₹{selectedOrder.gst_amount.toLocaleString("en-IN")}</span>
                </div>
                {selectedOrder.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({selectedOrder.coupon_code}):</span>
                    <span>-₹{selectedOrder.discount_amount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                  <span>Total Amount Paid:</span>
                  <span className="text-accent">
                    ₹{selectedOrder.total_amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Status Update Selectors */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-1">
                  <label className="font-bold text-slate-700 block text-[11px]">Payment Status</label>
                  <select
                    value={selectedOrder.payment_status}
                    onChange={(e) =>
                      handleUpdatePaymentStatus(selectedOrder.id, e.target.value as PaymentStatus)
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-bold text-slate-800"
                  >
                    <option value="paid">Paid (Verified)</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-1">
                  <label className="font-bold text-slate-700 block text-[11px]">Project Stage</label>
                  <select
                    value={selectedOrder.project_status}
                    onChange={(e) =>
                      handleUpdateProjectStatus(selectedOrder.id, e.target.value as ProjectStatus)
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-bold text-accent"
                  >
                    <option value="brief">1. Brief Received</option>
                    <option value="design">2. UI/UX Design</option>
                    <option value="development">3. Development</option>
                    <option value="review">4. Client Review</option>
                    <option value="live">5. Launched Live</option>
                  </select>
                </div>
              </div>

              {/* Razorpay Gateway Audit */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-accent" />
                  <span>Razorpay Payment Gateway Audit</span>
                </h4>
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Order ID:</span>
                    <span className="text-slate-700">{selectedOrder.razorpay_order_id || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment ID:</span>
                    <span className="text-slate-700 font-bold">{selectedOrder.razorpay_payment_id || "Awaiting Capture"}</span>
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                  Internal Production Notes
                </h4>
                {selectedOrder.notes && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 leading-relaxed whitespace-pre-line">
                    {selectedOrder.notes}
                  </div>
                )}

                <form onSubmit={handleAddOrderNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Append internal note..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <Button type="submit" variant="primary" className="text-xs px-3 py-1.5 gap-1">
                    <Send className="w-3 h-3" />
                    <span>Save</span>
                  </Button>
                </form>
              </div>

              {/* Print Tax Invoice Link */}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-slate-500">Formal Tax Document:</span>
                <Link
                  href={`/checkout/invoice/${selectedOrder.order_number}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-accent font-bold rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Open Printable Invoice</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
