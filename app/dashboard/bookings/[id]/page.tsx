"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Edit,
  Trash2,
  RefreshCw,
  Loader2,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { getApiRequest, deleteApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

interface Booking {
  _id: string;
  productId: string;
  productType: "AcademicService" | "TrainingProgram";
  instructorId: string;
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
  meetingLink?: string;
  userNotes?: string;
  internalNotes?: string;
  attachments?: string[];
  participantType: "individual" | "team";
  platformRole: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
  cancellation?: {
    isCancelled: boolean;
    cancelledBy: string;
    reason: string;
    cancelledAt: string;
  };
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

export default function BookingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [params.id]);

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      const response = await getApiRequest(`/api/bookings/${params.id}`, token);
      if (response?.data?.success) {
        const bookingData = response.data.data;
        setBooking(bookingData);

        // Fetch instructor and product details
        if (bookingData.instructorId) {
          fetchInstructor(bookingData.instructorId, token);
        }
        if (bookingData.productId) {
          fetchProduct(bookingData.productId, token);
        }
      } else {
        toast.error(response?.data?.message || "Failed to fetch booking");
      }
    } catch (error: any) {
      console.error("Error fetching booking:", error);
      toast.error("Error fetching booking");
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructor = async (instructorId: string, token: string) => {
    try {
      const response = await getApiRequest(`/api/users/${instructorId}`, token);
      if (response?.data?.success) {
        setInstructor(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching instructor:", error);
    }
  };

  const fetchProduct = async (productId: string, token: string) => {
    try {
      const response = await getApiRequest(`/api/products/${productId}`, token);
      if (response?.data?.success) {
        setProduct(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;

    setCancelling(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      const response = await deleteApiRequest(
        `/api/bookings/${booking._id}/cancel`,
        token
      );
      if (response?.data?.success) {
        toast.success("Booking cancelled successfully");
        fetchBooking(); // Refresh the booking data
        setCancelDialogOpen(false);
      } else {
        toast.error(response?.data?.message || "Failed to cancel booking");
      }
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      toast.error("Error cancelling booking");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      confirmed: { color: "bg-green-100 text-green-800", label: "Confirmed" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
      completed: { color: "bg-blue-100 text-blue-800", label: "Completed" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      unpaid: { color: "bg-red-100 text-red-800", label: "Unpaid" },
      paid: { color: "bg-green-100 text-green-800", label: "Paid" },
      refunded: { color: "bg-gray-100 text-gray-800", label: "Refunded" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.unpaid;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDurationText = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
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

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Booking not found
                </h3>
                <p className="text-slate-600 mb-6">
                  The booking you're looking for doesn't exist or has been
                  removed.
                </p>
                <Button onClick={() => router.push("/dashboard/bookings")}>
                  Back to Bookings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
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
                Booking Details
              </h1>
              <p className="text-slate-600">{booking.bookingPurpose}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {booking.status !== "cancelled" && (
              <>
                <Link href={`/dashboard/bookings/${booking._id}/edit`}>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setCancelDialogOpen(true)}
                  disabled={cancelling}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
                >
                  {cancelling ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        {cancelDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full mx-4">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Cancel Booking
                    </h2>
                    <p className="text-slate-500 text-sm">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCancelDialogOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center"
                  aria-label="Close dialog"
                  disabled={cancelling}
                >
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-slate-700">
                  Are you sure you want to cancel this booking?
                </p>
                <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-4 border border-red-100">
                  <div className="text-sm text-slate-700">
                    <div className="font-semibold text-slate-900">
                      {booking.bookingPurpose}
                    </div>
                    <div className="text-slate-600 mt-1">
                      {formatDateTime(booking.scheduleAt)} •{" "}
                      {getDurationText(booking.durationInMinutes)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCancelDialogOpen(false)}
                  disabled={cancelling}
                >
                  Keep Booking
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                >
                  {cancelling ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Cancelling...
                    </span>
                  ) : (
                    "Cancel Booking"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Information */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  {booking.productType === "AcademicService" ? (
                    <BookOpen className="w-5 h-5" />
                  ) : (
                    <GraduationCap className="w-5 h-5" />
                  )}
                  Booking Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Status
                    </Label>
                    <div className="mt-1">{getStatusBadge(booking.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Payment Status
                    </Label>
                    <div className="mt-1">
                      {getPaymentStatusBadge(booking.paymentStatus)}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-slate-700">
                    Purpose
                  </Label>
                  <p className="mt-1 text-slate-900">
                    {booking.bookingPurpose}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Start Time
                    </Label>
                    <p className="mt-1 text-slate-900">
                      {formatDateTime(booking.scheduleAt)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      End Time
                    </Label>
                    <p className="mt-1 text-slate-900">
                      {formatDateTime(booking.endAt)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Duration
                    </Label>
                    <p className="mt-1 text-slate-900">
                      {getDurationText(booking.durationInMinutes)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Session Length
                    </Label>
                    <p className="mt-1 text-slate-900">
                      {getDurationText(booking.minutesPerSession)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Participants
                    </Label>
                    <p className="mt-1 text-slate-900">
                      {booking.numberOfExpectedParticipants}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Participant Type
                    </Label>
                    <p className="mt-1 text-slate-900 capitalize">
                      {booking.participantType}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Platform Role
                    </Label>
                    <p className="mt-1 text-slate-900">
                      {booking.platformRole}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={booking.isClassroom} disabled />
                    <Label className="text-sm text-slate-700">
                      Classroom Session
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={booking.isSession} disabled />
                    <Label className="text-sm text-slate-700">
                      Individual Session
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participant Information */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <User className="w-5 h-5" />
                  Participant Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Name
                    </Label>
                    <p className="mt-1 text-slate-900">{booking.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Email
                    </Label>
                    <p className="mt-1 text-slate-900">{booking.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {(booking.userNotes || booking.internalNotes) && (
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <FileText className="w-5 h-5" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {booking.userNotes && (
                    <div>
                      <Label className="text-sm font-semibold text-slate-700">
                        User Notes
                      </Label>
                      <p className="mt-1 text-slate-900 bg-slate-50 p-3 rounded-lg">
                        {booking.userNotes}
                      </p>
                    </div>
                  )}
                  {booking.internalNotes && (
                    <div>
                      <Label className="text-sm font-semibold text-slate-700">
                        Internal Notes
                      </Label>
                      <p className="mt-1 text-slate-900 bg-slate-50 p-3 rounded-lg">
                        {booking.internalNotes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Cancellation Information */}
            {booking.cancellation && (
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <Trash2 className="w-5 h-5" />
                    Cancellation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Cancelled At
                    </Label>
                    <p className="mt-1 text-slate-900">
                      {formatDateTime(booking.cancellation.cancelledAt)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Reason
                    </Label>
                    <p className="mt-1 text-slate-900">
                      {booking.cancellation.reason}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructor Information */}
            {instructor && (
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <User className="w-5 h-5" />
                    Instructor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Name
                    </Label>
                    <p className="mt-1 text-slate-900">{instructor.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Email
                    </Label>
                    <p className="mt-1 text-slate-900">{instructor.email}</p>
                  </div>
                  {instructor.title && (
                    <div>
                      <Label className="text-sm font-semibold text-slate-700">
                        Title
                      </Label>
                      <p className="mt-1 text-slate-900">{instructor.title}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Product Information */}
            {product && (
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <BookOpen className="w-5 h-5" />
                    Service/Product
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Title
                    </Label>
                    <p className="mt-1 text-slate-900">{product.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Price
                    </Label>
                    <p className="mt-1 text-slate-900">${product.price}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Category
                    </Label>
                    <p className="mt-1 text-slate-900">{product.category}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Meeting Link */}
            {booking.meetingLink && (
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <Video className="w-5 h-5" />
                    Meeting Link
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    onClick={() => window.open(booking.meetingLink, "_blank")}
                    className="w-full flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Join Meeting
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Booking Metadata */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Calendar className="w-5 h-5" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-slate-700">
                    Created
                  </Label>
                  <p className="mt-1 text-slate-900">
                    {formatDateTime(booking.createdAt)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-700">
                    Last Updated
                  </Label>
                  <p className="mt-1 text-slate-900">
                    {formatDateTime(booking.updatedAt)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-700">
                    Booking ID
                  </Label>
                  <p className="mt-1 text-slate-900 font-mono text-sm">
                    {booking._id}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
