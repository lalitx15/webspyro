"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PublicLayout } from "@/components/site";
import { Badge } from "@/components/ui/badge";
import { OrbsBackground } from "@/components/ui/orbs-background";

export default function PrivacyPolicyPage() {
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
          <Badge variant="blue">Legal Documentation</Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-black tracking-tight" style={{ color: "#000000" }}>
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-black font-medium">
            Last Updated: October 2026 • Webspyra Technologies India
          </p>
        </div>

        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-white space-y-8 text-sm sm:text-base text-black font-medium leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-display font-bold text-xl text-black">1. Overview</h2>
            <p>
              Webspyra (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting the privacy of our website visitors, clients, and prospective buyers. This Privacy Policy outlines how we collect, store, and utilize your personal and business data.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-xl text-black">2. Information We Collect</h2>
            <p>We collect information directly when you fill out our lead forms, request quotes, or contact our team:</p>
            <ul className="list-disc pl-5 space-y-1 text-black font-medium">
              <li>Contact details: Name, phone/WhatsApp number, email address, and company name.</li>
              <li>Project details: Target budget, website requirements, and preferences.</li>
              <li>Technical details: IP address, browser type, and device parameters for anti-spam security.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-xl text-textPrimary">3. How We Use Your Data</h2>
            <p>We use your data solely for:</p>
            <ul className="list-disc pl-5 space-y-1 text-textPrimary">
              <li>Providing technical project proposals, quotations, and callback consultations.</li>
              <li>Setting up your domain registration, SSL certificates, and cloud hosting accounts.</li>
              <li>Invoicing and GST compliance through Razorpay payment gateways.</li>
            </ul>
            <p>We never sell, rent, or trade your personal information to third-party telemarketers.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-xl text-textPrimary">4. Data Security</h2>
            <p>
              All customer data is encrypted in transit via TLS 1.3 and stored in secure PostgreSQL databases with Row Level Security (RLS) policies. Payment details are processed directly by RBI-authorized payment aggregators (Razorpay) and are never stored on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-xl text-textPrimary">5. Contact Us Regarding Privacy</h2>
            <p>
              If you have any questions or wish to delete your contact records, email us at{" "}
              <a href="mailto:privacy@webspyra.com" className="text-accent font-semibold underline">
                privacy@webspyra.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
