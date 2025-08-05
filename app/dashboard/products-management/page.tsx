"use client";
import React, { useEffect, useState } from "react";
import {
  getApiRequest,
  postApiRequest,
  updateApiRequest,
  deleteApiRequest,
} from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  RotateCcw,
  Search,
  Filter,
  X,
  Check,
  AlertTriangle,
  Package,
  Tag,
  Calendar,
  User,
} from "lucide-react";

const initialForm = { title: "", productType: "" };
const initialSubcategoryForm = {
  name: "",
  categoryTitle: "",
  categoryId: "",
  productType: "",
};

const PRODUCT_TYPE_OPTIONS = [
  "Training & Certification",
  "Academic Support Services",
  "Career Development & Mentorship",
  "Institutional & Team Services",
  "AI-Powered or Automation Services",
  "Career Connect",
  "Marketing, Consultation & Free Services",
];

export default function ProductCategoriesManagement() {
  // Categories state
  const [categories, setCategories] = useState<any[]>([]);
  const [deletedCategories, setDeletedCategories] = useState<any[]>([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [filterType, setFilterType] = useState("");
  const [viewedCategory, setViewedCategory] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Subcategories state
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [deletedSubcategories, setDeletedSubcategories] = useState<any[]>([]);
  const [showDeletedSubcategories, setShowDeletedSubcategories] =
    useState(false);
  const [subcategoryLoading, setSubcategoryLoading] = useState(false);
  const [subcategoryError, setSubcategoryError] = useState<string | null>(null);
  const [subcategorySuccess, setSubcategorySuccess] = useState<string | null>(
    null
  );
  const [subcategoryForm, setSubcategoryForm] = useState(
    initialSubcategoryForm
  );
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<
    string | null
  >(null);
  const [editSubcategoryForm, setEditSubcategoryForm] = useState(
    initialSubcategoryForm
  );
  const [filterSubcategoryType, setFilterSubcategoryType] = useState("");
  const [filterSubcategoryCategory, setFilterSubcategoryCategory] =
    useState("");
  const [viewedSubcategory, setViewedSubcategory] = useState<any>(null);
  const [viewSubcategoryModalOpen, setViewSubcategoryModalOpen] =
    useState(false);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [createSubcategoryModalOpen, setCreateSubcategoryModalOpen] =
    useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<"categories" | "subcategories">(
    "categories"
  );

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getTokenFromCookies() || "";
      if (showDeleted) {
        const res = await getApiRequest(
          "/api/product-categories/deleted/all",
          token
        );
        setDeletedCategories(res?.data?.data || []);
      } else if (filterType) {
        const res = await getApiRequest(
          `/api/product-categories/type/${encodeURIComponent(filterType)}`,
          token
        );
        setCategories(res?.data?.data || []);
      } else {
        const res = await getApiRequest("/api/product-categories", token);
        setCategories(res?.data?.data || []);
      }
    } catch (err) {
      setError((err as Error).message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  // Fetch subcategories
  const fetchSubcategories = async () => {
    setSubcategoryLoading(true);
    setSubcategoryError(null);
    try {
      const token = getTokenFromCookies() || "";
      let endpoint = "/api/product-subcategories";

      if (showDeletedSubcategories) {
        endpoint = "/api/product-subcategories/deleted/all";
      } else if (filterSubcategoryType) {
        endpoint = `/api/product-subcategories/type/${encodeURIComponent(
          filterSubcategoryType
        )}`;
      } else if (filterSubcategoryCategory) {
        endpoint = `/api/product-subcategories/category/${filterSubcategoryCategory}`;
      }

      const res = await getApiRequest(endpoint, token);
      if (showDeletedSubcategories) {
        setDeletedSubcategories(res?.data?.data || []);
      } else {
        setSubcategories(res?.data?.data || []);
      }
    } catch (err) {
      setSubcategoryError(
        (err as Error).message || "Failed to fetch subcategories"
      );
    } finally {
      setSubcategoryLoading(false);
    }
  };

  // Fetch available categories for subcategory form
  const fetchAvailableCategories = async () => {
    try {
      const token = getTokenFromCookies() || "";
      const res = await getApiRequest("/api/product-categories", token);
      setAvailableCategories(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch categories for subcategory form:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "categories") {
      fetchCategories();
    } else {
      fetchSubcategories();
      fetchAvailableCategories();
    }
  }, [
    activeTab,
    showDeleted,
    filterType,
    showDeletedSubcategories,
    filterSubcategoryType,
    filterSubcategoryCategory,
  ]);

  // Categories CRUD operations
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = getTokenFromCookies() || "";
      await postApiRequest("/api/product-categories", token, form);
      setSuccess("Category created successfully!");
      setForm(initialForm);
      setCreateModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError((err as Error).message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat: any) => {
    setEditingId(cat._id);
    setEditForm({ title: cat.title, productType: cat.productType });
  };

  const handleEditSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = getTokenFromCookies() || "";
      await updateApiRequest(
        `/api/product-categories/${editingId}`,
        token,
        editForm
      );
      setSuccess("Category updated successfully!");
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setError((err as Error).message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = getTokenFromCookies() || "";
      await deleteApiRequest(`/api/product-categories/${id}`, token);
      setSuccess("Category deleted successfully!");
      fetchCategories();
    } catch (err) {
      setError((err as Error).message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = getTokenFromCookies() || "";
      await updateApiRequest(
        `/api/product-categories/${id}/restore`,
        token,
        {}
      );
      setSuccess("Category restored successfully!");
      fetchCategories();
    } catch (err) {
      setError((err as Error).message || "Failed to restore category");
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = getTokenFromCookies() || "";
      const res = await getApiRequest(`/api/product-categories/${id}`, token);
      setViewedCategory(res?.data?.data || null);
      setViewModalOpen(true);
    } catch (err) {
      setError((err as Error).message || "Failed to fetch category details");
    } finally {
      setLoading(false);
    }
  };

  // Subcategories CRUD operations
  const handleCreateSubcategory = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setSubcategoryLoading(true);
    setSubcategoryError(null);
    setSubcategorySuccess(null);
    try {
      const token = getTokenFromCookies() || "";
      await postApiRequest(
        "/api/product-subcategories",
        token,
        subcategoryForm
      );
      setSubcategorySuccess("Subcategory created successfully!");
      setSubcategoryForm(initialSubcategoryForm);
      setCreateSubcategoryModalOpen(false);
      fetchSubcategories();
    } catch (err) {
      setSubcategoryError(
        (err as Error).message || "Failed to create subcategory"
      );
    } finally {
      setSubcategoryLoading(false);
    }
  };

  const handleEditSubcategory = (subcat: any) => {
    setEditingSubcategoryId(subcat._id);
    setEditSubcategoryForm({
      name: subcat.name,
      categoryTitle: subcat.categoryTitle,
      categoryId: subcat.categoryId,
      productType: subcat.productType,
    });
  };

  const handleEditSubcategorySave = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setSubcategoryLoading(true);
    setSubcategoryError(null);
    setSubcategorySuccess(null);
    try {
      const token = getTokenFromCookies() || "";
      await updateApiRequest(
        `/api/product-subcategories/${editingSubcategoryId}`,
        token,
        { name: editSubcategoryForm.name }
      );
      setSubcategorySuccess("Subcategory updated successfully!");
      setEditingSubcategoryId(null);
      fetchSubcategories();
    } catch (err) {
      setSubcategoryError(
        (err as Error).message || "Failed to update subcategory"
      );
    } finally {
      setSubcategoryLoading(false);
    }
  };

  const handleDeleteSubcategory = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    setSubcategoryLoading(true);
    setSubcategoryError(null);
    setSubcategorySuccess(null);
    try {
      const token = getTokenFromCookies() || "";
      await deleteApiRequest(`/api/product-subcategories/${id}`, token);
      setSubcategorySuccess("Subcategory deleted successfully!");
      fetchSubcategories();
    } catch (err) {
      setSubcategoryError(
        (err as Error).message || "Failed to delete subcategory"
      );
    } finally {
      setSubcategoryLoading(false);
    }
  };

  const handleRestoreSubcategory = async (id: string) => {
    setSubcategoryLoading(true);
    setSubcategoryError(null);
    setSubcategorySuccess(null);
    try {
      const token = getTokenFromCookies() || "";
      await updateApiRequest(
        `/api/product-subcategories/${id}/restore`,
        token,
        {}
      );
      setSubcategorySuccess("Subcategory restored successfully!");
      fetchSubcategories();
    } catch (err) {
      setSubcategoryError(
        (err as Error).message || "Failed to restore subcategory"
      );
    } finally {
      setSubcategoryLoading(false);
    }
  };

  const handleViewSubcategory = async (id: string) => {
    setSubcategoryLoading(true);
    setSubcategoryError(null);
    try {
      const token = getTokenFromCookies() || "";
      const res = await getApiRequest(
        `/api/product-subcategories/${id}`,
        token
      );
      setViewedSubcategory(res?.data?.data || null);
      setViewSubcategoryModalOpen(true);
    } catch (err) {
      setSubcategoryError(
        (err as Error).message || "Failed to fetch subcategory details"
      );
    } finally {
      setSubcategoryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Product Management
              </h1>
              <p className="text-gray-600">
                Manage product categories and subcategories
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
              <button
                onClick={() => setCreateSubcategoryModalOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Subcategory
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 mb-6">
          <div className="flex gap-2">
            <button
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "categories"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("categories")}
            >
              <div className="flex items-center justify-center gap-2">
                <Package className="w-4 h-4" />
                Categories ({categories.length + deletedCategories.length})
              </div>
            </button>
            <button
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "subcategories"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("subcategories")}
            >
              <div className="flex items-center justify-center gap-2">
                <Tag className="w-4 h-4" />
                Subcategories (
                {subcategories.length + deletedSubcategories.length})
              </div>
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {(success || error || subcategorySuccess || subcategoryError) && (
          <div className="mb-6">
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">{success}</span>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-medium">{error}</span>
              </div>
            )}
            {subcategorySuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  {subcategorySuccess}
                </span>
              </div>
            )}
            {subcategoryError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-medium">
                  {subcategoryError}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex gap-2">
                  <button
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      !showDeleted
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setShowDeleted(false)}
                  >
                    Active ({categories.length})
                  </button>
                  <button
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      showDeleted
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setShowDeleted(true)}
                  >
                    Deleted ({deletedCategories.length})
                  </button>
                </div>
                {!showDeleted && (
                  <div className="flex-1 max-w-xs">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Product Types</option>
                      {PRODUCT_TYPE_OPTIONS.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading categories...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(showDeleted ? deletedCategories : categories).map(
                        (cat) => (
                          <tr
                            key={cat._id}
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {cat.title}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {cat.productType}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {showDeleted ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Deleted
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                {showDeleted ? (
                                  <button
                                    onClick={() => handleRestore(cat._id)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                    title="Restore"
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleView(cat._id)}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                      title="View"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleEdit(cat)}
                                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                                      title="Edit"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDelete(cat._id, cat.title)
                                      }
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                      {(showDeleted ? deletedCategories : categories).length ===
                        0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-8 text-center text-gray-500"
                          >
                            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-lg font-medium">
                              No {showDeleted ? "deleted" : ""} categories found
                            </p>
                            <p className="text-sm">
                              Get started by creating your first category
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Subcategories Tab */}
        {activeTab === "subcategories" && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex gap-2">
                  <button
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      !showDeletedSubcategories
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setShowDeletedSubcategories(false)}
                  >
                    Active ({subcategories.length})
                  </button>
                  <button
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      showDeletedSubcategories
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setShowDeletedSubcategories(true)}
                  >
                    Deleted ({deletedSubcategories.length})
                  </button>
                </div>
                {!showDeletedSubcategories && (
                  <div className="flex gap-2 flex-1 max-w-md">
                    <select
                      value={filterSubcategoryType}
                      onChange={(e) => setFilterSubcategoryType(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Product Types</option>
                      {PRODUCT_TYPE_OPTIONS.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <select
                      value={filterSubcategoryCategory}
                      onChange={(e) =>
                        setFilterSubcategoryCategory(e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Categories</option>
                      {availableCategories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Subcategories List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {subcategoryLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading subcategories...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(showDeletedSubcategories
                        ? deletedSubcategories
                        : subcategories
                      ).map((subcat) => (
                        <tr
                          key={subcat._id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {subcat.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {subcat.categoryTitle}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {subcat.productType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {showDeletedSubcategories ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Deleted
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              {showDeletedSubcategories ? (
                                <button
                                  onClick={() =>
                                    handleRestoreSubcategory(subcat._id)
                                  }
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                  title="Restore"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() =>
                                      handleViewSubcategory(subcat._id)
                                    }
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                    title="View"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleEditSubcategory(subcat)
                                    }
                                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteSubcategory(
                                        subcat._id,
                                        subcat.name
                                      )
                                    }
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {(showDeletedSubcategories
                        ? deletedSubcategories
                        : subcategories
                      ).length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-8 text-center text-gray-500"
                          >
                            <Tag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-lg font-medium">
                              No {showDeletedSubcategories ? "deleted" : ""}{" "}
                              subcategories found
                            </p>
                            <p className="text-sm">
                              Get started by creating your first subcategory
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create Category Modal */}
        {createModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  Create Category
                </h2>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Type
                  </label>
                  <select
                    value={form.productType}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, productType: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Product Type</option>
                    {PRODUCT_TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter category title"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-xl transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Subcategory Modal */}
        {createSubcategoryModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  Create Subcategory
                </h2>
                <button
                  onClick={() => setCreateSubcategoryModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form
                onSubmit={handleCreateSubcategory}
                className="p-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={subcategoryForm.categoryId}
                    onChange={(e) => {
                      const selectedCategory = availableCategories.find(
                        (cat) => cat._id === e.target.value
                      );
                      setSubcategoryForm((f) => ({
                        ...f,
                        categoryId: e.target.value,
                        categoryTitle: selectedCategory?.title || "",
                        productType: selectedCategory?.productType || "",
                      }));
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {availableCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.title} ({cat.productType})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={subcategoryForm.name}
                    onChange={(e) =>
                      setSubcategoryForm((f) => ({
                        ...f,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter subcategory name"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setCreateSubcategoryModalOpen(false)}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-xl transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={subcategoryLoading}
                    className="flex-1 px-4 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {subcategoryLoading ? "Creating..." : "Create Subcategory"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Category Modal */}
        {viewModalOpen && viewedCategory && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  Category Details
                </h2>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      ID
                    </label>
                    <p className="text-sm text-gray-900 font-mono">
                      {viewedCategory._id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Title
                    </label>
                    <p className="text-sm text-gray-900">
                      {viewedCategory.title}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Product Type
                    </label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {viewedCategory.productType}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Status
                    </label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        viewedCategory.isDeleted
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {viewedCategory.isDeleted ? "Deleted" : "Active"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Created At
                    </label>
                    <p className="text-sm text-gray-900">
                      {viewedCategory.createdAt
                        ? new Date(viewedCategory.createdAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Updated At
                    </label>
                    <p className="text-sm text-gray-900">
                      {viewedCategory.updatedAt
                        ? new Date(viewedCategory.updatedAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>
                {viewedCategory.deletedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Deleted At
                    </label>
                    <p className="text-sm text-gray-900">
                      {new Date(viewedCategory.deletedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* View Subcategory Modal */}
        {viewSubcategoryModalOpen && viewedSubcategory && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  Subcategory Details
                </h2>
                <button
                  onClick={() => setViewSubcategoryModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      ID
                    </label>
                    <p className="text-sm text-gray-900 font-mono">
                      {viewedSubcategory._id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Name
                    </label>
                    <p className="text-sm text-gray-900">
                      {viewedSubcategory.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Category
                    </label>
                    <p className="text-sm text-gray-900">
                      {viewedSubcategory.categoryTitle}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Product Type
                    </label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {viewedSubcategory.productType}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Status
                    </label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        viewedSubcategory.isDeleted
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {viewedSubcategory.isDeleted ? "Deleted" : "Active"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Created At
                    </label>
                    <p className="text-sm text-gray-900">
                      {viewedSubcategory.createdAt
                        ? new Date(viewedSubcategory.createdAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Updated At
                    </label>
                    <p className="text-sm text-gray-900">
                      {viewedSubcategory.updatedAt
                        ? new Date(viewedSubcategory.updatedAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>
                {viewedSubcategory.deletedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Deleted At
                    </label>
                    <p className="text-sm text-gray-900">
                      {new Date(viewedSubcategory.deletedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
