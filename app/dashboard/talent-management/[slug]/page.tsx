"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserIcon,
  BriefcaseIcon,
  MapPinIcon,
  BarChartIcon,
  ShieldCheckIcon,
  CalendarClockIcon,
  Download,
  MessageSquare,
  Star,
  Edit,
  ArrowLeft,
  Mail,
  Phone,
  Linkedin,
  GraduationCap,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Languages,
  FileText,
} from "lucide-react";
import { mockTalentData } from "@/data/talents";

export default function TalentManagementProfilePage() {
  const { slug } = useParams();

  // Find the talent data based on the slug
  const talent = mockTalentData.find((t) => t.id === slug) || mockTalentData[0];

  return (
    <div className="max-w-6xl mx-auto pt-4 pb-10 px-4">
      {/* Header */}
      <div className="flex flex-col items-start gap-4 mb-8">
        <Link href="/dashboard/talent-management">
          <Button variant="outline" size="sm" className="rounded-[10px]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Talents
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#011F72]">{talent.name}</h1>
          <p className="text-gray-600">
            {talent.roleInterest} - {talent.location}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-[10px]">
            <MessageSquare className="w-4 h-4 mr-2" /> Message
          </Button>
          <Button variant="outline" className="rounded-[10px]">
            <Edit className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
          <Button className="text-white hover:text-black rounded-[10px]">
            <Download className="w-4 h-4 mr-2" /> Download CV
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-xl font-bold text-[#011F72]">
                  {talent.rating}/5.0
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
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-xl font-bold text-[#011F72]">
                  {talent.coachVerified ? "Verified" : "Pending"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Availability</p>
                <p className="text-xl font-bold text-[#011F72]">
                  {talent.availability}
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
                <p className="text-sm text-gray-600">Experience</p>
                <p className="text-xl font-bold text-[#011F72]">
                  {talent.experience}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills & Certifications</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Full Name:</span>
                    <p>{talent.name}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Location:</span>
                    <p>{talent.location}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Role Interest:</span>
                    <p>{talent.roleInterest}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Availability:</span>
                    <p>{talent.availability}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Experience:</span>
                    <p>{talent.experience}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Salary Range:</span>
                    <p>{talent.salary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{talent.about}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {talent.workExperience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{exp.title}</h4>
                      <Badge variant="outline">{exp.duration}</Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{exp.company}</p>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {talent.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{edu.degree}</h4>
                      <Badge variant="outline">{edu.year}</Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{edu.university}</p>
                    <p className="text-gray-700">GPA: {edu.gpa}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Technical Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {talent.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-base">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {talent.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {talent.languages.map((lang, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {talent.projects.map((project, index) => (
                    <div key={index} className="border rounded-[10px] p-4">
                      <h4 className="font-semibold mb-2">{project.title}</h4>
                      <p className="text-gray-600 mb-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {project.tools.map((tool, toolIndex) => (
                          <Badge
                            key={toolIndex}
                            variant="outline"
                            className="text-xs"
                          >
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-600">{talent.contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-gray-600">{talent.contact.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-semibold">LinkedIn</p>
                      <p className="text-gray-600">{talent.contact.linkedin}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-gray-600">{talent.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-semibold">University</p>
                      <p className="text-gray-600">{talent.university}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-semibold">CV Insight</p>
                      <p className="text-gray-600">{talent.cvInsight}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
