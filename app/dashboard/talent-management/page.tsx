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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  GraduationCap,
  Briefcase,
  Star,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Users,
  TrendingUp,
  MoreHorizontal,
  MessageSquare,
  Calendar,
  Download,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { mockTalentData } from "@/data/talents";

export default function TalentManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const role = searchParams.get("role") || "";
  const search = searchParams.get("search") || "";
  const location = searchParams.get("location") || "";
  const status = searchParams.get("status") || "";

  const [page, setPage] = useState(pageParam);
  const [pageSize, setPageSize] = useState(10);
  const [talents, setTalents] = useState(mockTalentData);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [talentToDelete, setTalentToDelete] = useState<string | null>(null);

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

  const filteredData = talents.filter((talent) => {
    const matchesRole =
      role && role !== "all" ? talent.roleInterest === role : true;
    const matchesSearch = search
      ? talent.name.toLowerCase().includes(search.toLowerCase()) ||
        talent.skills.some((skill) =>
          skill.toLowerCase().includes(search.toLowerCase())
        ) ||
        talent.degree.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesLocation =
      location && location !== "all"
        ? talent.location.toLowerCase().includes(location.toLowerCase())
        : true;
    const matchesStatus =
      status && status !== "all"
        ? talent.coachVerified === (status === "verified")
        : true;

    return matchesRole && matchesSearch && matchesLocation && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTalents = filteredData.slice(startIndex, endIndex);

  const uniqueRoles = [
    ...new Set(talents.map((talent) => talent.roleInterest)),
  ];
  const uniqueLocations = [
    ...new Set(talents.map((talent) => talent.location)),
  ];

  // Calculate stats
  const totalTalents = talents.length;
  const verifiedTalents = talents.filter((t) => t.coachVerified).length;
  const averageRating = (
    talents.reduce((sum, t) => sum + t.rating, 0) / totalTalents
  ).toFixed(1);
  const availableTalents = talents.filter(
    (t) => t.availability === "Immediate"
  ).length;

  const handleDeleteTalent = (talentId: string) => {
    setTalentToDelete(talentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (talentToDelete) {
      setTalents(talents.filter((t) => t.id !== talentToDelete));
      setTalentToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const getStatusBadge = (verified: boolean) => {
    return verified ? (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Verified
      </Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">
        <AlertCircle className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">
            Talent Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and oversee all talent profiles in your institution
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-[10px]">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button
            className="text-white hover:text-black rounded-[10px]"
            asChild
          >
            <Link href="/dashboard/talent-management/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Talent
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-[10px]">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Talents</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {totalTalents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-[10px]">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Verified Talents</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {verifiedTalents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-[10px]">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {averageRating}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-[10px]">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Now</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {availableTalents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search talents by name, skills, or degree..."
                  value={search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10 rounded-[10px]"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select
                value={status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="w-40 rounded-[10px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-[10px] bg-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={role}
                onValueChange={(value) => handleFilterChange("role", value)}
              >
                <SelectTrigger className="w-48 rounded-[10px]">
                  <SelectValue placeholder="Role Interest" />
                </SelectTrigger>
                <SelectContent className="rounded-[10px] bg-white">
                  <SelectItem value="all">All Roles</SelectItem>
                  {uniqueRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={location}
                onValueChange={(value) => handleFilterChange("location", value)}
              >
                <SelectTrigger className="w-40 rounded-[10px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="rounded-[10px] bg-white">
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Talents Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Talents ({filteredData.length})</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(parseInt(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-20 rounded-[10px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-[10px]">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">per page</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Talent</TableHead>
                  <TableHead>Role Interest</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Education</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTalents.map((talent) => (
                  <TableRow key={talent.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {talent.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{talent.name}</div>
                          <div className="text-sm text-gray-500">
                            {talent.contact.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{talent.roleInterest}</TableCell>
                    <TableCell>{talent.location}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{talent.degree}</div>
                        <div className="text-sm text-gray-500">
                          {talent.university}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(talent.coachVerified)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{talent.rating}</span>
                        <span className="text-sm text-gray-500">
                          ({talent.reviews})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          talent.availability === "Immediate"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {talent.availability}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white rounded-[10px]"
                        >
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link
                              href={`/dashboard/talent-management/${talent.id}`}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Talent
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Meeting
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Download className="w-4 h-4 mr-2" />
                            Download CV
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600"
                            onClick={() => handleDeleteTalent(talent.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Talent
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No talents found matching your criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[10px] bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Talent</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this talent? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-[10px]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-[10px]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
