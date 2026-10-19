"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  FileText,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "WSP-100234";

  return (
    <div className="py-16 sm:py-24 px-5 sm:px-8 max-w-4xl mx-auto space-y-10">
      {/* Celebration Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 14, stiffness: 220 }}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-mint-light flex items-center justify-center text-success mx-auto shadow-glow-mint border-4 border-white"
        >
          <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14" />
        </motion.div>

        <Badge variant="mint" pulseDot>
          Payment Verified & Confirmed
        </Badge>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-textPrimary tracking-tight">
          Congratulations! Your Project Is Underway.
        </h1>

        <p className="text-sm sm:text-base text-textSecondary max-w-lg mx-auto">
          Thank you for trusting Webspyra with your digital presence. Your payment has been received and our engineering architects have initiated your project workspace.
        </p>
      </div>

      {/* Order Summary Pill Card */}
      <GlassCard glowColor="blue" className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Order Reference Number
            </p>
            <p className="font-mono text-2xl font-extrabold text-accent mt-0.5">
              {orderNumber}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/checkout/invoice/${encodeURIComponent(orderNumber)}`}>
              <Button
                variant="secondary"
                size="md"
                leftIcon={<FileText className="w-4 h-4 text-accent" />}
              >
                Print Tax Invoice
              </Button>
            </Link>

            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(
                `Hi Webspyra Team, I just completed order ${orderNumber}. Looking forward to the kickoff!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="primary"
                size="md"
                leftIcon={<MessageCircle className="w-4 h-4" />}
                className="shadow-glow"
              >
                Chat with Project Lead
              </Button>
            </a>
          </div>
        </div>

        {/* 4-Step What Happens Next Roadmap */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-base sm:text-lg text-textPrimary">
            What Happens Next? Your 4-Step Delivery Roadmap
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/80 border border-slate-100 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 text-accent font-bold text-xs sm:text-sm">
                <span className="w-5 h-5 rounded-full bg-accent text-white text-[11px] flex items-center justify-center">
                  1
                </span>
                <span>Project Brief & Kickoff Call</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-7">
                Your dedicated project manager will contact you within 24 hours to review your branding, preferred color palettes, and reference websites.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-100 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 text-accent font-bold text-xs sm:text-sm">
                <span className="w-5 h-5 rounded-full bg-accent text-white text-[11px] flex items-center justify-center">
                  2
                </span>
                <span>UI/UX Wireframes & Prototypes</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-7">
                Our UI designers prepare pixel-perfect interactive Figma mockups for your approval before coding begins.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-100 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 text-accent font-bold text-xs sm:text-sm">
                <span className="w-5 h-5 rounded-full bg-accent text-white text-[11px] flex items-center justify-center">
                  3
                </span>
                <span>Development & Live Staging Link</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-7">
                We develop your website on Next.js 14 with animations and test-deploy it to a private staging URL for your review.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-100 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 text-accent font-bold text-xs sm:text-sm">
                <span className="w-5 h-5 rounded-full bg-accent text-white text-[11px] flex items-center justify-center">
                  4
                </span>
                <span>Domain Binding & Final Go-Live</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-7">
                Once you approve, we configure SSL certificates, DNS records, business emails, and launch your site live to the world!
              </p>
            </div>
          </div>
        </div>

        {/* Security & Support Guarantee */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-success shrink-0" />
            <span>Need to update your requirements? You can do so anytime via WhatsApp or email.</span>
          </div>

          <Link href="/" className="font-semibold text-accent hover:underline shrink-0">
            Return to Homepage →
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500">Loading order confirmation...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
