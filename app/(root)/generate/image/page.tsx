"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Sparkles, Shuffle, ImageIcon } from "lucide-react";
import { enhancePrompt, getCameraAngleModifier, getLightingModifier, getRandomPrompt, getStyleModifier } from "@/lib/prompt-utils";
import { generateImage } from "@/lib/actions";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("");
  const [cameraAngle, setCameraAngle] = useState("");
  const [lighting, setLighting] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleEnhancePrompt = () => {
    if (!prompt) return;
    const enhanced = enhancePrompt(prompt);
    setPrompt(enhanced);
  };

  const handleRandomPrompt = () => {
    const randomPrompt = getRandomPrompt();
    setPrompt(randomPrompt);
  };

  const handleGenerateImage = async () => {
    if (!prompt) return;

    setIsGenerating(true);

    try {
      // Build the final prompt with style, camera angle, and lighting
      let finalPrompt = prompt;

      if (style) {
        finalPrompt += getStyleModifier(style);
      }

      if (cameraAngle) {
        finalPrompt += getCameraAngleModifier(cameraAngle);
      }

      if (lighting) {
        finalPrompt += getLightingModifier(lighting);
      }

      const imageData = await generateImage(finalPrompt);
      setImage(imageData);
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = () => {
    if (!image) return;

    const link = document.createElement("a");
    link.href = image;
    link.download = `generated-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        AI Image Generator
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="prompt" className="text-base font-medium">
                    Prompt
                  </Label>
                  <div className="flex mt-1.5">
                    <Input
                      id="prompt"
                      placeholder="Describe the image you want to generate..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEnhancePrompt}
                      disabled={!prompt}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Enhance
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRandomPrompt}
                    >
                      <Shuffle className="h-4 w-4 mr-2" />
                      Random
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="style" className="text-base font-medium">
                      Style
                    </Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger id="style" className="mt-1.5">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="anime">Anime</SelectItem>
                        <SelectItem value="realistic">Realistic</SelectItem>
                        <SelectItem value="3d">3D Render</SelectItem>
                        <SelectItem value="watercolor">Watercolor</SelectItem>
                        <SelectItem value="oil-painting">
                          Oil Painting
                        </SelectItem>
                        <SelectItem value="pixel-art">Pixel Art</SelectItem>
                        <SelectItem value="sketch">Sketch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="camera" className="text-base font-medium">
                      Camera Angle
                    </Label>
                    <Select value={cameraAngle} onValueChange={setCameraAngle}>
                      <SelectTrigger id="camera" className="mt-1.5">
                        <SelectValue placeholder="Select camera angle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="close-up">Close-up</SelectItem>
                        <SelectItem value="wide-angle">Wide Angle</SelectItem>
                        <SelectItem value="aerial">Aerial View</SelectItem>
                        <SelectItem value="low-angle">Low Angle</SelectItem>
                        <SelectItem value="high-angle">High Angle</SelectItem>
                        <SelectItem value="dutch-angle">Dutch Angle</SelectItem>
                        <SelectItem value="fisheye">Fisheye</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="lighting" className="text-base font-medium">
                      Lighting
                    </Label>
                    <Select value={lighting} onValueChange={setLighting}>
                      <SelectTrigger id="lighting" className="mt-1.5">
                        <SelectValue placeholder="Select lighting" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="natural">Natural</SelectItem>
                        <SelectItem value="soft">Soft</SelectItem>
                        <SelectItem value="dramatic">Dramatic</SelectItem>
                        <SelectItem value="backlit">Backlit</SelectItem>
                        <SelectItem value="golden-hour">Golden Hour</SelectItem>
                        <SelectItem value="blue-hour">Blue Hour</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="neon">Neon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full mt-6"
                  onClick={handleGenerateImage}
                  disabled={!prompt || isGenerating}
                >
                  {isGenerating ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
              {image ? (
                <div className="relative w-full h-full flex flex-col items-center">
                  <img
                    ref={imageRef}
                    src={image || "/placeholder.svg"}
                    alt="Generated image"
                    className="max-w-full max-h-[500px] object-contain rounded-md shadow-md"
                  />
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={handleDownloadImage}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Image
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-300 rounded-lg w-full h-[500px]">
                  <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No image generated yet
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Enter a prompt and click "Generate Image" to create your
                    image
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


