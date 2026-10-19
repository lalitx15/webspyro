"use client";

import React, { useState } from "react";
import { Search, HelpCircle, MessageCircle } from "lucide-react";
import { PublicLayout, useQuoteModal } from "@/components/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Tabs } from "@/components/ui/tabs";
import { SectionReveal } from "@/components/ui/section-reveal";
import { OrbsBackground } from "@/components/ui/orbs-background";

export default function FaqPage() {
  const { openQuoteModal } = useQuoteModal();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    { id: "all", label: "All Questions" },
    { id: "general", label: "General & Process" },
    { id: "pricing", label: "Pricing & Invoices" },
    { id: "technical", label: "Tech, Domain & Hosting" },
    { id: "ecommerce", label: "E-Commerce & UPI" },
  ];

  const allFaqs = [
    {
      id: "f-1",
      category: "general",
      title: "How long does it take to design and launch my website?",
      content:
        "Standard Business Websites take just 5 to 7 working days once your content is confirmed. E-Commerce stores take 8 to 12 working days, and custom web applications take 14 to 24 working days.",
    },
    {
      id: "f-2",
      category: "general",
      title: "Do I own 100% of my website and domain name?",
      content:
        "Yes, absolutely. The domain name is registered in your name/company. You own all rights to your content, code, customer database, and media assets with zero proprietary lock-in.",
    },
    {
      id: "f-3",
      category: "pricing",
      title: "Are there any hidden costs, setup charges, or surprise fees?",
      content:
        "Never. Our pricing is completely transparent. The package price includes domain, cloud hosting, SSL, and support for the 1st year. Renewal charges for future years are explicitly stated upfront.",
    },
    {
      id: "f-4",
      category: "pricing",
      title: "What is your payment milestone schedule?",
      content:
        "We require a 50% advance deposit to begin architecture, wireframing, and custom design. The final 50% is due only after you test and approve the live staging website.",
    },
    {
      id: "f-5",
      category: "technical",
      title: "Why does Webspyra use Next.js 14 instead of WordPress?",
      content:
        "WordPress sites suffer from slow database queries, plugin security vulnerabilities, and heavy mobile lag. Next.js 14 delivers sub-second page loads, 95+ PageSpeed scores, zero-zoom touch navigation, and enterprise security.",
    },
    {
      id: "f-6",
      category: "technical",
      title: "What is the zero-zoom mobile guarantee?",
      content:
        "Many mobile websites accidentally zoom in or shake when users tap inputs or double-tap buttons. We implement multi-layered viewport guards so your website feels like a native iOS and Android application.",
    },
    {
      id: "f-7",
      category: "ecommerce",
      title: "Which payment gateways do your online stores support?",
      content:
        "We natively integrate Razorpay, supporting Google Pay, PhonePe, Paytm, BHIM UPI, Credit/Debit cards, Net Banking, and Wallets. Cash on Delivery is also supported.",
    },
    {
      id: "f-8",
      category: "ecommerce",
      title: "How do automated GST invoices work?",
      content:
        "When a customer completes a purchase, our system calculates appropriate CGST/SGST/IGST and automatically generates a PDF invoice branded with your GSTIN and business logo.",
    },
  ];

  const filteredFaqs = allFaqs.filter((faq) => {
    const matchesCat = activeCategory === "all" || faq.category === activeCategory;
    const matchesQuery =
      searchQuery.trim() === "" ||
      faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const accordionItems = filteredFaqs.map((f) => ({
    id: f.id,
    title: f.title,
    content: (
      <p
        className="text-sm sm:text-base !text-black text-neutral-950 font-semibold leading-relaxed"
        style={{ color: "#000000", opacity: 1 }}
      >
        {f.content}
      </p>
    ),
  }));

  return (
    <PublicLayout>
      <div className="relative min-h-screen py-16 md:py-24 px-5 sm:px-8 max-w-4xl mx-auto space-y-14">
        <OrbsBackground variant="hero" />

        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="blue" pulseDot>
            Help Center & FAQ
          </Badge>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-black tracking-tight" style={{ color: "#000000" }}>
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-black font-semibold max-w-xl mx-auto" style={{ color: "#000000", opacity: 1 }}>
            Everything you need to know about our web development process, hosting infrastructure, domain ownership, and pricing.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-5 h-5 text-textMuted absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. domain, timeline, UPI, hosting)..."
            className="w-full h-12 pl-12 pr-4 rounded-pill bg-white/90 border border-slate-200 text-sm text-textPrimary focus:outline-none focus:border-accent shadow-sm"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center">
          <Tabs tabs={faqCategories} activeTab={activeCategory} onChange={setActiveCategory} />
        </div>

        {/* Accordions */}
        <SectionReveal>
          {accordionItems.length > 0 ? (
            <Accordion items={accordionItems} defaultOpenId="f-1" />
          ) : (
            <div className="py-16 text-center space-y-3">
              <p className="font-display font-bold text-lg text-textPrimary">
                No questions found matching &ldquo;{searchQuery}&rdquo;
              </p>
              <Button variant="secondary" size="sm" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          )}
        </SectionReveal>

        {/* Direct WhatsApp Callout */}
        <SectionReveal>
          <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-white text-center space-y-4">
            <HelpCircle className="w-10 h-10 text-accent mx-auto" />
            <h3 className="font-display font-bold text-xl text-textPrimary">
              Have an unanswered question?
            </h3>
            <p
              className="text-xs sm:text-sm text-black max-w-md mx-auto font-medium"
              style={{ color: "#000000", opacity: 1 }}
            >
              Connect directly with our senior web architects on WhatsApp for instant answers.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <a
                href="https://wa.me/918958889538?text=Hi%20Webspyra%2C%20I%20have%20a%20question%20regarding%20website%20services."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="md" leftIcon={<MessageCircle className="w-4 h-4" />}>
                  Ask on WhatsApp
                </Button>
              </a>
              <Button variant="secondary" size="md" onClick={() => openQuoteModal()}>
                Request Callback
              </Button>
            </div>
          </div>
        </SectionReveal>
      </div>
    </PublicLayout>
  );
}
