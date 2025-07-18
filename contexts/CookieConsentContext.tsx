"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CookieConsentContextType {
  consent: "accepted" | "rejected" | null;
  hasConsented: boolean;
  acceptCookies: () => void;
  rejectCookies: () => void;
  resetConsent: () => void;
}

const CookieConsentContext = createContext<
  CookieConsentContextType | undefined
>(undefined);

export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [consent, setConsent] = useState<"accepted" | "rejected" | null>(null);

  useEffect(() => {
    // Load consent from localStorage on mount
    const savedConsent = localStorage.getItem("cookieConsent") as
      | "accepted"
      | "rejected"
      | null;
    setConsent(savedConsent);
  }, []);

  const acceptCookies = () => {
    setConsent("accepted");
    localStorage.setItem("cookieConsent", "accepted");

    // Enable analytics and tracking cookies
    enableAnalyticsCookies();
  };

  const rejectCookies = () => {
    setConsent("rejected");
    localStorage.setItem("cookieConsent", "rejected");

    // Disable analytics and tracking cookies
    disableAnalyticsCookies();
  };

  const resetConsent = () => {
    setConsent(null);
    localStorage.removeItem("cookieConsent");
  };

  const enableAnalyticsCookies = () => {
    // Enable Google Analytics, Facebook Pixel, etc.
    if (typeof window !== "undefined") {
      // Example: Enable Google Analytics
      // window.gtag('consent', 'update', { analytics_storage: 'granted' });
      // Example: Enable Facebook Pixel
      // window.fbq('consent', 'grant');
    }
  };

  const disableAnalyticsCookies = () => {
    // Disable analytics and tracking cookies
    if (typeof window !== "undefined") {
      // Example: Disable Google Analytics
      // window.gtag('consent', 'update', { analytics_storage: 'denied' });
      // Example: Disable Facebook Pixel
      // window.fbq('consent', 'revoke');
    }
  };

  const value = {
    consent,
    hasConsented: consent !== null,
    acceptCookies,
    rejectCookies,
    resetConsent,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider"
    );
  }
  return context;
}
