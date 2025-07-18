"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import StudentProfile from "./components/StudentProfile";
import InstitutionProfile from "./components/InstitutionProfile";
import IndividualTechProfessionalProfile from "./components/IndividualTechProfessionalProfile";
import TeamTechProfessionalProfile from "./components/TeamTechProfessionalProfile";
import RecruiterProfile from "./components/RecruiterProfile";
import {
  getApiRequestWithRefresh,
  updateApiRequest,
  patchApiRequest,
} from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { useProfile } from "@/contexts/ProfileContext";

interface UserProfile {
  _id: string;
  id?: string;
  userId?: string;
  email: string;
  fullName: string;
  role: string;
  isVerified: boolean;
  onboardingStatus: string;
  createdAt: string;
  updatedAt: string;
  profile: any;
  data?: any;
  user?: any;
  userRole?: string;
}

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile: contextProfile, setProfile } = useProfile();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = getTokenFromCookies();
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await getApiRequestWithRefresh("/api/users/me", token);

      if (response.status === 200) {
        const profileData = response.data.data.data;
        setUserProfile(profileData);
        // Update the context with the profile data
        setProfile(profileData.profile || {});
      } else {
        setError("Failed to fetch profile");
      }
    } catch (err) {
      setError("Error fetching profile");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedData: any) => {
    try {
      setLoading(true);
      const token = getTokenFromCookies();
      if (!token) {
        return { success: false, error: "No authentication token found" };
      }

      if (!userProfile) {
        return { success: false, error: "No user profile found" };
      }

      // Get the correct user ID - try different possible locations
      const userId = userProfile._id || userProfile.id || userProfile.userId;
      if (!userId) {
        return { success: false, error: "No user ID found" };
      }

      // Use the onboarding complete-step endpoint for profile updates with PATCH method
      const response = await patchApiRequest(
        `/api/onboarding/${userId}/complete-step`,
        token,
        updatedData
      );

      if (response.status === 200) {
        // Update the context with the new data
        setProfile({ ...contextProfile, ...updatedData });
        // Refresh the profile data
        await fetchUserProfile();
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      return { success: false, error: "Failed to update profile" };
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="bg-[#011F72] text-white px-4 py-2 rounded-[10px] hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>No profile data available</p>
      </div>
    );
  }

  // Render role-specific profile component
  const renderProfileComponent = () => {
    // Try to get role from different possible locations
    let userRole = userProfile.role;

    // If role is undefined, try alternative locations
    if (!userRole) {
      userRole =
        userProfile.data?.role ||
        userProfile.user?.role ||
        userProfile.profile?.role ||
        userProfile.userRole;
    }

    // Normalize role value (handle case sensitivity and different formats)
    const normalizedRole = userRole?.toLowerCase()?.replace(/[_-]/g, "");

    switch (normalizedRole) {
      case "student":
        return (
          <StudentProfile
            userProfile={userProfile}
            onUpdate={handleProfileUpdate}
            userId={
              userProfile._id || userProfile.id || userProfile.userId || ""
            }
            token={getTokenFromCookies() || ""}
          />
        );
      case "institution":
        return (
          <InstitutionProfile
            userProfile={userProfile}
            onUpdate={handleProfileUpdate}
            userId={
              userProfile._id || userProfile.id || userProfile.userId || ""
            }
            token={getTokenFromCookies() || ""}
          />
        );
      case "individualtechprofessional":
        return (
          <IndividualTechProfessionalProfile
            userProfile={userProfile}
            onUpdate={handleProfileUpdate}
            userId={
              userProfile._id || userProfile.id || userProfile.userId || ""
            }
            token={getTokenFromCookies() || ""}
          />
        );
      case "teamtechprofessional":
        return (
          <TeamTechProfessionalProfile
            userProfile={userProfile}
            onUpdate={handleProfileUpdate}
            userId={
              userProfile._id || userProfile.id || userProfile.userId || ""
            }
            token={getTokenFromCookies() || ""}
          />
        );
      case "recruiter":
        return (
          <RecruiterProfile
            userProfile={userProfile}
            onUpdate={handleProfileUpdate}
            userId={
              userProfile._id || userProfile.id || userProfile.userId || ""
            }
            token={getTokenFromCookies() || ""}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-2">
                Unsupported role: "{userRole}" (normalized: "{normalizedRole}")
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Supported roles: student, institution,
                individualTechProfessional, teamTechProfessional, recruiter
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Please contact support if you believe this is an error.
              </p>
              <div className="text-xs text-gray-400 text-left max-w-md mx-auto">
                <p>Debug info:</p>
                <p>Original role: {userProfile.role}</p>
                <p>User data keys: {Object.keys(userProfile).join(", ")}</p>
                <p>
                  Profile keys:{" "}
                  {userProfile.profile
                    ? Object.keys(userProfile.profile).join(", ")
                    : "No profile"}
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#011F72]">Profile</h1>
        <p className="text-gray-600">
          Manage your {userProfile.role} profile information
        </p>
      </div>
      {renderProfileComponent()}
    </div>
  );
}
