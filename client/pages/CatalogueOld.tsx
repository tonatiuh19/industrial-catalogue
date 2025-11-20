import { useState, useMemo } from "react";
import { ChevronDown, ShoppingCart } from "lucide-react";
import Header from "@/components/Header";
import ProductFilters from "@/components/ProductFilters";
import QuoteWizard from "@/components/QuoteWizard";
import { useQuote } from "@/context/QuoteContext";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
}

// Mock product data
const mockProducts: Product[] = [
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

export default function Catalogue() {
  const { selectedProducts, addProduct, openWizard, isWizardOpen } = useQuote();
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
      filtered = filtered.filter((p) => filters.categories.includes(p.category));
    }

    filtered = filtered.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
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

  const handleRequestQuote = (product: Product) => {
    addProduct({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="hero-gradient text-white py-12 sm:py-20 lg:py-28 relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent rounded-full opacity-15 blur-3xl animate-pulse" style={{ animationDuration: "4s" }}></div>
        <div className="absolute -bottom-20 -left-40 w-80 h-80 bg-white/10 rounded-full opacity-10 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="space-y-6 sm:space-y-8">
            {/* Header badge */}
            <div className="inline-block">
              <span className="px-4 py-2 bg-accent/20 text-accent text-xs sm:text-sm font-bold rounded-full border border-accent/40 backdrop-blur-sm">
                🏭 Catálogo Industrial Profesional
              </span>
            </div>

            {/* Main heading */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight">
                <span className="block">Catálogo</span>
                <span className="block bg-gradient-to-r from-accent to-orange-400 bg-clip-text text-transparent">
                  Industrial Completo
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-steel-100 max-w-3xl leading-relaxed">
                Miles de productos profesionales organizados para facilitar tu búsqueda. Filtros inteligentes, precios competitivos y cotizaciones personalizadas en minutos.
              </p>
            </div>

            {/* Quick info stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 sm:pt-8">
              {[
                { label: "Productos", value: "5K+" },
                { label: "Categorías", value: "6+" },
                { label: "Marcas", value: "100+" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center sm:items-start">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-accent">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-steel-200 mt-1 sm:mt-2 font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="text-sm text-steel-600">
              Mostrando{" "}
              <span className="font-bold text-primary">
                {filteredAndSortedProducts.length}
              </span>{" "}
              productos
            </div>
            {selectedProducts.length > 0 && (
              <button
                onClick={() => {
                  openWizard();
                  setIsFilterOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                <ShoppingCart size={18} />
                Cotizar {selectedProducts.length} producto
                {selectedProducts.length !== 1 ? "s" : ""}
              </button>
            )}
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
            <ProductFilters
              onFilterChange={setFilters}
              isOpen={true}
            />
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
                  <ProductCard
                    key={product.id}
                    product={product}
                    onRequestQuote={() => handleRequestQuote(product)}
                  />
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

      {/* Footer */}
      <footer className="bg-gradient-to-b from-primary to-steel-950 text-white mt-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-lg mb-6">Sobre Industrial</h3>
              <ul className="space-y-3 text-steel-300 text-sm">
                <li>
                  <a href="#" className="hover:text-accent transition-colors duration-200">
                    Acerca de nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors duration-200">
                    Nuestro equipo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors duration-200">
                    Carreras
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Productos</h3>
              <ul className="space-y-3 text-steel-300 text-sm">
                <li>
                  <a href="#" className="hover:text-accent transition-colors duration-200">
                    Herramientas
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors duration-200">
                    Equipamiento
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors duration-200">
                    Componentes
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Soporte</h3>
              <ul className="space-y-3 text-steel-300 text-sm">
                <li>
                  <a href="#" className="hover:text-accent transition-colors duration-200">
                    Centro de ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors duration-200">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors duration-200">
                    Garantía
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Legales</h3>
              <ul className="space-y-3 text-steel-300 text-sm">
                <li>
                  <a href="#" className="hover:text-accent transition-colors duration-200">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors duration-200">
                    Términos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors duration-200">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-steel-700 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-steel-400">
            <p>&copy; 2024 Industrial. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-6 sm:mt-0">
              <a href="#" className="hover:text-accent transition-colors duration-200">
                Facebook
              </a>
              <a href="#" className="hover:text-accent transition-colors duration-200">
                LinkedIn
              </a>
              <a href="#" className="hover:text-accent transition-colors duration-200">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Quote Wizard Modal */}
      {isWizardOpen && <QuoteWizard />}
    </div>
  );
}

// ProductCard component for catalogue
function ProductCard({
  product,
  onRequestQuote,
}: {
  product: Product;
  onRequestQuote: () => void;
}) {
  const { selectedProducts } = useQuote();
  const isSelected = selectedProducts.some((p) => p.id === product.id);

  return (
    <div className={`bg-white border-2 rounded-xl overflow-hidden transition-all duration-300 group ${isSelected ? "border-accent shadow-xl shadow-accent/20" : "border-steel-200 hover:border-accent hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1"}`}>
      {/* Image container */}
      <div className="relative bg-gradient-to-br from-steel-100 to-steel-50 aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* In stock badge */}
        {product.inStock && (
          <div className="absolute bottom-4 left-4">
            <span className="inline-block bg-gradient-to-r from-primary to-steel-800 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-lg">
              ✓ En Stock
            </span>
          </div>
        )}

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-4 right-4">
            <div className="bg-gradient-to-br from-accent to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
              ✓
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Category */}
        <div>
          <p className="text-xs font-black text-accent uppercase tracking-widest">
            {product.category}
          </p>
        </div>

        {/* Product name */}
        <h3 className="text-base font-bold text-primary line-clamp-2 group-hover:text-accent transition-colors duration-200 cursor-pointer">
          {product.name}
        </h3>

        {/* SKU */}
        <p className="text-xs text-steel-500 font-mono">
          <span className="text-steel-400">SKU:</span> {product.sku}
        </p>

        {/* Price */}
        <div className="pt-2 border-t border-steel-100">
          <p className="text-2xl font-black text-primary">
            ${product.price.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-xs text-steel-500 mt-1">Precio unitario</p>
        </div>

        {/* Request quote button */}
        <button
          onClick={onRequestQuote}
          className={`w-full py-3 font-bold text-sm rounded-lg transition-all duration-200 mt-4 ${
            isSelected
              ? "bg-gradient-to-r from-accent to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30"
              : "bg-gradient-to-r from-primary to-steel-800 text-white hover:shadow-lg hover:shadow-primary/30"
          } active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={!product.inStock}
        >
          {isSelected ? "✓ Agregado a Cotización" : "Solicitar Cotización"}
        </button>
      </div>
    </div>
  );
}
