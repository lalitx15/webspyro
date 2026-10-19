"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, MessageCircle, ShieldCheck, Zap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShineBorder } from "@/components/ui/shine-border";
import { SectionReveal } from "@/components/ui/section-reveal";
import { GridPulse } from "@/components/ui/grid-pulse";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { getSiteSettings, defaultSiteSettings } from "@/lib/site-data";
import { SiteSettings } from "@/types";

export interface CtaSectionProps {
  onOpenQuote?: () => void;
}

export function CtaSection({ onOpenQuote }: CtaSectionProps) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  const cleanWhatsApp = settings.whatsapp_number.replace(/[^0-9]/g, "");

  return (
    <section className="py-14 sm:py-18 md:py-20 relative overflow-hidden bg-white text-black">
      <GridPulse
        cell={26}
        reach={2.6}
        ambient={2}
        className="text-black"
        style={{
          "--grid-pulse-line": "rgba(0, 0, 0, 0.06)",
        } as React.CSSProperties}
      />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Banner with Big Pastel Art Gradient & Rotating ShineBorder */}
        <ShineBorder
          borderWidth={2}
          duration={5}
          borderRadius="2.5rem"
          gradient="from-blue-500 via-purple-500 to-teal-400"
          className="w-full shadow-card hover:shadow-card-hover transition-shadow"
        >
          <div className="relative rounded-[calc(2.5rem-2px)] p-6 sm:p-14 lg:p-20 overflow-hidden border-0 shadow-none bg-gradient-to-br from-[#FCEBEF] via-[#F8F1EB] to-[#E9EFFD]">
            {/* Decorative Floating Color Glows */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#BFD7F5] blur-[90px] opacity-60 pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#F9B8C8] blur-[90px] opacity-60 pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
              <SectionReveal>
                <div className="inline-flex items-center gap-2">
                  <Badge variant="blue" pulseDot>
                    Launch With Webspyra
                  </Badge>
                  <Badge variant="mint">100% Satisfaction Guaranteed</Badge>
                </div>
              </SectionReveal>

              <SectionReveal delay={0.1}>
                <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-black tracking-tight leading-[1.12]" style={{ color: "#000000" }}>
                  Let&apos;s grow your business{" "}
                  <span className="italic font-normal font-serif text-accent">together</span>.
                </h2>
              </SectionReveal>

              <SectionReveal delay={0.2}>
                <p
                  className="text-base sm:text-xl text-black leading-relaxed max-w-2xl mx-auto font-medium"
                  style={{ color: "#000000", opacity: 1 }}
                >
                  Join 500+ successful companies who trust Webspyra for their digital presence. Your complete, high-speed website is just 5 days away.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.25}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 pt-2 w-full">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={onOpenQuote}
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    className="shadow-glow hover:shadow-glow-lg text-sm sm:text-base w-full sm:w-auto"
                  >
                    Get Started — Free Consultation
                  </Button>

                  <a
                    href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                      settings.whatsapp_default_message || "Hi Webspyra, I am looking for a new website."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button
                      variant="secondary"
                      size="lg"
                      leftIcon={<WhatsAppIcon className="w-5 h-5" fill="#25D366" />}
                      className="text-sm sm:text-base w-full sm:w-auto font-bold flex items-center gap-2"
                    >
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </SectionReveal>

              {/* Micro Trust Strip */}
              <SectionReveal delay={0.3}>
                <div className="pt-8 border-t border-slate-300 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-black" style={{ color: "#000000" }}>
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" />
                    5 to 7 Days Delivery
                  </span>
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
                    Free Domain, Hosting & SSL
                  </span>
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-rose" />
                    Zero Advance Lock-in
                  </span>
                </div>
              </SectionReveal>
            </div>
          </div>
        </ShineBorder>
      </div>
    </section>
  );
}
