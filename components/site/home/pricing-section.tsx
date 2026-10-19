"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Star, MessageCircle, ArrowRight, ChevronDown } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { Countdown } from "@/components/ui/countdown";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Ripple } from "@/registry/magicui/ripple";
import { getHomePlans, PlanItem, defaultPlans } from "@/lib/home-data";
import { getSiteSettings, defaultSiteSettings } from "@/lib/site-data";
import { SiteSettings } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { MarqueeDemo } from "@/components/ui/marquee";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

export interface PricingSectionProps {
  onOpenQuote?: () => void;
}

export function PricingSection({ onOpenQuote }: PricingSectionProps) {
  const [plans, setPlans] = useState<PlanItem[]>(defaultPlans);
  const [activeCategory, setActiveCategory] = useState("portfolio");
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleCardFeatures = (key: string) => {
    setExpandedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const targetDealTime = new Date(Date.now() + 19 * 60 * 60 * 1000 + 35 * 60 * 1000);

  useEffect(() => {
    getHomePlans().then(setPlans);
    getSiteSettings().then(setSettings);
  }, []);

  const pricingTabs = [
    { id: "portfolio", label: "Portfolio" },
    { id: "business", label: "Business" },
    { id: "ecommerce", label: "Ecommerce" },
  ];

  const currentPlans = plans.filter((p) => p.category_slug === activeCategory);
  const cleanWhatsApp = settings.whatsapp_number.replace(/[^0-9]/g, "");

  return (
    <section
      id="pricing"
      style={{ "--foreground": "rgba(56, 189, 248, 0.45)" } as React.CSSProperties}
      className="py-24 md:py-32 relative overflow-hidden bg-black text-white border-y border-neutral-900"
    >
      {/* Magic UI Ripple Background Animation */}
      <Ripple
        mainCircleSize={300}
        mainCircleOpacity={0.45}
        numCircles={11}
        step={125}
        centerTop="38%"
        className="opacity-100 z-0"
      />

      {/* Subtle Center Radial Backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-10 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <SectionReveal>
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/35 shadow-sm backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Transparent Pricing • No Hidden Costs
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/35 shadow-sm backdrop-blur-md">
                Zero Setup Fees
              </span>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.18]">
              Affordable website plans crafted for rapid growth.
            </h2>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Every package comes complete with a free domain, ultra-fast cloud hosting, business emails, and SSL security. Choose your plan and start today.
            </p>
          </SectionReveal>

          {/* Deal Countdown & Category Switcher */}
          <SectionReveal delay={0.2} className="pt-2 flex flex-col items-center gap-6">
            <Countdown
              targetDate={targetDealTime}
              label="Special Limited-Time Launch Offer Ends In:"
              className="text-white"
            />

            <div className="p-1 rounded-full bg-neutral-950/90 border border-neutral-800 shadow-2xl backdrop-blur-md">
              <Tabs
                tabs={pricingTabs}
                activeTab={activeCategory}
                onChange={setActiveCategory}
                layoutId="pricing-category-tabs"
                isDark={true}
                className="bg-transparent border-none shadow-none text-white"
              />
            </div>
          </SectionReveal>
        </div>

        {/* 3D Pricing Cards Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
            {currentPlans.map((plan, index) => {
              const isPopular = plan.is_popular;
              const waUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                `Hi Webspyra, I am interested in the ${plan.name} (₹${plan.price.toLocaleString("en-IN")}). How do we proceed?`
              )}`;

              const activePrice = plan.price;
              const allFeatures = plan.feature_groups
                ? plan.feature_groups.flatMap((g) => g.features)
                : [];
              const cardKey = `home-plan-${plan.id}`;
              const isExpanded = !!expandedCards[cardKey];

              return (
                <div
                  key={plan.id}
                  className="w-full flex flex-col"
                >
                  <motion.div
                    initial={isDesktop ? { y: 40, opacity: 0.8 } : { y: 0, opacity: 1 }}
                    whileInView={
                      isDesktop
                        ? {
                            y: isPopular ? -20 : 0,
                            opacity: 1,
                            x: index === 2 ? -24 : index === 0 ? 24 : 0,
                            scale: index === 0 || index === 2 ? 0.95 : 1.0,
                          }
                        : {
                            y: 0,
                            opacity: 1,
                            x: 0,
                            scale: 1,
                          }
                    }
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      type: "spring",
                      stiffness: 100,
                      damping: 25,
                      delay: isDesktop ? 0.15 * index : 0,
                    }}
                    className={cn(
                      "rounded-2xl sm:rounded-3xl border p-4 sm:p-8 bg-[#0c101d]/90 backdrop-blur-xl text-center flex flex-col justify-between relative transition-all duration-300 shadow-2xl h-full w-full",
                      isPopular
                        ? "border-cyan-400 border-2 shadow-[0_0_40px_rgba(6,182,212,0.35)] z-20 scale-100 lg:scale-[1.02]"
                        : "border-neutral-800 hover:border-cyan-500/40 z-10",
                      !isPopular && "mt-0 lg:mt-5",
                      index === 0 || index === 2
                        ? "z-0 transform translate-x-0 translate-y-0"
                        : "z-10",
                      index === 0 && "origin-right",
                      index === 2 && "origin-left"
                    )}
                  >
                    {isPopular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-600 py-1 px-3 sm:px-3.5 rounded-bl-xl sm:rounded-bl-2xl rounded-tr-xl sm:rounded-tr-2xl flex items-center shadow-lg">
                        <Star className="text-white h-3 sm:h-3.5 w-3 sm:w-3.5 fill-current" />
                        <span className="text-white ml-1 sm:ml-1.5 font-sans font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                          Popular
                        </span>
                      </div>
                    )}

                    <div className="flex-1 flex flex-col">
                      <div className="text-left space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-lg sm:text-xl font-black text-white tracking-wide">
                            {plan.name}
                          </p>
                          {plan.discount_percentage ? (
                            <Badge variant="pink" withDot={false} className="bg-rose-500/25 text-rose-300 border-rose-500/40 font-bold text-[10px]">
                              {plan.discount_percentage}% OFF
                            </Badge>
                          ) : null}
                        </div>
                        {plan.tagline && (
                          <p className="text-xs text-slate-300 leading-relaxed font-normal">
                            {plan.tagline}
                          </p>
                        )}
                      </div>

                      {/* NumberFlow Price Box */}
                      <div className="mt-3 sm:mt-5 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/90 border border-neutral-700/80 flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center gap-x-2">
                          {plan.old_price && (
                            <span className="text-xs sm:text-xl text-slate-300/80 line-through font-bold">
                              ₹{plan.old_price.toLocaleString("en-IN")}
                            </span>
                          )}
                          <span className="text-2xl sm:text-5xl font-black tracking-tight text-white">
                            <NumberFlow
                              value={activePrice}
                              format={{ style: "currency", currency: "INR", maximumFractionDigits: 0 }}
                              transformTiming={{
                                duration: 500,
                                easing: "ease-out",
                              }}
                              willChange
                              className="font-variant-numeric: tabular-nums text-white"
                            />
                          </span>
                        </div>

                        <p className="text-[11px] sm:text-xs leading-4 sm:leading-5 text-slate-200 font-medium mt-0.5 sm:mt-1">
                          One-time investment (+18% GST)
                        </p>

                        <div className="w-full flex items-center justify-between text-[10px] sm:text-[11px] text-slate-300 pt-1.5 sm:pt-2 mt-1.5 sm:mt-2 border-t border-neutral-800">
                          <span>Delivery: <strong className="text-white font-bold">{plan.delivery_days} Days</strong></span>
                          <span>Renewal: <strong className="text-white font-bold">{plan.renewal_price > 0 ? `₹${plan.renewal_price.toLocaleString("en-IN")}` : "N/A"}</strong></span>
                        </div>
                      </div>

                      {/* Features List with Mobile View More */}
                      <ul className="mt-3.5 sm:mt-5 space-y-1.5 sm:space-y-2.5 flex flex-col text-left">
                        {allFeatures.map((feature, idx) => (
                          <li
                            key={idx}
                            className={cn(
                              "items-start gap-2 text-xs sm:text-sm text-slate-100",
                              !isExpanded && idx >= 3 ? "hidden md:flex" : "flex"
                            )}
                          >
                            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="h-2 w-2 sm:h-2.5 sm:w-2.5 stroke-[3]" />
                            </div>
                            <span className="flex-1 leading-snug font-medium text-xs sm:text-sm">
                              {feature.text}
                            </span>
                            {feature.is_free_badge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase tracking-wide">
                                Free
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>

                      {/* Mobile View More Toggle */}
                      {allFeatures.length > 3 && (
                        <button
                          type="button"
                          onClick={() => toggleCardFeatures(cardKey)}
                          className="md:hidden w-full mt-2 py-1.5 px-3 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 text-cyan-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-neutral-800"
                        >
                          <span>
                            {isExpanded
                              ? "Show Less Features"
                              : `+ View ${allFeatures.length - 3} More Features`}
                          </span>
                          <ChevronDown
                            className={cn(
                              "w-3 h-3 transition-transform duration-200",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>
                      )}

                      <hr className="w-full my-3.5 sm:my-6 border-neutral-800" />

                      {/* Buttons */}
                      <div className="space-y-2 sm:space-y-2.5">
                        {(() => {
                          const featuresList = plan.feature_groups
                            ? plan.feature_groups.flatMap((g) => g.features.map((f) => f.text)).slice(0, 8)
                            : [];
                          const featuresText = featuresList.length > 0
                            ? `🎯 *Included Key Features:*\n${featuresList.map((f) => `• ${f}`).join("\n")}\n\n`
                            : "";

                          const buyWaUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                            `Hi Webspyra Team,\n\n` +
                            `I want to buy the *${plan.name}* plan.\n\n` +
                            `💰 *Offer Price:* ₹${(plan.price || 0).toLocaleString("en-IN")} (+18% GST)\n` +
                            (plan.old_price ? `🏷️ *Original Price:* ₹${plan.old_price.toLocaleString("en-IN")}\n` : "") +
                            (plan.delivery_days ? `⏱️ *Delivery:* ${plan.delivery_days} Days\n` : "") +
                            (plan.renewal_price ? `🔄 *Annual Renewal:* ₹${plan.renewal_price.toLocaleString("en-IN")} / year\n\n` : "\n") +
                            featuresText +
                            `Please confirm onboarding steps and advance payment invoice to get started!`
                          )}`;

                          return (
                            <a
                              href={buyWaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                buttonVariants({
                                  variant: isPopular ? "primary" : "outline",
                                }),
                                "group relative w-full gap-2 overflow-hidden text-sm sm:text-base font-bold tracking-tight rounded-xl py-2 sm:py-3 shadow-lg flex items-center justify-center",
                                "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-cyan-400 hover:ring-offset-1 hover:bg-cyan-500 hover:text-white cursor-pointer",
                                isPopular
                                  ? "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)]"
                                  : "bg-neutral-900/90 text-white hover:bg-neutral-800 border-neutral-700 hover:border-cyan-500/50"
                              )}
                            >
                              <WhatsAppIcon className="w-4 h-4 shrink-0" fill="#25D366" />
                              <span>Buy Now / Pay Advance</span>
                              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 inline-block" />
                            </a>
                          );
                        })()}

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-1/2 justify-center text-[11px] sm:text-xs !text-white hover:text-white hover:bg-neutral-800 border border-neutral-700 rounded-xl py-1.5 sm:py-2 bg-neutral-900/90 font-bold"
                            onClick={onOpenQuote}
                          >
                            Get Quote
                          </Button>

                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-1/2 inline-flex items-center justify-center gap-1.5 py-1.5 sm:py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-700/50 text-[11px] sm:text-xs font-bold transition-colors cursor-pointer"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" fill="#25D366" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>

                      <p className="mt-5 text-[11px] leading-relaxed text-slate-300 font-medium text-center">
                        500+ businesses trust Webspyra • 4.9/5 Rating
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full-width edge-to-edge Tech Stack Marquee (No black box, transparent background) */}
      <div className="w-full relative z-10 pt-10 sm:pt-14">
        <MarqueeDemo />
      </div>
    </section>
  );
}

export default PricingSection;
