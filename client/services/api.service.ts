import { httpClient } from "../lib/http-client";
import type {
  Product,
  ProductListResponse,
  Category,
  CategoryListResponse,
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
};

// Manufacturers API
export const manufacturersApi = {
  getAll: (includeInactive?: boolean) => {
    const params = includeInactive ? "?include_inactive=true" : "";
    return httpClient.get<ManufacturerListResponse>(`/manufacturers${params}`);
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
