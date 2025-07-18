"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Search,
  Filter,
  BookOpen,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Eye,
  Calendar,
  Clock,
  GraduationCap,
  Target,
  BarChart3,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

// Mock data for courses
const mockCourses = [
  {
    id: "1",
    slug: "computer-science-101",
    title: "Introduction to Computer Science",
    code: "CS101",
    instructor: "Dr. Sarah Johnson",
    department: "Computer Science",
    credits: 15,
    duration: "12 weeks",
    status: "active",
    enrollment: {
      current: 45,
      max: 50,
      waitlist: 5,
    },
    semester: "Spring 2024",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    description: "Fundamental concepts of computer science and programming.",
    prerequisites: ["None"],
    schedule: "Mon, Wed, Fri 10:00-11:30",
    location: "Room 201, Science Building",
    gradeDistribution: {
      A: 25,
      B: 35,
      C: 25,
      D: 10,
      F: 5,
    },
  },
  {
    id: "2",
    slug: "data-science-advanced",
    title: "Advanced Data Science",
    code: "DS301",
    instructor: "Prof. Michael Brown",
    department: "Data Science",
    credits: 20,
    duration: "15 weeks",
    status: "active",
    enrollment: {
      current: 28,
      max: 30,
      waitlist: 0,
    },
    semester: "Spring 2024",
    startDate: "2024-01-15",
    endDate: "2024-05-01",
    description: "Advanced techniques in data analysis and machine learning.",
    prerequisites: ["CS101", "Statistics 101"],
    schedule: "Tue, Thu 14:00-16:00",
    location: "Room 305, Engineering Building",
    gradeDistribution: {
      A: 30,
      B: 40,
      C: 20,
      D: 8,
      F: 2,
    },
  },
  {
    id: "3",
    slug: "business-management",
    title: "Business Management Principles",
    code: "BM201",
    instructor: "Dr. Emily Davis",
    department: "Business",
    credits: 15,
    duration: "12 weeks",
    status: "active",
    enrollment: {
      current: 35,
      max: 40,
      waitlist: 2,
    },
    semester: "Spring 2024",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    description: "Core principles of business management and leadership.",
    prerequisites: ["Business 101"],
    schedule: "Mon, Wed 13:00-14:30",
    location: "Room 102, Business Building",
    gradeDistribution: {
      A: 20,
      B: 45,
      C: 25,
      D: 8,
      F: 2,
    },
  },
  {
    id: "4",
    slug: "engineering-design",
    title: "Engineering Design Project",
    code: "ENG401",
    instructor: "Prof. Robert Wilson",
    department: "Engineering",
    credits: 25,
    duration: "16 weeks",
    status: "active",
    enrollment: {
      current: 18,
      max: 25,
      waitlist: 0,
    },
    semester: "Spring 2024",
    startDate: "2024-01-15",
    endDate: "2024-05-15",
    description: "Capstone engineering design project with industry partners.",
    prerequisites: ["ENG301", "ENG302"],
    schedule: "Fri 09:00-12:00",
    location: "Engineering Lab A",
    gradeDistribution: {
      A: 35,
      B: 40,
      C: 20,
      D: 3,
      F: 2,
    },
  },
  {
    id: "5",
    slug: "psychology-research",
    title: "Research Methods in Psychology",
    code: "PSY301",
    instructor: "Dr. Lisa Thompson",
    department: "Psychology",
    credits: 15,
    duration: "12 weeks",
    status: "active",
    enrollment: {
      current: 22,
      max: 25,
      waitlist: 0,
    },
    semester: "Spring 2024",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    description:
      "Research methodologies and statistical analysis in psychology.",
    prerequisites: ["PSY101", "Statistics 101"],
    schedule: "Tue, Thu 10:00-11:30",
    location: "Room 405, Psychology Building",
    gradeDistribution: {
      A: 25,
      B: 35,
      C: 30,
      D: 8,
      F: 2,
    },
  },
  {
    id: "6",
    slug: "mathematics-calculus",
    title: "Calculus III",
    code: "MATH301",
    instructor: "Prof. James Anderson",
    department: "Mathematics",
    credits: 15,
    duration: "12 weeks",
    status: "active",
    enrollment: {
      current: 30,
      max: 35,
      waitlist: 1,
    },
    semester: "Spring 2024",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    description:
      "Advanced calculus including multivariable calculus and vector analysis.",
    prerequisites: ["MATH201", "MATH202"],
    schedule: "Mon, Wed, Fri 13:00-14:00",
    location: "Room 301, Mathematics Building",
    gradeDistribution: {
      A: 20,
      B: 30,
      C: 35,
      D: 12,
      F: 3,
    },
  },
];

export default function CoursesManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const department = searchParams.get("department") || "";
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const [page, setPage] = useState(pageParam);
  const itemsPerPage = 6;
  const [courses, setCourses] = useState(mockCourses);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  }, [page]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setDeleteCourseId(null);
  };

  const filteredData = courses.filter((course) => {
    const matchesDepartment = department
      ? course.department === department
      : true;
    const matchesSearch = search
      ? course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.code.toLowerCase().includes(search.toLowerCase()) ||
        course.instructor.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesStatus = status ? course.status === status : true;

    return matchesDepartment && matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const uniqueDepartments = [
    ...new Set(mockCourses.map((course) => course.department)),
  ];
  const uniqueStatuses = [
    ...new Set(mockCourses.map((course) => course.status)),
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEnrollmentColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  const stats = {
    total: mockCourses.length,
    active: mockCourses.filter((c) => c.status === "active").length,
    totalEnrollment: mockCourses.reduce(
      (acc, c) => acc + c.enrollment.current,
      0
    ),
    averageEnrollment: Math.round(
      mockCourses.reduce((acc, c) => acc + c.enrollment.current, 0) /
        mockCourses.length
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">
            Courses Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage courses, assignments, and track student enrollments
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-[10px]">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Link href="/dashboard/courses-management/create">
            <Button className="text-white hover:text-black rounded-[10px]">
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-[10px]">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.active}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Enrollments</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.totalEnrollment}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-[10px]">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Enrollment</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.averageEnrollment}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#011F72]" />
            <h2 className="text-lg font-semibold text-[#011F72]">
              Search & Filters
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search courses, instructors..."
                value={search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 rounded-[10px]"
              />
            </div>

            <select
              className="px-4 py-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#011F72]"
              value={department}
              onChange={(e) => handleFilterChange("department", e.target.value)}
            >
              <option value="">All Departments</option>
              {uniqueDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#011F72]"
              value={status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">All Status</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            <Button
              onClick={() => {
                router.push("?");
                setPage(1);
              }}
              variant="outline"
              className="border-[#011F72] text-[#011F72] hover:bg-[#011F72] hover:text-white rounded-[10px]"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {currentData.length} of {filteredData.length} courses
          {search && ` for "${search}"`}
          {department && ` in ${department}`}
          {status && ` with status ${status}`}
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {currentData.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#011F72] text-lg mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{course.code}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.department}</span>
                  </div>
                </div>
                <Badge className={getStatusColor(course.status)}>
                  {course.status}
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Enrollment:</span>
                  <span
                    className={`font-semibold ${getEnrollmentColor(
                      course.enrollment.current,
                      course.enrollment.max
                    )}`}
                  >
                    {course.enrollment.current}/{course.enrollment.max}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Credits:</span>
                  <span className="font-semibold">{course.credits}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Schedule:</span>
                  <span className="font-semibold text-xs">
                    {course.schedule}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/dashboard/courses-management/${course.slug}`}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-[10px]"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="rounded-[10px]">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-[10px]"
                  onClick={() => setDeleteCourseId(course.id)}
                  aria-label="Delete course"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={`cursor-pointer ${
                    page === 1 ? "pointer-events-none opacity-50" : ""
                  }`}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 7) return true;
                  return (
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1)
                  );
                })
                .map((p, index, array) => (
                  <div key={p}>
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setPage(p)}
                        isActive={page === p}
                        className={`cursor-pointer ${
                          page === p
                            ? "text-[#011F72] border-[#011F72] rounded-[10px]"
                            : ""
                        }`}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  </div>
                ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={`cursor-pointer ${
                    page >= totalPages ? "pointer-events-none opacity-50" : ""
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteCourseId}
        onOpenChange={() => setDeleteCourseId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this course? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => handleDeleteCourse(deleteCourseId!)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
