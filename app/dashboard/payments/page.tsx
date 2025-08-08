"use client";
import React, { useEffect, useState } from "react";
import { getTokenFromCookies } from "@/lib/cookies";
import { getApiRequest } from "@/lib/apiFetch";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";

// Types
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

interface PaymentDetails extends Payment {
  // Additional fields for detailed view if needed
}

const STATUS_OPTIONS = ["pending", "success", "failed"];
const PROVIDER_OPTIONS = ["stripe", "flutterwave", "paystack"];
const PRODUCT_TYPE_OPTIONS = [
  "Training & Certification",
  "Academic Support Services",
  "Career Development & Mentorship",
  "Institutional & Team Services",
  "AI-Powered or Automation Services",
  "Career Connect",
  "Marketing",
  "Consultation & Free Services",
];
const PLATFORM_ROLE_OPTIONS = [
  "student",
  "individualTechProfessional",
  "teamTechProfessional",
  "recruiter",
  "institution",
  "admin",
  "visitor",
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState("");
  const [productType, setProductType] = useState("");
  const [platformRole, setPlatformRole] = useState("");
  const [currency, setCurrency] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch all payments once (client-side pagination)
  useEffect(() => {
    const fetchAllPayments = async () => {
      setLoading(true);
      setError(null);
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required.");
        setLoading(false);
        return;
      }
      try {
        const pageSize = 100;
        let currentPage = 1;
        let accumulated: Payment[] = [];
        let totalPagesFromServer = 1;
        do {
          const params = new URLSearchParams();
          params.append("page", String(currentPage));
          params.append("limit", String(pageSize));
          const res = await getApiRequest(
            `/api/payments?${params.toString()}`,
            token
          );
          if (res?.data?.success) {
            const chunk: Payment[] =
              res.data?.data?.payments || res.data?.data || [];
            accumulated = accumulated.concat(chunk);
            totalPagesFromServer = res.data?.meta?.totalPages || 1;
          } else {
            break;
          }
          currentPage += 1;
        } while (currentPage <= totalPagesFromServer);
        setPayments(accumulated);
      } catch (err: any) {
        setError(err.message || "Failed to fetch payments");
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPayments();
  }, []);

  // Client-side filtering and pagination
  const filteredPayments = payments.filter((p) => {
    const matchesStatus = !status || p.status === status;
    const matchesProvider = !provider || p.provider === provider;
    const matchesProductType = !productType || p.productType === productType;
    const matchesPlatformRole =
      !platformRole || p.platformRole === platformRole;
    const matchesCurrency = !currency || p.currency === currency;
    const matchesSearch =
      !search ||
      [p.transactionId, p.bookingService, p.userId]
        .filter(Boolean)
        .some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        );
    const created = new Date(p.createdAt).getTime();
    const matchesStart = !startDate || created >= new Date(startDate).getTime();
    const matchesEnd = !endDate || created <= new Date(endDate).getTime();
    return (
      matchesStatus &&
      matchesProvider &&
      matchesProductType &&
      matchesPlatformRole &&
      matchesCurrency &&
      matchesSearch &&
      matchesStart &&
      matchesEnd
    );
  });

  const totalPagesComputed = Math.ceil(filteredPayments.length / limit);
  const paginatedPayments = filteredPayments.slice(
    (page - 1) * limit,
    page * limit
  );

  // Reset page to 1 when filters change
  const handleFilterChange = (filterName: string, value: string) => {
    setPage(1);
    switch (filterName) {
      case "status":
        setStatus(value);
        break;
      case "provider":
        setProvider(value);
        break;
      case "productType":
        setProductType(value);
        break;
      case "platformRole":
        setPlatformRole(value);
        break;
      case "currency":
        setCurrency(value);
        break;
      case "search":
        setSearch(value);
        break;
      case "startDate":
        setStartDate(value);
        break;
      case "endDate":
        setEndDate(value);
        break;
      case "limit":
        setLimit(Number(value));
        break;
    }
  };

  // Fetch single payment details
  const openPaymentModal = async (paymentId: string) => {
    setModalOpen(true);
    setModalLoading(true);
    setSelectedPayment(null);
    const token = getTokenFromCookies();
    if (!token) {
      setError("Authentication required.");
      setLoading(false);
      return;
    }
    try {
      const res = await getApiRequest(`/api/payments/${paymentId}`, token);
      setSelectedPayment(res.data.data);
    } catch (err: any) {
      setSelectedPayment(null);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Payment Management
            </h1>
            <p className="text-slate-600 mt-1">
              Monitor and manage all payment transactions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">
                {filteredPayments.length}
              </div>
              <div className="text-sm text-slate-600">Total Payments</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Filters & Search
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <select
              value={status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl p-3 text-sm"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={provider}
              onChange={(e) => handleFilterChange("provider", e.target.value)}
              className="rounded-[10px] border p-2"
            >
              <option value="">All Providers</option>
              {PROVIDER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="rounded-[10px] border p-2"
              placeholder="Start Date"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="rounded-[10px] border p-2"
              placeholder="End Date"
            />
            <select
              value={productType}
              onChange={(e) =>
                handleFilterChange("productType", e.target.value)
              }
              className="rounded-[10px] border p-2"
            >
              <option value="">All Product Types</option>
              {PRODUCT_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <select
              value={platformRole}
              onChange={(e) =>
                handleFilterChange("platformRole", e.target.value)
              }
              className="rounded-[10px] border p-2"
            >
              <option value="">All Platform Roles</option>
              {PLATFORM_ROLE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
            <Input
              type="text"
              value={search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="rounded-[10px] border p-2"
              placeholder="Search transaction ID or service"
            />
            <select
              value={limit}
              onChange={(e) => handleFilterChange("limit", e.target.value)}
              className="rounded-[10px] border p-2"
            >
              {[10, 20, 50, 100].map((opt) => (
                <option key={opt} value={opt}>
                  {opt} per page
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/70 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Provider
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={7} className="text-center text-red-600 py-8">
                    {error}
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    No payments found.
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="hover:bg-blue-50/50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium">{payment.userId}</div>
                      <div className="text-xs text-gray-500">
                        {payment.platformRole}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold">
                      {payment.currency} {payment.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          payment.status === "success"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {payment.provider}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {payment.productType || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(payment.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm mr-3 transition-colors duration-200"
                        onClick={() => openPaymentModal(payment._id)}
                      >
                        View Details
                      </button>
                      <button className="text-green-600 hover:text-green-800 transition-colors duration-200">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="bg-white/70 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-slate-600">
              Page <span className="font-semibold text-slate-900">{page}</span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {totalPagesComputed || 0}
              </span>
              {filteredPayments.length > 0 && (
                <span className="ml-2">
                  • Showing{" "}
                  <span className="font-semibold text-slate-900">
                    {paginatedPayments.length}
                  </span>{" "}
                  payments
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || totalPagesComputed === 0}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPage((p) => Math.min(totalPagesComputed || 1, p + 1))
                }
                disabled={
                  page === totalPagesComputed || totalPagesComputed === 0
                }
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        {/* Payment Details Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 relative border border-slate-200">
              <button
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                onClick={() => setModalOpen(false)}
              >
                <svg
                  className="w-6 h-6"
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
              {modalLoading ? (
                <div className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="h-4 w-full bg-gray-200 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : selectedPayment ? (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Payment Details
                  </h2>
                  <div className="mb-4 p-4 bg-slate-50 rounded-xl">
                    <span className="text-slate-900">
                      {selectedPayment.userId}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Amount:</span>{" "}
                    {selectedPayment.currency}{" "}
                    {selectedPayment.amount.toFixed(2)}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        selectedPayment.status === "success"
                          ? "bg-green-100 text-green-700"
                          : selectedPayment.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedPayment.status}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Provider:</span>{" "}
                    {selectedPayment.provider}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Transaction ID:</span>{" "}
                    {selectedPayment.transactionId}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Product Type:</span>{" "}
                    {selectedPayment.productType || "-"}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Platform Role:</span>{" "}
                    {selectedPayment.platformRole}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(selectedPayment.createdAt).toLocaleString()}
                  </div>
                  {selectedPayment.couponCode && (
                    <div className="mb-2">
                      <span className="font-medium">Coupon:</span>{" "}
                      {selectedPayment.couponCode}
                    </div>
                  )}

                  {selectedPayment.metadata && (
                    <div className="mb-2">
                      <span className="font-medium">Metadata:</span>{" "}
                      <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto">
                        {JSON.stringify(selectedPayment.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                  <DialogFooter className="mt-6 flex justify-end gap-2">
                    <button className="px-4 py-2 rounded-[10px] bg-gray-200 hover:bg-gray-300">
                      Download Receipt
                    </button>
                    <button
                      className="px-4 py-2 rounded-[10px] bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => setModalOpen(false)}
                    >
                      Close
                    </button>
                  </DialogFooter>
                </div>
              ) : (
                <div className="text-red-600">
                  Failed to load payment details.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
