/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LogEntry, Activity, SyncSettings, MifflinInputs, BodyFatInputs } from './types';

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'l1',
    name: 'Oatmeal & Berries',
    calories: 450,
    carbs: 80,
    protein: 15,
    fat: 8,
    mealType: 'Breakfast',
    caffeineMg: 100,
    timestamp: '2026-06-12T08:00:00'
  },
  {
    id: 'l2',
    name: 'Snus (Mint)',
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    mealType: 'Snacks',
    nicotineMg: 4,
    timestamp: '2026-06-12T10:15:00'
  },
  {
    id: 'l3',
    name: 'Grilled Chicken Salad',
    calories: 650,
    carbs: 30,
    protein: 45,
    fat: 25,
    mealType: 'Lunch',
    timestamp: '2026-06-12T13:00:00'
  },
  {
    id: 'l4',
    name: 'Salmon & Asparagus',
    calories: 750,
    carbs: 40,
    protein: 50,
    fat: 35,
    mealType: 'Dinner',
    timestamp: '2026-06-12T19:30:00'
  },
  {
    id: 'l5',
    name: 'Almonds & Apple',
    calories: 300,
    carbs: 25,
    protein: 10,
    fat: 18,
    mealType: 'Snacks',
    nicotineMg: 2,
    timestamp: '2026-06-12T16:45:00'
  },
  {
    id: 'l6',
    name: "Reese's Peanut Butter Cup",
    calories: 412,
    carbs: 20,
    protein: 20,
    fat: 28,
    mealType: 'Snacks',
    caffeineMg: 20,
    timestamp: '2026-06-12T11:00:00'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    time: '6:00 AM',
    name: 'Weightlifting',
    durationMin: 60,
    type: 'weightlifting',
    presetPreLoad: '+30g Carb',
    presetPostLoad: '+45g Carb, 25g Protein'
  },
  {
    id: 'a2',
    time: '5:00 PM',
    name: 'Biking',
    durationMin: 120, // 2h total with running or miles
    distance: '15 miles',
    type: 'biking',
    presetPreLoad: '+50g Carb',
    presetPostLoad: '+40g Carb, Electrolytes'
  }
];

export const INITIAL_SYNC_SETTINGS: SyncSettings = {
  googleCalendar: true,
  icloudCalendar: true,
  outlookCalendar: false,
  syncReminders: true,
  exportCarbLoadNotes: false
};

export const INITIAL_MIFFLIN_INPUTS: MifflinInputs = {
  age: 26,
  gender: 'male',
  heightUnit: 'ft-in',
  heightCm: 178,
  heightFt: 5,
  heightIn: 10,
  weightUnit: 'lbs',
  weightValue: 165,
  activityLevel: 'Moderately Active'
};

export const INITIAL_BODY_FAT_INPUTS: BodyFatInputs = {
  heightCm: 178,
  neckCm: 38,
  waistCm: 82,
  hipCm: 90,
  gender: 'male'
};

export interface SampleFoodImage {
  name: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  caffeineMg?: number;
  nicotineMg?: number;
  imageUrl: string;
  description: string;
}

export const SAMPLE_FOOD_IMAGES: SampleFoodImage[] = [
  {
    name: 'Avocado Salad Bowl with Grilled Chicken',
    category: 'Lunch',
    calories: 520,
    carbs: 18,
    protein: 38,
    fat: 32,
    description: 'Perfect whole-food meal containing lots of protein and healthy monounsaturated ketogenic fats.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Oatmeal Porridge with Blueberries',
    category: 'Breakfast',
    calories: 380,
    carbs: 58,
    protein: 12,
    fat: 10,
    description: 'Warm morning oats topped with antioxidant-rich blueberries and sliced protein almonds.',
    imageUrl: 'https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Glazed Salmon Fillet with Asparagus',
    category: 'Dinner',
    calories: 680,
    carbs: 12,
    protein: 48,
    fat: 42,
    description: 'Fresh baked salmon providing premium omega-3 fatty acids alongside dietary minerals from roasted asparagus.',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Reese\'s Cup Snack',
    category: 'Snacks',
    calories: 210,
    carbs: 24,
    protein: 4,
    fat: 12,
    caffeineMg: 5,
    description: 'Indulgent classic chocolate cup filled with salted creamy peanut butter.',
    imageUrl: 'https://images.unsplash.com/photo-1629115916386-794df5cd8a30?w=600&auto=format&fit=crop&q=80'
  }
];
