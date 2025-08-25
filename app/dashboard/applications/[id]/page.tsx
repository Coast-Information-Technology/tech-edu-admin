"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  UserCheck,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  getApiRequestWithRefresh,
  apiRequestWithRefresh,
} from "@/lib/apiFetch";
import { JobApplication } from "@/types/application";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";

const statusColorMap: { [key: string]: string } = {
  applied: "bg-gray-200 text-gray-800",
  reviewed: "bg-yellow-100 text-yellow-800",
  shortlisted: "bg-blue-100 text-blue-800",
  interviewed: "bg-purple-100 text-purple-800",
  hired: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const token = getTokenFromCookies() || undefined;
        const res = await getApiRequestWithRefresh(
          `/api/ats/job-applications/${id}`,
          token
        );
        if (res.data.success) {
          setApplication(res.data.data);
        } else {
          setError(res.data.message || "Failed to fetch application details.");
        }
      } catch (e: any) {
        setError(e.message || "Application not found or an error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  const handleUpdateStatus = async (newStatus: JobApplication["status"]) => {
    if (!application) return;

    try {
      const token = getTokenFromCookies() || undefined;
      const res = await apiRequestWithRefresh(
        `/api/ats/job-applications/${application._id}`,
        "PUT",
        { status: newStatus },
        token
      );

      if (res.data.success) {
        setApplication((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
        toast.success(`Application status updated to ${newStatus}.`);
      } else {
        toast.error(res.data.message || `Failed to update status.`);
      }
    } catch (e: any) {
      toast.error(e.message || "An error occurred while updating status.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Application Not Found</h2>
        <p className="text-red-500 mb-4">{error}</p>
        <Button asChild className="rounded-[10px]">
          <Link href="/dashboard/applications">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Applications
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-8">
      <Button asChild variant="outline" className="rounded-[10px] mb-4">
        <Link href="/dashboard/applications">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Applications
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" /> Application Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">
                {application.applicant?.fullName || "N/A"}
              </span>
              <Badge
                className={`capitalize rounded-[10px] ${
                  statusColorMap[application.status]
                }`}
              >
                {application.status}
              </Badge>
            </div>
            <div className="text-gray-600">
              {application.applicant?.email || "N/A"}
            </div>
            <div className="text-gray-600">
              Applied for:{" "}
              <span className="font-medium">
                {application.jobPost?.title || "N/A"}
              </span>
            </div>
            <div className="text-gray-600">
              Applied on:{" "}
              {new Date(application.applicationDate).toLocaleDateString()}
            </div>
            <div className="text-gray-600">
              Skill Match Score:{" "}
              <span className="font-semibold">
                {application.skillMatchScore || 0}%
              </span>
            </div>
            <div className="text-gray-600">
              Assessment Score:{" "}
              <span className="font-semibold">
                {application.assessmentScore || 0}%
              </span>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Button
              onClick={() => handleUpdateStatus("shortlisted")}
              disabled={
                application.status === "shortlisted" ||
                application.status === "hired" ||
                application.status === "rejected"
              }
              className="rounded-[10px]"
              variant="outline"
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Shortlist
            </Button>
            <Button
              onClick={() => handleUpdateStatus("rejected")}
              disabled={application.status === "rejected"}
              className="rounded-[10px]"
              variant="destructive"
            >
              <XCircle className="w-4 h-4 mr-2" /> Reject
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
