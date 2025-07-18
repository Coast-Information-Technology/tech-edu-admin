"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Clock,
  Award,
  Play,
  CheckCircle,
  TrendingUp,
  Search,
  Filter,
  Calendar,
  Users,
  Star,
  Eye,
  Heart,
  Plus,
  Target,
  GraduationCap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  certificate: boolean;
  status: string;
  image: string;
  category: string;
  level: string;
}

interface EnrolledCourse extends Course {
  progress: number;
  completedLessons: number;
  totalLessons: number;
  startDate: string;
  lastAccessed: string;
  nextLesson?: string;
  instructor: string;
  rating: number;
}

const mockEnrolledCourses: EnrolledCourse[] = [
  {
    id: 1,
    title: "Strategic Thinking for Teams",
    description:
      "Build critical thinking habits and structured decision-making.",
    duration: "2 Months",
    certificate: true,
    status: "In Progress",
    image: "/assets/courses.webp",
    category: "Career",
    level: "Intermediate",
    progress: 65,
    completedLessons: 13,
    totalLessons: 20,
    startDate: "2024-01-10",
    lastAccessed: "2024-01-15",
    nextLesson: "Module 4: Decision Frameworks",
    instructor: "Dr. Sarah Johnson",
    rating: 4.8,
  },
  {
    id: 3,
    title: "Excel & Dashboards Essentials",
    description:
      "Turn raw data into smart decisions with Excel and visual dashboards.",
    duration: "3 Months",
    certificate: true,
    status: "In Progress",
    image: "/assets/courses.webp",
    category: "Tools",
    level: "Intermediate",
    progress: 30,
    completedLessons: 6,
    totalLessons: 20,
    startDate: "2024-01-05",
    lastAccessed: "2024-01-14",
    nextLesson: "Module 3: Advanced Formulas",
    instructor: "Mike Chen",
    rating: 4.6,
  },
  {
    id: 7,
    title: "Conflict Resolution in the Workplace",
    description:
      "Build skills to handle conflict professionally and productively.",
    duration: "2 Months",
    certificate: true,
    status: "Completed",
    image: "/assets/courses.webp",
    category: "Soft Skills",
    level: "Beginner",
    progress: 100,
    completedLessons: 16,
    totalLessons: 16,
    startDate: "2023-12-01",
    lastAccessed: "2024-01-10",
    instructor: "Lisa Rodriguez",
    rating: 4.9,
  },
];

const mockRecommendedCourses: Course[] = [
  {
    id: 9,
    title: "Emotional Intelligence at Work",
    description: "Boost self-awareness and empathy for better team dynamics.",
    duration: "2 Months",
    certificate: true,
    status: "Enroll Now",
    image: "/assets/courses.webp",
    category: "Soft Skills",
    level: "Intermediate",
  },
  {
    id: 10,
    title: "Leadership Essentials",
    description:
      "Develop foundational leadership and people management skills.",
    duration: "6 Months",
    certificate: true,
    status: "Join Waitlist",
    image: "/assets/courses.webp",
    category: "Career",
    level: "Advanced",
  },
  {
    id: 13,
    title: "Critical Thinking for Analysts",
    description: "Sharpen your logic and decision-making with real data sets.",
    duration: "5 Months",
    certificate: true,
    status: "Enroll Now",
    image: "/assets/cloud-computing.webp",
    category: "Data",
    level: "Advanced",
  },
];

export default function CoursesPage() {
  const [enrolledCourses, setEnrolledCourses] =
    useState<EnrolledCourse[]>(mockEnrolledCourses);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>(
    mockRecommendedCourses
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (courseId: number) => {
    setFavorites((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const filteredEnrolledCourses = enrolledCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || course.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || course.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Not Started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    return "bg-yellow-500";
  };

  const stats = {
    totalEnrolled: enrolledCourses.length,
    inProgress: enrolledCourses.filter((c) => c.status === "In Progress")
      .length,
    completed: enrolledCourses.filter((c) => c.status === "Completed").length,
    averageProgress: Math.round(
      enrolledCourses.reduce((acc, c) => acc + c.progress, 0) /
        enrolledCourses.length
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">My Courses</h1>
          <p className="text-gray-600 mt-1">
            Track your learning progress and discover new courses
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="text-white hover:text-black">
            <Link href="/training/catalog">
              <Plus className="w-4 h-4 mr-2" />
              Browse Courses
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/training/certifications">
              <Award className="w-4 h-4 mr-2" />
              Certifications
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Enrolled</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.totalEnrolled}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-[10px]">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.inProgress}
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
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.completed}
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
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.averageProgress}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="enrolled" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-48 rounded-[10px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-[10px]">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full lg:w-48 rounded-[10px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-[10px]">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Career">Career</SelectItem>
                    <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                    <SelectItem value="Tools">Tools</SelectItem>
                    <SelectItem value="Data">Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Enrolled Courses Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEnrolledCourses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video relative">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge className={getStatusColor(course.status)}>
                      {course.status}
                    </Badge>
                    {course.certificate && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Award className="w-3 h-3 mr-1" />
                        Certificate
                      </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-[#011F72] line-clamp-2">
                      {course.title}
                    </h3>
                    <button
                      onClick={() => toggleFavorite(course.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.includes(course.id)
                            ? "fill-red-500 text-red-500"
                            : ""
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">{course.progress}%</span>
                    </div>
                    <Progress
                      value={course.progress}
                      className={`h-2 [&>div]:${getProgressColor(
                        course.progress
                      )}`}
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        {course.completedLessons} of {course.totalLessons}{" "}
                        lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Last accessed: {course.lastAccessed}</span>
                    </div>
                    {course.nextLesson && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Play className="w-4 h-4" />
                        <span>Next: {course.nextLesson}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" asChild>
                      <Link
                        href={`/dashboard/courses/${course.id}`}
                        className="text-white hover:text-black"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Continue Learning
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/dashboard/courses/${course.id}/progress`}>
                        <Target className="w-4 h-4 mr-2" />
                        View Progress
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEnrolledCourses.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No courses found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search or filters
                </p>
                <Button asChild>
                  <Link href="/training/catalog">
                    <Plus className="w-4 h-4 mr-2" />
                    Browse Courses
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recommended" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {recommendedCourses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video relative">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-100 text-green-800">
                      {course.status}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-[#011F72] mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      {course.level}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" asChild>
                      <Link href={`/training/catalog?course=${course.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Course
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link
                        href={`/training/catalog?course=${course.id}&enroll=true`}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Enroll
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
