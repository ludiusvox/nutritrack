/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

// Increase limit to handle base64 image data uploads from camera
app.use(express.json({ limit: '15mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Gemini Analysis API
app.post('/api/gemini/analyze', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', description } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
      console.warn('GEMINI_API_KEY is not configured or placeholder. Returning simulated high-fidelity food analysis.');
      
      // Smart simulation based on food descriptions or general values
      const lowerDesc = (description || 'meal').toLowerCase();
      let simulatedResult = {
        foodName: "Grilled Chicken & Avocado Salad",
        calories: 520,
        carbs: 18,
        protein: 38,
        fat: 32,
        caffeineMg: 0,
        nicotineMg: 0,
        ingredients: ["Grilled chicken breast", "Fresh Hass avocado", "Cherry tomatoes", "Mixed salad greens", "Olive oil dressing", "Cucumber slice"],
        advice: "Excellent low-carb, high-protein choice! The avocados provide healthy fats that promote longer satiety. Recommended post-workout fuel.",
        confidence: 0.95
      };

      if (lowerDesc.includes('oat') || lowerDesc.includes('berry') || lowerDesc.includes('breakfast')) {
        simulatedResult = {
          foodName: "Oatmeal with Blueberries & Almonds",
          calories: 380,
          carbs: 58,
          protein: 12,
          fat: 10,
          caffeineMg: 0,
          nicotineMg: 0,
          ingredients: ["Steel-cut oats", "Organic blueberries", "Shaved almonds", "Honey drizzle", "Chia seeds"],
          advice: "Great slow-digesting complex carbohydrate source. Perfect pre-workout fuel to elevate glycogen stores gradually.",
          confidence: 0.92
        };
      } else if (lowerDesc.includes('coffee') || lowerDesc.includes('caffeine') || lowerDesc.includes('caff')) {
        simulatedResult = {
          foodName: "Black Coffee / Espresso",
          calories: 5,
          carbs: 1,
          protein: 0,
          fat: 0,
          caffeineMg: 80,
          nicotineMg: 0,
          ingredients: ["Arabica coffee beans", "Filtered water"],
          advice: "Excellent cognitive stimulant. Restrict intake afternoon to avoid negative impact on deep sleep cycles.",
          confidence: 0.99
        };
      } else if (lowerDesc.includes('snus') || lowerDesc.includes('nicotine') || lowerDesc.includes('nic')) {
        simulatedResult = {
          foodName: "Nicotine Pouch / Snus (Mint)",
          calories: 0,
          carbs: 0,
          protein: 0,
          fat: 0,
          caffeineMg: 0,
          nicotineMg: 4,
          ingredients: ["Nicotine salts", "Cellulose base", "Cooling mint flavoring"],
          advice: "Acts as a potent central nervous system stimulant. Be mindful of potential vascular tightness during heavy weightlifting.",
          confidence: 0.98
        };
      } else if (lowerDesc.includes('salmon') || lowerDesc.includes('fish') || lowerDesc.includes('dinner')) {
        simulatedResult = {
          foodName: "Glazed Salmon & Asparagus",
          calories: 680,
          carbs: 12,
          protein: 48,
          fat: 42,
          caffeineMg: 0,
          nicotineMg: 0,
          ingredients: ["Atlantic salmon fillet", "Asparagus spears", "Garlic butter glaze", "Lemon juice"],
          advice: "Rich in omega-3 fatty acids and highly bioavailable proteins. Promotes optimal muscle tissue repair and joint health.",
          confidence: 0.94
        };
      } else if (lowerDesc.includes('reese') || lowerDesc.includes('peanut') || lowerDesc.includes('cup') || lowerDesc.includes('chocolate')) {
        simulatedResult = {
          foodName: "Reese's Peanut Butter Cup (Single)",
          calories: 210,
          carbs: 24,
          protein: 4,
          fat: 12,
          caffeineMg: 5,
          nicotineMg: 0,
          ingredients: ["Milk chocolate coat", "Peanut butter center", "Sucrose", "Dextrose"],
          advice: "High in simple glycemic sugars and saturated fats. Best consumed right around extreme athletic bouts as a fast fuel option.",
          confidence: 0.97
        };
      }

      return res.json({
        ...simulatedResult,
        isSimulated: true,
        message: 'Operating in Evaluation Mode (Missing GEMINI_API_KEY in Secrets Panel).'
      });
    }

    // Initialize the GoogleGenAI client with correct headers as per system instructions
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    let parts: any[] = [];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType,
          data: imageBase64
        }
      });
    }

    const textPrompt = `You are a professional nutrition expert and athletic food photography analyst. 
    Analyze this food image ${description ? `or description: "${description}"` : ''} and output detailed nutrition statistics.
    Determine:
    1. Estimations of calories, protein (g), carbs (g), and fats (g).
    2. Approximate ingredients.
    3. Check if any common workout stimulants are present (Caffeine in mg, Nicotine in mg).
    4. Provide friendly, actionable fitness-focused advice (e.g., recommend pre/post workout carb loading).
    5. Confidence calculation score between 0 and 1.
    Return the result strictly in JSON complying with the requested schema.`;

    parts.push({ text: textPrompt });

    const contents = imageBase64 
      ? { parts }
      : textPrompt;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: {
              type: Type.STRING,
              description: 'The recognized primary food item name.'
            },
            calories: {
              type: Type.INTEGER,
              description: 'Calorie estimate in kcal.'
            },
            carbs: {
              type: Type.INTEGER,
              description: 'Carbohydrates amount in grams.'
            },
            protein: {
              type: Type.INTEGER,
              description: 'Protein amount in grams.'
            },
            fat: {
              type: Type.INTEGER,
              description: 'Fat amount in grams.'
            },
            caffeineMg: {
              type: Type.INTEGER,
              description: 'Estimated caffeine level in milligrams (0 if none).'
            },
            nicotineMg: {
              type: Type.INTEGER,
              description: 'Estimated nicotine level in milligrams (0 if none).'
            },
            ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of ingredients detected.'
            },
            advice: {
              type: Type.STRING,
              description: 'Brief metabolic or workout-fuel advice tailored to this meal.'
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Your confidence rating (0 to 1) of the analysis.'
            }
          },
          required: [
            'foodName',
            'calories',
            'carbs',
            'protein',
            'fat',
            'caffeineMg',
            'nicotineMg',
            'ingredients',
            'advice',
            'confidence'
          ]
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({
      ...parsedData,
      isSimulated: false
    });
  } catch (error: any) {
    console.error('Gemini API analysis failed:', error);
    return res.status(500).json({
      error: error.message || 'Failed to complete image analysis via Gemini.',
    });
  }
});

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully started on http://localhost:${PORT}`);
  });
}

startServer();
