import React from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, MapPin, Clock, MessageCircle, ShieldCheck, Wrench, ChevronRight, Settings } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, requestAdminAccess, setSelectedCategory, setIsContactModalOpen } = useStore();

  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Store Brand & Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                {settings.name}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {settings.tagline}
            </p>
            <div className="text-[11px] text-blue-400 font-mono">
              Moneda: {settings.currencyCode} ({settings.currency})
            </div>
          </div>

          {/* Col 2: Secciones Rápidas */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Categorías de Refacciones
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setSelectedCategory('cat-puertos')}
                  className="hover:text-white transition-colors"
                >
                  Puertos Type-C & Conectores SMD
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('cat-celulares')}
                  className="hover:text-white transition-colors"
                >
                  Celulares & Equipos Libres
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('cat-pantallas')}
                  className="hover:text-white transition-colors"
                >
                  Pantallas & Displays OLED / Incell
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('cat-herramientas')}
                  className="hover:text-white transition-colors"
                >
                  Herramientas & Insumos para Taller
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Horarios & Contacto */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Atención y Ubicación
            </h4>
            <div className="space-y-2 text-slate-400">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="flex items-start gap-2 text-left hover:text-white transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </button>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{settings.businessHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  WhatsApp de Ventas
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Acceso al Administrador */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Gestión Interna</span>
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Panel protegido con verificación por Gmail y llaves de acceso para administración de inventario y pedidos.
            </p>
            <button
              onClick={() => {
                requestAdminAccess();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-blue-400" />
              <span>Ajustes & Panel</span>
            </button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {settings.name}. Catálogo mayorista de refacciones.</p>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{settings.warrantyPolicy}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
