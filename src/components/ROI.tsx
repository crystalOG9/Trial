"use client";

import { motion } from "framer-motion";
import { InteractiveROICalculator } from "./InteractiveROICalculator";

const METRICS = [
  { label: "Hours saved", hint: "Time returned to your team for strategic work" },
  { label: "Processing time", hint: "Minutes reduced to seconds end to end" },
  { label: "Error rate", hint: "Zero manual typos, routing, or paste mistakes" },
  { label: "Human control", hint: "Explicit supervisor gate on high-value actions" },
  { label: "Throughput", hint: "Scale volume effortlessly without linear hiring" },
];

export function ROI() {
  return (
    <section className="py-24 relative border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center mb-16" data-ui>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            The goal isn&apos;t more AI.{" "}
            <span className="text-brand-400">It&apos;s less wasted time.</span>
          </motion.h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Results depend on the workflow. We measure the real economic and operational impact of each implementation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto mb-16">
          {METRICS.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-all text-center group"
              data-ui
            >
              <div className="text-sm font-semibold tracking-wide text-white mb-2 group-hover:text-brand-300 transition-colors">
                {metric.label}
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">{metric.hint}</div>
            </motion.div>
          ))}
        </div>

        {/* Live Interactive ROI Calculator */}
        <InteractiveROICalculator />
      </div>
    </section>
  );
}
