"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
import {
  ArrowLeft,
  Eye,
  Edit,
  MoreHorizontal,
  MapPin,
  Calendar,
  Building2,
  Users,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  Ban,
  Star,
  Target,
  DollarSign,
  Briefcase,
  Mail,
  Phone,
  Globe,
  Download,
  Share2,
  Copy,
  Trash2,
  Archive,
  AlertCircle,
  CheckSquare,
  XSquare,
  Save,
  X,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship" | "remote";
  status: "active" | "inactive" | "pending" | "expired" | "draft";
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  experience: string;
  applications: number;
  views: number;
  postedDate: string;
  expiryDate: string;
  department: string;
  recruiter: string;
  isFeatured: boolean;
  isUrgent: boolean;
  description: string;
  requirements: string[];
  benefits: string[];
  contactEmail: string;
  contactPhone: string;
  website: string;
}

interface Application {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidateAvatar: string;
  appliedDate: string;
  status:
    | "pending"
    | "reviewed"
    | "shortlisted"
    | "interviewed"
    | "hired"
    | "rejected";
  experience: string;
  location: string;
  matchScore: number;
}

const mockJob: Job = {
  id: "1",
  title: "Senior Software Engineer",
  company: "TechCorp Solutions",
  companyLogo: "/assets/logo.png",
  location: "London, UK",
  type: "full-time",
  status: "active",
  salary: { min: 65000, max: 85000, currency: "GBP" },
  experience: "5+ years",
  applications: 24,
  views: 156,
  postedDate: "2024-01-15",
  expiryDate: "2024-02-15",
  department: "Engineering",
  recruiter: "Sarah Johnson",
  isFeatured: true,
  isUrgent: false,
  description:
    "We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining high-quality software solutions that meet business requirements and technical specifications.",
  requirements: [
    "5+ years of experience in software development",
    "Strong proficiency in JavaScript, Python, or Java",
    "Experience with modern frameworks (React, Node.js, Django)",
    "Knowledge of database design and SQL",
    "Experience with cloud platforms (AWS, Azure, GCP)",
    "Strong problem-solving and analytical skills",
    "Excellent communication and teamwork abilities",
  ],
  benefits: [
    "Competitive salary and benefits package",
    "Flexible working hours and remote work options",
    "Professional development and training opportunities",
    "Health insurance and wellness programs",
    "Modern office environment with latest technology",
    "Regular team events and social activities",
  ],
  contactEmail: "hr@techcorp.com",
  contactPhone: "+44 20 7123 4567",
  website: "https://techcorp.com",
};

const mockApplications: Application[] = [
  {
    id: "1",
    candidateName: "John Smith",
    candidateEmail: "john.smith@email.com",
    candidateAvatar: "/assets/placeholder-avatar.jpg",
    appliedDate: "2024-01-18",
    status: "shortlisted",
    experience: "6 years",
    location: "London, UK",
    matchScore: 92,
  },
  {
    id: "2",
    candidateName: "Emma Wilson",
    candidateEmail: "emma.wilson@email.com",
    candidateAvatar: "/assets/placeholder-avatar.jpg",
    appliedDate: "2024-01-17",
    status: "reviewed",
    experience: "5 years",
    location: "Manchester, UK",
    matchScore: 88,
  },
  {
    id: "3",
    candidateName: "David Brown",
    candidateEmail: "david.brown@email.com",
    candidateAvatar: "/assets/placeholder-avatar.jpg",
    appliedDate: "2024-01-16",
    status: "pending",
    experience: "7 years",
    location: "Birmingham, UK",
    matchScore: 85,
  },
  {
    id: "4",
    candidateName: "Lisa Johnson",
    candidateEmail: "lisa.johnson@email.com",
    candidateAvatar: "/assets/placeholder-avatar.jpg",
    appliedDate: "2024-01-15",
    status: "interviewed",
    experience: "4 years",
    location: "Edinburgh, UK",
    matchScore: 90,
  },
];

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [job, setJob] = useState<Job>(mockJob);
  const [applications] = useState<Application[]>(mockApplications);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Job>(mockJob);
  const [newRequirement, setNewRequirement] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return <div>Loading...</div>;
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-blue-100 text-blue-800";
      case "part-time":
        return "bg-green-100 text-green-800";
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "interviewed":
        return "bg-purple-100 text-purple-800";
      case "hired":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatSalary = (salary: {
    min: number;
    max: number;
    currency: string;
  }) => {
    return `${salary.currency}${salary.min.toLocaleString()} - ${
      salary.currency
    }${salary.max.toLocaleString()}`;
  };

  const handleEdit = () => {
    setEditData(job);
    setIsEditing(true);
  };

  const handleSave = () => {
    setJob(editData);
    setIsEditing(false);
    console.log("Saving job changes:", editData);
  };

  const handleCancel = () => {
    setEditData(job);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof Job, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSalaryChange = (
    field: "min" | "max" | "currency",
    value: any
  ) => {
    setEditData((prev) => ({
      ...prev,
      salary: {
        ...prev.salary,
        [field]: field === "min" || field === "max" ? Number(value) : value,
      },
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setEditData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setEditData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setEditData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }));
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    setEditData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const stats = {
    applications: applications.length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    interviewed: applications.filter((a) => a.status === "interviewed").length,
    hired: applications.filter((a) => a.status === "hired").length,
    avgMatchScore: Math.round(
      applications.reduce((sum, app) => sum + app.matchScore, 0) /
        applications.length
    ),
  };

  const currentData = isEditing ? editData : job;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/jobs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#011F72]">
              {currentData.title}
            </h1>
            <p className="text-gray-600 mt-1">
              {currentData.company} • {currentData.department}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                className="text-white hover:text-black"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Job
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Job Overview Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-6">
                <Image
                  src={currentData.companyLogo}
                  alt={currentData.company}
                  width={64}
                  height={64}
                  className="rounded-[10px] object-cover"
                />
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          value={currentData.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={currentData.company}
                          onChange={(e) =>
                            handleInputChange("company", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label htmlFor="type">Job Type</Label>
                          <Select
                            value={currentData.type}
                            onValueChange={(value) =>
                              handleInputChange("type", value)
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-[10px]">
                              <SelectItem value="full-time">
                                Full Time
                              </SelectItem>
                              <SelectItem value="part-time">
                                Part Time
                              </SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="internship">
                                Internship
                              </SelectItem>
                              <SelectItem value="remote">Remote</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={currentData.status}
                            onValueChange={(value) =>
                              handleInputChange("status", value)
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-[10px]">
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="expired">Expired</SelectItem>
                              <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-[#011F72] mb-2">
                        {currentData.title}
                      </h2>
                      <p className="text-lg text-gray-600 mb-3">
                        {currentData.company}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getTypeColor(currentData.type)}>
                          {currentData.type.replace("-", " ")}
                        </Badge>
                        <Badge className={getStatusColor(currentData.status)}>
                          {currentData.status}
                        </Badge>
                        {currentData.isFeatured && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {currentData.isUrgent && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={currentData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salaryMin">Min Salary</Label>
                      <Input
                        id="salaryMin"
                        type="number"
                        value={currentData.salary.min}
                        onChange={(e) =>
                          handleSalaryChange("min", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salaryMax">Max Salary</Label>
                      <Input
                        id="salaryMax"
                        type="number"
                        value={currentData.salary.max}
                        onChange={(e) =>
                          handleSalaryChange("max", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={currentData.salary.currency}
                        onValueChange={(value) =>
                          handleSalaryChange("currency", value)
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
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {currentData.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatSalary(currentData.salary)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {currentData.experience}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Expires {currentData.expiryDate}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-[10px]">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentData.applications}
                  </div>
                  <div className="text-sm text-gray-600">Applications</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-[10px]">
                  <div className="text-2xl font-bold text-green-600">
                    {currentData.views}
                  </div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-[10px]">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.shortlisted}
                  </div>
                  <div className="text-sm text-gray-600">Shortlisted</div>
                </div>
              </div>
            </div>

            <div className="lg:w-80">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={currentData.contactEmail}
                          onChange={(e) =>
                            handleInputChange("contactEmail", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Contact Phone</Label>
                        <Input
                          id="contactPhone"
                          value={currentData.contactPhone}
                          onChange={(e) =>
                            handleInputChange("contactPhone", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={currentData.website}
                          onChange={(e) =>
                            handleInputChange("website", e.target.value)
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {currentData.contactEmail}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {currentData.contactPhone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{currentData.website}</span>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="text-sm text-gray-600">
                    <div>Posted: {currentData.postedDate}</div>
                    <div>Recruiter: {currentData.recruiter}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">
            Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={currentData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={6}
                    />
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {currentData.description}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {currentData.requirements.map((req, index) => (
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
                        placeholder="Add a requirement"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && addRequirement()
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addRequirement}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {currentData.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {currentData.benefits.map((benefit, index) => (
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
                        placeholder="Add a benefit"
                        value={newBenefit}
                        onChange={(e) => setNewBenefit(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addBenefit()}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addBenefit}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {currentData.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Match Score</span>
                    <span className="font-semibold">
                      {stats.avgMatchScore}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Interview Rate</span>
                    <span className="font-semibold">
                      {Math.round(
                        (stats.interviewed / stats.applications) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hire Rate</span>
                    <span className="font-semibold">
                      {Math.round((stats.hired / stats.applications) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 border rounded-[10px]"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={application.candidateAvatar}
                        alt={application.candidateName}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-[#011F72]">
                          {application.candidateName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {application.candidateEmail}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">
                            {application.experience} experience
                          </span>
                          <span className="text-xs text-gray-500">
                            {application.location}
                          </span>
                          <span className="text-xs text-gray-500">
                            Applied {application.appliedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          {application.matchScore}% match
                        </div>
                        <Badge
                          className={getApplicationStatusColor(
                            application.status
                          )}
                        >
                          {application.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Application Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>This Week</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Week</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month</span>
                    <span className="font-semibold">24</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  View Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Views</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unique Views</span>
                    <span className="font-semibold">134</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion Rate</span>
                    <span className="font-semibold">15.4%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Avg. Response Time</span>
                    <span className="font-semibold">2.3 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality Score</span>
                    <span className="font-semibold">8.7/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion Rate</span>
                    <span className="font-semibold">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span>Featured Job</span>
                      <Checkbox
                        checked={currentData.isFeatured}
                        onCheckedChange={(checked) =>
                          handleInputChange("isFeatured", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Urgent Position</span>
                      <Checkbox
                        checked={currentData.isUrgent}
                        onCheckedChange={(checked) =>
                          handleInputChange("isUrgent", checked)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={currentData.expiryDate}
                        onChange={(e) =>
                          handleInputChange("expiryDate", e.target.value)
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span>Job Status</span>
                      <Badge className={getStatusColor(currentData.status)}>
                        {currentData.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Featured Job</span>
                      <Badge
                        className={
                          currentData.isFeatured
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {currentData.isFeatured ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Urgent Position</span>
                      <Badge
                        className={
                          currentData.isUrgent
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {currentData.isUrgent ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate Job
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Applications
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive Job
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Job
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
