import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  User, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  MessageCircle, 
  Copy, 
  Check, 
  Search,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  LogOut,
  UserCheck
} from 'lucide-react';
import { Order } from '../types';

export const CustomerPortalModal: React.FC = () => {
  const { 
    isCustomerPortalOpen, 
    setIsCustomerPortalOpen, 
    currentCustomer, 
    registerCustomer, 
    loginCustomerWithGoogle,
    logoutCustomer,
    orders,
    settings 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'recibos' | 'registro'>('recibos');

  // Registration Form State
  const [formData, setFormData] = useState({
    name: currentCustomer?.name || '',
    phone: currentCustomer?.phone || '',
    email: currentCustomer?.email || '',
    workshopName: currentCustomer?.workshopName || '',
    address: currentCustomer?.address || ''
  });

  const [regSuccess, setRegSuccess] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleMsg, setGoogleMsg] = useState('');

  // Keep form in sync when currentCustomer changes
  React.useEffect(() => {
    if (currentCustomer) {
      setFormData({
        name: currentCustomer.name || '',
        phone: currentCustomer.phone || '',
        email: currentCustomer.email || '',
        workshopName: currentCustomer.workshopName || '',
        address: currentCustomer.address || ''
      });
    }
  }, [currentCustomer]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setGoogleMsg('');
    const res = await loginCustomerWithGoogle();
    setIsGoogleLoading(false);
    if (res.success && res.customer) {
      setFormData({
        name: res.customer.name,
        phone: res.customer.phone || '',
        email: res.customer.email || '',
        workshopName: res.customer.workshopName || '',
        address: res.customer.address || ''
      });
      setRegSuccess(true);
      setTimeout(() => {
        setRegSuccess(false);
        setActiveTab('recibos');
      }, 1200);
    } else {
      setGoogleMsg(res.message);
    }
  };

  if (!isCustomerPortalOpen) return null;

  // Filter orders for this customer
  const customerPhoneClean = (currentCustomer?.phone || searchPhone).replace(/\D/g, '');
  const customerOrders = orders.filter(order => {
    if (!customerPhoneClean) return true;
    const orderPhoneClean = (order.customerPhone || '').replace(/\D/g, '');
    return orderPhoneClean.includes(customerPhoneClean) || 
           (order.customerEmail && currentCustomer?.email && order.customerEmail.toLowerCase() === currentCustomer.email.toLowerCase()) ||
           order.id.toLowerCase().includes(searchPhone.toLowerCase().trim());
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    registerCustomer({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      workshopName: formData.workshopName.trim(),
      address: formData.address.trim()
    });

    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setActiveTab('recibos');
    }, 1500);
  };

  const copyReceiptText = (order: Order) => {
    const itemsList = order.items
      .map((it, idx) => `${idx + 1}. [${it.sku}] ${it.name} x${it.quantity} = ${settings.currency}${it.total}`)
      .join('\n');

    const text = `🧾 RECIBO DE COMPRA - ${settings.name}\n` +
      `Folio: ${order.id}\n` +
      `Fecha: ${order.date}\n` +
      `Cliente: ${order.customerName}\n` +
      `Teléfono: ${order.customerPhone}\n` +
      `Refacciones:\n${itemsList}\n` +
      `Total: ${settings.currency}${order.total} ${settings.currencyCode}\n` +
      `Estado: ${order.status.toUpperCase()}`;

    navigator.clipboard.writeText(text);
    setCopiedOrderId(order.id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const sendReceiptToWhatsApp = (order: Order) => {
    const waText = encodeURIComponent(
      `Hola ${order.customerName}, aquí está tu recibo de ${settings.name}:\n` +
      `🧾 Folio: ${order.id}\n` +
      `📅 Fecha: ${order.date}\n` +
      `💰 Total: ${settings.currency}${order.total} ${settings.currencyCode}\n` +
      `📦 Estado: ${order.status.toUpperCase()}\n` +
      `¡Gracias por tu compra en ${settings.name}!`
    );
    window.open(`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${waText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-2xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-6 flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-3.5 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0">
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-sm sm:text-lg font-bold tracking-tight">
                  Portal de Clientes & Talleres
                </h2>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full bg-white/20 text-white">
                  Usuarios
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-blue-100 truncate max-w-[220px] sm:max-w-none">
                {currentCustomer 
                  ? `Sesión activa: ${currentCustomer.name}` 
                  : 'Consulta tus recibos, folios de pedido y alertas en vivo'}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsCustomerPortalOpen(false)}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-5 flex items-center justify-between gap-1 overflow-x-auto text-xs font-semibold scrollbar-none">
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('recibos')}
              className={`py-2.5 sm:py-3 px-2 sm:px-3 border-b-2 transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap text-xs ${
                activeTab === 'recibos'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Mis Recibos</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2 rounded-full">
                {customerOrders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('registro')}
              className={`py-2.5 sm:py-3 px-2.5 sm:px-4 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap text-xs ${
                activeTab === 'registro'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{currentCustomer ? 'Mi Perfil & Datos' : 'Registrarme'}</span>
            </button>
          </div>

          {currentCustomer && (
            <button
              onClick={logoutCustomer}
              className="text-[10px] sm:text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1 hover:underline shrink-0 py-2 cursor-pointer"
              title="Cerrar sesión de cliente en este navegador"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          
          {/* TAB 1: RECIBOS & PEDIDOS */}
          {activeTab === 'recibos' && (
            <div className="space-y-4">
              
              {/* Search Bar for Receipts */}
              <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    placeholder="Buscar por teléfono o número de folio (ej. PED-123456)..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {searchPhone && (
                  <button
                    onClick={() => setSearchPhone('')}
                    className="text-xs text-slate-500 hover:text-slate-800 underline px-2 shrink-0 cursor-pointer"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Order Cards List */}
              {customerOrders.length === 0 ? (
                <div className="text-center py-12 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <Receipt className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
                  <h4 className="text-sm font-bold text-slate-800">No se encontraron recibos</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Cuando realizas una cotización o pedido en el catálogo, tus recibos oficiales se guardan automáticamente aquí.
                  </p>
                  <button
                    onClick={() => setActiveTab('registro')}
                    className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    Registrar mis datos de cliente
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {customerOrders.map(order => (
                    <div 
                      key={order.id} 
                      className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-400 transition-all shadow-xs space-y-3"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {order.id}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {order.date}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          order.status === 'entregado' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'en_camino' ? 'bg-indigo-100 text-indigo-800' :
                          order.status === 'confirmado' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'cancelado' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status === 'pendiente' ? '⏳ Recibido / Por Confirmar' :
                           order.status === 'confirmado' ? '📦 Confirmado / Preparando' :
                           order.status === 'en_camino' ? '🚚 En Camino' :
                           order.status === 'entregado' ? '✓ Entregado' : order.status}
                        </span>
                      </div>

                      {/* Items Preview */}
                      <div className="space-y-1 text-xs">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase">
                          Refacciones del Pedido:
                        </span>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-slate-800">
                            <span>
                              <strong className="text-blue-600">{item.quantity}x</strong> {item.name}
                            </span>
                            <span className="font-mono font-bold text-slate-700">
                              {settings.currency}{item.total.toLocaleString('es-MX')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Totals & Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 bg-slate-50/50 p-2 rounded-lg">
                        <div className="text-xs">
                          <span className="text-[11px] text-slate-500 block">Total del Recibo:</span>
                          <span className="text-base font-black text-slate-900 font-mono">
                            {settings.currency}{order.total.toLocaleString('es-MX')} {settings.currencyCode}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyReceiptText(order)}
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Copiar texto del recibo"
                          >
                            {copiedOrderId === order.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-500" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => sendReceiptToWhatsApp(order)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: REGISTRO / PERFIL DE CLIENTE */}
          {activeTab === 'registro' && (
            <div className="space-y-4">
              
              {/* Google Sign-In for Customers */}
              {currentCustomer?.isGoogleAccount ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white border border-emerald-300 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                      {currentCustomer.avatarUrl ? (
                        <img src={currentCustomer.avatarUrl} alt={currentCustomer.name} className="w-full h-full object-cover" />
                      ) : (
                        <UserCheck className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 block">{currentCustomer.name}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                          Google Activo
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">{currentCustomer.email}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={logoutCustomer}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold hover:underline cursor-pointer"
                  >
                    Desconectar
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-slate-50 to-blue-50/40 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Inicio Rápido para Clientes
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Inicia sesión con tu cuenta de Google para guardar tus compras y recibos en 1 clic.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading}
                    className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer hover:border-blue-400 group"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>{isGoogleLoading ? 'Conectando con Google...' : 'Continuar con Google como Cliente'}</span>
                  </button>

                  {googleMsg && (
                    <p className="text-[11px] text-amber-600 font-medium text-center">{googleMsg}</p>
                  )}

                  <div className="relative flex items-center justify-center pt-1">
                    <div className="border-t border-slate-200 w-full" />
                    <span className="bg-slate-50 px-2 text-[10px] text-slate-400 uppercase font-semibold shrink-0">
                      o completa tus datos manualmente
                    </span>
                    <div className="border-t border-slate-200 w-full" />
                  </div>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Datos de Facturación / Entrega del Comprador o Taller</span>
                  </div>
                  <p className="text-blue-700">
                    Registra o actualiza tus datos de contacto para que tus cotizaciones y recibos salgan con tu información.
                  </p>
                </div>

                {regSuccess && (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>¡Datos guardados con éxito! Ahora tus órdenes se sincronizan con tu perfil.</span>
                  </div>
                )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej. Ing. Carlos Mendoza"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Ej. +52 55 1234 5678"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo Electrónico (Gmail)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="tu-correo@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre de Taller o Negocio (Opcional)
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={formData.workshopName}
                      onChange={(e) => setFormData(prev => ({ ...prev, workshopName: e.target.value }))}
                      placeholder="Ej. Taller Fix Pro / Electrónica Norte"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dirección de Entrega Frecuente
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Calle, número, colonia, código postal y referencias"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Information note */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  Al registrarte, tus compras y recibos oficiales con folio se guardarán automáticamente en tu historial y recibirás tus comprobantes directamente en tu WhatsApp y correo.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>{currentCustomer ? 'Actualizar Mis Datos' : 'Guardar y Activar Mis Recibos'}</span>
              </button>
            </form>
          </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Tus datos de compra están protegidos y encriptados localmente.</span>
          </div>

          <button
            onClick={() => setIsCustomerPortalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
