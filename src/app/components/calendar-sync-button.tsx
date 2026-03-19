import { useState } from "react";
import { Calendar, Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { createCalendarEvent, updateCalendarEvent, getEventsForDate, isSignedIn } from "../utils/google-calendar";
import { toast } from "sonner";

interface CalendarSyncButtonProps {
  calorieCount: number;
  macros: { fat: number; carbs: number; protein: number };
  date?: Date;
  notes?: string;
}

export function CalendarSyncButton({ calorieCount, macros, date = new Date(), notes }: CalendarSyncButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  const handleSync = async () => {
    if (!isSignedIn()) {
      toast.error("Please sign in to Google Calendar first");
      return;
    }

    setIsLoading(true);

    try {
      // Check if there's already an event for today
      const events = await getEventsForDate(date);
      const existingNutritionEvent = events.find(event => 
        event.summary?.includes("Daily Nutrition")
      );

      if (existingNutritionEvent) {
        // Update existing event
        await updateCalendarEvent(
          existingNutritionEvent.id,
          calorieCount,
          macros,
          notes
        );
        toast.success("Calendar event updated!");
      } else {
        // Create new event
        await createCalendarEvent(date, calorieCount, macros, notes);
        toast.success("Calendar event created!");
      }

      setIsSynced(true);
      
      // Reset synced state after 3 seconds
      setTimeout(() => setIsSynced(false), 3000);
    } catch (error) {
      console.error("Failed to sync with calendar:", error);
      toast.error("Failed to sync with Google Calendar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={isLoading || isSynced}
      variant={isSynced ? "outline" : "default"}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Syncing...
        </>
      ) : isSynced ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Synced!
        </>
      ) : (
        <>
          <Calendar className="mr-2 h-4 w-4" />
          Sync to Google Calendar
        </>
      )}
    </Button>
  );
}
