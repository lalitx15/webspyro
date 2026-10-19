"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { ShineBorder } from "@/components/ui/shine-border";

// Define variants for the card's overall style using cva
const cardVariants = cva(
  "relative flex flex-col justify-between h-full w-full overflow-hidden rounded-2xl p-7 sm:p-8 shadow-sm transition-shadow duration-300 hover:shadow-xl border border-slate-200/80 backdrop-blur-sm",
  {
    variants: {
      gradient: {
        orange: "bg-gradient-to-br from-orange-50 via-amber-100/60 to-amber-200/40 text-black",
        gray: "bg-gradient-to-br from-slate-50 via-slate-100/80 to-slate-200/50 text-black",
        purple: "bg-gradient-to-br from-purple-50 via-indigo-50/70 to-indigo-100/50 text-black",
        green: "bg-gradient-to-br from-emerald-50 via-teal-50/70 to-emerald-100/50 text-black",
        blue: "bg-gradient-to-br from-sky-50 via-blue-50/70 to-indigo-100/50 text-black",
        pink: "bg-gradient-to-br from-pink-50 via-rose-50/70 to-orange-50/50 text-black",
      },
    },
    defaultVariants: {
      gradient: "gray",
    },
  }
);

// Define the props interface for type safety and reusability
export interface GradientCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  badgeText: string;
  badgeColor: string; // Expecting a hex color string, e.g., "#FF5733"
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
  imageUrl?: string;
  icon?: React.ReactNode;
}

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  (
    {
      className,
      gradient,
      badgeText,
      badgeColor,
      title,
      description,
      ctaText = "Learn more",
      ctaHref = "#pricing",
      imageUrl,
      icon,
      ...props
    },
    ref
  ) => {
    // Animation variants for framer-motion
    const cardAnimation = {
      rest: { scale: 1, y: 0 },
      hover: { scale: 1.03, y: -4 },
    };

    const imageAnimation = {
      rest: { scale: 1, rotate: 0 },
      hover: { scale: 1.1, rotate: 3 },
    };

    return (
      <motion.div
        variants={cardAnimation}
        initial="rest"
        whileHover="hover"
        animate="rest"
        transition={{ type: "spring", stiffness: 350, damping: 20 }}
        className="h-full"
        ref={ref}
      >
        <div className={cn(cardVariants({ gradient }), className)} {...props}>
          {/* Animated ShineBorder */}
          <ShineBorder borderRadius="1rem" borderWidth={2} duration={8} gradient="from-[#A07CFE] via-[#FE8FB5] to-[#FFBE7B]" />

          {/* Decorative background image or icon graphic with animation */}
          {imageUrl ? (
            <motion.img
              src={imageUrl}
              alt={`${title} background graphic`}
              variants={imageAnimation}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="absolute -right-6 -bottom-6 w-36 h-36 sm:w-44 sm:h-44 object-contain opacity-75 pointer-events-none select-none drop-shadow-md"
              loading="lazy"
            />
          ) : icon ? (
            <motion.div
              variants={imageAnimation}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="absolute -right-4 -bottom-4 w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center opacity-15 pointer-events-none select-none text-slate-900"
            >
              {icon}
            </motion.div>
          ) : null}

          {/* Card Content */}
          <div className="z-10 flex flex-col h-full justify-between">
            <div>
              {/* Badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/95 border border-slate-300 px-3 py-1 text-xs font-bold text-black shadow-sm backdrop-blur-md w-fit">
                <span
                  className="h-2 w-2 rounded-full shadow-sm animate-pulse"
                  style={{ backgroundColor: badgeColor }}
                />
                <span className="text-black font-bold">{badgeText}</span>
              </div>

              {/* Title and Description */}
              <div className="flex-grow space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight leading-snug">
                  {title}
                </h3>
                <p className="text-sm sm:text-base text-black font-semibold leading-relaxed max-w-sm opacity-90">
                  {description}
                </p>
              </div>
            </div>

            {/* Call to Action Link */}
            <a
              href={ctaHref}
              className="group mt-6 inline-flex items-center gap-2 text-sm font-black text-black hover:opacity-75 transition-opacity"
            >
              <span className="text-black font-bold">{ctaText}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5 text-black" />
            </a>
          </div>
        </div>
      </motion.div>
    );
  }
);
GradientCard.displayName = "GradientCard";

export { GradientCard, cardVariants };
export default GradientCard;
