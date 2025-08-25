"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  getApiRequestWithRefresh,
  apiRequestWithRefresh,
} from "@/lib/apiFetch";
import { JobApplication } from "@/types/application";

const statusOptions = [
  "applied",
  "reviewed",
  "shortlisted",
  "interviewed",
  "hired",
  "rejected",
];

export default function EditJobApplicationPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<Partial<JobApplication>>({});

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getTokenFromCookies() || undefined;
        const res = await getApiRequestWithRefresh(
          `/api/ats/job-applications/${id}`,
          token
        );
        if (res.data.success) {
          setForm(res.data.data);
        } else {
          setError(res.data.message || "Failed to fetch application.");
        }
      } catch (e: any) {
        setError(e.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  const handleChange = (field: keyof JobApplication, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const token = getTokenFromCookies() || undefined;
      const res = await apiRequestWithRefresh(
        `/api/ats/job-applications/${id}`,
        "PUT",
        {
          jobPostId: form.jobPostId,
          cvId: form.cvId,
          coverLetterId: form.coverLetterId || undefined,
          referralCode: form.referralCode || undefined,
          status: form.status,
        },
        token
      );
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => router.push(`/dashboard/applications/${id}`), 1500);
      } else {
        setError(res.data.message || "Failed to update application.");
      }
    } catch (e: any) {
      setError(e.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Job Application</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Job Post ID</label>
              <Input
                value={form.jobPostId || ""}
                onChange={(e) => handleChange("jobPostId", e.target.value)}
                required
                placeholder="Enter Job Post ID"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">CV ID</label>
              <Input
                value={form.cvId || ""}
                onChange={(e) => handleChange("cvId", e.target.value)}
                required
                placeholder="Enter CV ID"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Cover Letter ID (optional)
              </label>
              <Input
                value={form.coverLetterId || ""}
                onChange={(e) => handleChange("coverLetterId", e.target.value)}
                placeholder="Enter Cover Letter ID"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Referral Code (optional)
              </label>
              <Input
                value={form.referralCode || ""}
                onChange={(e) => handleChange("referralCode", e.target.value)}
                placeholder="Enter Referral Code"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Status</label>
              <Select
                value={form.status || "applied"}
                onValueChange={(v) => handleChange("status", v)}
              >
                <SelectTrigger className="rounded-[10px] w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-[10px]">
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <div className="text-red-600">{error}</div>}
            {success && (
              <div className="text-green-600">
                Application updated! Redirecting...
              </div>
            )}
            <Button
              type="submit"
              className="rounded-[10px] w-full"
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update Application"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
