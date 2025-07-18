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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  MapPin,
  Briefcase,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

// Mock data for posted jobs
const mockPostedJobs: (JobFormData & {
  id: string;
  status: string;
  postedDate: string;
  applicants: number;
  views: number;
})[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechEdu Solutions",
    department: "Engineering",
    location: "London, UK",
    type: "full-time",
    status: "active",
    postedDate: "2024-06-15",
    applicants: 24,
    views: 342,
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
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company: "TechEdu Solutions",
    department: "Design",
    location: "Remote",
    type: "contract",
    status: "active",
    postedDate: "2024-06-10",
    applicants: 18,
    views: 256,
    salaryMin: "45000",
    salaryMax: "65000",
    currency: "GBP",
    experience: "2-4 years",
    description:
      "Join our design team to create amazing user experiences. You will work closely with product managers and developers to design intuitive and beautiful interfaces.",
    requirements: [
      "2+ years of experience in UX/UI design",
      "Proficiency in Figma, Sketch, or Adobe XD",
      "Understanding of user-centered design principles",
      "Experience with design systems",
      "Portfolio showcasing your work",
    ],
    benefits: [
      "Flexible remote work",
      "Creative environment",
      "Professional development",
      "Competitive compensation",
    ],
    contactEmail: "design@techedu.com",
    contactPhone: "+44 987 654 3210",
    website: "https://techedu.com",
    recruiter: "Mike Chen",
    isFeatured: false,
    isUrgent: true,
    expiryDate: "2024-07-10",
    skills: ["Figma", "Sketch", "Adobe XD", "Prototyping", "User Research"],
    responsibilities: [
      "Create user interface designs",
      "Conduct user research",
      "Create wireframes and prototypes",
      "Collaborate with development team",
    ],
  },
  {
    id: "3",
    title: "Product Manager",
    company: "TechEdu Solutions",
    department: "Product",
    location: "Manchester, UK",
    type: "full-time",
    status: "paused",
    postedDate: "2024-06-05",
    applicants: 12,
    views: 189,
    salaryMin: "70000",
    salaryMax: "90000",
    currency: "GBP",
    experience: "5+ years",
    description:
      "Lead product strategy and development for our educational technology platform. You will work with cross-functional teams to deliver exceptional user experiences.",
    requirements: [
      "5+ years of product management experience",
      "Experience in EdTech or SaaS products",
      "Strong analytical and strategic thinking",
      "Excellent communication skills",
      "Experience with agile methodologies",
    ],
    benefits: [
      "Leadership opportunities",
      "Competitive salary package",
      "Health and wellness benefits",
      "Professional development budget",
    ],
    contactEmail: "product@techedu.com",
    contactPhone: "+44 555 123 4567",
    website: "https://techedu.com",
    recruiter: "Emma Wilson",
    isFeatured: true,
    isUrgent: false,
    expiryDate: "2024-07-05",
    skills: [
      "Product Strategy",
      "Agile",
      "Analytics",
      "User Research",
      "Roadmapping",
    ],
    responsibilities: [
      "Define product vision and strategy",
      "Lead cross-functional teams",
      "Analyze market trends and user feedback",
      "Create and maintain product roadmaps",
    ],
  },
  {
    id: "4",
    title: "Backend Developer",
    company: "TechEdu Solutions",
    department: "Engineering",
    location: "Birmingham, UK",
    type: "full-time",
    status: "closed",
    postedDate: "2024-05-20",
    applicants: 31,
    views: 423,
    salaryMin: "55000",
    salaryMax: "75000",
    currency: "GBP",
    experience: "3-5 years",
    description:
      "Build scalable backend systems and APIs for our educational platform. You will work with modern technologies and cloud infrastructure.",
    requirements: [
      "3+ years of backend development experience",
      "Proficiency in Node.js, Python, or Java",
      "Experience with databases (SQL and NoSQL)",
      "Knowledge of cloud platforms (AWS, Azure, GCP)",
      "Understanding of microservices architecture",
    ],
    benefits: [
      "Competitive salary and benefits",
      "Modern tech stack",
      "Learning and development opportunities",
      "Flexible working arrangements",
    ],
    contactEmail: "backend@techedu.com",
    contactPhone: "+44 111 222 3333",
    website: "https://techedu.com",
    recruiter: "David Brown",
    isFeatured: false,
    isUrgent: false,
    expiryDate: "2024-06-20",
    skills: ["Node.js", "Python", "Java", "PostgreSQL", "MongoDB", "AWS"],
    responsibilities: [
      "Design and implement backend APIs",
      "Optimize database performance",
      "Ensure system security and scalability",
      "Collaborate with frontend and DevOps teams",
    ],
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "TechEdu Solutions",
    department: "Data Science",
    location: "Edinburgh, UK",
    type: "full-time",
    status: "active",
    postedDate: "2024-06-12",
    applicants: 15,
    views: 198,
    salaryMin: "65000",
    salaryMax: "85000",
    currency: "GBP",
    experience: "4-6 years",
    description:
      "Join our data science team to develop machine learning models and analytics solutions that drive educational insights and improve student outcomes.",
    requirements: [
      "4+ years of experience in data science or machine learning",
      "Proficiency in Python, R, or similar languages",
      "Experience with ML frameworks (TensorFlow, PyTorch, scikit-learn)",
      "Strong statistical and mathematical background",
      "Experience with big data technologies (Spark, Hadoop)",
    ],
    benefits: [
      "Cutting-edge technology stack",
      "Research and publication opportunities",
      "Conference attendance and training",
      "Competitive salary and equity",
    ],
    contactEmail: "data@techedu.com",
    contactPhone: "+44 444 555 6666",
    website: "https://techedu.com",
    recruiter: "Dr. Lisa Chen",
    isFeatured: true,
    isUrgent: false,
    expiryDate: "2024-07-12",
    skills: ["Python", "R", "TensorFlow", "PyTorch", "SQL", "Spark"],
    responsibilities: [
      "Develop machine learning models",
      "Analyze educational data patterns",
      "Create predictive analytics solutions",
      "Collaborate with product and engineering teams",
    ],
  },
  {
    id: "6",
    title: "DevOps Engineer",
    company: "TechEdu Solutions",
    department: "Engineering",
    location: "Remote",
    type: "full-time",
    status: "active",
    postedDate: "2024-06-08",
    applicants: 22,
    views: 287,
    salaryMin: "60000",
    salaryMax: "80000",
    currency: "GBP",
    experience: "3-5 years",
    description:
      "Help us build and maintain robust, scalable infrastructure for our educational platform. You will work with modern cloud technologies and automation tools.",
    requirements: [
      "3+ years of DevOps or infrastructure experience",
      "Experience with AWS, Azure, or GCP",
      "Proficiency in Docker and Kubernetes",
      "Experience with CI/CD pipelines",
      "Knowledge of infrastructure as code (Terraform, CloudFormation)",
    ],
    benefits: [
      "Remote-first culture",
      "Latest cloud technologies",
      "Professional certifications support",
      "Flexible working hours",
    ],
    contactEmail: "devops@techedu.com",
    contactPhone: "+44 777 888 9999",
    website: "https://techedu.com",
    recruiter: "Alex Rodriguez",
    isFeatured: false,
    isUrgent: true,
    expiryDate: "2024-07-08",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Linux"],
    responsibilities: [
      "Manage cloud infrastructure",
      "Implement CI/CD pipelines",
      "Monitor system performance",
      "Ensure security and compliance",
    ],
  },
  {
    id: "7",
    title: "Content Marketing Manager",
    company: "TechEdu Solutions",
    department: "Marketing",
    location: "London, UK",
    type: "full-time",
    status: "active",
    postedDate: "2024-06-03",
    applicants: 19,
    views: 234,
    salaryMin: "45000",
    salaryMax: "60000",
    currency: "GBP",
    experience: "3-4 years",
    description:
      "Create compelling content that educates and engages our audience. You will develop marketing strategies and content that drives brand awareness and user acquisition.",
    requirements: [
      "3+ years of content marketing experience",
      "Excellent writing and editing skills",
      "Experience with SEO and content optimization",
      "Knowledge of educational technology market",
      "Experience with content management systems",
    ],
    benefits: [
      "Creative freedom",
      "Professional development budget",
      "Flexible working arrangements",
      "Performance bonuses",
    ],
    contactEmail: "marketing@techedu.com",
    contactPhone: "+44 333 444 5555",
    website: "https://techedu.com",
    recruiter: "Sophie Williams",
    isFeatured: false,
    isUrgent: false,
    expiryDate: "2024-07-03",
    skills: [
      "Content Strategy",
      "SEO",
      "Copywriting",
      "WordPress",
      "Analytics",
      "Social Media",
    ],
    responsibilities: [
      "Develop content marketing strategies",
      "Create blog posts and educational content",
      "Manage social media presence",
      "Analyze content performance metrics",
    ],
  },
  {
    id: "8",
    title: "Customer Success Manager",
    company: "TechEdu Solutions",
    department: "Customer Success",
    location: "Bristol, UK",
    type: "full-time",
    status: "active",
    postedDate: "2024-06-01",
    applicants: 28,
    views: 312,
    salaryMin: "40000",
    salaryMax: "55000",
    currency: "GBP",
    experience: "2-4 years",
    description:
      "Help our educational institutions succeed with our platform. You will build relationships with clients and ensure they achieve their goals with our technology.",
    requirements: [
      "2+ years of customer success or account management experience",
      "Experience in EdTech or SaaS industry",
      "Excellent communication and relationship-building skills",
      "Problem-solving and analytical abilities",
      "Experience with CRM systems",
    ],
    benefits: [
      "Customer-focused role",
      "Travel opportunities",
      "Performance-based bonuses",
      "Professional development",
    ],
    contactEmail: "success@techedu.com",
    contactPhone: "+44 222 333 4444",
    website: "https://techedu.com",
    recruiter: "Maria Garcia",
    isFeatured: true,
    isUrgent: false,
    expiryDate: "2024-07-01",
    skills: [
      "Customer Success",
      "Account Management",
      "CRM",
      "Analytics",
      "Training",
      "Problem Solving",
    ],
    responsibilities: [
      "Manage client relationships",
      "Onboard new customers",
      "Provide training and support",
      "Monitor customer health and satisfaction",
    ],
  },
  {
    id: "9",
    title: "QA Engineer",
    company: "TechEdu Solutions",
    department: "Engineering",
    location: "Leeds, UK",
    type: "full-time",
    status: "paused",
    postedDate: "2024-05-25",
    applicants: 16,
    views: 201,
    salaryMin: "45000",
    salaryMax: "60000",
    currency: "GBP",
    experience: "2-4 years",
    description:
      "Ensure the quality and reliability of our educational platform through comprehensive testing and quality assurance processes.",
    requirements: [
      "2+ years of QA testing experience",
      "Experience with automated testing tools",
      "Knowledge of testing methodologies",
      "Experience with web and mobile applications",
      "Understanding of agile development processes",
    ],
    benefits: [
      "Quality-focused environment",
      "Latest testing tools and technologies",
      "Professional certifications",
      "Collaborative team culture",
    ],
    contactEmail: "qa@techedu.com",
    contactPhone: "+44 111 222 3333",
    website: "https://techedu.com",
    recruiter: "Tom Anderson",
    isFeatured: false,
    isUrgent: false,
    expiryDate: "2024-06-25",
    skills: [
      "Selenium",
      "Jest",
      "Cypress",
      "Manual Testing",
      "API Testing",
      "Mobile Testing",
    ],
    responsibilities: [
      "Design and execute test plans",
      "Automate test cases",
      "Report and track bugs",
      "Collaborate with development teams",
    ],
  },
  {
    id: "10",
    title: "Sales Development Representative",
    company: "TechEdu Solutions",
    department: "Sales",
    location: "Remote",
    type: "full-time",
    status: "active",
    postedDate: "2024-05-28",
    applicants: 35,
    views: 445,
    salaryMin: "35000",
    salaryMax: "45000",
    currency: "GBP",
    experience: "1-3 years",
    description:
      "Generate new business opportunities by identifying and qualifying potential customers for our educational technology solutions.",
    requirements: [
      "1+ years of sales or business development experience",
      "Strong communication and interpersonal skills",
      "Experience with CRM systems",
      "Knowledge of educational technology market",
      "Self-motivated and results-driven",
    ],
    benefits: [
      "Uncapped commission structure",
      "Remote work flexibility",
      "Career advancement opportunities",
      "Comprehensive training program",
    ],
    contactEmail: "sales@techedu.com",
    contactPhone: "+44 999 888 7777",
    website: "https://techedu.com",
    recruiter: "James Thompson",
    isFeatured: false,
    isUrgent: true,
    expiryDate: "2024-06-28",
    skills: [
      "Sales",
      "Lead Generation",
      "CRM",
      "Cold Calling",
      "Prospecting",
      "Negotiation",
    ],
    responsibilities: [
      "Generate and qualify leads",
      "Conduct product demonstrations",
      "Build relationships with prospects",
      "Achieve sales targets",
    ],
  },
];

export default function MyPostedJobsPage() {
  const [jobs, setJobs] = useState(mockPostedJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      closed: "bg-gray-100 text-gray-800",
      draft: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: "Active",
      paused: "Paused",
      closed: "Closed",
      draft: "Draft",
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "full-time": "Full-time",
      "part-time": "Part-time",
      contract: "Contract",
      internship: "Internship",
      remote: "Remote",
    };
    return labels[type] || type;
  };

  const getSalaryDisplay = (job: any) => {
    const currencySymbols: Record<string, string> = {
      GBP: "£",
      USD: "$",
      EUR: "€",
    };
    const symbol = currencySymbols[job.currency] || job.currency;
    return `${symbol}${job.salaryMin} - ${symbol}${job.salaryMax}`;
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesType = typeFilter === "all" || job.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleDeleteJob = (jobId: string) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      setJobs(jobs.filter((job) => job.id !== jobId));
    }
  };

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((job) => job.status === "active").length;
  const totalApplicants = jobs.reduce((sum, job) => sum + job.applicants, 0);

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Posted Jobs</h1>
          <p className="text-gray-600 mt-1">
            Manage and track your job postings
          </p>
        </div>
        <Link href="/dashboard/jobs-management/new">
          <Button className="text-white hover:text-black rounded-[10px]">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{totalJobs}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{activeJobs}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Applicants
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalApplicants}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs by title, location, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-[10px]"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 rounded-[10px]">
                <SelectValue placeholder="Filter by status rounded-[10px]" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 rounded-[10px]">
                <SelectValue placeholder="Filter by type" />
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
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Job Postings ({filteredJobs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applicants</TableHead>
                  <TableHead>Posted Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">
                          {job.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {job.company}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{job.department}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getTypeLabel(job.type)}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">
                        {getSalaryDisplay(job)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(job.status)}>
                        {getStatusLabel(job.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{job.applicants}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{job.postedDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-[10px]"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-[10px] bg-white"
                        >
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/my-posted-jobs/${job.id}`}
                              className="flex items-center gap-2 hover:text-white hover:bg-blue-600 cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/my-posted-jobs/${job.id}/edit`}
                              className="flex items-center gap-2 hover:text-white hover:bg-blue-600 cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteJob(job.id)}
                            className="flex items-center gap-2 text-red-600 hover:text-white hover:bg-red-600 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No jobs found matching your criteria.
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredJobs.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={handleItemsPerPageChange}
                  >
                    <SelectTrigger className="w-20 rounded-[10px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-[10px]">
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600">entries</span>
                </div>
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredJobs.length)} of{" "}
                  {filteredJobs.length} jobs
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-[10px]"
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={
                          currentPage === pageNumber ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNumber)}
                        className={
                          currentPage === pageNumber
                            ? "rounded-[10px] text-white hover:text-black"
                            : "rounded-[10px] w-8 h-8 p-0"
                        }
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-[10px]"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
