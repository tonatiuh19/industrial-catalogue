import type {
  Product,
  Category,
  Manufacturer,
  Brand,
  Model,
} from "@shared/api";

// Loading state
export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}

// Error state
export interface ErrorState {
  hasError: boolean;
  errorMessage?: string;
  errorCode?: string;
}

// Products state
export interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  loading: LoadingState;
  error: ErrorState;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    category_id?: number;
    manufacturer_id?: number;
    brand_id?: number;
    model_id?: number;
    search?: string;
    min_price?: number;
    max_price?: number;
    is_featured?: boolean;
  };
}

// Filter options state
export interface FilterOptionsState {
  categories: Category[];
  manufacturers: Manufacturer[];
  brands: Brand[];
  models: Model[];
  loading: LoadingState;
  error: ErrorState;
}

// Global app state
export interface AppState {
  products: ProductsState;
  filterOptions: FilterOptionsState;
  globalLoading: LoadingState;
}

// Initial states
export const initialProductsState: ProductsState = {
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
  filters: {},
};

export const initialFilterOptionsState: FilterOptionsState = {
  categories: [],
  manufacturers: [],
  brands: [],
  models: [],
  loading: { isLoading: false },
  error: { hasError: false },
};

export const initialAppState: AppState = {
  products: initialProductsState,
  filterOptions: initialFilterOptionsState,
  globalLoading: { isLoading: false },
};
