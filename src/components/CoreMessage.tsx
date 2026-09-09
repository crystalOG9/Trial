"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Users } from "lucide-react";

const AI_TASKS = [
  "Read",
  "Classify",
  "Extract",
  "Compare",
  "Organize",
  "Draft",
  "Route",
  "Update",
];

const HUMAN_TASKS = [
  "Decide",
  "Approve",
  "Solve",
  "Negotiate",
  "Create",
  "Lead",
  "Exceptions",
];

export function CoreMessage() {
  return (
    <section id="core-message" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20" data-ui>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6"
          >
            We don&apos;t replace people.{" "}
            <span className="text-brand-400">We remove the repetitive work around them.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground"
          >
            AI handles the predictable work. Humans handle judgment, relationships, and the exceptions that actually require a person.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-3xl border border-brand-500/20 relative"
            data-ui
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-4 text-brand-400">
                <BrainCircuit className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">AI handles</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {AI_TASKS.map((task) => (
                <div
                  key={task}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-muted-foreground font-medium text-sm"
                >
                  {task}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-3xl border border-white/15 relative"
            data-ui
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-white">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Humans handle</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {HUMAN_TASKS.map((task) => (
                <div
                  key={task}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/15 text-white/85 font-medium text-sm"
                >
                  {task}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
