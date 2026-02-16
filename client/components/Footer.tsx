import { Link } from "react-router-dom";
import { Heart, ExternalLink, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary via-steel-900 to-steel-950 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="https://disruptinglabs.com/data/trenor/assets/images/logo_dark_trenor.png"
                alt="Grupo Trenor Logo"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </div>

            <p className="text-steel-300 text-lg leading-relaxed mb-8 max-w-md">
              Tu aliado estratégico en soluciones industriales. Refacciones,
              componentes y suministro MRO para la industria manufacturera y
              automotriz.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-steel-300 hover:text-accent transition-colors group">
                <div className="w-5 h-5 flex-shrink-0">
                  <MapPin className="w-full h-full group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-sm">
                  Blvd Montes Malaga 236, Lomas Del Refugio, León, Guanajuato
                  37358
                </span>
              </div>

              <Link
                to="/contact"
                className="flex items-center gap-3 text-steel-300 hover:text-accent transition-colors group w-fit"
              >
                <div className="w-5 h-5 flex-shrink-0">
                  <Mail className="w-full h-full group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-sm">ventas@grupotrenor.com</span>
              </Link>

              <div className="flex items-center gap-3 text-steel-300 hover:text-accent transition-colors group">
                <div className="w-5 h-5 flex-shrink-0">
                  <Phone className="w-full h-full group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-sm">477 599 0905</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">
              Enlaces Rápidos
            </h4>
            <nav className="space-y-4">
              <Link
                to="/"
                className="block text-steel-300 hover:text-accent transition-all duration-300 text-sm hover:translate-x-1 group"
              >
                <span className="flex items-center gap-2">
                  Inicio
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </Link>

              <Link
                to="/about"
                className="block text-steel-300 hover:text-accent transition-all duration-300 text-sm hover:translate-x-1 group"
              >
                <span className="flex items-center gap-2">
                  Acerca de Nosotros
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </Link>

              <Link
                to="/catalogue"
                className="block text-steel-300 hover:text-accent transition-all duration-300 text-sm hover:translate-x-1 group"
              >
                <span className="flex items-center gap-2">
                  Catálogo
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </Link>

              <Link
                to="/faq"
                className="block text-steel-300 hover:text-accent transition-all duration-300 text-sm hover:translate-x-1 group"
              >
                <span className="flex items-center gap-2">
                  Preguntas Frecuentes
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </Link>

              <Link
                to="/contact"
                className="block text-steel-300 hover:text-accent transition-all duration-300 text-sm hover:translate-x-1 group"
              >
                <span className="flex items-center gap-2">
                  Contacto
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </Link>
            </nav>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">
              Soporte & Legal
            </h4>
            <nav className="space-y-4">
              <Link
                to="/faq"
                className="block text-steel-300 hover:text-accent transition-all duration-300 text-sm hover:translate-x-1 group"
              >
                <span className="flex items-center gap-2">
                  Centro de Ayuda
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </Link>

              <Link
                to="/privacy"
                className="block text-steel-300 hover:text-accent transition-all duration-300 text-sm hover:translate-x-1 group"
              >
                <span className="flex items-center gap-2">
                  Política de Privacidad
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </Link>

              <Link
                to="/terms"
                className="block text-steel-300 hover:text-accent transition-all duration-300 text-sm hover:translate-x-1 group"
              >
                <span className="flex items-center gap-2">
                  Términos y Condiciones
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </Link>

              <Link
                to="/admin/login"
                className="block text-steel-300/50 hover:text-accent transition-all duration-300 text-sm hover:translate-x-1 group"
              >
                <span className="flex items-center gap-2">
                  Admin
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gradient-to-r from-transparent via-steel-700 to-transparent mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div className="text-center lg:text-left">
            <p className="text-steel-400 text-sm">
              &copy; {new Date().getFullYear()} Grupo Trenor S.A. DE C.V. Todos
              los derechos reservados.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://www.linkedin.com/company/grupotrenor/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-steel-400 hover:text-accent transition-all duration-300 hover:scale-110"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Love Attribution */}
      <div className="border-t border-steel-800/50 bg-gradient-to-r from-steel-950/50 to-steel-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-2 text-steel-500 text-xs">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-400 animate-pulse fill-current" />
            <span>by</span>
            <a
              href="https://disruptinglabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 transition-colors font-medium hover:underline"
            >
              disruptinglabs.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
