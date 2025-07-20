"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Calendar,
  Building2,
  Eye,
  Bookmark,
  MoreHorizontal,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  Ban,
  Users,
  ArrowUpDown,
  Download,
  Trash2,
  CheckSquare,
  XSquare,
  Star,
  DollarSign,
  Target,
  AlertCircle,
  Plus,
  Save,
  X,
  BookmarkPlus,
  BookmarkCheck,
  ExternalLink,
  Send,
  FileText,
  GraduationCap,
  BriefcaseIcon,
  Clock3,
  Award,
  Globe,
  Zap,
  Heart,
  Share2,
  Edit,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { Job } from "@/types/jobs";
import { getApiRequest, deleteApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";

// API integration for jobs
const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getTokenFromCookies();
      console.log("🔑 Token check:", token ? "Token found" : "No token");

      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      console.log("📡 Making API request to:", "/api/ats/job-posts");
      const response = await getApiRequest<{
        success: boolean;
        message: string;
        data: Job[];
        meta?: any;
      }>("/api/ats/job-posts", token);

      console.log("📥 Full API Response:", {
        status: response.status,
        message: response.message,
        data: response.data,
        responseObject: response,
      });

      if (response.status >= 200 && response.status < 300) {
        // Handle nested data structure: response.data.data contains the actual jobs array
        const jobsData = response.data?.data || response.data || [];
        console.log("✅ Success! Jobs loaded:", jobsData.length);
        console.log("📋 Jobs data structure:", jobsData);
        setJobs(jobsData);
      } else {
        console.error("❌ API Error:", response.message);
        setError(response.message || "Failed to fetch jobs");
      }
    } catch (error: any) {
      console.error("💥 Network/Error Details:", {
        message: error.message,
        status: error.status,
        fullError: error,
      });
      setError(error.message || "An error occurred while fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      const token = getTokenFromCookies();
      console.log("🗑️ Deleting job:", jobId);
      console.log("🔑 Token for delete:", token ? "Present" : "Missing");

      if (!token) {
        return { success: false, message: "Authentication required" };
      }

      const response = await deleteApiRequest(
        `/api/ats/job-posts/${jobId}`,
        token
      );

      console.log("🗑️ Delete Response:", {
        status: response.status,
        message: response.message,
        data: response.data,
        fullResponse: response,
      });

      if (response.status >= 200 && response.status < 300) {
        console.log("✅ Job deleted successfully");
        setJobs(jobs.filter((job) => job._id !== jobId));
        return { success: true };
      } else {
        console.error("❌ Delete failed:", response.message);
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      console.error("💥 Delete error:", {
        message: error.message,
        status: error.status,
        fullError: error,
      });
      return {
        success: false,
        message: error.message || "An error occurred while deleting the job",
      };
    }
  };

  return { jobs, loading, error, fetchJobs, deleteJob };
};

export default function JobsManagementPage() {
  const { jobs, loading, error, fetchJobs, deleteJob } = useJobs();
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchJobs();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-green-100 text-green-800";
      case "part-time":
        return "bg-blue-100 text-blue-800";
      case "contract":
        return "bg-purple-100 text-purple-800";
      case "internship":
        return "bg-orange-100 text-orange-800";
      case "remote":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSelectJob = (jobId: string, checked: boolean) => {
    if (checked) {
      setSelectedJobs([...selectedJobs, jobId]);
    } else {
      setSelectedJobs(selectedJobs.filter((id) => id !== jobId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedJobs(filteredJobs.map((job) => job._id));
    } else {
      setSelectedJobs([]);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      const result = await deleteJob(jobId);
      if (result.success) {
        toast.success("Job deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete job");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedJobs.length === 0) {
      toast.error("Please select jobs to delete");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete ${selectedJobs.length} selected jobs?`
      )
    ) {
      const deletePromises = selectedJobs.map((jobId) => deleteJob(jobId));
      const results = await Promise.all(deletePromises);

      const successCount = results.filter((result) => result.success).length;
      const failureCount = results.length - successCount;

      if (successCount > 0) {
        toast.success(`${successCount} jobs deleted successfully`);
      }
      if (failureCount > 0) {
        toast.error(`${failureCount} jobs failed to delete`);
      }

      setSelectedJobs([]);
    }
  };

  // Filter and sort jobs
  const filteredJobs = (jobs || [])
    .filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === "all" || job.employmentType === filterType;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        case "company":
          return (a.company || "").localeCompare(b.company || "");
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading jobs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={fetchJobs} variant="outline">
              Try Again
            </Button>
            <Button
              onClick={() => {
                const token = getTokenFromCookies();
                console.log(
                  "🔍 Manual Auth Check - Token:",
                  token ? "Present" : "Missing"
                );
                if (!token) {
                  toast.error("No authentication token found. Please log in.");
                } else {
                  toast.success("Token found. API should work.");
                  console.log(
                    "🔍 Token value (first 20 chars):",
                    token.substring(0, 20) + "..."
                  );
                }
              }}
              variant="outline"
            >
              Check Auth
            </Button>
            <Button
              onClick={() => {
                console.log("🧪 Manual API Test - Triggering fetchJobs...");
                fetchJobs();
              }}
              variant="outline"
            >
              Test API
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">Job Management</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor your job postings
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-[10px]"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px]"
            asChild
          >
            <Link href="/dashboard/jobs-management/new">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {jobs.length}
                </p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-green-600">
                  {jobs.filter((job) => !job.isDeleted).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Featured Jobs
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {jobs.filter((job) => job.isFeatured).length}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent Jobs</p>
                <p className="text-2xl font-bold text-red-600">
                  {jobs.filter((job) => job.isUrgent).length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search jobs by title, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-[10px]"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40 rounded-[10px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-[10px]">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 rounded-[10px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-[10px]">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="title">By Title</SelectItem>
                  <SelectItem value="company">By Company</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedJobs.length > 0 && (
        <Card className="border-0 shadow-lg bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                {selectedJobs.length} job(s) selected
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedJobs([])}
                  className="rounded-[10px]"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Selection
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="rounded-[10px]"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Jobs List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Job Postings ({filteredJobs.length})</span>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={
                  selectedJobs.length === paginatedJobs.length &&
                  paginatedJobs.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-500">Select All</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterType !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by posting your first job"}
              </p>
              {!searchTerm && filterType === "all" && (
                <Button asChild className="rounded-[10px]">
                  <Link href="/dashboard/jobs-management/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Job
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedJobs.map((job) => (
                <div
                  key={job._id}
                  className="border border-gray-200 rounded-[10px] p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedJobs.includes(job._id)}
                          onCheckedChange={(checked) =>
                            handleSelectJob(job._id, checked as boolean)
                          }
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {job.title}
                            </h3>
                            {job.isFeatured && (
                              <Star className="w-4 h-4 text-yellow-500" />
                            )}
                            {job.isUrgent && (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            {job.company && (
                              <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {job.company}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <Badge className={getTypeColor(job.employmentType)}>
                              {job.employmentType.replace("-", " ")}
                            </Badge>
                            {job.salaryRange && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {job.salaryRange}
                              </span>
                            )}
                          </div>

                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {job.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {job.requiredSkills
                              .slice(0, 3)
                              .map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            {job.requiredSkills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{job.requiredSkills.length - 3} more
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Posted: {formatDate(job.createdAt)}</span>
                            {job.expiryDate && (
                              <span>Expires: {formatDate(job.expiryDate)}</span>
                            )}
                            {job.department && (
                              <span>Dept: {job.department}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="rounded-[10px]"
                      >
                        <Link href={`/dashboard/jobs-management/${job._id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="rounded-[10px]"
                      >
                        <Link
                          href={`/dashboard/jobs-management/${job._id}/edit`}
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteJob(job._id)}
                        className="rounded-[10px] text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-[10px]"
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-[10px]"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
