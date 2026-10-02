import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Bot, 
  Sparkles, 
  Save, 
  Check, 
  MessageSquare, 
  Sliders, 
  Phone, 
  Send, 
  RefreshCw,
  HelpCircle,
  Lightbulb,
  ShieldCheck
} from 'lucide-react';

export const AIAssistantSettings: React.FC = () => {
  const { settings, updateSettings, products } = useStore();
  const [formData, setFormData] = useState({
    aiAssistantEnabled: settings.aiAssistantEnabled ?? true,
    aiAssistantName: settings.aiAssistantName || 'NexoBot Asesor Técnico',
    aiAssistantWelcomeMessage: settings.aiAssistantWelcomeMessage || '¡Hola! 👋 Soy tu Asistente de Ventas y Consultas Técnicas de NEXO TECH. ¿Buscas alguna refacción, puerto Type-C o teléfono móvil?',
    aiAssistantTone: settings.aiAssistantTone || 'comercial',
    aiAssistantCustomPrompt: settings.aiAssistantCustomPrompt || 'Eres el asesor técnico de ventas oficial de NEXO TECH. Tu objetivo es ayudar a los clientes a encontrar la refacción exacta para su modelo de celular, resolver dudas de compatibilidad de puertos Tipo C y pantallas, recomendar compras por mayoreo para técnicos, y facilitar el contacto por WhatsApp.',
    aiAssistantKnowledgeNotes: settings.aiAssistantKnowledgeNotes || 'Ofrecemos garantía de 30 días con sellos intactos. Envíos a todo el país. Precios de mayoreo a partir de 5 unidades por producto.',
    aiAssistantWhatsappDirect: settings.aiAssistantWhatsappDirect ?? true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  
  // Test chat inside the admin tab
  const [testMessages, setTestMessages] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    { role: 'model', text: formData.aiAssistantWelcomeMessage }
  ]);
  const [testInput, setTestInput] = useState('');
  const [isTestLoading, setIsTestLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSendTestMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim() || isTestLoading) return;

    const userText = testInput.trim();
    setTestInput('');
    const newHistory = [...testMessages, { role: 'user' as const, text: userText }];
    setTestMessages(newHistory);
    setIsTestLoading(true);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: newHistory.slice(-4),
          storeContext: {
            ...settings,
            ...formData
          },
          productsList: products
        })
      });

      const data = await res.json();
      setTestMessages([...newHistory, { role: 'model', text: data.reply || 'Sin respuesta' }]);
    } catch {
      setTestMessages([
        ...newHistory, 
        { role: 'model', text: 'Error al conectar con el servidor del asistente.' }
      ]);
    } finally {
      setIsTestLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-5 text-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-blue-300" />
          </div>
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <span>Agente Inteligente de IA (Ventas & Soporte Técnico)</span>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-bold ${
                formData.aiAssistantEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-700 text-slate-300'
              }`}>
                {formData.aiAssistantEnabled ? 'Activo en Tienda' : 'Desactivado'}
              </span>
            </h2>
            <p className="text-xs text-blue-200/80 mt-0.5">
              Atiende a tus clientes 24/7, asesora sobre compatibilidad de refacciones, precios en USD y conecta con tu WhatsApp.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const next = !formData.aiAssistantEnabled;
            setFormData(prev => ({ ...prev, aiAssistantEnabled: next }));
            updateSettings({ aiAssistantEnabled: next });
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs ${
            formData.aiAssistantEnabled
              ? 'bg-rose-500 hover:bg-rose-600 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {formData.aiAssistantEnabled ? 'Desactivar Asistente' : 'Activar en la Tienda'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Configuration Form (7 cols) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Configuración del Agente</span>
            </h3>

            {/* Bot Name & Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre del Asistente
                </label>
                <input
                  type="text"
                  required
                  value={formData.aiAssistantName}
                  onChange={(e) => setFormData(prev => ({ ...prev, aiAssistantName: e.target.value }))}
                  placeholder="Ej. NexoBot Asesor Técnico"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tono de Comunicación
                </label>
                <select
                  value={formData.aiAssistantTone}
                  onChange={(e) => setFormData(prev => ({ ...prev, aiAssistantTone: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="comercial">Comercial & Vendedor Persuasivo</option>
                  <option value="tecnico">Técnico Especializado (Microelectrónica)</option>
                  <option value="amigable">Amigable, Cercano y Servicial</option>
                  <option value="directo">Directo, Breve y Eficiente</option>
                </select>
              </div>
            </div>

            {/* Welcome Message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mensaje de Bienvenida al abrir el chat
              </label>
              <textarea
                rows={2}
                required
                value={formData.aiAssistantWelcomeMessage}
                onChange={(e) => setFormData(prev => ({ ...prev, aiAssistantWelcomeMessage: e.target.value }))}
                placeholder="¡Hola! ¿Buscas alguna refacción o teléfono móvil?"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white leading-relaxed"
              />
            </div>

            {/* Custom Instructions / System Prompt */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Instrucciones Personalizadas (Prompt Maestro)
                </label>
                <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  Define su comportamiento
                </span>
              </div>
              <textarea
                rows={4}
                value={formData.aiAssistantCustomPrompt}
                onChange={(e) => setFormData(prev => ({ ...prev, aiAssistantCustomPrompt: e.target.value }))}
                placeholder="Indica promociones vigentes, marcas prioritarias, etc."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white leading-relaxed font-sans"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                El asistente tiene acceso automático en tiempo real a todo el catálogo de productos ({products.length} artículos), stock y precios en {settings.currencyCode}.
              </span>
            </div>

            {/* Additional Knowledge & Policies */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Políticas y Conocimiento Adicional
              </label>
              <textarea
                rows={3}
                value={formData.aiAssistantKnowledgeNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, aiAssistantKnowledgeNotes: e.target.value }))}
                placeholder="Garantías, horarios de corte de envíos, envíos internacionales..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white leading-relaxed font-sans"
              />
            </div>

            {/* WhatsApp Integration Switch */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Enlace directo a WhatsApp en el Chat
                </span>
                <span className="text-[11px] text-slate-500">
                  Muestra un botón rápido para transferir la conversación al WhatsApp oficial ({settings.whatsapp}).
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.aiAssistantWhatsappDirect}
                onChange={(e) => setFormData(prev => ({ ...prev, aiAssistantWhatsappDirect: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
              />
            </div>

            {/* Save Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs text-emerald-700 flex items-center gap-1.5 font-bold animate-in fade-in">
                  <Check className="w-4 h-4" />
                  ¡Configuración del Agente guardada con éxito!
                </span>
              ) : <div />}

              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Configuración</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Simulator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex-1 flex flex-col h-[520px]">
            {/* Simulator Header */}
            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight">{formData.aiAssistantName}</h4>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Simulador en Vivo (Gemini 3.8 Flash)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTestMessages([{ role: 'model', text: formData.aiAssistantWelcomeMessage }])}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title="Reiniciar chat"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50 text-xs">
              {testMessages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-xl p-3 shadow-2xs whitespace-pre-line leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTestLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-xl rounded-bl-none p-3 shadow-2xs flex items-center gap-1.5 text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendTestMessage} className="p-2.5 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Escribe una pregunta para probar el bot..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
              <button
                type="submit"
                disabled={isTestLoading || !testInput.trim()}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};
