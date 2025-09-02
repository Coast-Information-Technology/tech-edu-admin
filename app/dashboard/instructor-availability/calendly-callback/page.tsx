"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { postApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { useRole } from "@/contexts/RoleContext";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function CalendlyCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userData } = useRole();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const completeOAuth = async () => {
      const token = getTokenFromCookies();
      if (!token) {
        setStatus("error");
        setMessage("Authentication required. Please log in.");
        return;
      }

      if (!userData._id && !userData.id) {
        setStatus("error");
        setMessage("Instructor ID not found. Please log in again.");
        return;
      }

      // Get OAuth parameters from URL
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const error = searchParams.get("error");

      if (error) {
        setStatus("error");
        setMessage(`OAuth error: ${error}`);
        return;
      }

      if (!code || !state) {
        setStatus("error");
        setMessage("Missing OAuth parameters. Please try again.");
        return;
      }

      try {
        // Complete the OAuth flow
        const response = await postApiRequest(
          `/api/instructors/${
            userData._id || userData.id
          }/calendly-oauth/complete`,
          token,
          {
            code,
            state,
          }
        );

        if (response?.data?.success) {
          setStatus("success");
          setMessage("Calendly connected successfully!");

          // Redirect to instructor availability page after 2 seconds
          setTimeout(() => {
            router.push("/dashboard/instructor-availability");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(
            response?.data?.message || "Failed to complete Calendly connection"
          );
        }
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Failed to complete Calendly connection");
      }
    };

    completeOAuth();
  }, [searchParams, userData._id, userData.id, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 text-center">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Connecting to Calendly...
              </h2>
              <p className="text-slate-600">
                Please wait while we complete your Calendly connection.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Success!
              </h2>
              <p className="text-green-700 mb-4">{message}</p>
              <p className="text-sm text-slate-600">
                Redirecting to instructor availability...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-red-800 mb-2">
                Connection Failed
              </h2>
              <p className="text-red-700 mb-4">{message}</p>
              <button
                onClick={() =>
                  router.push("/dashboard/instructor-availability")
                }
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all duration-300"
              >
                Back to Availability
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
