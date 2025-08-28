import React, { useState, useRef, useCallback } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const VideoCapture = ({ 
  onVideoCapture, 
  maxDuration = 60, 
  className,
  ...props 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment", // Use back camera by default on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
    } catch (err) {
      setError("Camera access denied. Please enable camera permissions.");
      setHasPermission(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    mediaRecorderRef.current = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp9'
    });
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
      onVideoCapture?.(blob, url);
    };
    
    mediaRecorderRef.current.start();
    setIsRecording(true);
    setRecordingTime(0);
    
    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        const newTime = prev + 1;
        if (newTime >= maxDuration) {
          stopRecording();
        }
        return newTime;
      });
    }, 1000);
  }, [maxDuration, onVideoCapture]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    stopCamera();
  }, [isRecording, stopCamera]);

  const retakeVideo = useCallback(() => {
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
      setRecordedVideoUrl(null);
    }
    setRecordingTime(0);
    startCamera();
  }, [recordedVideoUrl, startCamera]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  React.useEffect(() => {
    return () => {
      stopCamera();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recordedVideoUrl) {
        URL.revokeObjectURL(recordedVideoUrl);
      }
    };
  }, [stopCamera, recordedVideoUrl]);

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <ApperIcon name="Video" className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">Video Documentation</h3>
          <span className="text-sm text-gray-500">(Optional)</span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <ApperIcon name="AlertCircle" className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {recordedVideoUrl ? (
            <video
              className="w-full h-full object-cover"
              controls
              src={recordedVideoUrl}
              playsInline
            />
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
          )}
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              REC {formatTime(recordingTime)}
            </div>
          )}

          {/* No camera state */}
          {hasPermission === null && !recordedVideoUrl && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <ApperIcon name="Camera" className="w-16 h-16 mb-3" />
              <p className="text-lg font-medium">Ready to Record</p>
              <p className="text-sm">Tap the camera button to start</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          {!recordedVideoUrl ? (
            <>
              {!hasPermission && (
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={startCamera}
                  disabled={isRecording}
                >
                  <ApperIcon name="Camera" className="w-4 h-4 mr-2" />
                  Enable Camera
                </Button>
              )}
              
              {hasPermission && !isRecording && (
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={startRecording}
                >
                  <ApperIcon name="Video" className="w-4 h-4 mr-2" />
                  Start Recording
                </Button>
              )}
              
              {isRecording && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={stopRecording}
                >
                  <ApperIcon name="Square" className="w-4 h-4 mr-2" />
                  Stop Recording
                </Button>
              )}
            </>
          ) : (
            <Button
              variant="outline"
              className="flex-1"
              onClick={retakeVideo}
            >
              <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
              Retake Video
            </Button>
          )}
        </div>

        <div className="mt-3 text-xs text-gray-500 text-center">
          Maximum duration: {maxDuration} seconds • Camera will use back camera on mobile devices
        </div>
      </div>
    </div>
  );
};

export default VideoCapture;