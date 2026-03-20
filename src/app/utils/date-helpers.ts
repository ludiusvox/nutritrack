/**
 * Get today's date in YYYY-MM-DD format (Local Time)
 * Using Intl is cleaner and avoids manual string padding
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`; 
}

/**
 * Check if a timestamp is from today
 */
export function isToday(timestamp: number): boolean {
  const date = new Date(timestamp);
  const now = new Date(); // Capture "now" once
  
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

/**
 * Get milliseconds until next midnight
 * Handles the "rollover" correctly even during DST changes
 */
export function getMillisecondsUntilMidnight(): number {
  const now = new Date();
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // This safely handles month/year rollovers
    0, 0, 0, 0
  );
  
  return tomorrow.getTime() - now.getTime();
}

/**
 * Format date for display (e.g., "Oct 24, 2023")
 */
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(timestamp));
}

/**
 * Format time for display (e.g., "1:30 PM")
 */
export function formatTime(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(timestamp));
}