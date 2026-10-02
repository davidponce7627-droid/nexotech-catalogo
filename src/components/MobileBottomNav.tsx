import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, User, Tag, Home, MessageCircle } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { 
    cartCount, 
    setIsCartOpen, 
    setIsCustomerPortalOpen, 
    currentCustomer,
    isWholesalePricing,
    setIsWholesalePricing,
    setSelectedCategory,
    setSearchQuery,
    settings 
  } = useStore();

  const handleGoHome = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(`Hola ${settings.name}, deseo consultar sobre refacciones y pedidos.`);
    window.open(`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 safe-area-pb">
      <div className="grid grid-cols-5 items-center justify-around text-center">
        
        {/* 1. Inicio */}
        <button
          onClick={handleGoHome}
          className="flex flex-col items-center justify-center py-1 text-slate-600 hover:text-blue-600 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Catálogo</span>
        </button>

        {/* 2. Mayoreo */}
        <button
          onClick={() => setIsWholesalePricing(!isWholesalePricing)}
          className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
            isWholesalePricing ? 'text-amber-600 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Tag className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">
            {isWholesalePricing ? 'Mayoreo ✓' : 'Mayoreo'}
          </span>
          {isWholesalePricing && (
            <span className="absolute top-0 right-3 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
          )}
        </button>

        {/* 3. Portal de Clientes / Mis Recibos */}
        <button
          onClick={() => setIsCustomerPortalOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-indigo-600 hover:text-indigo-800 transition-colors relative"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">
            {currentCustomer ? 'Mis Recibos' : 'Mi Cuenta'}
          </span>
        </button>

        {/* 4. Carrito */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-blue-600 hover:text-blue-800 transition-colors relative"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Carrito</span>
        </button>

        {/* 5. WhatsApp */}
        <button
          onClick={openWhatsApp}
          className="flex flex-col items-center justify-center py-1 text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">WhatsApp</span>
        </button>

      </div>
    </div>
  );
};
