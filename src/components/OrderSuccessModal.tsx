import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  CheckCircle2, 
  X, 
  Printer, 
  MessageCircle, 
  Copy, 
  Check, 
  Send, 
  Mail, 
  Building, 
  Truck, 
  CreditCard,
  ShieldCheck 
} from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { latestCreatedOrder, setLatestCreatedOrder, settings } = useStore();
  const [copied, setCopied] = React.useState(false);

  if (!latestCreatedOrder) return null;

  const order = latestCreatedOrder;

  const handleCopyFolio = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppConfirmation = () => {
    let msg = `Hola *${settings.name}*, acabo de confirmar mi compra:\n`;
    msg += `🧾 *Folio:* ${order.id}\n`;
    msg += `👤 *Cliente:* ${order.customerName}\n`;
    msg += `📧 *Gmail:* ${order.customerEmail || 'No especificado'}\n`;
    msg += `💰 *Total a pagar:* ${settings.currency}${order.total.toLocaleString('es-MX')} ${settings.currencyCode}\n`;
    msg += `💳 *Método de pago:* ${order.paymentMethod.toUpperCase()}\n`;
    msg += `🚚 *Entrega:* ${order.deliveryMethod.replace('_', ' ').toUpperCase()}\n`;
    if (order.customerAddress) msg += `📍 *Dirección:* ${order.customerAddress}\n`;
    msg += `\nEnvío mi comprobante para agilizar la entrega de mis refacciones. ¡Gracias!`;

    const cleanPhone = settings.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleOpenGmail = () => {
    const subject = encodeURIComponent(`COMPROBANTE DE COMPRA: Folio ${order.id} - ${order.customerName}`);
    const itemsList = order.items.map(i => `• ${i.quantity}x ${i.name} [SKU: ${i.sku}] = ${settings.currency}${i.total}`).join('\n');
    const body = encodeURIComponent(
      `COMPROBANTE DE COMPRA - ${settings.name}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `FOLIO OFICIAL: ${order.id}\n` +
      `FECHA: ${order.date}\n` +
      `CLIENTE: ${order.customerName}\n` +
      `TELÉFONO: ${order.customerPhone}\n` +
      `GMAIL REGISTRADO: ${order.customerEmail || 'No proporcionado'}\n` +
      `MÉTODO DE ENTREGA: ${order.deliveryMethod.toUpperCase()}\n` +
      `DIRECCIÓN: ${order.customerAddress || 'Recoger en mostrador'}\n` +
      `FORMA DE PAGO: ${order.paymentMethod.toUpperCase()}\n\n` +
      `REFACCIONES ADQUIRIDAS:\n` +
      `${itemsList}\n\n` +
      `SUBTOTAL: ${settings.currency}${order.subtotal}\n` +
      `ENVÍO: ${order.shippingCost === 0 ? 'GRATIS' : `${settings.currency}${order.shippingCost}`}\n` +
      `TOTAL: ${settings.currency}${order.total} ${settings.currencyCode}\n\n` +
      `DATOS BANCARIOS:\n` +
      `Banco: ${settings.bankDetails.bankName}\n` +
      `Beneficiario: ${settings.bankDetails.beneficiary}\n` +
      `CLABE Interbancaria: ${settings.bankDetails.clabe}\n` +
      (settings.bankDetails.cardNumber ? `Tarjeta: ${settings.bankDetails.cardNumber}\n` : '') +
      (settings.bankDetails.oxxoNumber ? `OXXO: ${settings.bankDetails.oxxoNumber}\n` : '') +
      `\nGARANTÍA:\n${settings.warrantyPolicy}\n\n` +
      `Bodega: ${settings.address}\n` +
      `WhatsApp: https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`
    );

    const targetRecipient = order.customerEmail || settings.adminEmail;
    window.open(`mailto:${targetRecipient}?cc=${settings.adminEmail}&subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-emerald-600 text-white p-5 text-center relative">
          <button
            onClick={() => setLatestCreatedOrder(null)}
            className="absolute top-3 right-3 text-emerald-200 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-white" />
          <h2 className="text-lg font-black tracking-tight">
            ¡Compra Confirmada con Éxito!
          </h2>
          <p className="text-xs text-emerald-100">
            Tu recibo oficial ha sido emitido y archivado en la base de datos de {settings.name}
          </p>
        </div>

        {/* Content Body / Receipt */}
        <div className="p-5 space-y-4 text-xs text-slate-800">
          
          {/* Folio Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Folio Oficial de Orden:</span>
              <span className="font-mono text-base font-bold text-blue-700">{order.id}</span>
            </div>

            <button
              onClick={handleCopyFolio}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar Folio'}</span>
            </button>
          </div>

          {/* Verification Badge */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
            <div className="flex items-center gap-2 font-bold text-blue-950">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Recibo Digital & Base de Datos Gmail</span>
            </div>
            <p className="text-[11px] text-blue-800">
              • Comprobante enviado a: <strong>{order.customerEmail || 'Gmail verificado'}</strong><br />
              • Copia respaldada en el panel del administrador (<strong>{settings.adminEmail}</strong>)<br />
              • Alerta en tiempo real transmitida al bot de Telegram.
            </p>
          </div>

          {/* Summary of items */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-700 text-[11px] uppercase tracking-wider">
              Resumen de Refacciones ({order.items.length} productos)
            </div>
            <div className="p-3 space-y-1.5 max-h-40 overflow-y-auto divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pt-1 text-slate-700">
                  <span className="truncate pr-2 font-medium">
                    {item.quantity}× {item.name}
                  </span>
                  <span className="font-mono font-bold text-slate-900 shrink-0">
                    {settings.currency}{item.total.toLocaleString('es-MX')}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-3 border-t border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-slate-800">{settings.currency}{order.subtotal.toLocaleString('es-MX')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Costo de Envío:</span>
                <span className="font-mono font-bold text-slate-800">
                  {order.shippingCost === 0 ? 'Gratis' : `${settings.currency}${order.shippingCost.toLocaleString('es-MX')}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-1">
                <span>Total a Liquidar:</span>
                <span className="font-mono text-emerald-700 text-base font-bold">
                  {settings.currency}{order.total.toLocaleString('es-MX')} {settings.currencyCode}
                </span>
              </div>
            </div>
          </div>

          {/* Bank instructions if SPEI or OXXO */}
          {(order.paymentMethod === 'transferencia' || order.paymentMethod === 'oxxo') && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 space-y-1 text-xs text-amber-950">
              <strong className="block text-amber-900 font-bold flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                <span>Datos para Pago / Transferencia SPEI:</span>
              </strong>
              <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                <div>Banco: <strong>{settings.bankDetails.bankName}</strong></div>
                <div>Beneficiario: <strong>{settings.bankDetails.beneficiary}</strong></div>
                <div className="col-span-2 font-mono">
                  CLABE SPEI: <strong className="text-slate-900">{settings.bankDetails.clabe}</strong>
                </div>
                {settings.bankDetails.oxxoNumber && (
                  <div className="col-span-2 font-mono">
                    Tarjeta / OXXO: <strong className="text-slate-900">{settings.bankDetails.oxxoNumber}</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleWhatsAppConfirmation}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar Folio por WhatsApp a la Tienda</span>
            </button>

            <button
              onClick={handleOpenGmail}
              className="w-full py-2 px-4 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Abrir Comprobante Oficial en Gmail</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Ticket / Recibo</span>
              </button>

              <button
                onClick={() => setLatestCreatedOrder(null)}
                className="py-2 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
