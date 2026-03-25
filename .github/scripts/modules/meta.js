'use strict';

const {
  META_ACCESS_TOKEN, IG_BUSINESS_ID, FB_PAGE_ID,
  RELEASE_TAG, RELEASE_URL,
} = require('../config');
const { metaRequest, sleep } = require('../utils');

// ═══════════════════════════════════════════════════════════════
//  MODULE 5 — Meta Publisher (Meta Graph API v20.0)
//
//  Implements the 3-step Meta container → poll → publish flow
//  for Instagram Reels and Facebook Page feed.
//
//  Flow:
//    createIgReelContainer()   → containerId
//    waitUntilReady()          ← polls every 20s until FINISHED
//    publishIgContainer()      → igPublishId
//    publishFbFeed()           ← runs in parallel during IG polling
// ═══════════════════════════════════════════════════════════════

class MetaPublisher {
  constructor(bundle) {
    this.bundle = bundle;
  }

  // ────────────────────────────────────────────────────────────
  /**
   * Step 1a — Create IG Reel container (video).
   * media_type=REELS. Requires a publicly accessible video URL.
   */
  async createIgReelContainer(videoUrl, caption) {
    console.log('   [Meta] Creating IG Reel container…');
    const result = await metaRequest('post', `/${IG_BUSINESS_ID}/media`, {}, {
      media_type:    'REELS',
      video_url:     videoUrl,
      caption,
      share_to_feed: true,
      thumb_offset:  1000,
    });
    const id = result?.id;
    if (!id) throw new Error(`IG Reel container creation failed: ${JSON.stringify(result)}`);
    console.log(`   [Meta] IG Reel container created → ${id}`);
    return id;
  }

  // ────────────────────────────────────────────────────────────
  /**
   * Step 1b — Create IG Image container (fallback when no video).
   */
  async createIgImageContainer(imageUrl, caption) {
    console.log('   [Meta] Creating IG Image container (no video fallback)…');
    const result = await metaRequest('post', `/${IG_BUSINESS_ID}/media`, {}, {
      image_url: imageUrl,
      caption,
    });
    const id = result?.id;
    if (!id) throw new Error(`IG Image container creation failed: ${JSON.stringify(result)}`);
    console.log(`   [Meta] IG Image container created → ${id}`);
    return id;
  }

  // ────────────────────────────────────────────────────────────
  /**
   * Step 2 — Poll container until status_code === 'FINISHED'.
   * Meta video processing can take 1-4 minutes for Reels.
   * Throws on ERROR/EXPIRED or timeout.
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
    }

    throw new Error(
      `Meta container ${containerId} did not reach FINISHED within ` +
      `${(maxAttempts * pollIntervalMs) / 60_000} minutes.`
    );
  }

  // ────────────────────────────────────────────────────────────
  /**
   * Step 3 — Publish the ready container to the IG Business account.
   * Returns igPublishId.
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
   */
  async publishFbFeed(message, link, imageUrl) {
    console.log('   [Meta] Publishing to Facebook Page feed…');

    const payload = { message, link };
    if (imageUrl) payload.url = imageUrl;

    const result = await metaRequest('post', `/${FB_PAGE_ID}/feed`, {}, payload);
    const id = result?.id;
    if (!id) throw new Error(`FB feed publish failed: ${JSON.stringify(result)}`);
    console.log(`   [Meta] FB Page post published → ID: ${id}`);
    return id;
  }

  // ────────────────────────────────────────────────────────────
  /**
   * run() — orchestrates the full Meta publishing sequence.
   * FB runs in parallel during the IG container polling wait.
   */
  async run() {
    if (!META_ACCESS_TOKEN || !IG_BUSINESS_ID || !FB_PAGE_ID) {
      console.log('\n📢 [Module 5] META_ACCESS_TOKEN / IG_BUSINESS_ID / FB_PAGE_ID not set — skipping Meta publish.');
      return;
    }

    console.log('\n📢 [Module 5] Meta Publisher — starting…');

    const igCopy     = this.bundle.copy?.instagram;
    const fbCopy     = this.bundle.copy?.facebook;
    const videoUrl   = this.bundle.video?.publicUrl   || null;
    const igImageUrl = this.bundle.images.portrait?.publicUrl || null;
    const fbImageUrl = this.bundle.images.wide?.publicUrl     || null;

    if (!igCopy && !fbCopy) {
      console.warn('   ⚠️  No copy generated for Instagram or Facebook — skipping.');
      return;
    }

    const igCaption = igCopy
      ? `${igCopy.caption}\n\n${igCopy.hashtags}`.trim()
      : `🚀 ${RELEASE_TAG} is live!\n\n${RELEASE_URL}`;

    const fbMessage = fbCopy
      ? `${fbCopy.caption}\n\n${fbCopy.hashtags}`.trim()
      : `${RELEASE_TAG} has been released. Read the full notes: ${RELEASE_URL}`;

    // ── IG: container creation ───────────────────────────────
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

    // ── FB: runs in parallel while IG is processing ──────────
    const fbPublishPromise = (async () => {
      try {
        const id = await this.publishFbFeed(fbMessage, RELEASE_URL, fbImageUrl);
        this.bundle.meta.fbPostId = id;
      } catch (err) {
        console.error('   ❌ FB feed publish error:', err.message);
      }
    })();

    // ── IG: poll + publish ───────────────────────────────────
    if (igContainerId) {
      try {
        await this.waitUntilReady(igContainerId);
        const publishId = await this.publishIgContainer(igContainerId);
        this.bundle.meta.igPublishId = publishId;
      } catch (err) {
        console.error('   ❌ IG polling/publish error:', err.message);
      }
    }

    await fbPublishPromise;
  }
}

module.exports = { MetaPublisher };
