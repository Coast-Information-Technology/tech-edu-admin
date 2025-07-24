"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiRequest, patchApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const steps = [
  "Basic Info",
  "Delivery & Session",
  "Pricing & Duration",
  "Media & SEO",
  "Review & Submit",
];

const PRODUCT_TYPE_OPTIONS = [
  "Academic Services",
  "Corporate Consultancy",
  "Career Development",
];
const SERVICE_OPTIONS: Record<string, string[]> = {
  "Academic Services": [
    "PhD Mentoring",
    "PhD Admission and Scholarship",
    "General Mentoring and Pastoral Care",
    "Academic Transition Training",
    "Master's Project Supervision",
    "Thesis Review & Editing",
    "Academic Research Publication Support",
  ],
  "Career Development": [
    "CV Revamp ",
    "Interview Preparation",
    "Career Coaching",
  ],
  "Corporate Consultancy": [
    "Business Analysis Training",
    "Professional Consultancy",
    "Leadership and management consultancy",
    "Academic Data Analysis",
    "AI Ethics Consultation",
    "AI Governance Framework",
    "Enterprise AI Governance",
  ],
};
const SUBCATEGORY_OPTIONS = ["NLP", "ChatGPT", "AI"];
const DIFFICULTY_LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];
const DELIVERY_MODE_OPTIONS = ["online", "offline"];
const SESSION_TYPE_OPTIONS = ["one-one", "group"];

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [customService, setCustomService] = useState("");
  const [customSubcategory, setCustomSubcategory] = useState("");
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);
  const [subcategoryOptions, setSubcategoryOptions] =
    useState<string[]>(SUBCATEGORY_OPTIONS);

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
        setForm(res?.data?.data?.product || {});
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  // Update service options when productType changes
  useEffect(() => {
    if (form?.productType && SERVICE_OPTIONS[form.productType]) {
      setServiceOptions(SERVICE_OPTIONS[form.productType]);
    } else {
      setServiceOptions([]);
    }
  }, [form?.productType]);

  // Set subcategory options from form on load
  useEffect(() => {
    if (form?.subcategories) {
      setSubcategoryOptions(
        Array.from(
          new Set([...(form.subcategories || []), ...SUBCATEGORY_OPTIONS])
        )
      );
    } else {
      setSubcategoryOptions(SUBCATEGORY_OPTIONS);
    }
  }, [form?.subcategories]);

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
    if (!form.productType || !form.service || !form.category || !form.price) {
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
    // Sanitize number fields
    const sanitizedForm = {
      ...form,
      price: Number(form.price) || 0,
      discountPercentage: Number(form.discountPercentage) || 0,
      durationMinutes: Number(form.durationMinutes) || 0,
      programLength: Number(form.programLength) || 0,
    };
    try {
      await patchApiRequest(`/api/products/${id}`, token, sanitizedForm);
      // Patch metadata separately
      await patchApiRequest(`/api/products/${id}/metadata`, token, {
        slug: form.slug,
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        pageKeywords: form.pageKeywords,
      });
      setSuccess("Product updated successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="flex justify-center py-20">Loading...</div>;
  if (error)
    return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  if (!form) return <div className="p-4">Product not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        type="button"
        className="mb-6 px-4 py-2 rounded-[10px] bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium border border-gray-300 transition"
        onClick={() => router.push(`/dashboard/products/${id}`)}
      >
        ← Back to View
      </button>
      {/* Modern Stepper UI (copied from create page) */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((label, idx) => (
          <div key={label} className="flex-1 flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                idx < step
                  ? "bg-blue-600 border-blue-600 text-white"
                  : idx === step
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-gray-200 border-gray-300 text-gray-500"
              } font-bold transition-all duration-200`}
            >
              {idx < step ? <span>&#10003;</span> : idx + 1}
            </div>
            <span
              className={`mt-2 text-xs font-medium ${
                idx === step ? "text-blue-700" : "text-gray-500"
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
            <div className="flex gap-2">
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className="w-full border rounded-[10px] p-2"
                required
                disabled={!form.productType}
              >
                <option value="">Select Service</option>
                {serviceOptions.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
                {form.service && !serviceOptions.includes(form.service) && (
                  <option value={form.service}>{form.service}</option>
                )}
              </select>
              <input
                type="text"
                value={customService}
                onChange={(e) => setCustomService(e.target.value)}
                placeholder="Add custom service"
                className="border rounded-[10px] p-2 w-40"
              />
              <button
                type="button"
                className="px-3 py-2 rounded-[10px] bg-blue-100 text-blue-700 hover:bg-blue-200"
                onClick={() => {
                  if (
                    customService &&
                    !serviceOptions.includes(customService)
                  ) {
                    setServiceOptions((prev) => [...prev, customService]);
                    setForm((prev: any) => ({
                      ...prev,
                      service: customService,
                    }));
                    setCustomService("");
                  }
                }}
              >
                Add
              </button>
            </div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className="rounded-[10px]"
            />
            <label className="block text-sm font-medium mb-1">
              Subcategories
            </label>
            <div className="flex gap-2 flex-wrap">
              <select
                multiple
                value={form.subcategories}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map(
                    (opt) => opt.value
                  );
                  setForm((prev: any) => ({
                    ...prev,
                    subcategories: selected,
                  }));
                }}
                className="border rounded-[10px] p-2 w-full"
              >
                {subcategoryOptions.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={customSubcategory}
                onChange={(e) => setCustomSubcategory(e.target.value)}
                placeholder="Add subcategory"
                className="border rounded-[10px] p-2 w-40"
              />
              <button
                type="button"
                className="px-3 py-2 rounded-[10px] bg-blue-100 text-blue-700 hover:bg-blue-200"
                onClick={() => {
                  if (
                    customSubcategory &&
                    !subcategoryOptions.includes(customSubcategory)
                  ) {
                    setSubcategoryOptions((prev) => [
                      ...prev,
                      customSubcategory,
                    ]);
                    setForm((prev: any) => ({
                      ...prev,
                      subcategories: [...prev.subcategories, customSubcategory],
                    }));
                    setCustomSubcategory("");
                  }
                }}
              >
                Add
              </button>
            </div>
            <label className="block text-sm font-medium mb-1">
              Difficulty Level
            </label>
            <select
              name="difficultyLevel"
              value={form.difficultyLevel}
              onChange={handleChange}
              className="w-full border rounded-[10px] p-2"
              required
            >
              <option value="">Select Difficulty Level</option>
              {DIFFICULTY_LEVEL_OPTIONS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <label className="block text-sm font-medium mb-1">
              Target Audience
            </label>
            <select
              multiple
              name="targetAudience"
              value={form.targetAudience}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(
                  (opt) => opt.value
                );
                setForm((prev: any) => ({ ...prev, targetAudience: selected }));
              }}
              className="w-full border rounded-[10px] p-2"
            >
              {["student", "graduate", "tech_pro", "team"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
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
                { key: "requiresAttendance", label: "Requires Attendance" },
                { key: "hasCertificate", label: "Has Certificate" },
                { key: "hasClassroom", label: "Has Classroom" },
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
              placeholder="Price"
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
              placeholder="Discount %"
              type="number"
              className="rounded-[10px]"
            />
            <label className="block text-sm font-medium mb-1">
              Duration (minutes)
            </label>
            <Input
              name="durationMinutes"
              value={form.durationMinutes}
              onChange={handleChange}
              placeholder="Duration (minutes)"
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
              placeholder="Program Length"
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
              {["weeks", "months", "sessions", "hours"].map((opt) => (
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
              placeholder="Description"
              className="w-full border rounded-[10px] p-2"
            />
            <label className="block text-sm font-medium mb-1">
              Tags (comma separated)
            </label>
            <Input
              name="tags"
              value={form.tags?.join(", ")}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  tags: e.target.value
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="e.g. Python, AI, NLP"
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
                src={
                  form.iconUrl?.startsWith("https://res.cloudinary.com")
                    ? form.iconUrl
                    : "/placeholder.png"
                }
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
                src={
                  form.thumbnailUrl?.startsWith("https://res.cloudinary.com")
                    ? form.thumbnailUrl
                    : "/placeholder.png"
                }
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
              placeholder="Slug"
              className="rounded-[10px]"
            />
            <label className="block text-sm font-medium mb-1">SEO Title</label>
            <Input
              name="seoTitle"
              value={form.seoTitle}
              onChange={handleChange}
              placeholder="SEO Title"
              className="rounded-[10px]"
            />
            <label className="block text-sm font-medium mb-1">
              SEO Description
            </label>
            <Input
              name="seoDescription"
              value={form.seoDescription}
              onChange={handleChange}
              placeholder="SEO Description"
              className="rounded-[10px]"
            />
            <label className="block text-sm font-medium mb-1">
              Page Keywords (comma separated)
            </label>
            <Input
              name="pageKeywords"
              value={form.pageKeywords?.join(", ")}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  pageKeywords: e.target.value
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="e.g. data science, python, machine learning"
              className="rounded-[10px]"
            />
          </div>
        )}
        {step === 4 && (
          <div className="bg-gray-50 p-4 rounded-[10px]">
            <h2 className="text-lg font-semibold mb-2">Review & Submit</h2>
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
                  <span className="font-medium">Subcategories:</span>{" "}
                  {form.subcategories?.join(", ")}
                </div>
                <div>
                  <span className="font-medium">Difficulty Level:</span>{" "}
                  {form.difficultyLevel}
                </div>
                <div>
                  <span className="font-medium">Target Audience:</span>{" "}
                  {form.targetAudience?.join(", ")}
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
                  <span className="font-medium">Requires Attendance:</span>{" "}
                  {form.requiresAttendance ? "Yes" : "No"}
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
                  {form.durationMinutes}
                </div>
                <div>
                  <span className="font-medium">Program Length:</span>{" "}
                  {form.programLength}
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
                  {form.tags?.join(", ")}
                </div>
                <div>
                  <span className="font-medium">Slug:</span> {form.slug}
                </div>
                <div>
                  <span className="font-medium">SEO Title:</span>{" "}
                  {form.seoTitle}
                </div>
                <div>
                  <span className="font-medium">SEO Description:</span>{" "}
                  {form.seoDescription}
                </div>
                <div>
                  <span className="font-medium">Page Keywords:</span>{" "}
                  {form.pageKeywords?.join(", ")}
                </div>
                <div>
                  <span className="font-medium">Enabled:</span>{" "}
                  {form.enabled ? "Yes" : "No"}
                </div>
                {form.iconUrl && (
                  <div className="flex flex-col items-center mt-2">
                    <span className="font-medium">Icon:</span>
                    <img
                      src={
                        form.iconUrl?.startsWith("https://res.cloudinary.com")
                          ? form.iconUrl
                          : "/placeholder.png"
                      }
                      alt="Icon Preview"
                      className="mt-1 rounded-[10px] w-16 h-16 object-cover"
                    />
                  </div>
                )}
                {form.thumbnailUrl && (
                  <div className="flex flex-col items-center mt-2">
                    <span className="font-medium">Thumbnail:</span>
                    <img
                      src={
                        form.thumbnailUrl?.startsWith(
                          "https://res.cloudinary.com"
                        )
                          ? form.thumbnailUrl
                          : "/placeholder.png"
                      }
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
                Saving changes...
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
          {step < steps.length - 1 ? (
            <button
              type="button"
              className="px-4 py-2 rounded-[10px] bg-blue-600 text-white hover:bg-blue-700"
              onClick={nextStep}
              disabled={loading}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 rounded-[10px] bg-green-600 text-white hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          )}
        </DialogFooter>
      </form>
    </div>
  );
}
