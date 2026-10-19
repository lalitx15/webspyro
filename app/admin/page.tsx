"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  Users2,
  FolderKanban,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  Phone,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { AdminHeader } from "@/components/admin/admin-header";
import { KpiCard } from "@/components/admin/kpi-card";
import { Button } from "@/components/ui/button";

// Sample chart data for 7d, 30d, 90d, 1y
const chartDataOptions = {
  "7d": [
    { date: "Mon", revenue: 42000, leads: 8 },
    { date: "Tue", revenue: 78000, leads: 14 },
    { date: "Wed", revenue: 55000, leads: 11 },
    { date: "Thu", revenue: 110000, leads: 19 },
    { date: "Fri", revenue: 89000, leads: 16 },
    { date: "Sat", revenue: 135000, leads: 22 },
    { date: "Sun", revenue: 95000, leads: 15 },
  ],
  "30d": [
    { date: "Week 1", revenue: 280000, leads: 32 },
    { date: "Week 2", revenue: 395000, leads: 48 },
    { date: "Week 3", revenue: 340000, leads: 41 },
    { date: "Week 4", revenue: 470000, leads: 59 },
  ],
  "90d": [
    { date: "Month 1", revenue: 1150000, leads: 145 },
    { date: "Month 2", revenue: 1420000, leads: 180 },
    { date: "Month 3", revenue: 1680000, leads: 215 },
  ],
  "1y": [
    { date: "Q1", revenue: 3400000, leads: 420 },
    { date: "Q2", revenue: 4100000, leads: 530 },
    { date: "Q3", revenue: 4850000, leads: 610 },
    { date: "Q4", revenue: 5600000, leads: 740 },
  ],
};

const serviceDistributionData = [
  { name: "Business Websites", value: 45, color: "#1F6FEB" },
  { name: "E-Commerce Stores", value: 30, color: "#A9E3DD" },
  { name: "Web Applications", value: 15, color: "#6C7CF0" },
  { name: "SEO & Growth", value: 10, color: "#F4A9BE" },
];

const pipelineStagesData = [
  { stage: "New Lead", count: 28, fill: "#BFD7F5" },
  { stage: "Contacted", count: 22, fill: "#8FD3F0" },
  { stage: "Proposal", count: 16, fill: "#A9E3DD" },
  { stage: "In Dev", count: 14, fill: "#1F6FEB" },
  { stage: "Completed", count: 42, fill: "#16A34A" },
];

const recentLeads = [
  {
    id: "lead-1",
    name: "Vikram Malhotra",
    company: "Apex Logistics Ltd",
    phone: "+91 98201 54321",
    service: "E-Commerce Website",
    status: "new",
    time: "15 mins ago",
    budget: "₹65,000 - ₹95,000",
  },
  {
    id: "lead-2",
    name: "Dr. Ananya Sen",
    company: "Senskin Dermatology",
    phone: "+91 99345 67890",
    service: "Business Website",
    status: "contacted",
    time: "1 hour ago",
    budget: "₹35,000",
  },
  {
    id: "lead-3",
    name: "Rohan Singhal",
    company: "FinEdge Wealth",
    phone: "+91 98711 22334",
    service: "Web Application",
    status: "qualified",
    time: "3 hours ago",
    budget: "₹1,20,000+",
  },
  {
    id: "lead-4",
    name: "Pooja Verma",
    company: "Artisanal Bakes",
    phone: "+91 97123 45678",
    service: "Growth & SEO",
    status: "won",
    time: "Yesterday",
    budget: "₹25,000/mo",
  },
];

const recentOrders = [
  {
    orderNumber: "WSP-10492",
    client: "Vikram Malhotra",
    plan: "Ultimate E-Commerce",
    amount: "₹64,899",
    status: "paid",
    date: "Today, 14:32",
  },
  {
    orderNumber: "WSP-10491",
    client: "Dr. Ananya Sen",
    plan: "Standard Business",
    amount: "₹29,499",
    status: "paid",
    date: "Yesterday",
  },
  {
    orderNumber: "WSP-10490",
    client: "Sameer Joshi",
    plan: "Startup Portfolio",
    amount: "₹18,879",
    status: "pending",
    date: "16 Oct 2026",
  },
];

const upcomingRenewals = [
  {
    domain: "drskinclinic.in",
    client: "Dr. Ananya Sen",
    service: "AWS Cloud Hosting + SSL",
    expiresIn: "6 days",
    amount: "₹4,999",
  },
  {
    domain: "finedgecorp.com",
    client: "FinEdge Wealth",
    service: "Dedicated Server + Backup",
    expiresIn: "14 days",
    amount: "₹12,500",
  },
];

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-50 text-accent border border-blue-200/80";
      case "contacted":
        return "bg-amber-50 text-amber-700 border border-amber-200/80";
      case "qualified":
        return "bg-purple-50 text-purple-700 border border-purple-200/80";
      case "won":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200/80";
      case "lost":
        return "bg-rose-50 text-rose-700 border border-rose-200/80";
      case "paid":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200/80";
      case "pending":
        return "bg-amber-50 text-amber-700 border border-amber-200/80";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        onMobileMenuToggle={() => {
          // Handled via parent event or global listener
        }}
        title="Admin Overview"
        subtitle="Live agency performance metrics, sales funnel, and revenue stream."
      />

      <div className="px-4 sm:px-6 space-y-6 max-w-7xl mx-auto">
        {/* Top 5 KPI Count-Up Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard
            title="Total Revenue"
            value={1485000}
            prefix="₹"
            change={22.4}
            changePeriod="vs last month"
            icon={DollarSign}
            themeColor="blue"
          />
          <KpiCard
            title="New Leads"
            value={128}
            change={18.2}
            changePeriod="vs last month"
            icon={Users2}
            themeColor="mint"
          />
          <KpiCard
            title="Active Projects"
            value={14}
            change={8.3}
            changePeriod="in progress"
            icon={FolderKanban}
            themeColor="pink"
          />
          <KpiCard
            title="Orders Placed"
            value={42}
            change={15.5}
            changePeriod="vs last month"
            icon={ShoppingBag}
            themeColor="peach"
          />
          <KpiCard
            title="Conversion Rate"
            value={18.6}
            suffix="%"
            decimals={1}
            change={2.1}
            changePeriod="higher"
            icon={TrendingUp}
            themeColor="lavender"
          />
        </div>

        {/* Middle Section: Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Area Chart (Revenue & Leads) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Revenue & Leads Velocity
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Financial collections & inbound customer demand over time
                </p>
              </div>

              {/* Range Selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {(["7d", "30d", "90d", "1y"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setPeriod(r)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                      period === r
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Container */}
            <div className="h-72 w-full pt-4">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartDataOptions[period]}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1F6FEB" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#1F6FEB" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A9E3DD" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#A9E3DD" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis
                      dataKey="date"
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
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                        fontSize: "12px",
                      }}
                      formatter={(value: unknown, name: unknown) => {
                        const num = Number(value);
                        return [
                          name === "revenue" ? `₹${num.toLocaleString("en-IN")}` : num,
                          name === "revenue" ? "Revenue" : "Leads",
                        ];
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#1F6FEB"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#revenueGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="leads"
                      stroke="#14B8A6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#leadsGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                  Loading chart...
                </div>
              )}
            </div>
          </div>

          {/* Service Share Donut Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Demand by Service
                </h3>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  YTD Breakdown
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Client volume distribution
              </p>
            </div>

            <div className="h-52 w-full my-2">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {serviceDistributionData.map((entry, index) => (
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
                  Loading...
                </div>
              )}
            </div>

            {/* Custom Legend */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              {serviceDistributionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline & Funnel Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Conversion Pipeline Stages
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time active volume across inquiry, design, and production phases
              </p>
            </div>
            <Link href="/admin/leads">
              <Button variant="secondary" className="text-xs px-3 py-1.5 h-8 gap-1">
                <span>View Full CRM Pipeline</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="h-44 w-full pt-2">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineStagesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="stage"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748B", fontSize: 11, fontWeight: 600 }}
                  />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {pipelineStagesData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Loading pipeline...
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Recent Leads & Orders & Renewals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Leads (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Recent Inquiries & Leads
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest clients requesting website consultations
                </p>
              </div>
              <Link href="/admin/leads">
                <Button variant="secondary" className="text-xs px-3 py-1.5 h-8 gap-1">
                  <span>Open Leads Table</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Lead</th>
                    <th className="py-2.5 px-3">Service</th>
                    <th className="py-2.5 px-3">Budget</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{lead.name}</div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {lead.company}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">
                        {lead.service}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {lead.budget}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${getStatusBadge(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1.5 text-slate-400 hover:text-accent rounded-lg hover:bg-blue-50 transition-colors"
                            title="Call Lead"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Upcoming Renewals & Recent Orders */}
          <div className="space-y-6">
            {/* Upcoming Renewals Alert */}
            <div className="bg-gradient-to-br from-white to-blue-50/40 rounded-3xl p-5 border border-blue-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Upcoming Cloud Renewals
                    </h4>
                    <p className="text-[10px] text-slate-500">Expiring in &lt; 15 days</p>
                  </div>
                </div>
                <Link
                  href="/admin/renewals"
                  className="text-[11px] font-bold text-accent hover:underline"
                >
                  Manage
                </Link>
              </div>

              <div className="space-y-2">
                {upcomingRenewals.map((ren) => (
                  <div
                    key={ren.domain}
                    className="p-3 bg-white rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{ren.domain}</p>
                      <p className="text-[10px] text-slate-400">
                        {ren.client} • {ren.service}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-900">{ren.amount}</span>
                      <p className="text-[10px] font-semibold text-rose-500">
                        in {ren.expiresIn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders Snapshot */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Recent Razorpay Orders
                  </h4>
                  <p className="text-[10px] text-slate-400">Verified online payments</p>
                </div>
                <Link
                  href="/admin/orders"
                  className="text-[11px] font-bold text-accent hover:underline"
                >
                  All Orders
                </Link>
              </div>

              <div className="space-y-2">
                {recentOrders.map((ord) => (
                  <div
                    key={ord.orderNumber}
                    className="p-2.5 rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-between text-xs border border-slate-100"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{ord.client}</p>
                      <p className="text-[10px] text-slate-400">
                        {ord.orderNumber} • {ord.plan}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-900">{ord.amount}</p>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${getStatusBadge(
                          ord.status
                        )}`}
                      >
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
