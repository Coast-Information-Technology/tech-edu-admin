"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Clock,
  Award,
  Play,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Users,
  Star,
  Download,
  MessageSquare,
  Calendar,
  Target,
  FileText,
  Video,
  Book,
  CheckCircle2,
  Circle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Lesson {
  id: number;
  title: string;
  type: "video" | "reading" | "quiz" | "assignment";
  duration: string;
  completed: boolean;
  description: string;
}

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  completed: boolean;
}

const mockCourseData = {
  id: 1,
  title: "Strategic Thinking for Teams",
  description: "Build critical thinking habits and structured decision-making.",
  duration: "2 Months",
  certificate: true,
  image: "/assets/courses.webp",
  category: "Career",
  level: "Intermediate",
  progress: 65,
  instructor: "Dr. Sarah Johnson",
  rating: 4.8,
  totalStudents: 1247,
  lastUpdated: "2024-01-15",
  modules: [
    {
      id: 1,
      title: "Introduction to Strategic Thinking",
      description:
        "Learn the fundamentals of strategic thinking and decision-making frameworks.",
      completed: true,
      lessons: [
        {
          id: 1,
          title: "Welcome to the Course",
          type: "video",
          duration: "5 min",
          completed: true,
          description: "Course overview and learning objectives",
        },
        {
          id: 2,
          title: "What is Strategic Thinking?",
          type: "video",
          duration: "12 min",
          completed: true,
          description: "Understanding the core concepts",
        },
        {
          id: 3,
          title: "Strategic Thinking Quiz",
          type: "quiz",
          duration: "10 min",
          completed: true,
          description: "Test your understanding",
        },
      ],
    },
    {
      id: 2,
      title: "Decision-Making Frameworks",
      description: "Explore proven frameworks for making better decisions.",
      completed: false,
      lessons: [
        {
          id: 4,
          title: "SWOT Analysis",
          type: "video",
          duration: "15 min",
          completed: true,
          description: "Strengths, Weaknesses, Opportunities, Threats",
        },
        {
          id: 5,
          title: "SWOT Analysis Practice",
          type: "assignment",
          duration: "30 min",
          completed: true,
          description: "Apply SWOT to a real scenario",
        },
        {
          id: 6,
          title: "Decision Trees",
          type: "video",
          duration: "18 min",
          completed: false,
          description: "Visual decision-making tool",
        },
        {
          id: 7,
          title: "Decision Trees Assignment",
          type: "assignment",
          duration: "45 min",
          completed: false,
          description: "Create your own decision tree",
        },
      ],
    },
    {
      id: 3,
      title: "Team Strategy Development",
      description: "Learn how to develop and implement team strategies.",
      completed: false,
      lessons: [
        {
          id: 8,
          title: "Team Strategy Fundamentals",
          type: "video",
          duration: "20 min",
          completed: false,
          description: "Building effective team strategies",
        },
        {
          id: 9,
          title: "Strategy Implementation",
          type: "reading",
          duration: "25 min",
          completed: false,
          description: "Best practices for implementation",
        },
        {
          id: 10,
          title: "Final Project",
          type: "assignment",
          duration: "2 hours",
          completed: false,
          description: "Develop a comprehensive team strategy",
        },
      ],
    },
  ],
};

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [activeModule, setActiveModule] = useState(1);
  const [activeLesson, setActiveLesson] = useState(6); // Next incomplete lesson
  const course = mockCourseData;

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "reading":
        return <Book className="w-4 h-4" />;
      case "quiz":
        return <FileText className="w-4 h-4" />;
      case "assignment":
        return <Target className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getLessonColor = (type: string) => {
    switch (type) {
      case "video":
        return "text-blue-600";
      case "reading":
        return "text-green-600";
      case "quiz":
        return "text-purple-600";
      case "assignment":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const totalLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );
  const completedLessons = course.modules.reduce(
    (acc, module) =>
      acc + module.lessons.filter((lesson) => lesson.completed).length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Back to Courses Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/courses">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>
        </Button>
      </div>

      {/* Course Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="aspect-video relative">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-blue-600 text-white">
                {course.category}
              </Badge>
              <Badge className="bg-gray-600 text-white">{course.level}</Badge>
              {course.certificate && (
                <Badge className="bg-yellow-600 text-white">
                  <Award className="w-3 h-3 mr-1" />
                  Certificate
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-200 mb-4">{course.description}</p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{course.totalStudents} students</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{course.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Updated {course.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Course Progress</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {course.progress}%
                </p>
              </div>
            </div>
            <Progress value={course.progress} className="h-2 mb-2" />
            <p className="text-sm text-gray-600">
              {completedLessons} of {totalLessons} lessons completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-[10px]">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Instructor</p>
                <p className="text-lg font-semibold text-[#011F72]">
                  {course.instructor}
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Instructor
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Certificate</p>
                <p className="text-lg font-semibold text-[#011F72]">
                  {course.certificate ? "Available" : "Not Available"}
                </p>
              </div>
            </div>
            {course.certificate && (
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Certificate
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Modules */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {course.modules.map((module) => (
                  <div key={module.id} className="border rounded-[10px]">
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => setActiveModule(module.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {module.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <h3 className="font-semibold text-[#011F72]">
                              Module {module.id}: {module.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {module.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    {activeModule === module.id && (
                      <div className="border-t bg-gray-50">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-white ${
                              activeLesson === lesson.id ? "bg-blue-50" : ""
                            }`}
                            onClick={() => setActiveLesson(lesson.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`${getLessonColor(lesson.type)}`}>
                                {getLessonIcon(lesson.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">
                                    {lesson.title}
                                  </h4>
                                  {lesson.completed && (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">
                                  {lesson.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{lesson.duration}</span>
                                <Play className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Lesson */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Current Lesson</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const currentModule = course.modules.find(
                  (m) => m.id === activeModule
                );
                const currentLesson = currentModule?.lessons.find(
                  (l) => l.id === activeLesson
                );

                if (!currentLesson) return <p>No lesson selected</p>;

                return (
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-[10px] flex items-center justify-center">
                      <div className="text-center">
                        <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Video Player</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#011F72] mb-2">
                        {currentLesson.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {currentLesson.description}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          {getLessonIcon(currentLesson.type)}
                          {currentLesson.type.charAt(0).toUpperCase() +
                            currentLesson.type.slice(1)}
                        </span>
                        <span>•</span>
                        <span>{currentLesson.duration}</span>
                      </div>

                      <div className="space-y-2">
                        <Button className="w-full text-white hover:text-black">
                          <Play className="w-4 h-4 mr-2" />
                          {currentLesson.completed
                            ? "Replay Lesson"
                            : "Start Lesson"}
                        </Button>

                        {!currentLesson.completed && (
                          <Button variant="outline" className="w-full">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Complete
                          </Button>
                        )}

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
