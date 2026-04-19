import { useRef, useState, useCallback } from "react";
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

  const startCamera = useCallback(async () => {
    try {
      setIsInitializing(true);
      setCameraError(null);
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("generic");
        alert("Camera not supported in this browser. Please use Chrome, Edge, or Safari.");
        setIsInitializing(false);
        return;
      }

      // Request camera access with simpler constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment"
        },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Set streaming state immediately, then wait for video to play
        setIsStreaming(true);
        setPermissionState("granted");
        setIsInitializing(false);
        
        // Log when video starts playing
        const handlePlay = () => {
          console.log("Video started playing");
          videoRef.current?.removeEventListener('play', handlePlay);
        };
        videoRef.current.addEventListener('play', handlePlay);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      
      // Determine error type
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

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Ensure video is playing before capturing
      if (video.paused || video.ended) {
        video.play().catch(console.error);
      }
      
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const photoUrl = canvas.toDataURL("image/jpeg", 0.8);
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
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Click the <strong>lock/info icon</strong> in your browser's address bar</li>
                  <li>Find <strong>"Camera"</strong> in the permissions list</li>
                  <li>Change it to <strong>"Allow"</strong></li>
                  <li>Refresh this page or click "Open Camera" again</li>
                </ol>
                <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                  <p className="font-semibold mb-1">Browser-specific instructions:</p>
                  <p><strong>Chrome/Edge:</strong> Click 🔒 or ⓘ → Site settings → Camera → Allow</p>
                  <p><strong>Safari:</strong> Safari menu → Settings for This Website → Camera → Allow</p>
                  <p><strong>Firefox:</strong> Click 🔒 → More Information → Permissions → Camera → Allow</p>
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
              No camera device was detected on your device. Please:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Check if your device has a camera</li>
                <li>Make sure it's not being used by another application</li>
                <li>Try restarting your browser</li>
                <li>If using external camera, check the connection</li>
              </ul>
            </AlertDescription>
          </Alert>
        );
      case "constraint":
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Camera Constraint Error</AlertTitle>
            <AlertDescription>
              Your camera doesn't meet the required specifications. This is usually okay - trying with default settings...
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
                <li>Make sure you're using HTTPS or localhost</li>
                <li>Check that no other app is using the camera</li>
                <li>Try refreshing the page</li>
                <li>Use a supported browser (Chrome, Edge, Safari, Firefox)</li>
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
        {/* Info message */}
        {!isStreaming && !capturedPhoto && !cameraError && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>First time using camera?</strong> Your browser will ask for permission.
              Make sure to click "Allow" when prompted.
            </AlertDescription>
          </Alert>
        )}

        {/* Error messages */}
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
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ width: '100%', height: '100%' }}
              />
              {/* UPDATED: Clearer, explicit buttons for taking photos and turning off camera */}
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

        {/* Additional help text */}
        {!isStreaming && !capturedPhoto && (
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Tips:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Take photos in good lighting for best results</li>
              <li>Position food items clearly in the frame</li>
              <li>You can retake photos if needed</li>
              <li>Photos are stored locally on your device</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
