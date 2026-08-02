/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Info, Heart, Scale, TrendingUp, RefreshCw, X } from 'lucide-react';
import { MifflinInputs } from '../types';

interface MifflinCalculatorProps {
  initialInputs: MifflinInputs;
  onClose?: () => void;
  onSaveResults?: (bmr: number, tdee: number) => void;
}

export default function MifflinCalculator({ initialInputs, onClose, onSaveResults }: MifflinCalculatorProps) {
  const [inputs, setInputs] = useState<MifflinInputs>(initialInputs);
  const [bmr, setBmr] = useState(1785);
  const [tdee, setTdee] = useState(2678);

  // Derived Macro Targets
  const [macros, setMacros] = useState({ carbs: 0, protein: 0, fat: 0 });

  const activityRanges = [
    { label: 'Sedentary (little or no exercise)', multiplier: 1.2 },
    { label: 'Lightly Active (exercise 1-3 days/week)', multiplier: 1.375 },
    { label: 'Moderately Active (3-5 days/week)', multiplier: 1.55 },
    { label: 'Very Active (hard exercise 6-7 days/week)', multiplier: 1.725 },
    { label: 'Extra Active (very intensive physical job or 2x training)', multiplier: 1.9 }
  ];

  const getActivityIndex = () => {
    switch (inputs.activityLevel) {
      case 'Sedentary': return 0;
      case 'Lightly Active': return 1;
      case 'Moderately Active': return 2;
      case 'Very Active': return 3;
      case 'Extra Active': return 4;
      default: return 2;
    }
  };

  const handleActivitySliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value);
    const levels: MifflinInputs['activityLevel'][] = [
      'Sedentary',
      'Lightly Active',
      'Moderately Active',
      'Very Active',
      'Extra Active'
    ];
    setInputs({
      ...inputs,
      activityLevel: levels[idx]
    });
  };

  // Run calculation whenever inputs alter
  useEffect(() => {
    // Graceful handling of empty/invalid inputs
    const age = Number(inputs.age) || 0;
    const weightValue = Number(inputs.weightValue) || 0;
    const heightCm = Number(inputs.heightCm) || 0;
    const heightFt = Number(inputs.heightFt) || 0;
    const heightIn = Number(inputs.heightIn) || 0;

    if (age === 0 || weightValue === 0) return;

    let weightInKg = weightValue;
    if (inputs.weightUnit === 'lbs') {
      weightInKg = weightValue * 0.453592;
    }

    let calculatedHeightInCm = heightCm;
    if (inputs.heightUnit === 'ft-in') {
      calculatedHeightInCm = (heightFt * 30.48) + (heightIn * 2.54);
    }

    if (calculatedHeightInCm === 0) return;

    // Mifflin-St Jeor Equation
    let computedBmr = 0;
    if (inputs.gender === 'male') {
      computedBmr = (10 * weightInKg) + (6.25 * calculatedHeightInCm) - (5 * age) + 5;
    } else {
      computedBmr = (10 * weightInKg) + (6.25 * calculatedHeightInCm) - (5 * age) - 161;
    }

    computedBmr = Math.round(computedBmr);

    const activeIndex = getActivityIndex();
    const multiplier = activityRanges[activeIndex].multiplier;
    const computedTdee = Math.round(computedBmr * multiplier);

    setBmr(computedBmr);
    setTdee(computedTdee);

    // Calculate Macros based on TDEE (Standard Athletic Split)
    // 48% Carbs, 24% Protein, 28% Fat (matches DiaryView targets)
    const standardProtein = Math.round((computedTdee * 0.24) / 4);

    let proteinGrams = standardProtein;
    if (inputs.leanBodyMass && inputs.leanBodyMass > 0) {
      // If LBM is provided, calculate protein as 1g per lb of lean mass
      if (inputs.lbmUnit === 'kg') {
        proteinGrams = Math.round(inputs.leanBodyMass * 2.2);
      } else {
        proteinGrams = Math.round(inputs.leanBodyMass);
      }
    }

    setMacros({
      carbs: Math.round((computedTdee * 0.48) / 4),
      protein: proteinGrams,
      fat: Math.round((computedTdee * 0.28) / 9)
    });

    if (onSaveResults) {
      onSaveResults(computedBmr, computedTdee);
    }
  }, [inputs]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-[#f3f4f6]" id="mifflin-view">
      {/* Top bar with close X */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#222228] bg-[#121216]">
        <span className="font-semibold text-gray-400 text-xs tracking-wider px-3 flex-1 text-center uppercase">Calculate Metabolics</span>
        {onClose && (
          <button
            onClick={onClose}
            id="btn-close-mifflin"
            className="p-1 rounded-lg bg-[#1c1c24] text-gray-400 hover:text-white hover:bg-[#262630] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-12">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-white leading-tight">
            Mifflin-St Jeor Calculator
          </h1>
          <p className="text-sm text-[#9ca3af] mt-1 pr-6 leading-relaxed">
            Determine your precise metabolic baselines for accurate calorie and macronutrient load planning.
          </p>
        </div>

        {/* Section: Your Details */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold tracking-wider text-[#6b7280] uppercase">
            YOUR DETAILS
          </h2>

          <div className="bg-[#121216] border border-[#222228] p-5 rounded-xl space-y-5">
            {/* Age Input */}
            <div className="flex items-center justify-between" id="row-input-age">
              <label className="text-sm font-semibold text-white">Age</label>
              <input
                type="number"
                value={inputs.age || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setInputs({ ...inputs, age: val === '' ? 0 : parseInt(val) });
                }}
                className="w-24 bg-[#1c1c24] border border-[#3e3e4a] rounded-lg p-1.5 px-3 text-right text-white text-sm focus:outline-none focus:border-[#f97316]"
                placeholder="0"
              />
            </div>

            {/* Gender Switch */}
            <div className="flex items-center justify-between" id="row-input-gender">
              <label className="text-sm font-semibold text-white">Gender</label>
              <div className="flex bg-[#1c1c24] p-1 rounded-lg border border-[#222228]">
                <button
                  type="button"
                  onClick={() => setInputs({ ...inputs, gender: 'male' })}
                  id="btn-gender-male"
                  className={`px-4 py-1 text-xs font-semibold rounded-md transition-all ${
                    inputs.gender === 'male'
                      ? 'bg-[#3b82f6]/30 text-white border border-[#3b82f6]/50 shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setInputs({ ...inputs, gender: 'female' })}
                  id="btn-gender-female"
                  className={`px-4 py-1 text-xs font-semibold rounded-md transition-all ${
                    inputs.gender === 'female'
                      ? 'bg-[#3b82f6]/30 text-white border border-[#3b82f6]/50 shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Height Switch and Input */}
            <div className="flex flex-col space-y-2" id="row-input-height">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-white">Height</label>
                <div className="flex bg-[#1c1c24] p-1 rounded-lg border border-[#222228]">
                  <button
                    type="button"
                    onClick={() => setInputs({ ...inputs, heightUnit: 'ft-in' })}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      inputs.heightUnit === 'ft-in'
                        ? 'bg-[#3b82f6]/30 text-white border border-[#3b82f6]/50'
                        : 'text-gray-400'
                    }`}
                  >
                    ft/in
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputs({ ...inputs, heightUnit: 'cm' })}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      inputs.heightUnit === 'cm'
                        ? 'bg-[#3b82f6]/30 text-white border border-[#3b82f6]/50'
                        : 'text-gray-400'
                    }`}
                  >
                    cm
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                {inputs.heightUnit === 'ft-in' ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={inputs.heightFt || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setInputs({ ...inputs, heightFt: val === '' ? 0 : parseInt(val) });
                      }}
                      placeholder="ft"
                      className="w-16 bg-[#1c1c24] border border-[#3e3e4a] rounded-lg p-1.5 text-center text-white text-sm focus:outline-none focus:border-[#f97316]"
                    />
                    <span className="text-xs text-[#9ca3af]">ft</span>

                    <input
                      type="number"
                      value={inputs.heightIn || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setInputs({ ...inputs, heightIn: val === '' ? 0 : parseInt(val) });
                      }}
                      placeholder="in"
                      className="w-16 bg-[#1c1c24] border border-[#3e3e4a] rounded-lg p-1.5 text-center text-white text-sm focus:outline-none focus:border-[#f97316]"
                    />
                    <span className="text-xs text-[#9ca3af]">in</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={inputs.heightCm || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setInputs({ ...inputs, heightCm: val === '' ? 0 : parseInt(val) });
                      }}
                      placeholder="cm"
                      className="w-24 bg-[#1c1c24] border border-[#3e3e4a] rounded-lg p-1.5 text-center text-white text-sm focus:outline-none focus:border-[#f97316]"
                    />
                    <span className="text-xs text-[#9ca3af]">cm</span>
                  </div>
                )}
              </div>
            </div>

            {/* Weight Switch and Input */}
            <div className="flex flex-col space-y-2" id="row-input-weight">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-white">Weight</label>
                <div className="flex bg-[#1c1c24] p-1 rounded-lg border border-[#222228]">
                  <button
                    type="button"
                    onClick={() => setInputs({ ...inputs, weightUnit: 'lbs' })}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      inputs.weightUnit === 'lbs'
                        ? 'bg-[#3b82f6]/30 text-white border border-[#3b82f6]/50'
                        : 'text-gray-400'
                    }`}
                  >
                    lbs
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputs({ ...inputs, weightUnit: 'kg' })}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      inputs.weightUnit === 'kg'
                        ? 'bg-[#3b82f6]/30 text-white border border-[#3b82f6]/50'
                        : 'text-gray-400'
                    }`}
                  >
                    kg
                  </button>
                </div>
              </div>

              <div className="flex justify-end items-center space-x-2">
                <input
                  type="number"
                  value={inputs.weightValue || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setInputs({ ...inputs, weightValue: val === '' ? 0 : parseFloat(val) });
                  }}
                  placeholder="0"
                  className="w-24 bg-[#1c1c24] border border-[#3e3e4a] rounded-lg p-1.5 text-center text-white text-sm focus:outline-none focus:border-[#f97316]"
                />
                <span className="text-xs text-[#9ca3af]">{inputs.weightUnit}</span>
              </div>
            </div>

            {/* Lean Body Mass Input (Optional) */}
            <div className="flex flex-col space-y-2" id="row-input-lbm">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-white">Lean Body Mass</label>
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Optional: For accurate protein</span>
                </div>
                <div className="flex bg-[#1c1c24] p-1 rounded-lg border border-[#222228]">
                  <button
                    type="button"
                    onClick={() => setInputs({ ...inputs, lbmUnit: 'lbs' })}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      inputs.lbmUnit === 'lbs'
                        ? 'bg-[#10b981]/30 text-white border border-[#10b981]/50'
                        : 'text-gray-400'
                    }`}
                  >
                    lbs
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputs({ ...inputs, lbmUnit: 'kg' })}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      inputs.lbmUnit === 'kg'
                        ? 'bg-[#10b981]/30 text-white border border-[#10b981]/50'
                        : 'text-gray-400'
                    }`}
                  >
                    kg
                  </button>
                </div>
              </div>

              <div className="flex justify-end items-center space-x-2">
                <input
                  type="number"
                  value={inputs.leanBodyMass || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setInputs({ ...inputs, leanBodyMass: val === '' ? 0 : parseFloat(val) });
                  }}
                  placeholder="0"
                  className="w-24 bg-[#1c1c24] border border-[#3e3e4a] rounded-lg p-1.5 text-center text-white text-sm focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-[#9ca3af]">{inputs.lbmUnit}</span>
              </div>
            </div>

            {/* Activity Level Slider */}
            <div className="space-y-2" id="row-input-activity">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold tracking-wider text-[#9ca3af] uppercase">
                  ACTIVITY LEVEL
                </label>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                value={getActivityIndex()}
                onChange={handleActivitySliderChange}
                className="w-full accent-[#f97316] bg-[#1c1c24] h-2 rounded-lg cursor-pointer"
              />
              <div className="text-xs text-[#f97316] font-medium text-center">
                {activityRanges[getActivityIndex()].label}
              </div>
            </div>
          </div>
        </div>

        {/* Your Results Card (Exactly matches design from third screenshot!) */}
        <div className="bg-[#16161a] border border-[#3e3e4a] p-6 rounded-2xl glow-orange text-center relative overflow-hidden" id="results-card">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#f97316]" />
          <h3 className="text-sm tracking-wider uppercase font-semibold text-[#9ca3af] mb-4">
            Your Results
          </h3>

          <div className="space-y-5">
            <div className="border-b border-[#222228] pb-4">
              <span className="text-3xl font-extrabold text-white font-mono block">
                BMR: {bmr.toLocaleString()} kcal
              </span>
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase block mt-0.5">
                BMR manual formula / basal needs
              </span>
            </div>

            <div className="pb-2">
              <span className="text-4xl font-black text-[#f97316] font-mono block">
                TDEE: {tdee.toLocaleString()} kcal
              </span>
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase block mt-0.5">
                TDEE daily energy expenditure estimate
              </span>
            </div>

            {/* Macro Recommendations */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#222228]">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Carbs</span>
                <span className="text-xl font-bold text-white font-mono">{macros.carbs}g</span>
                <span className="text-[9px] text-gray-500 block uppercase">48% split</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Protein</span>
                <span className="text-xl font-bold text-white font-mono">{macros.protein}g</span>
                <span className="text-[9px] text-gray-500 block uppercase">
                  {inputs.leanBodyMass && inputs.leanBodyMass > 0 ? 'LBM Derived' : '24% split'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">Fat</span>
                <span className="text-xl font-bold text-white font-mono">{macros.fat}g</span>
                <span className="text-[9px] text-gray-500 block uppercase">28% split</span>
              </div>
            </div>

            <p className="text-xs text-[#9ca3af] pt-2 border-t border-[#222228] italic">
              Based on your specific measurements. Use as target thresholds in your food journal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
