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
import QuoteWizard from "@/components/QuoteWizard";
import SEO from "@/components/SEO";
import { LoadingSpinner } from "@/components/LoadingMask";
import { useQuote } from "@/context/QuoteContext";
import { useStore } from "@/store/StoreContext";

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

  const images =
    product?.images && Array.isArray(product.images)
      ? product.images
      : product?.thumbnail_url
        ? [product.thumbnail_url]
        : [
            "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
          ];

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
          product.thumbnail_url ||
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
          className="fixed bottom-6 right-6 z-30 flex items-center gap-3 rounded-full bg-[#c03818] px-6 py-4 font-bold text-white shadow-2xl transition-all hover:scale-105 hover:brightness-110"
        >
          <ShoppingBag className="h-5 w-5" />
          <span>Ver Cotización ({selectedProducts.length})</span>
        </button>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-[#c03818]">
            Inicio
          </Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-[#c03818]">
            Catálogo
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-[#1b3148] transition-colors hover:text-[#c03818]"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Volver</span>
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-lg">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {!product.is_active && (
                <div className="absolute right-4 top-4 rounded-full bg-red-500 px-6 py-2 text-sm font-bold text-white shadow-lg">
                  Agotado
                </div>
              )}
              {product.is_featured && (
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[#1b3148] px-4 py-2 text-sm font-bold text-white shadow-lg">
                  <Star className="h-4 w-4 fill-current" />
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:scale-110"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:scale-110"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
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
          <div className="space-y-6">
            {/* SKU & Badge */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold uppercase tracking-wider text-[#1b3148]">
                SKU: {product.sku}
              </p>
              {product.category_name && (
                <span className="rounded-full bg-gray-100 px-4 py-1 text-sm font-semibold text-gray-700">
                  {product.category_name}
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-4xl font-black text-gray-900 lg:text-5xl">
              {product.name}
            </h1>

            {/* Description */}
            {product.description && (
              <p className="text-lg leading-relaxed text-gray-600">
                {product.description}
              </p>
            )}

            {/* Price */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1b3148] to-[#1b3148]/90 p-8 text-white">
              <p className="mb-2 text-sm font-medium opacity-90">Precio</p>
              <p className="text-5xl font-black">
                ${product.price.toLocaleString()}
              </p>
              <p className="mt-2 text-sm font-medium opacity-75">
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
            <div className="space-y-4 rounded-2xl bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700">
                  Cantidad
                </label>
                {quotedQuantity > 0 && (
                  <span className="rounded-full bg-[#c03818]/10 px-3 py-1 text-sm font-bold text-[#c03818]">
                    {quotedQuantity} en cotización
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 rounded-lg border-2 border-gray-200 bg-gray-50 px-6 py-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-gray-600 transition-colors hover:text-[#c03818]"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="w-12 text-center text-xl font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-gray-600 transition-colors hover:text-[#c03818]"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToQuote}
                  disabled={!product.is_active}
                  className="flex-1 flex items-center justify-center gap-3 rounded-lg bg-[#c03818] px-8 py-4 font-bold text-white shadow-lg transition-all hover:brightness-110 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {addedToQuote ? (
                    <>
                      <Check className="h-5 w-5" />
                      Agregado
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Agregar a Cotización
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
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
                <div className="rounded-full bg-[#c03818]/10 p-3">
                  <Package className="h-5 w-5 text-[#c03818]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Stock</p>
                  <p className="font-bold text-gray-900">Disponible</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
                <div className="rounded-full bg-[#c03818]/10 p-3">
                  <Truck className="h-5 w-5 text-[#c03818]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Envío</p>
                  <p className="font-bold text-gray-900">Rápido</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
                <div className="rounded-full bg-[#c03818]/10 p-3">
                  <Shield className="h-5 w-5 text-[#c03818]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">
                    Garantía
                  </p>
                  <p className="font-bold text-gray-900">Incluida</p>
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
      {isWizardOpen && <QuoteWizard />}
    </div>
  );
};

export default ProductDetail;
