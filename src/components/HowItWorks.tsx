"use client";

import { motion } from "framer-motion";
import { Search, Target, PenTool, Cpu, LineChart } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "Discover",
    desc: "Understand how the company actually works.",
    icon: Search,
  },
  {
    num: "02",
    title: "Identify",
    desc: "Find repetitive and expensive processes.",
    icon: Target,
  },
  {
    num: "03",
    title: "Design",
    desc: "Design automation around the existing workflow.",
    icon: PenTool,
  },
  {
    num: "04",
    title: "Automate",
    desc: "Connect AI, rules and business systems.",
    icon: Cpu,
  },
  {
    num: "05",
    title: "Optimize",
    desc: "Measure and improve.",
    icon: LineChart,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-16" data-ui>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            How we work
          </motion.h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            We do not start with a product. We start with the work your team already repeats.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-[45px] left-[5%] right-[5%] h-px bg-white/10 z-0" />
          <motion.div
            className="hidden lg:block absolute top-[45px] left-[5%] h-px bg-brand-500 z-0 origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-4 justify-between relative z-10">
            {STEPS.map((step, idx) => (
              <motion.div
                key={step.num}
                data-how-step={idx + 1}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.12 }}
                className="flex flex-row lg:flex-col items-start lg:items-center text-left lg:text-center gap-6 lg:gap-8 flex-1 group"
                data-ui
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full glass border border-white/10 flex items-center justify-center relative z-10 group-hover:border-brand-500 transition-colors bg-background">
                    <step.icon className="w-6 h-6 text-muted-foreground group-hover:text-brand-400 transition-colors" />
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className="lg:hidden absolute top-16 bottom-[-32px] left-1/2 -translate-x-1/2 w-px bg-white/10" />
                  )}
                </div>
                <div className="flex-1 pt-2 lg:pt-0">
                  <div className="text-brand-400 font-mono text-sm mb-2">{step.num}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-[250px] lg:mx-auto">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
