"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { PublicLayout } from "@/components/site";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { OrbsBackground } from "@/components/ui/orbs-background";

export default function ContactPage() {
  const { success, error } = useToast();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("business");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || phone.trim().length < 10) {
      error("Missing fields", "Please enter your name and valid phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          service_interested: service,
          message: message.trim() || undefined,
          source: "/contact-page",
          honeypot: honeypot || undefined,
        }),
      });

      setIsSubmitted(true);
      success("Message Received!", "Our senior team will call you back within 30 minutes.");
    } catch {
      setIsSubmitted(true);
      success("Message Received!", "Thank you for reaching out to Webspyra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="relative min-h-screen py-16 md:py-24 px-5 sm:px-8 max-w-7xl mx-auto space-y-16">
        <OrbsBackground variant="hero" />

        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge variant="blue" pulseDot>
            Direct Communication
          </Badge>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-textPrimary tracking-tight">
            Let&apos;s discuss your project.
          </h1>
          <p className="text-sm sm:text-base text-textSecondary">
            Have questions about our technology stack, timeline, or custom features? Reach out directly to our engineering team.
          </p>
        </div>

        {/* 2-Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7">
            <GlassCard glowColor="blue" className="p-7 sm:p-10">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-mint-light flex items-center justify-center text-success mx-auto shadow-glow-mint">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-2xl font-bold text-textPrimary">
                      Thank You, {fullName}!
                    </h3>
                    <p className="text-sm text-textSecondary max-w-sm mx-auto">
                      Your inquiry has been assigned to our senior solutions architect. We will call you on{" "}
                      <strong className="text-textPrimary">{phone}</strong> shortly.
                    </p>
                  </div>

                  <div className="pt-3 flex flex-wrap justify-center gap-3">
                    <a
                      href={`https://wa.me/918958889538?text=${encodeURIComponent(
                        `Hi Webspyra, I just sent an enquiry through your contact page. Can we chat?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="primary"
                        size="md"
                        leftIcon={<MessageCircle className="w-4 h-4" />}
                        className="shadow-glow"
                      >
                        Continue on WhatsApp
                      </Button>
                    </a>
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFullName("");
                        setMessage("");
                      }}
                    >
                      Send Another Message
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="font-display font-bold text-xl text-textPrimary">
                      Send a Message
                    </h3>
                    <p className="text-xs text-textSecondary mt-0.5">
                      Fill out the details below for a free technical consultation.
                    </p>
                  </div>

                  {/* Honeypot */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="hp"
                      tabIndex={-1}
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name *"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <Input
                      label="Phone Number *"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email (Optional)"
                      type="email"
                      placeholder="rahul@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Select
                      label="Interested Service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      options={[
                        { value: "business", label: "Business Website (₹8,999+)" },
                        { value: "ecommerce", label: "E-Commerce Store (₹18,999+)" },
                        { value: "webapp", label: "Custom Web Application" },
                        { value: "redesign", label: "Website Redesign & Speed Up" },
                        { value: "seo", label: "SEO & Growth Marketing" },
                        { value: "other", label: "Other / Consultation" },
                      ]}
                    />
                  </div>

                  <Textarea
                    label="Project Description"
                    rows={4}
                    placeholder="Tell us about your brand, what pages you need, and any reference sites you like..."
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
                      Send Message & Request Callback
                    </Button>
                  </div>
                </form>
              )}
            </GlassCard>
          </div>

          {/* Right Direct Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard glowColor="mint" className="p-7 sm:p-8 space-y-6">
              <div className="space-y-1">
                <Badge variant="mint">Direct Office Connect</Badge>
                <h3 className="font-display font-bold text-xl text-textPrimary">
                  Webspyra Headquarters
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <a
                  href="tel:+918958889538"
                  className="p-3.5 rounded-2xl bg-white/70 hover:bg-white border border-white flex items-center gap-3.5 transition-all shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider block">
                      Phone Call
                    </span>
                    <span className="font-bold text-textPrimary">+91 89588 89538</span>
                  </div>
                </a>

                <a
                  href="https://wa.me/918958889538"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-[#EDFAF8] hover:bg-white border border-[#A9E3DD]/50 flex items-center gap-3.5 transition-all shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-success/15 text-success flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider block">
                      WhatsApp Quick Line
                    </span>
                    <span className="font-bold text-textPrimary">+91 89588 89538</span>
                  </div>
                </a>

                <div className="p-3.5 rounded-2xl bg-white/70 border border-white flex items-center gap-3.5 transition-all shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider block">
                      Email Inquiries
                    </span>
                    <a href="mailto:lalit@webspyro.com" className="font-bold text-textPrimary hover:text-accent">
                      lalit@webspyro.com
                    </a>
                    <a href="mailto:lalitx15@gmail.com" className="text-xs font-semibold text-slate-700 hover:text-accent">
                      lalitx15@gmail.com
                    </a>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/50 border border-white/80 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose/10 text-rose flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider block">
                      Office Address
                    </span>
                    <span className="text-textPrimary leading-relaxed font-bold">
                      Noida Sector 62, Noida, India
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/50 border border-white/80 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-warning flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider block">
                      Working Hours
                    </span>
                    <span className="font-bold text-textPrimary">
                      24/7 (Open Round the Clock)
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
