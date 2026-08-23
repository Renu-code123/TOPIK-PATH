"use client";

import React from "react";
import { ArrowRight, Compass, Brain, Heart, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { MascotLogo } from "./MascotLogo";

interface HeroSectionProps {
  onGetStarted: () => void;
  onExploreFeatures: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted,
  onExploreFeatures,
}) => {
  return (
    <section className="space-y-12 animate-fade-in">
      {/* ── 1. MAIN HERO BANNER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1527] via-[#111c35] to-[#1e153b] border border-indigo-500/30 p-6 sm:p-10 lg:p-12 shadow-2xl">
        {/* Glow & Atmospheric Blurs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Top Brand Micro Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-bold shadow-inner">
              <span className="text-sm">🌸</span> Official TOPIK I & II Prep Ecosystem
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Your Path to <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  TOPIK Success
                </span>
              </h1>
              <p className="text-sm sm:text-base font-semibold text-slate-300 tracking-wide">
                Learn Korean • Practice Smart • Track Progress • Ace TOPIK
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
              All-in-one platform for TOPIK I & TOPIK II preparation. Master official vocabulary, conquer sentence grammar, practice timed mock tests, and receive instant writing feedback.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="px-6 py-3.5 rounded-2xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-500/30 flex items-center gap-2.5 transition-all hover:scale-105"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreFeatures}
                className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700/80 shadow-md transition-all"
              >
                Explore Features
              </button>
            </div>

            {/* Quick Proof Metrics */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-6 text-xs text-slate-300">
              <div>
                <strong className="text-white text-base block font-black">1,671+</strong>
                <span>TOPIK I Words</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <strong className="text-white text-base block font-black">2,662+</strong>
                <span>TOPIK II Words</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <strong className="text-emerald-400 text-base block font-black">100% Free</strong>
                <span>Offline-Ready</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column — Korean Journey Vector Illustration */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-b from-[#1b2b4e] via-[#243b6b] to-[#122344] border border-indigo-500/30 shadow-2xl p-4 flex flex-col justify-between select-none">
              {/* Background Mountains & N Seoul Tower */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 380" fill="none" preserveAspectRatio="none">
                {/* Sky Gradient Layer */}
                <rect width="500" height="380" fill="url(#skyGrad)" />
                <defs>
                  <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#253e70" />
                    <stop offset="60%" stopColor="#4f46e5" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                </defs>

                {/* Distant Misty Mountains */}
                <path d="M0 200 Q 120 140 250 180 T 500 160 L 500 380 L 0 380 Z" fill="#1e293b" opacity="0.6" />
                <path d="M0 240 Q 180 180 340 220 T 500 210 L 500 380 L 0 380 Z" fill="#0f172a" opacity="0.8" />

                {/* N Seoul Tower on Hilltop */}
                <g transform="translate(360, 95)" opacity="0.85">
                  <line x1="10" y1="0" x2="10" y2="60" stroke="#94A3B8" strokeWidth="2.5" />
                  <ellipse cx="10" cy="20" rx="9" ry="4" fill="#64748B" />
                  <line x1="10" y1="0" x2="10" y2="10" stroke="#38BDF8" strokeWidth="3" />
                  <circle cx="10" cy="2" r="2" fill="#F43F5E" />
                </g>

                {/* Traditional Korean Pagoda / Palace (Right Side) */}
                <g transform="translate(320, 160)">
                  {/* Base Platform */}
                  <rect x="10" y="90" width="130" height="40" fill="#334155" rx="4" />
                  {/* Lower Pillars */}
                  <rect x="25" y="60" width="8" height="30" fill="#EF4444" />
                  <rect x="65" y="60" width="8" height="30" fill="#EF4444" />
                  <rect x="105" y="60" width="8" height="30" fill="#EF4444" />
                  {/* Lower Roof (Curved Eaves) */}
                  <path d="M0 60 Q 75 40 150 60 L 140 45 Q 75 35 10 45 Z" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1" />
                  {/* Upper Pillars */}
                  <rect x="40" y="30" width="6" height="20" fill="#EF4444" />
                  <rect x="90" y="30" width="6" height="20" fill="#EF4444" />
                  {/* Top Tier Roof */}
                  <path d="M20 30 Q 70 12 120 30 L 110 18 Q 70 8 30 18 Z" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1" />
                  {/* Golden Finial Top */}
                  <circle cx="70" cy="8" r="4" fill="#FBBF24" />
                </g>

                {/* Winding Stone Pathway */}
                <path
                  d="M 60 380 C 120 320, 140 280, 240 260 C 300 245, 340 240, 380 230"
                  stroke="#E2E8F0"
                  strokeWidth="38"
                  strokeLinecap="round"
                  opacity="0.9"
                  fill="none"
                />
                <path
                  d="M 60 380 C 120 320, 140 280, 240 260 C 300 245, 340 240, 380 230"
                  stroke="#CBD5E1"
                  strokeWidth="3"
                  strokeDasharray="8,10"
                  fill="none"
                />

                {/* Cherry Blossom Trees (Left & Right) */}
                <g transform="translate(390, 140)">
                  <circle cx="20" cy="20" r="30" fill="#F472B6" opacity="0.8" />
                  <circle cx="45" cy="10" r="24" fill="#FBCFE8" opacity="0.9" />
                  <circle cx="10" cy="35" r="20" fill="#F472B6" opacity="0.85" />
                </g>
                <g transform="translate(10, 260)">
                  <circle cx="30" cy="20" r="35" fill="#F472B6" opacity="0.75" />
                  <circle cx="50" cy="40" r="28" fill="#FBCFE8" opacity="0.85" />
                </g>

                {/* Floating Cherry Blossom Petals */}
                <circle cx="120" cy="180" r="3" fill="#FBCFE8" />
                <circle cx="180" cy="140" r="4" fill="#F472B6" />
                <circle cx="280" cy="120" r="3" fill="#FBCFE8" />
                <circle cx="240" cy="220" r="3.5" fill="#F472B6" />
                <circle cx="310" cy="170" r="2.5" fill="#FBCFE8" />
              </svg>

              {/* Interactive Milestone Badges placed along the path */}
              <div className="absolute top-[52%] left-[42%] z-20 transform -translate-x-1/2 -translate-y-1/2">
                <div className="px-3 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-black shadow-lg border border-white/30 flex items-center gap-1 animate-bounce">
                  <span>📍</span> TOPIK I
                </div>
              </div>

              <div className="absolute top-[42%] left-[58%] z-20 transform -translate-x-1/2 -translate-y-1/2">
                <div className="px-3 py-1 rounded-lg bg-[#8B5CF6] text-white text-[10px] font-black shadow-lg border border-white/30 flex items-center gap-1">
                  <span>⭐</span> TOPIK II
                </div>
              </div>

              <div className="absolute top-[34%] left-[76%] z-20 transform -translate-x-1/2 -translate-y-1/2">
                <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-rose-400 text-slate-950 text-[10px] font-black shadow-lg border border-white/40 flex items-center gap-1">
                  <span>👑</span> Your Dream
                </div>
              </div>

              {/* Cute Mascot character on the path */}
              <div className="absolute bottom-6 left-16 z-20 flex flex-col items-center">
                <div className="relative">
                  {/* Mascot Icon */}
                  <MascotLogo variant="icon" size="lg" />
                  {/* Little Korean Flag in hand */}
                  <div className="absolute -top-1 -right-2 text-base">🇰🇷</div>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white mt-1 border border-white/20">
                  Ready to Study!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. "WHY TOPIKPATH?" + "NAME MEANING" CARDS (EXACT MATCH) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 8 Columns: "Why TOPIKPath?" */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Why <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">TOPIKPath</span>?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Because learning Korean is a journey — and we're here to guide you, step by step, to your TOPIK goal.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Friendly */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3.5 hover:border-indigo-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 text-lg">
                🐾
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Friendly</h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  Simple, clean, and motivating interface.
                </p>
              </div>
            </div>

            {/* 2. Goal-Oriented */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3.5 hover:border-indigo-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 text-lg">
                🧭
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Goal-Oriented</h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  Track progress like LeetCode daily.
                </p>
              </div>
            </div>

            {/* 3. Smart */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3.5 hover:border-indigo-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 text-lg">
                🧠
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Smart</h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  AI-powered feedback & recommendations.
                </p>
              </div>
            </div>

            {/* 4. Complete */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3.5 hover:border-indigo-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 text-lg">
                ❤️
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Complete</h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  Vocab, Grammar, Listening, Reading, Writing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: "Name Meaning" Card */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-purple-950/40 border border-indigo-500/30 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Name Meaning
            </h3>

            <div className="space-y-3 text-xs">
              {/* TOPIK Definition */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="font-black text-sm text-sky-300 bg-sky-500/20 px-2.5 py-1 rounded-lg">
                  TOPIK
                </span>
                <span className="text-slate-300 font-semibold text-right">
                  = Test of Proficiency in Korean
                </span>
              </div>

              {/* Plus Sign */}
              <div className="text-center font-bold text-indigo-400 text-lg leading-none">+</div>

              {/* Path Definition */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="font-black text-sm text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-lg">
                  Path
                </span>
                <span className="text-slate-300 font-semibold text-right">
                  = Your learning journey, step by step
                </span>
              </div>
            </div>
          </div>

          {/* Together Banner */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/40 text-center space-y-1.5">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Together:</p>
            <h4 className="text-xl font-black text-white">“TOPIKPath”</h4>
            <p className="text-xs text-indigo-300 italic">Your guided journey to TOPIK success.</p>
            <div className="pt-2 flex items-center justify-center gap-2 text-indigo-400 text-xs">
              <span>🌸</span>
              <div className="w-16 h-0.5 bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full" />
              <span>🏯</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. TAGLINE RIBBON BANNER (EXACT MATCH) ── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/60 to-purple-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-around gap-4 text-xs sm:text-sm font-bold text-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-base text-rose-400">❤️</span>
          <span>Learn Today.</span>
        </div>
        <span className="hidden sm:inline text-indigo-400">➔</span>
        <div className="flex items-center gap-2">
          <span className="text-base text-sky-400">📘</span>
          <span>Practice Daily.</span>
        </div>
        <span className="hidden sm:inline text-indigo-400">➔</span>
        <div className="flex items-center gap-2">
          <span className="text-base text-amber-400">⭐</span>
          <span>Master TOPIK.</span>
        </div>
      </div>
    </section>
  );
};
