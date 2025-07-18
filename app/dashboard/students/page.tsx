"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  MessageSquare,
  Calendar,
  Download,
  Users,
  GraduationCap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for students
const mockStudents = [
  {
    id: "1",
    slug: "john-doe",
    name: "John Doe",
    email: "john.doe@student.edu",
    course: "Computer Science",
    year: "3rd Year",
    gpa: "3.8",
    status: "active",
    enrollmentDate: "2022-09-01",
    lastActive: "2024-01-20",
    attendance: 92,
    progress: 75,
    avatar: "/assets/placeholder-avatar.jpg",
  },
  {
    id: "2",
    slug: "jane-smith",
    name: "Jane Smith",
    email: "jane.smith@student.edu",
    course: "Data Science",
    year: "2nd Year",
    gpa: "3.9",
    status: "active",
    enrollmentDate: "2023-09-01",
    lastActive: "2024-01-19",
    attendance: 88,
    progress: 60,
    avatar: "/assets/placeholder-avatar.jpg",
  },
  {
    id: "3",
    slug: "mike-johnson",
    name: "Mike Johnson",
    email: "mike.johnson@student.edu",
    course: "Software Engineering",
    year: "4th Year",
    gpa: "3.6",
    status: "active",
    enrollmentDate: "2021-09-01",
    lastActive: "2024-01-18",
    attendance: 95,
    progress: 90,
    avatar: "/assets/placeholder-avatar.jpg",
  },
  {
    id: "4",
    slug: "sarah-wilson",
    name: "Sarah Wilson",
    email: "sarah.wilson@student.edu",
    course: "Cybersecurity",
    year: "1st Year",
    gpa: "3.7",
    status: "active",
    enrollmentDate: "2024-09-01",
    lastActive: "2024-01-17",
    attendance: 85,
    progress: 45,
    avatar: "/assets/placeholder-avatar.jpg",
  },
  {
    id: "5",
    slug: "david-brown",
    name: "David Brown",
    email: "david.brown@student.edu",
    course: "Computer Science",
    year: "2nd Year",
    gpa: "3.4",
    status: "inactive",
    enrollmentDate: "2023-09-01",
    lastActive: "2023-12-15",
    attendance: 70,
    progress: 50,
    avatar: "/assets/placeholder-avatar.jpg",
  },
  {
    id: "6",
    slug: "emma-davis",
    name: "Emma Davis",
    email: "emma.davis@student.edu",
    course: "Data Science",
    year: "3rd Year",
    gpa: "3.9",
    status: "active",
    enrollmentDate: "2022-09-01",
    lastActive: "2024-01-20",
    attendance: 94,
    progress: 80,
    avatar: "/assets/placeholder-avatar.jpg",
  },
  {
    id: "7",
    slug: "alex-martinez",
    name: "Alex Martinez",
    email: "alex.martinez@student.edu",
    course: "Software Engineering",
    year: "1st Year",
    gpa: "3.5",
    status: "active",
    enrollmentDate: "2024-09-01",
    lastActive: "2024-01-16",
    attendance: 82,
    progress: 40,
    avatar: "/assets/placeholder-avatar.jpg",
  },
  {
    id: "8",
    slug: "lisa-garcia",
    name: "Lisa Garcia",
    email: "lisa.garcia@student.edu",
    course: "Cybersecurity",
    year: "4th Year",
    gpa: "3.8",
    status: "active",
    enrollmentDate: "2021-09-01",
    lastActive: "2024-01-19",
    attendance: 96,
    progress: 85,
    avatar: "/assets/placeholder-avatar.jpg",
  },
];

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter students based on search and filters
  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;
    const matchesCourse =
      courseFilter === "all" || student.course === courseFilter;
    const matchesYear = yearFilter === "all" || student.year === yearFilter;

    return matchesSearch && matchesStatus && matchesCourse && matchesYear;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1);
    switch (filterType) {
      case "search":
        setSearchTerm(value);
        break;
      case "status":
        setStatusFilter(value);
        break;
      case "course":
        setCourseFilter(value);
        break;
      case "year":
        setYearFilter(value);
        break;
    }
  };

  // Calculate stats
  const totalStudents = mockStudents.length;
  const activeStudents = mockStudents.filter(
    (s) => s.status === "active"
  ).length;
  const averageGPA = (
    mockStudents.reduce((sum, s) => sum + parseFloat(s.gpa), 0) / totalStudents
  ).toFixed(1);
  const averageAttendance = (
    mockStudents.reduce((sum, s) => sum + s.attendance, 0) / totalStudents
  ).toFixed(0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 60) return "text-blue-600";
    if (progress >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">Manage Students</h1>
          <p className="text-gray-600 mt-2">
            View and manage all enrolled students
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-[10px]">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button className="text-white hover:text-black rounded-[10px]">
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-[10px]">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {totalStudents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-[10px]">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {activeStudents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-[10px]">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average GPA</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {averageGPA}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-[10px]">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Attendance</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {averageAttendance}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search students by name, email, or course..."
                  value={searchTerm}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10 rounded-[10px]"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select
                value={statusFilter}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="w-40 rounded-[10px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-[10px] bg-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={courseFilter}
                onValueChange={(value) => handleFilterChange("course", value)}
              >
                <SelectTrigger className="w-48 rounded-[10px]">
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent className="rounded-[10px] bg-white">
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="Computer Science">
                    Computer Science
                  </SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Software Engineering">
                    Software Engineering
                  </SelectItem>
                  <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={yearFilter}
                onValueChange={(value) => handleFilterChange("year", value)}
              >
                <SelectTrigger className="w-32 rounded-[10px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="rounded-[10px] bg-white">
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="1st Year">1st Year</SelectItem>
                  <SelectItem value="2nd Year">2nd Year</SelectItem>
                  <SelectItem value="3rd Year">3rd Year</SelectItem>
                  <SelectItem value="4th Year">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Students ({filteredStudents.length})</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(parseInt(value));
                  setCurrentPage(1);
                }}
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
              <span className="text-sm text-gray-600">per page</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-gray-500">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>{student.year}</TableCell>
                    <TableCell>
                      <span className="font-medium">{student.gpa}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${
                          student.attendance >= 90
                            ? "text-green-600"
                            : student.attendance >= 80
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {student.attendance}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(
                              student.progress
                            ).replace("text-", "bg-")}`}
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span
                          className={`text-sm font-medium ${getProgressColor(
                            student.progress
                          )}`}
                        >
                          {student.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {student.lastActive}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white rounded-[10px]"
                        >
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href={`/dashboard/students/${student.slug}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Student
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Meeting
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No students found matching your criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={`cursor-pointer ${
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }`}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 7) return true;
                  return (
                    p === 1 ||
                    p === totalPages ||
                    (p >= currentPage - 1 && p <= currentPage + 1)
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
                        onClick={() => setCurrentPage(p)}
                        isActive={currentPage === p}
                        className={`cursor-pointer ${
                          currentPage === p
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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={`cursor-pointer ${
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
