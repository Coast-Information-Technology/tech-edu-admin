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
  Settings,
  Shield,
  BarChart3,
} from "lucide-react";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";

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
}

export default function AdminProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserData>>({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = getTokenFromCookies();
      setLoading(true);
      const response = await getApiRequest("/api/users/me", token || undefined);
      if (response.status === 200) {
        setUserData(response.data.data.data);
        setEditData(response.data.data.data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditData(userData || {});
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData(userData || {});
  };

  const handleSave = async () => {
    try {
      console.log("Saving admin profile data:", editData);
      setEditing(false);
      await fetchUserProfile();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
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

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Profile</h1>
          <p className="text-slate-600">
            Manage your admin profile and system settings
          </p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={userData.profileImageUrl} />
                    <AvatarFallback className="text-2xl">
                      {userData.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {editing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
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
                          {userData.fullName}
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
                      <Label>Role</Label>
                      <Badge
                        variant="default"
                        className="capitalize flex items-center gap-1"
                      >
                        <Shield className="w-3 h-3" />
                        {userData.role}
                      </Badge>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge
                        variant={
                          userData.isVerified ? "default" : "destructive"
                        }
                      >
                        {userData.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-[10px]">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">0</p>
                    <p className="text-sm text-slate-600">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-[10px]">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">0</p>
                    <p className="text-sm text-slate-600">Total Courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-[10px]">
                    <TrendingUp className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">0</p>
                    <p className="text-sm text-slate-600">Active Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-[10px]">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">0</p>
                    <p className="text-sm text-slate-600">Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Admin Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-[10px]">
                    <div>
                      <h3 className="font-medium">User Management</h3>
                      <p className="text-sm text-slate-600">
                        Manage users, roles, and permissions
                      </p>
                    </div>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-[10px]">
                    <div>
                      <h3 className="font-medium">Content Management</h3>
                      <p className="text-sm text-slate-600">
                        Manage courses and training programs
                      </p>
                    </div>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-[10px]">
                    <div>
                      <h3 className="font-medium">Analytics Access</h3>
                      <p className="text-sm text-slate-600">
                        View system analytics and reports
                      </p>
                    </div>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-[10px]">
                    <div>
                      <h3 className="font-medium">System Settings</h3>
                      <p className="text-sm text-slate-600">
                        Configure system-wide settings
                      </p>
                    </div>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                System Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Analytics Dashboard
                </h3>
                <p className="text-slate-600">
                  System analytics and reporting features coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Verification</h3>
                  <p className="text-sm text-slate-600">
                    {userData.isVerified
                      ? "Your email is verified"
                      : "Please verify your email"}
                  </p>
                </div>
                <Badge
                  variant={userData.isVerified ? "default" : "destructive"}
                >
                  {userData.isVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Onboarding Status</h3>
                  <p className="text-sm text-slate-600">
                    {userData.onboardingStatus === "completed"
                      ? "Profile setup complete"
                      : "Profile setup incomplete"}
                  </p>
                </div>
                <Badge
                  variant={
                    userData.onboardingStatus === "completed"
                      ? "default"
                      : "secondary"
                  }
                >
                  {userData.onboardingStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Account Created</h3>
                  <p className="text-sm text-slate-600">
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="outline">
                  {new Date(userData.createdAt).toLocaleDateString()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
