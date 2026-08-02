/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, Camera, Calculator, Award, Sliders } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: any) => void;
  onOpenSync: () => void;
  onOpenBodyFat: () => void;
  activeTab: string;
}

export default function Sidebar({ isOpen, onClose, onNavigate, onOpenSync, onOpenBodyFat, activeTab }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex" id="sidebar-container">
      {/* Backdrop click closer */}
      <div
        onClick={onClose}
        className="flex-1 bg-black/60 backdrop-blur-xs transition-opacity"
        id="sidebar-backdrop"
      />
      {/* Main draw content */}
      <div className="w-64 bg-[#121216] h-full p-5 border-r border-[#222228] flex flex-col justify-between animate-in slide-in-from-left duration-300">
        <div className="space-y-6">
          <div>
            <span className="text-xl font-extrabold font-display text-[#f97316]">NutriTrack Suite</span>
            <span className="text-[9px] text-[#9ca3af] block uppercase tracking-widest mt-1">Diagnostic Core Tools</span>
          </div>

          <div className="space-y-1.5 pt-4">
            <button
              type="button"
              onClick={() => { onNavigate('dashboard'); onClose(); }}
              className={`w-full flex items-center space-x-3 text-sm p-3 rounded-xl transition-all ${
                activeTab === 'dashboard' ? 'bg-[#1c1c24] text-white border border-[#222228]' : 'text-gray-300 hover:text-white hover:bg-[#1c1c24]'
              }`}
            >
              <Activity className="w-4 h-4 text-[#f97316]" />
              <span className="font-semibold">Dashboard Hub</span>
            </button>
            <button
              type="button"
              onClick={() => { onNavigate('camera'); onClose(); }}
              className="w-full flex items-center space-x-3 text-sm p-3 rounded-xl hover:bg-[#1c1c24] text-gray-300 hover:text-white transition-all text-left"
            >
              <Camera className="w-4 h-4 text-sky-400" />
              <span>Snap Meal Analyzer</span>
            </button>
            <button
              type="button"
              onClick={() => { onNavigate('calcs'); onClose(); }}
              className="w-full flex items-center space-x-3 text-sm p-3 rounded-xl hover:bg-[#1c1c24] text-gray-300 hover:text-white transition-all text-left"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Mifflin-St Jeor</span>
            </button>
            <button
              type="button"
              onClick={() => { onOpenBodyFat(); onClose(); }}
              className="w-full flex items-center space-x-3 text-sm p-3 rounded-xl hover:bg-[#1c1c24] text-gray-300 hover:text-white transition-all text-left"
            >
              <Award className="w-4 h-4 text-orange-400" />
              <span>US Navy Body Fat</span>
            </button>
            <button
              type="button"
              onClick={() => { onOpenSync(); onClose(); }}
              className="w-full flex items-center space-x-3 text-sm p-3 rounded-xl hover:bg-[#1c1c24] text-gray-300 hover:text-white transition-all text-left"
            >
              <Sliders className="w-4 h-4 text-blue-400" />
              <span>Sync & Export Settings</span>
            </button>
          </div>
        </div>

        <div className="border-t border-[#222228] pt-4 text-[10px] text-gray-500 font-mono">
          NutriTrack Diagnostic Suite v3.2<br />
          Secure local database container.
        </div>
      </div>
    </div>
  );
}
