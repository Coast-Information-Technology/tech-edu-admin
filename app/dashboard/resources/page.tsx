"use client";

import React from "react";
import { useRole } from "@/contexts/RoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  FileText,
  Video,
  Download,
  ExternalLink,
  Users,
  Briefcase,
  GraduationCap,
  Building2,
  Target,
  TrendingUp,
  Award,
  Calendar,
  Globe,
  Lightbulb,
} from "lucide-react";

export default function ResourcesPage() {
  const { userRole } = useRole();

  // General resources for all roles
  const generalResources = [
    {
      title: "Getting Started Guide",
      description: "Learn how to make the most of TechEdu Solution",
      icon: <BookOpen className="h-6 w-6" />,
      type: "guide",
      badge: "Essential",
    },
    {
      title: "Platform Tutorials",
      description: "Step-by-step video tutorials for all features",
      icon: <Video className="h-6 w-6" />,
      type: "video",
      badge: "New",
    },
    {
      title: "Best Practices",
      description: "Tips and tricks for optimal platform usage",
      icon: <Lightbulb className="h-6 w-6" />,
      type: "article",
    },
  ];

  // Role-specific resources
  const roleResources = {
    student: [
      {
        title: "Study Strategies",
        description: "Effective learning techniques and study plans",
        icon: <GraduationCap className="h-6 w-6" />,
        type: "guide",
      },
      {
        title: "Scholarship Application Guide",
        description: "Complete guide to applying for scholarships",
        icon: <Award className="h-6 w-6" />,
        type: "guide",
        badge: "Popular",
      },
      {
        title: "Career Planning Tools",
        description: "Resources to help plan your career path",
        icon: <Target className="h-6 w-6" />,
        type: "tool",
      },
    ],
    individualTechProfessional: [
      {
        title: "Professional Development",
        description: "Advanced career growth strategies",
        icon: <TrendingUp className="h-6 w-6" />,
        type: "guide",
      },
      {
        title: "Industry Insights",
        description: "Latest trends and insights in tech",
        icon: <Globe className="h-6 w-6" />,
        type: "article",
        badge: "Trending",
      },
      {
        title: "Skill Assessment Tools",
        description: "Evaluate and improve your technical skills",
        icon: <Target className="h-6 w-6" />,
        type: "tool",
      },
    ],
    recruiter: [
      {
        title: "Hiring Best Practices",
        description: "Effective recruitment strategies and tips",
        icon: <Users className="h-6 w-6" />,
        type: "guide",
        badge: "Essential",
      },
      {
        title: "Job Posting Templates",
        description: "Professional templates for job listings",
        icon: <FileText className="h-6 w-6" />,
        type: "template",
      },
      {
        title: "Interview Guidelines",
        description: "Structured interview processes and questions",
        icon: <Calendar className="h-6 w-6" />,
        type: "guide",
      },
    ],
    institution: [
      {
        title: "Student Management",
        description: "Tools and guides for managing student progress",
        icon: <Users className="h-6 w-6" />,
        type: "guide",
      },
      {
        title: "Course Development",
        description: "Resources for creating effective courses",
        icon: <BookOpen className="h-6 w-6" />,
        type: "guide",
      },
      {
        title: "Institutional Analytics",
        description: "Data-driven insights for institutions",
        icon: <TrendingUp className="h-6 w-6" />,
        type: "tool",
      },
    ],
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      student: "Student",
      individualTechProfessional: "Tech Professional",
      recruiter: "Recruiter",
      institution: "Institution",
    };
    return roleNames[role] || "User";
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      guide: "bg-blue-100 text-blue-800",
      video: "bg-purple-100 text-purple-800",
      article: "bg-green-100 text-green-800",
      tool: "bg-orange-100 text-orange-800",
      template: "bg-pink-100 text-pink-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const renderResourceCard = (resource: any) => (
    <Card key={resource.title} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-blue-600">{resource.icon}</div>
            <div>
              <CardTitle className="text-lg">{resource.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {resource.description}
              </p>
            </div>
          </div>
          {resource.badge && (
            <Badge variant="secondary" className="text-xs">
              {resource.badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge className={getTypeColor(resource.type)}>
            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Access
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources</h1>
        <p className="text-gray-600">
          Access curated resources and tools tailored for{" "}
          {getRoleDisplayName(userRole)}s
        </p>
      </div>

      {/* General Resources */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          General Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generalResources.map(renderResourceCard)}
        </div>
      </div>

      {/* Role-Specific Resources */}
      {roleResources[userRole as keyof typeof roleResources] && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {getRoleDisplayName(userRole)}-Specific Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roleResources[userRole as keyof typeof roleResources].map(
              renderResourceCard
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Browse All Resources
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Resource Pack
            </Button>
            <Button variant="outline">
              <Video className="h-4 w-4 mr-2" />
              Watch Tutorials
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
