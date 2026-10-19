"use client";

import React from "react";
import { MessageSquare, FileText, Code2, Rocket, ArrowRight, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionReveal, StaggerContainer, StaggerItem } from "@/components/ui/section-reveal";
import { GridPulse } from "@/components/ui/grid-pulse";

export interface HowItWorksSectionProps {
  onOpenQuote?: () => void;
}

export function HowItWorksSection({ onOpenQuote }: HowItWorksSectionProps) {
  const steps = [
    {
      number: "01",
      icon: <MessageSquare className="w-6 h-6 text-accent" />,
      glow: "blue" as const,
      badge: "Step 1",
      title: "Message Us & Free Consultation",
      description:
        "Connect on WhatsApp or submit a quick quote request. A dedicated web consultant analyzes your requirements and suggests the best plan.",
      highlight: "Takes 5 minutes",
      borderColor: "#06b6d4",
      boxShadow: "0 0 14px rgba(6, 182, 212, 0.4), 0 0 28px rgba(6, 182, 212, 0.15)",
    },
    {
      number: "02",
      icon: <FileText className="w-6 h-6 text-[#B45309]" />,
      glow: "peach" as const,
      badge: "Step 2",
      title: "Share Content & Preferences",
      description:
        "Send your company logo, service details, and contact numbers. Don't have copy ready? Our expert team can draft compelling content for you.",
      highlight: "Simple onboarding",
      borderColor: "#f59e0b",
      boxShadow: "0 0 14px rgba(245, 158, 11, 0.4), 0 0 28px rgba(245, 158, 11, 0.15)",
    },
    {
      number: "03",
      icon: <Code2 className="w-6 h-6 text-[#0F766E]" />,
      glow: "mint" as const,
      badge: "Step 3",
      title: "We Design & Develop",
      description:
        "Our engineering team builds your bespoke, high-converting website on Next.js 14 with soft pastel glassmorphism and lightning-fast speeds.",
      highlight: "5-7 days turnaround",
      borderColor: "#10b981",
      boxShadow: "0 0 14px rgba(16, 185, 129, 0.4), 0 0 28px rgba(16, 185, 129, 0.15)",
    },
    {
      number: "04",
      icon: <Rocket className="w-6 h-6 text-rose" />,
      glow: "pink" as const,
      badge: "Step 4",
      title: "Review, Polish & Go Live",
      description:
        "Preview your live staging link, request any fine-tune edits, and watch your business launch with a free domain, hosting, and SSL certificate.",
      highlight: "100% Satisfaction",
      borderColor: "#f43f5e",
      boxShadow: "0 0 14px rgba(244, 63, 94, 0.4), 0 0 28px rgba(244, 63, 94, 0.15)",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative overflow-hidden bg-white text-black border-b border-slate-200">
      <GridPulse
        cell={26}
        reach={2.6}
        ambient={2}
        className="text-black"
        style={{
          "--grid-pulse-line": "rgba(0, 0, 0, 0.06)",
        } as React.CSSProperties}
      />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-16 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <SectionReveal>
            <div className="inline-flex items-center gap-2">
              <Badge variant="blue" pulseDot>
                Simple 4-Step Process
              </Badge>
              <Badge variant="mint">Zero Technical Hassle</Badge>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-textPrimary tracking-tight leading-[1.18]">
              From concept to live website in 4 simple steps.
            </h2>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <p className="text-base sm:text-lg text-black font-medium leading-relaxed">
              We handle all the technical heavy lifting — domain setup, cloud hosting, design, copywriting, and security — so you can focus on growing your revenue.
            </p>
          </SectionReveal>
        </div>

        {/* Steps Grid with Connector Style */}
        <div className="relative">
          {/* Subtle Desktop Connector Line in Background */}
          <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-accent/20 via-mint/40 to-rose/30 -translate-y-8 z-0 pointer-events-none" />

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {steps.map((step) => (
              <StaggerItem key={step.number} className="relative group h-full">
                {/* Card with 4-side Bright Neon Border ONLY (Interior is 100% pure solid white, no internal glow) */}
                <GlassCard
                  enableTilt
                  enableShine={false}
                  glowColor="none"
                  style={{
                    borderColor: step.borderColor,
                    boxShadow: step.boxShadow,
                    borderWidth: "2px",
                    borderStyle: "solid",
                  }}
                  className="p-5 sm:p-8 h-full flex flex-col justify-between space-y-6 relative rounded-2xl bg-white z-10 transition-all duration-300 group-hover:-translate-y-1"
                >
                  <div className="space-y-5">
                    {/* Step Number & Icon Header */}
                    <div className="flex items-center justify-between">
                      <span className="font-display font-extrabold text-4xl text-textPrimary/15 group-hover:text-accent/30 transition-colors">
                        {step.number}
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-white/90 border border-slate-200/80 shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        {step.icon}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="blue">
                        {step.badge}
                      </Badge>
                      <h3 className="font-display font-bold text-lg sm:text-xl text-textPrimary leading-snug">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-sm text-black font-medium leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Highlight Footer Pill */}
                  <div className="pt-4 border-t border-border-glass/40 flex items-center justify-between text-xs font-semibold text-textPrimary">
                    <span className="text-accent flex items-center gap-1 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      {step.highlight}
                    </span>
                    <span className="text-textMuted group-hover:text-accent transition-colors font-bold">
                      &rarr;
                    </span>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Bottom CTA Bar */}
        <SectionReveal delay={0.3}>
          <div className="text-center pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={onOpenQuote}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="shadow-glow hover:shadow-glow-lg w-full sm:w-auto"
            >
              Start Step 1: Get Free Quote
            </Button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
