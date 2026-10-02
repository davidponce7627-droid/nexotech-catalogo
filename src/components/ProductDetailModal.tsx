import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { X, Check, ShoppingCart, MessageCircle, ShieldCheck, Tag, Package } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { settings, isWholesalePricing, addToCart, setIsCartOpen, categories } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const category = categories.find(c => c.id === product.categoryId);
  const qualifiesWholesale = isWholesalePricing || quantity >= settings.wholesaleMinQty;
  const currentUnitPrice = qualifiesWholesale ? product.priceWholesale : product.priceRetail;
  const total = currentUnitPrice * quantity;

  const handleAdd = () => {
    addToCart(product, quantity, qualifiesWholesale);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
      setIsCartOpen(true);
    }, 500);
  };

  const consultViaWhatsApp = () => {
    const text = encodeURIComponent(
      `Hola ${settings.name}, deseo consultar existencias de: "${product.name}" (SKU: ${product.sku}). Requiero ${quantity} pieza(s).`
    );
    window.open(`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Product Image & Pricing Table */}
          <div className="bg-slate-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div className="relative aspect-square rounded-lg bg-white border border-slate-200 p-4 flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Package className="w-16 h-16 text-slate-300 stroke-1" />
              )}

              {product.badge && (
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded shadow-xs uppercase">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Wholesale Tier Table */}
            <div className="mt-4 p-3 rounded-lg bg-white border border-slate-200 text-xs space-y-1.5 shadow-2xs">
              <span className="font-bold text-slate-900 block text-xs border-b border-slate-100 pb-1">
                Tabla de Precios por Volumen
              </span>
              <div className="flex items-center justify-between text-slate-600">
                <span>1 a {settings.wholesaleMinQty - 1} piezas (Menudeo):</span>
                <span className="font-mono font-bold text-slate-900">{settings.currency}{product.priceRetail.toLocaleString('es-MX')}</span>
              </div>
              <div className="flex items-center justify-between text-blue-700 font-bold bg-blue-50 p-1.5 rounded">
                <span>Desde {settings.wholesaleMinQty} piezas (Mayoreo):</span>
                <span className="font-mono text-sm">{settings.currency}{product.priceWholesale.toLocaleString('es-MX')}</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium pt-0.5">
                ✓ Ahorras {settings.currency}{(product.priceRetail - product.priceWholesale).toLocaleString('es-MX')} por unidad con tarifa de mayoreo.
              </p>
            </div>
          </div>

          {/* Right: Technical Info & Purchase Controls */}
          <div className="p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3.5">
              
              {/* SKU & Brand */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">
                  SKU: {product.sku}
                </span>
                <span className="text-slate-500 font-sans">Marca: <strong className="text-slate-800">{product.brand}</strong></span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-2 pb-2 border-b border-slate-100">
                <span className="text-2xl font-extrabold text-blue-600 font-mono tabular-nums">
                  {settings.currency}{currentUnitPrice.toLocaleString('es-MX')}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {qualifiesWholesale ? 'precio mayoreo' : 'precio menudeo'}
                </span>
              </div>

              {/* Stock */}
              <div className="text-xs">
                <span className={`inline-flex items-center gap-1.5 font-bold ${product.stock > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  {product.stock > 0 ? `${product.stock} piezas disponibles en almacén` : 'Pieza actualmente agotada'}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Compatibilities */}
              {product.compatibility && product.compatibility.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">
                    Modelos Compatibles:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {product.compatibility.map((m, idx) => (
                      <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Specs Table */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="space-y-1 pt-1">
                  <h4 className="text-xs font-bold text-slate-800">
                    Especificaciones Técnicas:
                  </h4>
                  <div className="border border-slate-200 rounded-md overflow-hidden text-xs">
                    {Object.entries(product.specs).map(([key, value], idx) => (
                      <div key={key} className={`flex justify-between px-3 py-1 ${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                        <span className="text-slate-500">{key}:</span>
                        <span className="font-semibold text-slate-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warranty Notice */}
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{settings.warrantyPolicy}</span>
              </div>

            </div>

            {/* Stepper & Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center border border-slate-300 rounded-md bg-white overflow-hidden text-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 font-mono font-bold text-slate-900 min-w-8 text-center text-xs">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Subtotal:</span>
                  <span className="text-lg font-bold text-slate-900 font-mono">
                    {settings.currency}{total.toLocaleString('es-MX')}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={product.stock <= 0}
                  className="flex-1 py-2.5 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Agregado al Pedido</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Agregar al Pedido</span>
                    </>
                  )}
                </button>

                <button
                  onClick={consultViaWhatsApp}
                  className="py-2.5 px-3.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
