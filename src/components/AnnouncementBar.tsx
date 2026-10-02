import React from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, MapPin, Clock, MessageCircle, Truck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Announcement / Promo message */}
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="font-medium text-slate-200 text-xs">
            {settings.announcement || "Venta de mayoreo y menudeo para técnicos y talleres mecánicos de celulares"}
          </span>
        </div>

        {/* Right: Real store contact details */}
        <div className="flex items-center gap-5 text-slate-400 text-xs shrink-0 hidden sm:flex">
          {settings.businessHours && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{settings.businessHours}</span>
            </div>
          )}
          {settings.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{settings.phone}</span>
            </div>
          )}
          {settings.whatsapp && (
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Ventas</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
