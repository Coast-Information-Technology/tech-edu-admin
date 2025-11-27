"use client";
import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { getTokenFromCookies } from "@/lib/cookies";
import { getApiRequest, postApiRequest } from "@/lib/apiFetch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import {
  uploadAssetImage,
  uploadMaterial,
  deleteFileFromFirebase,
} from "@/lib/firebase";
import {
  PRODUCT_TYPE_OPTIONS,
  DELIVERY_MODE_OPTIONS,
  SESSION_TYPE_OPTIONS,
  MODE_OPTIONS,
} from "@/lib/constants/products";
import {
  normalizePricingForApi,
  Pricing,
  Currency,
} from "@/lib/constants/pricing";
import PricingForm, {
  computePrice,
  formatMoney,
} from "@/components/PricingForms";

const initialForm = {
  productType: "",
  service: "",
  category: "",
  subcategory: "",
  deliveryMode: "",
  sessionType: "",
  isRecurring: false,
  requiresBooking: false,
  requiresEnrollment: false,
  hasCertificate: false,
  hasClassroom: false,
  hasSession: false,
  hasAssessment: false,
  isBookableService: false,
  nonBookableService: true, // ← NEW (unchecked bookable = non-bookable)
  programLength: 0,
  mode: "",
  durationInMinutes: 0,
  minutesPerSession: 0,
  maxParticipants: 1,
  description: "",
  tags: [] as string[],
  slug: "",
  iconUrl: "",
  thumbnailUrl: "",
  materialUrl: "",
  mediaType: "", // For Tools + nonBookableService
  isAttachmentRequired: false,
  publicSchedulingUrl: "",
  enabled: true,
  instructorId: "",
  // API mirror fields
  productSubcategoryName: "",
  productSubCategoryId: "",
  productCategoryTitle: "",
  productCategoryId: "",
};

const steps = [
  "Basic Info",
  "Delivery & Session",
  "Pricing & Duration",
  "Media & SEO",
  "Review & Submit",
];

export default function CreateProductPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<any>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const [subcategoryOptions, setSubcategoryOptions] = useState<
    { _id: string; name: string }[]
  >([]);
  const [subcategoryLoading, setSubcategoryLoading] = useState(false);
  const [subcategoryError, setSubcategoryError] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<
    { _id: string; title: string }[]
  >([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [instructorsLoading, setInstructorsLoading] = useState(false);
  const [instructorsError, setInstructorsError] = useState<string | null>(null);

  // Category creation dialog state
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Subcategory creation dialog state
  const [showSubcategoryDialog, setShowSubcategoryDialog] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [creatingSubcategory, setCreatingSubcategory] = useState(false);

  // Tag input state
  const [tagInput, setTagInput] = useState("");

  // 🧮 Pricing state (controlled by PricingForm)
  const [pricing, setPricing] = useState<Pricing>({
    model: "one_time",
    currency: "gbp",
    taxInclusive: true,
    vatPercentage: 0,
    priceBasis: "flat",
    discountPercentage: 0,
    basePrice: 0,
    minQty: 1,
    maxQty: 1000,
    allowInstallments: false,
    installments: undefined,
  });

  // Derived booleans used everywhere
  const isBookable = !!form.isBookableService;
  const instructorRequired = isBookable;

  const addTag = () => {
    const trimmedInput = tagInput.trim();
    if (!trimmedInput) return;

    // Split by commas and process each tag
    const tagsToAdd = trimmedInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .filter((tag) => !form.tags.includes(tag)); // Filter out duplicates

    if (tagsToAdd.length > 0) {
      setForm((prev: any) => ({
        ...prev,
        tags: [...prev.tags, ...tagsToAdd],
      }));
      setTagInput("");
    }
  };

  const requiresTrainingMaterials = (productType: string) => {
    return [
      "Training & Certification",
      "Academic Support Services",
      "Career Development & Mentorship",
    ].includes(productType);
  };

  const getServiceTypeDescription = () => {
    if (!form.productType) return "";
    if (isBookable) {
      return form.productType === "Tools"
        ? "This is a bookable service. Users can schedule sessions. Instructor is optional for this product type."
        : "This is a bookable service that typically involves an instructor. Users can book sessions with specific instructors.";
    } else {
      return "This is a non-bookable service. Users can access this service without booking with a specific instructor.";
    }
  };

  // Fetch categories + instructors on mount
  React.useEffect(() => {
    const fetchCategoriesAndServices = async () => {
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      try {
        setCategoryLoading(true);
        setCategoryError(null);

        // Categories
        const categoriesResponse = await getApiRequest(
          `/api/product-categories`,
          token
        );
        const categoriesData = categoriesResponse?.data || [];
        setCategoryOptions(categoriesData.data || []);

        // Instructors
        setInstructorsLoading(true);
        const instructorsResponse = await getApiRequest(
          `/api/users/admin/instructors`,
          token
        );
        if (instructorsResponse?.data?.success) {
          const instructorData =
            instructorsResponse.data.data?.instructors || [];
          setInstructors(instructorData);
        } else {
          throw new Error("Failed to fetch instructors");
        }
      } catch (err: any) {
        setCategoryError(err.message || "Failed to fetch categories");
        setInstructorsError(err.message || "Failed to fetch instructors");
      } finally {
        setCategoryLoading(false);
        setInstructorsLoading(false);
      }
    };

    fetchCategoriesAndServices();
  }, []);

  // Fetch subcategories when category changes
  React.useEffect(() => {
    if (!form.category) {
      setSubcategoryOptions([]);
      setForm((prev: any) => ({ ...prev, subcategory: "" }));
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
        let token = getTokenFromCookies() || "";
        const apiFetch = await import("@/lib/apiFetch");
        const res = await apiFetch.getApiRequest(
          `/api/product-subcategories/category/${selectedCategory._id}`,
          token
        );
        const data = res?.data?.data || res?.data || [];
        const activeSubcategories = data.filter((sub: any) => !sub.isDeleted);
        setSubcategoryOptions(activeSubcategories);

        setForm((prev: any) => ({
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

  React.useEffect(() => {
    if (
      form.productType === "Marketing, Consultation & Free Services" &&
      form.category === "Consultation" &&
      form.subcategory === "Booking"
    ) {
      // Only override if empty, so the admin can still type their own name
      setForm((prev: any) => ({
        ...prev,
        service:
          prev.service && prev.service.trim().length > 0
            ? prev.service
            : "Free Booking",
      }));
    }
  }, [form.productType, form.category, form.subcategory]);

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

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

      const response = await postApiRequest("/api/product-categories", token, {
        title: newCategoryTitle.trim(),
        productType: form.productType,
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("Category created successfully!");

        const apiFetch = await import("@/lib/apiFetch");
        const res = await apiFetch.getApiRequest(
          `/api/product-categories/type/${encodeURIComponent(
            form.productType
          )}`,
          token
        );
        const data = res?.data?.data || res?.data || [];
        const activeCategories = data.filter((cat: any) => !cat.isDeleted);
        setCategoryOptions(activeCategories);

        setForm((prev: any) => ({ ...prev, category: response.data.title }));

        setNewCategoryTitle("");
        setShowCategoryDialog(false);
      } else {
        toast.error(
          process.env.NEXT_PUBLIC_NODE_ENV === "production"
            ? "Failed to create category"
            : response.message || "Failed to create category"
        );
      }
    } catch (error: any) {
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

        const apiFetch = await import("@/lib/apiFetch");
        const res = await apiFetch.getApiRequest(
          `/api/product-subcategories/category/${selectedCategory._id}`,
          token
        );
        const data = res?.data?.data || res?.data || [];
        const activeSubcategories = data.filter((sub: any) => !sub.isDeleted);
        setSubcategoryOptions(activeSubcategories);

        setForm((prev: any) => ({ ...prev, subcategory: response.data.name }));

        setNewSubcategoryName("");
        setShowSubcategoryDialog(false);
      } else {
        toast.error(
          process.env.NEXT_PUBLIC_NODE_ENV === "production"
            ? "Failed to create subcategory"
            : response.message || "Failed to create subcategory"
        );
      }
    } catch (error: any) {
      toast.error("Failed to create subcategory");
    } finally {
      setCreatingSubcategory(false);
    }
  };

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

    // keep nonBookableService mirrored to the inverse of isBookableService
    if (name === "isBookableService") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev: any) => ({
        ...prev,
        isBookableService: checked,
        nonBookableService: !checked,
      }));
      return;
    }

    setForm((prev: any) => ({
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
    setLoading(true);
    try {
      await deleteFileFromFirebase(form.materialUrl);
      setForm((prev: any) => ({ ...prev, materialUrl: "" }));
      toast.success("Material deleted successfully!");
    } catch {
      toast.error("Failed to delete material. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔒 Validate pricing before submit
  const validatePricing = (): string | null => {
    // Validate flat pricing
    if (pricing.priceBasis === "flat") {
      if ((pricing.basePrice ?? 0) < 0) return "Price cannot be negative.";

      // Subscription requires interval
      if (pricing.model === "subscription") {
        if (!pricing.interval) return "Subscription interval is required.";
        if ((pricing.intervalCount ?? 1) < 1)
          return "Subscription interval count must be at least 1.";
      }
    }

    // Validate per_unit pricing
    if (pricing.priceBasis === "per_unit") {
      if (!pricing.tierType)
        return "Tier type is required for per-unit pricing.";
      if (!pricing.tiers || pricing.tiers.length === 0)
        return "Please add at least one tier for per-unit pricing.";
      if ((pricing.minQty ?? 1) < 1)
        return "Minimum quantity must be at least 1.";
      if ((pricing.maxQty ?? 1) < (pricing.minQty ?? 1))
        return "Max quantity must be >= min quantity.";

      // Subscription per_unit also requires interval
      if (pricing.model === "subscription") {
        if (!pricing.interval) return "Subscription interval is required.";
        if ((pricing.intervalCount ?? 1) < 1)
          return "Subscription interval count must be at least 1.";
      }
    }
    return null;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Prevent form submission unless explicitly clicking the submit button
    // On earlier steps, Enter key will just move to next step
    if (step !== steps.length - 1) {
      nextStep();
      return;
    }
    // On final step, do nothing - wait for explicit button click
  };

  const handleCreateProduct = async () => {
    // Explicit handler for create button - only callable from step 4
    if (step !== steps.length - 1) return;

    // Prevent double submission
    if (loading) return;

    // Required fields (baseline)
    const requiredFields = [
      { field: "productType", label: "Product Type" },
      { field: "category", label: "Product Category" },
      { field: "subcategory", label: "Product Subcategory" },
      { field: "service", label: "Service" },
      { field: "slug", label: "Slug" },
    ];

    // Media type and file required for Tools + nonBookableService + mediaType selected
    if (
      form.productType === "Tools" &&
      !form.isBookableService &&
      form.mediaType
    ) {
      requiredFields.push(
        { field: "mediaType", label: "Media Type" },
        { field: "materialUrl", label: "Media File" }
      );
    }

    // Bookable-only requirements
    if (isBookable) {
      requiredFields.push(
        { field: "publicSchedulingUrl", label: "Booking Scheduling Link" },
        { field: "deliveryMode", label: "Delivery Mode" },
        { field: "sessionType", label: "Session Type" },
        { field: "programLength", label: "Program Length" },
        { field: "mode", label: "Mode" },
        { field: "durationInMinutes", label: "Duration in Minutes" },
        { field: "minutesPerSession", label: "Minutes Per Session" },
        { field: "description", label: "Description" }
      );

      if (instructorRequired) {
        requiredFields.push({ field: "instructorId", label: "Instructor" });
      }
    }

    // Duration guards
    if (isBookable) {
      if (form.durationInMinutes < 1) {
        setError("Duration must be greater than 1 minutes.");
        return;
      }
      if (form.minutesPerSession < 1) {
        setError("Minutes per session must be greater than 1 minutes.");
        return;
      }
    } else {
      // Optional: only warn if the user entered a non-zero value less than 1
      if (form.durationInMinutes > 0 && form.durationInMinutes < 1) {
        setError("Duration must be greater than 1 minutes (if provided).");
        return;
      }
      if (form.minutesPerSession > 0 && form.minutesPerSession < 1) {
        setError("Minutes per session must be greater than 1 (if provided).");
        return;
      }
    }

    const missingFields = requiredFields.filter(({ field }) => {
      const value = form[field];
      if (value === null || value === undefined) return true;
      if (typeof value === "string") return value.trim() === "";
      if (typeof value === "number") return value <= 0;
      return false;
    });

    if (missingFields.length > 0) {
      const missingLabels = missingFields.map((f: any) => f.label).join(", ");
      setError(`Please fill all required fields: ${missingLabels}`);
      return;
    }

    // Pricing validation
    const pErr = validatePricing();
    if (pErr) {
      setError(pErr);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const token = getTokenFromCookies();
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const selectedCategory = categoryOptions.find(
        (cat) => cat.title === form.category
      );
      const selectedSubcategory = subcategoryOptions.find(
        (sub) => sub.name === form.subcategory
      );

      // Map Pricing -> backend pricing schema
      const normalizedPricing = normalizePricingForApi(pricing);
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
      const currency = (normalizedPricing.currency || "gbp").toLowerCase();
      const safeCurrency = (
        allowedCurrencies.includes(currency as any) ? currency : "gbp"
      ) as (typeof allowedCurrencies)[number];

      // Debug: show normalized pricing before toBackendPricing
      console.log("[Create Product] Raw pricing:", pricing);
      console.log("[Create Product] Normalized pricing:", normalizedPricing);

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
            payload.basePrice = Number(p.basePrice ?? p.subscriptionPrice ?? 0);
          } else if (p.priceBasis === "per_unit") {
            const unitName =
              p.unitName === "person"
                ? "participant"
                : p.unitName || "participant";
            payload.unitName = unitName;
            payload.allowQuantity = true;
            payload.minQty = p.minQty ?? 1;
            payload.maxQty = p.maxQty ?? Math.max(payload.minQty, 1000);
            payload.tierType = p.tierType || "volume";
            payload.tiers = (p.tiers || []).map((t) => ({
              upTo: Number(t.upTo),
              unitPrice: Number(t.unitPrice),
            }));
          }
          // Add tax fields if present
          if (p.taxInclusive !== undefined)
            payload.taxInclusive = p.taxInclusive;
          if (p.vatPercentage !== undefined)
            payload.vatPercentage = p.vatPercentage ?? 0;
          return payload;
        }

        if (p.model === "free") {
          return {
            model: "free",
            currency: safeCurrency,
          };
        }

        const unitName =
          p.unitName === "person" ? "participant" : p.unitName || "participant";
        const payload: any = {
          model: "one_time",
          priceBasis: p.priceBasis ?? "flat", // Default to flat only if missing (preserves "per_unit" if set)
          currency: safeCurrency,
          taxInclusive: p.taxInclusive ?? false,
          vatPercentage: p.vatPercentage ?? 0,
        };
        if (p.priceBasis !== "per_unit") {
          payload.basePrice = Number(p.basePrice || 0);
        }
        if (p.priceBasis === "per_unit") {
          payload.unitName = unitName;
          payload.minQty = p.minQty ?? 1;
          payload.maxQty = p.maxQty ?? Math.max(payload.minQty, 1000);
          payload.tierType = p.tierType || "volume";
          payload.tiers = (p.tiers || []).map((t) => ({
            upTo: Number(t.upTo),
            unitPrice: Number(t.unitPrice),
          }));
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
            downPaymentValue: Math.max(
              0,
              Number(pricing.installments.downPaymentValue || 0)
            ),
            allowEarlyPayoff: pricing.installments.allowEarlyPayoff ?? false,
            provider: pricing.installments.provider || "in_house",
          };
        }
        return payload;
      };

      const backendPricing = toBackendPricing(normalizedPricing);

      // Debug: show payloads being sent (pricing by model)
      try {
        console.log("[Create Product] Pricing model:", normalizedPricing.model);
        console.log("[Create Product] Pricing payload:", backendPricing);
      } catch {}

      const rootDiscountPercentage = Math.max(
        0,
        Math.min(100, Number(pricing.discountPercentage ?? 0))
      );

      const payload: any = {
        // --- Basic & meta ---
        productType: form.productType,
        service: form.service,
        productCategoryId: selectedCategory?._id || "",
        productCategoryTitle: form.category || "",
        productSubCategoryId: selectedSubcategory?._id || "",
        productSubcategoryName: form.subcategory || "",
        publicSchedulingUrl: form.publicSchedulingUrl || "",
        deliveryMode: form.deliveryMode,
        sessionType: form.sessionType,
        description: form.description,
        slug: form.slug,
        tags: Array.isArray(form.tags) ? form.tags : [],
        enabled: !!form.enabled,

        // --- Training & bookable flags ---
        hasClassroom: !!form.hasClassroom,
        hasSession: !!form.hasSession,
        hasAssessment: !!form.hasAssessment,
        requiresBooking: !!form.requiresBooking,
        requiresEnrollment: !!form.requiresEnrollment,
        instructorRequired: !!form.instructorRequired,
        hasCertificate: !!form.hasCertificate,
        isBookableService: !!form.isBookableService,
        nonBookableService: !!form.nonBookableService, // ← NEW
        instructorId: instructorRequired ? form.instructorId || null : null,
        mode: form.mode || "weeks",

        // --- Scheduling & duration ---
        programLength: Number(form.programLength) || 0,
        durationInMinutes: Number(form.durationInMinutes) || 0,
        minutesPerSession: Number(form.minutesPerSession) || 0,
        maxParticipants: Number(form.maxParticipants) || 1,

        // --- Media ---
        iconUrl: form.iconUrl || "",
        thumbnailUrl: form.thumbnailUrl || "",
        materialUrl: form.materialUrl || "",
        isAttachmentRequired: !!form.isAttachmentRequired,

        // --- Pricing ---
        pricing: backendPricing,
        discountPercentage: rootDiscountPercentage,
      };

      // Add mediaType for Tools + nonBookableService
      if (
        form.productType === "Tools" &&
        !form.isBookableService &&
        form.mediaType
      ) {
        payload.mediaType = form.mediaType;
      }

      // Extra debug for root payload shape (omit large fields)
      try {
        console.log("[Create Product] Root payload (partial):", {
          productType: payload.productType,
          service: payload.service,
          isBookableService: payload.isBookableService,
          nonBookableService: payload.nonBookableService,
        });
      } catch {}

      const response = await postApiRequest("/api/products", token, payload);

      if (response?.data?.success) {
        setSuccess("Product created successfully!");
        setTimeout(() => {
          router.push("/dashboard/products");
        }, 1200);
      } else {
        setError(response?.data?.message || "Failed to create product");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Pricing review summary (uses minQty for per-unit)
  const reviewQty =
    pricing.priceBasis === "per_unit" ? Math.max(pricing.minQty ?? 1, 1) : 1;
  const breakdown = useMemo(
    () => computePrice(pricing, reviewQty),
    [pricing, reviewQty]
  );
  const money = (n: number) => formatMoney(n, pricing.currency as Currency);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Create New Product
            </h1>
            <p className="text-slate-600 text-lg">
              Build and launch your product in just a few steps
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((label, idx) => (
              <div
                key={label}
                className="flex-1 flex flex-col items-center relative"
              >
                {idx < steps.length - 1 && (
                  <div className="absolute top-4 left-1/2 w-full h-0.5 bg-slate-200 -z-10"></div>
                )}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    idx < step
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg"
                      : idx === step
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500 text-white shadow-lg animate-pulse"
                      : "bg-white border-slate-300 text-slate-500"
                  } font-bold text-sm`}
                >
                  {idx < step ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  className={`mt-3 hidden lg:block text-sm font-semibold transition-all duration-300 ${
                    idx === step
                      ? "text-blue-600"
                      : idx < step
                      ? "text-green-600"
                      : "text-slate-500"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <form onSubmit={handleFormSubmit} className="p-8">
            {step === 0 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Basic Information
                  </h2>
                  <p className="text-slate-600 mb-4">
                    Let's start with the fundamental details of your product
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Product Type *
                    </label>
                    <select
                      name="productType"
                      title="productType"
                      value={form.productType}
                      onChange={handleChange}
                      className="w-full px-4 py-6 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required
                    >
                      <option value="">Select Product Type</option>
                      {PRODUCT_TYPE_OPTIONS.map((type) => (
                        <option
                          key={type}
                          value={type}
                          className="rounded-[10px]"
                        >
                          {type}
                        </option>
                      ))}
                    </select>

                    {/* Product Types */}
                    {form.productType && (
                      <div
                        className={`p-4 rounded-2xl border-2 ${
                          isBookable
                            ? "bg-blue-50 border-blue-200"
                            : "bg-green-50 border-green-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              isBookable ? "bg-blue-500" : "bg-green-500"
                            }`}
                          ></div>
                          <span
                            className={`font-semibold text-sm ${
                              isBookable ? "text-blue-700" : "text-green-700"
                            }`}
                          >
                            {isBookable
                              ? "Bookable Service"
                              : "Non-Bookable Service"}
                          </span>
                        </div>
                        <p
                          className={`text-sm ${
                            isBookable ? "text-blue-600" : "text-green-600"
                          }`}
                        >
                          {getServiceTypeDescription()}
                        </p>
                      </div>
                    )}

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Service Name *
                    </label>
                    <Input
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      placeholder="Enter service name (e.g., Data Science for Beginners)"
                      className="px-4 py-6 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required
                    />

                    {/* NEW: Bookable toggle moved here */}
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
                        If enabled, customers will schedule sessions. An
                        instructor is required when this is bookable.
                      </p>
                    </div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Booking Scheduling Link{" "}
                      {isBookable && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      name="publicSchedulingUrl"
                      value={form.publicSchedulingUrl}
                      onChange={handleChange}
                      placeholder="Generate the scheduling link for the service"
                      className="px-4 py-6 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required={isBookable}
                      disabled={!isBookable}
                    />

                    {/* Media Type - only for Tools + nonBookableService */}
                    {form.productType === "Tools" &&
                      !form.isBookableService && (
                        <>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Media Type *
                          </label>
                          <select
                            name="mediaType"
                            title="mediaType"
                            value={form.mediaType}
                            onChange={handleChange}
                            className="w-full px-4 py-6 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            required
                          >
                            <option value="">Select Media Type</option>
                            <option value="file">File</option>
                            <option value="audio">Audio</option>
                            <option value="video">Video</option>
                          </select>

                          {/* Media upload for Tools */}
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Media File * (
                            {form.mediaType || "Select type first"})
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
                            type="file"
                            title="file"
                            accept={
                              form.mediaType === "file"
                                ? ".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar,.xlsx,.csv"
                                : form.mediaType === "audio"
                                ? "audio/*"
                                : form.mediaType === "video"
                                ? "video/*"
                                : "*"
                            }
                            className="w-full px-4 py-6 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setLoading(true);
                                try {
                                  if (form.materialUrl) {
                                    try {
                                      await deleteFileFromFirebase(
                                        form.materialUrl
                                      );
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
                                  setForm((prev: any) => ({
                                    ...prev,
                                    materialUrl: url,
                                  }));
                                  toast.success("Media uploaded successfully!");
                                } catch {
                                  setError("Media upload failed");
                                } finally {
                                  setLoading(false);
                                }
                              }
                            }}
                            required
                            disabled={!form.mediaType}
                          />
                          {!form.mediaType && (
                            <p className="text-slate-500 text-xs mt-1">
                              Please select a media type first
                            </p>
                          )}
                        </>
                      )}

                    {/* Training materials */}
                    {requiresTrainingMaterials(form.productType) && (
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
                              Preview uploaded material
                            </a>
                            <p className="text-green-600 text-xs mt-1">
                              Tech professionals will be able to download this
                              material after purchase
                            </p>
                          </div>
                        )}

                        <input
                          type="file"
                          title="file"
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar,.xlsx,.csv"
                          className="w-full px-4 py-6 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setLoading(true);
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
                                toast.success(
                                  "Material uploaded successfully!"
                                );
                              } catch {
                                setError("Material upload failed");
                              } finally {
                                setLoading(false);
                              }
                            }
                          }}
                          required
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
                                can view and download after purchasing this
                                program.
                              </p>
                              <p className="text-blue-600 text-xs mt-1">
                                Supported formats: PDF, DOC, DOCX, PPT, PPTX,
                                TXT, ZIP, RAR, XLSX, CSV
                              </p>
                              {form.materialUrl && (
                                <p className="text-blue-600 text-xs mt-2 font-medium">
                                  💡 Uploading a new file will replace the
                                  current material
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
                  </div>

                  {/* Product Category */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      title="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-4 py-6 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required
                      disabled={!form.productType || categoryLoading}
                    >
                      <option value="">
                        {categoryLoading
                          ? "Loading categories..."
                          : "Select Category"}
                      </option>
                      {categoryOptions.map((cat) => (
                        <option
                          key={cat._id}
                          value={cat.title}
                          className="rounded-[10px]"
                        >
                          {cat.title}
                        </option>
                      ))}
                      {form.productType && (
                        <option
                          value="__create_new__"
                          className="text-blue-600 font-semibold"
                        >
                          <Plus className="w-3 h-3 mr-1" /> Create New Category
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
                              value={form.productType}
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
                            {creatingCategory
                              ? "Creating..."
                              : "Create Category"}
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
                      value={form.subcategory}
                      onChange={handleChange}
                      className="w-full px-4 py-6 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      disabled={!form.category || subcategoryLoading}
                      required
                    >
                      <option value="">Select Subcategory</option>
                      {subcategoryOptions.map((sub) => (
                        <option
                          key={sub._id}
                          value={sub.name}
                          className="rounded-[10px]"
                        >
                          {sub.name}
                        </option>
                      ))}
                      {form.category && (
                        <option
                          value="__create_new__"
                          className="text-blue-600 font-semibold"
                        >
                          <Plus className="w-3 h-3 mr-1" /> Create New
                          Subcategory
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
                        Select a category first to see available subcategories
                      </div>
                    )}
                    {form.category &&
                      subcategoryOptions.length === 0 &&
                      !subcategoryLoading && (
                        <div className="text-slate-500 text-sm bg-slate-50 p-3 rounded-[12px] border border-slate-200">
                          No subcategories available for this category
                        </div>
                      )}
                    {subcategoryError && (
                      <div className="text-red-600 text-sm bg-red-50 p-3 rounded-[12px] border border-red-200">
                        {subcategoryError}
                      </div>
                    )}

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Assign Instructor{" "}
                      {instructorRequired && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <select
                      name="instructorId"
                      title="instructorId"
                      value={form.instructorId}
                      onChange={handleChange}
                      className={`w-full px-4 py-6 bg-white/50 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
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
                        <option
                          key={instructor._id}
                          value={instructor.userId}
                          className="rounded-[10px]"
                        >
                          {instructor.fullName} - {instructor.title}
                        </option>
                      ))}
                    </select>
                    {instructorsError && (
                      <div className="text-red-600 text-sm bg-red-50 p-3 rounded-[12px] border border-red-200">
                        {instructorsError}
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
                              value={form.productType}
                              disabled
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="dialogCategory">Category</Label>
                            <Input
                              id="dialogCategory"
                              value={form.category}
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
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-2">
                  Delivery & Session
                </h2>
                <label className="block text-sm font-medium mb-1">
                  Delivery Mode
                </label>
                <select
                  name="deliveryMode"
                  title="deliveryMode"
                  value={form.deliveryMode}
                  onChange={handleChange}
                  className="w-full border rounded-[10px] p-2"
                  required={isBookable}
                >
                  <option value="">Select Delivery Mode</option>
                  {DELIVERY_MODE_OPTIONS.map((mode) => (
                    <option key={mode} value={mode} className="rounded-[10px]">
                      {mode}
                    </option>
                  ))}
                </select>
                <label className="block text-sm font-medium mb-1">
                  Session Type
                </label>
                <select
                  name="sessionType"
                  title="sessionType"
                  value={form.sessionType}
                  onChange={handleChange}
                  className="w-full border rounded-[10px] p-2"
                  required={isBookable}
                >
                  <option value="">Select Session Type</option>
                  {SESSION_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type} className="rounded-[10px]">
                      {type}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {[
                    { key: "requiresBooking", label: "Requires Booking" },
                    { key: "hasCertificate", label: "Has Certificate" },
                    { key: "hasClassroom", label: "Has Classroom" },
                    { key: "hasSession", label: "Has Session" },
                    // REMOVED isBookableService from here (moved to Step 0)
                    { key: "hasAssessment", label: "Has Assessment" },
                  ].map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        name={key}
                        checked={!!form[key]}
                        onChange={handleChange}
                        className="accent-blue-600 rounded-[10px]"
                      />
                      {label}
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Mode</label>
                  <select
                    name="mode"
                    title="mode"
                    value={form.mode}
                    onChange={handleChange}
                    className="w-full border rounded-[10px] p-2"
                  >
                    <option value="">Select Mode</option>
                    {MODE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="rounded-[10px]">
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <h2 className="text-lg font-semibold">Pricing & Duration</h2>

                {/* PricingForm (controls the pricing state) */}
                <PricingForm value={pricing} onChange={setPricing} />

                {/* Duration & misc */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Max Participants
                    </label>
                    <Input
                      name="maxParticipants"
                      value={form.maxParticipants}
                      onChange={handleChange}
                      placeholder="Enter maximum number of participants (e.g., 10)"
                      type="number"
                      min={1}
                      className="rounded-[10px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Duration (minutes)
                    </label>
                    <Input
                      name="durationInMinutes"
                      value={form.durationInMinutes}
                      onChange={handleChange}
                      placeholder="Enter total duration in minutes"
                      type="number"
                      min={1}
                      className="rounded-[10px]"
                    />
                    {form.durationInMinutes && form.durationInMinutes < 1 && (
                      <p className="text-red-500 text-sm mt-1">
                        Duration must be greater than 1 minutes.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Minutes Per Session
                    </label>
                    <Input
                      name="minutesPerSession"
                      value={form.minutesPerSession}
                      onChange={handleChange}
                      placeholder="Enter minutes per individual session"
                      type="number"
                      min={1}
                      className="rounded-[10px]"
                    />
                    {form.minutesPerSession && form.minutesPerSession < 1 && (
                      <p className="text-red-500 text-sm mt-1">
                        Minutes per session must be greater than 1 minutes.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Program Length
                    </label>
                    <Input
                      name="programLength"
                      value={form.programLength}
                      onChange={handleChange}
                      placeholder="Enter program length (e.g., 8 for 8 weeks)"
                      type="number"
                      min={0}
                      className="rounded-[10px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-2">Media & SEO</h2>

                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter a detailed description of your product or service..."
                  className="w-full border rounded-[10px] p-2"
                  rows={4}
                />

                {/* Tags */}
                <label className="block text-sm font-medium mb-1">Tags</label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-[10px] bg-white">
                    {form.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev: any) => ({
                              ...prev,
                              tags: prev.tags.filter(
                                (_: string, i: number) => i !== index
                              ),
                            }))
                          }
                          className="text-blue-600 hover:text-blue-800 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {form.tags.length === 0 && (
                      <span className="text-gray-400 text-sm">
                        No tags added yet
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter a tag and press Enter or click Add"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="rounded-[10px] flex-1"
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      disabled={!tagInput.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-[10px] hover:bg-blue-700 disabled:opacity-50"
                    >
                      Add
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "Soft Skills",
                      "Hard Skills",
                      "Leadership",
                      "Technical",
                      "Communication",
                      "Problem Solving",
                    ].map((suggestedTag) => (
                      <button
                        key={suggestedTag}
                        type="button"
                        onClick={() => {
                          if (!form.tags.includes(suggestedTag)) {
                            setForm((prev: any) => ({
                              ...prev,
                              tags: [...prev.tags, suggestedTag],
                            }));
                          }
                        }}
                        disabled={form.tags.includes(suggestedTag)}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        + {suggestedTag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <label className="block text-sm font-medium mb-1">
                  Icon Image
                </label>
                <input
                  type="file"
                  title="file"
                  accept="image/*"
                  className="rounded-[10px] border p-2"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setLoading(true);
                      try {
                        const url = await uploadAssetImage(
                          file,
                          "product-icons"
                        );
                        setForm((prev: any) => ({ ...prev, iconUrl: url }));
                      } catch {
                        setError("Icon upload failed");
                      } finally {
                        setLoading(false);
                      }
                    }
                  }}
                />
                {form.iconUrl && (
                  <img
                    src={form.iconUrl}
                    alt="Icon Preview"
                    className="mt-2 rounded-[10px] w-16 h-16 object-cover"
                  />
                )}

                <label className="block text-sm font-medium mb-1">
                  Thumbnail Image
                </label>
                <input
                  type="file"
                  title="file"
                  accept="image/*"
                  className="rounded-[10px] border p-2"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setLoading(true);
                      try {
                        const url = await uploadAssetImage(
                          file,
                          "product-thumbnails"
                        );
                        setForm((prev: any) => ({
                          ...prev,
                          thumbnailUrl: url,
                        }));
                      } catch {
                        setError("Image upload failed");
                      } finally {
                        setLoading(false);
                      }
                    }
                  }}
                />
                {form.thumbnailUrl && (
                  <img
                    src={form.thumbnailUrl}
                    alt="Thumbnail Preview"
                    className="mt-2 rounded-[10px] w-32 h-32 object-cover"
                  />
                )}

                <label className="block text-sm font-medium mb-1">
                  Enabled
                </label>
                <input
                  type="checkbox"
                  title="checkbox"
                  name="enabled"
                  checked={!!form.enabled}
                  onChange={handleChange}
                  className="accent-blue-600 rounded-[10px]"
                />

                <label className="block text-sm font-medium mb-1">Slug</label>
                <Input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="Enter URL-friendly slug (e.g., data-science-for-beginners)"
                  className="rounded-[10px]"
                />
              </div>
            )}

            {step === 4 && (
              <div className="bg-gray-50 p-4 rounded-[10px] space-y-6">
                <h2 className="text-lg font-semibold">Review & Submit</h2>

                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-[10px]">
                  <p className="text-blue-700 text-sm">
                    <strong>Ready to create your product?</strong> Review all
                    the information and click <em>Create Product</em>.
                  </p>
                </div>

                {/* Basic Info */}
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">
                    Basic Info
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">Product Type:</span>{" "}
                      {form.productType}
                    </div>
                    <div>
                      <span className="font-medium">Service Type:</span>{" "}
                      <span
                        className={`font-semibold ${
                          isBookable ? "text-blue-600" : "text-green-600"
                        }`}
                      >
                        {isBookable
                          ? "Bookable Service"
                          : "Non-Bookable Service"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Service:</span>{" "}
                      {form.service}
                    </div>
                    {requiresTrainingMaterials(form.productType) && (
                      <div>
                        <span className="font-medium">Training Materials:</span>{" "}
                        {form.materialUrl ? (
                          <a
                            href={form.materialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            View uploaded materials
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">
                            No materials uploaded
                          </span>
                        )}
                      </div>
                    )}
                    {form.productType && (
                      <div>
                        <span className="font-medium">
                          Attachment Required:
                        </span>{" "}
                        {form.isAttachmentRequired ? "Yes" : "No"}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Category:</span>{" "}
                      {form.category}
                    </div>
                    <div>
                      <span className="font-medium">Subcategory:</span>{" "}
                      {form.subcategory}
                    </div>
                    {isBookable && (
                      <div>
                        <span className="font-medium">Instructor:</span>{" "}
                        {form.instructorId
                          ? instructors.find(
                              (i) => i.userId === form.instructorId
                            )?.fullName || "Selected"
                          : instructorRequired
                          ? "Not assigned"
                          : "Optional"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery & Session */}
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">
                    Delivery & Session
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">Delivery Mode:</span>{" "}
                      {form.deliveryMode}
                    </div>
                    <div>
                      <span className="font-medium">Session Type:</span>{" "}
                      {form.sessionType}
                    </div>
                    <div>
                      <span className="font-medium">Requires Booking:</span>{" "}
                      {form.requiresBooking ? "Yes" : "No"}
                    </div>
                    <div>
                      <span className="font-medium">Has Certificate:</span>{" "}
                      {form.hasCertificate ? "Yes" : "No"}
                    </div>
                    <div>
                      <span className="font-medium">Has Classroom:</span>{" "}
                      {form.hasClassroom ? "Yes" : "No"}
                    </div>
                    <div>
                      <span className="font-medium">Bookable Service:</span>{" "}
                      {form.isBookableService ? "Yes" : "No"}
                    </div>
                    <div>
                      <span className="font-medium">Has Assessment:</span>{" "}
                      {form.hasAssessment ? "Yes" : "No"}
                    </div>
                  </div>
                </div>

                {/* Pricing & Duration (summary) */}
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">
                    Pricing & Duration
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">Pricing model:</span>{" "}
                      {pricing.model}
                    </div>
                    <div>
                      <span className="font-medium">Currency:</span>{" "}
                      {pricing.currency.toUpperCase()}
                    </div>
                    {pricing.model === "subscription" ? (
                      <>
                        <div>
                          <span className="font-medium">Recurring:</span>{" "}
                          {money(pricing.basePrice || 0)} /{" "}
                          {pricing.intervalCount || 1} {pricing.interval}
                        </div>
                      </>
                    ) : pricing.model === "one_time" ? (
                      <div>
                        <span className="font-medium">One-time price:</span>{" "}
                        {money(pricing.basePrice || 0)}
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="font-medium">Unit label:</span>{" "}
                          {pricing.unitName || "participant"}
                        </div>
                        {pricing.priceBasis === "flat" ? (
                          <div>
                            <span className="font-medium">Price:</span>{" "}
                            {money(pricing.basePrice || 0)}
                          </div>
                        ) : (
                          <div>
                            <span className="font-medium">Tier type:</span>{" "}
                            {pricing.tierType}
                          </div>
                        )}
                      </>
                    )}

                    {/* Totals preview */}
                    <div className="sm:col-span-2 mt-2 rounded-xl border p-3 bg-white">
                      <div className="flex items-center justify-between">
                        <span>
                          Subtotal
                          {pricing.priceBasis === "per_unit"
                            ? ` (${reviewQty} ${
                                pricing.unitName || "participant"
                              }${reviewQty > 1 ? "s" : ""})`
                            : ""}
                        </span>
                        <span>{money(breakdown.subtotal)}</span>
                      </div>
                      {typeof breakdown.discount === "number" &&
                        breakdown.discount > 0 && (
                          <div className="flex items-center justify-between">
                            <span>Discount</span>
                            <span>-{money(breakdown.discount)}</span>
                          </div>
                        )}
                      {typeof breakdown.net === "number" && (
                        <div className="flex items-center justify-between">
                          <span>Net</span>
                          <span>{money(breakdown.net)}</span>
                        </div>
                      )}
                      {!pricing.taxInclusive && (
                        <div className="flex items-center justify-between">
                          <span>VAT ({pricing.vatPercentage ?? 0}%)</span>
                          <span>{money(breakdown.vat || 0)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between font-semibold border-t pt-2 mt-1">
                        <span>Total</span>
                        <span>{money(breakdown.total)}</span>
                      </div>

                      {/* Installments preview - only for one_time */}
                      {pricing.allowInstallments &&
                        pricing.model === "one_time" && (
                          <div className="mt-3 text-sm text-slate-700">
                            <span className="font-medium">
                              Installments enabled
                            </span>{" "}
                            — preview shown on pricing card.
                          </div>
                        )}
                    </div>

                    <div>
                      <span className="font-medium">Max Participants:</span>{" "}
                      {form.maxParticipants}
                    </div>
                    <div>
                      <span className="font-medium">Duration (minutes):</span>{" "}
                      {form.durationInMinutes}
                    </div>
                    <div>
                      <span className="font-medium">Program Length:</span>{" "}
                      {form.programLength} {form.mode}
                    </div>
                    <div>
                      <span className="font-medium">Mode:</span> {form.mode}
                    </div>
                  </div>
                </div>

                {/* Media & SEO */}
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">
                    Media & SEO
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="sm:col-span-2">
                      <span className="font-medium">Description:</span>{" "}
                      {form.description}
                    </div>
                    <div>
                      <span className="font-medium">Tags:</span>{" "}
                      {form.tags.join(", ")}
                    </div>
                    <div>
                      <span className="font-medium">Slug:</span> {form.slug}
                    </div>
                    <div>
                      <span className="font-medium">Enabled:</span>{" "}
                      {form.enabled ? "Yes" : "No"}
                    </div>
                    {form.iconUrl && (
                      <div className="flex flex-col items-center mt-2">
                        <span className="font-medium">Icon:</span>
                        <img
                          src={form.iconUrl}
                          alt="Icon Preview"
                          className="mt-1 rounded-[10px] w-16 h-16 object-cover"
                        />
                      </div>
                    )}
                    {form.thumbnailUrl && (
                      <div className="flex flex-col items-center mt-2">
                        <span className="font-medium">Thumbnail:</span>
                        <img
                          src={form.thumbnailUrl}
                          alt="Thumbnail Preview"
                          className="mt-1 rounded-[10px] w-32 h-32 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm mt-2">{error}</div>
                )}
                {success && (
                  <div className="text-green-600 text-sm mt-2">{success}</div>
                )}
                {loading && (
                  <div className="text-blue-600 text-sm mt-2">
                    Creating product...
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <button
                  type="button"
                  className="px-6 py-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={prevStep}
                  disabled={step === 0 || loading}
                >
                  <span className="flex items-center gap-2">
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back
                  </span>
                </button>

                {step === steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleCreateProduct}
                    className="px-12 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
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
                        Creating Product...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Create Product
                      </span>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="px-8 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:opacity-50"
                    onClick={nextStep}
                    disabled={loading}
                  >
                    <span className="flex items-center gap-2">
                      Next
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
