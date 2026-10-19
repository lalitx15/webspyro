"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  HeartHandshake,
} from "lucide-react";
import { PublicLayout, useQuoteModal } from "@/components/site";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionReveal, StaggerContainer, StaggerItem } from "@/components/ui/section-reveal";
import { OrbsBackground } from "@/components/ui/orbs-background";

export default function AboutPage() {
  const { openQuoteModal } = useQuoteModal();

  const values = [
    {
      icon: <Zap className="w-6 h-6 text-accent" />,
      title: "Sub-Second Performance",
      desc: "We refuse to build slow websites. Every project is optimized for 95+ Google PageSpeed with zero layout shift.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-rose" />,
      title: "Vision Pro Glass Aesthetics",
      desc: "Soft pastel gradients, frosted neumorphic transparency, and micro-animations that make your brand stand out from competitors.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#0F766E]" />,
      title: "100% Client Ownership",
      desc: "You own your domain, code, and customer data with zero proprietary vendor lock-in or surprise fees.",
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#B45309]" />,
      title: "Rapid WhatsApp Support",
      desc: "No ticketing bureaucracy. Our clients message our senior technical team directly on WhatsApp for instantaneous assistance.",
    },
  ];

  const team = [
    {
      name: "Lalit Thakur",
      role: "Founder & CEO",
      bio: "Visionary leader driving engineering excellence, high-converting digital products, and strategic agency growth.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lalit",
    },
    {
      name: "Gaurav Thakur",
      role: "Co-Founder",
      bio: "Leading full-stack cloud architecture, mobile technologies, and seamless enterprise digital transformations.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gaurav",
    },
    {
      name: "Gopal Thakur",
      role: "Lead & Expert Manager",
      bio: "Spearheading project deliveries, quality assurance, SEO growth operations, and client success management.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gopal",
    },
  ];

  return (
    <PublicLayout>
      <div className="relative min-h-screen py-16 md:py-24 px-5 sm:px-8 max-w-7xl mx-auto space-y-20">
        <OrbsBackground variant="hero" />

        {/* Hero Section */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <SectionReveal>
            <div className="inline-flex items-center gap-2">
              <Badge variant="blue" pulseDot>
                About Webspyra
              </Badge>
              <Badge variant="mint">Est. 2021</Badge>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-black tracking-tight leading-[1.12]" style={{ color: "#000000" }}>
              Architecting the next generation of business websites.
            </h1>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <p className="text-base sm:text-lg text-black font-medium leading-relaxed">
              We started Webspyra with one mission: to rid the internet of sluggish, vulnerable WordPress templates by engineering bespoke, lightning-fast web applications for ambitious companies.
            </p>
          </SectionReveal>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <Badge variant="peach">Our Origin Story</Badge>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-black leading-tight" style={{ color: "#000000" }}>
              Why Indian businesses deserve better than cheap templates.
            </h2>
            <p className="text-sm sm:text-base text-black font-medium leading-relaxed">
              Most business owners in India have suffered through bad agency experiences: websites that take 8 seconds to open on phones, sudden crashes when receiving traffic, and freelancers who disappear right after receiving payment.
            </p>
            <p className="text-sm sm:text-base text-black font-medium leading-relaxed">
              Webspyra is built differently. We are a team of senior engineers and product designers who take pride in our craft. Every website is custom-coded in Next.js 14, wired to Supabase, equipped with Razorpay UPI, and guarded with zero-zoom touch protection.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => openQuoteModal()}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-glow"
              >
                Work With Us
              </Button>
              <Link href="/portfolio">
                <Button variant="secondary" size="md">
                  View Our Work
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <GlassCard glowColor="blue" className="p-8 space-y-6">
              <h3 className="font-display font-bold text-xl text-black">
                By The Numbers
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="font-display font-extrabold text-4xl text-accent">500+</p>
                  <p className="text-xs text-black font-bold">Websites Delivered</p>
                </div>
                <div className="space-y-1">
                  <p className="font-display font-extrabold text-4xl text-[#0F766E]">4.9 / 5</p>
                  <p className="text-xs text-black font-bold">Google Client Rating</p>
                </div>
                <div className="space-y-1">
                  <p className="font-display font-extrabold text-4xl text-rose">99.9%</p>
                  <p className="text-xs text-black font-bold">Uptime Guarantee</p>
                </div>
                <div className="space-y-1">
                  <p className="font-display font-extrabold text-4xl text-[#B45309]">5 Days</p>
                  <p className="text-xs text-black font-bold">Average Turnaround</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <Badge variant="mint">Our Non-Negotiables</Badge>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-black" style={{ color: "#000000" }}>
              The Engineering Standards Behind Every Build
            </h2>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <StaggerItem key={i}>
                <GlassCard enableTilt glowColor="blue" className="p-7 space-y-4 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-white/90 border border-white shadow-sm flex items-center justify-center">
                    {val.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg text-black">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-black font-medium leading-relaxed">
                    {val.desc}
                  </p>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Leadership Team */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <Badge variant="blue">The Architects</Badge>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-black" style={{ color: "#000000" }}>
              Meet The Founders Behind Webspyra
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {team.map((member, idx) => (
              <GlassCard key={idx} enableTilt glowColor="peach" className="p-7 space-y-4 text-center">
                <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto bg-slate-200 border-2 border-white shadow-card">
                  <Image src={member.avatar} alt={member.name} fill className="object-cover" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-display font-bold text-lg text-black">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-accent">{member.role}</p>
                </div>
                <p className="text-xs text-black font-medium leading-relaxed">
                  {member.bio}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <SectionReveal>
          <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-white text-center space-y-6">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-black" style={{ color: "#000000" }}>
              Ready to elevate your digital presence?
            </h2>
            <p
              className="text-sm sm:text-base text-black max-w-xl mx-auto font-medium"
              style={{ color: "#000000", opacity: 1 }}
            >
              Join 500+ businesses who trust Webspyra. Tell us your requirements and get a fixed-price roadmap in 30 minutes.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => openQuoteModal()}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-glow"
              >
                Get Free Project Estimate
              </Button>
              <Link href="/contact">
                <Button variant="secondary" size="lg">
                  Contact Our Office
                </Button>
              </Link>
            </div>
          </div>
        </SectionReveal>
      </div>
    </PublicLayout>
  );
}
