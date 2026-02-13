
import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";
import { ProductAnalysis, StoryboardItem } from "../types";

const API_KEY = process.env.API_KEY || "";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async analyzeProduct(imageBase64: string, description: string): Promise<ProductAnalysis> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: imageBase64.split(",")[1], mimeType: "image/png" } },
          { text: `Analyze this product. Description provided: ${description}. Extract technical details for design planning. Be specific about materials and texture.` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mainColor: { type: Type.STRING, description: "Hex color code" },
            secondaryColor: { type: Type.STRING, description: "Hex color code" },
            backgroundColor: { type: Type.STRING, description: "Suggested hex background color" },
            features: { type: Type.ARRAY, items: { type: Type.STRING } },
            material: { type: Type.STRING },
            category: { type: Type.STRING },
            styleKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["mainColor", "secondaryColor", "backgroundColor", "features", "material", "category", "styleKeywords"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  }

  async planStoryboards(analysis: ProductAnalysis, language: string): Promise<StoryboardItem[]> {
    const prompt = `Create an 8-image e-commerce detail storyboard. All content text MUST be in ${language}.
    Product Info: Category ${analysis.category}, Material ${analysis.material}, Features: ${analysis.features.join(", ")}.
    The 8 scenes must follow this flow:
    1. Aesthetic Cover (Overall beauty)
    2. Product Close-up (Technical detail/Material)
    3. Feature Highlight (Functionality)
    4. Usage Scene (Lifestyle setting)
    5. Craftsmanship/Quality (Durability/Strict QC)
    6. Size Comparison (With human hands or ruler)
    7. Set/Combo (Showing items together/Organization)
    8. Purchase Advice/Summary (CTA/Value proposition)
    
    For each scene, provide:
    - title: Brief catchy title in ${language}
    - description: Scene context in ${language}
    - visualPrompt: Detailed English prompt for an image generator (Instruction: Keep the original product's shape/color/texture identical, only change the environment/props).
    - overlayText: High-converting marketing copy to overlay on image in ${language}.`;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              visualPrompt: { type: Type.STRING },
              overlayText: { type: Type.STRING }
            },
            required: ["type", "title", "description", "visualPrompt", "overlayText"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    return data.map((item: any, index: number) => ({
      ...item,
      id: index + 1
    }));
  }

  async generateSceneImage(originalImageBase64: string, storyboard: StoryboardItem): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          { inlineData: { data: originalImageBase64.split(",")[1], mimeType: "image/png" } },
          { text: `High-end commercial studio photography.
                   Environment: ${storyboard.visualPrompt}.
                   Maintain product integrity: shape, textures, and specific color details of the central product must remain exactly as shown in the source image. 
                   Ensure lighting on the product matches the new environment naturally.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("Failed to generate image");
  }

  createChatSession(): Chat {
    return this.ai.chats.create({
      model: "gemini-3-pro-preview",
      config: {
        systemInstruction: "You are an expert E-Commerce Art Director and Marketing Consultant for the 'E-Commerce Detail Pro' app. Your job is to help users optimize their product detail pages, provide copywriting advice, suggest visual themes, and answer technical questions about product photography and AI generation. Keep responses concise and professional.",
      }
    });
  }
}
