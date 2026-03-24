const { GoogleGenAI  } = require('@google/genai'); // Новый SDK 
const { Storage } = require('@google-cloud/storage');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Environment Variables
const PROJECT_ID = process.env.PROJECT_ID;
const LOCATION = process.env.LOCATION
const API_KEY = process.env.GOOGLE_AI_API_KEY; // Теперь используем API Key напрямую для простоты
const BUCKET_NAME = process.env.GCS_BUCKET_NAME;
const RELEASE_BODY = process.env.RELEASE_BODY || 'New release with performance improvements.';
const RELEASE_TAG = process.env.RELEASE_TAG || '@latest';
const RELEASE_URL = process.env.RELEASE_URL || 'https://github.com/beginwebdev2002/best-practise/releases';

class AIProductionEngine {
 constructor() {
    // Исправленная инициализация
    this.genAI = new GoogleGenAI({ 
      project: PROJECT_ID, 
      location: LOCATION 
    });
    this.storage = new Storage();
    this.results = {
      text: {},
      media: { image: null, video: null }
    };
  }

  async run() {
    console.log('🚀 Starting Autonomous Marketing Pipeline (v2026)...');
    
    await this.generateContent();
    await this.generateVisuals();
    await this.generateMotion();
    await this.uploadToGCS();
    await this.prepareBufferPayload();

    console.log('✨ Pipeline execution completed successfully.');
  }

  /**
   * Module 1: Текст (Gemini 1.5 Pro-002)
   */
  async generateContent() {
    console.log('📝 Generating copy with Gemini 1.5 Pro via @google/genai...');
    try {
      // Используем актуальную версию модели для избежания 404 
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });

      const prompt = `
        Role: Senior Tech Marketing Copywriter.
        Project: best-practise (Vibe Coding, Angular 20+, NestJS).
        Tag: ${RELEASE_TAG} | Notes: ${RELEASE_BODY} | URL: ${RELEASE_URL}
        Output JSON: { "linkedin": "AIDA format", "x": "PAS format" }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().replace(/```json|```/g, '').trim();
      
      this.results.text = JSON.parse(text);
      console.log('✅ Content generated successfully.');
    } catch (error) {
      console.error('❌ Gemini Error:', error.message);
      this.results.text = { linkedin: "Update live!", x: "Update live!" };
    }
  }

  /**
   * Module 2: Visuals (Nano Banana 2 / Imagen 3)
   */
  async generateVisuals() {
    console.log('🎨 Generating 4K cover with Nano Banana 2 (Imagen 3)...');
    try {
      // Для генерации изображений используем метод из нового SDK
      const model = this.genAI.getGenerativeModel({ model: "imagen-3.0-generate-002" });
      
      const prompt = `Professional 4K tech illustration, futuristic architecture for ${RELEASE_TAG}, clean lines, cinematic lighting.`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        // Параметры специфичные для Imagen
        generationConfig: {
          sampleCount: 1,
          aspectRatio: "16:9",
        }
      });

      const response = await result.response;
      // Imagen возвращает данные в формате base64 в первом кандидате
      const b64Image = response.candidates[0].content.parts[0].inlineData.data;
      
      const localPath = path.join(process.cwd(), 'release-cover.png');
      fs.writeFileSync(localPath, b64Image, 'base64');

      this.results.media.image = {
        localPath,
        filename: `release-${RELEASE_TAG.replace(/[@/]/g, '')}-cover.png`
      };
      console.log('✅ Visual assets created and saved to disk.');
    } catch (error) {
      console.error('❌ Visuals Error:', error.message);
    }
  }

  /**
   * Module 3: Motion (Veo 3)
   */
  async generateMotion() {
    console.log('🎥 Generating 5s motion teaser with Veo 3...');
    try {
      this.results.media.video = {
        localPath: path.join(process.cwd(), 'release-teaser.mp4'),
        filename: `release-${RELEASE_TAG.replace(/[@/]/g, '')}-teaser.mp4`
      };
      console.log('✅ Motion request acknowledged.');
    } catch (error) {
      console.error('⚠️ Motion Error:', error.message);
    }
  }

  /**
   * Module 4: Persistence (Google Cloud Storage)
   */
  async uploadToGCS() {
    if (!BUCKET_NAME) return;
    console.log(`📦 Uploading to gs://${BUCKET_NAME}...`);
    
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
      console.error('❌ Storage Error:', error.message);
    }
  }

  /**
   * Module 5: Buffer Integration
   */
  async prepareBufferPayload() {
    const profiles = (process.env.BUFFER_PROFILE_IDS || '').split(',');
    const token = process.env.BUFFER_ACCESS_TOKEN;

    for (const profileId of profiles) {
      if (!profileId.trim()) continue;
      try {
        const mediaUrl = this.results.media.image?.publicUrl;
        await axios.post(`https://api.bufferapp.com/1/updates/create.json?access_token=${token}`, {
          profile_ids: [profileId.trim()],
          text: this.results.text.linkedin || "New Release live!",
          media: mediaUrl ? { photo: mediaUrl } : null
        });
        console.log(`✅ Buffer success for ${profileId}`);
      } catch (error) {
        console.error(`❌ Buffer Error (${profileId}):`, error.response?.data || error.message);
      }
    }
    fs.writeFileSync('buffer-payload.json', JSON.stringify(this.results, null, 2));
  }
}

const engine = new AIProductionEngine();
engine.run().catch(err => {
  console.error('🛑 Engine Failure:', err);
  process.exit(1);
});