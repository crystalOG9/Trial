"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="py-24 relative border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl" data-ui>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            About
          </motion.h2>
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
            <p>
              AUTOMATE is an early-stage company that builds workflow automation around how businesses already operate.
            </p>
            <p>
              We do not ship a generic assistant and hope it fits. We sit with the work — email, orders, documents, systems — and design automation that leaves people in control of decisions.
            </p>
            <p className="text-white/80">
              We don&apos;t replace people. We automate the repetitive work around them.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
