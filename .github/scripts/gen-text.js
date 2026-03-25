import {createAIClient} from './ai-client.js';
import {SYSTEM_INSTRUCTION} from './config.js';

export async function generateText(prompt) {
  const ai = createAIClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Используем лучшую модель
      contents: prompt,
      systemInstruction: SYSTEM_INSTRUCTION,
      config: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });

    return response.text;
  } catch (err) {
    console.error('❌ Ошибка генерации Vertex AI:', err.message);
    throw err;
  }
}