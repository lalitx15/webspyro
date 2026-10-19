"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Users2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { AdminHeader } from "@/components/admin/admin-header";
import { KpiCard } from "@/components/admin/kpi-card";

const performanceOverTime = [
  { month: "May", leads: 45, won: 10, revenue: 290000 },
  { month: "Jun", leads: 62, won: 14, revenue: 410000 },
  { month: "Jul", leads: 78, won: 19, revenue: 580000 },
  { month: "Aug", leads: 95, won: 24, revenue: 720000 },
  { month: "Sep", leads: 110, won: 32, revenue: 980000 },
  { month: "Oct", leads: 128, won: 42, revenue: 1485000 },
];

const leadSourceDistribution = [
  { name: "Quote Wizard", value: 38, color: "#1F6FEB" },
  { name: "Hero CTA Form", value: 26, color: "#A9E3DD" },
  { name: "WhatsApp Direct", value: 18, color: "#16A34A" },
  { name: "Pricing Table", value: 12, color: "#6C7CF0" },
  { name: "Contact Page", value: 6, color: "#F4A9BE" },
];

const conversionFunnel = [
  { stage: "Website Visitors", count: 12400, fill: "#BFD7F5" },
  { stage: "Quote Inquiries", count: 128, fill: "#8FD3F0" },
  { stage: "Consultation Calls", count: 86, fill: "#A9E3DD" },
  { stage: "Proposals Shared", count: 64, fill: "#1F6FEB" },
  { stage: "Won Deals / Orders", count: 42, fill: "#16A34A" },
];

const topSellingPlans = [
  { name: "Ultimate E-Commerce", sales: 18, revenue: 989982, fill: "#1F6FEB" },
  { name: "Growth Business Pro", sales: 16, revenue: 399984, fill: "#6C7CF0" },
  { name: "Startup Launchpad", sales: 8, revenue: 127992, fill: "#A9E3DD" },
];

export default function AdminAnalyticsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedRange, setSelectedRange] = useState<"30d" | "90d" | "1y">("30d");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="space-y-6">
      <AdminHeader
        onMobileMenuToggle={() => {}}
        title="Agency Analytics & Conversion Funnel"
        subtitle="Inbound lead sources, sales velocity, plan popularity, and revenue aggregation."
      />

      <div className="px-4 sm:px-6 space-y-6 max-w-7xl mx-auto">
        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Revenue"
            value={1485000}
            prefix="₹"
            change={28.4}
            changePeriod="growth QoQ"
            icon={DollarSign}
            themeColor="blue"
          />
          <KpiCard
            title="Quote Conversion"
            value={18.6}
            suffix="%"
            decimals={1}
            change={3.2}
            changePeriod="higher"
            icon={TrendingUp}
            themeColor="mint"
          />
          <KpiCard
            title="Average Order Value"
            value={35357}
            prefix="₹"
            change={12.1}
            changePeriod="vs industry"
            icon={DollarSign}
            themeColor="peach"
          />
          <KpiCard
            title="Active Inquiries"
            value={128}
            change={18.5}
            changePeriod="inbound volume"
            icon={Users2}
            themeColor="lavender"
          />
        </div>

        {/* Chart 1: Revenue & Lead Velocity Area */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                6-Month Revenue & Sales Velocity
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Financial cash flow progression and closed contracts
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
              {(["30d", "90d", "1y"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRange(r)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    selectedRange === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="analyticsRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1F6FEB" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#1F6FEB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 500 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 11 }}
                    tickFormatter={(val) => `₹${val > 999 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "16px",
                      border: "1px solid #E2E8F0",
                      fontSize: "12px",
                    }}
                    formatter={(val: unknown) => [`₹${Number(val).toLocaleString("en-IN")}`, "Gross Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1F6FEB"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#analyticsRevGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Loading analytics...
              </div>
            )}
          </div>
        </div>

        {/* Middle Section: Funnel & Lead Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversion Funnel (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Sales Pipeline Conversion Funnel
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Drop-off rates across discovery, consultation, and contract execution
              </p>
            </div>

            <div className="h-60 w-full pt-2">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={conversionFunnel}
                    layout="vertical"
                    margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                    <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                    <YAxis
                      dataKey="stage"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#64748B", fontSize: 11, fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "12px",
                        border: "1px solid #E2E8F0",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                      {conversionFunnel.map((entry, index) => (
                        <Cell key={`funnel-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Loading funnel...
                </div>
              )}
            </div>
          </div>

          {/* Lead Sources Donut (1 col) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] flex flex-col justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Lead Source Origin
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Where inbound prospects discover us</p>
            </div>

            <div className="h-48 w-full my-2">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadSourceDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {leadSourceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "12px",
                        border: "1px solid #E2E8F0",
                        fontSize: "12px",
                      }}
                      formatter={(val: unknown) => [`${val}%`, "Share"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Loading sources...
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              {leadSourceDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Selling Packages Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Top Performing Packages by Revenue
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Package popularity rank and collections</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Package Name</th>
                  <th className="py-2.5 px-3">Units Sold</th>
                  <th className="py-2.5 px-3">Total Volume</th>
                  <th className="py-2.5 px-3 text-right">Revenue Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topSellingPlans.map((plan, i) => (
                  <tr key={plan.name} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-blue-50 text-accent flex items-center justify-center text-[10px] font-extrabold">
                        #{i + 1}
                      </span>
                      <span>{plan.name}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{plan.sales} packages</td>
                    <td className="py-3 px-3 font-extrabold text-slate-900">
                      ₹{plan.revenue.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {Math.round((plan.revenue / 1517958) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
