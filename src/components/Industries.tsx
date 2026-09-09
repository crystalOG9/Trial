"use client";

import { motion } from "framer-motion";

const INDUSTRIES = [
  "E-commerce",
  "Logistics",
  "Manufacturing",
  "Accounting",
  "Real Estate",
  "Customer Support",
  "Education",
  "Professional Services",
];

export function Industries() {
  return (
    <section id="industries" className="py-24 relative border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="max-w-4xl mx-auto text-center mb-16" data-ui>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Built around your workflow.{" "}
            <span className="text-muted-foreground">Not a template.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-brand-300 font-medium"
          >
            We don&apos;t assume every company works the same way.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {INDUSTRIES.map((industry, idx) => (
            <motion.div
              key={industry}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="px-6 py-3 rounded-xl glass-card border border-white/10 hover:border-brand-500/50 hover:bg-white/5 transition-all text-white font-medium"
              data-ui
            >
              {industry}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
