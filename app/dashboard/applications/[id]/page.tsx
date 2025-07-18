"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Building2,
  Clock,
  CheckCircle,
  Star,
  DollarSign,
  Users,
  Download,
  MessageSquare,
  Phone,
  Mail,
  Edit,
  Save,
  X,
  Plus,
  Eye,
  FileText,
  Award,
  Target,
  CheckCircle2,
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
    | "rejected";
  appliedDate: string;
  lastUpdated: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  jobType: "full-time" | "part-time" | "contract" | "remote";
  experience: string;
  matchScore: number;
  notes: string;
  recruiter?: {
    name: string;
    email: string;
    phone: string;
    title: string;
  };
  interviewDetails?: {
    date: string;
    time: string;
    type: "phone" | "video" | "onsite";
    interviewer: string;
    notes: string;
  };
}

const mockApplication: JobApplication = {
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
  notes: "Great company culture, exciting tech stack. Follow up on Monday.",
  recruiter: {
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    phone: "+44 20 7123 4567",
    title: "Senior Talent Acquisition Specialist",
  },
  interviewDetails: {
    date: "2024-01-25",
    time: "14:00",
    type: "video",
    interviewer: "John Smith (Tech Lead)",
    notes: "Technical interview focusing on React, Node.js, and system design.",
  },
};

export default function SingleApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [application, setApplication] =
    useState<JobApplication>(mockApplication);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(application.notes);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return <div>Loading...</div>;
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSaveNotes = () => {
    setApplication((prev) => ({ ...prev, notes: notes }));
    setIsEditingNotes(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/applications">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Applications
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">
            {application.jobTitle}
          </h1>
          <p className="text-gray-600 mt-1">
            {application.company.name} • {application.company.location}
          </p>
        </div>
      </div>

      {/* Application Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <Image
                  src={application.company.logo}
                  alt={application.company.name}
                  width={80}
                  height={80}
                  className="rounded-[10px] object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#011F72] mb-2">
                    {application.jobTitle}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <Building2 className="w-4 h-4" />
                    <span>{application.company.name}</span>
                    <span>•</span>
                    <MapPin className="w-4 h-4" />
                    <span>{application.company.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={getStatusColor(application.status)}>
                      {application.status.replace("_", " ")}
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
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Applied {formatDate(application.appliedDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{application.experience} experience</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Image
                  src={application.company.logo}
                  alt={application.company.name}
                  width={48}
                  height={48}
                  className="rounded-[10px] object-cover"
                />
                <div>
                  <h3 className="font-semibold">{application.company.name}</h3>
                  <p className="text-sm text-gray-600">
                    {application.company.industry}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recruiter Info */}
          {application.recruiter && (
            <Card>
              <CardHeader>
                <CardTitle>Recruiter Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">
                    {application.recruiter.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {application.recruiter.title}
                  </p>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    {application.recruiter.email}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    {application.recruiter.phone}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="interview">Interview</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-[#011F72] mb-3">
                    Job Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Job Type:</span>
                      <span className="font-medium">{application.jobType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium">
                        {application.experience}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salary Range:</span>
                      <span className="font-medium">
                        {formatSalary(application.salary)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Match Score:</span>
                      <span className="font-medium">
                        {application.matchScore}%
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-[#011F72] mb-3">
                    Application Timeline
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Applied:</span>
                      <span className="font-medium">
                        {formatDate(application.appliedDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">
                        {formatDate(application.lastUpdated)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interview" className="space-y-6">
          {application.interviewDetails ? (
            <Card>
              <CardHeader>
                <CardTitle>Interview Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Interview Date
                      </label>
                      <p className="text-lg font-semibold">
                        {formatDate(application.interviewDetails.date)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Time
                      </label>
                      <p className="text-lg font-semibold">
                        {application.interviewDetails.time}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Type
                      </label>
                      <Badge className="bg-blue-100 text-blue-800">
                        {application.interviewDetails.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Interviewer
                      </label>
                      <p className="text-lg font-semibold">
                        {application.interviewDetails.interviewer}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Notes
                      </label>
                      <p className="text-gray-700">
                        {application.interviewDetails.notes}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button>
                    <Calendar className="w-4 h-4 mr-2" />
                    Add to Calendar
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Interviewer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Interview Scheduled
                </h3>
                <p className="text-gray-600 mb-4">
                  Interview details will appear here once scheduled.
                </p>
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Recruiter
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditingNotes ? (
                <div className="space-y-4">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={8}
                    placeholder="Add your notes about this application..."
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveNotes}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Notes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingNotes(false)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-[10px] p-4">
                    <p className="text-gray-700">{application.notes}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingNotes(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Notes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
