"use client";

import React from "react";
import dynamic from "next/dynamic";
import { PublicLayout, useQuoteModal } from "@/components/site";
import { HeroSection, FeaturesSection } from "@/components/site/home";
import { CinematicFooter } from "@/components/ui/motion-footer";

// Code-split below-the-fold sections to optimize initial bundle size & load speed
const PricingSection = dynamic(
  () => import("@/components/site/home").then((m) => m.PricingSection),
  { ssr: true }
);
const WithWithoutSection = dynamic(
  () => import("@/components/site/home").then((m) => m.WithWithoutSection),
  { ssr: true }
);
const PortfolioSection = dynamic(
  () => import("@/components/site/home").then((m) => m.PortfolioSection),
  { ssr: true }
);
const HowItWorksSection = dynamic(
  () => import("@/components/site/home").then((m) => m.HowItWorksSection),
  { ssr: true }
);
const TestimonialsSection = dynamic(
  () => import("@/components/site/home").then((m) => m.TestimonialsSection),
  { ssr: true }
);
const FaqSection = dynamic(
  () => import("@/components/site/home").then((m) => m.FaqSection),
  { ssr: true }
);
const EnquirySection = dynamic(
  () => import("@/components/site/home").then((m) => m.EnquirySection),
  { ssr: true }
);
const FounderSection = dynamic(
  () => import("@/components/site/home").then((m) => m.FounderSection),
  { ssr: true }
);
const CtaSection = dynamic(
  () => import("@/components/site/home").then((m) => m.CtaSection),
  { ssr: true }
);

function HomePageContent() {
  const { openQuoteModal } = useQuoteModal();

  return (
    <div className="relative w-full overflow-x-hidden">
      {/* 1. Hero Section ("A better website. More trust. More customers.") - Black on mobile & desktop */}
      <div className="relative z-20 w-full bg-black shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <HeroSection onOpenQuote={() => openQuoteModal()} />
      </div>

      {/* Cinematic Scroll Reveal Animation between Hero and Features (Desktop only) */}
      <div className="hidden md:block">
        <CinematicFooter onOpenQuote={() => openQuoteModal()} />
      </div>

      {/* 2. Website Features ("Everything your business needs to succeed online.") - White */}
      <div className="relative z-20 w-full shadow-[0_-20px_50px_rgba(0,0,0,0.15)] bg-white">
        <FeaturesSection />
      </div>

      {/* 3. Pricing Plans ("Affordable website plans crafted for rapid growth.") - Black */}
      <PricingSection onOpenQuote={() => openQuoteModal()} />

      {/* 4. With vs Without Website Comparison ("Why your business cannot afford...") - White */}
      <WithWithoutSection />

      {/* 5. Latest Work / Portfolio with Live Preview Modal */}
      <PortfolioSection />

      {/* 6. How It Works ("From concept to live website in 4 simple steps.") - White */}
      <HowItWorksSection onOpenQuote={() => openQuoteModal()} />

      {/* 7. Client Testimonials & Review System ("Trusted by 500+ ambitious businesses...") - White */}
      <TestimonialsSection />

      {/* 8. Frequently Asked Questions Accordion ("Clear answers before we build...") - White */}
      <FaqSection />

      {/* 9. Contact / Lead Enquiry Form (#enquire) */}
      <EnquirySection />

      {/* 10. Meet the Founder & CEO: Lalit Thakur */}
      <FounderSection onOpenQuote={() => openQuoteModal()} />

      {/* 11. Final CTA Banner */}
      <CtaSection onOpenQuote={() => openQuoteModal()} />

      {/* 8 for mobile: Ready to build something extraordinary? - White background on mobile */}
      <div className="block md:hidden">
        <CinematicFooter onOpenQuote={() => openQuoteModal()} />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <PublicLayout>
      <HomePageContent />
    </PublicLayout>
  );
}
