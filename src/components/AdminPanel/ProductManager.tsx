import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Plus, Search, Edit2, Trash2, Tag, AlertTriangle, Eye, Package } from 'lucide-react';
import { EditProductModal } from './EditProductModal';

export const ProductManager: React.FC = () => {
  const { products, categories, deleteProduct, updateProduct, settings, setQuickViewProduct } = useStore();
  
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());

    const matchesCat = selectedCat === 'all' || p.categoryId === selectedCat;

    let matchesStock = true;
    if (stockFilter === 'low') matchesStock = p.stock > 0 && p.stock <= 5;
    if (stockFilter === 'out') matchesStock = p.stock === 0;

    return matchesSearch && matchesCat && matchesStock;
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${name}" del catálogo?`)) {
      deleteProduct(id);
    }
  };

  const handleQuickStock = (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    updateProduct(product.id, { stock: newStock, inStock: newStock > 0 });
  };

  return (
    <div className="space-y-4">
      
      {/* Search & Actions Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por SKU, nombre, modelo..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-2 text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">Todas las Categorías</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-2 text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">Todo el Stock</option>
            <option value="low">Stock Bajo (≤ 5)</option>
            <option value="out">Agotados (0)</option>
          </select>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Refacción</span>
          </button>
        </div>

      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase font-bold text-[11px]">
                <th className="py-3 px-4">Refacción / Dispositivo</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Marca</th>
                <th className="py-3 px-4">Precio Menudeo</th>
                <th className="py-3 px-4 text-blue-700">Precio Mayoreo</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No hay productos que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => {
                  const category = categories.find(c => c.id === p.categoryId);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
                            {p.image ? (
                              <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                            ) : (
                              <Package className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <span className="font-mono text-[11px] font-bold text-slate-700 block">{p.sku}</span>
                            <span className="font-bold text-slate-900 truncate block">{p.name}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {category?.name || 'General'}
                      </td>

                      {/* Brand */}
                      <td className="py-3 px-4 text-slate-700 font-semibold">
                        {p.brand}
                      </td>

                      {/* Price Retail */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 tabular-nums">
                        {settings.currency}{p.priceRetail.toLocaleString('es-MX')}
                      </td>

                      {/* Price Wholesale */}
                      <td className="py-3 px-4 font-mono font-bold text-blue-700 tabular-nums">
                        {settings.currency}{p.priceWholesale.toLocaleString('es-MX')}
                      </td>

                      {/* Stock Adjuster */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleQuickStock(p, -1)}
                            className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-bold"
                          >
                            -
                          </button>
                          <span className={`font-mono font-bold min-w-6 text-center ${
                            p.stock === 0 ? 'text-rose-600' : p.stock <= 5 ? 'text-amber-600' : 'text-slate-800'
                          }`}>
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleQuickStock(p, +1)}
                            className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setQuickViewProduct(p)}
                            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                            title="Vista previa cliente"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold"
                            title="Editar pieza"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold"
                            title="Eliminar pieza"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>Mostrando {filteredProducts.length} de {products.length} refacciones</span>
          <span className="font-mono font-bold text-slate-900">
            Total Valor Inventario: {settings.currency}
            {products.reduce((acc, p) => acc + (p.priceRetail * p.stock), 0).toLocaleString('es-MX')}
          </span>
        </div>
      </div>

      {/* Edit Product Modal */}
      {modalOpen && (
        <EditProductModal
          isOpen={modalOpen}
          product={editingProduct}
          onClose={() => setModalOpen(false)}
        />
      )}

    </div>
  );
};
