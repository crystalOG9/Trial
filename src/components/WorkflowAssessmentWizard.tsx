"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Layers,
  Send,
  Calendar,
  Building,
  Clock,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/useSound";

const DEPARTMENTS = [
  { id: "support", label: "Customer Support & Triage", icon: "Headset", hoursRange: "15-40 hrs/wk" },
  { id: "finance", label: "Finance & Accounts Payable", icon: "DollarSign", hoursRange: "20-60 hrs/wk" },
  { id: "logistics", label: "Supply Chain & Order Ops", icon: "Truck", hoursRange: "25-80 hrs/wk" },
  { id: "salesops", label: "Sales Ops & Lead Enrichment", icon: "TrendingUp", hoursRange: "10-30 hrs/wk" },
  { id: "legal", label: "Legal & Contract Approvals", icon: "FileText", hoursRange: "15-35 hrs/wk" }
];

const BOTTLENECKS = [
  { id: "copy-paste", label: "Copying data between multiple tools / spreadsheets" },
  { id: "email-triage", label: "Reading & categorizing high volumes of incoming emails" },
  { id: "invoice-match", label: "Manually checking line items against invoices and POs" },
  { id: "refund-checks", label: "Validating policy rules before approving refunds or credits" },
  { id: "crm-updates", label: "Keeping CRM or ERP customer records clean and updated" }
];

const STACKS = [
  "Salesforce", "HubSpot", "Zendesk", "NetSuite", "SAP", "Slack", "Gmail / Outlook", "Stripe", "PostgreSQL"
];

export function WorkflowAssessmentWizard() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [department, setDepartment] = useState<string>("support");
  const [selectedBottlenecks, setSelectedBottlenecks] = useState<string[]>(["copy-paste", "email-triage"]);
  const [selectedStack, setSelectedStack] = useState<string[]>(["Zendesk", "Slack", "Gmail / Outlook"]);

  const { playClick, playSuccess } = useSound();

  const toggleBottleneck = (id: string) => {
    playClick(1000);
    setSelectedBottlenecks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const toggleStack = (name: string) => {
    playClick(1100);
    setSelectedStack((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const handleNext = () => {
    playClick(1300);
    if (step < 3) {
      setStep((step + 1) as 2 | 3);
    } else {
      setStep(4);
      playSuccess();
    }
  };

  const handleReset = () => {
    playClick(700);
    setStep(1);
  };

  return (
    <div className="glass-card rounded-2xl border border-white/10 p-6 md:p-8 max-w-4xl mx-auto my-8 relative overflow-hidden backdrop-blur-2xl">
      {/* Top Wizard Steps Tracker */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-brand-400" />
          <span className="text-xs font-mono uppercase tracking-wider text-white/80">
            Interactive Workflow Assessment
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
          <span className="text-brand-300 font-bold">Step {step}</span>
          <span>/ 4</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Department selection */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Which operational department has the highest repetitive friction?
              </h3>
              <p className="text-sm text-muted-foreground">
                Select the team where valuable people are spending their day doing computer work.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {DEPARTMENTS.map((dept) => (
                <div
                  key={dept.id}
                  onClick={() => {
                    playClick();
                    setDepartment(dept.id);
                  }}
                  className={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between",
                    department === dept.id
                      ? "bg-brand-950/60 border-brand-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                      : "bg-black/30 border-white/5 text-muted-foreground hover:border-white/20 hover:text-white"
                  )}
                >
                  <span className="text-sm font-semibold">{dept.label}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-brand-300">
                    {dept.hoursRange}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                <span>Continue to Bottlenecks</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Bottlenecks selection */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                What tasks consume the most manual hours?
              </h3>
              <p className="text-sm text-muted-foreground">
                Select all the steps that force your team to copy, verify, or re-type data.
              </p>
            </div>

            <div className="space-y-2.5">
              {BOTTLENECKS.map((b) => {
                const isSelected = selectedBottlenecks.includes(b.id);
                return (
                  <div
                    key={b.id}
                    onClick={() => toggleBottleneck(b.id)}
                    className={cn(
                      "p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between",
                      isSelected
                        ? "bg-brand-950/50 border-brand-500 text-white"
                        : "bg-black/30 border-white/5 text-muted-foreground hover:border-white/20 hover:text-white"
                    )}
                  >
                    <span className="text-sm font-medium">{b.label}</span>
                    <div
                      className={cn(
                        "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
                        isSelected
                          ? "bg-brand-500 border-brand-400 text-white"
                          : "border-white/20 bg-black/40"
                      )}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-muted-foreground hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={selectedBottlenecks.length === 0}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-50"
              >
                <span>Select Systems Stack</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Systems selection */}
        {step === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Which tools are part of this process today?
              </h3>
              <p className="text-sm text-muted-foreground">
                We plug directly into your current platforms — no migration necessary.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {STACKS.map((tool) => {
                const isSelected = selectedStack.includes(tool);
                return (
                  <button
                    key={tool}
                    onClick={() => toggleStack(tool)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs md:text-sm font-medium border transition-all flex items-center gap-2",
                      isSelected
                        ? "bg-brand-600 text-white border-brand-400 shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                        : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20 hover:text-white"
                    )}
                  >
                    <span>{tool}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-muted-foreground hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                <span>Generate Architecture Blueprint</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Customized Blueprint Output */}
        {step === 4 && (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-emerald-400 font-semibold block mb-1">
                  Custom Architecture Blueprint Generated
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  Automated Pipeline for {DEPARTMENTS.find((d) => d.id === department)?.label}
                </h3>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white border border-white/10 px-3 py-1.5 rounded-lg"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Start Over
              </button>
            </div>

            {/* Generated Capabilities Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[11px] text-muted-foreground block">Feasibility Rating</span>
                <span className="text-xl font-bold font-mono text-emerald-400">High / Viable</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[11px] text-muted-foreground block">Operational Upside</span>
                <span className="text-xl font-bold font-mono text-brand-300">High Impact</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[11px] text-muted-foreground block">Rollout Method</span>
                <span className="text-xl font-bold font-mono text-white">Iterative Pilot</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[11px] text-muted-foreground block">Supervision Mode</span>
                <span className="text-xl font-bold font-mono text-amber-300">Hybrid HITL</span>
              </div>
            </div>

            {/* Proposed Schematic */}
            <div className="p-4 rounded-xl bg-[#030612] border border-brand-500/20 space-y-3">
              <span className="text-xs font-mono uppercase text-muted-foreground block">
                Target Pipeline Flow:
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-white">
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  {selectedStack[0] || "Inbound Source"} Ingestion
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
                <span className="px-3 py-1.5 rounded-lg bg-brand-500/20 border border-brand-500/30 text-brand-300">
                  AI Entity & Policy Validation
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
                <span className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300">
                  Human Approval Gate
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                  {selectedStack[1] || "Target System"} Write
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                Your blueprint is saved for your consultation call.
              </span>
              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              >
                <span>Book Blueprint Review Call</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
