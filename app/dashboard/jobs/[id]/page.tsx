"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  DollarSign,
  Users,
  Download,
  Trash2,
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
  Save,
  X,
  Video,
  PhoneCall,
  MapPinIcon,
  FileTextIcon,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  BookOpen,
  TargetIcon,
  MessageCircle,
  Send,
  Copy,
  Link as LinkIcon,
  Globe,
  Zap,
  Heart,
  BookmarkPlus,
  BookmarkCheck,
  SendHorizontal,
  Upload,
  FileTextIcon as FileTextIcon2,
  CheckSquare,
  XSquare,
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
  contactEmail: string;
  contactPhone: string;
  website: string;
  companyDescription: string;
  responsibilities: string[];
  applicationDeadline: string;
  startDate: string;
  equity?: string;
  bonus?: string;
}

const mockJob: Job = {
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
    "We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining high-quality software solutions that meet business requirements and technical specifications. This role offers the opportunity to work on cutting-edge technologies and collaborate with a talented team of developers.",
  requirements: [
    "5+ years of experience in software development",
    "Strong proficiency in JavaScript, Python, or Java",
    "Experience with modern frameworks (React, Node.js, Django)",
    "Knowledge of database design and SQL",
    "Experience with cloud platforms (AWS, Azure, GCP)",
    "Strong problem-solving and analytical skills",
    "Excellent communication and teamwork abilities",
    "Experience with version control systems (Git)",
    "Knowledge of CI/CD pipelines and DevOps practices",
  ],
  benefits: [
    "Competitive salary and benefits package",
    "Flexible working hours and remote work options",
    "Professional development and training opportunities",
    "Health insurance and wellness programs",
    "Modern office environment with latest technology",
    "Regular team events and social activities",
    "25 days annual leave plus bank holidays",
    "Pension scheme with employer contribution",
    "Annual performance bonuses",
  ],
  tags: [
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Full-stack",
    "JavaScript",
    "TypeScript",
    "MongoDB",
  ],
  companySize: "500-1000 employees",
  industry: "Technology",
  remotePolicy: "hybrid",
  contactEmail: "hr@techcorp.com",
  contactPhone: "+44 20 7123 4567",
  website: "https://techcorp.com",
  companyDescription:
    "TechCorp Solutions is a leading technology company specializing in innovative software solutions for enterprise clients. We pride ourselves on creating cutting-edge products that solve real-world problems and help businesses thrive in the digital age.",
  responsibilities: [
    "Design and develop scalable web applications",
    "Collaborate with cross-functional teams to define features",
    "Write clean, maintainable, and efficient code",
    "Participate in code reviews and technical discussions",
    "Mentor junior developers and share knowledge",
    "Contribute to technical architecture decisions",
    "Debug and resolve technical issues",
    "Stay up-to-date with emerging technologies",
  ],
  applicationDeadline: "2024-02-15",
  startDate: "March 2024",
  equity: "Stock options available",
  bonus: "Performance-based bonuses up to 20%",
};

export default function SingleJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [job, setJob] = useState<Job>(mockJob);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );
  const [isApplying, setIsApplying] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    expectedSalary: "",
    startDate: "",
    portfolio: "",
    linkedin: "",
    github: "",
    agreeToTerms: false,
  });

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return <div>Loading...</div>;
  }

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
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const toggleSaveJob = () => {
    setJob((prev) => ({ ...prev, isSaved: !prev.isSaved }));
  };

  const handleApply = () => {
    setIsApplying(true);
    console.log("Applying to job:", job.id, applicationData);
  };

  const handleInputChange = (field: string, value: any) => {
    setApplicationData((prev) => ({ ...prev, [field]: value }));
  };

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
            <h1 className="text-3xl font-bold text-[#011F72]">{job.title}</h1>
            <p className="text-gray-600 mt-1">
              {job.company} • {job.location}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={toggleSaveJob}>
            <Bookmark
              className={`w-4 h-4 mr-2 ${
                job.isSaved ? "fill-yellow-400 text-yellow-400" : ""
              }`}
            />
            {job.isSaved ? "Saved" : "Save Job"}
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Job Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <Image
                  src={job.companyLogo}
                  alt={job.company}
                  width={80}
                  height={80}
                  className="rounded-[10px] object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#011F72] mb-2">
                    {job.title}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <Building2 className="w-4 h-4" />
                    <span>{job.company}</span>
                    <span>•</span>
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={getTypeColor(job.type)}>{job.type}</Badge>
                    <Badge className={getRemotePolicyColor(job.remotePolicy)}>
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
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-[#011F72] mb-3">
                  Job Description
                </h3>
                <p className="text-gray-700 mb-6">{job.description}</p>
              </div>

              {/* Job Details */}
              <div className="prose max-w-none">
                <h3>Job Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department</span>
                    <span className="font-medium">{job.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium">{job.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-medium">{job.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Application Deadline</span>
                    <span className="font-medium">
                      {formatDate(job.applicationDeadline)}
                    </span>
                  </div>
                  {job.equity && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Equity</span>
                      <span className="font-medium">{job.equity}</span>
                    </div>
                  )}
                  {job.bonus && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bonus</span>
                      <span className="font-medium">{job.bonus}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Quick Apply */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Apply</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge className="bg-green-100 text-green-800 mb-2">
                  <Target className="w-3 h-3 mr-1" />
                  {job.matchScore}% Match
                </Badge>
                <p className="text-sm text-gray-600 mb-4">
                  Your profile matches this job well!
                </p>
              </div>
              <Button
                className="w-full text-white hover:text-black"
                onClick={() => setIsApplying(true)}
              >
                <Send className="w-4 h-4 mr-2" />
                Apply Now
              </Button>
              <Button variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Recruiter
              </Button>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Image
                  src={job.companyLogo}
                  alt={job.company}
                  width={48}
                  height={48}
                  className="rounded-[10px] object-cover"
                />
                <div>
                  <h3 className="font-semibold">{job.company}</h3>
                  <p className="text-sm text-gray-600">{job.industry}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>{job.companySize}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <a
                    href={job.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
              <p className="text-sm text-gray-600">{job.companyDescription}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="requirements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-transparent border-b border-gray-200">
          <TabsTrigger
            value="requirements"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
          >
            Requirements
          </TabsTrigger>
          <TabsTrigger
            value="responsibilities"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
          >
            Responsibilities
          </TabsTrigger>
          <TabsTrigger
            value="benefits"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
          >
            Benefits
          </TabsTrigger>
          <TabsTrigger
            value="apply"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
          >
            Apply
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responsibilities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {job.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{resp}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Benefits & Perks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apply" className="space-y-6">
          {isApplying ? (
            <Card>
              <CardHeader>
                <CardTitle>Apply for {job.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="coverLetter">Cover Letter</Label>
                    <Textarea
                      id="coverLetter"
                      placeholder="Tell us why you're interested in this position..."
                      value={applicationData.coverLetter}
                      onChange={(e) =>
                        handleInputChange("coverLetter", e.target.value)
                      }
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expectedSalary">Expected Salary</Label>
                      <Input
                        id="expectedSalary"
                        placeholder="e.g., £70,000"
                        value={applicationData.expectedSalary}
                        onChange={(e) =>
                          handleInputChange("expectedSalary", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="startDate">Available Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={applicationData.startDate}
                        onChange={(e) =>
                          handleInputChange("startDate", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="linkedin">LinkedIn Profile</Label>
                      <Input
                        id="linkedin"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={applicationData.linkedin}
                        onChange={(e) =>
                          handleInputChange("linkedin", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="github">GitHub Profile</Label>
                      <Input
                        id="github"
                        placeholder="https://github.com/yourusername"
                        value={applicationData.github}
                        onChange={(e) =>
                          handleInputChange("github", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="portfolio">Portfolio/Website</Label>
                    <Input
                      id="portfolio"
                      placeholder="https://yourportfolio.com"
                      value={applicationData.portfolio}
                      onChange={(e) =>
                        handleInputChange("portfolio", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={applicationData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeToTerms", checked)
                      }
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm">
                      I agree to the terms and conditions
                    </Label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleApply}
                    disabled={!applicationData.agreeToTerms}
                    className="text-white hover:text-black"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsApplying(false)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to Apply?
                </h3>
                <p className="text-gray-600 mb-4">
                  Click the button below to start your application for this
                  position.
                </p>
                <Button
                  className="text-white hover:text-black"
                  onClick={() => setIsApplying(true)}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Start Application
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
