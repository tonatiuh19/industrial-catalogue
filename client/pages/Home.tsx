import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  Shield,
  Truck,
  Users,
  CheckCircle2,
  Wrench,
  Lightbulb,
  Package,
  Factory,
  Tag,
  Layers,
  FolderOpen,
  Box,
  FileText,
} from "lucide-react";
import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as MdIcons from "react-icons/md";
import { IconType } from "react-icons";
import SEO from "@/components/SEO";
import NewQuoteWizard from "@/components/NewQuoteWizard";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import QuickQuoteForm from "@/components/QuickQuoteForm";
import { useQuote } from "@/context/QuoteContext";
import { getImageUrl } from "@/services/image-upload.service";
import { homeSectionsApi } from "@/services/api.service";

interface HomeSectionItem {
  id: number;
  name: string;
  slug?: string;
  description: string | null;
  main_image: string | null;
  type: "category" | "subcategory" | "brand" | "manufacturer";
  category_id?: number;
  category_name?: string;
  subcategory_id?: number;
  subcategory_name?: string;
  manufacturer_id?: number;
  manufacturer_name?: string;
  items?: Array<{
    id: number;
    name: string;
    slug?: string;
    main_image?: string | null;
  }>;
}

interface CategoryWithIcon {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  main_image?: string | null;
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [sections, setSections] = useState<HomeSectionItem[]>([]);
  const [brands, setBrands] = useState<Array<{ id: number; name: string }>>([]);
  const [categories, setCategories] = useState<CategoryWithIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const { isNewWizardOpen, openNewWizard, closeNewWizard, prefillData } =
    useQuote();

  // Debug logging for wizard state
  useEffect(() => {
    console.log("Wizard state changed:", { isNewWizardOpen, prefillData });
  }, [isNewWizardOpen, prefillData]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 300);

      // Show floating button after scrolling past the quotation form (approximately 800px)
      setShowFloatingButton(scrollY > 800);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchSections();
    fetchBrands();
    fetchCategories();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/brands");
      const data = await response.json();
      if (data.success && data.data) {
        // Get first 15 brands or all if less than 15
        setBrands(data.data.slice(0, 15));
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setBrandsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (data.success && data.data) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Map category slug to React Icons
  const getIconForCategory = (slug: string): IconType => {
    const iconMap: Record<string, IconType> = {
      "transmision-de-potencia": GiIcons.GiGears,
      "automatizaci-n-y-control": MdIcons.MdSettings,
      "neumatica-e-hidraulica": GiIcons.GiPipes,
      "herramientas-y-mantenimiento": FaIcons.FaWrench,
      "suministros-industriales": FaIcons.FaBoxes,
      "seguridad-industrial": FaIcons.FaShieldAlt,
      "maquinaria-y-equipos": GiIcons.GiFactory,
      "servicios-industriales": FaIcons.FaTools,
      marcas: FaIcons.FaTags,
      "industrial-tools": FaIcons.FaIndustry,
    };
    return iconMap[slug] || FaIcons.FaCube;
  };

  // Map category slug to color gradients
  const getColorForCategory = (slug: string): string => {
    const colorMap: Record<string, string> = {
      "transmision-de-potencia": "from-purple-500 to-purple-600",
      "automatizaci-n-y-control": "from-blue-500 to-blue-600",
      "neumatica-e-hidraulica": "from-cyan-500 to-cyan-600",
      "herramientas-y-mantenimiento": "from-orange-500 to-orange-600",
      "suministros-industriales": "from-green-500 to-green-600",
      "seguridad-industrial": "from-red-500 to-red-600",
      "maquinaria-y-equipos": "from-indigo-500 to-indigo-600",
      "servicios-industriales": "from-yellow-500 to-yellow-600",
      marcas: "from-pink-500 to-pink-600",
      "industrial-tools": "from-steel-500 to-steel-600",
    };
    return colorMap[slug] || "from-gray-500 to-gray-600";
  };

  const fetchSections = async () => {
    try {
      const response = await homeSectionsApi.getRandomSections(3);
      if (response.data.success) {
        setSections(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSectionTypeLabel = (type: string) => {
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
        return type;
    }
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "category":
        return FolderOpen;
      case "subcategory":
        return Layers;
      case "brand":
        return Tag;
      case "manufacturer":
        return Factory;
      default:
        return Box;
    }
  };

  const handleQuoteSubmit = (data: {
    brand?: string;
    brand_id?: number;
    category_id?: number;
    part_number?: string;
    product_type?: string;
    description?: string;
  }) => {
    console.log("Opening wizard with complete prefill data:", data);
    openNewWizard(data);
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Trenor - Herramientas y Equipamiento de Calidad"
        description="Descubre el mejor catálogo de productos industriales. Herramientas profesionales, equipamiento de calidad y soluciones innovadoras para tu empresa."
      />
      {/* Fixed Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "glass-header border-b border-white/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={
                isScrolled
                  ? "https://disruptinglabs.com/data/trenor/assets/images/logo_dark_trenor.png"
                  : "https://disruptinglabs.com/data/trenor/assets/images/logo_white_trenor.png"
              }
              alt="Trenor Logo"
              className="h-8 w-auto object-contain transition-opacity duration-500"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {/* <a
              href="#features"
              className={`font-medium text-sm lg:text-base transition-colors duration-300 ${
                isScrolled
                  ? "text-steel-700 hover:text-primary"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Características
            </a>
            <a
              href="#why-us"
              className={`font-medium text-sm lg:text-base transition-colors duration-300 ${
                isScrolled
                  ? "text-steel-700 hover:text-primary"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Por qué nosotros
            </a> */}
            <Link
              to="/catalog"
              className={`px-4 lg:px-6 py-2 font-semibold text-sm lg:text-base rounded-lg transition-all duration-300 ${
                isScrolled
                  ? "bg-accent text-white hover:bg-orange-600"
                  : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
              }`}
            >
              Ver Catálogo
            </Link>
          </nav>
          <Link
            to="/catalog"
            className={`md:hidden px-3 py-2 font-semibold text-xs rounded-lg transition-all duration-300 ${
              isScrolled
                ? "bg-accent text-white hover:bg-orange-600"
                : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
            }`}
          >
            Catálogo
          </Link>
        </div>
      </header>

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Quick Quote Form - Full Width After Hero */}
      <QuickQuoteForm
        brands={brands}
        categories={categories}
        onSubmit={handleQuoteSubmit}
      />

      {/* Featured Random Sections - Simple Image Grid */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {loading ? (
              // Loading skeleton
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-steel-100 rounded-2xl animate-pulse">
                  <div className="aspect-video bg-steel-200 rounded-2xl"></div>
                </div>
              ))
            ) : sections.length > 0 ? (
              sections.map((section) => (
                <Link
                  key={`${section.type}-${section.id}`}
                  to={`/catalog?type=${section.type}&id=${section.id}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    {section.main_image ? (
                      <img
                        src={getImageUrl(section.main_image)}
                        alt={section.name}
                        className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full aspect-video bg-steel-100 flex items-center justify-center">
                        <Box className="w-12 h-12 sm:w-16 sm:h-16 text-steel-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-lg sm:text-xl font-bold mb-1">
                        {section.name}
                      </h3>
                      <p className="text-sm opacity-90">
                        {getSectionTypeLabel(section.type)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Package className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-steel-400 mb-4" />
                <p className="text-steel-600">No hay secciones disponibles</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Sections - Random Display */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-steel-50 to-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-primary mb-3 sm:mb-4">
              Descubre Nuestro Catálogo
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-steel-600 max-w-2xl mx-auto">
              Explora categorías, marcas y fabricantes de equipamiento
              industrial
            </p>
          </div>

          {/* Dynamic Sections Grid - Mobile Optimized */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {loading ? (
              // Loading skeleton
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border-2 border-steel-200 p-4 sm:p-6 animate-pulse"
                >
                  <div className="h-6 sm:h-8 bg-steel-200 rounded mb-4 sm:mb-6 w-3/4"></div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="space-y-3">
                        <div className="w-full aspect-square bg-steel-200 rounded-lg"></div>
                        <div className="h-3 sm:h-4 bg-steel-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : sections.length > 0 ? (
              sections.map((section) => {
                const SectionIcon = getSectionIcon(section.type);
                return (
                  <div
                    key={`${section.type}-${section.id}`}
                    className="bg-white rounded-2xl border-2 border-steel-200 hover:border-accent transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl group flex flex-col"
                  >
                    {/* Section Header */}
                    <div className="p-5 sm:p-6 bg-gradient-to-r from-primary to-steel-800 group-hover:from-accent group-hover:to-orange-600 transition-all duration-300 min-h-[96px] sm:min-h-[112px] flex flex-col justify-center">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 flex items-center gap-3">
                        <SectionIcon className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
                        <span className="line-clamp-2">{section.name}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-white/80">
                        {getSectionTypeLabel(section.type)}
                      </p>
                    </div>

                    {/* Section Items Grid */}
                    <div className="p-4 sm:p-6 flex-1 flex flex-col">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-auto">
                        {section.items && section.items.length > 0 ? (
                          section.items.map((item) => (
                            <Link
                              key={item.id}
                              to={`/catalog?type=${section.type}&id=${section.id}`}
                              className="group/item block"
                            >
                              {/* Item Card */}
                              <div className="relative bg-white border-2 border-steel-200 rounded-xl overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                {/* Item Image */}
                                <div className="aspect-square bg-steel-50 flex items-center justify-center overflow-hidden">
                                  {item.main_image ? (
                                    <img
                                      src={getImageUrl(item.main_image)}
                                      alt={item.name}
                                      className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                                    />
                                  ) : (
                                    <Box className="w-10 h-10 sm:w-12 sm:h-12 text-steel-400 group-hover/item:text-accent transition-colors" />
                                  )}
                                </div>

                                {/* Item Name */}
                                <div className="p-2 sm:p-3 text-center bg-white">
                                  <p className="text-xs sm:text-sm font-semibold text-primary group-hover/item:text-accent transition-colors line-clamp-2">
                                    {item.name}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-6 text-steel-500 text-sm">
                            No hay elementos disponibles
                          </div>
                        )}
                      </div>

                      {/* View All Link - Always at bottom */}
                      <Link
                        to={`/catalog?type=${section.type}&id=${section.id}`}
                        className="flex items-center justify-center gap-2 text-accent font-bold hover:text-primary transition-all py-3 sm:py-4 mt-3 sm:mt-4 border-t border-steel-200 group/link"
                      >
                        <span className="text-sm sm:text-base">Ver todo</span>
                        <ArrowRight
                          size={18}
                          className="group-hover/link:translate-x-1 transition-transform"
                        />
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              // Fallback if no sections
              <div className="col-span-full text-center py-12 bg-white rounded-2xl border-2 border-steel-200">
                <Package className="w-16 h-16 mx-auto text-steel-400 mb-4" />
                <p className="text-steel-600 mb-4">
                  No hay secciones disponibles
                </p>
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 text-accent font-bold hover:text-primary transition-colors"
                >
                  Ir al catálogo completo <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-steel-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary mb-4">
              Categorías de Productos
            </h2>
            <p className="text-base sm:text-lg text-steel-600 max-w-3xl mx-auto">
              Explora nuestra amplia gama de categorías industriales con
              productos especializados
            </p>
          </div>

          {/* Categories Grid */}
          {categoriesLoading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border-2 border-steel-200 animate-pulse overflow-hidden"
                >
                  <div className="aspect-video bg-steel-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-steel-200 rounded mb-3 w-3/4"></div>
                    <div className="h-4 bg-steel-200 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-steel-200 rounded mb-4 w-2/3"></div>
                    <div className="h-8 bg-steel-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => {
                const CategoryIcon = getIconForCategory(category.slug);
                return (
                  <Link
                    key={category.id}
                    to={`/catalog?category=${category.slug}`}
                    className="group block"
                  >
                    <div className="bg-white border-2 border-steel-200 rounded-2xl overflow-hidden hover:border-accent hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-4">
                      {/* Horizontal Layout: Image Left, Content Right */}
                      <div className="flex gap-4 items-start">
                        {/* Category Image/Icon - Left */}
                        <div className="w-16 h-16 bg-gradient-to-br from-steel-50 to-steel-100 relative overflow-hidden rounded-lg flex-shrink-0">
                          {category.main_image ? (
                            <img
                              src={getImageUrl(category.main_image)}
                              alt={category.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div
                              className={`w-full h-full bg-gradient-to-br ${getColorForCategory(category.slug)} flex items-center justify-center`}
                            >
                              <CategoryIcon className="w-8 h-8 text-white/90" />
                            </div>
                          )}
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
                        </div>

                        {/* Category Content - Right */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-black text-steel-800 mb-2 group-hover:text-accent transition-colors line-clamp-2">
                            {category.name}
                          </h3>

                          {category.description && (
                            <p className="text-xs text-steel-600 mb-3 line-clamp-2">
                              {category.description}
                            </p>
                          )}

                          {/* Ver más button */}
                          <div className="flex items-center gap-1 text-accent font-bold text-xs group-hover:gap-2 transition-all duration-300">
                            <span>Ver más</span>
                            <ArrowRight
                              size={12}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-steel-400 mb-4" />
              <p className="text-steel-600">No hay categorías disponibles</p>
            </div>
          )}

          {/* View All Categories Button */}
          <div className="text-center mt-12">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-white font-bold rounded-xl hover:bg-orange-600 transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              Ver Todas las Categorías
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-accent to-orange-600 text-white py-16 sm:py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 leading-tight">
            ¿Listo para Encontrar lo que Necesitas?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-orange-100 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Explora nuestro catálogo completo y solicita cotizaciones
            personalizadas para tu empresa. Sin compromiso.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 bg-white text-accent font-bold hover:bg-steel-100 transition-all duration-300 text-base sm:text-lg rounded-lg hover:shadow-2xl hover:shadow-white/20 active:scale-95"
          >
            Explorar Catálogo Ahora
            <ArrowRight size={20} className="sm:w-6 sm:h-6" />
          </Link>
        </div>
      </section>

      {/* Navigation Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-primary to-steel-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              Conoce Más Sobre Trenor
            </h2>
            <p className="text-base sm:text-lg text-steel-200 max-w-3xl mx-auto">
              Descubre nuestra empresa, servicios y cómo podemos ayudarte
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* About Us */}
            <Link
              to="/about"
              className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-accent/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                  Nosotros
                </h3>
                <p className="text-steel-200 text-sm leading-relaxed">
                  Conoce nuestra historia, misión y enfoque en soluciones
                  industriales
                </p>
                <div className="flex items-center gap-1 text-white font-semibold text-sm mt-4 group-hover:gap-2 transition-all">
                  <span>Conocer más</span>
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </Link>

            {/* FAQ */}
            <Link
              to="/faq"
              className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-accent/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
                  <Lightbulb className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                  FAQ
                </h3>
                <p className="text-steel-200 text-sm leading-relaxed">
                  Encuentra respuestas a las preguntas más frecuentes sobre
                  nuestros servicios
                </p>
                <div className="flex items-center gap-1 text-white font-semibold text-sm mt-4 group-hover:gap-2 transition-all">
                  <span>Ver preguntas</span>
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-accent/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
                  <Shield className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                  Contacto
                </h3>
                <p className="text-steel-200 text-sm leading-relaxed">
                  Ponte en contacto con nuestro equipo para cotizaciones
                  personalizadas
                </p>
                <div className="flex items-center gap-1 text-white font-semibold text-sm mt-4 group-hover:gap-2 transition-all">
                  <span>Contactar</span>
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </Link>

            {/* Catalog */}
            <Link
              to="/catalog"
              className="group bg-accent/20 backdrop-blur-sm border border-accent/40 rounded-2xl p-6 hover:bg-accent/30 hover:border-accent/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-accent/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/40 transition-colors">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Catálogo</h3>
                <p className="text-steel-200 text-sm leading-relaxed">
                  Explora nuestro amplio catálogo de productos y soluciones
                  industriales
                </p>
                <div className="flex items-center gap-1 text-white font-semibold text-sm mt-4 group-hover:gap-2 transition-all">
                  <span>Explorar</span>
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Floating Quote Button - Only show after quotation form */}
      {showFloatingButton && (
        <button
          onClick={() => {
            console.log("Floating button clicked, opening wizard...");
            openNewWizard();
          }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-accent text-white font-bold text-sm sm:text-base rounded-full hover:bg-orange-600 hover:shadow-2xl hover:shadow-accent/50 transition-all duration-300 active:scale-95 shadow-xl group"
        >
          <FileText
            size={16}
            className="sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform"
          />
          <span className="hidden sm:inline">Cotizar ahora</span>
        </button>
      )}

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
