"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Zap,
  Terminal,
  Server,
  Layers,
  Sparkles,
  Info,
  Clock,
  Send,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/useSound";

interface WorkflowNode {
  id: string;
  name: string;
  category: "trigger" | "ai" | "rules" | "integration" | "human";
  iconName: string;
  description: string;
  status: "idle" | "processing" | "success" | "review";
  durationMs: number;
  payloadSnippet: string;
}

interface WorkflowPreset {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  nodes: WorkflowNode[];
}

const PRESETS: WorkflowPreset[] = [
  {
    id: "ecommerce-refund",
    title: "Order Exception & Refund",
    subtitle: "Triage inbound customer requests, verify return policy against warehouse, queue approval.",
    tag: "E-Commerce",
    nodes: [
      {
        id: "trig-1",
        name: "Inbound Email Trigger",
        category: "trigger",
        iconName: "Send",
        description: "Customer ticket arrives via Zendesk or email inbox.",
        status: "idle",
        durationMs: 35,
        payloadSnippet: '{"ticketId": "TK-8492", "channel": "email", "sentiment": "frustrated"}'
      },
      {
        id: "ai-1",
        name: "Intent & Entity Extractor",
        category: "ai",
        iconName: "Sparkles",
        description: "Classifies 'REFUND_REQUEST' and extracts Order #84920 and SKU.",
        status: "idle",
        durationMs: 140,
        payloadSnippet: '{"intent": "REFUND_REQUEST", "orderId": "#84920", "confidence": 0.94}'
      },
      {
        id: "rules-1",
        name: "Policy & ERP Validator",
        category: "rules",
        iconName: "Layers",
        description: "Checks 30-day return window and warehouse tracking status.",
        status: "idle",
        durationMs: 85,
        payloadSnippet: '{"deliveryDays": 12, "eligible": true, "maxAutoRefund": 100, "amount": 185}'
      },
      {
        id: "human-1",
        name: "Manager Approval Gate",
        category: "human",
        iconName: "ShieldCheck",
        description: "Amounts > $100 require one-click human verification before payment dispatch.",
        status: "idle",
        durationMs: 120,
        payloadSnippet: '{"gate": "HOLD_FOR_APPROVAL", "reason": "Amount ($185) > Threshold ($100)"}'
      },
      {
        id: "integ-1",
        name: "Stripe & CRM Dispatch",
        category: "integration",
        iconName: "Server",
        description: "Emits refund API call and updates customer record in HubSpot.",
        status: "idle",
        durationMs: 60,
        payloadSnippet: '{"stripeStatus": "READY", "hubspotNote": "Refund approved and queued"}'
      }
    ]
  },
  {
    id: "invoice-matching",
    title: "AP Invoice 3-Way Match",
    subtitle: "Parse incoming vendor invoices, match lines against PO in NetSuite, flag discrepancies.",
    tag: "Finance",
    nodes: [
      {
        id: "trig-2",
        name: "PDF Invoice Ingestion",
        category: "trigger",
        iconName: "Send",
        description: "Vendor sends PDF attachment to invoices@company.com.",
        status: "idle",
        durationMs: 40,
        payloadSnippet: '{"vendor": "Acme Industrial", "file": "inv_9041.pdf", "sizeKb": 420}'
      },
      {
        id: "ai-2",
        name: "Vision OCR & Table Parser",
        category: "ai",
        iconName: "Sparkles",
        description: "Extracts line items, tax IDs, payment terms, and remit address.",
        status: "idle",
        durationMs: 180,
        payloadSnippet: '{"total": 14250.00, "lines": 4, "taxId": "XX-XXXXX", "poRef": "PO-10992"}'
      },
      {
        id: "rules-2",
        name: "3-Way NetSuite Reconciliation",
        category: "rules",
        iconName: "Layers",
        description: "Compares unit costs with PO #10992 and warehouse goods receipt.",
        status: "idle",
        durationMs: 95,
        payloadSnippet: '{"matchStatus": "TOLERANCE_MET", "priceVariance": "0.00%", "receivedQty": 500}'
      },
      {
        id: "human-2",
        name: "Controller Sign-off",
        category: "human",
        iconName: "ShieldCheck",
        description: "Batched approval preview with auto-calculated discounts.",
        status: "idle",
        durationMs: 110,
        payloadSnippet: '{"approvalLevel": "L2_CONTROLLER", "quickApprove": true}'
      },
      {
        id: "integ-2",
        name: "ERP Bill Created & Scheduled",
        category: "integration",
        iconName: "Server",
        description: "Creates vendor bill in NetSuite & schedules ACH for discount window.",
        status: "idle",
        durationMs: 70,
        payloadSnippet: '{"billId": "BILL-44019", "net30": "2026-10-09", "discount": "$285.00 saved"}'
      }
    ]
  },
  {
    id: "logistics-reroute",
    title: "Supply Chain Exception Router",
    subtitle: "Detect port and weather delays, calculate alternative freight routes, notify consignee.",
    tag: "Logistics",
    nodes: [
      {
        id: "trig-3",
        name: "EDI Delay Webhook",
        category: "trigger",
        iconName: "Send",
        description: "Carrier pushes 48-hour port congestion delay code #EDI315.",
        status: "idle",
        durationMs: 30,
        payloadSnippet: '{"container": "MSKU90123", "vessel": "EverGiven", "delayHours": 48}'
      },
      {
        id: "ai-3",
        name: "Impact & SLA Evaluator",
        category: "ai",
        iconName: "Sparkles",
        description: "Assesses perishable cargo risk and contract penalty windows.",
        status: "idle",
        durationMs: 160,
        payloadSnippet: '{"cargoType": "ColdChain_Pharma", "penaltyThreshold": 36, "risk": "CRITICAL"}'
      },
      {
        id: "rules-3",
        name: "Intermodal Route Optimizer",
        category: "rules",
        iconName: "Layers",
        description: "Queries rail vs team-driver expedited trucking options.",
        status: "idle",
        durationMs: 110,
        payloadSnippet: '{"recommendation": "EXPEDITED_GROUND", "deltaHours": -32, "costDelta": "$420"}'
      },
      {
        id: "human-3",
        name: "Dispatcher Authorize",
        category: "human",
        iconName: "ShieldCheck",
        description: "Dispatcher confirms reroute authorization with 1-click on mobile.",
        status: "idle",
        durationMs: 90,
        payloadSnippet: '{"dispatcherApproved": true, "overrideReason": "Prevent cold chain breach"}'
      },
      {
        id: "integ-3",
        name: "TMS & Client Notification",
        category: "integration",
        iconName: "Server",
        description: "Dispatches revised Bill of Lading and informs pharmaceutical recipient.",
        status: "idle",
        durationMs: 65,
        payloadSnippet: '{"tmsUpdated": true, "smsSent": true, "revisedEta": "2026-09-11 08:30"}'
      }
    ]
  }
];

export function WorkflowStudio() {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [activeNodeDetails, setActiveNodeDetails] = useState<WorkflowNode | null>(null);
  const [logs, setLogs] = useState<{ time: string; msg: string; type: "info" | "success" | "warn" }[]>([]);
  const [threshold, setThreshold] = useState(85);
  const [autoApproveLowRisk, setAutoApproveLowRisk] = useState(true);

  const { playClick, playPing, playSuccess, playPulse } = useSound();
  const activePreset = PRESETS[selectedPreset];

  // Auto initialize selected node
  useEffect(() => {
    setActiveNodeDetails(activePreset.nodes[0]);
    setLogs([
      { time: "00:00.00", msg: `Initialized workflow: ${activePreset.title}`, type: "info" },
      { time: "00:00.01", msg: "Pipeline standing by. Ready for live simulation.", type: "info" }
    ]);
    setActiveStepIndex(-1);
    setIsRunning(false);
  }, [selectedPreset, activePreset]);

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStepIndex(0);
    playPulse();

    const newLogs = [
      { time: "00:00.00", msg: `▶ Triggering execution simulation for [${activePreset.title}]`, type: "info" as const }
    ];
    setLogs(newLogs);

    const nodes = activePreset.nodes;
    let delay = 0;

    nodes.forEach((node, idx) => {
      // Step activation
      setTimeout(() => {
        setActiveStepIndex(idx);
        setActiveNodeDetails(node);
        playClick(1000 + idx * 200);

        setLogs((prev) => [
          ...prev,
          {
            time: `+${((idx + 1) * 0.45).toFixed(2)}s`,
            msg: `[Node ${idx + 1}: ${node.name}] Processing... (${node.durationMs}ms)`,
            type: "info"
          }
        ]);
      }, delay);

      delay += 850;

      // Step completion
      setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          {
            time: `+${((idx + 1) * 0.45 + 0.3).toFixed(2)}s`,
            msg: `✓ [Node ${idx + 1}] Completed. Payload: ${node.payloadSnippet.slice(0, 48)}...`,
            type: node.category === "human" ? "warn" : "success"
          }
        ]);
      }, delay - 200);
    });

    // Final finish
    setTimeout(() => {
      setIsRunning(false);
      setActiveStepIndex(-1);
      playSuccess();
      setLogs((prev) => [
        ...prev,
        {
          time: `+${(nodes.length * 0.85).toFixed(2)}s`,
          msg: `★ Full Pipeline executed in ${(nodes.length * 0.85).toFixed(2)}s. Status: COMPLETED.`,
          type: "success"
        }
      ]);
    }, delay + 400);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setActiveStepIndex(-1);
    setActiveNodeDetails(activePreset.nodes[0]);
    playClick(700);
    setLogs([
      { time: "00:00.00", msg: "Simulation state reset. Awaiting trigger.", type: "info" }
    ]);
  };

  return (
    <section id="studio" className="py-24 relative overflow-hidden border-t border-white/5">
      {/* Background glow ambiance */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-brand-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12" data-ui>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            Interactive Workflow Studio
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Test and visualize an automated pipeline in real time.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            See data move across AI reasoning, database policy rules, human checkpoints, and enterprise systems.
          </p>
        </div>

        {/* Preset Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8" data-ui>
          {PRESETS.map((preset, idx) => (
            <button
              key={preset.id}
              onClick={() => {
                playClick();
                setSelectedPreset(idx);
              }}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 border",
                selectedPreset === idx
                  ? "bg-brand-600 text-white border-brand-400 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                  : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20 hover:text-white"
              )}
            >
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-brand-300">
                {preset.tag}
              </span>
              <span>{preset.title}</span>
            </button>
          ))}
        </div>

        {/* Studio Interactive Stage */}
        <div className="glass-card rounded-2xl border border-white/10 p-6 md:p-8 relative overflow-hidden backdrop-blur-2xl">
          {/* Top Control Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-white tracking-tight">{activePreset.title}</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Live Sim Active
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">{activePreset.subtitle}</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={runSimulation}
                disabled={isRunning}
                className={cn(
                  "flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all",
                  isRunning
                    ? "bg-brand-500/40 text-white/50 cursor-not-allowed"
                    : "bg-brand-600 hover:bg-brand-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-[1.02]"
                )}
              >
                <Play className={cn("w-4 h-4 fill-white", isRunning && "animate-pulse")} />
                {isRunning ? "Simulating..." : "Run Simulation"}
              </button>

              <button
                onClick={resetSimulation}
                disabled={isRunning}
                title="Reset simulation"
                className="p-2.5 rounded-xl border border-white/10 text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Visual Node Graph Pipeline */}
          <div className="relative py-6 px-2 overflow-x-auto">
            <div className="min-w-[760px] flex items-center justify-between relative">
              {/* Connecting Background Line with animated pulse */}
              <div className="absolute left-[5%] right-[5%] top-1/2 -translate-y-1/2 h-[2px] bg-white/10 z-0">
                {isRunning && activeStepIndex >= 0 && (
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-500 via-brand-300 to-emerald-400"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((activeStepIndex + 1) / activePreset.nodes.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                )}
              </div>

              {/* Workflow Nodes */}
              {activePreset.nodes.map((node, idx) => {
                const isActive = activeStepIndex === idx;
                const isPast = activeStepIndex > idx || (!isRunning && activeStepIndex === -1 && logs.length > 3);
                const isSelected = activeNodeDetails?.id === node.id;

                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      playClick(1400);
                      setActiveNodeDetails(node);
                    }}
                    className={cn(
                      "relative z-10 flex flex-col items-center cursor-pointer transition-all duration-300 group",
                      isSelected && "scale-105"
                    )}
                  >
                    {/* Node Circle */}
                    <div
                      className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-xl",
                        isActive
                          ? "bg-brand-600 border-brand-300 text-white shadow-[0_0_30px_rgba(59,130,246,0.8)] scale-110 ring-4 ring-brand-500/20"
                          : isPast
                          ? "bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                          : "bg-[#090e1a] border-white/10 text-muted-foreground hover:border-brand-500/50 hover:text-white"
                      )}
                    >
                      {isPast ? (
                        <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                      ) : node.category === "trigger" ? (
                        <Send className="w-6 h-6" />
                      ) : node.category === "ai" ? (
                        <Sparkles className="w-6 h-6" />
                      ) : node.category === "rules" ? (
                        <Layers className="w-6 h-6" />
                      ) : node.category === "human" ? (
                        <ShieldCheck className="w-6 h-6" />
                      ) : (
                        <Server className="w-6 h-6" />
                      )}
                    </div>

                    {/* Step label */}
                    <div className="mt-3 text-center max-w-[130px]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                        Step {idx + 1} · {node.category}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-semibold leading-snug transition-colors line-clamp-1 block mt-0.5",
                          isSelected ? "text-brand-300" : "text-white/80 group-hover:text-white"
                        )}
                      >
                        {node.name}
                      </span>
                    </div>

                    {/* Active pulse ring */}
                    {isActive && (
                      <motion.div
                        className="absolute -top-1 -left-1 -right-1 -bottom-1 rounded-2xl border-2 border-brand-400"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.9, 0, 0.9] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Inspector & Terminal Console Grid */}
          <div className="grid lg:grid-cols-12 gap-6 mt-8 pt-8 border-t border-white/10">
            {/* Left: Node Inspector */}
            <div className="lg:col-span-5 bg-black/40 rounded-xl p-5 border border-white/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-brand-400" />
                    <h4 className="text-xs font-mono uppercase tracking-wider text-white/70">
                      Node Inspector
                    </h4>
                  </div>
                  {activeNodeDetails && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
                      {activeNodeDetails.category.toUpperCase()}
                    </span>
                  )}
                </div>

                {activeNodeDetails ? (
                  <div className="space-y-3">
                    <div>
                      <div className="text-base font-bold text-white">{activeNodeDetails.name}</div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {activeNodeDetails.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-white/60 py-2 border-y border-white/5">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Latency: {activeNodeDetails.durationMs}ms</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Async Webhook</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-mono text-muted-foreground uppercase block mb-1">
                        Node Payload Schema:
                      </span>
                      <pre className="p-3 rounded-lg bg-[#050811] text-[11px] font-mono text-brand-200 overflow-x-auto border border-white/5">
                        <code>{JSON.stringify(JSON.parse(activeNodeDetails.payloadSnippet), null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Select a node above to inspect its parameters.</p>
                )}
              </div>

              {/* Human Gate threshold slider */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-white/80 font-medium">Confidence Escalation Gate:</span>
                  <span className="font-mono text-brand-300 font-bold">{threshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={threshold}
                  onChange={(e) => {
                    playClick(800);
                    setThreshold(Number(e.target.value));
                  }}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <span className="text-[10px] text-muted-foreground block mt-1">
                  Actions below {threshold}% confidence route to human operator.
                </span>
              </div>
            </div>

            {/* Right: Live Telemetry Terminal */}
            <div className="lg:col-span-7 bg-[#02050e] rounded-xl border border-white/10 p-5 flex flex-col font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-white/80 font-semibold">Live Pipeline Execution Log</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground uppercase">Socket: Connected</span>
                </div>
              </div>

              <div className="flex-1 min-h-[220px] max-h-[260px] overflow-y-auto space-y-1.5 pr-2 select-text">
                {logs.map((log, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-start gap-2.5 leading-relaxed py-0.5",
                      log.type === "success"
                        ? "text-emerald-400"
                        : log.type === "warn"
                        ? "text-amber-300"
                        : "text-white/70"
                    )}
                  >
                    <span className="text-white/30 shrink-0 select-none">{log.time}</span>
                    <span className="break-all">{log.msg}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 mt-auto border-t border-white/5 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Buffer: {logs.length} events logged</span>
                <span className="text-brand-300">Ready for automated dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
