"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Server,
  Layers,
  Sparkles,
  Info,
  Clock,
  Send,
  AlertTriangle,
  ArrowRight,
  Database,
  Lock,
  FileCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/useSound";

interface ValidationCheck {
  rule: string;
  status: "PASS" | "REVIEW" | "ENFORCED" | "FLAGGED";
  detail: string;
}

interface ConnectedSystem {
  name: string;
  action: string;
  protocol: string;
}

interface WorkflowNode {
  id: string;
  name: string;
  category: "trigger" | "ai" | "rules" | "integration" | "human";
  iconName: string;
  description: string;
  status: "idle" | "processing" | "success" | "review";
  payloadSnippet: string;
  validationChecks: ValidationCheck[];
  connectedSystems: ConnectedSystem[];
  oversightGate: string;
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
    title: "Order Exception & Return Triage",
    subtitle: "Ingest customer requests, extract order context, verify return eligibility against warehouse records, route approvals.",
    tag: "E-Commerce",
    nodes: [
      {
        id: "trig-1",
        name: "Inbound Channel Ingestion",
        category: "trigger",
        iconName: "Send",
        description: "Customer ticket received via Zendesk webhook or support email.",
        status: "idle",
        payloadSnippet: '{\n  "ticketId": "TK-84920",\n  "channel": "zendesk_webhook",\n  "customerEmail": "sarah.m@company.com",\n  "inboundText": "Received damaged ceramic tableware item #48291. Need replacement before Friday."\n}',
        validationChecks: [
          { rule: "DKIM / SPF Email Signature", status: "PASS", detail: "Origin verified and authenticated" },
          { rule: "Rate Limiting & Duplicate Guard", status: "PASS", detail: "Single request detected within 24hr window" }
        ],
        connectedSystems: [
          { name: "Zendesk API", action: "GET /api/v2/tickets/84920", protocol: "REST / Webhook" }
        ],
        oversightGate: "Automated ingestion. Raw payload preserved for complete audit lineage."
      },
      {
        id: "ai-1",
        name: "Intent & Entity Extraction",
        category: "ai",
        iconName: "Sparkles",
        description: "Extracts structured entity fields (Order #, SKU, damage type, deadline urgency).",
        status: "idle",
        payloadSnippet: '{\n  "intent": "DAMAGED_ITEM_REPLACE",\n  "orderReference": "#48291",\n  "itemCategory": "Ceramic Tableware",\n  "urgency": "HIGH_PRIORITY",\n  "schemaStatus": "VALIDATED"\n}',
        validationChecks: [
          { rule: "JSON Schema Type Enforcement", status: "PASS", detail: "All required entity attributes parsed" },
          { rule: "Hallucination & Ambiguity Guard", status: "PASS", detail: "Order identifier confirmed against DB schema" }
        ],
        connectedSystems: [
          { name: "Parser Engine", action: "TRANSFORM_TO_SCHEMA", protocol: "Internal RPC" }
        ],
        oversightGate: "Deterministic schema validation; passes directly if all required keys resolve."
      },
      {
        id: "rules-1",
        name: "Return Policy & ERP Verification",
        category: "rules",
        iconName: "Layers",
        description: "Evaluates 30-day return policy, carrier tracking status, and replacement SKU stock.",
        status: "idle",
        payloadSnippet: '{\n  "deliveryDaysElapsed": 6,\n  "policyWindowDays": 30,\n  "returnEligible": true,\n  "replacementSkuInStock": true,\n  "itemCost": 185.00,\n  "autoApprovalLimit": 100.00\n}',
        validationChecks: [
          { rule: "Return Window Eligibility", status: "PASS", detail: "Delivered 6 days ago (limit: 30 days)" },
          { rule: "Stock Availability Check", status: "PASS", detail: "14 units available in regional fulfillment hub" },
          { rule: "Discretionary Budget Check", status: "REVIEW", detail: "Item value ($185) exceeds autonomous $100 cap" }
        ],
        connectedSystems: [
          { name: "Shopify Orders API", action: "GET /admin/orders/48291", protocol: "REST" },
          { name: "WMS Inventory", action: "QUERY sku_stock_level", protocol: "GraphQL" }
        ],
        oversightGate: "Financial threshold trigger: Amounts > $100 require explicit supervisor confirmation."
      },
      {
        id: "human-1",
        name: "Supervisor Approval Gate",
        category: "human",
        iconName: "ShieldCheck",
        description: "Displays customer loyalty status, damage assessment, and replacement dispatch draft for 1-click review.",
        status: "idle",
        payloadSnippet: '{\n  "gate": "SUPERVISOR_CONFIRMATION",\n  "reviewer": "operations.lead@company.com",\n  "suggestedAction": "APPROVE_EXPEDITED_REPLACEMENT",\n  "reason": "Exceeds $100 auto-threshold but customer is 3-year VIP"\n}',
        validationChecks: [
          { rule: "Identity & RBAC Role Check", status: "PASS", detail: "Supervisor possesses Tier-2 financial authority" },
          { rule: "Audit Signature Requirement", status: "ENFORCED", detail: "Timestamped decision recorded in compliance ledger" }
        ],
        connectedSystems: [
          { name: "Supervisor Portal", action: "POST /decisions/queue", protocol: "Internal Secure Webhook" },
          { name: "Slack Ops Channel", action: "EMIT approval_card", protocol: "ChatOps Bot" }
        ],
        oversightGate: "Mandatory human sign-off. Execution blocked until supervisor clicks Approve."
      },
      {
        id: "integ-1",
        name: "Fulfillment & Client Sync",
        category: "integration",
        iconName: "Server",
        description: "Dispatches warehouse replacement order, updates CRM case, and notifies customer.",
        status: "idle",
        payloadSnippet: '{\n  "replacementOrder": "#48291-R1",\n  "carrier": "UPS_NEXT_DAY_AIR",\n  "hubspotUpdated": true,\n  "customerEmailDispatched": true\n}',
        validationChecks: [
          { rule: "Idempotency Token Verification", status: "PASS", detail: "Guarantees replacement order created exactly once" },
          { rule: "Bi-Directional Status Sync", status: "PASS", detail: "CRM and warehouse states reconciled" }
        ],
        connectedSystems: [
          { name: "ShipStation", action: "POST /orders/create", protocol: "REST API" },
          { name: "HubSpot CRM", action: "PATCH /contacts/notes", protocol: "REST API" }
        ],
        oversightGate: "Automated dispatch following explicit supervisor clearance."
      }
    ]
  },
  {
    id: "invoice-matching",
    title: "AP Invoice 3-Way Reconciliation",
    subtitle: "Parse incoming vendor invoices, match line items with purchase orders and goods receipt, prepare ERP journal entry.",
    tag: "Finance",
    nodes: [
      {
        id: "trig-2",
        name: "PDF Invoice Ingestion",
        category: "trigger",
        iconName: "Send",
        description: "Vendor transmits multi-page PDF invoice to billing inbox.",
        status: "idle",
        payloadSnippet: '{\n  "fileName": "INV_AcmeCorp_9901.pdf",\n  "vendor": "Acme Industrial Supplies",\n  "receivedVia": "invoices@company.com",\n  "fileSizeKb": 480\n}',
        validationChecks: [
          { rule: "Antivirus & MIME Sanitization", status: "PASS", detail: "Valid PDF document structure confirmed" },
          { rule: "Vendor Registration Check", status: "PASS", detail: "Vendor Tax ID matches approved ERP vendor directory" }
        ],
        connectedSystems: [
          { name: "Document Vault", action: "STORE /invoices/raw", protocol: "S3 Encrypted Bucket" }
        ],
        oversightGate: "Unsupervised ingestion with cryptographic hash verification."
      },
      {
        id: "ai-2",
        name: "Table & Line Item Parsing",
        category: "ai",
        iconName: "Sparkles",
        description: "Extracts line items, unit rates, net totals, tax codes, and remittance banking details.",
        status: "idle",
        payloadSnippet: '{\n  "invoiceNumber": "INV-9901",\n  "invoiceTotal": 14250.00,\n  "poReference": "PO-88120",\n  "lineItemCount": 4,\n  "terms": "Net 30 (2% 10)"\n}',
        validationChecks: [
          { rule: "Mathematical Sum Consistency", status: "PASS", detail: "Line sums match stated subtotal + tax exactly" },
          { rule: "Bank Account Remit Match", status: "PASS", detail: "IBAN matches vendor records on file" }
        ],
        connectedSystems: [
          { name: "Vision OCR", action: "EXTRACT_TABLE_DATA", protocol: "Secure Pipeline" }
        ],
        oversightGate: "Flags any line item variance or unlisted payment destination."
      },
      {
        id: "rules-2",
        name: "3-Way NetSuite Reconciliation",
        category: "rules",
        iconName: "Layers",
        description: "Matches invoice against Purchase Order #PO-88120 and warehouse receipt.",
        status: "idle",
        payloadSnippet: '{\n  "poFound": true,\n  "poQuantity": 500,\n  "receivedQuantity": 500,\n  "priceVariance": "$0.00",\n  "toleranceCheck": "WITHIN_LIMITS"\n}',
        validationChecks: [
          { rule: "Unit Cost PO Alignment", status: "PASS", detail: "Quoted $28.50/unit matches PO price schedule" },
          { rule: "Physical Warehouse Receipt", status: "PASS", detail: "Receipt confirmation logged at Dock 4" }
        ],
        connectedSystems: [
          { name: "NetSuite ERP", action: "QUERY PurchaseOrder & ItemReceipt", protocol: "SuiteTalk REST" }
        ],
        oversightGate: "Zero price variance: Ready for batched controller payment authorization."
      },
      {
        id: "human-2",
        name: "Controller Sign-off",
        category: "human",
        iconName: "ShieldCheck",
        description: "Presents batched matching summary with auto-calculated early payment discount ($285.00 saved).",
        status: "idle",
        payloadSnippet: '{\n  "action": "PAYMENT_AUTHORIZATION",\n  "earlyPayDiscount": "$285.00",\n  "scheduledAchDate": "2026-09-18",\n  "controllerStatus": "APPROVED"\n}',
        validationChecks: [
          { rule: "Dual Authorization Mandate", status: "PASS", detail: "Invoices > $10,000 require Controller sign-off" },
          { rule: "Segregation of Duties", status: "ENFORCED", detail: "Approver differs from PO creator" }
        ],
        connectedSystems: [
          { name: "Finance Portal", action: "BATCH_SIGN_OFF", protocol: "SSO Verified Gate" }
        ],
        oversightGate: "Controller verifies payment release with 1-click confirmation."
      },
      {
        id: "integ-2",
        name: "ERP Bill Creation & Scheduling",
        category: "integration",
        iconName: "Server",
        description: "Creates vendor bill in NetSuite and schedules ACH disbursement.",
        status: "idle",
        payloadSnippet: '{\n  "billId": "BILL-90412",\n  "status": "APPROVED_FOR_PAYMENT",\n  "achScheduled": true,\n  "discountCaptured": "$285.00"\n}',
        validationChecks: [
          { rule: "GL Account Allocation", status: "PASS", detail: "Mapped to Inventory Asset #1300" },
          { rule: "Fiscal Period Lock", status: "PASS", detail: "Current accounting period is open" }
        ],
        connectedSystems: [
          { name: "NetSuite Accounts Payable", action: "POST /record/v1/vendorBill", protocol: "REST" },
          { name: "Banking Gateway", action: "POST /ach/schedule", protocol: "ISO 20022" }
        ],
        oversightGate: "Automated ledger entry following dual-authorized sign-off."
      }
    ]
  },
  {
    id: "logistics-reroute",
    title: "Supply Chain Freight Delay & Exception Router",
    subtitle: "Monitor carrier EDI signals, detect transit disruptions, evaluate cargo temperature parameters, and dispatch intermodal rerouting.",
    tag: "Logistics",
    nodes: [
      {
        id: "trig-3",
        name: "Carrier EDI 315 Webhook",
        category: "trigger",
        iconName: "Send",
        description: "Port congestion notification received via maritime carrier telemetry.",
        status: "idle",
        payloadSnippet: '{\n  "containerId": "MSKU901230",\n  "vessel": "Pacific Express",\n  "ediEventCode": "315_DELAY",\n  "port": "Rotterdam Terminal",\n  "delayDuration": "48_HOURS"\n}',
        validationChecks: [
          { rule: "EDI Sequence Check", status: "PASS", detail: "Sequential event ID verified without telemetry loss" },
          { rule: "Vessel AIS Position Verification", status: "PASS", detail: "Telemetry cross-referenced with satellite AIS" }
        ],
        connectedSystems: [
          { name: "Maersk EDI Hub", action: "RECEIVE EDI_315", protocol: "AS2 Secure Stream" }
        ],
        oversightGate: "Real-time telemetry ingestion with immediate priority scoring."
      },
      {
        id: "ai-3",
        name: "Perishable Cargo & SLA Evaluator",
        category: "ai",
        iconName: "Sparkles",
        description: "Assesses pharmaceutical cold-chain tolerance, battery limits, and penalty deadlines.",
        status: "idle",
        payloadSnippet: '{\n  "commodity": "Vaccine_BioPharma",\n  "temperatureLimitC": "+2 to +8",\n  "slaPenaltyDeadline": "36_HOURS",\n  "disruptionSeverity": "CRITICAL_SLA_BREACH"\n}',
        validationChecks: [
          { rule: "Cold Chain Threshold Matrix", status: "REVIEW", detail: "48hr port delay exceeds 36hr cold-storage buffer" },
          { rule: "Contractual SLA Penalty Risk", status: "FLAGGED", detail: "Late arrival triggers tier-1 liquidated damages" }
        ],
        connectedSystems: [
          { name: "IoT Sensor Gateway", action: "GET /telemetry/temp_log", protocol: "MQTT" }
        ],
        oversightGate: "Critical condition flagged: Automatically triggers rapid intermodal routing engine."
      },
      {
        id: "rules-3",
        name: "Intermodal Route Optimizer",
        category: "rules",
        iconName: "Layers",
        description: "Queries rail vs team-driver expedited trucking options to meet deadline.",
        status: "idle",
        payloadSnippet: '{\n  "recommendation": "EXPEDITED_TEAM_DRIVER",\n  "transitHoursSaved": 32,\n  "netDeltaCost": "$420.00",\n  "penaltyAvoided": "$8,500.00"\n}',
        validationChecks: [
          { rule: "Driver Availability & Hours of Service", status: "PASS", detail: "Two dual-certified drivers on standby" },
          { rule: "Refrigerated Trailer Compliance", status: "PASS", detail: "Active reefer unit calibrated within 24 hours" }
        ],
        connectedSystems: [
          { name: "TMS Freight Engine", action: "QUERY expedited_carriers", protocol: "REST" }
        ],
        oversightGate: "Cost-benefit rule satisfied: $420 freight delta prevents $8,500 delivery penalty."
      },
      {
        id: "human-3",
        name: "Dispatcher Authorization",
        category: "human",
        iconName: "ShieldCheck",
        description: "Dispatcher confirms revised dispatch schedule on mobile cockpit with 1 tap.",
        status: "idle",
        payloadSnippet: '{\n  "dispatcher": "dispatch.supervisor@logistics.com",\n  "decision": "AUTHORIZE_GROUND_EXPEDITE",\n  "reason": "Protect cold-chain pharmaceutical SLA"\n}',
        validationChecks: [
          { rule: "Mobile Biometric Sign-off", status: "PASS", detail: "Verified via WebAuthn authentication" },
          { rule: "Insurance Liability Endorsement", status: "PASS", detail: "Cargo insurance updated automatically" }
        ],
        connectedSystems: [
          { name: "Mobile Operations App", action: "POST /auth/dispatch", protocol: "Push Notification" }
        ],
        oversightGate: "High-value cargo movement requires dispatcher sign-off."
      },
      {
        id: "integ-3",
        name: "TMS & Recipient Notification",
        category: "integration",
        iconName: "Server",
        description: "Dispatches revised Bill of Lading, notifies hospital pharmacy consignee.",
        status: "idle",
        payloadSnippet: '{\n  "revisedEta": "Friday 08:30 AM",\n  "consigneeNotified": true,\n  "newTrackingNumber": "EXPD-9921",\n  "carrierAssigned": "Apex Cold Logistics"\n}',
        validationChecks: [
          { rule: "Consignee EDI 214 Delivery Notice", status: "PASS", detail: "Hospital receiving dock scheduled" },
          { rule: "Customs Clearance Pre-File", status: "PASS", detail: "Revised inland arrival filed" }
        ],
        connectedSystems: [
          { name: "Consignee Portal", action: "SEND_SMS_AND_EMAIL", protocol: "Twilio / SendGrid" },
          { name: "SAP Transportation Mgmt", action: "PATCH /orders/transit", protocol: "OData" }
        ],
        oversightGate: "Automated real-time dispatch and notification completed."
      }
    ]
  }
];

export function WorkflowStudio() {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [activeNodeDetails, setActiveNodeDetails] = useState<WorkflowNode | null>(null);
  const [supervisorMode, setSupervisorMode] = useState<"standard" | "strict" | "copilot">("standard");

  const { playClick, playPing, playSuccess, playPulse } = useSound();
  const activePreset = PRESETS[selectedPreset];

  // Auto initialize selected node
  useEffect(() => {
    setActiveNodeDetails(activePreset.nodes[0]);
    setActiveStepIndex(-1);
    setIsRunning(false);
  }, [selectedPreset, activePreset]);

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStepIndex(0);
    playPulse();

    const nodes = activePreset.nodes;

    nodes.forEach((node, idx) => {
      // Step activation
      setTimeout(() => {
        setActiveStepIndex(idx);
        setActiveNodeDetails(node);
        playPing(800 + idx * 120);

        if (idx === nodes.length - 1) {
          setTimeout(() => {
            setIsRunning(false);
            playSuccess();
          }, 800);
        }
      }, idx * 1100);
    });
  };

  const handleReset = () => {
    playClick(600);
    setIsRunning(false);
    setActiveStepIndex(-1);
    setActiveNodeDetails(activePreset.nodes[0]);
  };

  return (
    <section id="studio" className="py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-brand-600/10 blur-[180px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-12" data-ui>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            Interactive Workflow Studio
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Inspect real end-to-end automation pipelines.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            See how triggers, extraction schemas, deterministic policy rules, and human oversight gates operate in production.
          </p>
        </div>

        {/* Preset Workflow Selectors */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8" data-ui>
          {PRESETS.map((preset, idx) => (
            <button
              key={preset.id}
              onClick={() => {
                playClick(900);
                setSelectedPreset(idx);
              }}
              className={cn(
                "px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all flex items-center gap-2 border",
                selectedPreset === idx
                  ? "bg-brand-600 border-brand-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:text-white hover:bg-white/10"
              )}
            >
              <span className="font-mono text-[10px] uppercase opacity-70 px-1.5 py-0.5 rounded bg-black/30">
                {preset.tag}
              </span>
              <span>{preset.title}</span>
            </button>
          ))}
        </div>

        {/* Main Studio Card */}
        <div className="glass-card rounded-2xl border border-white/10 bg-[#040714]/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative">
          {/* Top Bar Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{activePreset.title}</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Ready
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
                {activePreset.subtitle}
              </p>
            </div>

            {/* Simulation controls */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={handleReset}
                disabled={isRunning}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors flex items-center gap-1.5 disabled:opacity-40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={runSimulation}
                disabled={isRunning}
                className={cn(
                  "flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all",
                  isRunning
                    ? "bg-brand-500/40 text-white cursor-wait"
                    : "bg-brand-600 hover:bg-brand-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                )}
              >
                <Play className={cn("w-3.5 h-3.5", isRunning && "animate-spin")} />
                <span>{isRunning ? "Simulating Execution..." : "Simulate Pipeline"}</span>
              </button>
            </div>
          </div>

          {/* Visual Pipeline Nodes Track */}
          <div className="py-8 overflow-x-auto select-none">
            <div className="min-w-[700px] flex items-center justify-between relative px-4">
              {/* Connecting Background Line */}
              <div className="absolute left-[5%] right-[5%] top-1/2 -translate-y-1/2 h-[2px] bg-white/10 z-0">
                <motion.div
                  className="h-full bg-brand-500 transition-all duration-300"
                  initial={{ width: "0%" }}
                  animate={{
                    width: activeStepIndex >= 0
                      ? `${((activeStepIndex + 1) / activePreset.nodes.length) * 100}%`
                      : "0%"
                  }}
                />
              </div>

              {/* Node Cards */}
              {activePreset.nodes.map((node, idx) => {
                const isActive = activeStepIndex === idx;
                const isPassed = activeStepIndex > idx;
                const isSelected = activeNodeDetails?.id === node.id;

                return (
                  <div key={node.id} className="relative z-10 flex flex-col items-center">
                    <button
                      onClick={() => {
                        playClick(1000);
                        setActiveNodeDetails(node);
                      }}
                      className={cn(
                        "group flex flex-col items-center text-center focus:outline-none transition-all duration-200",
                        isSelected ? "scale-105" : "hover:scale-102"
                      )}
                    >
                      <div
                        className={cn(
                          "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border backdrop-blur-md relative",
                          isActive
                            ? "bg-brand-600 border-brand-300 text-white shadow-[0_0_25px_rgba(37,99,235,0.6)] animate-pulse"
                            : isPassed
                            ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                            : isSelected
                            ? "bg-white/15 border-brand-400 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                            : "bg-[#090e1f] border-white/15 text-muted-foreground hover:text-white hover:border-white/30"
                        )}
                      >
                        {node.category === "trigger" && <Send className="w-5 h-5" />}
                        {node.category === "ai" && <Sparkles className="w-5 h-5" />}
                        {node.category === "rules" && <Layers className="w-5 h-5" />}
                        {node.category === "human" && <ShieldCheck className="w-5 h-5" />}
                        {node.category === "integration" && <Server className="w-5 h-5" />}

                        {/* Status badge pill */}
                        {isPassed && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow">
                            <CheckCircle2 className="w-3 h-3 text-black stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <span
                        className={cn(
                          "mt-3 text-xs font-semibold max-w-[110px] leading-tight transition-colors",
                          isActive
                            ? "text-brand-300"
                            : isPassed
                            ? "text-emerald-300"
                            : isSelected
                            ? "text-white"
                            : "text-muted-foreground"
                        )}
                      >
                        {node.name}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase mt-0.5">
                        Step 0{idx + 1}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deep Node Inspector & Logic Checkpoints Grid */}
          <div className="grid lg:grid-cols-12 gap-6 mt-6 pt-6 border-t border-white/10">
            {/* Left: Active Step Data & Payload Schema (5 cols) */}
            <div className="lg:col-span-5 bg-black/40 rounded-xl p-5 border border-white/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-brand-400" />
                    <h4 className="text-xs font-mono uppercase tracking-wider text-white/80">
                      Step Data & Parameters
                    </h4>
                  </div>
                  {activeNodeDetails && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
                      {activeNodeDetails.category} Stage
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

                    {/* Formatted JSON Payload Schema */}
                    <div>
                      <span className="text-[11px] font-mono text-muted-foreground uppercase block mb-1">
                        Structured Node Payload:
                      </span>
                      <pre className="p-3 rounded-lg bg-[#030612] text-[11px] font-mono text-brand-200 overflow-x-auto border border-white/10 leading-relaxed">
                        <code>{activeNodeDetails.payloadSnippet}</code>
                      </pre>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Select a node above to inspect its parameters.</p>
                )}
              </div>

              {/* Oversight Policy Settings */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-white/90 font-medium flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-brand-400" />
                    Supervisor Governance Gate:
                  </span>
                  <span className="font-mono text-[11px] text-emerald-400">Enforced</span>
                </div>
                
                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  <button
                    onClick={() => {
                      playClick(700);
                      setSupervisorMode("standard");
                    }}
                    className={cn(
                      "px-2 py-1.5 rounded-lg border font-medium transition-all text-center",
                      supervisorMode === "standard"
                        ? "bg-brand-600/30 border-brand-400 text-brand-200"
                        : "bg-white/5 border-white/5 text-muted-foreground hover:text-white"
                    )}
                  >
                    Standard Gate
                  </button>
                  <button
                    onClick={() => {
                      playClick(700);
                      setSupervisorMode("copilot");
                    }}
                    className={cn(
                      "px-2 py-1.5 rounded-lg border font-medium transition-all text-center",
                      supervisorMode === "copilot"
                        ? "bg-brand-600/30 border-brand-400 text-brand-200"
                        : "bg-white/5 border-white/5 text-muted-foreground hover:text-white"
                    )}
                  >
                    Mandatory Sign-off
                  </button>
                  <button
                    onClick={() => {
                      playClick(700);
                      setSupervisorMode("strict");
                    }}
                    className={cn(
                      "px-2 py-1.5 rounded-lg border font-medium transition-all text-center",
                      supervisorMode === "strict"
                        ? "bg-brand-600/30 border-brand-400 text-brand-200"
                        : "bg-white/5 border-white/5 text-muted-foreground hover:text-white"
                    )}
                  >
                    Strict Policy
                  </button>
                </div>
                <span className="text-[10px] text-muted-foreground block mt-1.5">
                  {supervisorMode === "standard" && "Automates standard business rules; routes discrepancies to supervisor."}
                  {supervisorMode === "copilot" && "Prepares verified payloads; awaits supervisor approval before any external write."}
                  {supervisorMode === "strict" && "Zero autonomous state changes. Restricted to data enrichment and policy audits."}
                </span>
              </div>
            </div>

            {/* Right: Validation Checkpoints & Target Systems (7 cols) */}
            <div className="lg:col-span-7 bg-[#02050e] rounded-xl border border-white/10 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-white/90 font-semibold text-xs font-mono uppercase">
                      Deterministic Validation & Rule Matrix
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">
                    Audit Grade
                  </span>
                </div>

                {/* Validation Rules List */}
                <div className="space-y-2.5 mb-5">
                  <span className="text-[11px] font-mono text-muted-foreground uppercase block">
                    Active Condition Checks for This Stage:
                  </span>
                  {activeNodeDetails?.validationChecks.map((chk, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="text-white font-medium flex items-center gap-2">
                          <span>{chk.rule}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug">
                          {chk.detail}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0",
                          chk.status === "PASS"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : chk.status === "FLAGGED"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : chk.status === "REVIEW"
                            ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                            : "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                        )}
                      >
                        {chk.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Connected Enterprise Systems */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-muted-foreground uppercase block">
                    Connected Business Systems:
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {activeNodeDetails?.connectedSystems.map((sys, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-brand-400" />
                          <span className="text-white font-medium text-[11px]">{sys.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground">{sys.protocol}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Oversight Condition Footer */}
              <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-muted-foreground text-[11px]">
                  <strong className="text-white/80">Oversight Rule:</strong> {activeNodeDetails?.oversightGate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
