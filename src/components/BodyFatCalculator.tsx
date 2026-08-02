/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Scale, Award, HelpCircle, RefreshCw } from 'lucide-react';
import { BodyFatInputs } from '../types';

interface BodyFatCalculatorProps {
  initialInputs: BodyFatInputs;
  onBack: () => void;
  onSaveResult?: (pct: number) => void;
}

export default function BodyFatCalculator({ initialInputs, onBack, onSaveResult }: BodyFatCalculatorProps) {
  const [inputs, setInputs] = useState<BodyFatInputs>(initialInputs);
  const [bodyFat, setBodyFat] = useState(14.8);
  const [classification, setClassification] = useState('Fitness');

  const calculateNavyBodyFat = () => {
    const { gender, waistCm, neckCm, heightCm, hipCm = 90 } = inputs;
    
    if (waistCm <= 0 || neckCm <= 0 || heightCm <= 0) return;

    let pct = 15;
    if (gender === 'male') {
      // US Navy Equation for Men (using cm):
      // %BF = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
      const diffWord = waistCm - neckCm;
      if (diffWord > 0) {
        pct = (86.010 * Math.log10(diffWord)) - (70.041 * Math.log10(heightCm)) + 36.76;
      }
    } else {
      // US Navy Equation for Women (using cm):
      // %BF = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
      const sumDiff = waistCm + hipCm - neckCm;
      if (sumDiff > 0) {
        pct = (163.205 * Math.log10(sumDiff)) - (97.684 * Math.log10(heightCm)) - 78.387;
      }
    }

    // Keep within logical range
    pct = Math.max(2, Math.min(50, pct));
    const rounded = parseFloat(pct.toFixed(1));
    setBodyFat(rounded);

    // Classify body fat
    let cl = 'Average';
    if (gender === 'male') {
      if (rounded < 6) cl = 'Essential Fat';
      else if (rounded < 14) cl = 'Athletic';
      else if (rounded < 18) cl = 'Fitness';
      else if (rounded < 25) cl = 'Average';
      else cl = 'Obese';
    } else {
      if (rounded < 14) cl = 'Essential Fat';
      else if (rounded < 21) cl = 'Athletic';
      else if (rounded < 25) cl = 'Fitness';
      else if (rounded < 32) cl = 'Average';
      else cl = 'Obese';
    }
    setClassification(cl);

    if (onSaveResult) {
      onSaveResult(rounded);
    }
  };

  useEffect(() => {
    calculateNavyBodyFat();
  }, [inputs]);

  // SVG parameters for Speedometer
  const arcLength = Math.PI; // Half circle
  const radius = 90;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  
  // Percent BF maps to range 2% to 40%
  const normalizedBF = Math.max(2, Math.min(40, bodyFat));
  const ratio = (normalizedBF - 2) / (40 - 2);
  const strokeDashoffset = circumference - (ratio * (circumference / 2));

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-[#f3f4f6]" id="body-fat-calc-view">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#222228] bg-[#121216]">
        <button
          onClick={onBack}
          id="btn-back-bodyfat"
          className="flex items-center text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span className="font-semibold text-lg">Back</span>
        </button>
        <span className="font-bold text-sm tracking-wide text-white px-3 flex-1 text-center">Body Fat Calculator</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-12">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-white leading-tight">
            NutriTrack
          </h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">
            Body Fat Calculator (US Navy Circumference Standard)
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {/* Gender segment control */}
          <div className="flex bg-[#121216] border border-[#222228] p-1.5 rounded-xl justify-center items-center">
            <button
              onClick={() => setInputs({ ...inputs, gender: 'male' })}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                inputs.gender === 'male'
                  ? 'bg-[#1c1c24] border border-[#f97316]/50 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Male Measurements
            </button>
            <button
              onClick={() => setInputs({ ...inputs, gender: 'female' })}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                inputs.gender === 'female'
                  ? 'bg-[#1c1c24] border border-[#f97316]/50 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Female Measurements
            </button>
          </div>

          <div className="bg-[#121216] border border-[#222228] p-5 rounded-xl space-y-4">
            {/* Height (cm) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider text-[#9ca3af] block">
                HEIGHT (CM)
              </label>
              <input
                type="number"
                value={inputs.heightCm || ''}
                onChange={(e) => setInputs({ ...inputs, heightCm: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#1c1c24] border border-[#3e3e4a] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#f97316]"
                placeholder="Height in cm"
                min="50"
                max="250"
              />
            </div>

            {/* Neck Circumference (cm) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider text-[#9ca3af] block">
                NECK CIRCUMFERENCE (CM)
              </label>
              <input
                type="number"
                value={inputs.neckCm || ''}
                onChange={(e) => setInputs({ ...inputs, neckCm: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#1c1c24] border border-[#3e3e4a] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#f97316]"
                placeholder="Neck size in cm"
                min="10"
                max="100"
              />
            </div>

            {/* Waist Circumference (cm) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider text-[#9ca3af] block">
                WAIST CIRCUMFERENCE (CM)
              </label>
              <input
                type="number"
                value={inputs.waistCm || ''}
                onChange={(e) => setInputs({ ...inputs, waistCm: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#1c1c24] border border-[#3e3e4a] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#f97316]"
                placeholder="Waist size at naval cross"
                min="20"
                max="200"
              />
            </div>

            {/* Conditional Hip Circumference (for females) */}
            {inputs.gender === 'female' && (
              <div className="space-y-1.5 animate-in fade-in duration-300">
                <label className="text-xs font-bold tracking-wider text-[#9ca3af] block">
                  HIP CIRCUMFERENCE (CM)
                </label>
                <input
                  type="number"
                  value={inputs.hipCm || ''}
                  onChange={(e) => setInputs({ ...inputs, hipCm: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#1c1c24] border border-[#3e3e4a] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#f97316]"
                  placeholder="Hips size at widest point"
                  min="20"
                  max="200"
                />
              </div>
            )}

            {/* Trigger Button */}
            <button
              type="button"
              onClick={calculateNavyBodyFat}
              className="w-full py-3 bg-[#f97316] hover:bg-[#ea580c] active:scale-98 transition-all text-white rounded-xl font-bold tracking-wide"
            >
              Calculate
            </button>
          </div>
        </div>

        {/* Output Speedometer Box (Exactly replicates Screen 6 design!) */}
        <div className="bg-[#16161a] border border-[#222228] p-6 rounded-2xl relative overflow-hidden text-center space-y-4">
          <div className="flex justify-center items-center py-4 relative">
            {/* Speedometer Gauges using pure React SVG */}
            <svg width="220" height="120" className="transform translate-y-2">
              {/* Background semi-circle */}
              <path
                d="M 20 110 A 90 90 0 0 1 200 110"
                fill="none"
                stroke="#2a2a35"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              {/* Active filled progress semi-circle */}
              <circle
                cx="110"
                cy="110"
                r={radius}
                fill="none"
                stroke="#f97316"
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-180 110 110)"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Float value in center */}
            <div className="absolute top-[68px] flex flex-col items-center">
              <span className="text-4xl font-extrabold text-white font-mono">{bodyFat}%</span>
              <span className="text-[10px] font-mono text-[#9ca3af] tracking-wider uppercase mt-0.5">
                {classification}
              </span>
            </div>
          </div>

          <div className="text-sm font-semibold tracking-wide text-[#9ca3af]">
            Body Fat Percentage
          </div>

          {/* Educational Note Paragraph (Replicates image paragraph style strictly!) */}
          <div className="text-left bg-[#0a0a0c] p-4 rounded-xl border border-[#222228] space-y-3 font-sans">
            <h4 className="text-xs font-bold tracking-wider text-[#6b7280] uppercase flex items-center space-x-1">
              <HelpCircle className="w-4 h-4 text-[#f97316]" />
              <span>Why the Navy Formula?</span>
            </h4>
            <p className="text-xs text-[#9ca3af] leading-relaxed">
              The Body Fat Size Formula is a verified metabolic equation for athletic and fit individuals. It is significantly more accurate for active, muscular trainers than simple BMI parameters, focusing on density differences calculated via circumference dimensions. Developed by the US Navy Medical Department, it maps fat pockets alongside total waist-line definitions to supply precise body composition predictions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
