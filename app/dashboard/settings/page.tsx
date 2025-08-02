"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";
import { patchApiRequest, postApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { Eye, EyeOff } from "lucide-react";
import ThemeToggle from "@/utils/ThemeToggle";

export default function SettingsPage() {
  // State for password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  // Password criteria state
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    capital: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  // State for notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // State for account actions
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Handle password input changes with real-time validation
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "currentPassword") {
      setCurrentPassword(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
      // Update password criteria in real-time
      setPasswordCriteria({
        length: value.length >= 8,
        capital: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const validatePassword = () => {
    const errors: string[] = [];

    if (!newPassword) {
      errors.push("New password is required.");
    } else {
      if (newPassword.length < 8) {
        errors.push("Password must be at least 8 characters long.");
      }
      if (!/[A-Z]/.test(newPassword)) {
        errors.push("Password must contain at least one capital letter.");
      }
      if (!/[a-z]/.test(newPassword)) {
        errors.push("Password must contain at least one lowercase letter.");
      }
      if (!/[0-9]/.test(newPassword)) {
        errors.push("Password must contain at least one number.");
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
        errors.push(
          'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'
        );
      }
    }

    if (!confirmPassword) {
      errors.push("Please confirm your password.");
    } else if (newPassword !== confirmPassword) {
      errors.push("Passwords do not match.");
    }

    if (currentPassword === newPassword) {
      errors.push("New password must be different from current password.");
    }

    return errors;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChanging(true);

    const validationErrors = validatePassword();
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      setIsChanging(false);
      return;
    }

    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        setIsChanging(false);
        return;
      }

      const response = await patchApiRequest(
        "/api/users/me/change-password",
        token,
        {
          oldPassword: currentPassword,
          newPassword: newPassword,
        }
      );

      if (response.status < 400) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordCriteria({
          length: false,
          capital: false,
          lowercase: false,
          number: false,
          specialChar: false,
        });
        setPasswordChanged(true);
        setTimeout(() => setPasswordChanged(false), 2000);
      } else {
        const errorMessage =
          response.message ||
          (response as any).error?.details?.[0] ||
          "Failed to change password.";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Password change error:", error);
      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        "Failed to change password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsChanging(false);
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                placeholder="Current Password"
                value={currentPassword}
                onChange={handlePasswordChange}
                required
                className="rounded-[10px] pr-10"
                disabled={isChanging}
              />
              <div
                className="absolute top-2.5 right-3 cursor-pointer text-gray-600"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                placeholder="New Password"
                value={newPassword}
                onChange={handlePasswordChange}
                required
                className="rounded-[10px] pr-10"
                disabled={isChanging}
              />
              <div
                className="absolute top-2.5 right-3 cursor-pointer text-gray-600"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>

              {/* Password Criteria Display */}
              {newPassword && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">
                    Password must contain:
                  </p>
                  <ul className="flex flex-wrap gap-2 text-[10px]">
                    <li
                      className={`rounded-full px-2 py-1 min-w-[160px] text-center ${
                        passwordCriteria.length
                          ? "bg-green-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      At least 8 characters
                    </li>
                    <li
                      className={`rounded-full px-2 py-1 min-w-[160px] text-center ${
                        passwordCriteria.capital
                          ? "bg-green-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      At least one capital letter
                    </li>
                    <li
                      className={`rounded-full px-2 py-1 min-w-[160px] text-center ${
                        passwordCriteria.lowercase
                          ? "bg-green-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      At least one lowercase letter
                    </li>
                    <li
                      className={`rounded-full px-2 py-1 min-w-[160px] text-center ${
                        passwordCriteria.number
                          ? "bg-green-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      At least one number
                    </li>
                    <li
                      className={`rounded-full px-2 py-1 min-w-[160px] text-center ${
                        passwordCriteria.specialChar
                          ? "bg-green-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      At least one special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={handlePasswordChange}
                required
                className="rounded-[10px] pr-10"
                disabled={isChanging}
              />
              <div
                className="absolute top-2.5 right-3 cursor-pointer text-gray-600"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="mt-1">
                  {newPassword === confirmPassword ? (
                    <p className="text-green-500 text-sm">Password match</p>
                  ) : (
                    <p className="text-red-500 text-sm">
                      Passwords do not match
                    </p>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={
                isChanging ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                !passwordCriteria.length ||
                !passwordCriteria.capital ||
                !passwordCriteria.lowercase ||
                !passwordCriteria.number ||
                !passwordCriteria.specialChar ||
                newPassword !== confirmPassword
              }
              className="w-full text-white hover:bg-blue-500 rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {passwordChanged
                ? "Password changed successfully!"
                : isChanging
                ? "Changing Password..."
                : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>SMS Notifications</span>
              <Switch
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
