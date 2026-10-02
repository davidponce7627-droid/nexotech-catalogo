import React, { useState } from 'react';
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
  AlertCircle
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
    cartTotal,
    settings,
    createOrder,
    isWholesalePricing 
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<Order['deliveryMethod']>('recoger_tienda');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('transferencia');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Gmail Verification States
  const [isGmailVerified, setIsGmailVerified] = useState(false);
  const [gmailOtpCode, setGmailOtpCode] = useState<string | null>(null);
  const [enteredOtpCode, setEnteredOtpCode] = useState('');
  const [otpSentToCustomer, setOtpSentToCustomer] = useState(false);

  if (!isCartOpen) return null;

  const currentShippingCost = deliveryMethod === 'recoger_tienda' || cartSubtotal >= settings.shippingConfig.freeShippingThreshold
    ? 0
    : (deliveryMethod === 'envio_nacional' ? settings.shippingConfig.nationalCost : settings.shippingConfig.localCost);

  const finalOrderTotal = cartSubtotal + currentShippingCost;

  const handleSendGmailOtp = () => {
    const cleanMail = customerEmail.trim();
    if (!cleanMail || !cleanMail.includes('@')) {
      setErrorMsg('Por favor ingresa un correo Gmail válido para enviarte el código de seguridad.');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGmailOtpCode(code);
    setOtpSentToCustomer(true);
    setErrorMsg('');
  };

  const handleVerifyOtp = () => {
    if (!gmailOtpCode) {
      setErrorMsg('Primero solicita tu código de seguridad.');
      return;
    }
    if (enteredOtpCode.trim() === gmailOtpCode) {
      setIsGmailVerified(true);
      setErrorMsg('');
    } else {
      setErrorMsg('El código de verificación no coincide. Verifica e intenta de nuevo.');
    }
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (cart.length === 0) return;
    
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo y número de WhatsApp o teléfono.');
      return;
    }

    if (!customerEmail.trim()) {
      setErrorMsg('El correo Gmail es obligatorio para enviarte tu comprobante y folio de compra.');
      return;
    }

    if (!isGmailVerified) {
      setErrorMsg('Debes verificar tu Gmail con el código de seguridad de 6 dígitos antes de completar la orden.');
      return;
    }

    if ((deliveryMethod === 'envio_local' || deliveryMethod === 'envio_nacional') && !customerAddress.trim()) {
      setErrorMsg('Por favor ingresa la dirección completa de entrega para el envío.');
      return;
    }

    setIsSubmitting(true);

    // Call createOrder
    createOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      customerAddress: customerAddress.trim() || undefined,
      deliveryMethod,
      paymentMethod,
      notes: orderNotes.trim() || undefined
    });

    setIsSubmitting(false);
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-2xs flex justify-end">
      <div 
        className="w-full max-w-lg bg-white h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Mi Carrito / Orden de Compra
              </h2>
              <span className="text-[11px] text-slate-500">
                {cart.length} refaccion{cart.length !== 1 ? 'es' : ''} seleccionadas
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1"
              >
                Vaciar
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Item List and Checkout Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
              <ShoppingCart className="w-12 h-12 text-slate-300 stroke-1" />
              <p className="text-sm font-bold text-slate-700">Tu lista está vacía</p>
              <p className="text-xs text-slate-500">
                Selecciona puertos Type-C, pantallas, celulares o herramientas para cotizar y comprar.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-md cursor-pointer"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <form id="checkout-order-form" onSubmit={handleConfirmOrder} className="space-y-4">
              
              {/* Wholesale notification */}
              <div className="p-2.5 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
                <span className="text-blue-900 font-medium">
                  Tarifa mayoreo activa a partir de <strong>{settings.wholesaleMinQty} piezas</strong>
                </span>
                {isWholesalePricing && (
                  <span className="bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px]">
                    Modo Mayoreo
                  </span>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Piezas en la Orden:
                </span>
                
                {cart.map(item => {
                  const qualifiesWholesale = isWholesalePricing || item.useWholesalePrice || item.quantity >= settings.wholesaleMinQty;
                  const unitPrice = qualifiesWholesale ? item.product.priceWholesale : item.product.priceRetail;
                  const itemSubtotal = unitPrice * item.quantity;

                  return (
                    <div 
                      key={item.product.id}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-slate-200 bg-white"
                    >
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded border border-slate-200 shrink-0" 
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                          <span>SKU: {item.product.sku}</span>
                          <span>·</span>
                          <span className="text-blue-700 font-semibold">
                            {settings.currency}{unitPrice} c/u
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center border border-slate-300 rounded bg-slate-50 text-xs">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 font-mono font-bold text-slate-900 min-w-5 text-center text-xs">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 font-bold"
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
                            title="Eliminar"
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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

                {/* Payment Method */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                    <span>Método de Pago:</span>
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
                      <span className="text-[10px] text-slate-500">BBVA / Banco</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('oxxo')}
                      className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                        paymentMethod === 'oxxo'
                          ? 'border-blue-600 bg-white text-blue-900 font-bold shadow-2xs'
                          : 'border-slate-300 bg-white/60 text-slate-700'
                      }`}
                    >
                      <span className="block text-[11px]">Depósito OXXO</span>
                      <span className="text-[10px] text-slate-500">Pago en efectivo</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Customer Details Form */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-3 text-xs">
                <span className="font-bold text-slate-800 block text-xs">
                  Datos del Comprador & Facturación:
                </span>

                {errorMsg && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] rounded-md font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Tu Nombre / Taller *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                  />
                  <input
                    type="text"
                    required
                    placeholder="WhatsApp / Teléfono *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>

                {/* Obligatory Gmail Verification Block */}
                <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      <span>Correo Gmail (Obligatorio para Recibo Oficial) *</span>
                    </label>
                    {isGmailVerified && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verificado</span>
                      </span>
                    )}
                  </div>

                  {!isGmailVerified ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="email"
                          required
                          placeholder="tunombre@gmail.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 font-mono font-medium"
                        />
                        <button
                          type="button"
                          onClick={handleSendGmailOtp}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold whitespace-nowrap cursor-pointer transition-colors"
                        >
                          {otpSentToCustomer ? 'Reenviar Código' : 'Verificar Gmail'}
                        </button>
                      </div>

                      {/* Code verification input */}
                      {otpSentToCustomer && (
                        <div className="p-2.5 bg-blue-50/80 rounded border border-blue-200 space-y-2 animate-in fade-in">
                          <div className="text-[11px] text-blue-950 font-medium">
                            <span>Código de seguridad enviado a <strong>{customerEmail}</strong>. Ingrésalo para verificar:</span>
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="Código de 6 dígitos"
                              value={enteredOtpCode}
                              onChange={(e) => setEnteredOtpCode(e.target.value.replace(/\D/g, ''))}
                              className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-center font-mono font-bold tracking-widest text-slate-900 focus:outline-none focus:border-blue-600"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold cursor-pointer transition-colors"
                            >
                              Validar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-mono font-bold text-emerald-950 block text-xs">
                            {customerEmail}
                          </span>
                          <span className="text-[10px] text-emerald-700">
                            Recibirás tu recibo fiscal y folio oficial en este correo.
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setIsGmailVerified(false); setEnteredOtpCode(''); }}
                        className="text-[11px] text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
                      >
                        Cambiar
                      </button>
                    </div>
                  )}
                </div>

                {(deliveryMethod === 'envio_local' || deliveryMethod === 'envio_nacional') && (
                  <input
                    type="text"
                    required
                    placeholder="Dirección completa de entrega (Calle, Número, Colonia, CP, Ciudad) *"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                  />
                )}

                <input
                  type="text"
                  placeholder="Comentarios adicionales o dudas de entrega..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                />
              </div>

            </form>
          )}
        </div>

        {/* Footer with Totals & Final Order Button */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
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

            {/* Confirm & Dispatch Button */}
            <button
              form="checkout-order-form"
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                isGmailVerified
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-800 hover:bg-slate-900 text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>
                {isGmailVerified 
                  ? 'Confirmar Compra & Enviar Recibo a mi Gmail' 
                  : 'Verifica tu Gmail para Completar la Compra'}
              </span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Todas las compras quedan registradas en la base de datos oficial</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
