"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Command,
  Zap,
  Calculator,
  Play,
  Layers,
  Sparkles,
  ShieldCheck,
  Volume2,
  VolumeX,
  Palette,
  ArrowRight,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/useSound";

interface PaletteItem {
  id: string;
  title: string;
  category: "Navigation" | "Action" | "Theme";
  icon: typeof Zap;
  shortcut?: string;
  action: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onTriggerStudioSim
}: {
  isOpen: boolean;
  onClose: () => void;
  onTriggerStudioSim?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { isMuted, toggleSound, playClick, playSuccess } = useSound();

  const setThemeAccent = (color: string) => {
    playSuccess();
    const root = document.documentElement;
    if (color === "cyan") {
      root.style.setProperty("--color-brand-500", "#06b6d4");
      root.style.setProperty("--color-brand-600", "#0891b2");
    } else if (color === "purple") {
      root.style.setProperty("--color-brand-500", "#a855f7");
      root.style.setProperty("--color-brand-600", "#9333ea");
    } else if (color === "emerald") {
      root.style.setProperty("--color-brand-500", "#10b981");
      root.style.setProperty("--color-brand-600", "#059669");
    } else {
      // Default blue
      root.style.setProperty("--color-brand-500", "#3b82f6");
      root.style.setProperty("--color-brand-600", "#2563eb");
    }
  };

  const scrollTo = (id: string) => {
    playClick();
    onClose();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const items: PaletteItem[] = [
    {
      id: "studio",
      title: "Open Interactive Workflow Studio",
      category: "Navigation",
      icon: Zap,
      shortcut: "S",
      action: () => scrollTo("studio")
    },
    {
      id: "run-sim",
      title: "Simulate Enterprise Pipeline Execution",
      category: "Action",
      icon: Play,
      shortcut: "R",
      action: () => {
        scrollTo("studio");
        if (onTriggerStudioSim) onTriggerStudioSim();
      }
    },
    {
      id: "playground",
      title: "Open Live AI Intent Playground",
      category: "Navigation",
      icon: Sparkles,
      shortcut: "P",
      action: () => scrollTo("playground")
    },
    {
      id: "roi",
      title: "Launch Interactive ROI & Savings Engine",
      category: "Navigation",
      icon: Calculator,
      shortcut: "C",
      action: () => scrollTo("roi-calculator")
    },
    {
      id: "hitl",
      title: "Human-In-The-Loop Triage Console",
      category: "Navigation",
      icon: ShieldCheck,
      shortcut: "H",
      action: () => scrollTo("hitl-command")
    },
    {
      id: "integrations",
      title: "Browse Integrations Ecosystem",
      category: "Navigation",
      icon: Layers,
      shortcut: "I",
      action: () => scrollTo("integrations")
    },
    {
      id: "sound-toggle",
      title: isMuted ? "Unmute Procedural Web Audio" : "Mute Sound Effects",
      category: "Action",
      icon: isMuted ? Volume2 : VolumeX,
      shortcut: "M",
      action: () => {
        toggleSound();
        onClose();
      }
    },
    {
      id: "theme-blue",
      title: "Theme Accent: Electric Blue (Default)",
      category: "Theme",
      icon: Palette,
      action: () => {
        setThemeAccent("blue");
        onClose();
      }
    },
    {
      id: "theme-cyan",
      title: "Theme Accent: Cyan Matrix",
      category: "Theme",
      icon: Palette,
      action: () => {
        setThemeAccent("cyan");
        onClose();
      }
    },
    {
      id: "theme-emerald",
      title: "Theme Accent: Cyber Emerald",
      category: "Theme",
      icon: Palette,
      action: () => {
        setThemeAccent("emerald");
        onClose();
      }
    },
    {
      id: "theme-purple",
      title: "Theme Accent: Quantum Violet",
      category: "Theme",
      icon: Palette,
      action: () => {
        setThemeAccent("purple");
        onClose();
      }
    }
  ];

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      }
    },
    [isOpen, onClose, filtered, selectedIndex]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            className="w-full max-w-xl bg-[#070b18] border border-brand-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, tool, or search section..."
                className="w-full bg-transparent text-sm text-white placeholder:text-muted-foreground focus:outline-none font-sans"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-md text-muted-foreground hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[340px] overflow-y-auto p-2 space-y-1">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No matching commands found for &quot;{query}&quot;
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = selectedIndex === idx;

                  return (
                    <div
                      key={item.id}
                      onClick={() => item.action()}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors text-xs",
                        isSelected
                          ? "bg-brand-600 text-white"
                          : "text-white/80 hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                            isSelected ? "bg-white/20 text-white" : "bg-white/5 text-muted-foreground"
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-medium block">{item.title}</span>
                          <span
                            className={cn(
                              "text-[10px] uppercase font-mono block",
                              isSelected ? "text-white/70" : "text-muted-foreground"
                            )}
                          >
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {item.shortcut && (
                        <kbd
                          className={cn(
                            "px-2 py-0.5 rounded font-mono text-[10px] border",
                            isSelected
                              ? "bg-white/20 border-white/30 text-white"
                              : "bg-white/5 border-white/10 text-muted-foreground"
                          )}
                        >
                          {item.shortcut}
                        </kbd>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Keyboard Guide */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-t border-white/5 text-[11px] text-muted-foreground font-mono">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              <div className="flex items-center gap-1">
                <Command className="w-3 h-3 text-brand-400" />
                <span>Command Menu</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
