"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { getSiteSettings, defaultSiteSettings } from "@/lib/site-data";
import { createBrowserClient } from "@/lib/supabase/client";
import { SiteSettings } from "@/types";

export function Footer() {
  const { success, error } = useToast();
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    getSiteSettings().then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      error("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setIsSubscribing(true);
    try {
      const supabase = createBrowserClient();
      const { error: insertError } = await supabase
        .from("subscribers")
        .insert({ email: email.trim().toLowerCase() });

      if (insertError && !insertError.message.includes("unique")) {
        console.warn("Newsletter subscribe error:", insertError);
      }

      setSubscribed(true);
      setEmail("");
      success("Subscribed!", "You're all set to receive exclusive web offers and tech tips.");
    } catch {
      setSubscribed(true);
      success("Subscribed!", "Thank you for joining our newsletter.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-30 bg-white border-t border-slate-200/60 backdrop-blur-xl pt-16 pb-16 text-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Bio (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent-grad flex items-center justify-center text-white shadow-glow">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-display text-2xl font-extrabold tracking-tight text-black">
                {settings.site_name || "WEBSPYRA"}
              </span>
            </Link>

            <p className="text-sm text-black font-medium leading-relaxed max-w-sm">
              We engineer ultra-fast, animated, and conversion-focused business & e-commerce websites designed to turn visitors into paying clients.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2 max-w-sm">
              <span className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                Subscribe for Web Insights & Exclusive Offers
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-mint-light border border-mint/40 text-xs font-semibold text-[#0F766E]">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Thank you for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="w-full h-12 pl-4 pr-12 rounded-pill text-xs sm:text-sm bg-white/90 border border-slate-200 focus:outline-none focus:border-accent shadow-sm text-black font-medium"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    aria-label="Subscribe"
                    className="absolute right-1.5 w-9 h-9 rounded-full bg-accent hover:bg-accent-hover text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-black">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-black font-medium">
              <li>
                <Link href="/services/business-websites" className="hover:text-accent transition-colors">
                  Business Websites
                </Link>
              </li>
              <li>
                <Link href="/services/ecommerce-websites" className="hover:text-accent transition-colors">
                  E-Commerce Stores
                </Link>
              </li>
              <li>
                <Link href="/services/web-applications" className="hover:text-accent transition-colors">
                  Custom Web Apps
                </Link>
              </li>
              <li>
                <Link href="/services/seo-growth-marketing" className="hover:text-accent transition-colors">
                  SEO & Digital Growth
                </Link>
              </li>
              <li>
                <Link href="/services/website-redesign" className="hover:text-accent transition-colors">
                  Website Redesign
                </Link>
              </li>
              <li>
                <Link href="/services/annual-maintenance" className="hover:text-accent transition-colors">
                  Maintenance & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-black">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-black font-medium">
              <li>
                <Link href="/pricing" className="hover:text-accent transition-colors">
                  Pricing & Services Plans
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-accent transition-colors">
                  Our Work & Case Studies
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-accent transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="hover:text-accent transition-colors">
                  Client Reviews
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-accent transition-colors">
                  Articles & Insights
                </Link>
              </li>
              <li>
                <Link href="/design-system" className="hover:text-accent transition-colors">
                  Design System Showcase
                </Link>
              </li>
              <li>
                <Link href="/get-quote" className="hover:text-accent transition-colors font-bold text-accent">
                  Get Free Instant Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-black">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <a
                  href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`}
                  className="hover:text-accent transition-colors font-semibold"
                >
                  {settings.contact_phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="hover:text-accent transition-colors font-semibold"
                  >
                    {settings.contact_email}
                  </a>
                  {settings.secondary_email && (
                    <a
                      href={`mailto:${settings.secondary_email}`}
                      className="hover:text-accent transition-colors text-xs text-slate-700 font-semibold"
                    >
                      {settings.secondary_email}
                    </a>
                  )}
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{settings.working_hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-black font-medium gap-4">
          <p>© {currentYear} {settings.site_name || "Webspyra"}. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-accent transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/refund-policy" className="hover:text-accent transition-colors">
              Refund Policy
            </Link>
            <Link href="/sitemap" className="hover:text-accent transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
