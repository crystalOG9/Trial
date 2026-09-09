"use client";

import { motion } from "framer-motion";
import { Building2, ShieldCheck, Link2, BarChart2, Check, X } from "lucide-react";

const REASONS = [
  {
    title: "Company-Specific",
    desc: "We build around your actual workflow, not a generalized template.",
    icon: Building2,
  },
  {
    title: "Human-Controlled",
    desc: "Important decisions and edge cases stay with your team.",
    icon: ShieldCheck,
  },
  {
    title: "Integrated",
    desc: "We work directly with the tools and systems you already use.",
    icon: Link2,
  },
  {
    title: "Measurable",
    desc: "We track time saved, errors reduced, and workflow performance.",
    icon: BarChart2,
  },
];

const COMPARISON = [
  {
    generic: "User asks AI questions",
    ours: "Workflow runs automatically",
  },
  {
    generic: "General purpose",
    ours: "Company-specific",
  },
  {
    generic: "Human does the workflow",
    ours: "AI handles repetitive steps",
  },
  {
    generic: "Limited context",
    ours: "Connected to business systems",
  },
  {
    generic: "One product for everyone",
    ours: "Workflow designed around the company",
  },
];

export function WhyUs() {
  return (
    <section id="why-us" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-900/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <div className="max-w-4xl mx-auto text-center mb-16" data-ui>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Why not just use <br className="hidden md:block" />
            <span className="text-muted-foreground">another AI tool?</span>
          </motion.h2>
        </div>

        {/* 4 Reasons */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20">
          {REASONS.map((reason, idx) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 rounded-2xl border border-white/5 hover:border-brand-500/30 transition-colors"
              data-ui
            >
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 text-brand-400">
                <reason.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{reason.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {reason.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl border border-white/10 overflow-hidden"
            data-ui
          >
            <div className="grid grid-cols-2 border-b border-white/10 bg-white/5">
              <div className="p-4 md:p-6 text-center md:text-left font-semibold text-muted-foreground">Generic AI Tool</div>
              <div className="p-4 md:p-6 text-center md:text-left font-bold text-brand-400 bg-brand-500/5">Our Approach</div>
            </div>
            
            <div className="divide-y divide-white/5">
              {COMPARISON.map((row, idx) => (
                <div key={idx} className="grid grid-cols-2 hover:bg-white/5 transition-colors">
                  <div className="p-4 md:p-6 text-sm md:text-base text-muted-foreground flex items-start md:items-center gap-3">
                    <X className="w-4 h-4 text-red-400/70 shrink-0 mt-0.5 md:mt-0" />
                    <span>{row.generic}</span>
                  </div>
                  <div className="p-4 md:p-6 text-sm md:text-base text-white font-medium bg-brand-500/5 flex items-start md:items-center gap-3">
                    <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5 md:mt-0" />
                    <span>{row.ours}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
