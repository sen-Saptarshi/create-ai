"use server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

// AI Enhance Prompt
export async function aiEnhancePrompt(prompt: string) {
  const { text: enhancedPrompt } = await generateText({
    model: google("gemini-2.0-flash-001"),
    prompt: `
    You are an expert in crafting vivid and imaginative prompts for an AI image generator. You will receive a basic prompt. Your task is to expand it into a highly descriptive, creative, and visually rich prompt, adding detail about the subject, background, mood and colors.
    But Your enhanced prompt should not be too long. Maximum 50 words.
    Do not include any information about lighting, camera angle or style as these will be added separately.

    Input Prompt: ${prompt}
    Enhanced Prompt:
    `,
  });

  return enhancedPrompt;
}
