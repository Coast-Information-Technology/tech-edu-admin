"use client";

import { useParams } from "next/navigation";
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
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Award,
  Target,
  TrendingUp,
  GraduationCap,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// Mock data for a single student
const mockStudent = {
  id: "1",
  slug: "john-doe",
  name: "John Doe",
  email: "john.doe@student.edu",
  phone: "+44 7123 456789",
  location: "London, UK",
  course: "Computer Science",
  year: "3rd Year",
  gpa: "3.8",
  status: "active",
  enrollmentDate: "2022-09-01",
  lastActive: "2024-01-20",
  avatar: "/assets/placeholder-avatar.jpg",
  skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "Git"],
  interests: ["Web Development", "AI/ML", "Data Science", "Cybersecurity"],
  achievements: [
    "Dean's List 2023",
    "Hackathon Winner - Tech Innovation Challenge",
    "Best Final Year Project Award",
    "Student Ambassador 2023-2024",
  ],
  mentor: "Dr. Sarah Johnson",
  nextMeeting: "2024-01-25",
  academicProgress: {
    completedCredits: 180,
    totalCredits: 240,
    currentSemester: "Spring 2024",
    courses: [
      { name: "Advanced Algorithms", grade: "A", credits: 15 },
      { name: "Software Engineering", grade: "A-", credits: 15 },
      { name: "Database Systems", grade: "B+", credits: 15 },
      { name: "Machine Learning", grade: "A", credits: 15 },
    ],
  },
  attendance: 92,
  assignments: {
    completed: 45,
    total: 48,
    overdue: 1,
  },
  feedback: [
    {
      from: "Dr. Sarah Johnson",
      date: "2024-01-15",
      message:
        "Excellent progress in algorithms. Shows strong analytical thinking.",
      type: "academic",
    },
    {
      from: "Prof. Michael Brown",
      date: "2024-01-10",
      message:
        "Great team player in group projects. Leadership potential noted.",
      type: "personal",
    },
  ],
};

export default function StudentProfilePage() {
  const { slug } = useParams();

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/students">
          <Button variant="outline" size="sm" className="rounded-[10px]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Students
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#011F72]">
            {mockStudent.name}
          </h1>
          <p className="text-gray-600">
            {mockStudent.course} - {mockStudent.year}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-[10px]">
            <MessageSquare className="w-4 h-4 mr-2" /> Message
          </Button>
          <Button variant="outline" className="rounded-[10px]">
            <Calendar className="w-4 h-4 mr-2" /> Schedule Meeting
          </Button>
          <Button className="text-white hover:text-black rounded-[10px]">
            <Download className="w-4 h-4 mr-2" /> Download Records
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Attendance</p>
                <p className="text-xl font-bold text-[#011F72]">
                  {mockStudent.attendance}%
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
                <p className="text-sm text-gray-600">Assignments</p>
                <p className="text-xl font-bold text-[#011F72]">
                  {mockStudent.assignments.completed}/
                  {mockStudent.assignments.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-xl font-bold text-[#011F72]">
                  {Math.round(
                    (mockStudent.academicProgress.completedCredits /
                      mockStudent.academicProgress.totalCredits) *
                      100
                  )}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-[10px]">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Meeting</p>
                <p className="text-xl font-bold text-[#011F72]">
                  {mockStudent.nextMeeting}
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
          <TabsTrigger value="academic">Academic Progress</TabsTrigger>
          <TabsTrigger value="skills">Skills & Interests</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
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
                    <span className="font-semibold">Student ID:</span>
                    <p>{mockStudent.id}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Enrollment Date:</span>
                    <p>{mockStudent.enrollmentDate}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Last Active:</span>
                    <p>{mockStudent.lastActive}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Current Semester:</span>
                    <p>{mockStudent.academicProgress.currentSemester}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span>
                    <p>{mockStudent.email}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Phone:</span>
                    <p>{mockStudent.phone}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Location:</span>
                    <p>{mockStudent.location}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Mentor:</span>
                    <p>{mockStudent.mentor}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Academic Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Credits Completed</span>
                    <span className="font-semibold">
                      {mockStudent.academicProgress.completedCredits} /{" "}
                      {mockStudent.academicProgress.totalCredits}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (mockStudent.academicProgress.completedCredits /
                            mockStudent.academicProgress.totalCredits) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {mockStudent.academicProgress.totalCredits -
                      mockStudent.academicProgress.completedCredits}{" "}
                    credits remaining
                  </div>
                  <div className="flex justify-between items-center">
                    <span>GPA</span>
                    <span className="font-semibold text-lg">
                      {mockStudent.gpa}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Current Semester Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStudent.academicProgress.courses.map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-[10px]"
                  >
                    <div>
                      <h4 className="font-semibold">{course.name}</h4>
                      <p className="text-sm text-gray-600">
                        {course.credits} credits
                      </p>
                    </div>
                    <Badge
                      className={
                        course.grade === "A"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {course.grade}
                    </Badge>
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
                  {mockStudent.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-base">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Areas of Interest</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockStudent.interests.map((interest, index) => (
                    <Badge
                      key={index}
                      className="bg-purple-100 text-purple-800"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Achievements & Awards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStudent.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 border rounded-[10px]"
                  >
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Faculty Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStudent.feedback.map((feedback, index) => (
                  <div key={index} className="border rounded-[10px] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{feedback.from}</span>
                      <span className="text-sm text-gray-600">
                        {feedback.date}
                      </span>
                    </div>
                    <p className="text-gray-700">{feedback.message}</p>
                    <Badge className="mt-2" variant="outline">
                      {feedback.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
