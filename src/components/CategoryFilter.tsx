import React from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, Cable, Smartphone, Monitor, Workflow, BatteryCharging, Wrench, Layers } from 'lucide-react';

export const CategoryFilter: React.FC = () => {
  const { 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    selectedBrand,
    setSelectedBrand,
    products,
    isWholesalePricing,
    setIsWholesalePricing,
    settings
  } = useStore();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cable': return <Cable className="w-3.5 h-3.5" />;
      case 'Smartphone': return <Smartphone className="w-3.5 h-3.5" />;
      case 'Monitor': return <Monitor className="w-3.5 h-3.5" />;
      case 'Workflow': return <Workflow className="w-3.5 h-3.5" />;
      case 'BatteryCharging': return <BatteryCharging className="w-3.5 h-3.5" />;
      case 'Wrench': return <Wrench className="w-3.5 h-3.5" />;
      default: return <Layers className="w-3.5 h-3.5" />;
    }
  };

  // Distinct brands available in current products
  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));

  return (
    <div id="catalog-grid" className="scroll-mt-24 space-y-4">
      {/* Top Search & Brand bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search input with SKU support */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por refacción, modelo (ej. A12, iPhone 13), o SKU..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Brand Dropdown & Wholesale Switch */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Brand select */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 hidden sm:inline">Marca:</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Todas las marcas</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* Wholesale Mode Toggle in Filter */}
          <button
            onClick={() => setIsWholesalePricing(!isWholesalePricing)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isWholesalePricing
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Precios de Mayoreo</span>
            <span className="text-[10px] font-mono opacity-80">(+5 pzs)</span>
          </button>
        </div>

      </div>

      {/* Category Segmented Tabs (Functional interactive button controls) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800/80'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Todos los Productos ({products.length})</span>
        </button>

        {categories.map(cat => {
          const count = products.filter(p => p.categoryId === cat.id).length;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800/80'
              }`}
            >
              {getCategoryIcon(cat.iconName)}
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                isSelected ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
