import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  MapPin, 
  Phone, 
  Clock, 
  MessageCircle, 
  Mail, 
  Send, 
  Check, 
  ExternalLink,
  Share2
} from 'lucide-react';

export const ContactModal: React.FC = () => {
  const { isContactModalOpen, setIsContactModalOpen, settings, submitInquiry } = useStore();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [partNeeded, setPartNeeded] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isContactModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    submitInquiry(name, phone, partNeeded, message, email);
    setSubmitted(true);

    // Option to also send via WhatsApp
    const waText = encodeURIComponent(
      `Hola ${settings.name}, te contacto desde la página web.\n👤 Mi nombre: ${name}\n📞 Teléfono: ${phone}\n🔧 Pieza que busco: ${partNeeded || 'Consulta general'}\n💬 Mensaje: ${message || 'Solicito cotización y disponibilidad.'}`
    );
    const waUrl = `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${waText}`;

    setTimeout(() => {
      window.open(waUrl, '_blank');
      setSubmitted(false);
      setIsContactModalOpen(false);
      setName('');
      setPhone('');
      setEmail('');
      setPartNeeded('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Contacto, Ubicación & Pedidos Especiales
            </h2>
            <p className="text-xs text-slate-500">
              {settings.name} · Atención directa a talleres y técnicos
            </p>
          </div>
          <button
            onClick={() => setIsContactModalOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Direct Info & Social */}
          <div className="bg-slate-50 p-5 space-y-4 border-b md:border-b-0 md:border-r border-slate-200 text-xs">
            
            {/* Ubicación */}
            <div className="space-y-1">
              <span className="font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Dirección del Local</span>
              </span>
              <p className="text-slate-700 font-medium">{settings.address}</p>
              {settings.locationNotes && (
                <p className="text-slate-500 text-[11px] italic">
                  Referencia: {settings.locationNotes}
                </p>
              )}
            </div>

            {/* Teléfonos & WhatsApp */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Teléfonos de Atención</span>
              </span>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Principal:</span>
                  <a href={`tel:${settings.phone}`} className="font-bold text-slate-900 font-mono hover:text-blue-600">
                    {settings.phone}
                  </a>
                </div>

                {settings.secondaryPhone && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Taller / Secundario:</span>
                    <a href={`tel:${settings.secondaryPhone}`} className="font-bold text-slate-900 font-mono hover:text-blue-600">
                      {settings.secondaryPhone}
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Ventas:</span>
                  </span>
                  <a 
                    href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-emerald-700 font-mono hover:underline"
                  >
                    {settings.whatsapp}
                  </a>
                </div>

                {settings.supportWhatsapp && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">WhatsApp Soporte:</span>
                    <a 
                      href={`https://wa.me/${settings.supportWhatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-slate-800 font-mono hover:underline"
                    >
                      {settings.supportWhatsapp}
                    </a>
                  </div>
                )}

                {settings.email && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Email:</span>
                    </span>
                    <a href={`mailto:${settings.email}`} className="text-blue-600 hover:underline">
                      {settings.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Horarios */}
            <div className="space-y-1 pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Horarios de Atención</span>
              </span>
              <p className="text-slate-700">{settings.businessHours}</p>
            </div>

            {/* Redes Sociales */}
            {(settings.facebook || settings.instagram || settings.tiktok || settings.telegram) && (
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Redes Sociales</span>
                </span>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {settings.facebook && (
                    <span className="text-blue-600 font-medium">Facebook: {settings.facebook}</span>
                  )}
                  {settings.instagram && (
                    <span className="text-pink-600 font-medium">Instagram: {settings.instagram}</span>
                  )}
                  {settings.tiktok && (
                    <span className="text-slate-800 font-medium">TikTok: {settings.tiktok}</span>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Inquiry Form */}
          <div className="p-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Envíanos un Mensaje Directo
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              ¿Requieres cotización de una pantalla, flex o lote de puertos C? Completa este formulario y te responderemos por WhatsApp de inmediato.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre o Nombre de tu Taller *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Taller TechFix / Carlos López"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Número de Teléfono / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="55 1234 5678"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Refacción o Modelo que Buscas
                </label>
                <input
                  type="text"
                  value={partNeeded}
                  onChange={(e) => setPartNeeded(e.target.value)}
                  placeholder="Ej. Centro de carga Galaxy A12 o Pantalla iPhone 11"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mensaje / Cantidad de Piezas
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tu consulta sobre existencias, envíos o precios por lote..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                {submitted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Enviando a WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Consulta a WhatsApp</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
