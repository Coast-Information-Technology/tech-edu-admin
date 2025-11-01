"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";
import { RefreshCw, ArrowLeft } from "lucide-react";

export default function NonBookableServiceDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<any>(null);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }
      const id = params?.id;
      const res = await getApiRequest(
        `/api/non-bookable-services/my-services/${id}`,
        token
      );
      if (res?.data?.success) {
        setService(res.data.data);
      } else {
        toast.error(res?.data?.message || "Failed to load service details");
      }
    } catch (err) {
      toast.error("Failed to load service details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <h1 className="text-2xl font-bold text-slate-900">Service Details</h1>
          </div>
          <Button onClick={fetchDetails} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">
              {service?.service || "—"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="p-8 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-3 text-slate-600">Loading service...</span>
              </div>
            ) : !service ? (
              <div className="p-8 text-center text-slate-600">Not found.</div>
            ) : service?.hasAccess === false ? (
              <div className="p-8 text-center">
                <p className="text-slate-700 font-medium">You do not have access to this service.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-slate-500">Product Type</div>
                    <div className="font-medium">{service.productType || "—"}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-500">Category</div>
                    <div className="font-medium">{service.productCategoryTitle || "—"}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-500">Subcategory</div>
                    <div className="font-medium">{service.productSubcategoryName || "—"}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-500">Media Type</div>
                    <div className="font-medium capitalize">{service.mediaType || "—"}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-500">Delivery Mode</div>
                    <div className="font-medium capitalize">{service.deliveryMode || "—"}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-500">Session Type</div>
                    <div className="font-medium">{service.sessionType || "—"}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-slate-500">Description</div>
                  <div className="text-slate-700">{service.description || "—"}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-slate-500">Material URL</div>
                    <div className="text-blue-600 break-all">{service.materialUrl || "—"}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-500">Thumbnail</div>
                    <div className="text-blue-600 break-all">{service.thumbnailUrl || "—"}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-slate-500">Pricing</div>
                    <div className="text-slate-800 font-medium">
                      {service.pricing?.currency?.toUpperCase() || ""} {typeof service.pricing?.basePrice === "number" ? service.pricing.basePrice.toFixed(2) : "—"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {service.pricing?.model || ""} • {service.pricing?.priceBasis || ""}
                    </div>
                    <div className="text-xs text-slate-500">
                      VAT {typeof service.pricing?.vatPercentage === "number" ? `${service.pricing.vatPercentage}%` : "—"} • {service.pricing?.taxInclusive ? "Tax Inclusive" : "Tax Exclusive"}
                    </div>
                    <div className="text-xs text-slate-500">
                      Qty: {service.pricing?.minQty ?? "—"} - {service.pricing?.maxQty ?? "—"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-500">Status</div>
                    {service.enabled ? (
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Disabled</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-slate-500">Program Length</div>
                    <div className="font-medium">{service.programLength ?? "—"} {service.mode || ""}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-slate-500">Created</div>
                    <div className="font-medium">{service.createdAt ? new Date(service.createdAt).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


