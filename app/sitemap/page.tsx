"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Layers, Briefcase, BookOpen } from "lucide-react";
import { PublicLayout } from "@/components/site";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { OrbsBackground } from "@/components/ui/orbs-background";
import { servicesData, portfolioData, blogPostsData } from "@/lib/inner-pages-data";

export default function HtmlSitemapPage() {
  return (
    <PublicLayout>
      <div className="relative min-h-screen py-16 md:py-24 px-5 sm:px-8 max-w-5xl mx-auto space-y-12">
        <OrbsBackground variant="hero" />

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-textSecondary hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="space-y-4">
          <Badge variant="blue">Website Architecture</Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-textPrimary tracking-tight">
            HTML Sitemap
          </h1>
          <p className="text-sm text-textSecondary max-w-xl">
            A comprehensive, accessible directory of all public pages, services, case studies, and insight articles on Webspyra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Pages */}
          <GlassCard glowColor="blue" className="p-7 space-y-4">
            <div className="flex items-center gap-2 text-accent font-bold text-lg">
              <Globe className="w-5 h-5" />
              <h3>Main Pages</h3>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/" className="text-textPrimary hover:text-accent font-semibold transition-colors">
                  Home Page
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-textPrimary hover:text-accent font-semibold transition-colors">
                  All Services Directory
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-textPrimary hover:text-accent font-semibold transition-colors">
                  Pricing & Comparison Plans
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-textPrimary hover:text-accent font-semibold transition-colors">
                  Client Case Studies & Portfolio
                </Link>
              </li>
              <li>
                <Link href="/get-quote" className="text-textPrimary hover:text-accent font-semibold transition-colors">
                  Instant 30s Quote Wizard
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-textPrimary hover:text-accent font-semibold transition-colors">
                  About Webspyra & Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-textPrimary hover:text-accent font-semibold transition-colors">
                  Contact Office & Direct Lines
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-textPrimary hover:text-accent font-semibold transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/design-system" className="text-textPrimary hover:text-accent font-semibold transition-colors">
                  Design System Showcase
                </Link>
              </li>
            </ul>
          </GlassCard>

          {/* Services */}
          <GlassCard glowColor="mint" className="p-7 space-y-4">
            <div className="flex items-center gap-2 text-[#0F766E] font-bold text-lg">
              <Layers className="w-5 h-5" />
              <h3>Services</h3>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {servicesData.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-textPrimary hover:text-accent font-semibold transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Portfolio Projects */}
          <GlassCard glowColor="peach" className="p-7 space-y-4">
            <div className="flex items-center gap-2 text-[#B45309] font-bold text-lg">
              <Briefcase className="w-5 h-5" />
              <h3>Case Studies & Portfolio</h3>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {portfolioData.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/portfolio/${p.slug}`}
                    className="text-textPrimary hover:text-accent font-semibold transition-colors"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Blog & Legal */}
          <GlassCard glowColor="pink" className="p-7 space-y-4">
            <div className="flex items-center gap-2 text-rose font-bold text-lg">
              <BookOpen className="w-5 h-5" />
              <h3>Insights & Legal</h3>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {blogPostsData.map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/blog/${b.slug}`}
                    className="text-textPrimary hover:text-accent font-semibold transition-colors line-clamp-1"
                  >
                    {b.title}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-slate-100">
                <Link href="/privacy-policy" className="text-textSecondary hover:text-accent font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-textSecondary hover:text-accent font-medium">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-textSecondary hover:text-accent font-medium">
                  Refund & Cancellation Policy
                </Link>
              </li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </PublicLayout>
  );
}
