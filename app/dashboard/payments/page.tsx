"use client";
import React, { useEffect, useState } from "react";
import { getTokenFromCookies } from "@/lib/cookies";
import { getApiRequest } from "@/lib/apiFetch";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Types
interface User {
  _id: string;
  fullName: string;
  email: string;
}
interface Product {
  _id: string;
  service: string;
}
interface Payment {
  _id: string;
  userId: User;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  transactionId: string;
  createdAt: string;
  productId: Product;
}
interface PaymentDetails extends Payment {
  updatedAt: string;
  jobApplicationId: string | null;
  trainingEnrollmentId: string | null;
  couponCode?: string;
  discountAmount?: number;
  metadata?: Record<string, any>;
}

const STATUS_OPTIONS = ["success", "pending", "failed"];
const PROVIDER_OPTIONS = ["stripe", "paypal", "flutterwave"];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch payments
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required.");
        setLoading(false);
        return;
      }
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      if (status) params.append("status", status);
      if (provider) params.append("provider", provider);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      try {
        const res = await getApiRequest(
          `/api/payments/admin?${params.toString()}`,
          token
        );
        setPayments(res.data.data.payments);
        setTotalPages(res.data.data.pagination.pages);
      } catch (err: any) {
        setError(err.message || "Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [page, limit, status, provider, startDate, endDate]);

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
      const res = await getApiRequest(`/api/payments/admin/`, token);
      setSelectedPayment(res.data.data.payments);
    } catch (err: any) {
      setSelectedPayment(null);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Payments</h1>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-[10px] border p-2"
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
          onChange={(e) => {
            setProvider(e.target.value);
            setPage(1);
          }}
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
          onChange={(e) => {
            setStartDate(e.target.value);
            setPage(1);
          }}
          className="rounded-[10px] border p-2"
          placeholder="Start Date"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setPage(1);
          }}
          className="rounded-[10px] border p-2"
          placeholder="End Date"
        />
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="rounded-[10px] border p-2"
        >
          {[10, 20, 50, 100].map((opt) => (
            <option key={opt} value={opt}>
              {opt} per page
            </option>
          ))}
        </select>
      </div>
      {/* Table */}
      <div className="overflow-x-auto border rounded-[10px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
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
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  No payments found.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium">{payment.userId.fullName}</div>
                    <div className="text-xs text-gray-500">
                      {payment.userId.email}
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
                    {payment.productId?.service || "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(payment.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      className="text-blue-600 hover:underline mr-2"
                      onClick={() => openPaymentModal(payment._id)}
                    >
                      View
                    </button>
                    <button className="text-gray-600 hover:underline">
                      Download
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      {/* Payment Details Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-[10px] shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setModalOpen(false)}
            >
              &times;
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
                <h2 className="text-xl font-bold mb-2">Payment Details</h2>
                <div className="mb-2">
                  <span className="font-medium">User:</span>{" "}
                  {selectedPayment.userId.fullName} (
                  {selectedPayment.userId.email})
                </div>
                <div className="mb-2">
                  <span className="font-medium">Amount:</span>{" "}
                  {selectedPayment.currency} {selectedPayment.amount.toFixed(2)}
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
                  <span className="font-medium">Product:</span>{" "}
                  {selectedPayment.productId?.service || "-"}
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
                {selectedPayment.discountAmount && (
                  <div className="mb-2">
                    <span className="font-medium">Discount:</span>{" "}
                    {selectedPayment.discountAmount}
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
  );
}
