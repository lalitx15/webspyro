"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";

export interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
  tagline?: string;
}

export interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
  currencySymbol?: string;
  showToggle?: boolean;
}

export function Pricing({
  plans,
  title = "Simple, Transparent Pricing",
  description = "Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support.",
  currencySymbol = "₹",
  showToggle = true,
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: {
            x: x / window.innerWidth,
            y: y / window.innerHeight,
          },
          colors: [
            "#06b6d4",
            "#3b82f6",
            "#6366f1",
            "#a855f7",
          ],
          ticks: 200,
          gravity: 1.2,
          decay: 0.94,
          startVelocity: 30,
          shapes: ["circle"],
        });
      } catch {
        // Safe fallback in case confetti canvas is not supported
      }
    }
  };

  return (
    <div className="container py-8 md:py-12 relative z-10">
      {title && (
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            {title}
          </h2>
          {description && (
            <p className="text-slate-300 text-base sm:text-lg whitespace-pre-line max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}

      {showToggle && (
        <div className="flex items-center justify-center mb-10 gap-3">
          <Label htmlFor="billing-toggle" className="text-sm font-medium text-slate-300">
            One-time / Standard
          </Label>
          <Switch
            id="billing-toggle"
            ref={switchRef}
            checked={!isMonthly}
            onCheckedChange={handleToggle}
            className="relative"
          />
          <span className="font-semibold text-sm text-white">
            Annual plan <span className="text-cyan-400 font-bold">(Save 20%)</span>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 1 }}
            whileInView={
              isDesktop
                ? {
                    y: plan.isPopular ? -20 : 0,
                    opacity: 1,
                    x: index === 2 ? -24 : index === 0 ? 24 : 0,
                    scale: index === 0 || index === 2 ? 0.95 : 1.0,
                  }
                : {}
            }
            viewport={{ once: true }}
            transition={{
              duration: 1.2,
              type: "spring",
              stiffness: 100,
              damping: 25,
              delay: 0.2,
            }}
            className={cn(
              "rounded-3xl border p-7 sm:p-8 bg-[#0c101d]/90 backdrop-blur-xl text-center lg:flex lg:flex-col lg:justify-between relative transition-all duration-300 shadow-2xl",
              plan.isPopular
                ? "border-cyan-400 border-2 shadow-[0_0_50px_rgba(6,182,212,0.35)] z-20 scale-[1.02]"
                : "border-neutral-800 hover:border-cyan-500/40 z-10",
              "flex flex-col",
              !plan.isPopular && "mt-0 md:mt-4",
              index === 0 || index === 2
                ? "transform translate-x-0 translate-y-0"
                : "z-20",
              index === 0 && "origin-right",
              index === 2 && "origin-left"
            )}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-600 py-1 px-3 rounded-bl-2xl rounded-tr-2xl flex items-center shadow-lg">
                <Star className="text-white h-3.5 w-3.5 fill-current" />
                <span className="text-white ml-1.5 font-sans font-bold text-xs uppercase tracking-wider">
                  Popular
                </span>
              </div>
            )}

            <div className="flex-1 flex flex-col">
              <div className="text-left space-y-1 mb-4">
                <p className="text-lg font-bold text-white tracking-wide">
                  {plan.name}
                </p>
                {plan.tagline && (
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {plan.tagline}
                  </p>
                )}
              </div>

              <div className="my-4 p-4 rounded-2xl bg-black/70 border border-neutral-800/80 flex flex-col items-center justify-center">
                <div className="flex items-baseline justify-center gap-x-1.5">
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                    <NumberFlow
                      value={
                        isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)
                      }
                      format={{ style: "currency", currency: "INR", maximumFractionDigits: 0 }}
                      transformTiming={{
                        duration: 500,
                        easing: "ease-out",
                      }}
                      willChange
                      className="font-variant-numeric: tabular-nums"
                    />
                  </span>
                  {plan.period && (
                    <span className="text-xs font-semibold leading-6 tracking-wide text-slate-400">
                      / {plan.period}
                    </span>
                  )}
                </div>

                <p className="text-xs leading-5 text-slate-400 mt-1">
                  {isMonthly ? "billed standard" : "billed with 20% discount"}
                </p>
              </div>

              <ul className="mt-4 space-y-2.5 flex flex-col text-left">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <hr className="w-full my-6 border-neutral-800" />

              <Link
                href={plan.href}
                className={cn(
                  buttonVariants({
                    variant: plan.isPopular ? "primary" : "outline",
                  }),
                  "group relative w-full gap-2 overflow-hidden text-base font-bold tracking-tight rounded-xl py-3 shadow-lg transition-all duration-300",
                  plan.isPopular
                    ? "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white hover:opacity-95 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                    : "bg-neutral-900/90 text-white hover:bg-neutral-800 border-neutral-700 hover:border-cyan-500/50"
                )}
              >
                {plan.buttonText}
              </Link>

              {plan.description && (
                <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
                  {plan.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
