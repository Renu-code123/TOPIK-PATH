"use client";

import React, { useState } from "react";
import { Calendar, Target, Clock, CheckCircle2, Award, Sparkles, BookOpen, Layers, HelpCircle } from "lucide-react";

export const StudyPlanner: React.FC = () => {
  const [targetLevel, setTargetLevel] = useState<number>(2);
  const [dailyMinutes, setDailyMinutes] = useState<number>(45);
  const [examDate, setExamDate] = useState<string>("2026-10-18");

  // Calculate days remaining
  const today = new Date();
  const targetDate = new Date(examDate);
  const diffTime = targetDate.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const weeklySchedule = [
    { day: "Monday", focus: "Core Vocabulary (50 Words)", type: "VOCAB", task: "Review Greetings & Nouns in Flashcards Studio", completed: true },
    { day: "Tuesday", focus: "Grammar Formulas (3 Patterns)", type: "GRAMMAR", task: "Conjugation practice: ~(으)ㄹ 수 있다, ~고 싶다", completed: true },
    { day: "Wednesday", focus: "MCQ Speed Practice (30 Qs)", type: "PRACTICE", task: "Complete 3 timed MCQ practice sets", completed: false },
    { day: "Thursday", focus: "Listening & Pronunciation", type: "LISTENING", task: "Practice dialogues with Korean speech player", completed: false },
    { day: "Friday", focus: "Writing Lab (Task 51 & 52)", type: "WRITING", task: "Submit 2 short paragraph completion exercises", completed: false },
    { day: "Saturday", focus: "Full Mock Test Simulation", type: "TEST", task: "Timed 15-min TOPIK mini mock exam", completed: false },
    { day: "Sunday", focus: "Mistake Notebook Resolution", type: "REVIEW", task: "Clear all logged incorrect question records", completed: false },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <span>🗺️</span> Personalized TOPIK Study Planner
        </h2>
        <p className="text-xs text-slate-400">
          Target milestones, daily pacing goals, and structured 7-day preparation roadmap.
        </p>
      </div>

      {/* Goal Setting Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Countdown Box */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs text-indigo-300 font-bold">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Next Exam</span>
            <span>{examDate}</span>
          </div>
          <div className="text-4xl font-black text-white">{daysRemaining} Days</div>
          <p className="text-xs text-slate-400">Remaining until the 84th Official TOPIK Exam.</p>
        </div>

        {/* Target Level */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-sky-300 font-bold">
            <span className="flex items-center gap-1.5"><Target className="w-4 h-4" /> Target Goal</span>
            <span>Level {targetLevel}</span>
          </div>
          <div className="flex gap-1.5 pt-1">
            {[1, 2, 3, 4, 5, 6].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setTargetLevel(lvl)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  targetLevel === lvl
                    ? "bg-sky-500 text-slate-950"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                L{lvl}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400">
            {targetLevel <= 2 ? "TOPIK I (Beginner 80-140 pts)" : "TOPIK II (Intermediate/Advanced)"}
          </p>
        </div>

        {/* Daily Study Time */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-bold">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Daily Pacing</span>
            <span>{dailyMinutes} Mins/Day</span>
          </div>
          <input
            type="range"
            min="15"
            max="120"
            step="15"
            value={dailyMinutes}
            onChange={(e) => setDailyMinutes(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <p className="text-[11px] text-slate-400">
            Pacing: ~{Math.round((dailyMinutes / 60) * 20)} words + 1 test session per day.
          </p>
        </div>
      </div>

      {/* 7-Day Curriculum Roadmap */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Weekly Master Syllabus
          </h3>
          <span className="text-xs text-slate-400">Week 1 of 8</span>
        </div>

        <div className="space-y-3">
          {weeklySchedule.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                item.completed
                  ? "bg-emerald-950/20 border-emerald-500/30"
                  : "bg-slate-950/70 border-slate-800/80 hover:border-indigo-500/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                    item.completed
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {item.completed ? "✓" : idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{item.day}:</span>
                    <span className="text-xs font-semibold text-indigo-300">{item.focus}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.task}</p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase self-start sm:self-auto ${
                  item.completed
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {item.completed ? "Completed" : "Scheduled"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
