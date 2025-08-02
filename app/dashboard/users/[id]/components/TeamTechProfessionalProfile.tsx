"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Code,
  Target,
  Calendar,
  Award,
  Globe,
  UserCheck,
  Clock,
} from "lucide-react";

interface TeamTechProfessionalProfileProps {
  profile: any;
}

export default function TeamTechProfessionalProfile({
  profile,
}: TeamTechProfessionalProfileProps) {
  if (!profile) {
    return (
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Team Tech Professional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 bg-green-50 rounded-lg border-2 border-dashed border-green-300">
            <Users className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <h4 className="font-semibold text-green-700 mb-2">
              Team Tech Professional Profile Not Created
            </h4>
            <p className="text-sm text-green-600 mb-4">
              This team tech professional hasn't completed their detailed
              profile setup yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Team Tech Professional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Team Information */}
        <div>
          <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.teamName && (
              <div>
                <p className="text-sm font-medium text-gray-700">Team Name</p>
                <p className="text-sm text-gray-900">{profile.teamName}</p>
              </div>
            )}
            {profile.teamSize && (
              <div>
                <p className="text-sm font-medium text-gray-700">Team Size</p>
                <p className="text-sm text-gray-900">
                  {profile.teamSize} members
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
            {profile.contactPhone && (
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Contact Phone
                </p>
                <p className="text-sm text-gray-900">{profile.contactPhone}</p>
              </div>
            )}
            {profile.trainingAvailability && (
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Training Availability
                </p>
                <p className="text-sm text-gray-900">
                  {profile.trainingAvailability}
                </p>
              </div>
            )}
            {profile.teamAcknowledged !== undefined && (
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Team Acknowledged
                </p>
                <Badge
                  variant={profile.teamAcknowledged ? "default" : "secondary"}
                  className="capitalize"
                >
                  {profile.teamAcknowledged ? "Yes" : "No"}
                </Badge>
              </div>
            )}
          </div>
        </div>

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

        {/* Location Information */}
        {profile.location && (
          <div>
            <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profile.location.city && (
                <div>
                  <p className="text-sm font-medium text-gray-700">City</p>
                  <p className="text-sm text-gray-900">
                    {profile.location.city}
                  </p>
                </div>
              )}
              {profile.location.state && (
                <div>
                  <p className="text-sm font-medium text-gray-700">State</p>
                  <p className="text-sm text-gray-900">
                    {profile.location.state}
                  </p>
                </div>
              )}
              {profile.location.country && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Country</p>
                  <p className="text-sm text-gray-900">
                    {profile.location.country}
                  </p>
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
              <Users className="w-5 h-5" />
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
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Looking for Jobs: {profile.lookingForJobs ? "Yes" : "No"}
                </span>
              </div>
            )}
            {profile.interestedInTraining !== undefined && (
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Interested in Training:{" "}
                  {profile.interestedInTraining ? "Yes" : "No"}
                </span>
              </div>
            )}
            {profile.availableAsInstructor !== undefined && (
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-gray-500" />
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
            {profile.remoteWorkExperience !== undefined && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Remote Work Experience:{" "}
                  {profile.remoteWorkExperience ? "Yes" : "No"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Learning Goals */}
        {profile.learningGoals && (
          <div>
            <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Learning Goals
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
              {profile.learningGoals.goalType && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Goal Type</p>
                  <p className="text-sm text-gray-900">
                    {profile.learningGoals.goalType}
                  </p>
                </div>
              )}
              {profile.learningGoals.trainingTimeline && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Training Timeline
                  </p>
                  <p className="text-sm text-gray-900">
                    {profile.learningGoals.trainingTimeline}
                  </p>
                </div>
              )}
              {profile.learningGoals.priorityAreas &&
                profile.learningGoals.priorityAreas.length > 0 && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Priority Areas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.learningGoals.priorityAreas.map(
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
            </div>
          </div>
        )}

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

        {/* Team Members */}
        {profile.members && profile.members.length > 0 && (
          <div>
            <h4 className="font-semibold text-[#011F72] mb-3 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Members ({profile.members.length})
            </h4>
            <div className="space-y-3">
              {profile.members.map((member: any, index: number) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {member.role || "Team Member"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Status: {member.status}
                        </p>
                      </div>
                    </div>
                    {member.invitedAt && (
                      <div className="text-xs text-gray-500">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(member.invitedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
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

        {/* Onboarding Status */}
        {profile.onboardingStatus && (
          <div>
            <h4 className="font-semibold text-[#011F72] mb-2">
              Onboarding Status
            </h4>
            <Badge
              variant={
                profile.onboardingStatus === "completed"
                  ? "default"
                  : "secondary"
              }
              className="capitalize"
            >
              {profile.onboardingStatus}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
