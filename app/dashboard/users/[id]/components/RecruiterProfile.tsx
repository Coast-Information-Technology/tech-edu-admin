"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Target, Mail, Phone, ExternalLink } from "lucide-react";

interface RecruiterProfileProps {
  profile: any;
}

export default function RecruiterProfile({ profile }: RecruiterProfileProps) {
  if (!profile) {
    return (
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Recruitment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 bg-orange-50 rounded-lg border-2 border-dashed border-orange-300">
            <Target className="w-12 h-12 text-orange-400 mx-auto mb-3" />
            <h4 className="font-semibold text-orange-700 mb-2">
              Recruiter Profile Not Created
            </h4>
            <p className="text-sm text-orange-600 mb-4">
              This recruiter hasn't completed their detailed profile setup yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Recruitment Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Information */}
        {profile.company && (
          <div>
            <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Company Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Company Name
                </p>
                <p className="text-sm text-gray-900">{profile.company.name}</p>
              </div>
              {profile.company.industry && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Industry</p>
                  <p className="text-sm text-gray-900">
                    {profile.company.industry}
                  </p>
                </div>
              )}
              {profile.company.website && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Website</p>
                  <a
                    href={profile.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                  >
                    {profile.company.website}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {profile.company.location && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Location</p>
                  <p className="text-sm text-gray-900">
                    {profile.company.location.city},{" "}
                    {profile.company.location.state},{" "}
                    {profile.company.location.country}
                  </p>
                </div>
              )}
              {profile.company.contactPerson && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Contact Person
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-900">
                      Email: {profile.company.contactPerson.email}
                    </p>
                    <p className="text-sm text-gray-900">
                      Phone: {profile.company.contactPerson.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recruitment Details */}
        <div>
          <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Recruitment Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.positionAtCompany && (
              <div>
                <p className="text-sm font-medium text-gray-700">Position</p>
                <p className="text-sm text-gray-900">
                  {profile.positionAtCompany}
                </p>
              </div>
            )}
            {profile.contactEmail && (
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Contact Email
                </p>
                <p className="text-sm text-gray-900">{profile.contactEmail}</p>
              </div>
            )}
            {profile.phoneNumber && (
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Phone Number
                </p>
                <p className="text-sm text-gray-900">{profile.phoneNumber}</p>
              </div>
            )}
            {profile.preferredContactMethod && (
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Preferred Contact
                </p>
                <p className="text-sm text-gray-900 capitalize">
                  {profile.preferredContactMethod}
                </p>
              </div>
            )}
            {profile.preferredHiringModel && (
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Hiring Model
                </p>
                <p className="text-sm text-gray-900 capitalize">
                  {profile.preferredHiringModel}
                </p>
              </div>
            )}
            {profile.verificationStatus && (
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Verification Status
                </p>
                <Badge
                  variant={
                    profile.verificationStatus === "verified"
                      ? "default"
                      : "secondary"
                  }
                  className="capitalize"
                >
                  {profile.verificationStatus}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Hiring Regions */}
        {profile.hiringRegions && profile.hiringRegions.length > 0 && (
          <div>
            <h4 className="font-semibold text-[#011F72] mb-2">
              Hiring Regions
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.hiringRegions.map((region: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {region}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recruitment Focus Areas */}
        {profile.recruitmentFocusAreas &&
          profile.recruitmentFocusAreas.length > 0 && (
            <div>
              <h4 className="font-semibold text-[#011F72] mb-2">
                Recruitment Focus Areas
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.recruitmentFocusAreas.map(
                  (area: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 text-xs"
                    >
                      {area}
                    </Badge>
                  )
                )}
              </div>
            </div>
          )}

        {/* Referral Information */}
        {profile.referralSource && (
          <div>
            <h4 className="font-semibold text-[#011F72] mb-2">
              Referral Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Referral Source
                </p>
                <p className="text-sm text-gray-900">
                  {profile.referralSource}
                </p>
              </div>
              {profile.referralCodeOrName && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Referral Code/Name
                  </p>
                  <p className="text-sm text-gray-900">
                    {profile.referralCodeOrName}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
