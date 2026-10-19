"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  TrendingUp,
  Zap,
  Quote,
} from "lucide-react";
import { PublicLayout, useQuoteModal } from "@/components/site";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/ui/section-reveal";
import { OrbsBackground } from "@/components/ui/orbs-background";
import { portfolioData } from "@/lib/inner-pages-data";

interface CaseStudyPageProps {
  params: { slug: string };
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { openQuoteModal } = useQuoteModal();
  const project = portfolioData.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <PublicLayout>
      <div className="relative min-h-screen py-16 md:py-24 px-5 sm:px-8 max-w-5xl mx-auto space-y-16">
        <OrbsBackground variant="hero" />

        {/* Back Link */}
        <SectionReveal>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-textSecondary hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Projects
          </Link>
        </SectionReveal>

        {/* Hero Title */}
        <div className="space-y-6">
          <SectionReveal delay={0.05}>
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="blue" pulseDot>
                Case Study
              </Badge>
              <span className="text-xs font-semibold px-3 py-1 rounded-pill bg-white/80 border border-white text-textSecondary">
                Industry: {project.industry}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-pill bg-white/80 border border-white text-textSecondary">
                Client: {project.client_name}
              </span>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-textPrimary tracking-tight leading-[1.15]">
              {project.title}
            </h1>
          </SectionReveal>

          {/* 3 Results Stats Bar */}
          <SectionReveal delay={0.15}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white/80 border border-white shadow-sm space-y-1 text-center sm:text-left">
                <span className="text-xs text-textSecondary uppercase font-bold tracking-wider">
                  {project.results_stats.stat1_label}
                </span>
                <p className="font-display font-extrabold text-3xl text-accent">
                  {project.results_stats.stat1_value}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 border border-white shadow-sm space-y-1 text-center sm:text-left">
                <span className="text-xs text-textSecondary uppercase font-bold tracking-wider">
                  {project.results_stats.stat2_label}
                </span>
                <p className="font-display font-extrabold text-3xl text-[#0F766E]">
                  {project.results_stats.stat2_value}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 border border-white shadow-sm space-y-1 text-center sm:text-left">
                <span className="text-xs text-textSecondary uppercase font-bold tracking-wider">
                  {project.results_stats.stat3_label}
                </span>
                <p className="font-display font-extrabold text-3xl text-rose">
                  {project.results_stats.stat3_value}
                </p>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2} className="flex flex-wrap items-center gap-4 pt-2">
            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ExternalLink className="w-4 h-4" />}
                className="shadow-glow"
              >
                Visit Live Website
              </Button>
            </a>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => openQuoteModal()}
            >
              Get Free Project Proposal
            </Button>
          </SectionReveal>
        </div>

        {/* Featured Showcase Hero Image */}
        <SectionReveal delay={0.25}>
          <div className="relative h-72 sm:h-[480px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              priority
              className="object-cover object-top"
            />
          </div>
        </SectionReveal>

        {/* Deep Dive: Challenge vs Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <GlassCard glowColor="pink" className="p-7 sm:p-9 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose/10 text-rose flex items-center justify-center">
              <TrendingUp className="w-5 h-5 rotate-180" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-textPrimary">
              The Challenge Faced
            </h2>
            <p className="text-sm sm:text-base text-textSecondary leading-relaxed">
              {project.challenge}
            </p>
          </GlassCard>

          <GlassCard glowColor="mint" className="p-7 sm:p-9 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-mint-light text-[#0F766E] flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-textPrimary">
              The Webspyra Solution
            </h2>
            <p className="text-sm sm:text-base text-textSecondary leading-relaxed">
              {project.solution}
            </p>
          </GlassCard>
        </div>

        {/* Gallery Grid */}
        <SectionReveal className="space-y-6">
          <div className="space-y-1">
            <Badge variant="blue">Screenshots & Architecture</Badge>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-textPrimary">
              Visual Design Gallery
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {project.gallery.map((imgUrl, i) => (
              <div
                key={i}
                className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-white shadow-card bg-slate-100 group"
              >
                <Image
                  src={imgUrl}
                  alt={`${project.title} screenshot ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* Client Testimonial Card */}
        <SectionReveal>
          <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-white relative overflow-hidden space-y-5">
            <Quote className="w-10 h-10 text-accent/30 absolute top-6 right-6" />
            <div className="flex items-center gap-1 text-warning">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-lg">★</span>
              ))}
            </div>

            <p className="text-base sm:text-xl text-textPrimary italic font-medium leading-relaxed max-w-3xl">
              &ldquo;{project.testimonial.quote}&rdquo;
            </p>

            <div className="pt-2 border-t border-slate-200/60">
              <h4 className="font-display font-bold text-base text-textPrimary">
                {project.testimonial.author}
              </h4>
              <p className="text-xs text-textSecondary">
                {project.testimonial.role} — {project.client_name}
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* Tech Stack Tags */}
        <SectionReveal className="p-6 rounded-2xl bg-white/70 border border-white flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-bold text-textSecondary uppercase tracking-wider">
            Technologies Utilized:
          </span>
          <div className="flex flex-wrap gap-2">
            {project.tech_tags.map((t, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-pill bg-slate-100 text-xs font-semibold text-textPrimary"
              >
                {t}
              </span>
            ))}
          </div>
        </SectionReveal>

        {/* Bottom CTA Banner */}
        <SectionReveal>
          <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-white text-center space-y-6">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-textPrimary">
              Want similar results for your business?
            </h2>
            <p
              className="text-sm sm:text-base text-black max-w-xl mx-auto font-medium"
              style={{ color: "#000000", opacity: 1 }}
            >
              Our engineering team builds custom websites designed from ground zero to scale revenue and build authentic authority.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => openQuoteModal()}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-glow"
              >
                Get Free Project Quote
              </Button>
              <Link href="/portfolio">
                <Button variant="secondary" size="lg">
                  Explore More Case Studies
                </Button>
              </Link>
            </div>
          </div>
        </SectionReveal>
      </div>
    </PublicLayout>
  );
}
