"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";

export default function UserSubscriptionsPage() {
  const params = useParams<{ userId: string }>();
  const userId = params?.userId as string;

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const endpoint = useMemo(() => {
    return userId
      ? `/api/admin/entitlements-subscriptions/user/${encodeURIComponent(userId)}/subscriptions`
      : "";
  }, [userId]);

  useEffect(() => {
    if (!endpoint) return;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getTokenFromCookies();
        if (!token) throw new Error("Authentication required");
        const res = await getApiRequest(endpoint, token);
        const root = res?.data ?? res;
        const data = root?.data ?? [];
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(process.env.NODE_ENV === "production" ? "Failed to load user subscriptions" : e?.message || "Failed to load user subscriptions");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [endpoint]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                User Subscriptions
              </h1>
              <p className="text-slate-600">User ID: <span className="font-mono">{userId}</span></p>
            </div>
            <Link href="/dashboard/subscriptions" className="text-blue-600 hover:underline">Back</Link>
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
                <p className="text-slate-600 text-lg">Loading subscriptions...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Provider</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Subscription</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Product/Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Current Period</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-slate-200">
                  {items.length === 0 ? (
                    <tr>
                      <td className="px-6 py-12 text-center text-slate-500" colSpan={6}>
                        No subscriptions found for this user
                      </td>
                    </tr>
                  ) : (
                    items.map((s) => (
                      <tr key={s._id} className="hover:bg-blue-50/50 transition-all">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            {s.provider || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">{s.providerSubscriptionId || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                          {(s.providerProductId || "-") + (s.providerPriceId ? ` / ${s.providerPriceId}` : "")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium border ${
                            s.status === "active"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : s.status === "trialing"
                              ? "bg-amber-100 text-amber-800 border-amber-200"
                              : s.status === "canceled"
                              ? "bg-red-100 text-red-800 border-red-200"
                              : "bg-slate-100 text-slate-800 border-slate-200"
                          }`}>{s.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {(s.currentPeriodStart ? new Date(s.currentPeriodStart).toLocaleDateString() : "-") +
                            " → " +
                            (s.currentPeriodEnd ? new Date(s.currentPeriodEnd).toLocaleDateString() : "-")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {s.createdAt ? new Date(s.createdAt).toLocaleString() : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


