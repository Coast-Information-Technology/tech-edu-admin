// @/components/ForgotPassword.tsx

"use client";

import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/lib/apiFetch";
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);

    // Clear error for email field
    setErrors((prev) => ({
      ...prev,
      email: "",
    }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        await handleForgotPassword();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleForgotPassword = async () => {
    try {
      const { data, status, message } = await forgotPassword(email);
      toast.success("Password reset email sent! Please check your inbox.");
      setIsEmailSent(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    }
  };

  // Show success screen after email is sent
  if (isEmailSent) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[url('/assets/authImg.jpg')] bg-cover bg-no-repeat bg-center text-gray-900 py-6 px-4 md:px-20">
        <div className="w-full max-w-md bg-white rounded-[10px] shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4 mb-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-medium text-blue-900 mb-1">Next Steps:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Check your email inbox</li>
                  <li>• Click the password reset link</li>
                  <li>• Create a new password</li>
                  <li>• Return here to log in</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setIsEmailSent(false)}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-[10px] font-medium hover:bg-gray-50"
            >
              Send to Different Email
            </button>

            <Link
              href="/login"
              className="block w-full text-center text-[#011F72] hover:underline font-medium"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center min-[1240px]:justify-between bg-[url('/assets/authImg.jpg')] bg-cover bg-no-repeat bg-center text-gray-900 py-6 px-4 md:px-20">
      {/* Left Side */}
      <div className="hidden lg:block min-[1240px]:w-1/2 text-white space-y-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-4 w-full bg-blue-700 text-white py-2 rounded-[10px] font-semibold hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-[#011F72] transition"
        >
          ← Go Back
        </button>
        <h2 className="text-lg md:text-xl font-bold max-w-md">
          Forgot your password? No worries!
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
          Password Reset Process
        </h3>
        <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-6 rounded-[15px]">
          <h3 className="text-md font-semibold mb-2 text-white">
            How it works:
          </h3>
          <ul className="list-disc list-inside text-sm text-white font-normal">
            <li>Enter your email address</li>
            <li>We'll send you a secure reset link</li>
            <li>Click the link in your email</li>
            <li>Create a new password</li>
            <li>Log in with your new password</li>
          </ul>
        </div>

        <p className="text-sm font-medium pt-12">
          Secure and simple password recovery.
        </p>
      </div>

      {/* Right Side */}
      <div className="w-full max-w-[35rem] h-[90vh] bg-gray-100 py-8 px-8 md:px-16 rounded-[15px] rounded-bl-[8rem] shadow-lg mt-10 lg:mt-0">
        <div className="flex items-center justify-center h-[80vh]">
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-1 text-[#003294]">
                Reset Your Password
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  aria-label="Email"
                  value={email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-[10px] focus:ring-2 focus:ring-[#011F72]"
                  required
                  aria-required
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email}</p>
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
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>

              <div className="text-center pt-4">
                <Link
                  href="/login"
                  className="text-[#003294] hover:underline font-medium flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
