"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Calendar,
  Clock,
  Star,
  Award,
  Globe,
  Edit3,
  Save,
  X,
  Plus,
  Camera,
  Linkedin,
  Users,
  BookOpen,
  TrendingUp,
  Trash2,
  CheckCircle,
  Shield,
  Sparkles,
} from "lucide-react";
import StarRating from "@/components/ui/star-rating";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";

interface WorkingHours {
  _id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface Availability {
  isActive: boolean;
  workingHours: WorkingHours[];
  bufferTimeMinutes: number;
  timezone: string;
  calendly: {
    _id: string;
    connectedAt: string;
    userId: string;
    userUri: string;
  };
  lastAvailabilityUpdate: string;
  _id: string;
}

interface UserProfile {
  _id: string;
  userId: string;
  fullName: string;
  title: string;
  specializationAreas: string[];
  certifications: string[];
  languagesSpoken: string[];
  rating: number;
  availability: Availability;
  assignedStudents: any[];
  assignedTechProfessionals: any[];
  totalStudents: number;
  totalSessions: number;
  averageSessionRating: number;
  experience: number;
  experienceDetails: string;
  linkedIn: string;
  courses: any[];
  trainingProgramsHandled: any[];
  reviews: any[];
  createdAt: string;
  updatedAt: string;
}

interface UserData {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  isVerified: boolean;
  onboardingStatus: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile;
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function InstructorProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});
  const [newSpecialization, setNewSpecialization] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newLanguage, setNewLanguage] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = getTokenFromCookies();
      const response = await getApiRequest("/api/users/me", token || undefined);
      if (response.status === 200) {
        setUserData(response.data.data.data);
        setEditData(response.data.data.data.profile);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditData(userData?.profile || {});
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData(userData?.profile || {});
  };

  const handleSave = async () => {
    try {
      // Here you would call the API to update the profile
      console.log("Saving profile data:", editData);
      setEditing(false);
      // Refresh the data
      await fetchUserProfile();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const addSpecialization = () => {
    if (newSpecialization.trim()) {
      setEditData((prev) => ({
        ...prev,
        specializationAreas: [
          ...(prev.specializationAreas || []),
          newSpecialization.trim(),
        ],
      }));
      setNewSpecialization("");
    }
  };

  const removeSpecialization = (index: number) => {
    setEditData((prev) => ({
      ...prev,
      specializationAreas:
        prev.specializationAreas?.filter((_, i) => i !== index) || [],
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setEditData((prev) => ({
        ...prev,
        certifications: [
          ...(prev.certifications || []),
          newCertification.trim(),
        ],
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (index: number) => {
    setEditData((prev) => ({
      ...prev,
      certifications: prev.certifications?.filter((_, i) => i !== index) || [],
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setEditData((prev) => ({
        ...prev,
        languagesSpoken: [...(prev.languagesSpoken || []), newLanguage.trim()],
      }));
      setNewLanguage("");
    }
  };

  const removeLanguage = (index: number) => {
    setEditData((prev) => ({
      ...prev,
      languagesSpoken:
        prev.languagesSpoken?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateWorkingHours = (
    dayIndex: number,
    field: keyof WorkingHours,
    value: any
  ) => {
    setEditData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability!,
        workingHours: prev.availability!.workingHours.map((day, index) =>
          index === dayIndex ? { ...day, [field]: value } : day
        ),
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Profile Not Found
          </h2>
          <p className="text-slate-600">
            Unable to load your profile information.
          </p>
        </div>
      </div>
    );
  }

  const profile = userData.profile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[10px]">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Profile
                </h1>
              </div>
              <p className="text-slate-600 text-sm sm:text-base">
                Manage your instructor profile and settings
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {editing ? (
                <>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="w-full sm:w-auto rounded-[12px] border-2 hover:bg-slate-50 transition-all duration-200"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="w-full sm:w-auto rounded-[12px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleEdit}
                  className="w-full sm:w-auto rounded-[12px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-2">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-transparent h-auto p-1">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="availability"
                className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Availability</span>
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Experience</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Basic Info Card */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[10px]">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 sm:w-28 sm:h-28 ring-4 ring-white shadow-xl">
                      <AvatarImage
                        src={userData.profileImageUrl}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                        {userData.fullName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {editing && (
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        {editing ? (
                          <Input
                            id="fullName"
                            value={editData.fullName || ""}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                fullName: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          <p className="text-lg font-medium text-slate-900">
                            {profile?.fullName || "Loading..."}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <p className="text-slate-600 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {userData.email}
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="title">Professional Title</Label>
                        {editing ? (
                          <Input
                            id="title"
                            value={editData.title || ""}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          <p className="text-slate-900">
                            {profile?.title || "No title set"}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Badge variant="secondary" className="capitalize">
                          {userData.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-blue-600">
                        {profile?.totalStudents || 0}
                      </p>
                      <p className="text-sm font-medium text-blue-700">
                        Total Students
                      </p>
                    </div>
                    <div className="p-3 bg-blue-500 rounded-[12px] shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs text-blue-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>Active learners</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-green-600">
                        {profile?.totalSessions || 0}
                      </p>
                      <p className="text-sm font-medium text-green-700">
                        Total Sessions
                      </p>
                    </div>
                    <div className="p-3 bg-green-500 rounded-[12px] shadow-lg">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs text-green-600">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>Completed sessions</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-yellow-600">
                        {(profile?.averageSessionRating || 0).toFixed(1)}
                      </p>
                      <p className="text-sm font-medium text-yellow-700">
                        Avg Rating
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-500 rounded-[12px] shadow-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs text-yellow-600">
                    <Sparkles className="w-3 h-3 mr-1" />
                    <span>Out of 5.0 stars</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-purple-600">
                        {profile?.experience || 0}
                      </p>
                      <p className="text-sm font-medium text-purple-700">
                        Years Experience
                      </p>
                    </div>
                    <div className="p-3 bg-purple-500 rounded-[12px] shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs text-purple-600">
                    <Award className="w-3 h-3 mr-1" />
                    <span>Professional experience</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Specializations and Certifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-[10px]">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    Specialization Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editing ? (
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Input
                          value={newSpecialization}
                          onChange={(e) => setNewSpecialization(e.target.value)}
                          placeholder="Add specialization area..."
                          onKeyPress={(e) =>
                            e.key === "Enter" && addSpecialization()
                          }
                          className="flex-1 border-2 border-slate-200 focus:border-orange-500 transition-colors duration-200"
                        />
                        <Button
                          onClick={addSpecialization}
                          size="sm"
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg transition-all duration-200 hover:scale-105"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {editData.specializationAreas?.map((spec, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200 hover:shadow-md transition-all duration-200"
                          >
                            <Award className="w-3 h-3" />
                            {spec}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-5 w-5 p-0 hover:bg-red-200 rounded-full transition-colors duration-200"
                              onClick={() => removeSpecialization(index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(profile?.specializationAreas || []).length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {(profile?.specializationAreas || []).map(
                            (spec, index) => (
                              <Badge
                                key={index}
                                className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200 hover:shadow-md transition-all duration-200"
                              >
                                <Award className="w-3 h-3 mr-2" />
                                {spec}
                              </Badge>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <p className="text-slate-500 font-medium">
                            No specializations added
                          </p>
                          <p className="text-slate-400 text-sm">
                            Add your areas of expertise
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-[10px]">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editing ? (
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Input
                          value={newCertification}
                          onChange={(e) => setNewCertification(e.target.value)}
                          placeholder="Add certification..."
                          onKeyPress={(e) =>
                            e.key === "Enter" && addCertification()
                          }
                          className="flex-1 border-2 border-slate-200 focus:border-green-500 transition-colors duration-200"
                        />
                        <Button
                          onClick={addCertification}
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg transition-all duration-200 hover:scale-105"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {editData.certifications?.map((cert, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 hover:shadow-md transition-all duration-200"
                          >
                            <Award className="w-3 h-3" />
                            {cert}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-5 w-5 p-0 hover:bg-red-200 rounded-full transition-colors duration-200"
                              onClick={() => removeCertification(index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(profile?.certifications || []).length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {(profile?.certifications || []).map(
                            (cert, index) => (
                              <Badge
                                key={index}
                                className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 hover:shadow-md transition-all duration-200"
                              >
                                <Award className="w-3 h-3 mr-2" />
                                {cert}
                              </Badge>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <p className="text-slate-500 font-medium">
                            No certifications added
                          </p>
                          <p className="text-slate-400 text-sm">
                            Add your professional certifications
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Languages */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-[10px]">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  Languages Spoken
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Input
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        placeholder="Add language..."
                        onKeyPress={(e) => e.key === "Enter" && addLanguage()}
                        className="flex-1 border-2 border-slate-200 focus:border-blue-500 transition-colors duration-200"
                      />
                      <Button
                        onClick={addLanguage}
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg transition-all duration-200 hover:scale-105"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {editData.languagesSpoken?.map((lang, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200 hover:shadow-md transition-all duration-200"
                        >
                          <Globe className="w-3 h-3" />
                          {lang}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 w-5 p-0 hover:bg-red-200 rounded-full transition-colors duration-200"
                            onClick={() => removeLanguage(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(profile?.languagesSpoken || []).length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {(profile?.languagesSpoken || []).map((lang, index) => (
                          <Badge
                            key={index}
                            className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200 hover:shadow-md transition-all duration-200"
                          >
                            <Globe className="w-3 h-3 mr-2" />
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">
                          No languages added
                        </p>
                        <p className="text-slate-400 text-sm">
                          Add the languages you speak
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Availability Tab */}
          <TabsContent value="availability" className="space-y-8">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-[10px]">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  Working Hours & Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-slate-200">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Availability Status
                    </h3>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          profile?.availability?.isActive
                            ? "bg-green-500"
                            : "bg-red-500"
                        } animate-pulse`}
                      ></div>
                      <p className="text-sm font-medium text-slate-700">
                        {profile?.availability?.isActive
                          ? "Currently accepting bookings"
                          : "Not accepting bookings"}
                      </p>
                    </div>
                  </div>
                  {editing && (
                    <Button
                      variant={
                        profile?.availability?.isActive
                          ? "destructive"
                          : "default"
                      }
                      onClick={() =>
                        setEditData((prev) => ({
                          ...prev,
                          availability: {
                            ...prev.availability!,
                            isActive: !prev.availability!.isActive,
                          },
                        }))
                      }
                      className={`transition-all duration-200 hover:scale-105 ${
                        profile?.availability?.isActive
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {profile?.availability?.isActive ? "Disable" : "Enable"}{" "}
                      Availability
                    </Button>
                  )}
                </div>

                <Separator />

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Weekly Schedule
                  </h3>
                  <div className="space-y-4">
                    {(profile?.availability?.workingHours || []).map(
                      (day, index) => (
                        <div
                          key={day._id}
                          className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="w-full sm:w-32">
                            <p className="font-semibold text-slate-900 text-sm sm:text-base">
                              {daysOfWeek[day.dayOfWeek - 1]}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={day.isAvailable}
                                onChange={(e) =>
                                  updateWorkingHours(
                                    index,
                                    "isAvailable",
                                    e.target.checked
                                  )
                                }
                                disabled={!editing}
                                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                              />
                              <span className="text-sm font-medium text-slate-700">
                                Available
                              </span>
                            </label>
                          </div>
                          {day.isAvailable && (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                              <div className="flex items-center gap-2 text-slate-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  Hours:
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Input
                                  type="time"
                                  value={day.startTime}
                                  onChange={(e) =>
                                    updateWorkingHours(
                                      index,
                                      "startTime",
                                      e.target.value
                                    )
                                  }
                                  disabled={!editing}
                                  className="w-32 border-2 border-slate-200 focus:border-blue-500 transition-colors duration-200"
                                />
                                <span className="text-slate-500 font-medium">
                                  to
                                </span>
                                <Input
                                  type="time"
                                  value={day.endTime}
                                  onChange={(e) =>
                                    updateWorkingHours(
                                      index,
                                      "endTime",
                                      e.target.value
                                    )
                                  }
                                  disabled={!editing}
                                  className="w-32 border-2 border-slate-200 focus:border-blue-500 transition-colors duration-200"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="bufferTime"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Buffer Time (minutes)
                    </Label>
                    <Input
                      id="bufferTime"
                      type="number"
                      value={profile?.availability?.bufferTimeMinutes || 0}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          availability: {
                            ...prev.availability!,
                            bufferTimeMinutes: parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                      disabled={!editing}
                      className="border-2 border-slate-200 focus:border-purple-500 transition-colors duration-200"
                      placeholder="Enter buffer time in minutes"
                    />
                    <p className="text-xs text-slate-500">
                      Time between sessions for preparation
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="timezone"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Timezone
                    </Label>
                    <Input
                      id="timezone"
                      value={profile?.availability?.timezone || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          availability: {
                            ...prev.availability!,
                            timezone: e.target.value,
                          },
                        }))
                      }
                      disabled={!editing}
                      className="border-2 border-slate-200 focus:border-purple-500 transition-colors duration-200"
                      placeholder="e.g., UTC, EST, PST"
                    />
                    <p className="text-xs text-slate-500">
                      Your local timezone
                    </p>
                  </div>
                </div>

                {profile?.availability?.calendly && (
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-500 rounded-[10px]">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-green-900 text-lg">
                        Calendly Integration
                      </h4>
                    </div>
                    <p className="text-sm text-green-700 mb-2">
                      Your calendar is connected and synced
                    </p>
                    <p className="text-xs text-green-600">
                      Connected on{" "}
                      {new Date(
                        profile?.availability?.calendly?.connectedAt || ""
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Experience Tab */}
          <TabsContent value="experience" className="space-y-8">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[10px]">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  Professional Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-3">
                  <Label
                    htmlFor="experience"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Years of Experience
                  </Label>
                  {editing ? (
                    <Input
                      id="experience"
                      type="number"
                      value={editData.experience || 0}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          experience: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="border-2 border-slate-200 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="Enter years of experience"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
                      <div className="p-2 bg-indigo-500 rounded-[10px]">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-indigo-700">
                        {profile?.experience || 0} years
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="experienceDetails"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Experience Details
                  </Label>
                  {editing ? (
                    <Textarea
                      id="experienceDetails"
                      value={editData.experienceDetails || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          experienceDetails: e.target.value,
                        }))
                      }
                      placeholder="Describe your professional experience, achievements, and expertise..."
                      rows={6}
                      className="border-2 border-slate-200 focus:border-indigo-500 transition-colors duration-200 resize-none"
                    />
                  ) : (
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {profile?.experienceDetails ||
                          "No experience details provided. Add details about your professional background, achievements, and areas of expertise."}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="linkedin"
                    className="text-sm font-semibold text-slate-700"
                  >
                    LinkedIn Profile
                  </Label>
                  {editing ? (
                    <Input
                      id="linkedin"
                      value={editData.linkedIn || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          linkedIn: e.target.value,
                        }))
                      }
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="border-2 border-slate-200 focus:border-indigo-500 transition-colors duration-200"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                      <Linkedin className="w-6 h-6 text-blue-600" />
                      {profile?.linkedIn ? (
                        <a
                          href={profile.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
                        >
                          {profile.linkedIn}
                        </a>
                      ) : (
                        <span className="text-slate-500 font-medium">
                          No LinkedIn profile added
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Settings Tab */}
          <TabsContent value="settings" className="space-y-8">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-r from-slate-500 to-gray-600 rounded-[10px]">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500 rounded-[10px]">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-green-900">
                          Email Verification
                        </h3>
                      </div>
                      <Badge
                        className={`px-3 py-1 ${
                          userData.isVerified
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
                        {userData.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                    <p className="text-sm text-green-700">
                      {userData.isVerified
                        ? "Your email address is verified and secure"
                        : "Please verify your email address to secure your account"}
                    </p>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500 rounded-[10px]">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-blue-900">
                          Onboarding Status
                        </h3>
                      </div>
                      <Badge
                        className={`px-3 py-1 ${
                          userData.onboardingStatus === "completed"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }`}
                      >
                        {userData.onboardingStatus === "completed"
                          ? "Complete"
                          : "Incomplete"}
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-700">
                      {userData.onboardingStatus === "completed"
                        ? "Your profile setup is complete"
                        : "Complete your profile setup to get started"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
