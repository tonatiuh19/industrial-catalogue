import React, { createContext, useContext, useReducer } from "react";
import { AdminAppState, initialAdminAppState } from "./adminState";
import { AdminAction } from "./adminActions";
import { adminReducer } from "./adminReducer";
import {
  adminProductsApi,
  adminQuotesApi,
  adminUsersApi,
  adminContentApi,
} from "@/services/admin.service";
import {
  categoriesApi,
  manufacturersApi,
  brandsApi,
  modelsApi,
} from "@/services/api.service";
import { uploadImages, deleteImage } from "@/services/image-upload.service";

interface AdminStoreContextType {
  state: AdminAppState;
  dispatch: React.Dispatch<AdminAction>;

  // Products Actions
  fetchAdminProducts: (page?: number, limit?: number) => Promise<void>;
  fetchAdminProduct: (id: number) => Promise<void>;
  createAdminProduct: (data: any) => Promise<void>;
  updateAdminProduct: (id: number, data: any) => Promise<void>;
  deleteAdminProduct: (id: number) => Promise<void>;
  uploadProductImages: (
    productId: string | number,
    mainImage?: File,
    extraImages?: File[],
  ) => Promise<any>;
  deleteProductImage: (
    productId: string | number,
    filename: string,
    imageType: "main" | "extra",
  ) => Promise<void>;

  // Quotes Actions
  fetchAdminQuotes: (
    page?: number,
    limit?: number,
    status?: string,
  ) => Promise<void>;
  fetchAdminQuote: (id: number) => Promise<void>;
  updateQuoteStatus: (
    id: number,
    status: string,
    notes?: string,
  ) => Promise<void>;

  // Users Actions
  fetchAdminUsers: () => Promise<void>;
  fetchAdminUser: (id: number) => Promise<void>;
  createAdminUser: (data: any) => Promise<void>;
  updateAdminUser: (id: number, data: any) => Promise<void>;
  deleteAdminUser: (id: number) => Promise<void>;

  // Content Actions
  fetchContentPages: () => Promise<void>;
  fetchContentPage: (slug: string) => Promise<void>;
  updateContentPage: (slug: string, data: any) => Promise<void>;

  // Reference Data Actions
  fetchCategories: () => Promise<void>;
  fetchManufacturers: () => Promise<void>;
  fetchBrands: (manufacturerId?: number) => Promise<void>;
  fetchModels: (brandId?: number) => Promise<void>;
  fetchAllReferenceData: () => Promise<void>;
}

const AdminStoreContext = createContext<AdminStoreContextType | undefined>(
  undefined,
);

export const AdminStoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(adminReducer, initialAdminAppState);

  // Products Actions
  const fetchAdminProducts = async (page = 1, limit = 20) => {
    try {
      dispatch({
        type: "ADMIN_PRODUCTS_LOADING",
        payload: "Loading products...",
      });
      const response = await adminProductsApi.getAll({ page, limit });
      console.log("Admin products API response:", response);

      // Handle API response structure: { success: true, data: [...products], pagination: {...} }
      const products = Array.isArray(response.data) ? response.data : [];
      const total = response.pagination?.total || 0;

      dispatch({
        type: "ADMIN_PRODUCTS_SUCCESS",
        payload: {
          products,
          total,
        },
      });
    } catch (error: any) {
      console.error("Admin products fetch error:", error);
      dispatch({
        type: "ADMIN_PRODUCTS_ERROR",
        payload: error.message || "Failed to fetch products",
      });
      throw error;
    }
  };

  const fetchAdminProduct = async (id: number) => {
    try {
      dispatch({
        type: "ADMIN_PRODUCTS_LOADING",
        payload: "Loading product...",
      });
      const response = await adminProductsApi.getById(id);
      dispatch({ type: "ADMIN_PRODUCT_SELECTED", payload: response.data });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_PRODUCTS_ERROR",
        payload: error.message || "Failed to fetch product",
      });
      throw error;
    }
  };

  const createAdminProduct = async (data: any) => {
    try {
      dispatch({
        type: "ADMIN_PRODUCTS_LOADING",
        payload: "Creating product...",
      });
      const response = await adminProductsApi.create(data);
      dispatch({ type: "ADMIN_PRODUCT_CREATED", payload: response.data });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_PRODUCTS_ERROR",
        payload: error.message || "Failed to create product",
      });
      throw error;
    }
  };

  const updateAdminProduct = async (id: number, data: any) => {
    try {
      dispatch({
        type: "ADMIN_PRODUCTS_LOADING",
        payload: "Updating product...",
      });
      await adminProductsApi.update(id, data);
      dispatch({ type: "ADMIN_PRODUCT_UPDATED", payload: { id, ...data } });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_PRODUCTS_ERROR",
        payload: error.message || "Failed to update product",
      });
      throw error;
    }
  };

  const deleteAdminProduct = async (id: number) => {
    try {
      dispatch({
        type: "ADMIN_PRODUCTS_LOADING",
        payload: "Deleting product...",
      });
      await adminProductsApi.delete(id);
      dispatch({ type: "ADMIN_PRODUCT_DELETED", payload: id });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_PRODUCTS_ERROR",
        payload: error.message || "Failed to delete product",
      });
      throw error;
    }
  };

  const uploadProductImages = async (
    productId: string | number,
    mainImage?: File,
    extraImages?: File[],
  ) => {
    try {
      dispatch({
        type: "ADMIN_PRODUCT_IMAGES_LOADING",
        payload: "Uploading images...",
      });
      const result = await uploadImages(productId, mainImage, extraImages);

      if (result.success) {
        dispatch({
          type: "ADMIN_PRODUCT_IMAGES_SUCCESS",
          payload: "Images uploaded successfully",
        });
      } else {
        dispatch({
          type: "ADMIN_PRODUCT_IMAGES_ERROR",
          payload: result.error || "Failed to upload images",
        });
      }

      return result;
    } catch (error: any) {
      dispatch({
        type: "ADMIN_PRODUCT_IMAGES_ERROR",
        payload: error.message || "Failed to upload images",
      });
      throw error;
    }
  };

  const deleteProductImage = async (
    productId: string | number,
    filename: string,
    imageType: "main" | "extra",
  ) => {
    try {
      dispatch({
        type: "ADMIN_PRODUCT_IMAGES_LOADING",
        payload: "Deleting image...",
      });
      const result = await deleteImage(productId, filename, imageType);

      if (result.success) {
        dispatch({
          type: "ADMIN_PRODUCT_IMAGES_SUCCESS",
          payload: "Image deleted successfully",
        });
      } else {
        dispatch({
          type: "ADMIN_PRODUCT_IMAGES_ERROR",
          payload: result.error || "Failed to delete image",
        });
      }
    } catch (error: any) {
      dispatch({
        type: "ADMIN_PRODUCT_IMAGES_ERROR",
        payload: error.message || "Failed to delete image",
      });
      throw error;
    }
  };

  // Quotes Actions
  const fetchAdminQuotes = async (page = 1, limit = 20, status?: string) => {
    try {
      dispatch({ type: "ADMIN_QUOTES_LOADING", payload: "Loading quotes..." });
      const response = await adminQuotesApi.getAll({ page, limit, status });
      dispatch({
        type: "ADMIN_QUOTES_SUCCESS",
        payload: {
          quotes: response.data.quotes,
          total: response.data.pagination?.total,
        },
      });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_QUOTES_ERROR",
        payload: error.message || "Failed to fetch quotes",
      });
      throw error;
    }
  };

  const fetchAdminQuote = async (id: number) => {
    try {
      dispatch({ type: "ADMIN_QUOTES_LOADING", payload: "Loading quote..." });
      const response = await adminQuotesApi.getById(id);
      dispatch({ type: "ADMIN_QUOTE_SELECTED", payload: response.data });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_QUOTES_ERROR",
        payload: error.message || "Failed to fetch quote",
      });
      throw error;
    }
  };

  const updateQuoteStatus = async (
    id: number,
    status: string,
    notes?: string,
  ) => {
    try {
      dispatch({ type: "ADMIN_QUOTES_LOADING", payload: "Updating quote..." });
      const response = await adminQuotesApi.updateStatus(id, {
        status,
        admin_notes: notes,
      });
      dispatch({ type: "ADMIN_QUOTE_UPDATED", payload: response.data });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_QUOTES_ERROR",
        payload: error.message || "Failed to update quote",
      });
      throw error;
    }
  };

  // Users Actions
  const fetchAdminUsers = async () => {
    try {
      dispatch({ type: "ADMIN_USERS_LOADING", payload: "Loading users..." });
      const response = await adminUsersApi.getAll();
      dispatch({ type: "ADMIN_USERS_SUCCESS", payload: response.data });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_USERS_ERROR",
        payload: error.message || "Failed to fetch users",
      });
      throw error;
    }
  };

  const fetchAdminUser = async (id: number) => {
    try {
      dispatch({ type: "ADMIN_USERS_LOADING", payload: "Loading user..." });
      const response = await adminUsersApi.getById(id);
      dispatch({ type: "ADMIN_USER_SELECTED", payload: response.data });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_USERS_ERROR",
        payload: error.message || "Failed to fetch user",
      });
      throw error;
    }
  };

  const createAdminUser = async (data: any) => {
    try {
      dispatch({ type: "ADMIN_USERS_LOADING", payload: "Creating user..." });
      const response = await adminUsersApi.create(data);
      dispatch({ type: "ADMIN_USER_CREATED", payload: response.data });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_USERS_ERROR",
        payload: error.message || "Failed to create user",
      });
      throw error;
    }
  };

  const updateAdminUser = async (id: number, data: any) => {
    try {
      dispatch({ type: "ADMIN_USERS_LOADING", payload: "Updating user..." });
      await adminUsersApi.update(id, data);
      dispatch({ type: "ADMIN_USER_UPDATED", payload: { id, ...data } });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_USERS_ERROR",
        payload: error.message || "Failed to update user",
      });
      throw error;
    }
  };

  const deleteAdminUser = async (id: number) => {
    try {
      dispatch({ type: "ADMIN_USERS_LOADING", payload: "Deleting user..." });
      await adminUsersApi.delete(id);
      dispatch({ type: "ADMIN_USER_DELETED", payload: id });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_USERS_ERROR",
        payload: error.message || "Failed to delete user",
      });
      throw error;
    }
  };

  // Content Actions
  const fetchContentPages = async () => {
    try {
      dispatch({
        type: "ADMIN_CONTENT_LOADING",
        payload: "Loading content pages...",
      });
      const response = await adminContentApi.getAll();
      dispatch({ type: "ADMIN_CONTENT_SUCCESS", payload: response.data });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_CONTENT_ERROR",
        payload: error.message || "Failed to fetch content pages",
      });
      throw error;
    }
  };

  const fetchContentPage = async (slug: string) => {
    try {
      dispatch({ type: "ADMIN_CONTENT_LOADING", payload: "Loading page..." });
      const response = await adminContentApi.getBySlug(slug);
      dispatch({ type: "ADMIN_CONTENT_PAGE_SELECTED", payload: response.data });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_CONTENT_ERROR",
        payload: error.message || "Failed to fetch page",
      });
      throw error;
    }
  };

  const updateContentPage = async (slug: string, data: any) => {
    try {
      dispatch({ type: "ADMIN_CONTENT_LOADING", payload: "Updating page..." });
      await adminContentApi.update(slug, data);
      dispatch({
        type: "ADMIN_CONTENT_PAGE_UPDATED",
        payload: { slug, ...data },
      });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_CONTENT_ERROR",
        payload: error.message || "Failed to update page",
      });
      throw error;
    }
  };

  // Reference Data Actions
  const fetchCategories = async () => {
    try {
      dispatch({
        type: "ADMIN_REFERENCE_LOADING",
        payload: "Loading categories...",
      });
      const response = await categoriesApi.getAll(true);
      const categories = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : [];
      dispatch({ type: "ADMIN_CATEGORIES_SUCCESS", payload: categories });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_REFERENCE_ERROR",
        payload: error.message || "Failed to fetch categories",
      });
      throw error;
    }
  };

  const fetchManufacturers = async () => {
    try {
      dispatch({
        type: "ADMIN_REFERENCE_LOADING",
        payload: "Loading manufacturers...",
      });
      const response = await manufacturersApi.getAll(true);
      const manufacturers = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : [];
      dispatch({ type: "ADMIN_MANUFACTURERS_SUCCESS", payload: manufacturers });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_REFERENCE_ERROR",
        payload: error.message || "Failed to fetch manufacturers",
      });
      throw error;
    }
  };

  const fetchBrands = async (manufacturerId?: number) => {
    try {
      dispatch({
        type: "ADMIN_REFERENCE_LOADING",
        payload: "Loading brands...",
      });
      const params = manufacturerId ? { manufacturer_id: manufacturerId } : {};
      const response = await brandsApi.getAll(params);
      const brands = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : [];
      dispatch({ type: "ADMIN_BRANDS_SUCCESS", payload: brands });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_REFERENCE_ERROR",
        payload: error.message || "Failed to fetch brands",
      });
      throw error;
    }
  };

  const fetchModels = async (brandId?: number) => {
    try {
      dispatch({
        type: "ADMIN_REFERENCE_LOADING",
        payload: "Loading models...",
      });
      const params = brandId ? { brand_id: brandId } : {};
      const response = await modelsApi.getAll(params);
      const models = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : [];
      dispatch({ type: "ADMIN_MODELS_SUCCESS", payload: models });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_REFERENCE_ERROR",
        payload: error.message || "Failed to fetch models",
      });
      throw error;
    }
  };

  const fetchAllReferenceData = async () => {
    try {
      await Promise.all([
        fetchCategories(),
        fetchManufacturers(),
        fetchBrands(),
        fetchModels(),
      ]);
    } catch (error: any) {
      console.error("Error loading reference data:", error);
    }
  };

  const value: AdminStoreContextType = {
    state,
    dispatch,
    fetchAdminProducts,
    fetchAdminProduct,
    createAdminProduct,
    updateAdminProduct,
    deleteAdminProduct,
    uploadProductImages,
    deleteProductImage,
    fetchAdminQuotes,
    fetchAdminQuote,
    updateQuoteStatus,
    fetchAdminUsers,
    fetchAdminUser,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    fetchContentPages,
    fetchContentPage,
    updateContentPage,
    fetchCategories,
    fetchManufacturers,
    fetchBrands,
    fetchModels,
    fetchAllReferenceData,
  };

  return (
    <AdminStoreContext.Provider value={value}>
      {children}
    </AdminStoreContext.Provider>
  );
};

export const useAdminStore = () => {
  const context = useContext(AdminStoreContext);
  if (context === undefined) {
    throw new Error("useAdminStore must be used within an AdminStoreProvider");
  }
  return context;
};
