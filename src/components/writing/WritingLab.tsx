"use client";

import React, { useState } from "react";
import { PenTool, CheckCircle2, Sparkles, HelpCircle, ArrowRight, Eye, RefreshCw } from "lucide-react";
import { WRITING_TASKS, WritingTask } from "@/data/topik-writing-prompts";

interface WritingLabProps {
  onAwardXp: (amount: number) => void;
  onIncrementWritings: () => void;
}

export const WritingLab: React.FC<WritingLabProps> = ({
  onAwardXp,
  onIncrementWritings,
}) => {
  const [activeTask, setActiveTask] = useState<WritingTask>(WRITING_TASKS[0]);
  const [userText, setUserText] = useState("");
  const [showSample, setShowSample] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    feedback: string[];
    submitted: boolean;
  } | null>(null);

  const charCount = userText.trim().length;

  const handleEvaluate = () => {
    if (!userText.trim()) return;

    const feedback: string[] = [];
    let score = Math.round(activeTask.maxPoints * 0.5); // base score

    // Check keyword usage
    const matchedPhrases = activeTask.keyPhrases.filter((p) => userText.includes(p.replace(/[-~]/g, "")));
    if (matchedPhrases.length > 0) {
      score += Math.min(Math.round(activeTask.maxPoints * 0.4), matchedPhrases.length * 4);
      feedback.push(`✓ Excellent usage of key target structures: ${matchedPhrases.join(", ")}`);
    } else {
      feedback.push("⚠️ Try to incorporate standard formal connectors (e.g. -에 따르면, -기 때문에).");
    }

    // Check character length requirements for 53/54
    if (activeTask.taskNumber === 53) {
      if (charCount >= 180 && charCount <= 320) {
        score += 3;
        feedback.push("✓ Character count perfectly aligns with the 200-300 character requirement.");
      } else {
        feedback.push(`ℹ️ Current length: ${charCount} chars. Target is 200–300 characters.`);
      }
    }

    score = Math.min(activeTask.maxPoints, Math.max(2, score));

    setEvaluation({
      score,
      feedback,
      submitted: true,
    });

    onAwardXp(80);
    onIncrementWritings();
  };

  const resetTask = (t: WritingTask) => {
    setActiveTask(t);
    setUserText("");
    setShowSample(false);
    setEvaluation(null);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <span>✍️</span> TOPIK II Writing Lab
        </h2>
        <p className="text-xs text-slate-400">
          Official Task 51, 52, 53, and 54 composition simulator with instant rubric evaluation.
        </p>
      </div>

      {/* Task Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {WRITING_TASKS.map((t) => (
          <button
            key={t.id}
            onClick={() => resetTask(t)}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTask.id === t.id
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-purple-400"
                : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800"
            }`}
          >
            <span>Task {t.taskNumber}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30">
              {t.maxPoints} pts
            </span>
          </button>
        ))}
      </div>

      {/* Task Content Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold text-purple-300">{activeTask.titleKo}</span>
            <span>Target: {activeTask.targetLength}</span>
          </div>
          <h3 className="text-xl font-bold text-white leading-snug">{activeTask.title}</h3>
        </div>

        {/* Prompt Text & Context Box */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3 text-xs">
          <p className="font-bold text-indigo-300">{activeTask.promptText}</p>
          {activeTask.contextBox && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 whitespace-pre-line leading-relaxed font-sans">
              {activeTask.contextBox}
            </div>
          )}
        </div>

        {/* Writing Tips & Key Structures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-slate-400">💡 Exam Strategy Tips:</span>
            <ul className="space-y-0.5 text-slate-300 list-disc list-inside">
              {activeTask.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1">
            <span className="font-bold text-purple-300">🔑 Recommended Connectors:</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeTask.keyPhrases.map((phrase, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-200 text-[11px] font-mono"
                >
                  {phrase}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Text Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <label className="font-bold text-slate-300">Your Korean Composition:</label>
            <span className="font-mono text-indigo-400 font-bold">
              {charCount} Characters
            </span>
          </div>

          <textarea
            rows={6}
            placeholder="Type your Korean response here using formal endings..."
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans leading-relaxed"
          />
        </div>

        {/* Evaluation Output */}
        {evaluation && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-3 animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Criteria Evaluation (+80 XP)
              </span>
              <span className="text-base font-black text-purple-300">
                Score: {evaluation.score} / {activeTask.maxPoints} pts
              </span>
            </div>
            <div className="space-y-1">
              {evaluation.feedback.map((item, i) => (
                <p key={i} className="text-slate-300 leading-relaxed">
                  {item}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Model Answer Toggle */}
        {showSample && (
          <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2 text-xs animate-fade-in">
            <span className="font-bold text-indigo-300 uppercase tracking-wider">
              [모범 답안 / Official Sample Answer]
            </span>
            <p className="text-sm font-semibold text-white whitespace-pre-line leading-relaxed">
              {activeTask.sampleAnswer}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setShowSample(!showSample)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-all"
          >
            <Eye className="w-4 h-4" /> {showSample ? "Hide Sample Answer" : "View Model Answer"}
          </button>

          <button
            onClick={handleEvaluate}
            disabled={!userText.trim()}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 flex items-center gap-2 disabled:opacity-40 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Run Automated Rubric Check
          </button>
        </div>
      </div>
    </div>
  );
};
