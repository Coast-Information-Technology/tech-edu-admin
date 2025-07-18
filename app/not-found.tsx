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

          {/* Quick Actions */}
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <Link href="/">
                <div className="group p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
                  <Home className="w-8 h-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-semibold text-gray-900 mb-2">Home</h3>
                  <p className="text-sm text-gray-600">Return to homepage</p>
                </div>
              </Link>

              <Link href="/training">
                <div className="group p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
                  <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-semibold text-gray-900 mb-2">Training</h3>
                  <p className="text-sm text-gray-600">Explore courses</p>
                </div>
              </Link>

              <Link href="/career-connect">
                <div className="group p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
                  <Briefcase className="w-8 h-8 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Career Connect
                  </h3>
                  <p className="text-sm text-gray-600">Find opportunities</p>
                </div>
              </Link>

              <Link href="/about">
                <div className="group p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-semibold text-gray-900 mb-2">About Us</h3>
                  <p className="text-sm text-gray-600">Learn more</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Search Section */}
          <div className="mb-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-400 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">
                Can't find what you're looking for?
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Try searching our platform or browse our popular sections below
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/training/catalog">
                <Button
                  variant="outline"
                  className="hover:bg-blue-50 hover:border-blue-300 transition-colors rounded-[10px]"
                >
                  Course Catalog
                </Button>
              </Link>
              <Link href="/tools/cv-builder">
                <Button
                  variant="outline"
                  className="hover:bg-blue-50 hover:border-blue-300 transition-colors rounded-[10px]"
                >
                  CV Builder
                </Button>
              </Link>
              <Link href="/tools/scholarship-coach">
                <Button
                  variant="outline"
                  className="hover:bg-blue-50 hover:border-blue-300 transition-colors rounded-[10px]"
                >
                  Scholarship Coach
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="hover:bg-blue-50 hover:border-blue-300 transition-colors rounded-[10px]"
                >
                  Contact Support
                </Button>
              </Link>
            </div>
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
