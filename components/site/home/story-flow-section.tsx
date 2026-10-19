"use client";

import React from "react";
import { FlowArt, FlowSection } from "@/components/ui/story-scroll";
import { ArrowRight } from "lucide-react";
import { CountUp } from "@/components/ui/count-up";

export interface StoryFlowSectionProps {
  onOpenQuote?: () => void;
}

export function StoryFlowSection({ onOpenQuote }: StoryFlowSectionProps) {
  return (
    <div className="relative w-full overflow-hidden bg-white text-slate-900 border-b border-slate-200">
      <FlowArt aria-label="WebSpyra Business Transformation Story">
        {/* Section 01 */}
        <FlowSection
          aria-label="Who we are"
          className="bg-white border-t border-slate-100"
          style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-cyan-600 bg-cyan-50 px-3.5 py-1.5 rounded-full border border-cyan-200">
              01 — The Standard
            </span>
            <span className="text-xs uppercase tracking-widest text-slate-900 font-bold">WebSpyra Engineering</span>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-slate-200" />

          <div>
            <h2 className="text-[clamp(2.8rem,9vw,9.5rem)] font-black leading-[0.88] uppercase tracking-tight text-slate-950">
              Create
              <br />
              Without
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600">
                Limits
              </span>
            </h2>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-slate-200" />

          <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <p className="max-w-[55ch] text-[clamp(1rem,2vw,1.6rem)] font-medium text-slate-950 leading-relaxed">
              We believe every ambitious business deserves a digital identity that commands absolute market authority. No slow WordPress templates, no hidden fees — just high-converting engineering built to scale.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-widest">
              Scroll down to explore <ArrowRight className="w-4 h-4 animate-pulse text-cyan-600" />
            </div>
          </div>
        </FlowSection>

        {/* Section 02 */}
        <FlowSection
          aria-label="The mission"
          className="bg-slate-50 border-t border-slate-200"
          style={{ backgroundColor: "#fafbfc", color: "#0f172a" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-200">
              02 — Built for Growth
            </span>
            <span className="text-xs uppercase tracking-widest text-slate-900 font-bold">High-Impact ROI</span>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-slate-200" />

          <div>
            <h2 className="text-[clamp(2.8rem,9vw,9.5rem)] font-black leading-[0.88] uppercase tracking-tight text-slate-950">
              Growth
              <br />
              First
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                Always
              </span>
            </h2>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-slate-200" />

          <p className="max-w-[55ch] text-[clamp(0.95rem,1.8vw,1.35rem)] text-slate-950 font-semibold leading-relaxed">
            A dedicated technology partner built for founders who demand measurable sales, sub-second load times, and top organic search positioning.
          </p>

          <hr className="my-[1.5vw] border-none border-t border-slate-200" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2vw]">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="mb-1 text-xs font-black uppercase tracking-wider text-cyan-600">Google Rank #1</p>
              <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
                Engineered with semantic SEO & Next.js SSR so real buyers searching your keywords find you first.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="mb-1 text-xs font-black uppercase tracking-wider text-blue-600">Instant Lead Capture</p>
              <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
                Direct WhatsApp triggers & instant corporate email alerts the moment a buyer inquires.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="mb-1 text-xs font-black uppercase tracking-wider text-indigo-600">Zero Hidden Costs</p>
              <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
                Upfront transparent pricing with integrated UPI checkout. You own 100% of your digital asset.
              </p>
            </div>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-slate-200" />

          <p className="mt-auto ml-auto max-w-[50ch] text-left sm:text-right text-[clamp(0.9rem,1.5vw,1.2rem)] font-bold text-slate-950 leading-relaxed">
            Every feature we craft starts with one question — <strong className="text-black font-extrabold underline decoration-cyan-500">does this generate more sales for your business?</strong>
          </p>
        </FlowSection>

        {/* Section 03 */}
        <FlowSection
          aria-label="How it works"
          className="bg-white border-t border-slate-200"
          style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              03 — Rapid Delivery
            </span>
            <span className="text-xs uppercase tracking-widest text-slate-900 font-bold">Live in 3-5 Days</span>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-slate-200" />

          <div>
            <h2 className="text-[clamp(2.8rem,9vw,9.5rem)] font-black leading-[0.88] uppercase tracking-tight text-slate-950">
              Show
              <br />
              Up.
              <br />
              Stand
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
                Out.
              </span>
            </h2>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-slate-200" />

          <p className="max-w-[55ch] text-[clamp(0.95rem,1.8vw,1.35rem)] text-slate-950 font-semibold leading-relaxed">
            Fast, transparent, zero complication. Your custom digital storefront goes live in as fast as 72 hours.
          </p>

          <hr className="my-[1.5vw] border-none border-t border-slate-200" />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-[1.5vw]">
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1">01 — Strategy</p>
              <p className="text-xs text-slate-900 leading-normal font-medium">Deep competitor research & keyword mapping.</p>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1">02 — UI/UX Design</p>
              <p className="text-xs text-slate-900 leading-normal font-medium">Bespoke glassmorphic layout tailored to your brand.</p>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1">03 — Code & Speed</p>
              <p className="text-xs text-slate-900 leading-normal font-medium">99+ Google Core Web Vitals optimization.</p>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1">04 — Payments</p>
              <p className="text-xs text-slate-900 leading-normal font-medium">Razorpay, UPI & automated invoice generation.</p>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1">05 — SEO & SSL</p>
              <p className="text-xs text-slate-900 leading-normal font-medium">Bank-grade HTTPS & Google Search Console index.</p>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1">06 — Support</p>
              <p className="text-xs text-slate-900 leading-normal font-medium">Lifetime tech assistance and server monitoring.</p>
            </div>
          </div>
        </FlowSection>

        {/* Section 04 */}
        <FlowSection
          aria-label="The vision"
          className="bg-slate-50 border-t border-slate-200"
          style={{ backgroundColor: "#f8fafc", color: "#0f172a" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              04 — The Track Record
            </span>
            <span className="text-xs uppercase tracking-widest text-slate-900 font-bold">Proven Results</span>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-slate-200" />

          <div>
            <h2 className="text-[clamp(2.8rem,9vw,9.5rem)] font-black leading-[0.88] uppercase tracking-tight text-slate-950">
              Future
              <br />
              Of Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                Business
              </span>
            </h2>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-slate-200" />

          <p className="max-w-[55ch] text-[clamp(0.95rem,1.8vw,1.35rem)] text-slate-950 font-semibold leading-relaxed">
            We are not just designing another landing page. We are building your company&apos;s highest-converting 24/7 sales representative.
          </p>

          <hr className="my-[1.5vw] border-none border-t border-slate-200" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[2vw]">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-3xl sm:text-4xl font-black text-slate-950 mb-1 tracking-tight">
                <CountUp to={500} suffix="+" duration={2} />
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Businesses Launched</p>
              <p className="text-xs text-slate-900 font-medium mt-2">Across retail, manufacturing, real estate, and services.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-3xl sm:text-4xl font-black text-slate-950 mb-1 tracking-tight">
                ₹<CountUp to={15} suffix="Cr+" duration={2.2} />
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Client Revenue Driven</p>
              <p className="text-xs text-slate-900 font-medium mt-2">Through inbound leads, direct UPI orders, and online bookings.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-3xl sm:text-4xl font-black text-slate-950 mb-1 tracking-tight">
                <CountUp to={99.8} decimals={1} suffix="%" duration={2} />
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Satisfaction Rate</p>
              <p className="text-xs text-slate-900 font-medium mt-2">Backed by guaranteed on-time launch and dedicated care.</p>
            </div>
          </div>
        </FlowSection>

        {/* Section 05 */}
        <FlowSection
          aria-label="Join us"
          className="bg-white border-t border-slate-200"
          style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-pink-600 bg-pink-50 px-3.5 py-1.5 rounded-full border border-pink-200">
              05 — Your Turn
            </span>
            <span className="text-xs uppercase tracking-widest text-slate-900 font-bold">WebSpyra Advantage</span>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-slate-200" />

          <div>
            <h2 className="text-[clamp(2.8rem,9vw,9.5rem)] font-black leading-[0.88] uppercase tracking-tight text-slate-950">
              Ready
              <br />
              To
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-600 to-orange-500">
                Dominate?
              </span>
            </h2>
          </div>

          <hr className="my-[1.5vw] border-none border-t border-slate-200" />

          <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-4">
            <p className="max-w-[50ch] text-[clamp(1rem,2vw,1.5rem)] font-bold text-slate-950 leading-relaxed">
              Take complete control of your digital growth. Explore why staying without an optimized website costs you thousands every week.
            </p>

            {onOpenQuote && (
              <button
                type="button"
                onClick={onOpenQuote}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-slate-950 text-white font-bold text-sm sm:text-base hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl active:scale-95"
              >
                <span>Get Instant Quote</span>
                <ArrowRight className="w-5 h-5 text-cyan-400" />
              </button>
            )}
          </div>
        </FlowSection>
      </FlowArt>
    </div>
  );
}

export default StoryFlowSection;
