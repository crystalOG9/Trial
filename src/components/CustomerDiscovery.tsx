"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { WorkflowAssessmentWizard } from "./WorkflowAssessmentWizard";

const STEPS = ["Talk", "Observe", "Map", "Identify", "Automate", "Measure"];

export function CustomerDiscovery() {
  return (
    <section id="discovery" className="py-24 relative border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12" data-ui>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5 text-brand-400" />
            Discovery & Blueprinting
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white"
          >
            Show us the work your team repeats every day.
          </motion.h2>
          <p className="text-lg text-muted-foreground">
            Your employees already know where the friction is. We analyze and model it around your real operating procedures.
          </p>
        </div>

        {/* Discovery Methodology Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10" data-ui>
          {STEPS.map((step, idx) => (
            <div key={step} className="flex items-center gap-2 md:gap-3">
              <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs md:text-sm font-semibold text-white tracking-wide">
                {idx + 1}. {step}
              </span>
              {idx < STEPS.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-brand-400/70 hidden sm:block" />
              )}
            </div>
          ))}
        </div>

        {/* Interactive 3-Step Assessment Wizard */}
        <WorkflowAssessmentWizard />
      </div>
    </section>
  );
}
