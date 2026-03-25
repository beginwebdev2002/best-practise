require('dotenv').config();
'use strict';

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║   Autonomous Social Media Content Creator                    ║
 * ║   Platforms : Instagram (Reels · Feed) · Facebook Page       ║
 * ║   AI Stack  : Gemini 2.5 Pro · Imagen 3 · Veo 3 (Vertex AI)  ║
 * ║   Publish   : Meta Graph API v20.0 (direct)                  ║
 * ║   Storage   : Google Cloud Storage (public asset hosting)    ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 *  Entry point — orchestrates the full pipeline.
 *  Each logical step is implemented in its own module under ./modules/.
 *
 *  Pipeline:
 *    Module 1  copy.js   → Gemini 2.5 Pro  — generates captions / prompts
 *    Module 2  images.js → Imagen 3        — generates cover images
 *    Module 3  video.js  → Veo 3           — generates video reel
 *    Module 4  gcs.js    → Cloud Storage   — uploads assets (public URLs)
 *    Module 5  meta.js   → Meta Graph API  — publishes to IG & FB
 */

const { createAIClient, ContentBundle } = require('./ai-client');
const { RELEASE_TAG, RELEASE_URL }      = require('./config');

const { generateAllCopy }    = require('./modules/copy');
const { generateCoverImages} = require('./modules/images');
const { generateVideoTeaser} = require('./modules/video');
const { uploadToGCS }        = require('./modules/gcs');
const { MetaPublisher }      = require('./modules/meta');

// ═══════════════════════════════════════════════════════════════
//  PIPELINE ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════
class SocialContentEngine {
  constructor() {
    this.ai     = createAIClient();
    this.bundle = new ContentBundle();
  }

  async run() {
    console.log('\n🚀 ═══════ Social Content Creator Pipeline ═══════');
    console.log(`📦 Release : ${RELEASE_TAG}`);
    console.log(`🔗 URL     : ${RELEASE_URL}\n`);

    await generateAllCopy(this.ai, this.bundle);      // Module 1
    await generateCoverImages(this.ai, this.bundle);  // Module 2
    await generateVideoTeaser(this.ai, this.bundle);  // Module 3
    await uploadToGCS(this.bundle);                   // Module 4
    await new MetaPublisher(this.bundle).run();        // Module 5

    this.logSummary();
    console.log('\n✅ ═══════ Pipeline Completed ═══════\n');
  }

  logSummary() {
    const ok   = (v) => v ? '✅' : '⚠️ ';
    const ig   = this.bundle.copy?.instagram;
    const fb   = this.bundle.copy?.facebook;
    const igId = this.bundle.meta.igPublishId || 'N/A';
    const fbId = this.bundle.meta.fbPostId    || 'N/A';
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