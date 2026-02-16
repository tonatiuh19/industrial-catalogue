import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

const carouselSlides: CarouselSlide[] = [
  {
    id: 1,
    title: "Donde la Calidad",
    subtitle: "Encuentra la Innovación",
    description:
      "Herramientas profesionales, equipamiento industrial y componentes de precisión para transformar tu negocio",
    backgroundImage:
      "https://disruptinglabs.com/data/api/data/industrial_catalogue/images/pexels-vladimirsrajber-18631420.jpg",
    ctaText: "Ver Catálogo Completo",
    ctaLink: "/catalog",
  },
  {
    id: 2,
    title: "Potencia Industrial",
    subtitle: "Sin Límites",
    description:
      "Sistemas de transmisión de potencia, automatización y control industrial para maximizar la productividad de tu empresa",
    backgroundImage:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    ctaText: "Explorar Soluciones",
    ctaLink: "/catalog",
  },
  {
    id: 3,
    title: "Precisión Técnica",
    subtitle: "Resultados Excepcionales",
    description:
      "Sistemas neumáticos, hidráulicos y herramientas especializadas diseñadas para cada aplicación industrial específica",
    backgroundImage:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    ctaText: "Descubre Más",
    ctaLink: "/catalog",
  },
  {
    id: 4,
    title: "Seguridad Industrial",
    subtitle: "Primera Prioridad",
    description:
      "Equipos certificados y suministros industriales que garantizan operaciones seguras y cumplimiento normativo",
    backgroundImage:
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    ctaText: "Ver Productos",
    ctaLink: "/catalog",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    const slideInterval = setInterval(() => {
      if (!isTransitioning) {
        nextSlide();
      }
    }, 6000);

    return () => clearInterval(slideInterval);
  }, [isTransitioning]);

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide(
        (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length,
      );
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const goToSlide = (index: number) => {
    if (!isTransitioning && index !== currentSlide) {
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  return (
    <div className="relative w-full h-screen min-h-[500px] sm:min-h-[600px] max-h-[700px] sm:max-h-[800px] overflow-hidden">
      {/* Slides Container */}
      <div
        className="flex w-full h-full transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {carouselSlides.map((slide, index) => (
          <div key={slide.id} className="relative w-full h-full flex-shrink-0">
            {/* Background Image */}
            <img
              src={slide.backgroundImage}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark Overlay with gradient for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

            {/* Content */}
            <div className="relative z-10 w-full h-full">
              <div className="flex items-center h-full">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-4xl w-full">
                    {/* Badge with animation */}
                    {/* <div
                      className={`mb-6 transform transition-all duration-700 delay-200 ${
                        index === currentSlide
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                      }`}
                    >
                      <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#c03818] rounded-full animate-pulse" />
                          <span className="text-white text-sm font-medium">
                            Equipamiento Industrial
                          </span>
                        </div>
                      </div>
                    </div> */}

                    {/* Titles with staggered animation */}
                    <div
                      className={`mb-4 sm:mb-6 transform transition-all duration-700 delay-300 ${
                        index === currentSlide
                          ? "translate-y-0 opacity-100"
                          : "translate-y-8 opacity-0"
                      }`}
                    >
                      <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-2 sm:mb-4 leading-tight">
                        {slide.title}
                      </h1>
                      <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                        <span className="bg-gradient-to-r from-[#c03818] via-orange-400 to-[#d94520] bg-clip-text text-transparent">
                          {slide.subtitle}
                        </span>
                      </h2>
                    </div>

                    {/* Description with animation */}
                    <div
                      className={`mb-6 sm:mb-8 transform transition-all duration-700 delay-500 ${
                        index === currentSlide
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                      }`}
                    >
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-200 max-w-2xl leading-relaxed">
                        {slide.description}
                      </p>
                    </div>

                    {/* Buttons with animation */}
                    <div
                      className={`flex flex-col sm:flex-row gap-3 sm:gap-4 transform transition-all duration-700 delay-700 ${
                        index === currentSlide
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                      }`}
                    >
                      <Link
                        to={slide.ctaLink}
                        className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#c03818] text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl hover:bg-[#d94520] hover:shadow-2xl hover:shadow-[#c03818]/30 hover:scale-[1.02] transition-all duration-300 active:scale-95 touch-manipulation"
                      >
                        {slide.ctaText}
                        <ArrowRight
                          size={18}
                          className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200"
                        />
                      </Link>

                      <button
                        onClick={() => {
                          const element =
                            document.getElementById("quick-quote-form");
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                        className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl hover:bg-white/30 hover:scale-[1.02] transition-all duration-300 active:scale-95 touch-manipulation"
                      >
                        Cotizar Ahora
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {/* <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 group p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft
          size={24}
          className="group-hover:-translate-x-0.5 transition-transform duration-200"
        />
      </button>

      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 group p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight
          size={24}
          className="group-hover:translate-x-0.5 transition-transform duration-200"
        />
      </button> */}

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 hover:scale-110 disabled:cursor-not-allowed touch-manipulation ${
              index === currentSlide
                ? "w-6 sm:w-8 bg-[#c03818]"
                : "w-2 sm:w-2.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      {/* <div className="absolute bottom-8 left-6 z-30 text-white/80 text-sm font-medium">
        <span className="text-white font-bold">
          {String(currentSlide + 1).padStart(2, "0")}
        </span>
        {" / "}
        {String(carouselSlides.length).padStart(2, "0")}
      </div> */}
    </div>
  );
}
