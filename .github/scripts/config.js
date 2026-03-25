'use strict';

// ═══════════════════════════════════════════════════════════════
//  ENVIRONMENT VARIABLES  ← DO NOT MODIFY OR DELETE
// ═══════════════════════════════════════════════════════════════

// ── Vertex AI / Gemini ────────────────────────────────────────
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
const RELEASE_BODY = process.env.RELEASE_BODY || 'New release with performance improvements.';
const RELEASE_TAG  = process.env.RELEASE_TAG  || '@latest';
const RELEASE_URL  = process.env.RELEASE_URL  || 'https://github.com/beginwebdev2002/best-practise/releases';

// Parsed GCP credentials (used in local/CI contexts)
const credentials = process.env.GCP_SA_KEY ? JSON.parse(process.env.GCP_SA_KEY) : undefined;

// ═══════════════════════════════════════════════════════════════
//  PLATFORM CONFIG
// ═══════════════════════════════════════════════════════════════
const PLATFORM_CONFIG = {
  instagram: {
    captionMaxChars: 2200,
    hashtagCount:    25,
    contentStyle:    'visual storytelling, lifestyle, aspirational, emoji-rich',
    aspectRatio:     '4:5',  // Reels (vertical)
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

module.exports = {
  PROJECT_ID, LOCATION, API_KEY, NANO_BANANA_API_KEY, VEO3_API_KEY,
  GCP_SA_KEY, BUCKET_NAME, credentials,
  META_ACCESS_TOKEN, IG_BUSINESS_ID, FB_PAGE_ID, APP_ID, META_API_BASE,
  RELEASE_BODY, RELEASE_TAG, RELEASE_URL,
  PLATFORM_CONFIG,
};
