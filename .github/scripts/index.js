import 'dotenv/config';
import { generateImagen3 } from './gen-image.js';
import { generateText } from './gen-text.js';
import { generateVeoVideo } from './gen-video.js';
import { publishImageToInstagram, publishVideoToInstagram } from './meta.js';
import { genPromptDescription, genPromptImage, genPromptVideo } from './prompts.js';


async function init() {
    await initInstagramPhoto();
    await initInstagramVideo();
}

async function initInstagramPhoto() {
    const imagePrompt = await genPromptImage();
    const descriptionPrompt = await genPromptDescription();
    const generateDescription = await generateText(descriptionPrompt);
    const generateImage = await generateImagen3(imagePrompt);
    const publishInstagramImage = await publishImageToInstagram(generateImage, generateDescription);
    return publishInstagramImage;
}

async function initInstagramVideo() {
    const videoPrompt = await genPromptVideo();
    const descriptionPrompt = await genPromptDescription();
    const generateDescription = await generateText(descriptionPrompt);
    const generateVideo = await generateVeoVideo(videoPrompt);
    const publishInstagramVideo = await publishVideoToInstagram(generateVideo, generateDescription);
    return publishInstagramVideo;
}

init();