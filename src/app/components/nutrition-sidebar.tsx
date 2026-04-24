import { useMemo } from "react";
import { NutritionEntry, NutritionTotals } from "../types/nutrition";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { CalendarSyncButton } from "./calendar-sync-button";
import { getTodayDateString } from "../utils/date-helpers";

interface NutritionSidebarProps {
  entries: NutritionEntry[];
  isOpen: boolean;
  onClose: () => void;
  isCalendarAuthenticated?: boolean;
  totals?: NutritionTotals;
}

export function NutritionSidebar({ 
  entries, 
  isOpen, 
  onClose, 
  isCalendarAuthenticated,
  totals
}: NutritionSidebarProps) {
  // Filter for today's entries only
  const todayEntries = useMemo(() => {
    const today = getTodayDateString();
    return entries.filter(entry => entry.date === today);
  }, [entries]);

  const calculatedTotals = useMemo<NutritionTotals>(() => {
    return todayEntries.reduce(
      (acc, entry) => ({
        fat: acc.fat + entry.fat,
        carbs: acc.carbs + entry.carbs,
        protein: acc.protein + entry.protein,
        calories: acc.calories + entry.calories,
        nicotine: (acc.nicotine || 0) + (entry.nicotine || 0),
        caffeine: (acc.caffeine || 0) + (entry.caffeine || 0),
      }),
      { fat: 0, carbs: 0, protein: 0, calories: 0, nicotine: 0, caffeine: 0 }
    );
  }, [todayEntries]);

  const displayTotals = totals || calculatedTotals;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div 
        className={`fixed lg:relative w-80 bg-background border-r border-border h-screen flex flex-col z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 pt-[calc(env(safe-area-inset-top)+3rem)] border-b border-border shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Daily Summary</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto px-6 pb-10 custom-scrollbar">
            <div className="space-y-4 pt-4">
              <Card className="p-4 bg-primary/5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Calories</span>
                    <span className="text-2xl font-bold">{displayTotals.calories}</span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <MacroItem label="Fat" value={displayTotals.fat} unit="g" color="bg-red-500" />
                    <MacroItem label="Carbs" value={displayTotals.carbs} unit="g" color="bg-blue-500" />
                    <MacroItem label="Protein" value={displayTotals.protein} unit="g" color="bg-green-500" />
                  </div>
                </div>
              </Card>

              {displayTotals.nicotine > 0 || displayTotals.caffeine > 0 ? (
                <Card className="p-4 mt-4 bg-secondary/10">
                  <h3 className="text-sm font-semibold mb-2">Stimulants</h3>
                  <div className="space-y-2">
                    {displayTotals.nicotine > 0 && (
                      <MacroItem 
                        label="Nicotine" 
                        value={displayTotals.nicotine} 
                        unit="mg" 
                        color="bg-purple-500" 
                      />
                    )}
                    {displayTotals.caffeine > 0 && (
                      <MacroItem 
                        label="Caffeine" 
                        value={displayTotals.caffeine} 
                        unit="mg" 
                        color="bg-yellow-500" 
                      />
                    )}
                  </div>
                </Card>
              ) : null}

              {isCalendarAuthenticated && displayTotals.calories > 0 && (
                <div className="mt-4">
                  <CalendarSyncButton
                    calorieCount={displayTotals.calories}
                    macros={{
                      fat: displayTotals.fat,
                      carbs: displayTotals.carbs,
                      protein: displayTotals.protein,
                    }}
                  />
                </div>
              )}

              {/* Recent Entries Section */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Recent Entries</h3>
                {todayEntries.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No entries yet. Start by taking a photo or adding manually.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {todayEntries.map((entry) => (
                      <EntryCard key={entry.id} entry={entry} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MacroItem({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-sm flex-1">{label}</span>
      <span className="font-semibold">
        {value}{unit}
      </span>
    </div>
  );
}

function EntryCard({ entry }: { entry: NutritionEntry }) {
  return (
    <Card className="p-3">
      <div className="flex gap-3">
        {entry.photo && (
          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
            <img
              src={entry.photo}
              alt={entry.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{entry.name}</p>
          <p className="text-xs text-muted-foreground">{entry.calories} cal</p>
          <div className="flex gap-2 mt-1 text-xs">
            <span className="text-muted-foreground">F: {entry.fat}g</span>
            <span className="text-muted-foreground">C: {entry.carbs}g</span>
            <span className="text-muted-foreground">P: {entry.protein}g</span>
          </div>
          {(entry.nicotine || entry.caffeine) && (
            <div className="flex gap-2 mt-1 text-xs">
              {entry.nicotine > 0 && (
                <span className="text-purple-500">N: {entry.nicotine}mg</span>
              )}
              {entry.caffeine > 0 && (
                <span className="text-yellow-500">Caf: {entry.caffeine}mg</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
