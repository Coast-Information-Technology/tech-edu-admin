"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { Building, CheckCircle, XCircle, Activity, MapPin } from "lucide-react";

export default function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      setError(null);
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }
      try {
        const res = await getApiRequest(`/api/companies/${id}/details`, token);
        setCompany(res?.data?.data || null);
      } catch (err: any) {
        setError(err.message || "Failed to load company");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCompany();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center py-20">Loading...</div>;
  }
  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  }
  if (!company) {
    return <div className="p-4">Company not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
          <Building className="w-10 h-10 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-blue-900">{company.name}</h1>
          <div className="text-sm text-gray-500">
            {company.type &&
              company.type
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l: string) => l.toUpperCase())}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow border">
          <div className="text-xs text-gray-500 mb-1">Status</div>
          <div className="flex items-center gap-2">
            {company.isActive ? (
              <Activity className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span
              className={company.isActive ? "text-green-800" : "text-red-800"}
            >
              {company.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <div className="p-4 bg-white rounded shadow border">
          <div className="text-xs text-gray-500 mb-1">Verification</div>
          <div className="flex items-center gap-2">
            {company.isVerified ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-yellow-600" />
            )}
            <span
              className={
                company.isVerified ? "text-green-800" : "text-yellow-800"
              }
            >
              {company.isVerified ? "Verified" : "Pending"}
            </span>
          </div>
        </div>
        <div className="p-4 bg-white rounded shadow border">
          <div className="text-xs text-gray-500 mb-1">Industry</div>
          <div className="text-base text-gray-800">
            {company.industry || "-"}
          </div>
        </div>
        <div className="p-4 bg-white rounded shadow border">
          <div className="text-xs text-gray-500 mb-1">RC Number</div>
          <div className="text-base text-gray-800">
            {company.rcNumber || "-"}
          </div>
        </div>
        <div className="p-4 bg-white rounded shadow border col-span-1 md:col-span-2">
          <div className="text-xs text-gray-500 mb-1">Location</div>
          <div className="flex items-center gap-2 text-base text-gray-800">
            <MapPin className="w-4 h-4 text-blue-400" />
            {company.location && company.location.country ? (
              <span>
                {company.location.city}, {company.location.state},{" "}
                {company.location.country}
              </span>
            ) : (
              <span>-</span>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 bg-white rounded shadow border">
        <div className="text-xs text-gray-500 mb-1">Created At</div>
        <div className="text-base text-gray-800">
          {company.createdAt
            ? new Date(company.createdAt).toLocaleString()
            : "-"}
        </div>
      </div>
    </div>
  );
}
