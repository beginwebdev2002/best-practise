'use strict';

const fs   = require('fs');
const path = require('path');
const { RELEASE_TAG } = require('../config');
const { sanitizeFilename, sleep } = require('../utils');

// ═══════════════════════════════════════════════════════════════
//  MODULE 2 — Cover Image Generation (Imagen 3 via Vertex AI)
//
//  Generates two platform-native covers:
//    • 9:16  portrait → Instagram Reels cover
//    • 16:9  wide     → Facebook / OG share image
//
//  API: ai.models.generateImages({ model, prompt, config })
// ═══════════════════════════════════════════════════════════════

const IMAGEN_MODEL = 'imagen-3.0-generate-002';

const VARIANTS = (bundle) => [
  {
    key:    'portrait',
    ratio:  '9:16',
    label:  'Instagram Reels',
    prompt: bundle.copy?.instagram?.coverPrompt,
    suffix: 'instagram-reels-cover',
    mime:   'image/png',
  },
  {
    key:    'wide',
    ratio:  '16:9',
    label:  'Facebook',
    prompt: bundle.copy?.facebook?.coverPrompt,
    suffix: 'facebook-cover',
    mime:   'image/png',
  },
];

/**
 * generateCoverImages — generates Imagen 3 covers and writes them to disk.
 * Uses AI-generated prompts from Module 1 for brand-aligned visuals.
 *
 * @param {import('@google/genai').GoogleGenAI} ai
 * @param {import('../ai-client').ContentBundle} bundle
 */
async function generateCoverImages(ai, bundle) {
  console.log('\n🎨 [Module 2] Generating platform covers with Imagen 3...');

  const variants = VARIANTS(bundle);

  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];

    // Rate-limit guard: Imagen 3 quota is per-minute
    if (i > 0) {
      console.log(`   ⏳ [Module 2] Waiting 8s before next Imagen request (quota guard)...`);
      await sleep(8_000);
    }

    const prompt = variant.prompt ||
      `Professional tech art for ${variant.label}, software release ${RELEASE_TAG}, ` +
      `Angular aesthetic, deep navy to electric violet gradient, cinematic quality, ${variant.ratio} format.`;

    try {
      const response = await ai.models.generateImages({
        model:  IMAGEN_MODEL,
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

      bundle.images[variant.key] = { localPath, filename };
      console.log(`   ✅ ${variant.label} cover (${variant.ratio}) → ${filename}`);
    } catch (err) {
      console.error(`   ❌ Imagen 3 error (${variant.label}):`, err.message);
      bundle.images[variant.key] = null;
    }
  }
}

module.exports = { generateCoverImages };
