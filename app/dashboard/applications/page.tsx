"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Loader2,
  Grid3X3,
  List,
  Trash2,
  Calendar,
  Target,
  Star,
  FileText,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getApiRequest, putApiRequest, deleteApiRequest } from "@/lib/apiFetch";
import { getCookie } from "@/lib/cookies";
import { toast } from "react-toastify";
import { JobApplication } from "@/types/jobs";

// Confirmation Modal Component
function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[10px] p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "applied", label: "Applied" },
  { value: "reviewed", label: "Reviewed" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview_scheduled", label: "Interview Scheduled" },
  { value: "interviewed", label: "Interviewed" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

const statusColorMap: { [key: string]: string } = {
  applied: "bg-gray-200 text-gray-800",
  reviewed: "bg-yellow-100 text-yellow-800",
  shortlisted: "bg-blue-100 text-blue-800",
  interview_scheduled: "bg-purple-100 text-purple-800",
  interviewed: "bg-indigo-100 text-indigo-800",
  hired: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ApplicationsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    applicationId: string | null;
  }>({ isOpen: false, applicationId: null });
  const perPage = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = getCookie("token");
        if (!token) {
          setError("Authentication required");
          return;
        }

        const response = await getApiRequest<{
          success: boolean;
          message: string;
          data: JobApplication[];
          meta?: any;
        }>("/api/ats/job-applications", token);

        if (response.status >= 200 && response.status < 300) {
          if (response.data?.success) {
            setApplications(response.data.data || []);
          } else {
            setError(response.data?.message || "Failed to fetch applications");
          }
        } else {
          setError(response.message || "Failed to fetch applications");
        }
      } catch (e: any) {
        setError(e.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const res = await putApiRequest(
        `/api/ats/job-applications/${id}`,
        { status: newStatus },
        token
      );

      if (res.status >= 200 && res.status < 300) {
        if (res.data?.success) {
          setApplications((prev) =>
            prev.map((app) =>
              app._id === id ? { ...app, status: newStatus } : app
            )
          );
          toast.success(`Application status updated to ${newStatus}`);
        } else {
          toast.error(
            process.env.NEXT_PUBLIC_NODE_ENV === "production"
              ? "Failed to update status"
              : res.data?.message || "Failed to update status"
          );
        }
      } else {
        toast.error(
          process.env.NEXT_PUBLIC_NODE_ENV === "production"
            ? "Failed to update status"
            : res.message || "Failed to update status"
        );
      }
    } catch (e: any) {
      toast.error(
        process.env.NEXT_PUBLIC_NODE_ENV === "production"
          ? "Something went wrong"
          : e.message || "An error occurred while updating status"
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const res = await deleteApiRequest(
        `/api/ats/job-applications/${id}`,
        token
      );

      if (res.status >= 200 && res.status < 300) {
        if (res.data?.success) {
          setApplications((prev) => prev.filter((app) => app._id !== id));
          toast.success("Application has been deleted");
        } else {
          toast.error(
            process.env.NEXT_PUBLIC_NODE_ENV === "production"
              ? "Failed to delete application"
              : res.data?.message || "Failed to delete application"
          );
        }
      } else {
        toast.error(
          process.env.NEXT_PUBLIC_NODE_ENV === "production"
            ? "Failed to delete application"
            : res.message || "Failed to delete application"
        );
      }
    } catch (e: any) {
      toast.error(
        process.env.NEXT_PUBLIC_NODE_ENV === "production"
          ? "Something went wrong"
          : e.message || "An error occurred while deleting"
      );
    }
    setDeleteModal({ isOpen: false, applicationId: null });
  };

  const openDeleteModal = (id: string) => {
    setDeleteModal({ isOpen: true, applicationId: id });
  };

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app._id.toLowerCase().includes(search.toLowerCase()) ||
      app.referralCode?.toLowerCase().includes(search.toLowerCase()) ||
      app.status.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" ? true : app.status === status;
    return matchesSearch && matchesStatus && !app.isDeleted;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const ApplicationCard = ({ app }: { app: JobApplication }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              Application #{app._id.slice(-8)}
            </CardTitle>
            <p className="text-sm text-gray-500">
              Applied: {new Date(app.applicationDate).toLocaleDateString()}
            </p>
          </div>
          <Badge
            className={`capitalize ${
              statusColorMap[app.status] || "bg-gray-200 text-gray-800"
            }`}
          >
            {app.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span>Assessment: {app.assessmentScore}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-green-600" />
            <span>Match: {app.skillMatchScore}%</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-600" />
            <span>CV: {app.cvId ? "Yes" : "No"}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-orange-600" />
            <span>Cover: {app.coverLetterId ? "Yes" : "No"}</span>
          </div>
        </div>

        {app.referralCode && (
          <div className="text-sm text-gray-600">
            Referral: {app.referralCode}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/dashboard/applications/${app._id}`)}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleUpdateStatus(app._id, "shortlisted")}
            disabled={
              app.status === "shortlisted" ||
              app.status === "hired" ||
              app.status === "rejected"
            }
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Shortlist
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => openDeleteModal(app._id)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">Applications</h1>
          <p className="text-gray-600 mt-1">
            View and manage all job applications received.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-[10px] p-1">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-md"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("card")}
              className="rounded-md"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
          <Button asChild className="rounded-[10px]" variant="outline">
            <Link href="/dashboard/applications/shortlisted">
              View Shortlisted
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" /> Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div className="relative md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                placeholder="Search by ID, referral code, or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-[10px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="rounded-[10px] w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-[10px]">
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {viewMode === "table" ? (
            <div className="overflow-x-auto w-full">
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Application ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Assessment</TableHead>
                    <TableHead>Match Score</TableHead>
                    <TableHead>Referral</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                        <p>Loading applications...</p>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-red-500"
                      >
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No applications found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((app) => (
                      <TableRow key={app._id}>
                        <TableCell className="font-mono text-sm">
                          {app._id.slice(-8)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`capitalize rounded-[10px] ${
                              statusColorMap[app.status] ||
                              "bg-gray-200 text-gray-800"
                            }`}
                          >
                            {app.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(app.applicationDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{app.assessmentScore}%</TableCell>
                        <TableCell>{app.skillMatchScore}%</TableCell>
                        <TableCell>{app.referralCode || "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              size="icon"
                              variant="outline"
                              className="rounded-[10px]"
                              title="View"
                              onClick={() =>
                                router.push(
                                  `/dashboard/applications/${app._id}`
                                )
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="rounded-[10px]"
                              title="Shortlist"
                              onClick={() =>
                                handleUpdateStatus(app._id, "shortlisted")
                              }
                              disabled={
                                app.status === "shortlisted" ||
                                app.status === "hired" ||
                                app.status === "rejected"
                              }
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              className="rounded-[10px]"
                              title="Delete"
                              onClick={() => openDeleteModal(app._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : error ? (
                <div className="col-span-full text-center py-8 text-red-500">
                  {error}
                </div>
              ) : paginated.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  No applications found.
                </div>
              ) : (
                paginated.map((app) => (
                  <ApplicationCard key={app._id} app={app} />
                ))
              )}
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && !error && (
            <div className="flex justify-end items-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="rounded-[10px]"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-[10px]"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, applicationId: null })}
        onConfirm={() =>
          deleteModal.applicationId && handleDelete(deleteModal.applicationId)
        }
        title="Delete Application"
        message="Are you sure you want to delete this application? This action cannot be undone."
      />
    </div>
  );
}
