# 🤖 Autonomous Marketing Engine: README

## Overview
This repository utilizes a fully autonomous pipeline to generate professional marketing assets upon every new release. The engine leverages **Google Cloud Vertex AI** and **Cloud Storage** to create high-fidelity content, visuals, and motion teasers.

## Core Stack
- **Copywriting:** Gemini 1.5 Pro (AIDA/PAS frameworks).
- **Visuals:** Nano Banana 2 / Imagen 3 (4K Cinematic Covers).
- **Motion:** Veo 3 (5s High-Fidelity Teasers).
- **Persistence:** Google Cloud Storage (Public CDN).
- **Distribution:** Buffer API (via JSON payload).

## Efficiency & Credits Monitoring ($300)
To maximize the value of the $300 Google Cloud free tier/credits, follow these best practices:

1. **Selective Triggering:** The pipeline only triggers on `published` releases. Avoid frequent pre-releases if credits are low.
2. **Model Selection:**
   - Gemini 1.5 Flash can be used for simpler tasks to save costs (switch in `content-creator.js`).
   - Imagen 3 is cost-effective for 4K renders compared to manual design.
3. **Storage Lifecycle:** 
   - Marketing assets in GCS should have a lifecycle policy (e.g., move to Coldline after 90 days) to minimize persistent storage costs.
4. **Monitoring:**
   - Use the [Google Cloud Console Billing](https://console.cloud.google.com/billing) to set alerts at 50%, 75%, and 90% of credit usage.
   - Check Vertex AI "Quotas & System Limits" to ensure no unexpected spikes in usage.

## Setup Requirements
Ensure the following GitHub Secrets are configured:
- `GCP_SA_KEY`: Service Account JSON with Vertex AI User and Storage Admin roles.
- `GCP_PROJECT_ID`: Your Google Cloud Project ID.
- `GCS_MARKETING_BUCKET`: Name of the public GCS bucket for assets.
- `GEMINI_API_KEY`: API Key for Vertex AI (if not using SA auth for all).
- `BUFFER_ACCESS_TOKEN`: For social media distribution.
- `BUFFER_PROFILE_IDS`: Comma-separated list of profile IDs.

## Troubleshooting
- **Veo 3 Failures:** The engine is built to be robust. If video generation fails, it will still proceed with text and image generation.
- **Auth Errors:** Ensure the Service Account has `aiplatform.user` permissions.

---
*Engineered for zero-fluff, authoritative tech marketing.*
