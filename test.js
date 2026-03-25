import axios from 'axios';

const TOKEN = 'EAANiqJ0j1XEBRONWZBBlOxzW0WgJQXm68nbRZASs7YJrMlXc550snAj6PTMmhM65kyZCXrN1Q1w3DROEwRcnszKrKVaNZABY1j9K4lXDQVANrq0da9U4GcjsPII5ezZCTDGidJ61iUxxm0mkFyNsmzysK9ieFZCZB1AMptMwVO7QXhfU7HK9nMVwdhfxOz3';
const IG_ID = '17841440997630321';
const VIDEO_URL = 'https://videos.pexels.com/video-files/5495890/5495890-hd_1080_1920_30fps.mp4';

async function startPublishing() {
  try {
    // --- ШАГ 1: Создание контейнера ---
    const step1 = await axios.post(`https://graph.facebook.com/v20.0/${IG_ID}/media`, {
      media_type: 'REELS',
      video_url: VIDEO_URL,
      caption: 'Automated via NestJS! 🚀 #coding #nestjstips',
      access_token: TOKEN
    });

    const containerId = step1.data.id;
    console.log(`✅ Контейнер создан. ID: ${containerId}`);

    // --- ШАГ 2: Опрос статуса (Polling) ---
    let isFinished = false;
    console.log('⏳ Ожидание обработки видео...');

    while (!isFinished) {
      // Ждем 10 секунд перед следующей проверкой
      await new Promise(resolve => setTimeout(resolve, 10000));

      const statusResponse = await axios.get(`https://graph.facebook.com/v20.0/${containerId}`, {
        params: {
          fields: 'status_code',
          access_token: TOKEN
        }
      });

      const status = statusResponse.data.status_code;
      console.log(`📡 Текущий статус: ${status}`);

      if (status === 'FINISHED') {
        isFinished = true;
      } else if (status === 'ERROR') {
        throw new Error('Ошибка обработки видео на стороне Meta');
      }
    }

    // --- ШАГ 3: Публикация ---
    console.log('🚀 Видео готово! Публикую...');
    const step3 = await axios.post(`https://graph.facebook.com/v20.0/${IG_ID}/media_publish`, {
      creation_id: containerId,
      access_token: TOKEN
    });

    console.log('🎉 УСПЕХ! Reel опубликован. ID поста:', step3.data.id);

  } catch (error) {
    console.error('❌ Критическая ошибка:', error.response?.data || error.message);
  }
}

startPublishing();