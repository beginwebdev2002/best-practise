import { randomInt } from 'crypto';
import 'dotenv/config';
import { writeFile } from 'fs';
import { join } from 'path';

export async function saveImage(bytes, filename = randomText() + '.png') {
    const localPath = join(process.cwd(), filename);
    await writeFile(localPath, bytes, { encoding: 'base64' }, (err) => {
        if (err) throw err;
        console.log(`✅ Изображение успешно сгенерировано`);
    });
    return localPath;
}

export async function saveVideo(bytes, filename = randomText() + '.mp4') {
    const localPath = join(process.cwd(), filename);
    await writeFile(localPath, bytes, { encoding: 'base64' });
    console.log(`✅ Видео успешно сгенерировано`);
    return localPath;
}

export function randomText() {
    const chars = '123567890abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 35; i++) {
        result += chars[randomInt(0, chars.length)];
    }
    return result;
}


export function convertGcsUriToPublicUrl(gcsUri) {
    const publicUrl = gcsUri.split('gs://')[1];
    const url = new URL(publicUrl, 'https://storage.googleapis.com');
    return url.href;
}

export function parseJson(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;

  try {
    // 1. Убираем возможные Markdown-заборы ```json и ```
    let cleanText = rawText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    // 2. Находим индекс первой '{' и последней '}' 
    // Это спасет, если AI добавил какой-то текст до или после JSON
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("JSON не найден в ответе модели");
    }

    cleanText = cleanText.substring(firstBrace, lastBrace + 1);

    // 3. Финальный парсинг
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("🛑 Ошибка парсинга JSON:");
    console.error("Message:", error.message);
    return null;
  }
}
// export convert
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));