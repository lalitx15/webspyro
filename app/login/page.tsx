"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/providers/auth-provider";
import { OrbsBackground } from "@/components/ui/orbs-background";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { success, error } = useToast();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, user } = useAuth();

  const redirectUrl = searchParams.get("redirect") || "/portal";
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";

  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to portal
  React.useEffect(() => {
    if (user) {
      router.push(redirectUrl);
    }
  }, [user, router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      error("Missing Credentials", "Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (activeTab === "login") {
        const { error: signInErr } = await signInWithEmail(email.trim(), password);
        if (signInErr) {
          throw signInErr;
        }
        success("Welcome Back!", "Redirecting to your client portal...");
        router.push(redirectUrl);
      } else {
        if (!fullName.trim()) {
          error("Full Name Required", "Please enter your name to register.");
          setIsSubmitting(false);
          return;
        }

        const { error: signUpErr } = await signUpWithEmail(
          email.trim(),
          password,
          fullName.trim()
        );
        if (signUpErr) {
          throw signUpErr;
        }
        success(
          "Account Created!",
          "Welcome to Webspyra. Redirecting to your workspace..."
        );
        router.push(redirectUrl);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      error("Authentication Error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error: oauthErr } = await signInWithGoogle(
        `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(
          redirectUrl
        )}`
      );
      if (oauthErr) throw oauthErr;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google OAuth failed";
      error("Google Sign-In Error", msg);
    }
  };

  const handleDemoClientLogin = () => {
    setEmail("client@webspyra.com");
    setPassword("WebspyraClient123!");
    success("Demo Credentials Loaded", "Click 'Sign In to Portal' to proceed.");
  };

  return (
    <div className="min-h-[100dvh] bg-page-gradient relative flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      <OrbsBackground />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="w-10 h-10 rounded-2xl bg-accent-grad text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
              W
            </span>
            <span className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
              WEBSPYRA
            </span>
          </Link>
          <p className="text-xs sm:text-sm text-textSecondary">
            Client Portal & Digital Project Workspace
          </p>
        </div>

        {/* Auth Glass Card */}
        <GlassCard glowColor="blue" className="p-7 sm:p-9 space-y-6 shadow-2xl">
          {/* Sliding Tabs Indicator */}
          <div className="flex rounded-full bg-slate-200/60 p-1 relative">
            <motion.div
              layoutId="auth-tab-pill"
              className="absolute top-1 bottom-1 rounded-full bg-white shadow-sm"
              animate={{
                left: activeTab === "login" ? "4px" : "50%",
                right: activeTab === "login" ? "50%" : "4px",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 rounded-full text-xs font-bold z-10 transition-colors text-center ${
                activeTab === "login" ? "text-accent" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2 rounded-full text-xs font-bold z-10 transition-colors text-center ${
                activeTab === "register" ? "text-accent" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Google OAuth Button */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-xs sm:text-sm font-semibold text-slate-700 shadow-xs cursor-pointer active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="flex-1 h-px bg-slate-200" />
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Or with Email
              </span>
              <span className="flex-1 h-px bg-slate-200" />
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "register" && (
              <Input
                label="Full Name *"
                placeholder="Vikram Malhotra"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            )}

            <Input
              label="Email Address *"
              placeholder="you@company.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                label="Password *"
                placeholder="••••••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {activeTab === "login" && (
              <div className="flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={handleDemoClientLogin}
                  className="text-accent font-semibold hover:underline"
                >
                  ⚡ Fill Demo Credentials
                </button>
                <Link
                  href="/contact"
                  className="text-slate-500 hover:text-slate-800"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full shadow-glow"
            >
              {activeTab === "login" ? "Sign In to Portal" : "Create My Account"}
            </Button>
          </form>

          {/* Secure Guarantee */}
          <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span>Encrypted with 256-bit Supabase Auth</span>
          </div>
        </GlassCard>

        {/* Back to Site Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium"
          >
            ← Back to Webspyra Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
