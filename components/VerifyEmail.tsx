"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail, resendVerificationEmail } from "@/lib/apiFetch";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { toast } from "react-toastify";

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );
  const [message, setMessage] = useState<string>("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");
  const [resendError, setResendError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }
    const verify = async () => {
      try {
        const { data, message } = await verifyEmail(token);
        setStatus("success");
        setMessage(message || "Your email has been successfully verified!");
        // Only redirect if role is valid
        // let onboardingPath: string | null = null;
        // switch (role) {
        //   case "student":
        //     onboardingPath = "/onboarding/student";
        //     break;
        //   case "recruiter":
        //     onboardingPath = "/onboarding/recruiter";
        //     break;
        //   case "institution":
        //     onboardingPath = "/onboarding/institution";
        //     break;
        //   case "tech-professional":
        //   case "individualTechProfessional":
        //     onboardingPath = "/onboarding/tech-professional";
        //     break;
        //   default:
        //     onboardingPath = null;
        // }
        // if (onboardingPath) {
        //   setTimeout(() => router.push(onboardingPath!), 3000);
        // } else {
        setTimeout(() => router.push("/reset-password"), 3000);
        // }
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.message ||
            "Verification failed. Please try again or contact support."
        );
      }
    };
    verify();
  }, [searchParams, router]);

  const handleResend = async () => {
    setResendLoading(true);
    setResendSuccess("");
    setResendError("");
    try {
      const email = searchParams.get("email") || "";
      if (!email)
        throw new Error("Email not found. Please try registering again.");
      const res = await resendVerificationEmail(email);
      setResendSuccess(
        res.message || "Verification email sent. Please check your inbox."
      );
      toast.success(
        res.message || "Verification email sent. Please check your inbox."
      );
    } catch (err: any) {
      setResendError(err?.message || "Failed to resend verification email.");
      toast.error(err?.message || "Failed to resend verification email.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-[10px] shadow-xl p-8 text-center">
        {status === "pending" && (
          <>
            <div className="mb-6 animate-pulse">
              <Loader2 className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Verifying Email...
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your email address.
            </p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-green-800">
              Email Verified Successfully!
            </h2>
            {/* <p className="text-gray-700 mb-6">redirect</p> */}
            {/* <Link
              href="/login"
              className="bg-[#011F72] text-white px-6 py-2 rounded-[10px] font-medium hover:bg-blue-700"
            >
              Go to Login
            </Link> */}
          </>
        )}
        {status === "error" && (
          <>
            <div className="mb-6">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-red-800">
              Verification Failed
            </h2>
            <p className="text-gray-700 mb-6">{message}</p>
            <Button
              onClick={handleResend}
              disabled={resendLoading}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-[10px] font-medium hover:bg-gray-300"
            >
              Resend Verification Email
            </Button>
            {resendSuccess && (
              <p className="text-green-600 text-sm mt-2">{resendSuccess}</p>
            )}
            {resendError && (
              <p className="text-red-600 text-sm mt-2">{resendError}</p>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default VerifyEmailPage;
