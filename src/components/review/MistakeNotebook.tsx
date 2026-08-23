"use client";

import React from "react";
import { Bookmark, Trash2, CheckCircle2, RefreshCw, Volume2 } from "lucide-react";
import { MistakeItem } from "../practice/MCQEngine";

interface MistakeNotebookProps {
  mistakes: MistakeItem[];
  onRemoveMistake: (id: string) => void;
  onClearAll: () => void;
  onStartPracticeMistakes: () => void;
}

export const MistakeNotebook: React.FC<MistakeNotebookProps> = ({
  mistakes,
  onRemoveMistake,
  onClearAll,
  onStartPracticeMistakes,
}) => {
  const playAudio = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (mistakes.length === 0) {
    return (
      <div className="max-w-md mx-auto p-10 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-3xl">
          ✨
        </div>
        <h2 className="text-xl font-bold text-white">Mistake Notebook is Clean!</h2>
        <p className="text-xs text-slate-400">
          Any questions you answer incorrectly during quizzes or mock exams will automatically appear here for targeted review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <span>📕</span> Auto Mistake Notebook
          </h2>
          <p className="text-xs text-slate-400">
            Target your weak points. Review explanation contexts and re-test yourself.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onStartPracticeMistakes}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Practice Weak Words
          </button>
          <button
            onClick={onClearAll}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>
      </div>

      {/* Mistakes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mistakes.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/30 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-black text-white">{item.korean}</h3>
                  <button
                    onClick={() => playAudio(item.korean)}
                    className="p-1 rounded-md bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-slate-400">{item.date}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-rose-400 font-semibold">Your Pick:</span>
                  <span className="text-slate-400 line-through">{item.selectedAnswer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400 font-semibold">Correct Answer:</span>
                  <span className="text-emerald-300 font-bold">{item.correctAnswer}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{item.explanation}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end">
              <button
                onClick={() => onRemoveMistake(item.id)}
                className="text-xs text-slate-400 hover:text-emerald-400 font-semibold flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
