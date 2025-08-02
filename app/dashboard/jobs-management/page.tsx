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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  BarChart3,
  TrendingDown,
  Users2,
  BriefcaseBusiness,
  Sparkles,
  AlertTriangle,
  CheckCheck,
  Timer,
  CalendarDays,
  FilterX,
  SortAsc,
  SortDesc,
  Euro,
  Grid,
  List,
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

      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }
      const response = await getApiRequest<{
        success: boolean;
        message: string;
        data: Job[];
        meta?: any;
      }>("/api/ats/job-posts", token);

      if (response.status >= 200 && response.status < 300) {
        // Handle nested data structure: response.data.data contains the actual jobs array
        const jobsData = response.data?.data || response.data || [];
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

      if (!token) {
        return { success: false, message: "Authentication required" };
      }

      const response = await deleteApiRequest(
        `/api/ats/job-posts/${jobId}`,
        token
      );

      if (response.status >= 200 && response.status < 300) {
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
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [isBulkDeleteConfirmationOpen, setIsBulkDeleteConfirmationOpen] =
    useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      case "part-time":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      case "contract":
        return "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200";
      case "internship":
        return "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200";
      case "remote":
        return "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200";
      default:
        return "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusColor = (job: Job) => {
    if (job.isDeleted) {
      return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200";
    }
    if (job.isUrgent) {
      return "bg-gradient-to-r from-red-100 to-orange-100 text-red-800 border-red-200";
    }
    if (job.isFeatured) {
      return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200";
    }
    return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
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
    setJobToDelete(jobId);
    setIsDeleteConfirmationOpen(true);
  };

  const handleBulkDelete = async () => {
    if (selectedJobs.length === 0) {
      toast.error("Please select jobs to delete");
      return;
    }

    setIsBulkDeleteConfirmationOpen(true);
  };

  const confirmBulkDelete = async () => {
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
    setIsBulkDeleteConfirmationOpen(false);
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

      const matchesStatus = (() => {
        if (filterStatus === "all") return true;
        if (filterStatus === "active") return !job.isDeleted;
        if (filterStatus === "deleted") return job.isDeleted;
        if (filterStatus === "featured") return job.isFeatured;
        if (filterStatus === "urgent") return job.isUrgent;
        return true;
      })();

      return matchesSearch && matchesType && matchesStatus;
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
        case "salary":
          return (a.salaryRange || "").localeCompare(b.salaryRange || "");
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-lg text-slate-600">Loading jobs...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">
                Error Loading Jobs
              </h3>
              <p className="text-red-700 mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={fetchJobs}
                  variant="outline"
                  className="rounded-2xl"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={() => {
                    const token = getTokenFromCookies();
                    if (!token) {
                      toast.error(
                        "No authentication token found. Please log in."
                      );
                    } else {
                      toast.success("Token found. API should work.");
                    }
                  }}
                  variant="outline"
                  className="rounded-2xl"
                >
                  Check Auth
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Job Management
              </h1>
              <p className="text-slate-600 text-lg">
                Manage and monitor your job postings with advanced analytics
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                asChild
              >
                <Link href="/dashboard/jobs-management/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Job
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Total Jobs
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {jobs.length}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">All time</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Active Jobs
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {jobs.filter((job) => !job.isDeleted).length}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Currently live</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Featured
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {jobs.filter((job) => job.isFeatured).length}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Premium listings
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Urgent
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    {jobs.filter((job) => job.isUrgent).length}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Priority hiring</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Deleted
                  </p>
                  <p className="text-3xl font-bold text-slate-600">
                    {jobs.filter((job) => job.isDeleted).length}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Archived</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-slate-100 to-gray-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters and Search */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
              <div className="flex flex-col lg:flex-row gap-4 flex-1">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    placeholder="Search jobs by title, company, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="pl-10 pr-8 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-2xl">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative">
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger className="px-6 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-2xl">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="deleted">Deleted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Sort Controls */}
              <div className="flex gap-3">
                <div className="relative">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="px-6 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-2xl">
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="title">By Title</SelectItem>
                      <SelectItem value="company">By Company</SelectItem>
                      <SelectItem value="salary">By Salary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-2xl text-gray-400"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-2xl text-gray-400"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedJobs.length > 0 && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-xl mb-8">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-blue-800">
                    {selectedJobs.length} job(s) selected
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedJobs([])}
                    className="rounded-2xl"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Selection
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="rounded-2xl"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Jobs List/Grid */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-slate-900">
                  Job Postings ({filteredJobs.length})
                </span>
                <Badge variant="secondary" className="rounded-full">
                  {paginatedJobs.length} showing
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={
                    selectedJobs.length === paginatedJobs.length &&
                    paginatedJobs.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                  className="rounded"
                />
                <span className="text-sm text-slate-500">Select All</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paginatedJobs.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  {searchTerm || filterType !== "all" || filterStatus !== "all"
                    ? "Try adjusting your search criteria or filters to find what you're looking for."
                    : "Get started by posting your first job to attract talented candidates."}
                </p>
                {!searchTerm &&
                  filterType === "all" &&
                  filterStatus === "all" && (
                    <Button
                      asChild
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <Link href="/dashboard/jobs-management/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Post New Job
                      </Link>
                    </Button>
                  )}
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-4"
                }
              >
                {paginatedJobs.map((job) => (
                  <div
                    key={job._id}
                    className={`border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                      viewMode === "grid"
                        ? "bg-white/50 backdrop-blur-sm"
                        : "bg-white/50 backdrop-blur-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={selectedJobs.includes(job._id)}
                            onCheckedChange={(checked) =>
                              handleSelectJob(job._id, checked as boolean)
                            }
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                                {job.title}
                              </h3>
                              {job.isFeatured && (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              )}
                              {job.isUrgent && (
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mb-3">
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
                              <Badge
                                className={`${getTypeColor(
                                  job.employmentType
                                )} border`}
                              >
                                {job.employmentType.replace("-", " ")}
                              </Badge>
                              {job.salaryRange && (
                                <span className="flex items-center gap-1">
                                  <Euro className="w-4 h-4" />
                                  {job.salaryRange}
                                </span>
                              )}
                            </div>

                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                              {job.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {job.requiredSkills
                                .slice(0, 3)
                                .map((skill, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs rounded-full"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              {job.requiredSkills.length > 3 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs rounded-full"
                                >
                                  +{job.requiredSkills.length - 3} more
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Posted: {formatDate(job.createdAt)}
                              </span>
                              {job.expiryDate && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Expires: {formatDate(job.expiryDate)}
                                </span>
                              )}
                              {job.department && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {job.department}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="rounded-2xl hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
                        >
                          <Link href={`/dashboard/jobs-management/${job._id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="rounded-2xl hover:bg-yellow-50 hover:border-yellow-200 transition-all duration-300"
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
                          className="rounded-2xl text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 transition-all duration-300"
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

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl mt-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-slate-600">
                  Showing{" "}
                  <span className="font-semibold text-slate-900">
                    {Math.min(
                      (currentPage - 1) * itemsPerPage + 1,
                      filteredJobs.length
                    )}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-900">
                    {Math.min(currentPage * itemsPerPage, filteredJobs.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {filteredJobs.length}
                  </span>{" "}
                  jobs
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="rounded-2xl w-10 h-10 p-0"
                        >
                          {page}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && (
                      <span className="text-slate-500">...</span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteConfirmationOpen}
        onOpenChange={setIsDeleteConfirmationOpen}
      >
        <DialogContent className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmationOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (jobToDelete) {
                  deleteJob(jobToDelete).then((result) => {
                    if (result.success) {
                      toast.success("Job deleted successfully");
                      setIsDeleteConfirmationOpen(false);
                      setJobToDelete(null);
                    } else {
                      toast.error(result.message || "Failed to delete job");
                    }
                  });
                }
              }}
              className="text-white bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={isBulkDeleteConfirmationOpen}
        onOpenChange={setIsBulkDeleteConfirmationOpen}
      >
        <DialogContent className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
          <DialogHeader>
            <DialogTitle>Confirm Bulk Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedJobs.length} selected
              jobs? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkDeleteConfirmationOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmBulkDelete}
              className="text-white bg-red-600 hover:bg-red-700"
            >
              Delete {selectedJobs.length} Jobs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
