"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Send,
  Zap,
  ShieldCheck,
  Globe,
  Sliders,
  Layers,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import {
  Button,
  GlassCard,
  Input,
  Textarea,
  Select,
  Modal,
  Drawer,
  useToast,
  Skeleton,
  Badge,
  Accordion,
  Tabs,
  Marquee,
  CountUp,
  Countdown,
  OrbsBackground,
  SectionReveal,
  StaggerContainer,
  StaggerItem,
  HeadlineReveal,
} from "@/components/ui";

export default function DesignSystemPage() {
  const { success, error, warning, info } = useToast();

  // State for interactive demos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("business");
  const [inputVal, setInputVal] = useState("");
  const [inputError, setInputError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const demoTargetDate = new Date(Date.now() + 18 * 60 * 60 * 1000 + 45 * 60 * 1000);

  const sampleTabs = [
    { id: "business", label: "Business Plans", badge: "Hot" },
    { id: "ecommerce", label: "E-Commerce", badge: "30% Off" },
    { id: "enterprise", label: "Enterprise Custom" },
  ];

  const sampleAccordion = [
    {
      id: "faq-1",
      title: "How does the soft pastel glassmorphism look and feel?",
      content:
        "It blends Apple Vision Pro frosted glass cards (backdrop-filter: blur(24px) saturate(160%)) with subtle neumorphic drop-shadows and curated pastel accents (mint, peach, sky, pink, periwinkle).",
    },
    {
      id: "faq-2",
      title: "Is mobile double-tap and pinch zoom completely blocked?",
      content:
        "Yes! Our <NoZoom /> component plus viewport settings ensure an authentic native app-like experience on phones and tablets with 100dvh compliance and zero unwanted browser zoom.",
    },
    {
      id: "faq-3",
      title: "How are animations optimized for 60fps performance?",
      content:
        "We exclusively animate transform and opacity properties using Framer Motion springs and cubic-bezier easing, respecting prefers-reduced-motion automatically.",
    },
  ];

  return (
    <div className="min-h-[100dvh] bg-page-gradient text-textPrimary relative overflow-hidden pb-24 selection:bg-accent/20 selection:text-accent">
      <OrbsBackground variant="hero" />

      {/* Top Header */}
      <header className="max-w-7xl mx-auto px-6 pt-10 pb-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-accent-grad flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display text-xl font-extrabold tracking-tight text-textPrimary">
              WEBSPYRA
            </span>
            <span className="block text-[11px] font-semibold text-accent -mt-1 tracking-wider uppercase">
              Design System Showcase
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Badge variant="mint" pulseDot>
            Phase 2 Design System
          </Badge>
          <Link
            href="/"
            className="text-xs font-semibold text-textSecondary hover:text-accent flex items-center gap-1 transition-colors"
          >
            <span>Home</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-center space-y-5">
        <div className="inline-flex items-center gap-2">
          <Badge variant="blue">Interactive Component Showcase</Badge>
          <Badge variant="peach">Pastel Glassmorphism</Badge>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15]">
          <HeadlineReveal
            text="Crafted for elegance, speed, and unforgettable impressions."
            highlightWord="unforgettable"
          />
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-textSecondary leading-relaxed">
          Test every design token, micro-interaction, floating label, glass card, and motion curve built for the Webspyra ecosystem.
        </p>
      </section>

      {/* Main Showcase Grid */}
      <main className="max-w-7xl mx-auto px-6 space-y-16">
        {/* 1. BUTTONS */}
        <SectionReveal>
          <div className="space-y-6">
            <div className="border-b border-slate-200/70 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-textPrimary">
                  Buttons & Shimmer Micro-Interactions
                </h2>
                <p className="text-xs sm:text-sm text-textSecondary">
                  Pill shaped, spring tap (0.96) / hover (1.03), and primary gradient shimmer sweep.
                </p>
              </div>
              <Badge variant="neutral">9 Variants</Badge>
            </div>

            <div className="glass-panel p-8 rounded-card space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Primary Glow
                </Button>
                <Button variant="secondary" leftIcon={<Sparkles className="w-4 h-4 text-accent" />}>
                  Secondary Glass
                </Button>
                <Button variant="pastel-peach">Pastel Peach</Button>
                <Button variant="pastel-mint">Pastel Mint</Button>
                <Button variant="pastel-pink">Pastel Pink</Button>
                <Button variant="pastel-sky">Pastel Sky</Button>
                <Button variant="pastel-lavender">Pastel Lavender</Button>
                <Button variant="outline">Outline Glass</Button>
                <Button variant="ghost">Ghost Button</Button>
              </div>

              <div className="pt-4 border-t border-slate-200/50 flex flex-wrap items-center gap-4">
                <Button size="sm" variant="primary">
                  Small Button
                </Button>
                <Button size="md" variant="primary">
                  Medium Button
                </Button>
                <Button size="lg" variant="primary" rightIcon={<ChevronRight className="w-5 h-5" />}>
                  Large CTA Button
                </Button>
                <Button
                  variant="primary"
                  isLoading={isSubmitting}
                  onClick={() => {
                    setIsSubmitting(true);
                    setTimeout(() => setIsSubmitting(false), 2000);
                  }}
                >
                  {isSubmitting ? "Processing..." : "Click to Test Loading"}
                </Button>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* 2. GLASS CARDS & 3D TILT */}
        <SectionReveal>
          <div className="space-y-6">
            <div className="border-b border-slate-200/70 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-textPrimary">
                  Glass Cards & 3D Desktop Tilt
                </h2>
                <p className="text-xs sm:text-sm text-textSecondary">
                  Neumorphic soft depth, interactive mouse tilt, and glass shine sweep.
                </p>
              </div>
              <Badge variant="blue">Interactive 3D</Badge>
            </div>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StaggerItem>
                <GlassCard enableTilt glowColor="blue" className="p-7 space-y-4 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-textPrimary">
                    3D Mouse Tracking Tilt
                  </h3>
                  <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
                    Hover and move your cursor across this card to experience spring-based 3D rotation and shine reflection.
                  </p>
                  <div className="pt-2">
                    <span className="text-xs font-bold text-accent">Interactive Demo →</span>
                  </div>
                </GlassCard>
              </StaggerItem>

              <StaggerItem>
                <GlassCard enableTilt glowColor="pink" className="p-7 space-y-4 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-[#FDECEF] flex items-center justify-center text-rose">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-textPrimary">
                    Soft Pastel Highlights
                  </h3>
                  <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
                    Crafted with 28px corners, frosted glass saturation, and a subtle glowing pink drop shadow.
                  </p>
                  <div className="pt-2">
                    <Badge variant="pink">Apple Grade</Badge>
                  </div>
                </GlassCard>
              </StaggerItem>

              <StaggerItem>
                <GlassCard enableTilt glowColor="mint" className="p-7 space-y-4 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDFAF8] flex items-center justify-center text-[#0F766E]">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-textPrimary">
                    High-Speed Architecture
                  </h3>
                  <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
                    Next.js 14 App Router, ISR revalidation, and sub-second page loads engineered for high conversions.
                  </p>
                  <div className="pt-2">
                    <Badge variant="mint">99.9% Speed</Badge>
                  </div>
                </GlassCard>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </SectionReveal>

        {/* 3. FLOATING LABEL FORMS */}
        <SectionReveal>
          <div className="space-y-6">
            <div className="border-b border-slate-200/70 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-textPrimary">
                  Floating Label Inputs & Validation
                </h2>
                <p className="text-xs sm:text-sm text-textSecondary">
                  Font-size &ge; 16px (no iOS auto-zoom), animated labels, error shake, and checkmark draw.
                </p>
              </div>
              <Badge variant="mint">iOS Safe</Badge>
            </div>

            <GlassCard className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  helperText="Enter your official name"
                />

                <Input
                  label="Phone Number"
                  placeholder="+91 98765 43210"
                  defaultValue="+91 "
                  success
                  helperText="Verified Indian Mobile"
                />

                <Input
                  label="Business Email"
                  placeholder="you@company.com"
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    if (e.target.value.includes("@")) {
                      setInputError("");
                    } else if (e.target.value) {
                      setInputError("Please enter a valid email address");
                    }
                  }}
                  error={inputError}
                  helperText="Try typing an invalid email to test shake"
                />

                <Select
                  label="Project Requirement"
                  options={[
                    { value: "business", label: "Business Website (5-7 Days)" },
                    { value: "ecommerce", label: "E-Commerce Online Store" },
                    { value: "webapp", label: "Custom Full-Stack Web App" },
                    { value: "seo", label: "SEO & Growth Optimization" },
                  ]}
                />

                <div className="sm:col-span-2">
                  <Textarea
                    label="Project Details & Specific Goals"
                    rows={3}
                    helperText="Describe your pages, features, or design inspirations"
                  />
                </div>
              </div>
            </GlassCard>
          </div>
        </SectionReveal>

        {/* 4. MODALS & DRAWERS */}
        <SectionReveal>
          <div className="space-y-6">
            <div className="border-b border-slate-200/70 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-textPrimary">
                  Modals & Mobile Drawers
                </h2>
                <p className="text-xs sm:text-sm text-textSecondary">
                  Scale 0.95 &rarr; 1 entry, backdrop blur, ESC listener, and safe-area sheet drawers.
                </p>
              </div>
              <Badge variant="peach">AnimatePresence</Badge>
            </div>

            <GlassCard className="p-8 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                onClick={() => setIsModalOpen(true)}
                leftIcon={<Sliders className="w-4 h-4" />}
              >
                Open Glass Modal
              </Button>

              <Button
                variant="secondary"
                onClick={() => setIsDrawerOpen(true)}
                leftIcon={<Layers className="w-4 h-4 text-accent" />}
              >
                Open Bottom Drawer
              </Button>

              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Get Your Free Webspyra Quote"
                description="Fill in a few details and our senior engineer will call you back within 30 minutes."
              >
                <div className="space-y-4 pt-2">
                  <Input label="Your Name" placeholder="Rajesh Kumar" />
                  <Input label="WhatsApp Phone Number" placeholder="+91 98765 43210" />
                  <Select
                    label="Interested Plan"
                    options={[
                      { value: "starter", label: "Starter Business (₹5,999)" },
                      { value: "classic", label: "Classic Growth (₹9,999) - Most Popular" },
                      { value: "premium", label: "Premium Corporate (₹15,999)" },
                    ]}
                  />
                  <div className="pt-2 flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setIsModalOpen(false);
                        success("Quote Request Received!", "We will contact you shortly on WhatsApp.");
                      }}
                      rightIcon={<Send className="w-4 h-4" />}
                    >
                      Submit Request
                    </Button>
                  </div>
                </div>
              </Modal>

              <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Quick Mobile Action Menu"
              >
                <div className="space-y-3 py-2">
                  <p className="text-sm text-textSecondary">
                    This drawer slides smoothly from the bottom on mobile devices with safe-area notch padding.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button
                      variant="pastel-mint"
                      onClick={() => {
                        setIsDrawerOpen(false);
                        success("Call Triggered", "+91 98765 43210");
                      }}
                    >
                      📞 Direct Call
                    </Button>
                    <Button
                      variant="pastel-peach"
                      onClick={() => {
                        setIsDrawerOpen(false);
                        info("WhatsApp Opened", "Chat session initialized.");
                      }}
                    >
                      💬 WhatsApp
                    </Button>
                  </div>
                </div>
              </Drawer>
            </GlassCard>
          </div>
        </SectionReveal>

        {/* 5. TOAST NOTIFICATIONS */}
        <SectionReveal>
          <div className="space-y-6">
            <div className="border-b border-slate-200/70 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-textPrimary">
                  Toast System & Timers
                </h2>
                <p className="text-xs sm:text-sm text-textSecondary">
                  Auto-dismissing 3.5s toasts with animated shrinking progress bars.
                </p>
              </div>
              <Badge variant="lavender">Portal Toast</Badge>
            </div>

            <GlassCard className="p-8 flex flex-wrap items-center gap-4">
              <Button
                variant="pastel-mint"
                onClick={() =>
                  success("Order Placed Successfully!", "Your invoice WSP-10001 has been generated.")
                }
              >
                Trigger Success Toast
              </Button>
              <Button
                variant="pastel-pink"
                onClick={() =>
                  error("Payment Failed", "Please check your UPI limit and try again.")
                }
              >
                Trigger Error Toast
              </Button>
              <Button
                variant="pastel-peach"
                onClick={() =>
                  warning("Limited Deal Expiring", "Only 2 slots remaining at 40% discount.")
                }
              >
                Trigger Warning Toast
              </Button>
              <Button
                variant="pastel-sky"
                onClick={() =>
                  info("New Message Received", "Admin replied to your live chat inquiry.")
                }
              >
                Trigger Info Toast
              </Button>
            </GlassCard>
          </div>
        </SectionReveal>

        {/* 6. TABS, ACCORDION & COUNTDOWN */}
        <SectionReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tabs & Countdown */}
            <div className="space-y-6">
              <div className="border-b border-slate-200/70 pb-3">
                <h2 className="font-display text-2xl font-bold text-textPrimary">
                  Sliding Tabs & Countdown
                </h2>
                <p className="text-xs sm:text-sm text-textSecondary">
                  Framer Motion layoutId sliding pill and ticking deal timer.
                </p>
              </div>

              <GlassCard className="p-7 space-y-6">
                <div>
                  <Tabs
                    tabs={sampleTabs}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    layoutId="demo-plan-tabs"
                  />
                </div>

                <div className="p-5 rounded-2xl bg-white/70 border border-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-accent">
                      Active Selection: {activeTab.toUpperCase()}
                    </span>
                    <Badge variant="mint">Live Indicator</Badge>
                  </div>
                  <p className="text-xs text-textSecondary leading-relaxed">
                    The pill smoothly glides across tabs using spring physics without triggering sudden layout jumps.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/50">
                  <Countdown
                    targetDate={demoTargetDate}
                    label="Special Launch Offer Ends In:"
                  />
                </div>
              </GlassCard>
            </div>

            {/* Accordion */}
            <div className="space-y-6">
              <div className="border-b border-slate-200/70 pb-3">
                <h2 className="font-display text-2xl font-bold text-textPrimary">
                  Animated Accordion
                </h2>
                <p className="text-xs sm:text-sm text-textSecondary">
                  Height auto animated collapse/expand with rotating chevron.
                </p>
              </div>

              <Accordion items={sampleAccordion} defaultOpenId="faq-1" />
            </div>
          </div>
        </SectionReveal>

        {/* 7. COUNT-UP NUMBERS & SKELETON */}
        <SectionReveal>
          <div className="space-y-6">
            <div className="border-b border-slate-200/70 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-textPrimary">
                  Count-Up Metrics & Shimmer Skeletons
                </h2>
                <p className="text-xs sm:text-sm text-textSecondary">
                  In-view count-up statistics and zero-layout-shift shimmer loaders.
                </p>
              </div>
              <Badge variant="blue">Metrics</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <GlassCard className="p-6 text-center space-y-1">
                <CountUp
                  to={500}
                  suffix="+"
                  className="text-3xl sm:text-4xl font-extrabold text-accent"
                />
                <p className="text-xs text-textSecondary font-medium">Happy Clients</p>
              </GlassCard>

              <GlassCard className="p-6 text-center space-y-1">
                <CountUp
                  to={4.9}
                  decimals={1}
                  suffix="★"
                  className="text-3xl sm:text-4xl font-extrabold text-[#F59E0B]"
                />
                <p className="text-xs text-textSecondary font-medium">Google Rating</p>
              </GlassCard>

              <GlassCard className="p-6 text-center space-y-1">
                <CountUp
                  to={650}
                  suffix="+"
                  className="text-3xl sm:text-4xl font-extrabold text-[#16A34A]"
                />
                <p className="text-xs text-textSecondary font-medium">Delivered Projects</p>
              </GlassCard>

              <GlassCard className="p-6 text-center space-y-1">
                <CountUp
                  to={6}
                  suffix="+ Years"
                  className="text-3xl sm:text-4xl font-extrabold text-textPrimary"
                />
                <p className="text-xs text-textSecondary font-medium">Industry Experience</p>
              </GlassCard>
            </div>

            {/* Skeleton Loaders Preview */}
            <GlassCard className="p-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-textMuted">
                Shimmer Skeletons (Used during Supabase async fetching)
              </span>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Skeleton variant="circle" className="w-12 h-12" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full" variant="card" />
              </div>
            </GlassCard>
          </div>
        </SectionReveal>

        {/* 8. MARQUEE TICKER */}
        <SectionReveal>
          <div className="space-y-6">
            <div className="border-b border-slate-200/70 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-textPrimary">
                  Infinite Marquee Ticker
                </h2>
                <p className="text-xs sm:text-sm text-textSecondary">
                  Smooth infinite ticker for top announcements and trust badges (pause on hover).
                </p>
              </div>
              <Badge variant="mint">Pause on Hover</Badge>
            </div>

            <GlassCard className="p-4 overflow-hidden">
              <Marquee speed={25} pauseOnHover>
                <div className="flex items-center gap-8 text-xs sm:text-sm font-bold text-textPrimary">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    🔥 FLAT 30% OFF ON ALL PLANS
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                    ⚡ DELIVERY IN 5 TO 7 WORKING DAYS
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose" />
                    📱 100% MOBILE & TABLET APP-LIKE EXPERIENCE
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#B45309]" />
                    🔒 100% DATA & DOMAIN OWNERSHIP
                  </span>
                </div>
              </Marquee>
            </GlassCard>
          </div>
        </SectionReveal>
      </main>

      {/* Footer Return Banner */}
      <footer className="max-w-7xl mx-auto px-6 pt-16 text-center space-y-4">
        <p className="text-xs text-textMuted">
          Phase 2 Design System Component Library • Fully Verified & Ready
        </p>
        <div>
          <Link href="/">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Return to Landing Page
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
}
