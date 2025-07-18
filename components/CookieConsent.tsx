"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Cookie, Shield, Settings } from "lucide-react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/50 backdrop-blur-sm">
      <Card className="max-w-4xl mx-auto shadow-2xl border-0">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Cookie className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    We value your privacy
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    We use cookies to enhance your browsing experience, serve
                    personalized content, and analyze our traffic. By clicking
                    "Accept All", you consent to our use of cookies.
                  </p>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {showDetails && (
                <div className="mb-4 p-4 bg-gray-50 rounded-[10px]">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Cookie Types We Use:
                  </h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start gap-3">
                      <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Essential Cookies:</strong> Required for basic
                        site functionality (authentication, security,
                        preferences)
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Settings className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Functional Cookies:</strong> Enhance user
                        experience (language preferences, form data)
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Cookie className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Analytics Cookies:</strong> Help us understand
                        how visitors interact with our website
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAccept}
                  className="bg-[#011F72] hover:bg-blue-700 text-white px-6 py-2 rounded-[10px] font-medium"
                >
                  Accept All Cookies
                </Button>
                <Button
                  onClick={handleReject}
                  variant="outline"
                  className="border-gray-300 text-white hover:bg-gray-50 px-6 py-2 rounded-[10px] font-medium"
                >
                  Reject Non-Essential
                </Button>
                <Button
                  onClick={() => setShowDetails(!showDetails)}
                  variant="ghost"
                  className="text-gray-300 hover:text-gray-800 px-6 py-2 rounded-[10px] font-medium"
                >
                  {showDetails ? "Hide Details" : "Learn More"}
                </Button>
              </div>

              <p className="text-xs text-gray-200 mt-3">
                You can change your cookie preferences at any time in our{" "}
                <a
                  href="/privacy-policy"
                  className="text-[#011F72] hover:underline"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
