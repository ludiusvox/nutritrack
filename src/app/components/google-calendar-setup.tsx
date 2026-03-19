import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Calendar, LogOut, Check } from "lucide-react";
import { initGoogleApi, signIn, signOut, isSignedIn } from "../utils/google-calendar";
import { toast } from "sonner";
import { Switch } from "./ui/switch";

const CONFIG_STORAGE_KEY = "google-calendar-config";
const AUTO_SYNC_ENABLED_KEY = "auto-sync-enabled";

interface GoogleCalendarSetupProps {
  onAuthChange?: (isAuthenticated: boolean) => void;
}

export function GoogleCalendarSetup({ onAuthChange }: GoogleCalendarSetupProps) {
  const [clientId, setClientId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(() => {
    const stored = localStorage.getItem(AUTO_SYNC_ENABLED_KEY);
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (stored) {
      try {
        const config = JSON.parse(stored);
        setClientId(config.clientId || "");
        setApiKey(config.apiKey || "");
      } catch (error) {
        console.error("Error loading config:", error);
      }
    }

    setIsAuthenticated(isSignedIn());
    onAuthChange?.(isSignedIn());
  }, [onAuthChange]);

  const handleSaveConfig = async () => {
    if (!clientId || !apiKey) {
      toast.error("Please enter both Client ID and API Key");
      return;
    }

    setIsLoading(true);

    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify({ clientId, apiKey }));
      
      await initGoogleApi(clientId, apiKey);
      
      toast.success("Configuration saved! You can now sign in.");
    } catch (error) {
      console.error("Failed to initialize Google API:", error);
      toast.error("Failed to initialize Google Calendar API");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn();
      setIsAuthenticated(true);
      onAuthChange?.(true);
      toast.success("Successfully signed in to Google Calendar!");
    } catch (error) {
      console.error("Sign in failed:", error);
      toast.error("Failed to sign in to Google Calendar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    setIsAuthenticated(false);
    onAuthChange?.(false);
    toast.success("Signed out from Google Calendar");
  };

  const handleAutoSyncToggle = (enabled: boolean) => {
    setAutoSyncEnabled(enabled);
    localStorage.setItem(AUTO_SYNC_ENABLED_KEY, JSON.stringify(enabled));
    
    if (enabled) {
      toast.success("Auto-sync enabled! Daily totals will sync to Google Calendar at midnight.");
    } else {
      toast.info("Auto-sync disabled. You can still sync manually.");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Google Calendar Integration
          </CardTitle>
          <CardDescription>
            Connect your Google Calendar to automatically sync daily nutrition totals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAuthenticated ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID</Label>
                <Input
                  id="clientId"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Your Google OAuth Client ID"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Your Google API Key"
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveConfig} disabled={isLoading} className="flex-1">
                  Save Configuration
                </Button>
                <Button onClick={handleSignIn} disabled={isLoading || !clientId || !apiKey}>
                  Sign In with Google
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Connected to Google Calendar</span>
                </div>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>

              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-sync" className="text-base font-semibold">
                      Automatic Midnight Sync
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically upload daily nutrition totals to Google Calendar at midnight
                    </p>
                  </div>
                  <Switch
                    id="auto-sync"
                    checked={autoSyncEnabled}
                    onCheckedChange={handleAutoSyncToggle}
                  />
                </div>
              </div>

              {autoSyncEnabled && (
                <div className="text-sm text-muted-foreground bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="font-medium text-blue-600 dark:text-blue-400 mb-1">
                    Auto-sync is active
                  </p>
                  <p>
                    Your daily calorie totals will be automatically synced to Google Calendar at midnight each day. The app must be running for auto-sync to work.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {!isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ol className="list-decimal list-inside space-y-2">
              <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Cloud Console</a></li>
              <li>Select project: <code className="bg-muted px-1 py-0.5 rounded">nutritrack-490721</code></li>
              <li>Go to "APIs & Services" → "Credentials"</li>
              <li>Find your OAuth 2.0 Client ID and API Key</li>
              <li>Make sure redirect URI includes: <code className="bg-muted px-1 py-0.5 rounded">http://localhost:5173</code></li>
              <li>Copy and paste the credentials above</li>
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}