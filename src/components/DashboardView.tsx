/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, Moon, Sun, Camera, Calculator, Activity, Trash2, Heart, ShieldAlert, Award, Sliders } from 'lucide-react';
import { LogEntry } from '../types';

interface DashboardViewProps {
  logs: LogEntry[];
  onDeleteLog: (id: string) => void;
  onNavigateToTab: (tabName: 'dashboard' | 'camera' | 'diary' | 'schedule' | 'calcs') => void;
  onOpenBodyFat: () => void;
  onOpenSyncSettings: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenSidebar: () => void;
}

export default function DashboardView({
  logs,
  onDeleteLog,
  onNavigateToTab,
  onOpenBodyFat,
  onOpenSyncSettings,
  darkMode,
  setDarkMode,
  onOpenSidebar
}: DashboardViewProps) {
  // Targets
  const targetCalories = 2500;
  const targetFat = 80;
  const targetCarbs = 300;
  const targetProtein = 150;

  // Real-time calculated statistics
  const totalCalories = logs.reduce((acc, item) => acc + item.calories, 0);
  const totalFat = logs.reduce((acc, item) => acc + item.fat, 0);
  const totalCarbs = logs.reduce((acc, item) => acc + item.carbs, 0);
  const totalProtein = logs.reduce((acc, item) => acc + item.protein, 0);

  // Stimulants totals
  const totalNicotine = logs.reduce((acc, item) => acc + (item.nicotineMg || 0), 0);
  const totalCaffeine = logs.reduce((acc, item) => acc + (item.caffeineMg || 0), 0);

  // SVG Concentric Ring computations
  const calculateDashOffset = (value: number, target: number, radius: number) => {
    const circum = 2 * Math.PI * radius;
    const progress = Math.min(1, value / target);
    return circum - (progress * circum);
  };

  const ringFatRadius = 45;
  const ringCarbsRadius = 35;
  const ringProteinRadius = 25;

  const circumFat = 2 * Math.PI * ringFatRadius;
  const circumCarbs = 2 * Math.PI * ringCarbsRadius;
  const circumProtein = 2 * Math.PI * ringProteinRadius;

  return (
    <div className={`flex flex-col h-full bg-[#0a0a0c] text-white overflow-hidden relative`} id="dashboard-view">
      
      {/* Top Header Row */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#222228] bg-[#121216]">
        <button
          onClick={onOpenSidebar}
          id="btn-sidebar-toggle"
          className="p-1 rounded-lg hover:bg-[#1c1c24] transition-colors bg-transparent border-none text-white cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>

        <h1 className="text-lg font-bold font-display tracking-wide text-white px-3 flex-1 text-center">
          NutriTrack Dashboard
        </h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          id="btn-mode-toggle"
          className="p-1 rounded-lg hover:bg-[#1c1c24] transition-colors bg-transparent border-none text-white cursor-pointer"
        >
          {darkMode ? (
            <Moon className="w-5 h-5 text-yellow-400" />
          ) : (
            <Sun className="w-5 h-5 text-orange-400" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 pb-24 safe-area-x">
        
        {/* Pills Selector */}
        <div className="flex bg-[#121216]/80 p-1.5 rounded-xl border border-[#222228] space-x-1 max-w-sm mx-auto w-full" id="sub-tabs-selection">
          <button
            onClick={() => onNavigateToTab('camera')}
            className="flex-1 py-2 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#1c1c24]/50 transition-all flex items-center justify-center space-x-1 border border-transparent"
          >
            <Camera className="w-3.5 h-3.5 text-sky-400" />
            <span>Camera</span>
          </button>
          <button
            onClick={() => onNavigateToTab('calcs')}
            className="flex-1 py-2 rounded-lg text-xs font-semibold text-white bg-[#1c1c24] border border-[#f97316]/30 shadow-xs flex items-center justify-center space-x-1"
          >
            <Calculator className="w-3.5 h-3.5 text-[#f97316]" />
            <span>Macro Calc</span>
          </button>
          <button
            onClick={onOpenBodyFat}
            className="flex-1 py-2 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#1c1c24]/50 transition-all flex items-center justify-center space-x-1 border border-transparent"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Body Fat</span>
          </button>
        </div>

        {/* Daily Summary concentric rings card */}
        <div className="bg-[#16161a] border border-[#222228] p-5 rounded-2xl flex flex-col items-center" id="daily-summary-card">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest text-center mb-4">
            Daily Summary
          </h3>

          {/* SVG Concentric Donat Rings */}
          <div className="relative w-44 h-44 flex items-center justify-center" id="concentric-ring-diagram">
            <svg width="170" height="170" className="transform -rotate-90">
              {/* Protein Ring Background (Inner) */}
              <circle
                cx="85"
                cy="85"
                r={ringProteinRadius}
                fill="none"
                stroke="#14532d"
                strokeWidth="6"
              />
              {/* Protein Ring Progress */}
              <circle
                cx="85"
                cy="85"
                r={ringProteinRadius}
                fill="none"
                stroke="#22c55e"
                strokeWidth="6"
                strokeDasharray={circumProtein}
                strokeDashoffset={calculateDashOffset(totalProtein, targetProtein, ringProteinRadius)}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />

              {/* Carbs Ring Background (Middle) */}
              <circle
                cx="85"
                cy="85"
                r={ringCarbsRadius}
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="6"
              />
              {/* Carbs Ring Progress */}
              <circle
                cx="85"
                cy="85"
                r={ringCarbsRadius}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="6"
                strokeDasharray={circumCarbs}
                strokeDashoffset={calculateDashOffset(totalCarbs, targetCarbs, ringCarbsRadius)}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />

              {/* Fat Ring Background (Outer) */}
              <circle
                cx="85"
                cy="85"
                r={ringFatRadius}
                fill="none"
                stroke="#7f1d1d"
                strokeWidth="6"
              />
              {/* Fat Ring Progress */}
              <circle
                cx="85"
                cy="85"
                r={ringFatRadius}
                fill="none"
                stroke="#ef4444"
                strokeWidth="6"
                strokeDasharray={circumFat}
                strokeDashoffset={calculateDashOffset(totalFat, targetFat, ringFatRadius)}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Inner Ring Text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-[#9ca3af] tracking-wider uppercase font-medium">Total Calories</span>
              <span className="text-3xl font-black text-white font-mono mt-0.5">{totalCalories}</span>
              <span className="text-[9px] text-[#9ca3af] font-mono mt-0.5">/ {targetCalories} kcal</span>
            </div>
          </div>

          {/* Underlay Legend dots in concentric rings */}
          <div className="grid grid-cols-3 gap-6 w-full mt-5 border-t border-[#222228]/60 pt-4" id="concentric-legend">
            <div className="text-center space-y-0.5">
              <div className="flex items-center justify-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <span className="text-xs font-semibold text-gray-400">Fat</span>
              </div>
              <span className="text-sm font-bold text-white font-mono block">{totalFat}g</span>
            </div>

            <div className="text-center space-y-0.5">
              <div className="flex items-center justify-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                <span className="text-xs font-semibold text-gray-400">Carbs</span>
              </div>
              <span className="text-sm font-bold text-white font-mono block">{totalCarbs}g</span>
            </div>

            <div className="text-center space-y-0.5">
              <div className="flex items-center justify-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                <span className="text-xs font-semibold text-gray-400">Protein</span>
              </div>
              <span className="text-sm font-bold text-white font-mono block">{totalProtein}g</span>
            </div>
          </div>
        </div>

        {/* Stimulants */}
        <div className="bg-[#16161a] border border-[#222228] p-4 rounded-xl flex flex-col space-y-3" id="stimulants-card">
          <h3 className="text-xs font-bold tracking-wider text-[#6b7280] uppercase">
            STIMULANTS
          </h3>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between" id="row-stimulant-nicotine">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />
                <span className="text-sm font-medium text-white">Nicotine</span>
              </div>
              <span className="text-sm font-bold text-white font-mono">{totalNicotine}mg</span>
            </div>

            <div className="flex items-center justify-between" id="row-stimulant-caffeine">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                <span className="text-sm font-medium text-white">Caffeine</span>
              </div>
              <span className="text-sm font-bold text-white font-mono">{totalCaffeine}mg</span>
            </div>
          </div>
        </div>

        {/* Recent Logs Section */}
        <div className="space-y-3" id="recent-logs-section">
          <h2 className="text-xs font-bold tracking-wider text-[#6b7280] uppercase">
            RECENT LOGS
          </h2>
          
          <div className="space-y-2.5">
            {logs.length === 0 ? (
              <div className="py-8 text-center text-[#4b5563] text-xs">
                No logging entries. Use the camera tool to scan your food.
              </div>
            ) : (
              logs.map((log) => {
                const hasNicotine = log.nicotineMg && log.nicotineMg > 0;
                const hasCaffeine = log.caffeineMg && log.caffeineMg > 0;

                return (
                  <div
                    key={log.id}
                    id={`log-item-${log.id}`}
                    className="flex justify-between items-center p-3 bg-[#121216] border border-[#222228] rounded-xl hover:bg-[#16161a] transition-colors gap-3"
                  >
                    {log.imagePath && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-[#222228]">
                        <img src={Capacitor.convertFileSrc(log.imagePath)} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-white truncate">{log.name}</h4>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                        {log.calories} kcal | F: {log.fat}g | C: {log.carbs}g | P: {log.protein}g
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {hasNicotine && (
                        <span className="px-2 py-0.5 bg-[#a855f7]/20 border border-[#a855f7]/30 text-[#a855f7] rounded-full text-[10px] font-bold font-mono">
                          N: {log.nicotineMg}mg
                        </span>
                      )}
                      
                      {hasCaffeine && (
                        <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-full text-[10px] font-bold font-mono">
                          Caf: {log.caffeineMg}mg
                        </span>
                      )}

                      <button
                        onClick={() => onDeleteLog(log.id)}
                        id={`btn-del-dashboard-${log.id}`}
                        className="p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
