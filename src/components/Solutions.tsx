"use client";

import { motion } from "framer-motion";
import { Mail, FileText, Headset, ShoppingCart, Database, TrendingUp, BarChart, Settings2 } from "lucide-react";
import Link from "next/link";

const SOLUTIONS = [
  {
    icon: Mail,
    title: "Email operations",
    desc: "Understand, classify and route incoming emails based on intent and content.",
  },
  {
    icon: FileText,
    title: "Document processing",
    desc: "Extract structured information from invoices, PDFs, forms and unstructured files.",
  },
  {
    icon: ShoppingCart,
    title: "Order operations",
    desc: "Categorize orders, handle delays, process refund requests, and manage cancellations.",
  },
  {
    icon: Headset,
    title: "Customer support",
    desc: "Classify requests, retrieve context from your systems, and prepare accurate responses.",
  },
  {
    icon: Database,
    title: "Data operations",
    desc: "Move information reliably between spreadsheets, databases, CRMs and ERP systems.",
  },
  {
    icon: TrendingUp,
    title: "Sales operations",
    desc: "Qualify inbound leads, assign owners, and automate repetitive follow-ups.",
  },
  {
    icon: BarChart,
    title: "Reporting",
    desc: "Collect information across platforms and generate recurring operational reports.",
  },
];

export function Solutions() {
  return (
    <section id="solutions" className="py-24 relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-16" data-ui>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            We automate the work unique to <span className="text-brand-400">your business.</span>
          </motion.h2>
          <p className="text-muted-foreground text-lg">
            These are starting points — not a catalog of one-size-fits-all products.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SOLUTIONS.map((sol, idx) => (
            <motion.div
              key={sol.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 group"
              data-ui
            >
              <sol.icon className="w-7 h-7 text-muted-foreground group-hover:text-brand-400 transition-colors mb-6" />
              <h3 className="text-lg font-semibold text-white mb-3">{sol.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{sol.desc}</p>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 lg:col-span-4 glass-card p-8 rounded-2xl border border-brand-500/40 bg-brand-900/10 relative overflow-hidden"
            data-ui
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[80px] rounded-full" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-xl bg-brand-500/20 text-brand-400">
                  <Settings2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Custom workflows</h3>
                  <p className="text-white/80 max-w-xl font-medium mb-2">
                    Your workflow doesn&apos;t fit a template. Neither should your automation.
                  </p>
                  <p className="text-muted-foreground max-w-xl">
                    If the process is unique to your company, we design around it — including the systems you already use.
                  </p>
                </div>
              </div>
              <Link
                href="#contact"
                className="px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors whitespace-nowrap"
              >
                Discuss your workflow
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
