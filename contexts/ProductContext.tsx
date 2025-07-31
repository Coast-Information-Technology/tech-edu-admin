"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { getApiRequest, postApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";

// Types
interface Category {
  _id: string;
  title: string;
  productType: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Subcategory {
  _id: string;
  name: string;
  categoryTitle: string;
  categoryId: string;
  productType: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductContextType {
  // Categories
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  fetchCategories: (productType: string) => Promise<void>;
  createCategory: (
    title: string,
    productType: string
  ) => Promise<Category | null>;

  // Subcategories
  subcategories: Subcategory[];
  subcategoriesLoading: boolean;
  subcategoriesError: string | null;
  fetchSubcategories: (
    categoryTitle: string,
    productType: string
  ) => Promise<void>;
  createSubcategory: (
    name: string,
    categoryTitle: string,
    categoryId: string,
    productType: string
  ) => Promise<Subcategory | null>;

  // Clear functions
  clearCategories: () => void;
  clearSubcategories: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Subcategories state
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
  const [subcategoriesError, setSubcategoriesError] = useState<string | null>(
    null
  );

  // Fetch categories
  const fetchCategories = useCallback(async (productType: string) => {
    if (!productType) {
      setCategories([]);
      return;
    }

    setCategoriesLoading(true);
    setCategoriesError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await getApiRequest(
        `/api/product-categories?productType=${encodeURIComponent(
          productType
        )}`,
        token
      );

      if (response.status === 200) {
        const activeCategories =
          response.data?.data?.categories || response.data?.categories || [];
        setCategories(activeCategories);
      } else {
        throw new Error(response.message || "Failed to fetch categories");
      }
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      setCategoriesError(error.message || "Failed to fetch categories");
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Create new category
  const createCategory = useCallback(
    async (title: string, productType: string): Promise<Category | null> => {
      try {
        const token = getTokenFromCookies();
        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await postApiRequest(
          "/api/product-categories",
          token,
          {
            title: title.trim(),
            productType,
          }
        );

        if (response.status === 201 || response.status === 200) {
          const newCategory = response.data;

          // Add to local state
          setCategories((prev) => [...prev, newCategory]);

          toast.success("Category created successfully!");
          return newCategory;
        } else {
          throw new Error(response.message || "Failed to create category");
        }
      } catch (error: any) {
        console.error("Error creating category:", error);
        toast.error(error.message || "Failed to create category");
        return null;
      }
    },
    []
  );

  // Fetch subcategories
  const fetchSubcategories = useCallback(
    async (categoryTitle: string, productType: string) => {
      if (!categoryTitle || !productType) {
        setSubcategories([]);
        return;
      }

      setSubcategoriesLoading(true);
      setSubcategoriesError(null);

      try {
        const token = getTokenFromCookies();
        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await getApiRequest(
          `/api/product-subcategories?categoryTitle=${encodeURIComponent(
            categoryTitle
          )}&productType=${encodeURIComponent(productType)}`,
          token
        );

        if (response.status === 200) {
          const activeSubcategories =
            response.data?.data?.subcategories ||
            response.data?.subcategories ||
            [];
          setSubcategories(activeSubcategories);
        } else {
          throw new Error(response.message || "Failed to fetch subcategories");
        }
      } catch (error: any) {
        console.error("Error fetching subcategories:", error);
        setSubcategoriesError(error.message || "Failed to fetch subcategories");
        setSubcategories([]);
      } finally {
        setSubcategoriesLoading(false);
      }
    },
    []
  );

  // Create new subcategory
  const createSubcategory = useCallback(
    async (
      name: string,
      categoryTitle: string,
      categoryId: string,
      productType: string
    ): Promise<Subcategory | null> => {
      try {
        const token = getTokenFromCookies();
        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await postApiRequest(
          "/api/product-subcategories",
          token,
          {
            name: name.trim(),
            categoryTitle,
            categoryId,
            productType,
          }
        );

        if (response.status === 201 || response.status === 200) {
          const newSubcategory = response.data;

          // Add to local state
          setSubcategories((prev) => [...prev, newSubcategory]);

          toast.success("Subcategory created successfully!");
          return newSubcategory;
        } else {
          throw new Error(response.message || "Failed to create subcategory");
        }
      } catch (error: any) {
        console.error("Error creating subcategory:", error);
        toast.error(error.message || "Failed to create subcategory");
        return null;
      }
    },
    []
  );

  // Clear functions
  const clearCategories = useCallback(() => {
    setCategories([]);
    setCategoriesError(null);
  }, []);

  const clearSubcategories = useCallback(() => {
    setSubcategories([]);
    setSubcategoriesError(null);
  }, []);

  const value: ProductContextType = {
    // Categories
    categories,
    categoriesLoading,
    categoriesError,
    fetchCategories,
    createCategory,

    // Subcategories
    subcategories,
    subcategoriesLoading,
    subcategoriesError,
    fetchSubcategories,
    createSubcategory,

    // Clear functions
    clearCategories,
    clearSubcategories,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
