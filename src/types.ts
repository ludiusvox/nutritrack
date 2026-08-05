/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LogEntry {
  id: string;
  name: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  caffeineMg?: number;
  nicotineMg?: number;
  timestamp: string;
  imagePath?: string;
}

export interface Activity {
  id: string;
  time: string;
  date: string; // ISO format date string
  name: string;
  durationMin: number;
  distance?: string;
  type: 'weightlifting' | 'biking' | 'running' | 'other';
  presetPreLoad: string;
  presetPostLoad: string;
}

export interface FastingConfig {
  mode: 'none' | '5/2' | '16/8';
  startHour: number; // For 16/8 (e.g., 12 for 12 PM)
  endHour: number;   // For 16/8 (e.g., 20 for 8 PM)
  dailyCalorieGoal: number;
  timezone?: string; // Declarative timezone (e.g., "America/New_York")
}

export interface WeeklyCalorieStats {
  weekStarting: string; // ISO date string for Monday or Sunday of that week
  dailyCalories: number[]; // 7 values for the week
}

export interface SyncSettings {
  googleCalendar: boolean;
  icloudCalendar: boolean;
  outlookCalendar: boolean;
  syncReminders: boolean; // notified 30 mins before
  exportCarbLoadNotes: boolean; // include carb loading instructions in event descriptions
}

export interface MifflinInputs {
  age: number;
  gender: 'male' | 'female';
  heightUnit: 'ft-in' | 'cm';
  heightCm: number;
  heightFt: number;
  heightIn: number;
  weightUnit: 'lbs' | 'kg';
  weightValue: number;
  activityLevel: 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active' | 'Extra Active';
  leanBodyMass?: number;
  lbmUnit?: 'lbs' | 'kg';
}

export interface BodyFatInputs {
  heightCm: number;
  neckCm: number;
  waistCm: number;
  hipCm?: number; // Needed for female calculations in US Navy Formula
  gender: 'male' | 'female';
}

export interface AnalysisResponse {
  foodName: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  caffeineMg: number;
  nicotineMg: number;
  ingredients: string[];
  advice: string;
  confidence: number; // 0 to 1
}
