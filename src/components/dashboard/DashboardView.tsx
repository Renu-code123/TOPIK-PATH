"use client";

import React from "react";
import {
  Zap,
  Flame,
  Award,
  BookOpen,
  HelpCircle,
  Clock,
  PenTool,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Bookmark,
  Target,
  Sparkles,
  ExternalLink,
  Calendar,
  FileCheck,
} from "lucide-react";
import { ActiveSection } from "../navigation/Sidebar";
import { getLevelFromXp, getNextLevelProgress } from "@/lib/xp";
import { ExternalAttemptRecord, TOPIK_EXTERNAL_RESOURCES } from "@/data/external-resources";
import { calculatePYQAnalytics } from "@/lib/pyq-analytics";

interface DashboardViewProps {
  xp: number;
  streak: number;
  masteredVocab: number;
  totalVocabCount: number;
  mistakesCount: number;
  attempts?: ExternalAttemptRecord[];
  onNavigate: (section: ActiveSection) => void;
  onStartQuickPractice: () => void;
  userName?: string;
  targetLevel?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  xp,
  streak,
  masteredVocab,
  totalVocabCount,
  mistakesCount,
  attempts = [],
  onNavigate,
  onStartQuickPractice,
  userName,
  targetLevel = "TOPIK_I",
}) => {
  const currentTier = getLevelFromXp(xp);
  const nextProgress = getNextLevelProgress(xp);
  const vocabPercent = Math.min(100, Math.round((masteredVocab / (totalVocabCount || 1671)) * 100)) || 1;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Calculate PYQ analytics
  const analytics = calculatePYQAnalytics(
    attempts,
    targetLevel === "TOPIK_II" ? "TOPIK_II" : "TOPIK_I",
    targetLevel === "TOPIK_II" ? 4 : 2
  );

  const latestAttempt = analytics.sortedAttempts[analytics.sortedAttempts.length - 1];
  const nextChallenge = analytics.nextRecommendedResource || TOPIK_EXTERNAL_RESOURCES[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── 1. PERSONALIZED WELCOME BANNER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-[#131c3a] to-purple-950/60 border border-indigo-500/30 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">🌸 TOPIKPath Command Center</div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {greeting}, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{userName || "Learner"}</span>! 👋
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Today's recommended mission: Practice with real past papers and boost your score.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate("pyq_hub")}
              className="px-5 py-2.5 rounded-2xl bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <FileCheck className="w-4 h-4" /> Practice PYQs & Mocks
            </button>
            <button
              onClick={onStartQuickPractice}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Zap className="w-4 h-4" /> Quick Quiz
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. METRIC COUNTERS & STATS GRID ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total XP",
            value: `${xp} XP`,
            sub: `${currentTier.title}`,
            icon: Zap,
            color: "text-indigo-400",
            bg: "bg-indigo-950/20 border-indigo-500/20",
          },
          {
            title: "Daily Streak",
            value: `${streak} Days`,
            sub: "Keep the flame burning",
            icon: Flame,
            color: "text-amber-400",
            bg: "bg-amber-950/20 border-amber-500/20",
          },
          {
            title: "Known Words",
            value: `${masteredVocab} / ${totalVocabCount}`,
            sub: `${vocabPercent}% of total syllabus`,
            icon: CheckCircle2,
            color: "text-emerald-400",
            bg: "bg-emerald-950/20 border-emerald-500/20",
          },
          {
            title: "PYQ / Mock Tests",
            value: `${analytics.count} Completed`,
            sub: `Best: ${analytics.bestScore} pts`,
            icon: Award,
            color: "text-blue-400",
            bg: "bg-blue-950/20 border-blue-500/20",
          },
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-2xl border ${metric.bg} flex flex-col justify-between space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{metric.title}</span>
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{metric.value}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{metric.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 3. PYQ WIDGETS: LATEST SCORE + NEXT CHALLENGE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Latest PYQ Score Widget (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 text-sm">
                  📝
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-blue-400">Latest Test Score</div>
                  <h3 className="font-bold text-white text-sm">
                    {latestAttempt ? latestAttempt.resourceTitle : "96th TOPIK I Mock Test"}
                  </h3>
                </div>
              </div>

              {analytics.improvement !== 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-lg font-bold ${analytics.improvement > 0 ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>
                  {analytics.improvement > 0 ? `+${analytics.improvement}` : analytics.improvement} pts
                </span>
              )}
            </div>

            {latestAttempt ? (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-black text-white">
                    {latestAttempt.totalScore} <span className="text-xs font-normal text-slate-400">/ {latestAttempt.maxScore}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {latestAttempt.attemptDate}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-800">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Listening</div>
                    <div className="font-bold text-emerald-400 mt-0.5">{latestAttempt.listeningScore} / 100</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Reading</div>
                    <div className="font-bold text-sky-400 mt-0.5">{latestAttempt.readingScore} / 100</div>
                  </div>
                  {latestAttempt.writingScore !== undefined && (
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Writing</div>
                      <div className="font-bold text-amber-400 mt-0.5">{latestAttempt.writingScore} / 100</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-400">No previous test logged yet.</p>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate("pyq_hub")}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View All Past Scores & Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Next Challenge Widget (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-900 border border-slate-800 p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 text-sm">
                🎯
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-400">Next Target Challenge</div>
                <h3 className="font-bold text-white text-sm">{nextChallenge.title}</h3>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed">
                {nextChallenge.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1">
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
                  ⏱️ {nextChallenge.timeLimitMins || 100} Mins
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
                  📝 {nextChallenge.questionCount || 70} Questions
                </span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold">
                  +150 XP
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <a
              href={nextChallenge.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 transition-all hover:scale-102"
            >
              <span>Practice on TOPIK GUIDE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => onNavigate("pyq_hub")}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
            >
              Log Result
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. RECENT ACTIVITY FEED ── */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Recent Activity & Achievements</span>
          </h2>
          <span className="text-xs text-slate-400">Live feed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              title: "Completed 96th TOPIK I Mock",
              time: "Today",
              xp: "+100 XP",
              icon: "📝",
              color: "text-blue-400",
            },
            {
              title: "Mastered 20 Vocabulary Words",
              time: "Yesterday",
              xp: "+100 XP",
              icon: "📚",
              color: "text-emerald-400",
            },
            {
              title: "Completed Grammar Challenge",
              time: "2 days ago",
              xp: "+50 XP",
              icon: "📘",
              color: "text-purple-400",
            },
            {
              title: "Completed 91st TOPIK I PYQ",
              time: "5 days ago",
              xp: "+100 XP",
              icon: "⏱️",
              color: "text-amber-400",
            },
          ].map((act, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3"
            >
              <div className="text-xl mt-0.5">{act.icon}</div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white">{act.title}</div>
                <div className="text-[10px] text-slate-500">{act.time}</div>
                <div className="text-[11px] font-mono font-bold text-indigo-400">{act.xp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. CORE PREPARATION TRACKS ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" /> TOPIK Preparation Tracks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Track 1: Vocab & Flashcards */}
          <div
            onClick={() => onNavigate("vocab")}
            className="group cursor-pointer p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-850 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform text-xl">
                📚
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                Vocabulary Studio
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explore 1,671+ TOPIK I & 2,662+ TOPIK II categorized words with native speech audio, romanization, and example sentences.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Studio</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Track 2: Practice & Mock Tests */}
          <div
            onClick={() => onNavigate("pyq_hub")}
            className="group cursor-pointer p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-sky-500/60 hover:bg-slate-850 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform text-xl">
                📝
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                PYQs & Mock Hub
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Practice 12+ official past papers on TOPIK GUIDE. Log your scores, review detailed section analysis, and bridge weak areas.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-sky-400 group-hover:translate-x-1 transition-transform">
              <span>Open PYQ Hub</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Track 3: Writing Lab */}
          <div
            onClick={() => onNavigate("writing")}
            className="group cursor-pointer p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/60 hover:bg-slate-850 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform text-xl">
                ✍️
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                Writing Lab (Tasks 51–54)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Practice official short sentence completion, graph analysis essays, and 700-character argument compositions.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>Enter Writing Lab</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
