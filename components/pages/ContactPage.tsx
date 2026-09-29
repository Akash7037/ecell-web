'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/data/seed';
import { Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

interface FormState {
  name: string;
  email: string;
  subject: string;
  projectTrack: string;
  message: string;
}

export function ContactPage() {
  const [formType, setFormType] = useState<'pitch' | 'inquiry'>('pitch');
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: "Project Expo '26 Registration & Pitch Submission",
    projectTrack: 'Hardware & IoT',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({
          name: '',
          email: '',
          subject: formType === 'pitch' ? "Project Expo '26 Registration" : 'General Inquiry',
          projectTrack: 'Hardware & IoT',
          message: '',
        });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="w-full bg-paper text-ink pb-24" id="pitch">
      {/* ═══════ HERO ═══════ */}
      <section className="border-b border-paper-border bg-white/70 pt-12 pb-16 px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-vermilion font-bold mb-3">
            <span className="w-2.5 h-2.5 bg-vermilion"></span>
            <span>FOUNDRY DESK // INBOUND REGISTRATION</span>
          </div>

          <h1 className="font-headline text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-ink leading-[0.95]">
            Pitch A Venture.<br />
            <span className="text-vermilion underline decoration-4 underline-offset-8">
              Join Project Expo '26.
            </span>
          </h1>

          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <p className="font-body text-base sm:text-lg text-ink-muted max-w-2xl leading-relaxed">
              Register your student team for <strong className="text-ink font-semibold">PROJECT EXPO '26</strong>, apply for lab prototyping allowances, or connect with our corporate &amp; patent cell.
            </p>
            <div className="font-mono text-xs text-ink-muted shrink-0">
              <span className="px-3 py-1.5 bg-paper-dim border border-ink text-ink font-bold block">
                LOCATION: VSBCETC COIMBATORE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FORM + DETAILS GRID ═══════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Contact Info & Campus Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border-2 border-ink p-6 sm:p-8 shadow-[6px_6px_0px_#121316]">
                <div className="flex items-center gap-3 pb-4 mb-5 border-b border-paper-border">
                  <div className="w-10 h-10 border border-ink bg-paper-dim p-1 flex items-center justify-center">
                    <img src="/logo.png" alt="VSB E-Cell" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-headline text-lg font-bold uppercase text-ink">
                      VSBCETC Foundry Office
                    </h3>
                    <span className="font-mono text-xs text-ink-muted uppercase">Coimbatore, Tamil Nadu</span>
                  </div>
                </div>

                <div className="space-y-4 font-mono text-xs text-ink-muted">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-ink uppercase block">Address:</span>
                      <p className="mt-0.5 leading-relaxed font-body text-sm text-ink-muted">
                        VSB College of Engineering &amp; Technical Campus (VSBCETC),<br />
                        Coimbatore, Tamil Nadu
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-ink uppercase block">Electronic Mail:</span>
                      <a href="mailto:ecell@vsb.ac.in" className="text-ink font-bold hover:text-vermilion font-mono">
                        ecell@vsb.ac.in
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-ink uppercase block">Helpline / WhatsApp Desk:</span>
                      <span className="text-ink font-body text-sm">+91 4324 290144</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-paper-border font-mono text-xs">
                  <span className="text-vermilion font-bold block uppercase mb-1">
                    PROJECT EXPO '26 DIRECT DESK
                  </span>
                  <p className="font-body text-xs text-ink-muted leading-relaxed">
                    Student teams from any approved engineering college across India are eligible to register prototypes.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Submission Form */}
            <div className="lg:col-span-7 bg-white border-2 border-ink p-6 sm:p-8 shadow-[6px_6px_0px_#121316]">
              {/* Form Mode Selector */}
              <div className="flex items-center gap-2 pb-4 mb-6 border-b border-paper-border">
                <button
                  type="button"
                  onClick={() => {
                    setFormType('pitch');
                    setForm({ ...form, subject: "Project Expo '26 Registration & Pitch Submission" });
                  }}
                  className={`px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all border-2 ${
                    formType === 'pitch'
                      ? 'bg-ink text-paper border-ink shadow-[2px_2px_0px_#FF4D2E]'
                      : 'bg-paper text-ink border-ink hover:bg-paper-dim'
                  }`}
                >
                  Project Expo '26 / Pitch
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormType('inquiry');
                    setForm({ ...form, subject: 'General Foundry Inquiry' });
                  }}
                  className={`px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all border-2 ${
                    formType === 'inquiry'
                      ? 'bg-ink text-paper border-ink shadow-[2px_2px_0px_#FF4D2E]'
                      : 'bg-paper text-ink border-ink hover:bg-paper-dim'
                  }`}
                >
                  General Inquiry
                </button>
              </div>

              {status === 'success' ? (
                <div className="p-8 bg-paper-dim border-2 border-ink text-center">
                  <CheckCircle2 className="w-12 h-12 text-vermilion mx-auto mb-3" />
                  <h3 className="font-headline text-2xl font-bold uppercase text-ink">
                    Submission Received
                  </h3>
                  <p className="font-body text-sm text-ink-muted mt-2 max-w-md mx-auto leading-relaxed">
                    Thank you. Our student executive operators and faculty advisors will review your project details and follow up via email within 48 hours.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 px-6 py-2.5 bg-ink text-paper font-mono text-xs uppercase font-bold hover:bg-vermilion transition-colors"
                  >
                    Submit Another Inquiry →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="font-mono text-xs uppercase font-bold text-ink block mb-1">
                        Team Lead / Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Karthikeyan M."
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 bg-paper border border-ink font-body text-sm text-ink focus:outline-none focus:border-vermilion"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-xs uppercase font-bold text-ink block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. karthik@student.vsb.ac.in"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 bg-paper border border-ink font-body text-sm text-ink focus:outline-none focus:border-vermilion"
                      />
                    </div>
                  </div>

                  {formType === 'pitch' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="font-mono text-xs uppercase font-bold text-ink block mb-1">
                          Project Track *
                        </label>
                        <select
                          value={form.projectTrack}
                          onChange={(e) => setForm({ ...form, projectTrack: e.target.value })}
                          className="w-full px-4 py-3 bg-paper border border-ink font-mono text-xs text-ink focus:outline-none focus:border-vermilion"
                        >
                          <option value="Hardware & IoT">Hardware &amp; IoT Telemetry</option>
                          <option value="Robotics & EV">Autonomous Robotics &amp; EV Propulsion</option>
                          <option value="CleanTech & AgTech">CleanTech, Water &amp; Agriculture</option>
                          <option value="AI & Enterprise Software">AI Models &amp; Distributed Software</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-mono text-xs uppercase font-bold text-ink block mb-1">
                          Institutional / College Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. VSB CETC or other campus"
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className="w-full px-4 py-3 bg-paper border border-ink font-body text-sm text-ink focus:outline-none focus:border-vermilion"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="font-mono text-xs uppercase font-bold text-ink block mb-1">
                        Inquiry Subject *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lab Prototyping Access / Sponsorship"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-3 bg-paper border border-ink font-body text-sm text-ink focus:outline-none focus:border-vermilion"
                      />
                    </div>
                  )}

                  <div>
                    <label className="font-mono text-xs uppercase font-bold text-ink block mb-1">
                      {formType === 'pitch' ? 'Prototype Overview & Pitch Summary *' : 'Message *'}
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder={
                        formType === 'pitch'
                          ? 'Describe your hardware or software prototype, problem statement, team members, and whether you require lab prototyping allowances or patent assistance...'
                          : 'How can the VSB CETC E-Cell help your engineering venture?'
                      }
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 bg-paper border border-ink font-body text-sm text-ink focus:outline-none focus:border-vermilion"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="p-3 bg-red-50 border border-red-800 text-xs font-mono text-red-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                      <span>Failed to transmit data. Please check connection and retry.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-4 bg-ink text-paper font-mono text-xs uppercase font-bold tracking-wider hover:bg-vermilion transition-all btn-3d disabled:opacity-50"
                  >
                    {status === 'sending' ? 'Transmitting to Foundry Desk...' : 'Transmit Pitch / Message →'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
