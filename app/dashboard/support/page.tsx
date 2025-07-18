"use client";

import React, { useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  Mail,
  Phone,
  HelpCircle,
  FileText,
  Video,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Briefcase,
  GraduationCap,
  Building2,
} from "lucide-react";

export default function SupportPage() {
  const { userRole } = useRole();
  const [selectedCategory, setSelectedCategory] = useState("general");

  // General FAQ for all roles
  const generalFAQ = [
    {
      question: "How do I update my profile information?",
      answer:
        "Go to your profile page and click the edit button to modify your information.",
      category: "account",
    },
    {
      question: "How can I change my password?",
      answer:
        "Visit the Settings page and use the 'Change Password' section to update your password.",
      category: "account",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can reach our support team through email, phone, or by submitting a ticket through this page.",
      category: "contact",
    },
  ];

  // Role-specific FAQ
  const roleFAQ = {
    student: [
      {
        question: "How do I apply for scholarships?",
        answer:
          "Navigate to the scholarship section and follow the application process outlined there.",
        category: "scholarships",
      },
      {
        question: "How can I track my course progress?",
        answer:
          "Visit your courses page to see detailed progress tracking for all enrolled courses.",
        category: "courses",
      },
    ],
    individualTechProfessional: [
      {
        question: "How do I update my CV?",
        answer:
          "Use the CV Builder tool to create and update your professional CV.",
        category: "cv",
      },
      {
        question: "How can I apply for jobs?",
        answer:
          "Browse the job board and click 'Apply' on any position that interests you.",
        category: "jobs",
      },
    ],
    recruiter: [
      {
        question: "How do I post a new job?",
        answer:
          "Go to 'Post a Job' in your dashboard and fill out the job posting form.",
        category: "jobs",
      },
      {
        question: "How can I search for candidates?",
        answer:
          "Use the 'Search Talent' feature to browse and filter candidate profiles.",
        category: "recruitment",
      },
    ],
    institution: [
      {
        question: "How do I manage student enrollments?",
        answer:
          "Use the 'Manage Students' section to view and manage student enrollments.",
        category: "students",
      },
      {
        question: "How can I create new courses?",
        answer:
          "Navigate to the Courses section and use the course creation tools.",
        category: "courses",
      },
    ],
  };

  const supportCategories = [
    {
      id: "general",
      label: "General",
      icon: <HelpCircle className="h-4 w-4" />,
    },
    {
      id: "technical",
      label: "Technical",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: "billing",
      label: "Billing",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      id: "feature",
      label: "Feature Request",
      icon: <AlertCircle className="h-4 w-4" />,
    },
  ];

  const contactMethods = [
    {
      title: "Email Support",
      description: "Get help via email within 24 hours",
      icon: <Mail className="h-6 w-6" />,
      action: "support@techedusolution.com",
      type: "email",
    },
    {
      title: "Phone Support",
      description: "Speak with our support team",
      icon: <Phone className="h-6 w-6" />,
      action: "+1 (555) 123-4567",
      type: "phone",
    },
    {
      title: "Live Chat",
      description: "Chat with support in real-time",
      icon: <MessageCircle className="h-6 w-6" />,
      action: "Start Chat",
      type: "chat",
    },
  ];

  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      student: "Student",
      individualTechProfessional: "Tech Professional",
      recruiter: "Recruiter",
      institution: "Institution",
    };
    return roleNames[role] || "User";
  };

  const getRoleIcon = (role: string) => {
    const icons: Record<string, React.ReactNode> = {
      student: <GraduationCap className="h-6 w-6" />,
      individualTechProfessional: <Briefcase className="h-6 w-6" />,
      recruiter: <Users className="h-6 w-6" />,
      institution: <Building2 className="h-6 w-6" />,
    };
    return icons[role] || <HelpCircle className="h-6 w-6" />;
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Support & Help
        </h1>
        <p className="text-gray-600">
          Get help and support tailored for {getRoleDisplayName(userRole)}s
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactMethods.map((method) => (
          <Card
            key={method.title}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="text-blue-600">{method.icon}</div>
                <div>
                  <CardTitle className="text-lg">{method.title}</CardTitle>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full rounded-[10px]">
                {method.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              General FAQ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generalFAQ.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h4>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Role-Specific FAQ */}
        {roleFAQ[userRole as keyof typeof roleFAQ] && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getRoleIcon(userRole)}
                {getRoleDisplayName(userRole)}-Specific FAQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roleFAQ[userRole as keyof typeof roleFAQ].map((faq, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Support Ticket Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submit a Support Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {supportCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={
                      selectedCategory === category.id
                        ? " text-white hover:text-black rounded-[10px]"
                        : "flex items-center gap-2 rounded-[10px]"
                    }
                  >
                    {category.icon}
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <Input
                placeholder="Brief description of your issue"
                className="rounded-[10px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <Textarea
                placeholder="Please describe your issue in detail..."
                rows={4}
                className="rounded-[10px]"
              />
            </div>
            <Button className="w-full rounded-[10px] text-white hover:text-black">
              <MessageCircle className="h-4 w-4 mr-2" />
              Submit Ticket
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Help */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Help</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start rounded-[10px]">
              <Video className="h-4 w-4 mr-2" />
              Watch Tutorial Videos
            </Button>
            <Button variant="outline" className="justify-start rounded-[10px]">
              <BookOpen className="h-4 w-4 mr-2" />
              Read Documentation
            </Button>
            <Button variant="outline" className="justify-start rounded-[10px]">
              <Users className="h-4 w-4 mr-2" />
              Community Forum
            </Button>
            <Button variant="outline" className="justify-start rounded-[10px]">
              <Clock className="h-4 w-4 mr-2" />
              Check Status Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
