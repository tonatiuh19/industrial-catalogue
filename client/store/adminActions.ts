import {
  AdminProduct,
  AdminQuote,
  AdminUser,
  ContentPage,
  Category,
  Manufacturer,
  Brand,
  Model,
} from "./adminState";

// Admin Products Actions
export type AdminProductsAction =
  | { type: "ADMIN_PRODUCTS_LOADING"; payload?: string }
  | {
      type: "ADMIN_PRODUCTS_SUCCESS";
      payload: { products: AdminProduct[]; total?: number };
    }
  | { type: "ADMIN_PRODUCT_SELECTED"; payload: AdminProduct | null }
  | { type: "ADMIN_PRODUCT_CREATED"; payload: AdminProduct }
  | { type: "ADMIN_PRODUCT_UPDATED"; payload: AdminProduct }
  | { type: "ADMIN_PRODUCT_DELETED"; payload: number }
  | { type: "ADMIN_PRODUCTS_ERROR"; payload: string }
  | { type: "ADMIN_PRODUCTS_SET_PAGE"; payload: number }
  | { type: "ADMIN_PRODUCT_IMAGES_LOADING"; payload?: string }
  | { type: "ADMIN_PRODUCT_IMAGES_SUCCESS"; payload?: string }
  | { type: "ADMIN_PRODUCT_IMAGES_ERROR"; payload: string };

// Admin Quotes Actions
export type AdminQuotesAction =
  | { type: "ADMIN_QUOTES_LOADING"; payload?: string }
  | {
      type: "ADMIN_QUOTES_SUCCESS";
      payload: { quotes: AdminQuote[]; total?: number };
    }
  | { type: "ADMIN_QUOTE_SELECTED"; payload: AdminQuote | null }
  | { type: "ADMIN_QUOTE_UPDATED"; payload: AdminQuote }
  | { type: "ADMIN_QUOTES_ERROR"; payload: string }
  | { type: "ADMIN_QUOTES_SET_PAGE"; payload: number };

// Admin Users Actions
export type AdminUsersAction =
  | { type: "ADMIN_USERS_LOADING"; payload?: string }
  | { type: "ADMIN_USERS_SUCCESS"; payload: AdminUser[] }
  | { type: "ADMIN_USER_SELECTED"; payload: AdminUser | null }
  | { type: "ADMIN_USER_CREATED"; payload: AdminUser }
  | { type: "ADMIN_USER_UPDATED"; payload: AdminUser }
  | { type: "ADMIN_USER_DELETED"; payload: number }
  | { type: "ADMIN_USERS_ERROR"; payload: string };

// Admin Content Actions
export type AdminContentAction =
  | { type: "ADMIN_CONTENT_LOADING"; payload?: string }
  | { type: "ADMIN_CONTENT_SUCCESS"; payload: ContentPage[] }
  | { type: "ADMIN_CONTENT_PAGE_SELECTED"; payload: ContentPage | null }
  | { type: "ADMIN_CONTENT_PAGE_UPDATED"; payload: ContentPage }
  | { type: "ADMIN_CONTENT_ERROR"; payload: string };

// Admin Reference Data Actions
export type AdminReferenceAction =
  | { type: "ADMIN_REFERENCE_LOADING"; payload?: string }
  | { type: "ADMIN_CATEGORIES_SUCCESS"; payload: Category[] }
  | { type: "ADMIN_MANUFACTURERS_SUCCESS"; payload: Manufacturer[] }
  | { type: "ADMIN_BRANDS_SUCCESS"; payload: Brand[] }
  | { type: "ADMIN_MODELS_SUCCESS"; payload: Model[] }
  | { type: "ADMIN_CATEGORY_CREATED"; payload: Category }
  | { type: "ADMIN_MANUFACTURER_CREATED"; payload: Manufacturer }
  | { type: "ADMIN_BRAND_CREATED"; payload: Brand }
  | { type: "ADMIN_MODEL_CREATED"; payload: Model }
  | { type: "ADMIN_CATEGORY_UPDATED"; payload: Category }
  | { type: "ADMIN_MANUFACTURER_UPDATED"; payload: Manufacturer }
  | { type: "ADMIN_BRAND_UPDATED"; payload: Brand }
  | { type: "ADMIN_MODEL_UPDATED"; payload: Model }
  | { type: "ADMIN_CATEGORY_DELETED"; payload: number }
  | { type: "ADMIN_MANUFACTURER_DELETED"; payload: number }
  | { type: "ADMIN_BRAND_DELETED"; payload: number }
  | { type: "ADMIN_MODEL_DELETED"; payload: number }
  | { type: "ADMIN_REFERENCE_ERROR"; payload: string };

// Global Admin Actions
export type AdminAction =
  | AdminProductsAction
  | AdminQuotesAction
  | AdminUsersAction
  | AdminContentAction
  | AdminReferenceAction
  | { type: "ADMIN_GLOBAL_LOADING"; payload: boolean }
  | { type: "ADMIN_RESET" };
