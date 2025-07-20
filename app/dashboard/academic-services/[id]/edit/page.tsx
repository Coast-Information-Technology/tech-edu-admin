"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AcademicService } from "@/types/academic-service";
import { getApiRequest, updateApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import {
  Loader2,
  Plus,
  ArrowLeft,
  CheckCircle,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";

const CATEGORY_OPTIONS = [
  { value: "scholarship_coaching", label: "Scholarship Coaching" },
  { value: "academic_transition", label: "Academic Transition" },
  { value: "thesis_review", label: "Thesis Review" },
  { value: "research_publication", label: "Research Publication" },
  { value: "masters_project", label: "Masters Project" },
  { value: "phd_mentorship", label: "PhD Mentorship" },
  { value: "document_review", label: "Document Review" },
  { value: "sop_writing", label: "SOP Writing" },
  { value: "cover_letter", label: "Cover Letter" },
  { value: "research_proposal", label: "Research Proposal" },
  { value: "plagiarism_check", label: "Plagiarism Check" },
  { value: "mentorship", label: "Mentorship" },
  { value: "study_abroad", label: "Study Abroad" },
  { value: "career_roadmapping", label: "Career Roadmapping" },
];
const LEVEL_OPTIONS = ["basic", "standard", "premium", "elite"];
const DELIVERY_OPTIONS = ["online", "offline", "hybrid"];
const SESSION_OPTIONS = ["1-on-1", "group", "workshop"];

const initialForm = {
  title: "",
  description: "",
  category: "",
  serviceLevel: "basic",
  deliveryMode: "online",
  sessionType: "1-on-1",
  durationMinutes: 60,
  price: 0,
  tags: [] as string[],
  learningObjectives: [] as string[],
  prerequisites: "",
  maxParticipants: 1,
  thumbnailUrl: "",
  isActive: true,
};
type FormType = typeof initialForm;

export default function EditAcademicServicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormType>(initialForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [tagInput, setTagInput] = useState("");
  const [objectiveInput, setObjectiveInput] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      setFetching(true);
      try {
        const token = getTokenFromCookies();
        if (!token) {
          toast.error("Authentication required");
          setFetching(false);
          return;
        }
        const response = await getApiRequest<{ data: AcademicService }>(
          `/api/academic-services/${id}`,
          token
        );
        const data = response.data?.data || response.data;
        setForm({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          serviceLevel: data.serviceLevel || "basic",
          deliveryMode: data.deliveryMode || "online",
          sessionType: data.sessionType || "1-on-1",
          durationMinutes: data.durationMinutes || 60,
          price: data.price || 0,
          tags: data.tags || [],
          learningObjectives: data.learningObjectives || [],
          prerequisites: data.prerequisites || "",
          maxParticipants: data.maxParticipants || 1,
          thumbnailUrl: data.thumbnailUrl || "",
          isActive: data.isActive ?? true,
        });
        setImagePreview(data.thumbnailUrl || "");
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch academic service");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchService();
  }, [id]);

  // Image upload handler (replace with Firebase logic if needed)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };
  // Add learning objective
  const addObjective = () => {
    if (
      objectiveInput.trim() &&
      !form.learningObjectives.includes(objectiveInput.trim())
    ) {
      setForm((prev) => ({
        ...prev,
        learningObjectives: [...prev.learningObjectives, objectiveInput.trim()],
      }));
      setObjectiveInput("");
    }
  };
  // Remove tag/objective
  const removeTag = (i: number) =>
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, idx) => idx !== i),
    }));
  const removeObjective = (i: number) =>
    setForm((prev) => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, idx) => idx !== i),
    }));

  // Step navigation
  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Submit handler
  const handleSubmit = async () => {
    setLoading(true);
    try {
      let thumbnailUrl = form.thumbnailUrl;
      // if (imageFile) {
      //   thumbnailUrl = await uploadImageToFirebase(imageFile, "academic-services");
      // }
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required");
        setLoading(false);
        return;
      }
      const response = await updateApiRequest(
        `/api/academic-services/${id}`,
        token,
        { ...form, thumbnailUrl }
      );
      if (response.status >= 200 && response.status < 300) {
        toast.success("Academic service updated!");
        router.push(`/dashboard/academic-services/${id}`);
      } else {
        toast.error(response.message || "Failed to update service");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update service");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading academic service...</span>
      </div>
    );
  }

  // Step content (reuse from create page, but pre-filled)
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="title" className="block mb-1 font-medium">
                  Title *
                </label>
                <Input
                  id="title"
                  placeholder="Title *"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="rounded-[10px]"
                />
              </div>
              <div>
                <label htmlFor="description" className="block mb-1 font-medium">
                  Description *
                </label>
                <Textarea
                  id="description"
                  placeholder="Description *"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="rounded-[10px]"
                  rows={4}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <div>
                  <label htmlFor="category" className="block mb-1 font-medium">
                    Category *
                  </label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                    className="rounded-[10px] border px-3 py-2"
                  >
                    <option value="">Select Category *</option>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="serviceLevel"
                    className="block mb-1 font-medium"
                  >
                    Service Level *
                  </label>
                  <select
                    id="serviceLevel"
                    value={form.serviceLevel}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, serviceLevel: e.target.value }))
                    }
                    className="rounded-[10px] border px-3 py-2"
                  >
                    {LEVEL_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="deliveryMode"
                    className="block mb-1 font-medium"
                  >
                    Delivery Mode *
                  </label>
                  <select
                    id="deliveryMode"
                    value={form.deliveryMode}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, deliveryMode: e.target.value }))
                    }
                    className="rounded-[10px] border px-3 py-2"
                  >
                    {DELIVERY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="sessionType"
                    className="block mb-1 font-medium"
                  >
                    Session Type *
                  </label>
                  <select
                    id="sessionType"
                    value={form.sessionType}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, sessionType: e.target.value }))
                    }
                    className="rounded-[10px] border px-3 py-2"
                  >
                    {SESSION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Details & Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label
                    htmlFor="durationMinutes"
                    className="block mb-1 font-medium"
                  >
                    Duration (minutes) *
                  </label>
                  <Input
                    id="durationMinutes"
                    type="number"
                    min={1}
                    placeholder="Duration (minutes) *"
                    value={form.durationMinutes}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        durationMinutes: Number(e.target.value),
                      }))
                    }
                    className="rounded-[10px]"
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block mb-1 font-medium">
                    Price ($) *
                  </label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    placeholder="Price ($) *"
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: Number(e.target.value) }))
                    }
                    className="rounded-[10px]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="maxParticipants"
                    className="block mb-1 font-medium"
                  >
                    Max Participants *
                  </label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min={1}
                    placeholder="Max Participants *"
                    value={form.maxParticipants}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        maxParticipants: Number(e.target.value),
                      }))
                    }
                    className="rounded-[10px]"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium">
                  Thumbnail Image *
                </label>
                <div className="flex items-center gap-4 mb-2">
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-[10px] bg-gray-50 hover:bg-gray-100">
                    <UploadCloud className="w-5 h-5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-[10px] border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview("");
                          setForm((f) => ({ ...f, thumbnailUrl: "" }));
                        }}
                        className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-100"
                        aria-label="Remove image"
                      >
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
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
                  ) : (
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-[10px]">
                      <ImageIcon className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="thumbnailUrl"
                    className="block mb-1 font-medium"
                  >
                    Or enter image URL
                  </label>
                  <Input
                    id="thumbnailUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={form.thumbnailUrl}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))
                    }
                    className="rounded-[10px]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isActive: e.target.checked }))
                  }
                  id="isActive"
                />
                <label htmlFor="isActive">Active</label>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Learning & Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Tags</label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {form.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="gap-1 rounded">
                      {tag}
                      <span
                        className="ml-1 cursor-pointer text-red-500"
                        onClick={() => removeTag(i)}
                      >
                        &times;
                      </span>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <label htmlFor="tagInput" className="sr-only">
                    Add a tag
                  </label>
                  <Input
                    id="tagInput"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    className="rounded-[10px]"
                  />
                  <Button
                    onClick={addTag}
                    size="sm"
                    className="rounded-[10px] text-white hover:text-black"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium">
                  Learning Objectives
                </label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {form.learningObjectives.map((obj, i) => (
                    <Badge key={i} variant="outline" className="gap-1 rounded">
                      {obj}
                      <span
                        className="ml-1 cursor-pointer text-red-500"
                        onClick={() => removeObjective(i)}
                      >
                        &times;
                      </span>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <label htmlFor="objectiveInput" className="sr-only">
                    Add a learning objective
                  </label>
                  <Input
                    id="objectiveInput"
                    value={objectiveInput}
                    onChange={(e) => setObjectiveInput(e.target.value)}
                    placeholder="Add a learning objective"
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addObjective())
                    }
                    className="rounded-[10px]"
                  />
                  <Button
                    onClick={addObjective}
                    size="sm"
                    className="rounded-[10px] text-white hover:text-black"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="prerequisites"
                  className="block mb-2 font-medium"
                >
                  Prerequisites
                </label>
                <Textarea
                  id="prerequisites"
                  value={form.prerequisites}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, prerequisites: e.target.value }))
                  }
                  placeholder="e.g., Bachelor's degree or equivalent"
                  className="rounded-[10px]"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Review & Confirm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-[10px] border"
                  />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-[10px]">
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h2 className="font-semibold mb-2">{form.title}</h2>
                  <p className="mb-2 text-gray-700">{form.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary">{form.category}</Badge>
                    <Badge variant="secondary">{form.serviceLevel}</Badge>
                    <Badge variant="secondary">{form.deliveryMode}</Badge>
                    <Badge variant="secondary">{form.sessionType}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm mb-2">
                    <span>
                      <strong>Duration:</strong> {form.durationMinutes} min
                    </span>
                    <span>
                      <strong>Price:</strong> ${form.price}
                    </span>
                    <span>
                      <strong>Max Participants:</strong> {form.maxParticipants}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {form.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="mb-2">
                    <strong>Learning Objectives:</strong>
                    <ul className="list-disc list-inside text-gray-700">
                      {form.learningObjectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-2">
                    <strong>Prerequisites:</strong>
                    <p className="text-gray-700 whitespace-pre-line">
                      {form.prerequisites}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span>Status:</span>
                    {form.isActive ? (
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Button
          variant="outline"
          className="rounded-[10px]"
          onClick={() => router.push("/dashboard/academic-services")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-[#011F72]">
          Edit Academic Service
        </h1>
      </div>
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`w-8 h-2 rounded-full transition-all duration-300 ${
              step === s ? "bg-[#011F72]" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      {renderStep()}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          className="rounded-[10px]"
          onClick={prevStep}
          disabled={step === 1 || loading}
        >
          Previous
        </Button>
        {step < 4 ? (
          <Button
            className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px]"
            onClick={nextStep}
            disabled={loading}
          >
            Next
          </Button>
        ) : (
          <Button
            className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px]"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
}
