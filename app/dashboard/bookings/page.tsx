"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  User,
  BookOpen,
  Video,
  Users,
  MapPin,
} from "lucide-react";
import { getApiRequest, deleteApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";

interface Booking {
  _id: string;
  productId: {
    _id: string;
    service: string;
    productType:
      | "Training & Certification"
      | "Academic Support Services"
      | "Career Development & Mentorship"
      | "Institutional & Team Services"
      | "AI-Powered or Automation Services"
      | "Recruitment & Job Matching"
      | "Marketing, Consultation & Free Services";
    price: number;
  };
  productType:
    | "Training & Certification"
    | "Academic Support Services"
    | "Career Development & Mentorship"
    | "Institutional & Team Services"
    | "AI-Powered or Automation Services"
    | "Recruitment & Job Matching"
    | "Marketing, Consultation & Free Services";
  instructorId: {
    _id: string;
    fullName: string;
    email: string;
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
  meetingLink?: string;
  userNotes?: string;
  internalNotes?: string;
  attachments?: string[];
  participantType:
    | "individual"
    | "team"
    | "institution"
    | "recruiter"
    | "visitor";
  platformRole: string;
  email: string;
  fullName: string;
  createdBy: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      const response = await getApiRequest("/api/bookings/admin/all", token);
      if (response?.data?.success) {
        const bookingsData = response.data.data || [];
        setBookings(bookingsData);
      } else {
        console.error("Failed to fetch bookings:", response?.data?.message);
        toast.error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setCancellingId(bookingId);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      const response = await deleteApiRequest(
        `/api/bookings/${bookingId}/cancel`,
        token
      );
      if (response?.data?.success) {
        toast.success("Booking cancelled successfully");
        fetchBookings(); // Refresh the list
      } else {
        toast.error(response?.data?.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Error cancelling booking");
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingPurpose.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    const matchesType =
      typeFilter === "all" || booking.productType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

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
      month: "short",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Bookings Management
            </h1>
            <p className="text-slate-600">
              Manage all academic and training bookings
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-3">
            <Button
              onClick={fetchBookings}
              disabled={loading}
              className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-2">
                <RefreshCw
                  className={`w-4 h-4 ${
                    loading
                      ? "animate-spin"
                      : "group-hover:rotate-180 transition-transform duration-300"
                  }`}
                />
                Refresh
              </span>
            </Button>
            <div className="flex flex-col lg:flex-row gap-3">
              <Link href="/dashboard/bookings/academic/new">
                <Button className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full">
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                    Academic Session
                  </span>
                </Button>
              </Link>
              <Link href="/dashboard/bookings/training/new">
                <Button className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full">
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                    Training Program
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {bookings.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {bookings.filter((b) => b.status === "pending").length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Confirmed
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {bookings.filter((b) => b.status === "confirmed").length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {bookings.filter((b) => b.status === "completed").length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Training & Certification">
                    Training & Certification
                  </SelectItem>
                  <SelectItem value="Academic Support Services">
                    Academic Support Services
                  </SelectItem>
                  <SelectItem value="Career Development & Mentorship">
                    Career Development & Mentorship
                  </SelectItem>
                  <SelectItem value="Institutional & Team Services">
                    Institutional & Team Services
                  </SelectItem>
                  <SelectItem value="AI-Powered or Automation Services">
                    AI-Powered or Automation Services
                  </SelectItem>
                  <SelectItem value="Recruitment & Job Matching">
                    Recruitment & Job Matching
                  </SelectItem>
                  <SelectItem value="Marketing, Consultation & Free Services">
                    Marketing, Consultation & Free Services
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        {loading ? (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12">
              <div className="flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-slate-600">Loading bookings...</span>
              </div>
            </CardContent>
          </Card>
        ) : filteredBookings.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No bookings found
                </h3>
                <p className="text-slate-600 mb-6">
                  {bookings.length === 0
                    ? "No bookings have been created yet."
                    : "No bookings match your current filters."}
                </p>
                <Link href="/dashboard/bookings/academic/new">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Booking
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <Card
                key={booking._id}
                className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-slate-900 mb-2">
                        {booking.bookingPurpose}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">
                          {booking.fullName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            booking.productType === "Academic Support Services"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {booking.productType === "Academic Support Services"
                            ? "Academic"
                            : booking.productType === "Training & Certification"
                            ? "Training"
                            : booking.productType}
                        </Badge>
                        {getStatusBadge(booking.status)}
                        {getPaymentStatusBadge(booking.paymentStatus)}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDateTime(booking.scheduleAt)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>{getDurationText(booking.durationInMinutes)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>
                      {booking.numberOfExpectedParticipants} participant
                      {booking.numberOfExpectedParticipants !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {booking.meetingLink && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Video className="w-4 h-4" />
                      <span className="truncate">Meeting link available</span>
                    </div>
                  )}

                  {booking.userNotes && (
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                      <p className="font-medium mb-1">Notes:</p>
                      <p className="line-clamp-2">{booking.userNotes}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                    <Link href={`/dashboard/bookings/${booking._id}`}>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/dashboard/bookings/${booking._id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={
                        cancellingId === booking._id ||
                        booking.status === "cancelled"
                      }
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {cancellingId === booking._id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
