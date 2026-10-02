import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Check, Eye, Package, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { settings, isWholesalePricing, addToCart, setQuickViewProduct } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Determine pricing
  const qualifiesWholesale = isWholesalePricing || quantity >= settings.wholesaleMinQty;
  const currentUnitPrice = qualifiesWholesale ? product.priceWholesale : product.priceRetail;
  const savingsPerUnit = product.priceRetail - product.priceWholesale;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, quantity, qualifiesWholesale);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div 
      onClick={() => setQuickViewProduct(product)}
      className="bg-white rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden cursor-pointer group"
    >
      <div>
        {/* Product Image */}
        <div className="relative aspect-[4/3] bg-slate-50 border-b border-slate-100 overflow-hidden flex items-center justify-center p-2">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          ) : (
            <Package className="w-12 h-12 text-slate-300 stroke-1" />
          )}

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
              {product.badge}
            </span>
          )}

          {/* Stock Indicator */}
          <div className="absolute top-2 right-2">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              product.stock > 0 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-2.5 sm:p-3.5 space-y-1.5 sm:space-y-2">
          {/* SKU & Brand */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 font-mono">
            <span className="font-bold text-slate-700 truncate max-w-[55%]">{product.sku}</span>
            <span className="text-blue-600 font-sans font-semibold truncate max-w-[40%] text-right">{product.brand}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-tight sm:leading-snug group-hover:text-blue-600 transition-colors min-h-[2.2rem] sm:min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Compatibility */}
          {product.compatibility && product.compatibility.length > 0 && (
            <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1">
              <span className="font-semibold text-slate-700">Modelos:</span> {product.compatibility.slice(0, 2).join(', ')}
              {product.compatibility.length > 2 && '...'}
            </p>
          )}

          {/* Real Wholesale Pricing Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-md p-1.5 sm:p-2 space-y-0.5 sm:space-y-1 text-xs">
            <div className="flex items-baseline justify-between text-[10px] sm:text-[11px]">
              <span className="text-slate-500">Menudeo:</span>
              <span className="font-bold font-mono text-slate-700">
                {settings.currency}{product.priceRetail.toLocaleString('es-MX')}
              </span>
            </div>

            <div className="flex items-baseline justify-between text-blue-700 font-bold border-t border-slate-200 pt-1 text-[10px] sm:text-xs">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-blue-600 shrink-0" />
                <span className="truncate">Mayoreo ({settings.wholesaleMinQty}+):</span>
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold">
                {settings.currency}{product.priceWholesale.toLocaleString('es-MX')}
              </span>
            </div>

            {savingsPerUnit > 0 && (
              <div className="text-[9px] sm:text-[10px] text-emerald-700 font-semibold text-right">
                Ahorras {settings.currency}{savingsPerUnit.toLocaleString('es-MX')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-2.5 sm:p-3.5 pt-1.5 sm:pt-2 border-t border-slate-100 flex items-center gap-1.5 sm:gap-2">
        {/* Quantity Stepper */}
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="flex items-center border border-slate-300 rounded-md bg-white overflow-hidden text-xs shrink-0"
        >
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-1.5 sm:px-2 py-1 sm:py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
          >
            -
          </button>
          <span className="px-1.5 sm:px-2 py-1 sm:py-1.5 font-mono font-bold text-slate-800 min-w-4 text-center text-xs">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-1.5 sm:px-2 py-1 sm:py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
          >
            +
          </button>
        </div>

        {/* Add to Cart / Cotizar Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`flex-1 py-1.5 px-2 sm:px-3 rounded-md text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-colors cursor-pointer ${
            justAdded
              ? 'bg-emerald-600 text-white'
              : product.stock > 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Listo</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Agregar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
