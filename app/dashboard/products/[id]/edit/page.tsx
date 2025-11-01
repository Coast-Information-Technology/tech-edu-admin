"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getApiRequest,
  patchApiRequest,
  updateApiRequest,
} from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  uploadAssetImage,
  uploadMaterial,
  deleteFileFromFirebase,
} from "@/lib/firebase";
import { Product } from "@/types/products";
import {
  PRODUCT_TYPE_OPTIONS,
  DELIVERY_MODE_OPTIONS,
  SESSION_TYPE_OPTIONS,
  MODE_OPTIONS,
} from "@/lib/constants/products";
import { Pricing, defaultPricing, normalizePricingForApi } from "@/lib/constants/pricing";
import PricingForm from "@/components/PricingForms";
import { pickPricingForApi, validatePricing } from "@/utils/pricingApi";

// Helper function to check if product type requires training materials
const requiresTrainingMaterials = (productType: string) => {
  return [
    "Training & Certification",
    "Academic Support Services",
    "Career Development & Mentorship",
  ].includes(productType);
};

// Helper functions for form validation

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Allow an extra field "nonBookableService" alongside Product fields
  const [form, setForm] = useState<
    Partial<Product> & { nonBookableService?: boolean }
  >({});

  const [instructors, setInstructors] = useState<any[]>([]);
  const [instructorsLoading, setInstructorsLoading] = useState(false);

  const [pricing, setPricing] = useState<Pricing>(defaultPricing);

  // Derived flags
  const isBookable = !!form.isBookableService;
  const instructorRequired = isBookable; // Tools included when bookable

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
        const [productRes, instructorsRes] = await Promise.all([
          getApiRequest(`/api/products/public/${params.id}`, token),
          getApiRequest("/api/users/admin/instructors", token),
        ]);

        if (!productRes?.data?.success) {
          throw new Error(
            productRes?.data?.message || "Failed to load product"
          );
        }

        const product = productRes.data.data;

        // Form — set with mirrored nonBookableService
        setForm({
          productType: product.productType,
          service: product.service,
          deliveryMode: product.deliveryMode,
          sessionType: product.sessionType,
          isRecurring: product.isRecurring,
          programLength: product.programLength,
          mode: product.mode,
          durationInMinutes: product.durationInMinutes,
          minutesPerSession: product.minutesPerSession,
          hasClassroom: product.hasClassroom,
          hasSession: product.hasSession,
          hasAssessment: product.hasAssessment,
          hasCertificate: product.hasCertificate,
          requiresBooking: product.requiresBooking,
          requiresEnrollment: product.requiresEnrollment,
          isBookableService: product.isBookableService,
          nonBookableService: !product.isBookableService, // ← mirror here
          price: product.price,
          currency: product.currency || "gbp",
          discountPercentage: product.discountPercentage,
          maxParticipants: product.maxParticipants || 1,
          description: product.description,
          tags: product.tags || [],
          slug: product.slug,
          iconUrl: product.iconUrl,
          thumbnailUrl: product.thumbnailUrl,
          materialUrl: product.materialUrl,
          isAttachmentRequired: product.isAttachmentRequired,
          publicSchedulingUrl: product.publicSchedulingUrl,
          enabled: product.enabled,
          instructorId: product.instructorId,
        });

        // Pricing - convert from API format to new structure
        const pricingData: any = product.pricing || {};
        
        // Handle legacy format (model="per_unit") or new format
        let model: "one_time" | "subscription" = pricingData.model || "one_time";
        let priceBasis: "flat" | "per_unit" = "flat";
        
        // Handle migration from old format (model="per_unit" is no longer valid)
        // This should only happen if API returns legacy data
        if (pricingData.model === "per_unit") {
          // Default to one_time with per_unit basis
          model = "one_time";
          priceBasis = "per_unit";
        } else if (pricingData.priceBasis) {
          priceBasis = pricingData.priceBasis;
        } else if (pricingData.tiers && pricingData.tiers.length > 0) {
          // If tiers exist but no priceBasis, assume per_unit
          priceBasis = "per_unit";
        }
        
        // Safety check: ensure priceBasis is always set for one_time and subscription
        if (!priceBasis && (model === "one_time" || model === "subscription")) {
          priceBasis = "flat";
        }
        
        // Build pricing object with new structure
        const mappedPricing: Pricing = {
          model,
          priceBasis,
          currency: pricingData.currency || (product.currency || "gbp").toLowerCase(),
          taxInclusive: pricingData.taxInclusive ?? false,
          vatPercentage: pricingData.vatPercentage ?? 0,
          discountPercentage: pricingData.discountPercentage ?? pricingData.discountPercent ?? 0,
          minQty: pricingData.minQty ?? 1,
          maxQty: pricingData.maxQty ?? 1000,
          allowInstallments: pricingData.allowInstallments ?? false,
        };
        
        // Add fields based on priceBasis
        if (priceBasis === "flat") {
          // Map subscriptionPrice to basePrice if needed (legacy support)
          mappedPricing.basePrice = pricingData.basePrice ?? 
            (pricingData.subscriptionPrice !== undefined ? Number(pricingData.subscriptionPrice) : undefined) ??
            Number(product.price || 0);
        } else if (priceBasis === "per_unit") {
          mappedPricing.unitName = pricingData.unitName || "team";
          mappedPricing.tierType = pricingData.tierType || "volume";
          mappedPricing.tiers = pricingData.tiers || [];
        }
        
        // Add subscription-specific fields
        if (model === "subscription") {
          if (priceBasis === "flat" && mappedPricing.basePrice === undefined) {
            // Map subscriptionPrice to basePrice if needed (legacy support)
            mappedPricing.basePrice = pricingData.basePrice ?? 
              (pricingData.subscriptionPrice !== undefined ? Number(pricingData.subscriptionPrice) : undefined) ??
              Number(product.price || 0);
          }
          mappedPricing.interval = pricingData.interval || "month";
          mappedPricing.intervalCount = pricingData.intervalCount || 1;
        }
        
        // Add installments if enabled
        if (model === "one_time" && pricingData.allowInstallments && pricingData.installments) {
          mappedPricing.allowInstallments = true;
          mappedPricing.installments = {
            enabled: true,
            count: pricingData.installments.count || 2,
            interval: pricingData.installments.interval || "month",
            intervalCount: pricingData.installments.intervalCount || 1,
            downPaymentType: pricingData.installments.downPaymentType || "percent",
            downPaymentValue: pricingData.installments.downPaymentValue || 20,
            allowEarlyPayoff: pricingData.installments.allowEarlyPayoff,
            provider: pricingData.installments.provider || "in_house",
          };
        }
        
        setPricing(mappedPricing);

        // Instructors
        if (instructorsRes?.data?.success) {
          setInstructors(instructorsRes.data.data.instructors || []);
        } else {
          setInstructors([]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchProduct();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Keep nonBookableService mirrored to the inverse of isBookableService
    if (name === "isBookableService") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        isBookableService: checked,
        nonBookableService: !checked,
        // Optional: when turning OFF bookable, clear scheduling/instructor
        ...(checked
          ? {}
          : {
              publicSchedulingUrl: "",
              instructorId: "",
            }),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" && "checked" in e.target
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? value === ""
            ? 0
            : Number(value)
          : value,
    }));
  };

  const handleDeleteMaterial = async () => {
    if (!form.materialUrl) return;
    setSaving(true);
    try {
      await deleteFileFromFirebase(form.materialUrl);
      setForm((prev) => ({ ...prev, materialUrl: "" }));
      setSuccess("Material deleted successfully!");
    } catch {
      setError("Failed to delete material. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File, type: "icon" | "thumbnail") => {
    setSaving(true);
    try {
      const currentUrl = type === "icon" ? form.iconUrl : form.thumbnailUrl;
      if (currentUrl) {
        try {
          await deleteFileFromFirebase(currentUrl);
        } catch (deleteErr) {
          console.warn(`Failed to delete old ${type}:`, deleteErr);
        }
      }
      const url = await uploadAssetImage(file, `product-${type}s`);
      setForm((prev: any) => ({
        ...prev,
        [type === "icon" ? "iconUrl" : "thumbnailUrl"]: url,
      }));
      setSuccess(
        `${type === "icon" ? "Icon" : "Thumbnail"} uploaded successfully!`
      );
    } catch {
      setError(`${type === "icon" ? "Icon" : "Thumbnail"} upload failed`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteImage = async (type: "icon" | "thumbnail") => {
    const currentUrl = type === "icon" ? form.iconUrl : form.thumbnailUrl;
    if (!currentUrl) return;
    setSaving(true);
    try {
      await deleteFileFromFirebase(currentUrl);
      setForm((prev) => ({
        ...prev,
        [type === "icon" ? "iconUrl" : "thumbnailUrl"]: "",
      }));
      setSuccess(
        `${type === "icon" ? "Icon" : "Thumbnail"} deleted successfully!`
      );
    } catch {
      setError(
        `Failed to delete ${
          type === "icon" ? "icon" : "thumbnail"
        }. Please try again.`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const token = getTokenFromCookies();
    if (!token) {
      setError("Authentication required. Please log in.");
      setSaving(false);
      return;
    }

    try {
      // Duration guards — only enforce strictly when bookable
      if (isBookable) {
        if (
          (form.durationInMinutes ?? 0) < 1 ||
          (form.durationInMinutes ?? 0) > 120
        ) {
          setError("Duration must be between 1 and 120 minutes.");
          setSaving(false);
          return;
        }
        if (
          (form.minutesPerSession ?? 0) < 1 ||
          (form.minutesPerSession ?? 0) > 120
        ) {
          setError("Minutes per session must be between 1 and 120 minutes.");
          setSaving(false);
          return;
        }
      } else {
        if (
          form.durationInMinutes &&
          (form.durationInMinutes < 1 || form.durationInMinutes > 120)
        ) {
          setError("Duration must be between 1 and 120 minutes (if provided).");
          setSaving(false);
          return;
        }
        if (
          form.minutesPerSession &&
          (form.minutesPerSession < 1 || form.minutesPerSession > 120)
        ) {
          setError(
            "Minutes per session must be between 1 and 120 (if provided)."
          );
          setSaving(false);
          return;
        }
      }

      // Validate pricing
      const pErr = validatePricing(pricing);
      if (pErr) {
        setError(pErr);
        setSaving(false);
        return;
      }

      // Build root payload and enforce instructor nulling when not required
      // Explicitly exclude subscriptionPrice, price, currency (legacy fields) - pricing is sent separately
      const formCopy = { ...form };
      // Remove legacy pricing fields that shouldn't be in root payload
      delete (formCopy as any).subscriptionPrice;
      delete (formCopy as any).price;
      delete (formCopy as any).currency;
      
      const rootPayload = {
        ...formCopy,
        nonBookableService: !isBookable, // ensure mirrored on send
        instructorId: instructorRequired ? form.instructorId || null : null,
        discountPercentage: Number(form.discountPercentage) || 0,
        maxParticipants: Number(form.maxParticipants) || 1,
        programLength: Number(form.programLength) || 0,
        durationInMinutes: Number(form.durationInMinutes) || 0,
        minutesPerSession: Number(form.minutesPerSession) || 0,
        tags: Array.isArray(form.tags) ? form.tags : [],
      } as const;

      // Pricing payload - build to backend shape
      const normalized = normalizePricingForApi(pricing);
      const allowedCurrencies = ["usd", "eur", "gbp", "cad", "aud", "jpy", "inr", "ngn"] as const;
      const currency = (normalized.currency || "gbp").toLowerCase();
      const safeCurrency = (allowedCurrencies.includes(currency as any)
        ? currency
        : "gbp") as typeof allowedCurrencies[number];

      // Debug: show normalized pricing before toBackendPricing
      console.log("[Edit Product] Raw pricing:", pricing);
      console.log("[Edit Product] Normalized pricing:", normalized);

      const toBackendPricing = (p: Pricing) => {
        if (p.model === "subscription") {
          const payload: any = {
            model: "subscription",
            priceBasis: p.priceBasis ?? "flat",
            currency: safeCurrency,
            interval: p.interval || "month",
            intervalCount: p.intervalCount || 1,
            trialDays: p.trialDays ?? 0,
            setupFee: Number(p.setupFee || 0),
            autoRenew: p.autoRenew ?? true,
            minTermMonths: p.minTermMonths ?? 0,
            proration: p.proration ?? true,
          };
          // Use basePrice for flat pricing, add per_unit fields if needed
          if (p.priceBasis === "flat") {
            payload.basePrice = Number(p.basePrice ?? 0);
            // Backend still expects subscriptionPrice field (legacy support)
            payload.subscriptionPrice = Number(p.basePrice ?? 0);
          } else if (p.priceBasis === "per_unit") {
            const unitName = p.unitName === "person" ? "participant" : p.unitName || "participant";
            payload.unitName = unitName;
            payload.allowQuantity = true;
            payload.minQty = p.minQty ?? 1;
            payload.maxQty = p.maxQty ?? Math.max(payload.minQty, 1000);
            payload.tierType = p.tierType || "volume";
            payload.tiers = (p.tiers || []).map((t) => ({ upTo: Number(t.upTo), unitPrice: Number(t.unitPrice) }));
            // Backend still expects subscriptionPrice field (legacy support) - set to 0 for per_unit
            payload.subscriptionPrice = 0;
          }
          // Add tax fields if present
          if (p.taxInclusive !== undefined) payload.taxInclusive = p.taxInclusive;
          if (p.vatPercentage !== undefined) payload.vatPercentage = p.vatPercentage ?? 0;
          return payload;
        }
        
        if (p.model === "free") {
          return {
            model: "free",
            currency: safeCurrency,
          };
        }

        const unitName = p.unitName === "person" ? "participant" : p.unitName || "participant";
        const base = Number(p.basePrice || 0);
        const payload: any = {
          model: "one_time",
          priceBasis: p.priceBasis ?? "flat", // Default to flat only if missing (preserves "per_unit" if set)
          currency: safeCurrency,
          taxInclusive: p.taxInclusive ?? false,
          vatPercentage: p.vatPercentage ?? 0,
        };
        // Only send basePrice for flat pricing
        if (p.priceBasis !== "per_unit") {
          payload.basePrice = base;
        }
        if (p.priceBasis === "per_unit") {
          payload.unitName = unitName;
          payload.minQty = p.minQty ?? 1;
          payload.maxQty = p.maxQty ?? Math.max(payload.minQty, 1000);
          payload.tierType = p.tierType || "volume";
          payload.tiers = (p.tiers || []).map((t) => ({ upTo: Number(t.upTo), unitPrice: Number(t.unitPrice) }));
        }
        // Only include installments if explicitly enabled
        // Note: p is normalized which deletes installments if allowInstallments is false
        // So we check original pricing object directly
        if (pricing.allowInstallments && pricing.installments) {
          payload.allowInstallments = true;
          payload.installments = {
            enabled: true,
            count: Math.max(2, Number(pricing.installments.count || 2)),
            interval: pricing.installments.interval || "month",
            intervalCount: pricing.installments.intervalCount || 1,
            downPaymentType: pricing.installments.downPaymentType,
            downPaymentValue: Math.max(0, Number(pricing.installments.downPaymentValue || 0)),
            allowEarlyPayoff: pricing.installments.allowEarlyPayoff ?? false,
            provider: pricing.installments.provider || "in_house",
          };
        }
        return payload;
      };

      const sanitizedPricing = toBackendPricing(normalized);

      // Debug: show payloads being sent (pricing by model)
      try {
        console.log("[Edit Product] Pricing model:", normalized.model);
        console.log("[Edit Product] Pricing payload:", sanitizedPricing);
        console.log("[Edit Product] Root payload (partial):", {
          isBookableService: rootPayload.isBookableService,
          nonBookableService: rootPayload.nonBookableService,
          productType: rootPayload.productType,
        });
      } catch {}

      const [rootRes, pricingRes] = await Promise.all([
        updateApiRequest(`/api/products/${params.id}`, token, rootPayload),
        patchApiRequest(
          `/api/products/${params.id}/pricing`,
          token,
          { pricing: sanitizedPricing }
        ),
      ]);

      if (
        rootRes?.data?.success &&
        (pricingRes?.data?.ok || pricingRes?.data?.success)
      ) {
        setSuccess("Product updated successfully!");
        setTimeout(() => {
          router.push(`/dashboard/products/${params.id}`);
        }, 1200);
      } else {
        const msg =
          rootRes?.data?.message ||
          pricingRes?.data?.message ||
          "Failed to update product";
        setError(msg);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"></div>
              <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-slate-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-3xl p-8 text-center">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/products/${params.id}`}>
              <button className="p-3 rounded-full hover:bg-slate-100 transition-all duration-300">
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Edit Product
              </h1>
              <p className="text-slate-600 mt-1">
                Update product information and settings
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Basic Information
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Product Type *
                  </label>
                  <select
                    name="productType"
                    value={form.productType || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  >
                    <option value="">Select Product Type</option>
                    {PRODUCT_TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Service Name *
                  </label>
                  <Input
                    name="service"
                    value={form.service || ""}
                    onChange={handleChange}
                    placeholder="Enter service name"
                    className="px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                {/* Bookable toggle (moved up from Features) */}
                <div className="mt-2">
                  <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-300 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isBookableService"
                      checked={!!form.isBookableService}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Bookable Service
                    </span>
                  </label>
                  <p className="text-slate-500 text-xs mt-1 ml-2">
                    If enabled, customers schedule sessions. An instructor is
                    required when bookable (including for “Tools”).
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Booking Scheduling Link{" "}
                    {isBookable && <span className="text-red-500">*</span>}
                  </label>
                  <Input
                    name="publicSchedulingUrl"
                    value={form.publicSchedulingUrl || ""}
                    onChange={handleChange}
                    placeholder="Generate the scheduling link for the service"
                    className="px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required={isBookable}
                    disabled={!isBookable}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Assign Instructor{" "}
                    {instructorRequired && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <select
                    name="instructorId"
                    value={form.instructorId || ""}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/50 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      instructorRequired && !form.instructorId
                        ? "border-red-300 focus:ring-red-500"
                        : "border-slate-200"
                    }`}
                    disabled={!isBookable || instructorsLoading}
                    required={instructorRequired}
                  >
                    <option value="">
                      {instructorsLoading
                        ? "Loading instructors..."
                        : !isBookable
                        ? "Select Instructor (Disabled for non-bookable)"
                        : instructorRequired
                        ? "Select Instructor (Required)"
                        : "Select Instructor (Optional)"}
                    </option>
                    {instructors.map((instructor) => (
                      <option key={instructor._id} value={instructor.userId}>
                        {instructor.fullName} - {instructor.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Materials for training-typed products */}
                {form.productType &&
                  requiresTrainingMaterials(form.productType) && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Training Materials *
                      </label>

                      {form.materialUrl && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-[12px]">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-green-700 text-sm font-medium">
                                Current Material
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={handleDeleteMaterial}
                              disabled={saving}
                              className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-[10px] transition-colors duration-200 disabled:opacity-50"
                            >
                              {saving ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                          <a
                            href={form.materialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm underline"
                          >
                            Preview current material
                          </a>
                          <p className="text-green-600 text-xs mt-1">
                            Tech professionals will be able to download this
                            material after purchase
                          </p>
                        </div>
                      )}

                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar,.xlsx,.csv"
                        className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSaving(true);
                            try {
                              if (form.materialUrl) {
                                try {
                                  await deleteFileFromFirebase(
                                    form.materialUrl
                                  );
                                } catch (deleteErr) {
                                  console.warn(
                                    "Failed to delete old material:",
                                    deleteErr
                                  );
                                }
                              }
                              const url = await uploadMaterial(
                                file,
                                "course-materials"
                              );
                              setForm((prev: any) => ({
                                ...prev,
                                materialUrl: url,
                              }));
                              setSuccess("Material uploaded successfully!");
                            } catch {
                              setError("Material upload failed");
                            } finally {
                              setSaving(false);
                            }
                          }
                        }}
                      />

                      <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-[12px]">
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg
                              className="w-3 h-3 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-blue-800 text-sm font-medium mb-1">
                              For Tech Professionals
                            </p>
                            <p className="text-blue-700 text-sm">
                              Upload training materials, course content,
                              resources, or documents that tech professionals
                              can view and download after purchase.
                            </p>
                            <p className="text-blue-600 text-xs mt-1">
                              Supported: PDF, DOC, DOCX, PPT, PPTX, TXT, ZIP,
                              RAR, XLSX, CSV
                            </p>
                            {form.materialUrl && (
                              <p className="text-blue-600 text-xs mt-2 font-medium">
                                💡 Uploading a new file will replace the current
                                material
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description{" "}
                    {isBookable && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    name="description"
                    value={form.description || ""}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    rows={4}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    required={isBookable}
                  />
                </div>

                {/* Icon Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Product Icon
                  </label>

                  {form.iconUrl && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-[12px]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-blue-700 text-sm font-medium">
                            Current Icon
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteImage("icon")}
                          disabled={saving}
                          className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-[10px] transition-colors duration-200 disabled:opacity-50"
                        >
                          {saving ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <img
                          src={form.iconUrl}
                          alt="Product icon"
                          className="w-12 h-12 rounded-[10px] object-cover border border-blue-200"
                        />
                        <a
                          href={form.iconUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          View full size
                        </a>
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await handleImageUpload(file, "icon");
                    }}
                  />
                  <p className="text-slate-500 text-sm mt-1">
                    Upload a square icon image (64–128px)
                  </p>
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Product Thumbnail
                  </label>

                  {form.thumbnailUrl && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-[12px]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-700 text-sm font-medium">
                            Current Thumbnail
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteImage("thumbnail")}
                          disabled={saving}
                          className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-[10px] transition-colors duration-200 disabled:opacity-50"
                        >
                          {saving ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <img
                          src={form.thumbnailUrl}
                          alt="Product thumbnail"
                          className="w-16 h-16 rounded-[10px] object-cover border border-green-200"
                        />
                        <a
                          href={form.thumbnailUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 text-sm underline"
                        >
                          View full size
                        </a>
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await handleImageUpload(file, "thumbnail");
                    }}
                  />
                  <p className="text-slate-500 text-sm mt-1">
                    Recommended: 16:9 or ~400×300px
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Slug *
                  </label>
                  <Input
                    name="slug"
                    value={form.slug || ""}
                    onChange={handleChange}
                    placeholder="Enter URL-friendly slug"
                    className="px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Delivery & Session */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Delivery & Session
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Delivery Mode{" "}
                    {isBookable && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    name="deliveryMode"
                    value={form.deliveryMode || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required={isBookable}
                  >
                    <option value="">Select Delivery Mode</option>
                    {DELIVERY_MODE_OPTIONS.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Session Type{" "}
                    {isBookable && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    name="sessionType"
                    value={form.sessionType || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required={isBookable}
                  >
                    <option value="">Select Session Type</option>
                    {SESSION_TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Program Length{" "}
                      {isBookable && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      name="programLength"
                      value={form.programLength ?? ""}
                      onChange={handleChange}
                      type="number"
                      min={0}
                      placeholder="e.g., 8"
                      className="px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required={isBookable}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Mode{" "}
                      {isBookable && <span className="text-red-500">*</span>}
                    </label>
                    <select
                      name="mode"
                      value={form.mode || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required={isBookable}
                    >
                      <option value="">Select Mode</option>
                      {MODE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Duration */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Pricing & Duration
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <PricingForm 
                  value={pricing} 
                  onChange={(next) => setPricing(next)} 
                />
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Duration (minutes){" "}
                    {isBookable && <span className="text-red-500">*</span>}
                  </label>
                  <Input
                    name="durationInMinutes"
                    value={form.durationInMinutes ?? ""}
                    onChange={handleChange}
                    type="number"
                    min={1}
                    max={120}
                    placeholder="Total duration (1-120 minutes)"
                    className="px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required={isBookable}
                  />
                  {form.durationInMinutes &&
                    (form.durationInMinutes < 1 ||
                      form.durationInMinutes > 120) && (
                      <p className="text-red-500 text-sm mt-1">
                        Duration must be between 1 and 120 minutes.
                      </p>
                    )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Minutes Per Session{" "}
                    {isBookable && <span className="text-red-500">*</span>}
                  </label>
                  <Input
                    name="minutesPerSession"
                    value={form.minutesPerSession ?? ""}
                    onChange={handleChange}
                    type="number"
                    min={1}
                    max={120}
                    placeholder="Per session duration (1-120 minutes)"
                    className="px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required={isBookable}
                  />
                  {form.minutesPerSession &&
                    (form.minutesPerSession < 1 ||
                      form.minutesPerSession > 120) && (
                      <p className="text-red-500 text-sm mt-1">
                        Minutes per session must be between 1 and 120 minutes.
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Features (minus Bookable Service, since it's now in Basic Info) */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Features
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: "hasCertificate", label: "Has Certificate" },
                  { key: "hasAssessment", label: "Has Assessment" },
                  { key: "hasClassroom", label: "Has Classroom" },
                  { key: "hasSession", label: "Has Session" },
                  { key: "requiresBooking", label: "Requires Booking" },
                  { key: "requiresEnrollment", label: "Requires Enrollment" },
                  // removed isBookableService from here
                  { key: "isRecurring", label: "Recurring" },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name={key}
                      checked={!!form[key as keyof typeof form]}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Tags</h2>
              <Input
                name="tags"
                value={Array.isArray(form.tags) ? form.tags.join(", ") : ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    tags: e.target.value
                      .split(",")
                      .map((s: string) => s.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="Enter tags separated by commas (e.g., Python, AI, Machine Learning)"
                className="px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Status */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Status</h2>
              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="enabled"
                  checked={!!form.enabled}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  Product Enabled
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Link href={`/dashboard/products/${params.id}`}>
                  <button
                    type="button"
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg"
                  >
                    Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Messages */}
            {success && (
              <div className="my-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-green-700 font-medium">{success}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="my-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
