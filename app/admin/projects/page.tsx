"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  X,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { DataTable, Column } from "@/components/admin/data-table";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { Button } from "@/components/ui/button";
import { ClientProject, ProjectStatus } from "@/types";
import { createBrowserClient } from "@/lib/supabase/client";

const STAGES: { id: ProjectStatus; label: string; stepNumber: number; color: string }[] = [
  { id: "brief", label: "Brief & Wireframes", stepNumber: 1, color: "bg-blue-500" },
  { id: "design", label: "UI/UX Design", stepNumber: 2, color: "bg-indigo-500" },
  { id: "development", label: "Full-Stack Dev", stepNumber: 3, color: "bg-purple-500" },
  { id: "review", label: "Client Revision", stepNumber: 4, color: "bg-amber-500" },
  { id: "live", label: "Launched Live", stepNumber: 5, color: "bg-emerald-500" },
];

const initialMockProjects: ClientProject[] = [
  {
    id: "proj-1",
    client_name: "Vikram Malhotra",
    client_email: "vikram@apexlogistics.in",
    client_phone: "+91 98201 54321",
    project_name: "Apex Logistics B2B Fleet Platform",
    service_type: "Custom Web Application",
    staging_url: "https://staging-apex.webspyra.com",
    current_stage: "development",
    progress_percentage: 65,
    assigned_architect: "Lalit (Principal Engineer)",
    start_date: "2026-10-10",
    target_launch_date: "2026-10-28",
    notes: "API integrations for vehicle GPS completed. Finishing Razorpay invoice engine.",
    created_at: "2026-10-10T09:00:00.000Z",
  },
  {
    id: "proj-2",
    client_name: "Dr. Ananya Sen",
    client_email: "ananya@senskin.clinic",
    client_phone: "+91 99345 67890",
    project_name: "Senskin Clinic Medical Showcase",
    service_type: "Business Website",
    staging_url: "https://staging-senskin.webspyra.com",
    current_stage: "review",
    progress_percentage: 90,
    assigned_architect: "Sarah K. (Senior Designer)",
    start_date: "2026-10-08",
    target_launch_date: "2026-10-20",
    notes: "Doctor approved initial revision. Pointing DNS records to Cloudflare edge.",
    created_at: "2026-10-08T11:30:00.000Z",
  },
  {
    id: "proj-3",
    client_name: "Sameer Joshi",
    client_email: "sameer@artisanalbakes.in",
    client_phone: "+91 97123 45678",
    project_name: "Artisanal Bakes D2C Store",
    service_type: "E-Commerce Website",
    staging_url: "https://staging-bakes.webspyra.com",
    current_stage: "brief",
    progress_percentage: 20,
    assigned_architect: "Dev Team Lead",
    start_date: "2026-10-15",
    target_launch_date: "2026-10-31",
    notes: "Collecting product photos and catalogue spreadsheet from client.",
    created_at: "2026-10-15T14:00:00.000Z",
  },
  {
    id: "proj-4",
    client_name: "Rohan Singhal",
    client_email: "rohan@finedge.com",
    client_phone: "+91 98711 22334",
    project_name: "FinEdge Wealth Advisory Hub",
    service_type: "Web Application",
    staging_url: "https://finedge.demo",
    current_stage: "live",
    progress_percentage: 100,
    assigned_architect: "Lalit (Principal Engineer)",
    start_date: "2026-09-15",
    target_launch_date: "2026-10-10",
    notes: "Successfully deployed and live. Client portal credentials activated.",
    created_at: "2026-09-15T10:00:00.000Z",
  },
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ClientProject[]>(initialMockProjects);
  const [editingProject, setEditingProject] = useState<ClientProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<ClientProject | null>(null);

  const supabase = useMemo(() => createBrowserClient(), []);

  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("client_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setProjects(data as unknown as ClientProject[]);
      }
    } catch {
      // Demo safety
    }
  }, [supabase]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleUpdateStage = async (projectId: string, newStage: ProjectStatus) => {
    // Map stage to reasonable progress %
    let autoProgress = 20;
    if (newStage === "design") autoProgress = 40;
    if (newStage === "development") autoProgress = 65;
    if (newStage === "review") autoProgress = 90;
    if (newStage === "live") autoProgress = 100;

    const updated = projects.map((p) =>
      p.id === projectId
        ? { ...p, current_stage: newStage, progress_percentage: autoProgress }
        : p
    );
    setProjects(updated);

    try {
      await supabase
        .from("client_projects")
        .update({ current_stage: newStage, progress_percentage: autoProgress })
        .eq("id", projectId);
    } catch {
      // Demo fallback
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.project_name) return;

    const exists = projects.some((p) => p.id === editingProject.id);
    const updated = exists
      ? projects.map((p) => (p.id === editingProject.id ? editingProject : p))
      : [editingProject, ...projects];

    setProjects(updated);
    setIsModalOpen(false);

    try {
      await supabase.from("client_projects").upsert({
        id: editingProject.id,
        client_name: editingProject.client_name,
        client_email: editingProject.client_email,
        client_phone: editingProject.client_phone,
        project_name: editingProject.project_name,
        service_type: editingProject.service_type,
        staging_url: editingProject.staging_url,
        current_stage: editingProject.current_stage,
        progress_percentage: editingProject.progress_percentage,
        assigned_architect: editingProject.assigned_architect,
        start_date: editingProject.start_date,
        target_launch_date: editingProject.target_launch_date,
        notes: editingProject.notes,
      });
    } catch {
      // Demo fallback
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setProjects(projects.filter((p) => p.id !== confirmDelete.id));
    setConfirmDelete(null);

    try {
      await supabase.from("client_projects").delete().eq("id", confirmDelete.id);
    } catch {
      // Demo fallback
    }
  };

  const columns: Column<ClientProject>[] = [
    {
      key: "project_name",
      header: "Project & Client",
      sortable: true,
      render: (item) => (
        <div>
          <h4 className="font-bold text-slate-900 leading-snug text-xs">{item.project_name}</h4>
          <p className="text-[11px] text-slate-400">
            {item.client_name} • {item.service_type}
          </p>
        </div>
      ),
    },
    {
      key: "current_stage",
      header: "Current Milestone",
      render: (item) => {
        const stage = STAGES.find((s) => s.id === item.current_stage);
        return (
          <div className="space-y-1">
            <select
              value={item.current_stage}
              onChange={(e) => handleUpdateStage(item.id, e.target.value as ProjectStatus)}
              className="text-xs font-bold px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  Stage {s.stepNumber}: {s.label}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${stage?.color || "bg-accent"}`}
                  style={{ width: `${item.progress_percentage}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                {item.progress_percentage}%
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "assigned_architect",
      header: "Lead Architect",
      render: (item) => (
        <span className="text-xs font-semibold text-slate-700">{item.assigned_architect}</span>
      ),
    },
    {
      key: "target_launch_date",
      header: "Launch Target",
      sortable: true,
      render: (item) => (
        <span className="text-xs font-medium text-slate-600">
          {new Date(item.target_launch_date).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "staging_url",
      header: "Staging Preview",
      render: (item) =>
        item.staging_url ? (
          <a
            href={item.staging_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
          >
            <span>Live Staging</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-slate-400 text-xs">Provisioning</span>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => {
              setEditingProject({ ...item });
              setIsModalOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-accent rounded-lg hover:bg-blue-50 transition-colors"
            title="Edit Project"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setConfirmDelete(item)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Delete Project"
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
        title="Client Projects Tracker & Milestones"
        subtitle="Advance client milestone timelines. Updates synchronize live to customer portal dashboards."
      />

      <div className="px-4 sm:px-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Active Production Pipelines
            </h3>
            <p className="text-xs text-slate-400">Total {projects.length} managed client projects</p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setEditingProject({
                id: `proj-${Date.now()}`,
                client_name: "",
                client_email: "",
                client_phone: "",
                project_name: "",
                service_type: "Business Website",
                staging_url: "",
                current_stage: "brief",
                progress_percentage: 20,
                assigned_architect: "Lalit (Principal Engineer)",
                start_date: new Date().toISOString().split("T")[0],
                target_launch_date: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
                notes: "",
                created_at: new Date().toISOString(),
              });
              setIsModalOpen(true);
            }}
            className="text-xs px-3.5 py-1.5 h-9 rounded-2xl gap-1.5 shadow-md shadow-accent/20 font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Client Project</span>
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={projects}
          searchPlaceholder="Search projects by name, client, architect..."
          searchKeys={["project_name", "client_name", "assigned_architect"]}
        />
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 max-h-[92vh] overflow-y-auto space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {projects.some((p) => p.id === editingProject.id)
                  ? "Configure Client Project"
                  : "Create Client Project"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.project_name}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, project_name: e.target.value })
                    }
                    placeholder="e.g. Apex Logistics B2B Portal"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Client Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.client_name}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, client_name: e.target.value })
                    }
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Service Type</label>
                  <select
                    value={editingProject.service_type}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, service_type: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Business Website">Business Website</option>
                    <option value="E-Commerce Website">E-Commerce Website</option>
                    <option value="Custom Web Application">Custom Web Application</option>
                    <option value="SEO & Growth">SEO & Growth</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Milestone Stage</label>
                  <select
                    value={editingProject.current_stage}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        current_stage: e.target.value as ProjectStatus,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-accent"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.stepNumber}. {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Progress Percentage ({editingProject.progress_percentage}%)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={editingProject.progress_percentage}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        progress_percentage: Number(e.target.value),
                      })
                    }
                    className="w-full accent-accent mt-2 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Architect</label>
                  <input
                    type="text"
                    value={editingProject.assigned_architect}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, assigned_architect: e.target.value })
                    }
                    placeholder="e.g. Lalit (Principal Engineer)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Private Staging URL</label>
                  <input
                    type="url"
                    value={editingProject.staging_url || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, staging_url: e.target.value })
                    }
                    placeholder="https://staging-client.webspyra.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kickoff Date</label>
                  <input
                    type="date"
                    value={editingProject.start_date}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, start_date: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Launch Date</label>
                  <input
                    type="date"
                    value={editingProject.target_launch_date}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, target_launch_date: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Deliverables & Milestone Notes (Client Visible)
                </label>
                <textarea
                  rows={3}
                  value={editingProject.notes || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, notes: e.target.value })
                  }
                  placeholder="Notes shown on client portal dashboard..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs px-3 py-1.5"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="text-xs px-4 py-1.5 font-bold">
                  Save Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete Client Project?"
        description={`Are you sure you want to delete "${confirmDelete?.project_name}"?`}
        confirmText="Delete Project"
        variant="danger"
      />
    </div>
  );
}
