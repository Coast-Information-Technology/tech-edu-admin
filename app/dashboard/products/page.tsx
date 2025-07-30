"use client";
import React, { useEffect, useState } from "react";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MoreVertical, Eye, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { deleteApiRequest } from "@/lib/apiFetch";
import { Skeleton } from "@/components/ui/skeleton";

// Product types from the product creation form
const PRODUCT_TYPE_OPTIONS = [
  "AcademicService",
  "TrainingProgram",
  "Consultancy",
  "Inquiry",
  "AI/ML Service",
  "Marketing",
  "Free Support",
  "Demo Session",
  "Career Connect",
  "Cv Builder",
];

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterEnabled, setFilterEnabled] = useState("all");
  const [sortKey, setSortKey] = useState("service");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }
      try {
        const res = await getApiRequest("/api/products/public", token);
        console.log("Raw products API response:", res);
        setProducts(res?.data?.data?.products || []);
      } catch (err: any) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Search, filter, and sort logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productCategoryTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      product.productSubcategoryName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || product.productType === filterType;
    const matchesEnabled =
      filterEnabled === "all" ||
      (filterEnabled === "enabled" && product.enabled) ||
      (filterEnabled === "disabled" && !product.enabled);
    return matchesSearch && matchesType && matchesEnabled;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search products..."
            className="max-w-xs w-full border rounded-[10px] p-2"
          />
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1);
            }}
            className="border rounded-[10px] p-2"
          >
            <option value="all">All Types</option>
            {PRODUCT_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={filterEnabled}
            onChange={(e) => {
              setFilterEnabled(e.target.value);
              setPage(1);
            }}
            className="border rounded-[10px] p-2"
          >
            <option value="all">All Status</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
        <div className="flex gap-2">
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="border rounded-[10px] p-2"
          >
            <option value="service">Sort by Service</option>
            <option value="price">Sort by Price</option>
            <option value="productCategoryTitle">Sort by Category</option>
          </select>
          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
            className="border rounded-[10px] p-2"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Product Management</h1>
        <Link href="/dashboard/products/new">
          <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            + Create Product
          </button>
        </Link>
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {loading ? (
        <div className="overflow-x-auto border rounded-[10px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3" colSpan={11}>
                  <Skeleton className="h-6 w-1/2 mx-auto rounded" />
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 11 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <Skeleton className="h-4 w-full rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-[10px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subcategory
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Enabled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Delivery Mode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.productType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.productCategoryTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.productSubcategoryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${product.price?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.discountPercentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          product.enabled
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.deliveryMode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                            aria-label="Open actions menu"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white rounded-[10px]"
                        >
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/products/${product._id}`}
                              className="cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2" /> View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/products/${product._id}/edit`}
                              className="cursor-pointer"
                            >
                              <Pencil className="w-4 h-4 mr-2 text-gray-500" />{" "}
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteDialogOpen(product._id)}
                          >
                            <Trash className="w-4 h-4 mr-2 text-red-500" />{" "}
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {/* Delete Confirmation Dialog */}
                      {deleteDialogOpen === product._id && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
                          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-5 h-5 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <h2 className="text-xl font-bold text-gray-900">
                                    Delete Product
                                  </h2>
                                  <p className="text-sm text-gray-500">
                                    This action cannot be undone
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => setDeleteDialogOpen(null)}
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
                                disabled={deleteLoading === product._id}
                              >
                                <svg
                                  className="w-5 h-5 text-gray-400"
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
                            <div className="p-6">
                              <div className="mb-6">
                                <p className="text-gray-700 mb-3">
                                  Are you sure you want to delete this product?
                                </p>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                      <svg
                                        className="w-6 h-6 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-gray-900">
                                        {product.service}
                                      </h3>
                                      <p className="text-sm text-gray-500">
                                        {product.productType} •{" "}
                                        {product.productCategoryTitle}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {deleteError && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                  <div className="flex items-center gap-2">
                                    <svg
                                      className="w-5 h-5 text-red-500"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    <span className="text-red-700 text-sm font-medium">
                                      {deleteError}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Actions */}
                              <div className="flex gap-3">
                                <button
                                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-xl transition-all duration-200 hover:shadow-md"
                                  onClick={() => setDeleteDialogOpen(null)}
                                  disabled={deleteLoading === product._id}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:opacity-50"
                                  onClick={async () => {
                                    setDeleteLoading(product._id);
                                    setDeleteError(null);
                                    const token = getTokenFromCookies();
                                    if (!token) {
                                      setDeleteError(
                                        "Authentication required. Please log in."
                                      );
                                      setDeleteLoading(null);
                                      return;
                                    }
                                    try {
                                      await deleteApiRequest(
                                        `/api/products/${product._id}`,
                                        token
                                      );
                                      setProducts((prev) =>
                                        prev.filter(
                                          (p) => p._id !== product._id
                                        )
                                      );
                                      setDeleteDialogOpen(null);
                                    } catch (err: any) {
                                      setDeleteError(
                                        err.message ||
                                          "Failed to delete product"
                                      );
                                    } finally {
                                      setDeleteLoading(null);
                                    }
                                  }}
                                  disabled={deleteLoading === product._id}
                                >
                                  {deleteLoading === product._id ? (
                                    <span className="flex items-center justify-center gap-2">
                                      <svg
                                        className="w-4 h-4 animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                        ></circle>
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                      </svg>
                                      Deleting...
                                    </span>
                                  ) : (
                                    <span className="flex items-center justify-center gap-2">
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                      Delete Product
                                    </span>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={11}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination Bar */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Showing{" "}
          {Math.min((page - 1) * itemsPerPage + 1, sortedProducts.length)} to{" "}
          {Math.min(page * itemsPerPage, sortedProducts.length)} of{" "}
          {sortedProducts.length} products
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
            aria-label="Previous page"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
