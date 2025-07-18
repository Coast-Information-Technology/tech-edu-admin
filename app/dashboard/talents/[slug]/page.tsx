"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Plus,
  ArrowLeft,
} from "lucide-react";

const mockTalent = {
  name: "Tomi Adekunle",
  role: "Data Analyst / Research Assistant",
  location: "London, UK (Remote-Ready)",
  cvScore: 84,
  coachVerified: true,
  availableFrom: "Immediately",
  photo: "/assets/placeholder-avatar.jpg",
  experience: [
    {
      company: "Fintech Corp",
      title: "Data Analyst",
      period: "2022 - Present",
      description:
        "Analyzed large datasets to drive business insights and improve KPIs by 20%.",
    },
    {
      company: "EduTech Solutions",
      title: "Research Assistant",
      period: "2020 - 2022",
      description:
        "Supported research projects and published 2 papers in peer-reviewed journals.",
    },
  ],
  education: [
    {
      school: "University of London",
      degree: "MSc Data Science",
      period: "2018 - 2020",
    },
    {
      school: "University of Lagos",
      degree: "BSc Statistics",
      period: "2014 - 2018",
    },
  ],
  skills: [
    "Python",
    "SQL",
    "Data Visualization",
    "Machine Learning",
    "Research",
    "Excel",
  ],
  feedback: [
    {
      name: "Ngozi B.",
      review: "Excellent analytical skills and a great team player.",
      role: "Manager, Fintech Corp",
    },
    {
      name: "David A.",
      review: "Very reliable and always delivers on time.",
      role: "Lead, EduTech Solutions",
    },
  ],
};

export default function TalentDashboardProfile() {
  const { slug } = useParams();

  return (
    <div className="max-w-5xl mx-auto pb-10 px-4">
      <Button
        variant="outline"
        className="rounded-[10px] mb-10"
        size="sm"
        asChild
      >
        <Link href="/dashboard/talents">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Talents
        </Link>
      </Button>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16 mb-8">
        <div className="flex flex-col items-center">
          <Image
            src={mockTalent.photo}
            alt={mockTalent.name}
            width={160}
            height={160}
            className="rounded-full border-4 border-gray-200 shadow-md object-cover"
          />
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="rounded-[10px] hover:bg-gray-100"
            >
              <MessageSquare className="w-4 h-4 mr-1" /> Message
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-[10px] hover:bg-gray-100"
            >
              <Star className="w-4 h-4 mr-1" /> Shortlist
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-[10px] hover:bg-gray-100"
            >
              <Download className="w-4 h-4 mr-1" /> Download CV
            </Button>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold text-[#011F72]">
            {mockTalent.name}
          </h1>
          <div className="flex items-center gap-2 text-lg text-gray-700">
            <BriefcaseIcon className="w-5 h-5" />
            {mockTalent.role}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPinIcon className="w-5 h-5" />
            {mockTalent.location}
          </div>
          <div className="flex items-center gap-2">
            <BarChartIcon className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">CV Insight Score:</span>{" "}
            {mockTalent.cvScore}%
            <Badge className="ml-2 bg-green-100 text-green-800">
              <ShieldCheckIcon className="w-4 h-4 mr-1" />
              Coach Verified
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarClockIcon className="w-5 h-5" />
            <span>Available: {mockTalent.availableFrom}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full rounded-[10px]">
        <TabsList className="mb-4">
          <TabsTrigger value="overview" className="rounded-[10px]">
            Overview
          </TabsTrigger>
          <TabsTrigger value="experience" className="rounded-[10px]">
            Experience
          </TabsTrigger>
          <TabsTrigger value="education" className="rounded-[10px]">
            Education
          </TabsTrigger>
          <TabsTrigger value="skills" className="rounded-[10px]">
            Skills
          </TabsTrigger>
          <TabsTrigger value="feedback" className="rounded-[10px]">
            Feedback
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="bg-white rounded-[10px] shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Overview</h2>
            <p>
              <span className="font-semibold">Role:</span> {mockTalent.role}
              <br />
              <span className="font-semibold">Location:</span>{" "}
              {mockTalent.location}
              <br />
              <span className="font-semibold">Available:</span>{" "}
              {mockTalent.availableFrom}
            </p>
          </div>
        </TabsContent>
        <TabsContent value="experience">
          <div className="bg-white rounded-[10px] shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Experience</h2>
            <ul className="space-y-4">
              {mockTalent.experience.map((exp, idx) => (
                <li key={idx} className="border-b pb-2">
                  <div className="font-semibold">
                    {exp.title} @ {exp.company}
                  </div>
                  <div className="text-gray-600 text-sm">{exp.period}</div>
                  <div className="text-gray-700 mt-1">{exp.description}</div>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="education">
          <div className="bg-white rounded-[10px] shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Education</h2>
            <ul className="space-y-4">
              {mockTalent.education.map((edu, idx) => (
                <li key={idx} className="border-b pb-2">
                  <div className="font-semibold">{edu.degree}</div>
                  <div className="text-gray-600 text-sm">{edu.school}</div>
                  <div className="text-gray-700 mt-1">{edu.period}</div>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="skills">
          <div className="bg-white rounded-[10px] shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {mockTalent.skills.map((skill, idx) => (
                <Badge key={idx} variant="outline" className="text-base">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="feedback">
          <div className="bg-white rounded-[10px] shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Feedback & References
            </h2>
            <ul className="space-y-4">
              {mockTalent.feedback.map((fb, idx) => (
                <li key={idx} className="border-b pb-2">
                  <div className="font-semibold">{fb.name}</div>
                  <div className="text-gray-600 text-sm">{fb.role}</div>
                  <div className="text-gray-700 mt-1">"{fb.review}"</div>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
