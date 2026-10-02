import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Mail, 
  Search, 
  Download, 
  Send, 
  Check, 
  Receipt, 
  Printer, 
  MessageCircle, 
  User, 
  DollarSign, 
  Calendar, 
  ShieldCheck, 
  FileText,
  Copy,
  ExternalLink,
  X,
  CreditCard,
  Truck,
  Plus
} from 'lucide-react';
import { GmailReceipt, Order } from '../../types';

export const GmailCustomersDatabase: React.FC = () => {
  const { 
    orders, 
    contacts, 
    settings, 
    gmailReceipts, 
    sendCustomerReceiptByEmail,
    exportGmailDatabaseCSV,
    addContact 
  } = useStore();

  const [search, setSearch] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'receipts' | 'clients'>('receipts');
  const [copiedGmail, setCopiedGmail] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<GmailReceipt | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Client Form
  const [newName, setNewName] = useState('');
  const [newGmail, setNewGmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newBusiness, setNewBusiness] = useState('');

  // Filter receipts
  const filteredReceipts = gmailReceipts.filter(r => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      r.customerGmail.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      r.orderId.toLowerCase().includes(q) ||
      r.customerPhone.includes(q)
    );
  });

  // Filter clients with email
  const clientsWithEmail = contacts.filter(c => Boolean(c.email && c.email.includes('@')));
  const filteredClients = clientsWithEmail.filter(c => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      c.phone.includes(q) ||
      (c.businessName && c.businessName.toLowerCase().includes(q))
    );
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedGmail(text);
    setTimeout(() => setCopiedGmail(null), 2000);
  };

  const handleCreateNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newGmail.trim() || !newPhone.trim()) return;

    addContact({
      name: newName.trim(),
      businessName: newBusiness.trim() || undefined,
      phone: newPhone.trim(),
      whatsapp: newPhone.replace(/\D/g, ''),
      email: newGmail.trim(),
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: new Date().toLocaleDateString('es-MX'),
      category: 'taller',
      notes: 'Registrado manualmente en Base de Datos Gmail'
    });

    setNewName('');
    setNewGmail('');
    setNewPhone('');
    setNewBusiness('');
    setIsAddModalOpen(false);
  };

  const totalReceiptsAmount = gmailReceipts.reduce((acc, r) => acc + r.total, 0);

  // Find linked order for selectedReceipt if available
  const linkedOrder = selectedReceipt ? orders.find(o => o.id === selectedReceipt.orderId) : null;

  return (
    <div className="space-y-5">
      
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-5 rounded-xl border border-slate-800 shadow-sm space-y-2">
        <div className="flex items-center gap-2.5 text-blue-400 font-bold text-xs uppercase tracking-wider">
          <Mail className="w-4 h-4" />
          <span>Base de Datos de Clientes Gmail & Control de Recibos de Compra</span>
        </div>
        <h3 className="text-base sm:text-lg font-black tracking-tight">
          Registro Oficial de Recibos y Correos de Compradores
        </h3>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Cada cliente que realiza una compra en la tienda debe verificar su Gmail. Todos los comprobantes de compra, desgloses y folios se envían automáticamente al Gmail del cliente y al Gmail del administrador (<strong>{settings.adminEmail}</strong>), quedando archivados aquí en tiempo real.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Gmails Registrados</span>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {clientsWithEmail.length}
          </span>
          <span className="text-[11px] text-slate-400 block">Compradores verificados</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Recibos Emitidos</span>
          <span className="text-2xl font-bold font-mono text-blue-600 tabular-nums">
            {gmailReceipts.length}
          </span>
          <span className="text-[11px] text-slate-400 block">Comprobantes enviados</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Facturación con Recibo</span>
          <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            {settings.currency}{totalReceiptsAmount.toLocaleString('es-MX')}
          </span>
          <span className="text-[11px] text-slate-400 block">Total en recibos</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Alerta Bot & Gmail</span>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            ACTIVO
          </span>
          <span className="text-[11px] text-slate-400 block truncate">Chat ID: {settings.telegramChatId || '5466915332'}</span>
        </div>
      </div>

      {/* Action and Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por correo Gmail, folio de recibo o cliente..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
          />
        </div>

        {/* Sub-tab Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-md text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('receipts')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                activeSubTab === 'receipts'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recibos Emitidos ({gmailReceipts.length})
            </button>
            <button
              onClick={() => setActiveSubTab('clients')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                activeSubTab === 'clients'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Directorio de Gmails ({clientsWithEmail.length})
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Registrar nuevo cliente con Gmail"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Gmail</span>
          </button>

          <button
            onClick={exportGmailDatabaseCSV}
            className="px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Exportar base de datos a Excel / CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>

      </div>

      {/* View 1: Receipts List */}
      {activeSubTab === 'receipts' && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-600" />
              <span>Historial de Recibos Digitales Emitidos</span>
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">
              Copia enviada a {settings.adminEmail} y al bot de Telegram
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 font-bold text-[11px]">
                  <th className="py-2.5 px-4">Folio Recibo</th>
                  <th className="py-2.5 px-4">Orden / Folio</th>
                  <th className="py-2.5 px-4">Cliente</th>
                  <th className="py-2.5 px-4">Gmail Verificado</th>
                  <th className="py-2.5 px-4">Fecha</th>
                  <th className="py-2.5 px-4">Total</th>
                  <th className="py-2.5 px-4">Estado</th>
                  <th className="py-2.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReceipts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Receipt className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-1" />
                      <p className="font-bold text-slate-700">No hay recibos registrados aún</p>
                      <p className="text-[11px] text-slate-400">
                        Cuando un cliente compre y verifique su Gmail en el carrito, su recibo aparecerá aquí.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredReceipts.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">
                        {r.id}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600">
                        {r.orderId}
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900">
                        {r.customerName}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-mono text-slate-800 font-medium">{r.customerGmail}</span>
                          <button
                            onClick={() => handleCopy(r.customerGmail)}
                            className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer"
                            title="Copiar correo"
                          >
                            {copiedGmail === r.customerGmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {r.date}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {settings.currency}{r.total.toLocaleString('es-MX')}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Verificado</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedReceipt(r)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] border border-slate-300 cursor-pointer flex items-center gap-1"
                            title="Ver recibo detallado"
                          >
                            <FileText className="w-3 h-3 text-blue-600" />
                            <span>Ver Recibo</span>
                          </button>

                          <button
                            onClick={() => sendCustomerReceiptByEmail(r)}
                            className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] border border-blue-200 cursor-pointer flex items-center gap-1"
                            title="Abrir y enviar recibo por Gmail"
                          >
                            <Send className="w-3 h-3" />
                            <span>Reenviar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: Customers Gmail Directory */}
      {activeSubTab === 'clients' && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Base de Datos de Compradores con Gmail Verificado</span>
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">
              Total {filteredClients.length} cuentas registradas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 font-bold text-[11px]">
                  <th className="py-2.5 px-4">Cliente / Taller</th>
                  <th className="py-2.5 px-4">Correo Gmail Verificado</th>
                  <th className="py-2.5 px-4">WhatsApp / Teléfono</th>
                  <th className="py-2.5 px-4">Compras</th>
                  <th className="py-2.5 px-4">Total Comprado</th>
                  <th className="py-2.5 px-4">Última Actividad</th>
                  <th className="py-2.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      No hay clientes con Gmail registrado que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  filteredClients.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{c.name}</span>
                        {c.businessName && (
                          <span className="text-[11px] text-blue-600 font-semibold">{c.businessName}</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="font-mono text-slate-900 font-bold">{c.email}</span>
                          <button
                            onClick={() => handleCopy(c.email!)}
                            className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer"
                            title="Copiar Gmail"
                          >
                            {copiedGmail === c.email ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-700">
                        {c.phone}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-800">
                        {c.totalOrders} órdenes
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                        {settings.currency}{c.totalSpent.toLocaleString('es-MX')}
                      </td>

                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {c.lastOrderDate}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`mailto:${c.email}?subject=Comprobante%20y%20Atención%20-%20${encodeURIComponent(settings.name)}&body=Estimado%20${encodeURIComponent(c.name)},%20te%20saludamos%20de%20${encodeURIComponent(settings.name)}.`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-[11px] border border-slate-300"
                            title="Escribir correo a este cliente"
                          >
                            Redactar Gmail
                          </a>

                          <a
                            href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(c.name)},%20te%20escribimos%20de%20${encodeURIComponent(settings.name)}.`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300"
                            title="Enviar WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: View Receipt Details */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
          <div 
            className="w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-sm font-bold">Comprobante Oficial: {selectedReceipt.id}</h3>
                  <p className="text-[11px] text-slate-400">Folio Orden: {selectedReceipt.orderId}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-2 gap-2 text-slate-700">
                <div>Cliente: <strong className="text-slate-900">{selectedReceipt.customerName}</strong></div>
                <div>Fecha: <strong className="text-slate-900 font-mono">{selectedReceipt.date}</strong></div>
                <div>Gmail: <strong className="text-slate-900 font-mono">{selectedReceipt.customerGmail}</strong></div>
                <div>Teléfono: <strong className="text-slate-900 font-mono">{selectedReceipt.customerPhone}</strong></div>
                <div>Pago: <strong className="text-slate-900 uppercase">{selectedReceipt.paymentMethod}</strong></div>
                <div>Entrega: <strong className="text-slate-900 uppercase">{selectedReceipt.deliveryMethod.replace('_', ' ')}</strong></div>
              </div>

              {linkedOrder && linkedOrder.items && (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-700 text-[11px] uppercase">
                    Piezas Adquiridas ({linkedOrder.items.length})
                  </div>
                  <div className="p-3 space-y-1.5 max-h-40 overflow-y-auto divide-y divide-slate-100">
                    {linkedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center pt-1">
                        <span className="font-medium text-slate-800">{it.quantity}x {it.name}</span>
                        <span className="font-mono font-bold text-slate-900">{settings.currency}{it.total.toLocaleString('es-MX')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <span className="font-bold text-blue-950 text-sm">Total Liquidado:</span>
                <span className="text-xl font-bold font-mono text-blue-700">
                  {settings.currency}{selectedReceipt.total.toLocaleString('es-MX')} {settings.currencyCode}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Ticket</span>
                </button>

                <button
                  onClick={() => sendCustomerReceiptByEmail(selectedReceipt)}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Reenviar a Gmail</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Verified Gmail */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
          <div 
            className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Registrar Nuevo Gmail de Cliente</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Completo del Cliente *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Daniel Ramos"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Correo Gmail Oficial *</label>
                <input
                  type="email"
                  required
                  value={newGmail}
                  onChange={(e) => setNewGmail(e.target.value)}
                  placeholder="cliente@gmail.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+52 55 1234 5678"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre del Taller / Negocio (Opcional)</label>
                <input
                  type="text"
                  value={newBusiness}
                  onChange={(e) => setNewBusiness(e.target.value)}
                  placeholder="Ej: FixCell Express"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Guardar en Base de Datos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
