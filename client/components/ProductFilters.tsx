import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  availability: string | null;
  brands: string[];
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const ProductFilters = ({
  onFilterChange,
  isOpen = true,
  onClose,
}: ProductFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 50000],
    availability: null,
    brands: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    availability: true,
    brands: true,
  });

  const categories = [
    "Herramientas",
    "Equipamiento",
    "Componentes",
    "Materiales",
    "Seguridad",
  ];

  const brands = [
    "ProIndustrial",
    "SteelWorks",
    "MegaTools",
    "PrecisionTech",
    "SafetyFirst",
  ];

  const toggleSection = (
    section: keyof typeof expandedSections
  ) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleCategory = (category: string) => {
    const updated = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    const newFilters = { ...filters, categories: updated };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleBrand = (brand: string) => {
    const updated = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    const newFilters = { ...filters, brands: updated };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAvailability = (value: string) => {
    const newAvailability = filters.availability === value ? null : value;
    const newFilters = { ...filters, availability: newAvailability };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = value;
    if (newRange[0] <= newRange[1]) {
      const newFilters = { ...filters, priceRange: newRange };
      setFilters(newFilters);
      onFilterChange(newFilters);
    }
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.availability !== null ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 50000;

  return (
    <div className={`bg-white border border-steel-200 ${!isOpen ? "hidden" : ""}`}>
      {/* Header */}
      <div className="p-4 border-b border-steel-100 flex items-center justify-between">
        <h2 className="font-bold text-primary">Filtros</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-steel-500 hover:text-primary"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Filters content */}
      <div className="divide-y divide-steel-100">
        {/* Categories */}
        <div className="p-4">
          <button
            onClick={() => toggleSection("category")}
            className="w-full flex items-center justify-between font-semibold text-sm text-primary mb-3 hover:text-accent transition-colors"
          >
            Categoría
            <ChevronDown
              size={18}
              className={`transition-transform ${
                expandedSections.category ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.category && (
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="text-sm text-steel-700 group-hover:text-primary">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="p-4">
          <button
            onClick={() => toggleSection("price")}
            className="w-full flex items-center justify-between font-semibold text-sm text-primary mb-3 hover:text-accent transition-colors"
          >
            Precio
            <ChevronDown
              size={18}
              className={`transition-transform ${
                expandedSections.price ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.price && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-steel-600 mb-2 block">
                  Mínimo: ${filters.priceRange[0].toLocaleString("es-MX")}
                </label>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-steel-600 mb-2 block">
                  Máximo: ${filters.priceRange[1].toLocaleString("es-MX")}
                </label>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Availability */}
        <div className="p-4">
          <button
            onClick={() => toggleSection("availability")}
            className="w-full flex items-center justify-between font-semibold text-sm text-primary mb-3 hover:text-accent transition-colors"
          >
            Disponibilidad
            <ChevronDown
              size={18}
              className={`transition-transform ${
                expandedSections.availability ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.availability && (
            <div className="space-y-2">
              {["En Stock", "Disponible en 2-3 días", "Bajo pedido"].map(
                (option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="availability"
                      checked={filters.availability === option}
                      onChange={() => handleAvailability(option)}
                      className="w-4 h-4 accent-accent"
                    />
                    <span className="text-sm text-steel-700 group-hover:text-primary">
                      {option}
                    </span>
                  </label>
                )
              )}
            </div>
          )}
        </div>

        {/* Brands */}
        <div className="p-4">
          <button
            onClick={() => toggleSection("brands")}
            className="w-full flex items-center justify-between font-semibold text-sm text-primary mb-3 hover:text-accent transition-colors"
          >
            Marca
            <ChevronDown
              size={18}
              className={`transition-transform ${
                expandedSections.brands ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.brands && (
            <div className="space-y-2">
              {brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="text-sm text-steel-700 group-hover:text-primary">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <div className="p-4">
            <button
              onClick={() => {
                const clearedFilters: FilterState = {
                  categories: [],
                  priceRange: [0, 50000],
                  availability: null,
                  brands: [],
                };
                setFilters(clearedFilters);
                onFilterChange(clearedFilters);
              }}
              className="w-full py-2 border border-steel-300 text-primary font-semibold text-sm hover:bg-steel-50 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
