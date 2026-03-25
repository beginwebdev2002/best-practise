'use strict';

const { GoogleGenAI } = require('@google/genai');
const { PROJECT_ID, LOCATION, API_KEY, credentials } = require('./config');

// ═══════════════════════════════════════════════════════════════
//  AI CLIENT FACTORY
//  Vertex AI (ADC via google-github-actions/auth) → primary
//  Gemini API key → local dev fallback
// ═══════════════════════════════════════════════════════════════

/**
 * createAIClient — returns a configured GoogleGenAI instance.
 *
 * Priority:
 *   1. Vertex AI (PROJECT_ID set) — uses ADC or GCP_SA_KEY credentials
 *   2. Gemini Developer API (GOOGLE_AI_API_KEY / GEMINI_API_KEY)
 */
function createAIClient() {
  if (PROJECT_ID) {
    console.log(`🔐 Vertex AI → project: ${PROJECT_ID}, location: ${LOCATION}`);
    return new GoogleGenAI({
      vertexai: true,
      project:  PROJECT_ID,
      location: LOCATION,
      googleAuthOptions: credentials ? { credentials } : undefined,
    });
  }

  const key = API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) {
    throw new Error(
      'No AI credentials. Set PROJECT_ID + GCP_SA_KEY (Vertex AI) or GOOGLE_AI_API_KEY (API key).'
    );
  }

  console.log('🔑 Gemini Developer API (API key fallback)');
  return new GoogleGenAI({ apiKey: key });
}

// ═══════════════════════════════════════════════════════════════
//  CONTENT BUNDLE — shared data store for the pipeline
// ═══════════════════════════════════════════════════════════════

/**
 * ContentBundle holds all generated assets flowing through the pipeline:
 *   copy   → Gemini-generated captions per platform
 *   images → Imagen 3 cover images (portrait + wide)
 *   video  → Veo 3 reel metadata & local path
 *   meta   → Meta API publish result IDs
 */
class ContentBundle {
  constructor() {
    /** @type {{ instagram: object|null, facebook: object|null }} */
    this.copy = { instagram: null, facebook: null };

    /** Generated cover images */
    this.images = {
      portrait: null,   // 9:16  → Instagram Reels cover
      wide:     null,   // 16:9  → Facebook / OG share image
    };

    /** Veo 3 video reel */
    this.video = { localPath: null, filename: null, operationName: null, publicUrl: null };

    /** Meta Graph API publishing results */
    this.meta = { igPublishId: null, fbPostId: null };
  }
}

module.exports = { createAIClient, ContentBundle };
