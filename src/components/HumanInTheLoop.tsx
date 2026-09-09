"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { HitlCommandCenter } from "./HitlCommandCenter";

export function HumanInTheLoop() {
  return (
    <section id="human-control" className="py-24 relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center mb-16" data-ui>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            Safety & Control Architecture
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white"
          >
            You decide what AI can do automatically.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground"
          >
            Automation does not mean giving software unlimited control. You set the threshold for every action.
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all"
            data-ui
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" aria-hidden />
              <h3 className="text-xl font-bold text-white tracking-tight">Automatic</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Low risk and high confidence. The workflow can complete without stopping.
            </p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-black/40 border border-white/5 text-sm">
              <span className="text-brand-300">AI</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-white">Execute</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="glass-card p-8 rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all"
            data-ui
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" aria-hidden />
              <h3 className="text-xl font-bold text-white tracking-tight">Review</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Uncertain. A person glances at the draft before anything is sent or written back.
            </p>
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-black/40 border border-white/5 text-sm">
              <span className="text-brand-300">AI</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-white">Human review</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="glass-card p-8 rounded-2xl border border-white/10 hover:border-red-500/30 transition-all"
            data-ui
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" aria-hidden />
              <h3 className="text-xl font-bold text-white tracking-tight">Approval</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              High-risk action. Money, access, or irreversible changes wait for an explicit yes.
            </p>
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-black/40 border border-white/5 text-sm">
              <span className="text-brand-300">AI prepares</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-white">Human approval</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-white">Execute</span>
            </div>
          </motion.div>
        </div>

        {/* Interactive Command Station */}
        <HitlCommandCenter />
      </div>
    </section>
  );
}
