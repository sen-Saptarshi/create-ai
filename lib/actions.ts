"use server";

/**
 * Server action to generate an image based on a prompt
 * This sends the request to the hidden API endpoint
 */
export async function generateImage(prompt: string): Promise<string> {
  try {
    const apiUrl = process.env.IMAGE_GENERATION_API_URL!;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any required API keys or authentication headers here
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Since the API returns plain text (not JSON)
    const base64Image = await response.text();

    // base64Image is already like: data:image/jpeg;base64,...
    return base64Image;
  } catch (error) {
    console.error("Error generating image:", error);
    // Return a placeholder image if the API call fails
    return "/alert.svg?height=512&width=512";
  }
}
