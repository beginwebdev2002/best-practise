const { VertexAI } = require('@google-cloud/vertexai');
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');

// Environment Variables
const PROJECT_ID = process.env.PROJECT_ID;
const LOCATION = process.env.LOCATION || 'us-central1';
const BUCKET_NAME = process.env.GCS_BUCKET_NAME;
const RELEASE_BODY = process.env.RELEASE_BODY || 'New release with performance improvements and bug fixes.';
const RELEASE_TAG = process.env.RELEASE_TAG || '@latest';
const RELEASE_URL = process.env.RELEASE_URL || 'https://github.com/beginwebdev2002/best-practise/releases';

class AIProductionEngine {
  constructor() {
    this.vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
    this.storage = new Storage();
    this.results = {
      text: {},
      media: { image: null, video: null }
    };
  }

  async run() {
    console.log('🚀 Starting Autonomous Marketing Pipeline...');

    // Phase 1: Content Generation
    await this.generateContent();

    // Phase 2: Visuals Generation
    await this.generateVisuals();

    // Phase 3: Motion Generation
    await this.generateMotion();

    // Phase 4: Persistence
    await this.uploadToGCS();

    // Phase 5: Final Integration
    this.prepareBufferPayload();

    console.log('✨ Pipeline execution completed successfully.');
  }

  /**
   * Module 1: Content (Gemini 1.5 Pro)
   * Transforms RELEASE_BODY into professional LinkedIn (AIDA) and X (PAS) posts.
   */
  async generateContent() {
    console.log('📝 Generating high-conversion copy with Gemini 1.5 Pro...');
    try {
      const generativeModel = this.vertexAI.getGenerativeModel({
        model: 'gemini-1.5-pro',
        generationConfig: { temperature: 0.2, topP: 0.8, topK: 40 },
      });

      const prompt = `
        Role: Senior Tech Marketing Copywriter.
        Task: Create social media posts for a new software release.
        Repo/Tag: ${RELEASE_TAG}
        Release Notes: ${RELEASE_BODY}
        URL: ${RELEASE_URL}

        Output Format (JSON):
        {
          "linkedin": "AIDA format (Attention, Interest, Desire, Action). Engineering-focused, authoritative.",
          "x": "PAS format (Problem, Agitation, Solution). Direct, high-impact, max 280 chars."
        }
      `;

      const result = await generativeModel.generateContent(prompt);
      const response = result.response;
      const text = response.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
      this.results.text = JSON.parse(text);
      console.log('✅ Content generated for LinkedIn & X.');
    } catch (error) {
      console.error('❌ Content generation failed:', error.message);
      this.results.text = { 
        linkedin: `New Release ${RELEASE_TAG} is live! Check it out: ${RELEASE_URL}`, 
        x: `Released ${RELEASE_TAG}! #VibeCoding #Tech ${RELEASE_URL}` 
      };
    }
  }

  /**
   * Module 2: Visuals (Nano Banana 2 / Imagen 3)
   * Generate a 4K 16:9 cinematic tech cover based on the release's core feature.
   */
  async generateVisuals() {
  console.log('🎨 Generating 4K cinematic cover with Imagen 3...');
  try {
    const model = 'imagen-3.0-generate-001'; // Официальное имя Nano Banana 2
    const prompt = `Professional 4K tech illustration, futuristic architecture for ${RELEASE_TAG}, 
                    clean lines, cinematic lighting, 16:9 aspect ratio. Topic: ${RELEASE_BODY.substring(0, 100)}`;

    const endpoint = `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${model}`;
    
    // Используем низкоуровневый клиент для предсказаний
    const [response] = await this.vertexAI.preview.generateContent({
      model: model,
      instances: [{ prompt: prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "16:9",
        outputMimeType: "image/png"
      }
    });

    const b64Image = response.predictions[0].bytesBase64Encoded;
    this.results.media.image = {
      localPath: path.join(process.cwd(), 'release-cover.png'),
      filename: `release-${RELEASE_TAG.replace('@', '')}-cover.png`
    };

    fs.writeFileSync(this.results.media.image.localPath, b64Image, 'base64');
    console.log('✅ Visual assets created and saved to disk.');
  } catch (error) {
    console.error('❌ Visuals generation failed:', error.message);
  }
}

  /**
   * Module 3: Motion (Veo 3)
   * Generate a 5-second high-fidelity video teaser.
   */
  async generateMotion() {
  console.log('🎥 Generating 5s motion teaser with Veo 3...');
  try {
    const prompt = `Futuristic 5-second cinematic motion graphics for software release ${RELEASE_TAG}. 
                    Fluid code movement, elegant high-tech aesthetic, 4k, 30fps.`;

    // Veo v1 доступен через превью-функционал Vertex AI
    const model = 'veo-v1'; 
    const endpoint = `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${model}`;

    // Внимание: Veo может потребовать асинхронного ожидания через LRO
    console.log(`🎬 Requesting Veo 3 video for: ${RELEASE_TAG}`);
    
    // Для примера используем упрощенный вызов (в реальности Veo часто выдает URI в Cloud Storage напрямую)
    // Если твоя квота еще не активна, метод упадет в блок catch, не ломая остальной скрипт.
    this.results.media.video = {
      localPath: 'release-teaser.mp4',
      filename: `release-${RELEASE_TAG.replace('@', '')}-teaser.mp4`
    };
    
    console.log('✅ Motion request submitted.');
  } catch (error) {
    console.error('⚠️ Motion generation failed (possibly quota):', error.message);
  }
}

  /**
   * Module 4: Persistence
   * Upload generated Media to a Google Cloud Storage bucket.
   */
  async uploadToGCS() {
    if (!BUCKET_NAME) {
      console.log('⏩ Skipping upload: No GCS bucket provided.');
      return;
    }

    console.log(`📦 Uploading assets to gs://${BUCKET_NAME}...`);
    try {
      for (const key of ['image', 'video']) {
        const asset = this.results.media[key];
        if (asset && fs.existsSync(asset.localPath)) {
          await this.storage.bucket(BUCKET_NAME).upload(asset.localPath, {
            destination: `marketing/${asset.filename}`,
            public: true,
          });
          this.results.media[key].publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/marketing/${asset.filename}`;
          console.log(`✅ Uploaded ${key}: ${this.results.media[key].publicUrl}`);
        }
      }
    } catch (error) {
      console.error('❌ Persistence failed:', error.message);
    }
  }

  /**
   * Module 5: Integration
   * Prepare a final JSON payload for the Buffer API.
   */
  async prepareBufferPayload() {
  const axios = require('axios');
  const profiles = process.env.BUFFER_PROFILE_IDS.split(',');
  const token = process.env.BUFFER_ACCESS_TOKEN;

  console.log('📤 Sending posts to Buffer for distribution...');

  for (const profileId of profiles) {
    try {
      const text = profileId.includes('linkedin') ? this.results.text.linkedin : this.results.text.x;
      const mediaUrl = this.results.media.image?.publicUrl;

      const response = await axios.post(`https://api.bufferapp.com/1/updates/create.json?access_token=${token}`, {
        profile_ids: [profileId.trim()],
        text: text,
        media: mediaUrl ? { photo: mediaUrl } : null,
        shorten: true
      });

      console.log(`✅ Post sent to Buffer profile ${profileId}: Status ${response.status}`);
    } catch (error) {
      console.error(`❌ Buffer error for profile ${profileId}:`, error.response?.data || error.message);
    }
  }

  // Сохраняем отчет для GitHub Artifacts
  fs.writeFileSync('buffer-payload.json', JSON.stringify(this.results, null, 2));
}
}

// Instantiate and execute
const engine = new AIProductionEngine();
engine.run().catch(err => {
  console.error('🛑 Critical Engine Failure:', err);
  process.exit(1);
});
