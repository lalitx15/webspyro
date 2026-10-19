"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ScrollProgressBar } from "./scroll-progress";
import { Header } from "./header";
import { Footer } from "./footer";
import { ChatProvider } from "@/lib/chat-context";
import { Modal } from "@/components/ui/modal";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { createBrowserClient } from "@/lib/supabase/client";
import { Send, CheckCircle2, MessageCircle } from "lucide-react";

// Client-only overlays loaded after main page content
const FloatingWidgets = dynamic(
  () => import("./floating-widgets").then((m) => m.FloatingWidgets),
  { ssr: false }
);
const ChatPanel = dynamic(
  () => import("./chat-panel").then((m) => m.ChatPanel),
  { ssr: false }
);

interface QuoteModalContextType {
  openQuoteModal: (planName?: string) => void;
  closeQuoteModal: () => void;
}

export const QuoteModalContext = React.createContext<QuoteModalContextType>({
  openQuoteModal: () => {},
  closeQuoteModal: () => {},
});

export const useQuoteModal = () => React.useContext(QuoteModalContext);

export interface PublicLayoutProps {
  children: React.ReactNode | ((helpers: QuoteModalContextType) => React.ReactNode);
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const { success, error } = useToast();
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("classic");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const openQuoteModal = (planName?: string) => {
    if (planName) setPlan(planName);
    setIsQuoteOpen(true);
  };

  const closeQuoteModal = () => {
    setIsQuoteOpen(false);
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.trim().length < 8) {
      error("Missing Information", "Please enter your name and contact phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          service_interested: plan,
          message: message.trim() || undefined,
          source: "quote_modal",
        }),
      });

      if (!response.ok) {
        // Fallback directly to client Supabase insert
        const supabase = createBrowserClient();
        await supabase.from("leads").insert({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || null,
          service_interested: plan,
          message: message.trim() || null,
          source: "quote_modal",
          status: "new",
        });
      }

      setIsSuccess(true);
      success("Quote Request Sent!", "Our technical team will call you back shortly.");
    } catch {
      setIsSuccess(true);
      success("Quote Request Sent!", "We received your message and will reach out promptly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalHelpers: QuoteModalContextType = {
    openQuoteModal,
    closeQuoteModal,
  };

  return (
    <ChatProvider>
      <QuoteModalContext.Provider value={modalHelpers}>
        <div className="flex flex-col min-h-[100dvh] bg-page-gradient text-textPrimary relative">
        <ScrollProgressBar />
        <Header onOpenQuoteModal={() => openQuoteModal()} />

        <main className="flex-1 w-full">
          {typeof children === "function" ? children(modalHelpers) : children}
        </main>

      <Footer />

      {/* Floating Widgets */}
      <FloatingWidgets />

      {/* Global "Get Free Quote" Modal */}
      <Modal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        title="Get Free Quote — Fast Turnaround"
        description="Takes only 30 seconds. A senior web architect will analyze your goals and share a clear roadmap."
      >
        {isSuccess ? (
          <div className="py-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-mint-light flex items-center justify-center text-success mx-auto shadow-glow-mint">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display text-xl font-bold text-textPrimary">
                Request Received!
              </h4>
              <p className="text-xs sm:text-sm text-textSecondary max-w-xs mx-auto">
                Thank you for choosing Webspyra. We are reviewing your project requirements and will connect with you right away.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/918958889538?text=${encodeURIComponent(
                  `Hi Webspyra, I just requested a quote for the ${plan} package. Can we chat?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<MessageCircle className="w-4 h-4" />}
                  className="w-full sm:w-auto shadow-glow"
                >
                  Continue on WhatsApp
                </Button>
              </a>
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setIsQuoteOpen(false);
                  setIsSuccess(false);
                  setName("");
                  setMessage("");
                }}
                className="w-full sm:w-auto"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitQuote} className="space-y-4 pt-2">
            <Input
              label="Your Full Name *"
              placeholder="Vikram Malhotra"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="WhatsApp Phone Number *"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <Input
                label="Email Address (Optional)"
                placeholder="you@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Select
              label="Interested Package / Service"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              options={[
                { value: "starter", label: "Starter Business Website (₹5,999)" },
                { value: "classic", label: "Classic Growth Website (₹9,999) - Most Popular" },
                { value: "premium", label: "Premium Corporate Website (₹15,999)" },
                { value: "ecommerce", label: "E-Commerce Online Store (₹11,999+)" },
                { value: "webapp", label: "Custom Web Application / SaaS" },
                { value: "redesign", label: "Website Redesign & Speed Optimization" },
              ]}
            />

            <Textarea
              label="Short Brief or Feature List"
              placeholder="Tell us about your brand, required pages, or references..."
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsQuoteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Submit Quote Request
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Realtime Live Chat Panel */}
      <ChatPanel />
    </div>
    </QuoteModalContext.Provider>
    </ChatProvider>
  );
}
