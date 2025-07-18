"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Receipt,
  RefreshCw,
  FileText,
  CreditCard as CreditCardIcon,
  Building2,
  User,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Image from "next/image";

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

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    date: "2024-01-15T10:30:00Z",
    status: "completed",
    total: 299.99,
    currency: "GBP",
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
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    date: "2024-01-10T14:20:00Z",
    status: "completed",
    total: 99.99,
    currency: "GBP",
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
    billingAddress: "123 Main St, London, UK",
    receiptUrl: "/receipts/ORD-2024-002.pdf",
    subscriptionId: "sub_987654321",
    nextBillingDate: "2024-02-10T14:20:00Z",
    autoRenew: true,
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    date: "2024-01-05T09:15:00Z",
    status: "pending",
    total: 149.99,
    currency: "GBP",
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
    billingAddress: "123 Main St, London, UK",
  },
  {
    id: "4",
    orderNumber: "ORD-2023-015",
    date: "2023-12-20T16:45:00Z",
    status: "refunded",
    total: 79.99,
    currency: "GBP",
    items: [
      {
        id: "6",
        name: "Resume Review Service",
        type: "service",
        price: 79.99,
        quantity: 1,
        image: "/assets/cv-review.webp",
        description: "Professional resume review and feedback",
      },
    ],
    paymentMethod: "Visa ending in 4242",
    billingAddress: "123 Main St, London, UK",
    receiptUrl: "/receipts/ORD-2023-015.pdf",
  },
  {
    id: "5",
    orderNumber: "ORD-2023-012",
    date: "2023-11-15T11:30:00Z",
    status: "failed",
    total: 199.99,
    currency: "GBP",
    items: [
      {
        id: "7",
        name: "Advanced Interview Skills Course",
        type: "course",
        price: 199.99,
        quantity: 1,
        image: "/assets/interview-course.jpg",
        description: "Advanced interview preparation and techniques",
      },
    ],
    paymentMethod: "Mastercard ending in 8888",
    billingAddress: "123 Main St, London, UK",
  },
];

const CARD_ICONS = {
  Visa: "/icons/visa.png",
  Mastercard: "/icons/mastercard.png",
  "American Express": "/icons/amex.png",
  Unknown: "/icons/card.png",
};

function detectCardType(number: string) {
  const cleaned = number.replace(/\D/g, "");
  if (/^4[0-9]{0,}$/.test(cleaned)) return "Visa";
  if (/^(5[1-5][0-9]{0,}|2[2-7][0-9]{0,})$/.test(cleaned)) return "Mastercard";
  if (/^3[47][0-9]{0,}$/.test(cleaned)) return "American Express";
  return "Unknown";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "pm_1",
      type: "Visa",
      last4: "4242",
      expiry: "12/25",
      isDefault: true,
      iconColor: "text-blue-600",
    },
    {
      id: "pm_2",
      type: "Mastercard",
      last4: "8888",
      expiry: "08/24",
      isDefault: false,
      iconColor: "text-red-600",
    },
  ]);

  const [billingAddress, setBillingAddress] = useState({
    line1: "123 Main St",
    city: "London",
    country: "UK",
    postcode: "SW1A 1AA",
  });

  const [isAddPaymentMethodOpen, setIsAddPaymentMethodOpen] = useState(false);
  const [isUpdateAddressOpen, setIsUpdateAddressOpen] = useState(false);

  const [newAddress, setNewAddress] = useState(billingAddress);

  const [cardNumber, setCardNumber] = useState("");
  const detectedType = detectCardType(cardNumber);

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((pm) => ({ ...pm, isDefault: pm.id === id }))
    );
  };

  const handleAddPaymentMethod = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newPm = {
      id: `pm_${Date.now()}`,
      type: detectedType,
      last4: cardNumber.slice(-4),
      expiry: formData.get("expiry") as string,
      isDefault: paymentMethods.length === 0,
      iconColor: "text-gray-600",
    };
    setPaymentMethods([...paymentMethods, newPm]);
    setIsAddPaymentMethodOpen(false);
    setCardNumber("");
  };

  const handleUpdateAddress = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updatedAddress = {
      line1: formData.get("line1") as string,
      city: formData.get("city") as string,
      country: formData.get("country") as string,
      postcode: formData.get("postcode") as string,
    };
    setBillingAddress(updatedAddress);
    setIsUpdateAddressOpen(false);
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== "all") {
      const orderDate = new Date(order.date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - orderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (dateFilter) {
        case "7days":
          matchesDate = diffDays <= 7;
          break;
        case "30days":
          matchesDate = diffDays <= 30;
          break;
        case "90days":
          matchesDate = diffDays <= 90;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case "date":
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case "total":
        aValue = a.total;
        bValue = b.total;
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "orderNumber":
        aValue = a.orderNumber;
        bValue = b.orderNumber;
        break;
      default:
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalSpent = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.total, 0);

  const activeSubscriptions = orders.filter(
    (order) =>
      order.subscriptionId && order.status === "completed" && order.autoRenew
  );

  const pendingPayments = orders.filter((order) => order.status === "pending");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">
            Orders & Payments
          </h1>
          <p className="text-gray-600 mt-1">
            View your order history, payment status, and manage subscriptions
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Orders
          </Button>
          <Button className="text-white hover:text-black">
            <CreditCard className="w-4 h-4 mr-2" />
            Payment Methods
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <Receipt className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {orders.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-[10px]">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {formatCurrency(totalSpent, "GBP")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {activeSubscriptions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-[10px]">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {pendingPayments.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-transparent border-b border-gray-200">
          <TabsTrigger
            value="orders"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
          >
            Order History
          </TabsTrigger>
          <TabsTrigger
            value="subscriptions"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
          >
            Subscriptions
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
          >
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40 lg:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-[10px]">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full md:w-40 lg:w-48">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-[10px]">
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("orderNumber")}
                          className="flex items-center gap-1 hover:text-gray-700"
                        >
                          Order Number
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("date")}
                          className="flex items-center gap-1 hover:text-gray-700"
                        >
                          Date
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("total")}
                          className="flex items-center gap-1 hover:text-gray-700"
                        >
                          Total
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("status")}
                          className="flex items-center gap-1 hover:text-gray-700"
                        >
                          Status
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[#011F72]">
                            {order.orderNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(order.date)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.items.length} item
                            {order.items.length !== 1 ? "s" : ""}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.items[0]?.name}
                            {order.items.length > 1 &&
                              ` +${order.items.length - 1} more`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(order.total, order.currency)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.paymentMethod}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/orders/${order.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            {order.receiptUrl && (
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                            {order.status === "pending" && (
                              <Button
                                size="sm"
                                className="text-white hover:text-black"
                              >
                                <CreditCard className="w-4 h-4 mr-1" />
                                Pay
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {sortedOrders.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setDateFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <div className="space-y-4">
            {activeSubscriptions.map((order) => (
              <Card key={order.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#011F72] mb-1">
                        {order.items[0]?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Subscription ID: {order.subscriptionId}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Active
                      </Badge>
                      <span className="text-lg font-bold text-[#011F72]">
                        {formatCurrency(order.total, order.currency)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Next Billing Date</p>
                      <p className="font-medium">
                        {formatDate(order.nextBillingDate!)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium">{order.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Auto-Renew</p>
                      <p className="font-medium">
                        {order.autoRenew ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:flex-col">
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      View Billing History
                    </Button>
                    <Button variant="outline" size="sm">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Update Payment Method
                    </Button>
                    <Button variant="outline" size="sm">
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {activeSubscriptions.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No active subscriptions
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You don't have any active subscriptions at the moment.
                  </p>
                  <Button>
                    <Package className="w-4 h-4 mr-2" />
                    Browse Plans
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    className="flex items-center justify-between p-3 border rounded-[10px]"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCardIcon className={`w-6 h-6 ${pm.iconColor}`} />
                      <div>
                        <p className="font-medium">
                          {pm.type} ending in {pm.last4}
                        </p>
                        <p className="text-sm text-gray-600">
                          Expires {pm.expiry}
                        </p>
                      </div>
                    </div>
                    {pm.isDefault ? (
                      <Badge className="bg-green-100 text-green-800">
                        Default
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(pm.id)}
                      >
                        Set Default
                      </Button>
                    )}
                  </div>
                ))}

                <Dialog
                  open={isAddPaymentMethodOpen}
                  onOpenChange={setIsAddPaymentMethodOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full text-white hover:text-black rounded-[10px]">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white rounded-[10px]">
                    <DialogHeader>
                      <DialogTitle>Add a new payment method</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddPaymentMethod}>
                      <div className="grid gap-4 py-4">
                        {/* Card icons row */}
                        <div className="flex gap-4 items-center mb-2">
                          <Image
                            src={CARD_ICONS["Visa"]}
                            alt="Visa"
                            width={32}
                            height={20}
                          />
                          <Image
                            src={CARD_ICONS["Mastercard"]}
                            alt="Mastercard"
                            width={32}
                            height={20}
                          />
                          <Image
                            src={CARD_ICONS["American Express"]}
                            alt="Amex"
                            width={32}
                            height={20}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 relative">
                          <Label htmlFor="cardNumber" className="text-right">
                            Card Number
                          </Label>
                          <div className="col-span-3 relative">
                            <Input
                              id="cardNumber"
                              name="cardNumber"
                              placeholder="**** **** **** 1234"
                              className="pr-12"
                              required
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              autoComplete="cc-number"
                              maxLength={19}
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2">
                              <Image
                                src={
                                  CARD_ICONS[detectedType] ||
                                  CARD_ICONS["Unknown"]
                                }
                                alt={detectedType}
                                width={28}
                                height={18}
                              />
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="expiry" className="text-right">
                            Expiry Date
                          </Label>
                          <Input
                            id="expiry"
                            name="expiry"
                            placeholder="MM/YY"
                            className="col-span-3"
                            required
                            autoComplete="cc-exp"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="cvc" className="text-right">
                            CVC
                          </Label>
                          <Input
                            id="cvc"
                            name="cvc"
                            placeholder="123"
                            className="col-span-3"
                            required
                            autoComplete="cc-csc"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          className="text-white hover:text-black"
                          type="submit"
                        >
                          Submit
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-[10px]">
                    <p className="font-medium">Primary Address</p>
                    <p className="text-gray-600">
                      {billingAddress.line1}, {billingAddress.city},{" "}
                      {billingAddress.country}, {billingAddress.postcode}
                    </p>
                  </div>
                  <Dialog
                    open={isUpdateAddressOpen}
                    onOpenChange={setIsUpdateAddressOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <User className="w-4 h-4 mr-2" />
                        Update Address
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white">
                      <DialogHeader>
                        <DialogTitle>Update your billing address</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdateAddress}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="line1" className="text-right">
                              Address Line 1
                            </Label>
                            <Input
                              id="line1"
                              name="line1"
                              defaultValue={newAddress.line1}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="city" className="text-right">
                              City
                            </Label>
                            <Input
                              id="city"
                              name="city"
                              defaultValue={newAddress.city}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="country" className="text-right">
                              Country
                            </Label>
                            <Input
                              id="country"
                              name="country"
                              defaultValue={newAddress.country}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="postcode" className="text-right">
                              Postcode
                            </Label>
                            <Input
                              id="postcode"
                              name="postcode"
                              defaultValue={newAddress.postcode}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button type="submit">Save changes</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders
                  .filter((order) => order.status === "completed")
                  .slice(0, 5)
                  .map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 border rounded-[10px]"
                    >
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(order.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {formatCurrency(order.total, order.currency)}
                        </span>
                        {order.receiptUrl && (
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
