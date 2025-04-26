import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(req: Request) {
  const { prompt, model } = await req.json();

  if (!prompt) {
    return new Response("Prompt is required", { status: 400 });
  }

  try {
    const systemPrompt =
      "You are a helpful AI assistant. Answer questions concisely, clearly, and with a touch of creativity. Use markdown for formatting and include relevant emojis to enhance communication.";
    const aiModel = google(model ?? "gemini-1.5-flash-002");
    const response = await generateText({
      model: aiModel,
      system: systemPrompt,
      prompt,
    });

    return new Response(response.text, { status: 200 });
  } catch (error) {
    return new Response("Error generating text", { status: 500 });
  }
}
