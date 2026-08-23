"use client";

import React from "react";
import { Award, CheckCircle2, Lock, Sparkles, Zap } from "lucide-react";
import { ACHIEVEMENTS_LIST, UserStats } from "@/lib/achievements";

interface AchievementsModalProps {
  stats: UserStats;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ stats }) => {
  const unlockedCount = ACHIEVEMENTS_LIST.filter((a) => a.unlockedIf(stats)).length;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <span>🏆</span> Badges & Trophy Cabinet
          </h2>
          <p className="text-xs text-slate-400">
            Unlock achievements by maintaining study streaks, mastering vocabulary, and passing mock tests.
          </p>
        </div>
        <div className="text-xs font-bold text-amber-300 bg-amber-950/40 px-4 py-2 rounded-2xl border border-amber-500/30 self-start">
          Unlocked: {unlockedCount} / {ACHIEVEMENTS_LIST.length} Badges
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {ACHIEVEMENTS_LIST.map((item) => {
          const isUnlocked = item.unlockedIf(stats);

          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                isUnlocked
                  ? "bg-gradient-to-b from-slate-900/90 to-amber-950/20 border-amber-500/40 shadow-lg"
                  : "bg-slate-900/40 border-slate-800/80 opacity-60"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                      isUnlocked ? "bg-amber-500/20 border border-amber-500/40" : "bg-slate-800"
                    }`}
                  >
                    {isUnlocked ? item.icon : "🔒"}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isUnlocked
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    +{item.xpReward} XP
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-white">{item.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-semibold uppercase">
                  {item.category}
                </span>
                <span
                  className={`font-bold flex items-center gap-1 text-[11px] ${
                    isUnlocked ? "text-emerald-400" : "text-slate-500"
                  }`}
                >
                  {isUnlocked ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" /> Locked
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
