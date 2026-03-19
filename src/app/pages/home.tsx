import { useState, useEffect } from "react";
import { Camera } from "../components/camera";
import { Calculator } from "../components/calculator";
import { NutritionSidebar } from "../components/nutrition-sidebar";
import { ThemeToggle } from "../components/theme-toggle";
import { GoogleCalendarSetup } from "../components/google-calendar-setup";
import { NutritionEntry } from "../types/nutrition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Menu } from "lucide-react";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";
import { getTodayDateString, getMillisecondsUntilMidnight } from "../utils/date-helpers";
import { createCalendarEvent, isSignedIn } from "../utils/google-calendar";

const STORAGE_KEY = "nutrition-entries";
const LAST_SYNC_KEY = "last-calendar-sync";
const AUTO_SYNC_ENABLED_KEY = "auto-sync-enabled";

export function Home() {
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCalendarAuthenticated, setIsCalendarAuthenticated] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(() => {
    const stored = localStorage.getItem(AUTO_SYNC_ENABLED_KEY);
    return stored ? JSON.parse(stored) : false;
  });

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

  // Save auto-sync preference
  useEffect(() => {
    localStorage.setItem(AUTO_SYNC_ENABLED_KEY, JSON.stringify(autoSyncEnabled));
  }, [autoSyncEnabled]);

  // Get today's entries
  const todayEntries = entries.filter(entry => entry.date === getTodayDateString());

  // Calculate today's totals
  const todayTotals = todayEntries.reduce(
    (acc, entry) => ({
      fat: acc.fat + entry.fat,
      carbs: acc.carbs + entry.carbs,
      protein: acc.protein + entry.protein,
      calories: acc.calories + entry.calories,
    }),
    { fat: 0, carbs: 0, protein: 0, calories: 0 }
  );

  // Automatic midnight sync and reset
  useEffect(() => {
    const syncAtMidnight = async () => {
      const lastSync = localStorage.getItem(LAST_SYNC_KEY);
      const today = getTodayDateString();

      // If we haven't synced today and auto-sync is enabled
      if (lastSync !== today && autoSyncEnabled && isSignedIn() && todayTotals.calories > 0) {
        try {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          await createCalendarEvent(
            yesterday,
            todayTotals.calories,
            {
              fat: todayTotals.fat,
              carbs: todayTotals.carbs,
              protein: todayTotals.protein,
            },
            `Automatically synced at midnight`
          );

          localStorage.setItem(LAST_SYNC_KEY, today);
          toast.success("Yesterday's nutrition synced to Google Calendar!");
        } catch (error) {
          console.error("Failed to auto-sync:", error);
          toast.error("Failed to auto-sync to calendar");
        }
      }
    };

    // Check immediately on mount
    syncAtMidnight();

    // Set up midnight timer
    const scheduleNextMidnight = () => {
      const msUntilMidnight = getMillisecondsUntilMidnight();
      
      return setTimeout(() => {
        syncAtMidnight();
        // Schedule the next midnight check
        scheduleNextMidnight();
      }, msUntilMidnight);
    };

    const timer = scheduleNextMidnight();

    return () => clearTimeout(timer);
  }, [autoSyncEnabled, todayTotals, isCalendarAuthenticated]);

  const handleCapture = (photoUrl: string) => {
    setCurrentPhoto(photoUrl);
  };

  const handleAddEntry = (data: {
    name: string;
    fat: number;
    carbs: number;
    protein: number;
    calories: number;
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
        isCalendarAuthenticated={isCalendarAuthenticated}
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
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>

              <TabsContent value="camera">
                <Camera onCapture={handleCapture} />
              </TabsContent>

              <TabsContent value="calculator">
                <Calculator onAdd={handleAddEntry} currentPhoto={currentPhoto} />
              </TabsContent>

              <TabsContent value="calendar">
                <GoogleCalendarSetup onAuthChange={setIsCalendarAuthenticated} />
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