"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Shield,
  Bell,
  Globe,
  Key,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  Camera,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  Edit,
  Building,
  Users,
  Settings,
  Upload,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

interface AdminProfileProps {
  userProfile: any;
  onUpdate: (data: any) => Promise<{ success: boolean; error?: string }>;
  userId: string;
  token: string;
}

export default function AdminProfile({
  userProfile,
  onUpdate,
  userId,
  token,
}: AdminProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    bio: "",
    departments: [] as string[],
    assignedRegions: [] as string[],
    permissions: [] as string[],
  });

  // Initialize form data when userProfile changes
  useEffect(() => {
    if (userProfile) {
      const profile = userProfile.profile || {};
      setFormData({
        fullName: profile.fullName || userProfile.fullName || "",
        phoneNumber: profile.phoneNumber || "",
        bio: profile.bio || "",
        departments: profile.departments || [],
        assignedRegions: profile.assignedRegions || [],
        permissions: profile.permissions || [],
      });
    }
  }, [userProfile]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    try {
      setUploadingImage(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("avatar", selectedImage);

      // Upload image to server
      const response = await fetch("/api/users/upload-avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();

        // Update profile with new avatar URL using PATCH /api/users/me
        const updateResult = await onUpdate({
          profile: {
            avatarUrl: result.avatarUrl,
          },
        });

        if (updateResult.success) {
          toast.success("Profile picture updated successfully");
          setSelectedImage(null);
          setImagePreview(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          toast.error(updateResult.error || "Failed to update profile");
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("An error occurred while uploading the image");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const result = await onUpdate({
        profile: formData,
      });

      if (result.success) {
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    const profile = userProfile.profile || {};
    setFormData({
      fullName: profile.fullName || userProfile.fullName || "",
      phoneNumber: profile.phoneNumber || "",
      bio: profile.bio || "",
      departments: profile.departments || [],
      assignedRegions: profile.assignedRegions || [],
      permissions: profile.permissions || [],
    });
    setIsEditing(false);
    // Also reset image selection
    removeSelectedImage();
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No profile data available</p>
        </div>
      </div>
    );
  }

  const profile = userProfile.profile || {};
  const displayName = profile.fullName || userProfile.fullName || "User";
  const email = profile.email || userProfile.email || "";
  const avatarUrl =
    profile.avatarUrl ||
    userProfile.profileImageUrl ||
    "/assets/placeholder-avatar.jpg";
  const isVerified = userProfile.isVerified || false;
  const onboardingStatus = userProfile.onboardingStatus || "not_started";
  const permissions = profile.permissions || [];
  const departments = profile.departments || [];
  const assignedRegions = profile.assignedRegions || [];

  // Get role-specific information
  const getRoleInfo = () => {
    const role = profile.role || userProfile.role || "admin";
    switch (role) {
      case "admin":
        return {
          title: "System Administrator Profile",
          description: "Full system access and user management",
          icon: Shield,
        };
      case "moderator":
        return {
          title: "Moderator Profile",
          description: "Content moderation and user management",
          icon: Shield,
        };
      case "instructor":
        return {
          title: "Instructor Profile",
          description: "Course management and student support",
          icon: User,
        };
      case "customerRepresentative":
        return {
          title: "Customer Representative Profile",
          description: "Customer support and inquiry handling",
          icon: Users,
        };
      default:
        return {
          title: "Moderator Profile",
          description: "Content moderation and user management",
          icon: Shield,
        };
    }
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#011F72]">
              {roleInfo.title}
            </CardTitle>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="rounded-[10px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px]"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px]"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture & Basic Info */}
            <div className="lg:col-span-1">
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar className="w-32 h-32 mx-auto mb-4">
                    <AvatarImage
                      src={imagePreview || avatarUrl}
                      alt={displayName}
                    />
                    <AvatarFallback className="text-2xl">
                      {displayName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  {/* Image Upload Controls */}
                  {isEditing && (
                    <div className="absolute bottom-2 right-2 space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full w-8 h-8 p-0 bg-white shadow-lg"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="w-4 h-4" />
                      </Button>

                      {selectedImage && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full w-8 h-8 p-0 bg-white shadow-lg"
                            onClick={handleImageUpload}
                            disabled={uploadingImage}
                          >
                            {uploadingImage ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full w-8 h-8 p-0 bg-white shadow-lg"
                            onClick={removeSelectedImage}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {/* Image Upload Instructions */}
                {isEditing && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Upload Profile Picture:</strong>
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Supported formats: JPG, PNG, GIF</li>
                      <li>• Maximum size: 5MB</li>
                      <li>• Recommended: Square image (400x400px)</li>
                    </ul>
                    {selectedImage && (
                      <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                        <p className="text-xs text-blue-700">
                          Selected: {selectedImage.name}
                        </p>
                        <p className="text-xs text-blue-600">
                          Size: {(selectedImage.size / 1024 / 1024).toFixed(2)}
                          MB
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2 mt-4">
                  <h3 className="text-xl font-semibold text-[#011F72]">
                    {displayName}
                  </h3>
                  <p className="text-gray-600">{roleInfo.description}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                    {isVerified && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge className="bg-purple-100 text-purple-800">
                      {onboardingStatus.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <Card className="border-0 shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-[#011F72]">
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Member since</p>
                      <p className="font-medium">
                        {userProfile.createdAt
                          ? new Date(userProfile.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Last updated</p>
                      <p className="font-medium">
                        {userProfile.updatedAt
                          ? new Date(userProfile.updatedAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RoleIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Role</p>
                      <Badge className="bg-blue-100 text-blue-800 capitalize">
                        {profile.role || userProfile.role}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Profile Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-[#011F72]">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Permissions */}
              {permissions.length > 0 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#011F72]">
                      System Permissions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {permissions.map((permission: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Departments */}
              {departments.length > 0 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#011F72]">
                      Departments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {departments.map((dept: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="rounded-[10px]"
                        >
                          {dept}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Assigned Regions */}
              {assignedRegions.length > 0 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#011F72]">
                      Assigned Regions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {assignedRegions.map((region: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="rounded-[10px]"
                        >
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
