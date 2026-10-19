"use client";

import React, { useEffect, useState } from "react";
import { X, Check, PhoneCall, Search, Globe, TrendingUp, AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { ShineBorder } from "@/components/ui/shine-border";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/ui/section-reveal";
import { GridPulse } from "@/components/ui/grid-pulse";
import { getSiteSettings, defaultSiteSettings } from "@/lib/site-data";
import { SiteSettings } from "@/types";

export interface WithWithoutSectionProps {
  onOpenQuote?: () => void;
}

export function WithWithoutSection({ onOpenQuote }: WithWithoutSectionProps) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  const withoutPoints = [
    "Customers search your business on Google and find competitors instead.",
    "Zero digital credibility — buyers hesitate to trust unregistered firms.",
    "No 24/7 automated lead capture; missed calls mean lost revenue.",
    "Dependent solely on expensive paid ads or word of mouth.",
    "No official business emails (using @gmail.com looks unprofessional).",
  ];

  const withPoints = [
    "Rank on Google for your target local and national keywords.",
    "Instant trust with an Apple-grade, high-speed verified web presence.",
    "Automated lead capture form sending notifications straight to your phone.",
    "Direct online payments & instant UPI checkout (Razorpay).",
    "5+ branded professional business emails (you@yourcompany.com).",
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-white text-black border-b border-slate-200">
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
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <SectionReveal>
            <div className="inline-flex items-center gap-2">
              <Badge variant="pink">The Cost of Waiting</Badge>
              <Badge variant="mint">Your Digital Advantage</Badge>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-black tracking-tight leading-[1.18]" style={{ color: "#000000" }}>
              Why your business cannot afford to be without a website.
            </h2>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <p className="text-base sm:text-lg text-black font-medium leading-relaxed" style={{ color: "#000000" }}>
              Every single day, hundreds of potential buyers in your industry look for your products online. See what happens when they search for you.
            </p>
          </SectionReveal>
        </div>

        {/* Split Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* LEFT: Without Website */}
          <SectionReveal delay={0.2} className="h-full">
            <ShineBorder
              borderWidth={2}
              duration={4}
              borderRadius="2rem"
              gradient="from-red-500 via-rose-500 to-amber-500"
              className="w-full h-full shadow-card hover:shadow-card-hover transition-shadow"
            >
              <GlassCard
                glowColor="none"
                enableHoverLift={false}
                className="p-5 sm:p-10 rounded-[calc(2rem-2px)] bg-red-50/40 border-0 shadow-none space-y-6 h-full flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center text-danger">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-danger">
                        Without a Website
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-pill bg-red-100 text-danger text-xs font-bold">
                      Losing Sales
                    </span>
                  </div>

                  {/* Fake Google Search Mockup Showing "No Results" */}
                  <div className="p-4 rounded-2xl bg-white border border-red-200 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 text-xs text-black">
                      <Search className="w-3.5 h-3.5 text-slate-800" />
                      <span className="text-black font-semibold">
                        Best {settings.site_name} services near me
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-800 space-y-1">
                      <p className="font-bold">❌ No official website found for this business.</p>
                      <p className="text-[11px] text-red-600">
                        Potential customers click your competitor&apos;s link instead.
                      </p>
                    </div>
                  </div>

                  {/* Pain Points List */}
                  <ul className="space-y-3.5 text-xs sm:text-sm">
                    {withoutPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-black font-medium">
                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-danger shrink-0 mt-0.5">
                          <X className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-red-200/60 text-xs text-red-700 font-semibold">
                  ⚠️ Over 76% of consumers look up a company online before visiting or buying.
                </div>
              </GlassCard>
            </ShineBorder>
          </SectionReveal>

          {/* RIGHT: With Webspyra Website */}
          <SectionReveal delay={0.25} className="h-full">
            <ShineBorder
              borderWidth={2}
              duration={4}
              borderRadius="2rem"
              gradient="from-teal-400 via-emerald-500 to-blue-500"
              className="w-full h-full shadow-card hover:shadow-card-hover transition-shadow"
            >
              <GlassCard
                glowColor="none"
                enableHoverLift={false}
                className="p-5 sm:p-10 rounded-[calc(2rem-2px)] bg-emerald-50/30 border-0 shadow-none space-y-6 h-full flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-mint-light flex items-center justify-center text-success">
                        <Globe className="w-5 h-5" />
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-success">
                        With a Webspyra Website
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-pill bg-mint-light text-success text-xs font-bold">
                      High Conversion
                    </span>
                  </div>

                  {/* Simulated Modern Browser Card Mockup */}
                  <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-black font-bold">https://yourbusiness.com</span>
                      </div>
                      <span className="text-[10px] text-success font-bold">Verified SSL</span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold">
                        <TrendingUp className="w-4 h-4 text-success" />
                        <span>Google Ranking #1 • Instant WhatsApp Leads</span>
                      </div>
                      <span className="text-success font-extrabold">+240% Growth</span>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <ul className="space-y-3.5 text-xs sm:text-sm">
                    {withPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-black font-medium">
                        <div className="w-5 h-5 rounded-full bg-mint-light flex items-center justify-center text-success shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Direct Action */}
                <div className="pt-4 border-t border-emerald-200/60 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-accent hover:underline"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call {settings.contact_phone}</span>
                  </a>

                  <Button variant="primary" size="sm" onClick={onOpenQuote}>
                    Get Your Business Website
                  </Button>
                </div>
              </GlassCard>
            </ShineBorder>
          </SectionReveal>
        </div>

        {/* Feature Badges Strip */}
        <SectionReveal delay={0.3}>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Badge variant="blue">Modern & 100% Responsive</Badge>
            <Badge variant="mint">SEO Ready for Google Ranking</Badge>
            <Badge variant="peach">Fast Cloud Servers & Free SSL</Badge>
            <Badge variant="lavender">1 Year Free Technical Support</Badge>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
