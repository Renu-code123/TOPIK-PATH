"use client";

import React from "react";
import { ExternalAttemptRecord } from "@/data/external-resources";
import { X, Calendar, Clock, Award, TrendingUp, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { ActiveSection } from "../navigation/Sidebar";

interface AttemptDetailModalProps {
  attempt: ExternalAttemptRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: ActiveSection) => void;
  onRetake: (resourceId: string) => void;
}

export const AttemptDetailModal: React.FC<AttemptDetailModalProps> = ({
  attempt,
  isOpen,
  onClose,
  onNavigate,
  onRetake,
}) => {
  if (!isOpen || !attempt) return null;

  const listeningPct = Math.round((attempt.listeningScore / 100) * 100);
  const readingPct = Math.round((attempt.readingScore / 100) * 100);
  const writingPct = attempt.writingScore !== undefined ? Math.round((attempt.writingScore / 100) * 100) : null;

  const getStatusBadge = (pct: number) => {
    if (pct >= 80) return <span className="text-emerald-400 font-bold">🟢 Strong ({pct}%)</span>;
    if (pct >= 60) return <span className="text-amber-400 font-bold">🟡 Developing ({pct}%)</span>;
    return <span className="text-rose-400 font-bold">🔴 Needs Focus ({pct}%)</span>;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b101b] border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-8 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <span>Attempt #{attempt.attemptNumber} Breakdown</span>
            <span>•</span>
            <span className="text-slate-400">{attempt.examType.replace("_", " ")}</span>
          </div>
          <h3 className="text-xl font-black text-white">{attempt.resourceTitle}</h3>
        </div>

        {/* Score Ribbon */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase">Total Score</div>
            <div className="text-3xl font-black text-white mt-1">
              {attempt.totalScore} <span className="text-sm font-normal text-slate-400">/ {attempt.maxScore}</span>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="text-xs text-slate-400 flex items-center justify-end gap-1 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {attempt.attemptDate}
            </div>
            {attempt.timeTakenMinutes && (
              <div className="text-xs text-slate-400 flex items-center justify-end gap-1 font-semibold">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {attempt.timeTakenMinutes} mins
              </div>
            )}
          </div>
        </div>

        {/* Section Diagnostics */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Section Performance
          </div>

          <div className="space-y-2.5">
            {/* Listening */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">🎧</span>
                <div>
                  <div className="font-bold text-white">Listening Section</div>
                  <div className="text-[11px] text-slate-400">
                    {attempt.listeningScore} / 100 {attempt.listeningCorrect ? `(${attempt.listeningCorrect} Qs correct)` : ""}
                  </div>
                </div>
              </div>
              <div>{getStatusBadge(listeningPct)}</div>
            </div>

            {/* Reading */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">📖</span>
                <div>
                  <div className="font-bold text-white">Reading Section</div>
                  <div className="text-[11px] text-slate-400">
                    {attempt.readingScore} / 100 {attempt.readingCorrect ? `(${attempt.readingCorrect} Qs correct)` : ""}
                  </div>
                </div>
              </div>
              <div>{getStatusBadge(readingPct)}</div>
            </div>

            {/* Writing (if TOPIK II) */}
            {attempt.writingScore !== undefined && writingPct !== null && (
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">✍️</span>
                  <div>
                    <div className="font-bold text-white">Writing Section</div>
                    <div className="text-[11px] text-slate-400">
                      {attempt.writingScore} / 100 ({attempt.writingScoreSource || "Self"} Evaluation)
                    </div>
                  </div>
                </div>
                <div>{getStatusBadge(writingPct)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Reflection Notes if present */}
        {attempt.notes && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
              Study Reflection & Notes
            </div>
            <p className="text-xs text-slate-300 italic">"{attempt.notes}"</p>
          </div>
        )}

        {/* Dynamic Study Suggestion */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Recommended Next Practice</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {readingPct < 70
              ? "Reading speed and vocabulary in context are key opportunities. Solve 20 reading questions to build confidence."
              : "Great progress! Strengthen your knowledge by drilling grammar patterns and taking another timed simulation."}
          </p>
          <button
            onClick={() => {
              onClose();
              onNavigate(readingPct < 70 ? "mcq" : "grammar");
            }}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Start Practice Drills</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onRetake(attempt.resourceId);
            }}
            className="flex-1 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Retake This Paper</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
