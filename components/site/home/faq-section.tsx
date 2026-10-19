"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HelpCircle, MessageCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { ShineBorder } from "@/components/ui/shine-border";
import { SectionReveal } from "@/components/ui/section-reveal";
import { GridPulse } from "@/components/ui/grid-pulse";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { getHomeFaqs, FaqItem, defaultFaqs } from "@/lib/home-data";
import { getSiteSettings, defaultSiteSettings } from "@/lib/site-data";
import { SiteSettings } from "@/types";

export function FaqSection() {
  const [faqs, setFaqs] = useState<FaqItem[]>(defaultFaqs);
  const [activeCategory, setActiveCategory] = useState("all");
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    getHomeFaqs().then(setFaqs);
    getSiteSettings().then(setSettings);
  }, []);

  const categories = [
    { id: "all", label: "All Questions" },
    { id: "general", label: "General & Process" },
    { id: "pricing", label: "Pricing & Invoicing" },
    { id: "technical", label: "Tech & Hosting" },
  ];

  const filteredFaqs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  const accordionItems = filteredFaqs.map((faq) => ({
    id: faq.id,
    title: faq.question,
    content: (
      <p
        className="!text-black text-neutral-950 font-semibold leading-relaxed text-sm sm:text-base"
        style={{ color: "#000000", opacity: 1 }}
      >
        {faq.answer}
      </p>
    ),
  }));

  const cleanWhatsApp = settings.whatsapp_number.replace(/[^0-9]/g, "");

  return (
    <section id="faq" className="py-14 sm:py-20 md:py-24 relative overflow-hidden bg-white text-black border-b border-slate-200">
      <GridPulse
        cell={26}
        reach={2.6}
        ambient={2}
        className="text-black"
        style={{
          "--grid-pulse-line": "rgba(0, 0, 0, 0.06)",
        } as React.CSSProperties}
      />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10 text-black">
        {/* Executive 2-Column Grid: Left (Header + Categories + WhatsApp) | Right (Accordion) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Title, Intro & Instant WhatsApp Help */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <SectionReveal>
                <div className="inline-flex items-center gap-2">
                  <Badge variant="blue" pulseDot>
                    Got Questions?
                  </Badge>
                  <Badge variant="peach">Frequently Asked</Badge>
                </div>
              </SectionReveal>

              <SectionReveal delay={0.1}>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-black tracking-tight leading-[1.18]">
                  Clear answers before we build your website.
                </h2>
              </SectionReveal>

              <SectionReveal delay={0.15}>
                <p className="text-base sm:text-lg text-black font-medium leading-relaxed">
                  Everything you need to know about our packages, delivery timelines, annual renewals, and complete code ownership.
                </p>
              </SectionReveal>
            </div>

            {/* Category Pills */}
            <SectionReveal delay={0.2} className="flex flex-wrap items-center gap-2 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-pill text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-black text-white shadow-md scale-105"
                      : "bg-white text-black hover:bg-slate-100 border border-slate-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </SectionReveal>

            {/* Compact Direct WhatsApp Help Card */}
            <SectionReveal delay={0.25}>
              <ShineBorder
                borderWidth={2}
                duration={4}
                gradient="from-blue-500 via-red-500 to-teal-400"
                borderRadius="1.5rem"
                className="w-full shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="rounded-3xl p-5 sm:p-6 border-0 shadow-none space-y-3.5 bg-white text-black">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-base sm:text-lg text-black">
                        Have a specific question?
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 font-medium">
                        Our founders answer personally on WhatsApp.
                      </p>
                    </div>
                  </div>

                  <div className="pt-1 flex flex-wrap gap-2.5">
                    <a
                      href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                        "Hi Webspyra, I have a few questions before getting started with a new website."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[160px]"
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<WhatsAppIcon className="w-4 h-4" fill="#25D366" />}
                        className="w-full font-bold flex items-center justify-center gap-2"
                      >
                        WhatsApp
                      </Button>
                    </a>
                    <Link href="#enquire" className="flex-1 min-w-[140px]">
                      <Button
                        variant="secondary"
                        size="sm"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        className="w-full"
                      >
                        Send Enquiry
                      </Button>
                    </Link>
                  </div>
                </div>
              </ShineBorder>
            </SectionReveal>
          </div>

          {/* Right Column: Accordion Questions */}
          <div className="lg:col-span-7">
            <SectionReveal delay={0.2}>
              <Accordion
                items={accordionItems}
                defaultOpenId={accordionItems[0]?.id}
                allowMultiple={false}
                enableShineBorder={true}
              />
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
