"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getApiRequest,
  patchApiRequest,
  updateApiRequest,
  postApiRequest,
} from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Loader2, Plus } from "lucide-react";
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
import {
  Pricing,
  defaultPricing,
  normalizePricingForApi,
} from "@/lib/constants/pricing";
import PricingForm from "@/components/PricingForms";
import { validatePricing } from "@/utils/pricingApi";
import safeConsole from "@/lib/console";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Helper function to check if product type requires training materials
const requiresTrainingMaterials = (productType: string) => {
  return [
    "Training & Certification",
    "Academic Support Services",
    "Career Development & Mentorship",
  ].includes(productType);
};

type CategoryOption = {
  _id: string;
  title: string;
  productType?: string;
  isDeleted?: boolean;
};

type SubcategoryOption = {
  _id: string;
  name: string;
  isDeleted?: boolean;
};

type ProductFormState = Partial<Product> & {
  nonBookableService?: boolean;
  productCategoryTitle?: string;
  productSubcategoryName?: string;
  category?: string; // UI field
  subcategory?: string; // UI field
  mediaType?: string;
};

export default function ProductEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<ProductFormState>({});

  const [instructors, setInstructors] = useState<any[]>([]);
  const [instructorsLoading, setInstructorsLoading] = useState(false);
  const [instructorsError, setInstructorsError] = useState<string | null>(null);

  const [pricing, setPricing] = useState<Pricing>(null as any);

  // Category creation dialog state
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Subcategory creation dialog state
  const [showSubcategoryDialog, setShowSubcategoryDialog] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [creatingSubcategory, setCreatingSubcategory] = useState(false);

  const [subcategoryOptions, setSubcategoryOptions] = useState<
    SubcategoryOption[]
  >([]);
  const [subcategoryLoading, setSubcategoryLoading] = useState(false);
  const [subcategoryError, setSubcategoryError] = useState<string | null>(null);

  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Derived flags
  const isBookable = !!form.isBookableService;
  const instructorRequired = isBookable;

  // Fetch categories + instructors on mount
  useEffect(() => {
    const fetchCategoriesAndInstructors = async () => {
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      try {
        setCategoryLoading(true);
        setInstructorsLoading(true);
        setCategoryError(null);
        setInstructorsError(null);

        const [categoriesResponse, instructorsResponse] = await Promise.all([
          getApiRequest(`/api/product-categories`, token),
          getApiRequest(`/api/users/admin/instructors`, token),
        ]);

        // Categories
        const categoriesData =
          categoriesResponse?.data?.data || categoriesResponse?.data || [];
        const activeCategories = (categoriesData as any[]).filter(
          (cat) => !cat.isDeleted
        );
        setCategoryOptions(activeCategories);

        // Instructors
        if (instructorsResponse?.data?.success) {
          const instructorData =
            instructorsResponse.data.data?.instructors || [];
          setInstructors(instructorData);
        } else {
          setInstructors([]);
          setInstructorsError("Failed to fetch instructors");
        }
      } catch (err: any) {
        setCategoryError(err.message || "Failed to fetch categories");
        setInstructorsError(err.message || "Failed to fetch instructors");
      } finally {
        setCategoryLoading(false);
        setInstructorsLoading(false);
      }
    };

    fetchCategoriesAndInstructors();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (!form.category) {
      setSubcategoryOptions([]);
      setForm((prev) => ({ ...prev, subcategory: "" }));
      return;
    }

    const selectedCategory = categoryOptions.find(
      (cat) => cat.title === form.category
    );
    if (!selectedCategory) {
      setSubcategoryOptions([]);
      return;
    }

    const fetchSubcategories = async () => {
      setSubcategoryLoading(true);
      setSubcategoryError(null);
      try {
        const token = getTokenFromCookies() || "";
        const res = await getApiRequest(
          `/api/product-subcategories/category/${selectedCategory._id}`,
          token
        );
        const data = res?.data?.data || res?.data || [];
        const activeSubcategories = (data as any[]).filter(
          (sub) => !sub.isDeleted
        );
        setSubcategoryOptions(activeSubcategories);

        // Ensure current subcategory is valid
        setForm((prev) => ({
          ...prev,
          subcategory: activeSubcategories.some(
            (subcat: any) => subcat.name === prev.subcategory
          )
            ? prev.subcategory
            : "",
        }));
      } catch (err: any) {
        setSubcategoryError(err.message || "Failed to fetch subcategories");
        setSubcategoryOptions([]);
      } finally {
        setSubcategoryLoading(false);
      }
    };
    fetchSubcategories();
  }, [form.category, categoryOptions]);

  // Create new category
  const handleCreateCategory = async () => {
    if (!newCategoryTitle.trim() || !form.productType) {
      toast.error("Please enter a category title and select a product type");
      return;
    }

    setCreatingCategory(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await postApiRequest(
        "/api/product-categories",
        token,
        {
          title: newCategoryTitle.trim(),
          productType: form.productType,
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Category created successfully!");

        // Refresh categories for this product type
        const res = await getApiRequest(
          `/api/product-categories/type/${encodeURIComponent(
            form.productType as string
          )}`,
          token
        );
        const data = res?.data?.data || res?.data || [];
        const activeCategories = (data as any[]).filter(
          (cat) => !cat.isDeleted
        );
        setCategoryOptions(activeCategories);

        setForm((prev) => ({
          ...prev,
          category: response.data?.title || newCategoryTitle.trim(),
        }));

        setNewCategoryTitle("");
        setShowCategoryDialog(false);
      } else {
        toast.error(
          process.env.NEXT_PUBLIC_NODE_ENV === "production"
            ? "Failed to create category"
            : response.message || "Failed to create category"
        );
      }
    } catch {
      toast.error("Failed to create category");
    } finally {
      setCreatingCategory(false);
    }
  };

  // Create new subcategory
  const handleCreateSubcategory = async () => {
    if (!newSubcategoryName.trim() || !form.category || !form.productType) {
      toast.error(
        "Please enter a subcategory name, select a category, and ensure product type is set"
      );
      return;
    }

    setCreatingSubcategory(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const selectedCategory = categoryOptions.find(
        (cat) => cat.title === form.category
      );
      if (!selectedCategory) {
        toast.error("Selected category not found");
        return;
      }

      const response = await postApiRequest(
        "/api/product-subcategories",
        token,
        {
          name: newSubcategoryName.trim(),
          categoryTitle: form.category,
          categoryId: selectedCategory._id,
          productType: form.productType,
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Subcategory created successfully!");

        const res = await getApiRequest(
          `/api/product-subcategories/category/${selectedCategory._id}`,
          token
        );
        const data = res?.data?.data || res?.data || [];
        const activeSubcategories = (data as any[]).filter(
          (sub) => !sub.isDeleted
        );
        setSubcategoryOptions(activeSubcategories);

        setForm((prev) => ({
          ...prev,
          subcategory: response.data?.name || newSubcategoryName.trim(),
        }));

        setNewSubcategoryName("");
        setShowSubcategoryDialog(false);
      } else {
        toast.error(
          process.env.NEXT_PUBLIC_NODE_ENV === "production"
            ? "Failed to create subcategory"
            : response.message || "Failed to create subcategory"
        );
      }
    } catch {
      toast.error("Failed to create subcategory");
    } finally {
      setCreatingSubcategory(false);
    }
  };

  // Unified handleChange
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name === "category" && value === "__create_new__") {
      setShowCategoryDialog(true);
      return;
    }
    if (name === "subcategory" && value === "__create_new__") {
      setShowSubcategoryDialog(true);
      return;
    }

    // Keep nonBookableService mirrored to the inverse of isBookableService
    if (name === "isBookableService") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        isBookableService: checked,
        nonBookableService: !checked,
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

  // Fetch product
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
        const productRes = await getApiRequest(
          `/api/products/public/${params.id}`,
          token
        );

        if (!productRes?.data?.success) {
          throw new Error(
            productRes?.data?.message || "Failed to load product"
          );
        }

        const product = productRes.data.data;

        // Map product to form state, including category/subcategory UI fields
        setForm((prev) => ({
          ...prev,
          productType: product.productType,
          service: product.service,
          productCategoryTitle: product.productCategoryTitle,
          productSubcategoryName: product.productSubcategoryName,
          category: product.productCategoryTitle || "",
          subcategory: product.productSubcategoryName || "",
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
          nonBookableService: !product.isBookableService,
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
          mediaType: product.mediaType,
        }));

        // Pricing - convert from API format to new structure
        const pricingData: any = product.pricing || {};

        let model: "one_time" | "subscription" | "free" =
          pricingData.model || "one_time";
        let priceBasis: "flat" | "per_unit" = "flat";

        // Legacy: model="per_unit"
        if (pricingData.model === "per_unit") {
          model = "one_time";
          priceBasis = "per_unit";
        } else if (pricingData.priceBasis) {
          priceBasis = pricingData.priceBasis;
        } else if (pricingData.tiers && pricingData.tiers.length > 0) {
          priceBasis = "per_unit";
        }

        if (!priceBasis && (model === "one_time" || model === "subscription")) {
          priceBasis = "flat";
        }

        const mappedPricing: Pricing = {
          model,
          priceBasis,
          currency:
            pricingData.currency || (product.currency || "gbp").toLowerCase(),
          taxInclusive: pricingData.taxInclusive ?? false,
          vatPercentage: pricingData.vatPercentage ?? 0,
          discountPercentage:
            pricingData.discountPercentage ?? pricingData.discountPercent ?? 0,
          minQty: pricingData.minQty ?? 1,
          maxQty: pricingData.maxQty ?? 1000,
          allowInstallments: pricingData.allowInstallments ?? false,
        };

        if (priceBasis === "flat") {
          mappedPricing.basePrice =
            pricingData.basePrice ??
            (pricingData.subscriptionPrice !== undefined
              ? Number(pricingData.subscriptionPrice)
              : undefined) ??
            Number(product.price || 0);
        } else if (priceBasis === "per_unit") {
          const apiUnitName = pricingData.unitName || "team";
          mappedPricing.unitName =
            apiUnitName === "participant" ? "person" : apiUnitName;
          mappedPricing.tierType = pricingData.tierType || "volume";
          mappedPricing.tiers = pricingData.tiers || [];
        }

        if (model === "subscription") {
          if (priceBasis === "flat" && mappedPricing.basePrice === undefined) {
            mappedPricing.basePrice =
              pricingData.basePrice ??
              (pricingData.subscriptionPrice !== undefined
                ? Number(pricingData.subscriptionPrice)
                : undefined) ??
              Number(product.price || 0);
          }
          mappedPricing.interval = pricingData.interval || "month";
          mappedPricing.intervalCount = pricingData.intervalCount || 1;
        }

        if (
          model === "one_time" &&
          pricingData.allowInstallments &&
          pricingData.installments
        ) {
          mappedPricing.allowInstallments = true;
          mappedPricing.installments = {
            enabled: true,
            count: pricingData.installments.count || 2,
            interval: pricingData.installments.interval || "month",
            intervalCount: pricingData.installments.intervalCount || 1,
            downPaymentType:
              pricingData.installments.downPaymentType || "percent",
            downPaymentValue: pricingData.installments.downPaymentValue || 20,
            allowEarlyPayoff: pricingData.installments.allowEarlyPayoff,
            provider: pricingData.installments.provider || "in_house",
          };
        }

        setPricing(mappedPricing);
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchProduct();
  }, [params.id]);

  const handleDeleteMaterial = async () => {
    if (!form.materialUrl) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await deleteFileFromFirebase(form.materialUrl);
    } catch (err: any) {
      const msg = err?.message || "";
      const code = err?.code || "";

      if (
        code === "storage/object-not-found" ||
        msg.includes("storage/object-not-found")
      ) {
        safeConsole.warn(
          "[Product Edit] Material already deleted in storage:",
          err
        );
      } else {
        setError("Failed to delete material. Please try again.");
        setSaving(false);
        return;
      }
    }

    setForm((prev) => ({ ...prev, materialUrl: "" }));
    setSuccess("Material deleted successfully!");
    setSaving(false);
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
      setForm((prev) => ({
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
        if ((form.durationInMinutes ?? 0) < 1) {
          setError("Duration must be greater than 1 minutes.");
          setSaving(false);
          return;
        }
        if ((form.minutesPerSession ?? 0) < 1) {
          setError("Minutes per session must be greater than 1 minutes.");
          setSaving(false);
          return;
        }
      } else {
        if (form.durationInMinutes && form.durationInMinutes < 1) {
          setError("Duration must be greater than 1 minutes (if provided).");
          setSaving(false);
          return;
        }
        if (form.minutesPerSession && form.minutesPerSession < 1) {
          setError("Minutes per session must be greater than 1 (if provided).");
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

      // Build root payload
      const formCopy: ProductFormState = { ...form };

      // Remove legacy pricing fields from root
      delete (formCopy as any).subscriptionPrice;
      delete (formCopy as any).price;
      delete (formCopy as any).currency;

      const { category, subcategory, ...restForm } = formCopy;

      const rootPayload = {
        ...restForm,
        // Map UI fields to API fields
        productCategoryTitle:
          category || restForm.productCategoryTitle || undefined,
        productSubcategoryName:
          subcategory || restForm.productSubcategoryName || undefined,
        nonBookableService: !isBookable,
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
      const allowedCurrencies = [
        "usd",
        "eur",
        "gbp",
        "cad",
        "aud",
        "jpy",
        "inr",
        "ngn",
      ] as const;
      const currency = (normalized.currency || "gbp").toLowerCase();
      const safeCurrency = (
        allowedCurrencies.includes(currency as any) ? currency : "gbp"
      ) as (typeof allowedCurrencies)[number];

      const toBackendPricing = (p: Pricing) => {
        // FREE
        if (p.model === "free") {
          return {
            model: "free",
            currency: safeCurrency,
          };
        }

        // SUBSCRIPTION
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
            allowInstallments: false,
          };

          if (payload.priceBasis === "flat") {
            payload.basePrice = Number(p.basePrice ?? 0);
            payload.subscriptionPrice = payload.basePrice;
          } else if (payload.priceBasis === "per_unit") {
            const unitName =
              p.unitName === "person"
                ? "participant"
                : p.unitName || "participant";
            payload.basePrice = 0;
            payload.unitName = unitName;
            payload.minQty = p.minQty ?? 1;
            payload.maxQty = p.maxQty ?? Math.max(payload.minQty, 1000);
            payload.tierType = p.tierType || "volume";
            payload.tiers = (p.tiers || []).map((t) => ({
              upTo: Number(t.upTo),
              unitPrice: Number(t.unitPrice),
            }));
            payload.subscriptionPrice = 0;
          }

          if (p.taxInclusive !== undefined)
            payload.taxInclusive = p.taxInclusive;
          if (p.vatPercentage !== undefined)
            payload.vatPercentage = p.vatPercentage;

          return payload;
        }

        // ONE-TIME
        const priceBasis = p.priceBasis ?? "flat";
        const payload: any = {
          model: "one_time",
          priceBasis,
          currency: safeCurrency,
          taxInclusive: p.taxInclusive ?? false,
          vatPercentage: p.vatPercentage ?? 0,
        };

        if (priceBasis === "flat") {
          payload.basePrice = Number(p.basePrice ?? 0);
        } else if (priceBasis === "per_unit") {
          const unitName =
            p.unitName === "person"
              ? "participant"
              : p.unitName || "participant";
          payload.basePrice = 0;
          payload.unitName = unitName;
          payload.minQty = p.minQty ?? 1;
          payload.maxQty = p.maxQty ?? Math.max(payload.minQty, 1000);
          payload.tierType = p.tierType || "volume";
          payload.tiers = (p.tiers || []).map((t) => ({
            upTo: Number(t.upTo),
            unitPrice: Number(t.unitPrice),
          }));
        }

        const hasInstallments = !!(p.allowInstallments && p.installments);
        payload.allowInstallments = hasInstallments;

        if (hasInstallments) {
          payload.installments = {
            enabled: true,
            count: Math.max(2, Number(p.installments!.count || 2)),
            interval: p.installments!.interval || "month",
            intervalCount: p.installments!.intervalCount || 1,
            downPaymentType: p.installments!.downPaymentType,
            downPaymentValue: Math.max(
              0,
              Number(p.installments!.downPaymentValue || 0)
            ),
            allowEarlyPayoff: p.installments!.allowEarlyPayoff ?? false,
            provider: p.installments!.provider || "in_house",
          };
        }

        return payload;
      };

      const sanitizedPricing = toBackendPricing(normalized);

      try {
        safeConsole.log("[Edit Product] Pricing model:", normalized.model);
        safeConsole.log("[Edit Product] Pricing payload:", sanitizedPricing);
        safeConsole.log("[Edit Product] Root payload (partial):", {
          isBookableService: rootPayload.isBookableService,
          nonBookableService: rootPayload.nonBookableService,
          productType: rootPayload.productType,
          productCategoryTitle: rootPayload.productCategoryTitle,
          productSubcategoryName: rootPayload.productSubcategoryName,
        });
      } catch {}

      const [rootRes, pricingRes] = await Promise.all([
        updateApiRequest(`/api/products/${params.id}`, token, rootPayload),
        patchApiRequest(`/api/products/${params.id}/pricing`, token, {
          pricing: sanitizedPricing,
        }),
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

  if (error && !success) {
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
              <button
                title="button"
                className="p-3 rounded-full hover:bg-slate-100 transition-all duration-300"
              >
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
                    title="productType"
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

                {/* Product Category & Subcategory */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    title="category"
                    value={form.category || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                    disabled={!form.productType || categoryLoading}
                  >
                    <option value="">
                      {categoryLoading
                        ? "Loading categories..."
                        : "Select Category"}
                    </option>
                    {categoryOptions
                      .filter(
                        (cat) =>
                          !form.productType ||
                          !cat.productType ||
                          cat.productType === form.productType
                      )
                      .map((cat) => (
                        <option key={cat._id} value={cat.title}>
                          {cat.title}
                        </option>
                      ))}
                    {form.productType && (
                      <option value="__create_new__">
                        ➕ Create New Category
                      </option>
                    )}
                  </select>
                  {categoryError && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-[12px] border border-red-200">
                      {categoryError}
                    </div>
                  )}

                  {/* Category Dialog */}
                  <Dialog
                    open={showCategoryDialog}
                    onOpenChange={setShowCategoryDialog}
                  >
                    <DialogContent className="sm:max-w-md bg-white">
                      <DialogHeader>
                        <DialogTitle>Create New Category</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="productType">Product Type</Label>
                          <Input
                            id="productType"
                            value={form.productType || ""}
                            disabled
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="categoryTitle">
                            Category Title *
                          </Label>
                          <Input
                            id="categoryTitle"
                            value={newCategoryTitle}
                            onChange={(e) =>
                              setNewCategoryTitle(e.target.value)
                            }
                            placeholder="Enter category title (e.g., Academic Mentoring)"
                            className="mt-1"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowCategoryDialog(false)}
                          disabled={creatingCategory}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={handleCreateCategory}
                          disabled={
                            creatingCategory || !newCategoryTitle.trim()
                          }
                          className="hover:bg-blue-600 text-white"
                        >
                          {creatingCategory ? "Creating..." : "Create Category"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Subcategory *
                  </label>
                  <select
                    name="subcategory"
                    title="subcategory"
                    value={form.subcategory || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    disabled={!form.category || subcategoryLoading}
                    required
                  >
                    <option value="">Select Subcategory</option>
                    {subcategoryOptions.map((sub) => (
                      <option key={sub._id} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                    {form.category && (
                      <option value="__create_new__">
                        ➕ Create New Subcategory
                      </option>
                    )}
                  </select>
                  {subcategoryLoading && (
                    <div className="text-blue-600 text-sm bg-blue-50 p-3 rounded-[12px] border border-blue-200">
                      Loading subcategories...
                    </div>
                  )}
                  {!form.category && subcategoryOptions.length === 0 && (
                    <div className="text-slate-500 text-sm bg-slate-50 p-3 rounded-[12px] border border-slate-200">
                      Select a category first to see available subcategories.
                    </div>
                  )}
                  {form.category &&
                    subcategoryOptions.length === 0 &&
                    !subcategoryLoading && (
                      <div className="text-slate-500 text-sm bg-slate-50 p-3 rounded-[12px] border border-slate-200">
                        No subcategories available for this category.
                      </div>
                    )}
                  {subcategoryError && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-[12px] border border-red-200">
                      {subcategoryError}
                    </div>
                  )}

                  {/* Subcategory Dialog */}
                  <Dialog
                    open={showSubcategoryDialog}
                    onOpenChange={setShowSubcategoryDialog}
                  >
                    <DialogContent className="sm:max-w-md bg-white">
                      <DialogHeader>
                        <DialogTitle>Create New Subcategory</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="dialogProductType">
                            Product Type
                          </Label>
                          <Input
                            id="dialogProductType"
                            value={form.productType || ""}
                            disabled
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dialogCategory">Category</Label>
                          <Input
                            id="dialogCategory"
                            value={form.category || ""}
                            disabled
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="subcategoryName">
                            Subcategory Name *
                          </Label>
                          <Input
                            id="subcategoryName"
                            value={newSubcategoryName}
                            onChange={(e) =>
                              setNewSubcategoryName(e.target.value)
                            }
                            placeholder="Enter subcategory name (e.g., Natural Language Processing)"
                            className="mt-1"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowSubcategoryDialog(false)}
                          disabled={creatingSubcategory}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={handleCreateSubcategory}
                          disabled={
                            creatingSubcategory || !newSubcategoryName.trim()
                          }
                          className="hover:bg-blue-600 text-white"
                        >
                          {creatingSubcategory
                            ? "Creating..."
                            : "Create Subcategory"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Bookable toggle */}
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

                {/* Instructor assign (single place) */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Assign Instructor{" "}
                    {instructorRequired && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <select
                    title="instructorId"
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
                  {instructorsError && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-[12px] border border-red-200 mt-2">
                      {instructorsError}
                    </div>
                  )}
                </div>

                {/* Media Type - only for Tools + nonBookableService */}
                {form.productType === "Tools" && !form.isBookableService && (
                  <>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Media Type *
                    </label>
                    <select
                      title="mediaType"
                      name="mediaType"
                      value={form.mediaType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required
                    >
                      <option value="">Select Media Type</option>
                      <option value="file">File</option>
                      <option value="audio">Audio</option>
                      <option value="video">Video</option>
                    </select>

                    {/* Media upload for Tools */}
                    <label className="block text-sm font-semibold text-slate-700 mb-2 mt-4">
                      Media File * ({form.mediaType || "Select type first"})
                    </label>
                    {form.materialUrl && (
                      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-[12px]">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-green-700 text-sm font-medium">
                              Current Media File
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleDeleteMaterial}
                            disabled={loading}
                            className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-[10px] transition-colors duration-200 disabled:opacity-50"
                          >
                            {loading ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                        <a
                          href={form.materialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          Preview uploaded media
                        </a>
                      </div>
                    )}
                    <input
                      title="file"
                      type="file"
                      accept={
                        form.mediaType === "file"
                          ? ".pdf"
                          : form.mediaType === "audio"
                          ? "audio/*"
                          : form.mediaType === "video"
                          ? "video/*"
                          : "*"
                      }
                      className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setLoading(true);
                          try {
                            if (form.materialUrl) {
                              try {
                                await deleteFileFromFirebase(form.materialUrl);
                              } catch (deleteErr) {
                                console.warn(
                                  "Failed to delete old media:",
                                  deleteErr
                                );
                              }
                            }
                            const url = await uploadMaterial(
                              file,
                              "tool-media"
                            );
                            setForm((prev) => ({
                              ...prev,
                              materialUrl: url,
                            }));
                            toast.success("Media uploaded successfully!");
                          } catch {
                            setError("Media upload failed");
                          } finally {
                            setLoading(false);
                          }
                          e.target.value = "";
                        }
                      }}
                      required={!form.materialUrl}
                      disabled={!form.mediaType}
                    />

                    {!form.mediaType && (
                      <p className="text-slate-500 text-xs mt-1">
                        Please select a media type first
                      </p>
                    )}
                  </>
                )}

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
                        title="file"
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
                              setForm((prev) => ({
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
                                material.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Attachment Required */}
                {form.productType && (
                  <div className="mt-4">
                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-300 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isAttachmentRequired"
                        checked={!!form.isAttachmentRequired}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        Attachment Required
                      </span>
                    </label>
                    <p className="text-slate-500 text-sm mt-1 ml-2">
                      Check if users need to submit attachments for this
                      service.
                    </p>
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
                    title="file"
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
                    title="file"
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
                    title="deliveryMode"
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
                    title="sessionType"
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
                      title="mode"
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
                    placeholder="Total duration in minutes"
                    className="px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required={isBookable}
                  />
                  {form.durationInMinutes && form.durationInMinutes < 1 && (
                    <p className="text-red-500 text-sm mt-1">
                      Duration must be greater than 1 minutes.
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
                    placeholder="Per session duration in minutes"
                    className="px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required={isBookable}
                  />
                  {form.minutesPerSession && form.minutesPerSession < 1 && (
                    <p className="text-red-500 text-sm mt-1">
                      Minutes per session must be greater than 1 minutes.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Features */}
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
                  { key: "isRecurring", label: "Recurring" },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name={key}
                      checked={!!(form as any)[key]}
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
