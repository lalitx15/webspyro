"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { SectionReveal } from "@/components/ui/section-reveal";
import { GridPulse } from "@/components/ui/grid-pulse";
import { createBrowserClient } from "@/lib/supabase/client";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { getSiteSettings, defaultSiteSettings } from "@/lib/site-data";
import { SiteSettings } from "@/types";

export function EnquirySection() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const { success, error, info } = useToast();

  // Form State
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+91 ");
  const [emailAddress, setEmailAddress] = useState("");
  const [businessType, setBusinessType] = useState("retail");
  const [servicePlan, setServicePlan] = useState("classic");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // hidden spam trap
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  const businessTypeOptions = [
    { value: "retail", label: "Retail / Local Store / Showroom" },
    { value: "services", label: "Professional Services / Consulting / Agency" },
    { value: "healthcare", label: "Healthcare / Clinic / Doctors" },
    { value: "real-estate", label: "Real Estate / Architecture / Interiors" },
    { value: "ecommerce", label: "E-Commerce / D2C Brand / Products" },
    { value: "restaurant", label: "Restaurant / Cafe / Food & Hospitality" },
    { value: "education", label: "Education / Academy / Coaching Institute" },
    { value: "startup", label: "Tech Startup / SaaS / Digital Enterprise" },
    { value: "other", label: "Other / Not Listed" },
  ];

  const servicePlanOptions = [
    { value: "classic", label: "Classic Growth Website — ₹14,999 (Most Popular)" },
    { value: "starter", label: "Starter Business Website — ₹8,999" },
    { value: "premium", label: "Premium Corporate Web App — ₹24,999" },
    { value: "ecom-starter", label: "E-Commerce Online Store — ₹18,999" },
    { value: "redesign", label: "Website Redesign & Speed Optimization" },
    { value: "custom", label: "Custom Software / Web Application" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Honeypot check (Bots fill invisible fields)
    if (honeypot) {
      setIsSuccess(true);
      return;
    }

    // 2. Client validation
    if (!fullName.trim()) {
      error("Name required", "Please enter your name.");
      return;
    }
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      error("Valid phone required", "Please enter a valid 10-digit mobile number.");
      return;
    }

    // 3. Rate limiting check (1 submission per 20 seconds)
    const lastSub = localStorage.getItem("wsp_last_enquiry_ts");
    const now = Date.now();
    if (lastSub && now - Number(lastSub) < 20000) {
      info("Please wait", "You recently submitted an enquiry. Our team is already on it!");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createBrowserClient();
      await supabase.from("leads").insert({
        name: fullName.trim(),
        phone: phoneNumber.trim(),
        email: emailAddress.trim() || null,
        company: businessType,
        service_interested: servicePlan,
        message: message.trim() || null,
        source: "homepage_enquiry_section",
        status: "new",
      });

      localStorage.setItem("wsp_last_enquiry_ts", String(now));
      setIsSuccess(true);
      success("Enquiry Received!", "Our senior web consultant will call you within 30 minutes.");
    } catch {
      // Fallback graceful success
      localStorage.setItem("wsp_last_enquiry_ts", String(now));
      setIsSuccess(true);
      success("Enquiry Received!", "Thank you! We have received your request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanWhatsApp = settings.whatsapp_number.replace(/[^0-9]/g, "");
  const cleanPhone = settings.contact_phone.replace(/[^0-9+]/g, "");

  return (
    <section id="enquire" className="py-14 sm:py-18 md:py-20 relative overflow-hidden bg-white text-black border-b border-slate-200">
      <GridPulse
        cell={26}
        reach={2.6}
        ambient={2}
        className="text-black"
        style={{
          "--grid-pulse-line": "rgba(0, 0, 0, 0.06)",
        } as React.CSSProperties}
      />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-10 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <SectionReveal>
            <div className="inline-flex items-center gap-2">
              <Badge variant="blue" pulseDot>
                Instant Callback
              </Badge>
              <Badge variant="mint">Get Started Today</Badge>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-black tracking-tight leading-[1.18]">
              Ready to build something extraordinary?
            </h2>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <p className="text-base sm:text-lg text-black font-medium leading-relaxed">
              Tell us about your brand goals. We will analyze your competition, prepare a bespoke roadmap, and give you an exact timeline.
            </p>
          </SectionReveal>
        </div>

        {/* 2-Column Grid: Form + Contact Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7">
            <ShineBorder
              borderWidth={2}
              duration={4}
              gradient="from-blue-500 via-red-500 to-teal-400"
              borderRadius="1.75rem"
              className="w-full shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="p-5 sm:p-10 rounded-[calc(1.75rem-2px)] bg-white text-black">
              {isSuccess ? (
                <div className="py-12 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-mint-light flex items-center justify-center text-success mx-auto shadow-glow-mint">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-extrabold text-black">
                      Thank You, {fullName || "Partner"}!
                    </h3>
                    <p className="text-sm sm:text-base text-neutral-900 font-medium max-w-md mx-auto">
                      Your enquiry has been assigned to our senior solutions architect. We will call you on{" "}
                      <span className="font-bold text-black">{phoneNumber}</span> shortly.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                        `Hi Webspyra, I just submitted an enquiry for ${servicePlan} for my business. Can we discuss immediately?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <Button
                        variant="primary"
                        size="md"
                        leftIcon={<WhatsAppIcon className="w-4 h-4" fill="#25D366" />}
                        className="w-full sm:w-auto font-bold flex items-center gap-2"
                      >
                        WhatsApp
                      </Button>
                    </a>
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => {
                        setIsSuccess(false);
                        setFullName("");
                        setEmailAddress("");
                        setMessage("");
                      }}
                      className="w-full sm:w-auto"
                    >
                      Submit Another Query
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="font-display text-xl font-extrabold text-black">
                      Send Us an Enquiry
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-900 font-medium">
                      Fill out the form below and we&apos;ll get back to you within 30 minutes.
                    </p>
                  </div>

                  {/* Honeypot field (hidden from view) */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="website_url"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name *"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <Input
                      label="Phone / WhatsApp *"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email Address (Optional)"
                      type="email"
                      placeholder="ramesh@mybusiness.com"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                    />
                    <Select
                      label="Business Industry / Type"
                      options={businessTypeOptions}
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                    />
                  </div>

                  <Select
                    label="Interested Plan / Service"
                    options={servicePlanOptions}
                    value={servicePlan}
                    onChange={(e) => setServicePlan(e.target.value)}
                  />

                  <Textarea
                    label="Project Details & Requirements (Optional)"
                    rows={3}
                    placeholder="Tell us what you want your website to do, reference websites you like, or special features needed..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isSubmitting}
                      className="w-full shadow-glow"
                      rightIcon={<Send className="w-4 h-4" />}
                    >
                      Send Enquiry & Get Free Callback
                    </Button>
                  </div>

                  <p className="text-center text-xs text-textMuted">
                    🔒 We respect your privacy. No spam, ever. Your phone number is strictly used for callback.
                  </p>
                </form>
              )}
            </div>
            </ShineBorder>
          </div>

          {/* Contact Details & Direct Connect Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <ShineBorder
              borderWidth={2}
              duration={4}
              gradient="from-teal-400 via-purple-500 to-blue-500"
              borderRadius="1.75rem"
              className="w-full shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="p-5 sm:p-8 space-y-6 rounded-[calc(1.75rem-2px)] bg-white text-black">
              <div className="space-y-1">
                <Badge variant="mint">
                  Direct Line
                </Badge>
                <h3 className="font-display font-extrabold text-2xl text-black">
                  Speak Directly With Us
                </h3>
                <p className="text-xs sm:text-sm text-neutral-900 font-medium">
                  Prefer a direct conversation? Call or message our team anytime.
                </p>
              </div>

              <div className="space-y-4">
                {/* Phone Call Link */}
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all group shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5 text-accent stroke-[2.5]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Call Us Now
                    </p>
                    <p
                      className="text-sm sm:text-base font-extrabold !text-black text-neutral-950 group-hover:text-accent transition-colors"
                      style={{ color: "#000000", opacity: 1 }}
                    >
                      {settings.contact_phone}
                    </p>
                  </div>
                </a>

                {/* WhatsApp Chat Link */}
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                    settings.whatsapp_default_message || "Hi Webspyra, I am looking for a new website."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#EDFAF8] hover:bg-[#dcf4f1] border border-[#A9E3DD]/60 transition-all group shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <WhatsAppIcon className="w-6 h-6" fill="#25D366" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      WhatsApp
                    </p>
                    <p
                      className="text-sm sm:text-base font-extrabold !text-black text-neutral-950 group-hover:text-success transition-colors"
                      style={{ color: "#000000", opacity: 1 }}
                    >
                      {settings.whatsapp_number}
                    </p>
                  </div>
                </a>

                {/* Email Address Link */}
                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-purple-50/60 hover:bg-purple-50 border border-purple-100 transition-all group shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5 text-[#7C3AED] stroke-[2.5]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Email Inquiries
                    </p>
                    <a
                      href={`mailto:${settings.contact_email}`}
                      className="block text-sm sm:text-base font-extrabold !text-black text-neutral-950 hover:text-accent transition-colors break-all"
                      style={{ color: "#000000", opacity: 1 }}
                    >
                      {settings.contact_email}
                    </a>
                    {settings.secondary_email && (
                      <a
                        href={`mailto:${settings.secondary_email}`}
                        className="block text-xs font-bold text-slate-700 hover:text-accent transition-colors break-all"
                      >
                        {settings.secondary_email}
                      </a>
                    )}
                  </div>
                </div>

                {/* Physical Location */}
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100">
                  <div className="w-10 h-10 rounded-xl bg-rose/20 text-rose flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-rose stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Office Address
                    </p>
                    <p
                      className="text-xs sm:text-sm !text-black text-neutral-950 font-bold leading-relaxed"
                      style={{ color: "#000000", opacity: 1 }}
                    >
                      {settings.address}
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <div className="w-10 h-10 rounded-xl bg-warning/20 text-warning flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-warning stroke-[2.5]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Working Hours
                    </p>
                    <p
                      className="text-xs sm:text-sm !text-black text-neutral-950 font-bold"
                      style={{ color: "#000000", opacity: 1 }}
                    >
                      {settings.working_hours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Connect Icons */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <p className="text-xs font-bold text-black uppercase tracking-wider">
                  Connect on Social Media
                </p>
                <div className="flex items-center gap-2.5">
                  <a
                    href={settings.social_links?.instagram || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-10 h-10 rounded-xl bg-white/80 border border-white flex items-center justify-center text-textSecondary hover:text-rose hover:bg-white shadow-sm transition-all"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href={settings.social_links?.linkedin || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-10 h-10 rounded-xl bg-white/80 border border-white flex items-center justify-center text-textSecondary hover:text-accent hover:bg-white shadow-sm transition-all"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a
                    href={settings.social_links?.facebook || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-10 h-10 rounded-xl bg-white/80 border border-white flex items-center justify-center text-textSecondary hover:text-blue-600 hover:bg-white shadow-sm transition-all"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                    </svg>
                  </a>
                  <a
                    href={settings.social_links?.x || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X / Twitter"
                    className="w-10 h-10 rounded-xl bg-white/80 border border-white flex items-center justify-center text-textSecondary hover:text-textPrimary hover:bg-white shadow-sm transition-all"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            </ShineBorder>
          </div>
        </div>
      </div>
    </section>
  );
}
