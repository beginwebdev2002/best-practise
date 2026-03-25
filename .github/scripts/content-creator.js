/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║   Autonomous Social Media Content Creator                    ║
 * ║   Platforms : Instagram (Reels · Feed) · Facebook Page       ║
 * ║   AI Stack  : Gemini 2.5 Pro · Imagen 3 · Veo 3 (Vertex AI)  ║
 * ║   Publish   : Meta Graph API v20.0 (direct)                  ║
 * ║   Storage   : Google Cloud Storage (public asset hosting)    ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 *  Triggered on every GitHub Release via content-creator.yml
 *  Reads:    release notes + tag + URL
 *  Generates: per-platform caption, hashtags, cover image, video reel
 *  Publishes: Instagram Reels + Facebook Page feed via Meta Graph API
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
const API_KEY             = process.env.GOOGLE_AI_API_KEY;           // Gemini API key (fallback)
const NANO_BANANA_API_KEY = process.env.NANO_BANANA_API_KEY;         // Reserved for Nano Banana
const VEO3_API_KEY        = process.env.VEO3_API_KEY;                // Reserved / Veo 3 direct
const GCP_SA_KEY          = process.env.GCP_SA_KEY;
const BUCKET_NAME         = process.env.GCS_MARKETING_BUCKET;

// ── Meta Graph API ────────────────────────────────────────────
const META_ACCESS_TOKEN   = process.env.META_ACCESS_TOKEN;           // Long-lived page token
const IG_BUSINESS_ID      = process.env.IG_BUSINESS_ID;             // Instagram Business Account ID
const FB_PAGE_ID          = process.env.FB_PAGE_ID;                 // Facebook Page ID
const APP_ID              = process.env.APP_ID;                     // Meta App ID (for token validation)
const META_API_BASE       = 'https://graph.facebook.com/v20.0';

// ── Release Metadata ─────────────────────────────────────────
const RELEASE_BODY        = process.env.RELEASE_BODY || 'New release with performance improvements.';
const RELEASE_TAG         = process.env.RELEASE_TAG  || '@latest';
const RELEASE_URL         = process.env.RELEASE_URL  || 'https://github.com/beginwebdev2002/best-practise/releases';
// ═══════════════════════════════════════════════════════════════

// ── Platform Config ──────────────────────────────────────────
const PLATFORM_CONFIG = {
  instagram: {
    captionMaxChars: 2200,
    hashtagCount:    25,
    contentStyle:    'visual storytelling, lifestyle, aspirational, emoji-rich',
    aspectRatio:     '9:16',  // Reels (vertical)
    tone:            'exciting, visual, community-driven, punchy',
    ctaStyle:        'Link in bio 👆',
  },
  facebook: {
    captionMaxChars: 63206,
    hashtagCount:    10,
    contentStyle:    'professional, informative, detailed, community-focused',
    aspectRatio:     '16:9',  // Facebook feed image
    tone:            'professional, in-depth, authoritative, welcoming',
    ctaStyle:        `Read the full release → ${RELEASE_URL}`,
  },
};

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * sanitizeFilename — makes any string safe for GCS object names.
 * Lowercases, then replaces every non-alphanumeric character with '-'.
 * Collapses consecutive hyphens and strips leading/trailing hyphens.
 */
function sanitizeFilename(input) {
  return String(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

/** Sleep for `ms` milliseconds (used in polling). */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * metaRequest — thin axios wrapper for Meta Graph API calls.
 * Automatically injects access_token, handles 429 back-off (up to maxRetries),
 * and throws descriptive errors on 401/403.
 *
 * @param {'get'|'post'} method
 * @param {string}       endpoint   - path after META_API_BASE (e.g. '/{id}/media')
 * @param {object}       [params]   - query params
 * @param {object}       [data]     - POST body
 * @param {number}       [maxRetries=3]
 */
async function metaRequest(method, endpoint, params = {}, data = null, maxRetries = 3) {
  const url = `${META_API_BASE}${endpoint}`;
  const config = {
    method,
    url,
    params:  { access_token: META_ACCESS_TOKEN, ...params },
    timeout: 30_000,
  };
  if (data) config.data = data;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const resp = await axios(config);
      return resp.data;
    } catch (err) {
      const status = err.response?.status;
      const body   = err.response?.data ?? {};

      if (status === 429) {
        const retryAfter = parseInt(err.response?.headers?.['retry-after'] || '30', 10);
        const waitMs     = retryAfter * 1000 * attempt;
        console.warn(`   ⏳ Rate-limited by Meta (429), retrying in ${waitMs / 1000}s… (attempt ${attempt}/${maxRetries})`);
        await sleep(waitMs);
        continue;
      }

      if (status === 401 || status === 403) {
        throw new Error(
          `🛑 Meta auth error (${status}) – check META_ACCESS_TOKEN and permissions.\n` +
          `   Detail: ${JSON.stringify(body)}`
        );
      }

      // For all other errors on last attempt, throw with detail
      if (attempt === maxRetries) {
        throw new Error(
          `Meta API ${method.toUpperCase()} ${endpoint} failed (HTTP ${status ?? 'network'}):\n` +
          `   ${JSON.stringify(body || err.message)}`
        );
      }

      // transient error — brief pause then retry
      await sleep(2_000 * attempt);
    }
  }
}

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
    /** @type {{ instagram: object|null, facebook: object|null }} */
    this.copy = { instagram: null, facebook: null };

    /** Generated cover images per platform aspect ratio */
    this.images = {
      portrait: null,   // 9:16  → Instagram Reels cover
      wide:     null,   // 16:9  → Facebook / OG share image
    };

    /** Veo 3 video reel */
    this.video = { localPath: null, filename: null, operationName: null, publicUrl: null };

    /** Meta publishing results */
    this.meta = { igPublishId: null, fbPostId: null };
  }
}

// ═══════════════════════════════════════════════════════════════
//  META PUBLISHER
//  Implements the 3-step Meta container → poll → publish flow
//  for Instagram Reels and Facebook Page feed.
// ═══════════════════════════════════════════════════════════════
class MetaPublisher {
  constructor(bundle) {
    this.bundle = bundle;
  }

  // ────────────────────────────────────────────────────────────
  /**
   * Step 1a — Create IG Reel container (video).
   * Uses media_type=REELS. Requires a publicly accessible video URL.
   *
   * @param {string} videoUrl  Public GCS URL of the .mp4 file
   * @param {string} caption   Full caption + hashtags
   * @returns {string}         containerId
   */
  async createIgReelContainer(videoUrl, caption) {
    console.log('   [Meta] Creating IG Reel container…');
    const result = await metaRequest('post', `/${IG_BUSINESS_ID}/media`, {}, {
      media_type:       'REELS',
      video_url:        videoUrl,
      caption:          caption,
      share_to_feed:    true,
      thumb_offset:     1000,
    });
    const id = result?.id;
    if (!id) throw new Error(`IG Reel container creation failed: ${JSON.stringify(result)}`);
    console.log(`   [Meta] IG Reel container created → ${id}`);
    return id;
  }

  // ────────────────────────────────────────────────────────────
  /**
   * Step 1b — Create IG Image container (fallback when no video).
   *
   * @param {string} imageUrl  Public GCS URL of the .png file
   * @param {string} caption   Full caption + hashtags
   * @returns {string}         containerId
   */
  async createIgImageContainer(imageUrl, caption) {
    console.log('   [Meta] Creating IG Image container (no video fallback)…');
    const result = await metaRequest('post', `/${IG_BUSINESS_ID}/media`, {}, {
      image_url: imageUrl,
      caption:   caption,
    });
    const id = result?.id;
    if (!id) throw new Error(`IG Image container creation failed: ${JSON.stringify(result)}`);
    console.log(`   [Meta] IG Image container created → ${id}`);
    return id;
  }

  // ────────────────────────────────────────────────────────────
  /**
   * Step 2 — Poll until the container status_code === 'FINISHED'.
   * Meta's video processing pipeline can take 1–4 minutes for Reels.
   * Polls every POLL_INTERVAL_MS. Throws if ERROR or timeout.
   *
   * @param {string} containerId
   * @param {number} [pollIntervalMs=20000]
   * @param {number} [maxAttempts=30]          ~ 10 minutes max
   */
  async waitUntilReady(containerId, pollIntervalMs = 20_000, maxAttempts = 30) {
    console.log(`   [Meta] Polling container ${containerId} every ${pollIntervalMs / 1000}s (max ${maxAttempts} attempts)…`);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await sleep(pollIntervalMs);

      let statusData;
      try {
        statusData = await metaRequest('get', `/${containerId}`, { fields: 'status_code,status' });
      } catch (pollErr) {
        console.warn(`   [Meta] Poll attempt ${attempt}/${maxAttempts} error: ${pollErr.message}`);
        continue;
      }

      const statusCode = (statusData?.status_code || '').toUpperCase();
      console.log(`   [Meta] Attempt ${attempt}/${maxAttempts} — status_code: ${statusCode}`);

      if (statusCode === 'FINISHED') {
        console.log(`   [Meta] Container ${containerId} is FINISHED ✅`);
        return;
      }

      if (statusCode === 'ERROR' || statusCode === 'EXPIRED') {
        throw new Error(
          `Meta container ${containerId} ended with status ${statusCode}. ` +
          `Detail: ${JSON.stringify(statusData?.status || {})}`
        );
      }
      // IN_PROGRESS / PUBLISHED / unknown → keep waiting
    }

    throw new Error(
      `Meta container ${containerId} did not reach FINISHED within ` +
      `${(maxAttempts * pollIntervalMs) / 60_000} minutes.`
    );
  }

  // ────────────────────────────────────────────────────────────
  /**
   * Step 3 — Publish the ready container to the IG Business account.
   *
   * @param {string} containerId
   * @returns {string}  igPublishId (the published media ID)
   */
  async publishIgContainer(containerId) {
    console.log(`   [Meta] Publishing IG container ${containerId}…`);
    const result = await metaRequest('post', `/${IG_BUSINESS_ID}/media_publish`, {}, {
      creation_id: containerId,
    });
    const id = result?.id;
    if (!id) throw new Error(`IG media_publish failed: ${JSON.stringify(result)}`);
    console.log(`   [Meta] IG published → media ID: ${id}`);
    return id;
  }

  // ────────────────────────────────────────────────────────────
  /**
   * Publish to Facebook Page feed.
   * Runs independently of IG — both are kicked off concurrently.
   *
   * @param {string} message   Full post text (caption + hashtags)
   * @param {string} link      Release URL (rendered as link preview)
   * @param {string} [imageUrl] Optional OG image override
   * @returns {string}         fbPostId
   */
  async publishFbFeed(message, link, imageUrl) {
    console.log('   [Meta] Publishing to Facebook Page feed…');

    const payload = { message, link };
    // If a public image URL is available, attach it as an uploaded photo
    if (imageUrl) {
      payload.url = imageUrl;
    }

    const result = await metaRequest('post', `/${FB_PAGE_ID}/feed`, {}, payload);
    const id = result?.id;
    if (!id) throw new Error(`FB feed publish failed: ${JSON.stringify(result)}`);
    console.log(`   [Meta] FB Page post published → ID: ${id}`);
    return id;
  }

  // ────────────────────────────────────────────────────────────
  /**
   * run() — orchestrates the full Meta publishing sequence.
   * IG and FB are kicked off on separate logical paths; FB runs in parallel
   * during the IG polling wait so we don't waste time.
   */
  async run() {
    if (!META_ACCESS_TOKEN || !IG_BUSINESS_ID || !FB_PAGE_ID) {
      console.log('\n📢 [Module 5] META_ACCESS_TOKEN / IG_BUSINESS_ID / FB_PAGE_ID not set — skipping Meta publish.');
      return;
    }

    console.log('\n📢 [Module 5] Meta Publisher — starting…');

    const igCopy  = this.bundle.copy?.instagram;
    const fbCopy  = this.bundle.copy?.facebook;
    const videoUrl = this.bundle.video?.publicUrl || null;
    const igImageUrl = this.bundle.images.portrait?.publicUrl || null;
    const fbImageUrl = this.bundle.images.wide?.publicUrl     || null;

    if (!igCopy && !fbCopy) {
      console.warn('   ⚠️  No copy generated for Instagram or Facebook — skipping.');
      return;
    }

    // ── Full caption text ────────────────────────────────────
    const igCaption = igCopy
      ? `${igCopy.caption}\n\n${igCopy.hashtags}`.trim()
      : `🚀 ${RELEASE_TAG} is live!\n\n${RELEASE_URL}`;

    const fbMessage = fbCopy
      ? `${fbCopy.caption}\n\n${fbCopy.hashtags}`.trim()
      : `${RELEASE_TAG} has been released. Read the full notes: ${RELEASE_URL}`;

    // ── IG Reel publish (container → poll → publish) ─────────
    let igContainerId = null;
    try {
      if (videoUrl) {
        igContainerId = await this.createIgReelContainer(videoUrl, igCaption);
      } else if (igImageUrl) {
        igContainerId = await this.createIgImageContainer(igImageUrl, igCaption);
      } else {
        console.warn('   ⚠️  No video or image URL available for Instagram — skipping IG publish.');
      }
    } catch (err) {
      console.error('   ❌ IG container creation error:', err.message);
    }

    // ── FB feed publish (runs while IG is processing) ────────
    const fbPublishPromise = (async () => {
      try {
        const id = await this.publishFbFeed(fbMessage, RELEASE_URL, fbImageUrl);
        this.bundle.meta.fbPostId = id;
      } catch (err) {
        console.error('   ❌ FB feed publish error:', err.message);
      }
    })();

    // ── Wait for IG container + publish ─────────────────────
    if (igContainerId) {
      try {
        await this.waitUntilReady(igContainerId);
        const publishId = await this.publishIgContainer(igContainerId);
        this.bundle.meta.igPublishId = publishId;
      } catch (err) {
        console.error('   ❌ IG polling/publish error:', err.message);
      }
    }

    // ── Await FB result ──────────────────────────────────────
    await fbPublishPromise;
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
  }

  // ────────────────────────────────────────────────────────────
  async run() {
    console.log('\n🚀 ═══════ Social Content Creator Pipeline ═══════');
    console.log(`📦 Release : ${RELEASE_TAG}`);
    console.log(`🔗 URL     : ${RELEASE_URL}\n`);

    await this.generateAllCopy();
    await this.generateCoverImages();
    await this.generateVideoTeaser();
    await this.uploadToGCS();
    await new MetaPublisher(this.bundle).run();

    this.logSummary();
    console.log('\n✅ ═══════ Pipeline Completed ═══════\n');
  }

  // ────────────────────────────────────────────────────────────
  /**
   * MODULE 1 — Copy Generation (Gemini 2.5 Pro)
   *
   * Generates tailored copy for:
   *   • Instagram Reels  — punchy caption, 20+ hashtags, reel+image prompts
   *   • Facebook Page    — professional update, link, detailed copy
   */
  async generateAllCopy() {
    console.log('\n📝 [Module 1] Generating platform-specific copy (Gemini 2.5 Pro)...');

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
Generate social media content for TWO platforms based on the release above.
Each platform has specific requirements — follow them precisely.

────────────────────────────────────────────
INSTAGRAM REELS (caption key: "instagram")
  - Max ${PLATFORM_CONFIG.instagram.captionMaxChars} characters
  - Style: ${PLATFORM_CONFIG.instagram.contentStyle}
  - Tone: ${PLATFORM_CONFIG.instagram.tone}
  - Structure:
    • Hook (first line is CRITICAL — must stop the scroll, max 10 words)
    • 3-5 punchy bullet highlights using emojis
    • Urgency or FOMO element
    • Closing CTA: "${PLATFORM_CONFIG.instagram.ctaStyle}"
  - Hashtags: MINIMUM ${PLATFORM_CONFIG.instagram.hashtagCount} highly-relevant hashtags
    (mix of niche #AngularDev #NestJS and broad #WebDev #Coding #OpenSource #100DaysOfCode)
  - reelPrompt: Detailed Veo 3 prompt for a 9-10 second vertical reel (9:16)
  - coverPrompt: Detailed Imagen 3 prompt for a 9:16 Instagram Reels cover

────────────────────────────────────────────
FACEBOOK PAGE POST (caption key: "facebook")
  - Max ${PLATFORM_CONFIG.facebook.captionMaxChars} characters
  - Style: ${PLATFORM_CONFIG.facebook.contentStyle}
  - Tone: ${PLATFORM_CONFIG.facebook.tone}
  - Structure:
    • Engaging opening sentence (professional but friendly)
    • 2-3 paragraphs: what changed, why it matters, who benefits
    • Bullet list of key features/improvements
    • Community question or engagement prompt at the end
    • CTA: "${PLATFORM_CONFIG.facebook.ctaStyle}"
  - Hashtags: ${PLATFORM_CONFIG.facebook.hashtagCount} professional hashtags
    (#OpenSource #Angular #WebDevelopment #SoftwareEngineering #TechEducation)
  - coverPrompt: Detailed Imagen 3 prompt for a 16:9 Facebook/OG share image

────────────────────────────────────────────
OUTPUT FORMAT (strict JSON, no other text):
{
  "instagram": {
    "caption": "...",
    "hashtags": "#tag1 #tag2 ...",
    "coverPrompt": "Detailed Imagen 3 prompt for a 9:16 vertical Instagram Reels cover",
    "reelPrompt": "Detailed Veo 3 prompt for a 9-10 second 9:16 vertical Instagram Reel video"
  },
  "facebook": {
    "caption": "...",
    "hashtags": "#tag1 #tag2 ...",
    "coverPrompt": "Detailed Imagen 3 prompt for a 16:9 Facebook share image"
  }
}

The coverPrompt and reelPrompt fields are CRITICAL — write them as professional AI image/video
generation prompts that will produce stunning, on-brand visuals. Think: cinematic lighting,
brand colors (deep navy #0F0F1A to electric violet #6C63FF), Angular logo motifs, code aesthetics.
`.trim();

    try {
      const response = await this.ai.models.generateContent({
        model:    'gemini-2.5-pro',
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

      console.log('   ✅ Instagram Reels copy ready');
      console.log('   ✅ Facebook Page copy ready');
    } catch (err) {
      console.error('   ❌ Gemini copy error:', err.message);
      // Graceful fallback — pipeline continues with generic copy
      const igFallback = {
        caption:     `🚀 ${RELEASE_TAG} is live! Check what's new in best-practise.\n\n${RELEASE_URL}`,
        hashtags:    '#WebDev #Angular #NestJS #OpenSource #Coding #VibeCoding #100DaysOfCode #LearnToCode #JavaScript #TypeScript #FrontEnd #BackEnd #FullStack #Angular20 #SoftwareDevelopment #Programming #Developer #TechEducation #CodeNewbie #GitHub #OpenSourceDev #AngularDev #NestJSDev #VibeCode #DevLife',
        coverPrompt: `Futuristic vertical 9:16 tech art, Angular framework, electric violet palette, release ${RELEASE_TAG}`,
        reelPrompt:  `10-second energetic vertical reel for software release ${RELEASE_TAG}, fast-paced, tech aesthetic, code animations, 9:16 format`,
      };
      const fbFallback = {
        caption:     `We just published ${RELEASE_TAG} of best-practise — an open-source educational platform for modern web development.\n\nThis release brings improvements to our Angular and NestJS curriculum.\n\n${RELEASE_URL}`,
        hashtags:    '#OpenSource #Angular #WebDevelopment #SoftwareEngineering #TechEducation',
        coverPrompt: `Professional 16:9 tech announcement image for best-practise release ${RELEASE_TAG}, navy and violet gradient, Angular logo`,
      };
      this.bundle.copy = { instagram: igFallback, facebook: fbFallback };
    }
  }

  // ────────────────────────────────────────────────────────────
  /**
   * MODULE 2 — Cover Image Generation (Imagen 3 via Vertex AI)
   *
   * Generates two covers:
   *   • 9:16  portrait → Instagram Reels cover
   *   • 16:9  wide     → Facebook / OG share image
   */
  async generateCoverImages() {
    console.log('\n🎨 [Module 2] Generating platform covers with Imagen 3...');

    const MODEL = 'imagen-3.0-generate-002';

    const variants = [
      {
        key:    'portrait',
        ratio:  '9:16',
        label:  'Instagram Reels',
        prompt: this.bundle.copy?.instagram?.coverPrompt,
        suffix: 'instagram-reels-cover',
        mime:   'image/png',
      },
      {
        key:    'wide',
        ratio:  '16:9',
        label:  'Facebook',
        prompt: this.bundle.copy?.facebook?.coverPrompt,
        suffix: 'facebook-cover',
        mime:   'image/png',
      },
    ];

    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];

      // ── Rate-limit guard: Imagen 3 quota is per-minute ──────
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
   * MODULE 3 — Video Reel (Veo 3 via Vertex AI)
   *
   * Generates a 9:16 short-form video for Instagram Reels.
   *
   * Architecture:
   *   1. Submit generateVideos() → get a long-running Operation
   *   2. Poll ai.operations.get(operationName) every POLL_INTERVAL_MS
   *      until status === 'SUCCEEDED' or max attempts reached
   *   3. Download the resulting video to disk for GCS upload
   */
  async generateVideoTeaser() {
    console.log('\n🎥 [Module 3] Generating Reels teaser with Veo 3...');

    const MODEL            = 'veo-3.0-generate-preview';
    const POLL_INTERVAL_MS = 30_000;
    const MAX_ATTEMPTS     = 3;

    const prompt = this.bundle.copy?.instagram?.reelPrompt ||
      `Ultra-energetic 10-second vertical video for software release "${RELEASE_TAG}".
       Opening: Angular logo shattering into particles, reassembling as release tag text.
       Mid: lightning-fast code snippets scrolling on dark terminal.
       End: "best-practise" brand logo reveal with electric glow, call-to-action overlay.
       Style: Cinematic, fast-cut, electric blue & violet palette, 4K 60fps, 9:16 vertical.`;

    const filename  = `release-${sanitizeFilename(RELEASE_TAG)}-reels.mp4`;
    const localPath = path.join(process.cwd(), filename);

    try {
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
      console.log('Operation: ', JSON.stringify(operation));
      console.log(`   [Module 3] Polling every ${POLL_INTERVAL_MS / 1000}s (max ${MAX_ATTEMPTS} attempts)...`);

      let succeeded      = false;
      let finalOperation = null;

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        await sleep(POLL_INTERVAL_MS);

        let pollResult;
        try {
          
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
      }

      if (!succeeded) {
        throw new Error(`Veo 3 operation did not complete within ${MAX_ATTEMPTS * POLL_INTERVAL_MS / 1000}s.`);
      }

      const videoBytes =
        finalOperation?.response?.generatedSamples?.[0]?.video?.videoBytes ||
        finalOperation?.response?.videos?.[0]?.videoBytes ||
        null;

      if (videoBytes) {
        fs.writeFileSync(localPath, videoBytes, 'base64');
        console.log(`   ✅ [Module 3] Video ready → ${filename}`);
        this.bundle.video = { localPath, filename, operationName: opName, publicUrl: null };
      } else {
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
      console.warn(`   ⚠️  [Module 3] Veo 3 non-fatal error: ${err.message}`);
      this.bundle.video = { localPath: null, filename, operationName: null, publicUrl: null };
    }
  }

  // ────────────────────────────────────────────────────────────
  /**
   * MODULE 4 — Asset Persistence (Google Cloud Storage)
   *
   * Uploads all local assets (covers + video) to GCS.
   * Sets public=true so Meta's crawler can fetch the file URLs directly.
   */
  async uploadToGCS() {
    if (!BUCKET_NAME) {
      console.log('\n☁️  [Module 4] GCS_MARKETING_BUCKET not set — skipping upload.');
      return;
    }

    console.log(`\n☁️  [Module 4] Uploading to gs://${BUCKET_NAME}...`);
    const folder = `releases/${sanitizeFilename(RELEASE_TAG)}`;

    const uploadsMap = [
      { asset: this.bundle.images.portrait, type: 'image/png', label: 'Instagram Reels cover' },
      { asset: this.bundle.images.wide,     type: 'image/png', label: 'Facebook cover'        },
      { asset: this.bundle.video,           type: 'video/mp4', label: 'Video reel'             },
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

    await this.cleanupLocals();
  }

  // ────────────────────────────────────────────────────────────
  /**
   * cleanupLocals — deletes .png and .mp4 files after GCS upload.
   */
  async cleanupLocals() {
    console.log('   🧹 [Module 4] Cleaning up local temp files...');
    const cwd      = process.cwd();
    const toDelete = [
      this.bundle.images.portrait?.localPath,
      this.bundle.images.wide?.localPath,
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
  logSummary() {
    const ok = (v) => v ? '✅' : '⚠️ ';
    const ig  = this.bundle.copy?.instagram;
    const fb  = this.bundle.copy?.facebook;

    const igId  = this.bundle.meta.igPublishId || 'N/A';
    const fbId  = this.bundle.meta.fbPostId    || 'N/A';
    const vidOk = this.bundle.video?.publicUrl || this.bundle.video?.operationName;

    console.log('\n╔═══════════════════════════════════════════════╗');
    console.log('║         PIPELINE SUMMARY                      ║');
    console.log('╠═══════════════════════════════════════════════╣');
    console.log(`║  Release      : ${RELEASE_TAG.padEnd(30)}║`);
    console.log(`║  Copy         : ${ok(ig)} IG Reels  ${ok(fb)} FB Page         ║`);
    console.log(`║  IG Cover     : ${(this.bundle.images.portrait?.publicUrl ? '✅ Uploaded' : '⚠️  Skipped ').padEnd(30)}║`);
    console.log(`║  FB Cover     : ${(this.bundle.images.wide?.publicUrl     ? '✅ Uploaded' : '⚠️  Skipped ').padEnd(30)}║`);
    console.log(`║  Video Reel   : ${(vidOk ? '✅ Submitted' : '⚠️  Skipped').padEnd(30)}║`);
    console.log(`║  IG Publish ID: ${igId.toString().padEnd(30)}║`);
    console.log(`║  FB Post ID   : ${fbId.toString().padEnd(30)}║`);
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