import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Edit2, Trash2, Layers, Save, X } from 'lucide-react';
import { Category } from '../../types';

export const CategoryManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useStore();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Cable');

  const availableIcons = ['Cable', 'Smartphone', 'Monitor', 'Workflow', 'BatteryCharging', 'Wrench', 'Layers'];

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description);
    setIconName(cat.iconName);
    setIsCreating(false);
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setName('');
    setDescription('');
    setIconName('Cable');
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      updateCategory(editingId, {
        name: name.trim(),
        description: description.trim(),
        iconName,
        slug: name.toLowerCase().replace(/\s+/g, '-')
      });
      setEditingId(null);
    } else {
      addCategory({
        name: name.trim(),
        description: description.trim(),
        iconName,
        slug: name.toLowerCase().replace(/\s+/g, '-')
      });
      setIsCreating(false);
    }

    setName('');
    setDescription('');
  };

  const handleDelete = (id: string, catName: string) => {
    const attachedCount = products.filter(p => p.categoryId === id).length;
    if (attachedCount > 0) {
      if (!window.confirm(`Esta categoría tiene ${attachedCount} refacciones asignadas. ¿Seguro que deseas eliminarla?`)) {
        return;
      }
    } else {
      if (!window.confirm(`¿Eliminar la categoría "${catName}"?`)) return;
    }
    deleteCategory(id);
  };

  return (
    <div className="space-y-4">
      
      {/* Top action header */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Categorías del Catálogo
          </h3>
          <p className="text-xs text-slate-500">
            Organiza las familias de refacciones (Puertos C, Celulares, Pantallas, Flex, etc.).
          </p>
        </div>

        {!isCreating && !editingId && (
          <button
            onClick={handleStartCreate}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Categoría</span>
          </button>
        )}
      </div>

      {/* Create / Edit Form */}
      {(isCreating || editingId) && (
        <form onSubmit={handleSave} className="bg-white border-2 border-blue-600 rounded-lg p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              {editingId ? 'Editar Categoría' : 'Registrar Nueva Categoría'}
            </h4>
            <button
              type="button"
              onClick={handleCancel}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Nombre de la Categoría *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Centros de Carga V8 & C"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Icono Representativo</label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              >
                {availableIcons.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Descripción Breve</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalle sobre los componentes de esta sección..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar</span>
            </button>
          </div>
        </form>
      )}

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(cat => {
          const productCount = products.filter(p => p.categoryId === cat.id).length;

          return (
            <div
              key={cat.id}
              className="bg-white border border-slate-200 rounded-lg p-4 flex items-start justify-between gap-4 shadow-xs"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    <Layers className="w-4 h-4" />
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {cat.name}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {cat.description || 'Sin descripción'}
                </p>
                <div className="text-[11px] text-blue-700 font-bold font-mono">
                  {productCount} pieza{productCount !== 1 ? 's' : ''} asignada{productCount !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleStartEdit(cat)}
                  className="p-1.5 rounded bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700"
                  title="Editar"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1.5 rounded bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700"
                  title="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
