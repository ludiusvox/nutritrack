/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Home, Camera, Clipboard, Calendar, Sliders, Info, Sparkles } from 'lucide-react';
import { App as CapApp } from '@capacitor/app';
import { LogEntry, Activity, SyncSettings, MifflinInputs, BodyFatInputs } from './types';
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
import FuelingSchedule from './components/FuelingSchedule';
import CalendarSync from './components/CalendarSync';
import MifflinCalculator from './components/MifflinCalculator';
import BodyFatCalculator from './components/BodyFatCalculator';
import Sidebar from './components/Sidebar';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'camera' | 'diary' | 'schedule' | 'calcs'>('dashboard');
  
  // Decoupled sub-views
  const [showSyncSettings, setShowSyncSettings] = useState(false);
  const [calcSubMode, setCalcSubMode] = useState<'mifflin' | 'bodyfat'>('mifflin');
  const [showSidebar, setShowSidebar] = useState(false);

  // Application-wide persistent States
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('nutritrack_logs');
      // Clear pre-existing data if specifically requested or if it's the first time
      const shouldClear = localStorage.getItem('nutritrack_data_cleared') !== 'true';
      if (shouldClear) {
        localStorage.setItem('nutritrack_data_cleared', 'true');
        return [];
      }
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error loading logs:', e);
      return [];
    }
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem('nutritrack_activities');
      const shouldClear = localStorage.getItem('nutritrack_activities_cleared') !== 'true';
      if (shouldClear) {
        localStorage.setItem('nutritrack_activities_cleared', 'true');
        return [];
      }
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error loading activities:', e);
      return [];
    }
  });

  const [fastingConfig, setFastingConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('nutritrack_fasting');
      if (!saved) return INITIAL_FASTING_CONFIG;
      return JSON.parse(saved);
    } catch (e) {
      return INITIAL_FASTING_CONFIG;
    }
  });

  const [weeklyStats, setWeeklyStats] = useState(() => {
    try {
      const saved = localStorage.getItem('nutritrack_weekly_stats');
      if (!saved) return INITIAL_WEEKLY_STATS;
      return JSON.parse(saved);
    } catch (e) {
      return INITIAL_WEEKLY_STATS;
    }
  });

  // Maintenance: Keep only last 4 weeks of records
  useEffect(() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    setWeeklyStats(prev => {
      const filtered = prev.filter(stat => new Date(stat.weekStarting) >= oneMonthAgo);

      // Also ensure current week exists
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
      const monday = new Date(now.setDate(diff));
      const mondayISO = monday.toISOString().split('T')[0];

      const currentWeekExists = filtered.some(s => s.weekStarting === mondayISO);
      if (!currentWeekExists) {
        return [...filtered, { weekStarting: mondayISO, dailyCalories: [0,0,0,0,0,0,0] }];
      }
      return filtered;
    });
  }, []);

  // Reset logic
  useEffect(() => {
    const now = new Date();

    // Daily Reset for Food Logs (At Midnight)
    const lastDailyResetStr = localStorage.getItem('nutritrack_last_daily_reset');
    const lastDailyReset = lastDailyResetStr ? new Date(lastDailyResetStr) : null;

    if (lastDailyReset) {
      const isNewDay = now.getDate() !== lastDailyReset.getDate() ||
                       now.getMonth() !== lastDailyReset.getMonth() ||
                       now.getFullYear() !== lastDailyReset.getFullYear();

      if (isNewDay) {
        setLogs([]);
        localStorage.setItem('nutritrack_last_daily_reset', now.toISOString());
      }
    } else {
      localStorage.setItem('nutritrack_last_daily_reset', now.toISOString());
    }

    // Weekly Reset for Activities
    const lastResetStr = localStorage.getItem('nutritrack_last_reset');
    const lastReset = lastResetStr ? new Date(lastResetStr) : null;

    if (lastReset) {
      const diffTime = Math.abs(now.getTime() - lastReset.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 7) {
        setActivities([]);
        localStorage.setItem('nutritrack_last_reset', now.toISOString());
      }
    } else {
      localStorage.setItem('nutritrack_last_reset', now.toISOString());
    }
  }, []);

  const [syncSettings, setSyncSettings] = useState<SyncSettings>(() => {
    try {
      const saved = localStorage.getItem('nutritrack_sync');
      if (!saved) return INITIAL_SYNC_SETTINGS;
      const parsed = JSON.parse(saved);
      return (parsed && typeof parsed === 'object') ? parsed : INITIAL_SYNC_SETTINGS;
    } catch (e) {
      console.error('Error loading sync settings:', e);
      return INITIAL_SYNC_SETTINGS;
    }
  });

  const [mifflinInputs, setMifflinInputs] = useState<MifflinInputs>(() => {
    try {
      const saved = localStorage.getItem('nutritrack_mifflin');
      if (!saved) return INITIAL_MIFFLIN_INPUTS;
      const parsed = JSON.parse(saved);
      return (parsed && typeof parsed === 'object') ? parsed : INITIAL_MIFFLIN_INPUTS;
    } catch (e) {
      console.error('Error loading mifflin inputs:', e);
      return INITIAL_MIFFLIN_INPUTS;
    }
  });

  const [bodyFatInputs, setBodyFatInputs] = useState<BodyFatInputs>(() => {
    try {
      const saved = localStorage.getItem('nutritrack_bodyfat');
      if (!saved) return INITIAL_BODY_FAT_INPUTS;
      const parsed = JSON.parse(saved);
      return (parsed && typeof parsed === 'object') ? parsed : INITIAL_BODY_FAT_INPUTS;
    } catch (e) {
      console.error('Error loading body fat inputs:', e);
      return INITIAL_BODY_FAT_INPUTS;
    }
  });

  // Safe synchronization into client localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nutritrack_logs', JSON.stringify(logs));
    } catch (e) {
      if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        console.error('Storage quota exceeded!');
        // Keep the latest 5 entries only if quota exceeded
        if (logs.length > 5) {
          alert("Storage full! Keeping only recent logs.");
          setLogs(logs.slice(0, 5));
        }
      }
    }
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('nutritrack_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('nutritrack_sync', JSON.stringify(syncSettings));
  }, [syncSettings]);

  useEffect(() => {
    localStorage.setItem('nutritrack_mifflin', JSON.stringify(mifflinInputs));
  }, [mifflinInputs]);

  useEffect(() => {
    localStorage.setItem('nutritrack_bodyfat', JSON.stringify(bodyFatInputs));
  }, [bodyFatInputs]);

  useEffect(() => {
    localStorage.setItem('nutritrack_fasting', JSON.stringify(fastingConfig));
  }, [fastingConfig]);

  useEffect(() => {
    localStorage.setItem('nutritrack_weekly_stats', JSON.stringify(weeklyStats));
  }, [weeklyStats]);

  // Update current day's stats when logs change
  useEffect(() => {
    const totalToday = logs.reduce((acc, log) => acc + log.calories, 0);
    const now = new Date();
    const dayIndex = (now.getDay() + 6) % 7; // 0=Mon, 6=Sun

    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    const mondayISO = monday.toISOString().split('T')[0];

    setWeeklyStats(prev => {
      return prev.map(stat => {
        if (stat.weekStarting === mondayISO) {
          const newDaily = [...stat.dailyCalories];
          newDaily[dayIndex] = totalToday;
          return { ...stat, dailyCalories: newDaily };
        }
        return stat;
      });
    });
  }, [logs]);

  // App-wide dark mode state & persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('nutritrack_dark_mode');
    return saved !== null ? saved === 'true' : true;
  });

  // Handle Hardware Back Button for Android
  useEffect(() => {
    const backHandler = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (showSyncSettings) {
        setShowSyncSettings(false);
      } else if (showSidebar) {
        setShowSidebar(false);
      } else if (activeTab !== 'dashboard') {
        setActiveTab('dashboard');
      } else {
        // At root level, exit app
        CapApp.exitApp();
      }
    });

    return () => {
      backHandler.then(h => h.remove());
    };
  }, [activeTab, showSyncSettings, showSidebar]);

  useEffect(() => {
    localStorage.setItem('nutritrack_dark_mode', String(darkMode));
  }, [darkMode]);

  // Log Mutators
  const handleAddLog = (newLog: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const fullLog: LogEntry = {
      ...newLog,
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setLogs((prev) => [fullLog, ...prev]);
  };

  const handleDeleteLog = (id: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  // Activity Mutators
  const handleAddActivity = (newAct: Omit<Activity, 'id'>) => {
    const fullAct: Activity = {
      ...newAct,
      id: `a-${Date.now()}`
    };
    setActivities((prev) => [...prev, fullAct]);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((act) => act.id !== id));
  };

  return (
    <div className={`min-h-screen bg-[#07070a] flex flex-col justify-between items-center py-4 px-2 md:py-8 ${darkMode ? 'dark-mode' : 'light-mode'}`} id="root-container">
      {/* Visual Desktop Helper Wrapper */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 items-stretch h-full flex-1">
        
        {/* Left Side: Desktop Informational panel */}
        <div className="hidden lg:flex flex-col justify-between w-96 p-6 bg-[#121216] border border-[#222228] rounded-2xl text-left space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 bg-[#f97316]/10 text-[#f97316] text-[10px] uppercase font-bold tracking-widest rounded-full border border-[#f97316]/20">
                ACTIVE PIPELINE
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <div>
              <h1 className="text-4xl font-extrabold font-display tracking-tight text-white">
                NutriTrack
              </h1>
              <span className="text-xs text-[#9ca3af] block mt-1 tracking-wider uppercase font-semibold font-mono">
                COMPREHENSIVE NUTRITION CORE
              </span>
            </div>

            <p className="text-xs text-[#9ca3af] leading-relaxed">
              Experience a highly integrated diagnostic diet and athletic calendar platform. Connect meal snaps to full-stack Gemini analysis engines, plan load intervals, calculate metabolic rates, and compile markdown summary reports.
            </p>

            {/* Quick stats board */}
            <div className="bg-[#1c1c24] border border-[#222228] rounded-xl p-4 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Journal Entries:</span>
                <span className="text-white font-bold">{logs.length} logged</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Target daily intake:</span>
                <span className="text-[#f97316] font-bold">2500 kcal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Caffeine levels parsed:</span>
                <span className="text-white font-bold">
                  {logs.reduce((acc, log) => acc + (log.caffeineMg || 0), 0)}mg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Active workout drills:</span>
                <span className="text-white font-bold">{activities.length} scheduled</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0c] p-4 rounded-xl border border-[#222228] flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-[#f97316] mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-[#9ca3af] leading-relaxed">
              <strong>Evaluation Engine Note:</strong> Image recognition executes instant base64 parsing. Configure custom secrets via the Secrets panel to activate live cloud intelligence constraints.
            </p>
          </div>
        </div>

        {/* Center/Right: Core Phone Viewport Frame (Simulating precise smartphone form-factor) */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative w-full max-w-[420px] h-[780px] bg-[#0a0a0c] rounded-[48px] border-[10px] border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between">
            
            {/* Phone Notch/Speaker Header Mockup bar */}
            <div className="absolute top-0 inset-x-0 h-6 bg-black flex items-center justify-center z-45">
              <div className="w-24 h-4 bg-black rounded-b-xl flex items-center justify-center">
                {/* Speaker pill */}
                <div className="w-10 h-1 bg-[#222] rounded-full" />
              </div>
            </div>

            {/* Inner viewport space padding */}
            <div className="flex-1 pt-6 overflow-hidden relative">
              
              <Sidebar
                isOpen={showSidebar}
                onClose={() => setShowSidebar(false)}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  setShowSyncSettings(false);
                }}
                onOpenSync={() => setShowSyncSettings(true)}
                onOpenBodyFat={() => {
                  setActiveTab('calcs');
                  setCalcSubMode('bodyfat');
                }}
                activeTab={activeTab}
              />

              {/* Timeline Toggle Overwrites */}
              {showSyncSettings ? (
                <CalendarSync
                  settings={syncSettings}
                  onChange={setSyncSettings}
                  onBack={() => setShowSyncSettings(false)}
                />
              ) : (
                /* Core Navigation Router */
                <>
                  {activeTab === 'dashboard' && (
                    <DashboardView
                      logs={logs}
                      onDeleteLog={handleDeleteLog}
                      darkMode={darkMode}
                      setDarkMode={setDarkMode}
                      onOpenSidebar={() => setShowSidebar(true)}
                      onOpenSyncSettings={() => setShowSyncSettings(true)}
                      targetCalories={fastingConfig.dailyCalorieGoal}
                      onNavigateToTab={(tab) => {
                        if (tab === 'mifflin') {
                          setActiveTab('calcs');
                          setCalcSubMode('mifflin');
                        } else {
                          setActiveTab(tab as any);
                        }
                      }}
                      onOpenBodyFat={() => {
                        setActiveTab('calcs');
                        setCalcSubMode('bodyfat');
                      }}
                    />
                  )}

                  {activeTab === 'camera' && (
                    <CameraView
                      onAddLog={handleAddLog}
                      onBack={() => setActiveTab('dashboard')}
                      onOpenSidebar={() => setShowSidebar(true)}
                    />
                  )}

                  {activeTab === 'diary' && (
                    <DiaryView
                      logs={logs}
                      onDeleteLog={handleDeleteLog}
                      targetCalories={fastingConfig.dailyCalorieGoal}
                      onOpenSidebar={() => setShowSidebar(true)}
                    />
                  )}

                  {activeTab === 'schedule' && (
                    <FuelingSchedule
                      activities={activities}
                      syncSettings={syncSettings}
                      onOpenSyncSettings={() => setShowSyncSettings(true)}
                      onAddActivity={handleAddActivity}
                      onDeleteActivity={handleDeleteActivity}
                      onOpenSidebar={() => setShowSidebar(true)}
                      fastingConfig={fastingConfig}
                      setFastingConfig={setFastingConfig}
                      weeklyStats={weeklyStats}
                      setWeeklyStats={setWeeklyStats}
                    />
                  )}

                  {activeTab === 'calcs' && (
                    <div className="flex flex-col h-full bg-[#0a0a0c]">
                      {/* Sub-tabs segment switcher for calculations */}
                      <div className="px-4 pt-3 pb-1 border-b border-[#222228] bg-[#121216] flex space-x-1.5" id="calcs-sub-segment">
                        <button
                          onClick={() => setCalcSubMode('mifflin')}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                            calcSubMode === 'mifflin'
                              ? 'bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/30'
                              : 'text-gray-400'
                          }`}
                        >
                          Mifflin BMR
                        </button>
                        <button
                          onClick={() => setCalcSubMode('bodyfat')}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                            calcSubMode === 'bodyfat'
                              ? 'bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/30'
                              : 'text-gray-400'
                          }`}
                        >
                          US Navy Fat %
                        </button>
                      </div>

                      <div className="flex-1 overflow-hidden">
                        {calcSubMode === 'mifflin' ? (
                          <MifflinCalculator
                            initialInputs={mifflinInputs}
                            onClose={() => setActiveTab('dashboard')}
                            onSaveResults={(bmr, tdee) => {
                              // Optional trigger updates
                            }}
                          />
                        ) : (
                          <BodyFatCalculator
                            initialInputs={bodyFatInputs}
                            onBack={() => setCalcSubMode('mifflin')}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* iOS bottom safe area indicator bar & Unified Navigation Bottom Bar (Matches screens perfectly!) */}
            <div className="bg-[#121216] border-t border-[#222228] px-4 py-3 pb-6 flex items-center justify-around z-40 relative safe-area-bottom">
              {/* Tab 1: Dashboard */}
              <button
                onClick={() => { setActiveTab('dashboard'); setShowSyncSettings(false); }}
                className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-xl transition-all ${
                  activeTab === 'dashboard' 
                    ? 'text-[#f97316] font-semibold scale-105' 
                    : 'text-gray-400 hover:text-white'
                }`}
                id="tab-btn-dashboard"
              >
                <Home className="w-5 h-5" />
                <span className="text-[10px] tracking-wide">Today</span>
              </button>

              {/* Tab 2: Camera */}
              <button
                onClick={() => { setActiveTab('camera'); setShowSyncSettings(false); }}
                className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-xl transition-all ${
                  activeTab === 'camera' 
                    ? 'text-[#f97316] font-semibold scale-105' 
                    : 'text-gray-400 hover:text-white'
                }`}
                id="tab-btn-camera"
              >
                <Camera className="w-5 h-5" />
                <span className="text-[10px] tracking-wide">Camera</span>
              </button>

              {/* Tab 3: Diary / Journal */}
              <button
                onClick={() => { setActiveTab('diary'); setShowSyncSettings(false); }}
                className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-xl transition-all ${
                  activeTab === 'diary' 
                    ? 'text-[#f97316] font-semibold scale-105' 
                    : 'text-gray-400 hover:text-white'
                }`}
                id="tab-btn-diary"
              >
                <Clipboard className="w-5 h-5" />
                <span className="text-[10px] tracking-wide">Diary</span>
              </button>

              {/* Tab 4: Fueling Schedule */}
              <button
                onClick={() => { setActiveTab('schedule'); setShowSyncSettings(false); }}
                className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-xl transition-all ${
                  activeTab === 'schedule' 
                    ? 'text-[#f97316] font-semibold scale-105' 
                    : 'text-gray-400 hover:text-white'
                }`}
                id="tab-btn-schedule"
              >
                <Calendar className="w-5 h-5" />
                <span className="text-[10px] tracking-wide">Plan</span>
              </button>

              {/* Tab 5: Calculators */}
              <button
                onClick={() => { setActiveTab('calcs'); setShowSyncSettings(false); }}
                className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-xl transition-all ${
                  activeTab === 'calcs' 
                    ? 'text-[#f97316] font-semibold scale-105' 
                    : 'text-gray-400 hover:text-white'
                }`}
                id="tab-btn-calcs"
              >
                <Sliders className="w-5 h-5" />
                <span className="text-[10px] tracking-wide">Calcs</span>
              </button>

              {/* Phone home visual line bar */}
              <div className="absolute bottom-1 w-32 h-1 bg-neutral-600 rounded-full" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
