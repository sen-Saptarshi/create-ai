import { google } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash-lite"),
    system: "You are a helpful AI assistant. Answer questions concisely, clearly, and with a touch of creativity. Use markdown for formatting and include relevant emojis to enhance communication.",
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
