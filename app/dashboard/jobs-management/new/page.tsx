"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Plus,
  X,
  Save,
  Eye,
  Calendar,
  MapPin,
  DollarSign,
  Briefcase,
  Building2,
  Users,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
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
  Loader2,
  AlertTriangle,
  Info,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { JobFormData } from "@/types/jobs";
import { postApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";

export default function NewJobPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
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

  const [newSkill, setNewSkill] = useState("");
  const [newTag, setNewTag] = useState("");

  const steps = [
    {
      id: 1,
      title: "Basic Information",
      icon: Building2,
      description: "Job title, company, and location",
    },
    {
      id: 2,
      title: "Skills & Details",
      icon: Briefcase,
      description: "Requirements and job details",
    },
    {
      id: 3,
      title: "Additional Info",
      icon: Users,
      description: "Contact and preferences",
    },
  ];

  // Load draft from cookies on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("jobDraft");
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setFormData(parsedDraft);
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, []);

  // Save draft to cookies whenever form data changes
  useEffect(() => {
    localStorage.setItem("jobDraft", JSON.stringify(formData));
  }, [formData]);

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

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const response = await postApiRequest(
        "/api/ats/job-posts",
        token,
        formData
      );

      if (response?.data?.success) {
        setSuccess(true);
        localStorage.removeItem("jobDraft"); // Clear draft on success
        toast.success("Job posted successfully!");
        setTimeout(() => {
          router.push("/dashboard/jobs-management");
        }, 2000);
      } else {
        setError(response?.data?.message || "Failed to post job");
        toast.error("Failed to post job");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred while posting the job");
      toast.error("An error occurred while posting the job");
    } finally {
      setLoading(false);
    }
  };

  // Save draft to server
  const handleSaveDraft = async () => {
    try {
      await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // userId: currentUser.id,
          draftData: formData,
          type: "job-posting",
        }),
      });
      toast.success("Draft saved to cloud!");
    } catch (error) {
      // Fallback to localStorage
      localStorage.setItem("jobDraft", JSON.stringify(formData));
      toast.success("Draft saved locally (offline mode)");
    }
  };

  // Load draft from server
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const response = await fetch("/api/drafts?type=job-posting");
        const draft = await response.json();
        if (draft) setFormData(draft.data);
      } catch (error) {
        // Fallback to localStorage
        const localDraft = localStorage.getItem("jobDraft");
        if (localDraft) setFormData(JSON.parse(localDraft));
      }
    };
    loadDraft();
  }, []);

  const handlePreview = () => {
    router.push("/dashboard/jobs-management");
  };

  const clearDraft = () => {
    if (
      confirm(
        "Are you sure you want to clear the draft? This action cannot be undone."
      )
    ) {
      localStorage.removeItem("jobDraft");
      setFormData({
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
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.location);
      case 2:
        return !!(formData.description && formData.requiredSkills.length > 0);
      case 3:
        return !!formData.contactEmail;
      default:
        return true;
    }
  };

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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Job Posting
              </h1>
              <p className="text-slate-600 mt-1">
                Fill in the details below to create an attractive job posting
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? "bg-blue-600 border-blue-600 text-white"
                        : isCompleted
                        ? "bg-green-600 border-green-600 text-white"
                        : "bg-white border-slate-300 text-slate-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-2 transition-all duration-300 ${
                        isCompleted ? "bg-green-600" : "bg-slate-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
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
                Job posted successfully. Redirecting to jobs management...
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
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
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
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
          )}

          {/* Step 2: Skills & Details */}
          {currentStep === 2 && (
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Skills & Details
                    </h2>
                    <p className="text-slate-600 text-sm">
                      Job description and required skills
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
          )}

          {/* Step 3: Additional Info */}
          {currentStep === 3 && (
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Additional Information
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
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                className="rounded-2xl"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                variant="outline"
                onClick={clearDraft}
                className="rounded-2xl"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Draft
              </Button>
            </div>
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="rounded-2xl"
                >
                  Previous
                </Button>
              )}
              {currentStep < 3 ? (
                <Button
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className="rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  Next
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !validateStep(currentStep)}
                  className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting Job...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Post Job
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
