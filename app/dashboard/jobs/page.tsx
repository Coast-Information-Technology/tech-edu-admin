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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Calendar,
  Building2,
  Eye,
  Bookmark,
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
  Plus,
  Save,
  X,
  BookmarkPlus,
  BookmarkCheck,
  ExternalLink,
  Send,
  FileText,
  GraduationCap,
  BriefcaseIcon,
  Clock3,
  Award,
  Globe,
  Zap,
  Heart,
  Share2,
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
    isNegotiable: boolean;
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
  isSaved: boolean;
  matchScore: number;
  description: string;
  requirements: string[];
  benefits: string[];
  tags: string[];
  companySize: string;
  industry: string;
  remotePolicy: "fully_remote" | "hybrid" | "onsite";
}

interface AppliedJob extends Job {
  applicationDate: string;
  applicationStatus:
    | "pending"
    | "reviewing"
    | "shortlisted"
    | "interviewed"
    | "offered"
    | "rejected";
  applicationId: string;
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
    salary: { min: 65000, max: 85000, currency: "GBP", isNegotiable: false },
    experience: "5+ years",
    applications: 24,
    views: 156,
    postedDate: "2024-01-15",
    expiryDate: "2024-02-15",
    department: "Engineering",
    recruiter: "Sarah Johnson",
    isFeatured: true,
    isUrgent: false,
    isSaved: false,
    matchScore: 92,
    description:
      "We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining high-quality software solutions.",
    requirements: [
      "5+ years of experience in software development",
      "Strong proficiency in JavaScript, Python, or Java",
      "Experience with modern frameworks (React, Node.js, Django)",
      "Knowledge of database design and SQL",
      "Experience with cloud platforms (AWS, Azure, GCP)",
    ],
    benefits: [
      "Competitive salary and benefits package",
      "Flexible working hours and remote work options",
      "Professional development and training opportunities",
      "Health insurance and wellness programs",
    ],
    tags: ["React", "Node.js", "Python", "AWS", "Full-stack"],
    companySize: "500-1000 employees",
    industry: "Technology",
    remotePolicy: "hybrid",
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company: "Digital Innovations Ltd",
    companyLogo: "/assets/logo.png",
    location: "Manchester, UK",
    type: "full-time",
    status: "active",
    salary: { min: 45000, max: 60000, currency: "GBP", isNegotiable: true },
    experience: "3+ years",
    applications: 18,
    views: 89,
    postedDate: "2024-01-12",
    expiryDate: "2024-02-12",
    department: "Design",
    recruiter: "Michael Chen",
    isFeatured: false,
    isUrgent: true,
    isSaved: true,
    matchScore: 78,
    description:
      "Join our creative team as a UX/UI Designer. You'll be responsible for creating intuitive and engaging user experiences across our digital products.",
    requirements: [
      "3+ years of experience in UX/UI design",
      "Proficiency in Figma, Sketch, or Adobe Creative Suite",
      "Experience with user research and usability testing",
      "Strong portfolio showcasing web and mobile designs",
      "Knowledge of design systems and component libraries",
    ],
    benefits: [
      "Competitive salary with performance bonuses",
      "Flexible remote work policy",
      "Latest design tools and software",
      "Regular design workshops and conferences",
    ],
    tags: ["Figma", "UX Design", "UI Design", "User Research", "Prototyping"],
    companySize: "100-500 employees",
    industry: "Design",
    remotePolicy: "fully_remote",
  },
  {
    id: "3",
    title: "Data Scientist",
    company: "Analytics Pro",
    companyLogo: "/assets/logo.png",
    location: "Birmingham, UK",
    type: "contract",
    status: "active",
    salary: { min: 55000, max: 75000, currency: "GBP", isNegotiable: true },
    experience: "4+ years",
    applications: 12,
    views: 67,
    postedDate: "2024-01-18",
    expiryDate: "2024-02-18",
    department: "Data Science",
    recruiter: "Lisa Rodriguez",
    isFeatured: false,
    isUrgent: false,
    isSaved: false,
    matchScore: 85,
    description:
      "We're seeking a Data Scientist to help us extract insights from large datasets and build predictive models that drive business decisions.",
    requirements: [
      "4+ years of experience in data science or analytics",
      "Strong programming skills in Python or R",
      "Experience with machine learning frameworks (TensorFlow, PyTorch)",
      "Knowledge of SQL and database systems",
      "Experience with data visualization tools",
    ],
    benefits: [
      "Competitive contract rates",
      "Flexible project-based work",
      "Access to cutting-edge tools and datasets",
      "Professional development opportunities",
    ],
    tags: ["Python", "Machine Learning", "SQL", "Data Analysis", "Statistics"],
    companySize: "50-200 employees",
    industry: "Analytics",
    remotePolicy: "hybrid",
  },
  {
    id: "4",
    title: "Marketing Manager",
    company: "Growth Marketing Co",
    companyLogo: "/assets/logo.png",
    location: "Edinburgh, UK",
    type: "full-time",
    status: "active",
    salary: { min: 40000, max: 55000, currency: "GBP", isNegotiable: false },
    experience: "3+ years",
    applications: 31,
    views: 203,
    postedDate: "2024-01-10",
    expiryDate: "2024-02-10",
    department: "Marketing",
    recruiter: "David Wilson",
    isFeatured: true,
    isUrgent: false,
    isSaved: false,
    matchScore: 65,
    description:
      "Lead our marketing efforts and develop strategies to grow our brand presence and customer acquisition across multiple channels.",
    requirements: [
      "3+ years of experience in digital marketing",
      "Experience with Google Analytics, Facebook Ads, and other marketing tools",
      "Strong analytical and creative skills",
      "Experience managing marketing campaigns and budgets",
      "Excellent communication and leadership abilities",
    ],
    benefits: [
      "Competitive salary with performance bonuses",
      "Flexible working arrangements",
      "Professional development budget",
      "Modern office in central Edinburgh",
    ],
    tags: [
      "Digital Marketing",
      "Google Analytics",
      "Social Media",
      "SEO",
      "Content Marketing",
    ],
    companySize: "200-500 employees",
    industry: "Marketing",
    remotePolicy: "onsite",
  },
  {
    id: "5",
    title: "Frontend Developer",
    company: "WebTech Solutions",
    companyLogo: "/assets/logo.png",
    location: "Liverpool, UK",
    type: "part-time",
    status: "active",
    salary: { min: 30000, max: 45000, currency: "GBP", isNegotiable: true },
    experience: "2+ years",
    applications: 22,
    views: 134,
    postedDate: "2024-01-14",
    expiryDate: "2024-02-14",
    department: "Engineering",
    recruiter: "Sarah Johnson",
    isFeatured: false,
    isUrgent: false,
    isSaved: true,
    matchScore: 88,
    description:
      "Join our frontend team to build beautiful, responsive web applications using modern technologies and best practices.",
    requirements: [
      "2+ years of experience in frontend development",
      "Strong proficiency in HTML, CSS, and JavaScript",
      "Experience with React, Vue.js, or Angular",
      "Knowledge of responsive design principles",
      "Experience with version control (Git)",
    ],
    benefits: [
      "Flexible part-time schedule",
      "Remote work options",
      "Latest development tools and software",
      "Collaborative team environment",
    ],
    tags: ["React", "JavaScript", "CSS", "HTML", "Frontend"],
    companySize: "100-300 employees",
    industry: "Technology",
    remotePolicy: "fully_remote",
  },
];

const mockAppliedJobs: AppliedJob[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechCorp Solutions",
    companyLogo: "/assets/logo.png",
    location: "London, UK",
    type: "full-time",
    status: "active",
    salary: { min: 65000, max: 85000, currency: "GBP", isNegotiable: false },
    experience: "5+ years",
    applications: 24,
    views: 156,
    postedDate: "2024-01-15",
    expiryDate: "2024-02-15",
    department: "Engineering",
    recruiter: "Sarah Johnson",
    isFeatured: true,
    isUrgent: false,
    isSaved: false,
    matchScore: 92,
    description:
      "We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining high-quality software solutions.",
    requirements: [
      "5+ years of experience in software development",
      "Strong proficiency in JavaScript, Python, or Java",
      "Experience with modern frameworks (React, Node.js, Django)",
      "Knowledge of database design and SQL",
      "Experience with cloud platforms (AWS, Azure, GCP)",
    ],
    benefits: [
      "Competitive salary and benefits package",
      "Flexible working hours and remote work options",
      "Professional development and training opportunities",
      "Health insurance and wellness programs",
    ],
    tags: ["React", "Node.js", "Python", "AWS", "Full-stack"],
    companySize: "500-1000 employees",
    industry: "Technology",
    remotePolicy: "hybrid",
    applicationDate: "2024-01-20",
    applicationStatus: "shortlisted",
    applicationId: "app_001",
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company: "Digital Innovations Ltd",
    companyLogo: "/assets/logo.png",
    location: "Manchester, UK",
    type: "full-time",
    status: "active",
    salary: { min: 45000, max: 60000, currency: "GBP", isNegotiable: true },
    experience: "3+ years",
    applications: 18,
    views: 89,
    postedDate: "2024-01-12",
    expiryDate: "2024-02-12",
    department: "Design",
    recruiter: "Michael Chen",
    isFeatured: false,
    isUrgent: true,
    isSaved: true,
    matchScore: 78,
    description:
      "Join our creative team as a UX/UI Designer. You'll be responsible for creating intuitive and engaging user experiences across our digital products.",
    requirements: [
      "3+ years of experience in UX/UI design",
      "Proficiency in Figma, Sketch, or Adobe Creative Suite",
      "Experience with user research and usability testing",
      "Strong portfolio showcasing web and mobile designs",
      "Knowledge of design systems and component libraries",
    ],
    benefits: [
      "Competitive salary with performance bonuses",
      "Flexible remote work policy",
      "Latest design tools and software",
      "Regular design workshops and conferences",
    ],
    tags: ["Figma", "UX Design", "UI Design", "User Research", "Prototyping"],
    companySize: "100-500 employees",
    industry: "Design",
    remotePolicy: "fully_remote",
    applicationDate: "2024-01-18",
    applicationStatus: "reviewing",
    applicationId: "app_002",
  },
  {
    id: "3",
    title: "Data Scientist",
    company: "Analytics Pro",
    companyLogo: "/assets/logo.png",
    location: "Birmingham, UK",
    type: "contract",
    status: "active",
    salary: { min: 55000, max: 75000, currency: "GBP", isNegotiable: true },
    experience: "4+ years",
    applications: 12,
    views: 67,
    postedDate: "2024-01-18",
    expiryDate: "2024-02-18",
    department: "Data Science",
    recruiter: "Lisa Rodriguez",
    isFeatured: false,
    isUrgent: false,
    isSaved: false,
    matchScore: 85,
    description:
      "We're seeking a Data Scientist to help us extract insights from large datasets and build predictive models that drive business decisions.",
    requirements: [
      "4+ years of experience in data science or analytics",
      "Strong programming skills in Python or R",
      "Experience with machine learning frameworks (TensorFlow, PyTorch)",
      "Knowledge of SQL and database systems",
      "Experience with data visualization tools",
    ],
    benefits: [
      "Competitive contract rates",
      "Flexible project-based work",
      "Access to cutting-edge tools and datasets",
      "Professional development opportunities",
    ],
    tags: ["Python", "Machine Learning", "SQL", "Data Analysis", "Statistics"],
    companySize: "50-200 employees",
    industry: "Analytics",
    remotePolicy: "hybrid",
    applicationDate: "2024-01-22",
    applicationStatus: "pending",
    applicationId: "app_003",
  },
  {
    id: "4",
    title: "Marketing Manager",
    company: "Growth Marketing Co",
    companyLogo: "/assets/logo.png",
    location: "Edinburgh, UK",
    type: "full-time",
    status: "active",
    salary: { min: 40000, max: 55000, currency: "GBP", isNegotiable: false },
    experience: "3+ years",
    applications: 31,
    views: 203,
    postedDate: "2024-01-10",
    expiryDate: "2024-02-10",
    department: "Marketing",
    recruiter: "David Wilson",
    isFeatured: true,
    isUrgent: false,
    isSaved: false,
    matchScore: 65,
    description:
      "Lead our marketing efforts and develop strategies to grow our brand presence and customer acquisition across multiple channels.",
    requirements: [
      "3+ years of experience in digital marketing",
      "Experience with Google Analytics, Facebook Ads, and other marketing tools",
      "Strong analytical and creative skills",
      "Experience managing marketing campaigns and budgets",
      "Excellent communication and leadership abilities",
    ],
    benefits: [
      "Competitive salary with performance bonuses",
      "Flexible working arrangements",
      "Professional development budget",
      "Modern office in central Edinburgh",
    ],
    tags: [
      "Digital Marketing",
      "Google Analytics",
      "Facebook Ads",
      "Campaign Management",
    ],
    companySize: "200-500 employees",
    industry: "Marketing",
    remotePolicy: "hybrid",
    applicationDate: "2024-01-16",
    applicationStatus: "interviewed",
    applicationId: "app_004",
  },
  {
    id: "5",
    title: "Product Manager",
    company: "Innovation Labs",
    companyLogo: "/assets/logo.png",
    location: "Liverpool, UK",
    type: "full-time",
    status: "active",
    salary: { min: 50000, max: 70000, currency: "GBP", isNegotiable: true },
    experience: "4+ years",
    applications: 15,
    views: 98,
    postedDate: "2024-01-14",
    expiryDate: "2024-02-14",
    department: "Product",
    recruiter: "Emma Thompson",
    isFeatured: false,
    isUrgent: false,
    isSaved: false,
    matchScore: 88,
    description:
      "Join our product team to drive the development of innovative solutions that solve real customer problems.",
    requirements: [
      "4+ years of product management experience",
      "Experience with agile methodologies",
      "Strong analytical and problem-solving skills",
      "Excellent communication and stakeholder management",
      "Experience with product analytics tools",
    ],
    benefits: [
      "Competitive salary with equity options",
      "Flexible remote work policy",
      "Professional development opportunities",
      "Modern office with great amenities",
    ],
    tags: [
      "Product Management",
      "Agile",
      "Analytics",
      "Stakeholder Management",
    ],
    companySize: "100-300 employees",
    industry: "Technology",
    remotePolicy: "hybrid",
    applicationDate: "2024-01-19",
    applicationStatus: "offered",
    applicationId: "app_005",
  },
  {
    id: "6",
    title: "DevOps Engineer",
    company: "Cloud Solutions Ltd",
    companyLogo: "/assets/logo.png",
    location: "Bristol, UK",
    type: "full-time",
    status: "active",
    salary: { min: 60000, max: 80000, currency: "GBP", isNegotiable: false },
    experience: "3+ years",
    applications: 22,
    views: 145,
    postedDate: "2024-01-11",
    expiryDate: "2024-02-11",
    department: "Engineering",
    recruiter: "James Anderson",
    isFeatured: true,
    isUrgent: true,
    isSaved: false,
    matchScore: 91,
    description:
      "Help us build and maintain scalable infrastructure and deployment pipelines for our cloud-based applications.",
    requirements: [
      "3+ years of DevOps experience",
      "Experience with AWS, Azure, or GCP",
      "Knowledge of Docker, Kubernetes, and CI/CD",
      "Experience with infrastructure as code (Terraform, CloudFormation)",
      "Strong scripting skills (Python, Bash)",
    ],
    benefits: [
      "Competitive salary with performance bonuses",
      "Flexible remote work policy",
      "Latest tools and technologies",
      "Professional development budget",
    ],
    tags: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
    companySize: "300-800 employees",
    industry: "Technology",
    remotePolicy: "fully_remote",
    applicationDate: "2024-01-17",
    applicationStatus: "rejected",
    applicationId: "app_007",
  },
  {
    id: "7",
    title: "Frontend Developer",
    company: "Web Solutions Pro",
    companyLogo: "/assets/logo.png",
    location: "Leeds, UK",
    type: "contract",
    status: "active",
    salary: { min: 40000, max: 55000, currency: "GBP", isNegotiable: true },
    experience: "2+ years",
    applications: 28,
    views: 167,
    postedDate: "2024-01-13",
    expiryDate: "2024-02-13",
    department: "Engineering",
    recruiter: "Rachel Green",
    isFeatured: false,
    isUrgent: false,
    isSaved: false,
    matchScore: 76,
    description:
      "Join our frontend team to build beautiful, responsive, and accessible web applications.",
    requirements: [
      "2+ years of frontend development experience",
      "Strong proficiency in HTML, CSS, and JavaScript",
      "Experience with React, Vue, or Angular",
      "Knowledge of responsive design principles",
      "Experience with version control (Git)",
    ],
    benefits: [
      "Competitive contract rates",
      "Flexible project-based work",
      "Latest development tools",
      "Professional development opportunities",
    ],
    tags: ["React", "JavaScript", "CSS", "HTML", "Responsive Design"],
    companySize: "50-150 employees",
    industry: "Technology",
    remotePolicy: "hybrid",
    applicationDate: "2024-01-21",
    applicationStatus: "pending",
    applicationId: "app_007",
  },
];

export default function JobsBrowsePage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>(mockAppliedJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");
  const [remoteFilter, setRemoteFilter] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedCurrentPage, setAppliedCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const appliedJobsPerPage = 5;

  const getTypeColor = (type: string) => {
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

  const getRemotePolicyColor = (policy: string) => {
    switch (policy) {
      case "fully_remote":
        return "bg-green-100 text-green-800";
      case "hybrid":
        return "bg-yellow-100 text-yellow-800";
      case "onsite":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "reviewing":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-yellow-100 text-yellow-800";
      case "interviewed":
        return "bg-purple-100 text-purple-800";
      case "offered":
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
    isNegotiable: boolean;
  }) => {
    const range = `${salary.currency}${salary.min.toLocaleString()} - ${
      salary.currency
    }${salary.max.toLocaleString()}`;
    return salary.isNegotiable ? `${range} (Negotiable)` : range;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  const toggleSaveJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
      )
    );
  };

  const handleSelectJob = (jobId: string, checked: boolean) => {
    if (checked) {
      setSelectedJobs((prev) => [...prev, jobId]);
    } else {
      setSelectedJobs((prev) => prev.filter((id) => id !== jobId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedJobs(filteredJobs.map((job) => job.id));
    } else {
      setSelectedJobs([]);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      locationFilter === "all" ||
      !locationFilter ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType =
      typeFilter === "all" || !typeFilter || job.type === typeFilter;
    const matchesExperience =
      !experienceFilter || job.experience.includes(experienceFilter);
    const matchesRemote = !remoteFilter || job.remotePolicy === remoteFilter;

    return (
      matchesSearch &&
      matchesLocation &&
      matchesType &&
      matchesExperience &&
      matchesRemote
    );
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "relevance":
        return b.matchScore - a.matchScore;
      case "date":
        return (
          new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
      case "salary":
        return b.salary.max - a.salary.max;
      case "applications":
        return b.applications - a.applications;
      default:
        return 0;
    }
  });

  const savedJobs = jobs.filter((job) => job.isSaved);

  // Pagination logic
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const totalAppliedPages = Math.ceil(appliedJobs.length / appliedJobsPerPage);

  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const paginatedJobs = sortedJobs.slice(startIndex, endIndex);

  const appliedStartIndex = (appliedCurrentPage - 1) * appliedJobsPerPage;
  const appliedEndIndex = appliedStartIndex + appliedJobsPerPage;
  const paginatedAppliedJobs = appliedJobs.slice(
    appliedStartIndex,
    appliedEndIndex
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAppliedPageChange = (page: number) => {
    setAppliedCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">Browse Jobs</h1>
          <p className="text-gray-600 mt-1">
            Find your next career opportunity
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Jobs
          </Button>
          <Button className="text-white hover:text-black">
            <Plus className="w-4 h-4 mr-2" />
            Create Job Alert
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {jobs.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-[10px]">
                <BookmarkCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Saved Jobs</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {savedJobs.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <Send className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {appliedJobs.length}
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
                <p className="text-sm text-gray-600">Match Rate</p>
                <p className="text-2xl font-bold text-[#011F72]">85%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Jobs ({jobs.length})</TabsTrigger>
          <TabsTrigger value="saved">
            Saved Jobs ({savedJobs.length})
          </TabsTrigger>
          <TabsTrigger value="applied">
            Applied Jobs ({appliedJobs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search jobs, companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={locationFilter}
                  onValueChange={setLocationFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-[10px]">
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="london">London</SelectItem>
                    <SelectItem value="manchester">Manchester</SelectItem>
                    <SelectItem value="birmingham">Birmingham</SelectItem>
                    <SelectItem value="edinburgh">Edinburgh</SelectItem>
                    <SelectItem value="liverpool">Liverpool</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-[10px]">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-[10px]">
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date Posted</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="applications">Applications</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Job Results */}
          <div className="space-y-4">
            {selectedJobs.length > 0 && (
              <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-[10px]">
                <span className="text-sm font-medium">
                  {selectedJobs.length} jobs selected
                </span>
                <Button variant="outline" size="sm">
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Save Selected
                </Button>
                <Button variant="outline" size="sm">
                  <Send className="w-4 h-4 mr-2" />
                  Apply to Selected
                </Button>
              </div>
            )}

            {paginatedJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row items-start gap-4">
                    <Checkbox
                      checked={selectedJobs.includes(job.id)}
                      onCheckedChange={(checked) =>
                        handleSelectJob(job.id, checked as boolean)
                      }
                    />
                    <Image
                      src={job.companyLogo}
                      alt={job.company}
                      width={64}
                      height={64}
                      className="rounded-[10px] object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-[#011F72] mb-1">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Building2 className="w-4 h-4" />
                            <span>{job.company}</span>
                            <span>•</span>
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSaveJob(job.id)}
                          >
                            <Bookmark
                              className={`w-4 h-4 ${
                                job.isSaved
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
                        <Badge className={getTypeColor(job.type)}>
                          {job.type}
                        </Badge>
                        <Badge
                          className={getRemotePolicyColor(job.remotePolicy)}
                        >
                          {job.remotePolicy.replace("_", " ")}
                        </Badge>
                        {job.isFeatured && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {job.isUrgent && (
                          <Badge className="bg-red-100 text-red-800">
                            <Zap className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                        <Badge variant="outline">
                          <Target className="w-3 h-3 mr-1" />
                          {job.matchScore}% Match
                        </Badge>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{formatSalary(job.salary)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.experience}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Posted {formatDate(job.postedDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{job.applications} applications</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/jobs/${job.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            className="text-white hover:text-black"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {paginatedJobs.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or filters.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setLocationFilter("all");
                      setTypeFilter("all");
                      setExperienceFilter("");
                      setRemoteFilter("");
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, sortedJobs.length)} of {sortedJobs.length}{" "}
                  jobs
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row items-start gap-4">
                    <Image
                      src={job.companyLogo}
                      alt={job.company}
                      width={64}
                      height={64}
                      className="rounded-[10px] object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-[#011F72] mb-1">
                            {job.title}
                          </h3>
                          <div className="flex flex-col items-start gap-2 text-gray-600 mb-2">
                            <div className="flex gap-1 items-center">
                              <Building2 className="w-4 h-4" />
                              <span>{job.company}</span>
                            </div>
                            <div className="flex gap-1 items-center">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSaveJob(job.id)}
                          >
                            <Bookmark className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getTypeColor(job.type)}>
                          {job.type}
                        </Badge>
                        <Badge variant="outline">
                          <Target className="w-3 h-3 mr-1" />
                          {job.matchScore}% Match
                        </Badge>
                      </div>

                      <div className="flex flex-col [min-width:1090px]:flex-row items-start justify-between">
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{formatSalary(job.salary)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Posted {formatDate(job.postedDate)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/jobs/${job.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                          <Button
                            className="text-white hover:text-black"
                            size="sm"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {savedJobs.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No saved jobs
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Save jobs you're interested in to view them here later.
                  </p>
                  <Button className="text-white hover:text-black" asChild>
                    <Link href="/dashboard/jobs">Browse Jobs</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="applied" className="space-y-6">
          <div className="space-y-4">
            {paginatedAppliedJobs.map((job) => (
              <Card
                key={job.applicationId}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row items-start gap-4">
                    <Image
                      src={job.companyLogo}
                      alt={job.company}
                      width={64}
                      height={64}
                      className="rounded-[10px] object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-[#011F72] mb-1">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Building2 className="w-4 h-4" />
                            <span>{job.company}</span>
                            <span>•</span>
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={getApplicationStatusColor(
                              job.applicationStatus
                            )}
                          >
                            {job.applicationStatus.charAt(0).toUpperCase() +
                              job.applicationStatus.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getTypeColor(job.type)}>
                          {job.type}
                        </Badge>
                        <Badge variant="outline">
                          <Target className="w-3 h-3 mr-1" />
                          {job.matchScore}% Match
                        </Badge>
                      </div>

                      <div className="flex flex-col [min-width:1090px]:flex-row items-start justify-between">
                        <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{formatSalary(job.salary)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Applied {formatDate(job.applicationDate)}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/jobs/${job.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Job
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            View Application
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {paginatedAppliedJobs.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No applied jobs yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Jobs you apply for will appear here for easy tracking.
                  </p>
                  <Button className="text-white hover:text-black" asChild>
                    <Link href="/dashboard/jobs">Browse Jobs</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Applied Jobs Pagination */}
            {totalAppliedPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {appliedStartIndex + 1} to{" "}
                  {Math.min(appliedEndIndex, appliedJobs.length)} of{" "}
                  {appliedJobs.length} applications
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleAppliedPageChange(appliedCurrentPage - 1)
                    }
                    disabled={appliedCurrentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: totalAppliedPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <Button
                        key={page}
                        variant={
                          appliedCurrentPage === page ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleAppliedPageChange(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleAppliedPageChange(appliedCurrentPage + 1)
                    }
                    disabled={appliedCurrentPage === totalAppliedPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
