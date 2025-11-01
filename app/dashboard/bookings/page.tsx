"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Booking } from "@/types/booking";
import safeConsole from "@/lib/console";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [nonBookableItems, setNonBookableItems] = useState<any[]>([]);
  const [loadingNonBookable, setLoadingNonBookable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [schedulingStatusFilter, setSchedulingStatusFilter] =
    useState<string>("all");
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
        safeConsole.error("Failed to fetch bookings:", response?.data?.message);
        toast.error(
          process.env.NEXT_PUBLIC_NODE_ENV === "production"
            ? "Something went wrong"
            : "Failed to fetch bookings"
        );
      }
    } catch (error) {
      safeConsole.error("Error fetching bookings:", error);
      toast.error(
        process.env.NEXT_PUBLIC_NODE_ENV === "production"
          ? "Something went wrong"
          : "Error fetching bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchNonBookableServices = async () => {
    setLoadingNonBookable(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      const response = await getApiRequest(
        "/api/non-bookable-services/admin/all",
        token
      );

      if (response?.data?.success) {
        const items = response?.data?.data?.items || [];
        setNonBookableItems(items);
      } else {
        safeConsole.error(
          "Failed to fetch non-bookable services:",
          response?.data?.message
        );
        toast.error(
          process.env.NEXT_PUBLIC_NODE_ENV === "production"
            ? "Something went wrong"
            : "Failed to fetch non-bookable services"
        );
      }
    } catch (error) {
      safeConsole.error("Error fetching non-bookable services:", error);
      toast.error(
        process.env.NEXT_PUBLIC_NODE_ENV === "production"
          ? "Something went wrong"
          : "Error fetching non-bookable services"
      );
    } finally {
      setLoadingNonBookable(false);
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
        toast.error(
          process.env.NEXT_PUBLIC_NODE_ENV === "production"
            ? "Failed to cancel booking"
            : response?.data?.message || "Failed to cancel booking"
        );
      }
    } catch (error) {
      safeConsole.error("Error cancelling booking:", error);
      toast.error(
        process.env.NEXT_PUBLIC_NODE_ENV === "production"
          ? "Something went wrong"
          : "Error cancelling booking"
      );
    } finally {
      setCancellingId(null);
    }
  };

  // Helper functions to work with both old and new API structures
  const getBookingId = (b: any) => b?.id || b?._id || "";
  const getProductName = (b: any) => 
    b?.product?.name || 
    b?.productId?.service || 
    b?.bookingPurpose || 
    "—";
  const getProductType = (b: any) => 
    b?.product?.type || 
    b?.productType || 
    "—";
  const getInstructorName = (b: any) => 
    b?.instructor?.fullName || 
    b?.instructorId?.fullName || 
    "—";
  const getInstructorEmail = (b: any) => 
    b?.instructor?.email || 
    b?.instructorId?.email || 
    "—";
  const getBookingStatus = (b: any) => 
    b?.status?.booking || 
    b?.status || 
    "pending";
  const getPaymentStatus = (b: any) => 
    b?.status?.payment || 
    b?.paymentStatus || 
    "unpaid";
  const getSchedulingStatus = (b: any) => 
    b?.status?.scheduling || 
    b?.schedulingStatus || 
    null;
  const getScheduleDate = (b: any) => 
    b?.schedule?.confirmed?.start || 
    b?.scheduleAt || 
    null;
  const getDuration = (b: any) => 
    b?.schedule?.minutesPerSession || 
    b?.durationInMinutes || 
    0;
  const getParticipantCount = (b: any) => 
    b?.participants?.length || 
    b?.numberOfExpectedParticipants || 
    0;
  const getScheduleKind = (b: any) => 
    (b?.schedule?.kind === "classroom" || 
    b?.isClassroom) ? "Classroom" : "Session";
  const isCancelled = (b: any) => 
    b?.cancellation?.isCancelled || 
    b?.status === "cancelled" || 
    getBookingStatus(b) === "cancelled";

  const getCustomerName = (b: any) =>
    b?.participants?.[0]?.fullName ||
    b?.audit?.createdBy?.fullName ||
    b?.fullName || 
    b?.createdBy?.fullName || 
    b?.bookingSchedulerFullName || 
    "—";

  const getCustomerEmail = (b: any) =>
    b?.participants?.[0]?.email ||
    b?.audit?.createdBy?.email ||
    b?.email || 
    b?.createdBy?.email || 
    b?.bookingSchedulerEmail || 
    "—";

  const filteredBookings = bookings.filter((booking) => {
    const b: any = booking;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (getCustomerName(b).toLowerCase() || "").includes(searchLower) ||
      (getCustomerEmail(b).toLowerCase() || "").includes(searchLower) ||
      (getProductName(b).toLowerCase() || "").includes(searchLower) ||
      (getInstructorName(b).toLowerCase() || "").includes(searchLower) ||
      (getInstructorEmail(b).toLowerCase() || "").includes(searchLower) ||
      (b.audit?.createdBy?.fullName?.toLowerCase() || "").includes(searchLower) ||
      (b.audit?.createdBy?.email?.toLowerCase() || "").includes(searchLower) ||
      (b.createdBy?.fullName?.toLowerCase() || "").includes(searchLower) ||
      (b.createdBy?.email?.toLowerCase() || "").includes(searchLower) ||
      (b.bookingSchedulerFullName?.toLowerCase() || "").includes(searchLower) ||
      (b.bookingSchedulerEmail?.toLowerCase() || "").includes(searchLower) ||
      (b.bookingPurpose?.toLowerCase() || "").includes(searchLower);

    const matchesStatus =
      statusFilter === "all" || getBookingStatus(b) === statusFilter;
    const matchesType =
      typeFilter === "all" || getProductType(b) === typeFilter;
    const matchesSchedulingStatus =
      schedulingStatusFilter === "all" ||
      (getSchedulingStatus(b) &&
        getSchedulingStatus(b) === schedulingStatusFilter);

    return (
      matchesSearch && matchesStatus && matchesType && matchesSchedulingStatus
    );
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

  const getSchedulingStatusBadge = (status: string) => {
    if (!status) return null;

    const statusConfig: { [key: string]: { color: string; label: string } } = {
      "eligible-to-schedule": {
        color: "bg-green-100 text-green-800",
        label: "Eligible",
      },
      scheduled: { color: "bg-blue-100 text-blue-800", label: "Scheduled" },
      "not-eligible": {
        color: "bg-red-100 text-red-800",
        label: "Not Eligible",
      },
      "pending-approval": {
        color: "bg-yellow-100 text-yellow-800",
        label: "Pending Approval",
      },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };
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
            <p className="text-slate-600">Manage all bookings</p>
          </div>
          <Button
            onClick={() => {
              fetchBookings();
              fetchNonBookableServices();
            }}
            disabled={loading || loadingNonBookable}
            className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-2">
              <RefreshCw
                className={`w-4 h-4 ${
                  loading || loadingNonBookable
                    ? "animate-spin"
                    : "group-hover:rotate-180 transition-transform duration-300"
                }`}
              />
              Refresh
            </span>
          </Button>
        </div>

        <Tabs defaultValue="bookable" onValueChange={(val) => {
          if (val === "non-bookable" && nonBookableItems.length === 0) {
            fetchNonBookableServices();
          }
        }}>
          <TabsList>
            <TabsTrigger
              value="bookable"
              className="px-4 py-4 rounded-[6px] data-[state=active]:bg-blue-700 data-[state=active]:text-white"
            >
              Bookable Services
            </TabsTrigger>
            <TabsTrigger
              value="non-bookable"
              className="px-4 py-4 rounded-[6px] data-[state=active]:bg-blue-700 data-[state=active]:text-white"
            >
              Non-Bookable Services
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookable">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg mt-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <SelectContent className="bg-white">
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
                <SelectContent className="bg-white">
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

              <Select
                value={schedulingStatusFilter}
                onValueChange={setSchedulingStatusFilter}
              >
                <SelectTrigger className="bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <SelectValue placeholder="Filter by scheduling status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Scheduling Status</SelectItem>
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
          </CardContent>
        </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg mt-4">
              <CardContent className="p-0">
        {loading ? (
                  <div className="p-8 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-3 text-slate-600">Loading bookings...</span>
              </div>
        ) : filteredBookings.length === 0 ? (
                  <div className="p-8 text-center">
                    <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600">
                  {bookings.length === 0
                    ? "No bookings have been created yet."
                    : "No bookings match your current filters."}
                </p>
              </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Schedule</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Participants</TableHead>
                          <TableHead>Mode</TableHead>
                          <TableHead>Instructor</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
            {filteredBookings.map((booking) => {
              const b: any = booking;
              const bookingId = getBookingId(b);
              return (
                          <TableRow key={bookingId}>
                            <TableCell className="min-w-[200px]">
                              <div className="font-medium text-slate-900 line-clamp-1">
                                {getProductName(b)}
                              </div>
                              <div className="mt-1 flex items-center gap-2 flex-wrap">
                                <Badge variant={
                            getProductType(b) === "Academic Support Services"
                              ? "default"
                              : "secondary"
                                }>
                          {getProductType(b) === "Academic Support Services"
                            ? "Academic"
                            : getProductType(b) === "Training & Certification"
                            ? "Training"
                            : getProductType(b)}
                        </Badge>
                      </div>
                            </TableCell>
                            <TableCell className="min-w-[180px]">
                              <div className="font-medium">{getCustomerName(b)}</div>
                              <div className="text-xs text-slate-500 line-clamp-1">{getCustomerEmail(b)}</div>
                            </TableCell>
                            <TableCell>{getProductType(b)}</TableCell>
                            <TableCell className="min-w-[140px]">{getStatusBadge(getBookingStatus(b))}</TableCell>
                            <TableCell className="min-w-[120px]">{getPaymentStatusBadge(getPaymentStatus(b))}</TableCell>
                            <TableCell className="min-w-[180px]">
                              {getScheduleDate(b) ? formatDateTime(getScheduleDate(b)) : "—"}
                            </TableCell>
                            <TableCell>{getDurationText(getDuration(b))}</TableCell>
                            <TableCell>
                              {getParticipantCount(b)}
                            </TableCell>
                            <TableCell className="min-w-[140px]">
                              {getScheduleKind(b)}
                            </TableCell>
                            <TableCell className="min-w-[160px]">
                              {getInstructorName(b)}
                            </TableCell>
                            <TableCell className="text-right min-w-[160px]">
                              <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/bookings/${bookingId}`}>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/bookings/${bookingId}/edit`}>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancelBooking(bookingId)}
                                  disabled={cancellingId === bookingId || isCancelled(b)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {cancellingId === bookingId ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                            </TableCell>
                          </TableRow>
            );
            })}
                      </TableBody>
                    </Table>
          </div>
        )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="non-bookable">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg mt-8">
              <CardHeader>
                <CardTitle className="text-lg">Non-Bookable Services</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loadingNonBookable ? (
                  <div className="p-8 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="ml-3 text-slate-600">Loading services...</span>
                  </div>
                ) : nonBookableItems.length === 0 ? (
                  <div className="p-8 text-center">
                    <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600">No non-bookable services found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product Type</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Media</TableHead>
                          <TableHead>Pricing</TableHead>
                          <TableHead>Enabled</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {nonBookableItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell className="min-w-[200px]">{item.productType}</TableCell>
                            <TableCell className="min-w-[220px] font-medium">{item.service}</TableCell>
                            <TableCell className="min-w-[260px] text-slate-600 line-clamp-2">{item.description}</TableCell>
                            <TableCell className="capitalize">{item.mediaType || "—"}</TableCell>
                            <TableCell className="min-w-[220px]">
                              <div className="text-sm">
                                <span className="font-medium uppercase mr-2">{item.pricing?.currency || ""}</span>
                                {typeof item.pricing?.basePrice === "number" ? item.pricing.basePrice.toFixed(2) : "—"}
                              </div>
                              <div className="text-xs text-slate-500">
                                {item.pricing?.model || ""} • {item.pricing?.priceBasis || ""}
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.enabled ? (
                                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800">Disabled</Badge>
                              )}
                            </TableCell>
                            <TableCell className="min-w-[180px]">
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                            </TableCell>
                            <TableCell className="text-right min-w-[140px]">
                              <div className="flex justify-end gap-2">
                                <Link href={`/dashboard/non-bookable-services/${item._id}`}>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <Link href={`/dashboard/non-bookable-services/${item._id}/edit`}>
                                  <Button size="sm" variant="outline">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </Link>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
        </div>
      )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
