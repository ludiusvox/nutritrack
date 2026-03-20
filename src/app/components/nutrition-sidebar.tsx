import { useMemo } from "react";
import { NutritionEntry } from "../types/nutrition";
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
}

export function NutritionSidebar({ entries, isOpen, onClose, isCalendarAuthenticated }: NutritionSidebarProps) {
  // 1. Filter for today's entries only
  const todayEntries = useMemo(() => {
    const today = getTodayDateString();
    return entries.filter(entry => entry.date === today);
  }, [entries]);

  // 2. Calculate Totals (Ensuring numeric conversion to prevent string concatenation)
  const totals = useMemo(() => {
    return todayEntries.reduce(
      (acc, entry) => ({
        fat: acc.fat + (Number(entry.fat) || 0),
        carbs: acc.carbs + (Number(entry.carbs) || 0),
        protein: acc.protein + (Number(entry.protein) || 0),
        calories: acc.calories + (Number(entry.calories) || 0),
      }),
      { fat: 0, carbs: 0, protein: 0, calories: 0 }
    );
  }, [todayEntries]);

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
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Daily Summary</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        
          <Card className="p-4 bg-primary/5">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Calories</span>
                <span className="text-2xl font-bold">{totals.calories}</span>
              </div>
              <Separator />
              <div className="space-y-2">
                <MacroItem label="Fat" value={totals.fat} unit="g" color="bg-red-500" />
                <MacroItem label="Carbs" value={totals.carbs} unit="g" color="bg-blue-500" />
                <MacroItem label="Protein" value={totals.protein} unit="g" color="bg-green-500" />
              </div>
            </div>
          </Card>

          {isCalendarAuthenticated && totals.calories > 0 && (
            <div className="mt-4">
              <CalendarSyncButton
                calorieCount={totals.calories}
                macros={{
                  fat: totals.fat,
                  carbs: totals.carbs,
                  protein: totals.protein,
                }}
              />
            </div>
          )}
        </div>

        <div className="px-6 pb-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Today's Entries</h3>
        </div>

        <ScrollArea className="flex-1 px-6 pb-6">
          <div className="space-y-3">
            {todayEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No entries for today.
              </p>
            ) : (
              // Using todayEntries here ensures the list matches the summary totals
              todayEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))
            )}
          </div>
        </ScrollArea>
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
        </div>
      </div>
    </Card>
  );
}