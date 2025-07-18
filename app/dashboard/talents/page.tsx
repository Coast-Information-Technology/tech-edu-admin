"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Search,
  MapPin,
  GraduationCap,
  Briefcase,
  Star,
  Eye,
  Filter,
  Users,
  TrendingUp,
} from "lucide-react";
import { mockTalentData } from "@/data/talents";

export default function TalentDirectoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const role = searchParams.get("role") || "";
  const search = searchParams.get("search") || "";
  const location = searchParams.get("location") || "";

  const [page, setPage] = useState(pageParam);
  const itemsPerPage = 6;

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  }, [page]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const filteredData = mockTalentData.filter((talent) => {
    const matchesRole = role ? talent.roleInterest === role : true;
    const matchesSearch = search
      ? talent.name.toLowerCase().includes(search.toLowerCase()) ||
        talent.skills.some((skill) =>
          skill.toLowerCase().includes(search.toLowerCase())
        ) ||
        talent.degree.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesLocation = location
      ? talent.location.toLowerCase().includes(location.toLowerCase())
      : true;

    return matchesRole && matchesSearch && matchesLocation;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const uniqueRoles = [
    ...new Set(mockTalentData.map((talent) => talent.roleInterest)),
  ];
  const uniqueLocations = [
    ...new Set(mockTalentData.map((talent) => talent.location)),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-8 h-8 text-[#011F72]" />
            <h1 className="text-4xl md:text-5xl font-bold text-[#011F72]">
              Talent Directory
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover exceptional graduates ready to launch their careers.
            Connect with verified talent across various industries and
            locations.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{mockTalentData.length} Talents Available</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.7 Average Rating</span>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#011F72]" />
              <h2 className="text-lg font-semibold text-[#011F72]">
                Search & Filters
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search talents, skills..."
                  value={search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10 rounded-[10px]"
                />
              </div>

              <select
                className="px-4 py-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#011F72]"
                value={role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
              >
                <option value="">All Roles</option>
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              <select
                className="px-4 py-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#011F72]"
                value={location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              <Button
                onClick={() => {
                  router.push("?");
                  setPage(1);
                }}
                variant="outline"
                className="bg-[#011F72] text-white hover:bg-[#2952c1] rounded-[10px]"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {currentData.length} of {filteredData.length} talents
            {search && ` for "${search}"`}
            {role && ` in ${role}`}
            {location && ` from ${location}`}
          </p>
        </div>

        {/* Talent Grid */}
        <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {currentData.map((talent, index) => (
            <li
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center border hover:shadow-md transition"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 mb-4 flex items-center justify-center">
                <span className="text-3xl text-gray-400">👤</span>
              </div>
              <p className="flex items-center gap-2 text-gray-800 font-medium text-sm mb-1">
                <span>📌</span> {talent.name}
              </p>
              <p className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <span>📍</span> {talent.location}
              </p>
              <p className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <span>💼</span> {talent.roleInterest}
              </p>
              <p className="flex items-start gap-2 text-gray-500 text-xs italic mb-4 text-left">
                <span>📄</span>
                <span>{talent.cvInsight}</span>
              </p>
              <Link
                href={`/dashboard/talents/${talent.id}`}
                className="mt-auto bg-gray-200 text-gray-700 font-semibold rounded-[10px] px-4 py-2 w-full hover:bg-gray-300 text-center"
              >
                View Profile
              </Link>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={`cursor-pointer ${
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }`}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 7) return true;
                    return (
                      p === 1 ||
                      p === totalPages ||
                      (p >= page - 1 && p <= page + 1)
                    );
                  })
                  .map((p, index, array) => (
                    <div key={p}>
                      {index > 0 && array[index - 1] !== p - 1 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setPage(p)}
                          isActive={page === p}
                          className={`cursor-pointer ${
                            page === p
                              ? "text-[#011F72] border-[#011F72] rounded-[10px]"
                              : ""
                          }`}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    </div>
                  ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className={`cursor-pointer ${
                      page >= totalPages ? "pointer-events-none opacity-50" : ""
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
