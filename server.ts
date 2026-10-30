import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI with GEMINI_API_KEY from environment
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

/**
 * Live Solar Intelligence with Google Search Grounding
 * Uses model 'gemini-3.8-flash' with googleSearch tool
 */
app.post('/api/solar-intelligence', async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, stateOrDiscom, topic } = req.body;

    const userPrompt = query || 
      `Provide the latest up-to-date solar policy, subsidy rates (including PM Surya Ghar Muft Bijli Yojana or state subsidies), net metering regulations, DISCOM approval process, and current average solar rooftop installation cost per kW for: ${stateOrDiscom || 'National / General'}. Focus on actionable, accurate figures and cite official dates or guidelines.`;

    const systemInstruction = `You are a real-time Solar Energy Intelligence expert.
You have access to Google Search to retrieve live, current, grounded solar energy policy data, government subsidies (e.g. PM Surya Ghar Muft Bijli Yojana, State DISCOM Net Metering regulations, Federal ITC, etc.), and benchmark turnkey installation costs.
Provide clear, structured answers with:
1. Executive Summary & Current Status
2. Subsidy Structure & Slabs (e.g. up to 1kW, 2kW, 3kW+)
3. Net Metering / Feed-in Tariff rules for the specific DISCOM / State
4. Current Benchmark EPC Cost per kW
5. Required Documentation & Approval Timeline
Always be factual, accurate, and clearly list sources from the search results.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;

    // Extract grounding search queries and chunks/sources
    const searchQueries = groundingMetadata?.webSearchQueries || [];
    const sources = groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Source',
      url: chunk.web?.uri || '',
    })).filter((s: any) => s.url) || [];

    res.json({
      text: response.text || 'No response generated.',
      searchQueries,
      sources,
      grounded: !!groundingMetadata,
    });
  } catch (error: any) {
    console.error('Error in /api/solar-intelligence:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch grounded solar intelligence.',
      fallback: true,
    });
  }
});

// Vite Middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SunFlow Solar CRM server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
