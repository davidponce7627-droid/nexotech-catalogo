import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Users, 
  Search, 
  Plus, 
  Download, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Briefcase,
  Calendar,
  DollarSign
} from 'lucide-react';
import { CustomerContact } from '../../types';

export const ContactsCRM: React.FC = () => {
  const { contacts, addContact, updateContact, deleteContact, exportContactsCSV, settings } = useStore();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | CustomerContact['category']>('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<CustomerContact | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<CustomerContact['category']>('taller');
  const [notes, setNotes] = useState('');

  const filteredContacts = contacts.filter(c => {
    const searchLower = search.toLowerCase().trim();
    const matchesSearch = !searchLower || (
      c.name.toLowerCase().includes(searchLower) ||
      (c.businessName && c.businessName.toLowerCase().includes(searchLower)) ||
      c.phone.includes(searchLower) ||
      (c.email && c.email.toLowerCase().includes(searchLower)) ||
      (c.city && c.city.toLowerCase().includes(searchLower))
    );

    const matchesCategory = filterCategory === 'all' || c.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setEditingContact(null);
    setName('');
    setBusinessName('');
    setPhone('');
    setEmail('');
    setCity('');
    setAddress('');
    setCategory('taller');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: CustomerContact) => {
    setEditingContact(c);
    setName(c.name);
    setBusinessName(c.businessName || '');
    setPhone(c.phone);
    setEmail(c.email || '');
    setCity(c.city || '');
    setAddress(c.address || '');
    setCategory(c.category);
    setNotes(c.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    if (editingContact) {
      updateContact(editingContact.id, {
        name: name.trim(),
        businessName: businessName.trim(),
        phone: phone.trim(),
        whatsapp: phone.replace(/\D/g, ''),
        email: email.trim(),
        city: city.trim(),
        address: address.trim(),
        category,
        notes: notes.trim()
      });
    } else {
      addContact({
        name: name.trim(),
        businessName: businessName.trim(),
        phone: phone.trim(),
        whatsapp: phone.replace(/\D/g, ''),
        email: email.trim(),
        city: city.trim(),
        address: address.trim(),
        category,
        notes: notes.trim(),
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: 'Sin órdenes previas'
      });
    }

    setIsModalOpen(false);
  };

  const handleWhatsAppChat = (c: CustomerContact) => {
    const cleanPhone = (c.whatsapp || c.phone).replace(/\D/g, '');
    const text = encodeURIComponent(
      `Hola ${c.name}${c.businessName ? ` de ${c.businessName}` : ''}, te saludamos de *${settings.name}*. ¿Requieres algún presupuesto o resurtido de refacciones hoy?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const totalSpentAll = contacts.reduce((acc, c) => acc + c.totalSpent, 0);

  return (
    <div className="space-y-5">
      
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Total Clientes / CRM</span>
          <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">{contacts.length}</span>
          <span className="text-[11px] text-slate-400 block">Contactos guardados</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Talleres Registrados</span>
          <span className="text-xl font-bold font-mono text-blue-700 tabular-nums">
            {contacts.filter(c => c.category === 'taller').length}
          </span>
          <span className="text-[11px] text-slate-400 block">Servicios técnicos</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Distribuidores Mayoristas</span>
          <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
            {contacts.filter(c => c.category === 'mayorista').length}
          </span>
          <span className="text-[11px] text-slate-400 block">Compras por volumen</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Facturación Acumulada</span>
          <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {settings.currency}{totalSpentAll.toLocaleString('es-MX')}
          </span>
          <span className="text-[11px] text-slate-400 block">Historial de clientes</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, taller, teléfono, email..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>

        {/* Filters and Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">Todas las categorías</option>
            <option value="taller">Talleres de Celulares</option>
            <option value="tecnico">Técnicos Independientes</option>
            <option value="mayorista">Mayoristas</option>
            <option value="publico">Público General</option>
          </select>

          <button
            onClick={exportContactsCSV}
            className="px-3.5 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
            title="Exportar a archivo Excel / CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Contacto</span>
          </button>
        </div>

      </div>

      {/* Contacts List Grid */}
      {filteredContacts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400 space-y-2 shadow-xs">
          <Users className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
          <p className="text-sm font-bold text-slate-700">No se encontraron clientes con esos datos</p>
          <p className="text-xs text-slate-500">
            Los clientes que realicen pedidos en la tienda web se registrarán automáticamente aquí.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map(c => (
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-colors"
            >
              <div className="space-y-2">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {c.name}
                    </h4>
                    {c.businessName && (
                      <span className="text-xs font-semibold text-blue-700 flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-blue-600" />
                        <span>{c.businessName}</span>
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border shrink-0 ${
                    c.category === 'taller'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : c.category === 'mayorista'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {c.category}
                  </span>
                </div>

                {/* Contact Data */}
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono font-bold text-slate-800">{c.phone}</span>
                  </div>

                  {c.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate text-slate-700">{c.email}</span>
                    </div>
                  )}

                  {(c.address || c.city) && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] text-slate-600">
                        {[c.address, c.city].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Metrics Box */}
                <div className="bg-slate-50 border border-slate-200 rounded p-2 text-xs flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Órdenes:</span>
                    <span className="font-bold font-mono text-slate-800">{c.totalOrders}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Total Comprado:</span>
                    <span className="font-bold font-mono text-emerald-700">
                      {settings.currency}{c.totalSpent.toLocaleString('es-MX')}
                    </span>
                  </div>
                </div>

                {c.notes && (
                  <p className="text-[11px] text-slate-500 italic bg-amber-50/60 p-1.5 rounded border border-amber-100">
                    Nota: {c.notes}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleWhatsAppChat(c)}
                  className="flex-1 py-1.5 px-2.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 rounded bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700"
                    title="Editar contacto"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar al contacto "${c.name}" de la agenda?`)) {
                        deleteContact(c.id);
                      }
                    }}
                    className="p-1.5 rounded bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700"
                    title="Eliminar contacto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs overflow-y-auto">
          <div 
            className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingContact ? 'Editar Contacto / Cliente' : 'Registrar Nuevo Contacto'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Taller / Negocio</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ej. Taller CelFix Juárez"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="55 1234 5678"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correo Electrónico (Gmail)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cliente@gmail.com"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Cliente</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:outline-none"
                  >
                    <option value="taller">Taller de Celulares</option>
                    <option value="tecnico">Técnico Independiente</option>
                    <option value="mayorista">Distribuidor Mayorista</option>
                    <option value="publico">Público General</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ciudad / Estado</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ej. CDMX, Monterrey, Puebla..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dirección de Entrega</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle, número, colonia..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notas Internas</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Comentarios sobre el cliente, descuentos acordados o refacciones habituales..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 rounded bg-slate-100 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  {editingContact ? 'Guardar Cambios' : 'Registrar Contacto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
