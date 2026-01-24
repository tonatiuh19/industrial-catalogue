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
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [sections, setSections] = useState<HomeSectionItem[]>([]);
  const [brands, setBrands] = useState<Array<{ id: number; name: string }>>([]);
  const [categories, setCategories] = useState<CategoryWithIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const { isNewWizardOpen, openNewWizard, closeNewWizard, prefillData } =
    useQuote();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
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
            <a
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
            </a>
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

      {/* Hero Section - Compact */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-steel-800 to-steel-950">
        {/* Background Video with Image Fallback */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            poster="https://disruptinglabs.com/data/api/data/industrial_catalogue/images/pexels-vladimirsrajber-18631420.jpg"
            onError={(e) => {
              // Hide video on error, fallback to poster image
              e.currentTarget.style.display = "none";
            }}
          >
            <source
              src="https://disruptinglabs.com/data/api/data/industrial_catalogue/videos/6450803-sd_960_540_25fps.mp4"
              type="video/mp4"
            />
            {/* Fallback image if video doesn't load */}
            <img
              src="https://disruptinglabs.com/data/api/data/industrial_catalogue/images/pexels-vladimirsrajber-18631420.jpg"
              alt="Industrial background"
              className="w-full h-full object-cover"
            />
          </video>

          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-steel-800/80 to-steel-950/90"></div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-5 z-[1]"></div>

        {/* Hero Content */}
        <div className="relative z-10 pt-24 sm:pt-32 pb-16 sm:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight text-white">
                <span className="block">Donde la Calidad</span>
                <span className="block bg-gradient-to-r from-[#c03818] via-orange-400 to-[#c03818] bg-clip-text text-transparent">
                  Encuentra la Innovación
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto">
                Herramientas profesionales, equipamiento industrial y
                componentes de precisión
              </p>

              {/* CTA Button */}
              <div className="pt-4">
                <Link
                  to="/catalog"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c03818] text-white font-bold text-base sm:text-lg rounded-xl hover:bg-[#d94520] hover:shadow-2xl hover:shadow-[#c03818]/50 transition-all duration-300 active:scale-95"
                >
                  Ver Catálogo Completo
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sections - IMMEDIATELY AFTER HERO */}
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

          {/* Dynamic Sections Grid - 3 Main Sections with 4 items each */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeleton
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border-2 border-steel-200 p-6 animate-pulse"
                >
                  <div className="h-8 bg-steel-200 rounded mb-6 w-3/4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="space-y-3">
                        <div className="w-full aspect-square bg-steel-200 rounded-lg"></div>
                        <div className="h-4 bg-steel-200 rounded w-3/4"></div>
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

      {/* Industry Solutions Section - Dynamic from Database */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary mb-4">
              Soluciones por Industria
            </h2>
            <p className="text-base sm:text-lg text-steel-600 max-w-2xl mx-auto">
              Productos especializados para cada sector industrial
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesLoading ? (
              // Loading skeleton
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-steel-50 to-white rounded-2xl border-2 border-steel-200 p-6 sm:p-8 animate-pulse"
                >
                  <div className="w-16 h-16 bg-steel-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-steel-200 rounded mb-3 w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-steel-200 rounded"></div>
                    <div className="h-4 bg-steel-200 rounded w-5/6"></div>
                  </div>
                  <div className="h-4 bg-steel-200 rounded w-1/3 mt-4"></div>
                </div>
              ))
            ) : categories.length > 0 ? (
              categories.map((category) => {
                const CategoryIcon = getIconForCategory(category.slug);
                const colorGradient = getColorForCategory(category.slug);

                return (
                  <div
                    key={category.id}
                    onClick={() =>
                      openNewWizard({
                        category_id: category.id,
                      })
                    }
                    className="group bg-gradient-to-br from-steel-50 to-white rounded-2xl border-2 border-steel-200 hover:border-accent p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                  >
                    <div
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colorGradient} mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <CategoryIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-steel-600 leading-relaxed line-clamp-3">
                      {category.description ||
                        "Soluciones industriales especializadas"}
                    </p>
                    <button className="inline-flex items-center gap-2 text-accent font-semibold text-sm mt-4 group-hover:gap-3 transition-all">
                      Cotizar ahora <ArrowRight size={16} />
                    </button>
                  </div>
                );
              })
            ) : (
              // Fallback if no categories
              <div className="col-span-full text-center py-12 bg-white rounded-2xl border-2 border-steel-200">
                <Package className="w-16 h-16 mx-auto text-steel-400 mb-4" />
                <p className="text-steel-600 mb-4">
                  No hay categorías disponibles
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

          <div className="mt-12 text-center">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-steel-800 hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              Explorar Todo el Catálogo
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Brands Showcase Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-steel-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary mb-4">
              Trabajamos con las Mejores Marcas
            </h2>
            <p className="text-base sm:text-lg text-steel-600 max-w-3xl mx-auto">
              Contamos con más de 500 marcas reconocidas con capacidad real de
              suministro. Cotiza directamente sin necesidad de buscar números de
              parte específicos.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mb-12">
            {brandsLoading ? (
              // Loading skeleton for brands
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border-2 border-steel-200 p-6 animate-pulse flex flex-col items-center justify-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full bg-steel-200"></div>
                  <div className="h-5 bg-steel-200 rounded w-20"></div>
                </div>
              ))
            ) : brands.length > 0 ? (
              brands.map((brand) => (
                <div
                  key={brand.id}
                  onClick={() =>
                    openNewWizard({ brand: brand.name, brand_id: brand.id })
                  }
                  className="group bg-white rounded-xl border-2 border-steel-200 hover:border-accent p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full bg-steel-100 group-hover:bg-accent/10 flex items-center justify-center transition-all">
                    <Tag className="w-8 h-8 text-steel-400 group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-primary group-hover:text-accent transition-colors text-center">
                    {brand.name}
                  </h3>
                  <button className="text-xs sm:text-sm text-accent font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Cotizar ahora →
                  </button>
                </div>
              ))
            ) : (
              // Fallback if no brands available
              <div className="col-span-full text-center py-8 text-steel-500">
                <Tag className="w-12 h-12 mx-auto mb-3 text-steel-400" />
                <p>No hay marcas disponibles</p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10 border-2 border-accent/20 rounded-2xl p-8 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
              ¿No encuentras la marca que buscas?
            </h3>
            <p className="text-steel-600 mb-6 max-w-2xl mx-auto">
              Contamos con más de 500 marcas disponibles. Solicita una
              cotización y nuestro equipo te ayudará.
            </p>
            <button
              onClick={() => openNewWizard()}
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-bold text-lg rounded-xl hover:bg-orange-600 hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              <FileText size={20} />
              Solicitar Cotización
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Two Column Layout */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-steel-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Column - Informative Content */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary mb-4 sm:mb-6">
                  ¿Por Qué Nuestro Catálogo?
                </h2>
                <p className="text-base sm:text-lg text-steel-600 leading-relaxed">
                  Más de 20 años conectando empresas con los mejores proveedores
                  industriales del mercado
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {[
                  {
                    icon: Shield,
                    title: "Calidad Garantizada",
                    stat: "100%",
                    description:
                      "Todos nuestros productos cuentan con certificación y garantía del fabricante",
                  },
                  {
                    icon: Truck,
                    title: "Entrega Rápida",
                    stat: "24-48h",
                    description:
                      "Envíos express a todo el país con seguimiento en tiempo real",
                  },
                  {
                    icon: Users,
                    title: "Asesoría Técnica",
                    stat: "24/7",
                    description:
                      "Equipo de expertos disponible para asesorarte en tu selección de productos",
                  },
                  {
                    icon: CheckCircle2,
                    title: "Cotizaciones Competitivas",
                    stat: "Múltiples proveedores",
                    description:
                      "Compara cotizaciones de diferentes proveedores industriales",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-xl bg-white border-2 border-steel-200 hover:border-accent transition-all duration-300 hover:shadow-lg group"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors">
                          {feature.title}
                        </h3>
                        <span className="text-xs font-black text-accent bg-accent/10 px-2 py-1 rounded">
                          {feature.stat}
                        </span>
                      </div>
                      <p className="text-sm text-steel-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold text-base rounded-xl hover:bg-steel-800 hover:shadow-xl transition-all duration-300 active:scale-95"
                >
                  Explorar Catálogo
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>

            {/* Right Column - Video/Image Showcase */}
            <div className="relative lg:order-last order-first">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-steel-200">
                {/* Video with Image Fallback */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover rounded-xl"
                  poster="https://disruptinglabs.com/data/api/data/industrial_catalogue/images/pexels-vladimirsrajber-18631420.jpg"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                >
                  <source
                    src="https://disruptinglabs.com/data/api/data/industrial_catalogue/videos/4751312-sd_960_540_25fps.mp4"
                    type="video/mp4"
                  />
                </video>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent rounded-full blur-2xl opacity-50"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary rounded-full blur-2xl opacity-40"></div>
              </div>

              {/* Floating Stats Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg border-2 border-steel-200 p-4 z-10">
                <p className="text-3xl font-black text-primary mb-1">20+</p>
                <p className="text-xs text-steel-600 font-semibold">
                  Años de Experiencia
                </p>
              </div>

              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg border-2 border-steel-200 p-4 z-10">
                <p className="text-3xl font-black text-accent mb-1">50K+</p>
                <p className="text-xs text-steel-600 font-semibold">
                  Clientes Satisfechos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary mb-4 sm:mb-6 leading-tight">
              Plataforma Completa
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-steel-600 max-w-3xl mx-auto leading-relaxed">
              Todo lo que necesitas para explorar y solicitar cotizaciones de
              productos industriales
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: Zap,
                title: "Catálogo Extenso",
                description:
                  "Miles de productos industriales organizados por categoría y fabricante",
              },
              {
                icon: Lightbulb,
                title: "Búsqueda Avanzada",
                description:
                  "Filtros inteligentes por marca, modelo, especificaciones y precio",
              },
              {
                icon: CheckCircle2,
                title: "Cotización Rápida",
                description:
                  "Sistema automatizado para solicitar cotizaciones de múltiples productos",
              },
              {
                icon: Shield,
                title: "Productos Certificados",
                description:
                  "Equipos verificados de marcas reconocidas con garantía incluida",
              },
              {
                icon: Users,
                title: "Asesoría Técnica",
                description:
                  "Expertos disponibles para ayudarte a elegir el producto correcto",
              },
              {
                icon: Truck,
                title: "Logística Nacional",
                description:
                  "Envíos a todo el país con opciones express y seguimiento en línea",
              },
              {
                icon: Package,
                title: "Gestión de Pedidos",
                description:
                  "Portal para seguimiento de cotizaciones, pedidos y facturación",
              },
              {
                icon: ArrowRight,
                title: "Descuentos por Volumen",
                description:
                  "Precios especiales para compras mayoristas y clientes frecuentes",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="feature-card group bounce-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 w-fit mb-4 group-hover:from-accent/20 group-hover:to-accent/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <feature.icon
                    size={32}
                    className="text-accent group-hover:animate-spin"
                    style={{ animationDuration: "0.6s" }}
                  />
                </div>
                <h3 className="text-lg font-bold text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-steel-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-steel-50 to-white relative overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-primary mb-6">
              Proceso Simple y Rápido
            </h2>
            <p className="text-lg text-steel-600 max-w-2xl mx-auto">
              Obtén cotizaciones personalizadas en 3 pasos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Explora el Catálogo",
                description:
                  "Navega por categorías, marcas y fabricantes. Usa filtros avanzados para encontrar exactamente lo que necesitas",
              },
              {
                step: 2,
                title: "Identifica lo que Necesitas",
                description:
                  "Consulta especificaciones técnicas, imágenes y descripciones detalladas de cada ítem",
              },
              {
                step: 3,
                title: "Solicita tu Cotización",
                description:
                  "Contacta directamente con nuestro equipo y recibe una cotización personalizada en menos de 24 horas",
              },
            ].map((step, index) => (
              <div
                key={step.step}
                className="group relative scale-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Connection line */}
                {index < 2 && (
                  <div
                    className="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-gradient-to-r from-accent to-transparent -translate-y-1/2 origin-left animate-pulse"
                    style={{
                      animationDuration: "2s",
                      animationDelay: `${0.3 + index * 0.15}s`,
                    }}
                  ></div>
                )}

                <div className="text-center relative z-10">
                  <div className="bg-gradient-to-br from-accent to-orange-500 text-white rounded-full w-20 h-20 flex items-center justify-center text-4xl font-black mx-auto mb-8 shadow-lg shadow-accent/30 group-hover:shadow-xl group-hover:shadow-accent/50 transition-all duration-300 group-hover:scale-125 group-hover:-rotate-12">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-accent transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-steel-600 leading-relaxed group-hover:text-steel-700 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-16 text-center scale-in"
            style={{ animationDelay: "0.6s" }}
          >
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-white font-bold text-lg hover:bg-steel-800 hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 active:scale-95 relative overflow-hidden group"
            >
              <span className="relative z-10">Comenzar Ahora</span>
              <ArrowRight
                size={22}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="hero-gradient text-white py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "5K+", label: "Productos" },
              { number: "100+", label: "Marcas" },
              { number: "50K+", label: "Clientes" },
              { number: "24/7", label: "Soporte" },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-white/10 hover:border-accent/50 hover:bg-white/5 transition-all duration-300"
              >
                <p className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent mb-3">
                  {stat.number}
                </p>
                <p className="text-steel-200 text-sm font-semibold">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section
        id="why-us"
        className="py-24 sm:py-40 bg-gradient-to-b from-steel-50 via-white to-steel-50 relative overflow-hidden"
      >
        <div className="absolute -top-40 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-primary mb-6">
              ¿Por Qué Industrial?
            </h2>
            <p className="text-xl text-steel-600 max-w-2xl mx-auto">
              Líderes en soluciones industriales con años de confianza y
              experiencia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-10 border border-steel-200 hover:border-accent hover:shadow-xl transition-all duration-300">
              <h3 className="text-3xl font-bold text-primary mb-8">
                Experiencia Comprobada
              </h3>
              <ul className="space-y-5">
                {[
                  "20+ años sirviendo a la industria",
                  "Relaciones con fabricantes de renombre",
                  "Garantía de calidad en todos los productos",
                  "Precios competitivos sin sacrificar calidad",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="bg-accent/10 rounded-lg p-2 flex-shrink-0">
                      <CheckCircle2 size={24} className="text-accent" />
                    </div>
                    <span className="text-steel-700 text-lg leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-10 border border-steel-200 hover:border-accent hover:shadow-xl transition-all duration-300">
              <h3 className="text-3xl font-bold text-primary mb-8">
                Servicio Personalizado
              </h3>
              <ul className="space-y-5">
                {[
                  "Asesoramiento especializado disponible",
                  "Soluciones adaptadas a tus necesidades",
                  "Respuesta rápida a tus consultas",
                  "Programa de fidelización con beneficios",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="bg-accent/10 rounded-lg p-2 flex-shrink-0">
                      <CheckCircle2 size={24} className="text-accent" />
                    </div>
                    <span className="text-steel-700 text-lg leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
            {[
              { number: "5K+", label: "Productos" },
              { number: "100+", label: "Marcas" },
              { number: "24/7", label: "Soporte" },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-steel-50 to-white border border-steel-200 hover:border-accent transition-all duration-300 hover:shadow-lg"
              >
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-accent mb-2">
                  {stat.number}
                </p>
                <p className="text-xs sm:text-sm text-steel-600 font-semibold">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 lg:py-40 bg-white relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-primary mb-4 sm:mb-6">
                  ¿Por qué Usar Nuestro Catálogo?
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-steel-600 leading-relaxed">
                  Más que un simple catálogo. Te conectamos con los mejores
                  proveedores industriales con servicio personalizado.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {[
                  {
                    title: "Asesoramiento Especializado",
                    desc: "Nuestro equipo de expertos está disponible para ayudarte a elegir los productos correctos",
                  },
                  {
                    title: "Cotizaciones Personalizadas",
                    desc: "Obtén precios especiales según tus volúmenes y necesidades específicas",
                  },
                  {
                    title: "Garantía de Calidad",
                    desc: "Todos nuestros productos están certificados y garantizados por los fabricantes",
                  },
                  {
                    title: "Entrega Rápida",
                    desc: "Opciones de entrega flexible con seguimiento en tiempo real de tus pedidos",
                  },
                ].map((benefit, i) => (
                  <div key={i} className="flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-gradient-to-br from-accent to-orange-600 text-white rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-sm sm:text-base">
                        ✓
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-primary text-base sm:text-lg mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-steel-600 leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-60"></div>
              <div className="relative bg-white rounded-3xl p-6 sm:p-10 border-2 border-steel-200 shadow-2xl">
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-4 sm:p-6 border border-steel-200">
                    <p className="text-xs sm:text-sm text-steel-600 font-semibold mb-2 uppercase">
                      Certificaciones
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-primary">
                      ISO 9001:2015
                    </p>
                    <p className="text-steel-600 text-xs sm:text-sm mt-2">
                      Certificados en gestión de calidad
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-primary/5 to-steel-100 rounded-xl p-3 sm:p-4 border border-steel-200">
                      <p className="text-2xl sm:text-3xl font-black text-primary mb-1">
                        20+
                      </p>
                      <p className="text-xs text-steel-600 font-medium">Años</p>
                    </div>
                    <div className="bg-gradient-to-br from-accent/5 to-orange-100 rounded-xl p-3 sm:p-4 border border-steel-200">
                      <p className="text-2xl sm:text-3xl font-black text-accent mb-1">
                        50K+
                      </p>
                      <p className="text-xs text-steel-600 font-medium">
                        Clientes
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-steel-200 pt-4 sm:pt-6">
                    <p className="text-center text-steel-700 font-medium text-xs sm:text-sm">
                      Confían en nosotros empresas líderes
                    </p>
                    <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-2 text-center text-steel-400 text-xs font-semibold">
                      <div>Construcción</div>
                      <div>Manufactura</div>
                      <div>Servicios</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-accent to-orange-600 text-white py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl sm:text-6xl font-black mb-8 leading-tight">
            ¿Listo para Encontrar lo que Necesitas?
          </h2>
          <p className="text-xl text-orange-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Explora nuestro catálogo completo y solicita cotizaciones
            personalizadas para tu empresa. Sin compromiso.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-accent font-bold hover:bg-steel-100 transition-all duration-300 text-lg rounded-lg hover:shadow-2xl hover:shadow-white/20 active:scale-95"
          >
            Explorar Catálogo Ahora
            <ArrowRight size={22} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-primary to-steel-950 text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-lg mb-6">Sobre Industrial</h3>
              <ul className="space-y-3 text-steel-300 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200"
                  >
                    Acerca de nosotros
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200"
                  >
                    Nuestro equipo
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200"
                  >
                    Carreras
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Productos</h3>
              <ul className="space-y-3 text-steel-300 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200"
                  >
                    Herramientas
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200"
                  >
                    Equipamiento
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200"
                  >
                    Componentes
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Soporte</h3>
              <ul className="space-y-3 text-steel-300 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200"
                  >
                    Centro de ayuda
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200"
                  >
                    Contacto
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200"
                  >
                    Garantía
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Legales</h3>
              <ul className="space-y-3 text-steel-300 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200"
                  >
                    Privacidad
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200"
                  >
                    Términos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200"
                  >
                    Cookies
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/login"
                    className="hover:text-accent transition-colors duration-200 opacity-50 hover:opacity-100"
                  >
                    Admin
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-steel-700 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-steel-400">
            <p>&copy; 2024 Industrial. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-6 sm:mt-0">
              <a
                href="#"
                className="hover:text-accent transition-colors duration-200"
              >
                Facebook
              </a>
              <a
                href="#"
                className="hover:text-accent transition-colors duration-200"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="hover:text-accent transition-colors duration-200"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>

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
    </div>
  );
}
