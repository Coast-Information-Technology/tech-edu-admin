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

interface JobFormData {
  // Basic Information
  title: string;
  company: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship" | "remote";

  // Salary & Experience
  salaryMin: string;
  salaryMax: string;
  currency: string;
  experience: string;

  // Description & Requirements
  description: string;
  requirements: string[];
  benefits: string[];

  // Contact & Settings
  contactEmail: string;
  contactPhone: string;
  website: string;
  recruiter: string;

  // Job Settings
  isFeatured: boolean;
  isUrgent: boolean;
  expiryDate: string;

  // Additional Fields
  skills: string[];
  responsibilities: string[];
}

export default function NewJobPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: "",
    department: "",
    location: "",
    type: "full-time",
    salaryMin: "",
    salaryMax: "",
    currency: "GBP",
    experience: "",
    description: "",
    requirements: [],
    benefits: [],
    contactEmail: "",
    contactPhone: "",
    website: "",
    recruiter: "",
    isFeatured: false,
    isUrgent: false,
    expiryDate: "",
    skills: [],
    responsibilities: [],
  });

  const [newRequirement, setNewRequirement] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");

  const steps = [
    { id: 1, title: "Basic Information", icon: Building2 },
    { id: 2, title: "Salary & Experience", icon: DollarSign },
    { id: 3, title: "Description & Requirements", icon: Briefcase },
    { id: 4, title: "Contact & Settings", icon: Users },
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

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }));
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()],
      }));
      setNewResponsibility("");
    }
  };

  const removeResponsibility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
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

  const handleSubmit = () => {
    console.log("Submitting job:", formData);
    // Clear draft after successful submission
    localStorage.removeItem("jobDraft");
    // Handle job submission
    router.push("/dashboard/my-posted-jobs");
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
    router.push("/dashboard/my-posted-jobs");
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
        company: "",
        department: "",
        location: "",
        type: "full-time",
        salaryMin: "",
        salaryMax: "",
        currency: "GBP",
        experience: "",
        description: "",
        requirements: [],
        benefits: [],
        contactEmail: "",
        contactPhone: "",
        website: "",
        recruiter: "",
        isFeatured: false,
        isUrgent: false,
        expiryDate: "",
        skills: [],
        responsibilities: [],
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
                <Label htmlFor="company">Company *</Label>
                <Input
                  className="rounded-[10px]"
                  id="company"
                  placeholder="e.g., TechCorp Solutions"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
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
                <Label htmlFor="location">Location *</Label>
                <Input
                  className="rounded-[10px]"
                  id="location"
                  placeholder="e.g., London, UK"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Job Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
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

              <div className="space-y-2">
                <Label htmlFor="recruiter">Recruiter</Label>
                <Input
                  className="rounded-[10px]"
                  id="recruiter"
                  placeholder="e.g., Sarah Johnson"
                  value={formData.recruiter}
                  onChange={(e) =>
                    handleInputChange("recruiter", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Minimum Salary *</Label>
                <Input
                  className="rounded-[10px]"
                  id="salaryMin"
                  type="number"
                  placeholder="e.g., 50000"
                  value={formData.salaryMin}
                  onChange={(e) =>
                    handleInputChange("salaryMin", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryMax">Maximum Salary *</Label>
                <Input
                  className="rounded-[10px]"
                  id="salaryMax"
                  type="number"
                  placeholder="e.g., 70000"
                  value={formData.salaryMax}
                  onChange={(e) =>
                    handleInputChange("salaryMax", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    handleInputChange("currency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-[10px]">
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience Required</Label>
              <Input
                className="rounded-[10px]"
                id="experience"
                placeholder="e.g., 3+ years"
                value={formData.experience}
                onChange={(e) =>
                  handleInputChange("experience", e.target.value)
                }
              />
            </div>

            <div className="space-y-4">
              <Label>Key Skills</Label>
              <div className="flex gap-2 flex-wrap">
                {formData.skills.map((skill, index) => (
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
                  placeholder="Add a skill"
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
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
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
              />
            </div>

            <div className="space-y-4">
              <Label>Key Responsibilities</Label>
              <div className="space-y-2">
                {formData.responsibilities.map((resp, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="flex-1">{resp}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeResponsibility(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  className="rounded-[10px]"
                  placeholder="Add a responsibility"
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addResponsibility()}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-[10px]"
                  onClick={addResponsibility}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Requirements</Label>
              <div className="space-y-2">
                {formData.requirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    <span className="flex-1">{req}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRequirement(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  className="rounded-[10px]"
                  placeholder="Add a requirement"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addRequirement()}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-[10px]"
                  onClick={addRequirement}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Benefits</Label>
              <div className="space-y-2">
                {formData.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="flex-1">{benefit}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBenefit(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  className="rounded-[10px]"
                  placeholder="Add a benefit"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addBenefit()}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-[10px]"
                  onClick={addBenefit}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
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
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  className="rounded-[10px]"
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
            <Link href="/dashboard/jobs">
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
