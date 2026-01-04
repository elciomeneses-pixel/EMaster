
import { GoogleGenAI, Type } from "@google/genai";
import { Profile, MealAnalysis, DietPlan } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeMealImage = async (base64Image: string, profile: Profile): Promise<MealAnalysis> => {
  const prompt = `Analise esta foto de refeição para uma pessoa de ${profile.age} anos, sexo ${profile.gender === 'male' ? 'masculino' : 'feminino'}, com objetivo de ${profile.goal}. 
  Identifique a comida e estime os macronutrientes. Responda inteiramente em Português do Brasil.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Nome da refeição em português" },
          description: { type: Type.STRING, description: "Descrição detalhada em português" },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fat: { type: Type.NUMBER }
        },
        required: ["name", "description", "calories", "protein", "carbs", "fat"]
      }
    }
  });

  const result = JSON.parse(response.text);
  return {
    ...result,
    id: crypto.randomUUID(),
    profileId: profile.id,
    timestamp: Date.now(),
    imageUrl: base64Image
  };
};

export const generateDietPlan = async (profile: Profile): Promise<DietPlan> => {
  const prompt = `Crie um plano alimentar diário para ${profile.name}, que tem ${profile.age} anos, pesa ${profile.weight}kg, mede ${profile.height}cm de altura. 
  O objetivo é ${profile.goal} e o nível de atividade é ${profile.activityLevel}.
  Retorne um plano alimentar estruturado inteiramente em Português do Brasil.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          meals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING, description: "Horário sugerido" },
                label: { type: Type.STRING, description: "Ex: Café da manhã, Almoço, etc" },
                suggestion: { type: Type.STRING, description: "Sugestão de alimentos" },
                estimatedCalories: { type: Type.NUMBER }
              }
            }
          }
        }
      }
    }
  });

  const result = JSON.parse(response.text);
  return {
    ...result,
    profileId: profile.id,
    timestamp: Date.now()
  };
};
