"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, Loader2, Play, Trash2, ArrowRight, StopCircle, Zap, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type RecordingState = "idle" | "recording" | "recorded" | "transcribed";

export function VoiceRecorder({ initialIsSignedIn, limitReached }: { initialIsSignedIn?: boolean; limitReached?: boolean }) {
  const [state, setState] = useState<RecordingState>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [guestLimitReached, setGuestLimitReached] = useState(false);

  // Check on mount if guest already used their free recording
  useEffect(() => {
    if (!initialIsSignedIn) {
      const used = localStorage.getItem("voxnote_free_used");
      if (used) setGuestLimitReached(true);
    }
  }, [initialIsSignedIn]);

  // Store everything in refs to avoid closure issues
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);

  const router = useRouter();
  const isSignedIn = initialIsSignedIn ?? false;

  const startRecording = useCallback(async () => {
    try {
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });

      mr.addEventListener("dataavailable", (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      });

      mr.addEventListener("stop", () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        blobRef.current = blob;
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setState("recorded");
        stream.getTracks().forEach((t) => t.stop());
      });

      mr.start(250);
      mediaRecorderRef.current = mr;
      setState("recording");
      toast("Recording...");
    } catch {
      toast.error("Microphone access denied.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    const mr = mediaRecorderRef.current;
    if (!mr) {
      toast.error("No recorder found");
      return;
    }
    // Request final data chunk, then stop
    mr.requestData();
    setTimeout(() => {
      try {
        mr.stop();
      } catch (e) {
        console.error(e);
      }
    }, 100);
  }, []);

  const handleTranscribe = async () => {
    if (!blobRef.current) return;

    const hasUsedFree = localStorage.getItem("voxnote_free_used");
    if (hasUsedFree && !isSignedIn) {
      toast.error("Sign in to get more recordings.");
      router.push("/sign-up");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", blobRef.current, "recording.webm");
      const res = await fetch("/api/transcribe", { method: "POST", body: formData });

      if (res.status === 403) {
        const data = await res.json();
        if (data.limitReached) {
          toast.error("Monthly limit reached! Upgrade to Pro for unlimited recordings.");
          router.push("/pricing");
          return;
        }
      }

      if (!res.ok) throw new Error("Transcription failed");
      const data = await res.json();
      setTranscript(data.text);
      setState("transcribed");
      if (!isSignedIn) localStorage.setItem("voxnote_free_used", "true");
      toast.success("Done!");
    } catch {
      toast.error("Transcription failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    blobRef.current = null;
    chunksRef.current = [];
    setAudioUrl(null);
    setTranscript(null);
    setState("idle");
    // Re-check guest limit after reset
    if (!initialIsSignedIn && localStorage.getItem("voxnote_free_used")) {
      setGuestLimitReached(true);
    }
  };

  return (
    <Card className="p-8 glass border-white/10 glow-purple flex flex-col items-center gap-6 w-full">

      {/* LIMIT REACHED — upgrade banner */}
      {limitReached && state === "idle" && (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="w-20 h-20 rounded-full bg-gray-700/50 border-2 border-dashed border-gray-600 flex items-center justify-center">
            <Mic className="w-8 h-8 text-gray-600" />
          </div>
          <div className="text-center">
            <p className="text-gray-400 font-medium mb-1">Monthly limit reached</p>
            <p className="text-xs text-gray-500">You&apos;ve used all 2 free recordings this month</p>
          </div>
          <div className="w-full bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-xl p-4 text-center">
            <Zap className="w-5 h-5 text-violet-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white mb-1">Upgrade to Pro</p>
            <p className="text-xs text-gray-400 mb-3">Unlimited recordings, priority support</p>
            <Button
              className="bg-violet-600 hover:bg-violet-500 text-white w-full"
              onClick={() => router.push("/pricing")}
            >
              <Zap className="w-4 h-4 mr-2" /> Upgrade Now
            </Button>
          </div>
        </div>
      )}

      {/* GUEST FREE LIMIT — sign in banner */}
      {!isSignedIn && guestLimitReached && state === "idle" && (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="w-20 h-20 rounded-full bg-gray-700/50 border-2 border-dashed border-gray-600 flex items-center justify-center">
            <Mic className="w-8 h-8 text-gray-600" />
          </div>
          <div className="text-center">
            <p className="text-gray-300 font-medium mb-1">Free recording used</p>
            <p className="text-xs text-gray-500">Sign in to get more recordings</p>
          </div>
          <div className="w-full bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/30 rounded-xl p-4 text-center">
            <LogIn className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white mb-1">Sign in to continue</p>
            <p className="text-xs text-gray-400 mb-3">Get 2 free recordings/month with a free account</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-blue-500/30 text-blue-300 hover:bg-blue-600/20"
                onClick={() => router.push("/sign-in")}
              >
                Sign In
              </Button>
              <Button
                className="flex-1 bg-violet-600 hover:bg-violet-500"
                onClick={() => router.push("/sign-up")}
              >
                Sign Up Free
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* IDLE — show start button */}
      {!limitReached && !guestLimitReached && state === "idle" && (
        <div className="flex flex-col items-center gap-4">
          <Button
            id="start-recording-btn"
            size="lg"
            className="w-20 h-20 rounded-full bg-violet-600 hover:bg-violet-700 transition-all"
            onClick={startRecording}
          >
            <Mic className="w-8 h-8" />
          </Button>
          <p className="text-gray-400 font-medium">Click to start recording</p>
        </div>
      )}

      {/* RECORDING — show stop button (always visible, separate) */}
      {state === "recording" && (
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center">
              <Mic className="w-8 h-8 text-red-400 animate-pulse" />
            </div>
          </div>
          <p className="text-red-400 font-medium animate-pulse">Recording...</p>
          <Button
            id="stop-recording-btn"
            size="lg"
            variant="destructive"
            className="px-8 py-3 rounded-full"
            onClick={stopRecording}
          >
            <StopCircle className="w-5 h-5 mr-2" />
            Stop Recording
          </Button>
        </div>
      )}

      {/* RECORDED — show playback + transcribe */}
      {state === "recorded" && audioUrl && (
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 border-violet-500/30"
              onClick={() => new Audio(audioUrl).play()}
            >
              <Play className="w-5 h-5 text-violet-400" />
            </Button>
            <p className="text-gray-400 text-sm">Recording ready</p>
          </div>
          <div className="flex gap-3 w-full max-w-xs">
            <Button variant="ghost" className="flex-1 text-gray-400" onClick={reset}>
              <Trash2 className="w-4 h-4 mr-2" /> Redo
            </Button>
            <Button
              className="flex-1 bg-violet-600 hover:bg-violet-700"
              onClick={handleTranscribe}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Transcribe <ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>
          </div>
        </div>
      )}

      {/* TRANSCRIBED — show result */}
      {state === "transcribed" && transcript && (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-sm font-semibold text-violet-300 mb-3 uppercase tracking-wider">Transcription</h3>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 min-h-[80px] text-gray-200 leading-relaxed">
            &ldquo;{transcript}&rdquo;
          </div>
          {isSignedIn ? (
            <Button className="w-full bg-violet-600" onClick={() => router.push("/dashboard")}>
              Save to History
            </Button>
          ) : (
            <div className="bg-violet-600/10 border border-violet-500/20 rounded-lg p-4 text-center">
              <p className="text-sm text-violet-300 mb-3">Sign in to save & get more recordings</p>
              <Button size="sm" className="bg-violet-600 hover:bg-violet-500" onClick={() => router.push("/sign-up")}>
                Sign Up Free
              </Button>
            </div>
          )}
          <Button variant="ghost" size="sm" className="w-full mt-4 text-gray-500" onClick={reset}>
            Start New
          </Button>
        </div>
      )}
    </Card>
  );
}
