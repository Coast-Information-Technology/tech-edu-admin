import React from "react";
import {
  CheckCircle,
  Building2,
  Users,
  GraduationCap,
  Globe,
} from "lucide-react";

interface Step1WelcomeProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export default function Step1Welcome({
  form,
  errors,
  handleChange,
}: Step1WelcomeProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-blue-100 p-4 rounded-full">
            <Building2 className="w-12 h-12 text-blue-700" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900">
          Welcome to Tech Edu Institutions Portal
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We're excited to partner with your institution to provide cutting-edge
          tech education and career opportunities for your students and
          professionals.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-blue-50 p-6 rounded-[10px] border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-6 h-6 text-blue-700" />
            <h4 className="font-semibold text-blue-900">Student Support</h4>
          </div>
          <p className="text-sm text-blue-800">
            Upload and manage your students' profiles for scholarships, training
            programs, and career opportunities.
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-[10px] border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <GraduationCap className="w-6 h-6 text-green-700" />
            <h4 className="font-semibold text-green-900">Training Programs</h4>
          </div>
          <p className="text-sm text-green-800">
            Access our comprehensive training catalog and certification programs
            for your institution.
          </p>
        </div>

        <div className="bg-purple-50 p-6 rounded-[10px] border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-6 h-6 text-purple-700" />
            <h4 className="font-semibold text-purple-900">Career Connect</h4>
          </div>
          <p className="text-sm text-purple-800">
            Connect your graduates with top employers and tech companies through
            our recruitment platform.
          </p>
        </div>

        <div className="bg-orange-50 p-6 rounded-[10px] border border-orange-200">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-orange-700" />
            <h4 className="font-semibold text-orange-900">
              Analytics & Insights
            </h4>
          </div>
          <p className="text-sm text-orange-800">
            Track your students' progress, placement rates, and institutional
            performance metrics.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-[10px] mt-6">
        <h4 className="font-semibold text-gray-900 mb-3">
          What to expect in this onboarding:
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Basic institution information and verification</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Academic focus areas and student support preferences</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Document upload for accreditation and compliance</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Team member and student invitation setup</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
