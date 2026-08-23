"use client";

import React, { useState } from "react";
import { ExternalAttemptRecord } from "@/data/external-resources";
import { calculatePYQAnalytics } from "@/lib/pyq-analytics";
import { ScoreTrendChart } from "../analytics/ScoreTrendChart";
import { ActiveSection } from "../navigation/Sidebar";
import {
  User,
  Flame,
  Zap,
  Award,
  BookOpen,
  TrendingUp,
  Target,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BarChart2,
  ChevronRight,
} from "lucide-react";

interface ProfileViewProps {
  userName: string;
  email: string;
  targetLevel: string;
  xp: number;
  streak: number;
  masteredVocabCount: number;
  totalVocabCount: number;
  attempts: ExternalAttemptRecord[];
  onNavigate: (section: ActiveSection) => void;
  onOpenLogModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userName,
  email,
  targetLevel,
  xp,
  streak,
  masteredVocabCount,
  totalVocabCount,
  attempts,
  onNavigate,
  onOpenLogModal,
}) => {
  const isTopik2 = targetLevel === "TOPIK_II";
  const numLevel = isTopik2 ? 4 : 2;

  const analytics = calculatePYQAnalytics(
    attempts,
    isTopik2 ? "TOPIK_II" : "TOPIK_I",
    numLevel
  );

  const [activeReportTab, setActiveReportTab] = useState<"weekly" | "monthly">("weekly");

  // Overall Skill Percentages (Strictly dynamic with 0 default)
  const targetSyllabusTotal = isTopik2 ? 2662 : 1671;
  const vocabPct = Math.min(100, Math.round((masteredVocabCount / targetSyllabusTotal) * 100)) || 0;
  const grammarPct = 0;
  const listeningPct = analytics.sections.find((s) => s.section === "LISTENING")?.percentage || 0;
  const readingPct = analytics.sections.find((s) => s.section === "READING")?.percentage || 0;
  const writingPct = isTopik2 ? (analytics.sections.find((s) => s.section === "WRITING")?.percentage || 0) : undefined;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* ── 1. PROFILE HEADER CARD ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/90 via-[#0e162b] to-purple-950/70 border border-indigo-500/30 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-2xl">
              <div className="w-full h-full bg-[#090d16] rounded-[22px] flex items-center justify-center text-2xl sm:text-3xl font-black text-white">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{userName}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
                  TOPIK Scholar
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{email}</p>
              <div className="text-xs text-indigo-300 font-bold flex items-center gap-1.5 pt-0.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                <span>Target Goal: {targetLevel === "TOPIK_II" ? "TOPIK II (Level 4)" : "TOPIK I (Level 2)"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-sm font-bold shadow-md">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
              <div>
                <div className="text-xs text-amber-400/80">Streak</div>
                <div className="text-base leading-none font-black">{streak || 21} Days</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-sm font-bold shadow-md">
              <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400" />
              <div>
                <div className="text-xs text-indigo-400/80">Total XP</div>
                <div className="text-base leading-none font-black">{xp || 4280} XP</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. OVERALL SKILL PROGRESS & TOPIK READINESS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Overall Skill Matrix */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-400" />
              <span>📊 Overall Skill Progress</span>
            </h2>
            <span className="text-xs text-slate-400 font-semibold">Synced live</span>
          </div>

          <div className="space-y-3.5">
            {[
              { label: "Vocabulary Mastery", pct: vocabPct, color: "from-indigo-500 to-blue-500", icon: "📚" },
              { label: "Grammar Patterns", pct: grammarPct, color: "from-purple-500 to-pink-500", icon: "📘" },
              { label: "Listening Comprehension", pct: listeningPct, color: "from-emerald-500 to-teal-500", icon: "🎧" },
              { label: "Reading Speed & Accuracy", pct: readingPct, color: "from-sky-500 to-cyan-500", icon: "📖" },
              ...(writingPct !== undefined
                ? [{ label: "Writing & Composition", pct: writingPct, color: "from-amber-500 to-rose-500", icon: "✍️" }]
                : []),
            ].map((skill) => (
              <div key={skill.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <span>{skill.icon}</span> {skill.label}
                  </span>
                  <span className="font-mono font-bold text-white">{skill.pct}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800/80">
                  <div
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, skill.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 cols: TOPIK Readiness Card */}
        <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>🎯 TOPIK Readiness</span>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                {analytics.readiness.confidence}
              </span>
            </div>

            <div>
              <div className="text-2xl font-black text-white">
                {analytics.readiness.examType.replace("_", " ")} — {analytics.readiness.targetLevel}
              </div>
              <div className="text-3xl font-black text-indigo-300 mt-1">
                {analytics.readiness.readinessPercentage}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Estimated Score</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {analytics.readiness.currentEstimatedScore} / {analytics.readiness.maxScore}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Target Gap</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">
                  {analytics.readiness.gapPoints === 0 ? "Goal Met! 🎯" : `${analytics.readiness.gapPoints} pts needed`}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="text-xs text-slate-400">
              Biggest Opportunity: <span className="text-slate-200 font-bold">{analytics.readiness.biggestOpportunity}</span>
            </div>
            <button
              onClick={() => onNavigate("pyq_hub")}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Preparation Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. SCORE PROGRESSION GRAPH (TRENDS) ── */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>📈 Mock Test Score Progression</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical performance across official TOPIK previous papers and mock simulations
            </p>
          </div>

          <button
            onClick={onOpenLogModal}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>+ Log New Test</span>
          </button>
        </div>

        <ScoreTrendChart attempts={analytics.sortedAttempts} maxScore={isTopik2 ? 300 : 200} />
      </div>

      {/* ── 4. WEAK SECTION DETECTION & AUTOMATIC STUDY RECOMMENDATIONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weak Section Diagnostics (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>🎯 Your Section Breakdown</span>
            </h2>
            <span className="text-xs text-slate-400">Score based</span>
          </div>

          <div className="space-y-3">
            {analytics.weakAreas.map((area) => (
              <div
                key={area.name}
                className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span>
                      {area.status === "STRONG" ? "🟢" : area.status === "DEVELOPING" ? "🟡" : "🔴"}
                    </span>
                    <span>{area.name}</span>
                  </div>
                  <span className="font-mono font-black text-slate-200">{area.percentage}%</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{area.recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Actionable Recommendations (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>🎯 Based on Your Latest Test Results</span>
            </h2>
            <span className="text-xs text-indigo-400 font-semibold">Smart Recommendation</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            TOPIKPath generated personalized practice missions to fix your weak areas and bridge your score to the next rank:
          </p>

          <div className="space-y-3">
            {analytics.recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/90 hover:border-indigo-500/40 flex items-center justify-between gap-4 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl shrink-0 mt-0.5">{rec.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs group-hover:text-indigo-300 transition-colors">
                        {rec.title}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-300 font-bold">
                        {rec.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{rec.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate(rec.targetSection)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shrink-0 flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <span>Start Practice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. MY GROWTH METRIC GRID (9 TILES) ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <span>📈 My Growth & Milestones</span>
          </h2>
          <span className="text-xs text-slate-400">All-time study statistics</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[
            { label: "Total Study Time", value: streak > 0 ? `${streak * 25}m` : "0m", icon: "⏳", color: "text-blue-400" },
            { label: "Questions Solved", value: `${analytics.count * (isTopik2 ? 104 : 70)}`, icon: "✍️", color: "text-purple-400" },
            { label: isTopik2 ? "TOPIK II Vocab" : "TOPIK I Vocab", value: `${masteredVocabCount} / ${targetSyllabusTotal}`, icon: "📚", color: "text-emerald-400" },
            { label: "Grammar Mastered", value: "0 / 150", icon: "📘", color: "text-sky-400" },
            { label: "PYQs Completed", value: `${analytics.count}`, icon: "📝", color: "text-amber-400" },
            { label: "Mock Tests Done", value: `${analytics.count}`, icon: "⏱️", color: "text-pink-400" },
            { label: "Average Score", value: `${analytics.averageScore} / ${isTopik2 ? 300 : 200}`, icon: "📊", color: "text-indigo-400" },
            { label: "Personal Best", value: `${analytics.bestScore} / ${isTopik2 ? 300 : 200}`, icon: "🏆", color: "text-emerald-400" },
            { label: "Current Streak", value: `${streak} Days`, icon: "🔥", color: "text-amber-400" },
            { label: "Overall Accuracy", value: analytics.averageScore > 0 ? `${Math.round((analytics.averageScore / (isTopik2 ? 300 : 200)) * 100)}%` : "0%", icon: "🎯", color: "text-teal-400" },
          ].map((card) => (
            <div
              key={card.label}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">{card.label}</span>
                <span className="text-base">{card.icon}</span>
              </div>
              <div className={`text-xl font-black ${card.color}`}>{card.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. PERSONAL RECORDS SHOWCASE ── */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>🏆 Personal Records Hall of Fame</span>
          </h2>
          <span className="text-xs text-amber-400 font-semibold">Your Peak Achievements</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Highest Mock Score</div>
            <div className="text-lg font-black text-amber-400">{analytics.personalRecords.highestMockScore} pts</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Highest Listening</div>
            <div className="text-lg font-black text-emerald-400">{analytics.personalRecords.highestListening} / 100</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Highest Reading</div>
            <div className="text-lg font-black text-sky-400">{analytics.personalRecords.highestReading} / 100</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Longest Session</div>
            <div className="text-lg font-black text-purple-400">{analytics.personalRecords.longestStudySessionMinutes} mins</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Most Qs / Day</div>
            <div className="text-lg font-black text-pink-400">{analytics.personalRecords.mostQuestionsInOneDay} Qs</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Peak Streak</div>
            <div className="text-lg font-black text-amber-400">{analytics.personalRecords.longestStreakDays} days</div>
          </div>
        </div>
      </div>

      {/* ── 7. GROWTH JOURNEY TIMELINE ── */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span>🗺️ Your TOPIK Journey Timeline</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { month: "June", event: "Started TOPIKPath", status: "completed", icon: "🌱" },
            { month: "July", event: "500 Vocab Mastered", status: "completed", icon: "📖" },
            { month: "August", event: "First PYQ Logged", status: "completed", icon: "📝" },
            { month: "August", event: "First Mock (160 pts)", status: "completed", icon: "⏱️" },
            { month: "September", event: "1,000 Vocab Target", status: "current", icon: "🎯" },
            { month: "November", event: "Official TOPIK Exam", status: "upcoming", icon: "🎓" },
          ].map((step, idx) => (
            <div
              key={step.month + idx}
              className={`p-4 rounded-2xl border text-xs space-y-1.5 relative ${
                step.status === "completed"
                  ? "bg-slate-950/90 border-indigo-500/40 text-slate-200"
                  : step.status === "current"
                  ? "bg-indigo-950/40 border-indigo-400 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-slate-950/40 border-slate-800 text-slate-500"
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold uppercase text-indigo-400">{step.month}</span>
                <span>{step.icon}</span>
              </div>
              <div className="font-bold text-white text-xs">{step.event}</div>
              <div className="text-[10px] text-slate-400 capitalize">{step.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 8. WEEKLY & MONTHLY PROGRESS REPORTS ── */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Periodic Performance Reports</h2>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveReportTab("weekly")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeReportTab === "weekly" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              📊 Weekly Report
            </button>
            <button
              onClick={() => setActiveReportTab("monthly")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeReportTab === "monthly" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              📅 Monthly Report
            </button>
          </div>
        </div>

        {activeReportTab === "weekly" ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 font-bold">STUDY TIME</div>
              <div className="text-lg font-black text-white">6h 42m</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 font-bold">QUESTIONS</div>
              <div className="text-lg font-black text-purple-400">284 Solved</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 font-bold">VOCAB MASTERED</div>
              <div className="text-lg font-black text-emerald-400">+127 Words</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 font-bold">SCORE GAIN</div>
              <div className="text-lg font-black text-indigo-400">+12 pts</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 font-bold">ACTIVE STUDY DAYS</div>
              <div className="text-lg font-black text-white">24 / 30 Days</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 font-bold">TOTAL STUDY TIME</div>
              <div className="text-lg font-black text-purple-400">28h 15m</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 font-bold">PYQS & MOCKS</div>
              <div className="text-lg font-black text-emerald-400">3 Completed</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 font-bold">MONTHLY SCORE DELTA</div>
              <div className="text-lg font-black text-indigo-400">138 → 160 (+22 pts)</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
