"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AcademicService } from "@/types/academic-service";
import { getApiRequest, deleteApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  Loader2,
  Edit,
  Trash2,
  ArrowLeft,
  GraduationCap,
  Star,
  Users,
  Clock,
  DollarSign,
  Tag,
  CheckCircle,
  BookOpen,
  Globe,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AcademicServiceViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [service, setService] = useState<AcademicService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const token = getTokenFromCookies() || undefined;

  useEffect(() => {
    const fetchService = async () => {
      if (!token) {
        toast.error("Authentication required");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await getApiRequest<{ data: AcademicService }>(
          `/api/academic-services/${id}`,
          token
        );
        const data = response.data?.data || response.data;
        setService(data);
      } catch (error: any) {
        setError(error.message || "Failed to fetch academic service");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchService();
  }, [id]);

  const handleDelete = async () => {
    if (!service) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!service) return;
    const token = getTokenFromCookies() || undefined;
    if (!token) {
      toast.error("Authentication required");
      return;
    }
    try {
      const response = await deleteApiRequest(
        `/api/academic-services/${service.id}`,
        token
      );
      if (response.status >= 200 && response.status < 300) {
        toast.success("Service deleted successfully");
        router.push("/dashboard/academic-services");
      } else {
        toast.error(response.message || "Failed to delete service");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete service");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading academic service...</span>
      </div>
    );
  }
  if (error || !service) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Service not found"}</p>
          <Button
            onClick={() => router.push("/dashboard/academic-services")}
            variant="outline"
          >
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-[#011F72]" />
          <div>
            <h1 className="text-3xl font-bold text-[#011F72]">
              {service.title}
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">{service.category}</Badge>
              <Badge variant="secondary">{service.serviceLevel}</Badge>
              <Badge variant="secondary">{service.deliveryMode}</Badge>
              <Badge variant="secondary">{service.sessionType}</Badge>
              {service.isActive ? (
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button asChild variant="outline" className="rounded-[10px]">
            <Link href={`/dashboard/academic-services/${service.id}/edit`}>
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            className="rounded-[10px] bg-red-600 text-white hover:bg-red-400"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
          <Button
            variant="outline"
            className="rounded-[10px]"
            onClick={() => router.push("/dashboard/academic-services")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <img
                src={service.thumbnailUrl}
                alt={service.title}
                className="w-full h-56 object-cover rounded-[10px] mb-6"
              />
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" /> Description
                </h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {service.description}
                </p>
              </div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" /> Learning
                  Objectives
                </h2>
                <ul className="list-disc list-inside text-gray-700">
                  {service.learningObjectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-purple-500" /> Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-500" /> Prerequisites
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {service.prerequisites}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>Duration: {service.durationMinutes} min</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span>Price: ${service.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span>Max Participants: {service.maxParticipants}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>
                  Rating: {service.rating} ({service.totalReviews} reviews)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <span>
                  Created: {new Date(service.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <span>
                  Updated: {new Date(service.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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
