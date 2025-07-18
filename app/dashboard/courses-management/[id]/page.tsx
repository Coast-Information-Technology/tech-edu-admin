"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Eye,
  Edit,
  MoreHorizontal,
  MapPin,
  Calendar,
  Building2,
  Users,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  Ban,
  Star,
  Target,
  DollarSign,
  Briefcase,
  Mail,
  Phone,
  Globe,
  Download,
  Share2,
  Copy,
  Trash2,
  Archive,
  AlertCircle,
  CheckSquare,
  XSquare,
  Save,
  X,
  Plus,
  BookOpen,
  Award,
  BarChart3,
  GraduationCap,
  Play,
  Pause,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    avatar: string;
    email: string;
    phone: string;
  };
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  status: "active" | "inactive" | "draft" | "archived";
  price: {
    amount: number;
    currency: string;
    isFree: boolean;
  };
  enrollment: {
    total: number;
    active: number;
    completed: number;
  };
  rating: {
    average: number;
    count: number;
  };
  duration: string;
  lessons: number;
  modules: number;
  lastUpdated: string;
  createdDate: string;
  isFeatured: boolean;
  isPopular: boolean;
  certificate: boolean;
  language: string;
  thumbnail: string;
  requirements: string[];
  outcomes: string[];
  tags: string[];
}

interface Enrollment {
  id: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  enrolledDate: string;
  progress: number;
  status: "active" | "completed" | "dropped";
  lastAccessed: string;
  completionDate?: string;
}

const mockCourse: Course = {
  id: "1",
  title: "Complete Web Development Bootcamp",
  description:
    "Learn web development from scratch with this comprehensive bootcamp covering HTML, CSS, JavaScript, React, Node.js, and more.",
  instructor: {
    name: "Dr. Sarah Johnson",
    avatar: "/assets/placeholder-avatar.jpg",
    email: "sarah.johnson@techedu.com",
    phone: "+44 20 7123 4567",
  },
  category: "Web Development",
  level: "beginner",
  status: "active",
  price: { amount: 89, currency: "GBP", isFree: false },
  enrollment: { total: 1247, active: 892, completed: 234 },
  rating: { average: 4.8, count: 156 },
  duration: "45 hours",
  lessons: 156,
  modules: 12,
  lastUpdated: "2024-01-15",
  createdDate: "2023-06-10",
  isFeatured: true,
  isPopular: true,
  certificate: true,
  language: "English",
  thumbnail: "/assets/courses.webp",
  requirements: [
    "Basic computer skills",
    "No prior programming experience required",
    "A computer with internet connection",
    "Willingness to learn and practice",
  ],
  outcomes: [
    "Build responsive websites from scratch",
    "Master HTML, CSS, and JavaScript",
    "Create dynamic web applications with React",
    "Develop backend APIs with Node.js",
    "Deploy applications to the web",
    "Understand modern web development practices",
  ],
  tags: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Web Development"],
};

const mockEnrollments: Enrollment[] = [
  {
    id: "1",
    studentName: "John Smith",
    studentEmail: "john.smith@email.com",
    studentAvatar: "/assets/placeholder-avatar.jpg",
    enrolledDate: "2024-01-10",
    progress: 85,
    status: "active",
    lastAccessed: "2024-01-20",
  },
  {
    id: "2",
    studentName: "Emma Wilson",
    studentEmail: "emma.wilson@email.com",
    studentAvatar: "/assets/placeholder-avatar.jpg",
    enrolledDate: "2024-01-05",
    progress: 100,
    status: "completed",
    lastAccessed: "2024-01-18",
    completionDate: "2024-01-18",
  },
  {
    id: "3",
    studentName: "David Brown",
    studentEmail: "david.brown@email.com",
    studentAvatar: "/assets/placeholder-avatar.jpg",
    enrolledDate: "2023-12-20",
    progress: 45,
    status: "active",
    lastAccessed: "2024-01-15",
  },
  {
    id: "4",
    studentName: "Lisa Johnson",
    studentEmail: "lisa.johnson@email.com",
    studentAvatar: "/assets/placeholder-avatar.jpg",
    enrolledDate: "2023-11-15",
    progress: 0,
    status: "dropped",
    lastAccessed: "2023-12-01",
  },
];

export default function AdminCourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [course, setCourse] = useState<Course>(mockCourse);
  const [enrollments] = useState<Enrollment[]>(mockEnrollments);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Course>(mockCourse);
  const [newRequirement, setNewRequirement] = useState("");
  const [newOutcome, setNewOutcome] = useState("");
  const [newTag, setNewTag] = useState("");

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "draft":
        return "bg-blue-100 text-blue-800";
      case "archived":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEnrollmentStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "dropped":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price: {
    amount: number;
    currency: string;
    isFree: boolean;
  }) => {
    return price.isFree ? "Free" : `${price.currency}${price.amount}`;
  };

  const handleEdit = () => {
    setEditData(course);
    setIsEditing(true);
  };

  const handleSave = () => {
    setCourse(editData);
    setIsEditing(false);
    console.log("Saving course changes:", editData);
  };

  const handleCancel = () => {
    setEditData(course);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof Course, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (
    field: "amount" | "currency" | "isFree",
    value: any
  ) => {
    setEditData((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        [field]: field === "amount" ? Number(value) : value,
      },
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setEditData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setEditData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const addOutcome = () => {
    if (newOutcome.trim()) {
      setEditData((prev) => ({
        ...prev,
        outcomes: [...prev.outcomes, newOutcome.trim()],
      }));
      setNewOutcome("");
    }
  };

  const removeOutcome = (index: number) => {
    setEditData((prev) => ({
      ...prev,
      outcomes: prev.outcomes.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setEditData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setEditData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const stats = {
    completionRate: Math.round(
      (enrollments.filter((e) => e.status === "completed").length /
        enrollments.length) *
        100
    ),
    avgProgress: Math.round(
      enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
    ),
    activeStudents: enrollments.filter((e) => e.status === "active").length,
    droppedStudents: enrollments.filter((e) => e.status === "dropped").length,
  };

  const currentData = isEditing ? editData : course;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/courses-management">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#011F72]">
              {currentData.title}
            </h1>
            <p className="text-gray-600 mt-1">
              {currentData.category} • {currentData.instructor.name}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                className="text-white hover:text-black"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Course
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Course Overview Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-6">
                <Image
                  src={currentData.thumbnail}
                  alt={currentData.title}
                  width={120}
                  height={80}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Course Title</Label>
                        <Input
                          id="title"
                          value={currentData.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={currentData.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-[#011F72] mb-2">
                        {currentData.title}
                      </h2>
                      <p className="text-gray-600 mb-3">
                        {currentData.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getLevelColor(currentData.level)}>
                          {currentData.level}
                        </Badge>
                        <Badge className={getStatusColor(currentData.status)}>
                          {currentData.status}
                        </Badge>
                        {currentData.isFeatured && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {currentData.isPopular && (
                          <Badge className="bg-orange-100 text-orange-800">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                        {currentData.certificate && (
                          <Badge className="bg-purple-100 text-purple-800">
                            <Award className="w-3 h-3 mr-1" />
                            Certificate
                          </Badge>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={currentData.category}
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-[10px]">
                          <SelectItem value="Web Development">
                            Web Development
                          </SelectItem>
                          <SelectItem value="Data Science">
                            Data Science
                          </SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Mobile Development">
                            Mobile Development
                          </SelectItem>
                          <SelectItem value="DevOps">DevOps</SelectItem>
                          <SelectItem value="Cybersecurity">
                            Cybersecurity
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <Select
                        value={currentData.level}
                        onValueChange={(value) =>
                          handleInputChange("level", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-[10px]">
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={currentData.status}
                        onValueChange={(value) =>
                          handleInputChange("status", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-[10px]">
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={currentData.language}
                        onValueChange={(value) =>
                          handleInputChange("language", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-[10px]">
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {currentData.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatPrice(currentData.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {currentData.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Updated {currentData.lastUpdated}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentData.enrollment.total}
                  </div>
                  <div className="text-sm text-gray-600">Total Enrollments</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {currentData.enrollment.active}
                  </div>
                  <div className="text-sm text-gray-600">Active Students</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {currentData.enrollment.completed}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </div>

            <div className="lg:w-80">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Instructor Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="instructorName">Instructor Name</Label>
                        <Input
                          id="instructorName"
                          value={currentData.instructor.name}
                          onChange={(e) =>
                            handleInputChange("instructor", {
                              ...currentData.instructor,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instructorEmail">Email</Label>
                        <Input
                          id="instructorEmail"
                          type="email"
                          value={currentData.instructor.email}
                          onChange={(e) =>
                            handleInputChange("instructor", {
                              ...currentData.instructor,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instructorPhone">Phone</Label>
                        <Input
                          id="instructorPhone"
                          value={currentData.instructor.phone}
                          onChange={(e) =>
                            handleInputChange("instructor", {
                              ...currentData.instructor,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Image
                          src={currentData.instructor.avatar}
                          alt={currentData.instructor.name}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">
                            {currentData.instructor.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {currentData.instructor.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {currentData.instructor.phone}
                        </span>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="text-sm text-gray-600">
                    <div>Created: {currentData.createdDate}</div>
                    <div>Modules: {currentData.modules}</div>
                    <div>Lessons: {currentData.lessons}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="enrollments">
            Enrollments ({enrollments.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {currentData.requirements.map((req, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          <span className="flex-1">{req}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRequirement(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a requirement"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && addRequirement()
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addRequirement}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {currentData.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {currentData.outcomes.map((outcome, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="flex-1">{outcome}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOutcome(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add an outcome"
                        value={newOutcome}
                        onChange={(e) => setNewOutcome(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addOutcome()}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addOutcome}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {currentData.outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Tags</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                      {currentData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="gap-1"
                        >
                          {tag}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => removeTag(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addTag()}
                      />
                      <Button type="button" variant="outline" onClick={addTag}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {currentData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-semibold">
                      {stats.completionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Progress</span>
                    <span className="font-semibold">{stats.avgProgress}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Students</span>
                    <span className="font-semibold">
                      {stats.activeStudents}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dropped Students</span>
                    <span className="font-semibold">
                      {stats.droppedStudents}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="enrollments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={enrollment.studentAvatar}
                        alt={enrollment.studentName}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-[#011F72]">
                          {enrollment.studentName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {enrollment.studentEmail}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">
                            Enrolled {enrollment.enrolledDate}
                          </span>
                          <span className="text-xs text-gray-500">
                            Last accessed {enrollment.lastAccessed}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold text-blue-600">
                          {enrollment.progress}% progress
                        </div>
                        <Badge
                          className={getEnrollmentStatusColor(
                            enrollment.status
                          )}
                        >
                          {enrollment.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Enrollment Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>This Week</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Week</span>
                    <span className="font-semibold">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month</span>
                    <span className="font-semibold">45</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Engagement Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Avg. Time Spent</span>
                    <span className="font-semibold">2.3 hours/week</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion Rate</span>
                    <span className="font-semibold">18.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Drop-off Rate</span>
                    <span className="font-semibold">12.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Course Rating</span>
                    <span className="font-semibold">
                      {currentData.rating.average}/5
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Reviews</span>
                    <span className="font-semibold">
                      {currentData.rating.count}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Generated</span>
                    <span className="font-semibold">
                      £
                      {currentData.price.isFree
                        ? 0
                        : (
                            currentData.price.amount *
                            currentData.enrollment.total
                          ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Content Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Total Modules</span>
                  <span className="font-semibold">{currentData.modules}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Lessons</span>
                  <span className="font-semibold">{currentData.lessons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Course Duration</span>
                  <span className="font-semibold">{currentData.duration}</span>
                </div>
                <Separator />
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Module
                  </Button>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Content
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Content
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <div className="flex gap-2">
                        <Input
                          id="price"
                          type="number"
                          placeholder="0"
                          value={currentData.price.amount}
                          onChange={(e) =>
                            handlePriceChange("amount", e.target.value)
                          }
                          disabled={currentData.price.isFree}
                        />
                        <Select
                          value={currentData.price.currency}
                          onValueChange={(value) =>
                            handlePriceChange("currency", value)
                          }
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white rounded-[10px]">
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isFree"
                          checked={currentData.price.isFree}
                          onCheckedChange={(checked) =>
                            handlePriceChange("isFree", checked)
                          }
                        />
                        <Label htmlFor="isFree">Free Course</Label>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={currentData.isFeatured}
                        onCheckedChange={(checked) =>
                          handleInputChange("isFeatured", checked)
                        }
                      />
                      <Label htmlFor="featured">Featured Course</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="certificate"
                        checked={currentData.certificate}
                        onCheckedChange={(checked) =>
                          handleInputChange("certificate", checked)
                        }
                      />
                      <Label htmlFor="certificate">Certificate Available</Label>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span>Course Status</span>
                      <Badge className={getStatusColor(currentData.status)}>
                        {currentData.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Featured Course</span>
                      <Badge
                        className={
                          currentData.isFeatured
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {currentData.isFeatured ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Certificate</span>
                      <Badge
                        className={
                          currentData.certificate
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {currentData.certificate
                          ? "Available"
                          : "Not Available"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Price</span>
                      <span className="font-semibold">
                        {formatPrice(currentData.price)}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate Course
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive Course
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Course
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
