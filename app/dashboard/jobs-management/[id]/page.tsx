"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  Users,
  Mail,
  Phone,
  Globe,
  Star,
  AlertCircle,
  Clock,
  Briefcase,
  CheckCircle,
  X,
  Edit,
  Trash2,
  Share2,
  Copy,
  Loader2,
  ExternalLink,
  Eye,
  Bookmark,
  BookmarkPlus,
  BookmarkCheck,
  FileText,
  Award,
  Target,
  Zap,
  Sparkles,
  AlertTriangle,
  Info,
  TrendingUp,
  Users2,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  MapPinIcon,
  Building,
  GraduationCap,
  Heart,
  Send,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Job } from "@/types/jobs";
import { getApiRequest, deleteApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
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
          data: Job;
          meta?: any;
        }>(`/api/ats/job-posts/${jobId}`, token);

        if (response.status >= 200 && response.status < 300) {
          // Handle nested data structure: response.data.data contains the actual job
          const jobData = response.data?.data || response.data;
          console.log("📋 Job data:", jobData);
          setJob(jobData);
        } else {
          setError(response.message || "Failed to fetch job details");
        }
      } catch (error: any) {
        console.error("Error fetching job:", error);
        setError(
          error.message || "An error occurred while fetching job details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const handleDeleteJob = async () => {
    if (!job) return;

    if (
      confirm(
        "Are you sure you want to delete this job? This action cannot be undone."
      )
    ) {
      try {
        setDeleteLoading(true);
        setDeleteError(null);

        const token = getTokenFromCookies();
        if (!token) {
          toast.error("Authentication required");
          return;
        }

        const response = await deleteApiRequest(
          `/api/ats/job-posts/${jobId}`,
          token
        );

        if (response.status >= 200 && response.status < 300) {
          toast.success("Job deleted successfully");
          router.push("/dashboard/jobs-management");
        } else {
          setDeleteError(response.message || "Failed to delete job");
          toast.error("Failed to delete job");
        }
      } catch (error: any) {
        setDeleteError(
          error.message || "An error occurred while deleting the job"
        );
        toast.error("An error occurred while deleting the job");
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title || "Job Posting",
        text: `Check out this job: ${job?.title} at ${job?.company}`,
        url: window.location.href,
      });
    } else {
      copyToClipboard(window.location.href);
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-lg text-slate-600">
                Loading job details...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">
                Error Loading Job
              </h3>
              <p className="text-red-700 mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="rounded-2xl"
                >
                  Try Again
                </Button>
                <Button asChild variant="outline" className="rounded-2xl">
                  <Link href="/dashboard/jobs-management">Back to Jobs</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Job Not Found
              </h3>
              <p className="text-slate-600 mb-6">
                The job you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild className="rounded-2xl">
                <Link href="/dashboard/jobs-management">Back to Jobs</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard/jobs-management">
              <Button variant="outline" size="sm" className="rounded-2xl">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {job.title}
                </h1>
                {job.isFeatured && (
                  <Star className="w-6 h-6 text-yellow-500 fill-current" />
                )}
                {job.isUrgent && (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
              <p className="text-slate-600 text-lg">
                {job.company && `${job.company} • `}
                {job.location}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={shareJob}
                className="rounded-2xl"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-2xl"
              >
                <Link href={`/dashboard/jobs-management/${jobId}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteJob}
                disabled={deleteLoading}
                className="rounded-2xl text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
              >
                {deleteLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Delete
              </Button>
            </div>
          </div>

          {/* Job Status Badges */}
          <div className="flex flex-wrap gap-3">
            <Badge className={`${getTypeColor(job.employmentType)} border`}>
              <Briefcase className="w-3 h-3 mr-1" />
              {job.employmentType.replace("-", " ")}
            </Badge>
            {job.isFeatured && (
              <Badge className="bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {job.isUrgent && (
              <Badge className="bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200">
                <AlertCircle className="w-3 h-3 mr-1" />
                Urgent
              </Badge>
            )}
            {job.salaryRange && (
              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200">
                <DollarSign className="w-3 h-3 mr-1" />
                {job.salaryRange}
              </Badge>
            )}
          </div>
        </div>

        {/* Job Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Job Description
                    </h2>
                    <p className="text-slate-600 text-sm">
                      Detailed information about the role
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Required Skills */}
            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Required Skills
                      </h2>
                      <p className="text-slate-600 text-sm">
                        Skills and qualifications needed
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {job.requiredSkills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="rounded-full px-4 py-2 text-sm"
                      >
                        <Award className="w-3 h-3 mr-2" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Tags
                      </h2>
                      <p className="text-slate-600 text-sm">
                        Additional keywords and categories
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {job.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="rounded-full px-4 py-2 text-sm"
                      >
                        <Sparkles className="w-3 h-3 mr-2" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Company Information */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Company Info
                    </h2>
                    <p className="text-slate-600 text-sm">
                      About the organization
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.company && (
                  <div className="flex items-center gap-3">
                    <Building className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-700 font-medium">
                      {job.company}
                    </span>
                  </div>
                )}
                {job.department && (
                  <div className="flex items-center gap-3">
                    <Users2 className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-700">{job.department}</span>
                  </div>
                )}
                {job.location && (
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-700">{job.location}</span>
                  </div>
                )}
                {job.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-slate-500" />
                    <a
                      href={job.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Contact
                    </h2>
                    <p className="text-slate-600 text-sm">Get in touch</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.contactEmail && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-700">{job.contactEmail}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        job.contactEmail && copyToClipboard(job.contactEmail)
                      }
                      className="rounded-full p-1"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                {job.contactPhone && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-700">{job.contactPhone}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        job.contactPhone && copyToClipboard(job.contactPhone)
                      }
                      className="rounded-full p-1"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                {job.recruiter && (
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-700">
                      Recruiter: {job.recruiter}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Info className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Job Details
                    </h2>
                    <p className="text-slate-600 text-sm">
                      Additional information
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700">
                    Posted: {formatDate(job.createdAt)}
                  </span>
                </div>
                {job.expiryDate && (
                  <div className="flex items-center gap-3">
                    <Clock3 className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-700">
                      Expires: {formatDate(job.expiryDate)}
                    </span>
                  </div>
                )}
                {job.salaryRange && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-700">{job.salaryRange}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <BriefcaseBusiness className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700">
                    {job.employmentType.replace("-", " ")}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Quick Actions
                    </h2>
                    <p className="text-slate-600 text-sm">Manage this job</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full rounded-2xl"
                  asChild
                >
                  <Link href={`/dashboard/jobs-management/${jobId}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Job
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-2xl"
                  onClick={shareJob}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Job
                </Button>
                <Button variant="outline" className="w-full rounded-2xl">
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Save to Favorites
                </Button>
                <Button variant="outline" className="w-full rounded-2xl">
                  <Send className="w-4 h-4 mr-2" />
                  Send to Candidates
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Error Message for Delete */}
        {deleteError && (
          <div className="mt-8 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">
                Delete Error
              </h3>
              <p className="text-red-700">{deleteError}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
