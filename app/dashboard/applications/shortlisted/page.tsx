"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Eye, CheckCircle, XCircle, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const mockApplications = [
  {
    id: "1",
    candidateName: "John Smith",
    candidateEmail: "john.smith@email.com",
    jobTitle: "Frontend Developer",
    status: "pending",
    appliedDate: "2024-06-01",
    matchScore: 92,
  },
  {
    id: "2",
    candidateName: "Emma Wilson",
    candidateEmail: "emma.wilson@email.com",
    jobTitle: "Backend Developer",
    status: "shortlisted",
    appliedDate: "2024-06-02",
    matchScore: 88,
  },
  {
    id: "3",
    candidateName: "David Brown",
    candidateEmail: "david.brown@email.com",
    jobTitle: "UI/UX Designer",
    status: "reviewed",
    appliedDate: "2024-06-03",
    matchScore: 85,
  },
  {
    id: "4",
    candidateName: "Lisa Johnson",
    candidateEmail: "lisa.johnson@email.com",
    jobTitle: "QA Tester",
    status: "interviewed",
    appliedDate: "2024-06-04",
    matchScore: 90,
  },
  {
    id: "5",
    candidateName: "Michael Lee",
    candidateEmail: "michael.lee@email.com",
    jobTitle: "Product Manager",
    status: "hired",
    appliedDate: "2024-06-05",
    matchScore: 95,
  },
  {
    id: "6",
    candidateName: "Sophia Turner",
    candidateEmail: "sophia.turner@email.com",
    jobTitle: "DevOps Engineer",
    status: "rejected",
    appliedDate: "2024-06-06",
    matchScore: 78,
  },
  {
    id: "7",
    candidateName: "James Clark",
    candidateEmail: "james.clark@email.com",
    jobTitle: "Data Scientist",
    status: "pending",
    appliedDate: "2024-06-07",
    matchScore: 87,
  },
  {
    id: "8",
    candidateName: "Olivia Harris",
    candidateEmail: "olivia.harris@email.com",
    jobTitle: "QA Tester",
    status: "shortlisted",
    appliedDate: "2024-06-08",
    matchScore: 91,
  },
  {
    id: "9",
    candidateName: "William Evans",
    candidateEmail: "william.evans@email.com",
    jobTitle: "Frontend Developer",
    status: "reviewed",
    appliedDate: "2024-06-09",
    matchScore: 83,
  },
  {
    id: "10",
    candidateName: "Ava Scott",
    candidateEmail: "ava.scott@email.com",
    jobTitle: "Backend Developer",
    status: "interviewed",
    appliedDate: "2024-06-10",
    matchScore: 89,
  },
  {
    id: "11",
    candidateName: "Benjamin King",
    candidateEmail: "benjamin.king@email.com",
    jobTitle: "UI/UX Designer",
    status: "hired",
    appliedDate: "2024-06-11",
    matchScore: 93,
  },
  {
    id: "12",
    candidateName: "Mia Wright",
    candidateEmail: "mia.wright@email.com",
    jobTitle: "Product Manager",
    status: "rejected",
    appliedDate: "2024-06-12",
    matchScore: 76,
  },
  {
    id: "13",
    candidateName: "Elijah Baker",
    candidateEmail: "elijah.baker@email.com",
    jobTitle: "DevOps Engineer",
    status: "pending",
    appliedDate: "2024-06-13",
    matchScore: 88,
  },
  {
    id: "14",
    candidateName: "Charlotte Adams",
    candidateEmail: "charlotte.adams@email.com",
    jobTitle: "Data Scientist",
    status: "shortlisted",
    appliedDate: "2024-06-14",
    matchScore: 90,
  },
  {
    id: "15",
    candidateName: "Henry Nelson",
    candidateEmail: "henry.nelson@email.com",
    jobTitle: "QA Tester",
    status: "reviewed",
    appliedDate: "2024-06-15",
    matchScore: 84,
  },
  {
    id: "16",
    candidateName: "Amelia Carter",
    candidateEmail: "amelia.carter@email.com",
    jobTitle: "Frontend Developer",
    status: "interviewed",
    appliedDate: "2024-06-16",
    matchScore: 86,
  },
  {
    id: "17",
    candidateName: "Lucas Mitchell",
    candidateEmail: "lucas.mitchell@email.com",
    jobTitle: "Backend Developer",
    status: "hired",
    appliedDate: "2024-06-17",
    matchScore: 94,
  },
  {
    id: "18",
    candidateName: "Harper Perez",
    candidateEmail: "harper.perez@email.com",
    jobTitle: "UI/UX Designer",
    status: "rejected",
    appliedDate: "2024-06-18",
    matchScore: 79,
  },
  {
    id: "19",
    candidateName: "Jack Roberts",
    candidateEmail: "jack.roberts@email.com",
    jobTitle: "Product Manager",
    status: "pending",
    appliedDate: "2024-06-19",
    matchScore: 85,
  },
  {
    id: "20",
    candidateName: "Evelyn Hall",
    candidateEmail: "evelyn.hall@email.com",
    jobTitle: "DevOps Engineer",
    status: "shortlisted",
    appliedDate: "2024-06-20",
    matchScore: 92,
  },
];

const statusColorMap: { [key: string]: string } = {
  pending: "bg-gray-200 text-gray-800",
  shortlisted: "bg-blue-100 text-blue-800",
  reviewed: "bg-yellow-100 text-yellow-800",
  interviewed: "bg-purple-100 text-purple-800",
  hired: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ShortlistedApplicationsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const router = useRouter();

  const filtered = mockApplications.filter(
    (app) =>
      app.status === "shortlisted" &&
      (app.candidateName.toLowerCase().includes(search.toLowerCase()) ||
        app.candidateEmail.toLowerCase().includes(search.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">
            Shortlisted Applications
          </h1>
          <p className="text-gray-600 mt-1">
            View all applications that have been shortlisted.
          </p>
        </div>
        <Button asChild className="rounded-[10px]" variant="outline">
          <Link href="/dashboard/applications">Back to All Applications</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" /> Shortlisted
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div className="relative md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                placeholder="Search by candidate, email, or job..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-[10px]"
              />
            </div>
          </div>
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No shortlisted applications found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">
                        {app.candidateName}
                      </TableCell>
                      <TableCell>{app.candidateEmail}</TableCell>
                      <TableCell>{app.jobTitle}</TableCell>
                      <TableCell>
                        <Badge
                          className={`capitalize rounded-[10px] ${
                            statusColorMap[app.status] ||
                            "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{app.appliedDate}</TableCell>
                      <TableCell>{app.matchScore}%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            size="icon"
                            variant="outline"
                            className="rounded-[10px]"
                            title="View"
                            onClick={() =>
                              router.push(`/dashboard/applications/${app.id}`)
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-end items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="rounded-[10px]"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-[10px]"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
