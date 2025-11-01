"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";

type Entitlement = {
  _id: string;
  userId?: string;
  orgId?: string;
  subjectType: string; // product | feature | tool
  subjectKey: string;
  status: string; // active | inactive | expired
  startsAt?: string;
  endsAt?: string;
  allocation?: string;
  quantity?: number;
  consumed?: number;
  source?: { kind?: string; id?: string; priceId?: string };
  createdAt?: string;
  updatedAt?: string;
};

export default function EntitlementsPage() {
  const [items, setItems] = useState<Entitlement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  // filters defined by API spec
  const [status, setStatus] = useState<string>("");
  const [subjectType, setSubjectType] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const params = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", String(page));
    p.set("limit", String(limit));
    if (status) p.set("status", status);
    if (subjectType) p.set("subjectType", subjectType);
    if (search) p.set("search", search);
    return p;
  }, [page, limit, status, subjectType, search]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getTokenFromCookies();
        if (!token) throw new Error("Authentication required");
        const res = await getApiRequest(
          `/api/admin/entitlements-subscriptions/entitlements?${params.toString()}`,
          token
        );
        const root = res?.data ?? res;
        const data = root?.data ?? [];
        const meta = root?.meta ?? {};
        setItems(Array.isArray(data) ? data : []);
        const t = Number(meta?.total ?? 0);
        const tp = Number(meta?.totalPages ?? (t && limit ? Math.ceil(t / limit) : 0));
        setTotal(Number.isFinite(t) ? t : 0);
        setTotalPages(Number.isFinite(tp) ? tp : 0);
      } catch (e: any) {
        setError(process.env.NODE_ENV === "production" ? "Failed to load entitlements" : e?.message || "Failed to load entitlements");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [params, limit]);

  const displayFrom = total === 0 ? 0 : (page - 1) * limit + 1;
  const displayTo = total === 0 ? 0 : Math.min(page * limit, total);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Entitlements
              </h1>
              <p className="text-slate-600 text-lg">All user/product entitlements</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <input
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by subject/user/org"
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
              />
            </div>
            <div>
              <select
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value);
                }}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div>
              <select
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={subjectType}
                onChange={(e) => {
                  setPage(1);
                  setSubjectType(e.target.value);
                }}
              >
                <option value="">All Subject Types</option>
                <option value="product">Product</option>
                <option value="feature">Feature</option>
                <option value="tool">Tool</option>
              </select>
            </div>
            <div>
              <select
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={String(limit)}
                onChange={(e) => {
                  const l = Number(e.target.value) || 20;
                  setPage(1);
                  setLimit(l);
                }}
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n} per page
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-slate-600 text-lg">Loading entitlements...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Org</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Allocation</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Qty / Used</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Valid</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-slate-200">
                  {items.length === 0 ? (
                    <tr>
                      <td className="px-6 py-12 text-center text-slate-500" colSpan={9}>
                        No entitlements found
                      </td>
                    </tr>
                  ) : (
                    items.map((e) => (
                      <tr key={e._id} className="hover:bg-blue-50/50 transition-all">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                              {e.subjectType}
                            </span>
                            <span className="font-mono text-xs text-slate-700">{e.subjectKey}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {e.userId ? (
                            <Link href={`/dashboard/entitlements/user/${e.userId}`} className="text-blue-600 hover:underline font-mono text-xs">
                              {e.userId}
                            </Link>
                          ) : (
                            <span className="text-slate-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                          {e.orgId || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium border ${
                              e.status === "active"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : e.status === "expired"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-slate-100 text-slate-800 border-slate-200"
                            }`}
                          >
                            {e.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {e.allocation || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {(Number.isFinite(e.quantity as any) ? e.quantity : "∞") as any} / {e.consumed ?? 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {(e.startsAt ? new Date(e.startsAt).toLocaleDateString() : "-") + " → " + (e.endsAt ? new Date(e.endsAt).toLocaleDateString() : "-")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-700">
                          {(e.source?.kind || "-") + (e.source?.id ? ` / ${e.source?.id}` : "") + (e.source?.priceId ? ` / ${e.source?.priceId}` : "")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {e.createdAt ? new Date(e.createdAt).toLocaleString() : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-900">{displayFrom}</span> to
              <span className="font-semibold text-slate-900"> {displayTo}</span> of
              <span className="font-semibold text-slate-900"> {total}</span> entitlements
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
                disabled={totalPages === 0 || page >= totalPages}
                className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


