/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Download, FileText, Share2, Clipboard, Trash2, Calendar, Sparkles, FileSpreadsheet, Menu } from 'lucide-react';
import { LogEntry } from '../types';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

interface DiaryViewProps {
  logs: LogEntry[];
  onDeleteLog: (id: string) => void;
  targetCalories: number;
  onOpenSidebar: () => void;
}

export default function DiaryView({ logs, onDeleteLog, targetCalories = 2500, onOpenSidebar }: DiaryViewProps) {
  const [exported, setExported] = useState(false);
  const [exportModal, setExportModal] = useState(false);

  // Targets
  const targetCarbs = 300;
  const targetProtein = 150;
  const targetFat = 80;

  // Actual logs totals
  const totalCalories = logs.reduce((acc, item) => acc + item.calories, 0);
  const totalCarbs = logs.reduce((acc, item) => acc + item.carbs, 0);
  const totalProtein = logs.reduce((acc, item) => acc + item.protein, 0);
  const totalFat = logs.reduce((acc, item) => acc + item.fat, 0);

  // Percentages
  const calPercent = Math.min(100, Math.round((totalCalories / targetCalories) * 100));
  const carbsPercent = Math.min(100, Math.round((totalCarbs / targetCarbs) * 100));
  const proteinPercent = Math.min(100, Math.round((totalProtein / targetProtein) * 100));
  const fatPercent = Math.min(100, Math.round((totalFat / targetFat) * 100));

  // Export string (Markdown)
  const generateMarkdownReport = (): string => {
    let report = `# NUTRITRACK ATHLETIC METRICS REPORT\n`;
    report += `Date of Report: ${new Date().toLocaleDateString()}\n`;
    report += `-----------------------------------------------\n\n`;
    report += `## CALORIC & MACRONUTRIENT BALANCE\n`;
    report += `- Total Intake: ${totalCalories} / ${targetCalories} kcal (${calPercent}%) \n`;
    report += `- Carbs Profile: ${totalCarbs}g / ${targetCarbs}g (${carbsPercent}%)\n`;
    report += `- Protein Profile: ${totalProtein}g / ${targetProtein}g (${proteinPercent}%)\n`;
    report += `- Fats Profile: ${totalFat}g / ${targetFat}g (${fatPercent}%)\n\n`;

    report += `## DETAILED LOGS BY CATEGORY\n`;
    ['Breakfast', 'Lunch', 'Dinner', 'Snacks'].forEach((category) => {
      const items = logs.filter(log => log.mealType === category);
      if (items.length > 0) {
        report += `### ${category.toUpperCase()}\n`;
        items.forEach((item) => {
          report += `- **${item.name}**: ${item.calories} kcal | C: ${item.carbs}g | P: ${item.protein}g | F: ${item.fat}g`;
          if (item.caffeineMg) report += ` | ☕ Caffeine: ${item.caffeineMg}mg`;
          if (item.nicotineMg) report += ` | 🚬 Nicotine: ${item.nicotineMg}mg`;
          report += `\n`;
        });
        report += `\n`;
      }
    });

    report += `*Generated automatically by NutriTrack AI Studio Diagnostics Compiler.*`;
    return report;
  };

  const generateCSVReport = (): string => {
    const headers = ['Date', 'Time', 'Meal Type', 'Name', 'Calories', 'Carbs(g)', 'Protein(g)', 'Fat(g)', 'Caffeine(mg)', 'Nicotine(mg)'];
    const rows = logs.map(log => {
      const dateObj = new Date(log.timestamp);
      return [
        dateObj.toLocaleDateString(),
        dateObj.toLocaleTimeString(),
        log.mealType,
        log.name,
        log.calories,
        log.carbs,
        log.protein,
        log.fat,
        log.caffeineMg || 0,
        log.nicotineMg || 0
      ].join(',');
    });
    return [headers.join(','), ...rows].join('\n');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const handleDownloadReport = () => {
    const markdown = generateMarkdownReport();
    downloadFile(markdown, `NutriTrack_Report_${new Date().toISOString().split('T')[0]}.md`, 'text/markdown');
  };

  const handleDownloadCSV = async () => {
    const csv = generateCSVReport();
    const fileName = `NutriTrack_Logs_${new Date().toISOString().split('T')[0]}.csv`;

    if (Capacitor.isNativePlatform()) {
      try {
        const result = await Filesystem.writeFile({
          path: fileName,
          data: csv,
          directory: Directory.Documents,
          encoding: 'utf8' as any
        });

        await Share.share({
          title: 'Export NutriTrack Logs',
          text: 'Here are my NutriTrack nutrition logs.',
          url: result.uri,
          dialogTitle: 'Export CSV'
        });
      } catch (e) {
        console.error('Error saving file', e);
        // Fallback to web download if possible
        downloadFile(csv, fileName, 'text/csv');
      }
    } else {
      downloadFile(csv, fileName, 'text/csv');
    }
  };

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: `${contentType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-[#f3f4f6]" id="diary-journal-view">
      {/* Header with Export icon button (Matches Screen 7!) */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#222228] bg-[#121216]">
        <button
          onClick={onOpenSidebar}
          className="p-1 rounded-lg hover:bg-[#1c1c24] transition-colors bg-transparent border-none text-white cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-extrabold text-[#f97316] tracking-wide text-lg">NutriTrack Summary</span>
        <button
          onClick={() => setExportModal(true)}
          id="btn-trigger-export"
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#f97316]/10 hover:bg-[#f97316]/20 text-[#f97316] rounded-xl text-xs font-bold border border-[#f97316]/30 transition-all cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Export Summary</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-20">
        
        {/* Caloric Radial Chart section (Exactly mimics circular progress in image stack!) */}
        <div className="bg-[#16161a] border border-[#222228] p-5 rounded-2xl flex items-center space-x-6" id="summary-header">
          {/* Circular Donut Ring */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Outer Back Circle */}
              <circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-neutral-800 fill-none"
                strokeWidth="8"
              />
              {/* Foreground progress */}
              <circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-emerald-500 fill-none transition-all duration-700"
                strokeWidth="8"
                strokeDasharray="289"
                strokeDashoffset={289 - (289 * calPercent) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-gray-400 font-bold block leading-none uppercase">Today's Goal</span>
              <span className="text-sm font-extrabold text-white font-mono mt-1 block">
                {totalCalories} / {targetCalories}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold leading-none mt-0.5">
                {calPercent}% limit
              </span>
            </div>
          </div>

          {/* Core Macro Bars directly adjacent to Ring (Styled just like Screen 7!) */}
          <div className="flex-1 space-y-2.5">
            {/* Carbs Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-blue-400 font-medium">Carbs</span>
                <span className="text-[#9ca3af]">{totalCarbs}/{targetCarbs}g ({carbsPercent}%)</span>
              </div>
              <div className="w-full bg-[#2a2a35] h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full rounded-full transition-all duration-500" style={{ width: `${carbsPercent}%` }} />
              </div>
            </div>

            {/* Protein Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-emerald-400 font-medium">Protein</span>
                <span className="text-[#9ca3af]">{totalProtein}/{targetProtein}g ({proteinPercent}%)</span>
              </div>
              <div className="w-full bg-[#2a2a35] h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${proteinPercent}%` }} />
              </div>
            </div>

            {/* Fats Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-amber-500 font-medium">Fat</span>
                <span className="text-[#9ca3af]">{totalFat}/{targetFat}g ({fatPercent}%)</span>
              </div>
              <div className="w-full bg-[#2a2a35] h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${fatPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Meal cards (Chronological exactly matching layout 7!) */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold tracking-wider text-[#6b7280] uppercase">
            CHRONOLOGICAL RECENT DIARY
          </h2>

          {logs.length === 0 ? (
            <div className="py-12 bg-[#121216] border border-dashed border-[#222228] p-6 text-center text-[#4b5563] rounded-2xl">
              Your calorie logs is currently empty. Head over to the Camera or Macro Calc tabs to start logging ingredients.
            </div>
          ) : (
            logs.map((log) => {
              // Custom bar percentages inside the individual card as highlighted on image 7
              const logCarbsPercent = Math.min(100, Math.round((log.carbs / 150) * 100));
              const logProteinPercent = Math.min(100, Math.round((log.protein / 80) * 100));
              const logFatPercent = Math.min(100, Math.round((log.fat / 50) * 100));

              return (
                <div
                  key={log.id}
                  id={`diary-card-${log.id}`}
                  className="bg-[#16161a] border border-[#222228] p-4 rounded-xl space-y-3 relative overflow-hidden group hover:border-[#3e3e4a] transition-all"
                >
                  {/* Category Title Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold">
                          {log.mealType}
                        </span>
                        <span className="text-[9px] font-mono text-gray-500">
                          • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-base mt-0.5">{log.name}</h4>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-extrabold text-white font-mono bg-neutral-800/60 px-2 py-0.5 rounded">
                        {log.calories} kcal
                      </span>
                      <button
                        onClick={() => onDeleteLog(log.id)}
                        id={`btn-del-log-${log.id}`}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Optional Food Image */}
                  {log.imageBase64 && (
                    <div className="w-full h-32 rounded-lg overflow-hidden border border-[#222228] bg-black/40 mb-1">
                      <img
                        src={log.imageBase64}
                        alt={log.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Micro macronutrient bars inside card representing layout 7 */}
                  <div className="flex space-x-2 pt-1">
                    <div className="flex-1 h-1 bg-[#222228] rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full" style={{ width: `${logCarbsPercent}%` }} />
                    </div>
                    <div className="flex-1 h-1 bg-[#222228] rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full" style={{ width: `${logProteinPercent}%` }} />
                    </div>
                    <div className="flex-1 h-1 bg-[#222228] rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: `${logFatPercent}%` }} />
                    </div>
                  </div>

                  {/* Detail Bullet points inside */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-mono text-[#9ca3af] pt-1">
                    <div>Carbs: <strong className="text-white">{log.carbs}g</strong></div>
                    <div>Protein: <strong className="text-white">{log.protein}g</strong></div>
                    <div>Fat: <strong className="text-white">{log.fat}g</strong></div>
                    
                    {/* Active Stimulants marks exactly as illustrated */}
                    {log.caffeineMg && (
                      <div className="bg-orange-500/10 text-orange-400 font-extrabold px-1.5 py-0.5 rounded text-[10px] flex items-center border border-orange-500/20">
                        ☕ Caf: {log.caffeineMg}mg
                      </div>
                    )}
                    {log.nicotineMg && (
                      <div className="bg-[#a855f7]/10 text-purple-400 font-extrabold px-1.5 py-0.5 rounded text-[10px] flex items-center border border-[#a855f7]/20">
                        🚬 Nic: {log.nicotineMg}mg
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Export Report Dialog popup modal */}
      {exportModal && (
        <div className="absolute inset-x-4 top-16 bottom-16 bg-[#121216] border border-[#222228] rounded-2xl p-5 flex flex-col justify-between shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center border-b border-[#222228] pb-3 mb-4">
              <h3 className="font-bold text-lg text-white">Export Workout & Diet Slate</h3>
              <button
                onClick={() => setExportModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Generated template representation preview area */}
            <div className="flex-1 bg-[#0a0a0c] p-4 rounded-xl border border-[#222228] font-mono text-xs text-gray-300 overflow-y-auto min-h-0 select-all">
              <pre className="whitespace-pre-wrap leading-normal">{generateMarkdownReport()}</pre>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-4 border-t border-[#222228] mt-4">
            <button
              onClick={handleCopyToClipboard}
              className="w-full py-3 bg-[#1c1c24] border border-[#3e3e4a] hover:bg-[#262630] text-xs font-bold rounded-xl text-white flex items-center justify-center space-x-1"
            >
              <Clipboard className="w-4 h-4 text-emerald-400" />
              <span>{exported ? 'Report Copied!' : 'Copy Markdown to Clipboard'}</span>
            </button>
            <div className="flex space-x-2">
              <button
                onClick={handleDownloadReport}
                className="flex-1 py-3 bg-[#2a2a35] border border-[#3e3e4a] hover:bg-[#343440] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1"
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Save .MD</span>
              </button>
              <button
                onClick={handleDownloadCSV}
                className="flex-1 py-3 bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export .CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
