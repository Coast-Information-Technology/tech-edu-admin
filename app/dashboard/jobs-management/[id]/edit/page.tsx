"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Plus,
  X,
  Save,
  Loader2,
  Building2,
  DollarSign,
  Briefcase,
  Users,
  Star,
  AlertCircle,
  FileText,
  Settings,
  Sparkles,
  Zap,
  Target,
  Award,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
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
import { JobFormData, Job } from "@/types/jobs";
import { getApiRequest, updateApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newTag, setNewTag] = useState("");

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    location: "",
    employmentType: "full-time",
    requiredSkills: [],
    tags: [],
    salaryRange: "",
    company: "",
    department: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    recruiter: "",
    isFeatured: false,
    isUrgent: false,
    expiryDate: "",
  });

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

        console.log("📋 Edit Job Response:", {
          status: response.status,
          message: response.message,
          data: response.data,
          fullResponse: response,
        });

        if (response.status >= 200 && response.status < 300) {
          // Handle nested data structure: response.data.data contains the actual job
          const job = response.data?.data || response.data;
          console.log("📋 Job data for form:", job);

          setFormData({
            title: job.title || "",
            description: job.description || "",
            location: job.location || "",
            employmentType:
              job.employmentType && job.employmentType.trim() !== ""
                ? job.employmentType
                : "full-time",
            requiredSkills: job.requiredSkills || [],
            tags: job.tags || [],
            salaryRange: job.salaryRange || "",
            company: job.company || "",
            department: job.department || "",
            contactEmail: job.contactEmail || "",
            contactPhone: job.contactPhone || "",
            website: job.website || "",
            recruiter: job.recruiter || "",
            isFeatured: job.isFeatured || false,
            isUrgent: job.isUrgent || false,
            expiryDate: job.expiryDate || "",
          });
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

  const handleInputChange = (field: keyof JobFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const response = await updateApiRequest(
        `/api/ats/job-posts/${jobId}`,
        token,
        formData
      );

      if (response?.data?.success) {
        setSuccess(true);
        toast.success("Job updated successfully!");
        setTimeout(() => {
          router.push(`/dashboard/jobs-management/${jobId}`);
        }, 2000);
      } else {
        setError(response?.data?.message || "Failed to update job");
        toast.error("Failed to update job");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred while updating the job");
      toast.error("An error occurred while updating the job");
    } finally {
      setSaving(false);
    }
  };

  const validateForm = (): boolean => {
    return !!(
      formData.title &&
      formData.description &&
      formData.location &&
      formData.requiredSkills.length > 0 &&
      formData.contactEmail
    );
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href={`/dashboard/jobs-management/${jobId}`}>
              <Button variant="outline" size="sm" className="rounded-2xl">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Job
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Edit Job Posting
              </h1>
              <p className="text-slate-600 mt-1">
                Update the details of your job posting
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Success!</h3>
              <p className="text-green-700">
                Job updated successfully. Redirecting to job details...
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-8">
          {/* Basic Information */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Basic Information
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Job title, company, and location details
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Job Title *
                  </Label>
                  <Input
                    className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    id="title"
                    placeholder="e.g., Senior Software Engineer"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="company"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Company
                  </Label>
                  <Input
                    className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    id="company"
                    placeholder="e.g., TechCorp Solutions"
                    value={formData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Location *
                  </Label>
                  <Input
                    className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    id="location"
                    placeholder="e.g., San Francisco, CA or Remote"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="employmentType"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Employment Type
                  </Label>
                  <Select
                    value={formData.employmentType}
                    onValueChange={(value) =>
                      handleInputChange("employmentType", value)
                    }
                  >
                    <SelectTrigger className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-2xl">
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="salaryRange"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Salary Range
                  </Label>
                  <Input
                    className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    id="salaryRange"
                    placeholder="e.g., $80,000 - $120,000"
                    value={formData.salaryRange}
                    onChange={(e) =>
                      handleInputChange("salaryRange", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="department"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Department
                  </Label>
                  <Input
                    className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    id="department"
                    placeholder="e.g., Engineering, Marketing"
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description & Skills */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Job Description & Skills
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Detailed description and required skills
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-semibold text-slate-700"
                >
                  Job Description *
                </Label>
                <Textarea
                  className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-h-[120px]"
                  id="description"
                  placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold text-slate-700">
                  Required Skills *
                </Label>
                <div className="flex gap-2">
                  <Input
                    className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Add a skill (e.g., React, Python)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  />
                  <Button
                    onClick={addSkill}
                    className="rounded-2xl bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.requiredSkills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="rounded-full px-3 py-1"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(index)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold text-slate-700">
                  Tags (Optional)
                </Label>
                <div className="flex gap-2">
                  <Input
                    className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Add a tag (e.g., startup, remote-friendly)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button
                    onClick={addTag}
                    className="rounded-2xl bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-full px-3 py-1"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(index)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Additional Info */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Contact & Additional Info
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Contact details and job preferences
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="contactEmail"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Contact Email *
                  </Label>
                  <Input
                    className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    id="contactEmail"
                    type="email"
                    placeholder="hr@company.com"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      handleInputChange("contactEmail", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="contactPhone"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Contact Phone
                  </Label>
                  <Input
                    className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    id="contactPhone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      handleInputChange("contactPhone", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="website"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Company Website
                  </Label>
                  <Input
                    className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    id="website"
                    placeholder="https://company.com"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="recruiter"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Recruiter Name
                  </Label>
                  <Input
                    className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    id="recruiter"
                    placeholder="John Doe"
                    value={formData.recruiter}
                    onChange={(e) =>
                      handleInputChange("recruiter", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="expiryDate"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Expiry Date
                  </Label>
                  <Input
                    className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      handleInputChange("expiryDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Job Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) =>
                        handleInputChange("isFeatured", checked)
                      }
                      className="rounded"
                    />
                    <Label
                      htmlFor="isFeatured"
                      className="flex items-center gap-2"
                    >
                      <Star className="w-4 h-4 text-yellow-500" />
                      Featured Job (Premium listing)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="isUrgent"
                      checked={formData.isUrgent}
                      onCheckedChange={(checked) =>
                        handleInputChange("isUrgent", checked)
                      }
                      className="rounded"
                    />
                    <Label
                      htmlFor="isUrgent"
                      className="flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      Urgent Hiring
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button variant="outline" asChild className="rounded-2xl">
              <Link href={`/dashboard/jobs-management/${jobId}`}>Cancel</Link>
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || !validateForm()}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Job...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Job
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
