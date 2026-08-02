/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Home, Camera, Clipboard, Calendar, Sliders, Info, Sparkles } from 'lucide-react';
import { App as CapApp } from '@capacitor/app';
import { LogEntry, Activity, SyncSettings, MifflinInputs, BodyFatInputs, FastingConfig, WeeklyCalorieStats } from './types';
import {
  INITIAL_LOGS,
  INITIAL_ACTIVITIES,
  INITIAL_SYNC_SETTINGS,
  INITIAL_MIFFLIN_INPUTS,
  INITIAL_BODY_FAT_INPUTS,
  INITIAL_FASTING_CONFIG,
  INITIAL_WEEKLY_STATS
} from './data';

import DashboardView from './components/DashboardView';
import CameraView from './components/CameraView';
import DiaryView from './components/DiaryView';
import TrainingPlan from './components/TrainingPlan';
import CalendarSync from './components/CalendarSync';
import MifflinCalculator from './components/MifflinCalculator';
import BodyFatCalculator from './components/BodyFatCalculator';
import Sidebar from './components/Sidebar';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'camera' | 'diary' | 'schedule' | 'calcs'>('dashboard');
  const [showSyncSettings, setShowSyncSettings] = useState(false);
  const [calcSubMode, setCalcSubMode] = useState<'mifflin' | 'bodyfat'>('mifflin');
  const [showSidebar, setShowSidebar] = useState(false);

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('nutritrack_logs');
      if (!saved) return [];
      return JSON.parse(saved);
    } catch (e) { return []; }
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem('nutritrack_activities');
      if (!saved) return [];
      return JSON.parse(saved);
    } catch (e) { return []; }
  });

  const [fastingConfig, setFastingConfig] = useState<FastingConfig>(() => {
    try {
      const saved = localStorage.getItem('nutritrack_fasting');
      if (!saved) return INITIAL_FASTING_CONFIG;
      return JSON.parse(saved);
    } catch (e) { return INITIAL_FASTING_CONFIG; }
  });

  const [weeklyStats, setWeeklyStats] = useState<WeeklyCalorieStats[]>(() => {
    try {
      const saved = localStorage.getItem('nutritrack_weekly_stats');
      if (!saved) return INITIAL_WEEKLY_STATS;
      return JSON.parse(saved);
    } catch (e) { return INITIAL_WEEKLY_STATS; }
  });

  const getMondayISO = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Maintenance: Local Time Reset Fix and Stats update
  useEffect(() => {
    const now = new Date();
    const todayISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // 1. Auto-Reset Diary if it's a new day (Local Time)
    setLogs(prev => {
        const filtered = prev.filter(log => {
            const logDate = log.timestamp.split('T')[0];
            return logDate === todayISO;
        });
        // If we filtered anything, it means a reset happened
        return filtered;
    });

    // 2. Update Statistics
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    const mondayISO = getMondayISO(now);
    const dayIndex = (now.getDay() + 6) % 7; // 0=Mon, 6=Sun
    const totalToday = logs.reduce((acc, log) => {
        const logDate = log.timestamp.split('T')[0];
        return logDate === todayISO ? acc + log.calories : acc;
    }, 0);

    setWeeklyStats(prev => {
      let updated = prev.filter(stat => {
          const [y, m, d] = stat.weekStarting.split('-').map(Number);
          return new Date(y, m - 1, d) >= oneMonthAgo;
      });

      const existingIdx = updated.findIndex(s => s.weekStarting === mondayISO);
      if (existingIdx !== -1) {
        const newDaily = [...updated[existingIdx].dailyCalories];
        newDaily[dayIndex] = totalToday;
        updated[existingIdx] = { ...updated[existingIdx], dailyCalories: newDaily };
      } else {
        const newDaily = [0,0,0,0,0,0,0];
        newDaily[dayIndex] = totalToday;
        updated = [...updated, { weekStarting: mondayISO, dailyCalories: newDaily }];
      }
      return updated;
    });
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('nutritrack_logs', JSON.stringify(logs));
    localStorage.setItem('nutritrack_activities', JSON.stringify(activities));
    localStorage.setItem('nutritrack_fasting', JSON.stringify(fastingConfig));
    localStorage.setItem('nutritrack_weekly_stats', JSON.stringify(weeklyStats));
  }, [logs, activities, fastingConfig, weeklyStats]);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('nutritrack_dark_mode');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    const backHandler = CapApp.addListener('backButton', () => {
      if (showSyncSettings) setShowSyncSettings(false);
      else if (showSidebar) setShowSidebar(false);
      else if (activeTab !== 'dashboard') setActiveTab('dashboard');
      else CapApp.exitApp();
    });
    return () => { backHandler.then(h => h.remove()); };
  }, [activeTab, showSyncSettings, showSidebar]);

  return (
    <div className={`min-h-screen bg-[#07070a] flex flex-col items-center py-4 px-2 md:py-8 ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="w-full max-w-[420px] h-[780px] bg-[#0a0a0c] rounded-[48px] border-[10px] border-neutral-800 shadow-2xl overflow-hidden flex flex-col justify-between relative">
        <div className="flex-1 pt-6 overflow-hidden relative">
          <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} onNavigate={t => {setActiveTab(t); setShowSidebar(false);}} activeTab={activeTab} />
          {showSyncSettings ? (
            <CalendarSync settings={INITIAL_SYNC_SETTINGS} onChange={()=>{}} onBack={() => setShowSyncSettings(false)} />
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardView logs={logs} onDeleteLog={id => setLogs(l => l.filter(x=>x.id!==id))} darkMode={darkMode} setDarkMode={setDarkMode} onOpenSidebar={() => setShowSidebar(true)} onOpenSyncSettings={() => setShowSyncSettings(true)} targetCalories={fastingConfig.dailyCalorieGoal} onNavigateToTab={t => setActiveTab(t as any)} onOpenBodyFat={() => {setActiveTab('calcs'); setCalcSubMode('bodyfat');}} />}
              {activeTab === 'camera' && <CameraView onAddLog={e => setLogs(l => [{...e, id:Date.now().toString(), timestamp:new Date().toISOString()}, ...l])} onBack={() => setActiveTab('dashboard')} onOpenSidebar={() => setShowSidebar(true)} />}
              {activeTab === 'diary' && <DiaryView logs={logs} onDeleteLog={id => setLogs(l => l.filter(x=>x.id!==id))} targetCalories={fastingConfig.dailyCalorieGoal} onOpenSidebar={() => setShowSidebar(true)} />}
              {activeTab === 'schedule' && <TrainingPlan activities={activities} syncSettings={INITIAL_SYNC_SETTINGS} onOpenSyncSettings={() => setShowSyncSettings(true)} onAddActivity={e => setActivities(a => [...a, {...e, id:Date.now().toString()}])} onDeleteActivity={id => setActivities(a => a.filter(x=>x.id!==id))} onOpenSidebar={() => setShowSidebar(true)} fastingConfig={fastingConfig} setFastingConfig={setFastingConfig} weeklyStats={weeklyStats} setWeeklyStats={setWeeklyStats} />}
              {activeTab === 'calcs' && <div className="flex flex-col h-full bg-[#0a0a0c]"><div className="px-4 pt-3 pb-1 border-b border-[#222228] bg-[#121216] flex space-x-1.5"><button onClick={() => setCalcSubMode('mifflin')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${calcSubMode === 'mifflin' ? 'bg-[#f97316]/20 text-[#f97316]' : 'text-gray-400'}`}>Mifflin BMR</button><button onClick={() => setCalcSubMode('bodyfat')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${calcSubMode === 'bodyfat' ? 'bg-[#f97316]/20 text-[#f97316]' : 'text-gray-400'}`}>US Navy Fat %</button></div>{calcSubMode === 'mifflin' ? <MifflinCalculator initialInputs={INITIAL_MIFFLIN_INPUTS} onClose={() => setActiveTab('dashboard')} /> : <BodyFatCalculator initialInputs={INITIAL_BODY_FAT_INPUTS} onBack={() => setCalcSubMode('mifflin')} />}</div>}
            </>
          )}
        </div>
        <div className="bg-[#121216] border-t border-[#222228] px-4 py-3 pb-6 flex items-center justify-around relative safe-area-bottom">
          <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center space-y-1 ${activeTab === 'dashboard' ? 'text-[#f97316]' : 'text-gray-400'}`}><Home className="w-5 h-5" /><span className="text-[10px]">Today</span></button>
          <button onClick={() => setActiveTab('camera')} className={`flex flex-col items-center space-y-1 ${activeTab === 'camera' ? 'text-[#f97316]' : 'text-gray-400'}`}><Camera className="w-5 h-5" /><span className="text-[10px]">Camera</span></button>
          <button onClick={() => setActiveTab('diary')} className={`flex flex-col items-center space-y-1 ${activeTab === 'diary' ? 'text-[#f97316]' : 'text-gray-400'}`}><Clipboard className="w-5 h-5" /><span className="text-[10px]">Diary</span></button>
          <button onClick={() => setActiveTab('schedule')} className={`flex flex-col items-center space-y-1 ${activeTab === 'schedule' ? 'text-[#f97316]' : 'text-gray-400'}`}><Calendar className="w-5 h-5" /><span className="text-[10px]">Plan</span></button>
          <button onClick={() => setActiveTab('calcs')} className={`flex flex-col items-center space-y-1 ${activeTab === 'calcs' ? 'text-[#f97316]' : 'text-gray-400'}`}><Sliders className="w-5 h-5" /><span className="text-[10px]">Calcs</span></button>
        </div>
      </div>
    </div>
  );
}
