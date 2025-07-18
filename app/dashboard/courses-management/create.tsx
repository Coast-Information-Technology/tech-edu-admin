import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp, X } from "lucide-react";

const departments = [
  "Computer Science",
  "Data Science",
  "Business",
  "Engineering",
  "Psychology",
  "Mathematics",
];
const instructors = [
  "Dr. Sarah Johnson",
  "Prof. Michael Brown",
  "Dr. Emily Davis",
  "Prof. Robert Wilson",
  "Dr. Lisa Thompson",
  "Prof. James Anderson",
];

export default function CreateCoursePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    code: "",
    department: "",
    instructor: "",
    credits: "",
    duration: "",
    startDate: "",
    endDate: "",
    status: "draft",
    prerequisites: "",
    schedule: "",
    location: "",
    maxEnrollment: "",
    courseImage: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [modules, setModules] = useState([
    { title: "", description: "", link: "" },
  ]);
  const [resources, setResources] = useState([{ name: "", url: "" }]);
  const [pricing, setPricing] = useState({
    price: "",
    discount: "",
    currency: "NGN",
    isFree: false,
  });
  const [showModules, setShowModules] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, courseImage: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();
    setSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setSubmitting(false);
      toast.success(publish ? "Course published!" : "Course saved as draft.");
      router.push("/dashboard/courses-management");
    }, 1000);
  };

  // Module handlers
  const handleModuleChange = (idx: number, field: string, value: string) => {
    setModules((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  };
  const addModule = () =>
    setModules((prev) => [...prev, { title: "", description: "", link: "" }]);
  const removeModule = (idx: number) =>
    setModules((prev) => prev.filter((_, i) => i !== idx));

  // Resource handlers
  const handleResourceChange = (idx: number, field: string, value: string) => {
    setResources((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r))
    );
  };
  const addResource = () =>
    setResources((prev) => [...prev, { name: "", url: "" }]);
  const removeResource = (idx: number) =>
    setResources((prev) => prev.filter((_, i) => i !== idx));

  // Pricing handlers
  const handlePricingChange = (field: string, value: string | boolean) => {
    setPricing((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="title"
              placeholder="Course Title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <Textarea
              name="description"
              placeholder="Course Description"
              value={form.description}
              onChange={handleChange}
              required
            />
            <Input
              name="code"
              placeholder="e.g. CS101"
              value={form.code}
              onChange={handleChange}
              required
            />
            <Select
              value={form.department}
              onValueChange={(v) => handleSelect("department", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dep) => (
                  <SelectItem key={dep} value={dep}>
                    {dep}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={form.instructor}
              onValueChange={(v) => handleSelect("instructor", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Instructor" />
              </SelectTrigger>
              <SelectContent>
                {instructors.map((inst) => (
                  <SelectItem key={inst} value={inst}>
                    {inst}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              name="credits"
              type="number"
              placeholder="e.g. 15"
              value={form.credits}
              onChange={handleChange}
              required
            />
            <Input
              name="duration"
              placeholder="e.g. 12 weeks"
              value={form.duration}
              onChange={handleChange}
              required
            />
            <div className="flex gap-2">
              <Input
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                required
              />
              <Input
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>
            <Select
              value={form.status}
              onValueChange={(v) => handleSelect("status", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Published</SelectItem>
              </SelectContent>
            </Select>
            <Input
              name="prerequisites"
              placeholder="e.g. CS101, Math101"
              value={form.prerequisites}
              onChange={handleChange}
            />
            <Input
              name="schedule"
              placeholder="e.g. Mon, Wed 10:00-11:30"
              value={form.schedule}
              onChange={handleChange}
            />
            <Input
              name="location"
              placeholder="e.g. Room 201, Science Building"
              value={form.location}
              onChange={handleChange}
            />
            <Input
              name="maxEnrollment"
              type="number"
              placeholder="e.g. 50"
              value={form.maxEnrollment}
              onChange={handleChange}
            />
            <div>
              <label htmlFor="courseImage" className="font-medium block mb-1">
                Course Image
              </label>
              <Input
                id="courseImage"
                name="courseImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Course Preview"
                  className="mt-2 w-32 h-20 object-cover rounded border"
                />
              )}
            </div>
            {/* Modules Section */}
            <div className="border rounded p-3">
              <button
                type="button"
                className="flex items-center gap-2 font-semibold mb-2"
                onClick={() => setShowModules((v) => !v)}
              >
                Modules{" "}
                {showModules ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {showModules && (
                <div className="space-y-3">
                  {modules.map((mod, idx) => (
                    <div key={idx} className="border rounded p-2 relative">
                      <button
                        type="button"
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        onClick={() => removeModule(idx)}
                        aria-label="Remove module"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <label className="block font-medium">Module Title</label>
                      <Input
                        value={mod.title}
                        onChange={(e) =>
                          handleModuleChange(idx, "title", e.target.value)
                        }
                        placeholder="Module Title"
                        className="mb-1"
                      />
                      <label className="block font-medium">Description</label>
                      <Textarea
                        value={mod.description}
                        onChange={(e) =>
                          handleModuleChange(idx, "description", e.target.value)
                        }
                        placeholder="Module Description"
                        className="mb-1"
                      />
                      <label className="block font-medium">
                        Video/Resource Link
                      </label>
                      <Input
                        value={mod.link}
                        onChange={(e) =>
                          handleModuleChange(idx, "link", e.target.value)
                        }
                        placeholder="https://..."
                      />
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addModule}>
                    Add Module
                  </Button>
                </div>
              )}
            </div>
            {/* Resources Section */}
            <div className="border rounded p-3">
              <button
                type="button"
                className="flex items-center gap-2 font-semibold mb-2"
                onClick={() => setShowResources((v) => !v)}
              >
                Resources{" "}
                {showResources ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {showResources && (
                <div className="space-y-3">
                  {resources.map((res, idx) => (
                    <div key={idx} className="border rounded p-2 relative">
                      <button
                        type="button"
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        onClick={() => removeResource(idx)}
                        aria-label="Remove resource"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <label className="block font-medium">Resource Name</label>
                      <Input
                        value={res.name}
                        onChange={(e) =>
                          handleResourceChange(idx, "name", e.target.value)
                        }
                        placeholder="Resource Name"
                        className="mb-1"
                      />
                      <label className="block font-medium">Resource URL</label>
                      <Input
                        value={res.url}
                        onChange={(e) =>
                          handleResourceChange(idx, "url", e.target.value)
                        }
                        placeholder="https://..."
                      />
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addResource}>
                    Add Resource
                  </Button>
                </div>
              )}
            </div>
            {/* Pricing Section */}
            <div className="border rounded p-3">
              <button
                type="button"
                className="flex items-center gap-2 font-semibold mb-2"
                onClick={() => setShowPricing((v) => !v)}
              >
                Pricing{" "}
                {showPricing ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {showPricing && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={pricing.isFree}
                      onCheckedChange={(v) => handlePricingChange("isFree", v)}
                      id="isFree"
                    />
                    <label htmlFor="isFree">Free Course</label>
                  </div>
                  {!pricing.isFree && (
                    <>
                      <label className="block font-medium">Price</label>
                      <Input
                        type="number"
                        value={pricing.price}
                        onChange={(e) =>
                          handlePricingChange("price", e.target.value)
                        }
                        placeholder="e.g. 10000"
                        className="mb-1"
                      />
                      <label className="block font-medium">Discount</label>
                      <Input
                        type="number"
                        value={pricing.discount}
                        onChange={(e) =>
                          handlePricingChange("discount", e.target.value)
                        }
                        placeholder="e.g. 2000"
                        className="mb-1"
                      />
                      <label className="block font-medium">Currency</label>
                      <Select
                        value={pricing.currency}
                        onValueChange={(v) =>
                          handlePricingChange("currency", v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NGN">NGN</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                onClick={(e) => handleSubmit(e as any, false)}
              >
                Save as Draft
              </Button>
              <Button type="submit" disabled={submitting}>
                Publish
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
