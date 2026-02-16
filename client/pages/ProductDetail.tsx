import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Package,
  Truck,
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/Header";
import NewQuoteWizard from "@/components/NewQuoteWizard";
import SEO from "@/components/SEO";
import { LoadingSpinner } from "@/components/LoadingMask";
import { useQuote } from "@/context/QuoteContext";
import { useStore } from "@/store/StoreContext";

const IMAGE_BASE_URL = "https://disruptinglabs.com/data/api";

const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath)
    return "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800";
  if (imagePath.startsWith("http")) return imagePath;

  // Remove leading slash from path to avoid double slashes
  const cleanPath = imagePath.startsWith("/")
    ? imagePath.substring(1)
    : imagePath;
  return `${IMAGE_BASE_URL}/${cleanPath}`;
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, actions } = useStore();
  const product = state.products.selectedProduct;
  const loading = state.products.loading;
  const error = state.products.error;

  const {
    addProduct,
    removeProduct,
    updateProductQuantity,
    selectedProducts,
    isWizardOpen,
    openWizard,
  } = useQuote();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToQuote, setAddedToQuote] = useState(false);

  useEffect(() => {
    if (id) {
      actions.fetchProductById(parseInt(id));
    }
  }, [id]);

  const images = (() => {
    const imageList: string[] = [];

    // Add main image first
    if (product?.main_image) {
      imageList.push(getImageUrl(product.main_image));
    }

    // Add extra images
    if (product?.extra_images) {
      try {
        const extraImgs =
          typeof product.extra_images === "string"
            ? JSON.parse(product.extra_images)
            : product.extra_images;
        if (Array.isArray(extraImgs)) {
          imageList.push(...extraImgs.map((img) => getImageUrl(img)));
        }
      } catch (e) {
        console.error("Error parsing extra_images:", e);
      }
    }

    // Fallback to legacy images field
    if (
      imageList.length === 0 &&
      product?.images &&
      Array.isArray(product.images)
    ) {
      imageList.push(...product.images.map((img) => getImageUrl(img)));
    }

    // Final fallback to placeholder
    if (imageList.length === 0) {
      imageList.push(
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
      );
    }

    return imageList;
  })();

  const handleAddToQuote = () => {
    if (product) {
      addProduct({
        id: product.id.toString(),
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: quantity,
      });
      setAddedToQuote(true);
      setQuantity(1); // Reset quantity after adding
      setTimeout(() => setAddedToQuote(false), 2000);
    }
  };

  const handleRemoveOne = () => {
    if (product && quotedProduct) {
      if (quotedProduct.quantity > 1) {
        updateProductQuantity(
          product.id.toString(),
          quotedProduct.quantity - 1,
        );
      } else {
        removeProduct(product.id.toString());
      }
    }
  };

  const quotedProduct = selectedProducts.find(
    (p) => p.id === product?.id.toString(),
  );
  const quotedQuantity = quotedProduct?.quantity || 0;

  if (loading.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-32">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error.hasError || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="rounded-lg bg-red-50 p-12 text-center">
            <p className="mb-4 text-lg text-red-600">
              {error.errorMessage || "Producto no encontrado"}
            </p>
            <button
              onClick={() => navigate("/catalog")}
              className="text-[#c03818] hover:text-[#c03818]/80"
            >
              Volver al catálogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={product.name}
        description={
          product.description ||
          `${product.name} - ${product.manufacturer_name || ""} ${product.brand_name || ""}`
        }
        image={
          product.main_image ||
          (product.images && Array.isArray(product.images)
            ? product.images[0]
            : undefined)
        }
        type="product"
        price={product.price}
        currency={product.currency}
        availability={product.is_active ? "in stock" : "out of stock"}
        sku={product.sku}
      />
      <Header />

      {/* Floating Quote Button */}
      {selectedProducts.length > 0 && (
        <button
          onClick={openWizard}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center gap-2 sm:gap-3 rounded-full bg-[#c03818] px-4 py-3 sm:px-6 sm:py-4 font-bold text-white shadow-2xl transition-all hover:scale-105 hover:brightness-110 text-sm sm:text-base"
        >
          <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden xs:inline">
            Ver Cotización ({selectedProducts.length})
          </span>
          <span className="xs:hidden">({selectedProducts.length})</span>
        </button>
      )}

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 sm:mb-6 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 overflow-x-auto">
          <Link to="/" className="hover:text-[#c03818] whitespace-nowrap">
            Inicio
          </Link>
          <span>/</span>
          <Link
            to="/catalog"
            className="hover:text-[#c03818] whitespace-nowrap"
          >
            Catálogo
          </Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{product.name}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-6 flex items-center gap-2 text-[#1b3148] transition-colors hover:text-[#c03818] active:scale-95"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="font-medium text-sm sm:text-base">Volver</span>
        </button>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-lg">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {!product.is_active && (
                <div className="absolute right-2 top-2 sm:right-4 sm:top-4 rounded-full bg-red-500 px-3 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm font-bold text-white shadow-lg">
                  Agotado
                </div>
              )}
              {product.is_featured && (
                <div className="absolute left-2 top-2 sm:left-4 sm:top-4 flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#1b3148] px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-white shadow-lg">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                  Destacado
                </div>
              )}

              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1,
                      )
                    }
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 sm:p-3 shadow-lg transition-all hover:bg-white active:scale-95 hover:scale-110"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1,
                      )
                    }
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 sm:p-3 shadow-lg transition-all hover:bg-white active:scale-95 hover:scale-110"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square overflow-hidden rounded-lg transition-all ${
                      selectedImage === idx
                        ? "ring-4 ring-[#c03818] scale-105"
                        : "ring-2 ring-gray-200 hover:ring-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* SKU & Badge */}
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1b3148] truncate">
                SKU: {product.sku}
              </p>
              {product.category_name && (
                <span className="rounded-full bg-gray-100 px-3 py-1 sm:px-4 sm:py-1 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                  {product.category_name}
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Description */}
            {product.description && (
              <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-gray-600">
                {product.description}
              </p>
            )}

            {/* Price */}
            <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1b3148] to-[#1b3148]/90 p-6 sm:p-8 text-white">
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-medium opacity-90">
                Precio
              </p>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black">
                ${product.price.toLocaleString()}
              </p>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium opacity-75">
                {product.currency}
              </p>
            </div>

            {/* Product Metadata */}
            <div className="grid gap-4 sm:grid-cols-2">
              {product.manufacturer_name && (
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Fabricante
                  </p>
                  <p className="font-bold text-gray-900">
                    {product.manufacturer_name}
                  </p>
                </div>
              )}
              {product.brand_name && (
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Marca
                  </p>
                  <p className="font-bold text-gray-900">
                    {product.brand_name}
                  </p>
                </div>
              )}
              {product.model_name && (
                <div className="rounded-lg bg-white p-4 shadow-sm sm:col-span-2">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Modelo
                  </p>
                  <p className="font-bold text-gray-900">
                    {product.model_name}
                  </p>
                </div>
              )}
            </div>

            {/* Quantity Selector & Add to Quote */}
            <div className="space-y-3 sm:space-y-4 rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-gray-700">
                  Cantidad
                </label>
                {quotedQuantity > 0 && (
                  <span className="rounded-full bg-[#c03818]/10 px-2.5 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-bold text-[#c03818]">
                    {quotedQuantity} en cotización
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center justify-center gap-2 sm:gap-3 rounded-lg border-2 border-gray-200 bg-gray-50 px-4 sm:px-6 py-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-gray-600 transition-colors hover:text-[#c03818] active:scale-95 p-1"
                  >
                    <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <span className="w-10 sm:w-12 text-center text-lg sm:text-xl font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-gray-600 transition-colors hover:text-[#c03818] active:scale-95 p-1"
                  >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToQuote}
                  disabled={!product.is_active}
                  className="flex-1 flex items-center justify-center gap-2 sm:gap-3 rounded-lg bg-[#c03818] px-4 sm:px-8 py-3 sm:py-4 font-bold text-white shadow-lg transition-all hover:brightness-110 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-400 text-sm sm:text-base"
                >
                  {addedToQuote ? (
                    <>
                      <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                      Agregado
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden xs:inline">
                        Agregar a Cotización
                      </span>
                      <span className="xs:hidden">Agregar</span>
                    </>
                  )}
                </button>
              </div>

              {quotedQuantity > 0 && (
                <button
                  onClick={handleRemoveOne}
                  className="w-full rounded-lg border-2 border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-600 transition-all hover:border-red-300 hover:bg-red-100"
                >
                  Quitar uno de la cotización
                </button>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 rounded-lg bg-white p-3 sm:p-4 shadow-sm">
                <div className="rounded-full bg-[#c03818]/10 p-2 sm:p-3">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-[#c03818]" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-500">
                    Stock
                  </p>
                  <p className="font-bold text-gray-900 text-xs sm:text-base">
                    Disponible
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 rounded-lg bg-white p-3 sm:p-4 shadow-sm">
                <div className="rounded-full bg-[#c03818]/10 p-2 sm:p-3">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-[#c03818]" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-500">
                    Envío
                  </p>
                  <p className="font-bold text-gray-900 text-xs sm:text-base">
                    Rápido
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 rounded-lg bg-white p-3 sm:p-4 shadow-sm">
                <div className="rounded-full bg-[#c03818]/10 p-2 sm:p-3">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-[#c03818]" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-500">
                    Garantía
                  </p>
                  <p className="font-bold text-gray-900 text-xs sm:text-base">
                    Incluida
                  </p>
                </div>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications &&
              Object.keys(product.specifications).length > 0 && (
                <div className="rounded-2xl bg-white p-6 shadow-lg">
                  <h2 className="mb-4 text-xl font-bold text-gray-900">
                    Especificaciones
                  </h2>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between border-b border-gray-100 pb-3 last:border-0"
                        >
                          <span className="font-semibold text-gray-700">
                            {key}
                          </span>
                          <span className="text-gray-900">{String(value)}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Quote Wizard */}
      {/* New Quote Wizard */}
      {useQuote().isNewWizardOpen && (
        <NewQuoteWizard
          isOpen={useQuote().isNewWizardOpen}
          onClose={useQuote().closeNewWizard}
          prefillData={useQuote().prefillData}
        />
      )}
    </div>
  );
};

export default ProductDetail;
