import 'dotenv/config';
import { generateImagen3 } from './gen-image.js';
import { generateText } from './gen-text.js';
import { generateVeoVideo } from './gen-video.js';
import { publishImageToInstagram, publishVideoToInstagram } from './meta.js';
import { genPromptDescription, genPromptImage, genPromptVideo } from './prompts.js';
import { RELEASE_BODY, RELEASE_TAG, RELEASE_URL } from './config.js';


async function init() {
    console.log('RELEASE_BODY', RELEASE_BODY, 'RELEASE_TAG', RELEASE_TAG, 'RELEASE_URL', RELEASE_URL);
    await Promise.all([
        initInstagramPhoto(),
        initInstagramVideo()
    ]);
}

async function initInstagramPhoto() {
    const [imagePrompt, descriptionPrompt] = await Promise.all([
        genPromptImage(),
        genPromptDescription()
    ]);

    const [generateDescription, generateImage] = await Promise.all([
        generateText(descriptionPrompt),
        generateImagen3(imagePrompt)
    ]);

    console.log('generateDescription', generateDescription);
    console.log('imagePrompt', imagePrompt);
    
    const publishInstagramImage = await publishImageToInstagram(generateImage, generateDescription);
    return publishInstagramImage;
}

async function initInstagramVideo() {
    const [videoPrompt, descriptionPrompt] = await Promise.all([
        genPromptVideo(),
        genPromptDescription()
    ]);

    const [generateDescription, generateVideo] = await Promise.all([
        generateText(descriptionPrompt),
        generateVeoVideo(videoPrompt)
    ]);

    const publishInstagramVideo = await publishVideoToInstagram(generateVideo, generateDescription);
    return publishInstagramVideo;
}

init();