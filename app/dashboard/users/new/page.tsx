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
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { postApiRequest } from "@/lib/apiFetch";
import { useTokenManagement } from "@/hooks/useTokenManagement";
import { uploadImageToFirebase } from "@/lib/firebase";
import { getTokenFromCookies, getRefreshTokenFromCookies } from "@/lib/cookies";
import { InstructorFormData, CustomerCareFormData } from "@/types/users";

interface AdminFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: string;
  departments: string[];
  // assignedRegions: string[];
  status: string;
  bio: string;
  avatarUrl: string;
}

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
  "Executive",
];

const availableRegions = [
  "North America",
  "South America",
  "Europe",
  "Asia Pacific",
  "Middle East",
  "Africa",
  "Global",
];

export default function NewUserPage() {
  const {
    accessToken,
    getValidToken,
    isLoading: tokenLoading,
  } = useTokenManagement();

  const [activeTab, setActiveTab] = useState("instructor");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [newRegion, setNewRegion] = useState("");

  // Image upload refs and states
  const instructorImageRef = useRef<HTMLInputElement>(null);
  const customerCareImageRef = useRef<HTMLInputElement>(null);
  const adminImageRef = useRef<HTMLInputElement>(null);
  const [instructorImagePreview, setInstructorImagePreview] =
    useState<string>("");
  const [customerCareImagePreview, setCustomerCareImagePreview] =
    useState<string>("");
  const [adminImagePreview, setAdminImagePreview] = useState<string>("");
  const [uploadingInstructorImage, setUploadingInstructorImage] =
    useState(false);
  const [uploadingCustomerCareImage, setUploadingCustomerCareImage] =
    useState(false);
  const [uploadingAdminImage, setUploadingAdminImage] = useState(false);

  // Instructor form data
  const [instructorData, setInstructorData] = useState<InstructorFormData>({
    email: "",
    password: "",
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

  // Admin form data
  const [adminData, setAdminData] = useState<AdminFormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    role: "admin",
    departments: ["executive"],
    // assignedRegions: [],
    status: "active",
    bio: "",
    avatarUrl: "",
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

  const handleAdminChange = (field: keyof AdminFormData, value: any) => {
    setAdminData((prev) => ({
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
    if (activeTab === "customerCare") {
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
    } else if (activeTab === "admin") {
      if (newDepartment && !adminData.departments.includes(newDepartment)) {
        handleAdminChange("departments", [
          ...adminData.departments,
          newDepartment,
        ]);
        setNewDepartment("");
      }
    }
  };

  const removeDepartment = (index: number) => {
    if (activeTab === "customerCare") {
      handleCustomerCareChange(
        "assignedDepartments",
        customerCareData.assignedDepartments.filter((_, i) => i !== index)
      );
    } else if (activeTab === "admin") {
      handleAdminChange(
        "departments",
        adminData.departments.filter((_, i) => i !== index)
      );
    }
  };

  // const addRegion = () => {
  //   if (newRegion && !adminData.assignedRegions.includes(newRegion)) {
  //     handleAdminChange("assignedRegions", [
  //       ...adminData.assignedRegions,
  //       newRegion,
  //     ]);
  //     setNewRegion("");
  //   }
  // };

  // const removeRegion = (index: number) => {
  //   handleAdminChange(
  //     "assignedRegions",
  //     adminData.assignedRegions.filter((_, i) => i !== index)
  //   );
  // };

  // Image upload functions
  const handleImageUpload = async (
    file: File,
    type: "instructor" | "customerCare" | "admin"
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
      } else if (type === "customerCare") {
        setUploadingCustomerCareImage(true);
      } else {
        setUploadingAdminImage(true);
      }

      // Create local preview for immediate feedback
      const imageUrl = URL.createObjectURL(file);

      // Upload to Firebase Storage
      const firebaseUrl = await uploadImageToFirebase(file, "profile-images");

      // Update the appropriate form data and preview
      if (type === "instructor") {
        handleInstructorChange("profileImageUrl", firebaseUrl);
        setInstructorImagePreview(imageUrl);
      } else if (type === "customerCare") {
        handleCustomerCareChange("profileImageUrl", firebaseUrl);
        setCustomerCareImagePreview(imageUrl);
      } else {
        handleAdminChange("avatarUrl", firebaseUrl);
        setAdminImagePreview(imageUrl);
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
      } else if (type === "customerCare") {
        setUploadingCustomerCareImage(false);
      } else {
        setUploadingAdminImage(false);
      }
    }
  };

  const handleImageSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "instructor" | "customerCare" | "admin"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file, type);
    }
  };

  const removeImage = (type: "instructor" | "customerCare" | "admin") => {
    if (type === "instructor") {
      handleInstructorChange("profileImageUrl", "");
      setInstructorImagePreview("");
    } else if (type === "customerCare") {
      handleCustomerCareChange("profileImageUrl", "");
      setCustomerCareImagePreview("");
    } else {
      handleAdminChange("avatarUrl", "");
      setAdminImagePreview("");
    }
  };

  const handleSubmitInstructor = async () => {
    if (tokenLoading) {
      toast.error("Please wait while we verify your authentication...");
      return;
    }

    let token = await getValidToken();

    // Fallback: try to get token directly from cookies
    if (!token) {
      token = getTokenFromCookies();
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
          password: "",
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

    let token = await getValidToken();

    // Fallback: try to get token directly from cookies
    if (!token) {
      token = getTokenFromCookies();
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

  const handleSubmitAdmin = async () => {
    if (tokenLoading) {
      toast.error("Please wait while we verify your authentication...");
      return;
    }

    let token = await getValidToken();

    // Fallback: try to get token directly from cookies
    if (!token) {
      token = getTokenFromCookies();
    }

    if (!token) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    // Validation
    if (!adminData.email || !adminData.password || !adminData.fullName) {
      toast.error("Please fill in all required fields");
      return;
    }

    // if (adminData.assignedRegions.length === 0) { */
    //   toast.error("Please assign at least one region");
    //   return;
    // }

    try {
      setLoading(true);
      const response = await postApiRequest(
        "/api/users/create-admin",
        token,
        adminData
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Admin created successfully!");
        // Reset form
        setAdminData({
          fullName: "",
          phoneNumber: "",
          email: "",
          password: "",
          role: "admin",
          departments: ["executive"],
          // assignedRegions: [],
          status: "active",
          bio: "",
          avatarUrl: "",
        });
      } else {
        toast.error(response.message || "Failed to create admin");
      }
    } catch (error: any) {
      console.error("Error creating admin:", error);
      toast.error(
        error.message || "An error occurred while creating the admin"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <Button
                  variant="outline"
                  asChild
                  className="rounded-2xl w-fit bg-white/50 hover:bg-white/80 border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Link href="/dashboard/users">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="hidden sm:inline font-medium">
                      Back to Users
                    </span>
                    <span className="sm:hidden font-medium">Back</span>
                  </Link>
                </Button>
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#011F72] via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                    Add New User
                  </h1>
                  <p className="text-gray-600 text-base sm:text-lg font-medium">
                    Create new instructor, customer care representative, or
                    admin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Type Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl blur-xl"></div>
            <TabsList className="relative grid w-full grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 h-auto sm:h-14 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-2 shadow-xl">
              <TabsTrigger
                value="instructor"
                className="flex items-center gap-3 py-4 sm:py-3 text-sm sm:text-base font-semibold rounded-[12px] transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white/50 group"
              >
                <GraduationCap className="w-5 h-5 group-data-[state=active]:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline">Instructor</span>
                <span className="sm:hidden">Instructor</span>
              </TabsTrigger>
              <TabsTrigger
                value="customerCare"
                className="flex items-center gap-3 py-4 sm:py-3 text-sm sm:text-base font-semibold rounded-[12px] transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white/50 group"
              >
                <Users className="w-5 h-5 group-data-[state=active]:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline">Customer Care</span>
                <span className="sm:hidden">Support</span>
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className="flex items-center gap-3 py-4 sm:py-3 text-sm sm:text-base font-semibold rounded-[12px] transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white/50 group"
              >
                <UserPlus className="w-5 h-5 group-data-[state=active]:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline">Admin</span>
                <span className="sm:hidden">Admin</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Instructor Form */}
          <TabsContent value="instructor" className="space-y-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <Card className="relative border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/30"></div>
                <CardHeader className="relative bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 border-b border-white/20 p-8">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#011F72] via-blue-700 to-indigo-700 bg-clip-text text-transparent flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[12px] shadow-lg">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    Create New Instructor
                  </CardTitle>
                  <p className="text-gray-600 mt-2 font-medium">
                    Add a new instructor to your team with detailed profile
                    information
                  </p>
                </CardHeader>
                <CardContent className="relative space-y-8 p-8">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="group">
                      <Label
                        htmlFor="instructor-email"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
                      >
                        <div className="p-1 bg-blue-100 rounded-[10px]">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
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
                        className="mt-1 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                      />
                    </div>
                    <div className="group">
                      <Label
                        htmlFor="instructor-password"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
                      >
                        <div className="p-1 bg-red-100 rounded-[10px]">
                          <Lock className="w-4 h-4 text-red-600" />
                        </div>
                        Password *
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="instructor-password"
                          type={showPassword ? "text" : "password"}
                          value={instructorData.password}
                          onChange={(e) =>
                            handleInstructorChange("password", e.target.value)
                          }
                          placeholder="Enter password"
                          className="rounded-2xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-[10px] hover:bg-gray-100 transition-all duration-200"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="group">
                      <Label
                        htmlFor="instructor-fullName"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
                      >
                        <div className="p-1 bg-green-100 rounded-[10px]">
                          <User className="w-4 h-4 text-green-600" />
                        </div>
                        Full Name *
                      </Label>
                      <Input
                        id="instructor-fullName"
                        value={instructorData.fullName}
                        onChange={(e) =>
                          handleInstructorChange("fullName", e.target.value)
                        }
                        placeholder="Dr. Jane Smith"
                        className="mt-1 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
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
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => instructorImageRef.current?.click()}
                            disabled={uploadingInstructorImage}
                            className="group relative bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 text-blue-700 hover:text-blue-800 rounded-2xl px-6 py-3 font-semibold shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            {uploadingInstructorImage ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
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
                                className="group relative bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 hover:border-gray-400 text-gray-700 hover:text-gray-800 rounded-2xl px-6 py-3 font-semibold shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
                              >
                                <ImageIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
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
                          className="rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
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
                  <div className="group">
                    <Label
                      htmlFor="instructor-bio"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
                    >
                      <div className="p-1 bg-indigo-100 rounded-[10px]">
                        <User className="w-4 h-4 text-indigo-600" />
                      </div>
                      Bio
                    </Label>
                    <Textarea
                      id="instructor-bio"
                      value={instructorData.bio}
                      onChange={(e) =>
                        handleInstructorChange("bio", e.target.value)
                      }
                      placeholder="Brief professional biography..."
                      rows={4}
                      className="mt-1 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md resize-none"
                    />
                  </div>

                  {/* Experience Details */}
                  <div className="group">
                    <Label
                      htmlFor="instructor-experienceDetails"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
                    >
                      <div className="p-1 bg-amber-100 rounded-[10px]">
                        <Award className="w-4 h-4 text-amber-600" />
                      </div>
                      Experience Details
                    </Label>
                    <Textarea
                      id="instructor-experienceDetails"
                      value={instructorData.experienceDetails}
                      onChange={(e) =>
                        handleInstructorChange(
                          "experienceDetails",
                          e.target.value
                        )
                      }
                      placeholder="Detailed work experience and achievements..."
                      rows={3}
                      className="mt-1 rounded-2xl border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md resize-none"
                    />
                  </div>

                  {/* Specialization Areas */}
                  <div className="group">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="p-1 bg-blue-100 rounded-[10px]">
                        <Globe className="w-4 h-4 text-blue-600" />
                      </div>
                      Specialization Areas
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-3 mt-1">
                      <Input
                        value={newSpecialization}
                        onChange={(e) => setNewSpecialization(e.target.value)}
                        placeholder="Add specialization area"
                        onKeyPress={(e) =>
                          e.key === "Enter" && addSpecialization()
                        }
                        className="rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md flex-1"
                      />
                      <Button
                        onClick={addSpecialization}
                        size="sm"
                        className="group relative bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl w-full sm:w-auto px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <div className="relative flex items-center gap-2">
                          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                          <span className="hidden sm:inline">Add</span>
                        </div>
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3">
                      {instructorData.specializationAreas.map((area, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="group relative bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 text-blue-800 rounded-2xl px-4 py-2 font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                        >
                          {area}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-auto p-1 ml-2 rounded-full hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                            onClick={() => removeSpecialization(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="group">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="p-1 bg-yellow-100 rounded-[10px]">
                        <Award className="w-4 h-4 text-yellow-600" />
                      </div>
                      Certifications
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-3 mt-1">
                      <Input
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        placeholder="Add certification"
                        onKeyPress={(e) =>
                          e.key === "Enter" && addCertification()
                        }
                        className="rounded-2xl border-2 border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md flex-1"
                      />
                      <Button
                        onClick={addCertification}
                        size="sm"
                        className="group relative bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-2xl w-full sm:w-auto px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <div className="relative flex items-center gap-2">
                          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                          <span className="hidden sm:inline">Add</span>
                        </div>
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3">
                      {instructorData.certifications.map((cert, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="group relative bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 text-yellow-800 rounded-2xl px-4 py-2 font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                        >
                          {cert}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-auto p-1 ml-2 rounded-full hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                            onClick={() => removeCertification(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="group">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="p-1 bg-purple-100 rounded-[10px]">
                        <Languages className="w-4 h-4 text-purple-600" />
                      </div>
                      Languages Spoken
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-3 mt-1">
                      <Input
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        placeholder="Add language"
                        onKeyPress={(e) => e.key === "Enter" && addLanguage()}
                        className="rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md flex-1"
                      />
                      <Button
                        onClick={addLanguage}
                        size="sm"
                        className="group relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl w-full sm:w-auto px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <div className="relative flex items-center gap-2">
                          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                          <span className="hidden sm:inline">Add</span>
                        </div>
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3">
                      {instructorData.languagesSpoken.map((lang, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="group relative bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 text-purple-800 rounded-2xl px-4 py-2 font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                        >
                          {lang}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-auto p-1 ml-2 rounded-full hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                            onClick={() => removeLanguage(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div className="group">
                      <Label
                        htmlFor="instructor-linkedin"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
                      >
                        <div className="p-1 bg-blue-100 rounded-[10px]">
                          <Linkedin className="w-4 h-4 text-blue-600" />
                        </div>
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
                        className="mt-1 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                      />
                    </div>
                    <div className="group">
                      <Label
                        htmlFor="instructor-linkedin-alt"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
                      >
                        <div className="p-1 bg-blue-100 rounded-[10px]">
                          <Linkedin className="w-4 h-4 text-blue-600" />
                        </div>
                        LinkedIn (Alternative)
                      </Label>
                      <Input
                        id="instructor-linkedin-alt"
                        value={instructorData.linkedIn}
                        onChange={(e) =>
                          handleInstructorChange("linkedIn", e.target.value)
                        }
                        placeholder="https://linkedin.com/in/username"
                        className="mt-1 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200/50">
                    <Button
                      onClick={handleSubmitInstructor}
                      disabled={loading}
                      className="group relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white rounded-2xl w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <div className="relative flex items-center gap-3">
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="hidden sm:inline">
                              Creating Instructor...
                            </span>
                            <span className="sm:hidden">Creating...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            <span className="hidden sm:inline">
                              Create Instructor
                            </span>
                            <span className="sm:hidden">Create</span>
                          </>
                        )}
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Customer Care Form */}
          <TabsContent value="customerCare" className="space-y-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <Card className="relative border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-pink-50/30"></div>
                <CardHeader className="relative bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-rose-500/5 border-b border-white/20 p-8">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-pink-700 to-rose-700 bg-clip-text text-transparent flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-[12px] shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    Create New Customer Care Representative
                  </CardTitle>
                  <p className="text-gray-600 mt-2 font-medium">
                    Add a new support representative to handle customer
                    inquiries
                  </p>
                </CardHeader>
                <CardContent className="relative space-y-8 p-8">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                            onClick={() =>
                              customerCareImageRef.current?.click()
                            }
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
                    <div className="flex flex-col sm:flex-row gap-2 mt-1">
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
                        className="rounded-[10px] text-white hover:text-black w-full sm:w-auto"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {customerCareData.assignedDepartments.map(
                        (dept, index) => (
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
                        )
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <Button
                      onClick={handleSubmitCustomerCare}
                      disabled={loading}
                      className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px] w-full sm:w-auto"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <span className="hidden sm:inline">
                            Creating Customer Care Representative...
                          </span>
                          <span className="sm:hidden">Creating...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">
                            Create Customer Care Representative
                          </span>
                          <span className="sm:hidden">Create Support</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Admin Form */}
          <TabsContent value="admin" className="space-y-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <Card className="relative border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-teal-50/30"></div>
                <CardHeader className="relative bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 border-b border-white/20 p-8">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 bg-clip-text text-transparent flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[12px] shadow-lg">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    Create New Admin
                  </CardTitle>
                  <p className="text-gray-600 mt-2 font-medium">
                    Add a new administrator with full system access and
                    management capabilities
                  </p>
                </CardHeader>
                <CardContent className="relative space-y-8 p-8">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <Label
                        htmlFor="admin-fullName"
                        className="flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Full Name *
                      </Label>
                      <Input
                        id="admin-fullName"
                        value={adminData.fullName}
                        onChange={(e) =>
                          handleAdminChange("fullName", e.target.value)
                        }
                        placeholder="John Doe"
                        className="mt-1 rounded-[10px]"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="admin-phoneNumber"
                        className="flex items-center gap-2"
                      >
                        <Building className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="admin-phoneNumber"
                        value={adminData.phoneNumber}
                        onChange={(e) =>
                          handleAdminChange("phoneNumber", e.target.value)
                        }
                        placeholder="+1 (555) 123-4567"
                        className="mt-1 rounded-[10px]"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="admin-email"
                        className="flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </Label>
                      <Input
                        id="admin-email"
                        type="email"
                        value={adminData.email}
                        onChange={(e) =>
                          handleAdminChange("email", e.target.value)
                        }
                        placeholder="admin@example.com"
                        className="mt-1 rounded-[10px]"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="admin-password"
                        className="flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        Password *
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="admin-password"
                          type={showPassword ? "text" : "password"}
                          value={adminData.password}
                          onChange={(e) =>
                            handleAdminChange("password", e.target.value)
                          }
                          placeholder="Enter password"
                          className="rounded-[10px] pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="admin-role"
                        className="flex items-center gap-2"
                      >
                        <Award className="w-4 h-4" />
                        Role
                      </Label>
                      <Select
                        value={adminData.role}
                        onValueChange={(value) =>
                          handleAdminChange("role", value)
                        }
                      >
                        <SelectTrigger className="mt-1 rounded-[10px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-[10px]">
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superadmin">
                            Super Admin
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        htmlFor="admin-status"
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Status
                      </Label>
                      <Select
                        value={adminData.status}
                        onValueChange={(value) =>
                          handleAdminChange("status", value)
                        }
                      >
                        <SelectTrigger className="mt-1 rounded-[10px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-[10px]">
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Avatar Upload */}
                  <div>
                    <Label className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Avatar Image
                    </Label>
                    <div className="mt-1 space-y-3">
                      {/* Hidden file input */}
                      <input
                        ref={adminImageRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageSelect(e, "admin")}
                        className="hidden"
                      />

                      {/* Image preview */}
                      {adminImagePreview && (
                        <div className="relative inline-block">
                          <img
                            src={adminImagePreview}
                            alt="Avatar preview"
                            className="w-20 h-20 rounded-[10px] object-cover border-2 border-gray-200"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                            onClick={() => removeImage("admin")}
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
                          onClick={() => adminImageRef.current?.click()}
                          disabled={uploadingAdminImage}
                          className="rounded-[10px]"
                        >
                          {uploadingAdminImage ? (
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
                        {adminData.avatarUrl && !adminImagePreview && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              setAdminImagePreview(adminData.avatarUrl)
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
                        value={adminData.avatarUrl}
                        onChange={(e) =>
                          handleAdminChange("avatarUrl", e.target.value)
                        }
                        placeholder="Or enter image URL directly"
                        className="rounded-[10px]"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <Label htmlFor="admin-bio">Bio</Label>
                    <Textarea
                      id="admin-bio"
                      value={adminData.bio}
                      onChange={(e) => handleAdminChange("bio", e.target.value)}
                      placeholder="Brief professional biography..."
                      rows={4}
                      className="mt-1 rounded-[10px]"
                    />
                  </div>

                  {/* Departments */}
                  <div>
                    <Label className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Departments
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-2 mt-1">
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
                        className="rounded-[10px] text-white hover:text-black w-full sm:w-auto"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {adminData.departments.map((dept, index) => (
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

                  {/* Assigned Regions */}
                  {/* <div>
                    <Label className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Assigned Regions *
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-2 mt-1">
                      <Select value={newRegion} onValueChange={setNewRegion}>
                        <SelectTrigger className="w-full rounded-[10px]">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-[10px]">
                          {availableRegions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={addRegion}
                        size="sm"
                        className="rounded-[10px] text-white hover:text-black w-full sm:w-auto"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {adminData.assignedRegions.map((region, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="rounded-[10px]"
                        >
                          {region}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-auto p-0 ml-1"
                            onClick={() => removeRegion(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div> */}

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <Button
                      onClick={handleSubmitAdmin}
                      disabled={loading}
                      className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px] w-full sm:w-auto"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <span className="hidden sm:inline">
                            Creating Admin...
                          </span>
                          <span className="sm:hidden">Creating...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Create Admin</span>
                          <span className="sm:hidden">Create</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
