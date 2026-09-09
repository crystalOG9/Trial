"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bot,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Cpu,
  Database,
  ArrowRight,
  ShieldAlert,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/useSound";

interface PresetScenario {
  id: string;
  industry: string;
  title: string;
  inputText: string;
  intent: string;
  confidence: number;
  entities: { key: string; val: string; color: string }[];
  policyStatus: { pass: boolean; rule: string };
  requiresHumanReview: boolean;
  humanReason?: string;
  draftResponse: string;
  systemAction: { system: string; action: string; payload: Record<string, unknown> };
}

const SCENARIOS: PresetScenario[] = [
  {
    id: "ecommerce-damage",
    industry: "E-Commerce",
    title: "Damaged Delivery & Expedited Reorder",
    inputText:
      "Hello, I received package #91823 yesterday but the ceramic vase was shattered in transit. Can you ship a replacement before Friday?",
    intent: "DAMAGED_ITEM_REPLACEMENT",
    confidence: 0.982,
    entities: [
      { key: "Order", val: "#91823", color: "blue" },
      { key: "Item", val: "Ceramic Vase", color: "purple" },
      { key: "Issue", val: "Broken in transit", color: "red" },
      { key: "Deadline", val: "Friday (Expedited)", color: "amber" }
    ],
    policyStatus: {
      pass: true,
      rule: "Orders under $250 with damage photo metadata are eligible for instant zero-cost re-shipment."
    },
    requiresHumanReview: false,
    draftResponse:
      "We're so sorry to hear about your damaged ceramic vase! We have dispatched a priority replacement under tracking #1Z99824 with Next-Day Air at no extra charge.",
    systemAction: {
      system: "Shopify + ShipStation",
      action: "CREATE_EXPEDITED_ORDER",
      payload: { originalOrder: "#91823", sku: "VASE-CER-WHT", carrier: "UPS_NEXT_DAY_AIR", feeWaived: true }
    }
  },
  {
    id: "fintech-charge",
    industry: "FinTech & Banking",
    title: "Unrecognized Foreign Transaction",
    inputText:
      "I just saw an unauthorized charge of $1,420 from a hotel in Singapore on card ending 3021. I am currently in London. Please block this immediately.",
    intent: "FRAUD_DISPUTE_CARD_LOCK",
    confidence: 0.995,
    entities: [
      { key: "Amount", val: "$1,420.00", color: "red" },
      { key: "Location", val: "Singapore (Geo-Mismatch)", color: "purple" },
      { key: "Card", val: "•••• 3021", color: "blue" },
      { key: "User Location", val: "London, UK", color: "emerald" }
    ],
    policyStatus: {
      pass: true,
      rule: "Geo-velocity anomaly detected (London vs Singapore in <1 hour). High risk fraud threshold met."
    },
    requiresHumanReview: true,
    humanReason: "Card lock is automatic. Chargeback arbitration requires dispute officer signature.",
    draftResponse:
      "Your card ending 3021 has been immediately frozen for your protection. A dispute case #FP-88129 has been opened for the $1,420 transaction. A replacement card is being provisioned to your Apple Wallet.",
    systemAction: {
      system: "Core Banking Engine + Visa DSP",
      action: "EMERGENCY_CARD_FREEZE",
      payload: { cardLast4: "3021", riskScore: 99.4, disputeCase: "FP-88129", applePayDigitalCard: "ISSUED" }
    }
  },
  {
    id: "logistics-customs",
    industry: "Supply Chain",
    title: "Customs Clearance Delay & Commercial Invoice",
    inputText:
      "Container TGHU77189 is held at Rotterdam port awaiting HS code 8471.50 revision on the commercial invoice. Demurrage charges start in 18 hours.",
    intent: "CUSTOMS_DOCUMENTATION_EXCEPTION",
    confidence: 0.961,
    entities: [
      { key: "Container", val: "TGHU77189", color: "blue" },
      { key: "Port", val: "Rotterdam (NLRTM)", color: "purple" },
      { key: "HS Code", val: "8471.50 (Processing Units)", color: "emerald" },
      { key: "Urgency", val: "Demurrage in 18h", color: "red" }
    ],
    policyStatus: {
      pass: true,
      rule: "Customs clearance priority queue: Tariff classification revision automated if matched with Bill of Lading."
    },
    requiresHumanReview: true,
    humanReason: "Customs declarations legally bind the consignee; customs broker stamp required.",
    draftResponse:
      "Commercial invoice #INV-2026-89 has been updated with verified HS Code 8471.50 and transmitted to the Rotterdam Port Authority customs portal. Broker notification dispatched.",
    systemAction: {
      system: "CargoWise + Portbase EDI",
      action: "SUBMIT_AMENDED_CUSTOMS_DECLARATION",
      payload: { container: "TGHU77189", port: "NLRTM", tariffCode: "8471.50", demurrageRiskMinutes: 1080 }
    }
  },
  {
    id: "healthcare-prior-auth",
    industry: "Healthcare",
    title: "Urgent MRI Prior Authorization Triage",
    inputText:
      "Submitting urgent pre-authorization for lumbar spine MRI for patient DOB 1978-04-12. Patient failed 6 weeks of conservative physical therapy.",
    intent: "PRIOR_AUTHORIZATION_TRIAGE",
    confidence: 0.974,
    entities: [
      { key: "Procedure", val: "CPT 72148 (Lumbar MRI)", color: "purple" },
      { key: "Clinical History", val: "6 wks PT failed", color: "emerald" },
      { key: "Urgency", val: "Priority Clinical", color: "amber" }
    ],
    policyStatus: {
      pass: true,
      rule: "CMS & Payer Guidelines: Lumbar MRI criteria satisfied after 6 weeks documented conservative therapy."
    },
    requiresHumanReview: false,
    draftResponse:
      "Prior authorization #PA-99302 has been validated against clinical criteria guidelines and submitted via Electronic Health Record FHIR API with physical therapy clinical notes attached.",
    systemAction: {
      system: "Epic EHR + Availity Clearinghouse",
      action: "FHIR_PRIOR_AUTH_SUBMIT",
      payload: { cptCode: "72148", icd10: "M54.5", criteriaMet: true, authorizationNumber: "PA-99302" }
    }
  }
];

export function LiveIntentPlayground() {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [inputText, setInputText] = useState(SCENARIOS[0].inputText);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [activeTab, setActiveTab] = useState<"response" | "json" | "rules">("response");

  const { playClick, playPing, playSuccess } = useSound();
  const currentScenario = SCENARIOS[selectedScenarioIdx];

  const handleSelectScenario = (idx: number) => {
    playClick();
    setSelectedScenarioIdx(idx);
    setInputText(SCENARIOS[idx].inputText);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      playSuccess();
    }, 450);
  };

  const handleAnalyze = () => {
    playPing(900);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      playSuccess();
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentScenario.draftResponse);
    setCopiedResponse(true);
    playClick(1500);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  return (
    <section id="playground" className="py-24 relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12" data-ui>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Bot className="w-3.5 h-3.5 text-brand-400" />
            Live AI Intent & Extraction Playground
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Experience how the AI orchestrator parses real business intent.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Pick a cross-industry scenario or customize the input text to see live classification, entity extraction, and automated action drafting.
          </p>
        </div>

        {/* Industry Preset Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8" data-ui>
          {SCENARIOS.map((scen, idx) => (
            <button
              key={scen.id}
              onClick={() => handleSelectScenario(idx)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all border flex items-center gap-2",
                selectedScenarioIdx === idx
                  ? "bg-brand-600 text-white border-brand-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20 hover:text-white"
              )}
            >
              <span className="font-semibold">{scen.industry}:</span>
              <span className="opacity-90">{scen.title}</span>
            </button>
          ))}
        </div>

        {/* Interactive Sandbox Grid */}
        <div className="grid lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
          {/* Left Column: Input Prompt Editor */}
          <div className="lg:col-span-6 glass-card rounded-2xl border border-white/10 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-brand-400" />
                  Raw Inbound Request
                </span>
                <span className="text-[11px] text-white/40 font-mono">Editable sandbox</span>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={5}
                className="w-full bg-[#050812] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors font-sans leading-relaxed resize-none"
                placeholder="Type any incoming customer message or workflow trigger..."
              />

              {/* Extracted Entity Badges */}
              <div className="mt-5">
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block mb-2">
                  Parsed Entities & Context:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentScenario.entities.map((ent) => (
                    <span
                      key={ent.key}
                      className={cn(
                        "text-xs px-2.5 py-1 rounded-lg font-mono border flex items-center gap-1.5 transition-all",
                        ent.color === "blue"
                          ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
                          : ent.color === "purple"
                          ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                          : ent.color === "red"
                          ? "bg-red-500/10 border-red-500/30 text-red-300"
                          : ent.color === "amber"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                          : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      )}
                    >
                      <span className="opacity-60">{ent.key}:</span>
                      <span className="font-semibold">{ent.val}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Confidence:</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {(currentScenario.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
              >
                <Cpu className={cn("w-3.5 h-3.5", isProcessing && "animate-spin")} />
                {isProcessing ? "Analyzing..." : "Re-Analyze Intent"}
              </button>
            </div>
          </div>

          {/* Right Column: AI Reasoning & Action Dispatch */}
          <div className="lg:col-span-6 glass-card rounded-2xl border border-white/10 p-6 flex flex-col justify-between bg-[#040817]/90">
            <div>
              {/* Intent Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                    Classified Intent
                  </span>
                  <span className="text-sm font-bold font-mono text-brand-300">
                    {currentScenario.intent}
                  </span>
                </div>

                {currentScenario.requiresHumanReview ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Human Approval Gate</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Fully Automated Dispatch</span>
                  </div>
                )}
              </div>

              {/* Tabs for Response / Webhook / Policy */}
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                <button
                  onClick={() => {
                    playClick();
                    setActiveTab("response");
                  }}
                  className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
                    activeTab === "response" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
                  )}
                >
                  Generated Response Draft
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setActiveTab("json");
                  }}
                  className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
                    activeTab === "json" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
                  )}
                >
                  System Action Payload
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setActiveTab("rules");
                  }}
                  className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
                    activeTab === "rules" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
                  )}
                >
                  Policy Validation
                </button>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === "response" && (
                  <motion.div
                    key="response"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl bg-black/40 border border-white/5 relative"
                  >
                    <button
                      onClick={handleCopy}
                      className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                      title="Copy response"
                    >
                      {copiedResponse ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <p className="text-sm text-white/90 leading-relaxed pr-8 font-sans">
                      {currentScenario.draftResponse}
                    </p>
                  </motion.div>
                )}

                {activeTab === "json" && (
                  <motion.div
                    key="json"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl bg-[#02050f] border border-white/5 text-xs font-mono text-brand-300 overflow-x-auto max-h-[170px]"
                  >
                    <div className="text-[11px] text-white/50 mb-2">
                      Target: <span className="text-white font-bold">{currentScenario.systemAction.system}</span> · Method:{" "}
                      <span className="text-emerald-400">{currentScenario.systemAction.action}</span>
                    </div>
                    <pre>
                      <code>{JSON.stringify(currentScenario.systemAction.payload, null, 2)}</code>
                    </pre>
                  </motion.div>
                )}

                {activeTab === "rules" && (
                  <motion.div
                    key="rules"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-muted-foreground leading-relaxed space-y-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white block mb-0.5">Policy Check Passed</span>
                        <span>{currentScenario.policyStatus.rule}</span>
                      </div>
                    </div>

                    {currentScenario.requiresHumanReview && (
                      <div className="flex items-start gap-2.5 pt-2 border-t border-white/5 text-amber-300">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold block mb-0.5">Escalation Trigger:</span>
                          <span className="text-amber-200/90">{currentScenario.humanReason}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom target system indicator */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-brand-400" />
                <span>Connected System: {currentScenario.systemAction.system.split("+")[0]}</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">Payload verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
