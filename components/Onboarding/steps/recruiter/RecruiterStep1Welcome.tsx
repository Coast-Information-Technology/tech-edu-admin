import React from "react";
import { CheckCircle, Users, Briefcase, Globe, Target } from "lucide-react";

interface RecruiterStep1WelcomeProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export default function RecruiterStep1Welcome({
  form,
  errors,
  handleChange,
}: RecruiterStep1WelcomeProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-blue-100 p-4 rounded-full">
            <Users className="w-12 h-12 text-blue-700" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900">
          Welcome to Tech Edu Recruiter Portal
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We're excited to partner with you for talent acquisition. Our platform
          connects you with top tech professionals and provides powerful
          recruitment tools to streamline your hiring process.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-blue-50 p-6 rounded-[10px] border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-6 h-6 text-blue-700" />
            <h4 className="font-semibold text-blue-900">Smart Matching</h4>
          </div>
          <p className="text-sm text-blue-800">
            AI-powered candidate matching based on your specific requirements
            and company culture.
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-[10px] border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <Briefcase className="w-6 h-6 text-green-700" />
            <h4 className="font-semibold text-green-900">Job Posting Tools</h4>
          </div>
          <p className="text-sm text-green-800">
            Create compelling job postings and manage applications through our
            intuitive dashboard.
          </p>
        </div>

        <div className="bg-purple-50 p-6 rounded-[10px] border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-6 h-6 text-purple-700" />
            <h4 className="font-semibold text-purple-900">
              Global Talent Pool
            </h4>
          </div>
          <p className="text-sm text-purple-800">
            Access a diverse pool of tech professionals from around the world,
            including remote workers.
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
            Track hiring metrics, candidate engagement, and recruitment
            performance with detailed analytics.
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
            <span>Your personal and company information</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Hiring focus areas and preferred regions</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Terms and conditions agreement</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Create your first job posting</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
