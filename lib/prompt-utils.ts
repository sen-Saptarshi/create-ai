// A collection of prompt enhancement and generation utilities

/**
 * Enhances a user prompt with additional details and descriptive language
 */
export function enhancePrompt(prompt: string): string {
  // Basic enhancement - add detail and quality markers
  const enhancementPhrases = [
    "highly detailed",
    "professional quality",
    "masterful composition",
    "stunning",
    "intricate details",
    "perfect lighting",
    "award-winning",
    "breathtaking",
    "ultra high resolution",
  ];

  // Select 2-3 random enhancement phrases
  const selectedEnhancements = [];
  const numEnhancements = Math.floor(Math.random() * 2) + 2; // 2-3 enhancements

  const usedIndices = new Set();
  for (let i = 0; i < numEnhancements; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * enhancementPhrases.length);
    } while (usedIndices.has(randomIndex));

    usedIndices.add(randomIndex);
    selectedEnhancements.push(enhancementPhrases[randomIndex]);
  }

  // Combine the original prompt with enhancements
  return `${prompt}, ${selectedEnhancements.join(", ")}`;
}

/**
 * Returns a random prompt from a predefined list
 */
export function getRandomPrompt(): string {
  const prompts = [
    "A serene mountain landscape at sunset with a small cabin",
    "A futuristic cityscape with flying vehicles and neon lights",
    "A magical forest with glowing plants and mythical creatures",
    "An underwater scene with colorful coral reefs and exotic fish",
    "A cozy cafe interior with rain falling outside the windows",
    "A space station orbiting a vibrant nebula",
    "A medieval castle on a cliff overlooking the ocean",
    "A cyberpunk street market at night with vendors and holographic signs",
    "A peaceful Japanese garden with cherry blossoms and a koi pond",
    "A desert oasis with palm trees and a clear blue pool",
    "A steampunk airship flying through clouds",
    "A fantasy library with floating books and magical artifacts",
    "A tropical beach at sunrise with crystal clear water",
    "An ancient temple hidden in a dense jungle",
    "A rustic farmhouse in a field of wildflowers",
    "A bustling spice market with colorful stalls and exotic goods",
    "A winter wonderland with snow-covered trees and a frozen lake",
    "A vintage train station with steam locomotives",
    "A mystical portal between two worlds with swirling energy",
    "A cozy treehouse village connected by rope bridges",
  ];

  return prompts[Math.floor(Math.random() * prompts.length)];
}

// Helper functions for prompt modifiers
export function getStyleModifier(style: string): string {
  const styleModifiers: Record<string, string> = {
    anime: ", anime style, manga art, vibrant colors, clean lines",
    realistic:
      ", photorealistic, highly detailed, sharp focus, professional photography",
    "3d": ", 3D render, octane render, cinema 4D, blender, volumetric lighting",
    watercolor:
      ", watercolor painting, soft edges, flowing colors, artistic, textured paper",
    "oil-painting":
      ", oil painting, textured canvas, detailed brushstrokes, rich colors",
    "pixel-art":
      ", pixel art, 8-bit style, retro game aesthetic, limited color palette",
    sketch: ", pencil sketch, hand-drawn, detailed linework, shading, artistic",
  };

  return styleModifiers[style] || "";
}

export function getCameraAngleModifier(angle: string): string {
  const angleModifiers: Record<string, string> = {
    "close-up": ", close-up shot, detailed, intimate perspective",
    "wide-angle": ", wide-angle lens, expansive view, capturing environment",
    aerial: ", aerial view, bird's eye perspective, from above",
    "low-angle": ", low angle shot, looking upward, dramatic perspective",
    "high-angle": ", high angle shot, looking downward, overview perspective",
    "dutch-angle": ", dutch angle, tilted horizon, dynamic composition",
    fisheye: ", fisheye lens, distorted perspective, ultra-wide view",
  };

  return angleModifiers[angle] || "";
}

export function getLightingModifier(lighting: string): string {
  const lightingModifiers: Record<string, string> = {
    natural: ", natural lighting, daylight, soft shadows",
    soft: ", soft lighting, diffused, gentle shadows, flattering",
    dramatic: ", dramatic lighting, high contrast, deep shadows, moody",
    backlit: ", backlit, rim lighting, silhouette effect, glowing edges",
    "golden-hour":
      ", golden hour lighting, warm orange glow, long shadows, sunset",
    "blue-hour": ", blue hour lighting, cool blue tones, twilight atmosphere",
    studio: ", studio lighting, professional setup, controlled environment",
    neon: ", neon lighting, vibrant colors, urban night, cyberpunk aesthetic",
  };

  return lightingModifiers[lighting] || "";
}