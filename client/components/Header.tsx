import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector("section");
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setIsScrolled(heroBottom <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    "Herramientas",
    "Equipamiento",
    "Componentes",
    "Materiales",
    "Seguridad",
  ];

  return (
    <header className="bg-white border-b border-steel-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95 shadow-sm">
      <div className="max-w-7xl mx-auto">
        {/* Top bar */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img
              src="https://disruptinglabs.com/data/trenor/assets/images/logo_dark_trenor.png"
              alt="Trenor Logo"
              className="h-8 w-auto object-contain transition-opacity duration-300"
            />
          </Link>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 mx-8 max-w-md">
            <div className="relative w-full group">
              {/* <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full px-4 py-2.5 border border-steel-200 bg-steel-50 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent rounded-lg transition-all duration-200 group-hover:border-steel-300"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-steel-400 hover:text-accent transition-colors">
                <Search size={18} />
              </button> */}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Mobile search button */}
            {/* <button className="md:hidden text-steel-600 hover:text-accent transition-colors">
              <Search size={20} />
            </button> */}

            {/* Menu toggle for mobile */}
            <button
              className="md:hidden text-steel-600 hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-steel-100 bg-gradient-to-b from-steel-50 to-white animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Mobile search */}
            <div className="px-4 py-4 sm:px-6">
              <div className="relative group">
                {/* <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full px-4 py-2.5 border border-steel-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent rounded-lg transition-all duration-200 group-hover:border-steel-300"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-steel-400 hover:text-accent transition-colors">
                  <Search size={18} />
                </button> */}
              </div>
            </div>

            {/* Mobile categories */}
            <nav className="divide-y divide-steel-200">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/catalog?category=${category.toLowerCase()}`}
                  className="block px-4 py-3 sm:px-6 text-sm font-semibold text-steel-700 hover:text-accent hover:bg-accent/5 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
