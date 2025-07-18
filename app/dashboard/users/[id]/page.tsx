"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Users,
  Edit,
  MoreHorizontal,
  CheckCircle,
  Clock,
  Ban,
  GraduationCap,
  Building2,
  Briefcase,
  BookOpen,
  Award,
  Activity,
  TrendingUp,
  Eye,
  Download,
  MessageSquare,
  Settings,
  AlertTriangle,
  UserCheck,
  UserX,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role:
    | "student"
    | "individualTechProfessional"
    | "company"
    | "institution"
    | "admin";
  status: "active" | "inactive" | "pending" | "suspended";
  avatar: string;
  location: string;
  phone: string;
  joinDate: string;
  lastActive: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  certifications: number;
  department?: string;
  company?: string;
  institution?: string;
  bio?: string;
  skills?: string[];
  education?: string[];
  experience?: string[];
  activityHistory?: Array<{
    id: string;
    action: string;
    timestamp: string;
    details: string;
  }>;
}

const mockUser: User = {
  id: "1",
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  role: "student",
  status: "active",
  avatar: "/assets/placeholder-avatar.jpg",
  location: "Lagos, Nigeria",
  phone: "+234 801 234 5678",
  joinDate: "2024-01-15",
  lastActive: "2024-01-20",
  coursesEnrolled: 5,
  coursesCompleted: 3,
  certifications: 2,
  bio: "Passionate student pursuing a career in technology and data science. Currently enrolled in multiple courses to enhance my skills and knowledge.",
  skills: [
    "JavaScript",
    "Python",
    "Data Analysis",
    "Project Management",
    "Communication",
  ],
  education: ["BSc Computer Science - University of Lagos (2020-2024)"],
  experience: ["Intern - TechCorp Solutions (2023)"],
  activityHistory: [
    {
      id: "1",
      action: "Course Completed",
      timestamp: "2024-01-20 14:30",
      details: "Completed 'Strategic Thinking for Teams' course",
    },
    {
      id: "2",
      action: "Course Enrolled",
      timestamp: "2024-01-18 09:15",
      details: "Enrolled in 'Excel & Dashboards Essentials'",
    },
    {
      id: "3",
      action: "Profile Updated",
      timestamp: "2024-01-15 16:45",
      details: "Updated profile information",
    },
    {
      id: "4",
      action: "Account Created",
      timestamp: "2024-01-15 10:00",
      details: "User account created",
    },
  ],
};

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User>(mockUser);
  const [selectedTab, setSelectedTab] = useState("overview");

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "student":
        return <GraduationCap className="w-4 h-4" />;
      case "individualTechProfessional":
        return <Briefcase className="w-4 h-4" />;
      case "company":
        return <Building2 className="w-4 h-4" />;
      case "institution":
        return <Building2 className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-800";
      case "individualTechProfessional":
        return "bg-green-100 text-green-800";
      case "company":
        return "bg-purple-100 text-purple-800";
      case "institution":
        return "bg-orange-100 text-orange-800";
      case "admin":
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
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "inactive":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "suspended":
        return <Ban className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Back to Users Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/users">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Link>
        </Button>
      </div>

      {/* User Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#011F72] to-blue-600 p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover border-4 border-white"
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${
                    user.status === "active"
                      ? "bg-green-500"
                      : user.status === "pending"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
                >
                  {getStatusIcon(user.status)}
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-blue-100">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge className={getRoleColor(user.role)}>
                    {getRoleIcon(user.role)}
                    <span className="ml-1 capitalize">{user.role}</span>
                  </Badge>
                  <Badge className={getStatusColor(user.status)}>
                    {getStatusIcon(user.status)}
                    <span className="ml-1 capitalize">{user.status}</span>
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#011F72]"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit User
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#011F72]"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#011F72]"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
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
                <p className="text-sm text-gray-600">Courses Enrolled</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {user.coursesEnrolled}
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
                <p className="text-sm text-gray-600">Courses Completed</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {user.coursesCompleted}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Certifications</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {user.certifications}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-[10px]">
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Active</p>
                <p className="text-lg font-bold text-[#011F72]">
                  {user.lastActive}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Details */}
        <div className="lg:col-span-2">
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {user.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {user.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {user.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Joined {user.joinDate}
                      </span>
                    </div>
                  </div>

                  {user.bio && (
                    <div>
                      <h4 className="font-semibold text-[#011F72] mb-2">Bio</h4>
                      <p className="text-sm text-gray-600">{user.bio}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              {user.skills && user.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {user.education && user.education.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {user.education.map((edu, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{edu}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Experience */}
              {user.experience && user.experience.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {user.experience.map((exp, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{exp}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.activityHistory?.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-[10px]"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        <div className="flex-1">
                          <p className="font-medium text-[#011F72]">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.details}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enrolled Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Course management interface would go here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Account Status</p>
                      <p className="text-sm text-gray-600">
                        Manage user account status
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <UserCheck className="w-4 h-4 mr-2" />
                        Activate
                      </Button>
                      <Button size="sm" variant="outline">
                        <UserX className="w-4 h-4 mr-2" />
                        Suspend
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Role Management</p>
                      <p className="text-sm text-gray-600">
                        Change user role and permissions
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Change Role
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Export</p>
                      <p className="text-sm text-gray-600">
                        Export user data and activity
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View Courses
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className={getStatusColor(user.status)}>
                  {getStatusIcon(user.status)}
                  <span className="ml-1 capitalize">{user.status}</span>
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Role</span>
                <Badge className={getRoleColor(user.role)}>
                  {getRoleIcon(user.role)}
                  <span className="ml-1 capitalize">{user.role}</span>
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm font-medium">{user.joinDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Active</span>
                <span className="text-sm font-medium">{user.lastActive}</span>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full justify-start"
                variant="outline"
                size="sm"
              >
                <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                Suspend Account
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                size="sm"
              >
                <Ban className="w-4 h-4 mr-2 text-red-600" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
