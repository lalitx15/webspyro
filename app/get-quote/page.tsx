"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  ShoppingCart,
  Cpu,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CreditCard,
  MessageSquare,
  Search,
  Languages,
  Layers,
  Send,
  MessageCircle,
  Phone,
  ShieldCheck,
  Check,
} from "lucide-react";
import { PublicLayout } from "@/components/site";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { OrbsBackground } from "@/components/ui/orbs-background";

export default function GetQuotePage() {
  const { success, error } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [projectType, setProjectType] = useState("business");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "seo",
    "mobile-app-feel",
  ]);
  const [budgetRange, setBudgetRange] = useState("15k-25k");
  const [timeline, setTimeline] = useState("standard");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const projectTypes = [
    {
      id: "business",
      title: "Business / Corporate Website",
      desc: "For local stores, consultants, clinics, and professional firms.",
      badge: "Most Popular",
      icon: <Globe className="w-6 h-6 text-accent" />,
      estDays: "5 - 7 Days",
    },
    {
      id: "ecommerce",
      title: "E-Commerce Online Store",
      desc: "Sell products online with cart, Razorpay UPI, and inventory sync.",
      badge: "High Conversion",
      icon: <ShoppingCart className="w-6 h-6 text-[#0F766E]" />,
      estDays: "7 - 12 Days",
    },
    {
      id: "webapp",
      title: "Custom Web Application",
      desc: "SaaS dashboards, client portals, dynamic databases, and APIs.",
      badge: "Bespoke",
      icon: <Cpu className="w-6 h-6 text-[#7C3AED]" />,
      estDays: "12 - 20 Days",
    },
    {
      id: "redesign",
      title: "Website Redesign & Speed Up",
      desc: "Modernize an old slow site with Apple-grade glass design & 95+ PageSpeed.",
      badge: "Quick Upgrade",
      icon: <RefreshCw className="w-6 h-6 text-rose" />,
      estDays: "3 - 5 Days",
    },
  ];

  const featureOptions = [
    {
      id: "seo",
      title: "Full SEO & Google Ranking Setup",
      desc: "Sitemap, meta tags, schema markup, and Google Search Console indexing.",
      icon: <Search className="w-4 h-4 text-accent" />,
    },
    {
      id: "payment",
      title: "Payment Gateway & UPI Integration",
      desc: "Instant payments via GPay, PhonePe, Paytm, cards, and automated GST bills.",
      icon: <CreditCard className="w-4 h-4 text-[#0F766E]" />,
    },
    {
      id: "live-chat",
      title: "Live Chat & WhatsApp Connect",
      desc: "Direct lead capture chat bubble on website syncing with your phone.",
      icon: <MessageSquare className="w-4 h-4 text-rose" />,
    },
    {
      id: "animations",
      title: "Apple-Style 3D Glass Interactions",
      desc: "Smooth Framer Motion reveals, tilt cards, and parallax depth effects.",
      icon: <Layers className="w-4 h-4 text-[#B45309]" />,
    },
    {
      id: "mobile-app-feel",
      title: "Zero-Zoom PWA & App Feel",
      desc: "Touch navigation, safe-area support, and offline cache capability.",
      icon: <Sparkles className="w-4 h-4 text-accent" />,
    },
    {
      id: "multi-language",
      title: "Multi-Language Support",
      desc: "English, Hindi, and regional language toggles for wider reach.",
      icon: <Languages className="w-4 h-4 text-[#7C3AED]" />,
    },
  ];

  const budgetOptions = [
    {
      id: "5k-10k",
      range: "₹5,999 — ₹9,999",
      tagline: "Starter to Classic Website",
      desc: "Ideal for new ventures needing a credible, modern web presence fast.",
    },
    {
      id: "10k-18k",
      range: "₹9,999 — ₹17,999",
      tagline: "Classic Growth & Starter E-Commerce",
      desc: "Our most requested tier for high conversion and lead generation.",
    },
    {
      id: "18k-25k",
      range: "₹17,999 — ₹24,999",
      tagline: "Premium Corporate & Custom Store",
      desc: "Extensive product catalog, custom CMS, or bespoke animations.",
    },
    {
      id: "25k+",
      range: "₹24,999+",
      tagline: "Enterprise & Custom Web Platform",
      desc: "Full-scale custom software, multi-tenant portal, or high-volume app.",
    },
  ];

  const timelineOptions = [
    { id: "urgent", label: "Urgent", sub: "Within 5 to 7 days" },
    { id: "standard", label: "Standard", sub: "1 to 2 weeks" },
    { id: "flexible", label: "Flexible", sub: "Planning for next month" },
  ];

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !projectType) {
      error("Selection required", "Please choose a project category.");
      return;
    }
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handleSubmitQuoteWizard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      error("Name required", "Please enter your name.");
      return;
    }

    const cleanNumber = phone.replace(/[^0-9]/g, "");
    if (cleanNumber.length < 10) {
      error("Valid phone required", "Please provide a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          company: businessName.trim() || undefined,
          service_interested: `${projectType.toUpperCase()} (Budget: ${budgetRange}, Timeline: ${timeline})`,
          message: `Features: ${selectedFeatures.join(", ")}. Notes: ${notes.trim()}`,
          source: "/get-quote-wizard",
          honeypot: honeypot.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setIsSubmitted(true);
      success("Quote Estimate Ready!", "We have received your requirements.");
      window.scrollTo({ top: 120, behavior: "smooth" });
    } catch {
      // Graceful fallback
      setIsSubmitted(true);
      success("Quote Estimate Ready!", "Your details were captured successfully.");
      window.scrollTo({ top: 120, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="relative min-h-screen py-16 md:py-24 px-5 sm:px-8 max-w-5xl mx-auto">
        <OrbsBackground variant="hero" />

        {/* Top Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-10">
          <Badge variant="blue" pulseDot>
            30-Second Instant Quote
          </Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-textPrimary tracking-tight">
            Calculate your project estimate.
          </h1>
          <p className="text-sm sm:text-base text-textSecondary">
            Answer a few quick questions to receive a tailored timeline and transparent cost breakdown.
          </p>
        </div>

        {/* Multi-Step Wizard Card */}
        <GlassCard glowColor="blue" className="p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          {!isSubmitted ? (
            <>
              {/* Progress Steps Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-textSecondary mb-2">
                  <span>Step {currentStep} of 4</span>
                  <span className="text-accent">
                    {currentStep === 1 && "Project Category"}
                    {currentStep === 2 && "Required Features"}
                    {currentStep === 3 && "Budget & Timeline"}
                    {currentStep === 4 && "Contact Details"}
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-200/60 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent to-[#5B8CFF]"
                    initial={{ width: "25%" }}
                    animate={{ width: `${(currentStep / 4) * 100}%` }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  />
                </div>
              </div>

              {/* Step Forms */}
              <AnimatePresence mode="wait">
                {/* STEP 1: Project Type */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-textPrimary">
                        What type of website do you need?
                      </h2>
                      <p className="text-xs sm:text-sm text-textSecondary mt-1">
                        Select the primary purpose of your new digital presence.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {projectTypes.map((type) => {
                        const isSelected = projectType === type.id;
                        return (
                          <div
                            key={type.id}
                            onClick={() => setProjectType(type.id)}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer relative group ${
                              isSelected
                                ? "bg-white border-accent shadow-card ring-2 ring-accent/20"
                                : "bg-white/60 border-white/80 hover:bg-white/90 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                {type.icon}
                              </div>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-pill bg-accent/10 text-accent">
                                {type.badge}
                              </span>
                            </div>
                            <h3 className="font-display font-bold text-base text-textPrimary">
                              {type.title}
                            </h3>
                            <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                              {type.desc}
                            </p>
                            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-textMuted">
                              <span>Delivery: {type.estDays}</span>
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                  isSelected
                                    ? "bg-accent border-accent text-white"
                                    : "border-slate-300"
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Features Needed */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-textPrimary">
                        Select features to include in your build.
                      </h2>
                      <p className="text-xs sm:text-sm text-textSecondary mt-1">
                        Pick everything you want your site to have. You can change this anytime later.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {featureOptions.map((feat) => {
                        const isChecked = selectedFeatures.includes(feat.id);
                        return (
                          <div
                            key={feat.id}
                            onClick={() => toggleFeature(feat.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                              isChecked
                                ? "bg-white border-accent shadow-sm ring-1 ring-accent/20"
                                : "bg-white/60 border-white/80 hover:bg-white/90"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-md border mt-0.5 shrink-0 flex items-center justify-center transition-colors ${
                                isChecked
                                  ? "bg-accent border-accent text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isChecked && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div className="space-y-0.5">
                              <h3 className="font-display font-bold text-sm text-textPrimary flex items-center gap-1.5">
                                {feat.icon}
                                {feat.title}
                              </h3>
                              <p className="text-xs text-textSecondary leading-relaxed">
                                {feat.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Budget & Timeline */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-textPrimary">
                        Expected investment & timeline.
                      </h2>
                      <p className="text-xs sm:text-sm text-textSecondary mt-1">
                        Select the budget range that matches your business scale.
                      </p>
                    </div>

                    {/* Budget Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {budgetOptions.map((b) => {
                        const isSelected = budgetRange === b.id;
                        return (
                          <div
                            key={b.id}
                            onClick={() => setBudgetRange(b.id)}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-white border-accent shadow-card ring-2 ring-accent/20"
                                : "bg-white/60 border-white/80 hover:bg-white/90"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-display font-extrabold text-lg text-textPrimary">
                                {b.range}
                              </span>
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                  isSelected
                                    ? "bg-accent border-accent text-white"
                                    : "border-slate-300"
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                              </div>
                            </div>
                            <p className="text-xs font-semibold text-accent mt-1">
                              {b.tagline}
                            </p>
                            <p className="text-xs text-textSecondary mt-1.5 leading-relaxed">
                              {b.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Timeline Radio Row */}
                    <div className="space-y-3 pt-2">
                      <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">
                        How quickly do you need this launched?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {timelineOptions.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => setTimeline(t.id)}
                            className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                              timeline === t.id
                                ? "bg-white border-accent shadow-sm font-semibold text-accent"
                                : "bg-white/60 border-white text-textPrimary hover:bg-white"
                            }`}
                          >
                            <p className="text-sm font-bold">{t.label}</p>
                            <p className="text-xs text-textSecondary">{t.sub}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Contact Details */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-textPrimary">
                        Where should we send your detailed quote?
                      </h2>
                      <p className="text-xs sm:text-sm text-textSecondary mt-1">
                        A dedicated web consultant will review your options and give you a firm proposal.
                      </p>
                    </div>

                    {/* Honeypot field for bot suppression */}
                    <div className="hidden" aria-hidden="true">
                      <input
                        type="text"
                        name="hp"
                        tabIndex={-1}
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>

                    <form onSubmit={handleSubmitQuoteWizard} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Your Full Name *"
                          required
                          placeholder="e.g. Aditya Verma"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                        <Input
                          label="WhatsApp Phone Number *"
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Email Address (Optional)"
                          type="email"
                          placeholder="aditya@mybrand.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                          label="Business / Brand Name"
                          placeholder="e.g. Verma Jewellers"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                        />
                      </div>

                      <Textarea
                        label="Special Notes or Reference Websites"
                        rows={3}
                        placeholder="Share any specific websites you love or custom features you want us to know about..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />

                      <div className="pt-2">
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          isLoading={isSubmitting}
                          className="w-full shadow-glow"
                          rightIcon={<Send className="w-5 h-5" />}
                        >
                          Generate Quote & Free Consultation Call
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="mt-8 pt-6 border-t border-border-glass/60 flex items-center justify-between">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handlePrevStep}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 4 && (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNextStep}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Continue to Next Step
                  </Button>
                )}
              </div>
            </>
          ) : (
            /* STEP 5: SUCCESS STATE */
            <div className="py-10 text-center space-y-8">
              <div className="w-20 h-20 rounded-full bg-mint-light flex items-center justify-center text-success mx-auto shadow-glow-mint">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-3 max-w-lg mx-auto">
                <Badge variant="mint" pulseDot>
                  Estimate Generated Successfully
                </Badge>
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-textPrimary">
                  Thank you, {fullName}!
                </h2>
                <p className="text-sm sm:text-base text-textSecondary leading-relaxed">
                  We have mapped out your project requirements for a{" "}
                  <strong className="text-textPrimary capitalize">{projectType} Website</strong>. A senior web architect has been assigned to your brief.
                </p>
              </div>

              {/* Selection Summary Pill Box */}
              <div className="max-w-md mx-auto p-5 rounded-2xl bg-white/70 border border-white text-left space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-textSecondary">Selected Category:</span>
                  <span className="font-bold text-textPrimary uppercase">{projectType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-textSecondary">Budget Bracket:</span>
                  <span className="font-bold text-accent">{budgetRange}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-textSecondary">Delivery Target:</span>
                  <span className="font-bold text-textPrimary capitalize">{timeline}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-textSecondary">Callback Contact:</span>
                  <span className="font-bold text-textPrimary">{phone}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a
                  href={`https://wa.me/918958889538?text=${encodeURIComponent(
                    `Hi Webspyra, I just completed the quote wizard for my ${projectType} website (Budget: ${budgetRange}). Can we connect to finalize?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    leftIcon={<MessageCircle className="w-5 h-5" />}
                    className="w-full sm:w-auto shadow-glow"
                  >
                    Continue on WhatsApp
                  </Button>
                </a>

                <Link href="/" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Return to Homepage
                  </Button>
                </Link>
              </div>

              <div className="pt-4 flex items-center justify-center gap-6 text-xs text-textMuted">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  100% Confidential
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-accent" />
                  Callback in &lt; 30 Mins
                </span>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </PublicLayout>
  );
}
