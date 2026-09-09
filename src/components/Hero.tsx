"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, Zap, Sparkles, Play, ShieldCheck, Activity } from "lucide-react";
import Link from "next/link";
import { useSound } from "@/lib/useSound";

export function Hero() {
  const { playClick, playPulse } = useSound();

  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center pt-24 pb-20 overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full lg:w-[62%] bg-gradient-to-r from-[#030712] via-[#030712]/88 to-transparent z-0" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            data-ui
          >
            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-brand-500/30 text-brand-300 text-xs md:text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
              </span>
              <span>Intelligent Business Automation &middot; Enterprise Grade</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white mb-6 leading-[1.08]">
              Your employees shouldn&apos;t spend their day doing work computers can handle.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
              We discover repetitive business workflows and build AI-powered automation around the way your company actually works — so your team can focus on decisions, customers, and high-leverage growth.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
              <Link
                href="#studio"
                onClick={() => playPulse()}
                className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Simulate Live Workflow</span>
              </Link>

              <Link
                href="#roi-calculator"
                onClick={() => playClick()}
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3.5 rounded-full text-sm font-medium transition-all hover:border-white/20"
              >
                <span>Calculate Your ROI</span>
                <ArrowRight className="w-4 h-4 text-brand-400" />
              </Link>
            </div>

            {/* Core Architectural Pillars */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 max-w-lg">
              <div className="flex flex-col">
                <span className="text-sm md:text-base font-semibold text-white">Deterministic</span>
                <span className="text-[11px] text-muted-foreground leading-tight">Schema-enforced rules</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm md:text-base font-semibold text-emerald-400">HITL Oversight</span>
                <span className="text-[11px] text-muted-foreground leading-tight">Human approval gates</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm md:text-base font-semibold text-brand-300">Non-Invasive</span>
                <span className="text-[11px] text-muted-foreground leading-tight">Zero tool replacement</span>
              </div>
            </div>

            <p className="mt-8 text-xs tracking-[0.2em] text-white/40 uppercase font-mono">
              Designed around how your team already operates
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
