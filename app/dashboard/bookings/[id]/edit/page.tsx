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
  Save,
  Loader2,
  GraduationCap,
  RefreshCw,
} from "lucide-react";
import { getApiRequest, putApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";

interface Booking {
  _id: string;
  productId?: {
    _id: string;
    service?: string;
    productType?: string;
    price?: number;
  };
  productType:
    | "Training & Certification"
    | "Academic Support Services"
    | "Career Development & Mentorship"
    | "Institutional & Team Services"
    | "AI-Powered or Automation Services"
    | "Recruitment & Job Matching"
    | "Marketing, Consultation & Free Services";
  instructorId?: {
    _id: string;
    fullName?: string;
    email?: string;
  };
  bookingPurpose: string;
  scheduleAt: string;
  endAt: string;
  minutesPerSession: number;
  durationInMinutes: number;
  numberOfExpectedParticipants: number;
  isClassroom: boolean;
  isSession: boolean;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "unpaid" | "paid" | "refunded";
  schedulingStatus?: string;
  meetingLink?: string;
  userNotes?: string;
  internalNotes?: string;
  attachments?: string[];
  cancellation?: {
    isCancelled: boolean;
    cancelledBy?: string;
    reason?: string;
    cancelledAt?: string;
  };
  participantType:
    | "individual"
    | "team"
    | "institution"
    | "recruiter"
    | "visitor";
  platformRole: string;
  email: string;
  fullName: string;
  createdBy?: {
    _id: string;
    fullName?: string;
    email?: string;
  };
  participants?: any[];
  actualDaysAndTime?: any[];
  createdAt: string;
  updatedAt: string;
}

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
}

export default function EditBookingPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [instructorsLoading, setInstructorsLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);

  const [form, setForm] = useState({
    scheduleAt: "",
    endAt: "",
    meetingLink: "",
    userNotes: "",
    internalNotes: "",
    numberOfExpectedParticipants: 1,
    minutesPerSession: 60,
    durationInMinutes: 60,
    schedulingStatus: "",
    participantType: "individual" as const,
    platformRole: "",
    isClassroom: false,
    isSession: false,
  });

  useEffect(() => {
    fetchBooking();
    fetchInstructors();
    fetchProducts();
  }, [params.id]);

  const fetchBooking = async () => {
    setFetching(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      const response = await getApiRequest(`/api/bookings/${params.id}`, token);
      if (response?.data?.success) {
        const bookingData = response.data.data;

        // Convert ISO strings to datetime-local format
        const scheduleAt = new Date(bookingData.scheduleAt)
          .toISOString()
          .slice(0, 16);
        const endAt = new Date(bookingData.endAt).toISOString().slice(0, 16);

        setForm({
          scheduleAt,
          endAt,
          meetingLink: bookingData.meetingLink || "",
          userNotes: bookingData.userNotes || "",
          internalNotes: bookingData.internalNotes || "",
          numberOfExpectedParticipants:
            bookingData.numberOfExpectedParticipants,
          minutesPerSession: bookingData.minutesPerSession,
          durationInMinutes: bookingData.durationInMinutes,
          schedulingStatus: bookingData.schedulingStatus || "",
          participantType: bookingData.participantType || "individual",
          platformRole: bookingData.platformRole || "",
          isClassroom: bookingData.isClassroom || false,
          isSession: bookingData.isSession || false,
        });
      } else {
        toast.error(response?.data?.message || "Failed to fetch booking");
      }
    } catch (error: any) {
      console.error("Error fetching booking:", error);
      toast.error("Error fetching booking");
    } finally {
      setFetching(false);
    }
  };

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
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      const response = await getApiRequest("/api/products", token);
      if (response?.data?.success) {
        const productsData =
          response.data.data?.products || response.data.products || [];
        setProducts(productsData);
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
      if (!form.scheduleAt || !form.endAt) {
        toast.error("Please fill in all required fields");
        return;
      }

      const updateData = {
        scheduleAt: new Date(form.scheduleAt).toISOString(),
        endAt: new Date(form.endAt).toISOString(),
        meetingLink: form.meetingLink,
        userNotes: form.userNotes,
        internalNotes: form.internalNotes,
        numberOfExpectedParticipants: form.numberOfExpectedParticipants,
        minutesPerSession: form.minutesPerSession,
        durationInMinutes: form.durationInMinutes,
        schedulingStatus: form.schedulingStatus,
        participantType: form.participantType,
        platformRole: form.platformRole,
        isClassroom: form.isClassroom,
        isSession: form.isSession,
      };

      const response = await putApiRequest(
        `/api/bookings/${params.id}`,
        updateData,
        token
      );

      if (response?.data?.success) {
        toast.success("Booking updated successfully!");
        router.push(`/dashboard/bookings/${params.id}`);
      } else {
        toast.error(response?.data?.message || "Failed to update booking");
      }
    } catch (error: any) {
      console.error("Error updating booking:", error);
      toast.error("Error updating booking");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12">
              <div className="flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-slate-600">
                  Loading booking details...
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
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
            <h1 className="text-3xl font-bold text-slate-900">Edit Booking</h1>
            <p className="text-slate-600">Update booking information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="15"
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
                    className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="15"
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
                    className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="100"
                  />
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
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Booking Properties */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <User className="w-5 h-5" />
                Additional Booking Properties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="schedulingStatus"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Scheduling Status
                  </Label>
                  <Select
                    value={form.schedulingStatus}
                    onValueChange={(value) =>
                      handleChange("schedulingStatus", value)
                    }
                  >
                    <SelectTrigger className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <SelectValue placeholder="Select scheduling status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eligible-to-schedule">
                        Eligible to Schedule
                      </SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="not-eligible">Not Eligible</SelectItem>
                      <SelectItem value="pending-approval">
                        Pending Approval
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="participantType"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Participant Type
                  </Label>
                  <Select
                    value={form.participantType}
                    onValueChange={(value) =>
                      handleChange("participantType", value as any)
                    }
                  >
                    <SelectTrigger className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <SelectValue placeholder="Select participant type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="institution">Institution</SelectItem>
                      <SelectItem value="recruiter">Recruiter</SelectItem>
                      <SelectItem value="visitor">Visitor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="platformRole"
                  className="text-sm font-semibold text-slate-700"
                >
                  Platform Role
                </Label>
                <Input
                  id="platformRole"
                  type="text"
                  value={form.platformRole}
                  onChange={(e) => handleChange("platformRole", e.target.value)}
                  placeholder="e.g., student, instructor, admin"
                  className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isClassroom"
                    checked={form.isClassroom}
                    onCheckedChange={(checked) =>
                      handleChange("isClassroom", checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="isClassroom"
                    className="text-sm text-slate-700"
                  >
                    Classroom Session
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isSession"
                    checked={form.isSession}
                    onCheckedChange={(checked) =>
                      handleChange("isSession", checked as boolean)
                    }
                  />
                  <Label htmlFor="isSession" className="text-sm text-slate-700">
                    Individual Session
                  </Label>
                </div>
              </div>
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
                  User Notes
                </Label>
                <Textarea
                  id="userNotes"
                  value={form.userNotes}
                  onChange={(e) => handleChange("userNotes", e.target.value)}
                  placeholder="Any specific requirements or notes for the session..."
                  className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
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
                  placeholder="Internal notes for administrators..."
                  className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
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
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Booking
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
