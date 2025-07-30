"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { getTokenFromCookies } from "@/lib/cookies";
import { postApiRequest } from "@/lib/apiFetch";
import { Switch } from "@/components/ui/switch";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

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

// Remove static SERVICE_OPTIONS since we'll fetch dynamically
const SUBCATEGORY_OPTIONS = ["NLP", "ChatGPT", "AI"];
const DIFFICULTY_LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];
const DELIVERY_MODE_OPTIONS = ["online", "offline", "hybrid"];
const SESSION_TYPE_OPTIONS = ["1-on-1", "group", "classroom"];
const TARGET_AUDIENCE_OPTIONS = ["student", "graduate", "tech_pro", "team"];
const PROGRAM_LENGTH_OPTIONS = ["weeks", "months", "sessions", "hours"];
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

  // Fetch categories and services when productType changes
  React.useEffect(() => {
    if (!form.productType) {
      setCategoryOptions([]);
      setServiceOptions([]);
      setForm((prev: any) => ({ ...prev, category: "", service: "" }));
      return;
    }
    const fetchCategoriesAndServices = async () => {
      setCategoryLoading(true);
      setCategoryError(null);
      try {
        let token = getTokenFromCookies() || "";
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

        // Reset form if current service/category is not in new options
        setForm((prev: any) => {
          let updates: any = {};
          if (!services.includes(prev.service)) {
            updates.service = "";
          }
          if (
            !activeCategories.some((cat: any) => cat.title === prev.category)
          ) {
            updates.category = "";
          }
          return { ...prev, ...updates };
        });
      } catch (err: any) {
        setCategoryError(err.message || "Failed to fetch categories");
        setCategoryOptions([]);
        setServiceOptions([]);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategoriesAndServices();
  }, [form.productType]);

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
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
    if (step < steps.length - 1) return;

    // Basic validation
    if (
      !form.productType ||
      !form.service ||
      !form.category ||
      !form.subcategory ||
      !form.price
    ) {
      setError("Please fill all required fields.");
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
        durationInMinutes: Number(form.durationMinutes) || 0,
        minutesPerSession: Number(form.minutesPerSession) || 0,
        // Ensure mode is a valid value - use one of the valid enum values
        mode: form.mode || "weeks",
        // Sanitize number fields
        price: Number(form.price) || 0,
        discountPercentage: Number(form.discountPercentage) || 0,
        programLength: Number(form.programLength) || 0,
        // Convert arrays to strings if needed
        tags: Array.isArray(form.tags) ? form.tags : [],
      };

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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>
      {/* Modern Stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((label, idx) => (
          <div key={label} className="flex-1 flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                idx < step
                  ? "bg-green-600 border-green-600 text-white"
                  : idx === step
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-gray-200 border-gray-300 text-gray-500"
              } font-bold transition-all duration-200`}
            >
              {idx < step ? <span>&#10003;</span> : idx + 1}
            </div>
            <span
              className={`mt-2 text-xs font-medium ${
                idx === step ? "text-gray-500" : "text-gray-500"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <form
        className="space-y-6 bg-white rounded-[10px] shadow p-6"
        onSubmit={handleSubmit}
      >
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-2">Basic Info</h2>
            <label className="block text-sm font-medium mb-1">
              Product Type
            </label>
            <select
              name="productType"
              value={form.productType}
              onChange={handleChange}
              className="w-full border rounded-[10px] p-2"
              required
            >
              <option value="">Select Product Type</option>
              {PRODUCT_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <label className="block text-sm font-medium mb-1">Service</label>
            <Input
              name="service"
              value={form.service}
              onChange={handleChange}
              placeholder="Enter service name (e.g., Data Science for Beginners)"
              className="rounded-[10px]"
              required
            />
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-[10px] p-2"
              required
              disabled={!form.productType || categoryLoading}
            >
              <option value="">
                {categoryLoading ? "Loading..." : "Select Category"}
              </option>
              {categoryOptions.map((cat) => (
                <option key={cat._id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
            {categoryError && (
              <div className="text-red-600 text-xs mt-1">{categoryError}</div>
            )}
            <label className="block text-sm font-medium mb-1">
              Subcategory
            </label>
            <select
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              className="w-full border rounded-[10px] p-2"
              disabled={!form.category || subcategoryLoading}
              required
            >
              <option value="">Select Subcategory</option>
              {subcategoryOptions.map((sub) => (
                <option key={sub._id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
            {subcategoryLoading && (
              <div className="text-gray-500 text-sm">
                Loading subcategories...
              </div>
            )}
            {!form.category && subcategoryOptions.length === 0 && (
              <div className="text-gray-500 text-sm">
                Select a category first
              </div>
            )}
            {form.category &&
              subcategoryOptions.length === 0 &&
              !subcategoryLoading && (
                <div className="text-gray-500 text-sm">
                  No subcategories available for this category
                </div>
              )}
            {subcategoryError && (
              <div className="text-red-600 text-xs mt-1">
                {subcategoryError}
              </div>
            )}
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-2">Delivery & Session</h2>
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
                <option key={mode} value={mode}>
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
                <option key={type} value={type}>
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
                <label key={key} className="flex items-center gap-2 text-sm">
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
            <h2 className="text-lg font-semibold mb-2">Pricing & Duration</h2>
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
                <option key={opt} value={opt}>
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
            />
            <label className="block text-sm font-medium mb-1">
              Tags (comma separated)
            </label>
            <Input
              name="tags"
              value={form.tags.join(", ")}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  tags: e.target.value
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="Enter tags separated by commas (e.g., Python, AI, Machine Learning, Data Science)"
              className="rounded-[10px]"
            />
            <label className="block text-sm font-medium mb-1">Icon Image</label>
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
                    setForm((prev: any) => ({ ...prev, thumbnailUrl: url }));
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
            <label className="block text-sm font-medium mb-1">Enabled</label>
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
              <h3 className="font-semibold text-blue-700 mb-2">Basic Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="font-medium">Product Type:</span>{" "}
                  {form.productType}
                </div>
                <div>
                  <span className="font-medium">Service:</span> {form.service}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {form.category}
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
              <h3 className="font-semibold text-blue-700 mb-2">Media & SEO</h3>
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
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
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
        <DialogFooter className="mt-6 flex justify-between gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded-[10px] bg-gray-200 hover:bg-gray-300"
            onClick={prevStep}
            disabled={step === 0 || loading}
          >
            Back
          </button>
          {step === steps.length - 1 ? (
            <button
              type="submit"
              className="px-4 py-2 rounded-[10px] bg-green-600 text-white hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          ) : (
            <button
              type="button"
              className="px-4 py-2 rounded-[10px] bg-blue-600 text-white hover:bg-blue-700"
              onClick={nextStep}
              disabled={loading}
            >
              Next
            </button>
          )}
        </DialogFooter>
      </form>
    </div>
  );
}
