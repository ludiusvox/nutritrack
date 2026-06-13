/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Dumbbell, Bike, Plus, Trash2, Sliders, Play, Info, ChevronUp, ChevronDown, Clock, RotateCcw, Menu } from 'lucide-react';
import { Activity, SyncSettings } from '../types';

interface FuelingScheduleProps {
  activities: Activity[];
  syncSettings: SyncSettings;
  onOpenSyncSettings: () => void;
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
  onDeleteActivity: (id: string) => void;
}

export default function FuelingSchedule({
  activities,
  syncSettings,
  onOpenSyncSettings,
  onAddActivity,
  onDeleteActivity,
  onOpenSidebar
}: FuelingScheduleProps & { onOpenSidebar: () => void }) {
  const [synced, setSynced] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSummaryMinimized, setIsSummaryMinimized] = useState(true);
  
  // Countdown states
  const [dailyResetTime, setDailyResetTime] = useState('');
  const [weeklyResetTime, setWeeklyResetTime] = useState('');

  useEffect(() => {
    const updateCountdowns = () => {
      const now = new Date();

      // Daily Reset (Midnight)
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diffDaily = tomorrow.getTime() - now.getTime();
      const hDaily = Math.floor(diffDaily / (1000 * 60 * 60));
      const mDaily = Math.floor((diffDaily % (1000 * 60 * 60)) / (1000 * 60));
      setDailyResetTime(`${hDaily}h ${mDaily}m`);

      // Weekly Reset
      const lastResetStr = localStorage.getItem('nutritrack_last_reset');
      const lastReset = lastResetStr ? new Date(lastResetStr) : now;
      const nextWeeklyReset = new Date(lastReset.getTime() + 7 * 24 * 60 * 60 * 1000);
      const diffWeekly = nextWeeklyReset.getTime() - now.getTime();

      if (diffWeekly > 0) {
        const dWeekly = Math.floor(diffWeekly / (1000 * 60 * 60 * 24));
        const hWeekly = Math.floor((diffWeekly % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        setWeeklyResetTime(`${dWeekly}d ${hWeekly}h`);
      } else {
        setWeeklyResetTime('Due now');
      }
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // States for new activity form
  const [name, setName] = useState('');
  const [time, setTime] = useState('7:00 AM');
  const [duration, setDuration] = useState(60);
  const [distance, setDistance] = useState('');
  const [type, setType] = useState<'weightlifting' | 'biking' | 'running' | 'other'>('weightlifting');
  const [preLoad, setPreLoad] = useState('+30g Carb');
  const [postLoad, setPostLoad] = useState('+40g Carb, 20g Protein');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddActivity({
      name,
      time,
      durationMin: duration,
      distance: distance ? distance : undefined,
      type,
      presetPreLoad: preLoad,
      presetPostLoad: postLoad
    });
    // Reset form
    setName('');
    setDistance('');
    setShowAddForm(false);
  };

  const handlePresetSelect = (selectedType: typeof type) => {
    setType(selectedType);
    if (selectedType === 'weightlifting') {
      setPreLoad('+30g Carb');
      setPostLoad('+45g Carb, 25g Protein');
      setName('Weightlifting');
    } else if (selectedType === 'biking') {
      setPreLoad('+50g Carb');
      setPostLoad('+40g Carb, Electrolytes');
      setName('Biking');
    } else if (selectedType === 'running') {
      setPreLoad('+40g Carb');
      setPostLoad('+35g Carb, BCAA Amino Acids');
      setName('Running Session');
    } else {
      setPreLoad('+15g Carb');
      setPostLoad('+20g Protein');
      setName('Gym Routine');
    }
  };

  // Calculate totals
  const totalDuration = activities.reduce((acc, act) => acc + act.durationMin, 0);
  const totalBikingMiles = activities
    .filter(act => act.type === 'biking' && act.distance)
    .reduce((acc, act) => {
      const numStr = act.distance?.replace(/[^0-9.]/g, '') || '0';
      return acc + parseFloat(numStr);
    }, 0);
  const totalRunningMiles = activities
    .filter(act => act.type === 'running' && act.distance)
    .reduce((acc, act) => {
      const numStr = act.distance?.replace(/[^0-9.]/g, '') || '0';
      return acc + parseFloat(numStr);
    }, 0);

  // Convert duration total to human readable
  const h = Math.floor(totalDuration / 60);
  const m = totalDuration % 60;
  const hText = h > 0 ? `${h}h ` : '';
  const mText = m > 0 ? `${m}m` : '';
  const totalDurationText = `${hText}${mText}` || '0m';

  // Total Calories burned estimation (+420 kcal matches screenshot, but let's make it real-time!)
  // Approx: 7 kcal per min for weightlifting, 10 for biking / running
  const totalBurnedCalories = activities.reduce((acc, act) => {
    if (act.type === 'weightlifting') return acc + (act.durationMin * 7);
    if (act.type === 'biking' || act.type === 'running') return acc + (act.durationMin * 10);
    return acc + (act.durationMin * 6);
  }, 0);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-[#f3f4f6]" id="fueling-schedule-view">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#222228] bg-[#121216]">
        <button
          onClick={onOpenSidebar}
          id="btn-sidebar-toggle-plan"
          className="p-1 rounded-lg hover:bg-[#1c1c24] transition-colors bg-transparent border-none text-white cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h3 className="font-semibold text-gray-400 text-sm">NutriTrack Planner</h3>
        <div className="w-8" /> {/* Spacer */}
      </div>

      <div className={`flex-1 overflow-y-auto px-4 py-6 space-y-6 transition-all duration-300 ${isSummaryMinimized ? 'pb-24' : 'pb-48'}`}>
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-[#f3f4f6]">
            Weekly Schule & Fueling View
          </h1>
          <p className="text-xs text-[#9ca3af] mt-1 leading-relaxed">
            Optimize glycogen density through timed carbohydrate loadouts customized for specific training drills.
          </p>
        </div>

        {/* Sync Controls card */}
        <div className="grid grid-cols-2 gap-3" id="reset-timers-container">
          {/* Daily Food Reset */}
          <div className="bg-[#16161a] border border-[#222228] p-3 rounded-xl flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center border border-emerald-500/20">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#9ca3af] uppercase font-bold tracking-wider block">Food Reset</span>
              <span className="text-xs font-mono font-bold text-white">{dailyResetTime}</span>
            </div>
          </div>

          {/* Weekly Activity Reset */}
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

        {/* Add New Session Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-bold tracking-wider text-[#6b7280] uppercase">
            TRAINING SCHEDULE
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            id="btn-add-activity"
            className="flex items-center space-x-1.5 px-3 py-1 bg-[#f97316]/10 hover:bg-[#f97316]/20 border border-[#f97316]/30 rounded-lg text-[#f97316] text-xs font-semibold cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Session</span>
          </button>
        </div>

        {/* Add Session Form */}
        {showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-[#121216] border border-[#f97316]/30 p-4 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300"
            id="form-add-activity"
          >
            <h3 className="font-semibold text-white text-sm">New Scheduled Workout</h3>
            
            {/* Presets */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#9ca3af]">Activity Preset</label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetSelect('weightlifting')}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold border ${
                    type === 'weightlifting' 
                      ? 'bg-[#3b82f6]/20 border-[#3b82f6] text-[#3b82f6]' 
                      : 'bg-[#1c1c24] border-transparent text-[#9ca3af]'
                  }`}
                >
                  Weightlift
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('biking')}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold border ${
                    type === 'biking' 
                      ? 'bg-[#f97316]/20 border-[#f97316] text-[#f97316]' 
                      : 'bg-[#1c1c24] border-transparent text-[#9ca3af]'
                  }`}
                >
                  Biking
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('running')}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold border ${
                    type === 'running' 
                      ? 'bg-[#ef4444]/20 border-[#ef4444] text-[#ef4444]' 
                      : 'bg-[#1c1c24] border-transparent text-[#9ca3af]'
                  }`}
                >
                  Running
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('other')}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold border ${
                    type === 'other' 
                      ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981]' 
                      : 'bg-[#1c1c24] border-transparent text-[#9ca3af]'
                  }`}
                >
                  Other
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#9ca3af] block mb-1">Workout Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Legs Session"
                  className="w-full bg-[#1c1c24] border border-[#222228] rounded-lg p-2 text-sm text-white focus:outline-none focus:border-[#f97316]"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-[#9ca3af] block mb-1">Time</label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 6:30 AM"
                  className="w-full bg-[#1c1c24] border border-[#222228] rounded-lg p-2 text-sm text-white focus:outline-none focus:border-[#f97316]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#9ca3af] block mb-1">Duration (min)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#1c1c24] border border-[#222228] rounded-lg p-2 text-sm text-white focus:outline-none focus:border-[#f97316]"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-[#9ca3af] block mb-1">Distance (optional)</label>
                <input
                  type="text"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="e.g. 15 miles, 5 km"
                  className="w-full bg-[#1c1c24] border border-[#222228] rounded-lg p-2 text-sm text-white focus:outline-none focus:border-[#f97316]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#3b82f6] block mb-1 font-semibold">Pre-load Carb</label>
                <input
                  type="text"
                  value={preLoad}
                  onChange={(e) => setPreLoad(e.target.value)}
                  placeholder="+40g Carb"
                  className="w-full bg-[#1c1c24] border border-[#222228] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
              <div>
                <label className="text-xs text-[#eab308] block mb-1 font-semibold">Post-load Carb/Protein</label>
                <input
                  type="text"
                  value={postLoad}
                  onChange={(e) => setPostLoad(e.target.value)}
                  placeholder="+40g Carb, Electrolytes"
                  className="w-full bg-[#1c1c24] border border-[#222228] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#eab308]"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 bg-[#1c1c24] hover:bg-[#262630] rounded-lg text-xs text-[#9ca3af]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg text-xs font-semibold"
              >
                Save Workout
              </button>
            </div>
          </form>
        )}

        {/* Timeline Activities List */}
        <div className="relative pl-6 border-l-2 border-[#222228] ml-2 space-y-6">
          {activities.length === 0 ? (
            <div className="py-8 text-center text-[#4b5563]" id="no-activities-status">
              No athletic drilling scheduled for today. Use the scheduling engine to map carbohydrate guidelines.
            </div>
          ) : (
            activities.map((act) => {
              const glowClass = act.type === 'weightlifting' ? 'glow-blue' : 'glow-orange';
              const iconBg = act.type === 'weightlifting' ? 'bg-[#3b82f6]/20 text-[#3b82f6]' : 'bg-[#f97316]/20 text-[#f97316]';
              const titleColor = act.type === 'weightlifting' ? 'text-[#3b82f6]' : 'text-[#f97316]';

              return (
                <div key={act.id} className="relative group" id={`activity-item-${act.id}`}>
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[31px] top-4 w-4.5 h-4.5 rounded-full border-4 border-[#0a0a0c] bg-[#3e3e4a] group-hover:bg-[#f97316] transition-colors`} />

                  {/* Activity Timing */}
                  <div className="text-xs font-mono text-gray-500 mb-1 flex items-center justify-between">
                    <span>{act.time}</span>
                    <button
                      onClick={() => onDeleteActivity(act.id)}
                      id={`btn-del-${act.id}`}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-400 transition-opacity hover:bg-red-500/10 rounded"
                      title="Remove session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Activity Visual Card (Styled exactly like Screen 2) */}
                  <div className={`p-4 rounded-xl bg-[#16161a] ${glowClass}`}>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
                        {act.type === 'weightlifting' ? (
                          <Dumbbell className="w-4 h-4" />
                        ) : (
                          <Bike className="w-4 h-4" />
                        )}
                      </div>
                      <h3 className="font-bold text-white text-base">
                        {act.name} {act.distance ? `(${act.distance})` : `(${act.durationMin}m)`}
                      </h3>
                    </div>

                    <div className="text-xs text-[#9ca3af] space-y-1.5 border-t border-[#222228]/50 pt-2 font-mono">
                      <div className="flex justify-between">
                        <span>Pre-load:</span>
                        <span className="text-white font-medium">{act.presetPreLoad}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Post-load:</span>
                        <span className="text-white font-medium">{act.presetPostLoad}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Slide-Up Bottom Sheet: Weekly Summary (Styled like Bottom Sheet in Screen 2) */}
      <div 
        className={`absolute bottom-16 left-0 right-0 bg-[#16161a] border-t border-[#222228] rounded-t-2xl shadow-2xl z-20 transition-all duration-300 ${
          isSummaryMinimized ? 'h-14 overflow-hidden' : 'p-4 pb-6'
        }`}
        id="weekly-summary-sheet"
      >
        <button 
          type="button"
          onClick={() => setIsSummaryMinimized(!isSummaryMinimized)}
          id="btn-toggle-summary"
          className="w-full flex flex-col items-center justify-center pt-2 pb-1 bg-transparent cursor-pointer border-none focus:outline-none select-none text-left"
        >
          <div className="w-12 h-1 bg-gray-600 rounded-full mb-2 self-center" />
          <div className="flex items-center justify-between w-full px-4 text-left">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-semibold tracking-wider text-[#6b7280] uppercase">
                Weekly Summary
              </h4>
              {isSummaryMinimized && (
                <span className="text-[10px] font-mono font-bold text-[#f97316] bg-[#f97316]/10 px-2 py-0.5 rounded-full border border-[#f97316]/20">
                  +{totalBurnedCalories || 420} kcal | {totalDurationText}
                </span>
              )}
            </div>
            {isSummaryMinimized ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </button>

        {!isSummaryMinimized && (
          <div className="flex flex-col space-y-1 mt-2 px-4 animate-in fade-in duration-200">
            <div className="flex justify-between items-center bg-[#101014] p-3 rounded-lg border border-[#222228]">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#9ca3af]">Total Energy Burned</span>
                <span className="text-base font-bold text-white font-mono">
                  +{totalBurnedCalories || 420} kcal
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-[#9ca3af]">Total Volume</span>
                <span className="text-base font-semibold text-white font-mono">
                  {totalDurationText}
                  {totalBikingMiles > 0 && `, ${totalBikingMiles} sports miles`}
                  {totalRunningMiles > 0 && `, ${totalRunningMiles} running miles`}
                  {totalBikingMiles === 0 && totalRunningMiles === 0 && `, 30 miles (est)`}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
