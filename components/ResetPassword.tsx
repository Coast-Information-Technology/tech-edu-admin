"use client";

import { Eye, EyeOff, Lock, CheckCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/lib/apiFetch";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
  });
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    capital: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const router = useRouter();

  const toggleVisibility = (field: "showPassword" | "showConfirmPassword") => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    // Live password criteria update
    if (name === "password") {
      setPasswordCriteria({
        length: value.length >= 8,
        capital: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }

    // Live confirm password validation — even after first letter
    if (
      name === "confirmPassword" ||
      (name === "password" && updatedFormData.confirmPassword)
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword:
          updatedFormData.confirmPassword &&
          updatedFormData.confirmPassword !== updatedFormData.password
            ? "Passwords do not match."
            : "",
      }));
    }

    // Clear error for current field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else {
      const password = formData.password;
      if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long.";
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password =
          "Password must contain at least one capital letter.";
      } else if (!/[a-z]/.test(password)) {
        newErrors.password =
          "Password must contain at least one lowercase letter.";
      } else if (!/[0-9]/.test(password)) {
        newErrors.password = "Password must contain at least one number.";
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        newErrors.password =
          "Password must contain at least one special character (!@#$%^&*(),.?&quot;:{}|&lt;&gt;)";
      }
    }

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        await handleResetPassword();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResetPassword = async () => {
    try {
      const { data, status, message } = await resetPassword(formData.password);
      toast.success(
        "Password reset successfully! You can now log in with your new password."
      );
      setIsPasswordReset(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    }
  };

  // Show success screen after password reset
  if (isPasswordReset) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[url('/assets/authImg.jpg')] bg-cover bg-no-repeat bg-center text-gray-900 py-6 px-4 md:px-20">
        <div className="w-full max-w-md bg-white rounded-[10px] shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Password Reset Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your password has been updated. You can now log in with your new
              password.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4 mb-6">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-medium text-blue-900 mb-1">
                  Security Note:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your new password is now active</li>
                  <li>• All other devices will be logged out</li>
                  <li>• Use your new password to log in</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-[#011F72] text-white py-3 rounded-[10px] font-medium hover:bg-blue-700 text-center"
            >
              Go to Login
            </Link>

            <Link
              href="/"
              className="block w-full text-center text-[#011F72] hover:underline font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center min-[1240px]:justify-between bg-[url('/assets/authImg.jpg')] bg-cover bg-no-repeat bg-center text-gray-900 py-6 px-4 md:px-20">
      {/* Left Side */}
      <div className="hidden min-[1240px]:block lg:w-1/2 text-white space-y-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-4 w-full bg-blue-700 text-white py-2 rounded-[10px] font-semibold hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-[#011F72] transition"
        >
          ← Go Back
        </button>
        <h2 className="text-lg md:text-xl font-bold max-w-md">
          Create a new secure password
        </h2>

        <div className="relative max-w-md rounded-[10px] h-[250px]">
          <Image
            src="/assets/authImage.webp"
            alt="Decoration"
            fill
            className="object-cover w-full rounded-[10px]"
            priority
          />
        </div>

        <h3 className="text-lg font-semibold text-white mt-8">
          Password Security
        </h3>
        <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-6 rounded-[15px]">
          <h3 className="text-md font-semibold mb-2 text-white">
            Tips for a strong password:
          </h3>
          <ul className="list-disc list-inside text-sm text-white font-normal">
            <li>Use at least 8 characters</li>
            <li>Include uppercase and lowercase letters</li>
            <li>Add numbers and special characters</li>
            <li>Avoid common words or phrases</li>
            <li>Don't reuse passwords from other accounts</li>
          </ul>
        </div>

        <p className="text-sm font-medium pt-12">
          Keep your account secure with a strong password.
        </p>
      </div>

      {/* Right Side */}
      <div className="w-full max-w-[35rem] bg-gray-100 py-8 px-8 md:px-16 rounded-[15px] rounded-bl-[8rem] shadow-lg mt-10 lg:mt-0">
        <div className="flex items-center justify-center h-[80vh]">
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-1 text-[#003294]">
                Reset Your Password
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Create a new secure password for your account. Make sure it's
                strong and unique.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type={formData.showPassword ? "text" : "password"}
                    name="password"
                    placeholder="New Password"
                    aria-label="New Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-[10px] pr-10 focus:ring-2 focus:ring-[#011F72]"
                    required
                    aria-required
                  />
                  <div
                    className="absolute top-2 right-3 cursor-pointer"
                    onClick={() => toggleVisibility("showPassword")}
                  >
                    {formData.showPassword ? <EyeOff /> : <Eye />}
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-sm">{errors.password}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Password must contain:
                  </p>
                  <ul
                    role="list"
                    className="flex flex-wrap gap-2 mt-2 text-[10px]"
                  >
                    <li
                      role="listitem"
                      className={`rounded-full px-2 py-1 min-w-[160px] text-center ${
                        passwordCriteria.length
                          ? "bg-green-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      At least 8 characters
                    </li>
                    <li
                      role="listitem"
                      className={`rounded-full px-2 py-1 min-w-[160px] text-center ${
                        passwordCriteria.capital
                          ? "bg-green-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      At least one capital letter
                    </li>
                    <li
                      role="listitem"
                      className={`rounded-full px-2 py-1 min-w-[160px] text-center ${
                        passwordCriteria.lowercase
                          ? "bg-green-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      At least one lowercase letter
                    </li>
                    <li
                      role="listitem"
                      className={`rounded-full px-2 py-1 min-w-[160px] text-center ${
                        passwordCriteria.number
                          ? "bg-green-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      At least one number
                    </li>
                    <li
                      role="listitem"
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

                <div className="relative">
                  <input
                    type={formData.showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    aria-label="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-[10px] pr-10 focus:ring-2 focus:ring-[#011F72]"
                    required
                    aria-required
                  />
                  <div
                    className="absolute top-2 right-3 cursor-pointer"
                    onClick={() => toggleVisibility("showConfirmPassword")}
                  >
                    {formData.showConfirmPassword ? <EyeOff /> : <Eye />}
                  </div>
                  {formData.confirmPassword && errors.confirmPassword && (
                    <p className="text-red-600 text-sm">
                      {errors.confirmPassword}
                    </p>
                  )}

                  {formData.confirmPassword &&
                    !errors.confirmPassword &&
                    formData.password === formData.confirmPassword && (
                      <p className="text-green-500 text-sm mt-1">
                        Password match
                      </p>
                    )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-700 text-white py-2 rounded-[10px] font-semibold hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-[#011F72] flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  )}
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
