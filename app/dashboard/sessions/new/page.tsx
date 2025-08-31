"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { postApiRequest, getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle,
  Video,
  FileText,
  MapPin,
  Settings,
  GraduationCap,
  Users2,
} from "lucide-react";
import Link from "next/link";

interface SessionForm {
  bookingId: string;
  productId: string;
  productType: string;
  bookingPurpose: string;
  instructorId: string;
  scheduleAt: string;
  endAt: string;
  minutesPerSession: number;
  numberOfExpectedParticipants: number;
  meetingLink: string;
  sessionType: "group" | "1-on-1";
  status: "upcoming";
  userNotes: string;
  internalNotes: string;
  participants: Array<{
    participantType: string;
    platformRole: string;
    profileId?: string;
    email: string;
    fullName: string;
  }>;
}

interface Product {
  _id: string;
  title: string;
  productSubcategoryName: string;
  price: number;
}

interface Booking {
  _id: string;
  bookingPurpose: string;
  productId: {
    title: string;
    productSubcategoryName: string;
  };
  instructorId: {
    fullName: string;
    email: string;
  };
  scheduleAt: string;
  numberOfExpectedParticipants: number;
}

const SESSION_TYPE_OPTIONS = ["1-on-1", "Group"];

export default function CreateSessionPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const [form, setForm] = useState<SessionForm>({
    bookingId: "",
    productId: "",
    productType: "Academic Support Services", // Default for academic
    bookingPurpose: "",
    instructorId: "",
    scheduleAt: "",
    endAt: "",
    minutesPerSession: 60,
    numberOfExpectedParticipants: 1,
    meetingLink: "",
    sessionType: "1-on-1",
    status: "upcoming",
    userNotes: "",
    internalNotes: "",
    participants: [],
  });

  // Participant management functions
  const addParticipant = () => {
    const newParticipant = {
      participantType: "individual",
      platformRole: "student",
      profileId: "",
      email: "",
      fullName: "",
    };
    setForm((prev) => ({
      ...prev,
      participants: [...prev.participants, newParticipant],
    }));
  };

  const removeParticipant = (index: number) => {
    setForm((prev) => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index),
    }));
  };

  const updateParticipant = (index: number, field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      participants: prev.participants.map((participant, i) =>
        i === index ? { ...participant, [field]: value } : participant
      ),
    }));
  };

  // Fetch product subcategories by type
  const fetchProductSubcategories = async (productType: string) => {
    setProductsLoading(true);
    try {
      const response = await getApiRequest(
        `/api/product-subcategories/type/${encodeURIComponent(productType)}`
      );
      if (response?.data?.success) {
        const subcategories = response.data.data || [];
        setProducts(subcategories);
      }
    } catch (err: any) {
      console.error("Error fetching product subcategories:", err);
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch bookings for group sessions
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const token = getTokenFromCookies();
      if (!token) return;

      const response = await getApiRequest("/api/bookings/admin/all", token);
      if (response?.data?.success) {
        const allBookings = response.data.data || [];
        const trainingBookings = allBookings.filter(
          (booking: any) => booking.productType === "Training & Certification"
        );
        setBookings(trainingBookings);
      }
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductSubcategories(form.productType);
    fetchBookings();
  }, [form.productType]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    setForm((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(form.productType && form.productId && form.bookingPurpose);
      case 2:
        return !!(form.scheduleAt && form.endAt && form.minutesPerSession > 0);
      case 3:
        return !!(form.sessionType && form.numberOfExpectedParticipants > 0);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      setError("Please fill all required fields in the current step.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const payload = {
        bookingId: form.bookingId,
        productId: form.productId,
        productType: form.productType,
        bookingPurpose: form.bookingPurpose,
        instructorId: form.instructorId,
        scheduleAt: form.scheduleAt,
        endAt: form.endAt,
        minutesPerSession: form.minutesPerSession,
        numberOfExpectedParticipants: form.numberOfExpectedParticipants,
        meetingLink: form.meetingLink,
        sessionType: form.sessionType as "group" | "1-on-1",
        status: "upcoming",
        userNotes: form.userNotes,
        internalNotes: form.internalNotes,
        participants: form.participants,
      };

      const response = await postApiRequest("/api/sessions", token, payload);

      if (response?.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/sessions");
        }, 2000);
      } else {
        setError(response?.data?.message || "Failed to create session");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Session Details", icon: BookOpen },
    { number: 2, title: "Schedule", icon: Calendar },
    { number: 3, title: "Configuration", icon: Settings },
    { number: 4, title: "Review", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard/sessions">
              <button className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Session
              </h1>
              <p className="text-slate-600">
                Set up a new mentoring or training session
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? "bg-blue-600 border-blue-600 text-white"
                        : isCompleted
                        ? "bg-green-600 border-green-600 text-white"
                        : "bg-white border-slate-300 text-slate-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-2 transition-all duration-300 ${
                        isCompleted ? "bg-green-600" : "bg-slate-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Success!</h3>
              <p className="text-green-700">
                Session created successfully. Redirecting...
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Session Details */}
          {currentStep === 1 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Session Details
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Product Type Selection */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Product Type *
                  </label>
                  <select
                    name="productType"
                    value={form.productType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select Product Type</option>
                    <option value="Academic Support Services">
                      Academic Support Services
                    </option>
                    <option value="Training & Certification">
                      Training & Certification
                    </option>
                    <option value="Career Development">
                      Career Development
                    </option>
                    <option value="Technical Skills">Technical Skills</option>
                  </select>
                </div>

                {/* Product Selection */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Product/Service *
                  </label>
                  <select
                    name="productId"
                    value={form.productId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                    required
                    disabled={productsLoading}
                  >
                    <option value="">
                      {productsLoading
                        ? "Loading products..."
                        : "Select a product or service"}
                    </option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.productSubcategoryName} - ${product.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Booking Selection (Optional) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Associated Booking (Optional)
                  </label>
                  <select
                    name="bookingId"
                    value={form.bookingId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                    disabled={bookingsLoading}
                  >
                    <option value="">No booking associated</option>
                    {bookings.map((booking) => (
                      <option key={booking._id} value={booking._id}>
                        {booking.productId.productSubcategoryName} -{" "}
                        {booking.instructorId.fullName} (
                        {new Date(booking.scheduleAt).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Session Purpose *
                  </label>
                  <textarea
                    name="bookingPurpose"
                    value={form.bookingPurpose}
                    onChange={handleChange}
                    placeholder="Describe the purpose of this session"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Schedule */}
          {currentStep === 2 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Schedule</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduleAt"
                    value={form.scheduleAt}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="endAt"
                    value={form.endAt}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    name="minutesPerSession"
                    value={form.minutesPerSession}
                    onChange={handleNumberChange}
                    min="1"
                    placeholder="60"
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Meeting Link
                  </label>
                  <input
                    type="url"
                    name="meetingLink"
                    value={form.meetingLink}
                    onChange={handleChange}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Configuration */}
          {currentStep === 3 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Configuration
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Session Type *
                  </label>
                  <select
                    name="sessionType"
                    value={form.sessionType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                    required
                  >
                    {SESSION_TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Expected Participants *
                  </label>
                  <input
                    type="number"
                    name="numberOfExpectedParticipants"
                    value={form.numberOfExpectedParticipants}
                    onChange={handleNumberChange}
                    min="1"
                    placeholder="1"
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    User Notes
                  </label>
                  <textarea
                    name="userNotes"
                    value={form.userNotes}
                    onChange={handleChange}
                    placeholder="Notes for participants"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>

                {/* Participant Management */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-semibold text-slate-700">
                      Participants
                    </label>
                    <button
                      type="button"
                      onClick={addParticipant}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 text-sm"
                    >
                      + Add Participant
                    </button>
                  </div>

                  {form.participants.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">
                      <Users className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                      <p>No participants added yet</p>
                      <p className="text-sm">
                        Click "Add Participant" to get started
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {form.participants.map((participant, index) => (
                        <div
                          key={index}
                          className="border border-slate-200 rounded-2xl p-4 bg-white/50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-slate-700">
                              Participant {index + 1}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeParticipant(index)}
                              className="text-red-500 hover:text-red-700 transition-colors duration-300"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">
                                Participant Type
                              </label>
                              <select
                                value={participant.participantType}
                                onChange={(e) =>
                                  updateParticipant(
                                    index,
                                    "participantType",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="individual">Individual</option>
                                <option value="team">Team</option>
                                <option value="institution">Institution</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">
                                Platform Role
                              </label>
                              <select
                                value={participant.platformRole}
                                onChange={(e) =>
                                  updateParticipant(
                                    index,
                                    "platformRole",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="student">Student</option>
                                <option value="individualTechProfessional">
                                  Tech Professional
                                </option>
                                <option value="teamTechProfessional">
                                  Team Tech Professional
                                </option>
                                <option value="recruiter">Recruiter</option>
                                <option value="institution">Institution</option>
                                <option value="admin">Admin</option>
                                <option value="visitor">Visitor</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                value={participant.fullName}
                                onChange={(e) =>
                                  updateParticipant(
                                    index,
                                    "fullName",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter full name"
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">
                                Email *
                              </label>
                              <input
                                type="email"
                                value={participant.email}
                                onChange={(e) =>
                                  updateParticipant(
                                    index,
                                    "email",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter email address"
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Internal Notes
                  </label>
                  <textarea
                    name="internalNotes"
                    value={form.internalNotes}
                    onChange={handleChange}
                    placeholder="Internal notes for instructors"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Review & Submit
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      Session Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Booking ID:</span>{" "}
                        {form.bookingId}
                      </div>
                      <div>
                        <span className="font-medium">Product ID:</span>{" "}
                        {form.productId}
                      </div>
                      <div>
                        <span className="font-medium">Product Type:</span>{" "}
                        {form.productType}
                      </div>
                      <div>
                        <span className="font-medium">Purpose:</span>{" "}
                        {form.bookingPurpose}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      Schedule
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Start:</span>{" "}
                        {form.scheduleAt
                          ? new Date(form.scheduleAt).toLocaleString()
                          : "Not set"}
                      </div>
                      <div>
                        <span className="font-medium">End:</span>{" "}
                        {form.endAt
                          ? new Date(form.endAt).toLocaleString()
                          : "Not set"}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>{" "}
                        {form.minutesPerSession} minutes
                      </div>
                      {form.meetingLink && (
                        <div>
                          <span className="font-medium">Meeting Link:</span>{" "}
                          {form.meetingLink}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      Configuration
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Session Type:</span>{" "}
                        {form.sessionType}
                      </div>
                      <div>
                        <span className="font-medium">Participants:</span>{" "}
                        {form.numberOfExpectedParticipants}
                      </div>
                      {form.userNotes && (
                        <div>
                          <span className="font-medium">User Notes:</span>{" "}
                          {form.userNotes}
                        </div>
                      )}
                      {form.internalNotes && (
                        <div>
                          <span className="font-medium">Internal Notes:</span>{" "}
                          {form.internalNotes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                Previous
              </button>

              <div className="flex gap-4">
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!validateStep(currentStep)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !validateStep(currentStep)}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Create Session
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
