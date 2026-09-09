"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type DemoTab = {
  id: string;
  label: string;
  email: string;
  intent: string;
  system: { order?: string; status: string };
  response: string;
  result: string[];
};

const TABS: DemoTab[] = [
  {
    id: "delay",
    label: "Delivery delay",
    email: "My order #48291 hasn't arrived.",
    intent: "DELIVERY DELAY",
    system: { order: "#48291", status: "DELAYED" },
    response: "A status update is prepared with the current delay reason and revised arrival window.",
    result: ["Customer notified", "CRM updated", "Case logged"],
  },
  {
    id: "refund",
    label: "Refund request",
    email: "I'd like a refund for order #48291. The item doesn't match the listing.",
    intent: "REFUND REQUEST",
    system: { order: "#48291", status: "DELIVERED · POLICY ELIGIBLE" },
    response: "A refund draft is prepared with policy notes. High-risk money movement waits for approval.",
    result: ["Refund queued", "Human approval required", "Case logged"],
  },
  {
    id: "cancel",
    label: "Cancellation",
    email: "Please cancel order #48291 before it ships.",
    intent: "CANCELLATION",
    system: { order: "#48291", status: "PACKING · NOT SHIPPED" },
    response: "Cancellation is prepared against warehouse status. If already in transit, it routes as an exception.",
    result: ["Hold placed", "Warehouse notified", "Customer update drafted"],
  },
  {
    id: "enquiry",
    label: "General enquiry",
    email: "Do you ship to Scotland, and how long does it usually take?",
    intent: "GENERAL ENQUIRY",
    system: { status: "KNOWLEDGE BASE · SHIPPING MATRIX" },
    response: "A factual reply is drafted from shipping rules. No system write until the customer asks to order.",
    result: ["Reply drafted", "No CRM write", "Logged for review"],
  },
];

const STEPS = ["Customer email", "AI", "System", "AI", "Human", "Result"] as const;

export function AutomationDemo() {
  const [tab, setTab] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
    const id = window.setInterval(() => {
      setStep((prev) => (prev >= STEPS.length - 1 ? 0 : prev + 1));
    }, 1800);
    return () => window.clearInterval(id);
  }, [tab]);

  const current = TABS[tab];

  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-10" data-ui>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            See what automation looks like in practice.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Same operating pattern. Different workflow. Humans stay in control of anything uncertain or high-risk.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist" aria-label="Workflow examples" data-ui>
          {TABS.map((item, idx) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={tab === idx}
              onClick={() => setTab(idx)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border transition-colors min-h-11",
                tab === idx
                  ? "bg-brand-600 border-brand-500 text-white"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:text-white"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="max-w-5xl mx-auto glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row min-h-[480px]" data-ui>
          <ol className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 p-6 bg-black/20 space-y-2">
            {STEPS.map((label, idx) => {
              const active = step === idx;
              const past = step > idx;
              return (
                <li
                  key={`${label}-${idx}`}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border text-sm",
                    active ? "bg-brand-500/20 border-brand-500/30 text-brand-200" : "border-transparent text-white/70",
                    !active && !past && "opacity-40"
                  )}
                >
                  <span className="font-mono text-[11px] w-5 text-brand-400/80">{String(idx + 1).padStart(2, "0")}</span>
                  {label}
                </li>
              );
            })}
          </ol>

          <div className="flex-1 p-6 md:p-10 bg-[#0a0f1c]/80">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${tab}-${step}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="h-full flex flex-col justify-center"
              >
                {step === 0 && (
                  <div>
                    <p className="text-xs tracking-[0.18em] text-brand-400 mb-3">CUSTOMER EMAIL</p>
                    <p className="text-xl text-white/90 leading-relaxed">&ldquo;{current.email}&rdquo;</p>
                  </div>
                )}
                {step === 1 && (
                  <div>
                    <p className="text-xs tracking-[0.18em] text-brand-400 mb-3">AI</p>
                    <p className="text-muted-foreground mb-2">Intent</p>
                    <p className="text-2xl font-semibold tracking-tight text-white">{current.intent}</p>
                  </div>
                )}
                {step === 2 && (
                  <div>
                    <p className="text-xs tracking-[0.18em] text-brand-400 mb-3">SYSTEM</p>
                    {current.system.order && (
                      <p className="font-mono text-brand-300 mb-2">Order {current.system.order}</p>
                    )}
                    <p className="text-muted-foreground mb-1">Status</p>
                    <p className="text-xl text-white">{current.system.status}</p>
                  </div>
                )}
                {step === 3 && (
                  <div>
                    <p className="text-xs tracking-[0.18em] text-brand-400 mb-3">AI</p>
                    <p className="text-lg text-white/90 leading-relaxed">{current.response}</p>
                    <p className="mt-4 text-sm text-brand-300">Response prepared</p>
                  </div>
                )}
                {step === 4 && (
                  <div>
                    <p className="text-xs tracking-[0.18em] text-brand-400 mb-3">HUMAN</p>
                    <div className="flex flex-wrap gap-2">
                      {["Approve", "Edit", "Reject"].map((action) => (
                        <span
                          key={action}
                          className="px-4 py-2 rounded-full border border-white/15 text-sm text-white/90"
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {step === 5 && (
                  <div>
                    <p className="text-xs tracking-[0.18em] text-brand-400 mb-4">RESULT</p>
                    <div className="flex items-center gap-2 mb-4 text-white">
                      <CheckCircle2 className="w-5 h-5 text-brand-400" />
                      Workflow complete
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {current.result.map((item) => (
                        <span key={item} className="px-3 py-1.5 rounded bg-white/5 text-xs text-muted-foreground border border-white/10">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
