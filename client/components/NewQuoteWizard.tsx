import { useState, useEffect } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Package,
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { CreateQuoteRequest } from "@shared/api";

interface QuoteWizardProps {
  isOpen: boolean;
  onClose: () => void;
  prefillData?: {
    brand?: string;
    brand_id?: number;
    manufacturer_id?: number;
    category_id?: number;
    subcategory_id?: number;
  };
}

interface Brand {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  category_id: number;
}

type WizardStep = 1 | 2;

const QuoteWizard = ({ isOpen, onClose, prefillData }: QuoteWizardProps) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Data from API
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    Subcategory[]
  >([]);

  // Dropdown states
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);

  const [formData, setFormData] = useState<CreateQuoteRequest>({
    // Step 1: Product Information
    brand: prefillData?.brand || "",
    product_type: "",
    part_number: "",
    specifications: "",
    brand_id: prefillData?.brand_id,
    manufacturer_id: prefillData?.manufacturer_id,
    category_id: prefillData?.category_id,
    subcategory_id: prefillData?.subcategory_id,
    // Step 2: Contact Information
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_company: "",
    city_state: "",
    preferred_contact_method: "email",
    contact_notes: "",
  });

  // Load data from API
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Filter subcategories based on selected category
  useEffect(() => {
    if (formData.category_id) {
      setFilteredSubcategories(
        subcategories.filter((sub) => sub.category_id === formData.category_id),
      );
    } else {
      setFilteredSubcategories(subcategories);
    }
  }, [formData.category_id, subcategories]);

  const fetchData = async () => {
    try {
      const [brandsRes, categoriesRes, subcategoriesRes] = await Promise.all([
        fetch("/api/brands"),
        fetch("/api/categories"),
        fetch("/api/subcategories"),
      ]);

      const brandsData = await brandsRes.json();
      const categoriesData = await categoriesRes.json();
      const subcategoriesData = await subcategoriesRes.json();

      if (brandsData.success) setBrands(brandsData.data);
      if (categoriesData.success) setCategories(categoriesData.data);
      if (subcategoriesData.success) setSubcategories(subcategoriesData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBrandSelect = (brand: Brand | null, customValue?: string) => {
    if (brand) {
      setFormData((prev) => ({
        ...prev,
        brand: brand.name,
        brand_id: brand.id,
      }));
    } else if (customValue) {
      setFormData((prev) => ({
        ...prev,
        brand: customValue,
        brand_id: undefined,
      }));
    }
    setShowBrandDropdown(false);
  };

  const handleCategorySelect = (category: Category) => {
    setFormData((prev) => ({
      ...prev,
      category_id: category.id,
      subcategory_id: undefined, // Reset subcategory when category changes
    }));
    setShowCategoryDropdown(false);
  };

  const handleSubcategorySelect = (subcategory: Subcategory) => {
    setFormData((prev) => ({
      ...prev,
      subcategory_id: subcategory.id,
    }));
    setShowSubcategoryDropdown(false);
  };

  const handleContactMethodChange = (
    method: "email" | "phone" | "whatsapp",
  ) => {
    setFormData((prev) => ({ ...prev, preferred_contact_method: method }));
  };

  const isStep1Valid = formData.product_type.trim() !== "";
  const isStep2Valid =
    formData.customer_name.trim() !== "" &&
    formData.customer_email.trim() !== "" &&
    formData.customer_phone.trim() !== "" &&
    formData.customer_company.trim() !== "";

  const handleNextStep = () => {
    if (currentStep === 1 && isStep1Valid) {
      setCurrentStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async () => {
    if (!isStep2Valid) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          onClose();
          setSubmitSuccess(false);
          // Reset form
          setCurrentStep(1);
          setFormData({
            brand: prefillData?.brand || "",
            product_type: "",
            part_number: "",
            specifications: "",
            brand_id: prefillData?.brand_id,
            manufacturer_id: prefillData?.manufacturer_id,
            category_id: prefillData?.category_id,
            subcategory_id: prefillData?.subcategory_id,
            customer_name: "",
            customer_email: "",
            customer_phone: "",
            customer_company: "",
            city_state: "",
            preferred_contact_method: "email",
            contact_notes: "",
          });
        }, 2000);
      } else {
        alert("Error al enviar la cotización: " + result.error);
      }
    } catch (error) {
      console.error("Error submitting quote:", error);
      alert("Error al enviar la cotización. Por favor intente de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col lg:flex-row animate-in slide-in-from-bottom duration-300">
        {/* Left Side - Form */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-steel-800 text-white px-6 py-5 flex items-center justify-between border-b border-steel-700">
            <div>
              <h2 className="text-2xl font-bold">
                Solicita tu cotización industrial
              </h2>
              <p className="text-sm text-steel-200 mt-1">
                Paso {currentStep} de 2
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Stepper */}
          <div className="bg-white border-b border-steel-200 px-6 py-5">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    currentStep === 1
                      ? "bg-accent text-white scale-110 shadow-lg"
                      : currentStep > 1
                        ? "bg-primary text-white"
                        : "bg-steel-200 text-steel-600"
                  }`}
                >
                  {currentStep > 1 ? <Check size={20} /> : "1"}
                </div>
                <span
                  className={`ml-2 font-semibold text-sm ${currentStep === 1 ? "text-accent" : "text-steel-600"}`}
                >
                  Información del producto
                </span>
              </div>
              <div
                className={`h-1 w-16 rounded transition-all duration-300 ${currentStep > 1 ? "bg-primary" : "bg-steel-200"}`}
              />
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    currentStep === 2
                      ? "bg-accent text-white scale-110 shadow-lg"
                      : "bg-steel-200 text-steel-600"
                  }`}
                >
                  2
                </div>
                <span
                  className={`ml-2 font-semibold text-sm ${currentStep === 2 ? "text-accent" : "text-steel-600"}`}
                >
                  Datos de contacto
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Step 1: Product Information */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in slide-in-from-right duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Package className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary">
                      ¿Qué necesitas?
                    </h3>
                    <p className="text-sm text-steel-600">
                      Cuéntanos sobre el producto industrial que buscas
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-bold text-primary mb-2">
                    Marca
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={(e) => {
                        handleInputChange(e);
                        setShowBrandDropdown(true);
                      }}
                      onFocus={() => setShowBrandDropdown(true)}
                      placeholder="Ej: SKF, NSK, ABB, Siemens, Baldor, Gates"
                      className="w-full px-4 py-3 border-2 border-steel-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all pr-10"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel-400 pointer-events-none" />
                  </div>
                  {showBrandDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowBrandDropdown(false)}
                      />
                      <div className="absolute z-20 w-full mt-2 bg-white border-2 border-steel-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                        {brands
                          .filter((brand) =>
                            brand.name
                              .toLowerCase()
                              .includes(formData.brand.toLowerCase()),
                          )
                          .map((brand) => (
                            <button
                              key={brand.id}
                              type="button"
                              onClick={() => handleBrandSelect(brand)}
                              className="w-full px-4 py-3 text-left hover:bg-accent/10 transition-colors text-steel-700 hover:text-primary font-medium"
                            >
                              {brand.name}
                            </button>
                          ))}
                        {formData.brand &&
                          !brands.some(
                            (b) =>
                              b.name.toLowerCase() ===
                              formData.brand.toLowerCase(),
                          ) && (
                            <button
                              type="button"
                              onClick={() =>
                                handleBrandSelect(null, formData.brand)
                              }
                              className="w-full px-4 py-3 text-left hover:bg-accent/10 transition-colors text-accent font-semibold border-t border-steel-200"
                            >
                              + Usar "{formData.brand}" (nueva marca)
                            </button>
                          )}
                      </div>
                    </>
                  )}
                  <p className="text-xs text-steel-500 mt-1">
                    Selecciona de la lista o escribe una nueva marca
                  </p>
                </div>

                <div className="relative">
                  <label className="block text-sm font-bold text-primary mb-2">
                    Categoría
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setShowCategoryDropdown(!showCategoryDropdown)
                      }
                      className="w-full px-4 py-3 border-2 border-steel-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-left flex items-center justify-between"
                    >
                      <span
                        className={
                          formData.category_id
                            ? "text-steel-700"
                            : "text-steel-400"
                        }
                      >
                        {formData.category_id
                          ? categories.find(
                              (c) => c.id === formData.category_id,
                            )?.name
                          : "Selecciona una categoría"}
                      </span>
                      <ChevronDown className="w-5 h-5 text-steel-400" />
                    </button>
                  </div>
                  {showCategoryDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowCategoryDropdown(false)}
                      />
                      <div className="absolute z-20 w-full mt-2 bg-white border-2 border-steel-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              category_id: undefined,
                              subcategory_id: undefined,
                            }));
                            setShowCategoryDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-steel-50 transition-colors text-steel-400 italic"
                        >
                          Sin categoría
                        </button>
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => handleCategorySelect(category)}
                            className="w-full px-4 py-3 text-left hover:bg-accent/10 transition-colors text-steel-700 hover:text-primary font-medium"
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  <p className="text-xs text-steel-500 mt-1">Opcional</p>
                </div>

                <div className="relative">
                  <label className="block text-sm font-bold text-primary mb-2">
                    Subcategoría
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setShowSubcategoryDropdown(!showSubcategoryDropdown)
                      }
                      disabled={!formData.category_id}
                      className="w-full px-4 py-3 border-2 border-steel-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span
                        className={
                          formData.subcategory_id
                            ? "text-steel-700"
                            : "text-steel-400"
                        }
                      >
                        {formData.subcategory_id
                          ? subcategories.find(
                              (s) => s.id === formData.subcategory_id,
                            )?.name
                          : formData.category_id
                            ? "Selecciona una subcategoría"
                            : "Primero selecciona una categoría"}
                      </span>
                      <ChevronDown className="w-5 h-5 text-steel-400" />
                    </button>
                  </div>
                  {showSubcategoryDropdown && formData.category_id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowSubcategoryDropdown(false)}
                      />
                      <div className="absolute z-20 w-full mt-2 bg-white border-2 border-steel-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              subcategory_id: undefined,
                            }));
                            setShowSubcategoryDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-steel-50 transition-colors text-steel-400 italic"
                        >
                          Sin subcategoría
                        </button>
                        {filteredSubcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            type="button"
                            onClick={() => handleSubcategorySelect(subcategory)}
                            className="w-full px-4 py-3 text-left hover:bg-accent/10 transition-colors text-steel-700 hover:text-primary font-medium"
                          >
                            {subcategory.name}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  <p className="text-xs text-steel-500 mt-1">Opcional</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary mb-2">
                    Tipo de producto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="product_type"
                    value={formData.product_type}
                    onChange={handleInputChange}
                    placeholder="Ej: Motor eléctrico, rodamiento, chumacera, banda, válvula"
                    className="w-full px-4 py-3 border-2 border-steel-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary mb-2">
                    Número de parte / modelo
                  </label>
                  <input
                    type="text"
                    name="part_number"
                    value={formData.part_number}
                    onChange={handleInputChange}
                    placeholder="Ej: 6204-2RS, WEG00236ET3E145T"
                    className="w-full px-4 py-3 border-2 border-steel-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  />
                  <p className="text-xs text-steel-500 mt-1">
                    Opcional. Si lo tienes, nos ayuda a cotizar más rápido.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary mb-2">
                    Especificaciones o aplicación
                  </label>
                  <textarea
                    name="specifications"
                    value={formData.specifications}
                    onChange={handleInputChange}
                    placeholder="Ej: HP, voltaje, RPM, medidas, aplicación, equipo donde se usará, etc."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-steel-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in slide-in-from-right duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary">
                      Datos de contacto
                    </h3>
                    <p className="text-sm text-steel-600">
                      Para que podamos enviarte la cotización
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary mb-2 flex items-center gap-2">
                    <Building2 size={16} />
                    Nombre de la empresa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customer_company"
                    value={formData.customer_company}
                    onChange={handleInputChange}
                    placeholder="Ej: Acme Industrial S.A."
                    className="w-full px-4 py-3 border-2 border-steel-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary mb-2 flex items-center gap-2">
                    <User size={16} />
                    Nombre del contacto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    placeholder="Ej: Juan García Pérez"
                    className="w-full px-4 py-3 border-2 border-steel-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2 flex items-center gap-2">
                      <Mail size={16} />
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      placeholder="correo@empresa.com"
                      className="w-full px-4 py-3 border-2 border-steel-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2 flex items-center gap-2">
                      <Phone size={16} />
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      placeholder="+52 1234567890"
                      className="w-full px-4 py-3 border-2 border-steel-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary mb-2 flex items-center gap-2">
                    <MapPin size={16} />
                    Ciudad / Estado
                  </label>
                  <input
                    type="text"
                    name="city_state"
                    value={formData.city_state}
                    onChange={handleInputChange}
                    placeholder="Ej: Monterrey, Nuevo León"
                    className="w-full px-4 py-3 border-2 border-steel-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary mb-3 flex items-center gap-2">
                    <MessageSquare size={16} />
                    ¿Cómo prefieres que te contactemos?
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { value: "email" as const, label: "Email", icon: Mail },
                      {
                        value: "phone" as const,
                        label: "Teléfono",
                        icon: Phone,
                      },
                      {
                        value: "whatsapp" as const,
                        label: "WhatsApp",
                        icon: MessageSquare,
                      },
                    ].map((method) => (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => handleContactMethodChange(method.value)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                          formData.preferred_contact_method === method.value
                            ? "bg-accent text-white border-accent shadow-lg scale-105"
                            : "bg-white text-steel-700 border-steel-200 hover:border-accent hover:bg-accent/5"
                        }`}
                      >
                        <method.icon size={18} />
                        {method.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3">
                    {formData.preferred_contact_method === "email" && (
                      <>
                        <label className="block text-sm font-semibold text-primary mb-2">
                          Email específico para cotización
                        </label>
                        <input
                          type="email"
                          name="contact_notes"
                          value={formData.contact_notes || ""}
                          onChange={handleInputChange}
                          placeholder="correo.cotizaciones@empresa.com"
                          className="w-full px-4 py-2 border-2 border-steel-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                        />
                        <p className="text-xs text-steel-500 mt-1">
                          Opcional: Si prefieres recibir la cotización en otro
                          email
                        </p>
                      </>
                    )}
                    {formData.preferred_contact_method === "phone" && (
                      <>
                        <label className="block text-sm font-semibold text-primary mb-2">
                          Teléfono específico
                        </label>
                        <input
                          type="tel"
                          name="contact_notes"
                          value={formData.contact_notes || ""}
                          onChange={handleInputChange}
                          placeholder="+52 123 456 7890"
                          className="w-full px-4 py-2 border-2 border-steel-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                        />
                        <p className="text-xs text-steel-500 mt-1">
                          Opcional: Horario preferido o teléfono alternativo
                        </p>
                      </>
                    )}
                    {formData.preferred_contact_method === "whatsapp" && (
                      <>
                        <label className="block text-sm font-semibold text-primary mb-2">
                          Número de WhatsApp
                        </label>
                        <input
                          type="tel"
                          name="contact_notes"
                          value={formData.contact_notes || ""}
                          onChange={handleInputChange}
                          placeholder="+52 123 456 7890"
                          className="w-full px-4 py-2 border-2 border-steel-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                        />
                        <p className="text-xs text-steel-500 mt-1">
                          Opcional: WhatsApp alternativo u horario preferido
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer with buttons */}
          <div className="border-t border-steel-200 px-6 py-4 bg-steel-50 flex items-center justify-between">
            <button
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 border-2 border-steel-300 rounded-xl text-primary font-bold hover:bg-steel-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <ChevronLeft size={20} />
              Anterior
            </button>

            {currentStep === 1 ? (
              <button
                onClick={handleNextStep}
                disabled={!isStep1Valid}
                className="flex items-center gap-2 px-8 py-3 bg-accent text-white rounded-xl font-bold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg"
              >
                Continuar
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStep2Valid || isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-steel-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Solicitar cotización
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Side - Real-time Summary */}
        <div className="hidden lg:block w-96 bg-gradient-to-br from-steel-50 to-steel-100 border-l border-steel-200 p-6 overflow-y-auto">
          <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Resumen de tu solicitud
          </h3>

          {submitSuccess ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-bold text-green-800 mb-2">
                ¡Solicitud enviada!
              </h4>
              <p className="text-sm text-green-700">
                Un asesor de Trenor se pondrá en contacto contigo a la brevedad.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Product Info Summary */}
              <div className="bg-white rounded-xl p-4 border-2 border-steel-200 space-y-3">
                <h4 className="font-bold text-primary text-sm uppercase tracking-wide mb-3">
                  Producto
                </h4>

                {formData.brand && (
                  <div>
                    <p className="text-xs text-steel-500 font-semibold mb-1">
                      Marca
                    </p>
                    <p className="text-sm text-steel-700 font-semibold">
                      {formData.brand}
                    </p>
                  </div>
                )}

                {formData.product_type && (
                  <div>
                    <p className="text-xs text-steel-500 font-semibold mb-1">
                      Tipo de producto
                    </p>
                    <p className="text-sm text-steel-700 font-semibold">
                      {formData.product_type}
                    </p>
                  </div>
                )}

                {formData.part_number && (
                  <div>
                    <p className="text-xs text-steel-500 font-semibold mb-1">
                      Número de parte
                    </p>
                    <p className="text-sm text-steel-700 font-mono">
                      {formData.part_number}
                    </p>
                  </div>
                )}

                {formData.specifications && (
                  <div>
                    <p className="text-xs text-steel-500 font-semibold mb-1">
                      Especificaciones
                    </p>
                    <p className="text-sm text-steel-700 line-clamp-3">
                      {formData.specifications}
                    </p>
                  </div>
                )}

                {!formData.product_type && (
                  <p className="text-sm text-steel-400 italic py-2">
                    Completa el formulario para ver el resumen
                  </p>
                )}
              </div>

              {/* Contact Info Summary */}
              {currentStep === 2 && (
                <div className="bg-white rounded-xl p-4 border-2 border-steel-200 space-y-3 animate-in slide-in-from-right duration-300">
                  <h4 className="font-bold text-primary text-sm uppercase tracking-wide mb-3">
                    Contacto
                  </h4>

                  {formData.customer_company && (
                    <div>
                      <p className="text-xs text-steel-500 font-semibold mb-1">
                        Empresa
                      </p>
                      <p className="text-sm text-steel-700 font-semibold">
                        {formData.customer_company}
                      </p>
                    </div>
                  )}

                  {formData.customer_name && (
                    <div>
                      <p className="text-xs text-steel-500 font-semibold mb-1">
                        Contacto
                      </p>
                      <p className="text-sm text-steel-700">
                        {formData.customer_name}
                      </p>
                    </div>
                  )}

                  {formData.customer_email && (
                    <div>
                      <p className="text-xs text-steel-500 font-semibold mb-1">
                        Email
                      </p>
                      <p className="text-sm text-steel-700 break-all">
                        {formData.customer_email}
                      </p>
                    </div>
                  )}

                  {formData.customer_phone && (
                    <div>
                      <p className="text-xs text-steel-500 font-semibold mb-1">
                        Teléfono
                      </p>
                      <p className="text-sm text-steel-700">
                        {formData.customer_phone}
                      </p>
                    </div>
                  )}

                  {formData.city_state && (
                    <div>
                      <p className="text-xs text-steel-500 font-semibold mb-1">
                        Ubicación
                      </p>
                      <p className="text-sm text-steel-700">
                        {formData.city_state}
                      </p>
                    </div>
                  )}

                  {formData.preferred_contact_method && (
                    <div>
                      <p className="text-xs text-steel-500 font-semibold mb-1">
                        Método de contacto preferido
                      </p>
                      <p className="text-sm text-steel-700 capitalize">
                        {formData.preferred_contact_method}
                      </p>
                    </div>
                  )}

                  {formData.contact_notes && (
                    <div>
                      <p className="text-xs text-steel-500 font-semibold mb-1">
                        Notas adicionales
                      </p>
                      <p className="text-sm text-steel-700">
                        {formData.contact_notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Footer Note */}
              <div className="bg-accent/10 border-2 border-accent/20 rounded-xl p-4 mt-6">
                <p className="text-xs text-steel-700 text-center leading-relaxed">
                  Un asesor de <span className="font-bold">Trenor</span> se
                  pondrá en contacto contigo a la brevedad.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteWizard;
