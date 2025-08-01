"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiRequestWithRefresh } from "@/lib/apiFetch";
// Payment interface
interface Payment {
  _id: string;
  userId: string;
  provider: string;
  transactionId: string;
  amount: number;
  status: string;
  currency: string;
  productId: string;
  jobApplicationId?: string;
  bookingId?: string;
  stripeProductId?: string;
  stripePriceId?: string;
  couponCode?: string;
  clientSecret?: string;
  metadata?: Record<string, any>;
  webhookReceived: boolean;
  receiptUrl?: string;
  productType: string;
  bookingService?: string;
  platformRole: string;
  profileId?: string;
  isSession: boolean;
  isClassroom: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdAt: string;
  updatedAt: string;
}
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CreditCard,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Receipt,
  Tag,
  User,
  Package,
  Building,
  BookOpen,
  Users,
  Target,
  Megaphone,
  Handshake,
} from "lucide-react";
import { toast } from "react-toastify";

export default function PaymentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.id as string;

  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPayment = async () => {
    try {
      setLoading(true);
      const response = await getApiRequestWithRefresh(
        `/api/payments/${paymentId}`
      );

      if (response.data && response.data.success) {
        setPayment(response.data.data);
      } else {
        toast.error("Failed to fetch payment details");
        router.push("/dashboard/payments");
      }
    } catch (error) {
      console.error("Error fetching payment:", error);
      toast.error("Failed to fetch payment details");
      router.push("/dashboard/payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paymentId) {
      fetchPayment();
    }
  }, [paymentId]);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      success: "default",
      failed: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    );
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "stripe":
        return <CreditCard className="w-5 h-5" />;
      case "flutterwave":
        return <TrendingUp className="w-5 h-5" />;
      case "paystack":
        return <DollarSign className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getProductTypeIcon = (productType: string) => {
    switch (productType) {
      case "Training & Certification":
        return <BookOpen className="w-5 h-5" />;
      case "Academic Support Services":
        return <Building className="w-5 h-5" />;
      case "Career Development & Mentorship":
        return <Target className="w-5 h-5" />;
      case "Institutional & Team Services":
        return <Users className="w-5 h-5" />;
      case "AI-Powered or Automation Services":
        return <TrendingUp className="w-5 h-5" />;
      case "Recruitment & Job Matching":
        return <User className="w-5 h-5" />;
      case "Marketing":
        return <Megaphone className="w-5 h-5" />;
      case "Consultation & Free Services":
        return <Handshake className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount / 100); // Assuming amount is in cents
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/90 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <p className="mt-4 text-lg font-medium text-slate-700">
                Loading payment details...
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Please wait while we fetch the payment information
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/90 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="text-center py-24">
            <div className="bg-white/70 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-12 max-w-md mx-auto">
              <CreditCard className="mx-auto h-16 w-16 text-slate-400 mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Payment Not Found
              </h3>
              <p className="text-slate-600 mb-6">
                The payment you're looking for doesn't exist or you don't have
                access to it.
              </p>
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                onClick={() => router.push("/dashboard/payments")}
              >
                View All Payments
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/90 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Payments
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Payment Details
              </h1>
              <p className="text-slate-600 mt-1">
                Transaction ID:{" "}
                <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">
                  {payment.transactionId}
                </span>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {payment.receiptUrl && (
              <Button
                variant="outline"
                asChild
                className="bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/90 transition-all duration-200"
              >
                <a
                  href={payment.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  View Receipt
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/90 transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Payment Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Overview */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="border-b border-slate-200/50">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Payment Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Amount
                    </label>
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(payment.amount, payment.currency)}
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                      {payment.currency}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Status
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(payment.status)}
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Provider
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      {getProviderIcon(payment.provider)}
                      <span className="capitalize font-semibold text-slate-900">
                        {payment.provider}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Product Type
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      {getProductTypeIcon(payment.productType)}
                      <span className="font-semibold text-slate-900">
                        {payment.productType}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Details */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="border-b border-slate-200/50">
                <CardTitle className="text-slate-900">
                  Transaction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Transaction ID
                    </label>
                    <p className="font-mono text-sm bg-slate-100 p-3 rounded-xl mt-1 border border-slate-200">
                      {payment.transactionId}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Payment ID
                    </label>
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">
                      {payment._id}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Product ID
                    </label>
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">
                      {payment.productId}
                    </p>
                  </div>
                  {payment.bookingId && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Booking ID
                      </label>
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">
                        {payment.bookingId}
                      </p>
                    </div>
                  )}
                </div>

                {payment.jobApplicationId && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Job Application ID
                    </label>
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">
                      {payment.jobApplicationId}
                    </p>
                  </div>
                )}

                {payment.couponCode && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Coupon Code
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{payment.couponCode}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="border-b border-slate-200/50">
                <CardTitle className="text-slate-900">
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Platform Role
                    </label>
                    <p className="font-semibold text-slate-900 mt-1">
                      {payment.platformRole}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Webhook Received
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      {payment.webhookReceived ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span>{payment.webhookReceived ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>

                {payment.bookingService && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Booking Service
                    </label>
                    <p className="font-medium mt-1">{payment.bookingService}</p>
                  </div>
                )}

                {payment.profileId && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Profile ID
                    </label>
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">
                      {payment.profileId}
                    </p>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Is Session
                    </label>
                    <p className="font-medium mt-1">
                      {payment.isSession ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Is Classroom
                    </label>
                    <p className="font-medium mt-1">
                      {payment.isClassroom ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timestamps */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="border-b border-slate-200/50">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Timestamps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Created
                  </label>
                  <p className="text-sm mt-1">
                    {formatDate(payment.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Updated
                  </label>
                  <p className="text-sm mt-1">
                    {formatDate(payment.updatedAt)}
                  </p>
                </div>
                {payment.deletedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Deleted
                    </label>
                    <p className="text-sm mt-1">
                      {formatDate(payment.deletedAt)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stripe Details (if applicable) */}
            {(payment.stripeProductId || payment.stripePriceId) && (
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="border-b border-slate-200/50">
                  <CardTitle className="text-slate-900">
                    Stripe Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {payment.stripeProductId && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Product ID
                      </label>
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">
                        {payment.stripeProductId}
                      </p>
                    </div>
                  )}
                  {payment.stripePriceId && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Price ID
                      </label>
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">
                        {payment.stripePriceId}
                      </p>
                    </div>
                  )}
                  {payment.clientSecret && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Client Secret
                      </label>
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded mt-1 truncate">
                        {payment.clientSecret}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            {payment.metadata && Object.keys(payment.metadata).length > 0 && (
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="border-b border-slate-200/50">
                  <CardTitle className="text-slate-900">Metadata</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-slate-100 p-4 rounded-xl overflow-auto border border-slate-200">
                    {JSON.stringify(payment.metadata, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
