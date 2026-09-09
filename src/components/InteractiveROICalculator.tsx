"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  TrendingUp,
  Clock,
  DollarSign,
  ShieldCheck,
  Check,
  Copy,
  Users,
  Sparkles,
  Zap,
  ArrowUpRight,
  RotateCcw,
  CheckCircle2,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/useSound";

export function InteractiveROICalculator() {
  // All inputs fully customizable from 0
  const [teamSize, setTeamSize] = useState<number>(12);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(14);
  const [hourlyRate, setHourlyRate] = useState<number>(45);
  const [automationRate, setAutomationRate] = useState<number>(75);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"annual" | "monthly">("annual");

  const { playClick, playSuccess } = useSound();

  // Presets including a 0-baseline option
  const applyPreset = (team: number, hours: number, rate: number, autoRate: number) => {
    playClick(1100);
    setTeamSize(team);
    setHoursPerWeek(hours);
    setHourlyRate(rate);
    setAutomationRate(autoRate);
  };

  // Calculations (50 operational weeks/year standard)
  const calculation = useMemo(() => {
    // If any dimension is 0, results are cleanly 0
    if (teamSize <= 0 || hoursPerWeek <= 0 || hourlyRate <= 0 || automationRate <= 0) {
      return {
        annualHoursSaved: 0,
        monthlyHoursSaved: 0,
        netAnnualSavings: 0,
        monthlySavings: 0,
        fteEquivalent: "0.0",
        paybackMonths: "0.0",
        directSavings: 0,
        errorSavings: 0,
        retainedHumanHoursPerWeek: (teamSize * hoursPerWeek),
      };
    }

    const totalWeeklyHours = teamSize * hoursPerWeek;
    const annualTotalHours = totalWeeklyHours * 50;
    const hoursAutomated = Math.round(annualTotalHours * (automationRate / 100));
    const monthlyHoursSaved = Math.round(hoursAutomated / 12);

    // Direct labor savings
    const annualCost = hoursAutomated * hourlyRate;

    // Error mitigation & rework prevention (estimated 15% operational upside)
    const errorMitigationSavings = Math.round(annualCost * 0.15);
    const netAnnualSavings = annualCost + errorMitigationSavings;
    const monthlySavings = Math.round(netAnnualSavings / 12);

    // Full-time capacity equivalent (1,800 productive hrs/yr per FTE)
    const fteEquivalent = (hoursAutomated / 1800).toFixed(1);

    // Payback period (amortized software integration vs monthly savings)
    const estimatedPlatformCost = Math.max(8000, netAnnualSavings * 0.1);
    const paybackMonths = netAnnualSavings > 0
      ? Math.max(0.4, Number((estimatedPlatformCost / (netAnnualSavings / 12)).toFixed(1))).toString()
      : "0.0";

    const retainedHumanHoursPerWeek = Math.round(totalWeeklyHours * (1 - automationRate / 100));

    return {
      annualHoursSaved: hoursAutomated,
      monthlyHoursSaved,
      netAnnualSavings,
      monthlySavings,
      fteEquivalent,
      paybackMonths,
      directSavings: annualCost,
      errorSavings: errorMitigationSavings,
      retainedHumanHoursPerWeek,
    };
  }, [teamSize, hoursPerWeek, hourlyRate, automationRate]);

  const copyBusinessCase = () => {
    playSuccess();
    const text = `AUTOMATE Enterprise ROI & Business Case Summary:
Parameters:
• Team Size: ${teamSize} specialists
• Manual Repetitive Hours: ${hoursPerWeek} hrs/week/specialist
• Loaded Compensation Rate: $${hourlyRate}/hr
• Target Automation Coverage: ${automationRate}%

Projected Quantifiable Impact:
★ Net Annual Value Reclaimed: $${calculation.netAnnualSavings.toLocaleString()} / year ($${calculation.monthlySavings.toLocaleString()} / mo)
★ Productive Time Returned: ${calculation.annualHoursSaved.toLocaleString()} hours / year
★ Equivalent Staff Capacity: +${calculation.fteEquivalent} FTEs
★ Hours Retained for Human Judgment: ${calculation.retainedHumanHoursPerWeek} hrs / week
★ Estimated Payback Horizon: ~${calculation.paybackMonths} months`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const directSharePct = calculation.netAnnualSavings > 0
    ? Math.round((calculation.directSavings / calculation.netAnnualSavings) * 100)
    : 0;
  const errorSharePct = calculation.netAnnualSavings > 0
    ? 100 - directSharePct
    : 0;

  return (
    <section id="roi-calculator" className="py-24 relative overflow-hidden border-t border-white/5">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10" data-ui>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5 text-brand-400" />
            Interactive ROI & Impact Engine
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Calculate your team&apos;s annual cost savings.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Customize team headcount, weekly manual hours, hourly compensation, and coverage target starting from zero to evaluate precise operational return.
          </p>
        </div>

        {/* Presets Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10" data-ui>
          <span className="text-xs text-muted-foreground uppercase font-mono mr-1">Workflow Profiles:</span>
          
          <button
            onClick={() => applyPreset(0, 0, 0, 0)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset (0 Base)</span>
          </button>

          <button
            onClick={() => applyPreset(8, 14, 35, 70)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
          >
            Customer Operations (8 reps)
          </button>
          <button
            onClick={() => applyPreset(12, 16, 55, 80)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
          >
            Finance & AP (12 analysts)
          </button>
          <button
            onClick={() => applyPreset(25, 18, 48, 75)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
          >
            Supply Chain & Freight (25 team)
          </button>
          <button
            onClick={() => applyPreset(60, 20, 65, 85)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
          >
            Enterprise Scale (60 team)
          </button>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Left Column: Sliders Control Panel */}
          <div className="lg:col-span-6 glass-card rounded-2xl border border-white/10 p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-base font-semibold text-white mb-5 flex items-center justify-between">
                <span>Workflow Operational Parameters</span>
                <span className="text-xs font-mono text-muted-foreground font-normal">All values custom 0+</span>
              </h3>

              <div className="space-y-6">
                {/* Slider 1: Team Size */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-white font-medium flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-400" />
                      Team members on repetitive tasks
                    </span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={teamSize}
                        onChange={(e) => {
                          const v = Math.max(0, Math.min(200, Number(e.target.value) || 0));
                          setTeamSize(v);
                        }}
                        className="w-16 text-right font-mono text-sm font-bold text-white bg-black/40 border border-white/15 px-2 py-0.5 rounded-md focus:border-brand-500 focus:outline-none"
                      />
                      <span className="text-xs text-muted-foreground">people</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150"
                    step="1"
                    value={teamSize}
                    onChange={(e) => {
                      playClick(750);
                      setTeamSize(Number(e.target.value));
                    }}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                    <span>0 (zero)</span>
                    <span>50</span>
                    <span>100</span>
                    <span>150+</span>
                  </div>
                </div>

                {/* Slider 2: Hours/Week per Person */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-white font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-brand-400" />
                      Weekly manual hours per person
                    </span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="40"
                        value={hoursPerWeek}
                        onChange={(e) => {
                          const v = Math.max(0, Math.min(40, Number(e.target.value) || 0));
                          setHoursPerWeek(v);
                        }}
                        className="w-16 text-right font-mono text-sm font-bold text-brand-300 bg-black/40 border border-brand-500/30 px-2 py-0.5 rounded-md focus:border-brand-500 focus:outline-none"
                      />
                      <span className="text-xs text-muted-foreground">hrs/wk</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="1"
                    value={hoursPerWeek}
                    onChange={(e) => {
                      playClick(850);
                      setHoursPerWeek(Number(e.target.value));
                    }}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                    <span>0 hrs</span>
                    <span>10 hrs</span>
                    <span>20 hrs</span>
                    <span>40 hrs (full time)</span>
                  </div>
                </div>

                {/* Slider 3: Hourly Rate */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-white font-medium flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      Fully-loaded hourly cost (wages + benefits)
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">$</span>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={hourlyRate}
                        onChange={(e) => {
                          const v = Math.max(0, Math.min(200, Number(e.target.value) || 0));
                          setHourlyRate(v);
                        }}
                        className="w-16 text-right font-mono text-sm font-bold text-emerald-300 bg-black/40 border border-white/15 px-2 py-0.5 rounded-md focus:border-emerald-500 focus:outline-none"
                      />
                      <span className="text-xs text-muted-foreground">/hr</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="1"
                    value={hourlyRate}
                    onChange={(e) => {
                      playClick(950);
                      setHourlyRate(Number(e.target.value));
                    }}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                    <span>$0/hr</span>
                    <span>$50/hr</span>
                    <span>$100/hr</span>
                    <span>$200/hr</span>
                  </div>
                </div>

                {/* Slider 4: Automation Coverage Target (From 0%) */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-white font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Target automation coverage
                    </span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={automationRate}
                        onChange={(e) => {
                          const v = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                          setAutomationRate(v);
                        }}
                        className="w-16 text-right font-mono text-sm font-bold text-purple-300 bg-black/40 border border-purple-500/30 px-2 py-0.5 rounded-md focus:border-purple-500 focus:outline-none"
                      />
                      <span className="text-xs text-muted-foreground">%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={automationRate}
                    onChange={(e) => {
                      playClick(1050);
                      setAutomationRate(Number(e.target.value));
                    }}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                    <span>0% (Manual)</span>
                    <span>50% (Standard)</span>
                    <span>75% (Recommended)</span>
                    <span>100% (Maximum)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="pt-4 border-t border-white/5 flex items-start gap-2.5 text-xs text-muted-foreground">
              <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <span>
                Standard assumptions model 50 active work weeks/year and a 1,800-hour productive benchmark per full-time specialist.
              </span>
            </div>
          </div>

          {/* Right Column: Computed Impact & ROI Breakdown */}
          <div className="lg:col-span-6 glass-card rounded-2xl border border-brand-500/30 bg-[#060a17]/95 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/15 blur-[90px] rounded-full pointer-events-none" />

            <div>
              {/* Header with Annual / Monthly toggle */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-brand-300">
                  Financial & Operational Return
                </span>
                <div className="flex items-center rounded-lg bg-white/5 p-0.5 border border-white/10 text-[11px]">
                  <button
                    onClick={() => setViewMode("annual")}
                    className={cn(
                      "px-2.5 py-1 rounded font-medium transition-colors",
                      viewMode === "annual" ? "bg-brand-600 text-white" : "text-muted-foreground hover:text-white"
                    )}
                  >
                    Annual
                  </button>
                  <button
                    onClick={() => setViewMode("monthly")}
                    className={cn(
                      "px-2.5 py-1 rounded font-medium transition-colors",
                      viewMode === "monthly" ? "bg-brand-600 text-white" : "text-muted-foreground hover:text-white"
                    )}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Main Net Savings Display */}
              <div className="text-4xl md:text-5xl font-extrabold text-white tracking-tight flex items-baseline gap-1 mt-2">
                <span className="text-brand-400">$</span>
                <motion.span
                  key={viewMode === "annual" ? calculation.netAnnualSavings : calculation.monthlySavings}
                  initial={{ opacity: 0.6, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {(viewMode === "annual"
                    ? calculation.netAnnualSavings
                    : calculation.monthlySavings
                  ).toLocaleString()}
                </motion.span>
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  {viewMode === "annual" ? "/ year" : "/ month"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Direct labor reallocation + process error rework mitigation
              </p>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 gap-3.5 mt-6">
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Clock className="w-3.5 h-3.5 text-brand-400" />
                    <span>Time Returned</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold font-mono text-white">
                    {calculation.annualHoursSaved.toLocaleString()} hrs
                  </div>
                  <span className="text-[11px] text-muted-foreground">annual hours liberated</span>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Headcount Capacity</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold font-mono text-emerald-300">
                    +{calculation.fteEquivalent} FTEs
                  </div>
                  <span className="text-[11px] text-muted-foreground">capacity unlocked</span>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    <span>Payback Horizon</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold font-mono text-purple-300">
                    {calculation.netAnnualSavings > 0 ? `~${calculation.paybackMonths} mo` : "0 mo"}
                  </div>
                  <span className="text-[11px] text-muted-foreground">estimated break-even</span>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Human Retention</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold font-mono text-blue-300">
                    {calculation.retainedHumanHoursPerWeek} hrs/wk
                  </div>
                  <span className="text-[11px] text-muted-foreground">retained for human judgment</span>
                </div>
              </div>

              {/* Composition Breakdown Bar */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Direct Labor: ${calculation.directSavings.toLocaleString()}</span>
                  <span>Rework Prevention: ${calculation.errorSavings.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-brand-500 rounded-l-full transition-all duration-300"
                    style={{ width: `${directSharePct}%` }}
                  />
                  <div
                    className="h-full bg-emerald-400 rounded-r-full transition-all duration-300"
                    style={{ width: `${errorSharePct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={copyBusinessCase}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Business Case Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Export Business Case</span>
                  </>
                )}
              </button>

              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                <span>Verify with our team</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
