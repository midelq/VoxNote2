"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2, Play, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export function VoiceRecorder({ initialIsSignedIn }: { initialIsSignedIn?: boolean }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const router = useRouter();
  const isSignedIn = initialIsSignedIn || false;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      recorder.start();
      setIsRecording(true);
      toast("Recording started...");
    } catch (err) {
      console.error(err);
      toast.error("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast("Recording stopped");
    }
  };

  const handleTranscribe = async () => {
    if (!audioUrl) return;

    // Check free tier
    const hasUsedFree = localStorage.getItem("voxnote_free_used");
    if (hasUsedFree && !isSignedIn) {
      toast.error("You have used your free recording. Please sign in to continue.");
      router.push("/sign-up");
      return;
    }

    setIsLoading(true);
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Transcription failed");
      
      const data = await res.json();
      setTranscript(data.text);
      
      if (!isSignedIn) {
        localStorage.setItem("voxnote_free_used", "true");
      }
      toast.success("Transcription complete!");
    } catch (err) {
      console.error(err);
      toast.error("Transcription failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const clear = () => {
    setAudioUrl(null);
    setTranscript(null);
    audioChunksRef.current = [];
  };

  return (
    <Card className="p-8 glass border-white/10 glow-purple flex flex-col items-center gap-6 w-full">
      {!audioUrl && !transcript && (
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {isRecording && (
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse-ring scale-150" />
            )}
            <Button
              size="lg"
              className={`w-20 h-20 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-violet-600 hover:bg-violet-700'} transition-all`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? <Square className="w-8 h-8 fill-white" /> : <Mic className="w-8 h-8" />}
            </Button>
          </div>
          <p className="text-gray-400 font-medium">
            {isRecording ? "Recording... (press square to stop)" : "Click to start recording"}
          </p>
        </div>
      )}

      {audioUrl && !transcript && (
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex items-center gap-4">
             <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-violet-500/30" onClick={() => {
               const audio = new Audio(audioUrl);
               audio.play();
             }}>
               <Play className="w-5 h-5 text-violet-400" />
             </Button>
             <div className="flex gap-2 items-center">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-1 bg-violet-500/40 rounded-full h-4 animate-wave" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
             </div>
          </div>
          
          <div className="flex gap-3 w-full max-w-xs">
            <Button variant="ghost" className="flex-1 text-gray-400" onClick={clear}>
              <Trash2 className="w-4 h-4 mr-2" /> Redo
            </Button>
            <Button className="flex-1 bg-violet-600 hover:bg-violet-700" onClick={handleTranscribe} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Transcribe <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </div>
        </div>
      )}

      {transcript && (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-sm font-semibold text-violet-300 mb-3 uppercase tracking-wider">Transcription</h3>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 min-h-[100px] text-gray-200 leading-relaxed italic">
            "{transcript}"
          </div>
          
          {isSignedIn ? (
             <Button className="w-full bg-violet-600" onClick={() => router.push("/dashboard")}>
                Save to History
             </Button>
          ) : (
            <div className="bg-violet-600/10 border border-violet-500/20 rounded-lg p-4 text-center">
              <p className="text-sm text-violet-300 mb-3">Sign in to save this note and get more recordings</p>
              <Button size="sm" className="bg-violet-600 hover:bg-violet-500" onClick={() => router.push("/sign-up")}>
                Sign Up Now
              </Button>
            </div>
          )}
          
          <Button variant="ghost" size="sm" className="w-full mt-4 text-gray-500 hover:text-gray-300" onClick={clear}>
            Start New
          </Button>
        </div>
      )}
    </Card>
  );
}
