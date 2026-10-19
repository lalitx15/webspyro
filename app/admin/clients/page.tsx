"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users2,
  Phone,
  MessageSquare,
  Mail,
  Building,
  DollarSign,
  FolderKanban,
  X,
  Printer,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@/lib/supabase/client";

interface ClientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  gst_number?: string;
  avatar_url?: string;
  total_spent: number;
  projects_count: number;
  active_renewals: number;
  created_at: string;
  orders: {
    order_number: string;
    plan_name: string;
    amount: number;
    status: string;
    date: string;
  }[];
}

const initialMockClients: ClientRecord[] = [
  {
    id: "cli-1",
    name: "Vikram Malhotra",
    email: "vikram@apexlogistics.in",
    phone: "+91 98201 54321",
    company: "Apex Logistics Ltd",
    gst_number: "27AABCA1234F1Z5",
    avatar_url: "/testimonials/vikram.webp",
    total_spent: 129798,
    projects_count: 2,
    active_renewals: 1,
    created_at: "2026-08-14T10:00:00.000Z",
    orders: [
      {
        order_number: "WSP-10492",
        plan_name: "Ultimate E-Commerce Suite",
        amount: 64899,
        status: "paid",
        date: "17 Oct 2026",
      },
      {
        order_number: "WSP-10214",
        plan_name: "Custom Web App MVP",
        amount: 64899,
        status: "paid",
        date: "14 Aug 2026",
      },
    ],
  },
  {
    id: "cli-2",
    name: "Dr. Ananya Sen",
    email: "ananya@senskin.clinic",
    phone: "+91 99345 67890",
    company: "Senskin Dermatology Clinic",
    gst_number: "07AAACS9876K1Z2",
    avatar_url: "/testimonials/ananya.webp",
    total_spent: 34498,
    projects_count: 1,
    active_renewals: 1,
    created_at: "2026-09-02T12:30:00.000Z",
    orders: [
      {
        order_number: "WSP-10491",
        plan_name: "Growth Business Pro",
        amount: 29499,
        status: "paid",
        date: "16 Oct 2026",
      },
      {
        order_number: "WSP-10330",
        plan_name: "Cloud Domain & SSL Renewal",
        amount: 4999,
        status: "paid",
        date: "02 Sep 2026",
      },
    ],
  },
  {
    id: "cli-3",
    name: "Rohan Singhal",
    email: "rohan@finedge.com",
    phone: "+91 98711 22334",
    company: "FinEdge Wealth Advisory",
    gst_number: "29AABCF4567M1Z8",
    avatar_url: "/testimonials/sameer.webp",
    total_spent: 37799,
    projects_count: 1,
    active_renewals: 1,
    created_at: "2026-09-20T16:15:00.000Z",
    orders: [
      {
        order_number: "WSP-10489",
        plan_name: "E-Commerce Starter",
        amount: 37799,
        status: "paid",
        date: "10 Oct 2026",
      },
    ],
  },
  {
    id: "cli-4",
    name: "Pooja Verma",
    email: "pooja@artisanalbakes.in",
    phone: "+91 97123 45678",
    company: "Artisanal Bakes & Café",
    avatar_url: "/testimonials/pooja.webp",
    total_spent: 25000,
    projects_count: 1,
    active_renewals: 0,
    created_at: "2026-10-01T09:40:00.000Z",
    orders: [
      {
        order_number: "WSP-10480",
        plan_name: "SEO & Growth Engine (Month 1)",
        amount: 25000,
        status: "paid",
        date: "01 Oct 2026",
      },
    ],
  },
];

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientRecord[]>(initialMockClients);
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(null);

  const supabase = useMemo(() => createBrowserClient(), []);

  const fetchClients = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        // Map profiles to clients
        const mapped = data.map((p) => ({
          id: p.id,
          name: p.full_name || p.email.split("@")[0],
          email: p.email,
          phone: p.phone || "Not provided",
          company: p.company || "Individual",
          gst_number: p.gst_number || undefined,
          avatar_url: p.avatar_url || undefined,
          total_spent: 35000,
          projects_count: 1,
          active_renewals: 1,
          created_at: p.created_at,
          orders: [],
        }));
        setClients(mapped);
      }
    } catch {
      // Demo safety
    }
  }, [supabase]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const columns: Column<ClientRecord>[] = [
    {
      key: "name",
      header: "Client & Company",
      sortable: true,
      render: (client) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden relative flex-shrink-0 border border-slate-200">
            {client.avatar_url ? (
              <Image src={client.avatar_url} alt={client.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-slate-700 text-xs">
                {client.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <button
              onClick={() => setSelectedClient(client)}
              className="font-bold text-slate-900 hover:text-accent transition-colors text-xs text-left"
            >
              {client.name}
            </button>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Building className="w-3 h-3" />
              <span>{client.company}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Contact Details",
      render: (client) => (
        <div className="space-y-0.5 text-xs">
          <p className="font-semibold text-slate-700">{client.phone}</p>
          <a
            href={`mailto:${client.email}`}
            className="text-[11px] text-slate-400 hover:text-slate-600 block truncate"
          >
            {client.email}
          </a>
        </div>
      ),
    },
    {
      key: "projects_count",
      header: "Projects & Assets",
      render: (client) => (
        <div className="text-xs text-slate-600">
          <p className="font-bold text-slate-800">{client.projects_count} Active Project</p>
          <p className="text-[10px] text-slate-400">{client.active_renewals} Cloud Renewal</p>
        </div>
      ),
    },
    {
      key: "total_spent",
      header: "Lifetime Value (LTV)",
      sortable: true,
      render: (client) => (
        <div>
          <span className="font-extrabold text-slate-900 text-xs">
            ₹{client.total_spent.toLocaleString("en-IN")}
          </span>
          <p className="text-[10px] text-emerald-600 font-semibold">Tier 1 Valued Client</p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (client) => (
        <div className="flex items-center justify-end gap-1.5">
          <a
            href={`tel:${client.phone}`}
            className="p-1.5 text-slate-400 hover:text-accent rounded-lg hover:bg-blue-50 transition-colors"
            title="Call"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
          <a
            href={`https://wa.me/${client.phone.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
            title="WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </a>
          <Button
            variant="secondary"
            onClick={() => setSelectedClient(client)}
            className="text-[11px] px-2.5 py-1 h-7 rounded-lg"
          >
            Profile
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        onMobileMenuToggle={() => {}}
        title="Client Accounts & Lifetime Value"
        subtitle="Manage client profiles, corporate GST details, invoice records, and service renewals."
      />

      <div className="px-4 sm:px-6 space-y-6 max-w-7xl mx-auto">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400">Total Client Base</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{clients.length}</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-accent flex items-center justify-center">
              <Users2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400">Total Customer Revenue</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                ₹{clients.reduce((acc, c) => acc + c.total_spent, 0).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400">Average Client LTV</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                ₹{Math.round(
                  clients.reduce((acc, c) => acc + c.total_spent, 0) / Math.max(1, clients.length)
                ).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={clients}
          searchPlaceholder="Search clients by name, company, email, phone..."
          searchKeys={["name", "company", "email", "phone"]}
          onRowClick={(client) => setSelectedClient(client)}
        />
      </div>

      {/* CLIENT PROFILE DRAWER */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setSelectedClient(null)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl z-10 flex flex-col border-l border-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden relative border border-slate-200">
                  {selectedClient.avatar_url ? (
                    <Image
                      src={selectedClient.avatar_url}
                      alt={selectedClient.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-700">
                      {selectedClient.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{selectedClient.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedClient.company}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedClient(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="px-6 py-3 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Direct Contact:</span>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedClient.phone}`}
                  className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-blue-50 text-accent font-bold rounded-lg border border-blue-200 shadow-2xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/${selectedClient.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-2xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`mailto:${selectedClient.email}`}
                  className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Account Details Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                  Corporate & Tax Details
                </h4>
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-semibold text-slate-800">{selectedClient.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-semibold text-slate-800">{selectedClient.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">GSTIN Number:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedClient.gst_number || "Not Registered (B2C)"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Client Since:</span>
                    <span className="text-slate-700">
                      {new Date(selectedClient.created_at).toLocaleDateString("en-IN", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-900 font-bold">
                    <span>Cumulative Lifetime Value:</span>
                    <span className="text-accent text-sm">
                      ₹{selectedClient.total_spent.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                  Orders & Transaction Ledger
                </h4>
                <div className="space-y-2">
                  {selectedClient.orders.map((ord) => (
                    <div
                      key={ord.order_number}
                      className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-800 font-mono text-[11px]">
                          {ord.order_number}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {ord.plan_name} • {ord.date}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-xs">
                          ₹{ord.amount.toLocaleString("en-IN")}
                        </span>
                        <Link
                          href={`/checkout/invoice/${ord.order_number}`}
                          target="_blank"
                          className="p-1 text-slate-400 hover:text-accent"
                          title="Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
