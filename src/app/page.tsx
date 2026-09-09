"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { CoreMessage } from "@/components/CoreMessage";
import { HowItWorks } from "@/components/HowItWorks";
import { WorkflowStudio } from "@/components/WorkflowStudio";
import { Solutions } from "@/components/Solutions";
import { Industries } from "@/components/Industries";
import { HumanInTheLoop } from "@/components/HumanInTheLoop";
import { ROI } from "@/components/ROI";
import { CustomerDiscovery } from "@/components/CustomerDiscovery";
import { WhyUs } from "@/components/WhyUs";
import { About } from "@/components/About";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { LiveSystemBar } from "@/components/LiveSystemBar";
import { CommandPalette } from "@/components/CommandPalette";

export default function Home() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <>
      <Navbar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
      <main className="relative z-10">
        <Hero />
        <ProblemSection />
        <CoreMessage />
        <HowItWorks />
        <WorkflowStudio />
        <Solutions />
        <Industries />
        <HumanInTheLoop />
        <ROI />
        <CustomerDiscovery />
        <WhyUs />
        <About />
        <CTA />
      </main>
      <Footer />

      {/* Persistent Floating Live Telemetry & Control Bar */}
      <LiveSystemBar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

      {/* Global Command Palette (Cmd+K / Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
}
