import { createAIClient } from './ai-client.js';
import { convertGcsUriToPublicUrl } from './utils.js';

export async function generateVeoVideo(prompt) {
  const ai = createAIClient();
//   const modelName = 'veo-3.0-generate-preview';
  const modelName = 'veo-3.1-generate-preview';
  console.log(`🎥 [Veo 3] Запуск генерации видео...`);
  console.log(`📝 Промпт: ${prompt}`);

  try {
    // Шаг 1: Отправка запроса на генерацию
    const outputGcsUri = "gs://best-practise-media-assets/generated-videos/"
    let operation = await ai.models.generateVideos({
    model: modelName,
    prompt: prompt,
    config: {
      durationSeconds: 10,
      aspectRatio: '16:9',
      outputGcsUri,
    },
  });
  let i = 0;
  while (!operation.done) {
    console.log(`logger: ${i}`);
    if (i > 100) {
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 15000));
    operation = await ai.operations.get({operation: operation});
    i++;
  }

  if (operation.response) {
    return convertGcsUriToPublicUrl(operation.response.generatedVideos[0].video.uri)
  }
    

  } catch (err) {
    console.error('❌ Ошибка модуля видео:', err.message);
    throw err;
  }
}

