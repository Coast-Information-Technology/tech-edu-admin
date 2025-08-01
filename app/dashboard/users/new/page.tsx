"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserPlus,
  GraduationCap,
  Users,
  ArrowLeft,
  Save,
  Loader2,
  X,
  Plus,
  Globe,
  Linkedin,
  Award,
  Languages,
  Building,
  Mail,
  Lock,
  User,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { postApiRequest } from "@/lib/apiFetch";
import { useTokenManagement } from "@/hooks/useTokenManagement";
import { uploadImageToFirebase } from "@/lib/firebase";
import { getTokenFromCookies, getRefreshTokenFromCookies } from "@/lib/cookies";
import { InstructorFormData, CustomerCareFormData } from "@/types/users";

const availableDepartments = [
  "Academic Services",
  "Career Support",
  "Training Programs",
  "Institutional Onboarding",
  "Billing & Payments",
  "Technical Support",
  "Student Support",
  "Course Management",
  "Certification Support",
  "General Inquiries",
];

export default function NewUserPage() {
  const {
    accessToken,
    getValidToken,
    isLoading: tokenLoading,
  } = useTokenManagement();

  // Debug: Check all cookies on component mount
  React.useEffect(() => {
    console.log("=== COOKIE DEBUG ===");
    console.log("All cookies:", document.cookie);
    console.log("Token from cookies:", getTokenFromCookies());
    console.log("Refresh token from cookies:", getRefreshTokenFromCookies());
    console.log("===================");
  }, []);

  const [activeTab, setActiveTab] = useState("instructor");
  const [loading, setLoading] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newDepartment, setNewDepartment] = useState("");

  // Image upload refs and states
  const instructorImageRef = useRef<HTMLInputElement>(null);
  const customerCareImageRef = useRef<HTMLInputElement>(null);
  const [instructorImagePreview, setInstructorImagePreview] =
    useState<string>("");
  const [customerCareImagePreview, setCustomerCareImagePreview] =
    useState<string>("");
  const [uploadingInstructorImage, setUploadingInstructorImage] =
    useState(false);
  const [uploadingCustomerCareImage, setUploadingCustomerCareImage] =
    useState(false);

  // Instructor form data
  const [instructorData, setInstructorData] = useState<InstructorFormData>({
    email: "",
    password: process.env.NEXT_PUBLIC_ISSTAFF_PASSWORD!,
    fullName: "",
    profileImageUrl: "",
    title: "",
    bio: "",
    specializationAreas: [],
    certifications: [],
    yearsOfExperience: 0,
    linkedInProfileUrl: "",
    languagesSpoken: [],
    experience: 0,
    experienceDetails: "",
    linkedIn: "",
  });

  // Customer care form data
  const [customerCareData, setCustomerCareData] =
    useState<CustomerCareFormData>({
      email: "",
      password: "",
      fullName: "",
      profileImageUrl: "",
      assignedDepartments: [],
    });

  const handleInstructorChange = (
    field: keyof InstructorFormData,
    value: any
  ) => {
    setInstructorData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCustomerCareChange = (
    field: keyof CustomerCareFormData,
    value: any
  ) => {
    setCustomerCareData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addSpecialization = () => {
    if (
      newSpecialization.trim() &&
      !instructorData.specializationAreas.includes(newSpecialization.trim())
    ) {
      handleInstructorChange("specializationAreas", [
        ...instructorData.specializationAreas,
        newSpecialization.trim(),
      ]);
      setNewSpecialization("");
    }
  };

  const removeSpecialization = (index: number) => {
    handleInstructorChange(
      "specializationAreas",
      instructorData.specializationAreas.filter((_, i) => i !== index)
    );
  };

  const addCertification = () => {
    if (
      newCertification.trim() &&
      !instructorData.certifications.includes(newCertification.trim())
    ) {
      handleInstructorChange("certifications", [
        ...instructorData.certifications,
        newCertification.trim(),
      ]);
      setNewCertification("");
    }
  };

  const removeCertification = (index: number) => {
    handleInstructorChange(
      "certifications",
      instructorData.certifications.filter((_, i) => i !== index)
    );
  };

  const addLanguage = () => {
    if (
      newLanguage.trim() &&
      !instructorData.languagesSpoken.includes(newLanguage.trim())
    ) {
      handleInstructorChange("languagesSpoken", [
        ...instructorData.languagesSpoken,
        newLanguage.trim(),
      ]);
      setNewLanguage("");
    }
  };

  const removeLanguage = (index: number) => {
    handleInstructorChange(
      "languagesSpoken",
      instructorData.languagesSpoken.filter((_, i) => i !== index)
    );
  };

  const addDepartment = () => {
    if (
      newDepartment &&
      !customerCareData.assignedDepartments.includes(newDepartment)
    ) {
      handleCustomerCareChange("assignedDepartments", [
        ...customerCareData.assignedDepartments,
        newDepartment,
      ]);
      setNewDepartment("");
    }
  };

  const removeDepartment = (index: number) => {
    handleCustomerCareChange(
      "assignedDepartments",
      customerCareData.assignedDepartments.filter((_, i) => i !== index)
    );
  };

  // Image upload functions
  const handleImageUpload = async (
    file: File,
    type: "instructor" | "customerCare"
  ) => {
    if (!file) return;

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

    try {
      // Set the appropriate loading state
      if (type === "instructor") {
        setUploadingInstructorImage(true);
      } else {
        setUploadingCustomerCareImage(true);
      }

      // Create local preview for immediate feedback
      const imageUrl = URL.createObjectURL(file);

      // Upload to Firebase Storage
      const firebaseUrl = await uploadImageToFirebase(file, "profile-images");

      // Update the appropriate form data and preview
      if (type === "instructor") {
        handleInstructorChange("profileImageUrl", firebaseUrl);
        setInstructorImagePreview(imageUrl);
      } else {
        handleCustomerCareChange("profileImageUrl", firebaseUrl);
        setCustomerCareImagePreview(imageUrl);
      }

      toast.success("Image uploaded successfully!");

      // Clean up the object URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(imageUrl);
      }, 1000);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      // Clear the appropriate loading state
      if (type === "instructor") {
        setUploadingInstructorImage(false);
      } else {
        setUploadingCustomerCareImage(false);
      }
    }
  };

  const handleImageSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "instructor" | "customerCare"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file, type);
    }
  };

  const removeImage = (type: "instructor" | "customerCare") => {
    if (type === "instructor") {
      handleInstructorChange("profileImageUrl", "");
      setInstructorImagePreview("");
    } else {
      handleCustomerCareChange("profileImageUrl", "");
      setCustomerCareImagePreview("");
    }
  };

  const handleSubmitInstructor = async () => {
    if (tokenLoading) {
      toast.error("Please wait while we verify your authentication...");
      return;
    }

    console.log("Token loading state:", tokenLoading);
    console.log("Current access token:", accessToken);

    let token = await getValidToken();
    console.log("Valid token result:", token ? "Token found" : "No token");

    // Fallback: try to get token directly from cookies
    if (!token) {
      console.log("Trying fallback token from cookies...");
      console.log("All cookies:", document.cookie);
      token = getTokenFromCookies();
      console.log("Fallback token result:", token ? "Token found" : "No token");
    }

    if (!token) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    // Validation
    if (
      !instructorData.email ||
      !instructorData.password ||
      !instructorData.fullName
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await postApiRequest(
        "/api/users/create-instructor",
        token,
        instructorData
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Instructor created successfully!");
        // Reset form
        setInstructorData({
          email: "",
          password: process.env.NEXT_PUBLIC_ISSTAFF_PASSWORD!,
          fullName: "",
          profileImageUrl: "",
          title: "",
          bio: "",
          specializationAreas: [],
          certifications: [],
          yearsOfExperience: 0,
          linkedInProfileUrl: "",
          languagesSpoken: [],
          experience: 0,
          experienceDetails: "",
          linkedIn: "",
        });
      } else {
        toast.error(response.message || "Failed to create instructor");
      }
    } catch (error: any) {
      console.error("Error creating instructor:", error);
      toast.error(
        error.message || "An error occurred while creating the instructor"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCustomerCare = async () => {
    if (tokenLoading) {
      toast.error("Please wait while we verify your authentication...");
      return;
    }

    console.log("Customer Care - Token loading state:", tokenLoading);
    console.log("Customer Care - Current access token:", accessToken);

    let token = await getValidToken();
    console.log(
      "Customer Care - Valid token result:",
      token ? "Token found" : "No token"
    );

    // Fallback: try to get token directly from cookies
    if (!token) {
      console.log("Customer Care - Trying fallback token from cookies...");
      console.log("Customer Care - All cookies:", document.cookie);
      token = getTokenFromCookies();
      console.log(
        "Customer Care - Fallback token result:",
        token ? "Token found" : "No token"
      );
    }

    if (!token) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    // Validation
    if (
      !customerCareData.email ||
      !customerCareData.password ||
      !customerCareData.fullName
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (customerCareData.assignedDepartments.length === 0) {
      toast.error("Please assign at least one department");
      return;
    }

    try {
      setLoading(true);
      const response = await postApiRequest(
        "/api/users/create-customer-care",
        token,
        customerCareData
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Customer Care Representative created successfully!");
        // Reset form
        setCustomerCareData({
          email: "",
          password: "",
          fullName: "",
          profileImageUrl: "",
          assignedDepartments: [],
        });
      } else {
        toast.error(
          response.message || "Failed to create customer care representative"
        );
      }
    } catch (error: any) {
      console.error("Error creating customer care representative:", error);
      toast.error(
        error.message ||
          "An error occurred while creating the customer care representative"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Button variant="outline" asChild className="rounded-[10px]">
            <Link href="/dashboard/users">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#011F72]">Add New User</h1>
            <p className="text-gray-600 mt-1">
              Create new instructor or customer care representative
            </p>
          </div>
        </div>
      </div>

      {/* User Type Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="instructor" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Instructor
          </TabsTrigger>
          <TabsTrigger value="customerCare" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Customer Care
          </TabsTrigger>
        </TabsList>

        {/* Instructor Form */}
        <TabsContent value="instructor" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#011F72] flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Create New Instructor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="instructor-email"
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="instructor-email"
                    type="email"
                    value={instructorData.email}
                    onChange={(e) =>
                      handleInstructorChange("email", e.target.value)
                    }
                    placeholder="instructor@example.com"
                    className="mt-1 rounded-[10px]"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="instructor-password"
                    className="flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Password *
                  </Label>
                  <Input
                    id="instructor-password"
                    type="password"
                    value={instructorData.password}
                    onChange={(e) =>
                      handleInstructorChange("password", e.target.value)
                    }
                    placeholder="Enter password"
                    className="mt-1 rounded-[10px]"
                    disabled
                  />
                </div>
                <div>
                  <Label
                    htmlFor="instructor-fullName"
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="instructor-fullName"
                    value={instructorData.fullName}
                    onChange={(e) =>
                      handleInstructorChange("fullName", e.target.value)
                    }
                    placeholder="Dr. Jane Smith"
                    className="mt-1 rounded-[10px]"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="instructor-title"
                    className="flex items-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    Professional Title
                  </Label>
                  <Input
                    id="instructor-title"
                    value={instructorData.title}
                    onChange={(e) =>
                      handleInstructorChange("title", e.target.value)
                    }
                    placeholder="Senior Data Scientist"
                    className="mt-1 rounded-[10px]"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Profile Image
                  </Label>
                  <div className="mt-1 space-y-3">
                    {/* Hidden file input */}
                    <input
                      ref={instructorImageRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e, "instructor")}
                      className="hidden"
                    />

                    {/* Image preview */}
                    {instructorImagePreview && (
                      <div className="relative inline-block">
                        <img
                          src={instructorImagePreview}
                          alt="Profile preview"
                          className="w-20 h-20 rounded-[10px] object-cover border-2 border-gray-200"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                          onClick={() => removeImage("instructor")}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}

                    {/* Upload button */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => instructorImageRef.current?.click()}
                        disabled={uploadingInstructorImage}
                        className="rounded-[10px]"
                      >
                        {uploadingInstructorImage ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Upload Image
                          </>
                        )}
                      </Button>
                      {instructorData.profileImageUrl &&
                        !instructorImagePreview && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              setInstructorImagePreview(
                                instructorData.profileImageUrl
                              )
                            }
                            className="rounded-[10px]"
                          >
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                        )}
                    </div>

                    {/* URL input as fallback */}
                    <Input
                      value={instructorData.profileImageUrl}
                      onChange={(e) =>
                        handleInstructorChange(
                          "profileImageUrl",
                          e.target.value
                        )
                      }
                      placeholder="Or enter image URL directly"
                      className="rounded-[10px]"
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="instructor-experience"
                    className="flex items-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    Years of Experience
                  </Label>
                  <Input
                    id="instructor-experience"
                    type="number"
                    value={instructorData.yearsOfExperience}
                    onChange={(e) =>
                      handleInstructorChange(
                        "yearsOfExperience",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="8"
                    className="mt-1 rounded-[10px]"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor="instructor-bio">Bio</Label>
                <Textarea
                  id="instructor-bio"
                  value={instructorData.bio}
                  onChange={(e) =>
                    handleInstructorChange("bio", e.target.value)
                  }
                  placeholder="Brief professional biography..."
                  rows={4}
                  className="mt-1 rounded-[10px]"
                />
              </div>

              {/* Experience Details */}
              <div>
                <Label htmlFor="instructor-experienceDetails">
                  Experience Details
                </Label>
                <Textarea
                  id="instructor-experienceDetails"
                  value={instructorData.experienceDetails}
                  onChange={(e) =>
                    handleInstructorChange("experienceDetails", e.target.value)
                  }
                  placeholder="Detailed work experience and achievements..."
                  rows={3}
                  className="mt-1 rounded-[10px]"
                />
              </div>

              {/* Specialization Areas */}
              <div>
                <Label className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Specialization Areas
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    placeholder="Add specialization area"
                    onKeyPress={(e) => e.key === "Enter" && addSpecialization()}
                    className="rounded-[10px]"
                  />
                  <Button
                    onClick={addSpecialization}
                    size="sm"
                    className="rounded-[10px] text-white hover:text-black"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {instructorData.specializationAreas.map((area, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-[10px]"
                    >
                      {area}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-auto p-0 ml-1"
                        onClick={() => removeSpecialization(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <Label className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Certifications
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Add certification"
                    onKeyPress={(e) => e.key === "Enter" && addCertification()}
                    className="rounded-[10px]"
                  />
                  <Button
                    onClick={addCertification}
                    size="sm"
                    className="rounded-[10px] text-white hover:text-black"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {instructorData.certifications.map((cert, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-[10px]"
                    >
                      {cert}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-auto p-0 ml-1"
                        onClick={() => removeCertification(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <Label className="flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  Languages Spoken
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Add language"
                    onKeyPress={(e) => e.key === "Enter" && addLanguage()}
                    className="rounded-[10px]"
                  />
                  <Button
                    onClick={addLanguage}
                    size="sm"
                    className="rounded-[10px] text-white hover:text-black"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {instructorData.languagesSpoken.map((lang, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-[10px]"
                    >
                      {lang}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-auto p-0 ml-1"
                        onClick={() => removeLanguage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* LinkedIn */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="instructor-linkedin"
                    className="flex items-center gap-2"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn Profile URL
                  </Label>
                  <Input
                    id="instructor-linkedin"
                    value={instructorData.linkedInProfileUrl}
                    onChange={(e) =>
                      handleInstructorChange(
                        "linkedInProfileUrl",
                        e.target.value
                      )
                    }
                    placeholder="https://linkedin.com/in/username"
                    className="mt-1 rounded-[10px]"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="instructor-linkedin-alt"
                    className="flex items-center gap-2"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn (Alternative)
                  </Label>
                  <Input
                    id="instructor-linkedin-alt"
                    value={instructorData.linkedIn}
                    onChange={(e) =>
                      handleInstructorChange("linkedIn", e.target.value)
                    }
                    placeholder="https://linkedin.com/in/username"
                    className="mt-1 rounded-[10px]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitInstructor}
                  disabled={loading}
                  className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Instructor...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Instructor
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Care Form */}
        <TabsContent value="customerCare" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#011F72] flex items-center gap-2">
                <Users className="w-5 h-5" />
                Create New Customer Care Representative
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="customerCare-email"
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="customerCare-email"
                    type="email"
                    value={customerCareData.email}
                    onChange={(e) =>
                      handleCustomerCareChange("email", e.target.value)
                    }
                    placeholder="support@example.com"
                    className="mt-1 rounded-[10px]"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="customerCare-password"
                    className="flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Password *
                  </Label>
                  <Input
                    id="customerCare-password"
                    type="password"
                    value={customerCareData.password}
                    onChange={(e) =>
                      handleCustomerCareChange("password", e.target.value)
                    }
                    placeholder="Enter password"
                    className="mt-1 rounded-[10px]"
                    disabled
                  />
                </div>
                <div>
                  <Label
                    htmlFor="customerCare-fullName"
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="customerCare-fullName"
                    value={customerCareData.fullName}
                    onChange={(e) =>
                      handleCustomerCareChange("fullName", e.target.value)
                    }
                    placeholder="Support Agent"
                    className="mt-1 rounded-[10px]"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Profile Image
                  </Label>
                  <div className="mt-1 space-y-3">
                    {/* Hidden file input */}
                    <input
                      ref={customerCareImageRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e, "customerCare")}
                      className="hidden"
                    />

                    {/* Image preview */}
                    {customerCareImagePreview && (
                      <div className="relative inline-block">
                        <img
                          src={customerCareImagePreview}
                          alt="Profile preview"
                          className="w-20 h-20 rounded-[10px] object-cover border-2 border-gray-200"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                          onClick={() => removeImage("customerCare")}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}

                    {/* Upload button */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => customerCareImageRef.current?.click()}
                        disabled={uploadingCustomerCareImage}
                        className="rounded-[10px]"
                      >
                        {uploadingCustomerCareImage ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Upload Image
                          </>
                        )}
                      </Button>
                      {customerCareData.profileImageUrl &&
                        !customerCareImagePreview && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              setCustomerCareImagePreview(
                                customerCareData.profileImageUrl
                              )
                            }
                            className="rounded-[10px]"
                          >
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                        )}
                    </div>

                    {/* URL input as fallback */}
                    <Input
                      value={customerCareData.profileImageUrl}
                      onChange={(e) =>
                        handleCustomerCareChange(
                          "profileImageUrl",
                          e.target.value
                        )
                      }
                      placeholder="Or enter image URL directly"
                      className="rounded-[10px]"
                    />
                  </div>
                </div>
              </div>

              {/* Assigned Departments */}
              <div>
                <Label className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Assigned Departments *
                </Label>
                <div className="flex gap-2 mt-1">
                  <Select
                    value={newDepartment}
                    onValueChange={setNewDepartment}
                  >
                    <SelectTrigger className="w-full rounded-[10px]">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-[10px]">
                      {availableDepartments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={addDepartment}
                    size="sm"
                    className="rounded-[10px] text-white hover:text-black"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {customerCareData.assignedDepartments.map((dept, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-[10px]"
                    >
                      {dept}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-auto p-0 ml-1"
                        onClick={() => removeDepartment(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitCustomerCare}
                  disabled={loading}
                  className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Customer Care Representative...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Customer Care Representative
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
