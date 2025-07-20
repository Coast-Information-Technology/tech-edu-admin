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
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { JobFormData } from "@/types/jobs";
import { postApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";

export default function NewJobPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
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
    { id: 1, title: "Basic Information", icon: Building2 },
    { id: 2, title: "Skills & Details", icon: Briefcase },
    { id: 3, title: "Additional Info", icon: Users },
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
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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

      // Prepare data for API
      const jobData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        employmentType: formData.employmentType,
        requiredSkills: formData.requiredSkills,
        tags: formData.tags,
        salaryRange: formData.salaryRange,
        company: formData.company,
        department: formData.department,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        website: formData.website,
        recruiter: formData.recruiter,
        isFeatured: formData.isFeatured,
        isUrgent: formData.isUrgent,
        expiryDate: formData.expiryDate,
      };

      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await postApiRequest(
        "/api/ats/job-posts",
        token,
        jobData
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success("Job posted successfully!");
        // Clear draft after successful submission
        localStorage.removeItem("jobDraft");
        router.push("/dashboard/jobs-management");
      } else {
        toast.error(response.message || "Failed to post job");
      }
    } catch (error: any) {
      console.error("Error posting job:", error);
      toast.error(error.message || "An error occurred while posting the job");
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  className="rounded-[10px]"
                  id="title"
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  className="rounded-[10px]"
                  id="company"
                  placeholder="e.g., TechCorp Solutions"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  className="rounded-[10px]"
                  id="location"
                  placeholder="e.g., London, UK or Remote"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
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
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={6}
                className="rounded-[10px]"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="salaryRange">Salary Range</Label>
              <Input
                className="rounded-[10px]"
                id="salaryRange"
                placeholder="e.g., 60000-90000 USD"
                value={formData.salaryRange}
                onChange={(e) =>
                  handleInputChange("salaryRange", e.target.value)
                }
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
                  className="rounded-[10px]"
                  placeholder="Add a required skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-[10px]"
                  onClick={addSkill}
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
                  className="rounded-[10px]"
                  placeholder="Add a tag (e.g., backend, nodejs, api)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-[10px]"
                  onClick={addTag}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  className="rounded-[10px]"
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
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  className="rounded-[10px]"
                  id="contactPhone"
                  placeholder="+44 20 7123 4567"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    handleInputChange("contactPhone", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Company Website</Label>
                <Input
                  className="rounded-[10px]"
                  id="website"
                  placeholder="https://company.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
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
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="text-lg font-semibold">Job Settings</Label>
              <div className="space-y-4">
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
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="rounded-[10px]"
            size="sm"
            asChild
          >
            <Link href="/dashboard/jobs-management">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#011F72]">Post New Job</h1>
            <p className="text-gray-600 mt-1">Create a new job posting</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-[10px]"
            onClick={handlePreview}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            className="rounded-[10px]"
            onClick={handleSaveDraft}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center gap-3 ${
                      index > 0 ? "ml-8" : ""
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="hidden md:block">
                      <div
                        className={`font-medium ${
                          isActive ? "text-blue-600" : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block w-16 h-0.5 bg-gray-200 ml-4"></div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {steps[currentStep - 1].icon &&
              React.createElement(steps[currentStep - 1].icon, {
                className: "w-5 h-5",
              })}
            {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          className="rounded-[10px] text-white hover:text-black"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        <div className="flex gap-3">
          {currentStep < steps.length ? (
            <Button
              onClick={nextStep}
              className="rounded-[10px] text-white hover:text-black"
            >
              Next Step
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="text-white hover:text-black"
            >
              <Save className="w-4 h-4 mr-2" />
              Post Job
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
