"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useAuth } from "@/components/providers/auth-provider";
import { ShieldCheck, ArrowRight, UserCheck } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { user, isAdmin, isLoading } = useAuth();
  const [demoBypass, setDemoBypass] = useState(false);

  // If user is logged in as non-admin and demo bypass is not activated
  const isDenied = !isLoading && user && !isAdmin && !demoBypass;

  if (isDenied) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Admin Access Required
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Your account (<strong className="text-slate-800">{user?.email}</strong>) does not have administrator privileges.
            </p>
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              onClick={() => setDemoBypass(true)}
              className="w-full py-2.5 px-4 bg-accent hover:bg-accent-hover text-white rounded-2xl font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Continue in Admin Demo Mode</span>
            </button>

            <Link
              href="/portal"
              className="block w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-semibold text-xs transition-all text-center"
            >
              Return to Client Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex antialiased text-slate-800 selection:bg-accent/15 selection:text-accent">
      {/* Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileNavOpen}
        onMobileClose={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Demo Mode Notice Banner (shows only when not officially signed in with admin role) */}
        {!isAdmin && (
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-accent text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-semibold">
                Admin Demo Mode Active — Interactive CRUD and Realtime controls enabled
              </span>
            </div>
            <Link
              href="/login?redirect=/admin"
              className="font-bold underline hover:text-blue-100 inline-flex items-center gap-1 text-[11px]"
            >
              <span>Sign in with Production Admin Account</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        <main className="flex-1 pb-16">{children}</main>
      </div>
    </div>
  );
}
