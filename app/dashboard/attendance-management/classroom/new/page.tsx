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
  Plus,
  X,
  Building2,
} from "lucide-react";
import Link from "next/link";

interface Participant {
  participantType: string;
  platformRole: string;
  email: string;
  fullName: string;
}

interface ClassroomAttendanceForm {
  classroomId: string;
  productType: string;
  ledBy: string;
  scheduleAt: string;
  endAt: string;
  durationInMinutes: number;
  title: string;
  bookerType: string;
  bookerPlatformRole: string;
  bookerEmail: string;
  bookerFullName: string;
  participants: Participant[];
  numberOfExpectedParticipants: number;
}

const PRODUCT_TYPE_OPTIONS = [
  "Training & Certification",
  "Academic Support Services",
  "Career Development & Mentorship",
  "Institutional & Team Services",
  "AI-Powered or Automation Services",
  "Career Connect",
  "Marketing, Consultation & Free Services",
];

const BOOKER_TYPE_OPTIONS = ["individual", "team", "organization"];
const PLATFORM_ROLE_OPTIONS = [
  "student",
  "instructor",
  "admin",
  "coordinator",
  "teamTechProfessional",
];
const PARTICIPANT_TYPE_OPTIONS = ["individual", "team"];

export default function CreateClassroomAttendancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [instructors, setInstructors] = useState<
    Array<{ _id: string; fullName: string; email: string }>
  >([]);
  const [instructorsLoading, setInstructorsLoading] = useState(false);
  const [form, setForm] = useState<ClassroomAttendanceForm>({
    classroomId: "",
    productType: "",
    ledBy: "",
    scheduleAt: "",
    endAt: "",
    durationInMinutes: 120,
    title: "",
    bookerType: "team",
    bookerPlatformRole: "teamTechProfessional",
    bookerEmail: "",
    bookerFullName: "",
    participants: [
      {
        participantType: "team",
        platformRole: "teamTechProfessional",
        email: "",
        fullName: "",
      },
    ],
    numberOfExpectedParticipants: 5,
  });

  // Fetch instructors on component mount
  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    setInstructorsLoading(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const response = await getApiRequest("/api/users?role=instructor", token);

      if (response?.data?.success) {
        const instructorData =
          response.data.data?.users || response.data.users || [];
        setInstructors(instructorData);
      } else {
        console.error("Failed to fetch instructors:", response?.data?.message);
      }
    } catch (err: any) {
      console.error("Error fetching instructors:", err);
    } finally {
      setInstructorsLoading(false);
    }
  };

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

  const addParticipant = () => {
    setForm((prev) => ({
      ...prev,
      participants: [
        ...prev.participants,
        {
          participantType: "team",
          platformRole: "teamTechProfessional",
          email: "",
          fullName: "",
        },
      ],
    }));
  };

  const removeParticipant = (index: number) => {
    setForm((prev) => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index),
    }));
  };

  const updateParticipant = (
    index: number,
    field: keyof Participant,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      participants: prev.participants.map((participant, i) =>
        i === index ? { ...participant, [field]: value } : participant
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !form.classroomId ||
      !form.productType ||
      !form.ledBy ||
      !form.scheduleAt ||
      !form.endAt ||
      !form.title ||
      !form.bookerEmail ||
      !form.bookerFullName
    ) {
      setError("Please fill all required fields.");
      return;
    }

    // Validate participants
    const hasEmptyParticipants = form.participants.some(
      (p) => !p.email || !p.fullName
    );
    if (hasEmptyParticipants) {
      setError("Please fill all participant details.");
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
        classroomId: form.classroomId,
        productType: form.productType,
        ledBy: form.ledBy,
        scheduleAt: form.scheduleAt,
        endAt: form.endAt,
        durationInMinutes: form.durationInMinutes,
        title: form.title,
        bookerType: form.bookerType,
        bookerPlatformRole: form.bookerPlatformRole,
        bookerEmail: form.bookerEmail,
        bookerFullName: form.bookerFullName,
        participants: form.participants,
        numberOfExpectedParticipants: form.numberOfExpectedParticipants,
      };

      console.log("Creating classroom attendance with payload:", payload);

      const response = await postApiRequest(
        "/api/classroom-attendance",
        token,
        payload
      );
      console.log("Classroom attendance creation response:", response);

      if (response?.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/attendance-management");
        }, 2000);
      } else {
        setError(
          response?.data?.message || "Failed to create classroom attendance"
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to create classroom attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard/attendance-management">
              <button className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create Classroom Session Attendance
              </h1>
              <p className="text-slate-600">
                Set up a new classroom attendance record for in-person sessions
              </p>
            </div>
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
                Classroom attendance created successfully. Redirecting...
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Classroom Session Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Classroom Session Details
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Classroom ID *
                </label>
                <input
                  type="text"
                  name="classroomId"
                  value={form.classroomId}
                  onChange={handleChange}
                  placeholder="Enter classroom ID"
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Product Type *
                </label>
                <select
                  name="productType"
                  value={form.productType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select product type</option>
                  {PRODUCT_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Led By (Instructor) *
                </label>
                <select
                  name="ledBy"
                  value={form.ledBy}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  required
                  disabled={instructorsLoading}
                >
                  <option value="">
                    {instructorsLoading
                      ? "Loading instructors..."
                      : "Select instructor"}
                  </option>
                  {instructors.map((instructor) => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.fullName} ({instructor.email})
                    </option>
                  ))}
                </select>
                {instructorsLoading && (
                  <div className="text-blue-600 text-sm bg-blue-50 p-3 rounded-xl border border-blue-200 mt-2">
                    Loading instructors...
                  </div>
                )}
                {!instructorsLoading && instructors.length === 0 && (
                  <div className="text-slate-500 text-sm bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2">
                    No instructors found
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g., TrainingProgram | Data Science Fundamentals – 2025-08-01 10:00-12:00"
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Schedule</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
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
                  name="durationInMinutes"
                  value={form.durationInMinutes}
                  onChange={handleNumberChange}
                  min="1"
                  placeholder="120"
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* Booker Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Booker Information
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Booker Type
                </label>
                <select
                  name="bookerType"
                  value={form.bookerType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                >
                  {BOOKER_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Platform Role
                </label>
                <select
                  name="bookerPlatformRole"
                  value={form.bookerPlatformRole}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                >
                  {PLATFORM_ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Booker Email *
                </label>
                <input
                  type="email"
                  name="bookerEmail"
                  value={form.bookerEmail}
                  onChange={handleChange}
                  placeholder="Enter booker email"
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Booker Full Name *
                </label>
                <input
                  type="text"
                  name="bookerFullName"
                  value={form.bookerFullName}
                  onChange={handleChange}
                  placeholder="Enter booker full name"
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2 md:gap-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Participants
                </h2>
              </div>
              <button
                type="button"
                onClick={addParticipant}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Participant
              </button>
            </div>

            <div className="space-y-6">
              {form.participants.map((participant, index) => (
                <div
                  key={index}
                  className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-slate-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Participant {index + 1}
                    </h3>
                    {form.participants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeParticipant(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-all duration-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                        className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                      >
                        {PARTICIPANT_TYPE_OPTIONS.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                        className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                      >
                        {PLATFORM_ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={participant.email}
                        onChange={(e) =>
                          updateParticipant(index, "email", e.target.value)
                        }
                        placeholder="Enter participant email"
                        className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={participant.fullName}
                        onChange={(e) =>
                          updateParticipant(index, "fullName", e.target.value)
                        }
                        placeholder="Enter participant full name"
                        className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Number of Expected Participants
              </label>
              <input
                type="number"
                name="numberOfExpectedParticipants"
                value={form.numberOfExpectedParticipants}
                onChange={handleNumberChange}
                min="1"
                placeholder="5"
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Create Classroom Attendance
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
