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
            employmentType: job.employmentType || "full-time",
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
    try {
      // Validate required fields
      if (
        !formData.title ||
        !formData.description ||
        !formData.location ||
        !formData.employmentType ||
        formData.requiredSkills.length === 0
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      setSaving(true);

      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await updateApiRequest(
        `/api/ats/job-posts/${jobId}`,
        token,
        formData
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success("Job updated successfully!");
        router.push(`/dashboard/jobs-management/${jobId}`);
      } else {
        toast.error(response.message || "Failed to update job");
      }
    } catch (error: any) {
      console.error("Error updating job:", error);
      toast.error(error.message || "An error occurred while updating the job");
    } finally {
      setSaving(false);
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
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
          <Button variant="outline" className="rounded-[10px]" asChild>
            <Link href={`/dashboard/jobs-management/${jobId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Job
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#011F72]">Edit Job</h1>
            <p className="text-gray-600 mt-1">Update job posting details</p>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px]"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    className="rounded-[10px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    placeholder="e.g., TechCorp Solutions"
                    className="rounded-[10px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="e.g., London, UK or Remote"
                    className="rounded-[10px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type *</Label>
                  <Select
                    value={formData.employmentType}
                    onValueChange={(value) =>
                      handleInputChange("employmentType", value)
                    }
                  >
                    <SelectTrigger className="rounded-[10px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-[10px]">
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  rows={6}
                  className="rounded-[10px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills & Details */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Skills & Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="salaryRange">Salary Range</Label>
                <Input
                  id="salaryRange"
                  value={formData.salaryRange}
                  onChange={(e) =>
                    handleInputChange("salaryRange", e.target.value)
                  }
                  placeholder="e.g., 60000-90000 USD"
                  className="rounded-[10px]"
                />
              </div>

              <div className="space-y-4">
                <Label>Required Skills *</Label>
                <div className="flex gap-2 flex-wrap">
                  {formData.requiredSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {skill}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeSkill(index)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a required skill"
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    className="rounded-[10px]"
                  />
                  <Button
                    onClick={addSkill}
                    size="sm"
                    className="rounded-[10px] text-white hover:text-black"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Tags</Label>
                <div className="flex gap-2 flex-wrap">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {tag}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeTag(index)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag (e.g., backend, nodejs, api)"
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                    className="rounded-[10px]"
                  />
                  <Button
                    onClick={addTag}
                    size="sm"
                    className="rounded-[10px] text-white hover:text-black"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    handleInputChange("contactEmail", e.target.value)
                  }
                  placeholder="hr@company.com"
                  className="rounded-[10px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    handleInputChange("contactPhone", e.target.value)
                  }
                  placeholder="+44 20 7123 4567"
                  className="rounded-[10px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Company Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://company.com"
                  className="rounded-[10px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    handleInputChange("department", value)
                  }
                >
                  <SelectTrigger className="rounded-[10px]">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-[10px]">
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="IT Operations">IT Operations</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recruiter">Recruiter</Label>
                <Input
                  id="recruiter"
                  value={formData.recruiter}
                  onChange={(e) =>
                    handleInputChange("recruiter", e.target.value)
                  }
                  placeholder="e.g., Sarah Johnson"
                  className="rounded-[10px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    handleInputChange("expiryDate", e.target.value)
                  }
                  className="rounded-[10px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Job Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Job Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    handleInputChange("isFeatured", checked)
                  }
                />
                <Label htmlFor="featured" className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Feature this job (increases visibility)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="urgent"
                  checked={formData.isUrgent}
                  onCheckedChange={(checked) =>
                    handleInputChange("isUrgent", checked)
                  }
                />
                <Label htmlFor="urgent" className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  Mark as urgent (priority placement)
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
