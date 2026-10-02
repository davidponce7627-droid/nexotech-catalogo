import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Shared Gemini client utility with telemetry header
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Assistant route for Sales, Product Consultations & Technical Support
  app.post('/api/gemini/assistant', async (req: Request, res: Response) => {
    try {
      const { 
        message, 
        history = [], 
        storeContext = {},
        productsList = []
      } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Mensaje requerido' });
        return;
      }

      const storeName = storeContext.name || 'NEXO TECH';
      const currency = storeContext.currency || '$';
      const currencyCode = storeContext.currencyCode || 'USD';
      const botName = storeContext.aiAssistantName || 'NexoBot';
      const tone = storeContext.aiAssistantTone || 'comercial';
      const customPrompt = storeContext.aiAssistantCustomPrompt || '';
      const knowledgeNotes = storeContext.aiAssistantKnowledgeNotes || '';
      const whatsapp = storeContext.whatsapp || '';
      const warranty = storeContext.warrantyPolicy || '30 días de garantía en refacciones con sellos intactos.';
      const wholesaleMinQty = storeContext.wholesaleMinQty || 5;

      // Build product catalog summary for the AI context (top relevant products or compact list)
      const productsSummary = Array.isArray(productsList) 
        ? productsList.slice(0, 35).map((p: any) => 
            `- ${p.name} (SKU: ${p.sku}, Marca: ${p.brand || 'Genérica'}): Menudeo ${currency}${p.priceRetail} ${currencyCode}, Mayoreo (${wholesaleMinQty}+ pzs): ${currency}${p.priceWholesale} ${currencyCode}. Stock: ${p.stock > 0 ? `${p.stock} pzs disponibles` : 'Agotado'}. Compatibilidad: ${(p.compatibility || []).join(', ')}`
          ).join('\n')
        : '';

      const systemInstruction = `
Eres "${botName}", el Agente Inteligente Oficial de Ventas, Asesoría Técnica y Atención al Cliente de "${storeName}".
Tu misión principal es asesorar a clientes, técnicos de reparación y talleres para encontrar la pieza exacta, resolver dudas de compatibilidad, explicar precios de menudeo y mayoreo en ${currencyCode} (${currency}), e invitarlos a realizar su pedido o contactar por WhatsApp.

TONO DE COMUNICACIÓN: ${tone.toUpperCase()}. Sé profesional, empático, claro y muy servicial.
INFORMACIÓN DE LA TIENDA:
- Moneda oficial: ${currencyCode} (${currency}).
- Teléfono / WhatsApp oficial: ${whatsapp}.
- Mínimo de piezas para precio de mayoreo: ${wholesaleMinQty} piezas.
- Política de garantía: ${warranty}.
${knowledgeNotes ? `- Notas y políticas adicionales: ${knowledgeNotes}` : ''}
${customPrompt ? `- Directriz específica del administrador: ${customPrompt}` : ''}

CATÁLOGO ACTUAL DE REFACCIONES Y PRODUCTOS:
${productsSummary || 'Catálogo amplio de puertos USB Tipo-C, pantallas OLED, celulares, herramientas de reparación y refacciones de alta precisión.'}

REGLAS DE RESPUESTA:
1. Responde siempre en español.
2. Si el cliente pregunta por una refacción o modelo, busca en el catálogo y menciona el nombre exacto, precio en ${currencyCode}, stock actual y si califica para mayoreo.
3. Si el cliente busca asesoría técnica sobre cómo cambiar un puerto Tipo-C o compatibilidad de pantallas, explícalo con brevedad técnica y recomienda llevarlo a un técnico si no cuenta con pistola de calor/microscopio.
4. Si no encuentras la refacción exacta en la lista, indícale amablemente que manejamos importación bajo pedido y sugiérele comunicarse al WhatsApp ${whatsapp}.
5. Mantén las respuestas estructuradas, con viñetas o negritas para facilitar la lectura en móviles.
`.trim();

      // Format conversation contents for Gemini API
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          if (item && item.text && (item.role === 'user' || item.role === 'model')) {
            contents.push({
              role: item.role,
              parts: [{ text: item.text }]
            });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      // Call Gemini 3.8 Flash model
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || 'Con gusto te atiendo. ¿En qué refacción o modelo de celular puedo ayudarte hoy?';

      res.json({ reply });
    } catch (error: any) {
      console.error('Error in /api/gemini/assistant:', error);
      // Graceful fallback response
      res.json({
        reply: 'Hola. En este momento estamos actualizando la consulta en tiempo real. Puedes revisar nuestro catálogo de refacciones arriba o escribirnos directamente a nuestro WhatsApp oficial para cotizaciones inmediatas.'
      });
    }
  });

  // Mount Vite middleware in development; serve dist in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
