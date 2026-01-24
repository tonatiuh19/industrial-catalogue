import { AdminAction } from "./adminActions";
import {
  AdminAppState,
  AdminProductsState,
  AdminQuotesState,
  AdminUsersState,
  AdminContentState,
  AdminReferenceState,
  initialAdminAppState,
} from "./adminState";

// Products Reducer
const adminProductsReducer = (
  state: AdminProductsState,
  action: AdminAction,
): AdminProductsState => {
  switch (action.type) {
    case "ADMIN_PRODUCTS_LOADING":
      return {
        ...state,
        loading: {
          isLoading: true,
          loadingMessage: action.payload || "Loading products...",
        },
        error: { hasError: false },
      };

    case "ADMIN_PRODUCTS_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        pagination: {
          ...state.pagination,
          total: action.payload.total || action.payload.products.length,
          totalPages: action.payload.total
            ? Math.ceil(action.payload.total / state.pagination.limit)
            : 1,
        },
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_PRODUCT_SELECTED":
      return {
        ...state,
        selectedProduct: action.payload,
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_PRODUCT_CREATED":
      return {
        ...state,
        products: [action.payload, ...state.products],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
        },
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_PRODUCT_UPDATED":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        ),
        selectedProduct:
          state.selectedProduct?.id === action.payload.id
            ? action.payload
            : state.selectedProduct,
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_PRODUCT_DELETED":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
        selectedProduct:
          state.selectedProduct?.id === action.payload
            ? null
            : state.selectedProduct,
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1,
        },
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_PRODUCTS_ERROR":
      return {
        ...state,
        loading: { isLoading: false },
        error: { hasError: true, errorMessage: action.payload },
      };

    case "ADMIN_PRODUCTS_SET_PAGE":
      return {
        ...state,
        pagination: {
          ...state.pagination,
          page: action.payload,
        },
      };

    case "ADMIN_PRODUCT_IMAGES_LOADING":
      return {
        ...state,
        loading: {
          isLoading: true,
          loadingMessage: action.payload || "Uploading images...",
        },
        error: { hasError: false },
      };

    case "ADMIN_PRODUCT_IMAGES_SUCCESS":
      return {
        ...state,
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_PRODUCT_IMAGES_ERROR":
      return {
        ...state,
        loading: { isLoading: false },
        error: { hasError: true, errorMessage: action.payload },
      };

    default:
      return state;
  }
};

// Quotes Reducer
const adminQuotesReducer = (
  state: AdminQuotesState,
  action: AdminAction,
): AdminQuotesState => {
  switch (action.type) {
    case "ADMIN_QUOTES_LOADING":
      return {
        ...state,
        loading: {
          isLoading: true,
          loadingMessage: action.payload || "Loading quotes...",
        },
        error: { hasError: false },
      };

    case "ADMIN_QUOTES_SUCCESS":
      return {
        ...state,
        quotes: action.payload.quotes,
        pagination: {
          ...state.pagination,
          total: action.payload.total || action.payload.quotes.length,
          totalPages: action.payload.total
            ? Math.ceil(action.payload.total / state.pagination.limit)
            : 1,
        },
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_QUOTE_SELECTED":
      return {
        ...state,
        selectedQuote: action.payload,
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_QUOTE_UPDATED":
      return {
        ...state,
        quotes: state.quotes.map((q) =>
          q.id === action.payload.id ? action.payload : q,
        ),
        selectedQuote:
          state.selectedQuote?.id === action.payload.id
            ? action.payload
            : state.selectedQuote,
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_QUOTES_ERROR":
      return {
        ...state,
        loading: { isLoading: false },
        error: { hasError: true, errorMessage: action.payload },
      };

    case "ADMIN_QUOTES_SET_PAGE":
      return {
        ...state,
        pagination: {
          ...state.pagination,
          page: action.payload,
        },
      };

    default:
      return state;
  }
};

// Users Reducer
const adminUsersReducer = (
  state: AdminUsersState,
  action: AdminAction,
): AdminUsersState => {
  switch (action.type) {
    case "ADMIN_USERS_LOADING":
      return {
        ...state,
        loading: {
          isLoading: true,
          loadingMessage: action.payload || "Loading users...",
        },
        error: { hasError: false },
      };

    case "ADMIN_USERS_SUCCESS":
      return {
        ...state,
        users: action.payload,
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_USER_SELECTED":
      return {
        ...state,
        selectedUser: action.payload,
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_USER_CREATED":
      return {
        ...state,
        users: [action.payload, ...state.users],
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_USER_UPDATED":
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === action.payload.id ? action.payload : u,
        ),
        selectedUser:
          state.selectedUser?.id === action.payload.id
            ? action.payload
            : state.selectedUser,
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_USER_DELETED":
      return {
        ...state,
        users: state.users.filter((u) => u.id !== action.payload),
        selectedUser:
          state.selectedUser?.id === action.payload ? null : state.selectedUser,
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_USERS_ERROR":
      return {
        ...state,
        loading: { isLoading: false },
        error: { hasError: true, errorMessage: action.payload },
      };

    default:
      return state;
  }
};

// Content Reducer
const adminContentReducer = (
  state: AdminContentState,
  action: AdminAction,
): AdminContentState => {
  switch (action.type) {
    case "ADMIN_CONTENT_LOADING":
      return {
        ...state,
        loading: {
          isLoading: true,
          loadingMessage: action.payload || "Loading content...",
        },
        error: { hasError: false },
      };

    case "ADMIN_CONTENT_SUCCESS":
      return {
        ...state,
        pages: action.payload,
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_CONTENT_PAGE_SELECTED":
      return {
        ...state,
        selectedPage: action.payload,
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_CONTENT_PAGE_UPDATED":
      return {
        ...state,
        pages: state.pages.map((p) =>
          p.slug === action.payload.slug ? action.payload : p,
        ),
        selectedPage:
          state.selectedPage?.slug === action.payload.slug
            ? action.payload
            : state.selectedPage,
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_CONTENT_ERROR":
      return {
        ...state,
        loading: { isLoading: false },
        error: { hasError: true, errorMessage: action.payload },
      };

    default:
      return state;
  }
};

// Reference Data Reducer
const adminReferenceReducer = (
  state: AdminReferenceState,
  action: AdminAction,
): AdminReferenceState => {
  switch (action.type) {
    case "ADMIN_REFERENCE_LOADING":
      return {
        ...state,
        loading: {
          isLoading: true,
          loadingMessage: action.payload || "Loading reference data...",
        },
        error: { hasError: false },
      };

    case "ADMIN_CATEGORIES_SUCCESS":
      return {
        ...state,
        categories: action.payload,
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_SUBCATEGORIES_SUCCESS":
      return {
        ...state,
        subcategories: action.payload,
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_MANUFACTURERS_SUCCESS":
      return {
        ...state,
        manufacturers: action.payload,
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_BRANDS_SUCCESS":
      return {
        ...state,
        brands: action.payload,
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_MODELS_SUCCESS":
      return {
        ...state,
        models: action.payload,
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case "ADMIN_CATEGORY_CREATED":
      return {
        ...state,
        categories: [...state.categories, action.payload],
        loading: { isLoading: false },
      };

    case "ADMIN_MANUFACTURER_CREATED":
      return {
        ...state,
        manufacturers: [...state.manufacturers, action.payload],
        loading: { isLoading: false },
      };

    case "ADMIN_BRAND_CREATED":
      return {
        ...state,
        brands: [...state.brands, action.payload],
        loading: { isLoading: false },
      };

    case "ADMIN_MODEL_CREATED":
      return {
        ...state,
        models: [...state.models, action.payload],
        loading: { isLoading: false },
      };

    case "ADMIN_CATEGORY_UPDATED":
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat,
        ),
        loading: { isLoading: false },
      };

    case "ADMIN_MANUFACTURER_UPDATED":
      return {
        ...state,
        manufacturers: state.manufacturers.map((mfg) =>
          mfg.id === action.payload.id ? action.payload : mfg,
        ),
        loading: { isLoading: false },
      };

    case "ADMIN_BRAND_UPDATED":
      return {
        ...state,
        brands: state.brands.map((brand) =>
          brand.id === action.payload.id ? action.payload : brand,
        ),
        loading: { isLoading: false },
      };

    case "ADMIN_MODEL_UPDATED":
      return {
        ...state,
        models: state.models.map((model) =>
          model.id === action.payload.id ? action.payload : model,
        ),
        loading: { isLoading: false },
      };

    case "ADMIN_CATEGORY_DELETED":
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
        loading: { isLoading: false },
      };

    case "ADMIN_MANUFACTURER_DELETED":
      return {
        ...state,
        manufacturers: state.manufacturers.filter(
          (mfg) => mfg.id !== action.payload,
        ),
        loading: { isLoading: false },
      };

    case "ADMIN_BRAND_DELETED":
      return {
        ...state,
        brands: state.brands.filter((brand) => brand.id !== action.payload),
        loading: { isLoading: false },
      };

    case "ADMIN_MODEL_DELETED":
      return {
        ...state,
        models: state.models.filter((model) => model.id !== action.payload),
        loading: { isLoading: false },
      };

    case "ADMIN_REFERENCE_ERROR":
      return {
        ...state,
        loading: { isLoading: false },
        error: {
          hasError: true,
          errorMessage: action.payload,
        },
      };

    default:
      return state;
  }
};

// Main Admin Reducer
export const adminReducer = (
  state: AdminAppState,
  action: AdminAction,
): AdminAppState => {
  switch (action.type) {
    case "ADMIN_GLOBAL_LOADING":
      return {
        ...state,
        globalLoading: {
          isLoading: action.payload,
        },
      };

    case "ADMIN_RESET":
      return initialAdminAppState;

    // Products actions
    case "ADMIN_PRODUCTS_LOADING":
    case "ADMIN_PRODUCTS_SUCCESS":
    case "ADMIN_PRODUCT_SELECTED":
    case "ADMIN_PRODUCT_CREATED":
    case "ADMIN_PRODUCT_UPDATED":
    case "ADMIN_PRODUCT_DELETED":
    case "ADMIN_PRODUCTS_ERROR":
    case "ADMIN_PRODUCTS_SET_PAGE":
      return {
        ...state,
        products: adminProductsReducer(state.products, action),
      };

    // Quotes actions
    case "ADMIN_QUOTES_LOADING":
    case "ADMIN_QUOTES_SUCCESS":
    case "ADMIN_QUOTE_SELECTED":
    case "ADMIN_QUOTE_UPDATED":
    case "ADMIN_QUOTES_ERROR":
    case "ADMIN_QUOTES_SET_PAGE":
      return {
        ...state,
        quotes: adminQuotesReducer(state.quotes, action),
      };

    // Users actions
    case "ADMIN_USERS_LOADING":
    case "ADMIN_USERS_SUCCESS":
    case "ADMIN_USER_SELECTED":
    case "ADMIN_USER_CREATED":
    case "ADMIN_USER_UPDATED":
    case "ADMIN_USER_DELETED":
    case "ADMIN_USERS_ERROR":
      return {
        ...state,
        users: adminUsersReducer(state.users, action),
      };

    // Content actions
    case "ADMIN_CONTENT_LOADING":
    case "ADMIN_CONTENT_SUCCESS":
    case "ADMIN_CONTENT_PAGE_SELECTED":
    case "ADMIN_CONTENT_PAGE_UPDATED":
    case "ADMIN_CONTENT_ERROR":
      return {
        ...state,
        content: adminContentReducer(state.content, action),
      };

    // Reference data actions
    case "ADMIN_REFERENCE_LOADING":
    case "ADMIN_CATEGORIES_SUCCESS":
    case "ADMIN_SUBCATEGORIES_SUCCESS":
    case "ADMIN_MANUFACTURERS_SUCCESS":
    case "ADMIN_BRANDS_SUCCESS":
    case "ADMIN_MODELS_SUCCESS":
    case "ADMIN_CATEGORY_CREATED":
    case "ADMIN_MANUFACTURER_CREATED":
    case "ADMIN_BRAND_CREATED":
    case "ADMIN_MODEL_CREATED":
    case "ADMIN_CATEGORY_UPDATED":
    case "ADMIN_MANUFACTURER_UPDATED":
    case "ADMIN_BRAND_UPDATED":
    case "ADMIN_MODEL_UPDATED":
    case "ADMIN_CATEGORY_DELETED":
    case "ADMIN_MANUFACTURER_DELETED":
    case "ADMIN_BRAND_DELETED":
    case "ADMIN_MODEL_DELETED":
    case "ADMIN_REFERENCE_ERROR":
      return {
        ...state,
        reference: adminReferenceReducer(state.reference, action),
      };

    default:
      return state;
  }
};
