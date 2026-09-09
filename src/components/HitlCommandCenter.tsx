"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  FileCheck,
  UserCheck,
  ArrowRight,
  RefreshCw,
  Clock,
  History,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/useSound";

interface HitlCase {
  id: string;
  category: "Finance" | "Legal" | "Operations";
  title: string;
  riskLevel: "low" | "medium" | "critical";
  confidenceScore: number;
  inquirySnippet: string;
  retrievedContext: string;
  proposedAction: string;
  systemCall: string;
  status: "pending" | "approved" | "rejected" | "modified";
}

const INITIAL_CASES: HitlCase[] = [
  {
    id: "CASE-4910",
    category: "Finance",
    title: "High-Value Refund Sign-off ($380.00)",
    riskLevel: "medium",
    confidenceScore: 0.81,
    inquirySnippet: "Customer received defective high-end monitor with dead pixels. Requesting full refund $380.",
    retrievedContext: "Order #8812 delivered 9 days ago (within 30-day window). Serial matches warehouse manifest.",
    proposedAction: "Issue $380 refund to original payment method and generate prepaid return label.",
    systemCall: "POST /v1/refunds { amount: 38000, reason: 'defective_panel', currency: 'usd' }",
    status: "pending"
  },
  {
    id: "CASE-4911",
    category: "Legal",
    title: "Vendor NDA Redline Indemnity Clause",
    riskLevel: "critical",
    confidenceScore: 0.74,
    inquirySnippet: "Vendor counsel struck Section 8.2 (Consequential Damages Limitation) and introduced mutual uncapped liability.",
    retrievedContext: "Company standard contracting playbook requires strict $1M cap on consequential damages without exception.",
    proposedAction: "Reject uncapped clause strikeout; counter with standard $1,000,000 mutual liability cap.",
    systemCall: "POST /legal/doc-counter { docId: 'NDA-VND-41', clause: '8.2', fallback: 'MUTUAL_1M_CAP' }",
    status: "pending"
  },
  {
    id: "CASE-4912",
    category: "Operations",
    title: "Expedited Freight Routing Authorization (+$450)",
    riskLevel: "low",
    confidenceScore: 0.89,
    inquirySnippet: "Rail freight interchange shutdown due to snowstorm. Priority client shipment needs emergency team-driver truck.",
    retrievedContext: "Client Tier: PLATINUM ENTERPRISE. Service Level Agreement guarantees 99.8% on-time delivery.",
    proposedAction: "Authorize $450 freight expedite surcharge to guarantee delivery by 09:00 AM tomorrow.",
    systemCall: "PUT /tms/shipments/SH-992 { mode: 'EXPEDITED_GROUND', surchargeAuthorized: 450 }",
    status: "pending"
  }
];

export function HitlCommandCenter() {
  const [cases, setCases] = useState<HitlCase[]>(INITIAL_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("CASE-4910");
  const [auditLog, setAuditLog] = useState<{ time: string; msg: string }[]>([
    { time: "17:30:12", msg: "System queued 3 high-value cases for supervisor verification." }
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { playClick, playSuccess, playPing } = useSound();
  const currentCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleApprove = () => {
    playSuccess();
    setCases((prev) =>
      prev.map((c) => (c.id === currentCase.id ? { ...c, status: "approved" } : c))
    );
    const logTime = new Date().toTimeString().split(" ")[0];
    setAuditLog((prev) => [
      { time: logTime, msg: `✓ APPROVED: ${currentCase.id} - ${currentCase.title}. Dispatched system call.` },
      ...prev
    ]);
    showToast(`✓ Case ${currentCase.id} successfully approved and executed.`);
  };

  const handleReject = () => {
    playClick(500);
    setCases((prev) =>
      prev.map((c) => (c.id === currentCase.id ? { ...c, status: "rejected" } : c))
    );
    const logTime = new Date().toTimeString().split(" ")[0];
    setAuditLog((prev) => [
      { time: logTime, msg: `✕ REJECTED: ${currentCase.id} - Escalated to Senior Executive Queue.` },
      ...prev
    ]);
    showToast(`✕ Case ${currentCase.id} rejected and escalated.`);
  };

  const handleReset = () => {
    playClick(1000);
    setCases(INITIAL_CASES);
    setAuditLog([
      { time: new Date().toTimeString().split(" ")[0], msg: "Supervisor queue refreshed with mock cases." }
    ]);
    showToast("Supervisor queue refreshed.");
  };

  return (
    <section id="hitl-command" className="py-24 relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12" data-ui>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <UserCheck className="w-3.5 h-3.5 text-brand-400" />
            Human-In-The-Loop Command Console
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            AI prepares. You hold the steering wheel.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Low-risk routine tasks execute instantly. Anything involving funds, liability, or ambiguous policies routes to this supervisor console for 1-click verification.
          </p>
        </div>

        {/* Command Center Card */}
        <div className="glass-card rounded-2xl border border-white/10 p-6 md:p-8 max-w-6xl mx-auto backdrop-blur-2xl bg-[#050815]/95">
          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
              <span className="text-sm font-semibold text-white tracking-wide">
                OPERATOR REVIEW QUEUE
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 font-mono">
                {cases.filter((c) => c.status === "pending").length} Pending Verification
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-muted-foreground hover:text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Queue
              </button>
            </div>
          </div>

          {/* Grid Layout: Case List on Left, Inspection Station on Right */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left: Case Selector */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-2">
                Pending Escalations:
              </span>
              {cases.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    playClick();
                    setSelectedCaseId(item.id);
                  }}
                  className={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer",
                    selectedCaseId === item.id
                      ? "bg-brand-950/40 border-brand-500/50 shadow-[0_0_15px_rgba(37,99,235,0.25)]"
                      : "bg-black/30 border-white/5 hover:border-white/20"
                  )}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono text-brand-300 font-semibold">{item.id}</span>
                    <span
                      className={cn(
                        "text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold",
                        item.riskLevel === "critical"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : item.riskLevel === "medium"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      )}
                    >
                      {item.riskLevel} Risk
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white leading-snug line-clamp-1 mb-1">
                    {item.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2 pt-2 border-t border-white/5">
                    <span>Conf: {(item.confidenceScore * 100).toFixed(0)}%</span>
                    <span
                      className={cn(
                        "font-mono capitalize font-medium",
                        item.status === "approved"
                          ? "text-emerald-400"
                          : item.status === "rejected"
                          ? "text-red-400"
                          : "text-amber-400"
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}

              {/* Live Audit Log */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-white/60 mb-2">
                  <History className="w-3.5 h-3.5 text-brand-400" />
                  <span>Audit Trail</span>
                </div>
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto text-[11px] font-mono text-muted-foreground pr-1">
                  {auditLog.map((log, idx) => (
                    <div key={idx} className="leading-tight">
                      <span className="text-white/30 mr-1.5">[{log.time}]</span>
                      <span className="text-white/80">{log.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Inspection & Decision Cockpit */}
            <div className="lg:col-span-8 bg-black/40 rounded-xl border border-white/10 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between pb-4 border-b border-white/5 mb-5">
                  <div>
                    <span className="text-xs font-mono text-brand-400 uppercase tracking-wider block">
                      Case Inspection · {currentCase.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{currentCase.title}</h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-muted-foreground block">Decision Gate</span>
                    <span
                      className={cn(
                        "text-xs font-mono font-bold uppercase",
                        currentCase.status === "approved"
                          ? "text-emerald-400"
                          : currentCase.status === "rejected"
                          ? "text-red-400"
                          : "text-amber-300"
                      )}
                    >
                      {currentCase.status === "pending" ? "Awaiting Operator" : currentCase.status}
                    </span>
                  </div>
                </div>

                {/* Diff Viewer Grid */}
                <div className="space-y-4">
                  {/* Step 1: Customer Input */}
                  <div className="p-3.5 rounded-lg bg-[#080d1e] border border-white/5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                      1. Inbound Request / Signal:
                    </span>
                    <p className="text-xs text-white/90 leading-relaxed font-sans">
                      &quot;{currentCase.inquirySnippet}&quot;
                    </p>
                  </div>

                  {/* Step 2: Retrieved Enterprise Context */}
                  <div className="p-3.5 rounded-lg bg-[#080d1e] border border-white/5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                      2. Verified ERP & Policy Context:
                    </span>
                    <p className="text-xs text-brand-200/90 leading-relaxed font-sans">
                      {currentCase.retrievedContext}
                    </p>
                  </div>

                  {/* Step 3: Prepared Action by AI */}
                  <div className="p-3.5 rounded-lg bg-[#0b1429] border border-brand-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-brand-300 font-semibold">
                        3. Prepared Action Draft:
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">Ready for 1-Click Execution</span>
                    </div>
                    <p className="text-xs text-white leading-relaxed font-sans font-medium mb-2">
                      {currentCase.proposedAction}
                    </p>
                    <div className="p-2 rounded bg-black/50 font-mono text-[11px] text-white/60 overflow-x-auto">
                      <code>{currentCase.systemCall}</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                  <span>Confidence: </span>
                  <span className="font-mono text-white font-bold">
                    {(currentCase.confidenceScore * 100).toFixed(0)}%
                  </span>
                  <span className="mx-2">·</span>
                  <span>Requires Supervisor Auth</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleReject}
                    disabled={currentCase.status !== "pending"}
                    className={cn(
                      "flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all",
                      currentCase.status !== "pending"
                        ? "opacity-50 cursor-not-allowed border-white/5 text-muted-foreground"
                        : "border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                    )}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject & Escalate
                  </button>

                  <button
                    onClick={handleApprove}
                    disabled={currentCase.status !== "pending"}
                    className={cn(
                      "flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-6 py-2 rounded-xl text-xs font-semibold transition-all",
                      currentCase.status !== "pending"
                        ? "opacity-50 cursor-not-allowed bg-white/10 text-muted-foreground"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-[1.02]"
                    )}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve & Dispatch
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed bottom-8 right-8 z-50 px-5 py-3 rounded-xl bg-brand-950 border border-brand-500/40 text-white text-xs font-mono shadow-2xl flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
