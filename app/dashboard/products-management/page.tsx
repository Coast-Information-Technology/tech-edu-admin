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

export default function ProductCategoriesManagement() {
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

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, [showDeleted, filterType]);

  // Create category
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

  // Edit category
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

  // Delete (soft)
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

  // Restore
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

  // View by ID
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

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Product Categories Management</h1>
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
          <input
            type="text"
            placeholder="Filter by Product Type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded p-2 ml-4"
          />
        )}
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {loading && <div className="text-blue-600 mb-2">Loading...</div>}
      {!showDeleted && (
        <>
          <form onSubmit={handleCreate} className="mb-6 flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
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
              <input
                type="text"
                value={form.productType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, productType: e.target.value }))
                }
                className="border rounded p-2"
                required
              />
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
                        <input
                          type="text"
                          value={editForm.productType}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              productType: e.target.value,
                            }))
                          }
                          className="border rounded p-1"
                        />
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
      {/* View Modal/Section */}
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
    </div>
  );
}
