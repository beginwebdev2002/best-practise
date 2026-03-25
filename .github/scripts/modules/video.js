'use strict';

const fs   = require('fs');
const path = require('path');
const { RELEASE_TAG } = require('../config');
const { sanitizeFilename, sleep } = require('../utils');

// ═══════════════════════════════════════════════════════════════
//  MODULE 3 — Video Reel Generation (Veo 3 via Vertex AI)
//
//  Generates a 9:16 short-form video for Instagram Reels.
//
//  Architecture:
//    1. Submit generateVideos()  → long-running Operation
//    2. Poll ai.operations.get() every POLL_INTERVAL_MS
//       until status === 'SUCCEEDED' or MAX_ATTEMPTS reached
//    3. Write video bytes to disk for GCS upload
// ═══════════════════════════════════════════════════════════════

const VEO3_MODEL       = 'veo-3.0-generate-preview';
const POLL_INTERVAL_MS = 30_000;   // 30 seconds between status checks
const MAX_ATTEMPTS     = 20;        // max 10 minutes total wait

/**
 * generateVideoTeaser — submits a Veo 3 job and polls until complete.
 * Veo 3 is in preview — all errors are non-fatal; pipeline continues.
 *
 * @param {import('@google/genai').GoogleGenAI} ai
 * @param {import('../ai-client').ContentBundle} bundle
 */
async function generateVideoTeaser(ai, bundle) {
  console.log('\n🎥 [Module 3] Generating Reels teaser with Veo 3...');

  const prompt = bundle.copy?.instagram?.reelPrompt ||
    `Ultra-energetic 10-second vertical video for software release "${RELEASE_TAG}".
     Opening: Angular logo shattering into particles, reassembling as release tag text.
     Mid: lightning-fast code snippets scrolling on dark terminal.
     End: "best-practise" brand logo reveal with electric glow, call-to-action overlay.
     Style: Cinematic, fast-cut, electric blue & violet palette, 4K 60fps, 9:16 vertical.`;

  const filename  = `release-${sanitizeFilename(RELEASE_TAG)}-reels.mp4`;
  const localPath = path.join(process.cwd(), filename);

  try {
    // ── Step 1: Submit ────────────────────────────────────────
    console.log('   [Module 3] Submitting Veo 3 generation request...');
    const operation = await ai.models.generateVideos({
      model:  VEO3_MODEL,
      prompt,
      config: { aspectRatio: '9:16', durationSeconds: 10, resolution: '1080p' },
    });

    const opName = operation?.name || operation?.operationName || null;
    if (!opName) throw new Error('Veo 3: no operation name returned — cannot poll.');

    console.log(`   [Module 3] Operation started → ${opName}`);
    console.log(`   [Module 3] Polling every ${POLL_INTERVAL_MS / 1000}s (max ${MAX_ATTEMPTS} attempts)...`);

    // ── Step 2: Poll ──────────────────────────────────────────
    let succeeded      = false;
    let finalOperation = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      await sleep(POLL_INTERVAL_MS);

      let pollResult;
      try {
        pollResult = await ai.operations.get({ name: opName });
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
        succeeded = true; finalOperation = pollResult; break;
      }
      if (status === 'FAILED' || status === 'CANCELLED') {
        throw new Error(`Veo 3 operation ${status}: ${JSON.stringify(pollResult?.error || {})}`);
      }
    }

    if (!succeeded) {
      throw new Error(`Veo 3 operation did not complete within ${MAX_ATTEMPTS * POLL_INTERVAL_MS / 1000}s.`);
    }

    // ── Step 3: Retrieve video ────────────────────────────────
    const videoBytes =
      finalOperation?.response?.generatedSamples?.[0]?.video?.videoBytes ||
      finalOperation?.response?.videos?.[0]?.videoBytes ||
      null;

    if (videoBytes) {
      fs.writeFileSync(localPath, videoBytes, 'base64');
      console.log(`   ✅ [Module 3] Video ready → ${filename}`);
      bundle.video = { localPath, filename, operationName: opName, publicUrl: null };
    } else {
      const gcsUri =
        finalOperation?.response?.generatedSamples?.[0]?.video?.uri ||
        finalOperation?.response?.videos?.[0]?.uri || null;

      if (gcsUri) {
        console.log(`   ✅ [Module 3] Video stored at GCS URI → ${gcsUri}`);
        bundle.video = { localPath: null, filename, operationName: opName, gcsUri, publicUrl: null };
      } else {
        console.warn('   ⚠️  [Module 3] Operation SUCCEEDED but no video data found in response.');
        bundle.video = { localPath: null, filename, operationName: opName, publicUrl: null };
      }
    }
  } catch (err) {
    // Veo 3 is in preview — treat all errors as non-fatal
    console.warn(`   ⚠️  [Module 3] Veo 3 non-fatal error: ${err.message}`);
    bundle.video = { localPath: null, filename, operationName: null, publicUrl: null };
  }
}

module.exports = { generateVideoTeaser };
