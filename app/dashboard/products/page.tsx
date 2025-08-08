"use client";
import React, { useEffect, useState } from "react";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  MoreVertical,
  Eye,
  Pencil,
  Trash,
  Search,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";
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
  "Training & Certification",
  "Academic Support Services",
  "Career Development & Mentorship",
  "Institutional & Team Services",
  "AI-Powered or Automation Services",
  "Career Connect",
  "Marketing, Consultation & Free Services",
];

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterEnabled, setFilterEnabled] = useState("all");
  const [sortKey, setSortKey] = useState("service");
  const [sortDirection, setSortDirection] = useState("asc");
  const [instructors, setInstructors] = useState<any[]>([]);
  const [filterInstructor, setFilterInstructor] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [serverTotalPages, setServerTotalPages] = useState(0);
  const [useServerPagination, setUseServerPagination] = useState(false);

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
        const params = new URLSearchParams();
        params.set("page", String(page));
        const effectiveLimit =
          showAll && totalCount ? totalCount : itemsPerPage;
        params.set("limit", String(effectiveLimit));
        if (searchTerm) params.set("search", searchTerm);
        if (filterType !== "all") params.set("productType", filterType);
        if (filterEnabled !== "all")
          params.set("enabled", filterEnabled === "enabled" ? "true" : "false");
        if (filterInstructor !== "all")
          params.set("instructorId", filterInstructor);

        const [productsRes, instructorsRes] = await Promise.all([
          getApiRequest(`/api/products/public?${params.toString()}`, token),
          getApiRequest("/api/users/admin/instructors", token),
        ]);

        const root = productsRes?.data || {};
        const data = root?.data ?? root;
        const responseProducts = data?.products || [];
        setProducts(responseProducts);
        setInstructors(instructorsRes?.data?.data?.instructors || []);

        const totalNum = Number(
          data?.total ?? data?.count ?? data?.Total ?? data?.Count
        );
        const pageNum = Number(
          data?.page ?? data?.currentPage ?? data?.Page ?? data?.CurrentPage
        );
        const limitNum = Number(
          data?.limit ?? data?.perPage ?? data?.Limit ?? data?.PerPage
        );
        let totalPagesNum = Number(
          data?.totalPages ?? data?.TotalPages ?? data?.pages ?? data?.Pages
        );
        if (
          !Number.isFinite(totalPagesNum) &&
          Number.isFinite(totalNum) &&
          Number.isFinite(limitNum) &&
          limitNum > 0
        ) {
          totalPagesNum = Math.ceil(totalNum / limitNum);
        }

        const hasServerMeta =
          Number.isFinite(pageNum) &&
          Number.isFinite(limitNum) &&
          (Number.isFinite(totalNum) || Number.isFinite(totalPagesNum));

        setUseServerPagination(Boolean(hasServerMeta));
        if (hasServerMeta) {
          if (Number.isFinite(totalNum)) setTotalCount(totalNum);
          if (Number.isFinite(totalPagesNum))
            setServerTotalPages(totalPagesNum);
          // Keep local state in sync with server
          if (Number.isFinite(pageNum)) setPage(pageNum);
          if (!showAll && Number.isFinite(limitNum)) setItemsPerPage(limitNum);
        } else {
          setTotalCount(responseProducts.length);
          setServerTotalPages(1);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [
    page,
    itemsPerPage,
    searchTerm,
    filterType,
    filterEnabled,
    filterInstructor,
    showAll,
    totalCount,
  ]);

  // Search, filter, and sort logic
  const filteredProducts = useServerPagination
    ? products
    : products.filter((product) => {
        const matchesSearch =
          product.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.productType
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
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
        const matchesInstructor =
          filterInstructor === "all" ||
          product.instructorId === filterInstructor;
        return (
          matchesSearch && matchesType && matchesEnabled && matchesInstructor
        );
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

  const paginatedProducts = useServerPagination
    ? sortedProducts
    : sortedProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const totalPagesToUse = useServerPagination
    ? serverTotalPages ||
      (itemsPerPage > 0 ? Math.ceil(totalCount / itemsPerPage) : 0)
    : Math.ceil(sortedProducts.length / itemsPerPage);

  const displayTotal = useServerPagination ? totalCount : sortedProducts.length;
  const displayFrom =
    displayTotal === 0
      ? 0
      : Math.min((page - 1) * itemsPerPage + 1, displayTotal);
  const displayTo =
    displayTotal === 0
      ? 0
      : Math.min(
          (page - 1) * itemsPerPage + paginatedProducts.length,
          displayTotal
        );

  // Reset page to 1 when filters change
  const handleFilterChange = (filterName: string, value: string) => {
    setPage(1);
    switch (filterName) {
      case "search":
        setSearchTerm(value);
        break;
      case "type":
        setFilterType(value);
        break;
      case "enabled":
        setFilterEnabled(value);
        break;
      case "instructor":
        setFilterInstructor(value);
        break;
      case "limit":
        if (value === "all") {
          setShowAll(true);
        } else {
          setShowAll(false);
          setItemsPerPage(Number(value));
        }
        break;
    }
  };

  const handleSortChange = (key: string) => {
    setPage(1);
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Product Management
              </h1>
              <p className="text-slate-600 text-lg">
                Manage and organize your products efficiently
              </p>
            </div>
            <Link href="/dashboard/products/new">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1">
                <span className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Create Product
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row gap-4 flex-1">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-slate-400"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={filterType}
                    onChange={(e) => handleFilterChange("type", e.target.value)}
                    className="pl-10 pr-8 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    {PRODUCT_TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <div className="relative">
                    <select
                      value={filterInstructor}
                      onChange={(e) =>
                        handleFilterChange("instructor", e.target.value)
                      }
                      className="px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer w-full"
                    >
                      <option value="all">All Instructors</option>
                      {instructors.map((instructor) => (
                        <option key={instructor._id} value={instructor._id}>
                          {instructor.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Sort Controls */}
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={filterEnabled}
                  onChange={(e) =>
                    handleFilterChange("enabled", e.target.value)
                  }
                  className="px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer w-full"
                >
                  <option value="all">All Status</option>
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              <div className="relative">
                <select
                  value={sortKey}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer w-full"
                >
                  <option value="service">Sort by Service</option>
                  <option value="price">Sort by Price</option>
                  <option value="productCategoryTitle">Sort by Category</option>
                </select>
              </div>

              <div className="relative">
                <select
                  value={showAll ? "all" : String(itemsPerPage)}
                  onChange={(e) => handleFilterChange("limit", e.target.value)}
                  className="px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer w-full"
                >
                  {[10, 20, 50, 100].map((opt) => (
                    <option key={opt} value={String(opt)}>
                      {opt} per page
                    </option>
                  ))}
                  <option value="all">All</option>
                </select>
              </div>

              <button
                onClick={() => handleSortChange(sortKey)}
                className="px-4 py-4 bg-white/50 border border-slate-200 rounded-2xl hover:bg-white/80 transition-all duration-300 flex items-center justify-center"
              >
                {sortDirection === "asc" ? (
                  <SortAsc className="h-5 w-5 text-slate-600" />
                ) : (
                  <SortDesc className="h-5 w-5 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
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
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-slate-600 text-lg">Loading products...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                  <tr>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Product Type
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Instructor
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Subcategory
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Delivery Mode
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-slate-200">
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-blue-50/50 transition-all duration-300 group"
                      >
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                            {product.productType}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                            {product.service}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {product.instructorId && (
                              <>
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-blue-600">
                                    {instructors
                                      .find(
                                        (i) => i._id === product.instructorId
                                      )
                                      ?.fullName?.charAt(0) || "I"}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-slate-900">
                                    {instructors.find(
                                      (i) => i._id === product.instructorId
                                    )?.fullName || "Unknown Instructor"}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {instructors.find(
                                      (i) => i._id === product.instructorId
                                    )?.title || "Instructor"}
                                  </div>
                                </div>
                              </>
                            )}
                            {!product.instructorId && (
                              <span className="text-sm text-slate-400 italic">
                                Not assigned
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-sm text-slate-700">
                            {product.productCategoryTitle}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-sm text-slate-700">
                            {product.productSubcategoryName}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-sm font-bold text-green-600">
                            ${product.price?.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200">
                            {product.discountPercentage}%
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${
                              product.enabled
                                ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
                                : "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200"
                            }`}
                          >
                            {product.enabled ? "Enabled" : "Disabled"}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-sm text-slate-700">
                            {product.deliveryMode}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-sm text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded-lg">
                            {product.slug}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="p-3 rounded-full hover:bg-slate-100 focus:outline-none transition-all duration-300 group-hover:bg-blue-100"
                                aria-label="Open actions menu"
                              >
                                <MoreVertical className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors duration-300" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200 p-2"
                            >
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/dashboard/products/${product._id}`}
                                  className="cursor-pointer flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-xl transition-all duration-300"
                                >
                                  <Eye className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium">View</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/dashboard/products/${product._id}/edit`}
                                  className="cursor-pointer flex items-center gap-3 px-4 py-3 hover:bg-yellow-50 rounded-xl transition-all duration-300"
                                >
                                  <Pencil className="w-4 h-4 text-yellow-600" />
                                  <span className="font-medium">Edit</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteDialogOpen(product._id)}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl transition-all duration-300 text-red-600 cursor-pointer"
                              >
                                <Trash className="w-4 h-4" />
                                <span className="font-medium">Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          {/* Delete Confirmation Dialog */}
                          {deleteDialogOpen === product._id && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
                              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
                                {/* Header */}
                                <div className="flex items-center justify-between p-8 border-b border-slate-100">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                      <svg
                                        className="w-6 h-6 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <h2 className="text-2xl font-bold text-slate-900">
                                        Delete Product
                                      </h2>
                                      <p className="text-slate-500">
                                        This action cannot be undone
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => setDeleteDialogOpen(null)}
                                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-all duration-300"
                                    disabled={deleteLoading === product._id}
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
                                <div className="p-8">
                                  <div className="mb-8">
                                    <p className="text-slate-700 mb-6 text-lg">
                                      Are you sure you want to delete this
                                      product?
                                    </p>
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                                      <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                                          <svg
                                            className="w-8 h-8 text-blue-600"
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
                                          <h3 className="text-xl font-bold text-slate-900">
                                            {product.service}
                                          </h3>
                                          <p className="text-slate-600">
                                            {product.productType} •{" "}
                                            {product.productCategoryTitle}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {deleteError && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                                      <div className="flex items-center gap-3">
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
                                        <span className="text-red-700 font-medium">
                                          {deleteError}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Actions */}
                                  <div className="flex gap-4">
                                    <button
                                      className="flex-1 px-6 py-4 text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg"
                                      onClick={() => setDeleteDialogOpen(null)}
                                      disabled={deleteLoading === product._id}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:opacity-50"
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
                                        <span className="flex items-center justify-center gap-3">
                                          <svg
                                            className="w-5 h-5 animate-spin"
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
                                        <span className="flex items-center justify-center gap-3">
                                          <svg
                                            className="w-5 h-5"
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
                      <td colSpan={10} className="px-8 py-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-gradient-to-r from-slate-100 to-blue-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-10 h-10 text-slate-400"
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
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                              No products found
                            </h3>
                            <p className="text-slate-600">
                              Get started by creating your first product
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {displayFrom}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-900">{displayTo}</span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {displayTotal}
              </span>{" "}
              products
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || totalPagesToUse === 0}
                className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                aria-label="Previous page"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPagesToUse, p + 1))}
                disabled={page === totalPagesToUse || totalPagesToUse === 0}
                className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
