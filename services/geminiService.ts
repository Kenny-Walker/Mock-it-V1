
import { GoogleGenAI, Modality, Part } from "@google/genai";
import { Product, Mockup, Placement } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

type SelectedPlacements = Record<string, string[]>;

async function generateSingleMockup(
    logoBase64: string, 
    product: Product, 
    placement: Placement
): Promise<string> {
  const logoBase64Data = logoBase64.split(',')[1];
  if (!logoBase64Data) {
      throw new Error('Invalid base64 string for logo.');
  }

  const parts: Part[] = [];

  // 1. Add logo
  parts.push({
    inlineData: {
      mimeType: 'image/png',
      data: logoBase64Data,
    },
  });

  // 2. Add prompt for a transparent background
  const promptText = `You are an expert photorealistic mockup designer. You will be given a logo.
  Your task is to create a photorealistic product shot of a "${product.name}" with the provided logo placed on it.
  - Product: ${product.name}. Context: ${product.description}.
  - Logo Placement: "${placement.name}". Details: ${placement.description}.
  The logo must look naturally integrated onto the product's surface.
  The final output must be only the generated image of the product. The background of the image MUST be transparent. Do not add any shadows that extend outside the product itself.`;
  
  parts.push({ text: promptText });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error('No image was generated for the mockup.');

  } catch (error) {
    console.error(`Error generating mockup for ${product.name} (${placement.name}):`, error);
    throw new Error(`Failed to generate mockup for ${product.name} at ${placement.name}.`);
  }
}

export async function generateMockups(
    logoBase64: string, 
    products: Product[],
    selectedPlacements: SelectedPlacements,
    onProgress: (progress: number, total: number) => void,
): Promise<Mockup[]> {
  
  const tasks: { product: Product; placement: Placement; }[] = [];
  products.forEach(product => {
    const placements = selectedPlacements[product.id] || [];
    placements.forEach(placementId => {
        const placementDetails = product.placements.find(p => p.id === placementId);
        if (placementDetails) {
            tasks.push({ product, placement: placementDetails });
        }
    });
  });

  const successfulMockups: Mockup[] = [];
  let completedCount = 0;

  for (const task of tasks) {
    try {
      const imageUrl = await generateSingleMockup(logoBase64, task.product, task.placement);
      successfulMockups.push({
        product: task.product,
        placement: task.placement,
        imageUrl,
      });
    } catch (error) {
      console.error(error);
      // Silently fail and continue, but log the error. The UI will show fewer mockups than total.
    }
    completedCount++;
    onProgress(completedCount, tasks.length);
  }

  if (successfulMockups.length === 0 && tasks.length > 0) {
    throw new Error("All mockup generations failed. This may be due to a network issue or an error with the image generation service.");
  }

  return successfulMockups;
}
