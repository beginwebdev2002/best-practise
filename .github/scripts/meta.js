import axios from 'axios';
import { IG_BUSINESS_ID, META_ACCESS_TOKEN, META_API_BASE } from './config.js';

export async function publishImageToInstagram(
  publicUrl = "https://storage.googleapis.com/best-practise-media-assets/generated-photos/1774460124511/sample_0.png",
  caption = "Новый релиз best-practise уже доступен! 🚀 #Angular #WebDev #Coding"
) {
  try {
    const commonParams = { access_token: META_ACCESS_TOKEN };

    // --- ШАГ 1: Создание контейнера ---
    console.log('📸 Шаг 1: Создание медиа-контейнера...');
    const containerResponse = await axios.post(
      `${META_API_BASE}/${IG_BUSINESS_ID}/media`, 
      {
        image_url: publicUrl,
        caption: caption,
        media_type: 'IMAGE'
      },
      { params: commonParams }
    );
    const containerId = containerResponse.data.id;

    // --- ШАГ 2: Ожидание готовности (Polling) ---
    console.log(`⏳ Шаг 2: Ожидание обработки контейнера ${containerId}...`);
    let isReady = false;
    
    // Цикл на 10 попыток с интервалом 20 секунд
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 20000));
      
      const statusResponse = await axios.get(
        `${META_API_BASE}/${containerId}`, 
        { params: { ...commonParams, fields: 'status_code' } }
      );
      
      const statusCode = statusResponse.data.status_code;
      console.log(`   Попытка ${i + 1}: Статус — ${statusCode}`);

      if (statusCode === 'FINISHED') {
        isReady = true;
        break;
      } else if (statusCode === 'ERROR') {
        throw new Error('Meta не смогла обработать изображение.');
      }
    }

    if (!isReady) throw new Error('Превышено время ожидания готовности медиа.');

    // --- ШАГ 3: Финальная публикация ---
    console.log('🚀 Шаг 3: Публикация в ленту...');
    const publishResponse = await axios.post(
      `${META_API_BASE}/${IG_BUSINESS_ID}/media_publish`, 
      { creation_id: containerId },
      { params: commonParams }
    );

    console.log(`✅ Успешно опубликовано! ID поста: ${publishResponse.data.id}`);
    return publishResponse.data.id;

  } catch (error) {
    const errorDetail = error.response?.data?.error?.message || error.message;
    console.error('🛑 Ошибка публикации в Instagram:', errorDetail);
    throw error;
  }
}



export async function publishVideoToInstagram(
  videoUrl = "https://storage.googleapis.com/best-practise-media-assets/generated-videos/5610414438879400379/sample_0.mp4", 
  caption = "Default Reels caption #Angular #WebDev"
) {
  try {
    const commonParams = { access_token: META_ACCESS_TOKEN };

    // --- ШАГ 1: Создание контейнера для REELS ---
    console.log('🎬 Шаг 1: Регистрация Reels-контейнера в Meta...');
    const containerResponse = await axios.post(
      `${META_API_BASE}/${IG_BUSINESS_ID}/media`,
      {
        media_type: 'REELS',
        video_url: videoUrl,
        caption: caption,
        share_to_feed: true // Дублировать в основную сетку профиля
      },
      { params: commonParams }
    );
    const containerId = containerResponse.data.id;

    // --- ШАГ 2: Ожидание обработки (Polling) ---
    // Для видео увеличиваем количество попыток до 30, так как Reels могут обрабатываться долго
    console.log(`⏳ Шаг 2: Ожидание обработки видео ${containerId}...`);
    let isReady = false;

    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 30000)); // Интервал 30 секунд
      
      const statusResponse = await axios.get(
        `${META_API_BASE}/${containerId}`,
        { params: { ...commonParams, fields: 'status_code' } }
      );

      const statusCode = statusResponse.data.status_code;
      console.log(`   Попытка ${i + 1}: Статус — ${statusCode}`);

      if (statusCode === 'FINISHED') {
        isReady = true;
        break;
      } else if (statusCode === 'ERROR') {
        // Выводим ошибку, если Meta отклонила видео (например, из-за формата)
        throw new Error('Meta вернула ошибку при обработке видео.');
      }
    }

    if (!isReady) throw new Error('Превышено время ожидания (Timeout) обработки Reels.');

    // --- ШАГ 3: Публикация контейнера ---
    console.log('🚀 Шаг 3: Финальная публикация Reels...');
    const publishResponse = await axios.post(
      `${META_API_BASE}/${IG_BUSINESS_ID}/media_publish`,
      { creation_id: containerId },
      { params: commonParams }
    );

    console.log(`✅ Видео успешно опубликовано! ID: ${publishResponse.data.id}`);
    return publishResponse.data.id;

  } catch (error) {
    const errorDetail = error.response?.data?.error?.message || error.message;
    console.error('🛑 Ошибка публикации Reels:', errorDetail);
    throw error;
  }
}
