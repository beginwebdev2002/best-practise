/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║   Autonomous Social Media Content Creator                    ║
 * ║   Platforms : Instagram · YouTube · TikTok                   ║
 * ║   AI Stack  : Gemini 2.5 Pro · Imagen 3 · Veo 3 (Vertex AI)  ║
 * ║   Publish   : Buffer API v1                                  ║
 * ║   Storage   : Google Cloud Storage                           ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 *  Triggered on every GitHub Release via content-creator.yml
 *  Reads: release notes + tag + URL
 *  Generates: per-platform caption, hashtags, cover image, video teaser
 *  Publishes: via Buffer to Instagram, YouTube, TikTok
 */

'use strict';

const { GoogleGenAI } = require('@google/genai');
const { Storage }     = require('@google-cloud/storage');
const axios           = require('axios');
const fs              = require('fs');
const path            = require('path');

// ═══════════════════════════════════════════════════════════════
//  ENVIRONMENT VARIABLES  ← DO NOT MODIFY OR DELETE
// ═══════════════════════════════════════════════════════════════
const PROJECT_ID          = process.env.PROJECT_ID;
const LOCATION            = process.env.LOCATION            || 'us-central1';
const API_KEY             = process.env.GOOGLE_AI_API_KEY;          // Gemini API key (fallback)
const NANO_BANANA_API_KEY = process.env.NANO_BANANA_API_KEY;        // Reserved for Nano Banana
const VEO3_API_KEY        = process.env.VEO3_API_KEY;               // Reserved / Veo 3 direct
const BUFFER_ACCESS_TOKEN = process.env.BUFFER_ACCESS_TOKEN;
const BUFFER_PROFILE_IDS  = process.env.BUFFER_PROFILE_IDS;         // "id1,id2,id3" (IG,YT,TT)
const BUFFER_API          = process.env.BUFFER_API;
const GCP_SA_KEY          = process.env.GCP_SA_KEY;
const BUCKET_NAME         = process.env.GCS_MARKETING_BUCKET;
const RELEASE_BODY        = process.env.RELEASE_BODY || 'New release with performance improvements.';
const RELEASE_TAG         = process.env.RELEASE_TAG  || '@latest';
const RELEASE_URL         = process.env.RELEASE_URL  || 'https://github.com/beginwebdev2002/best-practise/releases';
// ═══════════════════════════════════════════════════════════════

// ── Platform Map ─────────────────────────────────────────────
// BUFFER_PROFILE_IDS is expected as "instagram_id,youtube_id,tiktok_id"
// We detect the actual platform type from Buffer's /profiles endpoint at runtime,
// but we also use positional convention as fallback.
const PLATFORM_ORDER = ['instagram', 'youtube', 'tiktok'];

// ── Platform Config ──────────────────────────────────────────
const PLATFORM_CONFIG = {
  instagram: {
    captionMaxChars: 2200,
    hashtagCount:    25,
    contentStyle:    'visual storytelling, lifestyle, aspirational, emoji-rich',
    aspectRatio:     '1:1',   // Square cover for IG feed
    videoRatio:      '9:16',  // Reels
    tone:            'exciting, visual, community-driven',
    ctaStyle:        'Link in bio 👆',
  },
  youtube: {
    captionMaxChars: 5000,
    hashtagCount:    15,
    contentStyle:    'educational, detailed, search-optimized, professional',
    aspectRatio:     '16:9',  // YouTube thumbnail
    videoRatio:      '16:9',  // Shorts / regular
    tone:            'informative, in-depth, authoritative',
    ctaStyle:        `Subscribe & check the release → ${RELEASE_URL}`,
  },
  tiktok: {
    captionMaxChars: 2200,
    hashtagCount:    20,
    contentStyle:    'fast-paced, trendy, Gen-Z energy, hook-first, viral potential',
    aspectRatio:     '9:16',  // TikTok cover
    videoRatio:      '9:16',  // TikTok video
    tone:            'punchy, energetic, relatable, trend-aware',
    ctaStyle:        'Follow for more dev content 🔥',
  },
};

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * sanitizeFilename — makes any string safe for GCS object names.
 * Lowercases, then replaces every non-alphanumeric character with '-'.
 * Collapses consecutive hyphens and strips leading/trailing hyphens.
 *
 * @param {string} input
 * @returns {string}
 */
function sanitizeFilename(input) {
  return String(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')   // non-alphanumeric → hyphen
    .replace(/-{2,}/g, '-')          // collapse consecutive hyphens
    .replace(/^-|-$/g, '');          // strip leading / trailing hyphens
}

/** Sleep for `ms` milliseconds (used in polling). */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ═══════════════════════════════════════════════════════════════
//  AI CLIENT FACTORY
//  Vertex AI (ADC via google-github-actions/auth) → primary
//  Gemini API key → local dev fallback
// ═══════════════════════════════════════════════════════════════
function createAIClient() {
  if (PROJECT_ID) {
    console.log(`🔐 Vertex AI → project: ${PROJECT_ID}, location: ${LOCATION}`);
    return new GoogleGenAI({
      vertexai: true,
      project:  PROJECT_ID,
      location: LOCATION,
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
//  RESULT STORE
// ═══════════════════════════════════════════════════════════════
class ContentBundle {
  constructor() {
    /** @type {{ instagram: object|null, youtube: object|null, tiktok: object|null }} */
    this.copy = { instagram: null, youtube: null, tiktok: null };

    /** Generated cover images per platform aspect ratio */
    this.images = {
      square:  null,   // 1:1  → Instagram
      wide:    null,   // 16:9 → YouTube
      portrait: null,  // 9:16 → TikTok / IG Reels
    };

    /** Veo 3 video teaser */
    this.video = { localPath: null, filename: null, operationName: null };
  }
}

// ═══════════════════════════════════════════════════════════════
//  MAIN ENGINE
// ═══════════════════════════════════════════════════════════════
class SocialContentEngine {
  constructor() {
    this.ai      = createAIClient();
    this.storage = new Storage();   // Uses ADC automatically
    this.bundle  = new ContentBundle();
    this.profileMap = {};            // { profileId → 'instagram'|'youtube'|'tiktok' }
  }

  // ────────────────────────────────────────────────────────────
  async run() {
    console.log('\n🚀 ═══════ Social Content Creator Pipeline ═══════');
    console.log(`📦 Release : ${RELEASE_TAG}`);
    console.log(`🔗 URL     : ${RELEASE_URL}\n`);

    await this.resolveBufferProfiles();
    await this.generateAllCopy();
    await this.generateCoverImages();
    await this.generateVideoTeaser();
    await this.uploadToGCS();
    await this.publishToBuffer();

    this.logSummary();
    console.log('\n✅ ═══════ Pipeline Completed ═══════\n');
  }

  // ────────────────────────────────────────────────────────────
  /**
   * MODULE 0 — Profile Resolution
   * Fetch each Buffer profile to learn its platform type.
   * Falls back to positional convention (instagram, youtube, tiktok).
   */
  async resolveBufferProfiles() {
    const ids = (BUFFER_PROFILE_IDS || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (!ids.length) {
      console.log('⚠️  No BUFFER_PROFILE_IDS found — skipping profile resolution.');
      return;
    }

    const baseUrl = 'https://api.bufferapp.com';

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const url = `${baseUrl}/1/profiles/${id}.json`
      try {
        const response = await axios.get(url, {
          params:  { access_token: BUFFER_API },
          timeout: 8_000,
        });
        console.log('data: ', response);
        
        const data = response?.data
        const service = (data?.service || '').toLowerCase();

        // Normalise to our three platform keys
        const platform =
          service.includes('instagram') ? 'instagram' :
          service.includes('youtube')   ? 'youtube'   :
          service.includes('tiktok')    ? 'tiktok'    :
          PLATFORM_ORDER[i] || 'instagram';           // positional fallback

        this.profileMap[id] = platform;
        console.log(`📋 Profile ${id} → ${platform} (Buffer service: "${service}")`);
      } catch(e) {
        const platform = PLATFORM_ORDER[i] || 'instagram';
        this.profileMap[id] = platform;
        console.warn(`⚠️  Could not fetch profile ${id}, assuming → ${platform}`,JSON.stringify(url), e);
      }
    }
  }

  // ────────────────────────────────────────────────────────────
  /**
   * MODULE 1 — Copy Generation (Gemini 2.5 Pro)
   *
   * Generates a tailored caption + hashtag set for each platform.
   * Prompt engineering:
   *   - Platform-specific tone, style, length limits
   *   - Structured output (strict JSON) for reliable parsing
   *   - Source: release notes + commit context
   */
  async generateAllCopy() {
    console.log('\n📝 [Module 1] Generating platform-specific copy (Gemini 2.5 Pro 002)...');

    const systemInstruction = `You are a world-class social media content strategist and copywriter
specialising in developer tools, SaaS products, and tech education platforms.
You create viral, platform-native content that drives engagement and conversions.
Your output is ALWAYS a strict JSON object — no markdown fences, no prose, no comments.
Every caption should feel native to the platform and appeal to its specific algorithm.`;

    const prompt = `
PROJECT CONTEXT:
  Name: best-practise
  Description: An open-source educational platform teaching modern web dev (Angular 20+, NestJS, Vibe Coding philosophy).
  Repository: https://github.com/beginwebdev2002/best-practise
  Release Tag: ${RELEASE_TAG}
  Release URL: ${RELEASE_URL}

RELEASE NOTES / COMMIT CONTEXT:
"""
${RELEASE_BODY}
"""

TASK:
Generate social media content for THREE platforms based on the release above.
Each platform has specific requirements — follow them precisely.

────────────────────────────────────────────
INSTAGRAM (caption key: "instagram")
  - Max ${PLATFORM_CONFIG.instagram.captionMaxChars} characters
  - Style: ${PLATFORM_CONFIG.instagram.contentStyle}
  - Tone: ${PLATFORM_CONFIG.instagram.tone}
  - Structure: Hook (first line is CRITICAL — must stop the scroll), body with line breaks,
    emojis throughout, 3-5 bullet highlights, closing CTA: "${PLATFORM_CONFIG.instagram.ctaStyle}"
  - Hashtags: ${PLATFORM_CONFIG.instagram.hashtagCount} highly-relevant hashtags
    (mix of niche #AngularDev and broad #WebDev #Coding #OpenSource)

YOUTUBE (caption key: "youtube")
  - Max ${PLATFORM_CONFIG.youtube.captionMaxChars} characters
  - Style: ${PLATFORM_CONFIG.youtube.contentStyle}
  - Tone: ${PLATFORM_CONFIG.youtube.tone}
  - Structure: SEO-optimised title summary, timestamps section (even if placeholder), 
    detailed description explaining what changed and WHY it matters, links section,
    CTA: "${PLATFORM_CONFIG.youtube.ctaStyle}"
  - Hashtags: ${PLATFORM_CONFIG.youtube.hashtagCount} SEO-focused hashtags at end

TIKTOK (caption key: "tiktok")
  - Max ${PLATFORM_CONFIG.tiktok.captionMaxChars} characters
  - Style: ${PLATFORM_CONFIG.tiktok.contentStyle}
  - Tone: ${PLATFORM_CONFIG.tiktok.tone}
  - Structure: HOOK (max 5 words, create FOMO/curiosity), 2-3 punchy lines,
    relatable dev pain point addressed, viral CTA: "${PLATFORM_CONFIG.tiktok.ctaStyle}"
  - Hashtags: ${PLATFORM_CONFIG.tiktok.hashtagCount} trending + niche hashtags
    (#LearnToCode #DevLife #WebDev #Angular #TechTok)

────────────────────────────────────────────
OUTPUT FORMAT (strict JSON, no other text):
{
  "instagram": {
    "caption": "...",
    "hashtags": "#tag1 #tag2 ...",
    "coverPrompt": "Detailed Imagen 3 prompt for a square 1:1 Instagram cover image"
  },
  "youtube": {
    "caption": "...",
    "hashtags": "#tag1 #tag2 ...",
    "coverPrompt": "Detailed Imagen 3 prompt for a 16:9 YouTube thumbnail",
    "videoPrompt": "Detailed Veo 3 prompt for a 5-10 second YouTube Shorts teaser"
  },
  "tiktok": {
    "caption": "...",
    "hashtags": "#tag1 #tag2 ...",
    "coverPrompt": "Detailed Imagen 3 prompt for a 9:16 TikTok cover",
    "videoPrompt": "Detailed Veo 3 prompt for a 10-15 second high-energy TikTok video"
  }
}

The coverPrompt and videoPrompt fields are CRITICAL — write them as professional AI image/video
generation prompts that will produce stunning, on-brand visuals. Think: cinematic lighting,
brand colors (deep navy #0F0F1A to electric violet #6C63FF), Angular logo motifs, code aesthetics.
`.trim();

    try {
      const response = await this.ai.models.generateContent({
        model:    'gemini-2.5-pro',   // Vertex AI model ID (no -002 suffix on Vertex)
        contents: prompt,
        config: {
          systemInstruction,
          temperature:     0.8,
          topP:            0.95,
          maxOutputTokens: 4096,
        },
      });

      let raw = (response.text || '').trim();
      raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

      const parsed = JSON.parse(raw);
      this.bundle.copy = parsed;

      console.log('   ✅ Instagram copy ready');
      console.log('   ✅ YouTube copy ready');
      console.log('   ✅ TikTok copy ready');
    } catch (err) {
      console.error('   ❌ Gemini copy error:', err.message);
      // Graceful fallback — pipeline continues with generic copy
      const fallback = (platform) => ({
        caption:      `🚀 ${RELEASE_TAG} is live! New release for best-practise.\n\n${RELEASE_URL}`,
        hashtags:     '#WebDev #Angular #NestJS #OpenSource #Coding #VibeCoding',
        coverPrompt:  `Futuristic tech art for ${platform}, Angular framework, electric blue palette, release ${RELEASE_TAG}`,
        videoPrompt:  `5-second cinematic teaser for software release ${RELEASE_TAG}, fast-paced, tech aesthetic`,
      });
      this.bundle.copy = {
        instagram: fallback('instagram'),
        youtube:   fallback('youtube'),
        tiktok:    fallback('tiktok'),
      };
    }
  }

  // ────────────────────────────────────────────────────────────
  /**
   * MODULE 2 — Cover Image Generation (Imagen 3 via Vertex AI)
   *
   * Generates three variant covers in platform-native aspect ratios.
   * Uses AI-generated prompts from Module 1 for maximum relevance.
   *
   * API: ai.models.generateImages({ model, prompt, config })
   */
  async generateCoverImages() {
    console.log('\n🎨 [Module 2] Generating platform covers with Imagen 3...');

    const MODEL = 'imagen-3.0-generate-002';

    const variants = [
      {
        key:    'square',
        ratio:  '1:1',
        label:  'Instagram',
        prompt: this.bundle.copy?.instagram?.coverPrompt,
        suffix: 'instagram-cover',
        mime:   'image/png',
      },
      {
        key:    'wide',
        ratio:  '16:9',
        label:  'YouTube',
        prompt: this.bundle.copy?.youtube?.coverPrompt,
        suffix: 'youtube-thumbnail',
        mime:   'image/png',
      },
      {
        key:    'portrait',
        ratio:  '9:16',
        label:  'TikTok',
        prompt: this.bundle.copy?.tiktok?.coverPrompt,
        suffix: 'tiktok-cover',
        mime:   'image/png',
      },
    ];

    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];

      // ── Rate-limit guard: Imagen 3 quota is per-minute ──────
      // Wait 8 seconds between requests to avoid 429 RESOURCE_EXHAUSTED
      if (i > 0) {
        console.log(`   ⏳ [Module 2] Waiting 8s before next Imagen request (quota guard)...`);
        await sleep(8_000);
      }

      const prompt = variant.prompt ||
        `Professional tech art for ${variant.label}, software release ${RELEASE_TAG}, ` +
        `Angular aesthetic, deep navy to electric violet gradient, cinematic quality, ${variant.ratio} format.`;

      try {
        const response = await this.ai.models.generateImages({
          model:  MODEL,
          prompt,
          config: {
            numberOfImages: 1,
            aspectRatio:    variant.ratio,
            outputMimeType: variant.mime,
          },
        });

        const imageBytes = response?.generatedImages?.[0]?.image?.imageBytes;
        if (!imageBytes) throw new Error(`No image bytes returned for ${variant.label}`);

        const filename  = `release-${sanitizeFilename(RELEASE_TAG)}-${variant.suffix}.png`;
        const localPath = path.join(process.cwd(), filename);
        fs.writeFileSync(localPath, imageBytes, 'base64');

        this.bundle.images[variant.key] = { localPath, filename };
        console.log(`   ✅ ${variant.label} cover (${variant.ratio}) → ${filename}`);
      } catch (err) {
        console.error(`   ❌ Imagen 3 error (${variant.label}):`, err.message);
        this.bundle.images[variant.key] = null;
      }
    }
  }

  // ────────────────────────────────────────────────────────────
  /**
   * MODULE 3 — Video Teaser (Veo 3 via Vertex AI)
   *
   * Generates a 9:16 short-form video for IG Reels / YT Shorts / TikTok.
   *
   * Architecture:
   *   1. Submit generateVideos() → get a long-running Operation
   *   2. Poll ai.operations.get(operationName) every POLL_INTERVAL_MS
   *      until status === 'SUCCEEDED' or max attempts reached
   *   3. Download the resulting video to disk for GCS upload
   *
   * API: ai.models.generateVideos + ai.operations.get
   */
  async generateVideoTeaser() {
    console.log('\n🎥 [Module 3] Generating Reels/Shorts teaser with Veo 3...');

    const MODEL            = 'veo-3.0-generate-preview';
    const POLL_INTERVAL_MS = 30_000;   // 30 seconds between status checks
    const MAX_ATTEMPTS     = 10;        // max 5 minutes total wait

    // Use TikTok video prompt (most energetic — works for all Reels/Shorts)
    const prompt = this.bundle.copy?.tiktok?.videoPrompt ||
      `Ultra-energetic 10-second vertical video for software release "${RELEASE_TAG}".
       Opening: Angular logo shattering into particles, reassembling as release tag text.
       Mid: lightning-fast code snippets scrolling on dark terminal.
       End: "best-practise" brand logo reveal with electric glow, call-to-action overlay.
       Style: Cinematic, fast-cut, electric blue & violet palette, 4K 60fps, 9:16 vertical.`;

    const filename  = `release-${sanitizeFilename(RELEASE_TAG)}-reels.mp4`;
    const localPath = path.join(process.cwd(), filename);

    try {
      // ── Step 1: Submit the generation request ──────────────
      console.log('   [Module 3] Submitting Veo 3 generation request...');
      const operation = await this.ai.models.generateVideos({
        model:  MODEL,
        prompt,
        config: {
          aspectRatio:     '9:16',
          durationSeconds: 10,
          resolution:      '1080p',
        },
      });

      const opName = operation?.name || operation?.operationName || null;
      if (!opName) throw new Error('Veo 3: no operation name returned — cannot poll.');

      console.log(`   [Module 3] Operation started → ${opName}`);
      console.log(`   [Module 3] Polling every ${POLL_INTERVAL_MS / 1000}s (max ${MAX_ATTEMPTS} attempts)...`);

      // ── Step 2: Poll until SUCCEEDED or exhausted ──────────
      let succeeded     = false;
      let finalOperation = null;

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        await sleep(POLL_INTERVAL_MS);

        let pollResult;
        try {
          // @google/genai: operations.get() takes the operation name string directly,
          // NOT wrapped in an object. Passing { name: opName } causes a TypeError.
          pollResult = await this.ai.operations.get(opName);
        } catch (pollErr) {
          console.warn(`   [Module 3] Poll attempt ${attempt}/${MAX_ATTEMPTS} failed: ${pollErr.message}`);
          continue;
        }

        const status = (
          pollResult?.metadata?.state ||
          pollResult?.state ||
          (pollResult?.done ? 'SUCCEEDED' : 'PENDING')
        ).toUpperCase();

        console.log(`   [Module 3] Attempt ${attempt}/${MAX_ATTEMPTS} — status: ${status}`);

        if (status === 'SUCCEEDED' || pollResult?.done === true) {
          succeeded      = true;
          finalOperation = pollResult;
          break;
        }

        if (status === 'FAILED' || status === 'CANCELLED') {
          throw new Error(`Veo 3 operation ${status}: ${JSON.stringify(pollResult?.error || {})}`);
        }
        // PENDING / RUNNING → continue polling
      }

      if (!succeeded) {
        throw new Error(`Veo 3 operation did not complete within ${MAX_ATTEMPTS * POLL_INTERVAL_MS / 1000}s.`);
      }

      // ── Step 3: Retrieve video bytes and write to disk ─────
      const videoBytes =
        finalOperation?.response?.generatedSamples?.[0]?.video?.videoBytes ||
        finalOperation?.response?.videos?.[0]?.videoBytes ||
        null;

      if (videoBytes) {
        fs.writeFileSync(localPath, videoBytes, 'base64');
        console.log(`   ✅ [Module 3] Video ready → ${filename}`);
        this.bundle.video = { localPath, filename, operationName: opName, publicUrl: null };
      } else {
        // Operation succeeded but bytes not directly in response (GCS URI pattern)
        const gcsUri =
          finalOperation?.response?.generatedSamples?.[0]?.video?.uri ||
          finalOperation?.response?.videos?.[0]?.uri ||
          null;

        if (gcsUri) {
          console.log(`   ✅ [Module 3] Video stored at GCS URI → ${gcsUri}`);
          this.bundle.video = { localPath: null, filename, operationName: opName, gcsUri, publicUrl: null };
        } else {
          console.warn('   ⚠️  [Module 3] Operation SUCCEEDED but no video data found in response.');
          this.bundle.video = { localPath: null, filename, operationName: opName, publicUrl: null };
        }
      }
    } catch (err) {
      // Veo 3 is in preview — treat all errors as non-fatal so the rest of the pipeline continues
      console.warn(`   ⚠️  [Module 3] Veo 3 non-fatal error: ${err.message}`);
      this.bundle.video = { localPath: null, filename, operationName: null, publicUrl: null };
    }
  }

  // ────────────────────────────────────────────────────────────
  /**
   * MODULE 4 — Asset Persistence (Google Cloud Storage)
   *
   * Uploads all local assets (covers + video) to GCS.
   * Uses ADC injected by google-github-actions/auth@v2.
   * Sets public=true for direct URL embedding in Buffer posts.
   */
  async uploadToGCS() {
    if (!BUCKET_NAME) {
      console.log('\n☁️  [Module 4] GCS_MARKETING_BUCKET not set — skipping upload.');
      return;
    }

    console.log(`\n☁️  [Module 4] Uploading to gs://${BUCKET_NAME}...`);
    const folder = `releases/${sanitizeFilename(RELEASE_TAG)}`;

    const uploadsMap = [
      { asset: this.bundle.images.square,   type: 'image/png', label: 'Instagram cover'   },
      { asset: this.bundle.images.wide,     type: 'image/png', label: 'YouTube thumbnail'  },
      { asset: this.bundle.images.portrait, type: 'image/png', label: 'TikTok cover'       },
      { asset: this.bundle.video,           type: 'video/mp4', label: 'Video teaser'       },
    ];

    for (const { asset, type, label } of uploadsMap) {
      if (!asset?.localPath || !fs.existsSync(asset.localPath)) continue;
      try {
        const destination = `${folder}/${asset.filename}`;
        await this.storage.bucket(BUCKET_NAME).upload(asset.localPath, {
          destination,
          public: true,
          metadata: {
            contentType:  type,
            cacheControl: 'public, max-age=86400',
            metadata: { releaseTag: RELEASE_TAG, releaseUrl: RELEASE_URL },
          },
        });
        asset.publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${destination}`;
        console.log(`   ✅ ${label} → ${asset.publicUrl}`);
      } catch (err) {
        console.error(`   ❌ GCS upload error (${label}):`, err.message);
      }
    }

    // Clean up local temp files after successful upload
    await this.cleanupLocals();
  }

  // ────────────────────────────────────────────────────────────
  /**
   * cleanupLocals — Deletes .png and .mp4 files from the working
   * directory after they have been uploaded to GCS.
   * Keeps the runner disk clean on long-lived CI workers.
   */
  async cleanupLocals() {
    console.log('   🧹 [Module 4] Cleaning up local temp files...');
    const cwd      = process.cwd();
    const toDelete = [
      this.bundle.images.square?.localPath,
      this.bundle.images.wide?.localPath,
      this.bundle.images.portrait?.localPath,
      this.bundle.video?.localPath,
    ].filter(Boolean);

    for (const filePath of toDelete) {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`   🗑️  Removed ${path.relative(cwd, filePath)}`);
        }
      } catch (err) {
        console.warn(`   ⚠️  Could not delete ${filePath}: ${err.message}`);
      }
    }
  }

  // ────────────────────────────────────────────────────────────
  /**
   * MODULE 5 — Buffer Publishing
   *
   * Posts to each configured Buffer profile with platform-specific:
   *   - Caption (from Module 1)
   *   - Hashtags (appended to caption)
   *   - Cover image (platform aspect ratio from Module 2)
   *   - Video URL if available (from Module 3 / GCS)
   *
   * Buffer API: /1/updates/create.json
   */
  async publishToBuffer() {
    if (!BUFFER_ACCESS_TOKEN) {
      console.log('\n📢 [Module 5] BUFFER_ACCESS_TOKEN not set — skipping publish.');
      return;
    }

    const profileIds = Object.keys(this.profileMap);
    if (!profileIds.length) {
      console.log('\n📢 [Module 5] No profiles resolved — skipping publish.');
      return;
    }

    console.log(`\n📢 [Module 5] Publishing to ${profileIds.length} profile(s)...`);
    const baseUrl  = (BUFFER_API || 'https://api.bufferapp.com').replace(/\/$/, '');
    const videoUrl = this.bundle.video?.publicUrl || null;

    // Mapping: platform → which image to use as thumbnail
    const coverMap = {
      instagram: this.bundle.images.square?.publicUrl   || null,
      youtube:   this.bundle.images.wide?.publicUrl     || null,
      tiktok:    this.bundle.images.portrait?.publicUrl  || null,
    };

    for (const [profileId, platform] of Object.entries(this.profileMap)) {
      const cfg      = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.instagram;
      const copy     = this.bundle.copy?.[platform];
      const imageUrl = coverMap[platform];

      if (!copy) {
        console.warn(`   ⚠️  No copy for platform "${platform}" (profile ${profileId}) — skipping.`);
        continue;
      }

      // Full post text = caption + line break + hashtags
      const fullText = `${copy.caption}\n\n${copy.hashtags}`.trim();

      // ── Build platform-correct media block ─────────────────
      // Priority: video → cover image → no media
      // Buffer field names differ slightly per platform:
      //   Instagram / TikTok → 'video' key for Reels/vertical video
      //   YouTube            → 'video' key for Shorts
      //   Image fallback     → 'photo' key
      let mediaBlock;
      if (videoUrl) {
        // Video takes priority on all three platforms
        mediaBlock = {
          video:     videoUrl,
          thumbnail: imageUrl || undefined,   // thumbnail shown before playback
        };
      } else if (imageUrl) {
        mediaBlock = {
          photo:     imageUrl,
          thumbnail: imageUrl,
        };
      }

      const payload = {
        profile_ids: [profileId],
        text:         fullText,
        now:          true,
        ...(mediaBlock ? { media: mediaBlock } : {}),
      };

      try {
        const resp = await axios.post(
          `${baseUrl}/1/updates/create.json`,
          payload,
          {
            params:  { access_token: BUFFER_ACCESS_TOKEN },
            headers: { 'Content-Type': 'application/json' },
            timeout: 20_000,
          }
        );

        if (resp.data?.success) {
          console.log(`   ✅ ${platform.toUpperCase().padEnd(9)} (${profileId}) → published`);
        } else {
          console.warn(`   ⚠️  ${platform.toUpperCase().padEnd(9)} (${profileId}) → success=false`, resp.data);
        }
      } catch (err) {
        const detail = err.response?.data ?? err.message;
        console.error(`   ❌ Buffer error [${platform}] (${profileId}):`, detail);
      }
    }

    // Save full bundle as artifact for debugging and audit
    const artifactPath = path.join(process.cwd(), 'buffer-payload.json');
    fs.writeFileSync(artifactPath, JSON.stringify({
      releaseTag:   RELEASE_TAG,
      releaseUrl:   RELEASE_URL,
      profileMap:   this.profileMap,
      copy:         this.bundle.copy,
      images:       {
        square:   this.bundle.images.square?.publicUrl || null,
        wide:     this.bundle.images.wide?.publicUrl   || null,
        portrait: this.bundle.images.portrait?.publicUrl || null,
      },
      video:        this.bundle.video?.publicUrl || this.bundle.video?.operationName || null,
    }, null, 2));
    console.log(`\n   📄 Audit artifact → ${artifactPath}`);
  }

  // ────────────────────────────────────────────────────────────
  logSummary() {
    const ok  = (v) => v ? '✅' : '⚠️ ';
    const ig  = this.bundle.copy?.instagram;
    const yt  = this.bundle.copy?.youtube;
    const tt  = this.bundle.copy?.tiktok;

    console.log('\n╔═══════════════════════════════════════════════╗');
    console.log('║         PIPELINE SUMMARY                      ║');
    console.log('╠═══════════════════════════════════════════════╣');
    console.log(`║  Release   : ${RELEASE_TAG.padEnd(32)}║`);
    console.log(`║  Copy      : ${ok(ig)} IG  ${ok(yt)} YT  ${ok(tt)} TT           ║`);
    console.log(`║  IG Cover  : ${(this.bundle.images.square?.publicUrl   ? '✅ Uploaded' : '⚠️  Skipped ').padEnd(32)}║`);
    console.log(`║  YT Thumbnail: ${(this.bundle.images.wide?.publicUrl   ? '✅ Uploaded' : '⚠️  Skipped ').padEnd(30)}║`);
    console.log(`║  TT Cover  : ${(this.bundle.images.portrait?.publicUrl ? '✅ Uploaded' : '⚠️  Skipped ').padEnd(32)}║`);
    console.log(`║  Video     : ${(this.bundle.video?.operationName ? '✅ Submitted' : '⚠️  Skipped').padEnd(32)}║`);
    console.log(`║  Profiles  : ${String(Object.keys(this.profileMap).length).padEnd(32)}║`);
    console.log('╚═══════════════════════════════════════════════╝');
  }
}

// ═══════════════════════════════════════════════════════════════
//  ENTRY POINT
// ═══════════════════════════════════════════════════════════════
(async () => {
  const engine = new SocialContentEngine();
  try {
    await engine.run();
  } catch (err) {
    console.error('\n🛑 Fatal pipeline failure:', err);
    process.exit(1);
  }
})();