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
import { getApiRequest } from "@/lib/apiFetch";

interface Company {
  _id: string;
  name: string;
  type: string;
  isActive: boolean;
  isVerified: boolean;
}

interface CompanyStatsType {
  total: number;
  active: number;
  verified: number;
}

interface CompanyStatistics {
  total: number;
  active: number;
  verified: number;
  byType: Record<string, CompanyStatsType>;
}

type SortKey = "name" | "type" | "isActive" | "isVerified";
type SortDirection = "asc" | "desc";

export default function CompaniesDashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState<CompanyStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("");

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getApiRequest("/api/companies/admin/all");
        if (!res.data)
          throw new Error(res.message || "Failed to load companies");
        setCompanies(res.data);
        // Extract statistics from res.data or from res.data.statistics if separate
        // Assuming stats are sent in the same response object as per your example
        if (
          res.data &&
          res.data.length === undefined &&
          res.data.total !== undefined
        ) {
          // Means res.data is the statistics object, not array - handle gracefully
          setStats(res.data);
        } else if (res.data) {
          setStats(res.data);
        } else {
          // If statistics are returned elsewhere, adjust here accordingly
          setStats(null);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Filter and sort companies
  const filteredCompanies = useMemo(() => {
    return companies
      .filter((c) => {
        const matchesSearch = c.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesType = filterType ? c.type === filterType : true;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortDirection === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (typeof aVal === "boolean" && typeof bVal === "boolean") {
          return sortDirection === "asc"
            ? Number(aVal) - Number(bVal)
            : Number(bVal) - Number(aVal);
        }

        return 0;
      });
  }, [companies, searchTerm, filterType, sortKey, sortDirection]);

  // Pagination slice
  const pagedCompanies = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredCompanies.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCompanies, page]);

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key)
      return <ChevronsUpDown className="inline w-4 h-4 text-gray-400" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="inline w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="inline w-4 h-4 text-blue-600" />
    );
  };

  return (
    <section className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Companies Dashboard</h1>

      {loading && <div className="flex justify-center py-20">Loading...</div>}

      {error && (
        <div
          role="alert"
          className="text-red-700 bg-red-100 p-4 rounded-md mb-4 border border-red-400"
        >
          {error}
        </div>
      )}

      {/* Statistics */}
      {stats && !loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-xl font-bold text-blue-800">{stats.total}</p>
            <p className="text-sm text-blue-700">Total Companies</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-xl font-bold text-green-800">{stats.active}</p>
            <p className="text-sm text-green-700">Active Companies</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <p className="text-xl font-bold text-purple-800">
              {stats.verified}
            </p>
            <p className="text-sm text-purple-700">Verified Companies</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-semibold mb-2">By Type</h3>
            {Object.entries(stats.byType).map(([type, data]) => (
              <div key={type} className="mb-2 last:mb-0">
                <p className="font-medium capitalize">
                  {type.replace(/_/g, " ")}
                </p>
                <p className="text-sm text-gray-700">
                  Total: {data.total}, Active: {data.active}, Verified:{" "}
                  {data.verified}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      {!loading && !error && (
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input
            type="search"
            placeholder="Search by company name..."
            value={searchTerm}
            onChange={(e) => {
              setPage(1);
              setSearchTerm(e.target.value);
            }}
            className="max-w-md"
            aria-label="Search companies by name"
          />

          <Select
            value={filterType}
            onValueChange={(val) => {
              setPage(1);
              setFilterType(val);
            }}
          >
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded shadow-md">
              <SelectItem value="">All Types</SelectItem>
              {[...new Set(companies.map((c) => c.type))].map((type) => (
                <SelectItem key={type} value={type}>
                  {type
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Companies Table */}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto border border-gray-300 rounded-md">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    scope="col"
                    className="cursor-pointer p-3 select-none"
                    onClick={() => toggleSort("name")}
                  >
                    Name {getSortIcon("name")}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer p-3 select-none"
                    onClick={() => toggleSort("type")}
                  >
                    Type {getSortIcon("type")}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer p-3 select-none"
                    onClick={() => toggleSort("isActive")}
                  >
                    Active {getSortIcon("isActive")}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer p-3 select-none"
                    onClick={() => toggleSort("isVerified")}
                  >
                    Verified {getSortIcon("isVerified")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {pagedCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-600">
                      No companies found.
                    </td>
                  </tr>
                ) : (
                  pagedCompanies.map((c) => (
                    <tr
                      key={c._id}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-3">{c.name}</td>
                      <td className="p-3 capitalize">
                        {c.type.replace(/_/g, " ")}
                      </td>
                      <td className="p-3">{c.isActive ? "Yes" : "No"}</td>
                      <td className="p-3">{c.isVerified ? "Yes" : "No"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <nav
            aria-label="Pagination"
            className="flex justify-between items-center mt-4"
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded border border-gray-300 bg-white disabled:opacity-50"
            >
              Previous
            </button>
            <p className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </p>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded border border-gray-300 bg-white disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </>
      )}
    </section>
  );
}
