"use client";

import React from "react";
import {
  MessageSquare,
  Smartphone,
  CreditCard,
  Zap,
  Share2,
  Headphones,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionReveal, StaggerContainer, StaggerItem } from "@/components/ui/section-reveal";
import { GridPulse } from "@/components/ui/grid-pulse";
import { ThreeDCard } from "@/components/ui/three-d-card";

export function FeaturesSection() {
  const features = [
    {
      icon: <MessageSquare className="w-5 h-5 text-black" />,
      badge: "Lead Generator",
      gradient: "linear-gradient(135deg, rgb(0, 255, 214) 0%, rgb(8, 226, 96) 100%)",
      title: "Live Chat Integration",
      description:
        "Engage prospective buyers the moment they land on your site. Real-time conversations sync straight to your admin and WhatsApp.",
      ctaText: "Explore Chat Sync",
      ctaHref: "#enquire",
    },
    {
      icon: <Smartphone className="w-5 h-5 text-black" />,
      badge: "100% Native App Feel",
      gradient: "linear-gradient(135deg, rgb(56, 189, 248) 0%, rgb(59, 130, 246) 100%)",
      title: "Responsive Mobile Architecture",
      description:
        "Engineered with zero-zoom viewport protection and 100dvh compliance. Delivers a native iOS and Android app experience on every device.",
      ctaText: "View Experience",
      ctaHref: "#portfolio",
    },
    {
      icon: <CreditCard className="w-5 h-5 text-black" />,
      badge: "Instant UPI & Razorpay",
      gradient: "linear-gradient(135deg, rgb(251, 191, 36) 0%, rgb(245, 158, 11) 100%)",
      title: "Integrated Payment Gateway",
      description:
        "Accept payments seamlessly with Razorpay. Supports UPI apps (GPay, PhonePe, Paytm), cards, netbanking, and automated GST invoices.",
      ctaText: "Explore Checkout",
      ctaHref: "#pricing",
    },
    {
      icon: <Zap className="w-5 h-5 text-black" />,
      badge: "Sub-Second Load",
      gradient: "linear-gradient(135deg, rgb(244, 114, 182) 0%, rgb(239, 68, 68) 100%)",
      title: "Light-Speed Cloud Servers",
      description:
        "Hosted on ultra-fast edge infrastructure with 99.9% uptime. High-speed caching guarantees 95+ scores on Google PageSpeed Insights.",
      ctaText: "Test PageSpeed",
      ctaHref: "#pricing",
    },
    {
      icon: <Share2 className="w-5 h-5 text-black" />,
      badge: "Local Search Dominance",
      gradient: "linear-gradient(135deg, rgb(167, 139, 250) 0%, rgb(124, 58, 237) 100%)",
      title: "Social & Map Integrations",
      description:
        "Connect your Instagram feed, Google Maps directions, Facebook profile, and WhatsApp chat directly into your modern storefront.",
      ctaText: "See Integrations",
      ctaHref: "#enquire",
    },
    {
      icon: <Headphones className="w-5 h-5 text-black" />,
      badge: "24/7 Priority Care",
      gradient: "linear-gradient(135deg, rgb(148, 163, 184) 0%, rgb(71, 85, 105) 100%)",
      title: "Dedicated Technical Support",
      description:
        "Never worry about maintenance or server issues. Includes daily automated backups, free SSL certificate renewal, and minor content updates.",
      ctaText: "Support Details",
      ctaHref: "#pricing",
    },
  ];

  return (
    <section id="services" className="py-20 md:py-28 relative overflow-hidden bg-white text-black border-y border-slate-200">
      {/* Interactive GridPulse Background (White ground, spectrum trail) */}
      <GridPulse
        cell={26}
        reach={2.6}
        ambient={2}
        className="text-black"
        style={{
          "--grid-pulse-line": "rgba(0, 0, 0, 0.06)",
        } as React.CSSProperties}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-14 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <SectionReveal>
            <div className="inline-flex items-center gap-2" data-grid-avoid>
              <Badge variant="mint">Engineered For Conversion</Badge>
              <Badge variant="blue">Standard in Every Plan</Badge>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <h2
              data-grid-avoid
              className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-black tracking-tight leading-[1.18]"
            >
              Everything your business needs to succeed online.
            </h2>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <p
              data-grid-avoid
              className="text-base sm:text-lg text-black leading-relaxed font-medium"
            >
              Every Webspyra website is built from the ground up with enterprise-grade features that turn passive visitors into loyal paying customers.
            </p>
          </SectionReveal>
        </div>

        {/* 6 Features Animated 3D Perspective Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {features.map((feature, idx) => (
            <StaggerItem key={idx}>
              <ThreeDCard
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
                badge={feature.badge}
                ctaText={feature.ctaText}
                ctaHref={feature.ctaHref}
                icon={feature.icon}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export default FeaturesSection;
