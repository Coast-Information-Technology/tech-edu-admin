"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ProfileData {
  [key: string]: any;
}

interface ProfileContextType {
  profile: ProfileData | null;
  updateProfile: (newData: ProfileData) => void;
  setProfile: (profile: ProfileData | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<ProfileData | null>(null);

  const updateProfile = (newData: ProfileData) => {
    setProfileState((prev) => {
      if (!prev) return newData;
      return { ...prev, ...newData };
    });
  };

  const setProfile = (profile: ProfileData | null) => {
    setProfileState(profile);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
