import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Building, 
  Package, 
  Layers, 
  ShoppingCart, 
  Database, 
  Eye, 
  AlertTriangle,
  DollarSign,
  Wrench,
  KeyRound,
  MessageSquare,
  Users,
  Send,
  Mail,
  Copy,
  Check,
  Link2,
  Bot,
  LogOut
} from 'lucide-react';
import { SettingsForm } from './SettingsForm';
import { ProductManager } from './ProductManager';
import { CategoryManager } from './CategoryManager';
import { OrdersList } from './OrdersList';
import { BackupManager } from './BackupManager';
import { KeyGeneratorTab } from './KeyGeneratorTab';
import { InquiriesList } from './InquiriesList';
import { ContactsCRM } from './ContactsCRM';
import { TelegramGmailSettings } from './TelegramGmailSettings';
import { GmailCustomersDatabase } from './GmailCustomersDatabase';
import { AIAssistantSettings } from './AIAssistantSettings';

export const AdminDashboard: React.FC = () => {
  const { 
    setViewMode, 
    settings, 
    products, 
    categories, 
    orders, 
    inquiries, 
    contacts, 
    gmailReceipts,
    logoutAdmin,
    firebaseUser 
  } = useStore();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'contacts' | 'gmail_receipts' | 'telegram_gmail' | 'settings' | 'ai_assistant' | 'keys' | 'categories' | 'inquiries' | 'backup'>('products');
  const [copiedLink, setCopiedLink] = useState(false);

  // Stats calculation
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock <= 5).length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pendiente').length;
  const newInquiriesCount = inquiries.filter(i => i.status === 'nuevo').length;
  const inventoryValue = products.reduce((acc, p) => acc + (p.priceRetail * p.stock), 0);

  const handleCopyAdminUrl = () => {
    const url = `${window.location.origin}${window.location.pathname}?admin=true`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      
      {/* Top Admin Header */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white">
            <Wrench className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight">Panel de Control & ERP Mayorista</span>
              <span className="text-xs bg-slate-800 text-blue-300 px-2 py-0.5 rounded font-mono">
                {settings.name}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {firebaseUser && (
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-slate-800 rounded-md border border-slate-700 text-xs text-slate-300">
              {firebaseUser.photoURL ? (
                <img src={firebaseUser.photoURL} alt="" className="w-4 h-4 rounded-full" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
              <span className="font-medium truncate max-w-[140px]">{firebaseUser.email}</span>
            </div>
          )}

          <button
            onClick={handleCopyAdminUrl}
            className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            title="Copiar enlace directo con parámetro ?admin=true"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link2 className="w-3.5 h-3.5 text-blue-400" />}
            <span className="hidden sm:inline">{copiedLink ? '¡Enlace Copiado!' : 'Copiar Link Admin'}</span>
          </button>

          <button
            onClick={() => setViewMode('client')}
            className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Tienda</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="px-2.5 py-1.5 rounded-md bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Cerrar sesión de administrador"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* KPI Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Refacciones en Catálogo</span>
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {products.length}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">{totalStock} unidades en almacén</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Clientes / CRM Guardados</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
              {contacts.length}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Talleres y técnicos</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Stock Bajo (≤ 5)</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
              {lowStockCount}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Piezas por resurtir</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Despacho Telegram & Gmail</span>
              <Send className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums">
              {settings.telegramEnabled ? 'ONLINE' : 'PAUSADO'}
            </div>
            <span className="text-[11px] text-slate-500 font-medium truncate">
              {settings.adminEmail}
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-lg overflow-x-auto shadow-xs text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Refacciones ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Órdenes & Pedidos ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'contacts'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-bold'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Directorio Clientes / CRM ({contacts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gmail_receipts')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'gmail_receipts'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-bold'
            }`}
          >
            <Mail className="w-4 h-4 text-rose-500" />
            <span>Base de Datos Gmail & Recibos ({gmailReceipts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('telegram_gmail')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'telegram_gmail'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-bold'
            }`}
          >
            <Send className="w-4 h-4 text-blue-500" />
            <span>Bot Telegram & Gmail</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Datos de la Tienda</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_assistant')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'ai_assistant'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-600 bg-indigo-50/60 hover:bg-indigo-100 hover:text-indigo-900 font-bold border border-indigo-200/60'
            }`}
          >
            <Bot className="w-4 h-4 text-indigo-500" />
            <span>Agente IA Ventas {settings.aiAssistantEnabled ? '🟢' : '⚪'}</span>
          </button>

          <button
            onClick={() => setActiveTab('keys')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'keys'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <KeyRound className="w-4 h-4 text-amber-500" />
            <span>Generar Llaves de Panel ({settings.adminKeys?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categorías ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'inquiries'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Mensajes Web ({inquiries.length})</span>
            {newInquiriesCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'backup'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Respaldo JSON</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="pt-2">
          {activeTab === 'products' && <ProductManager />}
          {activeTab === 'orders' && <OrdersList />}
          {activeTab === 'contacts' && <ContactsCRM />}
          {activeTab === 'gmail_receipts' && <GmailCustomersDatabase />}
          {activeTab === 'telegram_gmail' && <TelegramGmailSettings />}
          {activeTab === 'settings' && <SettingsForm />}
          {activeTab === 'ai_assistant' && <AIAssistantSettings />}
          {activeTab === 'keys' && <KeyGeneratorTab />}
          {activeTab === 'categories' && <CategoryManager />}
          {activeTab === 'inquiries' && <InquiriesList />}
          {activeTab === 'backup' && <BackupManager />}
        </div>

      </div>

    </div>
  );
};
