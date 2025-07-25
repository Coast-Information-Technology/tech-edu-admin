"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const res = await getApiRequest(`/api/products/${id}`, token);
        setProduct(res?.data?.data?.product || null);
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center py-20">Loading...</div>;
  }
  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  }
  if (!product) {
    return <div className="p-4">Product not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link href="/dashboard/products">
        <button className="mb-4 px-4 py-2 rounded-[10px] bg-blue-600 text-white hover:bg-blue-700">
          &larr; Back to Products
        </button>
      </Link>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-blue-900">
            {product.service}
          </h1>
          <div className="flex gap-2 flex-wrap items-center">
            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
              {product.productType}
            </span>
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold">
              {product.category}
            </span>
            {product.enabled ? (
              <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                Enabled
              </span>
            ) : (
              <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">
                Disabled
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-4 items-center">
          {product.iconUrl && (
            <img
              src={product.iconUrl}
              alt="Icon"
              className="w-16 h-16 rounded-[10px] shadow object-cover"
            />
          )}
          {product.thumbnailUrl && (
            <img
              src={product.thumbnailUrl}
              alt="Thumbnail"
              className="w-24 h-24 rounded-[10px] shadow object-cover"
            />
          )}
        </div>
      </div>
      {/* Pricing */}
      <div className="flex gap-4 items-center mb-6">
        <span className="text-2xl font-bold text-green-700">
          ${product.price?.toFixed(2)}
        </span>
        {product.discountPercentage > 0 && (
          <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">
            {product.discountPercentage}% OFF
          </span>
        )}
      </div>
      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-white rounded-[10px] shadow border">
          <div className="text-xs text-gray-500 mb-1">Created By</div>
          <div className="text-base text-gray-800 font-semibold">
            {product.createdBy?.fullName}
          </div>
          <div className="text-xs text-gray-500">
            {product.createdBy?.email}
          </div>
        </div>
        <div className="p-4 bg-white rounded-[10px] shadow border">
          <div className="text-xs text-gray-500 mb-1">Slug</div>
          <div className="text-base text-gray-800">
            {product.metadata?.slug}
          </div>
        </div>
        <div className="p-4 bg-white rounded-[10px] shadow border">
          <div className="text-xs text-gray-500 mb-1">SEO Title</div>
          <div className="text-base text-gray-800">
            {product.metadata?.seoTitle}
          </div>
        </div>
        <div className="p-4 bg-white rounded-[10px] shadow border">
          <div className="text-xs text-gray-500 mb-1">Difficulty Level</div>
          <div className="text-base text-gray-800">
            {product.difficultyLevel}
          </div>
        </div>
        <div className="p-4 bg-white rounded-[10px] shadow border">
          <div className="text-xs text-gray-500 mb-1">Session Type</div>
          <div className="text-base text-gray-800">{product.sessionType}</div>
        </div>
        <div className="p-4 bg-white rounded-[10px] shadow border">
          <div className="text-xs text-gray-500 mb-1">Delivery Mode</div>
          <div className="text-base text-gray-800">{product.deliveryMode}</div>
        </div>
        <div className="p-4 bg-white rounded-[10px] shadow border">
          <div className="text-xs text-gray-500 mb-1">Subcategories</div>
          <div className="text-base text-gray-800">
            {product.subcategories?.join(", ")}
          </div>
        </div>
        <div className="p-4 bg-white rounded-[10px] shadow border">
          <div className="text-xs text-gray-500 mb-1">Tags</div>
          <div className="text-base text-gray-800">
            {product.tags?.join(", ")}
          </div>
        </div>
      </div>
      {/* Description */}
      <div className="p-4 bg-white rounded-[10px] shadow border mb-6">
        <div className="text-xs text-gray-500 mb-1">Description</div>
        <div className="text-base text-gray-800 whitespace-pre-line">
          {product.description}
        </div>
      </div>
      {/* Metadata SEO Description */}
      {product.metadata?.seoDescription && (
        <div className="p-4 bg-white rounded-[10px] shadow border mb-6">
          <div className="text-xs text-gray-500 mb-1">SEO Description</div>
          <div className="text-base text-gray-800 whitespace-pre-line">
            {product.metadata.seoDescription}
          </div>
        </div>
      )}
    </div>
  );
}
