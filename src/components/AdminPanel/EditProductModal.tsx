import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { X, Plus, Trash2, Save } from 'lucide-react';

import usbcImg from '../../assets/images/product_usbc_charging_ports_1790473446596.jpg';
import screensImg from '../../assets/images/product_phone_oled_screens_1790473463569.jpg';
import phonesImg from '../../assets/images/product_smartphone_showcase_1790473474681.jpg';
import toolkitImg from '../../assets/images/product_repair_toolkit_1790473485390.jpg';

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({ product, isOpen, onClose }) => {
  const { categories, addProduct, updateProduct, settings } = useStore();

  const isEditing = Boolean(product);

  const [sku, setSku] = useState(product?.sku || `REF-${Math.floor(1000 + Math.random() * 9000)}`);
  const [name, setName] = useState(product?.name || '');
  const [categoryId, setCategoryId] = useState(product?.categoryId || categories[0]?.id || 'cat-puertos');
  const [brand, setBrand] = useState(product?.brand || 'Universal');
  const [priceRetail, setPriceRetail] = useState(product?.priceRetail || 100);
  const [priceWholesale, setPriceWholesale] = useState(product?.priceWholesale || 75);
  const [stock, setStock] = useState(product?.stock || 10);
  const [badge, setBadge] = useState(product?.badge || '');
  const [image, setImage] = useState(product?.image || usbcImg);
  const [description, setDescription] = useState(product?.description || '');
  const [compatibility, setCompatibility] = useState<string[]>(product?.compatibility || []);
  const [newCompat, setNewCompat] = useState('');
  
  const [specs, setSpecs] = useState<{ key: string; val: string }[]>(
    product?.specs
      ? Object.entries(product.specs).map(([key, val]) => ({ key, val }))
      : [{ key: 'Tipo', val: 'Repuesto Técnico' }]
  );

  if (!isOpen) return null;

  const handleAddCompatibility = () => {
    if (newCompat.trim() && !compatibility.includes(newCompat.trim())) {
      setCompatibility([...compatibility, newCompat.trim()]);
      setNewCompat('');
    }
  };

  const handleRemoveCompatibility = (idx: number) => {
    setCompatibility(compatibility.filter((_, i) => i !== idx));
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', val: '' }]);
  };

  const handleRemoveSpec = (idx: number) => {
    setSpecs(specs.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (index: number, field: 'key' | 'val', value: string) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const specsMap: Record<string, string> = {};
    specs.forEach(s => {
      if (s.key.trim()) {
        specsMap[s.key.trim()] = s.val.trim();
      }
    });

    const productPayload = {
      sku: sku.trim(),
      name: name.trim(),
      categoryId,
      brand: brand.trim(),
      priceRetail: Number(priceRetail),
      priceWholesale: Number(priceWholesale),
      stock: Number(stock),
      badge: badge.trim(),
      image,
      description: description.trim(),
      compatibility,
      specs: specsMap,
      featured: product?.featured || false,
      inStock: Number(stock) > 0
    };

    if (isEditing && product) {
      updateProduct(product.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-sm font-bold text-slate-900">
            {isEditing ? 'Editar Refacción / Producto' : 'Registrar Nueva Refacción'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">SKU / Clave *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="USBC-01"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1">Nombre de la Pieza o Dispositivo *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Conector USB-C Hembra 16 Pines SMD"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Categoría *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Marca / Compatibilidad Principal *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Samsung, Apple, Xiaomi, Motorola, Universal..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Pricing & Stock Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Precio Menudeo ({settings.currency}) *</label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={priceRetail}
                onChange={(e) => setPriceRetail(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-700 mb-1">Precio Mayoreo ({settings.currency}) *</label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={priceWholesale}
                onChange={(e) => setPriceWholesale(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-blue-500 rounded-md text-xs text-blue-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Stock Físico *</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Badge / Distintivo</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Original OEM, Grado A+..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">Imagen del Producto</label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setImage(usbcImg)}
                className={`px-3 py-1 rounded-md text-xs border cursor-pointer ${
                  image === usbcImg ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-300 bg-white text-slate-700'
                }`}
              >
                Puertos USB-C & Flex
              </button>
              <button
                type="button"
                onClick={() => setImage(screensImg)}
                className={`px-3 py-1 rounded-md text-xs border cursor-pointer ${
                  image === screensImg ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-300 bg-white text-slate-700'
                }`}
              >
                Displays & Pantallas
              </button>
              <button
                type="button"
                onClick={() => setImage(phonesImg)}
                className={`px-3 py-1 rounded-md text-xs border cursor-pointer ${
                  image === phonesImg ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-300 bg-white text-slate-700'
                }`}
              >
                Smartphones
              </button>
              <button
                type="button"
                onClick={() => setImage(toolkitImg)}
                className={`px-3 py-1 rounded-md text-xs border cursor-pointer ${
                  image === toolkitImg ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-300 bg-white text-slate-700'
                }`}
              >
                Herramientas
              </button>
            </div>
            
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="O escribe una URL de imagen..."
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Descripción de la Pieza</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles sobre materiales, calidad, recomendaciones..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          {/* Compatibility Chips */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">Modelos Compatibles</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCompat}
                onChange={(e) => setNewCompat(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCompatibility(); } }}
                placeholder="Escribe modelo (ej. Galaxy A125F) y presiona Agregar"
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddCompatibility}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-md cursor-pointer"
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {compatibility.map((m, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-xs text-slate-800"
                >
                  {m}
                  <button
                    type="button"
                    onClick={() => handleRemoveCompatibility(idx)}
                    className="hover:text-red-600 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">Ficha Técnica (Parámetros)</label>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Fila</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {specs.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Parámetro (ej. Pines)"
                    value={item.key}
                    onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                    className="w-1/3 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Valor (ej. 16 Pines SMD)"
                    value={item.val}
                    onChange={(e) => handleSpecChange(idx, 'val', e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Guardar Cambios' : 'Crear Refacción'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
