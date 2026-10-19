"use client";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageCircle,
} from "lucide-react";
import { PublicLayout, useQuoteModal } from "@/components/site";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { SectionReveal } from "@/components/ui/section-reveal";
import { OrbsBackground } from "@/components/ui/orbs-background";
import { servicesData } from "@/lib/inner-pages-data";

interface ServiceDetailPageProps {
  params: { slug: string };
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { openQuoteModal } = useQuoteModal();
  const service = servicesData.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  const accordionItems = service.faqs.map((faq, idx) => ({
    id: `faq-${idx}`,
    title: faq.question,
    content: (
      <p className="text-sm sm:text-base text-textSecondary leading-relaxed">
        {faq.answer}
      </p>
    ),
  }));

  return (
    <PublicLayout>
      <div className="relative min-h-screen py-16 md:py-24 px-5 sm:px-8 max-w-5xl mx-auto space-y-16">
        <OrbsBackground variant="hero" />

        {/* Back Link */}
        <SectionReveal>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-textSecondary hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Services
          </Link>
        </SectionReveal>

        {/* Header Hero */}
        <div className="space-y-6">
          <SectionReveal delay={0.05}>
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="blue" pulseDot>
                {service.badge}
              </Badge>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-white/90 border border-slate-200 text-xs font-bold text-black" style={{ color: "#000000" }}>
                <Clock className="w-3.5 h-3.5 text-accent" />
                Delivery: {service.delivery_time}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-white/90 border border-slate-200 text-xs font-bold text-black" style={{ color: "#000000" }}>
                Starting from ₹{service.starting_price.toLocaleString("en-IN")}
              </span>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-black tracking-tight leading-[1.14]" style={{ color: "#000000" }}>
              {service.title}
            </h1>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <p className="text-base sm:text-xl text-black font-medium leading-relaxed max-w-3xl" style={{ color: "#000000", opacity: 1 }}>
              {service.tagline}
            </p>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => openQuoteModal(service.related_plan_slug)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-glow"
              >
                Get Free Quote for {service.title}
              </Button>
              <Link href="/pricing">
                <Button variant="secondary" size="lg">
                  Compare Pricing Plans
                </Button>
              </Link>
            </div>
          </SectionReveal>
        </div>

        {/* Overview & Key Inclusions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <GlassCard glowColor="blue" className="p-7 sm:p-9 space-y-4">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-black" style={{ color: "#000000" }}>
                Service Overview
              </h2>
              <p className="text-sm sm:text-base text-black font-medium leading-relaxed" style={{ color: "#000000", opacity: 1 }}>
                {service.overview}
              </p>
              <p className="text-sm sm:text-base text-black font-medium leading-relaxed" style={{ color: "#000000", opacity: 1 }}>
                Every project is handled by senior full-stack architects with a dedicated project manager ensuring daily progress reports, milestone testing, and zero deployment friction.
              </p>
            </GlassCard>

            {/* 4-Step Process */}
            <GlassCard glowColor="mint" className="p-7 sm:p-9 space-y-6">
              <div className="space-y-1">
                <Badge variant="mint">
                  Our Methodology
                </Badge>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-black" style={{ color: "#000000" }}>
                  How We Deliver Your Project
                </h3>
              </div>

              <div className="space-y-4">
                {service.process_steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-4 shadow-sm"
                  >
                    <span className="w-8 h-8 rounded-xl bg-accent/15 text-accent font-display font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4
                        className="font-display font-bold text-sm sm:text-base !text-black text-neutral-950"
                        style={{ color: "#000000", opacity: 1 }}
                      >
                        {step.title}
                      </h4>
                      <p
                        className="text-xs sm:text-sm !text-black text-neutral-900 mt-0.5 leading-relaxed font-medium"
                        style={{ color: "#000000", opacity: 1 }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Inclusions & Tech Stack */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard glowColor="peach" className="p-7 sm:p-8 space-y-5">
              <h3 className="font-display font-bold text-lg text-black" style={{ color: "#000000" }}>
                Included as Standard
              </h3>

              <div className="space-y-3">
                {service.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-black font-semibold" style={{ color: "#000000" }}>
                    <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard glowColor="blue" className="p-7 sm:p-8 space-y-4">
              <h3 className="font-display font-bold text-lg text-black" style={{ color: "#000000" }}>
                Technology Stack Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.tech_stack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-pill bg-white border border-slate-200 text-xs font-bold text-black shadow-sm"
                    style={{ color: "#000000" }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </GlassCard>

            {/* Quick WhatsApp Support Box */}
            <div className="p-6 rounded-3xl bg-[#EDFAF8] border border-[#A9E3DD]/60 space-y-3 text-center">
              <MessageCircle className="w-8 h-8 text-[#0F766E] mx-auto" />
              <h4 className="font-display font-bold text-base text-black" style={{ color: "#000000" }}>
                Have specific technical questions?
              </h4>
              <p className="text-xs text-black font-medium" style={{ color: "#000000" }}>
                Connect directly with our lead engineer on WhatsApp for immediate clarity.
              </p>
              <a
                href={`https://wa.me/918958889538?text=${encodeURIComponent(
                  `Hi Webspyra, I have a few questions regarding ${service.title}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block pt-1"
              >
                <Button variant="primary" size="sm" className="shadow-glow">
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Service FAQs Accordion */}
        {accordionItems.length > 0 && (
          <SectionReveal className="space-y-6">
            <div className="text-center space-y-2">
              <Badge variant="blue">Service FAQ</Badge>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-black" style={{ color: "#000000" }}>
                Frequently Asked Questions about {service.title}
              </h2>
            </div>
            <Accordion items={accordionItems} defaultOpenId="faq-0" />
          </SectionReveal>
        )}

        {/* Bottom CTA Banner */}
        <SectionReveal>
          <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-white text-center space-y-6">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-black" style={{ color: "#000000" }}>
              Ready to get started on your {service.title}?
            </h2>
            <p
              className="text-sm sm:text-base text-black max-w-xl mx-auto font-medium"
              style={{ color: "#000000", opacity: 1 }}
            >
              Takes just 30 seconds. We will analyze your requirements, prepare a wireframe, and share a fixed price timeline.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => openQuoteModal(service.related_plan_slug)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-glow"
              >
                Get Free Project Quote
              </Button>
              <Link href="/get-quote">
                <Button variant="secondary" size="lg">
                  Use 30s Quote Wizard
                </Button>
              </Link>
            </div>
          </div>
        </SectionReveal>
      </div>
    </PublicLayout>
  );
}
