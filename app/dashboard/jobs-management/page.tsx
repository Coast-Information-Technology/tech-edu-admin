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
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  Building2,
  Eye,
  Edit,
  MoreHorizontal,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  Ban,
  Users,
  ArrowUpDown,
  Download,
  Trash2,
  CheckSquare,
  XSquare,
  Star,
  DollarSign,
  Target,
  AlertCircle,
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
}

const mockJobs: Job[] = [
  {
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
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company: "Digital Innovations Ltd",
    companyLogo: "/assets/logo.png",
    location: "Manchester, UK",
    type: "full-time",
    status: "active",
    salary: { min: 45000, max: 60000, currency: "GBP" },
    experience: "3+ years",
    applications: 18,
    views: 89,
    postedDate: "2024-01-12",
    expiryDate: "2024-02-12",
    department: "Design",
    recruiter: "Michael Chen",
    isFeatured: false,
    isUrgent: true,
  },
  {
    id: "3",
    title: "Data Scientist",
    company: "Analytics Pro",
    companyLogo: "/assets/logo.png",
    location: "Birmingham, UK",
    type: "contract",
    status: "pending",
    salary: { min: 55000, max: 75000, currency: "GBP" },
    experience: "4+ years",
    applications: 0,
    views: 12,
    postedDate: "2024-01-18",
    expiryDate: "2024-02-18",
    department: "Data Science",
    recruiter: "Lisa Rodriguez",
    isFeatured: false,
    isUrgent: false,
  },
  {
    id: "4",
    title: "Marketing Manager",
    company: "Growth Marketing Co",
    companyLogo: "/assets/logo.png",
    location: "Edinburgh, UK",
    type: "full-time",
    status: "active",
    salary: { min: 40000, max: 55000, currency: "GBP" },
    experience: "3+ years",
    applications: 31,
    views: 203,
    postedDate: "2024-01-10",
    expiryDate: "2024-02-10",
    department: "Marketing",
    recruiter: "David Wilson",
    isFeatured: true,
    isUrgent: false,
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "Cloud Solutions",
    companyLogo: "/assets/logo.png",
    location: "Leeds, UK",
    type: "full-time",
    status: "inactive",
    salary: { min: 50000, max: 70000, currency: "GBP" },
    experience: "4+ years",
    applications: 15,
    views: 67,
    postedDate: "2023-12-20",
    expiryDate: "2024-01-20",
    department: "IT Operations",
    recruiter: "Admin User",
    isFeatured: false,
    isUrgent: false,
  },
  {
    id: "6",
    title: "Frontend Developer",
    company: "WebTech Solutions",
    companyLogo: "/assets/logo.png",
    location: "Liverpool, UK",
    type: "part-time",
    status: "active",
    salary: { min: 30000, max: 45000, currency: "GBP" },
    experience: "2+ years",
    applications: 22,
    views: 134,
    postedDate: "2024-01-14",
    expiryDate: "2024-02-14",
    department: "Engineering",
    recruiter: "Sarah Johnson",
    isFeatured: false,
    isUrgent: false,
  },
  {
    id: "7",
    title: "Product Manager",
    company: "Innovation Corp",
    companyLogo: "/assets/logo.png",
    location: "Bristol, UK",
    type: "full-time",
    status: "expired",
    salary: { min: 60000, max: 80000, currency: "GBP" },
    experience: "5+ years",
    applications: 28,
    views: 178,
    postedDate: "2023-12-01",
    expiryDate: "2024-01-01",
    department: "Product",
    recruiter: "Michael Chen",
    isFeatured: true,
    isUrgent: false,
  },
  {
    id: "8",
    title: "Junior Developer Intern",
    company: "Startup Inc",
    companyLogo: "/assets/logo.png",
    location: "Cardiff, UK",
    type: "internship",
    status: "draft",
    salary: { min: 20000, max: 25000, currency: "GBP" },
    experience: "0-1 years",
    applications: 0,
    views: 0,
    postedDate: "2024-01-20",
    expiryDate: "2024-03-20",
    department: "Engineering",
    recruiter: "Lisa Rodriguez",
    isFeatured: false,
    isUrgent: false,
  },
];

export default function JobManagementPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Job>("postedDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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

  const handleSort = (field: keyof Job) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedJobs(filteredJobs.map((job) => job.id));
    } else {
      setSelectedJobs([]);
    }
  };

  const handleSelectJob = (jobId: string, checked: boolean) => {
    if (checked) {
      setSelectedJobs((prev) => [...prev, jobId]);
    } else {
      setSelectedJobs((prev) => prev.filter((id) => id !== jobId));
    }
  };

  const handleBulkAction = (action: string) => {
    // Handle bulk actions
    console.log(`Bulk action: ${action} for jobs:`, selectedJobs);
    setSelectedJobs([]);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesDepartment =
      departmentFilter === "all" || job.department === departmentFilter;

    return matchesSearch && matchesType && matchesStatus && matchesDepartment;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
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
    total: jobs.length,
    active: jobs.filter((j) => j.status === "active").length,
    pending: jobs.filter((j) => j.status === "pending").length,
    expired: jobs.filter((j) => j.status === "expired").length,
    featured: jobs.filter((j) => j.isFeatured).length,
    urgent: jobs.filter((j) => j.isUrgent).length,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">Job Management</h1>
          <p className="text-gray-600 mt-1">
            Manage job postings, applications, and recruitment
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="text-white hover:text-black">
            <Link href="/dashboard/jobs/new">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Jobs
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-[10px]">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.active}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-[10px]">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-[10px]">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.expired}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Featured Jobs</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.featured}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-[10px]">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Urgent Positions</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.urgent}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search jobs by title, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="IT Operations">IT Operations</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedJobs.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-800">
                  {selectedJobs.length} job(s) selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("activate")}
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Activate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("deactivate")}
                >
                  <XSquare className="w-4 h-4 mr-2" />
                  Deactivate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("feature")}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Feature
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("export")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("delete")}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Jobs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedJobs.length === filteredJobs.length &&
                        filteredJobs.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("title")}
                      className="h-auto p-0 font-semibold"
                    >
                      Job Title
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("type")}
                      className="h-auto p-0 font-semibold"
                    >
                      Type
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("status")}
                      className="h-auto p-0 font-semibold"
                    >
                      Status
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("postedDate")}
                      className="h-auto p-0 font-semibold"
                    >
                      Posted
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedJobs.map((job) => (
                  <TableRow key={job.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedJobs.includes(job.id)}
                        onCheckedChange={(checked) =>
                          handleSelectJob(job.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={job.companyLogo}
                          alt={job.company}
                          width={32}
                          height={32}
                          className="rounded object-cover"
                        />
                        <div>
                          <div className="font-medium text-[#011F72]">
                            {job.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {job.department}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{job.company}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(job.type)}>
                        {job.type.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {formatSalary(job.salary)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {job.experience}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{job.applications}</div>
                        <div className="text-xs text-gray-500">
                          {job.views} views
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {job.postedDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {job.expiryDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/jobs/${job.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {sortedJobs.length === 0 && (
            <div className="p-8 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filters
              </p>
              <Button asChild>
                <Link href="/dashboard/jobs/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Job
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
