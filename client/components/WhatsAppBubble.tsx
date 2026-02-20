import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const WA_NUMBER = "524775990905";
const WA_MESSAGE = encodeURIComponent(
  "Hola, me gustaría recibir información sobre sus productos industriales.",
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

const STYLE_ID = "wa-bubble-keyframes";
function ensureKeyframes() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes wa-spring-up {
      0%   { transform: scale(1)    translateY(0); }
      25%  { transform: scale(1.18) translateY(-18px); }
      50%  { transform: scale(0.92) translateY(5px); }
      70%  { transform: scale(1.08) translateY(-8px); }
      85%  { transform: scale(0.97) translateY(3px); }
      100% { transform: scale(1)    translateY(0); }
    }
    .wa-spring { animation: wa-spring-up 0.7s cubic-bezier(0.34,1.56,0.64,1) both; }
  `;
  document.head.appendChild(style);
}

export default function WhatsAppBubble() {
  const [footerVisible, setFooterVisible] = useState(false);
  const [popped, setPopped] = useState(false);
  const [springing, setSpringing] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 639px)").matches,
  );

  const footerObserverRef = useRef<IntersectionObserver | null>(null);
  const prevHasQuoteBtn = useRef(false);
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  // Cotizar button is always visible on /catalog,
  // and appears after 800px scroll on /
  const hasQuoteBtn =
    location.pathname === "/catalog" ||
    (location.pathname === "/" && scrollY > 800);

  useEffect(() => {
    ensureKeyframes();
    const mq = window.matchMedia("(max-width: 639px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Track scroll to detect Home's scroll-triggered quote button (visible after 800px)
  useEffect(() => {
    if (isAdmin) return;
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Sync immediately on mount and on route change
    setScrollY(window.scrollY);
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname, isAdmin]);

  // Entrance pop on first load
  useEffect(() => {
    if (isAdmin) return;
    const t = setTimeout(() => setPopped(true), 400);
    return () => clearTimeout(t);
  }, [isAdmin]);

  // Hide when footer is in view
  useEffect(() => {
    if (isAdmin) return;
    const observe = () => {
      const footer = document.querySelector("footer");
      if (!footer) return;
      footerObserverRef.current?.disconnect();
      footerObserverRef.current = new IntersectionObserver(
        ([entry]) => setFooterVisible(entry.isIntersecting),
        { threshold: 0.05 },
      );
      footerObserverRef.current.observe(footer);
    };
    observe();
    const t = setTimeout(observe, 600);
    return () => {
      clearTimeout(t);
      footerObserverRef.current?.disconnect();
    };
  }, [location.pathname, isAdmin]);

  // Spring bounce when quote button appears (any page)
  useEffect(() => {
    if (hasQuoteBtn && !prevHasQuoteBtn.current) {
      setSpringing(false);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setSpringing(true);
          setTimeout(() => setSpringing(false), 750);
        }),
      );
    }
    prevHasQuoteBtn.current = hasQuoteBtn;
  }, [hasQuoteBtn]);

  const show = popped && !footerVisible && !isAdmin;
  // Mobile cotizar btn: bottom-4 (1rem) + ~2.5rem height → clear at 4.2rem
  // Desktop cotizar btn: bottom-6 (1.5rem) + ~3.5rem height → clear at 6.5rem
  const bottomPx = hasQuoteBtn ? (isMobile ? "4.2rem" : "6.5rem") : "1.5rem";

  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      style={{
        bottom: bottomPx,
        transition: [
          "bottom 0.55s cubic-bezier(0.34,1.56,0.64,1)",
          "opacity 0.45s ease",
        ].join(", "),
      }}
      className={[
        "fixed right-4 sm:right-6 z-40",
        "flex items-center gap-2 group",
        springing ? "wa-spring" : "",
        show
          ? "opacity-100 scale-100 pointer-events-auto"
          : "opacity-0 scale-75 pointer-events-none",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Tooltip label */}
      <span
        className={[
          "hidden sm:inline-flex items-center",
          "bg-white text-gray-800 text-sm font-semibold",
          "px-3 py-1.5 rounded-full shadow-lg",
          "border border-gray-100",
          "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0",
          "transition-all duration-200 whitespace-nowrap",
        ].join(" ")}
      >
        ¿Necesitas ayuda?
      </span>

      {/* Button */}
      <div className="relative">
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        <div
          className={[
            "relative w-11 h-11 sm:w-14 sm:h-14 rounded-full",
            "bg-gradient-to-br from-[#25D366] to-[#128C7E]",
            "flex items-center justify-center",
            "shadow-xl shadow-[#25D366]/40",
            "hover:scale-110 hover:shadow-2xl hover:shadow-[#25D366]/50",
            "active:scale-95 transition-all duration-200",
          ].join(" ")}
        >
          {/* WhatsApp SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5 sm:w-7 sm:h-7 fill-white"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
      </div>
    </a>
  );
}
