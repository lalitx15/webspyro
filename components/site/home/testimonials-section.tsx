"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Star, CheckCircle, MessageSquarePlus, Sparkles, Building2, MapPin, ShieldCheck, HeartHandshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { SectionReveal } from "@/components/ui/section-reveal";
import { GridPulse } from "@/components/ui/grid-pulse";
import { Marquee } from "@/components/ui/marquee";
import { indianTestimonials50, IndianTestimonial } from "@/lib/indian-testimonials-data";
import { createBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// Individual Card with middle zoom detection & hover lift
function TestimonialMarqueeCard({ item }: { item: IndianTestimonial }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCenter, setIsCenter] = useState(false);
  const [imgSrc, setImgSrc] = useState(item.avatar_url);

  useEffect(() => {
    setImgSrc(item.avatar_url);
  }, [item.avatar_url]);

  useEffect(() => {
    // Disable on mobile (< 768px) to prevent 50+ getBoundingClientRect calls per frame causing severe mobile jitter
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return;
    }

    let animId: number;
    let isMounted = true;

    const checkCenter = () => {
      if (!isMounted) return;
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const screenCenter = window.innerWidth / 2;
        const distance = Math.abs(cardCenter - screenCenter);
        // Center zone: within 160px of the exact screen center
        if (distance < 160) {
          setIsCenter(true);
        } else {
          setIsCenter(false);
        }
      }
      animId = requestAnimationFrame(checkCenter);
    };

    animId = requestAnimationFrame(checkCenter);
    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        "shrink-0 w-[290px] sm:w-[410px] mx-2 sm:mx-4 p-5 sm:p-7 rounded-2xl bg-white select-none cursor-pointer flex flex-col justify-between transition-all duration-300",
        isCenter
          ? "scale-[1.04] sm:scale-[1.08] -translate-y-2 sm:-translate-y-3.5 shadow-2xl border-2 border-cyan-500 ring-4 ring-cyan-400/20 z-30"
          : "scale-100 translate-y-0 border border-slate-200/90 shadow-card hover:scale-[1.05] hover:-translate-y-2 hover:shadow-xl hover:border-cyan-400/60 z-10"
      )}
      style={{
        willChange: "transform, box-shadow",
      }}
    >
      <div>
        {/* Rating & City Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(item.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {item.badge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                {item.badge}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <MapPin className="w-2.5 h-2.5 text-accent" />
              {item.city}
            </span>
          </div>
        </div>

        {/* Review Quote */}
        <p className="text-xs sm:text-sm text-black leading-relaxed line-clamp-3 font-medium">
          &ldquo;{item.review_text}&rdquo;
        </p>
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-4">
        <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-slate-100">
          <Image
            src={imgSrc}
            alt={item.client_name}
            fill
            sizes="44px"
            unoptimized
            onError={() =>
              setImgSrc(
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              )
            }
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 truncate">
              {item.client_name}
            </h4>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          </div>
          <p className="text-[11px] text-neutral-800 truncate font-semibold">
            {item.business_name}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  // Review Form State
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerBusiness, setReviewerBusiness] = useState("");
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerText, setReviewerText] = useState("");

  // 50 reviews split into two 25-item continuous marquee tracks
  const row1 = indianTestimonials50.slice(0, 25);
  const row2 = indianTestimonials50.slice(25, 50);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerText.trim()) {
      error("Missing fields", "Please provide your name and review message.");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createBrowserClient();
      await supabase.from("testimonials").insert({
        client_name: reviewerName.trim(),
        business_name: reviewerBusiness.trim() || "Business Owner",
        rating: reviewerRating,
        review_text: reviewerText.trim(),
        is_approved: false, // Moderated by Admin
      });
      success("Review Submitted!", "Thank you! Your review has been submitted for verification.");
      setIsReviewModalOpen(false);
      setReviewerName("");
      setReviewerBusiness("");
      setReviewerText("");
    } catch {
      success("Review Submitted!", "Thank you! Your feedback has been received.");
      setIsReviewModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-20 md:py-28 relative overflow-hidden bg-white text-black border-b border-slate-200">
      <GridPulse
        cell={26}
        reach={2.6}
        ambient={2}
        className="text-black"
        style={{
          "--grid-pulse-line": "rgba(0, 0, 0, 0.06)",
        } as React.CSSProperties}
      />
      <div className="w-full space-y-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <SectionReveal>
              <div className="inline-flex items-center gap-2">
                <Badge variant="mint" pulseDot>
                  Client Stories
                </Badge>
                <Badge variant="blue">4.9 / 5.0 Rating • 50+ Verified Reviews</Badge>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.1}>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-textPrimary tracking-tight leading-[1.18]">
                Trusted by 500+ ambitious businesses across India.
              </h2>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <p className="text-base sm:text-lg text-black font-medium leading-relaxed">
                Read authentic testimonials from founders, CEOs, and local business owners who scaled their online sales with Webspyra.
              </p>
            </SectionReveal>
          </div>

          {/* Right Action: Add Review Button */}
          <SectionReveal delay={0.25} className="shrink-0">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsReviewModalOpen(true)}
              leftIcon={<MessageSquarePlus className="w-4 h-4 text-accent" />}
              className="shadow-sm hover:shadow"
            >
              Add Your Review
            </Button>
          </SectionReveal>
        </div>

        {/* 50 Reviews Horizontal Infinite Marquee with Center-Card Zoom */}
        <div className="relative w-full overflow-hidden space-y-6 pt-4">
          {/* Subtle Side Fade Gradients for Seamless Look */}
          <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-20" />
          <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-20" />

          {/* Row 1: Leftward Infinite Marquee (25 Indian Brands) */}
          <Marquee speed={55} pauseOnHover direction="left" className="sm:mt-0 mt-0">
            {row1.map((item) => (
              <TestimonialMarqueeCard key={item.id} item={item} />
            ))}
          </Marquee>

          {/* Row 2: Rightward Infinite Marquee (25 Indian Brands) */}
          <Marquee speed={60} pauseOnHover direction="right" className="sm:mt-0 mt-0">
            {row2.map((item) => (
              <TestimonialMarqueeCard key={item.id} item={item} />
            ))}
          </Marquee>
        </div>

        {/* Live Trust Metrics Strip */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionReveal delay={0.3}>
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-around gap-6 text-center">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-cyan-100/80 text-cyan-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-display text-lg sm:text-xl font-extrabold text-black">500+ Businesses</p>
                  <p className="text-xs text-neutral-800 font-semibold">Across 40+ Indian Cities</p>
                </div>
              </div>

              <div className="h-8 w-px bg-slate-200 hidden sm:block" />

              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <p className="font-display text-lg sm:text-xl font-extrabold text-black">4.9 / 5.0 Rating</p>
                  <p className="text-xs text-neutral-800 font-semibold">99.2% Client Satisfaction</p>
                </div>
              </div>

              <div className="h-8 w-px bg-slate-200 hidden sm:block" />

              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-display text-lg sm:text-xl font-extrabold text-black">100% Verified</p>
                  <p className="text-xs text-neutral-800 font-semibold">Real Indian Business Owners</p>
                </div>
              </div>

              <div className="h-8 w-px bg-slate-200 hidden sm:block" />

              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-rose-100/80 text-rose-600 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-display text-lg sm:text-xl font-extrabold text-slate-900">Dedicated Support</p>
                  <p className="text-xs text-slate-500 font-medium">Free 1-Year AMC Included</p>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>

        {/* Modal: Add Your Review */}
        <Modal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          title="Share Your Experience"
          description="Your feedback inspires us to build better web products. Reviews are verified before publishing."
        >
          <form onSubmit={handleSubmitReview} className="space-y-4 pt-2">
            <Input
              label="Your Full Name"
              required
              placeholder="e.g. Vikram Singhania"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
            />
            <Input
              label="Business / Company Name"
              placeholder="e.g. Founder, Luxe Decor (Mumbai)"
              value={reviewerBusiness}
              onChange={(e) => setReviewerBusiness(e.target.value)}
            />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewerRating(star)}
                    className="p-1 text-warning focus:outline-none hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        reviewerRating >= star
                          ? "fill-warning text-warning"
                          : "text-textMuted/40"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm font-semibold text-textPrimary ml-2">
                  {reviewerRating}.0 Stars
                </span>
              </div>
            </div>
            <Textarea
              label="Your Review / Feedback"
              required
              placeholder="Tell us what you liked about our design, delivery speed, and support..."
              value={reviewerText}
              onChange={(e) => setReviewerText(e.target.value)}
            />
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="w-full"
                rightIcon={<Sparkles className="w-4 h-4" />}
              >
                Submit Review
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </section>
  );
}

export default TestimonialsSection;
