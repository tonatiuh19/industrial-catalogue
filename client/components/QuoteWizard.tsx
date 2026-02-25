import { useState } from "react";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { useQuote } from "@/context/QuoteContext";

type WizardStep = "products" | "details" | "confirmation";

interface QuoteFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  specialRequirements: string;
}

const QuoteWizard = () => {
  const {
    selectedProducts,
    removeProduct,
    updateProductQuantity,
    closeWizard,
    clearProducts,
  } = useQuote();
  const [currentStep, setCurrentStep] = useState<WizardStep>("products");
  const [formData, setFormData] = useState<QuoteFormData>({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    deliveryAddress: "",
    specialRequirements: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateProductQuantity(productId, newQuantity);
    }
  };

  const isProductsStep = selectedProducts.length > 0;
  const isDetailsValid =
    formData.companyName.trim() !== "" &&
    formData.contactPerson.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim() !== "";

  const handleNextStep = () => {
    if (currentStep === "products" && isProductsStep) {
      setCurrentStep("details");
    } else if (currentStep === "details" && isDetailsValid) {
      setCurrentStep("confirmation");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === "details") {
      setCurrentStep("products");
    } else if (currentStep === "confirmation") {
      setCurrentStep("details");
    }
  };

  const handleSubmit = () => {
    const quoteData = {
      products: selectedProducts,
      contactInfo: formData,
      submittedAt: new Date().toISOString(),
    };
    clearProducts();
    closeWizard();
  };

  const handleClose = () => {
    closeWizard();
  };

  const totalValue = selectedProducts.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0,
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-lg shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-primary text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-steel-200 z-10">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">
              Solicitar Cotización
            </h2>
            <p className="text-xs sm:text-sm text-steel-200 mt-0.5 sm:mt-1">
              Paso{" "}
              {currentStep === "products"
                ? "1"
                : currentStep === "details"
                  ? "2"
                  : "3"}{" "}
              de 3
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-steel-800 p-2 rounded-full transition-colors active:scale-95"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 bg-steel-50 flex items-center justify-center gap-2 sm:gap-3">
          {["products", "details", "confirmation"].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                  step === currentStep
                    ? "bg-accent text-white scale-110"
                    : ["products", "details"].includes(step) &&
                        currentStep === "confirmation"
                      ? "bg-primary text-white"
                      : "bg-steel-200 text-steel-600"
                }`}
              >
                {step === "products"
                  ? "1"
                  : step === "details"
                    ? "2"
                    : step === "confirmation"
                      ? "3"
                      : ""}
              </div>
              {index < 2 && (
                <div
                  className={`h-0.5 sm:h-1 w-12 sm:w-20 mx-1 sm:mx-2 transition-all duration-300 ${
                    step === currentStep ||
                    (["products", "details"].includes(step) &&
                      currentStep === "confirmation")
                      ? "bg-primary"
                      : "bg-steel-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Step 1: Products */}
          {currentStep === "products" && (
            <div>
              <h3 className="text-base sm:text-lg font-bold text-primary mb-3 sm:mb-4">
                Productos Seleccionados
              </h3>
              {selectedProducts.length === 0 ? (
                <p className="text-steel-600 py-8 text-center text-sm">
                  No hay productos seleccionados
                </p>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {selectedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border border-steel-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-primary text-sm sm:text-base truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-steel-500 font-mono">
                          SKU: {product.sku}
                        </p>
                        <p className="text-xs sm:text-sm text-steel-600 mt-1">
                          Precio unitario: $
                          {product.price.toLocaleString("es-MX")}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                        <div className="flex items-center gap-1 border border-steel-200 rounded">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                product.id,
                                product.quantity - 1,
                              )
                            }
                            className="px-2 sm:px-3 py-1 sm:py-2 hover:bg-steel-100 active:bg-steel-200 transition-colors text-sm sm:text-base"
                          >
                            −
                          </button>
                          <span className="px-2 sm:px-3 py-1 sm:py-2 min-w-[36px] sm:min-w-[40px] text-center font-semibold text-sm sm:text-base">
                            {product.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                product.id,
                                product.quantity + 1,
                              )
                            }
                            className="px-2 sm:px-3 py-1 sm:py-2 hover:bg-steel-100 active:bg-steel-200 transition-colors text-sm sm:text-base"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary text-sm sm:text-base">
                            $
                            {(product.price * product.quantity).toLocaleString(
                              "es-MX",
                            )}
                          </p>
                          <p className="text-xs text-steel-500">Total</p>
                        </div>
                        <button
                          onClick={() => removeProduct(product.id)}
                          className="text-destructive hover:text-red-700 font-semibold p-1 active:scale-95 transition-transform text-lg"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-steel-200 pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        Total Estimado:
                      </span>
                      <span className="text-2xl font-bold text-accent">
                        ${totalValue.toLocaleString("es-MX")}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === "details" && (
            <div>
              <h3 className="text-base sm:text-lg font-bold text-primary mb-3 sm:mb-4">
                Información de Contacto
              </h3>
              <form className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5">
                    Nombre de Empresa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Ej: Acme Industrial S.A."
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-steel-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5">
                    Persona de Contacto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder="Ej: Juan García"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-steel-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="correo@empresa.com"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-steel-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="477 599 0905"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-steel-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5">
                    Dirección de Entrega
                  </label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="Ej: Calle Principal 123, Ciudad, Estado"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-steel-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5">
                    Requisitos Especiales (Opcional)
                  </label>
                  <textarea
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleInputChange}
                    placeholder="Ej: Entrega urgente, garantía extendida, servicio de instalación..."
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-steel-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all resize-none"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === "confirmation" && (
            <div>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">
                  Revisión de Cotización
                </h3>
                <p className="text-steel-600">
                  Por favor revisa los detalles antes de enviar
                </p>
              </div>

              <div className="space-y-6">
                {/* Products Summary */}
                <div className="bg-steel-50 p-4 rounded">
                  <h4 className="font-bold text-primary mb-3">Productos</h4>
                  <div className="space-y-2">
                    {selectedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-steel-700">
                          {product.name} x{product.quantity}
                        </span>
                        <span className="font-semibold text-primary">
                          $
                          {(product.price * product.quantity).toLocaleString(
                            "es-MX",
                          )}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-steel-200 pt-2 mt-2 flex items-center justify-between font-bold">
                      <span className="text-primary">Total</span>
                      <span className="text-accent text-lg">
                        ${totalValue.toLocaleString("es-MX")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Summary */}
                <div className="bg-steel-50 p-4 rounded">
                  <h4 className="font-bold text-primary mb-3">
                    Información de Contacto
                  </h4>
                  <div className="space-y-2 text-sm text-steel-700">
                    <p>
                      <span className="font-semibold">Empresa:</span>{" "}
                      {formData.companyName}
                    </p>
                    <p>
                      <span className="font-semibold">Contacto:</span>{" "}
                      {formData.contactPerson}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      {formData.email}
                    </p>
                    <p>
                      <span className="font-semibold">Teléfono:</span>{" "}
                      {formData.phone}
                    </p>
                    <p>
                      <span className="font-semibold">Entrega:</span>{" "}
                      {formData.deliveryAddress}
                    </p>
                    {formData.specialRequirements && (
                      <p>
                        <span className="font-semibold">Requisitos:</span>{" "}
                        {formData.specialRequirements}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with buttons */}
        <div className="sticky bottom-0 bg-steel-50 border-t border-steel-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4 z-10">
          <button
            onClick={handlePreviousStep}
            disabled={currentStep === "products"}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 border border-steel-300 rounded-lg text-primary text-sm sm:text-base font-semibold hover:bg-steel-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden xs:inline">Anterior</span>
          </button>

          {currentStep !== "confirmation" ? (
            <button
              onClick={handleNextStep}
              disabled={
                (currentStep === "products" && !isProductsStep) ||
                (currentStep === "details" && !isDetailsValid)
              }
              className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-2 bg-accent text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md"
            >
              Siguiente
              <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 sm:px-6 py-2.5 sm:py-2 bg-primary text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-steel-800 transition-all active:scale-95 flex items-center gap-1 sm:gap-2 shadow-md"
            >
              <Check size={16} className="sm:w-[18px] sm:h-[18px]" />
              Enviar Cotización
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteWizard;
