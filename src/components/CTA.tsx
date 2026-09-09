"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, MessageSquare } from "lucide-react";

export function CTA() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-brand-950/20">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          
          {/* Left Column: CTA Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              What is your team doing every day that a computer should be doing?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-lg">
              Show us the workflow. We&apos;ll help identify what can be automated and where humans should stay in control.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button 
                type="button"
                onClick={() => document.getElementById("name")?.focus()}
                className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-full text-base font-semibold transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] w-full sm:w-auto"
              >
                Show us your workflow
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <a href="mailto:hello@automate.example" className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-full text-base font-medium transition-all w-full sm:w-auto">
                <MessageSquare className="w-5 h-5" />
                Talk to us
              </a>
            </div>
          </motion.div>

          {/* Right Column: Lead Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative"
            data-ui
          >
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form 
                  key="form"
                  id="lead-form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl font-bold text-white mb-6">Show us your workflow</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-medium text-muted-foreground">Full Name *</label>
                      <input required type="text" id="name" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-500 transition-colors" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-medium text-muted-foreground">Work Email *</label>
                      <input required type="email" id="email" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-500 transition-colors" placeholder="john@company.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-xs font-medium text-muted-foreground">Company *</label>
                      <input required type="text" id="company" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-500 transition-colors" placeholder="Acme Inc" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="size" className="text-xs font-medium text-muted-foreground">Company Size</label>
                      <select id="size" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors appearance-none">
                        <option value="">Select size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201+">201+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="industry" className="text-xs font-medium text-muted-foreground">Industry *</label>
                    <select required id="industry" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors appearance-none">
                      <option value="">Select industry</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="logistics">Logistics</option>
                      <option value="finance">Finance / Accounting</option>
                      <option value="support">Customer Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="process" className="text-xs font-medium text-muted-foreground">What process takes the most time? *</label>
                    <textarea required id="process" rows={3} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors resize-none" placeholder="E.g. We spend hours copying order data from emails into our ERP..."></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-brand-600 hover:bg-brand-500 text-white rounded-lg px-4 py-3 font-medium transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Request workflow assessment"
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center text-center h-full justify-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mb-2">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Assessment Requested</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Thank you for reaching out. We will review your workflow and get back to you within 24 hours to schedule a deep dive.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 text-brand-400 hover:text-brand-300 font-medium text-sm transition-colors"
                  >
                    Submit another request
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
