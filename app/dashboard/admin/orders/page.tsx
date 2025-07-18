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
  TrendingUp,
  Users,
  Building2,
  BarChart3,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerRole:
    | "student"
    | "individualTechProfessional"
    | "company"
    | "institution";
  date: string;
  status: "completed" | "pending" | "failed" | "refunded" | "cancelled";
  total: number;
  currency: string;
  items: OrderItem[];
  paymentMethod: string;
  revenue: number;
  commission: number;
}

interface OrderItem {
  id: string;
  name: string;
  type: "course" | "subscription" | "service" | "template";
  price: number;
  quantity: number;
  description: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    customerRole: "student",
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
        description: "Comprehensive career development program",
      },
      {
        id: "2",
        name: "Professional CV Template Pack",
        type: "template",
        price: 49.99,
        quantity: 1,
        description: "10 professionally designed CV templates",
      },
      {
        id: "3",
        name: "Interview Preparation Guide",
        type: "service",
        price: 49.99,
        quantity: 1,
        description: "One-on-one interview preparation session",
      },
    ],
    paymentMethod: "Visa ending in 4242",
    revenue: 299.99,
    commission: 29.99,
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@company.com",
    customerRole: "company",
    date: "2024-01-15T09:15:00Z",
    status: "completed",
    total: 1499.99,
    currency: "GBP",
    items: [
      {
        id: "4",
        name: "Corporate Training Package",
        type: "course",
        price: 1499.99,
        quantity: 1,
        description: "Team training package for 10 employees",
      },
    ],
    paymentMethod: "Bank Transfer",
    revenue: 1499.99,
    commission: 149.99,
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customerName: "Mike Chen",
    customerEmail: "mike.chen@email.com",
    customerRole: "individualTechProfessional",
    date: "2024-01-14T16:45:00Z",
    status: "pending",
    total: 99.99,
    currency: "GBP",
    items: [
      {
        id: "5",
        name: "Monthly Premium Subscription",
        type: "subscription",
        price: 99.99,
        quantity: 1,
        description: "Access to all premium features",
      },
    ],
    paymentMethod: "PayPal",
    revenue: 0,
    commission: 0,
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    customerName: "Emma Wilson",
    customerEmail: "emma.w@university.edu",
    customerRole: "institution",
    date: "2024-01-14T14:20:00Z",
    status: "completed",
    total: 2499.99,
    currency: "GBP",
    items: [
      {
        id: "6",
        name: "Institutional License",
        type: "subscription",
        price: 2499.99,
        quantity: 1,
        description: "Campus-wide access for students and staff",
      },
    ],
    paymentMethod: "Invoice",
    revenue: 2499.99,
    commission: 249.99,
  },
  {
    id: "5",
    orderNumber: "ORD-2024-005",
    customerName: "David Brown",
    customerEmail: "david.brown@email.com",
    customerRole: "student",
    date: "2024-01-14T11:30:00Z",
    status: "failed",
    total: 79.99,
    currency: "GBP",
    items: [
      {
        id: "7",
        name: "Resume Review Service",
        type: "service",
        price: 79.99,
        quantity: 1,
        description: "Professional resume review and feedback",
      },
    ],
    paymentMethod: "Mastercard ending in 8888",
    revenue: 0,
    commission: 0,
  },
  {
    id: "6",
    orderNumber: "ORD-2024-006",
    customerName: "Lisa Rodriguez",
    customerEmail: "lisa.r@email.com",
    customerRole: "individualTechProfessional",
    date: "2024-01-13T15:10:00Z",
    status: "refunded",
    total: 199.99,
    currency: "GBP",
    items: [
      {
        id: "8",
        name: "Career Coaching Session",
        type: "service",
        price: 199.99,
        quantity: 1,
        description: "60-minute career coaching session",
      },
    ],
    paymentMethod: "Visa ending in 1234",
    revenue: -199.99,
    commission: -19.99,
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "student":
        return <Users className="w-4 h-4" />;
      case "individualTechProfessional":
        return <Users className="w-4 h-4" />;
      case "company":
        return <Building2 className="w-4 h-4" />;
      case "institution":
        return <Building2 className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
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
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesRole =
      roleFilter === "all" || order.customerRole === roleFilter;

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

    return matchesSearch && matchesStatus && matchesRole && matchesDate;
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
      case "revenue":
        aValue = a.revenue;
        bValue = b.revenue;
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "customerName":
        aValue = a.customerName;
        bValue = b.customerName;
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

  const totalRevenue = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.revenue, 0);

  const totalCommission = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.commission, 0);

  const pendingOrders = orders.filter((order) => order.status === "pending");
  const failedOrders = orders.filter((order) => order.status === "failed");

  const ordersByRole = orders.reduce((acc, order) => {
    acc[order.customerRole] = (acc[order.customerRole] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">
            Orders & Payments
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all platform orders, payments, and revenue tracking
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {formatCurrency(totalRevenue, "GBP")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Commission</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {formatCurrency(totalCommission, "GBP")}
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
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {pendingOrders.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Students</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {ordersByRole.student || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-[10px]">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Professionals</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {ordersByRole.professional || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Companies</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {ordersByRole.company || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-[10px]">
                <Building2 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Institutions</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {ordersByRole.institution || 0}
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
            All Orders
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
          >
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search orders, customers, or items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-48">
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
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Customer Role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-[10px]">
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="individualTechProfessional">
                      Professionals
                    </SelectItem>
                    <SelectItem value="company">Companies</SelectItem>
                    <SelectItem value="institution">Institutions</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full lg:w-48">
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
                          onClick={() => handleSort("customerName")}
                          className="flex items-center gap-1 hover:text-gray-700"
                        >
                          Customer
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
                          onClick={() => handleSort("revenue")}
                          className="flex items-center gap-1 hover:text-gray-700"
                        >
                          Revenue
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
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              {getRoleIcon(order.customerRole)}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {order.customerName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.customerEmail}
                              </div>
                              <div className="text-xs text-gray-400">
                                {order.customerRole.charAt(0).toUpperCase() +
                                  order.customerRole.slice(1)}
                              </div>
                            </div>
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
                          <div className="text-sm text-gray-500">
                            {order.paymentMethod}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(order.revenue, order.currency)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Commission:{" "}
                            {formatCurrency(order.commission, order.currency)}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/orders/${order.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            {order.status === "pending" && (
                              <Button
                                size="sm"
                                className="text-white hover:text-black"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                            )}
                            {order.status === "completed" && (
                              <Button variant="outline" size="sm">
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Refund
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
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Orders ({pendingOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="border-l-4 border-l-yellow-500"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-[#011F72]">
                            {order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {order.customerName} - {order.customerEmail}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(order.date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#011F72]">
                            {formatCurrency(order.total, order.currency)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.paymentMethod}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          className="text-white hover:text-black"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve Payment
                        </Button>
                        <Button variant="outline" size="sm">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/orders/${order.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Revenue:</span>
                    <span className="font-bold">
                      {formatCurrency(totalRevenue, "GBP")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Commission:</span>
                    <span className="font-bold">
                      {formatCurrency(totalCommission, "GBP")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Revenue:</span>
                    <span className="font-bold">
                      {formatCurrency(totalRevenue - totalCommission, "GBP")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Failed Orders:</span>
                    <span className="font-bold text-red-600">
                      {failedOrders.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Revenue Report
                  </Button>
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
