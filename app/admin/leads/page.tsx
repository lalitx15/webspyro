"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  LayoutList,
  Kanban,
  Download,
  Plus,
  Phone,
  MessageSquare,
  Mail,
  Building,
  Trash2,
  X,
  Send,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { DataTable, Column } from "@/components/admin/data-table";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { Button } from "@/components/ui/button";
import { Lead, LeadNote, LeadActivity } from "@/types";
import { createBrowserClient } from "@/lib/supabase/client";

// Initial Seed Sample Leads for high-fidelity admin operation
const initialMockLeads: Lead[] = [
  {
    id: "lead-101",
    name: "Vikram Malhotra",
    company: "Apex Logistics Ltd",
    phone: "+91 98201 54321",
    email: "vikram@apexlogistics.in",
    business_type: "Supply Chain & Logistics",
    service_interested: "E-Commerce Website",
    message: "We need an end-to-end B2B tracking and consignment booking portal with Razorpay and GST invoices.",
    source: "Quote Wizard",
    status: "new",
    budget: "₹85,000",
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    lead_notes: [
      {
        id: "note-1",
        lead_id: "lead-101",
        author_name: "Admin",
        note: "Submitted through quote wizard from Mumbai IP. High intent lead.",
        created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
    ],
    lead_activity: [
      {
        id: "act-1",
        lead_id: "lead-101",
        action: "Lead Created",
        old_status: null,
        new_status: "new",
        created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "lead-102",
    name: "Dr. Ananya Sen",
    company: "Senskin Dermatology",
    phone: "+91 99345 67890",
    email: "ananya@senskin.clinic",
    business_type: "Healthcare / Clinic",
    service_interested: "Business Website",
    message: "Looking for a clean medical clinic website with appointment booking integration and doctor bio pages.",
    source: "Hero CTA",
    status: "contacted",
    budget: "₹35,000",
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    lead_notes: [
      {
        id: "note-2",
        lead_id: "lead-102",
        author_name: "Lalit (Architect)",
        note: "Spoke on phone for 10 mins. Sent portfolio link on WhatsApp. Follow up scheduled for tomorrow 3 PM.",
        created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      },
    ],
    lead_activity: [
      {
        id: "act-2",
        lead_id: "lead-102",
        action: "Status Changed to Contacted",
        old_status: "new",
        new_status: "contacted",
        created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "lead-103",
    name: "Rohan Singhal",
    company: "FinEdge Wealth Advisors",
    phone: "+91 98711 22334",
    email: "rohan@finedgeadvisors.com",
    business_type: "Financial Services",
    service_interested: "Web Application",
    message: "Custom financial calculation dashboard with dynamic client charts, SIP planners, and lead captures.",
    source: "Contact Page",
    status: "qualified",
    budget: "₹1,45,000",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    lead_notes: [
      {
        id: "note-3",
        lead_id: "lead-103",
        author_name: "Admin",
        note: "NDA signed. Scope of work document shared for review.",
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ],
    lead_activity: [
      {
        id: "act-3",
        lead_id: "lead-103",
        action: "Marked as Qualified Lead",
        old_status: "contacted",
        new_status: "qualified",
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "lead-104",
    name: "Pooja Verma",
    company: "Artisanal Bakes & Café",
    phone: "+91 97123 45678",
    email: "pooja@artisanalbakes.in",
    business_type: "Food & Beverage",
    service_interested: "SEO & Growth",
    message: "Rank our bakery in top 3 Google local results in Indiranagar, Bangalore, and run targeted Instagram promotions.",
    source: "Pricing Table",
    status: "won",
    budget: "₹25,000/mo",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    lead_notes: [
      {
        id: "note-4",
        lead_id: "lead-104",
        author_name: "Sales",
        note: "First month advance payment of ₹25,000 received via Razorpay. Onboarding started.",
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
    lead_activity: [
      {
        id: "act-4",
        lead_id: "lead-104",
        action: "Deal Closed - Won",
        old_status: "qualified",
        new_status: "won",
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "lead-105",
    name: "Harsh Vardhan",
    company: "HV Auto Spares",
    phone: "+91 98450 11223",
    email: "harsh@hvautospares.com",
    business_type: "Automotive Retail",
    service_interested: "Business Website",
    message: "Need a catalog website showing automotive spare parts with WhatsApp inquiry button on every part.",
    source: "Direct WhatsApp",
    status: "lost",
    budget: "₹15,000",
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    lead_notes: [
      {
        id: "note-5",
        lead_id: "lead-105",
        author_name: "Sales",
        note: "Client budget was below minimum agency threshold for custom engineering. Referred to DIY builder.",
        created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      },
    ],
    lead_activity: [
      {
        id: "act-5",
        lead_id: "lead-105",
        action: "Marked as Lost",
        old_status: "contacted",
        new_status: "lost",
        created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
];

type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";

const KANBAN_STAGES: { id: LeadStatus; label: string; color: string; badgeClass: string }[] = [
  { id: "new", label: "New Inquiries", color: "border-blue-400", badgeClass: "bg-blue-50 text-accent border-blue-200" },
  { id: "contacted", label: "Contacted", color: "border-amber-400", badgeClass: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "qualified", label: "Qualified", color: "border-purple-400", badgeClass: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "won", label: "Won Deals", color: "border-emerald-400", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "lost", label: "Closed / Lost", color: "border-rose-400", badgeClass: "bg-rose-50 text-rose-700 border-rose-200" },
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialMockLeads);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState<"details" | "notes" | "activity">("details");
  const [newNoteText, setNewNoteText] = useState("");
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [confirmDeleteLead, setConfirmDeleteLead] = useState<Lead | null>(null);
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    service_interested: "Business Website",
    budget: "₹35,000",
    message: "",
    source: "Admin Manual",
    status: "new" as LeadStatus,
  });

  const supabase = useMemo(() => createBrowserClient(), []);

  // Fetch live leads from Supabase on load
  const fetchLiveLeads = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*, lead_notes(*), lead_activity(*)")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        // Merge with initialMockLeads to avoid losing test records
        const liveIds = new Set(data.map((d: { id: string }) => d.id));
        const merged = [
          ...(data as unknown as Lead[]),
          ...initialMockLeads.filter((m) => !liveIds.has(m.id)),
        ];
        setLeads(merged);
      }
    } catch (err) {
      console.warn("Could not fetch remote leads, using local state:", err);
    }
  }, [supabase]);

  useEffect(() => {
    fetchLiveLeads();
  }, [fetchLiveLeads]);

  // Update lead status
  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    const currentLead = leads.find((l) => l.id === leadId);
    if (!currentLead || currentLead.status === newStatus) return;

    const oldStatus = currentLead.status;
    const activityEntry: LeadActivity = {
      id: `act-${Date.now()}`,
      lead_id: leadId,
      action: `Status updated to ${newStatus}`,
      old_status: oldStatus,
      new_status: newStatus,
      created_at: new Date().toISOString(),
    };

    const updated = leads.map((l) => {
      if (l.id === leadId) {
        const nextActivities = [activityEntry, ...(l.lead_activity || [])];
        return { ...l, status: newStatus, lead_activity: nextActivities };
      }
      return l;
    });

    setLeads(updated);
    if (selectedLead?.id === leadId) {
      setSelectedLead({
        ...selectedLead,
        status: newStatus,
        lead_activity: [activityEntry, ...(selectedLead.lead_activity || [])],
      });
    }

    // Attempt remote update in Supabase
    try {
      await supabase
        .from("leads")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", leadId);
    } catch {
      // Ignored for demo safety
    }
  };

  // Add internal note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedLead) return;

    const newNote: LeadNote = {
      id: `note-${Date.now()}`,
      lead_id: selectedLead.id,
      author_name: "Admin",
      note: newNoteText.trim(),
      created_at: new Date().toISOString(),
    };

    const updatedLeads = leads.map((l) => {
      if (l.id === selectedLead.id) {
        return {
          ...l,
          lead_notes: [newNote, ...(l.lead_notes || [])],
        };
      }
      return l;
    });

    setLeads(updatedLeads);
    setSelectedLead({
      ...selectedLead,
      lead_notes: [newNote, ...(selectedLead.lead_notes || [])],
    });
    setNewNoteText("");

    // Remote persistence
    try {
      await supabase.from("lead_notes").insert({
        lead_id: selectedLead.id,
        note: newNote.note,
      });
    } catch {
      // Demo safety
    }
  };

  // Delete lead
  const handleDeleteLead = async () => {
    if (!confirmDeleteLead) return;

    const next = leads.filter((l) => l.id !== confirmDeleteLead.id);
    setLeads(next);
    if (selectedLead?.id === confirmDeleteLead.id) {
      setSelectedLead(null);
    }
    setConfirmDeleteLead(null);

    try {
      await supabase.from("leads").delete().eq("id", confirmDeleteLead.id);
    } catch {
      // Demo safety
    }
  };

  // Add new lead form submission
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.phone) return;

    const newId = `lead-${Date.now()}`;
    const leadRecord: Lead = {
      id: newId,
      name: newLeadForm.name.trim(),
      phone: newLeadForm.phone.trim(),
      email: newLeadForm.email.trim() || undefined,
      company: newLeadForm.company.trim() || undefined,
      service_interested: newLeadForm.service_interested,
      budget: newLeadForm.budget,
      message: newLeadForm.message.trim() || undefined,
      source: newLeadForm.source,
      status: newLeadForm.status,
      created_at: new Date().toISOString(),
      lead_notes: newLeadForm.message
        ? [
            {
              id: `note-${Date.now()}`,
              lead_id: newId,
              author_name: "Admin",
              note: newLeadForm.message,
              created_at: new Date().toISOString(),
            },
          ]
        : [],
      lead_activity: [
        {
          id: `act-${Date.now()}`,
          lead_id: newId,
          action: "Lead created manually in admin",
          old_status: null,
          new_status: newLeadForm.status,
          created_at: new Date().toISOString(),
        },
      ],
    };

    setLeads([leadRecord, ...leads]);
    setIsAddLeadModalOpen(false);
    setNewLeadForm({
      name: "",
      phone: "",
      email: "",
      company: "",
      service_interested: "Business Website",
      budget: "₹35,000",
      message: "",
      source: "Admin Manual",
      status: "new",
    });

    try {
      await supabase.from("leads").insert({
        id: newId,
        name: leadRecord.name,
        phone: leadRecord.phone,
        email: leadRecord.email || null,
        company: leadRecord.company || null,
        service_interested: leadRecord.service_interested,
        message: leadRecord.message || null,
        source: leadRecord.source,
        status: leadRecord.status,
      });
    } catch {
      // Demo safety
    }
  };

  // CSV Export
  const handleExportCSV = (recordsToExport: Lead[] = leads) => {
    const headers = [
      "Lead ID",
      "Name",
      "Phone",
      "Email",
      "Company",
      "Service Interested",
      "Budget",
      "Source",
      "Status",
      "Created Date",
    ];

    const rows = recordsToExport.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email || ""}"`,
      `"${(l.company || "").replace(/"/g, '""')}"`,
      `"${l.service_interested || ""}"`,
      `"${l.budget || ""}"`,
      `"${l.source || ""}"`,
      `"${l.status}"`,
      `"${new Date(l.created_at).toLocaleDateString("en-IN")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `webspyra-leads-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Leads for table
  const filteredLeads = useMemo(() => {
    if (statusFilter === "all") return leads;
    return leads.filter((l) => l.status === statusFilter);
  }, [leads, statusFilter]);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: leads.length };
    KANBAN_STAGES.forEach((s) => {
      counts[s.id] = leads.filter((l) => l.status === s.id).length;
    });
    return counts;
  }, [leads]);

  // Columns definition for DataTable
  const columns: Column<Lead>[] = [
    {
      key: "name",
      header: "Lead & Company",
      sortable: true,
      render: (lead) => (
        <div>
          <button
            onClick={() => setSelectedLead(lead)}
            className="text-left font-bold text-slate-900 hover:text-accent transition-colors"
          >
            {lead.name}
          </button>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
            <Building className="w-3 h-3 text-slate-300" />
            <span>{lead.company || "Individual / Startup"}</span>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (lead) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 text-xs">{lead.phone}</span>
            <div className="flex items-center gap-1">
              <a
                href={`tel:${lead.phone}`}
                className="p-1 text-slate-400 hover:text-accent hover:bg-blue-50 rounded"
                title="Call"
              >
                <Phone className="w-3 h-3" />
              </a>
              <a
                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                title="WhatsApp"
              >
                <MessageSquare className="w-3 h-3" />
              </a>
            </div>
          </div>
          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="text-[11px] text-slate-400 hover:text-slate-600 truncate block max-w-[160px]"
            >
              {lead.email}
            </a>
          )}
        </div>
      ),
    },
    {
      key: "service_interested",
      header: "Service Interested",
      sortable: true,
      render: (lead) => (
        <div>
          <span className="font-semibold text-slate-800">
            {lead.service_interested || "General Inquiry"}
          </span>
          {lead.budget && (
            <div className="text-[11px] text-slate-500 font-medium">
              Budget: <strong className="text-slate-700">{lead.budget}</strong>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "source",
      header: "Source",
      sortable: true,
      render: (lead) => (
        <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
          {lead.source}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (lead) => {
        const stage = KANBAN_STAGES.find((s) => s.id === lead.status);
        return (
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
            onClick={(e) => e.stopPropagation()}
            className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent ${
              stage?.badgeClass || "bg-slate-100 text-slate-700"
            }`}
          >
            {KANBAN_STAGES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      key: "created_at",
      header: "Received",
      sortable: true,
      render: (lead) => (
        <div className="text-xs text-slate-500">
          <p className="font-medium text-slate-700">
            {new Date(lead.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </p>
          <p className="text-[10px] text-slate-400">
            {new Date(lead.created_at).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (lead) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="secondary"
            onClick={() => setSelectedLead(lead)}
            className="text-[11px] px-2.5 py-1 h-7 rounded-lg"
          >
            Details
          </Button>
          <button
            onClick={() => setConfirmDeleteLead(lead)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Delete Lead"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        onMobileMenuToggle={() => {}}
        title="Leads & Inquiries CRM"
        subtitle="Manage prospective clients, track consultation pipelines, and close deals."
        onNewLeadClick={() => setIsAddLeadModalOpen(true)}
      />

      <div className="px-4 sm:px-6 space-y-6 max-w-7xl mx-auto">
        {/* Controls Bar: View Toggle, Status Pills, Export CSV */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                statusFilter === "all"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>All Leads</span>
              <span className="text-[10px] opacity-75">({statusCounts.all})</span>
            </button>

            {KANBAN_STAGES.map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  statusFilter === s.id
                    ? "bg-accent text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{s.label}</span>
                <span className="text-[10px] opacity-80">({statusCounts[s.id] || 0})</span>
              </button>
            ))}
          </div>

          {/* Right: View switcher & CSV Export */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* View Mode Switcher */}
            <div className="bg-slate-100 p-1 rounded-2xl flex items-center">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === "table"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Table List View"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === "kanban"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Kanban Board View"
              >
                <Kanban className="w-4 h-4" />
              </button>
            </div>

            {/* Export CSV Button */}
            <Button
              variant="secondary"
              onClick={() => handleExportCSV(filteredLeads)}
              className="text-xs px-3.5 py-1.5 h-9 rounded-2xl gap-1.5 font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>

            {/* Add Lead Button */}
            <Button
              variant="primary"
              onClick={() => setIsAddLeadModalOpen(true)}
              className="text-xs px-3.5 py-1.5 h-9 rounded-2xl gap-1.5 shadow-md shadow-accent/20 font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Lead</span>
            </Button>
          </div>
        </div>

        {/* VIEW 1: TABLE VIEW */}
        {viewMode === "table" && (
          <DataTable
            columns={columns}
            data={filteredLeads}
            searchPlaceholder="Search leads by name, phone, company, email..."
            searchKeys={["name", "company", "phone", "email", "service_interested"]}
            bulkActions={(selectedIds, clearSelection) => (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const next = leads.map((l) =>
                      selectedIds.includes(l.id) ? { ...l, status: "contacted" as LeadStatus } : l
                    );
                    setLeads(next);
                    clearSelection();
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition-colors"
                >
                  Mark Contacted
                </button>
                <button
                  onClick={() => {
                    const toExport = leads.filter((l) => selectedIds.includes(l.id));
                    handleExportCSV(toExport);
                    clearSelection();
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition-colors"
                >
                  Export ({selectedIds.length})
                </button>
                <button
                  onClick={() => {
                    const next = leads.filter((l) => !selectedIds.includes(l.id));
                    setLeads(next);
                    clearSelection();
                  }}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold border border-rose-200 transition-colors"
                >
                  Delete ({selectedIds.length})
                </button>
              </div>
            )}
            onRowClick={(lead) => setSelectedLead(lead)}
          />
        )}

        {/* VIEW 2: KANBAN BOARD VIEW */}
        {viewMode === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
            {KANBAN_STAGES.map((stage) => {
              const stageLeads = leads.filter((l) => l.status === stage.id);

              return (
                <div
                  key={stage.id}
                  className="bg-slate-100/70 rounded-3xl p-3 border border-slate-200/80 flex flex-col min-h-[500px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200/60 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full border-2 ${stage.color} bg-white`} />
                      <h4 className="text-xs font-bold text-slate-800">{stage.label}</h4>
                    </div>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-2xs">
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Cards Container */}
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:shadow-md hover:border-accent/40 transition-all cursor-pointer space-y-3 group"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h5 className="text-sm font-bold text-slate-900 group-hover:text-accent transition-colors">
                              {lead.name}
                            </h5>
                            {lead.budget && (
                              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                                {lead.budget}
                              </span>
                            )}
                          </div>
                          {lead.company && (
                            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                              {lead.company}
                            </p>
                          )}
                        </div>

                        <div className="text-[11px] font-semibold text-slate-600 bg-slate-50 px-2 py-1 rounded-lg truncate">
                          {lead.service_interested}
                        </div>

                        {lead.message && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {lead.message}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                          <span>
                            {new Date(lead.created_at).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>

                          <div
                            className="flex items-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <a
                              href={`tel:${lead.phone}`}
                              className="p-1 hover:text-accent rounded"
                              title="Call"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 hover:text-emerald-600 rounded"
                              title="WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>

                        {/* Quick Move Stage Controls */}
                        <div
                          className="pt-1 flex items-center justify-between text-[10px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-slate-400">Move:</span>
                          <div className="flex items-center gap-1">
                            {KANBAN_STAGES.filter((s) => s.id !== lead.status).slice(0, 2).map((target) => (
                              <button
                                key={target.id}
                                onClick={() => handleStatusChange(lead.id, target.id)}
                                className="px-1.5 py-0.5 bg-slate-100 hover:bg-accent hover:text-white rounded text-[10px] font-semibold transition-colors"
                              >
                                {target.label.split(" ")[0]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    {stageLeads.length === 0 && (
                      <div className="py-12 text-center text-xs text-slate-400 font-medium">
                        No leads in {stage.label.toLowerCase()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DRAWER: LEAD DETAILS & NOTES */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setSelectedLead(null)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl z-10 flex flex-col border-l border-slate-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {selectedLead.name}
                  </h3>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      KANBAN_STAGES.find((s) => s.id === selectedLead.status)?.badgeClass || ""
                    }`}
                  >
                    {selectedLead.status}
                  </span>
                </div>
                {selectedLead.company && (
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {selectedLead.company}
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Contact Bar */}
            <div className="px-6 py-3 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Quick Contact:</span>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-blue-50 text-accent font-bold rounded-lg border border-blue-200 shadow-2xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-2xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                {selectedLead.email && (
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                )}
              </div>
            </div>

            {/* Drawer Tabs */}
            <div className="flex items-center border-b border-slate-100 px-6 bg-white text-xs font-bold text-slate-500">
              <button
                onClick={() => setActiveDrawerTab("details")}
                className={`py-3 px-3 border-b-2 transition-all ${
                  activeDrawerTab === "details"
                    ? "border-accent text-accent"
                    : "border-transparent hover:text-slate-800"
                }`}
              >
                Lead Profile
              </button>
              <button
                onClick={() => setActiveDrawerTab("notes")}
                className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeDrawerTab === "notes"
                    ? "border-accent text-accent"
                    : "border-transparent hover:text-slate-800"
                }`}
              >
                <span>Internal Notes</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full font-extrabold">
                  {selectedLead.lead_notes?.length || 0}
                </span>
              </button>
              <button
                onClick={() => setActiveDrawerTab("activity")}
                className={`py-3 px-3 border-b-2 transition-all ${
                  activeDrawerTab === "activity"
                    ? "border-accent text-accent"
                    : "border-transparent hover:text-slate-800"
                }`}
              >
                Activity Timeline
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: DETAILS */}
              {activeDrawerTab === "details" && (
                <div className="space-y-6 text-xs">
                  {/* Status Switcher Box */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <label className="font-bold text-slate-700 block">Current Pipeline Stage</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {KANBAN_STAGES.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleStatusChange(selectedLead.id, s.id)}
                          className={`py-1.5 px-2 rounded-xl font-bold transition-all text-[11px] ${
                            selectedLead.status === s.id
                              ? "bg-accent text-white shadow-sm"
                              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Profile Key Value Table */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                      Contact & Business Info
                    </h4>
                    <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100">
                      <div className="py-2.5 px-3 flex justify-between">
                        <span className="text-slate-400">Phone Number:</span>
                        <span className="font-bold text-slate-800">{selectedLead.phone}</span>
                      </div>
                      <div className="py-2.5 px-3 flex justify-between">
                        <span className="text-slate-400">Email Address:</span>
                        <span className="font-bold text-slate-800">{selectedLead.email || "Not provided"}</span>
                      </div>
                      <div className="py-2.5 px-3 flex justify-between">
                        <span className="text-slate-400">Company Name:</span>
                        <span className="font-bold text-slate-800">{selectedLead.company || "Individual"}</span>
                      </div>
                      <div className="py-2.5 px-3 flex justify-between">
                        <span className="text-slate-400">Industry / Type:</span>
                        <span className="font-bold text-slate-800">{selectedLead.business_type || "Commercial"}</span>
                      </div>
                      <div className="py-2.5 px-3 flex justify-between">
                        <span className="text-slate-400">Service Demanded:</span>
                        <span className="font-bold text-accent">{selectedLead.service_interested}</span>
                      </div>
                      <div className="py-2.5 px-3 flex justify-between">
                        <span className="text-slate-400">Budget Range:</span>
                        <span className="font-bold text-emerald-700">{selectedLead.budget || "Flexible"}</span>
                      </div>
                      <div className="py-2.5 px-3 flex justify-between">
                        <span className="text-slate-400">Lead Source:</span>
                        <span className="font-semibold text-slate-700">{selectedLead.source}</span>
                      </div>
                      <div className="py-2.5 px-3 flex justify-between">
                        <span className="text-slate-400">Received Date:</span>
                        <span className="font-semibold text-slate-700">
                          {new Date(selectedLead.created_at).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Requirements Message */}
                  {selectedLead.message && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                        Client Message / Requirement
                      </h4>
                      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-700 leading-relaxed italic">
                        &quot;{selectedLead.message}&quot;
                      </div>
                    </div>
                  )}

                  {/* Danger Zone */}
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-slate-400">Remove from CRM:</span>
                    <Button
                      variant="danger"
                      onClick={() => setConfirmDeleteLead(selectedLead)}
                      className="text-xs px-3 py-1.5 h-8 gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Lead</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB 2: INTERNAL NOTES */}
              {activeDrawerTab === "notes" && (
                <div className="space-y-5 text-xs">
                  {/* Add Note Form */}
                  <form onSubmit={handleAddNote} className="space-y-2">
                    <label className="font-bold text-slate-700 block">
                      Add Internal Discussion Note
                    </label>
                    <textarea
                      rows={3}
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="e.g. Spoke to client on phone, agreed on ₹50k advance. Sending contract tomorrow."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent text-xs resize-none"
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={!newNoteText.trim()}
                        className="text-xs px-3.5 py-1.5 h-8 gap-1.5 font-bold shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Save Note</span>
                      </Button>
                    </div>
                  </form>

                  {/* Notes List */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <h5 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                      History of Notes ({selectedLead.lead_notes?.length || 0})
                    </h5>

                    {selectedLead.lead_notes && selectedLead.lead_notes.length > 0 ? (
                      selectedLead.lead_notes.map((n) => (
                        <div
                          key={n.id}
                          className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-slate-700">{n.author_name || "Admin"}</span>
                            <span className="text-slate-400">
                              {new Date(n.created_at).toLocaleString("en-IN", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-slate-700 leading-relaxed text-xs">{n.note}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 py-6 text-center italic">
                        No notes added yet for this client.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: ACTIVITY TIMELINE */}
              {activeDrawerTab === "activity" && (
                <div className="space-y-4 text-xs">
                  <h5 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                    Audit Trail & Lifecycle Events
                  </h5>

                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {(selectedLead.lead_activity || [
                      {
                        id: "init",
                        lead_id: selectedLead.id,
                        action: "Inbound Lead Captured",
                        created_at: selectedLead.created_at,
                      },
                    ]).map((act) => (
                      <div key={act.id} className="relative">
                        <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-white" />
                        <div>
                          <p className="font-bold text-slate-800">{act.action}</p>
                          <span className="text-[10px] text-slate-400">
                            {new Date(act.created_at).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW MANUAL LEAD */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddLeadModalOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Record New Lead
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Log phone inquiries, walk-ins, or WhatsApp prospects manually.
                </p>
              </div>
              <button
                onClick={() => setIsAddLeadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    placeholder="ramesh@company.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Company / Brand
                  </label>
                  <input
                    type="text"
                    value={newLeadForm.company}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
                    placeholder="Kumar Retail Solutions"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Service Interested
                  </label>
                  <select
                    value={newLeadForm.service_interested}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, service_interested: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="Business Website">Business Website</option>
                    <option value="E-Commerce Website">E-Commerce Website</option>
                    <option value="Web Application">Web Application</option>
                    <option value="SEO & Growth">SEO & Growth</option>
                    <option value="Maintenance & AMC">Maintenance & AMC</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Estimated Budget
                  </label>
                  <input
                    type="text"
                    value={newLeadForm.budget}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, budget: e.target.value })}
                    placeholder="e.g. ₹45,000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Inquiry Details / Client Message
                </label>
                <textarea
                  rows={3}
                  value={newLeadForm.message}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, message: e.target.value })}
                  placeholder="Notes about client requirements, features requested, target launch date..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="text-xs px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="text-xs px-5 py-2 shadow-md shadow-accent/20 font-bold"
                >
                  Save Lead Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(confirmDeleteLead)}
        onClose={() => setConfirmDeleteLead(null)}
        onConfirm={handleDeleteLead}
        title="Delete Lead Record?"
        description={`Are you sure you want to permanently delete "${confirmDeleteLead?.name}" from your CRM? This action cannot be reversed.`}
        confirmText="Delete Record"
        variant="danger"
      />
    </div>
  );
}
