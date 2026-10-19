"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  X,
  ArrowRight,
  Globe,
  TrendingUp,
  Smartphone,
  Share2,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { PublicLayout, useQuoteModal } from "@/components/site";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import { SectionReveal } from "@/components/ui/section-reveal";
import { OrbsBackground } from "@/components/ui/orbs-background";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const { openQuoteModal } = useQuoteModal();

  // Primary Category Filter
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "websites" | "seo" | "apps" | "social_gmb"
  >("all");

  // Website sub-category tab: Shortened to Business, Portfolio, Ecommerce
  const [activeWebTab, setActiveWebTab] = useState("business");

  // Track expanded features on mobile view
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleCardFeatures = (cardId: string) => {
    setExpandedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const websiteSubTabs = [
    { id: "business", label: "Business" },
    { id: "portfolio", label: "Portfolio" },
    { id: "ecommerce", label: "Ecommerce" },
  ];

  /* -------------------------------------------------------------
     WEBSITE DEVELOPMENT PLANS (All features fully visible)
  ------------------------------------------------------------- */
  const businessPlans = [
    {
      name: "Starter Business",
      price: "₹8,999",
      billing: "one-time",
      oldPrice: "₹12,999",
      renewal: "₹2,999 / year",
      desc: "For local stores, clinics, and new firms wanting a fast modern presence.",
      highlight: false,
      badge: "Essential",
      buttonText: "Start Now",
      delivery: "5 Working Days",
      features: [
        "Up to 5 High-Converting Responsive Pages",
        "Free .com or .in Domain (1st Year Included)",
        "Free High-Speed Cloud SSD Hosting (1 Year)",
        "1 Professional Business Email Account",
        "Zero-Zoom Mobile & Tablet App-Like View",
        "Direct WhatsApp Click-to-Chat Button",
        "Click-to-Call Instant Contact Button",
        "Lead Contact Form with Instant Email Alerts",
        "Google Maps & Social Media Profiles Sync",
        "Free Lifetime SSL Security Certificate",
        "Standard Apple-Grade Micro-Interactions",
        "Complete On-Page SEO Setup & Indexing",
        "1 Year Technical Maintenance & Bug Support",
      ],
    },
    {
      name: "Classic Growth",
      price: "₹14,999",
      billing: "one-time",
      oldPrice: "₹24,999",
      renewal: "₹3,999 / year",
      desc: "Our most popular tier engineered for high lead conversion, admin control and Google SEO.",
      highlight: true,
      badge: "Growth Choice",
      buttonText: "Start Now",
      delivery: "7 Working Days",
      features: [
        "Up to 15 High-Converting Business Pages",
        "Free .com or .in Domain (1st Year Included)",
        "Free Ultra-Fast NVMe Cloud Server (1 Year)",
        "1 Professional Business Email Account",
        "Dedicated Admin Panel / Content Dashboard",
        "Google Authentication (OAuth Login Security)",
        "Interactive 3D Apple-Grade Glass Interactions",
        "Lead Capture Forms + Instant Email/WhatsApp Alerts",
        "Google Maps Location, Reviews & Social Feeds",
        "Free Lifetime SSL Security Certificate",
        "Complete Technical SEO Setup & XML Sitemap",
        "Razorpay Online Payment Gateway Integration",
        "Dynamic Blog / Articles CMS Publishing Engine",
        "Priority WhatsApp Support & Ongoing Minor Edits",
      ],
    },
    {
      name: "Premium Corporate",
      price: "₹24,999",
      billing: "one-time",
      oldPrice: "₹39,999",
      renewal: "₹4,999 / year",
      desc: "Bespoke corporate architecture with high-value admin panel and priority 24/7 care.",
      highlight: false,
      badge: "Enterprise",
      buttonText: "Start Now",
      delivery: "10 Working Days",
      features: [
        "Up to 15 Bespoke Corporate Architecture Pages",
        "Free Premium Domain & Dedicated Edge Cloud (1 Year)",
        "2 Professional Business Email Accounts",
        "High-Value Custom Admin Panel & CMS Control",
        "Google OAuth + Role-Based Team Access Control",
        "Custom Apple Vision Pro 3D Motion & Interactions",
        "Full Razorpay / UPI Online Payment Gateway",
        "Dynamic Blog & News Publishing System",
        "Live Chat Integration & Lead Management CRM",
        "Free Lifetime SSL Certificate + Cloudflare DDoS Shield",
        "Comprehensive SEO Schema & Sub-Second Speed Setup",
        "1 Year Dedicated Priority Account Manager",
      ],
    },
  ];

  const portfolioPlans = [
    {
      name: "Basic Landing Page",
      price: "₹2,999",
      billing: "one-time",
      oldPrice: "₹5,999",
      renewal: "N/A (No Renewal)",
      desc: "Fast single page / portfolio for individuals & creators (without domain & hosting).",
      highlight: false,
      badge: "Starter",
      buttonText: "Start Now",
      delivery: "2 Working Days",
      features: [
        "1 High-Converting Landing / Portfolio Page",
        "Client-Provided Domain & Server Integration",
        "Zero-Zoom Mobile & Tablet Touch Protection",
        "Direct WhatsApp Click-to-Chat Button",
        "Click-to-Call Instant Contact Button",
        "Social Media & Bio Links Integration",
        "Ultra-Fast Page Loading (< 2s)",
        "HTTPS SSL Compatible Setup",
        "Basic On-Page SEO & Meta Tags Included",
        "30 Days Free Technical Bug Support",
      ],
    },
    {
      name: "Pro Portfolio & Landing",
      price: "₹4,999",
      billing: "one-time",
      oldPrice: "₹9,999",
      renewal: "₹1,999 / year",
      desc: "Full personal brand or product landing page with free 1-year domain & fast cloud hosting.",
      highlight: true,
      badge: "Personal Brand",
      buttonText: "Start Now",
      delivery: "3 Working Days",
      features: [
        "Multi-Section High-Converting Landing Page",
        "Free .com or .in Domain (1st Year Included)",
        "Free Fast SSD Cloud Hosting (1 Year Included)",
        "100% Mobile & Tablet App-Like Zero-Zoom View",
        "Interactive Project Showcase & Gallery Grid",
        "Direct WhatsApp Chat & Instant Call Button",
        "Google Maps & Social Media Sync",
        "Free Lifetime SSL Security Certificate",
        "Complete On-Page SEO Setup & Sitemap",
        "6 Months Free Maintenance & Support",
      ],
    },
    {
      name: "Elite Dynamic Showcase",
      price: "₹6,999",
      billing: "one-time",
      oldPrice: "₹13,999",
      renewal: "₹2,499 / year",
      desc: "Ultra-smooth animated showcase with 3D interactions, 1-Year free domain/hosting & analytics.",
      highlight: false,
      badge: "3D Showcase",
      buttonText: "Start Now",
      delivery: "5 Working Days",
      features: [
        "Premium Multi-Section Portfolio / Showcase",
        "Free .com or .in Domain (1st Year Included)",
        "Free NVMe High-Speed Cloud Server (1 Year)",
        "1 Professional Business Email Account",
        "Apple-Grade Micro-Animations (Framer & GSAP 3D)",
        "Interactive Case Studies & Reviews Slider",
        "Lead Capture Forms with Instant Alerts",
        "Google Analytics 4 & Meta Pixel Setup",
        "Easy Dynamic Content / CMS Updates Option",
        "Free Lifetime SSL Certificate & DDoS Protection",
        "1 Year Dedicated Priority VIP Support",
      ],
    },
  ];

  const ecommercePlans = [
    {
      name: "E-Commerce Starter",
      price: "₹18,999",
      billing: "one-time",
      oldPrice: "₹29,999",
      renewal: "₹4,999 / year",
      desc: "Sell up to 50 products online with UPI checkout and order dashboard.",
      highlight: false,
      badge: "D2C Starter",
      buttonText: "Start Now",
      delivery: "8 Working Days",
      features: [
        "Up to 50 Product Catalog Listings",
        "Free Domain & Cloud Hosting (1 Year Included)",
        "Razorpay UPI, Cards & NetBanking Integration",
        "Order Management & Sales Dashboard",
        "Automated GST Invoices Generation",
        "Discount Coupons & Promo Engine",
        "Real-Time Inventory Stock Tracking",
        "WhatsApp Order Notifications Setup",
        "Mobile Responsive Zero-Zoom Checkout",
        "Free Lifetime SSL Security Certificate",
      ],
    },
    {
      name: "E-Commerce Pro",
      price: "₹29,999",
      billing: "one-time",
      oldPrice: "₹48,999",
      renewal: "₹5,999 / year",
      desc: "High-volume D2C brand storefront with product variants and review feeds.",
      highlight: true,
      badge: "D2C Growth",
      buttonText: "Start Now",
      delivery: "12 Working Days",
      features: [
        "Up to 500 Product Catalog with Variants (Color, Size)",
        "Free Domain & NVMe High-Speed Cloud Server (1 Year)",
        "Razorpay UPI, Cards, EMI & NetBanking",
        "Comprehensive Admin Dashboard for Orders & Customers",
        "Automated GST Tax Invoices & Shipping Slips",
        "Advanced Discount Codes & Cart Abandonment Recovery",
        "Inventory Management with Low Stock Alerts",
        "Customer Reviews, Star Ratings & Photo Uploads",
        "WhatsApp Order Confirmation & Tracking Sync",
        "Complete E-Commerce SEO & Product Schema",
        "1 Year Priority Maintenance & Support",
      ],
    },
    {
      name: "Custom Marketplace",
      price: "₹49,999+",
      billing: "one-time",
      oldPrice: "₹79,999",
      renewal: "₹7,999 / year",
      desc: "Full-scale custom shopping app with multi-vendor support and ERP sync.",
      highlight: false,
      badge: "Enterprise Scale",
      buttonText: "Start Now",
      delivery: "18 Working Days",
      features: [
        "Unlimited Product Catalog & Categories",
        "Free Premium Domain & Dedicated Cloud Server",
        "Multi-Vendor / Multi-Warehouse Architecture",
        "Custom Payment Gateway & Wallet Integrations",
        "Advanced Admin & Vendor Dashboards",
        "Automated GST Invoicing & Accounting ERP Sync",
        "Custom Search with Filters & Instant Suggestions",
        "Advanced Analytics, Cohort & Retention Tracking",
        "Dedicated Solutions Architect & Priority 24/7 Support",
      ],
    },
  ];

  const currentWebPlans =
    activeWebTab === "portfolio"
      ? portfolioPlans
      : activeWebTab === "business"
      ? businessPlans
      : ecommercePlans;

  /* -------------------------------------------------------------
     SECTION 1: SEO SERVICES (Exact User Specifications)
  ------------------------------------------------------------- */
  const seoPlans = [
    {
      id: "seo-silver",
      name: "SEO Silver",
      price: "₹5,000",
      billing: "/mo",
      desc: "Ideal for local businesses looking to rank locally on Google maps and targeted search terms.",
      highlight: false,
      badge: "Local SEO",
      cta: "Start Now",
      features: [
        "Local SEO Optimization",
        "5 Target Keywords",
        "On-Page Optimization",
        "Off-Page SEO & Link Building",
        "Technical SEO Audit",
        "Weekly Performance Reporting",
      ],
    },
    {
      id: "seo-gold",
      name: "SEO Gold",
      price: "₹10,000",
      billing: "/mo",
      desc: "Target high-intent national keywords with backlink building and targeted organic blog content.",
      highlight: true,
      badge: "Most Popular",
      cta: "Start Now",
      features: [
        "20 Target Keywords",
        "On-Page Optimization",
        "Off-Page SEO & Link Building",
        "Technical SEO Audit",
        "2 Blogs Posting / Month",
        "Comprehensive Content Strategy",
        "Authority Backlink Building",
        "Bi-Weekly Reporting & Analysis",
      ],
    },
    {
      id: "seo-platinum",
      name: "SEO Platinum",
      price: "₹20,000",
      billing: "/mo",
      desc: "Full-scale aggressive organic domination with competitor teardown and priority 24/7 support.",
      highlight: false,
      badge: "Enterprise SEO",
      cta: "Start Now",
      features: [
        "30+ Target Keywords",
        "On-Page Optimization",
        "Off-Page SEO & Link Building",
        "Technical SEO Audit",
        "4+ Blogs Posting / Month",
        "In-Depth Competitor Analysis",
        "Weekly + Monthly Review Reporting",
      ],
    },
  ];

  const seoComparisonRows = [
    { feature: "Monthly Price", silver: "₹5,000", gold: "₹10,000", platinum: "₹20,000", isText: true },
    { feature: "Target Keywords", silver: "5 Keywords", gold: "20 Keywords", platinum: "30+ Keywords", isText: true },
    { feature: "SEO Type", silver: "Local", gold: "Local + National", platinum: "Local + National + Competitive", isText: true },
    { feature: "Blog Posts / Month", silver: "—", gold: "2 Blogs", platinum: "4+ Blogs", isText: true },
    { feature: "Backlink Building", silver: "Basic", gold: "Advanced", platinum: "Premium", isText: true },
    { feature: "Reporting Frequency", silver: "Weekly", gold: "Bi-Weekly", platinum: "Weekly + Monthly Review", isText: true },
    { feature: "Support", silver: "Email", gold: "Email + Chat", platinum: "Priority 24/7", isText: true },
    { feature: "On-Page Optimization", silver: true, gold: true, platinum: true },
    { feature: "Off-Page SEO / Link Building", silver: true, gold: true, platinum: true },
    { feature: "Technical SEO Audit", silver: true, gold: true, platinum: true },
    { feature: "Content Strategy", silver: false, gold: true, platinum: true },
    { feature: "Competitor Analysis", silver: false, gold: false, platinum: true },
    { feature: "Google Business Profile Optimization", silver: true, gold: true, platinum: true },
    { feature: "Dedicated Account Manager", silver: false, gold: true, platinum: true },
  ];

  /* -------------------------------------------------------------
     SECTION 2: APP DEVELOPMENT (Exact User Specifications)
  ------------------------------------------------------------- */
  const appPlans = [
    {
      id: "app-mvp",
      name: "App MVP",
      price: "₹25,000",
      billing: "one-time",
      desc: "Fast MVP build to validate your product idea with real users on iOS or Android.",
      highlight: false,
      badge: "Rapid MVP",
      cta: "Get Quote",
      features: [
        "Core Features Only",
        "Standard UI/UX Design",
        "iOS or Android Platform",
        "3 Months Technical Support",
      ],
    },
    {
      id: "app-pro",
      name: "App Professional",
      price: "₹60,000",
      billing: "one-time",
      desc: "Full production-ready cross-platform mobile application powered by modern Flutter technology.",
      highlight: true,
      badge: "Most Popular",
      cta: "Get Quote",
      features: [
        "Advanced Interactive Features",
        "Custom UI/UX & Motion Design",
        "Cross Platform (Flutter iOS + Android)",
        "6 Months Technical Support",
      ],
    },
    {
      id: "app-enterprise",
      name: "App Enterprise",
      price: "₹1,20,000",
      billing: "one-time",
      desc: "Full enterprise-scale mobile architecture with custom cloud backend and 1 year dedicated support.",
      highlight: false,
      badge: "Enterprise",
      cta: "Get Quote",
      features: [
        "Complete Cloud Backend Architecture",
        "Scalable Multi-User Infrastructure",
        "Dedicated Engineering Support",
        "12 Months Extended Support",
      ],
    },
  ];

  /* -------------------------------------------------------------
     SECTION 3: SOCIAL MEDIA & GOOGLE BUSINESS (Exact User Specs)
  ------------------------------------------------------------- */
  const socialGmbPlans = [
    {
      id: "social-media-marketing",
      name: "Social Media Marketing",
      price: "₹1,999",
      billing: "/mo",
      desc: "Keep your brand active, professional, and engaging every single day across Facebook and Instagram.",
      highlight: false,
      badge: "Monthly Growth",
      cta: "Start Now",
      features: [
        "Daily Post Handling & Scheduling",
        "Custom Creative Content Creation",
        "Facebook & Instagram Management",
        "High-Volume Hashtag Research",
        "Direct Engagement Management",
        "Monthly Performance Analytics Report",
      ],
    },
    {
      id: "gmb-setup",
      name: "Google My Business Setup",
      price: "₹2,999",
      billing: "one-time",
      desc: "Complete 100% verified setup and keyword-rich optimization to start appearing in Google Maps local pack.",
      highlight: true,
      badge: "Most Popular",
      cta: "Get Started",
      features: [
        "Profile Creation & Verification",
        "Business Info & Address Optimization",
        "Category & Service Catalog Setup",
        "Photos, Logo & Branding Upload",
        "Promotional Posts & Offers Setup",
        "Review Generation Strategy Guide",
      ],
    },
    {
      id: "gmb-seo",
      name: "Google My Business SEO",
      price: "₹1,999",
      billing: "/mo",
      desc: "Ongoing local ranking boost and review management to stay #1 in your city for customer searches.",
      highlight: false,
      badge: "Local Dominance",
      cta: "Rank Now",
      features: [
        "Local Ranking Google Maps Optimization",
        "High-Intent Local Keyword Targeting",
        "Weekly Google Business Posts",
        "Customer Review Management & Responses",
        "Q&A Section Optimization",
        "Monthly Local Ranking Performance Report",
      ],
    },
  ];

  const faqs = [
    {
      id: "pr-faq-1",
      title: "What does the 1st year free website package include?",
      content:
        "Every Webspyra website package includes a free .com or .in domain, ultra-fast cloud server hosting, SSL encryption certificate, and complete technical support for 365 days.",
    },
    {
      id: "pr-faq-2",
      title: "Are there any hidden costs, setup charges, or commissions?",
      content:
        "Zero. We believe in 100% transparent pricing. You only pay the exact price shown above. All plans include transparent monthly reporting with no hidden charges.",
    },
    {
      id: "pr-faq-3",
      title: "How does the payment schedule work for websites and apps?",
      content:
        "Standard projects work on a 50% advance booking deposit to begin architecture and design, with the remaining 50% due only after you review and approve the live staging website.",
    },
    {
      id: "pr-faq-4",
      title: "Can I upgrade my SEO or Social Media plan later?",
      content:
        "Yes, absolutely. You can upgrade from SEO Silver to Gold or Platinum at any time to add more keywords, content strategy, and bi-weekly/weekly reporting.",
    },
    {
      id: "pr-faq-5",
      title: "How quickly does Google My Business setup take?",
      content:
        "Google My Business Setup takes 2 to 3 working days to complete full branding, category setup, and verification submission.",
    },
  ];

  return (
    <PublicLayout>
      <div className="relative min-h-screen py-10 md:py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-12 sm:space-y-16">
        <OrbsBackground variant="hero" />

        {/* 1. Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <SectionReveal>
            <div className="inline-flex items-center gap-2">
              <Badge variant="blue" pulseDot>
                100% Transparent Pricing
              </Badge>
              <Badge variant="mint">Zero Hidden Fees</Badge>
              <Badge variant="peach">All-In-One Digital Services</Badge>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <h1
              className="font-display text-3xl sm:text-5xl font-extrabold text-black tracking-tight leading-[1.15]"
              style={{ color: "#000000", opacity: 1 }}
            >
              Clear, transparent pricing for all services.
            </h1>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <p
              className="text-sm sm:text-base text-black font-semibold leading-relaxed"
              style={{ color: "#000000", opacity: 1 }}
            >
              From custom handwritten websites and cross-platform mobile apps to proven SEO ranking campaigns and social media marketing, choose the perfect plan for your business.
            </p>
          </SectionReveal>

          {/* Quick CTAs */}
          <SectionReveal delay={0.25} className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => openQuoteModal()}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="shadow-glow font-bold"
            >
              Get Free Consultation Quote
            </Button>
            <a
              href="https://wa.me/918958889538?text=Hi%20Webspyra,%20I%20am%20interested%20in%20your%20services.%20Please%20share%20details."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-50 text-black font-extrabold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
              style={{ color: "#000000" }}
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" fill="#25D366" />
              <span>WhatsApp</span>
            </a>
          </SectionReveal>
        </div>

        {/* 2. Top-Level Category Filter Switcher */}
        <SectionReveal delay={0.3} className="space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 max-w-4xl mx-auto shadow-inner">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-black text-white shadow-md scale-102"
                  : "text-slate-800 hover:text-black hover:bg-white/60"
              }`}
            >
              ✨ View All
            </button>
            <button
              onClick={() => setSelectedCategory("websites")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === "websites"
                  ? "bg-black text-white shadow-md scale-102"
                  : "text-slate-800 hover:text-black hover:bg-white/60"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Websites & E-Com</span>
            </button>
            <button
              onClick={() => setSelectedCategory("seo")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === "seo"
                  ? "bg-black text-white shadow-md scale-102"
                  : "text-slate-800 hover:text-black hover:bg-white/60"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>SEO Services</span>
            </button>
            <button
              onClick={() => setSelectedCategory("apps")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === "apps"
                  ? "bg-black text-white shadow-md scale-102"
                  : "text-slate-800 hover:text-black hover:bg-white/60"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>App Development</span>
            </button>
            <button
              onClick={() => setSelectedCategory("social_gmb")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === "social_gmb"
                  ? "bg-black text-white shadow-md scale-102"
                  : "text-slate-800 hover:text-black hover:bg-white/60"
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Social & GMB</span>
            </button>
          </div>
        </SectionReveal>

        {/* ============================================================= */}
        {/* SECTION: WEBSITE DEVELOPMENT PACKAGES                          */}
        {/* ============================================================= */}
        {(selectedCategory === "all" || selectedCategory === "websites") && (
          <section id="website-packages" className="space-y-6 pt-2">
            <div className="text-center space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-900 text-xs font-extrabold uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5" />
                <span>Website Development Packages</span>
              </div>
              <h2
                className="font-display text-2xl sm:text-4xl font-extrabold text-black tracking-tight"
                style={{ color: "#000000", opacity: 1 }}
              >
                High-Converting Business & E-Commerce Websites
              </h2>
              <p
                className="text-xs sm:text-sm text-black max-w-2xl mx-auto font-medium"
                style={{ color: "#000000", opacity: 1 }}
              >
                Every package includes a free 1st-year domain, high-speed cloud hosting, business emails, zero-zoom mobile protection, and SSL certificate.
              </p>

              {/* Shortened Subtabs: Business, Portfolio, Ecommerce */}
              <div className="pt-1.5 flex justify-center">
                <Tabs
                  tabs={websiteSubTabs}
                  activeTab={activeWebTab}
                  onChange={setActiveWebTab}
                />
              </div>
            </div>

            {/* 3 Website Plan Cards - Compact on mobile with View More Features toggle */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7 items-stretch">
              {currentWebPlans.map((plan, idx) => {
                const cardKey = `web-${activeWebTab}-${idx}`;
                const isExpanded = !!expandedCards[cardKey];

                return (
                  <GlassCard
                    key={idx}
                    enableTilt
                    glowColor={plan.highlight ? "blue" : "none"}
                    className={`p-3.5 sm:p-7 flex flex-col justify-between h-auto relative bg-white/95 border-2 rounded-2xl sm:rounded-3xl ${
                      plan.highlight
                        ? "ring-2 ring-accent border-accent/80 shadow-xl bg-gradient-to-b from-blue-50/50 via-white to-white"
                        : "border-slate-300 shadow-md"
                    }`}
                  >
                    {plan.highlight && (
                      <div className="-mx-3.5 sm:-mx-7 -mt-3.5 sm:-mt-7 mb-3 sm:mb-4 py-1.5 sm:py-2 px-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-sm rounded-t-xl sm:rounded-t-2xl">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Most Popular Choice</span>
                      </div>
                    )}

                    <div className="space-y-2.5 sm:space-y-4">
                      {/* Header */}
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            className="font-display font-extrabold text-lg sm:text-2xl text-black"
                            style={{ color: "#000000", opacity: 1 }}
                          >
                            {plan.name}
                          </h3>
                          <span className="text-[9px] sm:text-[11px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full bg-slate-100 text-black border border-slate-300 shrink-0">
                            {plan.badge}
                          </span>
                        </div>
                        <p
                          className="text-xs text-black font-semibold mt-0.5 sm:mt-1 leading-relaxed"
                          style={{ color: "#000000", opacity: 1 }}
                        >
                          {plan.desc}
                        </p>
                      </div>

                      {/* Price Box */}
                      <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-1">
                        <div className="flex items-baseline gap-1.5 sm:gap-2">
                          {plan.oldPrice && (
                            <span className="text-xs sm:text-sm text-slate-500 line-through font-bold">
                              {plan.oldPrice}
                            </span>
                          )}
                          <span
                            className="font-display font-extrabold text-2xl sm:text-4xl text-black"
                            style={{ color: "#000000", opacity: 1 }}
                          >
                            {plan.price}
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            {plan.billing}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] sm:text-xs pt-1 border-t border-slate-200/80">
                          <span className="text-accent font-bold">
                            Renewal: {plan.renewal}
                          </span>
                          <span className="font-extrabold text-black">
                            ⚡ {plan.delivery}
                          </span>
                        </div>
                      </div>

                      {/* Feature List (Compact on mobile with View More) */}
                      <div className="space-y-1.5 sm:space-y-2 pt-0.5 sm:pt-1">
                        <p
                          className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-black border-b border-slate-200 pb-1"
                          style={{ color: "#000000" }}
                        >
                          Package Inclusions:
                        </p>
                        <ul className="space-y-1 sm:space-y-1.5 text-left">
                          {plan.features.map((featText, fIdx) => (
                            <li
                              key={fIdx}
                              className={cn(
                                "items-start gap-1.5 sm:gap-2 text-xs text-black font-semibold leading-snug",
                                !isExpanded && fIdx >= 3 ? "hidden md:flex" : "flex"
                              )}
                              style={{ color: "#000000" }}
                            >
                              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[9px] sm:text-[10px]">
                                ✓
                              </div>
                              <span className="flex-1">{featText}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Mobile Toggle Button */}
                        {plan.features.length > 3 && (
                          <button
                            type="button"
                            onClick={() => toggleCardFeatures(cardKey)}
                            className="md:hidden w-full mt-1.5 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-black text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>
                              {isExpanded
                                ? "Show Less Features"
                                : `+ View ${plan.features.length - 3} More Features`}
                            </span>
                            <ChevronDown
                              className={cn(
                                "w-3 h-3 transition-transform duration-200",
                                isExpanded && "rotate-180"
                              )}
                            />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 space-y-1.5 border-t border-slate-100 mt-3 sm:mt-4">
                      <Button
                        variant={plan.highlight ? "primary" : "secondary"}
                        size="md"
                        onClick={() => openQuoteModal(plan.name)}
                        className="w-full shadow-glow font-bold py-2 sm:py-2.5 text-xs sm:text-sm"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      >
                        {plan.buttonText}
                      </Button>
                      {(() => {
                        const buyWaUrl = `https://wa.me/918958889538?text=${encodeURIComponent(
                          `Hi Webspyra Team,\n\n` +
                          `I want to buy the *${plan.name}* plan (${activeWebTab.toUpperCase()} Category).\n\n` +
                          `💰 *Price:* ${plan.price}\n` +
                          `⏱️ *Delivery:* ${plan.delivery}\n` +
                          `🔄 *Annual Renewal:* ${plan.renewal}\n\n` +
                          `🎯 *Features:*\n` +
                          plan.features.slice(0, 8).map((f) => `• ${f}`).join("\n") +
                          `\n\n` +
                          `Please confirm onboarding steps and payment invoice to get started!`
                        )}`;

                        return (
                          <a
                            href={buyWaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 w-full text-center text-[10px] sm:text-[11px] font-extrabold text-emerald-800 hover:text-emerald-950 py-1 transition-colors"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" fill="#25D366" />
                            <span>Buy Now via WhatsApp →</span>
                          </a>
                        );
                      })()}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </section>
        )}

        {/* ============================================================= */}
        {/* SECTION 1: SEO SERVICES                                        */}
        {/* ============================================================= */}
        {(selectedCategory === "all" || selectedCategory === "seo") && (
          <section id="seo-services" className="space-y-6 pt-2">
            <div className="text-center space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-extrabold uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Section 1: SEO Services</span>
              </div>
              <h2
                className="font-display text-2xl sm:text-4xl font-extrabold text-black tracking-tight"
                style={{ color: "#000000", opacity: 1 }}
              >
                Organic Google Search Engine Optimization Plans
              </h2>
              <p
                className="text-xs sm:text-sm text-black max-w-2xl mx-auto font-medium"
                style={{ color: "#000000", opacity: 1 }}
              >
                Drive high-intent buyer traffic directly from Google search. All SEO packages include transparent monthly reporting with no hidden fees.
              </p>
            </div>

            {/* 3 SEO Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7 items-stretch">
              {seoPlans.map((plan) => {
                const cardKey = `seo-${plan.id}`;
                const isExpanded = !!expandedCards[cardKey];

                return (
                  <GlassCard
                    key={plan.id}
                    enableTilt
                    glowColor={plan.highlight ? "mint" : "none"}
                    className={`p-3.5 sm:p-7 flex flex-col justify-between h-auto relative bg-white/95 border-2 rounded-2xl sm:rounded-3xl ${
                      plan.highlight
                        ? "ring-2 ring-emerald-500 border-emerald-500 shadow-xl bg-gradient-to-b from-emerald-50/50 via-white to-white"
                        : "border-slate-300 shadow-md"
                    }`}
                  >
                    {plan.highlight && (
                      <div className="-mx-3.5 sm:-mx-7 -mt-3.5 sm:-mt-7 mb-3 sm:mb-4 py-1.5 sm:py-2 px-3 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-sm rounded-t-xl sm:rounded-t-2xl">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Marked Popular</span>
                      </div>
                    )}

                    <div className="space-y-2.5 sm:space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            className="font-display font-extrabold text-lg sm:text-2xl text-black"
                            style={{ color: "#000000", opacity: 1 }}
                          >
                            {plan.name}
                          </h3>
                          <span className="text-[9px] sm:text-[11px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 shrink-0">
                            {plan.badge}
                          </span>
                        </div>
                        <p
                          className="text-xs text-black font-semibold mt-0.5 sm:mt-1 leading-relaxed"
                          style={{ color: "#000000", opacity: 1 }}
                        >
                          {plan.desc}
                        </p>
                      </div>

                      {/* Price Box */}
                      <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-1">
                        <div className="flex items-baseline gap-1.5">
                          <span
                            className="font-display font-extrabold text-2xl sm:text-4xl text-black"
                            style={{ color: "#000000", opacity: 1 }}
                          >
                            {plan.price}
                          </span>
                          <span className="text-xs sm:text-sm font-extrabold text-slate-700">
                            {plan.billing}
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-emerald-700 font-bold">
                          Monthly Rolling Contract • Cancel Anytime
                        </p>
                      </div>

                      {/* Feature List */}
                      <div className="space-y-1.5 sm:space-y-2 pt-0.5 sm:pt-1">
                        <p
                          className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-black border-b border-slate-200 pb-1"
                          style={{ color: "#000000" }}
                        >
                          Included Deliverables:
                        </p>
                        <ul className="space-y-1 sm:space-y-1.5">
                          {plan.features.map((feature, fIdx) => (
                            <li
                              key={fIdx}
                              className={cn(
                                "items-center gap-1.5 sm:gap-2 text-xs font-bold text-black leading-snug",
                                !isExpanded && fIdx >= 3 ? "hidden md:flex" : "flex"
                              )}
                              style={{ color: "#000000" }}
                            >
                              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 font-extrabold text-[9px] sm:text-[10px]">
                                ✓
                              </span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {plan.features.length > 3 && (
                          <button
                            type="button"
                            onClick={() => toggleCardFeatures(cardKey)}
                            className="md:hidden w-full mt-1.5 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-black text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>
                              {isExpanded
                                ? "Show Less Deliverables"
                                : `+ View ${plan.features.length - 3} More`}
                            </span>
                            <ChevronDown
                              className={cn(
                                "w-3 h-3 transition-transform duration-200",
                                isExpanded && "rotate-180"
                              )}
                            />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-3 border-t border-slate-100 mt-3 sm:mt-4">
                      <Button
                        variant={plan.highlight ? "primary" : "secondary"}
                        size="md"
                        onClick={() => openQuoteModal(plan.name)}
                        className="w-full shadow-glow font-bold py-2 sm:py-2.5 text-xs sm:text-sm"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      >
                        {plan.cta}
                      </Button>
                    </div>
                  </GlassCard>
                );
              })}
            </div>

            {/* Side-by-Side SEO Comparison Matrix */}
            <div className="rounded-2xl sm:rounded-3xl bg-white border-2 border-slate-200 shadow-lg overflow-hidden p-4 sm:p-7 space-y-5">
              <div className="text-center space-y-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                  Side-By-Side Breakdown
                </span>
                <h3
                  className="font-display text-xl sm:text-3xl font-extrabold text-black"
                  style={{ color: "#000000", opacity: 1 }}
                >
                  Compare SEO Plans (Silver, Gold & Platinum)
                </h3>
                <p
                  className="text-xs text-black font-semibold max-w-xl mx-auto"
                  style={{ color: "#000000" }}
                >
                  All plans include transparent monthly reporting. No hidden fees.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[560px]">
                  <thead>
                    <tr className="border-b-2 border-slate-300 bg-slate-50">
                      <th className="py-2.5 px-3 text-[11px] sm:text-xs font-extrabold text-black uppercase tracking-wider">
                        Feature
                      </th>
                      <th className="py-2.5 px-3 text-[11px] sm:text-xs font-extrabold text-black uppercase tracking-wider text-center">
                        SEO Silver
                      </th>
                      <th className="py-2.5 px-3 text-[11px] sm:text-xs font-extrabold text-emerald-700 uppercase tracking-wider text-center bg-emerald-50/60">
                        SEO Gold (Popular)
                      </th>
                      <th className="py-2.5 px-3 text-[11px] sm:text-xs font-extrabold text-black uppercase tracking-wider text-center">
                        SEO Platinum
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {seoComparisonRows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className={
                          rIdx % 2 === 0
                            ? "bg-white hover:bg-slate-50/80 transition-colors"
                            : "bg-slate-50/40 hover:bg-slate-50/80 transition-colors"
                        }
                      >
                        <td
                          className="py-2 px-3 font-bold text-black"
                          style={{ color: "#000000" }}
                        >
                          {row.feature}
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-black">
                          {row.isText ? (
                            <span style={{ color: "#000000" }}>{row.silver}</span>
                          ) : row.silver ? (
                            <Check className="w-4 h-4 text-emerald-600 inline font-extrabold" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 inline" />
                          )}
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-black bg-emerald-50/30">
                          {row.isText ? (
                            <span className="text-emerald-900 font-extrabold">
                              {row.gold}
                            </span>
                          ) : row.gold ? (
                            <Check className="w-4 h-4 text-emerald-600 inline font-extrabold" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 inline" />
                          )}
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-black">
                          {row.isText ? (
                            <span style={{ color: "#000000" }}>{row.platinum}</span>
                          ) : row.platinum ? (
                            <Check className="w-4 h-4 text-emerald-600 inline font-extrabold" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 inline" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-1 text-center">
                <p
                  className="text-xs text-black font-semibold"
                  style={{ color: "#000000" }}
                >
                  💡 Note: Need custom e-commerce or multilingual international SEO?{" "}
                  <button
                    onClick={() => openQuoteModal("Custom SEO")}
                    className="text-accent underline font-extrabold ml-1 cursor-pointer"
                  >
                    Request Custom Scope
                  </button>
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================= */}
        {/* SECTION 2: APP DEVELOPMENT                                    */}
        {/* ============================================================= */}
        {(selectedCategory === "all" || selectedCategory === "apps") && (
          <section id="app-development" className="space-y-6 pt-2">
            <div className="text-center space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-900 text-xs font-extrabold uppercase tracking-wider">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Section 2: App Development</span>
              </div>
              <h2
                className="font-display text-2xl sm:text-4xl font-extrabold text-black tracking-tight"
                style={{ color: "#000000", opacity: 1 }}
              >
                Custom Mobile Apps Built with Cross-Platform Flutter
              </h2>
              <p
                className="text-xs sm:text-sm text-black max-w-2xl mx-auto font-medium"
                style={{ color: "#000000", opacity: 1 }}
              >
                Launch your iOS and Android mobile app with high performance, smooth 60fps animations, robust cloud database, and dedicated post-launch support.
              </p>
            </div>

            {/* 3 App Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7 items-stretch">
              {appPlans.map((plan) => {
                const cardKey = `app-${plan.id}`;
                const isExpanded = !!expandedCards[cardKey];

                return (
                  <GlassCard
                    key={plan.id}
                    enableTilt
                    glowColor={plan.highlight ? "pink" : "none"}
                    className={`p-3.5 sm:p-7 flex flex-col justify-between h-auto relative bg-white/95 border-2 rounded-2xl sm:rounded-3xl ${
                      plan.highlight
                        ? "ring-2 ring-purple-500 border-purple-500 shadow-xl bg-gradient-to-b from-purple-50/50 via-white to-white"
                        : "border-slate-300 shadow-md"
                    }`}
                  >
                    {plan.highlight && (
                      <div className="-mx-3.5 sm:-mx-7 -mt-3.5 sm:-mt-7 mb-3 sm:mb-4 py-1.5 sm:py-2 px-3 bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-600 text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-sm rounded-t-xl sm:rounded-t-2xl">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Marked Popular</span>
                      </div>
                    )}

                    <div className="space-y-2.5 sm:space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            className="font-display font-extrabold text-lg sm:text-2xl text-black"
                            style={{ color: "#000000", opacity: 1 }}
                          >
                            {plan.name}
                          </h3>
                          <span className="text-[9px] sm:text-[11px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-950 border border-purple-300 shrink-0">
                            {plan.badge}
                          </span>
                        </div>
                        <p
                          className="text-xs text-black font-semibold mt-0.5 sm:mt-1 leading-relaxed"
                          style={{ color: "#000000", opacity: 1 }}
                        >
                          {plan.desc}
                        </p>
                      </div>

                      {/* Price Box */}
                      <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-1">
                        <div className="flex items-baseline gap-1.5">
                          <span
                            className="font-display font-extrabold text-2xl sm:text-4xl text-black"
                            style={{ color: "#000000", opacity: 1 }}
                          >
                            {plan.price}
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            one-time package
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-purple-700 font-bold">
                          Milestone-based Payments • App Store Submission
                        </p>
                      </div>

                      {/* Feature List */}
                      <div className="space-y-1.5 sm:space-y-2 pt-0.5 sm:pt-1">
                        <p
                          className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-black border-b border-slate-200 pb-1"
                          style={{ color: "#000000" }}
                        >
                          Included Specifications:
                        </p>
                        <ul className="space-y-1 sm:space-y-1.5">
                          {plan.features.map((feature, fIdx) => (
                            <li
                              key={fIdx}
                              className={cn(
                                "items-center gap-1.5 sm:gap-2 text-xs font-bold text-black leading-snug",
                                !isExpanded && fIdx >= 3 ? "hidden md:flex" : "flex"
                              )}
                              style={{ color: "#000000" }}
                            >
                              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 shrink-0 font-extrabold text-[9px] sm:text-[10px]">
                                ✓
                              </span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {plan.features.length > 3 && (
                          <button
                            type="button"
                            onClick={() => toggleCardFeatures(cardKey)}
                            className="md:hidden w-full mt-1.5 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-black text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>
                              {isExpanded
                                ? "Show Less Specifications"
                                : `+ View ${plan.features.length - 3} More`}
                            </span>
                            <ChevronDown
                              className={cn(
                                "w-3 h-3 transition-transform duration-200",
                                isExpanded && "rotate-180"
                              )}
                            />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-3 border-t border-slate-100 mt-3 sm:mt-4">
                      <Button
                        variant={plan.highlight ? "primary" : "secondary"}
                        size="md"
                        onClick={() => openQuoteModal(plan.name)}
                        className="w-full shadow-glow font-bold py-2 sm:py-2.5 text-xs sm:text-sm"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      >
                        {plan.cta}
                      </Button>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </section>
        )}

        {/* ============================================================= */}
        {/* SECTION 3: SOCIAL MEDIA & GOOGLE BUSINESS                      */}
        {/* ============================================================= */}
        {(selectedCategory === "all" || selectedCategory === "social_gmb") && (
          <section id="social-media-gmb" className="space-y-6 pt-2">
            <div className="text-center space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold uppercase tracking-wider">
                <Share2 className="w-3.5 h-3.5" />
                <span>Section 3: Social Media & Google Business</span>
              </div>
              <h2
                className="font-display text-2xl sm:text-4xl font-extrabold text-black tracking-tight"
                style={{ color: "#000000", opacity: 1 }}
              >
                Social Media Marketing & Google Local Maps Growth
              </h2>
              <p
                className="text-xs sm:text-sm text-black max-w-2xl mx-auto font-medium"
                style={{ color: "#000000", opacity: 1 }}
              >
                Build trust, engage clients daily on Instagram and Facebook, and claim top ranking on Google Maps for local customers searching nearby.
              </p>
            </div>

            {/* 3 Social & GMB Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7 items-stretch">
              {socialGmbPlans.map((plan) => {
                const cardKey = `social-${plan.id}`;
                const isExpanded = !!expandedCards[cardKey];

                return (
                  <GlassCard
                    key={plan.id}
                    enableTilt
                    glowColor={plan.highlight ? "peach" : "none"}
                    className={`p-3.5 sm:p-7 flex flex-col justify-between h-auto relative bg-white/95 border-2 rounded-2xl sm:rounded-3xl ${
                      plan.highlight
                        ? "ring-2 ring-amber-500 border-amber-500 shadow-xl bg-gradient-to-b from-amber-50/50 via-white to-white"
                        : "border-slate-300 shadow-md"
                    }`}
                  >
                    {plan.highlight && (
                      <div className="-mx-3.5 sm:-mx-7 -mt-3.5 sm:-mt-7 mb-3 sm:mb-4 py-1.5 sm:py-2 px-3 bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-sm rounded-t-xl sm:rounded-t-2xl">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Marked Popular</span>
                      </div>
                    )}

                    <div className="space-y-2.5 sm:space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            className="font-display font-extrabold text-lg sm:text-2xl text-black"
                            style={{ color: "#000000", opacity: 1 }}
                          >
                            {plan.name}
                          </h3>
                          <span className="text-[9px] sm:text-[11px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 shrink-0">
                            {plan.badge}
                          </span>
                        </div>
                        <p
                          className="text-xs text-black font-semibold mt-0.5 sm:mt-1 leading-relaxed"
                          style={{ color: "#000000", opacity: 1 }}
                        >
                          {plan.desc}
                        </p>
                      </div>

                      {/* Price Box */}
                      <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-1">
                        <div className="flex items-baseline gap-1.5">
                          <span
                            className="font-display font-extrabold text-2xl sm:text-4xl text-black"
                            style={{ color: "#000000", opacity: 1 }}
                          >
                            {plan.price}
                          </span>
                          <span className="text-xs font-extrabold text-slate-700">
                            {plan.billing === "one-time" ? "one-time fee" : plan.billing}
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-amber-800 font-bold">
                          {plan.billing === "one-time"
                            ? "Lifetime Verified Setup"
                            : "Monthly Recurring • Transparent Reporting"}
                        </p>
                      </div>

                      {/* Feature List */}
                      <div className="space-y-1.5 sm:space-y-2 pt-0.5 sm:pt-1">
                        <p
                          className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-black border-b border-slate-200 pb-1"
                          style={{ color: "#000000" }}
                        >
                          What Is Included:
                        </p>
                        <ul className="space-y-1 sm:space-y-1.5">
                          {plan.features.map((feature, fIdx) => (
                            <li
                              key={fIdx}
                              className={cn(
                                "items-center gap-1.5 sm:gap-2 text-xs font-bold text-black leading-snug",
                                !isExpanded && fIdx >= 3 ? "hidden md:flex" : "flex"
                              )}
                              style={{ color: "#000000" }}
                            >
                              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 font-extrabold text-[9px] sm:text-[10px]">
                                ✓
                              </span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {plan.features.length > 3 && (
                          <button
                            type="button"
                            onClick={() => toggleCardFeatures(cardKey)}
                            className="md:hidden w-full mt-1.5 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-black text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>
                              {isExpanded
                                ? "Show Less Features"
                                : `+ View ${plan.features.length - 3} More`}
                            </span>
                            <ChevronDown
                              className={cn(
                                "w-3 h-3 transition-transform duration-200",
                                isExpanded && "rotate-180"
                              )}
                            />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-3 border-t border-slate-100 mt-3 sm:mt-4">
                      <Button
                        variant={plan.highlight ? "primary" : "secondary"}
                        size="md"
                        onClick={() => openQuoteModal(plan.name)}
                        className="w-full shadow-glow font-bold py-2 sm:py-2.5 text-xs sm:text-sm"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      >
                        {plan.cta}
                      </Button>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. Frequently Asked Questions */}
        <SectionReveal className="space-y-5 max-w-4xl mx-auto pt-6">
          <div className="text-center space-y-1.5">
            <Badge variant="blue">Pricing & Billing FAQs</Badge>
            <h2
              className="font-display text-xl sm:text-3xl font-extrabold text-black"
              style={{ color: "#000000", opacity: 1 }}
            >
              Frequently asked questions about our pricing & terms
            </h2>
            <p
              className="text-xs sm:text-sm text-black font-semibold"
              style={{ color: "#000000" }}
            >
              Everything you need to know about our billing, delivery, renewals, and ongoing technical support.
            </p>
          </div>
          <Accordion items={faqs} defaultOpenId="pr-faq-1" />
        </SectionReveal>

        {/* 5. Custom Quote Bottom Banner */}
        <SectionReveal>
          <div className="rounded-2xl sm:rounded-3xl glass-panel p-6 sm:p-10 border-2 border-slate-300 text-center space-y-5 bg-white shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white mx-auto shadow-glow">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2
              className="font-display text-xl sm:text-3xl font-extrabold text-black"
              style={{ color: "#000000", opacity: 1 }}
            >
              Need a custom plan combining websites, apps, and SEO?
            </h2>
            <p
              className="text-xs sm:text-sm text-black max-w-xl mx-auto font-semibold"
              style={{ color: "#000000", opacity: 1 }}
            >
              Tell us your exact goals. We create custom bundles tailored to your budget with bundle discounts and a dedicated account manager.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => openQuoteModal("Custom Bundle")}
                className="shadow-glow font-bold"
              >
                Request Custom Bundle Quote
              </Button>
              <Link href="/contact">
                <Button variant="secondary" size="md" className="font-bold">
                  Speak with Solutions Architect
                </Button>
              </Link>
            </div>
          </div>
        </SectionReveal>
      </div>
    </PublicLayout>
  );
}
