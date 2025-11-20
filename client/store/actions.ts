import type {
  Product,
  Category,
  Manufacturer,
  Brand,
  Model,
} from "@shared/api";
import type { ProductsState, FilterOptionsState, LoadingState } from "./state";

// Action types
export enum ActionType {
  // Products
  FETCH_PRODUCTS_REQUEST = "FETCH_PRODUCTS_REQUEST",
  FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS",
  FETCH_PRODUCTS_FAILURE = "FETCH_PRODUCTS_FAILURE",

  FETCH_PRODUCT_REQUEST = "FETCH_PRODUCT_REQUEST",
  FETCH_PRODUCT_SUCCESS = "FETCH_PRODUCT_SUCCESS",
  FETCH_PRODUCT_FAILURE = "FETCH_PRODUCT_FAILURE",

  SET_PRODUCT_FILTERS = "SET_PRODUCT_FILTERS",
  CLEAR_PRODUCT_FILTERS = "CLEAR_PRODUCT_FILTERS",

  // Filter Options
  FETCH_CATEGORIES_REQUEST = "FETCH_CATEGORIES_REQUEST",
  FETCH_CATEGORIES_SUCCESS = "FETCH_CATEGORIES_SUCCESS",
  FETCH_CATEGORIES_FAILURE = "FETCH_CATEGORIES_FAILURE",

  FETCH_MANUFACTURERS_REQUEST = "FETCH_MANUFACTURERS_REQUEST",
  FETCH_MANUFACTURERS_SUCCESS = "FETCH_MANUFACTURERS_SUCCESS",
  FETCH_MANUFACTURERS_FAILURE = "FETCH_MANUFACTURERS_FAILURE",

  FETCH_BRANDS_REQUEST = "FETCH_BRANDS_REQUEST",
  FETCH_BRANDS_SUCCESS = "FETCH_BRANDS_SUCCESS",
  FETCH_BRANDS_FAILURE = "FETCH_BRANDS_FAILURE",

  FETCH_MODELS_REQUEST = "FETCH_MODELS_REQUEST",
  FETCH_MODELS_SUCCESS = "FETCH_MODELS_SUCCESS",
  FETCH_MODELS_FAILURE = "FETCH_MODELS_FAILURE",

  // Global loading
  SET_GLOBAL_LOADING = "SET_GLOBAL_LOADING",
}

// Action interfaces
export interface FetchProductsRequestAction {
  type: ActionType.FETCH_PRODUCTS_REQUEST;
}

export interface FetchProductsSuccessAction {
  type: ActionType.FETCH_PRODUCTS_SUCCESS;
  payload: {
    products: Product[];
    pagination: ProductsState["pagination"];
  };
}

export interface FetchProductsFailureAction {
  type: ActionType.FETCH_PRODUCTS_FAILURE;
  payload: string;
}

export interface FetchProductRequestAction {
  type: ActionType.FETCH_PRODUCT_REQUEST;
}

export interface FetchProductSuccessAction {
  type: ActionType.FETCH_PRODUCT_SUCCESS;
  payload: Product;
}

export interface FetchProductFailureAction {
  type: ActionType.FETCH_PRODUCT_FAILURE;
  payload: string;
}

export interface SetProductFiltersAction {
  type: ActionType.SET_PRODUCT_FILTERS;
  payload: Partial<ProductsState["filters"]>;
}

export interface ClearProductFiltersAction {
  type: ActionType.CLEAR_PRODUCT_FILTERS;
}

export interface FetchCategoriesSuccessAction {
  type: ActionType.FETCH_CATEGORIES_SUCCESS;
  payload: Category[];
}

export interface FetchManufacturersSuccessAction {
  type: ActionType.FETCH_MANUFACTURERS_SUCCESS;
  payload: Manufacturer[];
}

export interface FetchBrandsSuccessAction {
  type: ActionType.FETCH_BRANDS_SUCCESS;
  payload: Brand[];
}

export interface FetchModelsSuccessAction {
  type: ActionType.FETCH_MODELS_SUCCESS;
  payload: Model[];
}

export interface SetGlobalLoadingAction {
  type: ActionType.SET_GLOBAL_LOADING;
  payload: LoadingState;
}

// Union type of all actions
export type Action =
  | FetchProductsRequestAction
  | FetchProductsSuccessAction
  | FetchProductsFailureAction
  | FetchProductRequestAction
  | FetchProductSuccessAction
  | FetchProductFailureAction
  | SetProductFiltersAction
  | ClearProductFiltersAction
  | FetchCategoriesSuccessAction
  | FetchManufacturersSuccessAction
  | FetchBrandsSuccessAction
  | FetchModelsSuccessAction
  | SetGlobalLoadingAction
  | { type: ActionType.FETCH_CATEGORIES_REQUEST }
  | { type: ActionType.FETCH_CATEGORIES_FAILURE; payload: string }
  | { type: ActionType.FETCH_MANUFACTURERS_REQUEST }
  | { type: ActionType.FETCH_MANUFACTURERS_FAILURE; payload: string }
  | { type: ActionType.FETCH_BRANDS_REQUEST }
  | { type: ActionType.FETCH_BRANDS_FAILURE; payload: string }
  | { type: ActionType.FETCH_MODELS_REQUEST }
  | { type: ActionType.FETCH_MODELS_FAILURE; payload: string };
