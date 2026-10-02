import React from 'react';
import { useStore } from '../context/StoreContext';
import { Truck, ShieldCheck, Tag, MessageCircle, ArrowRight } from 'lucide-react';
import heroImg from '../assets/images/hero_tech_repair_hardware_1790473432850.jpg';

export const Hero: React.FC = () => {
  const { settings, setSelectedCategory } = useStore();

  const handleGoToCategory = (catId = 'all') => {
    setSelectedCategory(catId);
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(`Hola ${settings.name}, me gustaría consultar existencias y precios de refacciones en su catálogo.`);
    window.open(`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Commercial Banner Card */}
        <div className="rounded-xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white shadow-sm border border-slate-700/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Left Column: Commercial Announcement */}
            <div className="p-6 sm:p-8 lg:p-10 lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5" />
                <span>Precios de Mayoreo Directo de Fábrica</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {settings.heroHeadline || "Puertos Tipo-C, Celulares y Refacciones para Servicio Técnico"}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                {settings.heroSubheadline || settings.tagline}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleGoToCategory('cat-puertos')}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Ver Puertos de Carga</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={openWhatsApp}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pedir por WhatsApp</span>
                </button>
              </div>

              {/* Real E-Commerce Commercial Trust Points */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-700/60 text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-slate-300 text-[11px] sm:text-xs">Envíos a todo el país</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300 text-[11px] sm:text-xs">Garantía por escrito</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-slate-300 text-[11px] sm:text-xs">Mayoreo desde {settings.wholesaleMinQty} pzs</span>
                </div>
              </div>

            </div>

            {/* Right Column: Real Warehouse / Parts Photo */}
            <div className="hidden lg:block lg:col-span-5 h-full min-h-[300px] relative">
              <img
                src={heroImg}
                alt="Refacciones y componentes"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/30 to-transparent" />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
