"use client";

import React, { useState } from "react";
import {
  RefreshCw,
  Server,
  Globe,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

interface ServiceItem {
  id: string;
  name: string;
  type: "domain" | "server" | "ssl";
  domainOrHost: string;
  expiryDate: string;
  daysRemaining: number;
  annualFee: number;
  status: "active" | "expiring_soon";
}

const DEMO_SERVICES: ServiceItem[] = [
  {
    id: "serv-1",
    name: "High-Performance Cloud Server Hosting",
    type: "server",
    domainOrHost: "node-cluster-delhi.webspyra.cloud",
    expiryDate: "17 Oct 2027",
    daysRemaining: 365,
    annualFee: 3999,
    status: "active",
  },
  {
    id: "serv-2",
    name: "Custom Domain Registration (.com / .in)",
    type: "domain",
    domainOrHost: "yourbrandwebsite.com",
    expiryDate: "17 Oct 2027",
    daysRemaining: 365,
    annualFee: 1299,
    status: "active",
  },
  {
    id: "serv-3",
    name: "Automated Wildcard SSL Certificate",
    type: "ssl",
    domainOrHost: "*.yourbrandwebsite.com",
    expiryDate: "Lifetime Auto-Renewing",
    daysRemaining: 999,
    annualFee: 0,
    status: "active",
  },
];

export default function RenewalsPage() {
  const { success } = useToast();
  const [renewingId, setRenewingId] = useState<string | null>(null);

  const handleRenewService = (service: ServiceItem) => {
    setRenewingId(service.id);
    setTimeout(() => {
      setRenewingId(null);
      success(
        "Service Extended!",
        `${service.name} has been renewed for an additional 12 months.`
      );
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Renewals & Cloud Infrastructure
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor your domain names, cloud servers, and SSL certificates with 100% transparent renewal pricing.
        </p>
      </div>

      {/* Free Year 1 Guarantee Banner */}
      <GlassCard glowColor="mint" className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-mint-light text-success flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              1st Year Completely Free & Pre-Paid
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              All cloud hosting and domain fees for your first 365 days were covered in your website launch package.
            </p>
          </div>
        </div>

        <Badge variant="mint" pulseDot className="shrink-0">
          Zero Renewals Due Today
        </Badge>
      </GlassCard>

      {/* Services List */}
      <div className="space-y-4">
        {DEMO_SERVICES.map((srv) => (
          <GlassCard key={srv.id} className="p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-accent shrink-0">
                  {srv.type === "server" ? (
                    <Server className="w-5 h-5" />
                  ) : srv.type === "domain" ? (
                    <Globe className="w-5 h-5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-success" />
                  )}
                </div>

                <div>
                  <h4 className="font-display font-bold text-base text-slate-900">
                    {srv.name}
                  </h4>
                  <p className="font-mono text-xs text-accent mt-0.5">
                    {srv.domainOrHost}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="mint">
                  Active (365d left)
                </Badge>

                {srv.annualFee > 0 && (
                  <Button
                    variant="secondary"
                    size="sm"
                    isLoading={renewingId === srv.id}
                    onClick={() => handleRenewService(srv)}
                    leftIcon={<RefreshCw className="w-3.5 h-3.5 text-accent" />}
                  >
                    Renew Early (₹{srv.annualFee})
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Next Renewal Date</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {srv.expiryDate}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Time Remaining</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {srv.daysRemaining} Days
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Annual Renewal Rate</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {srv.annualFee === 0 ? "Lifetime Free" : `₹${srv.annualFee}/year`}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Auto-Renew Status</span>
                <span className="font-bold text-success text-sm mt-0.5 block">
                  Protected (No Downtime)
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
