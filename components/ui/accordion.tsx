"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenId?: string;
  className?: string;
  enableShineBorder?: boolean;
}

export function Accordion({
  items,
  allowMultiple = false,
  defaultOpenId,
  className,
  enableShineBorder = false,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(
    defaultOpenId ? [defaultOpenId] : []
  );

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);

        const cardContent = (
          <div
            className={cn(
              "rounded-2xl overflow-hidden transition-colors duration-200",
              enableShineBorder ? "border-0 shadow-none bg-white" : "glass-panel border border-white/80 shadow-card"
            )}
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-expanded={isOpen}
            >
              <span className="font-display text-base sm:text-lg font-bold text-black">
                {item.title}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-black shrink-0"
              >
                <ChevronDown className="w-4 h-4 text-black stroke-[2.5]" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    className="px-6 pb-6 pt-2 text-sm sm:text-base !text-black text-neutral-950 font-semibold leading-relaxed border-t border-slate-200/70"
                    style={{ color: "#000000", opacity: 1 }}
                  >
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

        if (enableShineBorder) {
          return (
            <ShineBorder
              key={item.id}
              borderWidth={1.5}
              duration={4}
              borderRadius="1rem"
              gradient="from-blue-500 via-red-500 to-teal-400"
              className="w-full shadow-card hover:shadow-card-hover transition-shadow"
            >
              {cardContent}
            </ShineBorder>
          );
        }

        return <div key={item.id}>{cardContent}</div>;
      })}
    </div>
  );
}
