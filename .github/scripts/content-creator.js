/**
 * ============================================================
 * Autonomous Marketing Pipeline — Content Creator
 * Uses: @google/genai (Vertex AI), @google-cloud/storage, axios
 * Triggered by GitHub Releases via content-creator.yml
 * ============================================================
 */

'use strict';

const { GoogleGenAI } = require('@google/genai');
const { Storage }     = require('@google-cloud/storage');
const axios           = require('axios');
const fs              = require('fs');
const path            = require('path');

// ─── Environment Variables (DO NOT MODIFY) ──────────────────
const PROJECT_ID           = process.env.PROJECT_ID;
const LOCATION             = process.env.LOCATION || 'us-central1';
const API_KEY              = process.env.GOOGLE_AI_API_KEY;   // kept for compatibility
const NANO_BANANA_API_KEY  = process.env.NANO_BANANA_API_KEY;
const VEO3_API_KEY         = process.env.VEO3_API_KEY;
const BUFFER_ACCESS_TOKEN  = process.env.BUFFER_ACCESS_TOKEN;
const BUFFER_PROFILE_IDS   = process.env.BUFFER_PROFILE_IDS;
const BUFFER_API           = process.env.BUFFER_API;
const GCP_SA_KEY           = process.env.GCP_SA_KEY;
const BUCKET_NAME          = process.env.GCS_MARKETING_BUCKET;
const RELEASE_BODY         = process.env.RELEASE_BODY || 'New release with performance improvements.';
const RELEASE_TAG          = process.env.RELEASE_TAG  || '@latest';
const RELEASE_URL          = process.env.RELEASE_URL  || 'https://github.com/beginwebdev2002/best-practise/releases';
// ─────────────────────────────────────────────────────────────

/**
 * Selects the correct GoogleGenAI init strategy:
 *  - Vertex AI: when PROJECT_ID is present (preferred in CI — uses ADC via google-github-actions/auth)
 *  - API Key:   fallback for local development / non-GCP runners
 */
function createAIClient() {
  if (PROJECT_ID) {
    console.log(`🔐 Using Vertex AI (project: ${PROJECT_ID}, location: ${LOCATION})`);
    return new GoogleGenAI({
      vertexai: true,
      project:  PROJECT_ID,
      location: LOCATION,
    });
  }

  const key = API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) throw new Error('No AI credentials found. Set PROJECT_ID (Vertex) or GOOGLE_AI_API_KEY.');
  console.log('🔑 Using Gemini Developer API (API key)');
  return new GoogleGenAI({ apiKey: key });
}

// ─── Pipeline Result Store ───────────────────────────────────
class PipelineResults {
  constructor() {
    this.text  = { linkedin: null, x: null };
    this.media = { image: null, video: null };
  }
}

// ════════════════════════════════════════════════════════════
//  AIProductionEngine
// ════════════════════════════════════════════════════════════
class AIProductionEngine {
  constructor() {
    this.ai      = createAIClient();
    this.storage = new Storage();               // Uses ADC (set by google-github-actions/auth)
    this.results = new PipelineResults();
  }

  // ──────────────────────────────────────────────────────────
  async run() {
    console.log('\n🚀 ══════ Starting Autonomous Marketing Pipeline ══════');
    console.log(`📅 Release: ${RELEASE_TAG}  |  URL: ${RELEASE_URL}\n`);

    await this.generateContent();
    await this.generateVisuals();
    await this.generateMotion();
    await this.uploadToGCS();
    await this.publishToBuffer();

    console.log('\n✨ ══════ Pipeline completed successfully ══════\n');
    this.logSummary();
  }

  // ──────────────────────────────────────────────────────────
  /**
   * MODULE 1 — TEXT GENERATION (Gemini 2.5 Pro via Vertex AI)
   *
   * Uses the new @google/genai API:
   *   ai.models.generateContent({ model, contents, config })
   *
   * Returns parsed JSON with linkedin + x keys.
   */
  async generateContent() {
    console.log('📝 [Module 1] Generating copy with Gemini 2.5 Pro...');

    const MODEL = 'gemini-2.5-pro';

    const systemInstruction = [
      'You are a Senior Tech Marketing Copywriter specialising in developer tools.',
      'Your output MUST be strict JSON with two keys: "linkedin" and "x".',
      'No markdown fences, no extra keys, no comments — only valid JSON.',
    ].join(' ');

    const prompt = `
Project: best-practise — a Vibe Coding educational platform (Angular 20+, NestJS, best web practices).
Release Tag: ${RELEASE_TAG}
Release URL: ${RELEASE_URL}

Release Notes:
"""
${RELEASE_BODY}
"""

Write two social media posts about this release:

1. "linkedin" — 1200 chars max, AIDA format (Attention → Interest → Desire → Action).
   Must include: headline, 3 bullet points with emoji, a call-to-action with the release URL.

2. "x" — 280 chars max, PAS format (Problem → Agitation → Solution).
   Must end with the short release tag and relevant hashtags (#AngularDev #VibeCoding #OpenSource).

Return ONLY the JSON object, nothing else.
`.trim();

    try {
      const response = await this.ai.models.generateContent({
        model:    MODEL,
        contents: prompt,
        config: {
          systemInstruction,
          temperature:    0.7,
          topP:           0.9,
          maxOutputTokens: 2048,
        },
      });

      // response.text is the direct string accessor in @google/genai
      let raw = (response.text || '').trim();

      // Strip any accidental markdown fences the model may have added
      raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

      this.results.text = JSON.parse(raw);
      console.log('   ✅ Copy generated — LinkedIn + X posts ready.');
    } catch (err) {
      console.error('   ❌ Gemini text error:', err.message);
      // Graceful fallback so the pipeline continues
      this.results.text = {
        linkedin: `🚀 ${RELEASE_TAG} is live!\n\nExplore what's new in best-practise.\n👉 ${RELEASE_URL}\n\n#AngularDev #VibeCoding`,
        x:        `🚀 ${RELEASE_TAG} just dropped! Explore the latest in #AngularDev & #VibeCoding → ${RELEASE_URL}`,
      };
    }
  }

  // ──────────────────────────────────────────────────────────
  /**
   * MODULE 2 — IMAGE GENERATION (Imagen 3 via Vertex AI)
   *
   * Uses the correct @google/genai API:
   *   ai.models.generateImages({ model, prompt, config })
   *
   * Note: generateImages is a Vertex AI only feature.
   */
  async generateVisuals() {
    console.log('🎨 [Module 2] Generating 4K cover with Imagen 3...');

    const MODEL = 'imagen-3.0-generate-002';

    const prompt = [
      `Professional 4K tech illustration for software release "${RELEASE_TAG}".`,
      'Futuristic architecture visualization, Angular framework aesthetic,',
      'deep space gradient background (#0F0F1A to #1A1A3E),',
      'glowing circuit lines, cinematic depth-of-field, ultra-sharp, 16:9 format.',
    ].join(' ');

    try {
      const response = await this.ai.models.generateImages({
        model:  MODEL,
        prompt,
        config: {
          numberOfImages: 1,
          aspectRatio:    '16:9',
          outputMimeType: 'image/png',
        },
      });

      // @google/genai: response.generatedImages[0].image.imageBytes (base64)
      const imageBytes = response?.generatedImages?.[0]?.image?.imageBytes;
      if (!imageBytes) throw new Error('No image data returned from Imagen 3.');

      const filename  = `release-${RELEASE_TAG.replace(/[@/]/g, '-')}-cover.png`;
      const localPath = path.join(process.cwd(), filename);
      fs.writeFileSync(localPath, imageBytes, 'base64');

      this.results.media.image = { localPath, filename };
      console.log(`   ✅ Cover image saved → ${filename}`);
    } catch (err) {
      console.error('   ❌ Imagen 3 error:', err.message);
      console.log('   ⚠️  Continuing without image asset.');
    }
  }

  // ──────────────────────────────────────────────────────────
  /**
   * MODULE 3 — VIDEO GENERATION (Veo 3 — async job pattern)
   *
   * Veo 3 operations are long-running. We submit and acknowledge
   * but do not block the pipeline waiting for completion.
   * In production, wire up polling with ai.operations.get().
   */
  async generateMotion() {
    console.log('🎥 [Module 3] Submitting Veo 3 motion teaser request...');

    const MODEL  = 'veo-3.0-generate-preview';
    const prompt = [
      `Cinematic 5-second looping teaser for software release "${RELEASE_TAG}".`,
      'Angular logo morphing into a galaxy of glowing components,',
      'fast cut motion graphics, electric blue & violet palette, 4K 60fps.',
    ].join(' ');

    try {
      // Note: generateVideo returns a long-running operation in Vertex AI.
      // We use the operations API to track it if needed.
      const operation = await this.ai.models.generateVideos({
        model:  MODEL,
        prompt,
        config: { durationSeconds: 5, aspectRatio: '16:9' },
      });

      console.log(`   ✅ Video operation submitted: ${operation.name || '(operation started)'}`);

      // Register expected output path for GCS upload if/when ready
      const filename  = `release-${RELEASE_TAG.replace(/[@/]/g, '-')}-teaser.mp4`;
      const localPath = path.join(process.cwd(), filename);
      this.results.media.video = { localPath, filename, operationName: operation.name };
    } catch (err) {
      // Veo 3 is in preview — treat errors as non-fatal
      console.warn('   ⚠️  Veo 3 warning (non-fatal):', err.message);
      const filename  = `release-${RELEASE_TAG.replace(/[@/]/g, '-')}-teaser.mp4`;
      this.results.media.video = { localPath: null, filename, operationName: null };
    }
  }

  // ──────────────────────────────────────────────────────────
  /**
   * MODULE 4 — PERSISTENCE (Google Cloud Storage)
   *
   * Authentication: Application Default Credentials injected by
   * `google-github-actions/auth@v2` in the workflow — no manual
   * key parsing required.
   */
  async uploadToGCS() {
    if (!BUCKET_NAME) {
      console.log('☁️  [Module 4] GCS_MARKETING_BUCKET not set — skipping upload.');
      return;
    }

    console.log(`☁️  [Module 4] Uploading assets to gs://${BUCKET_NAME}/marketing/...`);

    for (const [key, asset] of Object.entries(this.results.media)) {
      if (!asset?.localPath || !fs.existsSync(asset.localPath)) continue;
      try {
        const destination = `marketing/${RELEASE_TAG.replace(/[@/]/g, '-')}/${asset.filename}`;
        await this.storage.bucket(BUCKET_NAME).upload(asset.localPath, {
          destination,
          public: true,
          metadata: {
            contentType: key === 'image' ? 'image/png' : 'video/mp4',
            cacheControl: 'public, max-age=86400',
            metadata: { releaseTag: RELEASE_TAG, releaseUrl: RELEASE_URL },
          },
        });
        asset.publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${destination}`;
        console.log(`   ✅ Uploaded ${key}: ${asset.publicUrl}`);
      } catch (err) {
        console.error(`   ❌ GCS upload error (${key}):`, err.message);
      }
    }
  }

  // ──────────────────────────────────────────────────────────
  /**
   * MODULE 5 — BUFFER SOCIAL PUBLISHING (Buffer API v2)
   *
   * Posts to all configured profiles (LinkedIn, X/Twitter, etc.)
   * Each profile receives a tailored post (LinkedIn copy for LinkedIn,
   * X copy for everything else).
   *
   * Buffer API v2: https://buffer.com/developers/api/v2
   */
  async publishToBuffer() {
    if (!BUFFER_ACCESS_TOKEN) {
      console.log('📢 [Module 5] BUFFER_ACCESS_TOKEN not set — skipping publish.');
      return;
    }

    const profiles = (BUFFER_PROFILE_IDS || '')
      .split(',')
      .map(id => id.trim())
      .filter(Boolean);

    if (!profiles.length) {
      console.log('📢 [Module 5] No BUFFER_PROFILE_IDS configured — skipping publish.');
      return;
    }

    console.log(`📢 [Module 5] Publishing to ${profiles.length} Buffer profile(s)...`);

    const baseUrl = (BUFFER_API || 'https://api.bufferapp.com').replace(/\/$/, '');
    const imageUrl = this.results.media.image?.publicUrl || null;

    for (const profileId of profiles) {
      // Detect profile type by inspecting Buffer's profile data
      // (simple heuristic: LinkedIn copy for linkedin-type posts, X copy for others)
      const isLinkedIn = await this.isLinkedInProfile(profileId, baseUrl);
      const text = isLinkedIn
        ? (this.results.text.linkedin || 'New release is live!')
        : (this.results.text.x       || 'New release is live!');

      const payload = {
        profile_ids: [profileId],
        text,
        scheduled_at: 'now',
        ...(imageUrl ? { media: { photo: imageUrl, thumbnail: imageUrl } } : {}),
      };

      try {
        const resp = await axios.post(
          `${baseUrl}/1/updates/create.json`,
          payload,
          {
            params:  { access_token: BUFFER_ACCESS_TOKEN },
            headers: { 'Content-Type': 'application/json' },
            timeout: 15_000,
          }
        );

        if (resp.data?.success) {
          console.log(`   ✅ Posted to profile ${profileId}`);
        } else {
          console.warn(`   ⚠️  Buffer responded but success=false for ${profileId}:`, resp.data);
        }
      } catch (err) {
        const detail = err.response?.data ?? err.message;
        console.error(`   ❌ Buffer error (${profileId}):`, detail);
      }
    }

    // Persist pipeline artifacts for inspection / debugging
    const artifactPath = path.join(process.cwd(), 'buffer-payload.json');
    fs.writeFileSync(artifactPath, JSON.stringify(this.results, null, 2));
    console.log(`   📄 Pipeline artifacts saved → ${artifactPath}`);
  }

  // ──────────────────────────────────────────────────────────
  /** Check if a Buffer profile is LinkedIn (best-effort). */
  async isLinkedInProfile(profileId, baseUrl) {
    try {
      const { data } = await axios.get(`${baseUrl}/1/profiles/${profileId}.json`, {
        params:  { access_token: BUFFER_ACCESS_TOKEN },
        timeout: 8_000,
      });
      return (data?.service || '').toLowerCase().includes('linkedin');
    } catch {
      return false; // default to X-style copy on error
    }
  }

  // ──────────────────────────────────────────────────────────
  logSummary() {
    console.log('╔════════════════════════════════════════╗');
    console.log('║       PIPELINE SUMMARY                 ║');
    console.log('╠════════════════════════════════════════╣');
    console.log(`║  Release : ${RELEASE_TAG.padEnd(27)}║`);
    console.log(`║  LinkedIn: ${(this.results.text.linkedin ? '✅ Ready' : '⚠️  Fallback').padEnd(27)}║`);
    console.log(`║  X Post  : ${(this.results.text.x        ? '✅ Ready' : '⚠️  Fallback').padEnd(27)}║`);
    console.log(`║  Image   : ${(this.results.media.image?.publicUrl ? '✅ Uploaded' : '⚠️  Skipped').padEnd(27)}║`);
    console.log(`║  Video   : ${(this.results.media.video?.operationName ? '✅ Submitted' : '⚠️  Skipped').padEnd(27)}║`);
    console.log('╚════════════════════════════════════════╝');
  }
}

// ─── Entry Point ─────────────────────────────────────────────
(async () => {
  const engine = new AIProductionEngine();
  try {
    await engine.run();
  } catch (err) {
    console.error('\n🛑 Fatal pipeline failure:', err);
    process.exit(1);
  }
})();