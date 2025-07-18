"use client";

import React, { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Calendar,
  Building2,
  Eye,
  Edit,
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  DollarSign,
  Users,
  ArrowUpDown,
  Download,
  Trash2,
  CheckSquare,
  XSquare,
  Target,
  TrendingUp,
  Activity,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  Bookmark,
  Share2,
  Archive,
  RefreshCw,
  Plus,
  ChevronRight,
  ChevronDown,
  Clock3,
  CalendarDays,
  UserCheck,
  UserX,
  Award,
  GraduationCap,
  BriefcaseIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface JobApplication {
  id: string;
  jobTitle: string;
  company: {
    name: string;
    logo: string;
    location: string;
    industry: string;
  };
  status:
    | "applied"
    | "under_review"
    | "shortlisted"
    | "interview_scheduled"
    | "interviewed"
    | "offer_received"
    | "offer_accepted"
    | "rejected"
    | "withdrawn";
  appliedDate: string;
  lastUpdated: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  jobType: "full-time" | "part-time" | "contract" | "internship" | "remote";
  experience: string;
  matchScore: number;
  isFavorite: boolean;
  notes: string;
  nextAction?: string;
  nextActionDate?: string;
  recruiter?: {
    name: string;
    email: string;
    phone: string;
  };
  interviewDetails?: {
    date: string;
    time: string;
    type: "phone" | "video" | "onsite";
    interviewer: string;
    notes: string;
  };
  offerDetails?: {
    amount: number;
    currency: string;
    benefits: string[];
    deadline: string;
  };
}

const mockApplications: JobApplication[] = [
  {
    id: "1",
    jobTitle: "Senior Software Engineer",
    company: {
      name: "TechCorp Solutions",
      logo: "/assets/logo.png",
      location: "London, UK",
      industry: "Technology",
    },
    status: "interview_scheduled",
    appliedDate: "2024-01-15",
    lastUpdated: "2024-01-20",
    salary: { min: 65000, max: 85000, currency: "GBP" },
    jobType: "full-time",
    experience: "5+ years",
    matchScore: 92,
    isFavorite: true,
    notes: "Great company culture, exciting tech stack. Follow up on Monday.",
    nextAction: "Prepare for technical interview",
    nextActionDate: "2024-01-25",
    recruiter: {
      name: "Sarah Johnson",
      email: "sarah.johnson@techcorp.com",
      phone: "+44 20 7123 4567",
    },
    interviewDetails: {
      date: "2024-01-25",
      time: "14:00",
      type: "video",
      interviewer: "John Smith (Tech Lead)",
      notes:
        "Technical interview focusing on React, Node.js, and system design",
    },
  },
  {
    id: "2",
    jobTitle: "UX/UI Designer",
    company: {
      name: "Digital Innovations Ltd",
      logo: "/assets/logo.png",
      location: "Manchester, UK",
      industry: "Design",
    },
    status: "under_review",
    appliedDate: "2024-01-12",
    lastUpdated: "2024-01-18",
    salary: { min: 45000, max: 60000, currency: "GBP" },
    jobType: "full-time",
    experience: "3+ years",
    matchScore: 78,
    isFavorite: false,
    notes: "Portfolio review in progress. Company seems promising.",
    nextAction: "Wait for portfolio feedback",
    nextActionDate: "2024-01-22",
  },
  {
    id: "3",
    jobTitle: "Data Scientist",
    company: {
      name: "Analytics Pro",
      logo: "/assets/logo.png",
      location: "Birmingham, UK",
      industry: "Data Science",
    },
    status: "offer_received",
    appliedDate: "2024-01-10",
    lastUpdated: "2024-01-19",
    salary: { min: 55000, max: 75000, currency: "GBP" },
    jobType: "contract",
    experience: "4+ years",
    matchScore: 85,
    isFavorite: true,
    notes: "Excellent offer! Need to review benefits package.",
    nextAction: "Review and respond to offer",
    nextActionDate: "2024-01-23",
    offerDetails: {
      amount: 65000,
      currency: "GBP",
      benefits: [
        "Health Insurance",
        "25 days holiday",
        "Remote work",
        "Learning budget",
      ],
      deadline: "2024-01-23",
    },
  },
  {
    id: "4",
    jobTitle: "Frontend Developer",
    company: {
      name: "WebTech Solutions",
      logo: "/assets/logo.png",
      location: "Liverpool, UK",
      industry: "Technology",
    },
    status: "rejected",
    appliedDate: "2024-01-08",
    lastUpdated: "2024-01-16",
    salary: { min: 30000, max: 45000, currency: "GBP" },
    jobType: "part-time",
    experience: "2+ years",
    matchScore: 65,
    isFavorite: false,
    notes: "Rejected due to lack of React experience. Need to improve skills.",
    nextAction: "Focus on React learning",
  },
  {
    id: "5",
    jobTitle: "Product Manager",
    company: {
      name: "Innovation Corp",
      logo: "/assets/logo.png",
      location: "Bristol, UK",
      industry: "Product",
    },
    status: "shortlisted",
    appliedDate: "2024-01-05",
    lastUpdated: "2024-01-17",
    salary: { min: 50000, max: 70000, currency: "GBP" },
    jobType: "full-time",
    experience: "3+ years",
    matchScore: 88,
    isFavorite: true,
    notes: "Shortlisted! Prepare for case study interview.",
    nextAction: "Prepare case study presentation",
    nextActionDate: "2024-01-26",
  },
  {
    id: "6",
    jobTitle: "DevOps Engineer",
    company: {
      name: "Cloud Solutions",
      logo: "/assets/logo.png",
      location: "Leeds, UK",
      industry: "Technology",
    },
    status: "applied",
    appliedDate: "2024-01-20",
    lastUpdated: "2024-01-20",
    salary: { min: 50000, max: 70000, currency: "GBP" },
    jobType: "full-time",
    experience: "4+ years",
    matchScore: 72,
    isFavorite: false,
    notes: "Applied today. Good match for my skills.",
    nextAction: "Wait for initial response",
  },
];

export default function JobApplicationsPage() {
  const [applications, setApplications] =
    useState<JobApplication[]>(mockApplications);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApplications, setSelectedApplications] = useState<string[]>(
    []
  );
  const [sortField, setSortField] =
    useState<keyof JobApplication>("appliedDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "shortlisted":
        return "bg-purple-100 text-purple-800";
      case "interview_scheduled":
        return "bg-orange-100 text-orange-800";
      case "interviewed":
        return "bg-indigo-100 text-indigo-800";
      case "offer_received":
        return "bg-green-100 text-green-800";
      case "offer_accepted":
        return "bg-emerald-100 text-emerald-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <Clock className="w-4 h-4" />;
      case "under_review":
        return <AlertCircle className="w-4 h-4" />;
      case "shortlisted":
        return <Star className="w-4 h-4" />;
      case "interview_scheduled":
        return <Calendar className="w-4 h-4" />;
      case "interviewed":
        return <UserCheck className="w-4 h-4" />;
      case "offer_received":
        return <Award className="w-4 h-4" />;
      case "offer_accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "withdrawn":
        return <UserX className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getJobTypeColor = (type: string) => {
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
        return "bg-indigo-100 text-indigo-800";
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysSinceApplied = (appliedDate: string) => {
    const applied = new Date(appliedDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - applied.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSort = (field: keyof JobApplication) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplications(filteredApplications.map((app) => app.id));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleSelectApplication = (applicationId: string, checked: boolean) => {
    if (checked) {
      setSelectedApplications((prev) => [...prev, applicationId]);
    } else {
      setSelectedApplications((prev) =>
        prev.filter((id) => id !== applicationId)
      );
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action}`, selectedApplications);
    setSelectedApplications([]);
  };

  const toggleFavorite = (applicationId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, isFavorite: !app.isFavorite } : app
      )
    );
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const stats = {
    total: applications.length,
    applied: applications.filter((app) => app.status === "applied").length,
    underReview: applications.filter((app) => app.status === "under_review")
      .length,
    shortlisted: applications.filter((app) => app.status === "shortlisted")
      .length,
    interviewed: applications.filter(
      (app) =>
        app.status === "interview_scheduled" || app.status === "interviewed"
    ).length,
    offers: applications.filter(
      (app) =>
        app.status === "offer_received" || app.status === "offer_accepted"
    ).length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  const getProgressPercentage = () => {
    const completed = applications.filter((app) =>
      ["offer_accepted", "rejected", "withdrawn"].includes(app.status)
    ).length;
    return Math.round((completed / applications.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">
            Job Applications
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage your job applications
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="text-white hover:text-black">
            <Plus className="w-4 h-4 mr-2" />
            Apply to New Job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-[10px]">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {getProgressPercentage()}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Offers Received</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.offers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-[10px]">
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Applications</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.applied +
                    stats.underReview +
                    stats.shortlisted +
                    stats.interviewed}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Application Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">
                {getProgressPercentage()}% Complete
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-blue-600">
                  {stats.applied}
                </div>
                <div className="text-gray-600">Applied</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-yellow-600">
                  {stats.underReview + stats.shortlisted}
                </div>
                <div className="text-gray-600">Under Review</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-orange-600">
                  {stats.interviewed}
                </div>
                <div className="text-gray-600">Interviewed</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">
                  {stats.offers}
                </div>
                <div className="text-gray-600">Offers</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search jobs or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="interview_scheduled">
                  Interview Scheduled
                </SelectItem>
                <SelectItem value="interviewed">Interviewed</SelectItem>
                <SelectItem value="offer_received">Offer Received</SelectItem>
                <SelectItem value="offer_accepted">Offer Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle>Applications ({filteredApplications.length})</CardTitle>
            {selectedApplications.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("archive")}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("withdraw")}
                >
                  <UserX className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedApplications.map((application) => (
              <div
                key={application.id}
                className="border rounded-[10px] p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <Checkbox
                      checked={selectedApplications.includes(application.id)}
                      onCheckedChange={(checked) =>
                        handleSelectApplication(
                          application.id,
                          checked as boolean
                        )
                      }
                    />
                    <Image
                      src={application.company.logo}
                      alt={application.company.name}
                      width={48}
                      height={48}
                      className="rounded-[10px] object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#011F72] text-lg mb-1">
                            {application.jobTitle}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Building2 className="w-4 h-4" />
                            <span>{application.company.name}</span>
                            <span>•</span>
                            <MapPin className="w-4 h-4" />
                            <span>{application.company.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(application.id)}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                application.isFavorite
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-400"
                              }`}
                            />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getStatusColor(application.status)}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1">
                            {application.status.replace("_", " ")}
                          </span>
                        </Badge>
                        <Badge className={getJobTypeColor(application.jobType)}>
                          {application.jobType}
                        </Badge>
                        <Badge variant="outline">
                          <Target className="w-3 h-3 mr-1" />
                          {application.matchScore}% Match
                        </Badge>
                        <Badge variant="outline">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {formatSalary(application.salary)}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Applied {formatDate(application.appliedDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {getDaysSinceApplied(application.appliedDate)} days
                            ago
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <RefreshCw className="w-4 h-4" />
                          <span>
                            Updated {formatDate(application.lastUpdated)}
                          </span>
                        </div>
                      </div>

                      {application.nextAction && (
                        <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-3 mb-3">
                          <div className="flex items-center gap-2 text-blue-800">
                            <Target className="w-4 h-4" />
                            <span className="font-medium">Next Action:</span>
                            <span>{application.nextAction}</span>
                            {application.nextActionDate && (
                              <>
                                <span>•</span>
                                <span>
                                  Due {formatDate(application.nextActionDate)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {application.notes && (
                        <p className="text-sm text-gray-600 italic">
                          "{application.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:flex-shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/applications/${application.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {sortedApplications.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No applications found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Start applying to jobs to track your applications here"}
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Apply to New Job
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
