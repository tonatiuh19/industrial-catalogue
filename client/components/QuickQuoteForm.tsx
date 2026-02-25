import { ArrowRight, FileText, Shield, Truck } from "lucide-react";

interface Brand {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  main_image?: string | null;
}

interface QuickQuoteFormProps {
  brands: Brand[];
  categories: Category[];
  onSubmit: (data: {
    brand?: string;
    brand_id?: number;
    category_id?: number;
    part_number?: string;
    product_type?: string;
    description?: string;
  }) => void;
}

export default function QuickQuoteForm({
  brands,
  categories,
  onSubmit,
}: QuickQuoteFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const brand = formData.get("brand") as string;
    const category = formData.get("category") as string;
    const partNumber = formData.get("partNumber") as string;

    // Find the category and brand IDs
    const selectedCategory = categories.find((c) => c.name === category);
    const selectedBrand = brands.find((b) => b.name === brand);

    // Create prefill data object
    const prefillDataObj = {
      brand: brand || undefined,
      brand_id: selectedBrand?.id,
      category_id: selectedCategory?.id,
      part_number: partNumber || undefined,
      product_type: category || undefined,
      description: partNumber
        ? `Cotización rápida para: ${partNumber}`
        : undefined,
    };

    onSubmit(prefillDataObj);
  };

  const handleButtonClick = () => {
    const form = document.getElementById("quick-quote-form") as HTMLFormElement;
    if (form) {
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      form.dispatchEvent(submitEvent);
    }
  };

  return (
    <section className="relative z-20">
      <div className="w-full bg-gradient-to-r from-[#c03818] to-[#d94520]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-12">
          {/* Mobile: Full width sections, Desktop: 3-column layout */}
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-2 sm:gap-4 lg:gap-8 items-stretch min-h-[200px] sm:min-h-[250px]">
            {/* Column 1: Info Section - Centered on mobile, left-aligned on lg+ */}
            <div className="lg:col-span-3 flex flex-col justify-center items-center lg:items-start text-center lg:text-left min-h-[80px] lg:min-h-[200px] order-1">
              <div className="space-y-0 lg:space-y-4 sm:lg:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="bg-white/20 rounded-xl p-2 sm:p-3">
                    <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-xl sm:text-2xl leading-tight">
                      Cotiza
                      <br />
                      Rápidamente
                    </h3>
                  </div>
                </div>

                <div className="hidden lg:block space-y-3 sm:space-y-4 text-white/90">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-2 flex-shrink-0">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm sm:text-base font-medium">
                      Respuesta en minutos
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-2 flex-shrink-0">
                      <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-sm sm:text-base font-medium">
                      Envíos urgentes a todo México
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-2 flex-shrink-0">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-sm sm:text-base font-medium">
                      Productos certificados
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Form Fields - Full width on mobile */}
            <div className="w-full lg:col-span-7 flex items-stretch order-2">
              <form
                className="w-full bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20 flex items-center"
                onSubmit={handleSubmit}
                id="quick-quote-form"
              >
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {/* Marca Field */}
                  <div className="space-y-1 sm:space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      MARCA
                    </label>
                    <div className="relative">
                      <input
                        name="brand"
                        type="text"
                        list="brand-options"
                        className="w-full bg-white/95 border-2 border-white/30 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base text-gray-800 font-medium placeholder-gray-500 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 hover:bg-white shadow-lg"
                        placeholder="Selecciona o escribe una marca"
                      />
                      <datalist id="brand-options">
                        {brands.map((brand) => (
                          <option key={brand.id} value={brand.name} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {/* Tipo de Producto Field */}
                  <div className="space-y-1 sm:space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      TIPO DE PRODUCTO
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        className="w-full appearance-none bg-white/95 border-2 border-white/30 rounded-lg sm:rounded-xl px-3 sm:px-4 pr-10 sm:pr-12 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base text-gray-800 font-medium focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 cursor-pointer hover:bg-white shadow-lg"
                      >
                        <option value="" className="text-gray-500">
                          Selecciona categoría
                        </option>
                        {categories.map((category) => (
                          <option
                            key={category.id}
                            value={category.name}
                            className="text-gray-800"
                          >
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L12 13.06l5.71-5.83a.75.75 0 111.08 1.04l-6.25 6.37a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Número de Parte Field */}
                  <div className="space-y-1 sm:space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      NÚMERO DE PARTE
                    </label>
                    <input
                      name="partNumber"
                      type="text"
                      className="w-full bg-white/95 border-2 border-white/30 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base text-gray-800 font-medium placeholder-gray-500 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 hover:bg-white shadow-lg"
                      placeholder="Código o referencia"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Column 3: Action Button - Normal button on mobile, styled on desktop */}
            <div className="w-full lg:col-span-2 flex flex-col items-center justify-center min-h-[60px] lg:min-h-[200px] order-3">
              <button
                type="button"
                onClick={handleButtonClick}
                className="group bg-white text-[#c03818] font-bold px-6 py-3 lg:px-4 lg:py-4 rounded-lg lg:rounded-2xl hover:bg-gray-50 hover:shadow-lg lg:hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex flex-row lg:flex-col items-center justify-center gap-2 lg:gap-3 border border-white lg:border-4 shadow-md lg:shadow-2xl w-full lg:max-w-[160px] min-h-[48px] lg:min-h-[140px]"
              >
                {/* Mobile: inline icon, Desktop: stacked icon */}
                <ArrowRight className="w-4 h-4 lg:hidden text-[#c03818] group-hover:translate-x-1 transition-transform" />
                <div className="hidden lg:block bg-gradient-to-br from-[#c03818] to-[#d94520] rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Text */}
                <span className="font-bold text-base lg:hidden">
                  Solicitar Cotización
                </span>
                <div className="hidden lg:block space-y-1 text-center">
                  <div className="font-black text-base leading-tight">
                    Solicitar
                  </div>
                  <div className="font-black text-base leading-tight">
                    Cotización
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
