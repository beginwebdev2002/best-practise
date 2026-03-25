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
    let symbols = [1, 2,3,5,6,7,8,9,0,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    symbols = symbols.map(() => {
        return symbols[Math.floor(Math.random() * symbols.length)]
    });

    return symbols.join('');
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