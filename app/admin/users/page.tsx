"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  Users2,
  ShieldCheck,
  Plus,
  Trash2,
  X,
  UserCheck,
  UserX,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { DataTable, Column } from "@/components/admin/data-table";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { Button } from "@/components/ui/button";
import { UserProfile, Role } from "@/types";
import { createBrowserClient } from "@/lib/supabase/client";

const initialMockUsers: UserProfile[] = [
  {
    id: "user-1",
    email: "lalit@webspyra.com",
    full_name: "Lalit (Super Administrator)",
    phone: "+91 98765 43210",
    company: "Webspyra Agency",
    role: "admin",
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "user-2",
    email: "sarah@webspyra.com",
    full_name: "Sarah Khan (Lead UI/UX)",
    phone: "+91 98111 22334",
    company: "Webspyra Agency",
    role: "admin",
    created_at: "2026-03-15T00:00:00.000Z",
  },
  {
    id: "user-3",
    email: "vikram@apexlogistics.in",
    full_name: "Vikram Malhotra",
    phone: "+91 98201 54321",
    company: "Apex Logistics Ltd",
    role: "customer",
    created_at: "2026-08-14T10:00:00.000Z",
  },
  {
    id: "user-4",
    email: "ananya@senskin.clinic",
    full_name: "Dr. Ananya Sen",
    phone: "+91 99345 67890",
    company: "Senskin Clinic",
    role: "customer",
    created_at: "2026-09-02T12:30:00.000Z",
  },
  {
    id: "user-5",
    email: "rohan@finedge.com",
    full_name: "Rohan Singhal",
    phone: "+91 98711 22334",
    company: "FinEdge Wealth",
    role: "customer",
    created_at: "2026-09-20T16:15:00.000Z",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>(initialMockUsers);
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "customer">("all");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [confirmRoleChange, setConfirmRoleChange] = useState<{
    user: UserProfile;
    targetRole: Role;
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<UserProfile | null>(null);

  const [inviteForm, setInviteForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    company: "",
    role: "admin" as Role,
  });

  const supabase = useMemo(() => createBrowserClient(), []);

  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setUsers(data as UserProfile[]);
      }
    } catch {
      // Demo safety
    }
  }, [supabase]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleExecuteRoleChange = async () => {
    if (!confirmRoleChange) return;
    const { user, targetRole } = confirmRoleChange;

    const updated = users.map((u) => (u.id === user.id ? { ...u, role: targetRole } : u));
    setUsers(updated);
    setConfirmRoleChange(null);

    try {
      await supabase.from("profiles").update({ role: targetRole }).eq("id", user.id);
    } catch {
      // Demo fallback
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.email || !inviteForm.full_name) return;

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email: inviteForm.email.toLowerCase().trim(),
      full_name: inviteForm.full_name.trim(),
      phone: inviteForm.phone.trim() || undefined,
      company: inviteForm.company.trim() || "Webspyra Agency",
      role: inviteForm.role,
      created_at: new Date().toISOString(),
    };

    setUsers([newUser, ...users]);
    setIsInviteModalOpen(false);
    setInviteForm({
      full_name: "",
      email: "",
      phone: "",
      company: "",
      role: "admin",
    });

    try {
      await supabase.from("profiles").upsert(newUser);
    } catch {
      // Demo fallback
    }
  };

  const handleDeleteUser = async () => {
    if (!confirmDelete) return;
    setUsers(users.filter((u) => u.id !== confirmDelete.id));
    setConfirmDelete(null);

    try {
      await supabase.from("profiles").delete().eq("id", confirmDelete.id);
    } catch {
      // Demo fallback
    }
  };

  const filteredUsers = useMemo(() => {
    if (roleFilter === "all") return users;
    return users.filter((u) => u.role === roleFilter);
  }, [users, roleFilter]);

  const columns: Column<UserProfile>[] = [
    {
      key: "full_name",
      header: "User & Company",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden relative border border-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-700 text-xs">
            {item.avatar_url ? (
              <Image src={item.avatar_url} alt={item.full_name || ""} fill className="object-cover" />
            ) : (
              (item.full_name || item.email).charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 leading-snug text-xs">
              {item.full_name || "Unnamed User"}
            </h4>
            <p className="text-[11px] text-slate-400">{item.company || "Webspyra Client"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Contact Email & Phone",
      sortable: true,
      render: (item) => (
        <div className="text-xs space-y-0.5">
          <p className="font-semibold text-slate-800">{item.email}</p>
          {item.phone && <p className="text-[11px] text-slate-400">{item.phone}</p>}
        </div>
      ),
    },
    {
      key: "role",
      header: "Access Permission Role",
      sortable: true,
      render: (item) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
            item.role === "admin"
              ? "bg-purple-50 text-purple-700 border border-purple-200"
              : "bg-blue-50 text-accent border border-blue-200"
          }`}
        >
          {item.role === "admin" ? (
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          ) : (
            <Users2 className="w-3.5 h-3.5 text-accent" />
          )}
          <span>{item.role}</span>
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Registered On",
      sortable: true,
      render: (item) => (
        <span className="text-xs text-slate-500 font-medium">
          {new Date(item.created_at).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Role Action",
      className: "text-right",
      render: (item) => {
        const isAdmin = item.role === "admin";
        return (
          <div className="flex items-center justify-end gap-2">
            {isAdmin ? (
              <Button
                variant="secondary"
                onClick={() =>
                  setConfirmRoleChange({ user: item, targetRole: "customer" })
                }
                className="text-[11px] px-2.5 py-1 h-7 rounded-lg text-slate-600 hover:text-amber-700"
              >
                <UserX className="w-3 h-3 mr-1" />
                <span>Demote to Client</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() =>
                  setConfirmRoleChange({ user: item, targetRole: "admin" })
                }
                className="text-[11px] px-2.5 py-1 h-7 rounded-lg font-bold shadow-2xs"
              >
                <UserCheck className="w-3 h-3 mr-1" />
                <span>Promote to Admin</span>
              </Button>
            )}

            <button
              onClick={() => setConfirmDelete(item)}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              title="Delete User"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        onMobileMenuToggle={() => {}}
        title="Users & Role-Based Access Control"
        subtitle="Manage administrator team accounts, grant CRM privileges, and monitor registered clients."
      />

      <div className="px-4 sm:px-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setRoleFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                roleFilter === "all" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All Accounts ({users.length})
            </button>
            <button
              onClick={() => setRoleFilter("admin")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                roleFilter === "admin" ? "bg-purple-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Administrators ({users.filter((u) => u.role === "admin").length})
            </button>
            <button
              onClick={() => setRoleFilter("customer")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                roleFilter === "customer" ? "bg-accent text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Clients ({users.filter((u) => u.role === "customer").length})
            </button>
          </div>

          <Button
            variant="primary"
            onClick={() => setIsInviteModalOpen(true)}
            className="text-xs px-3.5 py-1.5 h-9 rounded-2xl gap-1.5 shadow-md shadow-accent/20 font-bold self-end sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Invite Team Member</span>
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={filteredUsers}
          searchPlaceholder="Search users by name, email, company..."
          searchKeys={["full_name", "email", "company"]}
        />
      </div>

      {/* INVITE / CREATE USER MODAL */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsInviteModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />

          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Invite Team Member
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Grant agency dashboard and CRM access permissions.
                </p>
              </div>
              <button onClick={() => setIsInviteModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleInviteUser} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={inviteForm.full_name}
                  onChange={(e) => setInviteForm({ ...inviteForm, full_name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="rahul@webspyra.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={inviteForm.phone}
                    onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Permission Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as Role })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="admin">Administrator (Full Access)</option>
                    <option value="customer">Client (Portal Only)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="text-xs px-3 py-1.5"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="text-xs px-4 py-1.5 font-bold">
                  Grant Access
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM ROLE CHANGE MODAL */}
      <ConfirmModal
        isOpen={Boolean(confirmRoleChange)}
        onClose={() => setConfirmRoleChange(null)}
        onConfirm={handleExecuteRoleChange}
        title={
          confirmRoleChange?.targetRole === "admin"
            ? `Promote "${confirmRoleChange?.user.full_name}" to Admin?`
            : `Demote "${confirmRoleChange?.user.full_name}" to Client?`
        }
        description={
          confirmRoleChange?.targetRole === "admin"
            ? "This will grant complete management access to all CRM leads, client orders, payment refunds, and site settings."
            : "This will revoke administrative dashboard privileges. The user will only be able to view their own portal orders."
        }
        confirmText={
          confirmRoleChange?.targetRole === "admin" ? "Promote to Admin" : "Demote to Client"
        }
        variant={confirmRoleChange?.targetRole === "admin" ? "success" : "warning"}
      />

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDeleteUser}
        title="Delete User Account?"
        description={`Are you sure you want to delete "${confirmDelete?.full_name || confirmDelete?.email}"?`}
        confirmText="Delete User"
        variant="danger"
      />
    </div>
  );
}
