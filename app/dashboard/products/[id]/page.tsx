"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiRequest, deleteApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  ArrowLeft,
  Edit,
  Trash,
  Eye,
  Calendar,
  Clock,
  DollarSign,
  Tag,
  MapPin,
  Users,
  Award,
  BookOpen,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  _id: string;
  productType: string;
  productCategoryId: string;
  productCategoryTitle: string;
  productSubCategoryId: string;
  productSubcategoryName: string;
  service: string;
  deliveryMode: string;
  sessionType: string;
  isRecurring: boolean;
  programLength: number;
  mode: string;
  durationInMinutes: number;
  minutesPerSession: number;
  hasClassroom: boolean;
  hasSession: boolean;
  hasAssessment: boolean;
  hasCertificate: boolean;
  requiresBooking: boolean;
  requiresEnrollment: boolean;
  isBookableService: boolean;
  price: number;
  discountPercentage: number;
  description: string;
  tags: string[];
  slug: string;
  iconUrl: string;
  thumbnailUrl: string;
  enabled: boolean;
  instructorId?: string; // Add instructor field
  createdAt: string;
  updatedAt: string;
}

export default function ProductViewPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [instructor, setInstructor] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await getApiRequest(
          `/api/products/public/${params.id}`,
          token
        );

        if (response?.data?.success) {
          const productData = response.data.data;
          setProduct(productData);

          // Fetch instructor data if product has instructorId
          if (productData.instructorId) {
            try {
              const instructorsResponse = await getApiRequest(
                "/api/users/admin/instructors",
                token
              );
              if (instructorsResponse?.data?.success) {
                const instructorData =
                  instructorsResponse.data.data.instructors.find(
                    (i: any) => i._id === productData.instructorId
                  );
                setInstructor(instructorData);
              }
            } catch (instructorErr) {
              console.error("Failed to fetch instructor:", instructorErr);
            }
          }
        } else {
          setError(response?.data?.message || "Failed to load product");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError(null);

    const token = getTokenFromCookies();
    if (!token) {
      setDeleteError("Authentication required. Please log in.");
      setDeleteLoading(false);
      return;
    }

    try {
      await deleteApiRequest(`/api/products/${product?._id}`, token);
      setDeleteDialogOpen(false);
      router.push("/dashboard/products");
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete product");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-4 mb-8">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-48" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Skeleton className="h-64 w-full rounded-2xl mb-6" />
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <div>
                <Skeleton className="h-8 w-32 mb-6" />
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>

          {/* Delete Confirmation Dialog */}
          {deleteDialogOpen && (
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
                    onClick={() => setDeleteDialogOpen(false)}
                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-all duration-300"
                    disabled={deleteLoading}
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
                      Are you sure you want to delete this product?
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
                            {product?.service}
                          </h3>
                          <p className="text-slate-600">
                            {product?.productType} •{" "}
                            {product?.productCategoryTitle}
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
                      onClick={() => setDeleteDialogOpen(false)}
                      disabled={deleteLoading}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:opacity-50"
                      onClick={handleDelete}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? (
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
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">
              Error Loading Product
            </h2>
            <p className="text-red-700 mb-6">{error}</p>
            <Link href="/dashboard/products">
              <button className="px-6 py-3 bg-red-600 text-white font-semibold rounded-2xl hover:bg-red-700 transition-all duration-300">
                Back to Products
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">
              Product Not Found
            </h2>
            <p className="text-yellow-700 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/dashboard/products">
              <button className="px-6 py-3 bg-yellow-600 text-white font-semibold rounded-2xl hover:bg-yellow-700 transition-all duration-300">
                Back to Products
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/products">
                <button className="p-3 rounded-full hover:bg-slate-100 transition-all duration-300">
                  <ArrowLeft className="w-6 h-6 text-slate-600" />
                </button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {product.service}
                </h1>
                <p className="text-slate-600 mt-1">
                  {product.productType} • {product.productCategoryTitle} •{" "}
                  {product.productSubcategoryName}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={`/dashboard/products/${product._id}/edit`}>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <span className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Product
                  </span>
                </button>
              </Link>
              <button
                onClick={() => setDeleteDialogOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-2">
                  <Trash className="w-4 h-4" />
                  Delete Product
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Image */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              {product.thumbnailUrl ? (
                <img
                  src={product.thumbnailUrl}
                  alt={product.service}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-slate-500">No thumbnail available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Description
              </h2>
              <p className="text-slate-700 leading-relaxed">
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Tag className="w-6 h-6 text-blue-600" />
                  Tags
                </h2>
                <div className="flex flex-wrap gap-3">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  <span className="text-3xl font-bold text-green-600">
                    {product.price === 0
                      ? "Free"
                      : `$${product.price.toFixed(2)}`}
                  </span>
                </div>
                {product.discountPercentage > 0 && (
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-200">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  <span className="text-slate-700">
                    {product.programLength} {product.mode}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-500" />
                  <span className="text-slate-700">
                    {product.durationInMinutes} minutes total
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-slate-500" />
                  <span className="text-slate-700">
                    {product.minutesPerSession} min per session
                  </span>
                </div>
              </div>
            </div>

            {/* Product Type & Category */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Product Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-slate-500">Product Type</span>
                  <p className="font-medium text-slate-900">
                    {product.productType}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Category</span>
                  <p className="font-medium text-slate-900">
                    {product.productCategoryTitle}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Subcategory</span>
                  <p className="font-medium text-slate-900">
                    {product.productSubcategoryName}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Delivery Mode</span>
                  <p className="font-medium text-slate-900 capitalize">
                    {product.deliveryMode}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Session Type</span>
                  <p className="font-medium text-slate-900">
                    {product.sessionType}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Instructor</span>
                  {instructor ? (
                    <div className="flex items-center gap-3 mt-1">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {instructor.fullName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {instructor.fullName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {instructor.title}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="font-medium text-slate-400 italic">
                      Not assigned
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Features
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {product.hasCertificate ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-slate-700">Certificate</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.hasAssessment ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-slate-700">Assessment</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.hasClassroom ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-slate-700">Classroom</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.hasSession ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-slate-700">Sessions</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.requiresBooking ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-slate-700">Booking Required</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.requiresEnrollment ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-slate-700">Enrollment Required</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.isBookableService ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-slate-700">Bookable Service</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.isRecurring ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-slate-700">Recurring</span>
                </div>
              </div>
            </div>

            {/* Status & Dates */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Status & Dates
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {product.enabled ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-slate-700">
                    {product.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Created</span>
                  <p className="text-sm text-slate-700">
                    {formatDate(product.createdAt)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Last Updated</span>
                  <p className="text-sm text-slate-700">
                    {formatDate(product.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
