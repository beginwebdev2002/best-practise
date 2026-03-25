'use strict';

const axios = require('axios');
const { META_ACCESS_TOKEN, META_API_BASE } = require('./config');

// ═══════════════════════════════════════════════════════════════
//  UTILITY HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * sanitizeFilename — makes any string safe for GCS object names.
 * Lowercases, replaces non-alphanumeric chars with '-',
 * collapses consecutive hyphens, strips leading/trailing hyphens.
 */
function sanitizeFilename(input) {
  return String(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

/** Sleep for `ms` milliseconds (used in polling loops). */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * metaRequest — thin axios wrapper for Meta Graph API calls.
 *
 * Automatically injects access_token, handles:
 *   - 429 → exponential back-off retry (up to maxRetries)
 *   - 401/403 → throws descriptive auth error
 *   - Other errors → retries with brief pause, throws on last attempt
 *
 * @param {'get'|'post'} method
 * @param {string}       endpoint   - path after META_API_BASE (e.g. '/{id}/media')
 * @param {object}       [params]   - query params (merged with access_token)
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

      if (attempt === maxRetries) {
        throw new Error(
          `Meta API ${method.toUpperCase()} ${endpoint} failed (HTTP ${status ?? 'network'}):\n` +
          `   ${JSON.stringify(body || err.message)}`
        );
      }

      await sleep(2_000 * attempt);
    }
  }
}

module.exports = { sanitizeFilename, sleep, metaRequest };
