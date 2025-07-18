"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Search,
  Filter,
  Briefcase,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Eye,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Target,
  BarChart3,
  MessageSquare,
} from "lucide-react";

// Mock data for job postings
const mockJobs = [
  {
    id: "1",
    slug: "software-intern-2024",
    title: "Software Development Intern",
    company: "TechCorp Solutions",
    location: "London, UK",
    type: "internship",
    salary: {
      min: 25000,
      max: 30000,
      currency: "GBP",
    },
    status: "active",
    postedDate: "2024-01-15",
    deadline: "2024-02-15",
    applications: 12,
    shortlisted: 5,
    hired: 0,
    description:
      "Join our dynamic team as a software development intern. Work on real projects and gain valuable experience.",
    requirements: [
      "Computer Science student",
      "Knowledge of JavaScript",
      "Good communication skills",
    ],
    benefits: [
      "Flexible hours",
      "Mentorship program",
      "Potential full-time offer",
    ],
    department: "Computer Science",
    experience: "Entry Level",
    duration: "6 months",
  },
  {
    id: "2",
    slug: "data-analyst-position",
    title: "Data Analyst",
    company: "Analytics Pro",
    location: "Manchester, UK",
    type: "full-time",
    salary: {
      min: 35000,
      max: 45000,
      currency: "GBP",
    },
    status: "active",
    postedDate: "2024-01-10",
    deadline: "2024-02-10",
    applications: 8,
    shortlisted: 3,
    hired: 0,
    description:
      "We're looking for a data analyst to help us make sense of complex datasets and drive business decisions.",
    requirements: [
      "Statistics/Mathematics degree",
      "Python/R skills",
      "SQL knowledge",
    ],
    benefits: ["Health insurance", "25 days holiday", "Remote work options"],
    department: "Data Science",
    experience: "1-2 years",
    duration: "Permanent",
  },
  {
    id: "3",
    slug: "marketing-assistant",
    title: "Marketing Assistant",
    company: "Digital Innovations",
    location: "Birmingham, UK",
    type: "part-time",
    salary: {
      min: 20000,
      max: 25000,
      currency: "GBP",
    },
    status: "active",
    postedDate: "2024-01-12",
    deadline: "2024-02-12",
    applications: 15,
    shortlisted: 7,
    hired: 0,
    description:
      "Support our marketing team with social media management, content creation, and campaign coordination.",
    requirements: [
      "Marketing/Business student",
      "Social media experience",
      "Creative mindset",
    ],
    benefits: [
      "Flexible schedule",
      "Creative environment",
      "Career development",
    ],
    department: "Business",
    experience: "Entry Level",
    duration: "12 months",
  },
  {
    id: "4",
    slug: "research-assistant-psychology",
    title: "Research Assistant - Psychology",
    company: "University Research Lab",
    location: "Liverpool, UK",
    type: "contract",
    salary: {
      min: 28000,
      max: 32000,
      currency: "GBP",
    },
    status: "active",
    postedDate: "2024-01-08",
    deadline: "2024-02-08",
    applications: 6,
    shortlisted: 2,
    hired: 0,
    description:
      "Assist with psychological research projects, data collection, and analysis.",
    requirements: [
      "Psychology student",
      "Research methods knowledge",
      "Attention to detail",
    ],
    benefits: [
      "Academic experience",
      "Publication opportunities",
      "Flexible hours",
    ],
    department: "Psychology",
    experience: "Entry Level",
    duration: "8 months",
  },
  {
    id: "5",
    slug: "engineering-intern",
    title: "Engineering Intern",
    company: "Innovation Corp",
    location: "Bristol, UK",
    type: "internship",
    salary: {
      min: 22000,
      max: 28000,
      currency: "GBP",
    },
    status: "active",
    postedDate: "2024-01-14",
    deadline: "2024-02-14",
    applications: 10,
    shortlisted: 4,
    hired: 0,
    description:
      "Work on cutting-edge engineering projects and learn from experienced professionals.",
    requirements: [
      "Engineering student",
      "CAD skills",
      "Problem-solving ability",
    ],
    benefits: ["Hands-on experience", "Mentorship", "Project portfolio"],
    department: "Engineering",
    experience: "Entry Level",
    duration: "6 months",
  },
  {
    id: "6",
    slug: "finance-analyst",
    title: "Finance Analyst",
    company: "Global Finance Ltd",
    location: "Leeds, UK",
    type: "full-time",
    salary: {
      min: 40000,
      max: 50000,
      currency: "GBP",
    },
    status: "active",
    postedDate: "2024-01-16",
    deadline: "2024-02-16",
    applications: 9,
    shortlisted: 3,
    hired: 0,
    description:
      "Analyze financial data, prepare reports, and support strategic financial decisions.",
    requirements: [
      "Finance/Accounting degree",
      "Excel proficiency",
      "Analytical skills",
    ],
    benefits: [
      "Competitive salary",
      "Professional development",
      "Health benefits",
    ],
    department: "Business",
    experience: "1-3 years",
    duration: "Permanent",
  },
];

export default function JobBoardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const department = searchParams.get("department") || "";
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";

  const [page, setPage] = useState(pageParam);
  const itemsPerPage = 6;

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  }, [page]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const filteredData = mockJobs.filter((job) => {
    const matchesDepartment = department ? job.department === department : true;
    const matchesSearch = search
      ? job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesType = type ? job.type === type : true;

    return matchesDepartment && matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const uniqueDepartments = [...new Set(mockJobs.map((job) => job.department))];
  const uniqueTypes = [...new Set(mockJobs.map((job) => job.type))];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-green-100 text-green-800";
      case "part-time":
        return "bg-blue-100 text-blue-800";
      case "internship":
        return "bg-purple-100 text-purple-800";
      case "contract":
        return "bg-orange-100 text-orange-800";
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

  const stats = {
    total: mockJobs.length,
    active: mockJobs.filter((j) => j.status === "active").length,
    totalApplications: mockJobs.reduce((acc, j) => acc + j.applications, 0),
    totalHired: mockJobs.reduce((acc, j) => acc + j.hired, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">Job Board</h1>
          <p className="text-gray-600 mt-1">
            Post and manage job opportunities for your students
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button className="text-white hover:text-black">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
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
                <p className="text-sm text-gray-600">Active Jobs</p>
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
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.totalApplications}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Students Hired</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.totalHired}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-[10px]">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.totalApplications > 0
                    ? Math.round(
                        (stats.totalHired / stats.totalApplications) * 100
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#011F72]" />
            <h2 className="text-lg font-semibold text-[#011F72]">
              Search & Filters
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search jobs, companies..."
                value={search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 rounded-[10px]"
              />
            </div>

            <select
              className="px-4 py-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#011F72]"
              value={department}
              onChange={(e) => handleFilterChange("department", e.target.value)}
            >
              <option value="">All Departments</option>
              {uniqueDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#011F72]"
              value={type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="">All Types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            <Button
              onClick={() => {
                router.push("?");
                setPage(1);
              }}
              variant="outline"
              className="border-[#011F72] text-[#011F72] hover:bg-[#011F72] hover:text-white"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {currentData.length} of {filteredData.length} jobs
          {search && ` for "${search}"`}
          {department && ` in ${department}`}
          {type && ` of type ${type}`}
        </p>
      </div>

      {/* Jobs Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {currentData.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#011F72] text-lg mb-1">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Building2 className="w-4 h-4" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                </div>
                <Badge className={getTypeColor(job.type)}>{job.type}</Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Salary:</span>
                  <span className="font-semibold">
                    {formatSalary(job.salary)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Applications:</span>
                  <span className="font-semibold">{job.applications}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Shortlisted:</span>
                  <span className="font-semibold text-blue-600">
                    {job.shortlisted}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Deadline:</span>
                  <span className="font-semibold">
                    {formatDate(job.deadline)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/dashboard/job-board/${job.slug}`}
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={`cursor-pointer ${
                    page === 1 ? "pointer-events-none opacity-50" : ""
                  }`}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 7) return true;
                  return (
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1)
                  );
                })
                .map((p, index, array) => (
                  <div key={p}>
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setPage(p)}
                        isActive={page === p}
                        className={`cursor-pointer ${
                          page === p
                            ? "text-[#011F72] border-[#011F72] rounded-[10px]"
                            : ""
                        }`}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  </div>
                ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={`cursor-pointer ${
                    page >= totalPages ? "pointer-events-none opacity-50" : ""
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
