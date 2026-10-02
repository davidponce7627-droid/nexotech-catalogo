import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageSquare, Phone, Calendar, Trash2, CheckCircle2, MessageCircle, Wrench } from 'lucide-react';

export const InquiriesList: React.FC = () => {
  const { inquiries, deleteInquiry, updateInquiryStatus, settings } = useStore();

  const handleWhatsAppContact = (phone: string, name: string, part: string) => {
    const text = encodeURIComponent(
      `Hola ${name}, te contactamos de *${settings.name}* sobre tu consulta por la pieza "${part}". ¿Aún requieres la cotización?`
    );
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4">
      
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Mensajes de Contacto & Solicitudes de Refacciones ({inquiries.length})
          </h3>
          <p className="text-xs text-slate-500">
            Dudas y solicitudes de piezas enviadas por clientes y técnicos desde el formulario de contacto web.
          </p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400 space-y-2 shadow-xs">
          <MessageSquare className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
          <p className="text-sm font-bold text-slate-700">No hay mensajes de contacto pendientes</p>
          <p className="text-xs text-slate-500">
            Cuando un cliente complete el formulario de contacto, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inquiries.map(inq => (
            <div
              key={inq.id}
              className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{inq.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      inq.status === 'nuevo'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    }`}>
                      {inq.status === 'nuevo' ? 'Nuevo' : 'Atendido'}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{inq.date}</span>
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600 font-mono">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>{inq.phone}</span>
                  </div>
                  {inq.email && (
                    <span className="text-slate-500 truncate">{inq.email}</span>
                  )}
                </div>

                {inq.partNeeded && (
                  <div className="p-2 bg-blue-50 border border-blue-100 rounded text-xs text-blue-900">
                    <strong className="block text-[11px] text-blue-700 uppercase">Pieza solicitada:</strong>
                    <span>{inq.partNeeded}</span>
                  </div>
                )}

                {inq.message && (
                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200">
                    "{inq.message}"
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateInquiryStatus(inq.id, inq.status === 'nuevo' ? 'atendido' : 'nuevo')}
                    className="text-xs font-semibold text-slate-600 hover:text-blue-600"
                  >
                    Marcar como {inq.status === 'nuevo' ? 'Atendido' : 'Nuevo'}
                  </button>
                  <button
                    onClick={() => deleteInquiry(inq.id)}
                    className="text-xs text-slate-400 hover:text-rose-600"
                  >
                    Eliminar
                  </button>
                </div>

                <button
                  onClick={() => handleWhatsAppContact(inq.phone, inq.name, inq.partNeeded)}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Responder WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
