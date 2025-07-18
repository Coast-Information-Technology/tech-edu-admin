"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Users,
  Target,
  TrendingUp,
  MessageSquare,
  Edit,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  GraduationCap,
  BookOpen,
  Award,
  Plus,
  X,
} from "lucide-react";

// Mock data for a single job
const mockJob = {
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
    "Join our dynamic team as a software development intern. Work on real projects and gain valuable experience in a fast-paced technology environment. You'll collaborate with experienced developers, contribute to live projects, and learn industry best practices.",
  requirements: [
    "Currently enrolled in Computer Science or related field",
    "Knowledge of JavaScript, Python, or similar programming languages",
    "Good communication and teamwork skills",
    "Eagerness to learn and adapt to new technologies",
    "Available for 6-month internship starting March 2024",
  ],
  benefits: [
    "Competitive salary with performance bonuses",
    "Flexible working hours and remote work options",
    "Mentorship program with senior developers",
    "Potential full-time offer upon completion",
    "Professional development and training opportunities",
    "Modern office with great amenities",
  ],
  department: "Computer Science",
  experience: "Entry Level",
  duration: "6 months",
  schedule: "Monday to Friday, 9:00 AM - 5:00 PM",
  contactPerson: "Sarah Johnson",
  contactEmail: "sarah.johnson@techcorp.com",
  contactPhone: "+44 20 7123 4567",
};

// Mock applications data
const mockApplications = [
  {
    id: "1",
    studentName: "John Doe",
    studentEmail: "john.doe@student.edu",
    course: "Computer Science",
    year: "3rd Year",
    gpa: "3.8",
    appliedDate: "2024-01-20",
    status: "shortlisted",
    skills: ["JavaScript", "React", "Node.js", "Python"],
    coverLetter: "I am excited to apply for this internship opportunity...",
    resume: "/resumes/john-doe-cv.pdf",
    interviewScheduled: "2024-01-25",
    notes: "Strong technical background, good communication skills",
  },
  {
    id: "2",
    studentName: "Jane Smith",
    studentEmail: "jane.smith@student.edu",
    course: "Software Engineering",
    year: "2nd Year",
    gpa: "3.9",
    appliedDate: "2024-01-18",
    status: "shortlisted",
    skills: ["Java", "Spring Boot", "SQL", "Git"],
    coverLetter: "I have a passion for software development...",
    resume: "/resumes/jane-smith-cv.pdf",
    interviewScheduled: "2024-01-26",
    notes: "Excellent academic record, shows leadership potential",
  },
  {
    id: "3",
    studentName: "Alex Wilson",
    studentEmail: "alex.wilson@student.edu",
    course: "Computer Science",
    year: "4th Year",
    gpa: "3.7",
    appliedDate: "2024-01-22",
    status: "applied",
    skills: ["Python", "Machine Learning", "Data Analysis"],
    coverLetter: "I am interested in applying my ML knowledge...",
    resume: "/resumes/alex-wilson-cv.pdf",
    interviewScheduled: null,
    notes: "Good technical skills, needs to improve communication",
  },
  {
    id: "4",
    studentName: "Sarah Jones",
    studentEmail: "sarah.jones@student.edu",
    course: "Information Technology",
    year: "3rd Year",
    gpa: "3.6",
    appliedDate: "2024-01-19",
    status: "rejected",
    skills: ["HTML", "CSS", "JavaScript", "PHP"],
    coverLetter: "I am looking for an opportunity to grow...",
    resume: "/resumes/sarah-jones-cv.pdf",
    interviewScheduled: null,
    notes: "Skills don't match requirements, suggested other opportunities",
  },
];

export default function SingleJobPage() {
  const { slug } = useParams();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: mockJob.title,
    company: mockJob.company,
    location: mockJob.location,
    type: mockJob.type,
    salaryMin: mockJob.salary.min.toString(),
    salaryMax: mockJob.salary.max.toString(),
    currency: mockJob.salary.currency,
    description: mockJob.description,
    requirements: mockJob.requirements.join("\n"),
    benefits: mockJob.benefits.join("\n"),
    department: mockJob.department,
    experience: mockJob.experience,
    duration: mockJob.duration,
    schedule: mockJob.schedule,
    deadline: mockJob.deadline,
    contactPerson: mockJob.contactPerson,
    contactEmail: mockJob.contactEmail,
    contactPhone: mockJob.contactPhone,
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save to your backend
    console.log("Updated job data:", editForm);
    setIsEditOpen(false);
    // You could add a toast notification here
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shortlisted":
        return "bg-blue-100 text-blue-800";
      case "applied":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "hired":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "shortlisted":
        return <Star className="w-4 h-4" />;
      case "applied":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "hired":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
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
    totalApplications: mockApplications.length,
    shortlisted: mockApplications.filter((app) => app.status === "shortlisted")
      .length,
    rejected: mockApplications.filter((app) => app.status === "rejected")
      .length,
    hired: mockApplications.filter((app) => app.status === "hired").length,
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl font-bold text-[#011F72]">
              {mockJob.title}
            </h1>
            <Badge className="bg-green-100 text-green-800">
              {mockJob.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-lg text-gray-700 mb-2">
            <Building2 className="w-5 h-5" />
            <span>{mockJob.company}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <MapPin className="w-5 h-5" />
            <span>{mockJob.location}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{formatSalary(mockJob.salary)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{mockJob.type}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Deadline: {formatDate(mockJob.deadline)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-[10px]">
            <MessageSquare className="w-4 h-4 mr-2" /> Contact Company
          </Button>

          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-[10px]">
                <Edit className="w-4 h-4 mr-2" /> Edit Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[10px]">
              <DialogHeader>
                <DialogTitle>Edit Job Posting</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      className="rounded-[10px]"
                      id="title"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      className="rounded-[10px]"
                      id="company"
                      value={editForm.company}
                      onChange={(e) =>
                        setEditForm({ ...editForm, company: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      className="rounded-[10px]"
                      id="location"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Job Type</Label>
                    <Select
                      value={editForm.type}
                      onValueChange={(value) =>
                        setEditForm({ ...editForm, type: value })
                      }
                    >
                      <SelectTrigger className="rounded-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={editForm.department}
                      onValueChange={(value) =>
                        setEditForm({ ...editForm, department: value })
                      }
                    >
                      <SelectTrigger className="rounded-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Computer Science">
                          Computer Science
                        </SelectItem>
                        <SelectItem value="Data Science">
                          Data Science
                        </SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Psychology">Psychology</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience Level</Label>
                    <Select
                      value={editForm.experience}
                      onValueChange={(value) =>
                        setEditForm({ ...editForm, experience: value })
                      }
                    >
                      <SelectTrigger className="rounded-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Entry Level">Entry Level</SelectItem>
                        <SelectItem value="1-2 years">1-2 years</SelectItem>
                        <SelectItem value="3-5 years">3-5 years</SelectItem>
                        <SelectItem value="5+ years">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="salaryMin">Salary Min</Label>
                    <Input
                      className="rounded-[10px]"
                      id="salaryMin"
                      type="number"
                      value={editForm.salaryMin}
                      onChange={(e) =>
                        setEditForm({ ...editForm, salaryMin: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="salaryMax">Salary Max</Label>
                    <Input
                      className="rounded-[10px]"
                      id="salaryMax"
                      type="number"
                      value={editForm.salaryMax}
                      onChange={(e) =>
                        setEditForm({ ...editForm, salaryMax: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={editForm.currency}
                      onValueChange={(value) =>
                        setEditForm({ ...editForm, currency: value })
                      }
                    >
                      <SelectTrigger className="rounded-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      className="rounded-[10px]"
                      id="duration"
                      value={editForm.duration}
                      onChange={(e) =>
                        setEditForm({ ...editForm, duration: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="schedule">Schedule</Label>
                    <Input
                      className="rounded-[10px]"
                      id="schedule"
                      value={editForm.schedule}
                      onChange={(e) =>
                        setEditForm({ ...editForm, schedule: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="deadline">Application Deadline</Label>
                    <Input
                      className="rounded-[10px]"
                      id="deadline"
                      type="date"
                      value={editForm.deadline}
                      onChange={(e) =>
                        setEditForm({ ...editForm, deadline: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    className="rounded-[10px]"
                    id="description"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="requirements">
                    Requirements (one per line)
                  </Label>
                  <Textarea
                    className="rounded-[10px]"
                    id="requirements"
                    value={editForm.requirements}
                    onChange={(e) =>
                      setEditForm({ ...editForm, requirements: e.target.value })
                    }
                    rows={6}
                    placeholder="Enter each requirement on a new line"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="benefits">Benefits (one per line)</Label>
                  <Textarea
                    className="rounded-[10px]"
                    id="benefits"
                    value={editForm.benefits}
                    onChange={(e) =>
                      setEditForm({ ...editForm, benefits: e.target.value })
                    }
                    rows={6}
                    placeholder="Enter each benefit on a new line"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      className="rounded-[10px]"
                      id="contactPerson"
                      value={editForm.contactPerson}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          contactPerson: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      className="rounded-[10px]"
                      id="contactEmail"
                      type="email"
                      value={editForm.contactEmail}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          contactEmail: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      className="rounded-[10px]"
                      id="contactPhone"
                      value={editForm.contactPhone}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          contactPhone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Button className="text-white hover:text-black rounded-[10px]">
            <Download className="w-4 h-4 mr-2" /> Export Data
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-xl font-bold text-[#011F72]">
                  {stats.totalApplications}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-[10px]">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Shortlisted</p>
                <p className="text-xl font-bold text-[#011F72]">
                  {stats.shortlisted}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-[10px]">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-xl font-bold text-[#011F72]">
                  {stats.rejected}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hired</p>
                <p className="text-xl font-bold text-[#011F72]">
                  {stats.hired}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Job Details</TabsTrigger>
          <TabsTrigger value="applications">
            Applications ({stats.totalApplications})
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">{mockJob.description}</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {mockJob.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Benefits:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {mockJob.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Department:</span>
                      <p>{mockJob.department}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Experience Level:</span>
                      <p>{mockJob.experience}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Duration:</span>
                      <p>{mockJob.duration}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Schedule:</span>
                      <p>{mockJob.schedule}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Posted Date:</span>
                      <p>{formatDate(mockJob.postedDate)}</p>
                    </div>
                    <div>
                      <span className="font-semibold">
                        Application Deadline:
                      </span>
                      <p>{formatDate(mockJob.deadline)}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Contact Information:</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-semibold">Contact Person:</span>{" "}
                        {mockJob.contactPerson}
                      </p>
                      <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {mockJob.contactEmail}
                      </p>
                      <p>
                        <span className="font-semibold">Phone:</span>{" "}
                        {mockJob.contactPhone}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Student Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockApplications.map((application) => (
                  <div
                    key={application.id}
                    className="border rounded-[10px] p-4"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#011F72]">
                          {application.studentName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {application.studentEmail}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>
                            {application.course} - {application.year}
                          </span>
                          <span>GPA: {application.gpa}</span>
                          <span>
                            Applied: {formatDate(application.appliedDate)}
                          </span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1">{application.status}</span>
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {application.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {application.coverLetter}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {application.notes}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Applications</span>
                    <span className="font-semibold">
                      {stats.totalApplications}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shortlisted</span>
                    <span className="font-semibold text-blue-600">
                      {stats.shortlisted}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Rejected</span>
                    <span className="font-semibold text-red-600">
                      {stats.rejected}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Hired</span>
                    <span className="font-semibold text-green-600">
                      {stats.hired}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span>Success Rate</span>
                      <span className="font-semibold">
                        {stats.totalApplications > 0
                          ? Math.round(
                              (stats.hired / stats.totalApplications) * 100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-[10px]">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Computer Science</p>
                      <p className="text-lg font-bold text-[#011F72]">
                        8 applications
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-[10px]">
                      <BookOpen className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Software Engineering
                      </p>
                      <p className="text-lg font-bold text-[#011F72]">
                        4 applications
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
