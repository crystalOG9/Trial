"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Zap,
  Volume2,
  VolumeX,
  Command,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Calculator,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/useSound";

export function LiveSystemBar({
  onOpenCommandPalette,
  onTriggerStudioSim
}: {
  onOpenCommandPalette: () => void;
  onTriggerStudioSim?: () => void;
}) {
  const [tps, setTps] = useState(42.4);
  const [isMinimized, setIsMinimized] = useState(false);
  const { isMuted, toggleSound, playClick } = useSound();

  // Simulated live fluctuating TPS
  useEffect(() => {
    const interval = setInterval(() => {
      setTps((prev) => {
        const delta = (Math.random() - 0.48) * 1.8;
        return Number(Math.max(28, Math.min(64, prev + delta)).toFixed(1));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[95%] sm:w-auto">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="glass-card rounded-full border border-white/10 bg-[#040816]/90 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl px-4 py-2 flex items-center justify-between gap-3 text-xs"
      >
        {/* Live TPS Telemetry */}
        <div className="flex items-center gap-2 pr-3 border-r border-white/10">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-emerald-400 font-bold hidden sm:inline">{tps} ops/s</span>
          <span className="text-[10px] text-muted-foreground uppercase font-mono hidden md:inline">
            Telemetry Live
          </span>
        </div>

        {/* Quick Nav Tools */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => scrollTo("studio")}
            className="px-2.5 py-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors flex items-center gap-1.5 font-medium text-[11px]"
          >
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            <span className="hidden sm:inline">Workflow</span> Studio
          </button>

          <button
            onClick={() => scrollTo("playground")}
            className="px-2.5 py-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors flex items-center gap-1.5 font-medium text-[11px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">AI</span> Sandbox
          </button>

          <button
            onClick={() => scrollTo("roi-calculator")}
            className="px-2.5 py-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors flex items-center gap-1.5 font-medium text-[11px]"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            ROI <span className="hidden sm:inline">Engine</span>
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 pl-2 border-l border-white/10">
          {/* Audio toggle button */}
          <button
            onClick={toggleSound}
            title={isMuted ? "Unmute procedural sounds" : "Mute procedural sounds"}
            className={cn(
              "p-1.5 rounded-full transition-colors",
              isMuted ? "text-muted-foreground hover:text-white hover:bg-white/5" : "text-brand-300 bg-brand-500/20"
            )}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Command Palette Trigger Button */}
          <button
            onClick={onOpenCommandPalette}
            title="Open Command Palette (Cmd+K)"
            className="px-2 py-1 rounded-full bg-white/5 hover:bg-white/15 text-muted-foreground hover:text-white transition-colors flex items-center gap-1 font-mono text-[10px]"
          >
            <Command className="w-3 h-3 text-brand-400" />
            <span className="hidden sm:inline">K</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
