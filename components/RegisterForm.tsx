// @/components/RegisterForm.tsx

"use client";

import { Eye, EyeOff, Mail, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  registerUser,
  UserRegistrationData,
  postApiRequest,
  resendVerificationEmail,
} from "@/lib/apiFetch";
import { toast } from "react-toastify";

const Page = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student"; // default fallback
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formData, setFormData] = useState<
    UserRegistrationData & {
      confirmPassword: string;
      showPassword: boolean;
      showConfirmPassword: boolean;
    }
  >({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    role: role, // default from query param
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
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const router = useRouter();

  const toggleVisibility = (field: "showPassword" | "showConfirmPassword") => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    // Clear error for current field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

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
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName?.trim()) newErrors.fullName = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address.";

    // Role validation
    if (!formData.role) newErrors.role = "Please select a role.";

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
        await handleRegister(formData);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRegister = async (
    formData: UserRegistrationData & {
      confirmPassword: string;
      showPassword: boolean;
      showConfirmPassword: boolean;
    }
  ) => {
    try {
      const { data, status, message } = await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      // Show success message and verification notice
      toast.success(
        "Registration successful! Please check your email to verify your account."
      );
      setIsVerificationSent(true);
    } catch (error: any) {
      // Handle the backend error structure with error.details array
      if (error?.error?.details && Array.isArray(error.error.details)) {
        toast.error(error.error.details.join(", "));
      } else if (error?.details && Array.isArray(error.details)) {
        toast.error(error.details.join(", "));
      } else {
        toast.error(error.message || "Registration failed");
      }
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      const response = await resendVerificationEmail(formData.email);

      if (response.status >= 400) {
        throw new Error("Failed to resend verification email");
      }

      toast.success("Verification email sent! Please check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  const handleGoogleLogin = (e?: React.MouseEvent) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setIsGoogleLoading(true);
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
    } catch (error) {
      toast.error("Failed to initiate Google login");
      setIsGoogleLoading(false);
    }
  };

  // Show verification sent screen
  if (isVerificationSent) {
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
              We've sent a verification link to{" "}
              <strong>{formData.email}</strong>
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-medium text-blue-900 mb-1">Next Steps:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Check your email inbox</li>
                  <li>• Click the verification link</li>
                  <li>• Return here to log in</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full flex items-center justify-center gap-2 bg-[#011F72] text-white py-3 rounded-[10px] font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isResending ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Resend Verification Email
                </>
              )}
            </button>

            <button
              onClick={() => setIsVerificationSent(false)}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-[10px] font-medium hover:bg-gray-50"
            >
              Back to Registration
            </button>

            <Link
              href="/login"
              className="block w-full text-center text-[#011F72] hover:underline font-medium"
            >
              Already verified? Log in
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
          className="mt-4 bg-white hover:bg-blue-500 text-[#003294] text-left p-2 mb-6 rounded-[10px] hidden min-[1240px]:block"
        >
          ← Go Back
        </button>
        <h2 className="text-lg md:text-xl font-bold max-w-md">
          Access all admin and management tools with one secure account.
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
          Why Register as Admin, Instructor, Moderator, or Customer Care?
        </h3>
        <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-6 rounded-[15px]">
          <h3 className="text-md font-semibold mb-2 text-white">Benefits</h3>
          <ul className="list-disc list-inside text-sm text-white font-normal">
            <li>Manage users, products, and company data</li>
            <li>Oversee platform analytics and reports</li>
            <li>Moderate content and user activity</li>
            <li>Provide customer support and resolve issues</li>
            <li>Assign roles and permissions</li>
            <li>Access advanced dashboard features</li>
            <li>Track and manage payments and orders</li>
            <li>Collaborate with other team members</li>
          </ul>
        </div>

        <p className="text-sm font-medium pt-12">
          One login. All tools. Seamless experience.
        </p>
      </div>

      {/* Right Side */}
      <div className="w-full max-w-[35rem] bg-gray-100 py-8 px-8 md:px-16 rounded-[15px] rounded-bl-[8rem] shadow-lg mt-10 lg:mt-0">
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-4 bg-[#003294] hover:bg-blue-500 text-white text-left p-2 mb-6 rounded-[10px] block min-[1240px]:hidden"
        >
          ← Go Back
        </button>
        <h2 className="text-2xl font-bold mb-1 text-[#003294]">
          Start Your Journey as a Tech Edu Admin or Team Member
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Register to manage users, products, analytics, and more. Unified
          access for admins, instructors, moderators, and customer care
          representatives.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full name"
              aria-label="Full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-[10px] focus:ring-2 focus:ring-[#011F72]"
              required
              aria-required
            />
            {errors.fullName && (
              <p className="text-red-600 text-sm">{errors.fullName}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              aria-label="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-[10px] focus:ring-2 focus:ring-[#011F72]"
              required
              aria-required
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={formData.showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              aria-label="Password"
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
            <p className="text-xs text-gray-500 mt-1">Password must contain:</p>
            <ul role="list" className="flex flex-wrap gap-2 mt-2 text-[10px]">
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
              placeholder="Confirm Password"
              aria-label="Confirm Password"
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
              <p className="text-red-600 text-sm">{errors.confirmPassword}</p>
            )}

            {formData.confirmPassword &&
              !errors.confirmPassword &&
              formData.password === formData.confirmPassword && (
                <p className="text-green-500 text-sm mt-1">Password match</p>
              )}
          </div>

          <div className="relative">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-[10px] focus:ring-2 focus:ring-[#011F72] appearance-none bg-white"
              required
              aria-required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="instructor">Instructor</option>
              <option value="moderator">Moderator</option>
              <option value="customerCare">Customer Care Representative</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {errors.role && (
              <p className="text-red-600 text-sm mt-1">{errors.role}</p>
            )}
          </div>

          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" required />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="underline text-[#011F72]">
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline text-[#011F72]">
                Privacy Policy
              </Link>
            </span>
          </label>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-[10px] font-semibold hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-[#011F72] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          <div className="w-full flex items-center justify-center gap-4">
            <span className="w-28 h-[2px] rounded-[10px] bg-gray-600"></span>
            <div className="text-center text-sm text-gray-600 py-2">
              or continue
            </div>
            <span className="w-28 h-[2px] rounded-[10px] bg-gray-600"></span>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 py-2 rounded-[10px] text-gray-700 hover:bg-gray-200"
            aria-label="Login with Google"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
          >
            <Image
              src="/icons/search.png"
              height={30}
              width={30}
              alt="Google"
              className="w-5 h-5"
            />
            {isGoogleLoading ? "Redirecting..." : "Register with Google"}
          </button>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 py-2 rounded-[10px] text-gray-700 hover:bg-gray-200"
            aria-label="Login with LinkedIn"
            disabled={isLoading || isGoogleLoading}
          >
            <Image
              src="/icons/linkedin.png"
              height={30}
              width={30}
              alt="LinkedIn"
              className="w-5 h-5"
            />
            Register with LinkedIn
          </button>

          <p className="text-[1rem] text-center py-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[#003294] font-bold underline">
              Log in here
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Page;
