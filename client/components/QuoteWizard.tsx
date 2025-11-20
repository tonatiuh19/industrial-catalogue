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
  const { selectedProducts, removeProduct, updateProductQuantity, closeWizard, clearProducts } = useQuote();
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    console.log("Quote submitted:", quoteData);
    clearProducts();
    closeWizard();
  };

  const handleClose = () => {
    closeWizard();
  };

  const totalValue = selectedProducts.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-primary text-white px-6 py-4 flex items-center justify-between border-b border-steel-200">
          <div>
            <h2 className="text-xl font-bold">Solicitar Cotización</h2>
            <p className="text-sm text-steel-200 mt-1">
              Paso {currentStep === "products" ? "1" : currentStep === "details" ? "2" : "3"} de 3
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-steel-800 p-1 rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Step indicators */}
        <div className="px-6 py-4 bg-steel-50 flex items-center justify-between">
          {["products", "details", "confirmation"].map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  step === currentStep
                    ? "bg-accent text-white"
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
              <div
                className={`h-1 flex-1 mx-2 ${
                  index < 2
                    ? step === currentStep ||
                      (["products", "details"].includes(step) &&
                        currentStep === "confirmation")
                      ? "bg-primary"
                      : "bg-steel-200"
                    : ""
                }`}
              />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Products */}
          {currentStep === "products" && (
            <div>
              <h3 className="text-lg font-bold text-primary mb-4">
                Productos Seleccionados
              </h3>
              {selectedProducts.length === 0 ? (
                <p className="text-steel-600 py-8 text-center">
                  No hay productos seleccionados
                </p>
              ) : (
                <div className="space-y-4">
                  {selectedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border border-steel-200 rounded p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-primary">
                          {product.name}
                        </h4>
                        <p className="text-sm text-steel-500 font-mono">
                          SKU: {product.sku}
                        </p>
                        <p className="text-sm text-steel-600 mt-1">
                          Precio unitario: ${product.price.toLocaleString("es-MX")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 border border-steel-200">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                product.id,
                                product.quantity - 1
                              )
                            }
                            className="px-3 py-1 hover:bg-steel-100"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 min-w-[40px] text-center font-semibold">
                            {product.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                product.id,
                                product.quantity + 1
                              )
                            }
                            className="px-3 py-1 hover:bg-steel-100"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">
                            ${(product.price * product.quantity).toLocaleString("es-MX")}
                          </p>
                          <p className="text-xs text-steel-500">Total</p>
                        </div>
                        <button
                          onClick={() => removeProduct(product.id)}
                          className="text-destructive hover:text-red-700 font-semibold"
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
              <h3 className="text-lg font-bold text-primary mb-4">
                Información de Contacto
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1">
                    Nombre de Empresa
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Ej: Acme Industrial S.A."
                    className="w-full px-4 py-2 border border-steel-200 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-1">
                    Persona de Contacto
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder="Ej: Juan García"
                    className="w-full px-4 py-2 border border-steel-200 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="correo@empresa.com"
                      className="w-full px-4 py-2 border border-steel-200 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+52 1234567890"
                      className="w-full px-4 py-2 border border-steel-200 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-1">
                    Dirección de Entrega
                  </label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="Ej: Calle Principal 123, Ciudad, Estado"
                    className="w-full px-4 py-2 border border-steel-200 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-1">
                    Requisitos Especiales (Opcional)
                  </label>
                  <textarea
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleInputChange}
                    placeholder="Ej: Entrega urgente, garantía extendida, servicio de instalación..."
                    rows={4}
                    className="w-full px-4 py-2 border border-steel-200 focus:outline-none focus:ring-2 focus:ring-accent"
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
                          ${(product.price * product.quantity).toLocaleString("es-MX")}
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
                  <h4 className="font-bold text-primary mb-3">Información de Contacto</h4>
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
                      <span className="font-semibold">Email:</span> {formData.email}
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
        <div className="sticky bottom-0 bg-steel-50 border-t border-steel-200 px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={handlePreviousStep}
            disabled={currentStep === "products"}
            className="flex items-center gap-2 px-4 py-2 border border-steel-300 text-primary font-semibold hover:bg-steel-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
            Anterior
          </button>

          {currentStep !== "confirmation" ? (
            <button
              onClick={handleNextStep}
              disabled={
                (currentStep === "products" && !isProductsStep) ||
                (currentStep === "details" && !isDetailsValid)
              }
              className="flex items-center gap-2 px-6 py-2 bg-accent text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-primary text-white font-semibold hover:bg-steel-800 transition-colors flex items-center gap-2"
            >
              <Check size={18} />
              Enviar Cotización
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteWizard;
