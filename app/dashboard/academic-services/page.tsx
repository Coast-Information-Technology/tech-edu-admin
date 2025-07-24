"use client";

import React, { useEffect, useState } from "react";
import { AcademicService } from "@/types/academic-service";
import { getApiRequest, deleteApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "react-toastify";
import { Loader2, Eye, Edit, Trash2, Plus, GraduationCap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const CATEGORY_OPTIONS = [
  { value: "", label: "All Categories" },
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

const LEVEL_OPTIONS = [
  { value: "", label: "All Levels" },
  { value: "basic", label: "Basic" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
  { value: "elite", label: "Elite" },
];

export default function AcademicServicesPage() {
  const [services, setServices] = useState<AcademicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const token = getTokenFromCookies() || undefined;

  const fetchServices = async () => {
    if (!token) {
      toast.error("Authentication required");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      let endpoint = "/api/academic-services";
      if (category) endpoint = `/api/academic-services/category/${category}`;
      else if (level) endpoint = `/api/academic-services/level/${level}`;
      const response = await getApiRequest<{ data: AcademicService[] }>(
        endpoint,
        token
      );
      // Handle possible nested data structure
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setServices(data);
    } catch (error: any) {
      setError(error.message || "Failed to fetch academic services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line
  }, [category, level]);

  const handleDelete = async (id: string) => {
    setServiceToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    if (!token) {
      toast.error("Authentication required");
      return;
    }
    try {
      const response = await deleteApiRequest(
        `/api/academic-services/${serviceToDelete}`,
        token
      );
      if (response.status >= 200 && response.status < 300) {
        toast.success("Service deleted successfully");
        setServices((prev) => prev.filter((s) => s.id !== serviceToDelete));
      } else {
        toast.error(response.message || "Failed to delete service");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete service");
    } finally {
      setShowDeleteModal(false);
      setServiceToDelete(null);
    }
  };

  // Filtered and searched services
  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#011F72]">
              Academic Services
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and explore academic services
            </p>
          </div>
        </div>
        <Button
          asChild
          className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px]"
        >
          <Link href="/dashboard/academic-services/new">
            <Plus className="w-4 h-4 mr-2" />
            New Service
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-4 items-stretch mb-4">
        <div className="relative w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by title or description..."
            className="rounded-[10px] border border-black px-3 py-2 w-full pl-10"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z"
              />
            </svg>
          </span>
        </div>
        <div>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-[10px] border px-3 py-2 w-full"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={level}
            onChange={(e) => {
              setLevel(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-[10px] border px-3 py-2 w-full"
          >
            {LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading academic services...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchServices} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <GraduationCap className="mx-auto mb-2 w-24 h-24 text-blue-200" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No academic services found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search, filters, or add a new service.
          </p>
          <Button
            asChild
            className="rounded-[10px] text-white hover:text-black"
          >
            <Link href="/dashboard/academic-services/new">
              <Plus className="w-4 h-4 mr-2" />
              New Service
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedServices.map((service) => (
              <Card key={service.id} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {service.title}
                    {service.isActive ? (
                      <Badge className="bg-green-100 text-green-800 ml-2">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 ml-2">
                        Inactive
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <img
                      src={service.thumbnailUrl}
                      alt={service.title}
                      className="w-full h-32 object-cover rounded-[10px] mb-2"
                    />
                    <div className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {service.description}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="secondary">{service.category}</Badge>
                      <Badge variant="secondary">{service.serviceLevel}</Badge>
                      <Badge variant="secondary">{service.deliveryMode}</Badge>
                      <Badge variant="secondary">{service.sessionType}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm mb-2">
                      <span>
                        <strong>Duration:</strong> {service.durationMinutes} min
                      </span>
                      <span>
                        <strong>Price:</strong> ${service.price}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {service.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="rounded-[10px]"
                      >
                        <Link
                          href={`/dashboard/academic-services/${service.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="rounded-[10px]"
                      >
                        <Link
                          href={`/dashboard/academic-services/${service.id}/edit`}
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(service.id)}
                        className="rounded-[10px] text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-[10px]"
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-[10px]"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-white rounded-[10px]">
          <DialogHeader>
            <DialogTitle>Delete Academic Service</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this service? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="rounde-[5px]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="rounde-[5px] bg-red-600 text-white hover:bg-red-400"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
