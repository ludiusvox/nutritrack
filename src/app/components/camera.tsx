import { useRef, useState, useCallback, useEffect } from "react";
import { Camera as CameraIcon, X, AlertCircle, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface CameraProps {
  onCapture: (photoUrl: string) => void;
}

type PermissionState = "prompt" | "granted" | "denied" | "unknown";
type CameraError = "permission" | "notfound" | "constraint" | "generic" | null;

export function Camera({ onCapture }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<CameraError>(null);
  const [permissionState, setPermissionState] = useState<PermissionState>("unknown");
  const [isInitializing, setIsInitializing] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        // Force track removal for rigid Android WebViews
        streamRef.current?.removeTrack(track); 
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current.removeAttribute('src'); // Android memory leak fix
      videoRef.current.load(); 
    }
    setIsStreaming(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const startCamera = useCallback(async () => {
    try {
      setIsInitializing(true);
      setCameraError(null);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("generic");
        alert("Camera API blocked! If using Android Emulator, ensure you access via http://localhost using 'adb reverse tcp:3000 tcp:3000'. http://10.0.2.2 is NOT a secure context.");
        setIsInitializing(false);
        return;
      }

      let stream: MediaStream;
      
      try {
        // Attempt 1: Standard Environment Camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });
      } catch (firstError) {
        console.warn("Environment constraint failed, trying any available video track...", firstError);
        // Attempt 2: Ultimate Fallback (Essential for Android Studio Emulators)
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        } catch (secondError) {
          throw secondError; // Pass to main error handler
        }
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Android WebView specific: Ensure video is ready before playing
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play();
            setIsStreaming(true);
            setPermissionState("granted");
            setIsInitializing(false);
          } catch (e) {
            console.error("Android playback error:", e);
            setCameraError("generic");
            setIsInitializing(false);
          }
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      
      if (error instanceof DOMException) {
        switch (error.name) {
          case "NotAllowedError":
          case "PermissionDeniedError":
            setCameraError("permission");
            setPermissionState("denied");
            break;
          case "NotFoundError":
          case "DevicesNotFoundError":
            setCameraError("notfound");
            break;
          case "ConstraintNotSatisfiedError":
          case "OverconstrainedError":
            setCameraError("constraint");
            break;
          default:
            setCameraError("generic");
        }
      } else {
        setCameraError("generic");
      }
      setIsInitializing(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Android WebViews sometimes report 0 dimensions until actively drawn
      const width = video.videoWidth || video.clientWidth || 640;
      const height = video.videoHeight || video.clientHeight || 480;
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        // Using image/png is often safer on Android WebViews than jpeg to prevent black frames
        const photoUrl = canvas.toDataURL("image/png"); 
        setCapturedPhoto(photoUrl);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const usePhoto = useCallback(() => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      setCapturedPhoto(null);
    }
  }, [capturedPhoto, onCapture]);

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null);
    startCamera();
  }, [startCamera]);

  // ... (renderErrorMessage function remains exactly the same as your code)
  const renderErrorMessage = () => {
    switch (cameraError) {
      case "permission":
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Camera Permission Denied</AlertTitle>
            <AlertDescription>
              <div className="space-y-2 mt-2">
                <p>To use the camera feature, you need to grant permission. Please:</p>
                <div className="mt-3 p-3 bg-red-950/20 rounded-md text-sm border border-red-500/20">
                  <p className="font-semibold mb-1">Capacitor/Android Users:</p>
                  <p>You must grant camera permissions in your device's native settings: <strong>Settings → Apps → Your App → Permissions → Camera → Allow</strong></p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        );
      case "notfound":
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Camera Found</AlertTitle>
            <AlertDescription>
              No camera device was detected. If using an Emulator, check your AVD settings to ensure a camera is enabled (e.g., "VirtualScene").
            </AlertDescription>
          </Alert>
        );
      case "constraint":
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Camera Constraint Error</AlertTitle>
            <AlertDescription>
              Your camera doesn't meet the required specifications. Trying with default settings...
              <Button onClick={startCamera} className="mt-2" variant="outline" size="sm">
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        );
      case "generic":
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Camera Error</AlertTitle>
            <AlertDescription>
              Unable to access the camera. Please:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Make sure you're using localhost (via adb reverse)</li>
                <li>Check that no other app is holding the camera open</li>
                <li>Try restarting the app</li>
              </ul>
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CameraIcon className="h-5 w-5" />
          Take Photo
        </CardTitle>
        <CardDescription>
          Capture a photo of your meal to attach to nutrition entries
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isStreaming && !capturedPhoto && !cameraError && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>First time using camera?</strong> Your device will ask for permission.
              Make sure to click "Allow" when prompted.
            </AlertDescription>
          </Alert>
        )}

        {cameraError && renderErrorMessage()}
        
        <div className="relative bg-black rounded-lg overflow-hidden aspect-[4/3]">
          {!isStreaming && !capturedPhoto && (
            <div className="absolute inset-0 flex items-center justify-center">
              {isInitializing ? (
                <div className="text-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground">Starting camera...</p>
                </div>
              ) : (
                <Button onClick={startCamera} size="lg" disabled={isInitializing}>
                  <CameraIcon className="mr-2 h-5 w-5" />
                  Open Camera
                </Button>
              )}
            </div>
          )}

          {isStreaming && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline // Crucial for mobile
                muted
                className="w-full h-full object-cover"
                style={{ width: '100%', height: '100%' }}
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 px-4">
                <Button onClick={capturePhoto} size="lg" className="shadow-lg bg-primary hover:bg-primary/90">
                  <CameraIcon className="mr-2 h-5 w-5" />
                  Take Photo
                </Button>
                <Button onClick={stopCamera} size="lg" variant="destructive" className="shadow-lg">
                  <X className="mr-2 h-5 w-5" />
                  Turn Off Camera
                </Button>
              </div>
            </>
          )}

          {capturedPhoto && (
            <>
              <img
                src={capturedPhoto}
                alt="Captured"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                <Button onClick={usePhoto} size="lg" className="bg-primary hover:bg-primary/90">
                  Use Photo
                </Button>
                <Button onClick={retakePhoto} size="lg" variant="secondary">
                  Retake
                </Button>
              </div>
            </>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

      </CardContent>
    </Card>
  );
}