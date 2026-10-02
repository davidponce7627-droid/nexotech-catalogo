import React from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingCart, ShieldCheck, MessageCircle, Eye, Wrench, Tag, MapPin, Phone, Settings } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    settings, 
    cartCount, 
    cartTotal,
    setIsCartOpen, 
    viewMode, 
    requestAdminAccess,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    categories,
    isWholesalePricing,
    setIsWholesalePricing,
    setIsContactModalOpen 
  } = useStore();

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Brand & Logo - Targets the selected element */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <button 
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
            title="Ir al inicio"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              {/* Targeted element: Store Name */}
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 block leading-tight font-display group-hover:text-blue-600 transition-colors">
                {settings.name || 'REFACCIONES & PUERTOS C'}
              </span>
              <span className="text-[11px] text-slate-500 font-semibold tracking-wide uppercase block">
                {settings.tagline || 'Distribución Mayorista para Técnicos'}
              </span>
            </div>
          </button>

          {/* Mobile Buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
              title="Contacto"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800"
              title="Carrito y Cotizador"
            >
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={requestAdminAccess}
              className={`p-2 rounded-lg transition-colors cursor-pointer border ${
                viewMode === 'admin'
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
              }`}
              title="Ajustes / Panel"
              aria-label="Ajustes y Panel"
            >
              <Settings className={`w-4 h-4 ${viewMode === 'admin' ? 'rotate-90' : ''} transition-transform`} />
            </button>
          </div>
        </div>

        {/* Central Search Bar */}
        <div className="w-full md:flex-1 max-w-2xl">
          <form 
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center border-2 border-blue-600 rounded-lg overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-blue-100"
          >
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border-r border-slate-200 px-3 py-2.5 text-xs text-slate-700 font-medium focus:outline-none hidden sm:block shrink-0 cursor-pointer"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar refacción, modelo (ej. Galaxy A12, iPhone 11) o SKU..."
              className="flex-1 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Buscar</span>
            </button>
          </form>
        </div>

        {/* Right Side: Contact, Wholesale switch, Cart & Admin Button */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          
          {/* Contact & Location Button */}
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            title="Ver dirección, teléfonos y horarios"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Contacto & Tienda</span>
          </button>

          {/* Wholesale Mode Toggle */}
          <button
            onClick={() => setIsWholesalePricing(!isWholesalePricing)}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border cursor-pointer ${
              isWholesalePricing
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="Activar precios de mayoreo para talleres"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{isWholesalePricing ? 'Mayoreo Activo ✓' : 'Ver Mayoreo'}</span>
          </button>

          {/* Cart & Quote Box */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 px-3.5 py-1.5 rounded-lg border border-slate-300 hover:border-blue-600 bg-white hover:bg-slate-50 text-left transition-all cursor-pointer shadow-xs"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="text-xs">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block leading-none">
                Mi Pedido
              </span>
              <span className="font-bold text-slate-900 font-mono">
                {settings.currency}{cartTotal.toLocaleString('es-MX')}
              </span>
            </div>
          </button>

          {/* Subtle Gear (Tuerca) Admin Access */}
          <button
            onClick={requestAdminAccess}
            className={`p-2.5 rounded-lg transition-colors cursor-pointer border ${
              viewMode === 'admin'
                ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-200'
            }`}
            title="Ajustes de administración"
            aria-label="Ajustes de administración"
          >
            <Settings className={`w-4 h-4 ${viewMode === 'admin' ? 'rotate-90 text-white' : 'text-slate-700'} transition-transform duration-200`} />
          </button>

        </div>

      </div>

      {/* Category Navigation Bar */}
      <nav className="bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none py-1.5 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'hover:bg-slate-200 text-slate-800'
              }`}
            >
              Todas las Refacciones
            </button>

            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white font-bold'
                    : 'hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsContactModalOpen(true)}
            className="hidden lg:flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold px-2 py-1 hover:bg-emerald-50 rounded"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>¿Dudas? Escríbenos</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
