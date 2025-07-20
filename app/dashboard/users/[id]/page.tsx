"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
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
  Globe,
  Linkedin,
  Star,
  Users2,
  Target,
  FileText,
  Building,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/types/users";

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      try {
        const accessToken = getTokenFromCookies();

        if (!accessToken) {
          setError("No access token found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await getApiRequest(
          `/api/users/admin/${params.id}`,
          accessToken
        );
        const data = response.data;

        if (!data.success) {
          throw new Error(data.message || "Failed to load user");
        }

        const userData = data.data.data || data.data; // Handle nested structure for admin
        const profile = userData.profile || {};

        // Map common fields
        const mappedUser: User = {
          id: userData._id,
          name: profile.fullName || userData.fullName,
          email: profile.email || userData.email,
          role: profile.role || userData.role,
          status: profile.status || "active",
          avatar:
            profile.avatarUrl ||
            userData.profileImageUrl ||
            "/assets/placeholder-avatar.jpg",
          location: "",
          phone: profile.phoneNumber || "",
          joinDate: userData.createdAt
            ? new Date(userData.createdAt).toLocaleDateString()
            : "",
          lastActive: userData.updatedAt
            ? new Date(userData.updatedAt).toLocaleDateString()
            : "",
          coursesEnrolled: 0,
          coursesCompleted: 0,
          certifications: profile.certifications?.length || 0,
          isVerified: userData.isVerified,
          onboardingStatus: userData.onboardingStatus,
          bio: profile.bio || profile.experienceDetails || "",
          skills: [],
          education: [],
          experience: [],
          activityHistory: [],
        };

        // Role-specific mapping
        switch (userData.role) {
          case "individualTechProfessional":
            mappedUser.location = profile.currentLocation || "";
            mappedUser.currentJobTitle = profile.currentJobTitle;
            mappedUser.employmentStatus = profile.employmentStatus;
            mappedUser.industryFocus = profile.industryFocus;
            mappedUser.yearsOfExperience = profile.yearsOfExperience;
            mappedUser.programmingLanguages = profile.programmingLanguages;
            mappedUser.softSkills = profile.softSkills;
            mappedUser.skills = [
              ...(profile.programmingLanguages || []),
              ...(profile.frameworksAndTools || []),
              ...(profile.softSkills || []),
            ];
            mappedUser.education = [
              `${profile.highestQualification} in ${profile.fieldOfStudy}`,
              `Graduated: ${profile.graduationYear}`,
            ];
            mappedUser.experience = [
              `${profile.currentJobTitle} at ${profile.industryFocus}`,
              `${profile.yearsOfExperience} years of experience`,
            ];
            break;

          case "instructor":
            mappedUser.location = "";
            mappedUser.title = profile.title;
            mappedUser.specializationAreas = profile.specializationAreas;
            mappedUser.yearsOfExperience = profile.experience;
            mappedUser.experienceDetails = profile.experienceDetails;
            mappedUser.linkedIn = profile.linkedIn;
            mappedUser.totalStudents = profile.totalStudents;
            mappedUser.rating = profile.rating;
            mappedUser.skills = [
              ...(profile.specializationAreas || []),
              ...(profile.certifications || []),
            ];
            mappedUser.experience = [
              `${profile.title} with ${mappedUser.yearsOfExperience} years experience`,
              profile.experienceDetails,
            ];
            break;

          case "admin":
            mappedUser.location = profile.assignedRegions?.[0] || "";
            mappedUser.department = profile.departments?.[0] || "";
            mappedUser.skills = profile.permissions || [];
            mappedUser.experience = [
              `Role: ${profile.role}`,
              `Department: ${profile.departments?.join(", ")}`,
            ];
            break;

          case "teamTechProfessional":
            mappedUser.location = profile.location
              ? `${profile.location.city}, ${profile.location.state}, ${profile.location.country}`
              : "";
            mappedUser.teamName = profile.teamName;
            mappedUser.teamSize = profile.teamSize;
            mappedUser.companyInfo = profile.company;
            mappedUser.members = profile.members;
            mappedUser.skills = [
              ...(profile.preferredTechStack || []),
              ...(profile.programmingLanguages || []),
            ];
            mappedUser.experience = [
              `Team Lead: ${profile.teamName}`,
              `Team Size: ${profile.teamSize} members`,
              `Company: ${profile.company?.name}`,
            ];
            break;

          case "recruiter":
            mappedUser.location = "";
            mappedUser.skills = [];
            mappedUser.experience = [];
            break;

          case "student":
            mappedUser.location = profile.countryOfResidence || "";
            mappedUser.academicLevel = profile.academicLevel;
            mappedUser.currentInstitution = profile.currentInstitution;
            mappedUser.fieldOfStudy = profile.fieldOfStudy;
            mappedUser.graduationYear = profile.graduationYear;
            mappedUser.interestAreas = profile.interestAreas;
            mappedUser.skills = profile.interestAreas || [];
            mappedUser.education = [
              `${profile.academicLevel} at ${profile.currentInstitution}`,
              `Field: ${profile.fieldOfStudy}`,
              `Expected Graduation: ${profile.graduationYear}`,
            ];
            break;
        }

        setUser(mappedUser);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to load user");
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "student":
        return <GraduationCap className="w-4 h-4" />;
      case "individualTechProfessional":
        return <Briefcase className="w-4 h-4" />;
      case "instructor":
        return <UserIcon className="w-4 h-4" />;
      case "teamTechProfessional":
        return <Users2 className="w-4 h-4" />;
      case "recruiter":
        return <Target className="w-4 h-4" />;
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
      case "instructor":
        return "bg-purple-100 text-purple-800";
      case "teamTechProfessional":
        return "bg-indigo-100 text-indigo-800";
      case "recruiter":
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

  const getOnboardingStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "not_started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No user found.</div>;

  return (
    <div className="space-y-6">
      {/* Back to Users Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" className="rounded-[10px]" asChild>
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
                  {user.isVerified && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4" />
                      <span className="ml-1">Verified</span>
                    </Badge>
                  )}
                  {user.onboardingStatus && (
                    <Badge
                      className={getOnboardingStatusColor(
                        user.onboardingStatus
                      )}
                    >
                      <span className="capitalize">
                        {user.onboardingStatus.replace("_", " ")}
                      </span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#011F72] rounded-[10px]"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit User
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#011F72] rounded-[10px]"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#011F72] rounded-[10px]"
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
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {user.phone}
                        </span>
                      </div>
                    )}
                    {user.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {user.location}
                        </span>
                      </div>
                    )}
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

                  {/* Role-specific information */}
                  {user.role === "individualTechProfessional" && (
                    <>
                      {user.currentJobTitle && (
                        <div>
                          <h4 className="font-semibold text-[#011F72] mb-2">
                            Current Position
                          </h4>
                          <p className="text-sm text-gray-600">
                            {user.currentJobTitle}
                          </p>
                        </div>
                      )}
                      {user.employmentStatus && (
                        <div>
                          <h4 className="font-semibold text-[#011F72] mb-2">
                            Employment Status
                          </h4>
                          <p className="text-sm text-gray-600">
                            {user.employmentStatus}
                          </p>
                        </div>
                      )}
                      {user.industryFocus && (
                        <div>
                          <h4 className="font-semibold text-[#011F72] mb-2">
                            Industry Focus
                          </h4>
                          <p className="text-sm text-gray-600">
                            {user.industryFocus}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {user.role === "instructor" && (
                    <>
                      {user.title && (
                        <div>
                          <h4 className="font-semibold text-[#011F72] mb-2">
                            Title
                          </h4>
                          <p className="text-sm text-gray-600">{user.title}</p>
                        </div>
                      )}
                      {user.yearsOfExperience && (
                        <div>
                          <h4 className="font-semibold text-[#011F72] mb-2">
                            Years of Experience
                          </h4>
                          <p className="text-sm text-gray-600">
                            {user.yearsOfExperience} years
                          </p>
                        </div>
                      )}
                      {user.linkedIn && (
                        <div>
                          <h4 className="font-semibold text-[#011F72] mb-2">
                            LinkedIn
                          </h4>
                          <a
                            href={user.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Linkedin className="w-4 h-4" />
                            View Profile
                          </a>
                        </div>
                      )}
                    </>
                  )}

                  {user.role === "teamTechProfessional" && (
                    <>
                      {user.teamName && (
                        <div>
                          <h4 className="font-semibold text-[#011F72] mb-2">
                            Team Name
                          </h4>
                          <p className="text-sm text-gray-600">
                            {user.teamName}
                          </p>
                        </div>
                      )}
                      {user.teamSize && (
                        <div>
                          <h4 className="font-semibold text-[#011F72] mb-2">
                            Team Size
                          </h4>
                          <p className="text-sm text-gray-600">
                            {user.teamSize} members
                          </p>
                        </div>
                      )}
                      {user.companyInfo && (
                        <div>
                          <h4 className="font-semibold text-[#011F72] mb-2">
                            Company
                          </h4>
                          <p className="text-sm text-gray-600">
                            {user.companyInfo.name}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {user.role === "student" && (
                    <>
                      {user.academicLevel && (
                        <div>
                          <h4 className="font-semibold text-[#011F72] mb-2">
                            Academic Level
                          </h4>
                          <p className="text-sm text-gray-600">
                            {user.academicLevel}
                          </p>
                        </div>
                      )}
                      {user.currentInstitution && (
                        <div>
                          <h4 className="font-semibold text-[#011F72] mb-2">
                            Institution
                          </h4>
                          <p className="text-sm text-gray-600">
                            {user.currentInstitution}
                          </p>
                        </div>
                      )}
                      {user.fieldOfStudy && (
                        <div>
                          <h4 className="font-semibold text-[#011F72] mb-2">
                            Field of Study
                          </h4>
                          <p className="text-sm text-gray-600">
                            {user.fieldOfStudy}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              {user.skills && user.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
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

              {/* Team Members (for teamTechProfessional) */}
              {user.role === "teamTechProfessional" &&
                user.members &&
                user.members.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Team Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {user.members.map((member, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <Users2 className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {member.role} - {member.status}
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs rounded-[10px]"
                            >
                              {member.status}
                            </Badge>
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
                    {user.activityHistory && user.activityHistory.length > 0 ? (
                      user.activityHistory.map((activity) => (
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
                      ))
                    ) : (
                      <p className="text-gray-600 text-center py-8">
                        No activity history available
                      </p>
                    )}
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
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-[10px]"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Activate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-[10px]"
                      >
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
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-[10px]"
                    >
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
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-[10px]"
                    >
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
              <Button
                className="w-full justify-start rounded-[10px]"
                variant="outline"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button
                className="w-full justify-start rounded-[10px]"
                variant="outline"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                className="w-full justify-start rounded-[10px]"
                variant="outline"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Courses
              </Button>
              <Button
                className="w-full justify-start rounded-[10px]"
                variant="outline"
              >
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
              {user.isVerified !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verification</span>
                  <Badge
                    className={
                      user.isVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {user.isVerified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
              )}
              {user.onboardingStatus && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Onboarding</span>
                  <Badge
                    className={getOnboardingStatusColor(user.onboardingStatus)}
                  >
                    <span className="capitalize">
                      {user.onboardingStatus.replace("_", " ")}
                    </span>
                  </Badge>
                </div>
              )}
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
                className="w-full justify-start rounded-[10px]"
                variant="outline"
                size="sm"
              >
                <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                Suspend Account
              </Button>
              <Button
                className="w-full justify-start rounded-[10px]"
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
