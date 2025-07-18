// @/components/GoogleCallbackHandler.tsx

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveTokenToCookies, setCookie } from "@/lib/cookies";
import { toast } from "react-toastify";

// Function to determine redirect route based on user role and onboarding status
const getRedirectRoute = (userData: any) => {
  const { role, onboardingStatus, id } = userData;

  // Store userId in cookie for onboarding if needed
  if (id) {
    setCookie("userId", id, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  // If onboarding is not started, route to onboarding
  if (onboardingStatus === "not_started") {
    switch (role.toLowerCase()) {
      case "student":
        return "/onboarding/student";
      case "recruiter":
        return "/onboarding/recruiter";
      case "institution":
        return "/onboarding/institution";
      case "individualTechProfessional":
      case "individualTechProfessional":
        return "/onboarding/tech-professional";
      default:
        return "/login";
    }
  }

  // If onboarding is completed, route to dashboard
  if (onboardingStatus === "completed") {
    switch (role.toLowerCase()) {
      case "student":
        return "/dashboard/student";
      case "recruiter":
        return "/dashboard/recruiter";
      case "institution":
        return "/dashboard/institution";
      case "individualTechProfessional":
      case "individualTechProfessional":
        return "/dashboard/tech-professional";
      default:
        return "/login";
    }
  }

  // Fallback to general dashboard
  return "/login";
};

export default function GoogleCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");
    const userData = searchParams.get("userData");

    if (token) {
      saveTokenToCookies(token);
      toast.success("Google login successful!");

      // If userData is provided, use it to determine redirect route
      if (userData) {
        try {
          const user = JSON.parse(decodeURIComponent(userData));
          const redirectRoute = getRedirectRoute(user);
          router.push(redirectRoute);
        } catch (error) {
          console.error("Failed to parse user data:", error);
          router.push("/login");
        }
      } else {
        // Fallback to login if no user data
        router.push("/login");
      }
    } else {
      toast.error(error || "Google login failed.");
      router.push("/login");
    }
  }, [router, searchParams]);

  return <div>Signing you in with Google...</div>;
}
