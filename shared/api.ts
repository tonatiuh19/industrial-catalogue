/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

// ============================================
// Database Entity Types
// ============================================

export interface Category {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  parent_id: number | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Manufacturer {
  id: number;
  name: string;
  description: string | null;
  website: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  name: string;
  manufacturer_id: number | null;
  description: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  manufacturer_name?: string;
}

export interface Model {
  id: number;
  name: string;
  brand_id: number;
  description: string | null;
  specifications: Record<string, any> | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  brand_name?: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  long_description: string | null;
  category_id: number;
  manufacturer_id: number | null;
  brand_id: number | null;
  model_id: number | null;
  price: number;
  currency: string;
  stock_quantity: number;
  min_stock_level: number;
  unit: string;
  // Legacy text fields (keep for backward compatibility)
  manufacturer: string | null;
  brand: string | null;
  model: string | null;
  specifications: Record<string, any> | null;
  images: string[] | null;
  main_image: string | null;
  extra_images: string | null;
  is_featured: boolean;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  category?: string;
  category_name?: string;
  manufacturer_name?: string;
  brand_name?: string;
  model_name?: string;
}

export interface Quote {
  id: number;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_company: string | null;
  customer_message: string | null;
  status:
    | "pending"
    | "processing"
    | "sent"
    | "accepted"
    | "rejected"
    | "expired";
  total_items: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  items?: QuoteItem[];
}

export interface QuoteItem {
  id: number;
  quote_id: number;
  product_id: number;
  quantity: number;
  unit_price: number | null;
  notes: string | null;
  created_at: string;
  // Joined fields
  product_name?: string;
  product_sku?: string;
}

// ============================================
// API Request Types
// ============================================

export interface CreateProductRequest {
  sku: string;
  name: string;
  description?: string;
  long_description?: string;
  category_id: number;
  manufacturer_id?: number;
  brand_id?: number;
  model_id?: number;
  price?: number;
  currency?: string;
  stock_quantity?: number;
  unit?: string;
  // Legacy text fields (optional for backward compatibility)
  manufacturer?: string;
  brand?: string;
  model?: string;
  specifications?: Record<string, any>;
  images?: string[];
  main_image?: string;
  extra_images?: string;
  is_featured?: boolean;
  is_active?: boolean;
  meta_title?: string;
  meta_description?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number;
}

export interface CreateQuoteRequest {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_company?: string;
  customer_message?: string;
  items: Array<{
    product_id: number;
    quantity: number;
    notes?: string;
  }>;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductListResponse extends PaginatedResponse<Product> {}

export interface QuoteListResponse extends PaginatedResponse<Quote> {}

export interface CategoryListResponse {
  success: boolean;
  data: Category[];
}

export interface ManufacturerListResponse {
  success: boolean;
  data: Manufacturer[];
}

export interface BrandListResponse {
  success: boolean;
  data: Brand[];
}

export interface ModelListResponse {
  success: boolean;
  data: Model[];
}

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}
