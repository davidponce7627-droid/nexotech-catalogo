import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  MessageCircle, 
  Trash2, 
  User, 
  Phone, 
  Calendar, 
  ShoppingCart, 
  Send, 
  Printer, 
  Mail, 
  MapPin, 
  CreditCard, 
  Truck, 
  Check,
  Sparkles,
  AlertCircle 
} from 'lucide-react';
import { Order } from '../../types';

export const OrdersList: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder, settings, sendTelegramNotification, sendSampleOrderToTelegram } = useStore();
  const [filterStatus, setFilterStatus] = useState<'all' | Order['status']>('all');
  const [telegramSentId, setTelegramSentId] = useState<string | null>(null);
  const [sampleOrderResult, setSampleOrderResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSendingSample, setIsSendingSample] = useState(false);

  const handleTestOrderDispatch = async () => {
    setIsSendingSample(true);
    setSampleOrderResult(null);
    const res = await sendSampleOrderToTelegram();
    setSampleOrderResult(res);
    setIsSendingSample(false);
    setTimeout(() => setSampleOrderResult(null), 6000);
  };

  const filteredOrders = orders.filter(o => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pendiente':
        return (
          <span className="text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded text-[11px] font-bold">
            Pendiente
          </span>
        );
      case 'confirmado':
        return (
          <span className="text-blue-800 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded text-[11px] font-bold">
            Confirmado
          </span>
        );
      case 'en_camino':
        return (
          <span className="text-purple-800 bg-purple-100 border border-purple-300 px-2 py-0.5 rounded text-[11px] font-bold">
            En camino
          </span>
        );
      case 'entregado':
        return (
          <span className="text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded text-[11px] font-bold">
            Entregado
          </span>
        );
      case 'cancelado':
        return (
          <span className="text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded text-[11px] font-bold">
            Cancelado
          </span>
        );
    }
  };

  const handleWhatsAppContact = (order: Order) => {
    const text = encodeURIComponent(
      `Hola ${order.customerName}, te escribimos de *${settings.name}* en relación a tu pedido *${order.id}*. Confirmamos que tus refacciones están listas. ¿Deseas coordinar la entrega o envío?`
    );
    const phoneClean = order.customerPhone.replace(/\D/g, '');
    window.open(`https://wa.me/${phoneClean}?text=${text}`, '_blank');
  };

  const handleSendToTelegram = async (order: Order) => {
    const success = await sendTelegramNotification(order);
    if (success) {
      setTelegramSentId(order.id);
      setTimeout(() => setTelegramSentId(null), 2500);
    } else {
      alert("No se pudo enviar a Telegram. Revisa que el Bot Token y Chat ID estén configurados en la pestaña 'Bot Telegram & Gmail'.");
    }
  };

  const handleOpenEmail = (order: Order) => {
    const subject = encodeURIComponent(`NUEVO PEDIDO ${order.id} - ${order.customerName} - ${settings.currency}${order.total}`);
    const itemsList = order.items.map(i => `${i.quantity}x ${i.name} = ${settings.currency}${i.total}`).join('%0D%0A');
    const body = encodeURIComponent(
      `Folio: ${order.id}\nCliente: ${order.customerName}\nTeléfono: ${order.customerPhone}\nDirección: ${order.customerAddress || 'Recoger en tienda'}\nTotal: ${settings.currency}${order.total}\n\nRefacciones:\n${itemsList}`
    );
    window.open(`mailto:${settings.adminEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="space-y-4">
      
      {/* Top Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Órdenes & Pedidos Recibidos ({orders.length})
          </h3>
          <p className="text-xs text-slate-500">
            Todas las órdenes registradas en la web y enviadas al Bot de Telegram y Gmail del administrador.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={isSendingSample}
            onClick={handleTestOrderDispatch}
            className="px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            title="Enviar orden de prueba completa a Telegram"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{isSendingSample ? 'Enviando a Bot...' : 'Enviar Orden de Prueba al Bot'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <label className="text-xs text-slate-600 font-bold">Estado:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none"
            >
              <option value="all">Todas ({orders.length})</option>
              <option value="pendiente">Pendientes</option>
              <option value="confirmado">Confirmados</option>
              <option value="en_camino">En camino</option>
              <option value="entregado">Entregados</option>
              <option value="cancelado">Cancelados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Test Sample Order Banner */}
      {sampleOrderResult && (
        <div className={`p-3 rounded-lg text-xs flex items-center gap-2 border animate-in fade-in ${
          sampleOrderResult.success
            ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
            : 'bg-rose-50 text-rose-950 border-rose-300'
        }`}>
          {sampleOrderResult.success ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{sampleOrderResult.message}</span>
        </div>
      )}

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400 space-y-2 shadow-xs">
          <ShoppingCart className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
          <p className="text-sm font-bold text-slate-700">No hay órdenes registradas con este filtro</p>
          <p className="text-xs text-slate-500">
            Cuando un cliente complete su pedido en la tienda, aparecerá aquí automáticamente.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 space-y-3.5 shadow-xs"
            >
              {/* Top Row: Folio, Status and Status Changer */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {order.id}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{order.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                    className="bg-slate-50 border border-slate-300 rounded text-xs px-2 py-1 text-slate-700 font-medium focus:outline-none"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="en_camino">En camino</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>

                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar la orden ${order.id}?`)) {
                        deleteOrder(order.id);
                      }
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Eliminar orden"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Customer and Delivery Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-bold text-slate-900">{order.customerName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-mono font-bold">{order.customerPhone}</span>
                </div>

                {order.customerEmail && (
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{order.customerEmail}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Entrega: <strong className="capitalize">{order.deliveryMethod.replace('_', ' ')}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Pago: <strong className="uppercase">{order.paymentMethod}</strong></span>
                </div>

                {order.customerAddress && (
                  <div className="flex items-start gap-2 col-span-1 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>Dirección: <strong>{order.customerAddress}</strong></span>
                  </div>
                )}

                {order.notes && (
                  <div className="col-span-full text-slate-500 italic text-[11px] pt-1">
                    Nota del cliente: "{order.notes}"
                  </div>
                )}
              </div>

              {/* Items Breakdown */}
              <div className="border border-slate-200 rounded-md overflow-hidden text-xs">
                <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-700 text-[11px]">
                  Refacciones Solicitadas:
                </div>
                <div className="p-3 space-y-1 divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center pt-1 text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-500 text-[11px] font-bold">{item.sku}</span>
                        <span className="font-medium text-slate-900">{item.name}</span>
                        <span className="text-slate-500">× {item.quantity}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        {settings.currency}{item.total.toLocaleString('es-MX')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 p-2.5 border-t border-slate-200 flex justify-between items-center text-xs font-bold">
                  <div className="text-slate-500">
                    Subtotal: {settings.currency}{order.subtotal?.toLocaleString('es-MX')} · Envío: {order.shippingCost === 0 ? 'Gratis' : `${settings.currency}${order.shippingCost?.toLocaleString('es-MX')}`}
                  </div>
                  <div className="text-sm font-black text-blue-700 font-mono">
                    Total: {settings.currency}{order.total.toLocaleString('es-MX')} {settings.currencyCode}
                  </div>
                </div>
              </div>

              {/* Action Buttons for Dispatching */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-2 text-xs">
                <button
                  onClick={() => handleSendToTelegram(order)}
                  className="px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold flex items-center gap-1.5 border border-blue-200 cursor-pointer"
                  title="Reenviar orden al bot de Telegram"
                >
                  {telegramSentId === order.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">¡Enviado a Telegram!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Reenviar a Telegram</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleOpenEmail(order)}
                  className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 border border-slate-300 cursor-pointer"
                  title="Abrir en Gmail"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Notificar a Gmail</span>
                </button>

                <button
                  onClick={() => handleWhatsAppContact(order)}
                  className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat WhatsApp con Cliente</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
