"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Edit2, Trash2, X, Tag } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { DataTable, Column } from "@/components/admin/data-table";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { Button } from "@/components/ui/button";
import { Coupon } from "@/types";
import { createBrowserClient } from "@/lib/supabase/client";

const initialMockCoupons: Coupon[] = [
  {
    id: "coup-1",
    code: "FESTIVE30",
    discount_type: "percentage",
    discount_value: 30,
    min_order_amount: 15000,
    max_uses: 100,
    current_uses: 42,
    valid_until: "2026-11-15T23:59:59.000Z",
    is_active: true,
    created_at: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "coup-2",
    code: "STARTUP5K",
    discount_type: "fixed",
    discount_value: 5000,
    min_order_amount: 25000,
    max_uses: 50,
    current_uses: 19,
    valid_until: "2026-12-31T23:59:59.000Z",
    is_active: true,
    created_at: "2026-10-05T00:00:00.000Z",
  },
  {
    id: "coup-3",
    code: "DIWALIWEB",
    discount_type: "percentage",
    discount_value: 25,
    min_order_amount: 20000,
    max_uses: 200,
    current_uses: 88,
    valid_until: "2026-11-05T23:59:59.000Z",
    is_active: true,
    created_at: "2026-10-10T00:00:00.000Z",
  },
  {
    id: "coup-4",
    code: "VIPCLIENT",
    discount_type: "fixed",
    discount_value: 10000,
    min_order_amount: 50000,
    max_uses: 20,
    current_uses: 7,
    valid_until: "2026-12-15T23:59:59.000Z",
    is_active: false,
    created_at: "2026-09-15T00:00:00.000Z",
  },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialMockCoupons);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Coupon | null>(null);

  const supabase = useMemo(() => createBrowserClient(), []);

  const fetchCoupons = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setCoupons(data as unknown as Coupon[]);
      }
    } catch {
      // Demo safety
    }
  }, [supabase]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleToggleActive = async (coupon: Coupon) => {
    const nextState = !coupon.is_active;
    const updated = coupons.map((c) =>
      c.id === coupon.id ? { ...c, is_active: nextState } : c
    );
    setCoupons(updated);

    try {
      await supabase.from("coupons").update({ is_active: nextState }).eq("id", coupon.id);
    } catch {
      // Demo fallback
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon || !editingCoupon.code) return;

    const exists = coupons.some((c) => c.id === editingCoupon.id);
    const updated = exists
      ? coupons.map((c) => (c.id === editingCoupon.id ? editingCoupon : c))
      : [editingCoupon, ...coupons];

    setCoupons(updated);
    setIsModalOpen(false);

    try {
      await supabase.from("coupons").upsert({
        id: editingCoupon.id,
        code: editingCoupon.code.toUpperCase().trim(),
        discount_type: editingCoupon.discount_type,
        discount_value: editingCoupon.discount_value,
        min_order_amount: editingCoupon.min_order_amount,
        max_uses: editingCoupon.max_uses,
        valid_until: editingCoupon.valid_until,
        is_active: editingCoupon.is_active,
      });
    } catch {
      // Demo fallback
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setCoupons(coupons.filter((c) => c.id !== confirmDelete.id));
    setConfirmDelete(null);

    try {
      await supabase.from("coupons").delete().eq("id", confirmDelete.id);
    } catch {
      // Demo fallback
    }
  };

  const columns: Column<Coupon>[] = [
    {
      key: "code",
      header: "Coupon Code",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono font-extrabold text-slate-900 tracking-wider text-xs">
            {item.code}
          </span>
        </div>
      ),
    },
    {
      key: "discount_value",
      header: "Benefit / Discount",
      render: (item) => (
        <div className="text-xs">
          <span className="font-extrabold text-emerald-700">
            {item.discount_type === "percentage" ? `${item.discount_value}% OFF` : `Flat ₹${item.discount_value} OFF`}
          </span>
          <p className="text-[10px] text-slate-400">
            Min order: ₹{item.min_order_amount.toLocaleString("en-IN")}
          </p>
        </div>
      ),
    },
    {
      key: "current_uses",
      header: "Usage Tracking",
      render: (item) => (
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <span>{item.current_uses}</span>
            <span className="text-slate-400">/ {item.max_uses || "∞"} used</span>
          </div>
          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent"
              style={{
                width: `${Math.min(100, (item.current_uses / (item.max_uses || 100)) * 100)}%`,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "valid_until",
      header: "Validity Date",
      render: (item) => (
        <span className="text-xs text-slate-600 font-medium">
          {item.valid_until
            ? new Date(item.valid_until).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "No expiry"}
        </span>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (item) => (
        <button
          onClick={() => handleToggleActive(item)}
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
            item.is_active
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          {item.is_active ? "Active" : "Disabled"}
        </button>
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
              setEditingCoupon({ ...item });
              setIsModalOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-accent rounded-lg hover:bg-blue-50 transition-colors"
            title="Edit Coupon"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setConfirmDelete(item)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Delete Coupon"
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
        title="Promotions & Discount Coupons"
        subtitle="Configure promotional discount codes, usage limits, and checkout coupon validation."
      />

      <div className="px-4 sm:px-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Active Promo Campaigns</h3>
            <p className="text-xs text-slate-400">Total {coupons.length} promotional codes configured</p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setEditingCoupon({
                id: `coup-${Date.now()}`,
                code: "",
                discount_type: "percentage",
                discount_value: 20,
                min_order_amount: 15000,
                max_uses: 100,
                current_uses: 0,
                valid_until: new Date(Date.now() + 30 * 86400000).toISOString(),
                is_active: true,
                created_at: new Date().toISOString(),
              });
              setIsModalOpen(true);
            }}
            className="text-xs px-3.5 py-1.5 h-9 rounded-2xl gap-1.5 shadow-md shadow-accent/20 font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Coupon</span>
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={coupons}
          searchPlaceholder="Search coupon by code..."
          searchKeys={["code"]}
        />
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && editingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />

          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {coupons.some((c) => c.id === editingCoupon.id) ? "Edit Coupon" : "Create Coupon"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={editingCoupon.code}
                  onChange={(e) =>
                    setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g. FESTIVE30"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Type</label>
                  <select
                    value={editingCoupon.discount_type}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        discount_type: e.target.value as "percentage" | "fixed",
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="percentage">Percentage (% OFF)</option>
                    <option value="fixed">Fixed Amount (₹ OFF)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={editingCoupon.discount_value}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        discount_value: Number(e.target.value),
                      })
                    }
                    placeholder="e.g. 25"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Minimum Order (₹)</label>
                  <input
                    type="number"
                    value={editingCoupon.min_order_amount}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        min_order_amount: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Max Redemptions</label>
                  <input
                    type="number"
                    value={editingCoupon.max_uses || ""}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        max_uses: Number(e.target.value) || null,
                      })
                    }
                    placeholder="Unlimited if empty"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={
                    editingCoupon.valid_until
                      ? editingCoupon.valid_until.split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      valid_until: e.target.value ? `${e.target.value}T23:59:59.000Z` : null,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCoupon.is_active}
                    onChange={(e) =>
                      setEditingCoupon({ ...editingCoupon, is_active: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <span className="font-bold text-slate-800">Coupon Active</span>
                </label>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsModalOpen(false)}
                    className="text-xs px-3 py-1.5"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="text-xs px-4 py-1.5 font-bold">
                    Save Coupon
                  </Button>
                </div>
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
        title="Delete Coupon Code?"
        description={`Are you sure you want to delete coupon "${confirmDelete?.code}"?`}
        confirmText="Delete Coupon"
        variant="danger"
      />
    </div>
  );
}
