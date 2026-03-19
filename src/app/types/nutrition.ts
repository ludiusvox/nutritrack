export interface NutritionEntry {
  id: string;
  name: string;
  fat: number;
  carbs: number;
  protein: number;
  calories: number;
  photo?: string;
  timestamp: number;
  date: string; // ISO date string (YYYY-MM-DD) for daily grouping
}