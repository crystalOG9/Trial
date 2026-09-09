"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Search,
  ExternalLink,
  CheckCircle2,
  Activity,
  Zap,
  Lock,
  ArrowRight,
  Database,
  Server,
  Cloud,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/useSound";

interface IntegrationItem {
  id: string;
  name: string;
  category: "crm" | "erp" | "comm" | "cloud" | "ai";
  description: string;
  latencyMs: number;
  syncType: "Real-Time Webhook" | "Bidirectional Sync" | "Event Polling";
  sampleTrigger: string;
  sampleAction: string;
  payload: Record<string, unknown>;
}

const INTEGRATIONS: IntegrationItem[] = [
  {
    id: "salesforce",
    name: "Salesforce CRM",
    category: "crm",
    description: "Sync leads, accounts, cases, and opportunity stages automatically.",
    latencyMs: 18,
    syncType: "Bidirectional Sync",
    sampleTrigger: "Opportunity Status -> Closed Won",
    sampleAction: "Provision Tenant + Create Slack Channel",
    payload: { object: "Opportunity", stage: "Closed Won", amount: 48000, accountId: "0015g00000abcde" }
  },
  {
    id: "sap",
    name: "SAP S/4HANA",
    category: "erp",
    description: "Enterprise ERP bridge for purchase orders, inventory holds, and billing.",
    latencyMs: 32,
    syncType: "Real-Time Webhook",
    sampleTrigger: "Goods Receipt Discrepancy",
    sampleAction: "Hold Payment Voucher + Alert Buyer",
    payload: { sapPlant: "1000", matDoc: "50001928", vendorId: "V-9912", toleranceBreach: true }
  },
  {
    id: "netsuite",
    name: "Oracle NetSuite",
    category: "erp",
    description: "General ledger postings, 3-way invoice matching, and multi-subsidiary consolidation.",
    latencyMs: 25,
    syncType: "Real-Time Webhook",
    sampleTrigger: "Vendor Bill Uploaded",
    sampleAction: "Reconcile Against PO Line Items",
    payload: { billId: "BILL-2026-9", subsidiary: "US_EAST", status: "PENDING_MATCH" }
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "crm",
    description: "Enrich contact timelines, log customer communications, and score buyer intent.",
    latencyMs: 15,
    syncType: "Bidirectional Sync",
    sampleTrigger: "Contact Form Submitted",
    sampleAction: "AI Company Enrichment + Slack Notification",
    payload: { email: "vp@enterprise.com", domain: "enterprise.com", employees: 450 }
  },
  {
    id: "slack",
    name: "Slack Enterprise",
    category: "comm",
    description: "Interactive incident rooms, human approval button cards, and daily telemetry digests.",
    latencyMs: 12,
    syncType: "Real-Time Webhook",
    sampleTrigger: "Supervisor Approval Button Clicked",
    sampleAction: "Trigger Downstream Payment Webhook",
    payload: { channel: "#ops-approvals", actionUser: "u_sarah", decision: "APPROVED" }
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    category: "comm",
    description: "Adaptive Cards for corporate approvals, notifications, and incident escalations.",
    latencyMs: 20,
    syncType: "Real-Time Webhook",
    sampleTrigger: "Adaptive Card Action Submit",
    sampleAction: "Execute ERP Provisioning Job",
    payload: { teamId: "corp-exec", user: "exec@corp.com", response: "ACCEPT" }
  },
  {
    id: "zendesk",
    name: "Zendesk",
    category: "crm",
    description: "Classify incoming tickets, extract sentiment, and auto-draft customer responses.",
    latencyMs: 16,
    syncType: "Bidirectional Sync",
    sampleTrigger: "New Ticket Received",
    sampleAction: "Draft Solution with System Context",
    payload: { ticketId: 10492, priority: "urgent", requester: "client@acme.com" }
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "erp",
    description: "Trigger dispute workflows, automate refunds with policy gates, and sync invoices.",
    latencyMs: 14,
    syncType: "Real-Time Webhook",
    sampleTrigger: "charge.dispute.created",
    sampleAction: "Compile Evidence Dossier for Bank",
    payload: { disputeId: "dp_192841", reason: "fraudulent", amount: 28900 }
  },
  {
    id: "snowflake",
    name: "Snowflake Data Cloud",
    category: "cloud",
    description: "Stream operational telemetry into analytics warehouses with zero-copy replication.",
    latencyMs: 40,
    syncType: "Event Polling",
    sampleTrigger: "Daily Anomaly Query Result",
    sampleAction: "Trigger Operations Investigation Pipeline",
    payload: { warehouse: "COMPUTE_WH", queryId: "01a4b9c", anomalyDetected: true }
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    category: "cloud",
    description: "Direct transactional reads and writes with connection pooling and SSL encryption.",
    latencyMs: 9,
    syncType: "Real-Time Webhook",
    sampleTrigger: "Row Insert in audit_events",
    sampleAction: "Trigger Compliance Verification Bot",
    payload: { table: "audit_events", recordId: 88401, latency: "9ms" }
  },
  {
    id: "claude",
    name: "Claude 3.5 Sonnet",
    category: "ai",
    description: "Deep reasoning, complex document analysis, and human-like customer draft generation.",
    latencyMs: 280,
    syncType: "Real-Time Webhook",
    sampleTrigger: "Unstructured Contract PDF Ingested",
    sampleAction: "Extract Risk Clauses & Redline Draft",
    payload: { model: "claude-3-5-sonnet", tokens: 1840, reasoningScore: 99.2 }
  },
  {
    id: "gpt4o",
    name: "OpenAI GPT-4o",
    category: "ai",
    description: "Multi-modal vision OCR, structured schema output, and fast intent routing.",
    latencyMs: 240,
    syncType: "Real-Time Webhook",
    sampleTrigger: "Receipt Photo Uploaded",
    sampleAction: "Parse Line Items with JSON Schema",
    payload: { model: "gpt-4o", format: "json_schema", matchRate: "100%" }
  }
];

const CATEGORIES = [
  { id: "all", label: "All Integrations" },
  { id: "crm", label: "CRM & Support" },
  { id: "erp", label: "ERP & Finance" },
  { id: "comm", label: "Communication" },
  { id: "cloud", label: "Data & Cloud" },
  { id: "ai", label: "AI Models" }
];

export function IntegrationsEcosystem() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<IntegrationItem | null>(null);
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  const { playClick, playPing, playSuccess } = useSound();

  const filtered = activeCategory === "all"
    ? INTEGRATIONS
    : INTEGRATIONS.filter((item) => item.category === activeCategory);

  const handleOpenModal = (item: IntegrationItem) => {
    playClick();
    setSelectedItem(item);
    setPingStatus(null);
  };

  const handleTestPing = () => {
    playPing(1100);
    setPingStatus("Testing ping connection...");
    setTimeout(() => {
      playSuccess();
      setPingStatus(`✓ Healthy 200 OK. Round-trip: ${selectedItem?.latencyMs}ms`);
    }, 500);
  };

  return (
    <section id="integrations" className="py-24 relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12" data-ui>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5 text-brand-400" />
            Ecosystem & Architecture
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Integrates natively into your existing software stack.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            No need to replace your ERP, CRM, or messaging platforms. We plug into the tools your team already uses every day.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10" data-ui>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playClick();
                setActiveCategory(cat.id);
              }}
              className={cn(
                "px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all border",
                activeCategory === cat.id
                  ? "bg-brand-600 text-white border-brand-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20 hover:text-white"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Integrations Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenModal(item)}
              className="glass-card p-5 rounded-2xl border border-white/5 hover:border-brand-500/40 hover:bg-brand-950/20 transition-all cursor-pointer group flex flex-col justify-between"
              data-ui
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform">
                    {item.category === "cloud" ? (
                      <Database className="w-4 h-4" />
                    ) : item.category === "ai" ? (
                      <Zap className="w-4 h-4" />
                    ) : (
                      <Server className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {item.latencyMs}ms
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-brand-300 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/50 font-mono">
                <span>{item.syncType}</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Integration Details Modal */}
        <AnimatePresence>
          {selectedItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card max-w-lg w-full rounded-2xl border border-brand-500/40 bg-[#060a18] p-6 shadow-2xl relative"
              >
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-brand-600/20 text-brand-400 border border-brand-500/30">
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedItem.name}</h3>
                    <span className="text-xs font-mono text-brand-300">{selectedItem.syncType}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  {selectedItem.description}
                </p>

                <div className="space-y-3 text-xs mb-5">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-0.5">
                      Sample Inbound Trigger:
                    </span>
                    <span className="text-white font-medium">{selectedItem.sampleTrigger}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-0.5">
                      Downstream Automated Action:
                    </span>
                    <span className="text-brand-300 font-medium">{selectedItem.sampleAction}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#030610] border border-white/5 font-mono text-[11px] text-brand-200">
                    <span className="text-[10px] uppercase text-muted-foreground block mb-1">
                      Event Schema Payload:
                    </span>
                    <pre className="overflow-x-auto">
                      <code>{JSON.stringify(selectedItem.payload, null, 2)}</code>
                    </pre>
                  </div>
                </div>

                {pingStatus && (
                  <div className="mb-4 text-xs font-mono text-emerald-400 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    {pingStatus}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <button
                    onClick={handleTestPing}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    Test Connection Ping
                  </button>

                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-white transition-colors"
                  >
                    Close Inspector
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
