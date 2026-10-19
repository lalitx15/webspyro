"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Printer, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Order } from "@/types";

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = (params?.orderNumber as string) || "WSP-100234";

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // In production, can query /api/orders/[orderNumber]
    // Here we provide fallback data for the invoice
    setOrder({
      id: "ord_demo",
      order_number: orderNumber,
      customer_name: "Valued Client",
      customer_email: "client@webspyra.com",
      customer_phone: "+91 98765 43210",
      subtotal: 14999,
      discount_amount: 0,
      gst_amount: 2700,
      total_amount: 17699,
      coupon_code: null,
      payment_status: "paid",
      razorpay_payment_id: `pay_${orderNumber.replace(/[^0-9]/g, "") || "987654321"}`,
      project_status: "brief",
        created_at: new Date().toISOString(),
      });
    }, [orderNumber]);

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      {/* Top Navigation Bar - Hidden on print */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>

        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="secondary" size="sm">
              Home
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
            className="shadow-glow"
          >
            Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* Official Tax Invoice Paper Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 space-y-8 text-slate-800 print:border-none print:shadow-none print:p-0">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-10 h-10 rounded-2xl bg-accent-grad text-white flex items-center justify-center font-bold text-lg shadow-md">
                W
              </span>
              <span className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
                WEBSPYRA
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Webspyra Digital Solutions Private Limited
            </p>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Level 4, DLF Cyber City, Tower B, Gurugram, Haryana 122002, India
            </p>
            <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
              <p>
                <strong>GSTIN:</strong> 07AAAAA0000A1Z5 | <strong>PAN:</strong> AAAAA0000A
              </p>
              <p>
                <strong>Email:</strong> billing@webspyra.com | <strong>Support:</strong> +91 98765 43210
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-mint-light/80 border border-mint text-success text-xs font-bold tracking-wide uppercase">
              TAX INVOICE
            </div>
            <div className="space-y-1">
              <p className="font-mono text-xl sm:text-2xl font-black text-slate-900">
                {orderNumber}
              </p>
              <p className="text-xs text-slate-500">
                <strong>Date:</strong> {invoiceDate}
              </p>
              <p className="text-xs text-slate-500">
                <strong>Transaction ID:</strong> {order?.razorpay_payment_id || "pay_verified"}
              </p>
              <p className="text-xs text-slate-500">
                <strong>Payment Mode:</strong> Razorpay (UPI / NetBanking / Cards)
              </p>
            </div>

            {/* Paid Stamp */}
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-success/10 text-success text-xs font-bold border border-success/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> PAID IN FULL
              </span>
            </div>
          </div>
        </div>

        {/* Billed To Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/70 p-5 rounded-2xl border border-slate-100 text-xs">
          <div className="space-y-1">
            <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Billed To (Client):
            </p>
            <p className="font-bold text-sm text-slate-900">{order?.customer_name || "Valued Client"}</p>
            <p className="text-slate-600">{order?.customer_email || "client@company.com"}</p>
            <p className="text-slate-600">{order?.customer_phone || "+91 98765 43210"}</p>
          </div>

          <div className="space-y-1 sm:text-right">
            <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Project Scope:
            </p>
            <p className="font-bold text-sm text-accent">Classic Growth Business Website</p>
            <p className="text-slate-600">Place of Supply: Haryana (06) / Delhi (07)</p>
            <p className="text-slate-600">Reverse Charge: No</p>
          </div>
        </div>

        {/* Itemized Services Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 pr-4">#</th>
                <th className="py-3 px-4">Service Description</th>
                <th className="py-3 px-4">SAC Code</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 pl-4 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-4 pr-4 font-bold text-slate-400">1</td>
                <td className="py-4 px-4">
                  <p className="font-bold text-slate-900 text-sm">
                    Professional Web Development & Architecture
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    Classic Growth Website (Up to 8 high-converting pages, Framer Motion animations, mobile zero-zoom optimization, lead forms, and analytics)
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-slate-500">998314</td>
                <td className="py-4 px-4 text-center">1</td>
                <td className="py-4 px-4 text-right font-medium">₹14,999.00</td>
                <td className="py-4 pl-4 text-right font-bold text-slate-900">₹14,999.00</td>
              </tr>

              <tr>
                <td className="py-4 pr-4 font-bold text-slate-400">2</td>
                <td className="py-4 px-4">
                  <p className="font-bold text-slate-900">
                    High-Speed Cloud Server Hosting (Year 1)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Complimentary high-speed cloud infrastructure deployment
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-slate-500">998315</td>
                <td className="py-4 px-4 text-center">1</td>
                <td className="py-4 px-4 text-right font-medium">₹0.00</td>
                <td className="py-4 pl-4 text-right font-bold text-success">FREE</td>
              </tr>

              <tr>
                <td className="py-4 pr-4 font-bold text-slate-400">3</td>
                <td className="py-4 px-4">
                  <p className="font-bold text-slate-900">
                    Domain Registration & Lifetime SSL Certificate
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Free .com/.in domain for Year 1 with auto-renewing SSL
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-slate-500">998313</td>
                <td className="py-4 px-4 text-center">1</td>
                <td className="py-4 px-4 text-right font-medium">₹0.00</td>
                <td className="py-4 pl-4 text-right font-bold text-success">FREE</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Calculation Totals */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200 text-xs">
          <div className="space-y-2 max-w-sm">
            <p className="font-bold text-slate-700">Amount in Words:</p>
            <p className="italic text-slate-600 font-serif leading-relaxed">
              Rupees Seventeen Thousand Six Hundred Ninety-Nine Only
            </p>
            <div className="pt-2 text-[11px] text-slate-500 space-y-1">
              <p>• GST calculated at 18% (9% CGST + 9% SGST) for domestic Indian services.</p>
              <p>• Year 1 includes all domain and hosting services at zero additional charge.</p>
            </div>
          </div>

          <div className="w-full sm:w-64 space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-medium text-slate-800">₹14,999.00</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Discount:</span>
              <span className="font-medium text-slate-800">₹0.00</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>CGST (9%):</span>
              <span className="font-medium text-slate-800">₹1,350.00</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>SGST (9%):</span>
              <span className="font-medium text-slate-800">₹1,350.00</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-2">
              <span>Grand Total:</span>
              <span className="text-accent text-lg">₹17,699.00</span>
            </div>
          </div>
        </div>

        {/* Footer & Authorized Signatory */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-slate-500">
          <div className="space-y-1">
            <p className="font-bold text-slate-700">Terms & Conditions:</p>
            <p>1. This is a computer-generated invoice and requires no physical signature.</p>
            <p>2. Milestone delivery terms apply as per service agreement.</p>
            <p>3. For billing or GST input queries, write to billing@webspyra.com.</p>
          </div>

          <div className="text-center sm:text-right space-y-2">
            <div className="font-serif italic font-bold text-base text-accent">
              Webspyra Authorised
            </div>
            <p className="text-[10px] text-slate-400">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
}
