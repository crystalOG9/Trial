"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const TODAY_STEPS = [
  "Employee",
  "Open email",
  "Read",
  "Copy data",
  "Check system",
  "Categorize",
  "Update",
  "Reply",
  "Repeat",
];

const AUTOMATION_STEPS = [
  "Business input",
  "AI understanding",
  "Rules + validation",
  "System integration",
  "Human review",
  "Action",
];

export function ProblemSection() {
  return (
    <section id="problem" className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16" data-ui>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Businesses don&apos;t have an AI problem.{" "}
            <span className="text-muted-foreground">They have a workflow problem.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Employees spend hours every day on repetitive digital work: reading emails, copying data, sorting requests, updating systems, and moving information between tools. Necessary work — but not work people should be doing by hand.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-2xl border border-white/5 relative overflow-hidden"
            data-ui
          >
            <h3 className="text-sm font-semibold tracking-[0.2em] mb-8 text-white/60">
              MANUAL WORKFLOW
            </h3>
            <div className="flex flex-col gap-0">
              {TODAY_STEPS.map((step, idx) => (
                <div key={step} className="flex items-center gap-3 py-1.5">
                  <span
                    className={`text-sm md:text-base font-medium ${
                      step === "Repeat" ? "text-red-400/90" : "text-muted-foreground"
                    }`}
                  >
                    {step}
                  </span>
                  {idx < TODAY_STEPS.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-white/20 ml-auto" />
                  )}
                </div>
              ))}
            </div>
            <motion.div
              className="absolute left-0 top-20 w-[2px] h-8 bg-brand-400/70"
              animate={{ top: ["5.5rem", "22rem", "5.5rem"] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-2xl border border-brand-500/20 bg-brand-950/10 relative overflow-hidden"
            data-ui
          >
            <h3 className="text-sm font-semibold tracking-[0.2em] mb-8 text-brand-300">
              AUTOMATED WORKFLOW
            </h3>
            <div className="space-y-1">
              {AUTOMATION_STEPS.map((step, idx) => (
                <div key={step} className="flex items-center gap-3 py-2">
                  <span className="font-mono text-[11px] text-brand-400/70 w-6">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm md:text-base font-medium text-white">{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
