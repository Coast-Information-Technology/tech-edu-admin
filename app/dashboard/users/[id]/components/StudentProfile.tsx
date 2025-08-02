"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Calendar,
  Clock,
  Target,
  BookOpen,
  User,
  MapPin,
  Award,
} from "lucide-react";

interface StudentProfileProps {
  profile: any;
}

export default function StudentProfile({ profile }: StudentProfileProps) {
  if (!profile) {
    return (
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 bg-indigo-50 rounded-lg border-2 border-dashed border-indigo-300">
            <GraduationCap className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
            <h4 className="font-semibold text-indigo-700 mb-2">
              Student Profile Not Created
            </h4>
            <p className="text-sm text-indigo-600 mb-4">
              This student hasn't completed their detailed profile setup yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Student Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Academic Information */}
        <div>
          <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Academic Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.academicLevel && (
              <div>
                <p className="text-sm font-medium text-gray-700">Academic Level</p>
                <p className="text-sm text-gray-900">{profile.academicLevel}</p>
              </div>
            )}
            {profile.fieldOfStudy && (
              <div>
                <p className="text-sm font-medium text-gray-700">Field of Study</p>
                <p className="text-sm text-gray-900">{profile.fieldOfStudy}</p>
              </div>
            )}
            {profile.highestQualification && (
              <div>
                <p className="text-sm font-medium text-gray-700">Highest Qualification</p>
                <p className="text-sm text-gray-900">{profile.highestQualification}</p>
              </div>
            )}
            {profile.graduationYear && (
              <div>
                <p className="text-sm font-medium text-gray-700">Graduation Year</p>
                <p className="text-sm text-gray-900">{profile.graduationYear}</p>
              </div>
            )}
          </div>
        </div>

        {/* Interest Areas */}
        {profile.interestAreas && profile.interestAreas.length > 0 && (
          <div>
            <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Interest Areas
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.interestAreas.map((interest: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-indigo-100 text-indigo-800 text-xs"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Preferred Schedule */}
        {(profile.preferredDays?.length > 0 || profile.preferredTimeSlots?.length > 0) && (
          <div>
            <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Preferred Schedule
            </h4>
            <div className="space-y-4">
              {profile.preferredDays && profile.preferredDays.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Preferred Days</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredDays.map((day: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {profile.preferredTimeSlots && profile.preferredTimeSlots.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Preferred Time Slots</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredTimeSlots.map((time: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-green-100 text-green-800 text-xs capitalize"
                      >
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Referral Information */}
        {profile.referralSource && (
          <div>
            <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
              <User className="w-5 h-5" />
              Referral Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Referral Source</p>
                <p className="text-sm text-gray-900">{profile.referralSource}</p>
              </div>
              {profile.referralCodeOrName && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Referral Code/Name</p>
                  <p className="text-sm text-gray-900">{profile.referralCodeOrName}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Consent Information */}
        <div>
          <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Consent Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.agreeToTerms !== undefined && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-sm text-gray-600">
                  Agreed to Terms: {profile.agreeToTerms ? "Yes" : "No"}
                </span>
              </div>
            )}
            {profile.consentToStoreInfo !== undefined && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-sm text-gray-600">
                  Consent to Store Info: {profile.consentToStoreInfo ? "Yes" : "No"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Role Information */}
        {profile.role && (
          <div>
            <h4 className="font-semibold text-[#011F72] mb-2">Role Information</h4>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs capitalize">
              {profile.role}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 