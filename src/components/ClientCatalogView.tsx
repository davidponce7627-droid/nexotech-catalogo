import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { AnnouncementBar } from './AnnouncementBar';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { CartDrawer } from './CartDrawer';
import { ContactModal } from './ContactModal';
import { CustomerPortalModal } from './CustomerPortalModal';
import { MobileBottomNav } from './MobileBottomNav';
import { OrderSuccessModal } from './OrderSuccessModal';
import { AdminSecurityModal } from './AdminPanel/AdminSecurityModal';
import { AIAssistantWidget } from './AIAssistantWidget';
import { Footer } from './Footer';
import { 
  Filter, 
  Layers, 
  Tag, 
  MessageCircle, 
  Phone, 
  Printer, 
  CheckSquare, 
  Square, 
  X, 
  SlidersHorizontal,
  ChevronRight,
  PackageCheck
} from 'lucide-react';

export const ClientCatalogView: React.FC = () => {
  const { 
    products, 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    selectedBrand, 
    setSelectedBrand, 
    quickViewProduct, 
    setQuickViewProduct,
    isWholesalePricing,
    setIsWholesalePricing,
    settings 
  } = useStore();

  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'name'>('relevance');

  // Available brands in the inventory
  const allBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));

  // Filter products
  const filteredProducts = products.filter(p => {
    // 1. Search Query
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch = !searchLower || (
      p.name.toLowerCase().includes(searchLower) ||
      p.sku.toLowerCase().includes(searchLower) ||
      p.brand.toLowerCase().includes(searchLower) ||
      (p.compatibility && p.compatibility.some(c => c.toLowerCase().includes(searchLower)))
    );

    // 2. Category
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;

    // 3. Brand
    const matchesBrand = selectedBrand === 'all' || p.brand === selectedBrand;

    // 4. Stock
    const matchesStock = !inStockOnly || p.stock > 0;

    return matchesSearch && matchesCat && matchesBrand && matchesStock;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = isWholesalePricing ? a.priceWholesale : a.priceRetail;
    const priceB = isWholesalePricing ? b.priceWholesale : b.priceRetail;

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0; // relevance
  });

  // Print catalog
  const handlePrintCatalog = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans pb-16 md:pb-0">
      
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Commercial Navbar */}
      <Navbar />

      {/* Commercial Hero Banner */}
      <Hero />

      {/* Catalog Main Layout */}
      <main id="catalog-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb / Top Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-200 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Inicio</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold">Catálogo de Refacciones</span>
            {selectedCategory !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-blue-600 font-bold">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-slate-700">
              <strong className="text-slate-950 font-bold">{sortedProducts.length}</strong> productos encontrados
            </span>
            <button
              onClick={handlePrintCatalog}
              className="hidden sm:flex items-center gap-1.5 text-slate-700 hover:text-blue-600 cursor-pointer font-medium"
              title="Imprimir lista de precios o guardar PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Lista de Precios</span>
            </button>
          </div>
        </div>

        {/* 2-Column Real E-Commerce Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Traditional Faceted Sidebar Filters (260px) */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* Filter Group 1: Categorías */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2">
                <span>Categorías</span>
                <Layers className="w-4 h-4 text-slate-400" />
              </h3>

              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Todas las piezas</span>
                  <span className="text-[11px] text-slate-400 font-mono">({products.length})</span>
                </button>

                {categories.map(cat => {
                  const count = products.filter(p => p.categoryId === cat.id).length;
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Group 2: Modo Mayoreo & Disponibilidad */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Precios & Disponibilidad
              </h3>

              {/* Wholesale Switch */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isWholesalePricing}
                  onChange={(e) => setIsWholesalePricing(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Mostrar Precios de Mayoreo</span>
                  <span className="text-[11px] text-slate-500 leading-tight block">
                    Válido a partir de {settings.wholesaleMinQty} piezas surtidas
                  </span>
                </div>
              </label>

              {/* In stock only */}
              <label className="flex items-center gap-2.5 cursor-pointer pt-2 border-t border-slate-100">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-700 font-medium">Solo refacciones en stock</span>
              </label>
            </div>

            {/* Filter Group 3: Filtro por Marca */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Marca / Fabricante
              </h3>

              <div className="space-y-1">
                <button
                  onClick={() => setSelectedBrand('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between cursor-pointer ${
                    selectedBrand === 'all'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Todas las marcas</span>
                </button>

                {allBrands.map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between cursor-pointer ${
                      selectedBrand === b
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{b}</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ({products.filter(p => p.brand === b).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar Help / WhatsApp Card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>¿Buscas una refacción especial?</span>
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed">
                Si no encuentras el modelo o flex que necesitas, escríbenos por WhatsApp y te lo cotizamos de inmediato.
              </p>
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors block text-center shadow-xs"
              >
                <span>Consultar por WhatsApp</span>
              </a>
            </div>

          </aside>

          {/* Right Column: Product Showcase Grid */}
          <div className="lg:col-span-9 space-y-5">
            
            {/* Grid Control Toolbar */}
            <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
              
              {/* Active Filter Tags */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-md font-medium">
                    Categoría: {categories.find(c => c.id === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory('all')} className="hover:text-red-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {selectedBrand !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-md font-medium">
                    Marca: {selectedBrand}
                    <button onClick={() => setSelectedBrand('all')} className="hover:text-red-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-xs px-2.5 py-1 rounded-md font-medium">
                    Búsqueda: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-red-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-md font-medium">
                    Solo en stock
                    <button onClick={() => setInStockOnly(false)} className="hover:text-red-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
              </div>

              {/* Sorting Selector */}
              <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                <label className="text-slate-500 font-medium">Ordenar por:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="relevance">Relevancia</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="name">Nombre (A - Z)</option>
                </select>
              </div>

            </div>

            {/* Products Grid */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-lg border border-slate-200 p-12 text-center space-y-3">
                <PackageCheck className="w-12 h-12 text-slate-300 mx-auto stroke-1" />
                <h4 className="text-base font-bold text-slate-900">
                  No se encontraron refacciones con estos filtros
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Intenta restablecer los filtros de búsqueda o seleccionar "Todas las categorías".
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setSearchQuery('');
                    setInStockOnly(false);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold cursor-pointer"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5 sm:gap-4">
                {sortedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

          </div>

        </div>

      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Cart & Order Drawer */}
      <CartDrawer />

      {/* Order Success & Receipt Modal */}
      <OrderSuccessModal />

      {/* Customer & Workshop Portal Modal (Registro, Recibos & Notificaciones) */}
      <CustomerPortalModal />

      {/* Contact & Location Modal */}
      <ContactModal />

      {/* Admin Panel Key Protection Security Modal */}
      <AdminSecurityModal />

      {/* 24/7 AI Smart Sales & Tech Assistant Widget */}
      <AIAssistantWidget />

      {/* Mobile Sticky Bottom Navigation (Optimizado para teléfonos móviles) */}
      <MobileBottomNav />

      {/* Commercial Clean Footer */}
      <Footer />

    </div>
  );
};
