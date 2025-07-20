"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Home,
  ArrowLeft,
  Search,
  BookOpen,
  Users,
  Briefcase,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 mt-20 pb-10">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo and Navigation */}
        {/* <div className="mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/assets/techedusolution.jpg"
              alt="Tech Edu Solution Logo"
              width={120}
              height={120}
              className="rounded-[10px] shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
          </Link>
        </div> */}

        {/* Main Content */}
        <div className="relative">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-200 rounded-full opacity-30 animate-bounce"></div>
            <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-purple-200 rounded-full opacity-25 animate-ping"></div>
          </div>

          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The page you're looking for seems to have wandered off into the
              digital wilderness. Don't worry, we'll help you find your way back
              to amazing tech education content!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              size="lg"
              className="group hover:bg-gray-50 transition-colors rounded-[10px]"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </Button>
            <Link href="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-white shadow-lg hover:shadow-xl rounded-[10px]"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Need help? Contact our support team at{" "}
            <a
              href="mailto:support@techedu.com"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              support@techedu.com
            </a>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="fixed top-10 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-10 animate-spin"></div>
        <div className="fixed bottom-10 right-10 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 animate-pulse"></div>
      </div>
    </div>
  );
}
