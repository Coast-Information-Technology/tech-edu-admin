"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTokenFromCookies } from "@/lib/cookies";
import { apiRequestWithRefresh } from "@/lib/apiFetch";

export default function NewJobApplicationPage() {
  const [jobPostId, setJobPostId] = useState("");
  const [cvId, setCvId] = useState("");
  const [coverLetterId, setCoverLetterId] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const token = getTokenFromCookies() || undefined;
      const res = await apiRequestWithRefresh(
        "/api/ats/job-applications",
        "POST",
        {
          jobPostId,
          cvId,
          coverLetterId: coverLetterId || undefined,
          referralCode: referralCode || undefined,
        },
        token
      );
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard/applications"), 1500);
      } else {
        setError(res.data.message || "Failed to create job application.");
      }
    } catch (e: any) {
      setError(e.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Job Application</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Job Post ID</label>
              <Input
                value={jobPostId}
                onChange={(e) => setJobPostId(e.target.value)}
                required
                placeholder="Enter Job Post ID"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">CV ID</label>
              <Input
                value={cvId}
                onChange={(e) => setCvId(e.target.value)}
                required
                placeholder="Enter CV ID"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Cover Letter ID (optional)
              </label>
              <Input
                value={coverLetterId}
                onChange={(e) => setCoverLetterId(e.target.value)}
                placeholder="Enter Cover Letter ID"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Referral Code (optional)
              </label>
              <Input
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Enter Referral Code"
              />
            </div>
            {error && <div className="text-red-600">{error}</div>}
            {success && (
              <div className="text-green-600">
                Application created! Redirecting...
              </div>
            )}
            <Button
              type="submit"
              className="rounded-[10px] w-full"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Create Application"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
