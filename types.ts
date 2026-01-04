
export enum Goal {
  WeightLoss = 'Emagrecimento',
  Maintenance = 'Manutenção',
  MuscleGain = 'Ganho de Massa'
}

export enum ActivityLevel {
  Sedentary = 'Sedentário',
  Light = 'Levemente Ativo',
  Moderate = 'Moderadamente Ativo',
  High = 'Muito Ativo'
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: 'male' | 'female' | 'other';
  goal: Goal;
  activityLevel: ActivityLevel;
  createdAt: number;
}

export interface MealAnalysis {
  id: string;
  profileId: string;
  timestamp: number;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
}

export interface DietPlan {
  profileId: string;
  title: string;
  summary: string;
  meals: {
    time: string;
    label: string;
    suggestion: string;
    estimatedCalories: number;
  }[];
  timestamp: number;
}

export type Page = 'home' | 'profiles' | 'history' | 'diet-plan';
