'use strict';

const fs   = require('fs');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const { BUCKET_NAME, RELEASE_TAG, RELEASE_URL, credentials } = require('../config');
const { sanitizeFilename } = require('../utils');

// ═══════════════════════════════════════════════════════════════
//  MODULE 4 — Asset Persistence (Google Cloud Storage)
//
//  Uploads all local assets (covers + video) to GCS.
//  Sets files as public so Meta's crawler can fetch them via URL.
//  Cleans up local temp files after upload.
// ═══════════════════════════════════════════════════════════════

/**
 * uploadToGCS — uploads generated images and video to GCS.
 * Assigns publicUrl on each asset object for use in Module 5.
 *
 * @param {import('../ai-client').ContentBundle} bundle
 */
async function uploadToGCS(bundle) {
  if (!BUCKET_NAME) {
    console.log('\n☁️  [Module 4] GCS_MARKETING_BUCKET not set — skipping upload.');
    return;
  }

  const storage = new Storage({ credentials });

  console.log(`\n☁️  [Module 4] Uploading to gs://${BUCKET_NAME}...`);
  const folder = `releases/${sanitizeFilename(RELEASE_TAG)}`;

  const uploadsMap = [
    { asset: bundle.images.portrait, type: 'image/png', label: 'Instagram Reels cover' },
    { asset: bundle.images.wide,     type: 'image/png', label: 'Facebook cover'        },
    { asset: bundle.video,           type: 'video/mp4', label: 'Video reel'             },
  ];

  for (const { asset, type, label } of uploadsMap) {
    if (!asset?.localPath || !fs.existsSync(asset.localPath)) continue;
    try {
      const destination = `${folder}/${asset.filename}`;
      await storage.bucket(BUCKET_NAME).upload(asset.localPath, {
        destination,
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

  await cleanupLocals(bundle);
}

/**
 * cleanupLocals — deletes .png and .mp4 temp files after GCS upload.
 * Keeps the CI runner disk clean on long-lived workers.
 *
 * @param {import('../ai-client').ContentBundle} bundle
 */
async function cleanupLocals(bundle) {
  console.log('   🧹 [Module 4] Cleaning up local temp files...');
  const cwd = process.cwd();
  const toDelete = [
    bundle.images.portrait?.localPath,
    bundle.images.wide?.localPath,
    bundle.video?.localPath,
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

module.exports = { uploadToGCS };
