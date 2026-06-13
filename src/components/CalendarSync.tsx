/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Shield, FileCode } from 'lucide-react';
import { SyncSettings } from '../types';

interface CalendarSyncProps {
  settings: SyncSettings;
  onChange: (settings: SyncSettings) => void;
  onBack: () => void;
}

export default function CalendarSync({ settings, onChange, onBack }: CalendarSyncProps) {
  const toggleKey = (key: keyof SyncSettings) => {
    onChange({
      ...settings,
      [key]: !settings[key]
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-[#f3f4f6]" id="calendar-sync-view">
      {/* Top Header */}
      <div className="flex items-center px-4 py-3 border-b border-[#222228] bg-[#121216]">
        <button
          onClick={onBack}
          id="btn-back-to-schedule"
          className="flex items-center text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span className="font-semibold text-lg">Back</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-[#f3f4f6]">
            Sync Options
          </h1>
          <p className="text-sm text-[#9ca3af] mt-1">
            Manage how your nutritional preparation notes are exported.
          </p>
        </div>

        {/* Section: Sync Options */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold tracking-wider text-[#6b7280] uppercase">
            OPTIONS
          </h2>
          <div className="bg-[#16161a] border border-[#222228] rounded-xl overflow-hidden divide-y divide-[#222228]">
            {/* Export Carb Load Notes */}
            <div className="p-4 flex items-start justify-between space-x-4" id="row-export-carb-notes">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-[#f97316]" />
                  <h4 className="font-semibold text-white">Export Carb Load Notes</h4>
                </div>
                <p className="text-xs text-[#9ca3af] mt-1 pr-4">
                  Include carb loading instructions in event descriptions.
                </p>
              </div>
              <div className="pt-1">
                <button
                  onClick={() => toggleKey('exportCarbLoadNotes')}
                  id="toggle-export-carb-notes"
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 outline-none ${
                    settings.exportCarbLoadNotes ? 'bg-[#22c55e]' : 'bg-[#3e3e4a]'
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                      settings.exportCarbLoadNotes ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Notification Card */}
        <div className="bg-[#121216] border border-[#222228] p-4 rounded-xl flex items-start space-x-3">
          <Shield className="w-5 h-5 text-[#3b82f6] mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-semibold text-sm text-white">Secure Connection</h5>
            <p className="text-xs text-[#9ca3af] mt-0.5 leading-relaxed">
              Workflows run strictly client-side to safeguard records and prevent unauthorized server leaks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
