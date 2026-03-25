'use strict';

const { PLATFORM_CONFIG, RELEASE_TAG, RELEASE_URL, RELEASE_BODY } = require('../config');

// ═══════════════════════════════════════════════════════════════
//  MODULE 1 — Copy Generation (Gemini 2.5 Pro)
//
//  Generates tailored copy for:
//    • Instagram Reels — punchy caption, 20+ hashtags, reel+image prompts
//    • Facebook Page  — professional update, link, detailed copy
// ═══════════════════════════════════════════════════════════════

const systemInstruction = `You are a world-class social media content strategist and copywriter
specialising in developer tools, SaaS products, and tech education platforms.
You create viral, platform-native content that drives engagement and conversions.
Your output is ALWAYS a strict JSON object — no markdown fences, no prose, no comments.
Every caption should feel native to the platform and appeal to its specific algorithm.`;

function buildCopyPrompt() {
  return `
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
}

/**
 * generateAllCopy — uses Gemini 2.5 Pro to produce platform-specific copy.
 * Writes result into bundle.copy. Falls back to hardcoded defaults on error.
 *
 * @param {import('@google/genai').GoogleGenAI} ai
 * @param {import('../ai-client').ContentBundle} bundle
 */
async function generateAllCopy(ai, bundle) {
  console.log('\n📝 [Module 1] Generating platform-specific copy (Gemini 2.5 Pro)...');

  try {
    const response = await ai.models.generateContent({
      model:    'gemini-2.5-pro',
      contents: buildCopyPrompt(),
      config: {
        systemInstruction,
        temperature:     0.8,
        topP:            0.95,
        maxOutputTokens: 4096,
      },
    });

    let raw = (response.text || '').trim();
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    bundle.copy = JSON.parse(raw);
    console.log('   ✅ Instagram Reels copy ready');
    console.log('   ✅ Facebook Page copy ready');
  } catch (err) {
    console.error('   ❌ Gemini copy error:', err.message);

    // Graceful fallback — pipeline continues with generic copy
    bundle.copy = {
      instagram: {
        caption:     `🚀 ${RELEASE_TAG} is live! Check what's new in best-practise.\n\n${RELEASE_URL}`,
        hashtags:    '#WebDev #Angular #NestJS #OpenSource #Coding #VibeCoding #100DaysOfCode #LearnToCode #JavaScript #TypeScript #FrontEnd #BackEnd #FullStack #Angular20 #SoftwareDevelopment #Programming #Developer #TechEducation #CodeNewbie #GitHub #OpenSourceDev #AngularDev #NestJSDev #VibeCode #DevLife',
        coverPrompt: `Futuristic vertical 9:16 tech art, Angular framework, electric violet palette, release ${RELEASE_TAG}`,
        reelPrompt:  `10-second energetic vertical reel for software release ${RELEASE_TAG}, fast-paced, tech aesthetic, code animations, 9:16 format`,
      },
      facebook: {
        caption:     `We just published ${RELEASE_TAG} of best-practise — an open-source educational platform for modern web development.\n\nThis release brings improvements to our Angular and NestJS curriculum.\n\n${RELEASE_URL}`,
        hashtags:    '#OpenSource #Angular #WebDevelopment #SoftwareEngineering #TechEducation',
        coverPrompt: `Professional 16:9 tech announcement image for best-practise release ${RELEASE_TAG}, navy and violet gradient, Angular logo`,
      },
    };
  }
}

module.exports = { generateAllCopy };
