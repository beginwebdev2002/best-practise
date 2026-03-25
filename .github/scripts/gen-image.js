import {convertGcsUriToPublicUrl} from './utils.js';
import {createAIClient} from './ai-client.js';
import {SYSTEM_INSTRUCTION} from './config.js';
export async function generateImagen3(prompt, filename = 'generated-image.png', numberOfImages = 1, aspectRatio = '4:5', outputMimeType = 'image/png') {
  const ai = createAIClient();
  
  // Выбираем модель Imagen 3 (качество или скорость)
  const modelName = 'imagen-3.0-generate-002';

  console.log(`🎨 Запуск генерации Imagen 3 (${modelName})...`);

  try {
    const outputGcsUri = "gs://best-practise-media-assets/generated-photos/"
    const response = await ai.models.generateImages({
      model:  modelName,
      prompt,
      systemInstruction: SYSTEM_INSTRUCTION,
      config: {
        numberOfImages: numberOfImages,
        aspectRatio:    aspectRatio,
        outputMimeType: outputMimeType,
        outputGcsUri: outputGcsUri
      },
    });
    const image = response.generatedImages[0].image;
    return convertGcsUriToPublicUrl(image.gcsUri);
  } catch (err) {
    console.error(`❌ Imagen 3 error:`, err.message);
  }
}

export function generateGroupImages(imageList) {
    
}