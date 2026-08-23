"use client";

import React, { useState, useEffect } from "react";
import { Volume2, RotateCw, Check, Sparkles, Zap, ArrowLeft, ArrowRight, Star } from "lucide-react";
import { VocabEntry } from "@/data/topik-i-vocabulary";
import { calculateSM2 } from "@/lib/spaced-repetition";

interface FlashcardsStudioProps {
  vocabulary: VocabEntry[];
  masteredIds: number[];
  onToggleMastery: (id: number) => void;
  onAwardXp: (amount: number) => void;
  selectedTarget: "ALL" | "TOPIK_I" | "TOPIK_II";
}

export const FlashcardsStudio: React.FC<FlashcardsStudioProps> = ({
  vocabulary,
  masteredIds,
  onToggleMastery,
  onAwardXp,
  selectedTarget,
}) => {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  const activePool = React.useMemo(() => {
    const list = vocabulary.filter((v) => selectedTarget === "ALL" || v.level === selectedTarget);
    return list.length > 0 ? list : vocabulary;
  }, [vocabulary, selectedTarget]);

  const current = activePool[index % activePool.length] || activePool[0];

  const playAudio = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSM2Rating = (grade: number) => {
    // Grade: 1 (Again), 3 (Hard), 4 (Good), 5 (Easy)
    calculateSM2({
      repetition: 0,
      interval: 1,
      easinessFactor: 2.5,
      grade,
    });

    if (grade >= 4) {
      onAwardXp(20);
      if (!masteredIds.includes(current.originalNumber)) {
        onToggleMastery(current.originalNumber);
      }
    } else {
      onAwardXp(5);
    }

    setSessionCount((c) => c + 1);
    setIsFlipped(false);
    setIndex((prev) => (prev + 1) % activePool.length);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Studio Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <span>🎴</span> Flashcards Studio
          </h2>
          <p className="text-xs text-slate-400">
            SM-2 spaced repetition active recall. Rate your retention after flipping.
          </p>
        </div>
        <div className="text-xs font-bold text-indigo-300 bg-indigo-950/50 px-3 py-1.5 rounded-xl border border-indigo-500/30">
          Reviewed: {sessionCount}
        </div>
      </div>

      {/* Progress Line */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Card {index + 1} of {activePool.length}</span>
          <span>{Math.round(((index + 1) / activePool.length) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-300"
            style={{ width: `${((index + 1) / activePool.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer min-h-[350px] rounded-3xl p-8 bg-gradient-to-br from-slate-900/90 via-slate-900 to-indigo-950/40 border border-slate-700/80 hover:border-indigo-500/60 shadow-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.01]"
      >
        {/* Top Info */}
        <div className="flex items-center justify-between text-xs">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
            {current.level.replace("_", " ")} • Level {current.topikLevel}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <RotateCw className="w-3.5 h-3.5" /> Tap card to flip
          </span>
        </div>

        {/* Card Content Area */}
        {!isFlipped ? (
          /* FRONT SIDE */
          <div className="text-center my-auto space-y-4">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">
              Korean Prompt
            </span>
            <h3 className="text-5xl font-black text-white tracking-wide">{current.korean}</h3>
            {current.romanization && (
              <p className="text-sm text-slate-400 italic">[{current.romanization}]</p>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                playAudio(current.korean);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-800 hover:bg-indigo-600 text-xs font-bold text-slate-200 transition-all shadow-md"
            >
              <Volume2 className="w-4 h-4" /> Listen Audio
            </button>
          </div>
        ) : (
          /* BACK SIDE */
          <div className="text-center my-auto space-y-4 animate-fade-in">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
              English Meaning
            </span>
            <h3 className="text-3xl font-black text-sky-200">{current.english}</h3>
            <div className="text-xs text-slate-400 capitalize">
              Part of speech: <span className="text-slate-200 font-bold">{current.partOfSpeech || "Vocab"}</span>
            </div>

            {current.exampleSentence && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left text-xs space-y-1">
                <p className="text-slate-200 font-semibold">{current.exampleSentence}</p>
                <p className="text-slate-400">{current.exampleTranslation}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer State */}
        <div className="text-center text-xs text-slate-400 border-t border-slate-800/80 pt-3 flex items-center justify-between">
          <span>Category: {current.category}</span>
          <span className="font-semibold text-emerald-400">
            {masteredIds.includes(current.originalNumber) ? "★ In Mastered List" : "Needs Review"}
          </span>
        </div>
      </div>

      {/* Spaced Repetition Response Buttons */}
      {isFlipped ? (
        <div className="space-y-2 animate-fade-in">
          <p className="text-xs text-center font-bold text-slate-400 uppercase tracking-wider">
            How well did you recall this?
          </p>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleSM2Rating(1)}
              className="p-3 rounded-2xl bg-rose-950/50 hover:bg-rose-900/80 border border-rose-600/40 text-rose-300 font-bold text-xs flex flex-col items-center gap-1 transition-all"
            >
              <span>🔴 Again</span>
              <span className="text-[10px] text-rose-400 font-normal">&lt; 1 min</span>
            </button>
            <button
              onClick={() => handleSM2Rating(3)}
              className="p-3 rounded-2xl bg-amber-950/50 hover:bg-amber-900/80 border border-amber-600/40 text-amber-300 font-bold text-xs flex flex-col items-center gap-1 transition-all"
            >
              <span>🟡 Hard</span>
              <span className="text-[10px] text-amber-400 font-normal">1 day</span>
            </button>
            <button
              onClick={() => handleSM2Rating(4)}
              className="p-3 rounded-2xl bg-sky-950/50 hover:bg-sky-900/80 border border-sky-600/40 text-sky-300 font-bold text-xs flex flex-col items-center gap-1 transition-all"
            >
              <span>🔵 Good</span>
              <span className="text-[10px] text-sky-400 font-normal">3 days</span>
            </button>
            <button
              onClick={() => handleSM2Rating(5)}
              className="p-3 rounded-2xl bg-emerald-950/50 hover:bg-emerald-900/80 border border-emerald-600/40 text-emerald-300 font-bold text-xs flex flex-col items-center gap-1 transition-all"
            >
              <span>🟢 Easy</span>
              <span className="text-[10px] text-emerald-400 font-normal">5 days (+20 XP)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setIsFlipped(false);
              setIndex((p) => (p > 0 ? p - 1 : activePool.length - 1));
            }}
            className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-slate-300 flex items-center justify-center gap-1 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          <button
            onClick={() => setIsFlipped(true)}
            className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-1 transition-all"
          >
            <RotateCw className="w-4 h-4" /> Flip Card (Space)
          </button>
          <button
            onClick={() => {
              setIsFlipped(false);
              setIndex((p) => (p + 1) % activePool.length);
            }}
            className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-slate-300 flex items-center justify-center gap-1 transition-all"
          >
            Skip <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
