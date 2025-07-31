"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Loader2,
  User,
  Mail,
  Shield,
  CheckCircle,
  Lock,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { getApiRequest, patchApiRequest } from "@/lib/apiFetch";
import { useTokenManagement } from "@/hooks/useTokenManagement";

interface User {
  _id: string;
  email: string;
  fullName: string;
  role:
    | "student"
    | "individualTechProfessional"
    | "teamTechProfessional"
    | "recruiter"
    | "institution";
  isVerified: boolean;
  isLocked: boolean;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt?: string;
  profile?: {
    phoneNumber?: string;
    currentLocation?: string;
    bio?: string;
    [key: string]: any;
  };
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const { accessToken } = useTokenManagement();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    isVerified: false,
    isLocked: false,
    profileImageUrl: "",
    role: "" as User["role"],
    profile: {
      phoneNumber: "",
      currentLocation: "",
      bio: "",
    },
  });

  const fetchUser = async () => {
    if (!accessToken) {
      setError("No access token found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getApiRequest(
        `/api/users/${params.id}`,
        accessToken
      );

      if (response.status === 200) {
        const userData = response.data;
        setUser(userData);

        setFormData({
          email: userData.email,
          fullName: userData.fullName,
          isVerified: userData.isVerified,
          isLocked: userData.isLocked,
          profileImageUrl: userData.profileImageUrl || "",
          role: userData.role,
          profile: {
            phoneNumber: userData.profile?.phoneNumber || "",
            currentLocation: userData.profile?.currentLocation || "",
            bio: userData.profile?.bio || "",
          },
        });
      } else {
        throw new Error(response.message || "Failed to load user");
      }
    } catch (err: any) {
      console.error("Error fetching user:", err);
      setError(err.message || "Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [params.id, accessToken]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleProfileChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!accessToken) {
      toast.error("Authentication required");
      return;
    }

    try {
      setSaving(true);

      const response = await patchApiRequest(
        `/api/users/${params.id}`,
        accessToken,
        formData
      );

      if (response.status === 200) {
        toast.success("User updated successfully!");
        setHasChanges(false);
        fetchUser();
      } else {
        throw new Error(response.message || "Failed to update user");
      }
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-800">
            Error Loading User
          </h2>
          <p className="text-gray-600 max-w-md">{error}</p>
          <Button onClick={fetchUser} variant="outline" className="rounded-lg">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-center">
          <User className="w-12 h-12 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-800">
            User Not Found
          </h2>
          <p className="text-gray-600">
            The requested user could not be found.
          </p>
          <Button asChild variant="outline" className="rounded-lg">
            <Link href="/dashboard/users">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" className="rounded-lg" asChild>
            <Link href={`/dashboard/users/${params.id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to User
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#011F72] flex items-center gap-2">
              <User className="w-8 h-8" />
              Edit User
            </h1>
            <p className="text-gray-600 mt-1">
              Update user information and profile details
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Basic Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="mt-1 rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name *
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="mt-1 rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="role" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleChange("role", value)}
              >
                <SelectTrigger className="mt-1 rounded-lg">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="individualTechProfessional">
                    Tech Professional
                  </SelectItem>
                  <SelectItem value="teamTechProfessional">
                    Team Professional
                  </SelectItem>
                  <SelectItem value="recruiter">Recruiter</SelectItem>
                  <SelectItem value="institution">Institution</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                value={formData.profile.phoneNumber}
                onChange={(e) =>
                  handleProfileChange("phoneNumber", e.target.value)
                }
                className="mt-1 rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="location" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Location
              </Label>
              <Input
                id="location"
                value={formData.profile.currentLocation}
                onChange={(e) =>
                  handleProfileChange("currentLocation", e.target.value)
                }
                className="mt-1 rounded-lg"
              />
            </div>

            <div>
              <Label
                htmlFor="profileImageUrl"
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Profile Image URL
              </Label>
              <Input
                id="profileImageUrl"
                value={formData.profileImageUrl}
                onChange={(e) =>
                  handleChange("profileImageUrl", e.target.value)
                }
                className="mt-1 rounded-lg"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Bio
            </Label>
            <Textarea
              id="bio"
              value={formData.profile.bio}
              onChange={(e) => handleProfileChange("bio", e.target.value)}
              rows={3}
              className="mt-1 rounded-lg"
            />
          </div>

          {/* Account Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isVerified"
                checked={formData.isVerified}
                onCheckedChange={(checked) =>
                  handleChange("isVerified", checked)
                }
              />
              <Label htmlFor="isVerified" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Verified Account
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isLocked"
                checked={formData.isLocked}
                onCheckedChange={(checked) => handleChange("isLocked", checked)}
              />
              <Label htmlFor="isLocked" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Account Locked
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
