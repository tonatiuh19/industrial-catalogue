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
} from "lucide-react";
import SEO from "@/components/SEO";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Industrial - Herramientas y Equipamiento de Calidad"
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
            <div
              className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                isScrolled ? "bg-primary" : "bg-white/20 border border-white/30"
              }`}
            >
              <span className="font-bold text-xs text-white">IND</span>
            </div>
            <span
              className={`text-lg sm:text-xl font-bold hidden sm:inline transition-all duration-500 ${
                isScrolled ? "text-primary" : "text-white"
              }`}
            >
              Industrial
            </span>
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

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex flex-col">
        {/* Background Video (Desktop) */}
        <div className="absolute inset-0 w-full h-full">
          {/* Video for desktop */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="hidden md:block absolute inset-0 w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80"
          >
            <source
              src="https://disruptinglabs.com/public/industrial-catalogue/assets/videos/6450803-sd_960_540_25fps.mp4"
              type="video/mp4"
            />
          </video>

          {/* Image for mobile */}
          <div
            className="md:hidden absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1080&q=80')",
            }}
          ></div>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b3148]/95 via-[#1b3148]/85 to-[#1b3148]/95"></div>

          {/* Animated grid pattern overlay */}
          <div className="absolute inset-0 grid-pattern opacity-10"></div>
        </div>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col justify-center pt-20 sm:pt-24 pb-16 sm:pb-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              {/* Main Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black leading-tight text-white fade-in-up-delay-1">
                <span className="block mb-2">Catálogo</span>
                <span className="block bg-gradient-to-r from-[#c03818] via-orange-400 to-[#c03818] bg-clip-text text-transparent">
                  Industrial Moderno
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed fade-in-up-delay-2">
                Accede a un completo catálogo de herramientas profesionales,
                equipamiento industrial confiable y componentes de precisión.
                <span className="block mt-2 text-[#c03818] font-semibold">
                  Solicita cotizaciones personalizadas en minutos.
                </span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 fade-in-up-delay-3">
                <Link
                  to="/catalog"
                  className="group inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-[#c03818] text-white font-bold text-lg rounded-xl hover:bg-[#d94520] hover:shadow-2xl hover:shadow-[#c03818]/50 transition-all duration-300 active:scale-95"
                >
                  Explorar Catálogo
                  <ArrowRight
                    size={22}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 sm:gap-12 pt-12 sm:pt-16 max-w-3xl mx-auto fade-in-up-delay-4">
                {[
                  { number: "5K+", label: "Productos" },
                  { number: "100+", label: "Marcas" },
                  { number: "24/7", label: "Soporte" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="text-center backdrop-blur-sm bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#c03818] mb-2">
                      {stat.number}
                    </p>
                    <p className="text-sm sm:text-base text-gray-300 font-medium">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 sm:py-24 lg:py-40 bg-gradient-to-b from-white via-steel-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-primary mb-4 sm:mb-6 leading-tight">
              Todo lo que Necesitas
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-steel-600 max-w-3xl mx-auto leading-relaxed">
              Plataforma completa para gestionar tus compras industriales con
              eficiencia y confianza
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: Zap,
                title: "Catálogo Extenso",
                description:
                  "Miles de productos industriales disponibles, organizados por categoría",
              },
              {
                icon: Lightbulb,
                title: "Búsqueda Inteligente",
                description:
                  "Filtros avanzados y búsqueda por SKU para encontrar exactamente lo que necesitas",
              },
              {
                icon: CheckCircle2,
                title: "Cotizaciones Rápidas",
                description:
                  "Solicita cotizaciones de múltiples productos en un solo paso",
              },
              {
                icon: Shield,
                title: "Confiabilidad",
                description:
                  "Productos verificados de marcas reconocidas a nivel industrial",
              },
              {
                icon: Users,
                title: "Soporte Experto",
                description:
                  "Equipo dedicado para responder tus preguntas y necesidades",
              },
              {
                icon: Truck,
                title: "Entrega Rápida",
                description:
                  "Opciones de entrega flexible con seguimiento en tiempo real",
              },
              {
                icon: ArrowRight,
                title: "Integración Fácil",
                description:
                  "Conecta con tus sistemas existentes mediante nuestra API",
              },
              {
                icon: Zap,
                title: "Precios Competitivos",
                description:
                  "Cotizaciones competitivas con opciones de volumen y descuentos",
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
      <section className="py-24 sm:py-40 bg-white relative overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-primary mb-6">
              Solo 3 Pasos
            </h2>
            <p className="text-xl text-steel-600 max-w-2xl mx-auto">
              Obtén tus cotizaciones de forma rápida y sencilla
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Explora el Catálogo",
                description:
                  "Navega nuestro completo catálogo de productos industriales con filtros avanzados",
              },
              {
                step: 2,
                title: "Selecciona Productos",
                description:
                  "Agrega los productos que necesitas a tu lista de cotización",
              },
              {
                step: 3,
                title: "Solicita Cotización",
                description:
                  "Completa un simple formulario y recibe una cotización personalizada",
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

      {/* Product Catalog Preview Section */}
      <section className="py-16 sm:py-24 lg:py-40 bg-gradient-to-b from-white to-steel-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-primary mb-4 sm:mb-6">
              Catálogo Completo
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-steel-600 max-w-3xl mx-auto leading-relaxed">
              Explora miles de productos industriales organizados en categor��as
              principales
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
            {[
              {
                name: "Herramientas",
                count: "1,250+",
                icon: "🔧",
                desc: "Herramientas profesionales y manuales",
              },
              {
                name: "Equipamiento",
                count: "850+",
                icon: "⚙️",
                desc: "Equipos industriales de alto rendimiento",
              },
              {
                name: "Seguridad",
                count: "500+",
                icon: "🛡️",
                desc: "Equipos de protección personal",
              },
              {
                name: "Componentes",
                count: "2,100+",
                icon: "🔩",
                desc: "Pernos, rodamientos y componentes",
              },
              {
                name: "Materiales",
                count: "800+",
                icon: "📦",
                desc: "Materiales industriales diversos",
              },
              {
                name: "Accesorios",
                count: "1,500+",
                icon: "🎯",
                desc: "Accesorios y repuestos profesionales",
              },
            ].map((category, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-steel-200 hover:border-accent hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2">
                    {category.name}
                  </h3>
                  <p className="text-accent font-bold text-base sm:text-lg mb-3">
                    {category.count} productos
                  </p>
                  <p className="text-steel-600 text-xs sm:text-sm leading-relaxed flex-grow">
                    {category.desc}
                  </p>
                  <Link
                    to="/catalog"
                    className="mt-6 inline-flex items-center gap-2 text-accent font-bold hover:text-primary transition-colors duration-200"
                  >
                    Explorar →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Products */}
          <div className="bg-gradient-to-r from-primary to-steel-800 text-white rounded-2xl p-6 sm:p-10 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 sm:mb-6">
                  Productos Destacados
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-steel-200 leading-relaxed mb-6 sm:mb-8">
                  Seleccionamos los mejores productos de marcas reconocidas
                  internacionalmente. Cada item ha pasado por rigurosos
                  controles de calidad para garantizar tu satisfacción.
                </p>
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-accent text-white font-bold text-sm sm:text-base lg:text-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 rounded-lg"
                >
                  Ver Todos
                  <ArrowRight size={18} className="hidden sm:inline" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { name: "Taladro Industrial", price: "$2,450" },
                  { name: "Compresor 200L", price: "$5,890" },
                  { name: "Casco de Seguridad", price: "$425" },
                  { name: "Juego de Herramientas", price: "$3,250" },
                ].map((product, i) => (
                  <div
                    key={i}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 sm:p-4 hover:bg-white/20 transition-colors duration-300"
                  >
                    <p className="font-bold text-white text-xs sm:text-sm mb-2 line-clamp-2">
                      {product.name}
                    </p>
                    <p className="text-accent font-bold text-sm sm:text-lg">
                      {product.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>
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
                  ¿Por qué Elegir Industrial?
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-steel-600 leading-relaxed">
                  Somos más que un catálogo. Ofrecemos una experiencia completa
                  de compra con servicio personalizado.
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
            ¿Listo para Optimizar tus Compras?
          </h2>
          <p className="text-xl text-orange-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Accede a nuestro catálogo completo, compara precios y solicita
            cotizaciones personalizadas en minutos. Sin compromiso.
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
    </div>
  );
}
