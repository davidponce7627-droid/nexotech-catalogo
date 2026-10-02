import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Send, 
  Mail, 
  MessageSquare, 
  Check, 
  AlertCircle, 
  Save, 
  CreditCard, 
  Truck, 
  BellRing,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Smartphone,
  Sparkles
} from 'lucide-react';

export const TelegramGmailSettings: React.FC = () => {
  const { settings, updateSettings, testTelegramConnection, sendSampleOrderToTelegram } = useStore();
  
  const [formData, setFormData] = useState({
    telegramEnabled: settings.telegramEnabled,
    telegramBotToken: settings.telegramBotToken || '',
    telegramChatId: settings.telegramChatId || '',
    adminEmail: settings.adminEmail || 'dr2490761@gmail.com',
    emailNotificationsEnabled: settings.emailNotificationsEnabled,
    bankName: settings.bankDetails?.bankName || 'BBVA México',
    beneficiary: settings.bankDetails?.beneficiary || 'Tech Matrix Refacciones',
    clabe: settings.bankDetails?.clabe || '012180001234567890',
    cardNumber: settings.bankDetails?.cardNumber || '4152 3138 9012 3456',
    oxxoNumber: settings.bankDetails?.oxxoNumber || '9218 0123 4567 8901',
    localCost: settings.shippingConfig?.localCost || 99,
    nationalCost: settings.shippingConfig?.nationalCost || 180,
    freeShippingThreshold: settings.shippingConfig?.freeShippingThreshold || 1500
  });

  const [showToken, setShowToken] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSendingSample, setIsSendingSample] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleTestConnection = async () => {
    if (!formData.telegramBotToken.trim() || !formData.telegramChatId.trim()) {
      setTestResult({ 
        success: false, 
        message: 'Por favor ingresa primero el Bot Token y el Chat ID en los campos de arriba.' 
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    const result = await testTelegramConnection(formData.telegramBotToken, formData.telegramChatId);
    setTestResult(result);
    setIsTesting(false);
  };

  const handleSendSampleOrder = async () => {
    if (!formData.telegramBotToken.trim() || !formData.telegramChatId.trim()) {
      setTestResult({ 
        success: false, 
        message: 'Ingresa tu Token y Chat ID antes de enviar la orden de prueba.' 
      });
      return;
    }

    setIsSendingSample(true);
    setTestResult(null);
    const result = await sendSampleOrderToTelegram(formData.telegramBotToken, formData.telegramChatId);
    setTestResult(result);
    setIsSendingSample(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      telegramEnabled: formData.telegramEnabled,
      telegramBotToken: formData.telegramBotToken.trim(),
      telegramChatId: formData.telegramChatId.trim(),
      adminEmail: formData.adminEmail.trim(),
      emailNotificationsEnabled: formData.emailNotificationsEnabled,
      bankDetails: {
        bankName: formData.bankName.trim(),
        beneficiary: formData.beneficiary.trim(),
        clabe: formData.clabe.trim(),
        cardNumber: formData.cardNumber.trim(),
        oxxoNumber: formData.oxxoNumber.trim()
      },
      shippingConfig: {
        localCost: Number(formData.localCost) || 0,
        nationalCost: Number(formData.nationalCost) || 0,
        freeShippingThreshold: Number(formData.freeShippingThreshold) || 1500
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Telegram Bot Dispatch Section */}
      <div className="bg-white border-2 border-blue-600 rounded-xl p-6 space-y-6 shadow-sm">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Configuración del Bot de Telegram para Órdenes
                </h3>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                  formData.telegramEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {formData.telegramEnabled ? 'Activado' : 'Pausado'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Despacha en tiempo real cada pedido realizado por tus clientes directamente a tu aplicación de Telegram.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={formData.telegramEnabled}
              onChange={(e) => setFormData(prev => ({ ...prev, telegramEnabled: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Spacious Inputs for Token and Chat ID */}
        <div className="space-y-4">
          
          {/* Bot Token Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Telegram Bot Token</span>
                <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showToken ? 'Ocultar Token' : 'Mostrar Token'}</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={formData.telegramBotToken}
                onChange={(e) => setFormData(prev => ({ ...prev, telegramBotToken: e.target.value }))}
                placeholder="Ej. 7198234501:AAHq_mY7K9xZ_example_token_here..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 font-mono tracking-wide focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Token secreto entregado por <strong>@BotFather</strong> al crear tu bot en Telegram.
            </p>
          </div>

          {/* Chat ID Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Telegram Chat ID / Canal ID</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                Ej. 5466915332 o -100...
              </span>
            </div>

            <input
              type="text"
              value={formData.telegramChatId}
              onChange={(e) => setFormData(prev => ({ ...prev, telegramChatId: e.target.value }))}
              placeholder="Ej. 5466915332 (ID de tu chat personal o grupo de ventas)"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 font-mono tracking-wide focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs font-bold"
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              Tu ID de usuario personal o el ID de tu canal/grupo. Obtenlo escribiéndole a <strong>@userinfobot</strong> en Telegram.
            </p>
          </div>

        </div>

        {/* Action Testing Buttons */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={isTesting || isSendingSample}
            onClick={handleTestConnection}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors disabled:opacity-50"
          >
            <BellRing className="w-4 h-4 text-blue-400" />
            <span>{isTesting ? 'Verificando con Telegram...' : '1. Probar Conexión (Ping)'}</span>
          </button>

          <button
            type="button"
            disabled={isTesting || isSendingSample}
            onClick={handleSendSampleOrder}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isSendingSample ? 'Enviando Orden...' : '2. Enviar Orden de Prueba Completa al Bot'}</span>
          </button>
        </div>

        {/* Live Test Feedback Banner */}
        {testResult && (
          <div className={`p-4 rounded-lg text-xs space-y-1.5 border animate-in fade-in ${
            testResult.success 
              ? 'bg-emerald-50 text-emerald-950 border-emerald-300' 
              : 'bg-rose-50 text-rose-950 border-rose-300'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {testResult.success ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Respuesta Exitosa de Telegram API</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Error al Comunicar con Telegram</span>
                </>
              )}
            </div>
            <p className="leading-relaxed">{testResult.message}</p>
          </div>
        )}

        {/* Guide Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-700 space-y-2">
          <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
            ¿Cómo vincular tu Bot de Telegram en 2 minutos?
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
              <strong className="block text-blue-700">Paso 1: Crear el Bot</strong>
              <p className="text-[11px] text-slate-600">
                Abre Telegram y busca <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-900 font-mono">@BotFather</code>. Escribe <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-900 font-mono">/newbot</code>, nómbralo y copia el Token.
              </p>
            </div>

            <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
              <strong className="block text-blue-700">Paso 2: Obtener tu Chat ID</strong>
              <p className="text-[11px] text-slate-600">
                Inicia tu bot recién creado presionando "Iniciar". Luego busca <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-900 font-mono">@userinfobot</code> para ver tu número de Chat ID.
              </p>
            </div>

            <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
              <strong className="block text-blue-700">Paso 3: Probar aquí</strong>
              <p className="text-[11px] text-slate-600">
                Pega el Token y tu Chat ID arriba y haz clic en <strong>"Enviar Orden de Prueba Completa al Bot"</strong> para recibir tu primer pedido en tu celular.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Gmail & Admin Alerts Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Gmail Autorizado del Administrador & Alertas de Órdenes
              </h3>
              <p className="text-xs text-slate-500">
                Este correo sirve para verificación obligatoria de identidad y recepción de pedidos.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.emailNotificationsEnabled}
              onChange={(e) => setFormData(prev => ({ ...prev, emailNotificationsEnabled: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Gmail Oficial del Administrador *
          </label>
          <input
            type="email"
            required
            value={formData.adminEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, adminEmail: e.target.value }))}
            placeholder="dr2490761@gmail.com"
            className="w-full max-w-md px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">
            Utilizado como verificación obligatoria de identidad para abrir el panel de control.
          </span>
        </div>
      </div>

      {/* Bank & Payment Information */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <span>Datos Bancarios para Pago de Órdenes (SPEI / OXXO)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Banco Receptor</label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
              placeholder="BBVA, Banorte, Santander..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Nombre del Beneficiario</label>
            <input
              type="text"
              value={formData.beneficiary}
              onChange={(e) => setFormData(prev => ({ ...prev, beneficiary: e.target.value }))}
              placeholder="Nombre de la empresa o titular"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">CLABE Interbancaria (18 dígitos)</label>
            <input
              type="text"
              value={formData.clabe}
              onChange={(e) => setFormData(prev => ({ ...prev, clabe: e.target.value }))}
              placeholder="012180001234567890"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 font-mono font-bold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Número de Tarjeta / Depósito OXXO</label>
            <input
              type="text"
              value={formData.oxxoNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, oxxoNumber: e.target.value }))}
              placeholder="4152 3138 9012 3456"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 font-mono font-bold focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Shipping Costs Configuration */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <Truck className="w-4 h-4 text-blue-600" />
          <span>Costos de Envío & Umbral de Envío Gratis</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Envío Local ({settings.currency})</label>
            <input
              type="number"
              min="0"
              value={formData.localCost}
              onChange={(e) => setFormData(prev => ({ ...prev, localCost: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 font-mono font-bold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Envío Nacional Express ({settings.currency})</label>
            <input
              type="number"
              min="0"
              value={formData.nationalCost}
              onChange={(e) => setFormData(prev => ({ ...prev, nationalCost: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 font-mono font-bold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Envío Gratis a partir de ({settings.currency})</label>
            <input
              type="number"
              min="0"
              value={formData.freeShippingThreshold}
              onChange={(e) => setFormData(prev => ({ ...prev, freeShippingThreshold: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 font-mono font-bold focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {savedSuccess && (
          <span className="text-xs text-emerald-700 flex items-center gap-1.5 font-bold animate-in fade-in">
            <Check className="w-4 h-4" />
            ¡Configuración guardada exitosamente!
          </span>
        )}
        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Configuración</span>
        </button>
      </div>

    </form>
  );
};
