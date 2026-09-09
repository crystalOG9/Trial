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
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/useSound";

export function InteractiveROICalculator() {
  // Input parameters
  const [teamSize, setTeamSize] = useState<number>(12);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(14);
  const [hourlyRate, setHourlyRate] = useState<number>(45);
  const [automationRate, setAutomationRate] = useState<number>(75);
  const [copied, setCopied] = useState(false);

  const { playClick, playSuccess } = useSound();

  // Presets
  const applyPreset = (team: number, hours: number, rate: number, autoRate: number) => {
    playClick(1100);
    setTeamSize(team);
    setHoursPerWeek(hours);
    setHourlyRate(rate);
    setAutomationRate(autoRate);
  };

  // Calculations (50 weeks/year standard)
  const calculation = useMemo(() => {
    const totalWeeklyHours = teamSize * hoursPerWeek;
    const annualTotalHours = totalWeeklyHours * 50;
    const hoursAutomated = Math.round(annualTotalHours * (automationRate / 100));

    // Annual direct labor cost of repetitive tasks
    const annualCost = hoursAutomated * hourlyRate;

    // Error reduction & SLA value multiplier (estimated ~18% additional economic upside)
    const errorMitigationSavings = Math.round(annualCost * 0.18);
    const netAnnualSavings = annualCost + errorMitigationSavings;

    // Equivalent full-time headcount freed up (assuming 1800 productive hrs/yr per FTE)
    const fteEquivalent = (hoursAutomated / 1800).toFixed(1);

    // Payback period in months (assuming standard implementation amortized)
    const estimatedPlatformCost = Math.max(12000, netAnnualSavings * 0.12);
    const paybackMonths = Math.max(0.8, Number(((estimatedPlatformCost / (netAnnualSavings / 12))).toFixed(1)));

    return {
      annualHoursSaved: hoursAutomated,
      netAnnualSavings,
      fteEquivalent,
      paybackMonths,
      directSavings: annualCost,
      errorSavings: errorMitigationSavings
    };
  }, [teamSize, hoursPerWeek, hourlyRate, automationRate]);

  const copyBusinessCase = () => {
    playSuccess();
    const text = `AUTOMATE Enterprise ROI & Business Case Summary:
• Team Size: ${teamSize} specialists
• Manual Repetitive Hours: ${hoursPerWeek} hrs/week/person
• Average Hourly Compensation: $${hourlyRate}/hr
• Target Automation Rate: ${automationRate}%

Projected Annual Impact:
★ Net Annual Cost Savings: $${calculation.netAnnualSavings.toLocaleString()}
★ Annual Productive Hours Reclaimed: ${calculation.annualHoursSaved.toLocaleString()} hours
★ Equivalent FTE Capacity Unlocked: ${calculation.fteEquivalent} Full-Time Employees
★ Estimated Break-Even / Payback: ~${calculation.paybackMonths} months`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="roi-calculator" className="py-24 relative overflow-hidden border-t border-white/5">
      {/* Background soft ambient radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12" data-ui>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5 text-brand-400" />
            Interactive ROI & Impact Engine
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Calculate your team&apos;s annual cost savings.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Adjust the team size, manual hours spent, and hourly rate to see the quantifiable financial return of automating your repetitive digital workflows.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10" data-ui>
          <span className="text-xs text-muted-foreground uppercase font-mono mr-2">Quick Presets:</span>
          <button
            onClick={() => applyPreset(6, 12, 35, 75)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
          >
            Customer Support (6 reps)
          </button>
          <button
            onClick={() => applyPreset(14, 16, 55, 80)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
          >
            Finance & AP (14 analysts)
          </button>
          <button
            onClick={() => applyPreset(35, 18, 50, 70)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
          >
            Logistics Ops (35 dispatchers)
          </button>
          <button
            onClick={() => applyPreset(80, 20, 70, 85)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
          >
            Enterprise Scale (80 team)
          </button>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Sliders Control Panel */}
          <div className="lg:col-span-6 glass-card rounded-2xl border border-white/10 p-6 md:p-8 flex flex-col justify-between space-y-6">
            {/* Slider 1: Team Size */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-white font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-400" />
                  Team members on repetitive workflows
                </span>
                <span className="font-mono text-base font-bold text-white bg-white/10 px-3 py-0.5 rounded-lg">
                  {teamSize} people
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="150"
                value={teamSize}
                onChange={(e) => {
                  playClick(750);
                  setTeamSize(Number(e.target.value));
                }}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                <span>2</span>
                <span>75</span>
                <span>150+</span>
              </div>
            </div>

            {/* Slider 2: Hours/Week per Person */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-white font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-400" />
                  Hours spent per week on manual digital tasks
                </span>
                <span className="font-mono text-base font-bold text-brand-300 bg-brand-500/10 px-3 py-0.5 rounded-lg border border-brand-500/20">
                  {hoursPerWeek} hrs / person
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="30"
                value={hoursPerWeek}
                onChange={(e) => {
                  playClick(850);
                  setHoursPerWeek(Number(e.target.value));
                }}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                <span>4 hrs</span>
                <span>16 hrs (typical)</span>
                <span>30 hrs</span>
              </div>
            </div>

            {/* Slider 3: Hourly Rate */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-white font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Fully-loaded hourly cost (wages + benefits)
                </span>
                <span className="font-mono text-base font-bold text-white bg-white/10 px-3 py-0.5 rounded-lg">
                  ${hourlyRate} / hr
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="160"
                step="5"
                value={hourlyRate}
                onChange={(e) => {
                  playClick(950);
                  setHourlyRate(Number(e.target.value));
                }}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                <span>$20/hr</span>
                <span>$60/hr (avg ops)</span>
                <span>$160/hr</span>
              </div>
            </div>

            {/* Slider 4: Automation Coverage Target */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-white font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Target automation coverage
                </span>
                <span className="font-mono text-base font-bold text-purple-300 bg-purple-500/10 px-3 py-0.5 rounded-lg border border-purple-500/20">
                  {automationRate}%
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                step="5"
                value={automationRate}
                onChange={(e) => {
                  playClick(1050);
                  setAutomationRate(Number(e.target.value));
                }}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                <span>40% (hybrid)</span>
                <span>75% (recommended)</span>
                <span>95% (max)</span>
              </div>
            </div>
          </div>

          {/* Real-time Computed Impact Card */}
          <div className="lg:col-span-6 glass-card rounded-2xl border border-brand-500/30 bg-[#060a17]/95 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/15 blur-[90px] rounded-full pointer-events-none" />

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-brand-300 block mb-1">
                Projected Annual Financial Impact
              </span>
              <div className="text-4xl md:text-5xl font-extrabold text-white tracking-tight flex items-baseline gap-1 mt-2">
                <span className="text-brand-400">$</span>
                <motion.span
                  key={calculation.netAnnualSavings}
                  initial={{ opacity: 0.6, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {calculation.netAnnualSavings.toLocaleString()}
                </motion.span>
                <span className="text-sm font-normal text-muted-foreground ml-2">/ year</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Direct labor reallocation + estimated error rework mitigation
              </p>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Clock className="w-3.5 h-3.5 text-brand-400" />
                    Hours Reclaimed
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">
                    {calculation.annualHoursSaved.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-muted-foreground">annual work-hours returned</span>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    Capacity Equivalent
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-300">
                    +{calculation.fteEquivalent} FTEs
                  </div>
                  <span className="text-[11px] text-muted-foreground">added productive capacity</span>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    Payback Horizon
                  </div>
                  <div className="text-2xl font-bold font-mono text-purple-300">
                    ~{calculation.paybackMonths} mo
                  </div>
                  <span className="text-[11px] text-muted-foreground">full investment break-even</span>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    Error Reduction
                  </div>
                  <div className="text-2xl font-bold font-mono text-blue-300">
                    99.4%
                  </div>
                  <span className="text-[11px] text-muted-foreground">in rule-based steps</span>
                </div>
              </div>

              {/* Visual Breakdown Bar */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Direct Labor Savings: ${calculation.directSavings.toLocaleString()}</span>
                  <span>Error Reduction: ${calculation.errorSavings.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
                  <div className="h-full bg-brand-500 rounded-l-full" style={{ width: "82%" }} />
                  <div className="h-full bg-emerald-400 rounded-r-full" style={{ width: "18%" }} />
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
