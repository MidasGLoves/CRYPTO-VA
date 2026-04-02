import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generate() {
  try {
    console.log("Generating image...");
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'A luxurious digital product mockup advertisement for a premium PDF bundle. Sleek tablets and smartphones displaying crypto trading charts, candlestick patterns, and virtual assistant guides. Dark background with elegant gold accents, photorealistic, cinematic lighting, highly detailed.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    let saved = false;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        fs.writeFileSync('./public/thumbnail.png', Buffer.from(base64Data, 'base64'));
        console.log('Image saved to public/thumbnail.png');
        saved = true;
        break;
      }
    }
    if (!saved) {
      console.error("No image data found in response.");
    }
  } catch (e) {
    console.error("Error generating image:", e);
    process.exit(1);
  }
}

generate();
