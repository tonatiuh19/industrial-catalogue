import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import Footer from "@/components/Footer";

// Mock product data
const mockProducts = [
  {
    id: "1",
    name: "Taladro Industrial Profesional",
    sku: "DRL-PRO-2024",
    price: 2450,
    category: "Herramientas",
    image:
      "https://images.unsplash.com/photo-1532092165291-347b0442e6ef?w=400&h=400&fit=crop",
    inStock: true,
  },
  {
    id: "2",
    name: "Compresor de Aire Industrial 200L",
    sku: "CMP-200-SS",
    price: 5890,
    category: "Equipamiento",
    image:
      "https://images.unsplash.com/photo-1581577668550-ce206bc92de0?w=400&h=400&fit=crop",
    inStock: true,
  },
  {
    id: "3",
    name: "Casco de Seguridad Industrial Premium",
    sku: "HST-SAFE-PRO",
    price: 425,
    category: "Seguridad",
    image:
      "https://images.unsplash.com/photo-1585390503960-a27cadf96a87?w=400&h=400&fit=crop",
    inStock: true,
  },
  {
    id: "4",
    name: "Juego de Herramientas Profesional 150pz",
    sku: "TLK-150-PRO",
    price: 3250,
    category: "Herramientas",
    image:
      "https://images.unsplash.com/photo-1517420879691-38b6be58d54e?w=400&h=400&fit=crop",
    inStock: true,
  },
  {
    id: "5",
    name: "Guantes de Trabajo de Nitrilo Industrial",
    sku: "GLV-NTR-100",
    price: 185,
    category: "Seguridad",
    image:
      "https://images.unsplash.com/photo-1576091160669-112d23d34d47?w=400&h=400&fit=crop",
    inStock: true,
  },
  {
    id: "6",
    name: "Cadenas de Acero Galvanizado 10mm",
    sku: "CHN-GAL-10",
    price: 890,
    category: "Materiales",
    image:
      "https://images.unsplash.com/photo-1591082188657-f76fb74be539?w=400&h=400&fit=crop",
    inStock: true,
  },
  {
    id: "7",
    name: "Pernos de Anclaje Industrial 20mm",
    sku: "BLT-ANCH-20",
    price: 340,
    category: "Componentes",
    image:
      "https://images.unsplash.com/photo-1513402776144-7b5f13ce2c15?w=400&h=400&fit=crop",
    inStock: true,
  },
  {
    id: "8",
    name: "Llave Inglesa Profesional 450mm",
    sku: "WRN-ENG-450",
    price: 620,
    category: "Herramientas",
    image:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=400&fit=crop",
    inStock: true,
  },
  {
    id: "9",
    name: "Lámpara LED Industrial 150W",
    sku: "LMP-LED-150",
    price: 1250,
    category: "Equipamiento",
    image:
      "https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=400&h=400&fit=crop",
    inStock: true,
  },
  {
    id: "10",
    name: "Soldador MMA 200A Profesional",
    sku: "WLD-MMA-200",
    price: 8950,
    category: "Equipamiento",
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop",
    inStock: false,
  },
  {
    id: "11",
    name: "Espuma Expandida Anti-Vibración",
    sku: "FOM-AVB-NXP",
    price: 275,
    category: "Materiales",
    image:
      "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop",
    inStock: true,
  },
  {
    id: "12",
    name: "Rodamientos de Bolas de Precisión SKF",
    sku: "BRG-SKF-PREC",
    price: 520,
    category: "Componentes",
    image:
      "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400&h=400&fit=crop",
    inStock: true,
  },
];

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  availability: string | null;
  brands: string[];
}

type SortOption = "relevance" | "price-low" | "price-high" | "newest";

export default function Index() {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 50000],
    availability: null,
    brands: [],
  });
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = mockProducts;

    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) =>
        filters.categories.includes(p.category),
      );
    }

    filtered = filtered.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1],
    );

    if (filters.availability === "En Stock") {
      filtered = filtered.filter((p) => p.inStock);
    }

    let sorted = [...filtered];
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sorted.reverse();
        break;
      default:
        break;
    }

    return sorted;
  }, [filters, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Catálogo Industrial
          </h1>
          <p className="text-lg text-steel-200 max-w-2xl">
            Encuentra todo lo que necesitas para tus proyectos industriales.
            Herramientas profesionales, equipamiento confiable y componentes de
            calidad.
          </p>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="text-sm text-steel-600">
            Mostrando{" "}
            <span className="font-bold text-primary">
              {filteredAndSortedProducts.length}
            </span>{" "}
            productos
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-white border border-steel-200 px-4 py-2 text-sm font-medium text-steel-700 hover:text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent pr-10"
              >
                <option value="relevance">Relevancia</option>
                <option value="price-low">Precio: Menor a Mayor</option>
                <option value="price-high">Precio: Mayor a Menor</option>
                <option value="newest">Más Nuevos</option>
              </select>
              <ChevronDown
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-steel-400 pointer-events-none"
              />
            </div>

            {/* Filter toggle button - mobile */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden w-full bg-primary text-white py-2 font-semibold text-sm hover:bg-steel-800 transition-colors"
            >
              {isFilterOpen ? "Cerrar Filtros" : "Abrir Filtros"}
            </button>
          </div>
        </div>

        {/* Products grid with filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters - desktop sidebar */}
          <aside className="hidden md:block">
            <ProductFilters onFilterChange={setFilters} isOpen={true} />
          </aside>

          {/* Main content area */}
          <div className="md:col-span-3">
            {/* Mobile filters */}
            {isFilterOpen && (
              <div className="md:hidden mb-8">
                <ProductFilters
                  onFilterChange={setFilters}
                  isOpen={isFilterOpen}
                  onClose={() => setIsFilterOpen(false)}
                />
              </div>
            )}

            {/* Products grid */}
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-steel-600 mb-4">
                  No se encontraron productos
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      categories: [],
                      priceRange: [0, 50000],
                      availability: null,
                      brands: [],
                    })
                  }
                  className="text-accent font-semibold hover:text-primary"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
