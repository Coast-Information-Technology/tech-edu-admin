"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  BookOpen,
  Video,
  Users,
  FileText,
  Send,
  Loader2,
  GraduationCap,
  Upload,
  X,
  Paperclip,
} from "lucide-react";
import { postApiRequest, getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";

interface Instructor {
  _id: string;
  fullName: string;
  email: string;
  title?: string;
  specializationAreas?: string[];
}

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  productSubcategoryName: string;
}

export default function CreateTrainingBookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [instructorsLoading, setInstructorsLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);

  const [form, setForm] = useState({
    productId: "",
    productType: "Training & Certification",
    instructorId: "",
    bookingPurpose: "",
    scheduleAt: "",
    endAt: "",
    minutesPerSession: 120,
    durationInMinutes: 120,
    numberOfExpectedParticipants: 5,
    isClassroom: true,
    isSession: false,
    meetingLink: "",
    userNotes: "",
    internalNotes: "",
    attachments: [] as string[],
    participantType: "team" as "individual" | "team",
    platformRole: "teamTechProfessional",
    email: "",
    fullName: "",
  });

  // Product types from the product creation form
  const PRODUCT_TYPE_OPTIONS = [
    "Training & Certification",
    "Academic Support Services",
    "Career Development & Mentorship",
    "Institutional & Team Services",
    "AI-Powered or Automation Services",
    "Career Connect",
    "Marketing, Consultation & Free Services",
  ];

  useEffect(() => {
    fetchInstructors();
    fetchProducts();
  }, []);

  const fetchInstructors = async () => {
    setInstructorsLoading(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      const response = await getApiRequest("/api/users?role=instructor", token);
      if (response?.data?.success) {
        const instructorData =
          response.data.data?.users || response.data.users || [];
        setInstructors(instructorData);
        console.log("Fetched instructors:", instructorData);
      } else {
        console.error("Failed to fetch instructors:", response?.data?.message);
      }
    } catch (err: any) {
      console.error("Error fetching instructors:", err);
    } finally {
      setInstructorsLoading(false);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await getApiRequest("/api/products/public");
      if (response?.data?.success) {
        const allProducts =
          response.data.data?.products || response.data.products || [];
        // Filter products by productType "Training & Certification"
        const trainingProducts = allProducts.filter(
          (product: any) => product.productType === "Training & Certification"
        );
        setProducts(trainingProducts);
        console.log("Fetched training products:", trainingProducts);
      } else {
        console.error("Failed to fetch products:", response?.data?.message);
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    if (!startTime) return "";
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);
    return end.toISOString().slice(0, 16);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    // Validate file types and sizes
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      return true;
    });

    setUploadedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFilesToServer = async (files: File[]): Promise<string[]> => {
    const token = getTokenFromCookies();
    if (!token) {
      throw new Error("Authentication required");
    }

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload ${file.name}`);
      }

      const result = await response.json();
      return result.url;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      // Validate required fields
      if (
        !form.productId ||
        !form.instructorId ||
        !form.bookingPurpose ||
        !form.scheduleAt ||
        !form.email ||
        !form.fullName
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Additional validation for ObjectId format
      if (!form.productId.match(/^[0-9a-fA-F]{24}$/)) {
        toast.error("Invalid product selected");
        return;
      }

      if (!form.instructorId.match(/^[0-9a-fA-F]{24}$/)) {
        toast.error("Invalid instructor selected");
        return;
      }

      // Upload files if any
      let attachmentUrls: string[] = [];
      if (uploadedFiles.length > 0) {
        setUploading(true);
        try {
          attachmentUrls = await uploadFilesToServer(uploadedFiles);
          console.log("Uploaded files:", attachmentUrls);
        } catch (error) {
          console.error("File upload error:", error);
          toast.error("Failed to upload some files. Please try again.");
          return;
        } finally {
          setUploading(false);
        }
      }

      const bookingData = {
        ...form,
        scheduleAt: new Date(form.scheduleAt).toISOString(),
        endAt: new Date(form.endAt).toISOString(),
        attachments: attachmentUrls,
      };

      console.log("Submitting booking data:", bookingData);
      console.log(
        "Product ID:",
        bookingData.productId,
        "Type:",
        typeof bookingData.productId,
        "Length:",
        bookingData.productId?.length
      );
      console.log(
        "Instructor ID:",
        bookingData.instructorId,
        "Type:",
        typeof bookingData.instructorId,
        "Length:",
        bookingData.instructorId?.length
      );

      const response = await postApiRequest(
        "/api/bookings",
        token,
        bookingData
      );

      if (response?.data?.success) {
        toast.success("Training booking created successfully!");
        router.push("/dashboard/bookings");
      } else {
        toast.error(response?.data?.message || "Failed to create booking");
      }
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast.error("Error creating booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2 hover:bg-white/50 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Create Training Booking
            </h1>
            <p className="text-slate-600">
              Schedule a training program session
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <GraduationCap className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Team/Organization Name *
                  </Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="Enter team or organization name"
                    className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Contact Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Enter contact email address"
                    className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="bookingPurpose"
                  className="text-sm font-semibold text-slate-700"
                >
                  Training Purpose *
                </Label>
                <Input
                  id="bookingPurpose"
                  value={form.bookingPurpose}
                  onChange={(e) =>
                    handleChange("bookingPurpose", e.target.value)
                  }
                  placeholder="e.g., Data Science Fundamentals Training, Team Development Workshop"
                  className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label
                    htmlFor="productType"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Product Type *
                  </Label>
                  <Select
                    value={form.productType}
                    onValueChange={(value) =>
                      handleChange("productType", value)
                    }
                  >
                    <SelectTrigger className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black">
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {PRODUCT_TYPE_OPTIONS.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="productId"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Training Program *
                  </Label>
                  <Select
                    value={form.productId}
                    onValueChange={(value) => handleChange("productId", value)}
                    disabled={productsLoading}
                  >
                    <SelectTrigger className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <SelectValue
                        placeholder={
                          productsLoading
                            ? "Loading programs..."
                            : "Select a training program"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {products.map((product) => (
                        <SelectItem key={product._id} value={product._id}>
                          {product.productSubcategoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="instructorId"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Instructor *
                  </Label>
                  <Select
                    value={form.instructorId}
                    onValueChange={(value) =>
                      handleChange("instructorId", value)
                    }
                    disabled={instructorsLoading}
                  >
                    <SelectTrigger className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <SelectValue
                        placeholder={
                          instructorsLoading
                            ? "Loading instructors..."
                            : "Select an instructor"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {instructors.map((instructor) => (
                        <SelectItem key={instructor._id} value={instructor._id}>
                          {instructor.fullName}{" "}
                          {instructor.title && `(${instructor.title})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scheduling */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Calendar className="w-5 h-5" />
                Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="scheduleAt"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Start Date & Time *
                  </Label>
                  <Input
                    id="scheduleAt"
                    type="datetime-local"
                    value={form.scheduleAt}
                    onChange={(e) => {
                      handleChange("scheduleAt", e.target.value);
                      if (e.target.value && form.durationInMinutes) {
                        handleChange(
                          "endAt",
                          calculateEndTime(
                            e.target.value,
                            form.durationInMinutes
                          )
                        );
                      }
                    }}
                    className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="endAt"
                    className="text-sm font-semibold text-slate-700"
                  >
                    End Date & Time *
                  </Label>
                  <Input
                    id="endAt"
                    type="datetime-local"
                    value={form.endAt}
                    onChange={(e) => handleChange("endAt", e.target.value)}
                    className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label
                    htmlFor="minutesPerSession"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Minutes Per Session
                  </Label>
                  <Input
                    id="minutesPerSession"
                    type="number"
                    value={form.minutesPerSession}
                    onChange={(e) =>
                      handleChange(
                        "minutesPerSession",
                        parseInt(e.target.value)
                      )
                    }
                    className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="30"
                    max="480"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="durationInMinutes"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Total Duration (minutes)
                  </Label>
                  <Input
                    id="durationInMinutes"
                    type="number"
                    value={form.durationInMinutes}
                    onChange={(e) =>
                      handleChange(
                        "durationInMinutes",
                        parseInt(e.target.value)
                      )
                    }
                    className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="30"
                    max="1440"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="numberOfExpectedParticipants"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Number of Participants
                  </Label>
                  <Input
                    id="numberOfExpectedParticipants"
                    type="number"
                    value={form.numberOfExpectedParticipants}
                    onChange={(e) =>
                      handleChange(
                        "numberOfExpectedParticipants",
                        parseInt(e.target.value)
                      )
                    }
                    className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="participantType"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Participant Type
                  </Label>
                  <Select
                    value={form.participantType}
                    onValueChange={(value: "individual" | "team") =>
                      handleChange("participantType", value)
                    }
                  >
                    <SelectTrigger className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="platformRole"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Platform Role
                  </Label>
                  <Select
                    value={form.platformRole}
                    onValueChange={(value) =>
                      handleChange("platformRole", value)
                    }
                  >
                    <SelectTrigger className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="teamTechProfessional">
                        Team Tech Professional
                      </SelectItem>
                      <SelectItem value="teamManager">Team Manager</SelectItem>
                      <SelectItem value="teamLead">Team Lead</SelectItem>
                      <SelectItem value="individualProfessional">
                        Individual Professional
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meeting Details */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Video className="w-5 h-5" />
                Meeting Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label
                  htmlFor="meetingLink"
                  className="text-sm font-semibold text-slate-700"
                >
                  Meeting Link
                </Label>
                <Input
                  id="meetingLink"
                  type="url"
                  value={form.meetingLink}
                  onChange={(e) => handleChange("meetingLink", e.target.value)}
                  placeholder="https://meet.google.com/xyz-uvw-rst"
                  className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <Label
                  htmlFor="sessionType"
                  className="text-sm font-semibold text-slate-700"
                >
                  Session Type
                </Label>
                <Select
                  value={form.isClassroom ? "classroom" : "individual"}
                  onValueChange={(value) => {
                    handleChange("isClassroom", value === "classroom");
                    handleChange("isSession", value === "individual");
                  }}
                >
                  <SelectTrigger className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <SelectValue placeholder="Select session type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="classroom">Classroom Session</SelectItem>
                    <SelectItem value="individual">
                      Individual Session
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Paperclip className="w-5 h-5" />
                Attachments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
                <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-sm font-medium text-slate-700">
                    Click to upload files or drag and drop
                  </span>
                  <br />
                  <span className="text-xs text-slate-500">
                    PDF, DOC, DOCX, TXT, JPG, PNG, GIF (max 10MB each)
                  </span>
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Selected Files ({uploadedFiles.length})
                  </Label>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-slate-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700">
                            {file.name}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <FileText className="w-5 h-5" />
                Notes & Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label
                  htmlFor="userNotes"
                  className="text-sm font-semibold text-slate-700"
                >
                  Training Requirements
                </Label>
                <Textarea
                  id="userNotes"
                  value={form.userNotes}
                  onChange={(e) => handleChange("userNotes", e.target.value)}
                  placeholder="Specific training requirements, team skill levels, or special considerations..."
                  className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[100px]"
                />
              </div>

              <div>
                <Label
                  htmlFor="internalNotes"
                  className="text-sm font-semibold text-slate-700"
                >
                  Internal Notes
                </Label>
                <Textarea
                  id="internalNotes"
                  value={form.internalNotes}
                  onChange={(e) =>
                    handleChange("internalNotes", e.target.value)
                  }
                  placeholder="Internal notes for administrators or instructors..."
                  className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="px-8 py-3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || uploading}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {loading || uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {uploading ? "Uploading..." : "Creating..."}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Create Training Booking
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
