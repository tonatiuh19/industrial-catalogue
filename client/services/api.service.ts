import { httpClient } from "../lib/http-client";
import type {
  Product,
  ProductListResponse,
  Category,
  CategoryListResponse,
  Subcategory,
  SubcategoryListResponse,
  Manufacturer,
  ManufacturerListResponse,
  Brand,
  BrandListResponse,
  Model,
  ModelListResponse,
  CreateQuoteRequest,
  ApiResponse,
} from "@shared/api";

// Products API
export const productsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category_id?: number;
    manufacturer_id?: number;
    brand_id?: number;
    model_id?: number;
    is_featured?: boolean;
    is_active?: boolean;
    search?: string;
    min_price?: number;
    max_price?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return httpClient.get<ProductListResponse>(
      `/products?${queryParams.toString()}`,
    );
  },

  getById: (id: number) => {
    return httpClient.get<ApiResponse<Product>>(`/products/${id}`);
  },

  create: (data: Partial<Product>) => {
    return httpClient.post<ApiResponse<{ id: number }>>("/products", data);
  },

  update: (id: number, data: Partial<Product>) => {
    return httpClient.put<ApiResponse>(`/products/${id}`, data);
  },

  delete: (id: number) => {
    return httpClient.delete<ApiResponse>(`/products/${id}`);
  },
};

// Categories API
export const categoriesApi = {
  getAll: (includeInactive?: boolean) => {
    const params = includeInactive ? "?include_inactive=true" : "";
    return httpClient.get<CategoryListResponse>(`/categories${params}`);
  },
  create: (data: { name: string; slug: string; description?: string }) => {
    return httpClient.post("/admin/categories", data);
  },
  update: (
    id: number,
    data: {
      name: string;
      slug: string;
      description?: string;
      is_active?: boolean;
    },
  ) => {
    return httpClient.put<ApiResponse>(`/admin/categories/${id}`, data);
  },
  delete: (id: number) => {
    return httpClient.delete<ApiResponse>(`/admin/categories/${id}`);
  },
  validateSlug: (slug: string) => {
    return httpClient.get<{ available: boolean }>(
      `/categories/validate-slug?slug=${slug}`,
    );
  },
};

// Subcategories API
export const subcategoriesApi = {
  getAll: (params?: { category_id?: number; include_inactive?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.category_id) {
      queryParams.append("category_id", params.category_id.toString());
    }
    if (params?.include_inactive) {
      queryParams.append("include_inactive", "true");
    }
    return httpClient.get<SubcategoryListResponse>(
      `/admin/subcategories?${queryParams.toString()}`,
    );
  },
  create: (data: {
    name: string;
    slug: string;
    category_id: number;
    description?: string;
  }) => {
    return httpClient
      .post("/admin/subcategories", data)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error("[subcategoriesApi] create error:", error);
        throw error;
      });
  },
  update: (
    id: number,
    data: {
      name: string;
      category_id: number;
      slug?: string;
      description?: string;
      is_active?: boolean;
    },
  ) => {
    return httpClient
      .put<ApiResponse>(`/admin/subcategories/${id}`, data)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(`[subcategoriesApi] update error for id ${id}:`, error);
        throw error;
      });
  },
  delete: (id: number) => {
    return httpClient.delete<ApiResponse>(`/admin/subcategories/${id}`);
  },
};

// Manufacturers API
export const manufacturersApi = {
  getAll: (includeInactive?: boolean) => {
    const params = includeInactive ? "?include_inactive=true" : "";
    return httpClient.get<ManufacturerListResponse>(`/manufacturers${params}`);
  },
  create: (data: { name: string; description?: string; website?: string }) => {
    return httpClient.post("/admin/manufacturers", data);
  },
  update: (
    id: number,
    data: {
      name: string;
      description?: string;
      website?: string;
      is_active?: boolean;
    },
  ) => {
    return httpClient.put<ApiResponse>(`/admin/manufacturers/${id}`, data);
  },
  delete: (id: number) => {
    return httpClient.delete<ApiResponse>(`/admin/manufacturers/${id}`);
  },
};

// Brands API
export const brandsApi = {
  getAll: (params?: {
    manufacturer_id?: number;
    include_inactive?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.manufacturer_id) {
      queryParams.append("manufacturer_id", params.manufacturer_id.toString());
    }
    if (params?.include_inactive) {
      queryParams.append("include_inactive", "true");
    }
    return httpClient.get<BrandListResponse>(
      `/brands?${queryParams.toString()}`,
    );
  },
  create: (data: {
    name: string;
    manufacturer_id?: number | null;
    category_ids?: number[];
    description?: string;
  }) => {
    return httpClient.post("/admin/brands", data);
  },
  update: (
    id: number,
    data: {
      name: string;
      manufacturer_id?: number | null;
      category_ids?: number[];
      description?: string;
      is_active?: boolean;
    },
  ) => {
    return httpClient.put<ApiResponse>(`/admin/brands/${id}`, data);
  },
  delete: (id: number) => {
    return httpClient.delete<ApiResponse>(`/admin/brands/${id}`);
  },
};

// Models API
export const modelsApi = {
  getAll: (params?: { brand_id?: number; include_inactive?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.brand_id) {
      queryParams.append("brand_id", params.brand_id.toString());
    }
    if (params?.include_inactive) {
      queryParams.append("include_inactive", "true");
    }
    return httpClient.get<ModelListResponse>(
      `/models?${queryParams.toString()}`,
    );
  },
  create: (data: { name: string; brand_id: number; description?: string }) => {
    return httpClient.post("/admin/models", data);
  },
  update: (
    id: number,
    data: {
      name: string;
      brand_id: number;
      description?: string;
      is_active?: boolean;
    },
  ) => {
    return httpClient.put<ApiResponse>(`/admin/models/${id}`, data);
  },
  delete: (id: number) => {
    return httpClient.delete<ApiResponse>(`/admin/models/${id}`);
  },
};

// Quotes API
export const quotesApi = {
  create: (data: CreateQuoteRequest) => {
    return httpClient.post<ApiResponse<{ id: number; quote_number: string }>>(
      "/quotes",
      data,
    );
  },

  getAll: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    customer_email?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return httpClient.get(`/quotes?${queryParams.toString()}`);
  },

  getById: (id: number) => {
    return httpClient.get(`/quotes/${id}`);
  },
};

// Home Sections API
export const homeSectionsApi = {
  getRandomSections: (count: number = 3, excludeTypes?: string[]) => {
    const params = new URLSearchParams({ count: count.toString() });
    if (excludeTypes && excludeTypes.length > 0) {
      params.set("exclude_types", excludeTypes.join(","));
    }
    return httpClient.get<ApiResponse<any[]>>(
      `/home/sections?${params.toString()}`,
    );
  },
};

// Catalog API
export const catalogApi = {
  getCatalogData: (params?: {
    type?: string;
    id?: number;
    category_id?: number;
    subcategory_id?: number;
    brand_id?: number;
    manufacturer_id?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return httpClient.get<ApiResponse<any>>(
      `/catalog?${queryParams.toString()}`,
    );
  },
};
