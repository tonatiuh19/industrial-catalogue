import { ShoppingCart, Heart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
}

const ProductCard = ({
  id,
  name,
  sku,
  price,
  category,
  image,
  inStock,
}: ProductCardProps) => {
  return (
    <div className="bg-white border border-steel-200 hover:border-accent hover:shadow-md transition-all duration-0 group">
      {/* Image container */}
      <div className="relative bg-steel-50 aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:opacity-95 transition-opacity duration-0"
        />
        <div className="absolute top-3 right-3">
          <button className="bg-white rounded-full p-2 hover:bg-steel-100 transition-colors duration-0 shadow-sm">
            <Heart size={18} className="text-steel-600 hover:text-accent" />
          </button>
        </div>

        {/* In stock badge */}
        {inStock && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-block bg-primary text-white text-xs font-bold px-2 py-1">
              En Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs font-bold text-accent uppercase tracking-wide mb-2">
          {category}
        </p>

        {/* Product name */}
        <h3 className="text-sm font-semibold text-primary mb-2 line-clamp-2 hover:text-accent transition-colors duration-0 cursor-pointer">
          {name}
        </h3>

        {/* SKU */}
        <p className="text-xs text-steel-500 mb-3 font-mono">SKU: {sku}</p>

        {/* Price */}
        <div className="mb-4 pb-4 border-t border-steel-100">
          <p className="text-lg font-bold text-primary mt-3">
            ${price.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* Add to cart button */}
        <button
          className="w-full bg-primary text-white py-2 font-semibold text-sm hover:bg-steel-800 transition-colors duration-0 flex items-center justify-center gap-2 active:bg-steel-900"
          disabled={!inStock}
        >
          <ShoppingCart size={16} />
          Agregar
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
