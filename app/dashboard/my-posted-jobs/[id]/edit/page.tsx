"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Calendar,
  Users,
  Eye,
  Building2,
  Star,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

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

// Mock data for job details
const mockJobDetails: JobFormData = {
  title: "Senior Frontend Developer",
  company: "TechEdu Solutions",
  department: "Engineering",
  location: "London, UK",
  type: "full-time",
  salaryMin: "60000",
  salaryMax: "80000",
  currency: "GBP",
  experience: "3-5 years",
  description:
    "We are looking for a talented frontend developer to join our team. You will be responsible for building and maintaining web applications using modern technologies like React, TypeScript, and Node.js.",
  requirements: [
    "3+ years of experience with React and TypeScript",
    "Strong understanding of modern JavaScript",
    "Experience with CSS preprocessors (Sass, Less)",
    "Knowledge of responsive design principles",
    "Experience with version control (Git)",
  ],
  benefits: [
    "Competitive salary and benefits",
    "Flexible working hours",
    "Remote work options",
    "Professional development opportunities",
    "Health insurance",
  ],
  contactEmail: "hr@techedu.com",
  contactPhone: "+44 123 456 7890",
  website: "https://techedu.com",
  recruiter: "Sarah Johnson",
  isFeatured: true,
  isUrgent: false,
  expiryDate: "2024-07-15",
  skills: ["React", "TypeScript", "JavaScript", "CSS", "Git"],
  responsibilities: [
    "Build and maintain web applications",
    "Collaborate with design and backend teams",
    "Write clean, maintainable code",
    "Participate in code reviews",
  ],
};

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [formData, setFormData] = useState<JobFormData>(mockJobDetails);
  const [newRequirement, setNewRequirement] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");

  const handleInputChange = (field: keyof JobFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (
    field: "requirements" | "benefits" | "skills" | "responsibilities",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (
    field: "requirements" | "benefits" | "skills" | "responsibilities",
    value: string
  ) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
      // Clear the input field
      switch (field) {
        case "requirements":
          setNewRequirement("");
          break;
        case "benefits":
          setNewBenefit("");
          break;
        case "skills":
          setNewSkill("");
          break;
        case "responsibilities":
          setNewResponsibility("");
          break;
      }
    }
  };

  const removeArrayItem = (
    field: "requirements" | "benefits" | "skills" | "responsibilities",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    // TODO: Implement save API call
    console.log("Saving job:", formData);
    router.push(`/dashboard/my-posted-jobs/${jobId}`);
  };

  const handleCancel = () => {
    router.push(`/dashboard/my-posted-jobs/${jobId}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/my-posted-jobs/${jobId}`}>
            <Button variant="ghost" size="sm" className="rounded-[10px]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Job
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Job Posting
            </h1>
            <p className="text-gray-600">Update your job posting details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="rounded-[10px]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-[10px] bg-blue-600 text-white hover:text-black"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Senior Frontend Developer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    placeholder="e.g., Engineering"
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
                    placeholder="e.g., London, UK"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Job Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-[10px]">
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) =>
                      handleInputChange("experience", e.target.value)
                    }
                    placeholder="e.g., 3-5 years"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Information */}
          <Card>
            <CardHeader>
              <CardTitle>Salary & Compensation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Minimum Salary</Label>
                  <Input
                    id="salaryMin"
                    value={formData.salaryMin}
                    onChange={(e) =>
                      handleInputChange("salaryMin", e.target.value)
                    }
                    placeholder="e.g., 60000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Maximum Salary</Label>
                  <Input
                    id="salaryMax"
                    value={formData.salaryMax}
                    onChange={(e) =>
                      handleInputChange("salaryMax", e.target.value)
                    }
                    placeholder="e.g., 80000"
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
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-[10px]">
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={req}
                      onChange={(e) =>
                        handleArrayChange("requirements", index, e.target.value)
                      }
                      placeholder="Enter requirement"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem("requirements", index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="Add new requirement"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      addArrayItem("requirements", newRequirement)
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("requirements", newRequirement)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {formData.responsibilities.map((resp, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={resp}
                      onChange={(e) =>
                        handleArrayChange(
                          "responsibilities",
                          index,
                          e.target.value
                        )
                      }
                      placeholder="Enter responsibility"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem("responsibilities", index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    placeholder="Add new responsibility"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      addArrayItem("responsibilities", newResponsibility)
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      addArrayItem("responsibilities", newResponsibility)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={skill}
                      onChange={(e) =>
                        handleArrayChange("skills", index, e.target.value)
                      }
                      placeholder="Enter skill"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem("skills", index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add new skill"
                    onKeyPress={(e) =>
                      e.key === "Enter" && addArrayItem("skills", newSkill)
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("skills", newSkill)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Benefits & Perks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={benefit}
                      onChange={(e) =>
                        handleArrayChange("benefits", index, e.target.value)
                      }
                      placeholder="Enter benefit"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem("benefits", index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="Add new benefit"
                    onKeyPress={(e) =>
                      e.key === "Enter" && addArrayItem("benefits", newBenefit)
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("benefits", newBenefit)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recruiter">Recruiter Name</Label>
                  <Input
                    id="recruiter"
                    value={formData.recruiter}
                    onChange={(e) =>
                      handleInputChange("recruiter", e.target.value)
                    }
                    placeholder="e.g., Sarah Johnson"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      handleInputChange("contactEmail", e.target.value)
                    }
                    placeholder="e.g., hr@company.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      handleInputChange("contactPhone", e.target.value)
                    }
                    placeholder="e.g., +44 123 456 7890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Company Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    placeholder="e.g., https://company.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Job Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Application Deadline</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    handleInputChange("expiryDate", e.target.value)
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    handleInputChange("isFeatured", checked)
                  }
                />
                <Label htmlFor="isFeatured">Feature this job posting</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isUrgent"
                  checked={formData.isUrgent}
                  onCheckedChange={(checked) =>
                    handleInputChange("isUrgent", checked)
                  }
                />
                <Label htmlFor="isUrgent">Mark as urgent hiring</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Status */}
          <Card>
            <CardHeader>
              <CardTitle>Job Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Current Status</Label>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Job Features */}
          <Card>
            <CardHeader>
              <CardTitle>Job Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {formData.isFeatured && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {formData.isUrgent && (
                <Badge className="bg-red-100 text-red-800">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Urgent
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start rounded-[10px]"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Job
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start rounded-[10px]"
              >
                <Users className="h-4 w-4 mr-2" />
                View Applicants
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start rounded-[10px]"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Set Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Job Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Job Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Views</span>
                <span className="font-medium">342</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Applicants</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Days Posted</span>
                <span className="font-medium">15</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
