"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FolderGit2,
  Receipt,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  Server,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import { useChat } from "@/lib/chat-context";

const PROJECT_STAGES = [
  { id: "brief", label: "Brief Received", desc: "Requirements & Assets Locked", status: "completed" },
  { id: "design", label: "UI/UX Design", desc: "Interactive Figma Wireframes", status: "active" },
  { id: "dev", label: "Development", desc: "Next.js 14 & Motion Effects", status: "upcoming" },
  { id: "review", label: "Client Review", desc: "Live Private Staging Link", status: "upcoming" },
  { id: "live", label: "Live & Handover", desc: "Domain Binding & DNS SSL", status: "upcoming" },
];

export default function PortalDashboard() {
  const { profile, user } = useAuth();
  const { openChat } = useChat();

  const clientName = profile?.full_name || user?.user_metadata?.full_name || "Valued Client";

  return (
    <div className="space-y-8">
      {/* 1. Welcome Greeting Banner */}
      <GlassCard glowColor="blue" className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2">
            <Badge variant="mint" pulseDot>
              Project Active • On Schedule
            </Badge>
            <span className="text-xs text-slate-500">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {clientName}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            Your website project is currently in the <strong>UI/UX Design</strong> phase. Staging build is scheduled for preview in 48 hours.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            size="md"
            onClick={openChat}
            leftIcon={<MessageCircle className="w-4 h-4 text-accent" />}
          >
            Live Support
          </Button>

          <a
            href="https://wa.me/919876543210?text=Hi%20Webspyra,%20I'm%20checking%20in%20on%20my%20website%20project."
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="primary"
              size="md"
              className="shadow-glow"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Contact Architect
            </Button>
          </a>
        </div>
      </GlassCard>

      {/* 2. 4 Metric Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Project</span>
            <div className="w-8 h-8 rounded-xl bg-blue/10 text-accent flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="font-display font-extrabold text-2xl text-slate-900">01</p>
            <p className="text-[11px] text-success font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success" /> Classic Growth Plan
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Invoices & Orders</span>
            <div className="w-8 h-8 rounded-xl bg-mint-light text-slate-800 flex items-center justify-center">
              <Receipt className="w-4 h-4 text-accent" />
            </div>
          </div>
          <div>
            <p className="font-display font-extrabold text-2xl text-slate-900">01 Paid</p>
            <p className="text-[11px] text-slate-500 mt-0.5">₹17,699.00 Total</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cloud Server</span>
            <div className="w-8 h-8 rounded-xl bg-sky-light text-slate-800 flex items-center justify-center">
              <Server className="w-4 h-4 text-accent" />
            </div>
          </div>
          <div>
            <p className="font-display font-extrabold text-2xl text-slate-900">365 Days</p>
            <p className="text-[11px] text-success font-semibold mt-0.5">100% Free Year 1</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">SSL & Security</span>
            <div className="w-8 h-8 rounded-xl bg-peach-light text-slate-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-success" />
            </div>
          </div>
          <div>
            <p className="font-display font-extrabold text-2xl text-slate-900">Active</p>
            <p className="text-[11px] text-slate-500 mt-0.5">256-bit Cloudflare SSL</p>
          </div>
        </GlassCard>
      </div>

      {/* 3. SPOTLIGHT PROJECT: Animated 5-Stage Status Timeline */}
      <GlassCard glowColor="mint" className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-bold text-slate-900">
                Corporate Website Launch
              </h3>
              <Badge variant="blue">Stage 2 of 5</Badge>
            </div>
            <p className="text-xs text-slate-500">
              Order Ref: <strong>WSP-100234</strong> • Target Delivery: <strong>7 Working Days</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://preview.webspyra.com/demo-client"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
            >
              <span>Staging Preview</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link href="/portal/projects">
              <Button variant="secondary" size="sm">
                View Full Tracker
              </Button>
            </Link>
          </div>
        </div>

        {/* 5-Stage Animated Milestone Stepper */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Overall Progress: 40% Completed</span>
            <span className="text-accent">Next Milestone: Development Sprint</span>
          </div>

          {/* Progress Line */}
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "40%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-accent-grad rounded-full shadow-glow"
            />
          </div>

          {/* Milestone Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-3">
            {PROJECT_STAGES.map((stg, idx) => {
              const isCompleted = stg.status === "completed";
              const isActive = stg.status === "active";

              return (
                <div
                  key={stg.id}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isActive
                      ? "bg-accent/5 border-accent shadow-sm ring-2 ring-accent/20"
                      : isCompleted
                      ? "bg-mint-light/40 border-mint"
                      : "bg-white/60 border-slate-100 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                        isCompleted
                          ? "bg-success text-white"
                          : isActive
                          ? "bg-accent text-white shadow-glow"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {isCompleted ? "✓" : idx + 1}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                    )}
                  </div>
                  <p className="font-bold text-xs text-slate-900">{stg.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{stg.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deliverables Checklist Pill Box */}
        <div className="p-4 rounded-2xl bg-white/80 border border-slate-100 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Active Deliverables Checklist:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Free Domain (.com/.in) Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Cloud Server Node Provisioned</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>SSL Encryption Installed</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span>UI/UX Figma Mockup (In Progress)</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Next.js 14 Interactive Pages</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>XML Sitemap & Google Indexing</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 4. Recent Orders & Invoices Table */}
      <GlassCard className="p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Recent Orders & Tax Invoices
            </h3>
            <p className="text-xs text-slate-500">
              Download GST-compliant tax invoices for input credit.
            </p>
          </div>
          <Link href="/portal/orders">
            <Button variant="ghost" size="sm">
              All Orders →
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 pr-4">Order ID</th>
                <th className="py-2.5 px-4">Package</th>
                <th className="py-2.5 px-4">Amount</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 pl-4 text-right">Invoice Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 pr-4 font-mono font-bold text-accent">WSP-100234</td>
                <td className="py-3 px-4 font-bold text-slate-900">Classic Growth Business Website</td>
                <td className="py-3 px-4 font-medium text-slate-800">₹17,699 (Incl. GST)</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-success/15 text-success font-bold text-[10px]">
                    PAID
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-500">Today</td>
                <td className="py-3 pl-4 text-right">
                  <Link href="/checkout/invoice/WSP-100234">
                    <Button variant="secondary" size="sm" className="text-xs h-7 px-3">
                      Print Invoice
                    </Button>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
