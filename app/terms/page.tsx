"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PublicLayout } from "@/components/site";
import { Badge } from "@/components/ui/badge";
import { OrbsBackground } from "@/components/ui/orbs-background";

export default function TermsPage() {
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
          <Badge variant="blue">Terms & Conditions</Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-black tracking-tight" style={{ color: "#000000" }}>
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-black font-medium">
            Last Updated: October 2026 • Webspyra Technologies India
          </p>
        </div>

        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-white space-y-8 text-sm sm:text-base text-black font-medium leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-display font-bold text-xl text-black">1. Agreement to Terms</h2>
            <p>
              By engaging Webspyra for web development, design, or maintenance services, you agree to comply with and be bound by these Terms of Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-xl text-black">2. Project Scope & Deliverables</h2>
            <p>
              Deliverables, timelines, and scope are defined in your approved invoice or proposal. Standard revisions (up to 3 rounds) are included in every milestone. Additional feature requests outside the original scope will be quoted separately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-xl text-black">3. Intellectual Property Ownership</h2>
            <p>
              Upon receipt of final payment, full intellectual property rights to the custom code, content, and media created for your website transfer directly to the client. Domain names are registered under the client&apos;s name and ownership.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-xl text-black">4. Payment Terms</h2>
            <p>
              Standard engagements require a 50% deposit prior to project kickoff, with the balance due upon staging link approval before DNS pointing to your live domain. All invoices include 18% GST as per Indian law.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-xl text-textPrimary">5. Governing Law</h2>
            <p>
              These terms are governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts of Gurugram / New Delhi.
            </p>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
