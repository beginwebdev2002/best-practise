import { GoogleGenAI } from '@google/genai';
import {CREDENTIALS, LOCATION, PROJECT_ID, API_KEY} from './config.js'


export function createAIClient() {
  if (PROJECT_ID) {
    console.log(`🔐 Vertex AI → project: ${PROJECT_ID}, location: ${LOCATION}`);
    return new GoogleGenAI({
      vertexai: true,          // ВКЛЮЧАЕМ VERTEX AI
      project:  PROJECT_ID,
      location: LOCATION,
      googleAuthOptions: CREDENTIALS ? { credentials: CREDENTIALS } : undefined 
    });
  }

  // Если PROJECT_ID нет, используем обычный API Key
  return new GoogleGenAI({ apiKey: API_KEY });
}