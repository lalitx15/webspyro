"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CreditCard,
  Tag,
  Building,
  User,
  AlertCircle,
  Clock,
  Layers,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { defaultPlans, PlanItem } from "@/lib/home-data";
import { calculateOrderFinancials } from "@/lib/order-financials";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (resp: { error?: { description?: string } }) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { success, error, warning } = useToast();

  const preselectedPlanSlug = searchParams.get("plan") || "plan-business-2";

  // Step state (1: Details, 2: Review & Coupon, 3: Payment)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [selectedPlanId, setSelectedPlanId] = useState<string>(preselectedPlanSlug);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [company, setCompany] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [requirements, setRequirements] = useState("");

  // Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount_type: "percentage" | "fixed";
    discount_value: number;
    discount_amount: number;
  } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Payment processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Load Razorpay checkout.js script dynamically
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Find active plan
  const activePlan: PlanItem =
    defaultPlans.find(
      (p) =>
        p.id === selectedPlanId ||
        p.name.toLowerCase().includes(selectedPlanId.toLowerCase())
    ) || defaultPlans[1]; // default to Classic

  // Financial calculations
  const financials = calculateOrderFinancials(
    activePlan.price,
    appliedCoupon
      ? {
          discount_type: appliedCoupon.discount_type,
          discount_value: appliedCoupon.discount_value,
        }
      : null,
    18
  );

  // Handle coupon validation
  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = couponInput.trim().toUpperCase();
    if (!cleanCode) return;

    setIsValidatingCoupon(true);
    try {
      const res = await fetch("/api/checkout/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: cleanCode,
          subtotal: activePlan.price,
        }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon(data);
        success(
          "Coupon Applied!",
          `You saved ₹${data.discount_amount.toLocaleString("en-IN")} on this package.`
        );
      } else {
        error("Invalid Coupon", data.error || "Coupon could not be applied.");
      }
    } catch {
      error("Error", "Could not validate coupon at this time.");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    warning("Coupon Removed", "Discount was removed from order total.");
  };

  // Step 1 Validation
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || fullName.trim().length < 3) {
      error("Name Required", "Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      error("Valid Email Required", "Please enter a valid work or personal email address.");
      return;
    }
    if (!phone.trim() || phone.replace(/[^0-9]/g, "").length < 10) {
      error("Valid Phone Required", "Please enter a valid 10-digit mobile number.");
      return;
    }

    setCurrentStep(2);
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  // Step 3 Payment Execution
  const handleInitiatePayment = async () => {
    setIsProcessingPayment(true);

    try {
      // 1. Create order on server
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: activePlan.id,
          customer_name: fullName.trim(),
          customer_email: email.trim().toLowerCase(),
          customer_phone: phone.trim(),
          company: company.trim() || undefined,
          gst_number: gstNumber.trim() || undefined,
          coupon_code: appliedCoupon?.code || undefined,
          notes: requirements.trim() || undefined,
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to initialize payment gateway order.");
      }

      const { order_number, razorpay_order_id, key_id, amount, currency } = orderData;

      // 2. Open Razorpay Checkout modal
      if (window.Razorpay) {
        const options = {
          key: key_id,
          amount: amount,
          currency: currency || "INR",
          name: "Webspyra Agency",
          description: `${activePlan.name} Website Package`,
          order_id: razorpay_order_id,
          prefill: {
            name: fullName.trim(),
            email: email.trim(),
            contact: phone.trim(),
          },
          theme: {
            color: "#1F6FEB",
          },
          modal: {
            ondismiss: () => {
              setIsProcessingPayment(false);
              warning("Payment Incomplete", "You closed the payment window before finalizing.");
            },
          },
          handler: async (response: {
            razorpay_order_id?: string;
            razorpay_payment_id: string;
            razorpay_signature?: string;
          }) => {
            // 3. Verify signature
            await handleVerifyPayment(
              order_number,
              response.razorpay_order_id || razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature || ""
            );
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (resp: { error?: { description?: string } }) => {
          setIsProcessingPayment(false);
          error("Payment Failed", resp.error?.description || "Card or UPI transaction declined.");
        });
        rzp.open();
      } else {
        throw new Error("Payment gateway is still loading. Please wait a moment and try again.");
      }
    } catch (err: unknown) {
      setIsProcessingPayment(false);
      const msg = err instanceof Error ? err.message : "Payment initialization failed";
      error("Checkout Error", msg);
    }
  };

  const handleVerifyPayment = async (
    orderNumber: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    signature: string
  ) => {
    try {
      const verifyRes = await fetch("/api/checkout/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_number: orderNumber,
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: signature,
        }),
      });

      const data = await verifyRes.json();
      if (verifyRes.ok && data.success) {
        success("Payment Successful!", "Your order is confirmed.");
        router.push(`/checkout/success?order=${encodeURIComponent(orderNumber)}`);
      } else {
        throw new Error(data.error || "Signature verification failed.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification error";
      error("Verification Issue", msg);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 px-5 sm:px-8 max-w-7xl mx-auto">
      {/* Checkout Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
        <div className="inline-flex items-center gap-2">
          <Badge variant="blue" pulseDot>
            Secure Checkout
          </Badge>
          <Badge variant="mint">Zero Setup Fees</Badge>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-textPrimary tracking-tight">
          Complete Your Order
        </h1>
        <p className="text-sm sm:text-base text-textSecondary">
          Launch your high-performance business website with complete hosting, domain, and priority delivery.
        </p>

        {/* 3-Step Wizard Progress Bar */}
        <div className="pt-6 flex items-center justify-center gap-3 sm:gap-6">
          {[
            { step: 1, label: "Client Details" },
            { step: 2, label: "Plan & Review" },
            { step: 3, label: "Payment" },
          ].map((item, idx) => {
            const isActive = currentStep === item.step;
            const isCompleted = currentStep > item.step;

            return (
              <div key={item.step} className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    if (isCompleted) setCurrentStep(item.step as 1 | 2 | 3);
                  }}
                  disabled={!isCompleted && !isActive}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-accent text-white shadow-glow"
                      : isCompleted
                      ? "bg-mint-light text-slate-800 cursor-pointer"
                      : "bg-slate-200/70 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive ? "bg-white text-accent" : isCompleted ? "bg-success text-white" : "bg-slate-300 text-slate-700"
                    }`}
                  >
                    {isCompleted ? "✓" : item.step}
                  </span>
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
                {idx < 2 && (
                  <span
                    className={`h-0.5 w-6 sm:w-10 rounded-full ${
                      currentStep > idx + 1 ? "bg-accent" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Checkout Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Steps (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: Client & Project Details */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard glowColor="blue" className="p-6 sm:p-8 space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="font-display text-xl font-bold text-textPrimary flex items-center gap-2">
                      <User className="w-5 h-5 text-accent" />
                      Step 1: Your Business & Contact Details
                    </h2>
                    <p className="text-xs text-textSecondary mt-1">
                      We use these details for your official tax invoice and project coordination.
                    </p>
                  </div>

                  <form onSubmit={handleProceedToReview} className="space-y-4">
                    <Input
                      label="Full Name / Authorized Contact *"
                      placeholder="e.g. Vikram Malhotra"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Work / Personal Email *"
                        placeholder="you@company.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />

                      <Input
                        label="WhatsApp Phone Number *"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Company / Brand Name (Optional)"
                        placeholder="Malhotra Exports LLP"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />

                      <Input
                        label="GSTIN for Tax Credit (Optional)"
                        placeholder="07AAAAA0000A1Z5"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value)}
                      />
                    </div>

                    <Textarea
                      label="Special Requirements or Existing Domain (Optional)"
                      placeholder="e.g. We need integration with our existing domain malhotraexports.com and 5 business email addresses."
                      rows={3}
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                    />

                    <div className="pt-3 flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                        className="w-full sm:w-auto shadow-glow"
                      >
                        Continue to Plan Review
                      </Button>
                    </div>
                  </form>
                </GlassCard>
              </motion.div>
            )}

            {/* STEP 2: Plan Review & Promo Coupon */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard glowColor="mint" className="p-6 sm:p-8 space-y-6">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-xl font-bold text-textPrimary flex items-center gap-2">
                        <Layers className="w-5 h-5 text-accent" />
                        Step 2: Review Selected Package
                      </h2>
                      <p className="text-xs text-textSecondary mt-1">
                        Confirm features and apply promotional discounts.
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(1)}
                      leftIcon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Edit Info
                    </Button>
                  </div>

                  {/* Plan Switcher Pills */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">
                      Switch or Upgrade Package:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {defaultPlans.slice(0, 3).map((p) => {
                        const isSelected = p.id === activePlan.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setSelectedPlanId(p.id)}
                            className={`p-3 rounded-2xl border text-left transition-all ${
                              isSelected
                                ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <p className="font-display font-bold text-xs text-textPrimary truncate">
                              {p.name}
                            </p>
                            <p className="text-sm font-extrabold text-accent mt-0.5">
                              ₹{p.price.toLocaleString("en-IN")}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {p.delivery_days} days delivery
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Included Features Bullet Points */}
                  <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 space-y-2.5">
                    <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Included with {activePlan.name}:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        <span>Free .com or .in Domain (1st Year)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        <span>High-Speed Cloud Server Hosting</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        <span>Professional Business Emails</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        <span>Lifetime SSL Certificate & Firewall</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        <span>SEO Setup & XML Sitemap</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        <span>100% Mobile & Tablet Optimized</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code Coupon Bar */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-accent" />
                      Have a Promotional Discount Coupon?
                    </label>

                    {appliedCoupon ? (
                      <div className="p-3 rounded-2xl bg-mint-light/60 border border-mint flex items-center justify-between text-xs text-slate-800">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          <span className="font-bold">{appliedCoupon.code}</span>
                          <span className="text-slate-600">
                            (-₹{appliedCoupon.discount_amount.toLocaleString("en-IN")})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-xs text-rose font-semibold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. WELCOME10 or WEBSPYRA20"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-accent bg-white uppercase font-mono"
                        />
                        <Button
                          type="submit"
                          variant="secondary"
                          size="md"
                          isLoading={isValidatingCoupon}
                          disabled={!couponInput.trim()}
                        >
                          Apply Code
                        </Button>
                      </form>
                    )}
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setCurrentStep(1)}
                      leftIcon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      onClick={() => setCurrentStep(3)}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="shadow-glow"
                    >
                      Proceed to Payment
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* STEP 3: Payment Gateway Trigger */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard glowColor="blue" className="p-6 sm:p-8 space-y-6">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-xl font-bold text-textPrimary flex items-center gap-2">
                        <Lock className="w-5 h-5 text-accent" />
                        Step 3: Secure Payment (Razorpay)
                      </h2>
                      <p className="text-xs text-textSecondary mt-1">
                        Encrypted 256-bit checkout supporting UPI, Cards, NetBanking & Wallets.
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(2)}
                      leftIcon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Change Plan
                    </Button>
                  </div>

                  {/* Customer Confirmation Summary */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2 text-xs">
                    <p className="font-bold text-slate-800">Billing Information:</p>
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                      <div>
                        <span className="text-slate-400">Name: </span>
                        {fullName}
                      </div>
                      <div>
                        <span className="text-slate-400">Phone: </span>
                        {phone}
                      </div>
                      <div>
                        <span className="text-slate-400">Email: </span>
                        {email}
                      </div>
                      {company && (
                        <div>
                          <span className="text-slate-400">Company: </span>
                          {company}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Method Cards */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-700">Supported Methods:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-3 rounded-xl border border-slate-200 bg-white/70 text-center text-xs font-medium text-slate-700 flex flex-col items-center gap-1">
                        <span className="font-bold text-accent">UPI</span>
                        <span className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</span>
                      </div>
                      <div className="p-3 rounded-xl border border-slate-200 bg-white/70 text-center text-xs font-medium text-slate-700 flex flex-col items-center gap-1">
                        <CreditCard className="w-4 h-4 text-accent" />
                        <span className="text-[10px] text-slate-400">Visa, MC, RuPay</span>
                      </div>
                      <div className="p-3 rounded-xl border border-slate-200 bg-white/70 text-center text-xs font-medium text-slate-700 flex flex-col items-center gap-1">
                        <Building className="w-4 h-4 text-accent" />
                        <span className="text-[10px] text-slate-400">All Major Banks</span>
                      </div>
                      <div className="p-3 rounded-xl border border-slate-200 bg-white/70 text-center text-xs font-medium text-slate-700 flex flex-col items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-success" />
                        <span className="text-[10px] text-slate-400">100% Protected</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 space-y-3">
                    {(() => {
                      const directWhatsAppOrderUrl = `https://wa.me/918958889538?text=${encodeURIComponent(
                        `Hi Webspyra Team,\n\n` +
                        `I want to confirm my order for the *${activePlan.name}* plan.\n\n` +
                        `👤 *Client Name:* ${fullName.trim() || "Client"}\n` +
                        `📞 *Phone:* ${phone.trim() || "Not provided"}\n` +
                        `📧 *Email:* ${email.trim() || "Not provided"}\n` +
                        (company.trim() ? `🏢 *Company:* ${company.trim()}\n` : "") +
                        (requirements.trim() ? `📝 *Requirements:* ${requirements.trim()}\n` : "") +
                        `💰 *Total Amount:* ₹${financials.total_amount.toLocaleString("en-IN")} (Incl. GST)\n\n` +
                        `Please share advance payment instructions and onboarding form to get started!`
                      )}`;

                      return (
                        <a
                          href={directWhatsAppOrderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
                        >
                          <WhatsAppIcon className="w-5 h-5 shrink-0" fill="#ffffff" />
                          <span>Buy Now & Confirm Order on WhatsApp</span>
                        </a>
                      );
                    })()}

                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={handleInitiatePayment}
                      isLoading={isProcessingPayment}
                      leftIcon={<Lock className="w-4 h-4" />}
                      className="w-full text-xs font-bold text-slate-700"
                    >
                      Or Pay ₹{financials.total_amount.toLocaleString("en-IN")} Online via Gateway
                    </Button>

                    {/* Developer / Sandbox Simulation Button */}
                    <div className="pt-1 text-center">
                      
                    </div>
                  </div>

                  {/* Security Guarantees */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-success" />
                      Razorpay Verified Partner
                    </span>
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-accent" />
                      256-Bit SSL Encrypted
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Sticky Order Summary Card (5 Cols) */}
        <div className="lg:col-span-5 sticky top-28 space-y-5">
          <GlassCard glowColor="peach" className="p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-lg text-textPrimary">
                Order Summary
              </h3>
              <Badge variant="mint">{activePlan.name}</Badge>
            </div>

            {/* Selected Package Details */}
            <div className="space-y-1">
              <p className="font-display font-bold text-base text-textPrimary">
                {activePlan.name} Website Package
              </p>
              <p className="text-xs text-textSecondary leading-relaxed">
                {activePlan.tagline}
              </p>
              <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-accent" /> {activePlan.delivery_days} Days Delivery
                </span>
                <span>•</span>
                <span>1 Year Free Hosting</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Price Calculations Breakdown */}
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Base Package Price:</span>
                <span className="font-medium text-slate-800">
                  ₹{financials.subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              {financials.discount_amount > 0 && (
                <div className="flex items-center justify-between text-success font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Coupon Discount:
                  </span>
                  <span>-₹{financials.discount_amount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-600">
                <span>GST (18% Tax):</span>
                <span className="font-medium text-slate-800">
                  +₹{financials.gst_amount.toLocaleString("en-IN")}
                </span>
              </div>

              <hr className="border-slate-100 pt-1" />

              <div className="flex items-center justify-between text-base sm:text-lg font-bold text-textPrimary pt-1">
                <span>Total Amount:</span>
                <span className="text-accent text-xl font-extrabold">
                  ₹{financials.total_amount.toLocaleString("en-IN")}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 text-right">
                Includes all cloud taxes and domain setup fees
              </p>
            </div>

            {/* Annual Renewal Disclosure */}
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Transparent Renewal Terms
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Year 1 includes domain and hosting completely free. From Year 2 onwards, optional server renewal is just ₹{activePlan.renewal_price.toLocaleString("en-IN")}/yr with zero lock-in.
              </p>
            </div>

            {/* Satisfaction Guarantee Badge */}
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-600">
              <div className="w-8 h-8 rounded-full bg-mint-light flex items-center justify-center text-accent shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-[11px]">
                <strong>Milestone Delivery Guarantee:</strong> Dedicated senior architect assigned to your project with daily updates.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500">Loading secure checkout...</p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
