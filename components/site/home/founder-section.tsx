"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Award,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

export interface FounderSectionProps {
  onOpenQuote?: () => void;
}

export function FounderSection({ onOpenQuote }: FounderSectionProps) {
  const directFounderWhatsApp = `https://wa.me/918958889538?text=${encodeURIComponent(
    "Hi Lalit, I am interested in building a high-end modern website with Webspyra. Let's connect!"
  )}`;

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#07090e] text-white border-t border-neutral-900">
      {/* Dynamic Background Glow Spotlights */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <SectionReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Leadership & Visionary Architecture</span>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Meet the Mind Behind{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">
                Webspyra
              </span>
            </h2>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Driven by engineering perfection, relentless innovation, and a commitment to helping brands scale without limits.
            </p>
          </SectionReveal>
        </div>

        {/* Fancy Animated Founder Card */}
        <SectionReveal delay={0.2}>
          <div className="relative rounded-3xl bg-gradient-to-br from-[#101728]/95 via-[#0b101c]/95 to-[#05070e]/98 border-2 border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.2)] backdrop-blur-2xl overflow-hidden p-6 sm:p-10 lg:p-12">
            {/* Top Corner Decorative Badge */}
            <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-44 h-44 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Founder Photo Frame */}
              <div className="lg:col-span-5 flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative group w-full max-w-sm sm:max-w-md aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-cyan-400/40 shadow-[0_0_35px_rgba(6,182,212,0.3)] bg-neutral-950"
                >
                  <Image
                    src="/images/founder-lalit-thakur.png"
                    alt="Lalit Thakur — Founder & CEO of Webspyra"
                    fill
                    sizes="(max-width: 768px) 100vw, 450px"
                    priority
                    unoptimized
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient bottom shadow over image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  {/* Floating Status Badge */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-neutral-700 text-[11px] font-bold text-white shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Founder • Direct Lead</span>
                  </div>

                  {/* Bottom Image Overlay Tag */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-white space-y-0.5">
                    <p className="text-xs font-mono text-cyan-300 font-extrabold uppercase tracking-widest">
                      Founder & Chief Executive Officer
                    </p>
                    <p className="text-lg font-black text-white">
                      Lalit Thakur
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Founder Vision & Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-black">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <span>Visionary Founder & Tech Lead</span>
                  </div>

                  <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                    Lalit Thakur
                  </h3>

                  <p className="text-sm sm:text-base font-extrabold text-cyan-300/90 tracking-wide">
                    Founder & CEO, Webspyra
                  </p>
                </div>

                {/* Personal Mission Quote */}
                <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border-l-4 border-cyan-400 border-neutral-800 text-slate-200 text-sm sm:text-base leading-relaxed italic">
                  &ldquo;At Webspyra, our goal is clear: to engineer modern web architectures that don&apos;t just look phenomenal, but actively drive revenue, dominate Google search results, and convert everyday visitors into high-value clients.&rdquo;
                </div>

                {/* 3 Key Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-cyan-400/40 transition-all space-y-1">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <p className="text-xs font-bold text-white">Zero Bloat Code</p>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      High-performance handwritten Next.js & TypeScript engines.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-emerald-400/40 transition-all space-y-1">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <p className="text-xs font-bold text-white">Founder Guarantee</p>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Direct personal review on every deployment across India.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-purple-400/40 transition-all space-y-1">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <p className="text-xs font-bold text-white">Conversion Focused</p>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Designed to generate instant WhatsApp & call leads.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <a
                    href={directFounderWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer transform hover:scale-105"
                  >
                    <WhatsAppIcon className="w-4 h-4 shrink-0" fill="#ffffff" />
                    <span>Chat with Lalit on WhatsApp</span>
                  </a>

                  {onOpenQuote && (
                    <button
                      type="button"
                      onClick={onOpenQuote}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-sm border border-neutral-700 hover:border-cyan-400 transition-all cursor-pointer"
                    >
                      <span>Get Free Consultation</span>
                      <ArrowRight className="w-4 h-4 text-cyan-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
