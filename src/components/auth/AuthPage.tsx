"use client";

import React, { useState, useEffect, useMemo } from "react";
import { MascotLogo } from "@/components/brand/MascotLogo";
import { 
  BookOpen, Eye, EyeOff, CheckCircle2, Sparkles, 
  ArrowRight, User, Lock, Mail, AlertCircle
} from "lucide-react";

interface User {
  name: string;
  email: string;
  targetLevel: string;
  xp: number;
  streak: number;
}

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

const FEATURES = [
  { icon: "📚", title: "1,671 TOPIK I Words", desc: "Complete official vocabulary with audio" },
  { icon: "📗", title: "2,662 TOPIK II Words", desc: "Full intermediate/advanced wordbank" },
  { icon: "🎴", title: "SM-2 Flashcards", desc: "Spaced repetition for lasting memory" },
  { icon: "🎯", title: "MCQ Practice Engine", desc: "Real TOPIK-style question sets" },
  { icon: "📝", title: "Mock Exam Center", desc: "Timed PBT/IBT simulations" },
  { icon: "✍️", title: "Writing Lab (51–54)", desc: "Tasks with automated rubric scoring" },
  { icon: "🏆", title: "Gamified Progress", desc: "XP, streaks, badges & leaderboard" },
  { icon: "📊", title: "Smart Analytics", desc: "Track mastery & readiness score" },
];

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<"landing" | "login" | "signup">("landing");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetLevel, setTargetLevel] = useState("TOPIK_I");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(email)) { setError("Please enter a valid email address."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900)); // Simulate auth
    
    // Check local storage for stored users
    try {
      const stored = localStorage.getItem("topikpath_users");
      const users: any[] = stored ? JSON.parse(stored) : [];
      const found = users.find((u: any) => u.email === email && u.password === password);
      if (!found) {
        setError("Incorrect email or password. Try signing up!");
        setLoading(false);
        return;
      }
      localStorage.setItem("topikpath_current_user", JSON.stringify(found));
      onAuthSuccess(found);
    } catch {
      setError("Login failed. Please try again.");
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!validateEmail(email)) { setError("Please enter a valid email address."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    try {
      const stored = localStorage.getItem("topikpath_users");
      const users: any[] = stored ? JSON.parse(stored) : [];
      if (users.find((u: any) => u.email === email)) {
        setError("An account with this email already exists. Please log in.");
        setLoading(false);
        return;
      }
      const newUser = { name, email, password, targetLevel, xp: 0, streak: 0 };
      users.push(newUser);
      localStorage.setItem("topikpath_users", JSON.stringify(users));
      localStorage.setItem("topikpath_current_user", JSON.stringify(newUser));
      onAuthSuccess(newUser);
    } catch {
      setError("Signup failed. Please try again.");
    }
    setLoading(false);
  };

  // ── LANDING PAGE ──
  if (mode === "landing") {
    return (
      <div className="min-h-screen bg-[#070a11] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        {/* ── TOP ANNOUNCEMENT BANNER ── */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 relative z-50">
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            🌸 NEW 2026 RELEASE
          </span>
          <span className="hidden sm:inline">
            Official 96th TOPIK Previous Papers & Timed Online Mock Tests are now live!
          </span>
          <button
            onClick={() => setMode("signup")}
            className="underline hover:text-white font-bold ml-1 flex items-center gap-1 cursor-pointer"
          >
            <span>Start Practice Free</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* ── ULTRA-COOL GLASSMORPHISM NAVBAR ── */}
        <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-[#070a11]/85 border-b border-slate-800/80 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* Mascot Brand Logo */}
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setMode("landing")}>
              <MascotLogo size="md" showTagline={true} />
            </div>

            {/* Floating Navigation Island */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 border border-slate-800/90 px-3 py-1.5 rounded-full shadow-inner">
              {[
                { label: "Vocabulary", badge: "4.3k", icon: "📚", onClick: () => setMode("signup") },
                { label: "Flashcards", badge: "SM-2", icon: "🎴", onClick: () => setMode("signup") },
                { label: "PYQs & Mocks", badge: "Live", icon: "📝", onClick: () => setMode("signup") },
                { label: "Writing Lab", badge: "51-54", icon: "✍️", onClick: () => setMode("signup") },
                { label: "Grammar Bank", icon: "📘", onClick: () => setMode("signup") },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all flex items-center gap-1.5 group"
                >
                  <span className="text-sm group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Right Quick Actions */}
            <div className="flex items-center gap-3">
              {/* Status Pill */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>100% Free</span>
              </div>

              {/* Login Button */}
              <button
                onClick={() => setMode("login")}
                className="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition-all"
              >
                Log In
              </button>

              {/* Start Free CTA Button */}
              <button
                onClick={() => setMode("signup")}
                className="relative group overflow-hidden px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#2563EB] via-indigo-600 to-[#8B5CF6] text-white font-black text-xs sm:text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>Start Free</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-pink-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Atmospheric Glowing Orbs */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/20 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-pink-500/15 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Text */}
              <div className="lg:col-span-6 space-y-7">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-purple-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-black shadow-lg">
                  <span>🌸</span>
                  <span>Official TOPIK I & TOPIK II Prep Operating System</span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.03]">
                  Your Path to{" "}
                  <br />
                  <span className="bg-gradient-to-r from-[#2563EB] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
                    TOPIK Success
                  </span>
                </h1>

                <p className="text-xs sm:text-sm font-black text-slate-400 tracking-widest uppercase flex items-center gap-2">
                  <span>Study</span>
                  <span className="text-indigo-400">•</span>
                  <span>Practice</span>
                  <span className="text-indigo-400">•</span>
                  <span>Master</span>
                  <span className="text-indigo-400">•</span>
                  <span className="text-rose-400">Ace Exam</span>
                </p>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg">
                  Master 4,333 official vocabulary words, grammar patterns, real past papers from TOPIK GUIDE, timed mock tests, and writing tasks with automated analytics.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setMode("signup")}
                    className="px-8 py-4 rounded-2xl bg-[#2563EB] hover:bg-blue-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2.5 transition-all hover:scale-105"
                  >
                    <span>Get Started — 100% Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setMode("login")}
                    className="px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700 transition-all"
                  >
                    Log In to Account
                  </button>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <div><strong className="text-white text-lg font-black block">1,671</strong>TOPIK I Words</div>
                  <div className="h-6 w-px bg-slate-800" />
                  <div><strong className="text-white text-lg font-black block">2,662</strong>TOPIK II Words</div>
                  <div className="h-6 w-px bg-slate-800" />
                  <div><strong className="text-emerald-400 text-lg font-black block">100%</strong>Free Forever</div>
                </div>
              </div>

              {/* Right: Korean Journey Illustration */}
              <div className="lg:col-span-6 relative">
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-b from-[#1b2b4e] via-[#1e3460] to-[#111c35] border border-indigo-500/30 shadow-2xl">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 520 390" fill="none" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                      <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#E2E8F0" />
                        <stop offset="100%" stopColor="#CBD5E1" />
                      </linearGradient>
                    </defs>
                    <rect width="520" height="390" fill="url(#sky)" />
                    {/* Mountains */}
                    <path d="M0 220 Q 130 150 270 195 T 520 175 L 520 390 L 0 390 Z" fill="#1e293b" opacity="0.7" />
                    <path d="M0 260 Q 200 200 360 235 T 520 220 L 520 390 L 0 390 Z" fill="#0f172a" opacity="0.9" />
                    {/* Seoul Tower */}
                    <g transform="translate(370, 100)" opacity="0.9">
                      <line x1="10" y1="0" x2="10" y2="65" stroke="#94A3B8" strokeWidth="3" />
                      <ellipse cx="10" cy="22" rx="10" ry="5" fill="#64748B" />
                      <line x1="10" y1="0" x2="10" y2="12" stroke="#38BDF8" strokeWidth="3.5" />
                      <circle cx="10" cy="2" r="2.5" fill="#F43F5E" />
                    </g>
                    {/* Palace */}
                    <g transform="translate(310, 155)">
                      <rect x="5" y="95" width="140" height="42" fill="#334155" rx="5" />
                      <rect x="22" y="62" width="9" height="33" fill="#DC2626" />
                      <rect x="68" y="62" width="9" height="33" fill="#DC2626" />
                      <rect x="115" y="62" width="9" height="33" fill="#DC2626" />
                      <path d="M-2 62 Q 77 40 158 62 L 148 46 Q 77 34 10 46 Z" fill="#1D4ED8" stroke="#60A5FA" strokeWidth="1.5" />
                      <rect x="38" y="30" width="7" height="22" fill="#DC2626" />
                      <rect x="95" y="30" width="7" height="22" fill="#DC2626" />
                      <path d="M18 30 Q 72 14 128 30 L 118 16 Q 72 5 28 16 Z" fill="#1D4ED8" stroke="#60A5FA" strokeWidth="1.5" />
                      <circle cx="73" cy="7" r="5" fill="#FBBF24" />
                    </g>
                    {/* Stone path */}
                    <path d="M 55 390 C 120 330, 150 285, 255 265 C 315 250, 355 245, 395 235" stroke="url(#pathGrad)" strokeWidth="42" strokeLinecap="round" fill="none" opacity="0.92" />
                    <path d="M 55 390 C 120 330, 150 285, 255 265 C 315 250, 355 245, 395 235" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="9,11" fill="none" />
                    {/* Cherry blossoms */}
                    <circle cx="410" cy="150" r="34" fill="#F472B6" opacity="0.85" />
                    <circle cx="440" cy="130" r="26" fill="#FBCFE8" opacity="0.9" />
                    <circle cx="395" cy="170" r="22" fill="#F472B6" opacity="0.8" />
                    <circle cx="30" cy="270" r="38" fill="#F472B6" opacity="0.75" />
                    <circle cx="55" cy="250" r="30" fill="#FBCFE8" opacity="0.85" />
                    {/* Petals */}
                    <circle cx="130" cy="190" r="3.5" fill="#FBCFE8" />
                    <circle cx="195" cy="155" r="4.5" fill="#F472B6" />
                    <circle cx="290" cy="130" r="3" fill="#FBCFE8" />
                    <circle cx="250" cy="225" r="4" fill="#F472B6" />
                    <circle cx="325" cy="175" r="3" fill="#FBCFE8" />
                    <circle cx="170" cy="240" r="2.5" fill="#F472B6" />
                  </svg>

                  {/* Milestone Signs */}
                  <div className="absolute top-[54%] left-[42%] z-20 -translate-x-1/2 -translate-y-1/2">
                    <div className="px-3 py-1.5 rounded-xl bg-[#2563EB] text-white text-[11px] font-black shadow-lg border border-white/20 flex items-center gap-1.5 animate-bounce" style={{animationDelay: '0s'}}>
                      📍 TOPIK I
                    </div>
                  </div>
                  <div className="absolute top-[43%] left-[60%] z-20 -translate-x-1/2 -translate-y-1/2">
                    <div className="px-3 py-1.5 rounded-xl bg-[#7C3AED] text-white text-[11px] font-black shadow-lg border border-white/20 flex items-center gap-1.5" style={{animationDelay: '0.3s'}}>
                      ⭐ TOPIK II
                    </div>
                  </div>
                  <div className="absolute top-[35%] left-[78%] z-20 -translate-x-1/2 -translate-y-1/2">
                    <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 text-[11px] font-black shadow-lg border border-white/30 flex items-center gap-1.5">
                      👑 Your Dream
                    </div>
                  </div>

                  {/* Mascot */}
                  <div className="absolute bottom-5 left-14 z-20 flex flex-col items-center gap-1">
                    <MascotLogo variant="icon" size="lg" />
                    <div className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-bold text-white border border-white/20">
                      Ready to study!
                    </div>
                  </div>

                  {/* UI Mock Navbar Overlay */}
                  <div className="absolute top-4 left-4 right-4 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center px-3 gap-3">
                    <div className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center">
                      <span className="text-[9px] font-black text-white">T</span>
                    </div>
                    <span className="text-[10px] font-bold text-white/90">TOPIKPath</span>
                    <div className="flex-1" />
                    <span className="text-[9px] text-white/60 font-semibold">🔥 5 days • ⚡ 320 XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why TOPIKPath Section */}
        <section className="py-16 border-t border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Why section */}
              <div className="space-y-6">
                <h2 className="text-3xl font-black text-white">
                  Why <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">TOPIKPath</span>?
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Because learning Korean is a journey — and we're here to guide you, step by step, to your TOPIK goal.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: "🐾", title: "Friendly", desc: "Simple, clean, and motivating" },
                    { icon: "🧭", title: "Goal-Oriented", desc: "Track progress like LeetCode" },
                    { icon: "🧠", title: "Smart", desc: "AI-powered feedback & recommendations" },
                    { icon: "❤️", title: "Complete", desc: "Vocab, Grammar, Listening, Reading, Writing & More" },
                  ].map((item) => (
                    <div key={item.title} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-colors flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl shrink-0">{item.icon}</div>
                      <div>
                        <div className="font-bold text-sm text-white">{item.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Name meaning + taglines */}
              <div className="space-y-5">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/40 border border-indigo-500/30">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" /> Name Meaning
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="font-black text-sky-300 bg-sky-500/20 px-2.5 py-0.5 rounded-lg">TOPIK</span>
                      <span className="text-slate-300">= Test of Proficiency in Korean</span>
                    </div>
                    <div className="text-center font-bold text-indigo-400 text-lg">+</div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="font-black text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-lg">Path</span>
                      <span className="text-slate-300">= Your learning journey, step by step</span>
                    </div>
                  </div>
                  <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 text-center">
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Together:</div>
                    <div className="text-xl font-black text-white">"TOPIKPath"</div>
                    <div className="text-xs text-indigo-300 italic mt-1">Your guided journey to TOPIK success.</div>
                    <div className="flex items-center justify-center gap-3 mt-2 text-indigo-400">
                      <span>🌸</span>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full" />
                      <span>🏯</span>
                    </div>
                  </div>
                </div>

                {/* Tagline ribbon */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/60 to-purple-950/40 border border-indigo-500/30 flex items-center justify-around text-sm font-bold text-slate-200">
                  <div className="flex items-center gap-2"><span className="text-rose-400">❤️</span> Learn Today.</div>
                  <span className="text-indigo-400">→</span>
                  <div className="flex items-center gap-2"><span className="text-sky-400">📘</span> Practice Daily.</div>
                  <span className="text-indigo-400">→</span>
                  <div className="flex items-center gap-2"><span className="text-amber-400">⭐</span> Master TOPIK.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-slate-900/20 border-t border-slate-800/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-3">
              <h2 className="text-3xl font-black text-white">Everything You Need to Pass TOPIK</h2>
              <p className="text-slate-400 text-sm">One platform, complete preparation, zero guesswork.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-850 transition-all group cursor-pointer">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <div className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">{f.title}</div>
                  <div className="text-xs text-slate-400 mt-1">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner Section */}
        <section className="py-20 border-t border-slate-800/60 relative overflow-hidden bg-gradient-to-b from-transparent via-indigo-950/20 to-slate-950">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
            <MascotLogo size="lg" className="justify-center" />
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Start Your Path to <span className="bg-gradient-to-r from-[#2563EB] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">TOPIK Mastery</span>
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
                Join ambitious Korean language learners mastering vocabulary, grammar, past papers, and timed mock tests. 100% free forever.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setMode("signup")}
                className="px-8 py-4 rounded-2xl bg-[#2563EB] hover:bg-blue-500 text-white font-black text-base shadow-2xl shadow-blue-600/40 flex items-center gap-3 transition-all hover:scale-105"
              >
                <span>🎓</span> Create Free Account <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMode("login")}
                className="px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 font-bold text-sm border border-slate-700/80 transition-all"
              >
                Sign In to Account
              </button>
            </div>
          </div>
        </section>

        {/* ── AMAZING RICH FOOTER ── */}
        <footer className="border-t border-slate-800/80 bg-[#050811] text-slate-400 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
              {/* Brand Col (2 cols) */}
              <div className="lg:col-span-2 space-y-4">
                <MascotLogo size="md" showTagline />
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                  The all-in-one preparation operating system for TOPIK I & TOPIK II. Practice official past papers, master 4,333 words, drill grammar, and track your readiness step by step.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Learning Platform</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold">
                    v2.0 • 2026 Edition
                  </div>
                </div>
              </div>

              {/* Col 1: Learning Core */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider">
                  📚 Learn & Drill
                </h4>
                <ul className="space-y-2.5">
                  {[
                    { label: "TOPIK I Vocab (1,671 Words)", badge: "Free" },
                    { label: "TOPIK II Vocab (2,662 Words)", badge: "Full" },
                    { label: "SM-2 Flashcard Engine" },
                    { label: "Grammar Pattern Library" },
                    { label: "MCQ Practice Engine" },
                    { label: "Writing Lab (Tasks 51–54)" },
                  ].map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => setMode("signup")}
                        className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                      >
                        <span>{link.label}</span>
                        {link.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                            {link.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 2: Exams & PYQs */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider">
                  📝 PYQs & Mocks
                </h4>
                <ul className="space-y-2.5">
                  {[
                    { label: "96th TOPIK Past Papers", badge: "2025" },
                    { label: "91st TOPIK Past Papers" },
                    { label: "83rd TOPIK Past Papers" },
                    { label: "Timed Online Mock Tests" },
                    { label: "Score Progression Graphs" },
                    { label: "Weak Area Diagnostics" },
                  ].map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => setMode("signup")}
                        className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                      >
                        <span>{link.label}</span>
                        {link.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">
                            {link.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: Community & Resources */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider">
                  🌸 Resources & About
                </h4>
                <ul className="space-y-2.5">
                  {[
                    { label: "TOPIK GUIDE Integration" },
                    { label: "Study Schedule Planner" },
                    { label: "Mistake Notebook" },
                    { label: "XP & Daily Streak System" },
                    { label: "Personalized Study Plans" },
                    { label: "Official Exam Guidelines" },
                  ].map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => setMode("signup")}
                        className="hover:text-white transition-colors text-left"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Credit & Legal Strip */}
            <div className="mt-14 pt-8 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span>© {new Date().getFullYear()} TOPIKPath. All rights reserved.</span>
                <span>•</span>
                <span>Made with 💖 for Korean learners worldwide 🌸</span>
              </div>

              <div className="flex items-center gap-6">
                <button onClick={() => setMode("signup")} className="hover:text-slate-300 transition-colors">
                  Privacy Policy
                </button>
                <button onClick={() => setMode("signup")} className="hover:text-slate-300 transition-colors">
                  Terms of Service
                </button>
                <button onClick={() => setMode("signup")} className="hover:text-slate-300 transition-colors">
                  Study Guidelines
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // ── AUTH MODAL (Login / Signup) ──
  return (
    <div className="min-h-screen bg-[#070a11] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Back to landing */}
        <button
          onClick={() => { setMode("landing"); setError(""); }}
          className="mb-6 text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          ← Back to Home
        </button>

        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 shadow-2xl space-y-6">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <MascotLogo size="md" showTagline />
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === "login" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode("signup"); setError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === "signup" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
            >
              Sign Up Free
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-950/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-950/90 border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Logging in...</> : <>Log In to TOPIKPath <ArrowRight className="w-4 h-4" /></>}
              </button>
              <p className="text-center text-xs text-slate-400">
                No account?{" "}
                <button type="button" onClick={() => { setMode("signup"); setError(""); }} className="text-indigo-400 hover:underline font-semibold">
                  Sign up free
                </button>
              </p>
            </form>
          )}

          {/* Signup Form */}
          {mode === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full bg-slate-950/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-950/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password (min. 6 chars)"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-950/90 border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-2 block">My TOPIK Target</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "TOPIK_I", label: "TOPIK I", sub: "Level 1–2 (Beginner)" },
                    { id: "TOPIK_II", label: "TOPIK II", sub: "Level 3–6 (Intermediate+)" },
                  ].map(opt => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setTargetLevel(opt.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${targetLevel === opt.id ? "bg-indigo-600 border-indigo-400 text-white" : "bg-slate-950/80 border-slate-700 text-slate-300 hover:border-indigo-500/50"}`}
                    >
                      <div className="font-bold text-xs">{opt.label}</div>
                      <div className="text-[10px] opacity-70 mt-0.5">{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</> : <>Create Free Account 🎓</>}
              </button>
              <p className="text-center text-xs text-slate-400">
                Have an account?{" "}
                <button type="button" onClick={() => { setMode("login"); setError(""); }} className="text-indigo-400 hover:underline font-semibold">
                  Log in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
