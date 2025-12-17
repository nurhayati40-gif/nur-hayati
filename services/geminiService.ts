
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Palette } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const paletteSchema = {
  type: Type.OBJECT,
  properties: {
    colors: {
      type: Type.ARRAY,
      description: "An array of exactly 5 hex color codes as strings (e.g., '#RRGGBB').",
      items: { type: Type.STRING }
    },
    justification: {
      type: Type.STRING,
      description: "A single, concise sentence for the aesthetic justification, explaining the mood and harmony."
    }
  },
  required: ['colors', 'justification']
};

const generateMoodboardImage = async (mood: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: `A visually stunning and aesthetic photograph representing the mood: '${mood}'.` }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("No image data found in the response.");
};

export const generatePalette = async (mood: string): Promise<Palette> => {
    try {
        const palettePromise = ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a color palette for the mood: "${mood}"`,
            config: {
                systemInstruction: "You are a professional graphic designer and color theory expert. Your task is to generate unique and appealing color palettes based solely on the user's mood or keyword input. The aesthetic justification must be a single, concise sentence. You must always output a valid JSON object matching the provided schema.",
                responseMimeType: "application/json",
                responseSchema: paletteSchema,
            },
        });

        // Generate 4 moodboard images in parallel
        const imagePromises = Array(4).fill(null).map(() => generateMoodboardImage(mood));
        
        const [paletteResponse, ...moodboardImages] = await Promise.all([palettePromise, ...imagePromises]);

        const jsonString = paletteResponse.text;
        const parsedData = JSON.parse(jsonString);

        if (!parsedData.colors || !parsedData.justification || parsedData.colors.length !== 5) {
            throw new Error("Invalid data structure received from API.");
        }

        return {
            ...parsedData,
            moodboardImages,
        } as Palette;

    } catch (error) {
        console.error("Error generating palette:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate palette: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the palette.");
    }
};