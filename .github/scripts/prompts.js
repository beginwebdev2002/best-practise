'use strict';
import { PLATFORM_CONFIG, RELEASE_BODY, RELEASE_TAG, RELEASE_URL } from './config.js';





function buildCopyPrompt() {
  return `
PROJECT CONTEXT:
  Name: best-practise
  Release Tag: ${RELEASE_TAG}
  URL: ${RELEASE_URL}
  Details: ${RELEASE_BODY}

TASK:
Generate social media content for Instagram. 
Combine the caption, emojis, and hashtags into a single "caption" string.

────────────────────────────────────────────
INSTAGRAM REQUIREMENTS:
  - image_prompt: Detailed Imagen 3 prompt for a 9:16 cover.
  - video_prompt: Detailed Veo 3 prompt for a 10s 9:16 reel.
  - caption: Punchy copy, emojis, and MIN ${PLATFORM_CONFIG.instagram.hashtagCount} hashtags.

────────────────────────────────────────────
STRICT OUTPUT FORMAT (ARRAY JAVASCRIPT ONLY):
[
  "image_prompt",
  "video_prompt",
  "caption"
]
Prompts must reflect: cinematic lighting.
`.trim();
}


export function genPromptImage() {
    return `
    Photorealistic cinematic shot of a futuristic 'Cognitive Documentation' interface. 
Central element: A floating, translucent 3D shard representing a Markdown file, 
with clean, glowing code and structured headers visible. 
Surrounding the shard are intricate neural pathways and fiber-optic threads in Electric Violet (#6C63FF). 
The background is a Deep Navy (#0F0F1A) server environment, highly organized and minimalist. 
Atmosphere: High-tech, cold, precise. Cinematic lighting with volumetric fog. 
Focus: Interaction between human-readable text and machine-readable structures. 


more info about project:
PROJECT CONTEXT:
  Name: best-practise
  Release Tag: ${RELEASE_TAG}
  URL: ${RELEASE_URL}
  Details: ${RELEASE_BODY}
    `
}

export function genPromptVideo() {
    return `
The scene begins with a chaotic flow of unoptimized code and fragmented data. 
Suddenly, a wave of structured 'best-practise' instructions (represented as glowing violet streams) 
sweeps through the screen, organizing the chaos into a perfect architectural grid. 
The camera moves through a digital landscape where AI agents (visualized as intelligent light orbs) 
instantly dock into these structures and start building code at light speed. 
Final shot: The Jules (jules.google.com) logo subtly appears as a pulsing core of energy. 
Vibe: Hyper-growth, efficiency, self-evolving system. 
High-contrast lighting, neon glows, deep shadows.

more info about project:
PROJECT CONTEXT:
  Name: best-practise
  Release Tag: ${RELEASE_TAG}
  URL: ${RELEASE_URL}
  Details: ${RELEASE_BODY}
    `
}


export function genPromptDescription() {
    return `
Act as a Senior AI Architect. Generate a social media post for 'best-practise'.
CORE FOCUS: Optimization of AI Agents through structured Markdown instructions.
CONTEXT: This project is the bridge between human knowledge and AI execution. 
Supported by jules.google.com for continuous self-development.

STRUCTURE:
1. Hook: Why your AI Agents are failing without structured context.
2. Value Proposition: How 'best-practise' provides the precise architectural 
   blueprint for Angular, NestJS, and Vibe Coding.
3. Tech Detail: Mention that the project is optimized for both Human-Readability 
   and LLM-Processing.
4. CTA: Direct link to the repository ${RELEASE_URL}.
5. Hashtags: #AI_Optimization #AgenticWorkflows #Angular20 #NestJS #OpenSource #JulesAI. 
6 caption: Punchy copy, emojis, and MIN ${PLATFORM_CONFIG.instagram.hashtagCount} hashtags.

TONE: Engineering-first, analytical, high-authority, no fluff.

must have technical details:
max_symbols_description: 2000
min_symbols_description: 1000
max_hashtags_description: 25
min_hashtags_description: 15
    `
}