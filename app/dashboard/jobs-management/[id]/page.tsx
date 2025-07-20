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
        const token = getTokenFromCookies();
        if (!token) {
          toast.error("Authentication required");
          return;
        }

        const response = await deleteApiRequest(
          `/api/ats/job-posts/${job._id}`,
          token
        );

        if (response.status >= 200 && response.status < 300) {
          toast.success("Job deleted successfully");
          router.push("/dashboard/jobs-management");
        } else {
          toast.error(response.message || "Failed to delete job");
        }
      } catch (error: any) {
        console.error("Error deleting job:", error);
        toast.error(
          error.message || "An error occurred while deleting the job"
        );
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
        title: job?.title,
        text: job?.description,
        url: window.location.href,
      });
    } else {
      copyToClipboard(window.location.href);
    }
  };

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
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading job details...</span>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Job not found"}</p>
          <Button
            onClick={() => router.push("/dashboard/jobs-management")}
            variant="outline"
          >
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="rounded-[10px]"
            onClick={() => router.push("/dashboard/jobs-management")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#011F72]">{job.title}</h1>
            <p className="text-gray-600 mt-1">
              Job Details • Posted {formatDate(job.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-[10px]"
            onClick={shareJob}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" className="rounded-[10px]" asChild>
            <Link href={`/dashboard/jobs-management/${job._id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Job
            </Link>
          </Button>
          <Button
            variant="destructive"
            className="rounded-[10px]"
            onClick={handleDeleteJob}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Job
          </Button>
        </div>
      </div>

      {/* Job Status Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge className={getTypeColor(job.employmentType || "full-time")}>
          {(job.employmentType || "full-time").replace("-", " ")}
        </Badge>
        {job.isFeatured && (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        {job.isUrgent && (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Urgent
          </Badge>
        )}
        {job.isDeleted && (
          <Badge className="bg-gray-100 text-gray-800">
            <X className="w-3 h-3 mr-1" />
            Deleted
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Required Skills */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Required Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(job.requiredSkills || []).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {(job.tags || []).length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(job.tags || []).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Overview */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Job Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {job.company && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Company</p>
                    <p className="text-sm text-gray-600">{job.company}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-gray-600">{job.location}</p>
                </div>
              </div>

              {job.salaryRange && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Salary Range</p>
                    <p className="text-sm text-gray-600">{job.salaryRange}</p>
                  </div>
                </div>
              )}

              {job.department && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Department</p>
                    <p className="text-sm text-gray-600">{job.department}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Posted</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(job.createdAt)}
                  </p>
                </div>
              </div>

              {job.expiryDate && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Expires</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(job.expiryDate)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          {(job.contactEmail || job.contactPhone || job.website) && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Email</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">
                          {job.contactEmail}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(job.contactEmail!)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {job.contactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Phone</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">
                          {job.contactPhone}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(job.contactPhone!)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {job.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Website</p>
                      <div className="flex items-center gap-2">
                        <a
                          href={job.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {job.website}
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(job.website!)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {job.recruiter && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Recruiter</p>
                      <p className="text-sm text-gray-600">{job.recruiter}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Job Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px]"
                asChild
              >
                <Link href={`/dashboard/jobs-management/${job._id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Job
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-[10px]"
                onClick={shareJob}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Job
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-[10px]"
                onClick={() => copyToClipboard(job.slug)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Job ID
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
