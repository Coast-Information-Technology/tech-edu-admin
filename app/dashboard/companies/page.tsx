"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import {
  getApiRequest,
  patchApiRequest,
  deleteApiRequest,
} from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Pencil, Trash, Ban } from "lucide-react";
import { Building, Activity, CheckCircle, Users, Eye } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Company {
  _id: string;
  name: string;
  type: string;
  isActive: boolean;
  isVerified: boolean;
  rcNumber?: string;
  industry?: string;
  location?: { country: string; state: string; city: string };
  createdAt?: string;
  updatedAt?: string;
  associatedUsers?: Array<{ userId: string; role: string; _id: string }>;
  size?: string;
  website?: string;
  linkedIn?: string;
  logoUrl?: string;
  contactPerson?: {
    name?: string;
    email?: string;
    phone?: string;
    jobTitle?: string;
  };
}

export default function CompaniesDashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [sortKey, setSortKey] = useState<keyof Company>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [analytics, setAnalytics] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // companyId for which action is loading
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);

  // Fetch companies and analytics
  useEffect(() => {
    console.log("Running fetchData effect");
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = getTokenFromCookies();
      console.log("Token:", token);
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }
      try {
        const [companiesRes, analyticsRes] = await Promise.all([
          getApiRequest("/api/companies/admin/all", token),
          getApiRequest("/api/companies/admin/stats", token),
        ]);
        const companiesArray = companiesRes?.data?.data;
        console.log("companiesArray:", companiesArray);
        if (!Array.isArray(companiesArray)) {
          setCompanies([]);
          setError("No companies found.");
          return;
        }
        const filteredCompanies = companiesArray.filter(
          (item: any) =>
            item.name &&
            item.type &&
            typeof item.isActive === "boolean" &&
            typeof item.isVerified === "boolean"
        );
        console.log("Filtered companies:", filteredCompanies);
        setCompanies(filteredCompanies);
        setAnalytics(analyticsRes.data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load companies");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Action handlers
  const handleDeactivate = async (companyId: string) => {
    setActionLoading(companyId);
    setActionError(null);
    setActionSuccess(null);
    const token = getTokenFromCookies();
    if (!token) {
      setActionError("Authentication required. Please log in.");
      setActionLoading(null);
      return;
    }
    try {
      const res = await patchApiRequest(
        `/api/companies/${companyId}/deactivate`,
        token,
        {}
      );
      setCompanies((prev) =>
        prev.map((c) => (c._id === companyId ? { ...c, isActive: false } : c))
      );
      setActionSuccess("Company deactivated successfully.");
    } catch (err: any) {
      setActionError(err.message || "Failed to deactivate company");
    } finally {
      setActionLoading(null);
    }
  };
  const handleDelete = async (companyId: string) => {
    if (!window.confirm("Are you sure you want to delete this company?"))
      return;
    setActionLoading(companyId);
    setActionError(null);
    setActionSuccess(null);
    const token = getTokenFromCookies();
    if (!token) {
      setActionError("Authentication required. Please log in.");
      setActionLoading(null);
      return;
    }
    try {
      await deleteApiRequest(`/api/companies/${companyId}`, token);
      setCompanies((prev) => prev.filter((c) => c._id !== companyId));
      setActionSuccess("Company deleted successfully.");
    } catch (err: any) {
      setActionError(err.message || "Failed to delete company");
    } finally {
      setActionLoading(null);
    }
  };
  const handleEdit = (company: Company) => {
    // For now, just alert. Replace with modal or navigation as needed.
    alert(`Edit company: ${company.name}`);
  };

  const openEditModal = (company: Company) => {
    setEditCompany(company);
    setEditForm({
      name: company.name || "",
      type: company.type || "",
      rcNumber: company.rcNumber || "",
      industry: company.industry || "",
      size: company.size || "",
      website: company.website || "",
      linkedIn: company.linkedIn || "",
      logoUrl: company.logoUrl || "",
      "contactPerson.name": company.contactPerson?.name || "",
      "contactPerson.email": company.contactPerson?.email || "",
      "contactPerson.phone": company.contactPerson?.phone || "",
      "contactPerson.jobTitle": company.contactPerson?.jobTitle || "",
      "location.country": company.location?.country || "",
      "location.state": company.location?.state || "",
      "location.city": company.location?.city || "",
      isVerified: company.isVerified,
      isActive: company.isActive,
    });
    setEditError(null);
    setEditSuccess(null);
    setEditModalOpen(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setEditForm((prev: any) => ({
      ...prev,
      [name]:
        type === "checkbox" && "checked" in e.target
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCompany) return;
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(null);
    const token = getTokenFromCookies();
    if (!token) {
      setEditError("Authentication required. Please log in.");
      setEditLoading(false);
      return;
    }
    try {
      await patchApiRequest(
        `/api/companies/${editCompany._id}`,
        token,
        editForm
      );
      setCompanies((prev) =>
        prev.map((c) => (c._id === editCompany._id ? { ...c, ...editForm } : c))
      );
      setEditSuccess("Company updated successfully.");
      setTimeout(() => {
        setEditModalOpen(false);
        setEditCompany(null);
      }, 1000);
    } catch (err: any) {
      setEditError(err.message || "Failed to update company");
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    console.log("Companies State:", JSON.stringify(companies, null, 2)); // Debug: Log state updates
  }, [companies]);

  const processedCompanies = useMemo(() => {
    console.log("Companies state before filtering:", companies);
    console.log("Filter Type:", filterType); // Debug: Log filter type
    console.log("Search Term:", searchTerm); // Debug: Log search term

    const filtered = companies.filter((c) => {
      const nameMatch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch =
        filterType === "all" ||
        c.type.toLowerCase() === filterType.toLowerCase();
      return nameMatch && typeMatch;
    });
    console.log("Filtered companies after search/filter:", filtered);

    const sorted = filtered.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      let result = 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        result =
          sortDirection === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
      } else if (typeof aVal === "boolean" && typeof bVal === "boolean") {
        result =
          sortDirection === "asc"
            ? Number(aVal) - Number(bVal)
            : Number(bVal) - Number(aVal);
      }
      if (result === 0) {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return result;
    });

    const totalPages = Math.ceil(sorted.length / itemsPerPage);
    const paginated = sorted.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

    console.log(
      "Page:",
      page,
      "Items per page:",
      itemsPerPage,
      "Total filtered:",
      filtered.length
    );
    console.log("Paginated Companies:", paginated);

    return { paginated, totalPages, filteredCount: sorted.length };
  }, [companies, searchTerm, filterType, sortKey, sortDirection, page]);

  const toggleSort = (key: keyof Company) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setPage(1);
  };

  const getSortIcon = (key: keyof Company) => {
    if (sortKey !== key)
      return (
        <ChevronsUpDown
          className="inline w-4 h-4 text-gray-400"
          aria-hidden="true"
        />
      );
    return sortDirection === "asc" ? (
      <ChevronUp className="inline w-4 h-4 text-blue-600" aria-hidden="true" />
    ) : (
      <ChevronDown
        className="inline w-4 h-4 text-blue-600"
        aria-hidden="true"
      />
    );
  };

  // Compute byType stats from companies array
  const companyTypes = Array.from(new Set(companies.map((c) => c.type)));
  const byTypeStats = companyTypes.map((type) => {
    const companiesOfType = companies.filter((c) => c.type === type);
    return {
      type,
      total: companiesOfType.length,
      active: companiesOfType.filter((c) => c.isActive).length,
      verified: companiesOfType.filter((c) => c.isVerified).length,
    };
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Companies Dashboard</h1>

      {/* Analytics summary */}
      {analytics && (
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Total Companies */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-[10px] shadow border border-gray-100">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
              <Building className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {analytics.total}
              </div>
              <div className="text-xs text-gray-500">Total Companies</div>
            </div>
          </div>
          {/* Active Companies */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-[10px] shadow border border-gray-100">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
              <Activity className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {analytics.active}
              </div>
              <div className="text-xs text-green-700">Active</div>
            </div>
          </div>
          {/* Verified Companies */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-[10px] shadow border border-gray-100">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100">
              <CheckCircle className="w-7 h-7 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-900">
                {analytics.verified}
              </div>
              <div className="text-xs text-yellow-700">Verified</div>
            </div>
          </div>
          {/* By Type */}
          {/* <div className="p-4 bg-white rounded-[10px] shadow border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-xs font-bold text-blue-900">By Type</span>
            </div>
            <div className="space-y-2">
              {byTypeStats.map(({ type, total, active, verified }) => (
                <div key={type} className="flex items-center gap-2 text-xs">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                  <span className="font-semibold">
                    {type
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </span>
                  <span className="text-gray-500 ml-1">{total} total</span>
                  <span className="text-green-700 ml-2">{active} active</span>
                  <span className="text-yellow-700 ml-2">
                    {verified} verified
                  </span>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      )}

      {/* Action feedback */}
      {actionError && (
        <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">
          {actionError}
        </div>
      )}
      {actionSuccess && (
        <div className="mb-2 p-2 bg-green-100 text-green-700 rounded">
          {actionSuccess}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded flex justify-between items-center">
          {error}
          <button
            onClick={() => setError(null)}
            className="text-red-700 hover:text-red-900"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {loading && <div className="flex justify-center py-20">Loading...</div>}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => {
            setPage(1);
            setSearchTerm(e.target.value);
          }}
          className="max-w-md rounded-[10px]"
          aria-label="Search companies"
        />

        <Select
          value={filterType}
          onValueChange={(val) => {
            setPage(1);
            setFilterType(val);
            console.log("Selected Filter Type:", val); // Debug: Log filter type change
          }}
        >
          <SelectTrigger
            className="max-w-xs rounded-[10px]"
            aria-label="Filter by company type"
          >
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="rounded-[10px] bg-white">
            <SelectItem value="all">All Types</SelectItem>
            {Array.from(new Set(companies.map((c) => c.type))).map((type) => (
              <SelectItem key={type} value={type}>
                {type
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto border rounded-[10px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                { key: "name", label: "Name" },
                { key: "type", label: "Type" },
                { key: "isActive", label: "Status" },
                { key: "isVerified", label: "Verification" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => toggleSort(key as keyof Company)}
                  aria-sort={
                    sortKey === key
                      ? sortDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <div className="flex items-center gap-1">
                    {label} {getSortIcon(key as keyof Company)}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {processedCompanies.paginated.length > 0 ? (
              processedCompanies.paginated.map((company) => (
                <tr key={company._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{company.name}</div>
                    {company.industry && (
                      <div className="text-sm text-gray-500">
                        {company.industry}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                      {company.type
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        company.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {company.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        company.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {company.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                          aria-label="Open actions menu"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white rounded-[10px]"
                      >
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/companies/${company._id}`}
                            className="cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-2" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openEditModal(company)}
                          className="hover:bg-gray-100 cursor-pointer"
                        >
                          <Pencil className="w-4 h-4 mr-2 text-gray-500" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(company._id)}
                          disabled={actionLoading === company._id}
                          className="hover:bg-gray-100 cursor-pointer"
                        >
                          <Trash className="w-4 h-4 mr-2 text-red-500" />
                          {actionLoading === company._id
                            ? "Deleting..."
                            : "Delete"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeactivate(company._id)}
                          disabled={
                            actionLoading === company._id || !company.isActive
                          }
                          className="hover:bg-gray-100 cursor-pointer"
                        >
                          <Ban className="w-4 h-4 mr-2 text-yellow-600" />
                          {actionLoading === company._id
                            ? "Deactivating..."
                            : "Deactivate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  {companies.length === 0
                    ? "No companies available"
                    : "No matching companies found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Showing{" "}
          {Math.min(
            (page - 1) * itemsPerPage + 1,
            processedCompanies.filteredCount
          )}{" "}
          to {Math.min(page * itemsPerPage, processedCompanies.filteredCount)}{" "}
          of {processedCompanies.filteredCount} companies
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
            aria-label="Previous page"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setPage((p) => Math.min(processedCompanies.totalPages, p + 1))
            }
            disabled={page === processedCompanies.totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Company Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              name="name"
              value={editForm.name || ""}
              onChange={handleEditChange}
              required
            />
            <Input
              name="type"
              value={editForm.type || ""}
              onChange={handleEditChange}
              required
            />
            <Input
              name="rcNumber"
              value={editForm.rcNumber || ""}
              onChange={handleEditChange}
            />
            <Input
              name="industry"
              value={editForm.industry || ""}
              onChange={handleEditChange}
            />
            <Input
              name="size"
              value={editForm.size || ""}
              onChange={handleEditChange}
            />
            <Input
              name="website"
              value={editForm.website || ""}
              onChange={handleEditChange}
            />
            <Input
              name="linkedIn"
              value={editForm.linkedIn || ""}
              onChange={handleEditChange}
            />
            <Input
              name="logoUrl"
              value={editForm.logoUrl || ""}
              onChange={handleEditChange}
            />
            <Input
              name="contactPerson.name"
              value={editForm["contactPerson.name"] || ""}
              onChange={handleEditChange}
            />
            <Input
              name="contactPerson.email"
              value={editForm["contactPerson.email"] || ""}
              onChange={handleEditChange}
            />
            <Input
              name="contactPerson.phone"
              value={editForm["contactPerson.phone"] || ""}
              onChange={handleEditChange}
            />
            <Input
              name="contactPerson.jobTitle"
              value={editForm["contactPerson.jobTitle"] || ""}
              onChange={handleEditChange}
            />
            <Input
              name="location.country"
              value={editForm["location.country"] || ""}
              onChange={handleEditChange}
            />
            <Input
              name="location.state"
              value={editForm["location.state"] || ""}
              onChange={handleEditChange}
            />
            <Input
              name="location.city"
              value={editForm["location.city"] || ""}
              onChange={handleEditChange}
            />
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isVerified"
                  checked={!!editForm.isVerified}
                  onChange={handleEditChange}
                />
                Verified
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={!!editForm.isActive}
                  onChange={handleEditChange}
                />
                Active
              </label>
            </div>
            {editError && (
              <div className="text-red-600 text-sm">{editError}</div>
            )}
            {editSuccess && (
              <div className="text-green-600 text-sm">{editSuccess}</div>
            )}
            <DialogFooter>
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setEditModalOpen(false)}
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                disabled={editLoading}
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
