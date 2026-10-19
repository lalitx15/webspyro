"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PublicLayout } from "@/components/site";
import { Badge } from "@/components/ui/badge";
import { OrbsBackground } from "@/components/ui/orbs-background";

export default function RefundPolicyPage() {
  return (
    <PublicLayout>
      <div className="relative min-h-screen py-16 md:py-24 px-5 sm:px-8 max-w-4xl mx-auto space-y-10">
        <OrbsBackground variant="hero" />

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-black hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="space-y-4">
          <Badge variant="mint">Customer Protection</Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-black tracking-tight" style={{ color: "#000000" }}>
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs sm:text-sm text-black font-medium">
            Last Updated: October 2026 • Webspyra Technologies India
          </p>
        </div>

        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-white space-y-8 text-sm sm:text-base text-black font-medium leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-display font-bold text-xl text-black">1. 100% Satisfaction Guarantee</h2>
            <p>
              We pride ourselves on exceptional engineering. If during the initial wireframing and design preview stage (within 7 days of deposit) you are dissatisfied with our visual direction and we cannot resolve your feedback, you may request a refund of your deposit, minus direct non-refundable third-party expenses (domain registration fee).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-xl text-black">2. Milestone Sign-Off & Approvals</h2>
            <p>
              Once a design milestone or staging website is formally approved in writing, development fees allocated to that milestone become non-refundable as engineering resources have been expended.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-xl text-textPrimary">3. Hosting & Annual Renewals</h2>
            <p>
              Annual renewals for domain names, dedicated cloud servers, and SSL certificates are paid annually in advance and are non-refundable once provisioned with registry authorities.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-xl text-textPrimary">4. Processing Time</h2>
            <p>
              Approved refunds are credited back to the original payment source (UPI account or card) via Razorpay within 5 to 7 working days.
            </p>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
