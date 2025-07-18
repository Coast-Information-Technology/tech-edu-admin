"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Eye,
  Mail,
  Phone,
  Download,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Star,
  AlertCircle,
  Building2,
  Globe,
  User,
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
const mockJobDetails: JobFormData & {
  id: string;
  status: string;
  postedDate: string;
  applicants: number;
  views: number;
} = {
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
};

// Mock applicants data
const mockApplicants = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+44 123 456 7890",
    status: "shortlisted",
    appliedDate: "2024-06-16",
    experience: "4 years",
    location: "London, UK",
    avatar: "/assets/placeholder-avatar.jpg",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+44 987 654 3210",
    status: "reviewed",
    appliedDate: "2024-06-17",
    experience: "3 years",
    location: "Manchester, UK",
    avatar: "/assets/placeholder-avatar.jpg",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+44 555 123 4567",
    status: "new",
    appliedDate: "2024-06-18",
    experience: "5 years",
    location: "Birmingham, UK",
    avatar: "/assets/placeholder-avatar.jpg",
  },
];

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job] = useState(mockJobDetails);
  const [applicants] = useState(mockApplicants);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      closed: "bg-gray-100 text-gray-800",
      draft: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getApplicantStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: "bg-blue-100 text-blue-800",
      reviewed: "bg-yellow-100 text-yellow-800",
      shortlisted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      hired: "bg-purple-100 text-purple-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getApplicantStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      new: <ClockIcon className="h-4 w-4" />,
      reviewed: <Eye className="h-4 w-4" />,
      shortlisted: <CheckCircle className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
      hired: <CheckCircle className="h-4 w-4" />,
    };
    return icons[status] || <ClockIcon className="h-4 w-4" />;
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

  const getSalaryDisplay = () => {
    const currencySymbols: Record<string, string> = {
      GBP: "£",
      USD: "$",
      EUR: "€",
    };
    const symbol = currencySymbols[job.currency] || job.currency;
    return `${symbol}${job.salaryMin} - ${symbol}${job.salaryMax}`;
  };

  const handleDeleteJob = () => {
    if (
      confirm(
        "Are you sure you want to delete this job posting? This action cannot be undone."
      )
    ) {
      // TODO: Implement delete API call
      router.push("/dashboard/my-posted-jobs");
    }
  };

  const handleStatusChange = (newStatus: string) => {
    // TODO: Implement status change API call
    console.log(`Changing status to: ${newStatus}`);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/my-posted-jobs">
            <Button variant="ghost" size="sm" className="rounded-[10px]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600">{job.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(job.status)}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Badge>
          {job.isFeatured && (
            <Badge className="bg-yellow-100 text-yellow-800">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {job.isUrgent && (
            <Badge className="bg-red-100 text-red-800">
              <AlertCircle className="h-3 w-3 mr-1" />
              Urgent
            </Badge>
          )}
          <Link href={`/dashboard/my-posted-jobs/${jobId}/edit`}>
            <Button
              variant="outline"
              className="rounded-[10px] bg-blue-600 text-white hover:text-black"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Job
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={handleDeleteJob}
            className="rounded-[10px] bg-red-600 text-white hover:text-black"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Applicants
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {job.applicants}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{job.views}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Days Posted</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Job Details</TabsTrigger>
          <TabsTrigger value="applicants">
            Applicants ({applicants.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Job Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Job Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {job.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Job Details Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{job.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{getTypeLabel(job.type)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{getSalaryDisplay()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{job.experience} experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Posted: {job.postedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Expires: {job.expiryDate}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{job.recruiter}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{job.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{job.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{job.website}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-[10px]"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View All Applicants
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-[10px]"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Applications
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-[10px]"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Bulk Email
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Applicants Tab */}
        <TabsContent value="applicants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Applicants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {applicant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">
                                {applicant.name}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{applicant.email}</div>
                            <div className="text-sm text-gray-500">
                              {applicant.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {applicant.experience}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{applicant.location}</span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getApplicantStatusColor(
                              applicant.status
                            )}
                          >
                            <div className="flex items-center gap-1">
                              {getApplicantStatusIcon(applicant.status)}
                              {applicant.status.charAt(0).toUpperCase() +
                                applicant.status.slice(1)}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {applicant.appliedDate}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Analytics chart will be displayed here
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Applicant Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Source breakdown will be displayed here
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
