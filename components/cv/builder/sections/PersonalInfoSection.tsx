"use client";

import { useRef } from "react";
import { PersonalInfo } from "@/types/cv";
import RichTextEditor from "./RichTextEditor";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Github,
  Twitter,
  Instagram,
  Camera,
  Trash2,
} from "lucide-react";

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo;
  onUpdatePersonalInfo: (updates: Partial<PersonalInfo>) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  sectionConfig?: any; // Template configuration passed from DynamicSectionRenderer
}

export default function PersonalInfoSection({
  personalInfo,
  onUpdatePersonalInfo,
  onImageUpload,
  onRemoveImage,
  sectionConfig,
}: PersonalInfoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if image upload should be hidden for specific templates
  const shouldHideImageUpload = () => {
    console.log("PersonalInfoSection - sectionConfig:", sectionConfig);
    console.log("PersonalInfoSection - sectionConfig.id:", sectionConfig?.id);

    if (!sectionConfig?.id) return false;

    // Hide image upload for Two Column and Minimal templates
    const templatesWithoutImage = ["two-column", "minimal"];
    const shouldHide = templatesWithoutImage.includes(sectionConfig.id);
    console.log("PersonalInfoSection - shouldHide:", shouldHide);
    return shouldHide;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      {/* <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tell us about yourself and how to reach you
        </p>
      </div> */}

      {/* Profile Photo Section - Hidden for Two Column and Minimal templates */}
      {!shouldHideImageUpload() ? (
        <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative group">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                {personalInfo.image ? (
                  <img
                    src={personalInfo.image}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-[12px] transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="text-center">
                    <User className="h-12 w-12 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Add Photo
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute -bottom-2 -right-2 flex space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onImageUpload}
                    className="hidden"
                  />
                  <Camera className="h-5 w-5" />
                </button>

                {personalInfo.image && (
                  <button
                    onClick={onRemoveImage}
                    className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Profile Photo
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upload a professional photo (JPG, PNG, max 5MB)
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <User className="h-4 w-4" />
            <span>First Name</span>
          </label>
          <input
            type="text"
            value={personalInfo.firstName}
            onChange={(e) =>
              onUpdatePersonalInfo({ firstName: e.target.value })
            }
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-200 shadow-sm hover:shadow-md"
            placeholder="Enter your first name"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <User className="h-4 w-4" />
            <span>Last Name</span>
          </label>
          <input
            type="text"
            value={personalInfo.lastName}
            onChange={(e) => onUpdatePersonalInfo({ lastName: e.target.value })}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-200 shadow-sm hover:shadow-md"
            placeholder="Enter your last name"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <User className="h-4 w-4" />
            <span>Targeted Job Title</span>
          </label>
          <input
            type="text"
            value={personalInfo.targetedJobTitle}
            onChange={(e) =>
              onUpdatePersonalInfo({ targetedJobTitle: e.target.value })
            }
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-200 shadow-sm hover:shadow-md"
            placeholder="e.g., Senior Frontend Developer, Product Manager"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <User className="h-4 w-4" />
            <span>Industry Sector</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              (For AI suggestions only)
            </span>
          </label>
          <select
            value={personalInfo.industry || ""}
            onChange={(e) => onUpdatePersonalInfo({ industry: e.target.value })}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <option value="">Select your industry</option>

            {/* Existing */}
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail</option>
            <option value="Consulting">Consulting</option>
            <option value="Government">Government</option>
            <option value="Non-profit">Non-profit</option>
            <option value="Other">Other</option>

            {/* Added */}
            <option value="Agriculture">Agriculture</option>
            <option value="Aerospace & Defense">Aerospace & Defense</option>
            <option value="Automotive">Automotive</option>
            <option value="Biotechnology & Pharmaceuticals">
              Biotechnology & Pharmaceuticals
            </option>
            <option value="Chemicals">Chemicals</option>
            <option value="Construction">Construction</option>
            <option value="Consumer Goods (CPG)">Consumer Goods (CPG)</option>
            <option value="Design & Creative">Design & Creative</option>
            <option value="E-commerce">E-commerce</option>
            <option value="Energy & Utilities">Energy & Utilities</option>
            <option value="Entertainment & Media">Entertainment & Media</option>
            <option value="Environmental Services">
              Environmental Services
            </option>
            <option value="Fashion & Apparel">Fashion & Apparel</option>
            <option value="Food & Beverage">Food & Beverage</option>
            <option value="Gaming">Gaming</option>
            <option value="Hospitality & Travel">Hospitality & Travel</option>
            <option value="Insurance">Insurance</option>
            <option value="Legal Services">Legal Services</option>
            <option value="Logistics & Supply Chain">
              Logistics & Supply Chain
            </option>
            <option value="Marketing & Advertising">
              Marketing & Advertising
            </option>
            <option value="Mining & Metals">Mining & Metals</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Sports & Recreation">Sports & Recreation</option>
            <option value="Telecommunications">Telecommunications</option>
            <option value="Transportation">Transportation</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Research & Development">
              Research & Development
            </option>
            <option value="Information Services">Information Services</option>
          </select>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
          <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span>Contact Information</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Mail className="h-4 w-4" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => onUpdatePersonalInfo({ email: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Phone className="h-4 w-4" />
              <span>Phone Number</span>
            </label>
            <input
              type="tel"
              value={personalInfo.phone || ""}
              onChange={(e) => onUpdatePersonalInfo({ phone: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </label>
            <input
              type="text"
              value={personalInfo.location || ""}
              onChange={(e) =>
                onUpdatePersonalInfo({ location: e.target.value })
              }
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder="City, State/Country"
            />
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
          <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span>Social Media & Links</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Linkedin className="h-4 w-4 text-blue-600" />
              <span>LinkedIn</span>
            </label>
            <input
              type="text"
              value={personalInfo.linkedin || ""}
              onChange={(e) =>
                onUpdatePersonalInfo({ linkedin: e.target.value })
              }
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder="yourusername"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Github className="h-4 w-4 text-gray-900 dark:text-white" />
              <span>GitHub</span>
            </label>
            <input
              type="text"
              value={personalInfo.github || ""}
              onChange={(e) => onUpdatePersonalInfo({ github: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder="yourusername"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Twitter className="h-4 w-4 text-blue-400" />
              <span>Twitter/X</span>
            </label>
            <input
              type="text"
              value={personalInfo.twitter || ""}
              onChange={(e) =>
                onUpdatePersonalInfo({ twitter: e.target.value })
              }
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder="yourusername"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Instagram className="h-4 w-4 text-pink-500" />
              <span>Instagram</span>
            </label>
            <input
              type="text"
              value={personalInfo.instagram || ""}
              onChange={(e) =>
                onUpdatePersonalInfo({ instagram: e.target.value })
              }
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder="yourusername"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Globe className="h-4 w-4 text-green-600" />
              <span>Personal Website</span>
            </label>
            <input
              type="text"
              value={personalInfo.website || ""}
              onChange={(e) =>
                onUpdatePersonalInfo({ website: e.target.value })
              }
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder="yourwebsite.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
