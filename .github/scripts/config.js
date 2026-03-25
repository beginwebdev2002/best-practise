import 'dotenv/config';
export const PROJECT_ID          = process.env.PROJECT_ID;
export const LOCATION            = process.env.LOCATION            || 'us-central1';
export const API_KEY             = process.env.GOOGLE_AI_API_KEY;           // Gemini API key (fallback)
export const NANO_BANANA_API_KEY = process.env.NANO_BANANA_API_KEY;         // Reserved for Nano Banana
export const VEO3_API_KEY        = process.env.VEO3_API_KEY;                // Reserved / Veo 3 direct
export const GCP_SA_KEY          = process.env.GCP_SA_KEY;
export const BUCKET_NAME         = process.env.GCS_MARKETING_BUCKET;

// ── Meta Graph API ────────────────────────────────────────────
export const META_ACCESS_TOKEN   = process.env.META_ACCESS_TOKEN;           // Long-lived page token
export const IG_BUSINESS_ID      = process.env.IG_BUSINESS_ID;             // Instagram Business Account ID
export const FB_PAGE_ID          = process.env.FB_PAGE_ID;                 // Facebook Page ID
export const APP_ID              = process.env.APP_ID;                     // Meta App ID (for token validation)
export const META_API_BASE       = 'https://graph.facebook.com/v20.0';

// ── Release Metadata ─────────────────────────────────────────
export const RELEASE_BODY = process.env.RELEASE_BODY || 'New release with performance improvements.';
export const RELEASE_TAG  = process.env.RELEASE_TAG  || '@latest';
export const RELEASE_URL  = process.env.RELEASE_URL  || 'https://github.com/beginwebdev2002/best-practise/releases';

export const CREDENTIALS = JSON.parse(process.env.GCP_SA_KEY);
export const SYSTEM_INSTRUCTION = `
You are the Lead Brand Architect for 'best-practise' — a high-tech knowledge ecosystem for Humans and AI Agents.
Your mission is to ensure 100% visual and textual consistency across all generated content.

────────────────────────────────────────────────────────────────────────────
1. VISUAL UI PILLARS (For image_prompt & video_prompt):
- PRIMARY PALETTE: Deep Navy (#0F0F1A) as base, Electric Violet (#6C63FF) for highlights.
- ACCENT: Neon Cyan (#00F2FF) for data streams and AI interaction points.
- AESTHETIC: "Cyber-Minimalist Blueprint". Use glassmorphism, glowing grid systems, and floating UI elements.
- MOTIFS: Structured Markdown shards, neural connection lines, Angular/NestJS logo geometry.
- LIGHTING: Cinematic high-contrast. Deep shadows with volumetric neon glows.
- COMPOSITION: Centralized focus on "Structured Intelligence". Avoid cluttered or "cartoonish" styles.

────────────────────────────────────────────────────────────────────────────
2. CONTENT UX PILLARS (For caption):
- VOICE: Analytical, direct, and authoritative (Engineer-to-Engineer). 
- NO FLUFF: Avoid "Are you ready?", "Amazing!", "Revolutionary!". Use "Optimized", "Structured", "Architected".
- AUDIENCE: Target both Human Developers and AI Agent logic. Use technical precision.
- STRUCTURE: 
  1. Technical Hook (The 'Why').
  2. Structural Value (The 'How' via best-practise).
  3. AI-Agent Optimization note (The 'Edge').
  4. Repository Link and Professional Hashtags.

────────────────────────────────────────────────────────────────────────────
3. OUTPUT PROTOCOL:
- FORMAT: Strict JSON only.
- KEYS: "image_prompt", "video_prompt", "caption".
- CONSTRAINT: image_prompt and video_prompt must be written in English. Caption can be in the user's requested language but must maintain the Engineering tone.
- NO MARKDOWN: Do not use \`\`\`json blocks. Return raw object starting with { and ending with }.
`.trim();

export const PLATFORM_CONFIG = {
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
