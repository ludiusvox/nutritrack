/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Dumbbell, Bike, Plus, Trash2, RotateCcw, Menu, BarChart2, Zap, Clock, Save, Info, ChevronRight, Globe } from 'lucide-react';
import { Activity, FastingConfig, WeeklyCalorieStats } from '../types';

const COMMON_TIMEZONES = [
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Phoenix", "America/Anchorage", "America/Honolulu",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow",
  "Asia/Tokyo", "Asia/Shanghai", "Asia/Dubai", "Asia/Singapore",
  "Australia/Sydney", "Pacific/Auckland", "UTC"
];

interface TrainingPlanProps {
  activities: Activity[];
  syncSettings: any;
  onOpenSyncSettings: () => void;
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
  onDeleteActivity: (id: string) => void;
  onOpenSidebar: () => void;
  fastingConfig: FastingConfig;
  setFastingConfig: (config: FastingConfig) => void;
  weeklyStats: WeeklyCalorieStats[];
  setWeeklyStats: (stats: WeeklyCalorieStats[]) => void;
}

export default function TrainingPlan({
  activities,
  syncSettings,
  onOpenSyncSettings,
  onAddActivity,
  onDeleteActivity,
  onOpenSidebar,
  fastingConfig,
  setFastingConfig,
  weeklyStats,
  setWeeklyStats
}: TrainingPlanProps) {
  const [scheduleSubView, setScheduleSubView] = useState<'workouts' | 'fasting' | 'stats'>('workouts');
  const [fastingSubMode, setFastingSubMode] = useState<'5/2' | '16/8'>('5/2');
  const [showAddForm, setShowAddForm] = useState(false);

  const [calorieGoal, setCalorieGoal] = useState(fastingConfig.dailyCalorieGoal.toString());
  const [dailyResetTime, setDailyResetTime] = useState('');
  const [weeklyResetTime, setWeeklyResetTime] = useState('');
  const [fastingTimer, setFastingTimer] = useState({ label: 'Window starts in', time: '' });

  // Scaling Recommendations based on Goal
  const goalNum = parseInt(calorieGoal) || 2500;
  const scaledPreCarb = Math.round(goalNum / 60);
  const scaledPostCarb = Math.round(goalNum / 50);
  const scaledPostProt = Math.round(goalNum / 100);

  // Helper to get "now" in the configured timezone
  const getNowInTimezone = () => {
    const tz = fastingConfig.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();
    try {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false
        });
        const parts = formatter.formatToParts(now);
        const p: any = {};
        parts.forEach(({type, value}) => p[type] = value);
        return new Date(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second);
    } catch (e) {
        console.error("Timezone error:", e);
        return now;
    }
  };

  useEffect(() => {
    const updateCountdowns = () => {
      const now = getNowInTimezone();

      // Daily Reset (Midnight)
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diffDaily = tomorrow.getTime() - now.getTime();
      const hDaily = Math.floor(diffDaily / (1000 * 60 * 60));
      const mDaily = Math.floor((diffDaily % (1000 * 60 * 60)) / (1000 * 60));
      setDailyResetTime(`${hDaily}h ${mDaily}m`);

      // Weekly Reset (Upcoming Monday at Midnight)
      const nextWeeklyReset = new Date(now);
      const currentDay = nextWeeklyReset.getDay(); // 0=Sun, 1=Mon...
      const daysToMonday = currentDay === 1 ? 7 : (currentDay === 0 ? 1 : 8 - currentDay);
      nextWeeklyReset.setDate(nextWeeklyReset.getDate() + daysToMonday);
      nextWeeklyReset.setHours(0, 0, 0, 0);

      const diffWeekly = nextWeeklyReset.getTime() - now.getTime();
      if (diffWeekly > 0) {
        const dWeekly = Math.floor(diffWeekly / (1000 * 60 * 60 * 24));
        const hWeekly = Math.floor((diffWeekly % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        setWeeklyResetTime(`${dWeekly}d ${hWeekly}h`);
      } else {
        setWeeklyResetTime('Due now');
      }

      // Fasting Window Logic - Fix 12-hour offset by targeting startHour
      const startHour = fastingConfig.startHour || 12;
      const endHour = fastingConfig.endHour || 20;
      const currentHour = now.getHours();

      if (currentHour >= startHour && currentHour < endHour) {
          // Currently inside the eating window
          const end = new Date(now);
          end.setHours(endHour, 0, 0, 0);
          const diff = end.getTime() - now.getTime();
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setFastingTimer({ label: 'Window ends in', time: `${h}h ${m}m` });
      } else {
          // Outside the eating window
          const nextStart = new Date(now);
          if (currentHour >= endHour) {
              nextStart.setDate(nextStart.getDate() + 1);
          }
          nextStart.setHours(startHour, 0, 0, 0);
          const diff = nextStart.getTime() - now.getTime();
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setFastingTimer({ label: 'Window starts in', time: `${h}h ${m}m` });
      }
    };
    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000);
    return () => clearInterval(interval);
  }, [fastingConfig.timezone, fastingConfig.startHour, fastingConfig.endHour]);

  const [name, setName] = useState('');
  const [time, setTime] = useState('07:00');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(60);
  const [type, setType] = useState<'weightlifting' | 'biking' | 'running' | 'other'>('weightlifting');

  const handleSaveGoal = () => {
    setFastingConfig({ ...fastingConfig, dailyCalorieGoal: goalNum });
    alert("Calorie goal updated.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddActivity({
      name,
      time,
      date,
      durationMin: duration,
      type,
      presetPreLoad: `+${scaledPreCarb}g Carb`,
      presetPostLoad: `+${scaledPostCarb}g Carb, ${scaledPostProt}g Protein`
    });
    setName('');
    setShowAddForm(false);
  };

  // Robust Logic to find the day after the last workout
  const getLastWorkoutDayAfter = () => {
    if (activities.length === 0) return null;
    const sorted = [...activities].sort((a, b) => {
        const [yA, mA, dA] = a.date.split('-').map(Number);
        const [yB, mB, dB] = b.date.split('-').map(Number);
        return new Date(yB, mB-1, dB).getTime() - new Date(yA, mA-1, dA).getTime();
    });

    const [y, m, d] = sorted[0].date.split('-').map(Number);
    const lastWorkoutDate = new Date(y, m-1, d);
    const dayAfter = new Date(lastWorkoutDate);
    dayAfter.setDate(lastWorkoutDate.getDate() + 1);

    return {
        date: dayAfter.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
        iso: `${dayAfter.getFullYear()}-${String(dayAfter.getMonth()+1).padStart(2,'0')}-${String(dayAfter.getDate()).padStart(2,'0')}`
    };
  };

  const dayAfterWorkout = getLastWorkoutDayAfter();

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-[#f3f4f6]" id="fueling-schedule-view">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#222228] bg-[#121216]">
        <button onClick={onOpenSidebar} className="p-1 rounded-lg hover:bg-[#1c1c24] text-white">
          <Menu className="w-6 h-6" />
        </button>
        <h3 className="font-semibold text-gray-400 text-sm px-3 flex-1 text-center uppercase tracking-widest">Performance Sync</h3>
        <div className="w-8" />
      </div>

      {/* Top Sub-Menu Navigation */}
      <div className="px-4 pt-4 pb-2 bg-[#121216] border-b border-[#222228]">
        <div className="flex space-x-2 bg-[#0a0a0c] p-1 rounded-xl border border-[#222228]">
          <button
            onClick={() => setScheduleSubView('workouts')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                scheduleSubView === 'workouts' ? 'bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/30' : 'text-gray-400'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Workouts</span>
          </button>
          <button
            onClick={() => setScheduleSubView('fasting')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                scheduleSubView === 'fasting' ? 'bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30' : 'text-gray-400'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Fasting</span>
          </button>
          <button
            onClick={() => setScheduleSubView('stats')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                scheduleSubView === 'stats' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-gray-400'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Stats</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-24 safe-area-x">

        {/* Top Controls: Goal and Timers */}
        <div className="space-y-3">
          <div className="bg-[#16161a] border border-[#222228] p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#f97316]/10 flex items-center justify-center border border-[#f97316]/20">
                  <Save className="w-4 h-4 text-[#f97316]" />
              </div>
              <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Daily Goal</span>
                  <input
                    type="number"
                    value={calorieGoal}
                    onChange={(e) => setCalorieGoal(e.target.value)}
                    className="bg-transparent border-none text-white text-sm font-mono focus:outline-none w-20"
                  />
              </div>
            </div>
            <button onClick={handleSaveGoal} className="px-3 py-1.5 bg-[#f97316] text-white rounded-lg text-xs font-bold active:scale-95 transition-all">
              Set
            </button>
          </div>

          {/* Timezone Selector */}
          <div className="bg-[#16161a] border border-[#222228] p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                  <Globe className="w-4 h-4 text-sky-400" />
              </div>
              <div className="flex-1">
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">App Timezone</span>
                  <select
                    value={fastingConfig.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
                    onChange={(e) => setFastingConfig({ ...fastingConfig, timezone: e.target.value })}
                    className="bg-transparent border-none text-white text-xs font-mono focus:outline-none w-full max-w-[180px] appearance-none"
                  >
                    {COMMON_TIMEZONES.map(tz => (
                        <option key={tz} value={tz} className="bg-[#16161a]">{tz}</option>
                    ))}
                  </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3" id="reset-timers-container">
            <div className="bg-[#16161a] border border-[#222228] p-3 rounded-xl flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center border border-emerald-500/20">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-[#9ca3af] uppercase font-bold tracking-wider block">Food Reset</span>
                <span className="text-xs font-mono font-bold text-white">{dailyResetTime}</span>
              </div>
            </div>
            <div className="bg-[#16161a] border border-[#222228] p-3 rounded-xl flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#3b82f6]/10 text-[#3b82f6] rounded-lg flex items-center justify-center border border-[#3b82f6]/20">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-[#9ca3af] uppercase font-bold tracking-wider block">Activity Reset</span>
                <span className="text-xs font-mono font-bold text-white">{weeklyResetTime}</span>
              </div>
            </div>
          </div>
        </div>

        {scheduleSubView === 'workouts' && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold tracking-wider text-[#6b7280] uppercase">Training Schedule</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center space-x-1 px-3 py-1 bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/30 rounded-lg text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Session</span>
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleSubmit} className="bg-[#121216] border border-[#222228] p-4 rounded-xl space-y-4">
                 <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase font-bold">Session Name</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0a0a0c] border border-[#222228] rounded-lg p-2 text-sm text-white" placeholder="e.g. Legs" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase font-bold">Type</label>
                      <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-[#0a0a0c] border border-[#222228] rounded-lg p-2 text-sm text-white">
                        <option value="weightlifting">Weightlifting</option>
                        <option value="biking">Biking</option>
                        <option value="running">Running</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase font-bold">Date</label>
                      <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-[#0a0a0c] border border-[#222228] rounded-lg p-2 text-sm text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase font-bold">Duration (min)</label>
                      <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value)||0)} className="w-full bg-[#0a0a0c] border border-[#222228] rounded-lg p-2 text-sm text-white" />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase font-bold">Start Time</label>
                      <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-[#0a0a0c] border border-[#222228] rounded-lg p-2 text-sm text-white" />
                    </div>
                 </div>

                 <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                    <span className="text-[10px] text-blue-400 uppercase font-bold block mb-1">Recommended Scaled Loadouts</span>
                    <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-gray-400">Pre: +{scaledPreCarb}g Carb</span>
                        <span className="text-gray-400">Post: +{scaledPostCarb}g C, {scaledPostProt}g P</span>
                    </div>
                 </div>

                 <button type="submit" className="w-full py-2.5 bg-[#f97316] text-white rounded-xl text-sm font-bold">Save Activity</button>
              </form>
            )}

            <div className="space-y-4">
              {activities.map(act => (
                <div key={act.id} className="bg-[#16161a] border border-[#222228] p-4 rounded-xl space-y-3 group transition-all hover:border-[#3e3e4a]">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${act.type === 'weightlifting' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                        {act.type === 'weightlifting' ? <Dumbbell className="w-5 h-5" /> : <Bike className="w-5 h-5" />}
                        </div>
                        <div>
                        <h4 className="font-bold text-white text-sm">{act.name}</h4>
                        <p className="text-[10px] text-gray-500 font-mono">{act.date} @ {act.time} • {act.durationMin} min</p>
                        </div>
                    </div>
                    <button onClick={() => onDeleteActivity(act.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#222228]/50">
                    <div className="bg-[#0a0a0c] p-2 rounded-lg border border-[#222228]">
                        <span className="text-[9px] text-gray-500 uppercase font-bold block">Pre-Load</span>
                        <span className="text-[11px] font-bold text-white">{act.presetPreLoad}</span>
                    </div>
                    <div className="bg-[#0a0a0c] p-2 rounded-lg border border-[#222228]">
                        <span className="text-[9px] text-gray-500 uppercase font-bold block">Post-Load</span>
                        <span className="text-[11px] font-bold text-white">{act.presetPostLoad}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {scheduleSubView === 'fasting' && (
          <div className="space-y-6">
            <div className="flex bg-[#121216] p-1.5 rounded-xl border border-[#222228] space-x-2">
               <button onClick={() => setFastingSubMode('5/2')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${fastingSubMode === '5/2' ? 'bg-[#a855f7]/20 text-[#a855f7]' : 'text-gray-400'}`}>5/2 Protocol</button>
               <button onClick={() => setFastingSubMode('16/8')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${fastingSubMode === '16/8' ? 'bg-[#a855f7]/20 text-[#a855f7]' : 'text-gray-400'}`}>16/8 Window</button>
            </div>

            <div className="bg-[#16161a] border border-[#222228] p-5 rounded-2xl space-y-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-[#a855f7]" />
                <h3 className="text-lg font-bold text-white">{fastingSubMode} Fasting Schedule</h3>
              </div>

              {fastingSubMode === '5/2' ? (
                <>
                  <div className="p-4 bg-[#0a0a0c] rounded-xl border border-[#222228] space-y-2">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Next Recommended Flush Day (Post-Workout)</span>
                    {!dayAfterWorkout ? (
                        <p className="text-sm text-gray-400 italic">No workout logged yet.</p>
                    ) : (
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-[#a855f7]">{dayAfterWorkout.date}</span>
                            <div className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-[10px] font-bold uppercase">
                                40% Reduction
                            </div>
                        </div>
                    )}
                  </div>
                  <p className="text-xs text-[#9ca3af] leading-relaxed">
                    The 5/2 strategy optimized for performance uses the day <strong>immediately following</strong> a heavy training session as the low-calorie flush day. Target intake: <strong className="text-white">{Math.round(goalNum * 0.6)} kcal</strong>.
                  </p>
                </>
              ) : (
                <>
                  <div className="p-4 bg-[#0a0a0c] rounded-xl border border-[#222228] space-y-2">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Target Recovery Window</span>
                    {!dayAfterWorkout ? (
                        <p className="text-xs text-gray-400 italic">Log a workout to sync window.</p>
                    ) : (
                        <p className="text-xs text-[#9ca3af]">
                            Your next optimized recovery window is on <strong className="text-white">{dayAfterWorkout.date}</strong>.
                        </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-semibold text-gray-400">Daily Eating Window</span>
                       <span className="text-xs font-mono font-bold text-[#a855f7]">
                           {fastingConfig.startHour > 12 ? fastingConfig.startHour - 12 : fastingConfig.startHour}:00 {fastingConfig.startHour >= 12 ? 'PM' : 'AM'} - {fastingConfig.endHour > 12 ? fastingConfig.endHour - 12 : fastingConfig.endHour}:00 {fastingConfig.endHour >= 12 ? 'PM' : 'AM'}
                       </span>
                    </div>
                    <div className="h-2 bg-[#2a2a35] rounded-full overflow-hidden flex">
                       <div style={{ width: `${(fastingConfig.startHour / 24) * 100}%` }} className="h-full bg-neutral-800" />
                       <div style={{ width: `${((fastingConfig.endHour - fastingConfig.startHour) / 24) * 100}%` }} className="h-full bg-[#a855f7]" />
                       <div style={{ width: `${((24 - fastingConfig.endHour) / 24) * 100}%` }} className="h-full bg-neutral-800" />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                       <span>00:00</span>
                       <span>12:00</span>
                       <span>20:00</span>
                       <span>24:00</span>
                    </div>
                  </div>
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-start space-x-3">
                    <Clock className="w-4 h-4 text-emerald-500 mt-0.5" />
                    <p className="text-xs text-gray-400">
                      {fastingTimer.label} <strong className="text-white">{fastingTimer.time}</strong>. Keep hydration high during the morning fast.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {scheduleSubView === 'stats' && (
          <div className="space-y-6">
             <h2 className="text-xs font-bold tracking-wider text-gray-500 uppercase">Weekly Calorie Performance</h2>

             {[...weeklyStats].sort((a, b) => {
                 const [yA, mA, dA] = a.weekStarting.split('-').map(Number);
                 const [yB, mB, dB] = b.weekStarting.split('-').map(Number);
                 return new Date(yB, mB-1, dB).getTime() - new Date(yA, mA-1, dA).getTime();
             }).map((stat, idx) => {
               const [y, m, d] = stat.weekStarting.split('-').map(Number);
               const displayDate = new Date(y, m-1, d).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });

               const loggedDays = stat.dailyCalories.filter(cal => cal > 0);
               const weekAvg = loggedDays.length > 0
                 ? Math.round(loggedDays.reduce((a, b) => a + b, 0) / loggedDays.length)
                 : 0;

               return (
                 <div key={idx} className="bg-[#16161a] border border-[#222228] p-5 rounded-2xl space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">Week of {displayDate}</span>
                      <span className="text-[10px] text-sky-400 font-mono font-bold">AVG: {weekAvg} kcal</span>
                    </div>

                    <div className="flex items-end justify-between h-40 px-2 pt-8">
                        {stat.dailyCalories.map((cal, i) => {
                            const height = Math.min(100, (cal / Math.max(goalNum, 3000)) * 100);
                            const isHigh = cal > goalNum;

                            return (
                                <div key={i} className="flex flex-col items-center justify-end h-full w-8 group relative">
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1c1c24] text-[9px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-xl border border-[#222228]">
                                        {cal} kcal
                                    </div>

                                    <div className="flex-1 w-full flex items-end justify-center mb-2">
                                        <div
                                            className={`w-4 rounded-t-md transition-all duration-700 ease-out ${
                                                cal > 0
                                                    ? (isHigh ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.3)]')
                                                    : 'bg-neutral-800/20'
                                            }`}
                                            style={{ height: cal > 0 ? `${Math.max(5, height)}%` : '2px' }}
                                        />
                                    </div>

                                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">
                                        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                 </div>
               );
             })}
          </div>
        )}
      </div>
    </div>
  );
}
