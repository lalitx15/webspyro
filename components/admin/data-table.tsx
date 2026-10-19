"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Column<T> {
  key: string;
  header: string | React.ReactNode;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T extends { id: string | number }> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  bulkActions?: (selectedIds: (string | number)[], clearSelection: () => void) => React.ReactNode;
  filterSlot?: React.ReactNode;
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading = false,
  searchable = true,
  searchPlaceholder = "Search records...",
  searchKeys,
  bulkActions,
  filterSlot,
  itemsPerPageOptions = [10, 20, 50],
  defaultItemsPerPage = 10,
  emptyTitle = "No records found",
  emptyDescription = "There are no entries matching your current filters or search query.",
  onRowClick,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  // 1. Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const lowerQuery = searchQuery.toLowerCase().trim();
    return data.filter((item) => {
      if (searchKeys && searchKeys.length > 0) {
        return searchKeys.some((k) => {
          const val = item[k];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(lowerQuery);
        });
      }

      // Default: search all string / number fields
      return Object.values(item).some((val) => {
        if (typeof val === "string" || typeof val === "number") {
          return String(val).toLowerCase().includes(lowerQuery);
        }
        return false;
      });
    });
  }, [data, searchQuery, searchKeys]);

  // 2. Sort data
  const sortedData = useMemo(() => {
    if (!sortKey || !sortOrder) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();

      if (sortOrder === "asc") {
        return strA.localeCompare(strB);
      } else {
        return strB.localeCompare(strA);
      }
    });
  }, [filteredData, sortKey, sortOrder]);

  // 3. Paginate
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;

    if (sortKey === key) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        setSortKey(null);
        setSortOrder(null);
      }
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length && paginatedData.length > 0) {
      setSelectedIds(new Set());
    } else {
      const next = new Set<string | number>();
      paginatedData.forEach((row) => next.add(row.id));
      setSelectedIds(next);
    }
  };

  const toggleSelectRow = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const isAllSelected =
    paginatedData.length > 0 && paginatedData.every((row) => selectedIds.has(row.id));
  const isPartiallySelected =
    selectedIds.size > 0 && !isAllSelected && paginatedData.some((row) => selectedIds.has(row.id));

  return (
    <div className="space-y-4">
      {/* Top Action Bar: Search, Filters, Bulk Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
          {filterSlot}
        </div>

        {/* Bulk Action Controls */}
        {bulkActions && selectedIds.size > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200/80 px-4 py-2 rounded-2xl">
            <span className="text-xs font-bold text-accent">
              {selectedIds.size} selected
            </span>
            <div className="h-4 w-px bg-blue-200" />
            {bulkActions(Array.from(selectedIds), clearSelection)}
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {bulkActions && (
                  <th className="py-3.5 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isPartiallySelected;
                      }}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded text-accent focus:ring-accent border-slate-300 transition-colors cursor-pointer"
                      aria-label="Select all rows on this page"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key, col.sortable)}
                    className={`py-3.5 px-4 ${col.sortable ? "cursor-pointer select-none hover:text-slate-800 transition-colors" : ""} ${col.className || ""}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-slate-400">
                          {sortKey === col.key ? (
                            sortOrder === "asc" ? (
                              <ChevronUp className="w-3.5 h-3.5 text-accent" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-accent" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3.5 h-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                // Shimmer Skeleton Rows
                Array.from({ length: itemsPerPage }).map((_, idx) => (
                  <tr key={`skel-${idx}`} className="animate-pulse">
                    {bulkActions && (
                      <td className="py-4 px-4 text-center">
                        <div className="w-4 h-4 bg-slate-200 rounded mx-auto" />
                      </td>
                    )}
                    {columns.map((col, cIdx) => (
                      <td key={`skel-col-${cIdx}`} className="py-4 px-4">
                        <div className="h-4 bg-slate-100 rounded w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                // Empty State
                <tr>
                  <td
                    colSpan={columns.length + (bulkActions ? 1 : 0)}
                    className="py-16 text-center"
                  >
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <Inbox className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold text-slate-800">
                        {emptyTitle}
                      </h4>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        {emptyDescription}
                      </p>
                      {searchQuery && (
                        <Button
                          variant="secondary"
                          onClick={() => setSearchQuery("")}
                          className="mt-4 text-xs py-1.5 px-3"
                        >
                          Clear Search Filter
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                // Data Rows
                paginatedData.map((row) => {
                  const isSelected = selectedIds.has(row.id);
                  return (
                    <tr
                      key={row.id}
                      onClick={() => onRowClick?.(row)}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        onRowClick ? "cursor-pointer" : ""
                      } ${isSelected ? "bg-blue-50/40" : ""}`}
                    >
                      {bulkActions && (
                        <td
                          className="py-3.5 px-4 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => toggleSelectRow(row.id, e as unknown as React.MouseEvent)}
                            className="w-4 h-4 rounded text-accent focus:ring-accent border-slate-300 transition-colors cursor-pointer"
                            aria-label={`Select row ${row.id}`}
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td
                          key={`${row.id}-${col.key}`}
                          className={`py-3.5 px-4 text-slate-700 ${col.className || ""}`}
                        >
                          {col.render
                            ? col.render(row)
                            : String(
                                (row as Record<string, unknown>)[col.key] ?? "—"
                              )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Status Footer */}
        {!isLoading && sortedData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {itemsPerPageOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <span className="hidden sm:inline-block text-slate-300">|</span>
              <span>
                Showing{" "}
                <strong className="text-slate-700 font-semibold">
                  {Math.min(startIndex + 1, sortedData.length)}
                </strong>{" "}
                to{" "}
                <strong className="text-slate-700 font-semibold">
                  {Math.min(startIndex + itemsPerPage, sortedData.length)}
                </strong>{" "}
                of{" "}
                <strong className="text-slate-700 font-semibold">
                  {sortedData.length}
                </strong>{" "}
                results
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 h-8 w-8 rounded-lg"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 5) return true;
                    return (
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - currentPage) <= 1
                    );
                  })
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && p - prev > 1;

                    return (
                      <React.Fragment key={p}>
                        {showEllipsis && (
                          <span className="px-1 text-slate-400">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(p)}
                          className={`min-w-8 h-8 px-2 rounded-lg font-bold transition-all text-xs ${
                            currentPage === p
                              ? "bg-accent text-white shadow-sm"
                              : "text-slate-600 hover:bg-slate-200/60"
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <Button
                variant="secondary"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 h-8 w-8 rounded-lg"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
