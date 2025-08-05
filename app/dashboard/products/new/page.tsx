"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { getTokenFromCookies } from "@/lib/cookies";
import { postApiRequest } from "@/lib/apiFetch";
import { Switch } from "@/components/ui/switch";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { Plus, X } from "lucide-react";

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
  hasSession: true,
  hasAssessment: false,
  isBookableService: false,
  programLength: 0,
  mode: "",
  durationInMinutes: 0,
  minutesPerSession: 0,
  price: 0,
  discountPercentage: 0,
  description: "",
  tags: [] as string[],
  slug: "",
  iconUrl: "",
  thumbnailUrl: "",
  enabled: true,
  instructorId: "", // Add instructor field
  // API required fields
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

const PRODUCT_TYPE_OPTIONS = [
  "Training & Certification",
  "Academic Support Services",
  "Career Development & Mentorship",
  "Institutional & Team Services",
  "AI-Powered or Automation Services",
  "Career Connect",
  "Marketing, Consultation & Free Services",
];

// Remove static SERVICE_OPTIONS since we'll fetch dynamically
const DELIVERY_MODE_OPTIONS = ["online", "offline", "hybrid"];
const SESSION_TYPE_OPTIONS = ["1-on-1", "group", "classroom"];
const MODE_OPTIONS = ["weeks", "days", "hours"];

export default function CreateProductPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<any>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const [customService, setCustomService] = useState("");
  const [customSubcategory, setCustomSubcategory] = useState("");
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);
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

  // Add tag function
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !form.tags.includes(trimmedTag)) {
      setForm((prev: any) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
      setTagInput("");
    }
  };

  // Fetch categories and services when productType changes
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

        // Fetch categories
        const categoriesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product-categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }

        const categoriesData = await categoriesResponse.json();
        setCategoryOptions(categoriesData.data || []);

        // Fetch instructors
        setInstructorsLoading(true);
        const instructorsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/admin/instructors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!instructorsResponse.ok) {
          throw new Error("Failed to fetch instructors");
        }

        const instructorsData = await instructorsResponse.json();
        setInstructors(instructorsData.data?.instructors || []);
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

        // Reset subcategory if current one is not in new options
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

        // Refresh categories from API
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

        // Extract service titles from categories
        const services = activeCategories.map((cat: any) => cat.title);
        setServiceOptions(services);

        // Set the new category as selected
        setForm((prev: any) => ({ ...prev, category: response.data.title }));

        // Reset and close dialog
        setNewCategoryTitle("");
        setShowCategoryDialog(false);
      } else {
        toast.error(response.message || "Failed to create category");
      }
    } catch (error: any) {
      console.error("Error creating category:", error);
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

      // Find the selected category to get its ID
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

        // Refresh subcategories from API
        const apiFetch = await import("@/lib/apiFetch");
        const res = await apiFetch.getApiRequest(
          `/api/product-subcategories/category/${selectedCategory._id}`,
          token
        );
        const data = res?.data?.data || res?.data || [];
        const activeSubcategories = data.filter((sub: any) => !sub.isDeleted);
        setSubcategoryOptions(activeSubcategories);

        // Set the new subcategory as selected
        setForm((prev: any) => ({ ...prev, subcategory: response.data.name }));

        // Reset and close dialog
        setNewSubcategoryName("");
        setShowSubcategoryDialog(false);
      } else {
        toast.error(response.message || "Failed to create subcategory");
      }
    } catch (error: any) {
      console.error("Error creating subcategory:", error);
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

    // Handle "Create New" selections
    if (name === "category" && value === "__create_new__") {
      setShowCategoryDialog(true);
      return;
    }

    if (name === "subcategory" && value === "__create_new__") {
      setShowSubcategoryDialog(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only submit on the final step (step 4)
    if (step !== steps.length - 1) return;

    // Enhanced validation for all required fields
    const requiredFields = [
      { field: "productType", label: "Product Type" },
      { field: "category", label: "Product Category" },
      { field: "subcategory", label: "Product Subcategory" },
      { field: "service", label: "Service" },
      { field: "deliveryMode", label: "Delivery Mode" },
      { field: "sessionType", label: "Session Type" },
      { field: "programLength", label: "Program Length" },
      { field: "mode", label: "Mode" },
      { field: "durationInMinutes", label: "Duration in Minutes" },
      { field: "minutesPerSession", label: "Minutes Per Session" },
      { field: "price", label: "Price" },
      { field: "description", label: "Description" },
      { field: "slug", label: "Slug" },
    ];

    const missingFields = requiredFields.filter(({ field, label }) => {
      const value = form[field];
      let isMissing;

      // Special handling for price - can be 0 (free) or greater
      if (field === "price") {
        isMissing =
          value === null ||
          value === undefined ||
          (typeof value === "number" && value < 0);
      } else {
        isMissing =
          !value ||
          (typeof value === "string" && value.trim() === "") ||
          (typeof value === "number" && value <= 0);
      }

      // Debug: Log each field check
      console.log(`Field ${field} (${label}):`, value, "Missing:", isMissing);

      return isMissing;
    });

    if (missingFields.length > 0) {
      const missingLabels = missingFields.map((f) => f.label).join(", ");
      console.log("Missing fields:", missingFields);
      setError(`Please fill all required fields: ${missingLabels}`);
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
      // Find the selected category and subcategory objects
      const selectedCategory = categoryOptions.find(
        (cat) => cat.title === form.category
      );

      // Find the selected subcategory object by name
      const selectedSubcategory = subcategoryOptions.find(
        (sub) => sub.name === form.subcategory
      );

      // Prepare the API payload with all required fields
      const payload = {
        ...form,
        // Map form fields to API required fields
        productCategoryId: selectedCategory?._id || "",
        productCategoryTitle: form.category || "",
        productSubCategoryId: selectedSubcategory?._id || "",
        productSubcategoryName: form.subcategory || "",
        durationInMinutes: Number(form.durationInMinutes) || 0,
        minutesPerSession: Number(form.minutesPerSession) || 0,
        // Ensure mode is a valid value - use one of the valid enum values
        mode: form.mode || "weeks",
        // Sanitize number fields
        price: Number(form.price) || 0,
        discountPercentage: Number(form.discountPercentage) || 0,
        programLength: Number(form.programLength) || 0,
        // Convert arrays to strings if needed
        tags: Array.isArray(form.tags) ? form.tags : [],
        // Ensure all required fields are present
        deliveryMode: form.deliveryMode || "",
        sessionType: form.sessionType || "",
        description: form.description || "",
        slug: form.slug || "",
        // Boolean fields with defaults
        hasClassroom: form.hasClassroom || false,
        hasSession: form.hasSession || true,
        hasAssessment: form.hasAssessment || false,
        isBookableService: form.isBookableService || false,
        requiresBooking: form.requiresBooking || false,
        requiresEnrollment: form.requiresEnrollment || false,
        hasCertificate: form.hasCertificate || false,
        isRecurring: form.isRecurring || false,
        enabled: form.enabled !== undefined ? form.enabled : true,
        instructorId: form.instructorId || null, // Add instructor ID
      };

      // Debug: Log the payload being sent
      console.log("Submitting payload:", payload);
      console.log("Selected category:", selectedCategory);
      console.log("Selected subcategory:", selectedSubcategory);

      const response = await postApiRequest("/api/products", token, payload);

      if (response?.data?.success) {
        setSuccess("Product created successfully!");
        setTimeout(() => {
          router.push("/dashboard/products");
        }, 2000);
      } else {
        setError(response?.data?.message || "Failed to create product");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
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

        {/* Enhanced Stepper */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((label, idx) => (
              <div
                key={label}
                className="flex-1 flex flex-col items-center relative"
              >
                {/* Connection Line */}
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
                  className={`mt-3 hidden md:block text-sm font-semibold transition-all duration-300 ${
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

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {step === 0 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Basic Information
                  </h2>
                  <p className="text-slate-600">
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
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
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
                      <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                        {categoryError}
                      </div>
                    )}

                    {/* Category Creation Dialog */}
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
                      <div className="text-blue-600 text-sm bg-blue-50 p-3 rounded-xl border border-blue-200">
                        Loading subcategories...
                      </div>
                    )}
                    {!form.category && subcategoryOptions.length === 0 && (
                      <div className="text-slate-500 text-sm bg-slate-50 p-3 rounded-xl border border-slate-200">
                        Select a category first to see available subcategories
                      </div>
                    )}
                    {form.category &&
                      subcategoryOptions.length === 0 &&
                      !subcategoryLoading && (
                        <div className="text-slate-500 text-sm bg-slate-50 p-3 rounded-xl border border-slate-200">
                          No subcategories available for this category
                        </div>
                      )}
                    {subcategoryError && (
                      <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                        {subcategoryError}
                      </div>
                    )}

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Assign Instructor
                    </label>
                    <select
                      name="instructorId"
                      value={form.instructorId}
                      onChange={handleChange}
                      className="w-full px-4 py-6 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      disabled={instructorsLoading}
                    >
                      <option value="">
                        {instructorsLoading
                          ? "Loading instructors..."
                          : "Select Instructor (Optional)"}
                      </option>
                      {instructors.map((instructor) => (
                        <option
                          key={instructor._id}
                          value={instructor._id}
                          className="rounded-[10px]"
                        >
                          {instructor.fullName} - {instructor.title}
                        </option>
                      ))}
                    </select>
                    {instructorsError && (
                      <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                        {instructorsError}
                      </div>
                    )}
                    {instructors.length === 0 && !instructorsLoading && (
                      <div className="text-slate-500 text-sm bg-slate-50 p-3 rounded-xl border border-slate-200">
                        No instructors available. You can assign an instructor
                        later.
                      </div>
                    )}

                    {/* Subcategory Creation Dialog */}
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
                  value={form.deliveryMode}
                  onChange={handleChange}
                  className="w-full border rounded-[10px] p-2"
                  required
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
                  value={form.sessionType}
                  onChange={handleChange}
                  className="w-full border rounded-[10px] p-2"
                  required
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
                    { key: "isRecurring", label: "Recurring" },
                    { key: "requiresBooking", label: "Requires Booking" },
                    { key: "requiresEnrollment", label: "Requires Enrollment" },
                    { key: "hasCertificate", label: "Has Certificate" },
                    { key: "hasClassroom", label: "Has Classroom" },
                    { key: "hasSession", label: "Has Session" },
                    { key: "isBookableService", label: "Bookable Service" },
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
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-2">
                  Pricing & Duration
                </h2>
                <label className="block text-sm font-medium mb-1">Price</label>
                <Input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Enter price in dollars (e.g., 99.99)"
                  type="number"
                  min={0}
                  className="rounded-[10px]"
                />
                <label className="block text-sm font-medium mb-1">
                  Discount Percentage
                </label>
                <Input
                  name="discountPercentage"
                  value={form.discountPercentage}
                  onChange={handleChange}
                  placeholder="Enter discount percentage (e.g., 10 for 10%)"
                  type="number"
                  className="rounded-[10px]"
                />
                <label className="block text-sm font-medium mb-1">
                  Duration (minutes)
                </label>
                <Input
                  name="durationInMinutes"
                  value={form.durationInMinutes}
                  onChange={handleChange}
                  placeholder="Enter total duration in minutes (e.g., 360)"
                  type="number"
                  min={0}
                  className="rounded-[10px]"
                />
                <label className="block text-sm font-medium mb-1">
                  Minutes Per Session
                </label>
                <Input
                  name="minutesPerSession"
                  value={form.minutesPerSession}
                  onChange={handleChange}
                  placeholder="Enter minutes per individual session (e.g., 60)"
                  type="number"
                  min={0}
                  className="rounded-[10px]"
                />
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
                <label className="block text-sm font-medium mb-1">Mode</label>
                <select
                  name="mode"
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
                <label className="block text-sm font-medium mb-1">Tags</label>
                <div className="space-y-2">
                  {/* Tags Display */}
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

                  {/* Tag Input */}
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

                  {/* Quick Add Buttons */}
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
                <label className="block text-sm font-medium mb-1">
                  Icon Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="rounded-[10px] border p-2"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setLoading(true);
                      try {
                        const url = await uploadImageToCloudinary(file);
                        setForm((prev: any) => ({ ...prev, iconUrl: url }));
                      } catch (err) {
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
                  accept="image/*"
                  className="rounded-[10px] border p-2"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setLoading(true);
                      try {
                        const url = await uploadImageToCloudinary(file);
                        setForm((prev: any) => ({
                          ...prev,
                          thumbnailUrl: url,
                        }));
                      } catch (err) {
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
              <div className="bg-gray-50 p-4 rounded-[10px]">
                <h2 className="text-lg font-semibold mb-4">Review & Submit</h2>
                {/* Basic Info */}
                <div className="mb-4">
                  <h3 className="font-semibold text-blue-700 mb-2">
                    Basic Info
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">Product Type:</span>{" "}
                      {form.productType}
                    </div>
                    <div>
                      <span className="font-medium">Service:</span>{" "}
                      {form.service}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>{" "}
                      {form.category}
                    </div>
                    <div>
                      <span className="font-medium">Subcategory:</span>{" "}
                      {form.subcategory}
                    </div>
                  </div>
                </div>
                {/* Delivery & Session */}
                <div className="mb-4">
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
                      <span className="font-medium">Recurring:</span>{" "}
                      {form.isRecurring ? "Yes" : "No"}
                    </div>
                    <div>
                      <span className="font-medium">Requires Booking:</span>{" "}
                      {form.requiresBooking ? "Yes" : "No"}
                    </div>
                    <div>
                      <span className="font-medium">Requires Enrollment:</span>{" "}
                      {form.requiresEnrollment ? "Yes" : "No"}
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
                {/* Pricing & Duration */}
                <div className="mb-4">
                  <h3 className="font-semibold text-blue-700 mb-2">
                    Pricing & Duration
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">Price:</span> ${form.price}
                    </div>
                    <div>
                      <span className="font-medium">Discount %:</span>{" "}
                      {form.discountPercentage}%
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
                <div className="mb-4">
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
            {/* Form Footer */}
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
                    type="submit"
                    className="px-8 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:opacity-50"
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
