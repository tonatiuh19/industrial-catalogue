import type { AppState, ProductsState, FilterOptionsState } from "./state";
import { ActionType, type Action } from "./actions";
import { initialProductsState, initialFilterOptionsState } from "./state";

// Products reducer
export const productsReducer = (
  state: ProductsState,
  action: Action,
): ProductsState => {
  switch (action.type) {
    case ActionType.FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: { isLoading: true, loadingMessage: "Loading products..." },
        error: { hasError: false },
      };

    case ActionType.FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload.products,
        pagination: action.payload.pagination,
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case ActionType.FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: { isLoading: false },
        error: { hasError: true, errorMessage: action.payload },
      };

    case ActionType.FETCH_PRODUCT_REQUEST:
      return {
        ...state,
        loading: { isLoading: true, loadingMessage: "Loading product..." },
        error: { hasError: false },
      };

    case ActionType.FETCH_PRODUCT_SUCCESS:
      return {
        ...state,
        selectedProduct: action.payload,
        loading: { isLoading: false },
        error: { hasError: false },
      };

    case ActionType.FETCH_PRODUCT_FAILURE:
      return {
        ...state,
        loading: { isLoading: false },
        error: { hasError: true, errorMessage: action.payload },
      };

    case ActionType.SET_PRODUCT_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
        pagination: {
          ...state.pagination,
          page: 1, // Reset to first page when filters change
        },
      };

    case ActionType.CLEAR_PRODUCT_FILTERS:
      return {
        ...state,
        filters: {},
        pagination: {
          ...state.pagination,
          page: 1,
        },
      };

    default:
      return state;
  }
};

// Filter options reducer
export const filterOptionsReducer = (
  state: FilterOptionsState,
  action: Action,
): FilterOptionsState => {
  switch (action.type) {
    case ActionType.FETCH_CATEGORIES_REQUEST:
      return {
        ...state,
        loading: { isLoading: true },
      };

    case ActionType.FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload,
        loading: { isLoading: false },
      };

    case ActionType.FETCH_CATEGORIES_FAILURE:
      return {
        ...state,
        loading: { isLoading: false },
        error: { hasError: true, errorMessage: action.payload },
      };

    case ActionType.FETCH_MANUFACTURERS_SUCCESS:
      return {
        ...state,
        manufacturers: action.payload,
      };

    case ActionType.FETCH_BRANDS_SUCCESS:
      return {
        ...state,
        brands: action.payload,
      };

    case ActionType.FETCH_MODELS_SUCCESS:
      return {
        ...state,
        models: action.payload,
      };

    default:
      return state;
  }
};

// Root reducer
export const rootReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case ActionType.SET_GLOBAL_LOADING:
      return {
        ...state,
        globalLoading: action.payload,
      };

    // Products actions
    case ActionType.FETCH_PRODUCTS_REQUEST:
    case ActionType.FETCH_PRODUCTS_SUCCESS:
    case ActionType.FETCH_PRODUCTS_FAILURE:
    case ActionType.FETCH_PRODUCT_REQUEST:
    case ActionType.FETCH_PRODUCT_SUCCESS:
    case ActionType.FETCH_PRODUCT_FAILURE:
    case ActionType.SET_PRODUCT_FILTERS:
    case ActionType.CLEAR_PRODUCT_FILTERS:
      return {
        ...state,
        products: productsReducer(state.products, action),
      };

    // Filter options actions
    case ActionType.FETCH_CATEGORIES_REQUEST:
    case ActionType.FETCH_CATEGORIES_SUCCESS:
    case ActionType.FETCH_CATEGORIES_FAILURE:
    case ActionType.FETCH_MANUFACTURERS_REQUEST:
    case ActionType.FETCH_MANUFACTURERS_SUCCESS:
    case ActionType.FETCH_MANUFACTURERS_FAILURE:
    case ActionType.FETCH_BRANDS_REQUEST:
    case ActionType.FETCH_BRANDS_SUCCESS:
    case ActionType.FETCH_BRANDS_FAILURE:
    case ActionType.FETCH_MODELS_REQUEST:
    case ActionType.FETCH_MODELS_SUCCESS:
    case ActionType.FETCH_MODELS_FAILURE:
      return {
        ...state,
        filterOptions: filterOptionsReducer(state.filterOptions, action),
      };

    default:
      return state;
  }
};
