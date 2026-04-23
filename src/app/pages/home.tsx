import { useState, useEffect } from "react";
import { Camera } from "../components/camera";
import { Calculator } from "../components/calculator";
import { NutritionSidebar } from "../components/nutrition-sidebar";
import { ThemeToggle } from "../components/theme-toggle";
import { NutritionEntry, NutritionTotals } from "../types/nutrition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Menu } from "lucide-react";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";
import { getTodayDateString, getMillisecondsUntilMidnight } from "../utils/date-helpers";
import { BmrCalculator } from "../components/bmr-calculator";

const STORAGE_KEY = "nutrition-entries";

export function Home() {
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load entries from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading entries:", error);
      }
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  // Get today's entries
  const todayEntries = entries.filter(entry => entry.date === getTodayDateString());

  // Calculate today's totals
  const todayTotals: NutritionTotals = todayEntries.reduce(
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

  // Automatic midnight reset
  useEffect(() => {
    const resetAtMidnight = async () => {
      const today = getTodayDateString();
      
      // Clear old entries (not from today) at midnight
      setEntries(prevEntries => {
        const todayEntries = prevEntries.filter(entry => entry.date === today);
        // If we have old entries, show a notification
        if (todayEntries.length < prevEntries.length) {
          toast.info("Daily reset complete! Yesterday's entries cleared.");
        }
        return todayEntries;
      });
    };

    // Check immediately on mount
    resetAtMidnight();

    // Set up midnight timer
    const scheduleNextMidnight = () => {
      const msUntilMidnight = getMillisecondsUntilMidnight();
      
      return setTimeout(() => {
        resetAtMidnight();
        // Schedule the next midnight check
        scheduleNextMidnight();
      }, msUntilMidnight);
    };

    const timer = scheduleNextMidnight();

    return () => clearTimeout(timer);
  }, []);

  const handleCapture = (photoUrl: string) => {
    setCurrentPhoto(photoUrl);
  };

  const handleAddEntry = (data: {
    name: string;
    fat: number;
    carbs: number;
    protein: number;
    calories: number;
    nicotine?: number;
    caffeine?: number;
  }) => {
    const newEntry: NutritionEntry = {
      id: Date.now().toString(),
      ...data,
      photo: currentPhoto || undefined,
      timestamp: Date.now(),
      date: getTodayDateString(),
    };

    setEntries((prev) => [newEntry, ...prev]);
    setCurrentPhoto(null);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Toaster />
      <NutritionSidebar 
        entries={entries} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        totals={todayTotals}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-border p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">NutriTrack</h1>
              <p className="text-sm text-muted-foreground">Photography & Nutrition Calculator</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="camera" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="camera">Camera</TabsTrigger>
                <TabsTrigger value="calculator">Calculator</TabsTrigger>
                <TabsTrigger value="bmr">BMR Calc</TabsTrigger>
              </TabsList>

              <TabsContent value="camera">
                <Camera onCapture={handleCapture} />
              </TabsContent>

              <TabsContent value="calculator">
                <Calculator onAdd={handleAddEntry} currentPhoto={currentPhoto} />
              </TabsContent>

              <TabsContent value="bmr">
                <BmrCalculator />
              </TabsContent>
            </Tabs>

            {currentPhoto && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground text-center">
                  Photo captured! Switch to Calculator tab to add nutrition details.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
