// Admin-specific state types
export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  model: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  brand_id: number;
  manufacturer_id: number;
  category_name?: string;
  brand_name?: string;
  manufacturer_name?: string;
  model_name?: string;
  images?: string[];
  specifications?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminQuote {
  id: number;
  product_id: number;
  product_name?: string;
  product_model?: string;
  category_name?: string;
  brand_name?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_company?: string;
  quantity: number;
  message?: string;
  status: "pending" | "contacted" | "quoted" | "closed";
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  role: "admin" | "super_admin";
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
  is_email_verified: boolean;
  created_at: string;
  last_login?: string;
}

export interface ContentPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Reference Data Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
  parent_id?: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Manufacturer {
  id: number;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  name: string;
  manufacturer_id?: number;
  description?: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Model {
  id: number;
  name: string;
  brand_id: number;
  description?: string;
  specifications?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}

export interface ErrorState {
  hasError: boolean;
  errorMessage?: string;
}

// Admin Products State
export interface AdminProductsState {
  products: AdminProduct[];
  selectedProduct: AdminProduct | null;
  loading: LoadingState;
  error: ErrorState;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Admin Quotes State
export interface AdminQuotesState {
  quotes: AdminQuote[];
  selectedQuote: AdminQuote | null;
  loading: LoadingState;
  error: ErrorState;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Admin Users State
export interface AdminUsersState {
  users: AdminUser[];
  selectedUser: AdminUser | null;
  loading: LoadingState;
  error: ErrorState;
}

// Admin Content State
export interface AdminContentState {
  pages: ContentPage[];
  selectedPage: ContentPage | null;
  loading: LoadingState;
  error: ErrorState;
}

// Admin Reference Data State
export interface AdminReferenceState {
  categories: Category[];
  manufacturers: Manufacturer[];
  brands: Brand[];
  models: Model[];
  loading: LoadingState;
  error: ErrorState;
}

// Global Admin State
export interface AdminAppState {
  products: AdminProductsState;
  quotes: AdminQuotesState;
  users: AdminUsersState;
  content: AdminContentState;
  reference: AdminReferenceState;
  globalLoading: LoadingState;
}

// Initial States
export const initialAdminProductsState: AdminProductsState = {
  products: [],
  selectedProduct: null,
  loading: { isLoading: false },
  error: { hasError: false },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

export const initialAdminQuotesState: AdminQuotesState = {
  quotes: [],
  selectedQuote: null,
  loading: { isLoading: false },
  error: { hasError: false },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

export const initialAdminUsersState: AdminUsersState = {
  users: [],
  selectedUser: null,
  loading: { isLoading: false },
  error: { hasError: false },
};

export const initialAdminContentState: AdminContentState = {
  pages: [],
  selectedPage: null,
  loading: { isLoading: false },
  error: { hasError: false },
};

export const initialAdminReferenceState: AdminReferenceState = {
  categories: [],
  manufacturers: [],
  brands: [],
  models: [],
  loading: { isLoading: false },
  error: { hasError: false },
};

export const initialAdminAppState: AdminAppState = {
  products: initialAdminProductsState,
  quotes: initialAdminQuotesState,
  users: initialAdminUsersState,
  content: initialAdminContentState,
  reference: initialAdminReferenceState,
  globalLoading: { isLoading: false },
};
