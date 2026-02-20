import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  ArrowRight,
  Filter,
  ChevronDown,
  FolderOpen,
  Layers,
  Tag,
  Factory,
  Box,
  FileText,
} from "lucide-react";
import Header from "@/components/Header";
import NewQuoteWizard from "@/components/NewQuoteWizard";
import { useQuote } from "@/context/QuoteContext";
import SEO from "@/components/SEO";
import { getImageUrl } from "@/services/image-upload.service";
import { catalogApi, subcategoriesApi } from "@/services/api.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CatalogData {
  mainItem: any | null;
  relatedCategories: any[];
  relatedSubcategories: any[];
  relatedBrands: any[];
  relatedManufacturers: any[];
}

export default function DynamicCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [catalogData, setCatalogData] = useState<CatalogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [siblingSubcategories, setSiblingSubcategories] = useState<any[]>([]);
  const { isNewWizardOpen, openNewWizard, closeNewWizard, prefillData } =
    useQuote();
  const [selectedFilters, setSelectedFilters] = useState({
    category_id: searchParams.get("category_id") || "",
    subcategory_id: searchParams.get("subcategory_id") || "",
    brand_id: searchParams.get("brand_id") || "",
    manufacturer_id: searchParams.get("manufacturer_id") || "",
  });

  const type = searchParams.get("type");
  const id = searchParams.get("id");

  useEffect(() => {
    fetchCatalogData();
  }, [type, id, selectedFilters]);

  // Fetch sibling subcategories when viewing a subcategory
  useEffect(() => {
    if (type === "subcategory" && catalogData?.mainItem?.category_id) {
      subcategoriesApi
        .getAll({ category_id: catalogData.mainItem.category_id })
        .then((res) => {
          const all = Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data)
              ? res.data
              : [];
          // Exclude the currently viewed subcategory
          setSiblingSubcategories(
            all.filter((s: any) => s.id !== catalogData.mainItem!.id),
          );
        })
        .catch(() => setSiblingSubcategories([]));
    } else {
      setSiblingSubcategories([]);
    }
  }, [type, catalogData?.mainItem?.id, catalogData?.mainItem?.category_id]);

  const fetchCatalogData = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (type) params.type = type;
      if (id) params.id = parseInt(id);

      // Add filter params
      Object.entries(selectedFilters).forEach(([key, value]) => {
        if (value) params[key] = parseInt(value);
      });

      const response = await catalogApi.getCatalogData(params);
      if (response.data.success) {
        setCatalogData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching catalog data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    const newFilters = {
      ...selectedFilters,
      [filterKey]: value === "all" ? "" : value,
    };
    setSelectedFilters(newFilters);

    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      newParams.set(filterKey, value);
    } else {
      newParams.delete(filterKey);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSelectedFilters({
      category_id: "",
      subcategory_id: "",
      brand_id: "",
      manufacturer_id: "",
    });
    setSearchParams({});
  };

  const getTypeLabel = (type: string | null) => {
    switch (type) {
      case "category":
        return "Categoría";
      case "subcategory":
        return "Subcategoría";
      case "brand":
        return "Marca";
      case "manufacturer":
        return "Fabricante";
      default:
        return "Catálogo";
    }
  };

  const getTypeIcon = (type: string | null) => {
    const iconProps = { size: 48, className: "text-steel-400" };
    switch (type) {
      case "category":
        return <FolderOpen {...iconProps} />;
      case "subcategory":
        return <Layers {...iconProps} />;
      case "brand":
        return <Tag {...iconProps} />;
      case "manufacturer":
        return <Factory {...iconProps} />;
      default:
        return <Box {...iconProps} />;
    }
  };

  const renderItemCard = (item: any, itemType: string) => {
    const linkType = itemType;
    const linkId = item.id;

    return (
      <div
        key={`${itemType}-${item.id}`}
        className="group bg-white rounded-xl border-2 border-steel-200 hover:border-accent hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        <Link to={`/catalog?type=${linkType}&id=${linkId}`}>
          <div className="aspect-video bg-gradient-to-br from-steel-100 to-steel-200 overflow-hidden">
            {item.main_image ? (
              <img
                src={getImageUrl(item.main_image)}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {getTypeIcon(itemType)}
              </div>
            )}
          </div>
        </Link>
        <div className="p-6">
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs">
              {getTypeLabel(itemType)}
            </Badge>
          </div>
          <Link to={`/catalog?type=${linkType}&id=${linkId}`}>
            <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
              {item.name}
            </h3>
          </Link>

          {/* Related info */}
          <div className="space-y-1 mb-3 text-sm text-steel-600">
            {item.category_name && (
              <p className="flex items-center gap-1.5">
                <FolderOpen size={14} className="text-steel-400" />
                {item.category_name}
              </p>
            )}
            {item.subcategory_name && (
              <p className="flex items-center gap-1.5">
                <Layers size={14} className="text-steel-400" />
                {item.subcategory_name}
              </p>
            )}
            {item.manufacturer_name && (
              <p className="flex items-center gap-1.5">
                <Factory size={14} className="text-steel-400" />
                {item.manufacturer_name}
              </p>
            )}
          </div>

          {item.description && (
            <p className="text-steel-600 text-sm line-clamp-3 mb-4">
              {item.description}
            </p>
          )}

          <div className="flex items-center gap-2">
            <Link
              to={`/catalog?type=${linkType}&id=${linkId}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-steel-200 rounded-lg text-steel-700 font-semibold hover:border-accent hover:text-accent transition-all text-sm"
            >
              Ver detalles <ArrowRight size={14} />
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const prefill: any = {};
                if (itemType === "brand") {
                  prefill.brand = item.name;
                  prefill.brand_id = item.id;
                }
                if (itemType === "manufacturer") {
                  prefill.manufacturer_id = item.id;
                }
                if (itemType === "category") {
                  prefill.category_id = item.id;
                }
                if (itemType === "subcategory") {
                  prefill.subcategory_id = item.id;
                }
                openNewWizard(prefill);
              }}
              className="px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-orange-600 transition-all text-sm whitespace-nowrap"
            >
              <FileText size={14} className="inline" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-steel-50">
      <SEO
        title={`${catalogData?.mainItem?.name || "Catálogo"} - Industrial`}
        description="Explora nuestro catálogo industrial completo"
      />

      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-steel-600">
          <Link to="/" className="hover:text-accent transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-accent transition-colors">
            Catálogo
          </Link>
          {catalogData?.mainItem && (
            <>
              <span>/</span>
              <span className="text-primary font-semibold">
                {catalogData.mainItem.name}
              </span>
            </>
          )}
        </div>

        {/* Catalog Header - Show when no specific item */}
        {!catalogData?.mainItem && !loading && (
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-primary mb-4">
              Catálogo Industrial
            </h1>
            <p className="text-steel-600 text-lg">
              Explora nuestro catálogo completo de productos, categorías,
              fabricantes y marcas
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <>
            {/* Main Item Header */}
            {catalogData?.mainItem && (
              <div className="mb-12 bg-white rounded-2xl border-2 border-steel-200 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image */}
                  <div className="aspect-video lg:aspect-square bg-gradient-to-br from-steel-100 to-steel-200">
                    {catalogData.mainItem.main_image ? (
                      <img
                        src={getImageUrl(catalogData.mainItem.main_image)}
                        alt={catalogData.mainItem.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="scale-[2]">{getTypeIcon(type)}</div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col justify-center">
                    <Badge variant="secondary" className="mb-4 w-fit">
                      {getTypeLabel(type)}
                    </Badge>
                    <h1 className="text-4xl sm:text-5xl font-black text-primary mb-4">
                      {catalogData.mainItem.name}
                    </h1>

                    {/* Related metadata */}
                    <div className="space-y-2 mb-6">
                      {catalogData.mainItem.category_name && (
                        <p className="text-steel-700">
                          <strong>Categoría:</strong>{" "}
                          {catalogData.mainItem.category_name}
                        </p>
                      )}
                      {catalogData.mainItem.subcategory_name && (
                        <p className="text-steel-700">
                          <strong>Subcategoría:</strong>{" "}
                          {catalogData.mainItem.subcategory_name}
                        </p>
                      )}
                      {catalogData.mainItem.manufacturer_name && (
                        <p className="text-steel-700">
                          <strong>Fabricante:</strong>{" "}
                          {catalogData.mainItem.manufacturer_name}
                        </p>
                      )}
                    </div>

                    {catalogData.mainItem.description && (
                      <p className="text-steel-600 text-lg leading-relaxed mb-6">
                        {catalogData.mainItem.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Filters */}
            <div className="mb-8 bg-white rounded-xl border-2 border-steel-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Filter size={20} />
                  Filtros Avanzados
                </h2>
                {(selectedFilters.category_id ||
                  selectedFilters.subcategory_id ||
                  selectedFilters.brand_id ||
                  selectedFilters.manufacturer_id) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                {catalogData?.relatedCategories &&
                  catalogData.relatedCategories.length > 0 && (
                    <Select
                      value={selectedFilters.category_id}
                      onValueChange={(value) =>
                        handleFilterChange("category_id", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Todas las categorías
                        </SelectItem>
                        {catalogData.relatedCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                {/* Subcategory Filter */}
                {catalogData?.relatedSubcategories &&
                  catalogData.relatedSubcategories.length > 0 && (
                    <Select
                      value={selectedFilters.subcategory_id}
                      onValueChange={(value) =>
                        handleFilterChange("subcategory_id", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Subcategoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Todas las subcategorías
                        </SelectItem>
                        {catalogData.relatedSubcategories.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id.toString()}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                {/* Manufacturer Filter */}
                {catalogData?.relatedManufacturers &&
                  catalogData.relatedManufacturers.length > 0 && (
                    <Select
                      value={selectedFilters.manufacturer_id}
                      onValueChange={(value) =>
                        handleFilterChange("manufacturer_id", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Fabricante" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Todos los fabricantes
                        </SelectItem>
                        {catalogData.relatedManufacturers.map((mfg) => (
                          <SelectItem key={mfg.id} value={mfg.id.toString()}>
                            {mfg.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                {/* Brand Filter */}
                {catalogData?.relatedBrands &&
                  catalogData.relatedBrands.length > 0 && (
                    <Select
                      value={selectedFilters.brand_id}
                      onValueChange={(value) =>
                        handleFilterChange("brand_id", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Marca" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las marcas</SelectItem>
                        {catalogData.relatedBrands.map((brand) => (
                          <SelectItem
                            key={brand.id}
                            value={brand.id.toString()}
                          >
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
              </div>
            </div>

            {/* Related Items Sections */}
            <div className="space-y-12">
              {/* Sibling Subcategories - only shown when viewing a subcategory */}
              {type === "subcategory" && siblingSubcategories.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Layers size={22} className="text-accent flex-shrink-0" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                      Subcategorías de{" "}
                      <span className="text-accent">
                        {catalogData?.mainItem?.category_name}
                      </span>
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {siblingSubcategories.map((sub) =>
                      renderItemCard(sub, "subcategory"),
                    )}
                  </div>
                </section>
              )}

              {/* Categories - Show when no type selected OR when there are related categories */}
              {catalogData?.relatedCategories &&
                catalogData.relatedCategories.length > 0 && (
                  <section>
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
                      {!type
                        ? "Todas las Categorías"
                        : "Categorías Relacionadas"}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {catalogData.relatedCategories.map((cat) =>
                        renderItemCard(cat, "category"),
                      )}
                    </div>
                  </section>
                )}

              {/* Subcategories */}
              {catalogData?.relatedSubcategories &&
                catalogData.relatedSubcategories.length > 0 && (
                  <section>
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
                      Subcategorías
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {catalogData.relatedSubcategories.map((sub) =>
                        renderItemCard(sub, "subcategory"),
                      )}
                    </div>
                  </section>
                )}

              {/* Manufacturers */}
              {catalogData?.relatedManufacturers &&
                catalogData.relatedManufacturers.length > 0 && (
                  <section>
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
                      Fabricantes
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {catalogData.relatedManufacturers.map((mfg) =>
                        renderItemCard(mfg, "manufacturer"),
                      )}
                    </div>
                  </section>
                )}

              {/* Brands */}
              {catalogData?.relatedBrands &&
                catalogData.relatedBrands.length > 0 && (
                  <section>
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
                      Marcas
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {catalogData.relatedBrands.map((brand) =>
                        renderItemCard(brand, "brand"),
                      )}
                    </div>
                  </section>
                )}

              {/* Empty State */}
              {!catalogData?.relatedCategories?.length &&
                !catalogData?.relatedSubcategories?.length &&
                !catalogData?.relatedManufacturers?.length &&
                !catalogData?.relatedBrands?.length && (
                  <div className="text-center py-20">
                    <p className="text-steel-600 text-lg mb-4">
                      No se encontraron elementos relacionados
                    </p>
                    <Link
                      to="/"
                      className="inline-flex items-center gap-2 text-accent font-bold hover:text-primary transition-colors"
                    >
                      <ArrowRight size={16} className="rotate-180" />
                      Volver al inicio
                    </Link>
                  </div>
                )}
            </div>
          </>
        )}
      </div>

      {/* Floating Quote Button with Smart Prefill */}
      <button
        onClick={() => {
          const prefill: any = {};

          // Get brand info from main item or filters
          if (catalogData?.mainItem?.type === "brand") {
            prefill.brand = catalogData.mainItem.name;
            prefill.brand_id = catalogData.mainItem.id;
          } else if (selectedFilters.brand_id) {
            const brand = catalogData?.relatedBrands.find(
              (b) => b.id === parseInt(selectedFilters.brand_id),
            );
            if (brand) {
              prefill.brand = brand.name;
              prefill.brand_id = brand.id;
            }
          }

          // Get manufacturer info
          if (catalogData?.mainItem?.type === "manufacturer") {
            prefill.manufacturer_id = catalogData.mainItem.id;
          } else if (selectedFilters.manufacturer_id) {
            prefill.manufacturer_id = parseInt(selectedFilters.manufacturer_id);
          }

          // Get category info
          if (catalogData?.mainItem?.type === "category") {
            prefill.category_id = catalogData.mainItem.id;
          } else if (selectedFilters.category_id) {
            prefill.category_id = parseInt(selectedFilters.category_id);
          }

          // Get subcategory info
          if (catalogData?.mainItem?.type === "subcategory") {
            prefill.subcategory_id = catalogData.mainItem.id;
          } else if (selectedFilters.subcategory_id) {
            prefill.subcategory_id = parseInt(selectedFilters.subcategory_id);
          }

          openNewWizard(prefill);
        }}
        id="cotizar-ahora-btn"
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
    </div>
  );
}
