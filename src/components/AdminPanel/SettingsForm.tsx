import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Save, Check, Building, Phone, DollarSign, Sparkles, MapPin, Share2, Mail, Clock } from 'lucide-react';

export const SettingsForm: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof typeof settings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Notice Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 space-y-1">
          <p className="font-bold text-slate-900">
            Personalización Total de la Empresa y Canales de Contacto
          </p>
          <p>
            Modifica aquí el nombre de tu negocio, los teléfonos donde tus clientes te enviarán pedidos por WhatsApp, teléfonos secundarios, correos, dirección completa, referencias de llegada y redes sociales. Todos los cambios se reflejan en tiempo real en toda la tienda.
          </p>
        </div>
      </div>

      {/* Section 1: Identidad del Negocio */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <Building className="w-4 h-4 text-blue-600" />
          <span>Identidad de la Empresa</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Nombre Comercial de la Empresa / Tienda *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ej. REFACCIONES & PUERTOS C"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-bold"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Se mostrará en la cabecera principal, pie de página y listas de pedidos.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Eslogan o Subtítulo Comercial
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              placeholder="Ej. Importación Directa y Mayoreo para Técnicos"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Hero Headlines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Titular del Banner Principal
            </label>
            <input
              type="text"
              value={formData.heroHeadline}
              onChange={(e) => handleChange('heroHeadline', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Subtítulo del Banner
            </label>
            <input
              type="text"
              value={formData.heroSubheadline}
              onChange={(e) => handleChange('heroSubheadline', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Contacto, Teléfonos & WhatsApp */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <Phone className="w-4 h-4 text-emerald-600" />
          <span>Canales de Contacto, Teléfonos & WhatsApp</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              WhatsApp Principal para Pedidos (con lada internacional) *
            </label>
            <input
              type="text"
              required
              value={formData.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              placeholder="5215587654321"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono focus:bg-white font-bold"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              A este WhatsApp llegarán las cotizaciones completas de tus clientes.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              WhatsApp Secundario / Soporte Técnico
            </label>
            <input
              type="text"
              value={formData.supportWhatsapp || ''}
              onChange={(e) => handleChange('supportWhatsapp', e.target.value)}
              placeholder="5215587654322"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Teléfono Fijo / Mostrador Tienda
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+52 (55) 8765-4321"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Teléfono Secundario / Taller
            </label>
            <input
              type="text"
              value={formData.secondaryPhone || ''}
              onChange={(e) => handleChange('secondaryPhone', e.target.value)}
              placeholder="+52 (55) 9123-4567"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono focus:bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Correo Electrónico de Contacto
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="ventas@tutiendarefacciones.com"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Ubicación & Horarios */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span>Ubicación Física & Horarios de Atención</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Dirección Completa de la Tienda / Local *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Ej. Av. Central Tech #402, Pasaje Electrónico Local 18-B"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Referencias de Llegada (Pasillo, Local, Puntos clave)
            </label>
            <input
              type="text"
              value={formData.locationNotes || ''}
              onChange={(e) => handleChange('locationNotes', e.target.value)}
              placeholder="Ej. Planta baja, frente a la fuente de la plaza, pasillo C"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Horario de Atención en Mostrador
            </label>
            <input
              type="text"
              value={formData.businessHours}
              onChange={(e) => handleChange('businessHours', e.target.value)}
              placeholder="Ej. Lunes a Sábado: 9:00 AM - 7:30 PM | Domingos: 10:00 AM - 4:00 PM"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Redes Sociales */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <Share2 className="w-4 h-4 text-blue-600" />
          <span>Redes Sociales de la Tienda</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Facebook</label>
            <input
              type="text"
              value={formData.facebook || ''}
              onChange={(e) => handleChange('facebook', e.target.value)}
              placeholder="facebook.com/minegocio"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Instagram</label>
            <input
              type="text"
              value={formData.instagram || ''}
              onChange={(e) => handleChange('instagram', e.target.value)}
              placeholder="instagram.com/minegocio"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">TikTok</label>
            <input
              type="text"
              value={formData.tiktok || ''}
              onChange={(e) => handleChange('tiktok', e.target.value)}
              placeholder="tiktok.com/@minegocio"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 5: Precios, Mayoreo y Garantías */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <DollarSign className="w-4 h-4 text-blue-600" />
          <span>Precios, Moneda y Garantías</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Símbolo de Moneda</label>
            <input
              type="text"
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              placeholder="$"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Moneda de la Tienda (USD / MXN)</label>
            <select
              value={formData.currencyCode}
              onChange={(e) => {
                const code = e.target.value;
                handleChange('currencyCode', code);
                if (code === 'USD' || code === 'MXN') handleChange('currency', '$');
                if (code === 'EUR') handleChange('currency', '€');
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 font-bold"
            >
              <option value="USD">USD - Dólar Estadounidense ($)</option>
              <option value="MXN">MXN - Peso Mexicano ($)</option>
              <option value="EUR">EUR - Euro (€)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Mínimo Piezas para Mayoreo</label>
            <input
              type="number"
              min="1"
              value={formData.wholesaleMinQty}
              onChange={(e) => handleChange('wholesaleMinQty', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">Política de Garantía</label>
          <textarea
            rows={2}
            value={formData.warrantyPolicy}
            onChange={(e) => handleChange('warrantyPolicy', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:bg-white"
          />
        </div>

        {/* Announcement Bar text */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Texto de la Barra Superior de Envíos / Promoción
          </label>
          <input
            type="text"
            value={formData.announcement}
            onChange={(e) => handleChange('announcement', e.target.value)}
            placeholder="🚚 Envíos express a toda la república | Precios especiales de mayoreo a técnicos"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:bg-white"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {savedSuccess && (
          <span className="text-xs text-emerald-700 flex items-center gap-1.5 font-bold animate-in fade-in">
            <Check className="w-4 h-4" />
            ¡Configuración guardada exitosamente!
          </span>
        )}
        <button
          type="submit"
          className="px-6 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Cambios</span>
        </button>
      </div>

    </form>
  );
};
