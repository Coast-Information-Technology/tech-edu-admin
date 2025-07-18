"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Download,
  Eye,
  CreditCard,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
  FileText,
  Receipt,
  Building2,
  User,
  CreditCard as CreditCardIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "completed" | "pending" | "failed" | "refunded" | "cancelled";
  total: number;
  currency: string;
  items: OrderItem[];
  paymentMethod: string;
  billingAddress: string;
  receiptUrl?: string;
  subscriptionId?: string;
  nextBillingDate?: string;
  autoRenew?: boolean;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: string;
  timeline: OrderTimeline[];
}

interface OrderItem {
  id: string;
  name: string;
  type: "course" | "subscription" | "service" | "template";
  price: number;
  quantity: number;
  image?: string;
  description: string;
}

interface OrderTimeline {
  id: string;
  date: string;
  status: string;
  description: string;
  icon: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    date: "2024-01-15T10:30:00Z",
    status: "completed",
    total: 299.99,
    currency: "GBP",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    customerPhone: "+44 7911 123456",
    items: [
      {
        id: "1",
        name: "Premium Career Development Course",
        type: "course",
        price: 199.99,
        quantity: 1,
        image: "/assets/courses.webp",
        description:
          "Comprehensive career development program with personalized coaching",
      },
      {
        id: "2",
        name: "Professional CV Template Pack",
        type: "template",
        price: 49.99,
        quantity: 1,
        image: "/assets/cv-building.webp",
        description: "10 professionally designed CV templates",
      },
      {
        id: "3",
        name: "Interview Preparation Guide",
        type: "service",
        price: 49.99,
        quantity: 1,
        image: "/assets/career-session.webp",
        description: "One-on-one interview preparation session",
      },
    ],
    paymentMethod: "Visa ending in 4242",
    billingAddress: "123 Main St, London, UK",
    receiptUrl: "/receipts/ORD-2024-001.pdf",
    subscriptionId: "sub_123456789",
    nextBillingDate: "2024-02-15T10:30:00Z",
    autoRenew: true,
    notes:
      "Customer requested expedited processing for urgent career transition.",
    timeline: [
      {
        id: "1",
        date: "2024-01-15T10:30:00Z",
        status: "Order Placed",
        description: "Order was successfully placed",
        icon: "CheckCircle",
      },
      {
        id: "2",
        date: "2024-01-15T10:32:00Z",
        status: "Payment Processed",
        description: "Payment was successfully processed",
        icon: "CreditCard",
      },
      {
        id: "3",
        date: "2024-01-15T10:35:00Z",
        status: "Order Confirmed",
        description: "Order has been confirmed and is being processed",
        icon: "CheckCircle",
      },
      {
        id: "4",
        date: "2024-01-15T11:00:00Z",
        status: "Completed",
        description: "Order has been completed successfully",
        icon: "CheckCircle",
      },
    ],
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    date: "2024-01-10T14:20:00Z",
    status: "completed",
    total: 99.99,
    currency: "GBP",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    items: [
      {
        id: "4",
        name: "Monthly Premium Subscription",
        type: "subscription",
        price: 99.99,
        quantity: 1,
        image: "/assets/premium-subscription.jpg",
        description: "Access to all premium features and resources",
      },
    ],
    paymentMethod: "Mastercard ending in 8888",
    billingAddress: "456 Oak Ave, Manchester, UK",
    receiptUrl: "/receipts/ORD-2024-002.pdf",
    subscriptionId: "sub_987654321",
    nextBillingDate: "2024-02-10T14:20:00Z",
    autoRenew: true,
    timeline: [
      {
        id: "1",
        date: "2024-01-10T14:20:00Z",
        status: "Order Placed",
        description: "Subscription order was placed",
        icon: "CheckCircle",
      },
      {
        id: "2",
        date: "2024-01-10T14:22:00Z",
        status: "Payment Processed",
        description: "Payment was successfully processed",
        icon: "CreditCard",
      },
      {
        id: "3",
        date: "2024-01-10T14:25:00Z",
        status: "Subscription Activated",
        description: "Premium subscription has been activated",
        icon: "CheckCircle",
      },
    ],
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    date: "2024-01-05T09:15:00Z",
    status: "pending",
    total: 149.99,
    currency: "GBP",
    customerName: "Mike Chen",
    customerEmail: "mike.chen@email.com",
    items: [
      {
        id: "5",
        name: "Career Coaching Session",
        type: "service",
        price: 149.99,
        quantity: 1,
        image: "/assets/coaching.webp",
        description: "60-minute career coaching session with expert",
      },
    ],
    paymentMethod: "PayPal",
    billingAddress: "789 Pine St, Birmingham, UK",
    timeline: [
      {
        id: "1",
        date: "2024-01-05T09:15:00Z",
        status: "Order Placed",
        description: "Order was placed but payment is pending",
        icon: "Clock",
      },
    ],
  },
];

export default function SingleOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      const resolvedParams = await params;
      const foundOrder = mockOrders.find((o) => o.id === resolvedParams.id);
      setOrder(foundOrder || null);
      setLoading(false);
    };

    loadOrder();
  }, [params]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      case "refunded":
        return <RefreshCw className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTimelineIcon = (iconName: string) => {
    switch (iconName) {
      case "CheckCircle":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "CreditCard":
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case "Clock":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "XCircle":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Order not found
          </h3>
          <p className="text-gray-600 mb-4">
            The order you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/dashboard/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#011F72]">
              {order.orderNumber}
            </h1>
            <p className="text-gray-600">Order Details</p>
          </div>
        </div>
        <div className="flex gap-3">
          {order.receiptUrl && (
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          )}
          {order.status === "pending" && (
            <Button className="text-white hover:text-black">
              <CreditCard className="w-4 h-4 mr-2" />
              Complete Payment
            </Button>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium">{formatDate(order.date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1">
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {formatCurrency(order.total, order.currency)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border rounded-[10px]"
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded-[10px] object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-[#011F72]">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#011F72]">
                      {formatCurrency(item.price, order.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-gray-600">Customer</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">{order.customerEmail}</p>
                  <p className="text-sm text-gray-600">Email</p>
                </div>
              </div>
              {order.customerPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{order.customerPhone}</p>
                    <p className="text-sm text-gray-600">Phone</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">{order.billingAddress}</p>
                  <p className="text-sm text-gray-600">Billing Address</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <CreditCardIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">{order.paymentMethod}</p>
                  <p className="text-sm text-gray-600">Payment Method</p>
                </div>
              </div>
              {order.subscriptionId && (
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{order.subscriptionId}</p>
                    <p className="text-sm text-gray-600">Subscription ID</p>
                  </div>
                </div>
              )}
              {order.nextBillingDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">
                      {formatDate(order.nextBillingDate)}
                    </p>
                    <p className="text-sm text-gray-600">Next Billing Date</p>
                  </div>
                </div>
              )}
              {order.autoRenew !== undefined && (
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">
                      {order.autoRenew ? "Enabled" : "Disabled"}
                    </p>
                    <p className="text-sm text-gray-600">Auto-Renew</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.timeline.map((event, index) => (
              <div key={event.id} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getTimelineIcon(event.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-[#011F72]">
                      {event.status}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {event.description}
                  </p>
                </div>
                {index < order.timeline.length - 1 && (
                  <div className="absolute left-6 top-8 w-0.5 h-8 bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {order.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{order.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
