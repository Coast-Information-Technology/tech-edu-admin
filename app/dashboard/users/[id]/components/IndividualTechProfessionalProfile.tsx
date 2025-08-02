"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  Calendar,
  Code,
  Award,
  Heart,
  Target,
  Globe,
} from "lucide-react";

interface IndividualTechProfessionalProfileProps {
  profile: any;
}

export default function IndividualTechProfessionalProfile({
  profile,
}: IndividualTechProfessionalProfileProps) {
  if (!profile) {
    return (
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Tech Professional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300">
            <Code className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <h4 className="font-semibold text-blue-700 mb-2">
              Tech Professional Profile Not Created
            </h4>
            <p className="text-sm text-blue-600 mb-4">
              This tech professional hasn't completed their detailed profile
              setup yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Tech Professional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Information */}
        <div>
          <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.fullName && (
              <div>
                <p className="text-sm font-medium text-gray-700">Full Name</p>
                <p className="text-sm text-gray-900">{profile.fullName}</p>
              </div>
            )}
            {profile.gender && (
              <div>
                <p className="text-sm font-medium text-gray-700">Gender</p>
                <p className="text-sm text-gray-900">{profile.gender}</p>
              </div>
            )}
            {profile.dateOfBirth && (
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Date of Birth
                </p>
                <p className="text-sm text-gray-900">
                  {new Date(profile.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            )}
            {profile.nationality && (
              <div>
                <p className="text-sm font-medium text-gray-700">Nationality</p>
                <p className="text-sm text-gray-900">{profile.nationality}</p>
              </div>
            )}
            {profile.currentLocation && (
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Current Location
                </p>
                <p className="text-sm text-gray-900">
                  {profile.currentLocation}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Academic Information */}
        {(profile.fieldOfStudy ||
          profile.highestQualification ||
          profile.graduationYear) && (
          <div>
            <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Academic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.fieldOfStudy && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Field of Study
                  </p>
                  <p className="text-sm text-gray-900">
                    {profile.fieldOfStudy}
                  </p>
                </div>
              )}
              {profile.highestQualification && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Highest Qualification
                  </p>
                  <p className="text-sm text-gray-900">
                    {profile.highestQualification}
                  </p>
                </div>
              )}
              {profile.graduationYear && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Graduation Year
                  </p>
                  <p className="text-sm text-gray-900">
                    {profile.graduationYear}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Professional Information */}
        {(profile.currentJobTitle ||
          profile.employmentStatus ||
          profile.yearsOfExperience ||
          profile.industryFocus) && (
          <div>
            <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Professional Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.currentJobTitle && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Current Job Title
                  </p>
                  <p className="text-sm text-gray-900">
                    {profile.currentJobTitle}
                  </p>
                </div>
              )}
              {profile.employmentStatus && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Employment Status
                  </p>
                  <p className="text-sm text-gray-900">
                    {profile.employmentStatus}
                  </p>
                </div>
              )}
              {profile.yearsOfExperience && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Years of Experience
                  </p>
                  <p className="text-sm text-gray-900">
                    {profile.yearsOfExperience} years
                  </p>
                </div>
              )}
              {profile.industryFocus && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Industry Focus
                  </p>
                  <p className="text-sm text-gray-900">
                    {profile.industryFocus}
                  </p>
                </div>
              )}
              {profile.primarySpecialization && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Primary Specialization
                  </p>
                  <p className="text-sm text-gray-900">
                    {profile.primarySpecialization}
                  </p>
                </div>
              )}
              {profile.remoteWorkExperience !== undefined && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Remote Work Experience
                  </p>
                  <Badge
                    variant={
                      profile.remoteWorkExperience ? "default" : "secondary"
                    }
                    className="capitalize"
                  >
                    {profile.remoteWorkExperience ? "Yes" : "No"}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Technical Skills */}
        {(profile.programmingLanguages?.length > 0 ||
          profile.frameworksAndTools?.length > 0 ||
          profile.preferredTechStack?.length > 0) && (
          <div>
            <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Technical Skills
            </h4>
            <div className="space-y-4">
              {profile.programmingLanguages &&
                profile.programmingLanguages.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Programming Languages
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.programmingLanguages.map(
                        (lang: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 text-xs"
                          >
                            {lang}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
              {profile.frameworksAndTools &&
                profile.frameworksAndTools.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Frameworks & Tools
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.frameworksAndTools.map(
                        (tool: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {tool}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
              {profile.preferredTechStack &&
                profile.preferredTechStack.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Preferred Tech Stack
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferredTechStack.map(
                        (tech: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-green-100 text-green-800 text-xs"
                          >
                            {tech}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Certifications */}
        {profile.certifications && profile.certifications.length > 0 && (
          <div>
            <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Certifications
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.certifications.map((cert: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 text-xs"
                >
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Soft Skills */}
        {profile.softSkills && profile.softSkills.length > 0 && (
          <div>
            <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Soft Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.softSkills.map((skill: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Professional Goals */}
        <div>
          <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Professional Goals
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.lookingForJobs !== undefined && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Looking for Jobs: {profile.lookingForJobs ? "Yes" : "No"}
                </span>
              </div>
            )}
            {profile.interestedInTraining !== undefined && (
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Interested in Training:{" "}
                  {profile.interestedInTraining ? "Yes" : "No"}
                </span>
              </div>
            )}
            {profile.availableAsInstructor !== undefined && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Available as Instructor:{" "}
                  {profile.availableAsInstructor ? "Yes" : "No"}
                </span>
              </div>
            )}
            {profile.skillAssessmentInterested !== undefined && (
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Skill Assessment Interested:{" "}
                  {profile.skillAssessmentInterested ? "Yes" : "No"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Platform Goals */}
        {profile.platformGoals && profile.platformGoals.length > 0 && (
          <div>
            <h4 className="font-semibold text-[#011F72] mb-2">
              Platform Goals
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.platformGoals.map((goal: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Additional Information */}
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
            </div>
          </div>
        )}

        {/* Additional Project Links */}
        {profile.additionalProjectLinks &&
          profile.additionalProjectLinks.length > 0 && (
            <div>
              <h4 className="font-semibold text-[#011F72] mb-2">
                Additional Project Links
              </h4>
              <div className="space-y-2">
                {profile.additionalProjectLinks.map(
                  (link: string, index: number) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline block"
                    >
                      {link}
                    </a>
                  )
                )}
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
