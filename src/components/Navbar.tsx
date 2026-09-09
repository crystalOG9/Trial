"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Command, Volume2, VolumeX, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/useSound";

const NAV_LINKS = [
  { name: "How it works", href: "#how-it-works" },
  { name: "Workflow Studio", href: "#studio", badge: "Live" },
  { name: "Solutions", href: "#solutions" },
  { name: "Industries", href: "#industries" },
  { name: "Human Control", href: "#human-control" },
  { name: "ROI Engine", href: "#roi-calculator" },
  { name: "Contact", href: "#contact" },
];

export function Navbar({ onOpenCommandPalette }: { onOpenCommandPalette?: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isMuted, toggleSound, playClick } = useSound();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b",
        isScrolled
          ? "bg-[#030712]/85 py-2.5 border-white/10 shadow-lg shadow-black/30 backdrop-blur-xl"
          : "bg-transparent py-4 border-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link
          href="#hero"
          onClick={() => playClick()}
          className="text-xl md:text-2xl font-bold tracking-tighter text-foreground flex items-center gap-2 group"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-brand-300 group-hover:to-brand-400 transition-all">
            AUTOMATE
          </span>
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => playClick()}
              className="text-[12.5px] font-medium tracking-wide uppercase text-muted-foreground hover:text-white transition-colors relative flex items-center gap-1.5"
            >
              <span>{link.name}</span>
              {link.badge && (
                <span className="text-[9px] font-mono lowercase tracking-normal px-1.5 py-0.2 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right Action Icons & CTA */}
        <div className="flex items-center gap-3">
          {/* Audio toggle button */}
          <button
            onClick={toggleSound}
            title={isMuted ? "Unmute sound effects" : "Mute sound effects"}
            className="p-2 rounded-full border border-white/10 text-muted-foreground hover:text-white hover:bg-white/5 transition-colors hidden sm:flex items-center justify-center"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-brand-400" />}
          </button>

          {/* Quick Command Palette Button */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              title="Open Command Palette (Cmd+K)"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:text-white hover:border-white/20 transition-all text-xs font-mono"
            >
              <Command className="w-3.5 h-3.5 text-brand-400" />
              <span>⌘K</span>
            </button>
          )}

          <Link
            href="#contact"
            onClick={() => playClick()}
            className="hidden md:flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            <span>Workflow assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            className="lg:hidden text-foreground p-2 min-h-11 min-w-11 inline-flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#030712]/96 border-b border-border/50 backdrop-blur-2xl">
          <nav className="flex flex-col p-4 space-y-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="py-2.5 px-4 text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center justify-between"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}

            <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between px-3">
              <button
                onClick={toggleSound}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-brand-400" />}
                <span>{isMuted ? "Audio Muted" : "Audio Active"}</span>
              </button>

              {onOpenCommandPalette && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenCommandPalette();
                  }}
                  className="flex items-center gap-1.5 text-xs text-brand-300 font-mono"
                >
                  <Command className="w-3.5 h-3.5" />
                  <span>Cmd+K</span>
                </button>
              )}
            </div>

            <Link
              href="#contact"
              className="mt-3 flex items-center justify-center gap-2 bg-brand-600 text-white px-5 py-3 rounded-xl text-sm font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>Workflow assessment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
