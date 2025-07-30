"use client";
import React, { useEffect, useState } from "react";
import {
  getApiRequest,
  postApiRequest,
  updateApiRequest,
  deleteApiRequest,
} from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";

const initialForm = { title: "", productType: "" };
const initialSubcategoryForm = {
  name: "",
  categoryTitle: "",
  categoryId: "",
  productType: "",
};

const PRODUCT_TYPE_OPTIONS = [
  "AcademicService",
  "TrainingProgram",
  "Consultancy",
  "Inquiry",
  "AI/ML Service",
  "Marketing",
  "Free Support",
  "Demo Session",
  "Career Connect",
  "Cv Builder",
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
    // eslint-disable-next-line
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
      setSuccess("Category created");
      setForm(initialForm);
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
      setSuccess("Category updated");
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setError((err as Error).message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = getTokenFromCookies() || "";
      await deleteApiRequest(`/api/product-categories/${id}`, token);
      setSuccess("Category deleted");
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
      setSuccess("Category restored");
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
      setSubcategorySuccess("Subcategory created");
      setSubcategoryForm(initialSubcategoryForm);
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
      setSubcategorySuccess("Subcategory updated");
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

  const handleDeleteSubcategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?"))
      return;
    setSubcategoryLoading(true);
    setSubcategoryError(null);
    setSubcategorySuccess(null);
    try {
      const token = getTokenFromCookies() || "";
      await deleteApiRequest(`/api/product-subcategories/${id}`, token);
      setSubcategorySuccess("Subcategory deleted");
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
      setSubcategorySuccess("Subcategory restored");
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
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-4 border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "categories"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "subcategories"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("subcategories")}
        >
          Subcategories
        </button>
      </div>

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <>
          <div className="mb-4 flex items-center gap-4">
            <button
              className={`px-4 py-2 rounded ${
                !showDeleted ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setShowDeleted(false)}
            >
              Active Categories
            </button>
            <button
              className={`px-4 py-2 rounded ${
                showDeleted ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setShowDeleted(true)}
            >
              Deleted Categories
            </button>
            {!showDeleted && (
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border rounded p-2 ml-4"
              >
                <option value="">Filter by Product Type</option>
                {PRODUCT_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}
          </div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          {success && <div className="text-green-600 mb-2">{success}</div>}
          {loading && <div className="text-blue-600 mb-2">Loading...</div>}
          {!showDeleted && (
            <>
              <form
                onSubmit={handleCreate}
                className="mb-6 flex gap-4 items-end"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className="border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product Type
                  </label>
                  <select
                    value={form.productType}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, productType: e.target.value }))
                    }
                    className="border rounded p-2"
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
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  disabled={loading}
                >
                  Create
                </button>
              </form>
              <table className="w-full border mb-8">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Title</th>
                    <th className="p-2 border">Product Type</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) =>
                    editingId === cat._id ? (
                      <form key={cat._id} onSubmit={handleEditSave}>
                        <tr>
                          <td className="p-2 border">
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  title: e.target.value,
                                }))
                              }
                              className="border rounded p-1"
                            />
                          </td>
                          <td className="p-2 border">
                            <select
                              value={editForm.productType}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  productType: e.target.value,
                                }))
                              }
                              className="border rounded p-1"
                            >
                              <option value="">Select Product Type</option>
                              {PRODUCT_TYPE_OPTIONS.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2 border flex gap-2">
                            <button
                              type="submit"
                              className="px-2 py-1 bg-blue-600 text-white rounded"
                              disabled={loading}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-2 py-1 bg-gray-300 rounded"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      </form>
                    ) : (
                      <tr key={cat._id}>
                        <td className="p-2 border">{cat.title}</td>
                        <td className="p-2 border">{cat.productType}</td>
                        <td className="p-2 border flex gap-2">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="px-2 py-1 bg-yellow-500 text-white rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id)}
                            className="px-2 py-1 bg-red-600 text-white rounded"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleView(cat._id)}
                            className="px-2 py-1 bg-blue-500 text-white rounded"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center p-4 text-gray-500">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
          {showDeleted && (
            <table className="w-full border mb-8">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Product Type</th>
                  <th className="p-2 border">Deleted At</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deletedCategories.map((cat) => (
                  <tr key={cat._id}>
                    <td className="p-2 border">{cat.title}</td>
                    <td className="p-2 border">{cat.productType}</td>
                    <td className="p-2 border">
                      {cat.deletedAt
                        ? new Date(cat.deletedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleRestore(cat._id)}
                        className="px-2 py-1 bg-green-600 text-white rounded"
                        disabled={loading}
                      >
                        Restore
                      </button>
                    </td>
                  </tr>
                ))}
                {deletedCategories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-gray-500">
                      No deleted categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Subcategories Tab */}
      {activeTab === "subcategories" && (
        <>
          <div className="mb-4 flex items-center gap-4">
            <button
              className={`px-4 py-2 rounded ${
                !showDeletedSubcategories
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setShowDeletedSubcategories(false)}
            >
              Active Subcategories
            </button>
            <button
              className={`px-4 py-2 rounded ${
                showDeletedSubcategories
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setShowDeletedSubcategories(true)}
            >
              Deleted Subcategories
            </button>
            {!showDeletedSubcategories && (
              <>
                <input
                  type="text"
                  placeholder="Filter by Product Type"
                  value={filterSubcategoryType}
                  onChange={(e) => setFilterSubcategoryType(e.target.value)}
                  className="border rounded p-2"
                />
                <select
                  value={filterSubcategoryCategory}
                  onChange={(e) => setFilterSubcategoryCategory(e.target.value)}
                  className="border rounded p-2"
                >
                  <option value="">Filter by Category</option>
                  {availableCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
          {subcategoryError && (
            <div className="text-red-600 mb-2">{subcategoryError}</div>
          )}
          {subcategorySuccess && (
            <div className="text-green-600 mb-2">{subcategorySuccess}</div>
          )}
          {subcategoryLoading && (
            <div className="text-blue-600 mb-2">Loading...</div>
          )}
          {!showDeletedSubcategories && (
            <>
              <form
                onSubmit={handleCreateSubcategory}
                className="mb-6 flex gap-4 items-end"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={subcategoryForm.name}
                    onChange={(e) =>
                      setSubcategoryForm((f) => ({
                        ...f,
                        name: e.target.value,
                      }))
                    }
                    className="border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
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
                    className="border rounded p-2"
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
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  disabled={subcategoryLoading}
                >
                  Create
                </button>
              </form>
              <table className="w-full border mb-8">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Category</th>
                    <th className="p-2 border">Product Type</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subcategories.map((subcat) =>
                    editingSubcategoryId === subcat._id ? (
                      <form
                        key={subcat._id}
                        onSubmit={handleEditSubcategorySave}
                      >
                        <tr>
                          <td className="p-2 border">
                            <input
                              type="text"
                              value={editSubcategoryForm.name}
                              onChange={(e) =>
                                setEditSubcategoryForm((f) => ({
                                  ...f,
                                  name: e.target.value,
                                }))
                              }
                              className="border rounded p-1"
                            />
                          </td>
                          <td className="p-2 border">{subcat.categoryTitle}</td>
                          <td className="p-2 border">{subcat.productType}</td>
                          <td className="p-2 border flex gap-2">
                            <button
                              type="submit"
                              className="px-2 py-1 bg-blue-600 text-white rounded"
                              disabled={subcategoryLoading}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingSubcategoryId(null)}
                              className="px-2 py-1 bg-gray-300 rounded"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      </form>
                    ) : (
                      <tr key={subcat._id}>
                        <td className="p-2 border">{subcat.name}</td>
                        <td className="p-2 border">{subcat.categoryTitle}</td>
                        <td className="p-2 border">{subcat.productType}</td>
                        <td className="p-2 border flex gap-2">
                          <button
                            onClick={() => handleEditSubcategory(subcat)}
                            className="px-2 py-1 bg-yellow-500 text-white rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSubcategory(subcat._id)}
                            className="px-2 py-1 bg-red-600 text-white rounded"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleViewSubcategory(subcat._id)}
                            className="px-2 py-1 bg-blue-500 text-white rounded"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                  {subcategories.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center p-4 text-gray-500">
                        No subcategories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
          {showDeletedSubcategories && (
            <table className="w-full border mb-8">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Product Type</th>
                  <th className="p-2 border">Deleted At</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deletedSubcategories.map((subcat) => (
                  <tr key={subcat._id}>
                    <td className="p-2 border">{subcat.name}</td>
                    <td className="p-2 border">{subcat.categoryTitle}</td>
                    <td className="p-2 border">{subcat.productType}</td>
                    <td className="p-2 border">
                      {subcat.deletedAt
                        ? new Date(subcat.deletedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleRestoreSubcategory(subcat._id)}
                        className="px-2 py-1 bg-green-600 text-white rounded"
                        disabled={subcategoryLoading}
                      >
                        Restore
                      </button>
                    </td>
                  </tr>
                ))}
                {deletedSubcategories.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-gray-500">
                      No deleted subcategories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Category View Modal */}
      {viewModalOpen && viewedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 min-w-[300px] relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setViewModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-2">Category Details</h2>
            <div className="mb-2">
              <b>ID:</b> {viewedCategory._id}
            </div>
            <div className="mb-2">
              <b>Title:</b> {viewedCategory.title}
            </div>
            <div className="mb-2">
              <b>Product Type:</b> {viewedCategory.productType}
            </div>
            <div className="mb-2">
              <b>isDeleted:</b> {viewedCategory.isDeleted ? "Yes" : "No"}
            </div>
            <div className="mb-2">
              <b>Created At:</b>{" "}
              {viewedCategory.createdAt
                ? new Date(viewedCategory.createdAt).toLocaleString()
                : "-"}
            </div>
            <div className="mb-2">
              <b>Updated At:</b>{" "}
              {viewedCategory.updatedAt
                ? new Date(viewedCategory.updatedAt).toLocaleString()
                : "-"}
            </div>
            {viewedCategory.deletedAt && (
              <div className="mb-2">
                <b>Deleted At:</b>{" "}
                {new Date(viewedCategory.deletedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subcategory View Modal */}
      {viewSubcategoryModalOpen && viewedSubcategory && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 min-w-[300px] relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setViewSubcategoryModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-2">Subcategory Details</h2>
            <div className="mb-2">
              <b>ID:</b> {viewedSubcategory._id}
            </div>
            <div className="mb-2">
              <b>Name:</b> {viewedSubcategory.name}
            </div>
            <div className="mb-2">
              <b>Category Title:</b> {viewedSubcategory.categoryTitle}
            </div>
            <div className="mb-2">
              <b>Category ID:</b> {viewedSubcategory.categoryId}
            </div>
            <div className="mb-2">
              <b>Product Type:</b> {viewedSubcategory.productType}
            </div>
            <div className="mb-2">
              <b>isDeleted:</b> {viewedSubcategory.isDeleted ? "Yes" : "No"}
            </div>
            <div className="mb-2">
              <b>Created At:</b>{" "}
              {viewedSubcategory.createdAt
                ? new Date(viewedSubcategory.createdAt).toLocaleString()
                : "-"}
            </div>
            <div className="mb-2">
              <b>Updated At:</b>{" "}
              {viewedSubcategory.updatedAt
                ? new Date(viewedSubcategory.updatedAt).toLocaleString()
                : "-"}
            </div>
            {viewedSubcategory.deletedAt && (
              <div className="mb-2">
                <b>Deleted At:</b>{" "}
                {new Date(viewedSubcategory.deletedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
