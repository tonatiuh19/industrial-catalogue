import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
} from "react";
import { rootReducer } from "./reducers";
import { initialAppState, type AppState } from "./state";
import { ActionType, type Action } from "./actions";
import {
  productsApi,
  categoriesApi,
  manufacturersApi,
  brandsApi,
  modelsApi,
} from "../services/api.service";
import { AxiosError } from "axios";

interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  actions: {
    fetchProducts: () => Promise<void>;
    fetchProductById: (id: number) => Promise<void>;
    setProductFilters: (
      filters: Partial<AppState["products"]["filters"]>,
    ) => void;
    clearProductFilters: () => void;
    fetchCategories: () => Promise<void>;
    fetchManufacturers: () => Promise<void>;
    fetchBrands: (manufacturerId?: number) => Promise<void>;
    fetchModels: (brandId?: number) => Promise<void>;
    loadAllFilterOptions: () => Promise<void>;
  };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(rootReducer, initialAppState);

  // Helper to handle API errors
  const handleError = (error: unknown): string => {
    if (error instanceof AxiosError) {
      return (
        error.response?.data?.error || error.message || "An error occurred"
      );
    }
    return "An unexpected error occurred";
  };

  // Products actions
  const fetchProducts = useCallback(async () => {
    dispatch({ type: ActionType.FETCH_PRODUCTS_REQUEST });

    try {
      const response = await productsApi.getAll({
        page: state.products.pagination.page,
        limit: state.products.pagination.limit,
        ...state.products.filters,
      });

      console.log("Products API Response:", response.data);

      dispatch({
        type: ActionType.FETCH_PRODUCTS_SUCCESS,
        payload: {
          products: response.data.data || [],
          pagination: response.data.pagination || {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
          },
        },
      });
    } catch (error) {
      console.error("Fetch products error:", error);
      dispatch({
        type: ActionType.FETCH_PRODUCTS_FAILURE,
        payload: handleError(error),
      });
    }
  }, [state.products.pagination, state.products.filters]);

  const fetchProductById = useCallback(async (id: number) => {
    dispatch({ type: ActionType.FETCH_PRODUCT_REQUEST });

    try {
      const response = await productsApi.getById(id);

      dispatch({
        type: ActionType.FETCH_PRODUCT_SUCCESS,
        payload: response.data.data!,
      });
    } catch (error) {
      dispatch({
        type: ActionType.FETCH_PRODUCT_FAILURE,
        payload: handleError(error),
      });
    }
  }, []);

  const setProductFilters = useCallback(
    (filters: Partial<AppState["products"]["filters"]>) => {
      dispatch({
        type: ActionType.SET_PRODUCT_FILTERS,
        payload: filters,
      });
    },
    [],
  );

  const clearProductFilters = useCallback(() => {
    dispatch({ type: ActionType.CLEAR_PRODUCT_FILTERS });
  }, []);

  // Filter options actions
  const fetchCategories = useCallback(async () => {
    dispatch({ type: ActionType.FETCH_CATEGORIES_REQUEST });

    try {
      const response = await categoriesApi.getAll();

      dispatch({
        type: ActionType.FETCH_CATEGORIES_SUCCESS,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({
        type: ActionType.FETCH_CATEGORIES_FAILURE,
        payload: handleError(error),
      });
    }
  }, []);

  const fetchManufacturers = useCallback(async () => {
    dispatch({ type: ActionType.FETCH_MANUFACTURERS_REQUEST });

    try {
      const response = await manufacturersApi.getAll();

      dispatch({
        type: ActionType.FETCH_MANUFACTURERS_SUCCESS,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({
        type: ActionType.FETCH_MANUFACTURERS_FAILURE,
        payload: handleError(error),
      });
    }
  }, []);

  const fetchBrands = useCallback(async (manufacturerId?: number) => {
    dispatch({ type: ActionType.FETCH_BRANDS_REQUEST });

    try {
      const response = await brandsApi.getAll(
        manufacturerId ? { manufacturer_id: manufacturerId } : undefined,
      );

      dispatch({
        type: ActionType.FETCH_BRANDS_SUCCESS,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({
        type: ActionType.FETCH_BRANDS_FAILURE,
        payload: handleError(error),
      });
    }
  }, []);

  const fetchModels = useCallback(async (brandId?: number) => {
    dispatch({ type: ActionType.FETCH_MODELS_REQUEST });

    try {
      const response = await modelsApi.getAll(
        brandId ? { brand_id: brandId } : undefined,
      );

      dispatch({
        type: ActionType.FETCH_MODELS_SUCCESS,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({
        type: ActionType.FETCH_MODELS_FAILURE,
        payload: handleError(error),
      });
    }
  }, []);

  const loadAllFilterOptions = useCallback(async () => {
    dispatch({
      type: ActionType.SET_GLOBAL_LOADING,
      payload: { isLoading: true, loadingMessage: "Loading filters..." },
    });

    try {
      await Promise.all([
        fetchCategories(),
        fetchManufacturers(),
        fetchBrands(),
      ]);
    } finally {
      dispatch({
        type: ActionType.SET_GLOBAL_LOADING,
        payload: { isLoading: false },
      });
    }
  }, [fetchCategories, fetchManufacturers, fetchBrands]);

  const value: StoreContextType = {
    state,
    dispatch,
    actions: {
      fetchProducts,
      fetchProductById,
      setProductFilters,
      clearProductFilters,
      fetchCategories,
      fetchManufacturers,
      fetchBrands,
      fetchModels,
      loadAllFilterOptions,
    },
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

// Convenience hooks for specific parts of state
export const useProducts = () => {
  const { state } = useStore();
  return state.products;
};

export const useFilterOptions = () => {
  const { state } = useStore();
  return state.filterOptions;
};

export const useGlobalLoading = () => {
  const { state } = useStore();
  return state.globalLoading;
};
