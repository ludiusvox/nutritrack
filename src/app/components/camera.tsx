import { useRef, useState, useCallback, useEffect } from "react";
import { Camera as CameraIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface CameraProps {
  onCapture: (photoUrl: string) => void;
}

export function Camera({ onCapture }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      // 1. Save the stream in the background
      streamRef.current = stream;
      // 2. Tell React to update the UI and show the video box and buttons
      setIsStreaming(true); 
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  }, []);

  // 3. NEW FIX: Wait for the video box to actually appear on screen, THEN attach the camera feed
  useEffect(() => {
    if (isStreaming && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isStreaming]);

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
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
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

  // Cleanup: Turn off camera when component is closed
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Camera</h3>
        
        <div className="relative bg-black rounded-lg overflow-hidden aspect-[4/3]">
          
          {/* STATE 1: Camera is Off */}
          {!isStreaming && !capturedPhoto && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button onClick={startCamera} size="lg">
                <CameraIcon className="mr-2 h-5 w-5" />
                Open Camera
              </Button>
            </div>
          )}

          {/* STATE 2: Camera is On (Streaming) */}
          {isStreaming && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-10">
                <Button onClick={capturePhoto} size="lg">
                  <CameraIcon className="mr-2 h-5 w-5" />
                  Take Photo
                </Button>
                
                <Button onClick={stopCamera} size="lg" variant="destructive">
                  Turn Off Camera
                </Button>
              </div>
            </>
          )}

          {/* STATE 3: Photo Captured */}
          {capturedPhoto && (
            <>
              <img
                src={capturedPhoto}
                alt="Captured"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-10">
                <Button onClick={usePhoto} size="lg">
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
      </div>
    </Card>
  );
}