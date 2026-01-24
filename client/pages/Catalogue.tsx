import { useEffect, useState } from "react";
import {
  ChevronDown,
  Plus,
  ShoppingBag,
  Check,
  Minus,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import ProductFilters from "@/components/ProductFilters";
import NewQuoteWizard from "@/components/NewQuoteWizard";
import SEO from "@/components/SEO";
import { LoadingSpinner } from "@/components/LoadingMask";
import { useQuote } from "@/context/QuoteContext";
import { useStore, useProducts } from "@/store/StoreContext";
import type { Product } from "@shared/api";

type SortOption = "relevance" | "price-low" | "price-high" | "newest";

const IMAGE_BASE_URL = "https://disruptinglabs.com/data/api";

const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath)
    return "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400";
  if (imagePath.startsWith("http")) return imagePath;
  return `${IMAGE_BASE_URL}${imagePath}`;
};

const Catalogue = () => {
  const { state, actions } = useStore();
  const products = useProducts();
  const {
    addProduct,
    removeProduct,
    updateProductQuantity,
    selectedProducts,
    isNewWizardOpen,
    openNewWizard,
    closeNewWizard,
    prefillData,
  } = useQuote();

  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [addedProductId, setAddedProductId] = useState<number | null>(null);

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load filter options and products on mount
  useEffect(() => {
    actions.loadAllFilterOptions();
    actions.fetchProducts();
    setIsInitialLoad(false);
  }, []);

  // Debug: log products state
  useEffect(() => {
    console.log("Products state:", products);
  }, [products]);

  // Refetch products when filters change (skip initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      actions.fetchProducts();
    }
  }, [products.filters]);

  const handleAddToQuote = (product: Product) => {
    addProduct({
      id: product.id.toString(),
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: 1,
    });

    // Show visual feedback
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  const handleRemoveFromQuote = (
    productId: string,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation();
    removeProduct(productId);
  };

  const handleFilterChange = (filters: any) => {
    actions.setProductFilters({
      category_id: filters.categories?.[0],
      manufacturer_id: filters.manufacturers?.[0],
      brand_id: filters.brands?.[0],
      model_id: filters.models?.[0],
      min_price: filters.priceRange?.[0],
      max_price: filters.priceRange?.[1],
    });
  };

  const sortedProducts = Array.isArray(products.products)
    ? [...products.products].sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "newest":
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          default:
            return 0;
        }
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Catálogo de Productos Industriales"
        description={`Explora nuestro catálogo con ${products.pagination.total} productos industriales de calidad. Herramientas, equipamiento y más para tu empresa.`}
      />
      <Header />
      {/* Floating Quote Button */}
      {selectedProducts.length > 0 && (
        <button
          onClick={() => openNewWizard()}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center gap-2 sm:gap-3 rounded-full bg-[#c03818] px-4 py-3 sm:px-6 sm:py-4 font-bold text-white shadow-2xl transition-all hover:scale-105 hover:brightness-110 text-sm sm:text-base"
        >
          <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden xs:inline">
            Ver Cotización ({selectedProducts.length})
          </span>
          <span className="xs:hidden">({selectedProducts.length})</span>
        </button>
      )}
      {/* Filter Button (Mobile) */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-30 flex items-center gap-2 rounded-full bg-[#1b3148] px-4 py-2.5 sm:px-6 sm:py-3 font-semibold text-white shadow-lg transition-all hover:brightness-110 md:hidden text-sm sm:text-base"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filtros
      </button>
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header Section */}
        <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b3148] via-[#1b3148] to-[#0f1f2e] p-8 shadow-2xl md:p-12">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#c03818] blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white blur-3xl" />
          </div>

          <div className="relative z-10">
            {/*             <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#c03818]/20 px-4 py-2 backdrop-blur-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#c03818]" />
              <span className="text-sm font-bold text-white">
                {products.pagination.total} productos disponibles
              </span>
            </div> */}

            <h1 className="mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-5xl font-black text-transparent md:text-6xl">
              Catálogo de Productos
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl">
              Encuentra herramientas y equipamiento industrial de calidad para
              tu empresa.
              <span className="font-semibold text-white">
                {" "}
                Innovación y durabilidad
              </span>{" "}
              en cada producto.
            </p>

            {/* Stats or features */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c03818]">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Envío</p>
                  <p className="font-bold text-white">Rápido</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c03818]">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Calidad</p>
                  <p className="font-bold text-white">Garantizada</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c03818]">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Precio</p>
                  <p className="font-bold text-white">Competitivo</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar - Always visible on desktop */}
          <aside className="hidden md:block md:w-72 md:flex-shrink-0">
            <div className="sticky top-4 rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-gray-900">Filtros</h2>
              <ProductFilters
                onFilterChange={handleFilterChange}
                isOpen={true}
                onClose={() => {}}
              />
            </div>
          </aside>

          {/* Mobile Filters Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-40 w-80 transform bg-white shadow-xl transition-transform md:hidden ${
              showFilters ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <ProductFilters
              onFilterChange={handleFilterChange}
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Controls Bar */}
            <div className="mb-6 flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold text-gray-900">
                  {products.pagination.total}
                </span>
                productos encontrados
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort"
                  className="text-sm font-medium text-gray-700"
                >
                  Ordenar por:
                </label>
                <div className="relative">
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-900 transition-colors hover:border-gray-400 focus:border-[#c03818] focus:outline-none focus:ring-2 focus:ring-[#c03818]/20"
                  >
                    <option value="relevance">Relevancia</option>
                    <option value="price-low">Precio: Menor a Mayor</option>
                    <option value="price-high">Precio: Mayor a Menor</option>
                    <option value="newest">Más Recientes</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {products.loading.isLoading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : products.error.hasError ? (
              <div className="rounded-lg bg-red-50 p-8 text-center">
                <p className="text-red-600">{products.error.errorMessage}</p>
                <button
                  onClick={() => actions.fetchProducts()}
                  className="mt-4 text-[#c03818] hover:text-[#c03818]/80"
                >
                  Reintentar
                </button>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="rounded-lg bg-gray-50 p-12 text-center">
                <p className="text-lg text-gray-600">
                  No se encontraron productos con los filtros seleccionados.
                </p>
                <button
                  onClick={() => actions.clearProductFilters()}
                  className="mt-4 text-[#c03818] hover:text-[#c03818]/80"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <Link to={`/product/${product.id}`} className="block">
                      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        <img
                          src={getImageUrl(product.main_image)}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        {!product.is_active && (
                          <div className="absolute right-3 top-3 rounded-full bg-red-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                            Agotado
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-5">
                      <Link to={`/product/${product.id}`}>
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-bold uppercase tracking-wider text-[#1b3148]">
                            {product.sku}
                          </p>
                          {product.is_featured && (
                            <span className="rounded-full bg-[#1b3148] px-2 py-0.5 text-xs font-semibold text-white">
                              Destacado
                            </span>
                          )}
                        </div>
                        <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-[#c03818]">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
                            {product.description}
                          </p>
                        )}

                        {/* Product metadata */}
                        <div className="mb-4 space-y-1.5 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                          {product.category_name && (
                            <p className="flex items-center gap-2">
                              <span className="font-semibold">Categoría:</span>
                              <span>{product.category_name}</span>
                            </p>
                          )}
                          {product.manufacturer_name && (
                            <p className="flex items-center gap-2">
                              <span className="font-semibold">Fabricante:</span>
                              <span>{product.manufacturer_name}</span>
                            </p>
                          )}
                          {product.brand_name && (
                            <p className="flex items-center gap-2">
                              <span className="font-semibold">Marca:</span>
                              <span>{product.brand_name}</span>
                            </p>
                          )}
                        </div>
                      </Link>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-2xl font-bold text-gray-900">
                            ${product.price.toLocaleString()}
                          </p>
                          <p className="text-xs font-medium text-gray-500">
                            {product.currency}
                          </p>
                        </div>

                        {/* Add/Remove buttons with quantity badge */}
                        <div className="flex items-center gap-2">
                          {selectedProducts.some(
                            (p) => p.id === product.id.toString(),
                          ) && (
                            <>
                              {/* Quantity badge */}
                              <div className="flex items-center gap-1.5 rounded-full bg-[#c03818]/10 px-3 py-1.5">
                                <span className="text-xs font-bold text-[#c03818]">
                                  {selectedProducts.find(
                                    (p) => p.id === product.id.toString(),
                                  )?.quantity || 0}
                                  x
                                </span>
                              </div>

                              {/* Remove button */}
                              <button
                                onClick={(e) =>
                                  handleRemoveFromQuote(
                                    product.id.toString(),
                                    e,
                                  )
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 transition-all duration-300 hover:scale-110 hover:bg-red-200"
                                title="Quitar de cotización"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                            </>
                          )}

                          {/* Add button */}
                          <button
                            onClick={() => handleAddToQuote(product)}
                            disabled={!product.is_active}
                            className={`group/btn relative flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl disabled:cursor-not-allowed disabled:hover:scale-100 ${
                              addedProductId === product.id
                                ? "bg-[#c03818]"
                                : selectedProducts.some(
                                      (p) => p.id === product.id.toString(),
                                    )
                                  ? "bg-[#c03818]"
                                  : "bg-[#1b3148]"
                            } ${!product.is_active ? "!bg-gray-400" : ""}`}
                            title={
                              selectedProducts.some(
                                (p) => p.id === product.id.toString(),
                              )
                                ? "Agregar otro"
                                : "Agregar a cotización"
                            }
                          >
                            {addedProductId === product.id ? (
                              <Check className="h-5 w-5 animate-in zoom-in duration-300" />
                            ) : selectedProducts.some(
                                (p) => p.id === product.id.toString(),
                              ) ? (
                              <Plus className="h-5 w-5" />
                            ) : (
                              <Plus className="h-5 w-5 transition-transform duration-300 group-hover/btn:rotate-90" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {products.pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() =>
                    actions.setProductFilters({
                      ...products.filters,
                    })
                  }
                  disabled={products.pagination.page === 1}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="flex items-center px-4 text-sm text-gray-600">
                  Página {products.pagination.page} de{" "}
                  {products.pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    actions.setProductFilters({
                      ...products.filters,
                    })
                  }
                  disabled={
                    products.pagination.page === products.pagination.totalPages
                  }
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      {/* Floating Quote Button */}
      <button
        onClick={() => openNewWizard()}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-6 py-4 bg-accent text-white font-bold text-base rounded-full hover:bg-orange-600 hover:shadow-2xl hover:shadow-accent/50 transition-all duration-300 active:scale-95 shadow-xl group"
      >
        <FileText
          size={20}
          className="group-hover:rotate-12 transition-transform"
        />
        <span className="hidden sm:inline">Cotizar ahora</span>
      </button>

      {/* New Quote Wizard */}
      {isNewWizardOpen && (
        <NewQuoteWizard
          isOpen={isNewWizardOpen}
          onClose={closeNewWizard}
          prefillData={prefillData}
        />
      )}
      {/* Overlay for mobile filters */}
      {showFilters && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default Catalogue;
