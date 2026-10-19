"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Edit2, Trash2, X, Flame } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { DataTable, Column } from "@/components/admin/data-table";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@/lib/supabase/client";

interface PlanItem {
  id: string;
  name: string;
  category: "business" | "ecommerce";
  tagline: string;
  old_price: number;
  price: number;
  discount_percentage: number;
  gst_percentage: number;
  deal_end_time?: string;
  is_popular: boolean;
  renewal_price: number;
  delivery_days: number;
  sort_order: number;
  is_active: boolean;
  features?: string[];
}

const initialMockPlans: PlanItem[] = [
  {
    id: "plan-1",
    name: "Startup Launchpad",
    category: "business",
    tagline: "Essential responsive website for growing businesses and professionals",
    old_price: 24999,
    price: 15999,
    discount_percentage: 36,
    gst_percentage: 18,
    is_popular: false,
    renewal_price: 3499,
    delivery_days: 5,
    sort_order: 1,
    is_active: true,
    features: [
      "Up to 5 Custom Pages",
      "Mobile & Tablet App-Like Feel",
      "Free .com or .in Domain for 1 Yr",
      "Fast Cloud Hosting & SSL",
      "WhatsApp Chat & Call Widget",
      "SEO Meta Tag Basics",
    ],
  },
  {
    id: "plan-2",
    name: "Growth Business Pro",
    category: "business",
    tagline: "High-converting corporate website with advanced animations and speed optimization",
    old_price: 39999,
    price: 24999,
    discount_percentage: 38,
    gst_percentage: 18,
    is_popular: true,
    renewal_price: 4999,
    delivery_days: 7,
    sort_order: 2,
    is_active: true,
    features: [
      "Up to 10 Ultra-Fast Pages",
      "Soft Pastel Vision Pro Aesthetics",
      "Lead Capture & CRM Sync",
      "Google Analytics 4 & Meta Pixel",
      "Dynamic Blog & News Module",
      "Priority 24/7 Phone Support",
    ],
  },
  {
    id: "plan-3",
    name: "E-Commerce Starter",
    category: "ecommerce",
    tagline: "Complete online storefront with automated Razorpay payments and catalog",
    old_price: 54999,
    price: 34999,
    discount_percentage: 36,
    gst_percentage: 18,
    is_popular: false,
    renewal_price: 6999,
    delivery_days: 10,
    sort_order: 3,
    is_active: true,
    features: [
      "Up to 100 Products Catalog",
      "Razorpay UPI & Cards Checkout",
      "Automated GST Invoice Generator",
      "Customer Order Status Tracking",
      "Coupon Codes & Promotions Engine",
    ],
  },
  {
    id: "plan-4",
    name: "Ultimate E-Commerce Suite",
    category: "ecommerce",
    tagline: "Full-scale multi-category digital store with inventory & logistics integrations",
    old_price: 89999,
    price: 54999,
    discount_percentage: 39,
    gst_percentage: 18,
    is_popular: true,
    renewal_price: 9999,
    delivery_days: 14,
    sort_order: 4,
    is_active: true,
    features: [
      "Unlimited Products & Categories",
      "Multi-Currency & Global Payments",
      "Automated WhatsApp Order Alerts",
      "Abandoned Cart Recovery",
      "Full Custom Admin Dashboard",
    ],
  },
];

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<PlanItem[]>(initialMockPlans);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "business" | "ecommerce">("all");
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDeletePlan, setConfirmDeletePlan] = useState<PlanItem | null>(null);
  const [featureInput, setFeatureInput] = useState("");

  const supabase = useMemo(() => createBrowserClient(), []);

  // Fetch plans from Supabase
  const fetchPlans = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setPlans(data as unknown as PlanItem[]);
      }
    } catch {
      // Demo safety
    }
  }, [supabase]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Open modal for new plan
  const handleAddNew = () => {
    setEditingPlan({
      id: `plan-${Date.now()}`,
      name: "",
      category: "business",
      tagline: "",
      old_price: 29999,
      price: 19999,
      discount_percentage: 33,
      gst_percentage: 18,
      is_popular: false,
      renewal_price: 3999,
      delivery_days: 7,
      sort_order: plans.length + 1,
      is_active: true,
      features: ["Custom UI/UX Design", "Free Domain & Cloud Hosting", "Mobile App-Like Experience"],
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (plan: PlanItem) => {
    setEditingPlan({ ...plan });
    setIsModalOpen(true);
  };

  // Save plan
  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan || !editingPlan.name) return;

    const exists = plans.some((p) => p.id === editingPlan.id);
    let updated: PlanItem[];

    if (exists) {
      updated = plans.map((p) => (p.id === editingPlan.id ? editingPlan : p));
    } else {
      updated = [...plans, editingPlan];
    }

    setPlans(updated);
    setIsModalOpen(false);

    try {
      await supabase.from("plans").upsert({
        id: editingPlan.id,
        name: editingPlan.name,
        category: editingPlan.category,
        tagline: editingPlan.tagline,
        old_price: editingPlan.old_price,
        price: editingPlan.price,
        discount_percentage: editingPlan.discount_percentage,
        gst_percentage: editingPlan.gst_percentage,
        is_popular: editingPlan.is_popular,
        renewal_price: editingPlan.renewal_price,
        delivery_days: editingPlan.delivery_days,
        sort_order: editingPlan.sort_order,
        is_active: editingPlan.is_active,
      });
    } catch {
      // Demo fallback
    }
  };

  // Delete plan
  const handleDeletePlan = async () => {
    if (!confirmDeletePlan) return;
    const next = plans.filter((p) => p.id !== confirmDeletePlan.id);
    setPlans(next);
    setConfirmDeletePlan(null);

    try {
      await supabase.from("plans").delete().eq("id", confirmDeletePlan.id);
    } catch {
      // Demo fallback
    }
  };

  // Toggle active
  const handleToggleActive = async (plan: PlanItem) => {
    const nextState = !plan.is_active;
    const updated = plans.map((p) => (p.id === plan.id ? { ...p, is_active: nextState } : p));
    setPlans(updated);

    try {
      await supabase.from("plans").update({ is_active: nextState }).eq("id", plan.id);
    } catch {
      // Demo fallback
    }
  };

  // Filtered plans
  const filteredPlans = useMemo(() => {
    if (selectedCategory === "all") return plans;
    return plans.filter((p) => p.category === selectedCategory);
  }, [plans, selectedCategory]);

  const columns: Column<PlanItem>[] = [
    {
      key: "name",
      header: "Plan Name & Tagline",
      sortable: true,
      render: (plan) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">{plan.name}</span>
            {plan.is_popular && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-full text-[10px] font-extrabold">
                <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>Popular</span>
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 max-w-sm truncate mt-0.5">{plan.tagline}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (plan) => (
        <span
          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
            plan.category === "ecommerce"
              ? "bg-purple-50 text-purple-700 border border-purple-200"
              : "bg-blue-50 text-accent border border-blue-200"
          }`}
        >
          {plan.category}
        </span>
      ),
    },
    {
      key: "price",
      header: "Pricing",
      sortable: true,
      render: (plan) => (
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-slate-900">
              ₹{plan.price.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] line-through text-slate-400">
              ₹{plan.old_price.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold">
            {plan.discount_percentage}% OFF (+{plan.gst_percentage}% GST)
          </p>
        </div>
      ),
    },
    {
      key: "delivery_days",
      header: "Timeline & Renewal",
      render: (plan) => (
        <div className="text-xs text-slate-600">
          <p className="font-medium">{plan.delivery_days} days delivery</p>
          <p className="text-[10px] text-slate-400">
            ₹{plan.renewal_price.toLocaleString("en-IN")}/yr renewal
          </p>
        </div>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (plan) => (
        <button
          onClick={() => handleToggleActive(plan)}
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
            plan.is_active
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-slate-100 text-slate-400 border border-slate-200"
          }`}
        >
          {plan.is_active ? "Active" : "Disabled"}
        </button>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (plan) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleEdit(plan)}
            className="p-1.5 text-slate-400 hover:text-accent rounded-lg hover:bg-blue-50 transition-colors"
            title="Edit Package"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setConfirmDeletePlan(plan)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Delete Package"
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
        title="Plans & Pricing CMS"
        subtitle="Manage public packages, pricing tiers, feature checklists, and discounts."
      />

      <div className="px-4 sm:px-6 space-y-6 max-w-7xl mx-auto">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === "all" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All Packages ({plans.length})
            </button>
            <button
              onClick={() => setSelectedCategory("business")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === "business" ? "bg-accent text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Business Websites ({plans.filter((p) => p.category === "business").length})
            </button>
            <button
              onClick={() => setSelectedCategory("ecommerce")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === "ecommerce" ? "bg-purple-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              E-Commerce Stores ({plans.filter((p) => p.category === "ecommerce").length})
            </button>
          </div>

          <Button
            variant="primary"
            onClick={handleAddNew}
            className="text-xs px-3.5 py-1.5 h-9 rounded-2xl gap-1.5 shadow-md shadow-accent/20 font-bold self-end sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Package</span>
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={filteredPlans}
          searchPlaceholder="Search plans by name, tagline..."
          searchKeys={["name", "tagline"]}
        />
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {plans.some((p) => p.id === editingPlan.id) ? "Edit Plan Details" : "Create New Plan"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure pricing, delivery timeline, renewal fees, and deliverables.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Plan Title *</label>
                  <input
                    type="text"
                    required
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    placeholder="e.g. Growth Business Pro"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={editingPlan.category}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, category: e.target.value as "business" | "ecommerce" })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent capitalize"
                  >
                    <option value="business">Business Website</option>
                    <option value="ecommerce">E-Commerce Store</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tagline / Subtitle</label>
                <input
                  type="text"
                  value={editingPlan.tagline}
                  onChange={(e) => setEditingPlan({ ...editingPlan, tagline: e.target.value })}
                  placeholder="Short description shown under plan title"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Old Price (₹)</label>
                  <input
                    type="number"
                    value={editingPlan.old_price}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, old_price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount %</label>
                  <input
                    type="number"
                    value={editingPlan.discount_percentage}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, discount_percentage: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">GST %</label>
                  <input
                    type="number"
                    value={editingPlan.gst_percentage}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, gst_percentage: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Renewal Price (₹/yr)</label>
                  <input
                    type="number"
                    value={editingPlan.renewal_price}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, renewal_price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Delivery (Working Days)</label>
                  <input
                    type="number"
                    value={editingPlan.delivery_days}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, delivery_days: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={editingPlan.sort_order}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, sort_order: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Highlights & Toggles */}
              <div className="flex items-center gap-6 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.is_popular}
                    onChange={(e) => setEditingPlan({ ...editingPlan, is_popular: e.target.checked })}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <span className="font-bold text-slate-800">Badge as Most Popular</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.is_active}
                    onChange={(e) => setEditingPlan({ ...editingPlan, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <span className="font-bold text-slate-800">Publish Live</span>
                </label>
              </div>

              {/* Feature Items List */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Deliverables & Features Checklist</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add a feature item (e.g. Free Domain for 1st Year)..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      if (featureInput.trim()) {
                        const current = editingPlan.features || [];
                        setEditingPlan({ ...editingPlan, features: [...current, featureInput.trim()] });
                        setFeatureInput("");
                      }
                    }}
                    className="text-xs px-3"
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(editingPlan.features || []).map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-slate-700 border border-blue-200/80 rounded-xl text-[11px] font-medium"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = (editingPlan.features || []).filter((_, i) => i !== idx);
                          setEditingPlan({ ...editingPlan, features: filtered });
                        }}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="text-xs px-5 py-2 shadow-md shadow-accent/20 font-bold"
                >
                  Save Plan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(confirmDeletePlan)}
        onClose={() => setConfirmDeletePlan(null)}
        onConfirm={handleDeletePlan}
        title="Delete Pricing Plan?"
        description={`Are you sure you want to delete the plan "${confirmDeletePlan?.name}"? Any existing checkout sessions using this plan may be affected.`}
        confirmText="Delete Plan"
        variant="danger"
      />
    </div>
  );
}
