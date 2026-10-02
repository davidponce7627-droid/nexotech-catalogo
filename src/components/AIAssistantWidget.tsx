import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Bot, 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Phone, 
  ChevronDown, 
  Package, 
  ExternalLink,
  Minimize2,
  RefreshCw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  time: string;
}

export const AIAssistantWidget: React.FC = () => {
  const { settings, products, viewMode, setQuickViewProduct } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // If in admin view or AI assistant is disabled in settings, do not show widget
  if (viewMode === 'admin' || settings.aiAssistantEnabled === false) {
    return null;
  }

  // Initialize welcome message once
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          role: 'model',
          text: settings.aiAssistantWelcomeMessage || `¡Hola! 👋 Soy ${settings.aiAssistantName || 'el Asistente Virtual'} de ${settings.name}. ¿Qué refacción, puerto Type-C o celular estás buscando hoy?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [settings.aiAssistantWelcomeMessage, settings.aiAssistantName, settings.name]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    '🔌 ¿Tienen puertos Tipo-C de carga?',
    '📱 ¿Qué refacciones o pantallas tienen?',
    '📦 ¿Cuáles son los precios de mayoreo en USD?',
    '💬 Contactar asesor por WhatsApp'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    if (text.toLowerCase().includes('whatsapp') || text.toLowerCase().includes('contactar asesor')) {
      handleWhatsAppRedirect(text);
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-5).map(m => ({ role: m.role, text: m.text })),
          storeContext: settings,
          productsList: products
        })
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply || 'Estoy a tu disposición para cualquier consulta de catálogo o cotización.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'model',
          text: `Estamos actualizando nuestras conexiones técnicas. Puedes ver todo el catálogo disponible en la tienda o comunicarte con nosotros directamente vía WhatsApp al ${settings.whatsapp}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppRedirect = (customQuery?: string) => {
    const cleanNumber = (settings.whatsapp || '').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hola ${settings.name}, estaba consultando con su Asistente Virtual sobre: "${customQuery || 'información y cotización de refacciones'}" y deseo hablar con un asesor.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: settings.aiAssistantWelcomeMessage || '¡Hola! ¿En qué puedo ayudarte hoy?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer animate-in fade-in"
          title="Abrir Asistente Virtual de Ventas y Soporte"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-600 animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-tight pr-1">
            {settings.aiAssistantName || 'Asesor IA'}
          </span>
          <span className="hidden sm:inline-block text-[11px] bg-blue-500/40 px-2 py-0.5 rounded-full text-blue-100 font-semibold">
            En línea
          </span>
        </button>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[380px] h-[520px] max-h-[85vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <Bot className="w-5 h-5" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-tight leading-snug">
                  {settings.aiAssistantName || 'Asistente Virtual NexoBot'}
                </h3>
                <p className="text-[10px] text-blue-300 flex items-center gap-1">
                  <span>Asesoría Técnica y Ventas</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-semibold">Precios en {settings.currencyCode}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Reiniciar conversación"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Minimizar"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] font-semibold text-slate-700 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 rounded-full px-2.5 py-1 whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/70 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-2xs whitespace-pre-line leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs p-3 shadow-2xs flex items-center gap-1.5 text-slate-500">
                  <span className="text-[11px] font-semibold text-slate-600 mr-1">Consultando catálogo</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Direct WhatsApp Callout if enabled */}
          {settings.aiAssistantWhatsappDirect && (
            <div className="px-3 py-1.5 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-emerald-800 font-medium">
                ¿Prefieres cotizar con un técnico humano?
              </span>
              <button
                type="button"
                onClick={() => handleWhatsAppRedirect()}
                className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded border border-emerald-200"
              >
                <Phone className="w-2.5 h-2.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          )}

          {/* Message Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pregunta por un modelo, refacción o precio..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Enviar mensaje"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
