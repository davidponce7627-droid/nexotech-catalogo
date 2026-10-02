import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Trash2, 
  ShoppingCart, 
  Mail, 
  Check, 
  Truck, 
  CreditCard, 
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Phone,
  User,
  MapPin
} from 'lucide-react';
import { Order } from '../types';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    cartSubtotal,
    settings,
    createOrder,
    isWholesalePricing,
    currentCustomer 
  } = useStore();

  const [customerName, setCustomerName] = useState(currentCustomer?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentCustomer?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentCustomer?.email || '');
  const [customerAddress, setCustomerAddress] = useState(currentCustomer?.address || '');
  const [deliveryMethod, setDeliveryMethod] = useState<Order['deliveryMethod']>('recoger_tienda');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('transferencia');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync with registered customer profile
  useEffect(() => {
    if (currentCustomer && isCartOpen) {
      if (!customerName && currentCustomer.name) setCustomerName(currentCustomer.name);
      if (!customerPhone && currentCustomer.phone) setCustomerPhone(currentCustomer.phone);
      if (!customerEmail && currentCustomer.email) setCustomerEmail(currentCustomer.email);
      if (!customerAddress && currentCustomer.address) setCustomerAddress(currentCustomer.address);
    }
  }, [currentCustomer, isCartOpen]);

  if (!isCartOpen) return null;

  const currentShippingCost = deliveryMethod === 'recoger_tienda' || cartSubtotal >= settings.shippingConfig.freeShippingThreshold
    ? 0
    : (deliveryMethod === 'envio_nacional' ? settings.shippingConfig.nationalCost : settings.shippingConfig.localCost);

  const finalOrderTotal = cartSubtotal + currentShippingCost;

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (cart.length === 0) return;
    
    if (!customerName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      setErrorMsg('Por favor ingresa un número de teléfono o WhatsApp válido.');
      return;
    }

    if ((deliveryMethod === 'envio_local' || deliveryMethod === 'envio_nacional') && !customerAddress.trim()) {
      setErrorMsg('Por favor ingresa la dirección de entrega completa para el envío.');
      return;
    }

    setIsSubmitting(true);

    try {
      createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || (currentCustomer?.email || undefined),
        customerAddress: customerAddress.trim() || undefined,
        deliveryMethod,
        paymentMethod,
        notes: orderNotes.trim() || undefined
      });
      setIsSubmitting(false);
      setIsCartOpen(false);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg('Ocurrió un error al procesar el pedido. Por favor intenta de nuevo.');
    }
  };

  const handleDirectWhatsAppOrder = () => {
    if (cart.length === 0) return;
    
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Por favor ingresa tu nombre y teléfono para preparar tu pedido.');
      return;
    }

    // Format WhatsApp message
    const itemsList = cart.map((it, idx) => {
      const price = it.useWholesalePrice ? it.product.priceWholesale : it.product.priceRetail;
      return `${idx + 1}. [${it.product.sku}] ${it.product.name} (x${it.quantity}) - ${settings.currency}${(price * it.quantity).toLocaleString('es-MX')}`;
    }).join('\n');

    const deliveryText = deliveryMethod === 'recoger_tienda' 
      ? 'Recoger en Tienda' 
      : (deliveryMethod === 'envio_local' ? 'Envío Local' : 'Envío Nacional');

    const paymentText = paymentMethod === 'transferencia' 
      ? 'Transferencia SPEI' 
      : (paymentMethod === 'efectivo' ? 'Efectivo en Tienda' : paymentMethod.toUpperCase());

    const message = `👋 ¡Hola ${settings.name}! Deseo confirmar el siguiente pedido:\n\n` +
      `👤 *Cliente:* ${customerName.trim()}\n` +
      `📱 *Teléfono:* ${customerPhone.trim()}\n` +
      (customerEmail ? `📧 *Correo:* ${customerEmail.trim()}\n` : '') +
      `🚚 *Entrega:* ${deliveryText}\n` +
      (customerAddress ? `📍 *Dirección:* ${customerAddress.trim()}\n` : '') +
      `💳 *Pago:* ${paymentText}\n\n` +
      `📦 *Refacciones Solicitadas:*\n${itemsList}\n\n` +
      `💰 *Subtotal:* ${settings.currency}${cartSubtotal.toLocaleString('es-MX')}\n` +
      `🚚 *Envío:* ${currentShippingCost === 0 ? 'Gratis' : `${settings.currency}${currentShippingCost.toLocaleString('es-MX')}`}\n` +
      `💵 *TOTAL:* ${settings.currency}${finalOrderTotal.toLocaleString('es-MX')} ${settings.currencyCode}\n\n` +
      (orderNotes ? `📝 *Notas:* ${orderNotes.trim()}\n\n` : '') +
      `¿Tienen existencias listas para despachar?`;

    const waUrl = `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');

    // Also register order in store
    createOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || undefined,
      customerAddress: customerAddress.trim() || undefined,
      deliveryMethod,
      paymentMethod,
      notes: orderNotes.trim() || undefined
    });

    setIsCartOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-2xs flex justify-end"
      onClick={() => setIsCartOpen(false)}
    >
      <div 
        className="w-full max-w-lg bg-white h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Carrito de Compra
              </h2>
              <span className="text-[11px] text-slate-500">
                {cart.length} refaccion{cart.length !== 1 ? 'es' : ''} en tu lista
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 cursor-pointer"
              >
                Vaciar
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer transition-colors"
              title="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Item List and Checkout Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-slate-400 stroke-1" />
              </div>
              <p className="text-sm font-bold text-slate-700">Tu carrito está vacío</p>
              <p className="text-xs text-slate-500 max-w-xs">
                Selecciona puertos Tipo-C, pantallas, celulares o herramientas en el catálogo para generar tu pedido.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <form id="checkout-order-form" onSubmit={handleConfirmOrder} className="space-y-4">
              
              {/* Wholesale notification */}
              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
                <span className="text-blue-900 font-medium">
                  Precios especiales de mayoreo desde <strong>{settings.wholesaleMinQty} piezas</strong>
                </span>
                {isWholesalePricing && (
                  <span className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px]">
                    Mayoreo Activo
                  </span>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Piezas Seleccionadas:
                </span>

                {cart.map((item) => {
                  const unitPrice = item.useWholesalePrice ? item.product.priceWholesale : item.product.priceRetail;
                  const itemSubtotal = unitPrice * item.quantity;
                  return (
                    <div 
                      key={item.product.id}
                      className="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors shadow-2xs"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-12 h-12 rounded bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <ShoppingCart className="w-5 h-5 text-slate-300" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono text-slate-500 font-bold">
                            {item.product.sku}
                          </span>
                          <span className="text-[10px] text-blue-600 font-semibold truncate">
                            {item.product.brand}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {settings.currency}{unitPrice.toLocaleString('es-MX')} c/u
                        </div>
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="flex items-center border border-slate-300 rounded overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-xs font-mono font-bold text-slate-800 min-w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 font-mono">
                            {settings.currency}{itemSubtotal.toLocaleString('es-MX')}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-red-600 p-0.5 cursor-pointer"
                            title="Eliminar refacción"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery & Payment Selection */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-3 text-xs">
                
                {/* Delivery */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Método de Entrega / Envío:</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('recoger_tienda')}
                      className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                        deliveryMethod === 'recoger_tienda'
                          ? 'border-blue-600 bg-white text-blue-900 font-bold shadow-2xs'
                          : 'border-slate-300 bg-white/60 text-slate-700'
                      }`}
                    >
                      <span className="block text-[11px]">En Tienda</span>
                      <span className="text-[10px] text-emerald-700 font-bold">Gratis</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('envio_local')}
                      className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                        deliveryMethod === 'envio_local'
                          ? 'border-blue-600 bg-white text-blue-900 font-bold shadow-2xs'
                          : 'border-slate-300 bg-white/60 text-slate-700'
                      }`}
                    >
                      <span className="block text-[11px]">Envío Local</span>
                      <span className="text-[10px] font-mono">
                        {cartSubtotal >= settings.shippingConfig.freeShippingThreshold ? 'Gratis' : `${settings.currency}${settings.shippingConfig.localCost}`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('envio_nacional')}
                      className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                        deliveryMethod === 'envio_nacional'
                          ? 'border-blue-600 bg-white text-blue-900 font-bold shadow-2xs'
                          : 'border-slate-300 bg-white/60 text-slate-700'
                      }`}
                    >
                      <span className="block text-[11px]">Nacional</span>
                      <span className="text-[10px] font-mono">
                        {cartSubtotal >= settings.shippingConfig.freeShippingThreshold ? 'Gratis' : `${settings.currency}${settings.shippingConfig.nationalCost}`}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                    <span>Forma de Pago:</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transferencia')}
                      className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                        paymentMethod === 'transferencia'
                          ? 'border-blue-600 bg-white text-blue-900 font-bold shadow-2xs'
                          : 'border-slate-300 bg-white/60 text-slate-700'
                      }`}
                    >
                      <span className="block text-[11px]">Transferencia SPEI</span>
                      <span className="text-[10px] text-slate-500">Banco / En línea</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('efectivo')}
                      className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                        paymentMethod === 'efectivo'
                          ? 'border-blue-600 bg-white text-blue-900 font-bold shadow-2xs'
                          : 'border-slate-300 bg-white/60 text-slate-700'
                      }`}
                    >
                      <span className="block text-[11px]">Efectivo al Recibir</span>
                      <span className="text-[10px] text-slate-500">En tienda / Contra entrega</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Customer Details Form */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-3 text-xs">
                <span className="font-bold text-slate-800 block text-xs">
                  Datos de Entrega y Facturación:
                </span>

                {errorMsg && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] rounded-md font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Google user linked badge */}
                {currentCustomer?.isGoogleAccount && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-md text-[11px] text-emerald-800 flex items-center justify-between">
                    <span className="font-medium">✓ Cuenta Google vinculada: {currentCustomer.email}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Nombre o Negocio *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Tu Nombre / Taller"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      WhatsApp o Teléfono *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 55 1234 5678"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Correo Electrónico (Para recibir comprobante y folio)
                  </label>
                  <input
                    type="email"
                    placeholder="tu-correo@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>

                {(deliveryMethod === 'envio_local' || deliveryMethod === 'envio_nacional') && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Dirección de Entrega Completa *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Calle, número, colonia, código postal y ciudad"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Notas o Instrucciones Especiales
                  </label>
                  <input
                    type="text"
                    placeholder="Comentarios adicionales, modelo específico, etc."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

            </form>
          )}
        </div>

        {/* Footer with Totals & Final Order Buttons */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3 shrink-0">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal refacciones:</span>
                <span className="font-mono font-bold text-slate-800">{settings.currency}{cartSubtotal.toLocaleString('es-MX')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Envío:</span>
                <span className="font-mono font-bold text-slate-800">
                  {currentShippingCost === 0 ? 'Gratis' : `${settings.currency}${currentShippingCost.toLocaleString('es-MX')}`}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1 border-t border-slate-200">
                <span className="text-sm font-bold text-slate-900">Total a Pagar:</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-700 font-mono tabular-nums">
                    {settings.currency}{finalOrderTotal.toLocaleString('es-MX')}
                  </span>
                  <span className="text-[11px] text-slate-500 font-bold block">{settings.currencyCode}</span>
                </div>
              </div>
            </div>

            {/* Confirm & Dispatch Buttons */}
            <div className="space-y-2">
              <button
                form="checkout-order-form"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer shadow-sm active:scale-[0.99]"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar Pedido & Generar Recibo</span>
              </button>

              <button
                type="button"
                onClick={handleDirectWhatsAppOrder}
                className="w-full py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-sm active:scale-[0.99]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pedir Directo por WhatsApp</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Garantía de despacho y recibo oficial registrado</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
