"use client";

import React, { useState, useEffect } from "react";
import { Clock, CheckCircle2, AlertCircle, Play, RotateCcw, Volume2, Award, ChevronRight, ChevronLeft } from "lucide-react";
import { SAMPLE_MOCK_TESTS, MockExam, MockQuestion } from "@/data/topik-mock-tests";

interface MockTestCenterProps {
  onAwardXp: (amount: number) => void;
  onIncrementMockTests: () => void;
}

export const MockTestCenter: React.FC<MockTestCenterProps> = ({
  onAwardXp,
  onIncrementMockTests,
}) => {
  const [selectedExam, setSelectedExam] = useState<MockExam | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);

  // Timer countdown
  useEffect(() => {
    let interval: any;
    if (isTestRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((s) => {
          if (s <= 1) {
            clearInterval(interval);
            handleSubmit();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTestRunning, secondsRemaining]);

  const startTest = (exam: MockExam) => {
    setSelectedExam(exam);
    setCurrentQIndex(0);
    setAnswers({});
    setSecondsRemaining(exam.timeLimitMinutes * 60);
    setIsTestRunning(true);
    setIsTestSubmitted(false);
  };

  const handleSelectAnswer = (qId: string, optionIdx: number) => {
    if (isTestSubmitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = () => {
    setIsTestRunning(false);
    setIsTestSubmitted(true);
    onAwardXp(150);
    onIncrementMockTests();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const playAudio = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // If not started yet, show Exam Selector
  if (!selectedExam) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <span>📝</span> Official Mock Exam Center
          </h2>
          <p className="text-xs text-slate-400">
            Simulate real exam pressure under timed conditions for TOPIK I and TOPIK II.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_MOCK_TESTS.map((exam) => (
            <div
              key={exam.id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                    {exam.examType.replace("_", " ")}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> {exam.timeLimitMinutes} Mins
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">{exam.title}</h3>
                <p className="text-xs text-slate-400">
                  Includes Listening & Reading sections designed to benchmark your current score.
                </p>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <strong className="text-white">{exam.questions.length} Items</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Score:</span>
                    <strong className="text-indigo-300">{exam.totalPoints} pts</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Thresholds:</span>
                    <span className="text-slate-400">
                      {exam.passLevel1Min ? `L1: ${exam.passLevel1Min}+ pts` : ""} {exam.passLevel2Min ? `• L2: ${exam.passLevel2Min}+ pts` : ""}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => startTest(exam)}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-white" /> Launch Simulated Test
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate score if submitted
  const score = selectedExam.questions.reduce((acc, q) => {
    return answers[q.id] === q.correctAnswer ? acc + q.points : acc;
  }, 0);

  const currentQ = selectedExam.questions[currentQIndex];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Test Topbar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            {selectedExam.examType.replace("_", " ")}
          </span>
          <h3 className="text-base font-bold text-white">{selectedExam.title}</h3>
        </div>

        {/* Live Timer or Score */}
        {!isTestSubmitted ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono font-bold text-sm">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
            >
              Submit Exam
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 font-bold text-sm">
              Score: {score}/{selectedExam.totalPoints} pts
            </div>
            <button
              onClick={() => setSelectedExam(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
            >
              Exit to Menu
            </button>
          </div>
        )}
      </div>

      {/* Question Palette Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {selectedExam.questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined;
          const isCurrent = currentQIndex === idx;
          let color = "bg-slate-850 text-slate-400 border-slate-750";

          if (isTestSubmitted) {
            const isCorrect = answers[q.id] === q.correctAnswer;
            color = isCorrect
              ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
              : "bg-rose-600/30 border-rose-500 text-rose-300";
          } else if (isAnswered) {
            color = "bg-indigo-600 text-white border-indigo-400";
          }

          if (isCurrent) {
            color += " ring-2 ring-white";
          }

          return (
            <button
              key={q.id}
              onClick={() => setCurrentQIndex(idx)}
              className={`w-9 h-9 rounded-xl font-bold text-xs border flex items-center justify-center shrink-0 transition-all ${color}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Question Display */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between text-xs">
          <span className="px-3 py-1 rounded-full bg-slate-800 text-indigo-300 font-bold">
            {currentQ.section} • Question {currentQ.questionNumber}
          </span>
          <span className="text-slate-400 font-semibold">{currentQ.points} Points</span>
        </div>

        {/* Listening Audio Script Box if section is LISTENING */}
        {currentQ.audioScript && (
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" /> [듣기 스크립트 / Audio Script]
              </span>
              <button
                onClick={() => playAudio(currentQ.audioScript || "")}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
              >
                🔊 Play Dialog
              </button>
            </div>
            <p className="text-xs text-slate-300 whitespace-pre-line font-medium leading-relaxed">
              {currentQ.audioScript}
            </p>
          </div>
        )}

        {/* Reading Passage Box if section is READING */}
        {currentQ.passage && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              [지문 / Reading Passage]
            </span>
            <p className="text-sm font-semibold text-slate-200 leading-relaxed">{currentQ.passage}</p>
          </div>
        )}

        {/* Question Prompt */}
        <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
          {currentQ.prompt}
        </h4>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = answers[currentQ.id] === idx;
            let style = "bg-slate-850 hover:bg-slate-800 border-slate-750 text-slate-200";

            if (isTestSubmitted) {
              if (idx === currentQ.correctAnswer) {
                style = "bg-emerald-600/90 text-white border-emerald-400 ring-2 ring-emerald-400";
              } else if (isSelected) {
                style = "bg-rose-600/90 text-white border-rose-400";
              } else {
                style = "bg-slate-900/40 text-slate-500 border-slate-800 opacity-40";
              }
            } else if (isSelected) {
              style = "bg-indigo-600 text-white border-indigo-400 shadow-md";
            }

            return (
              <button
                key={idx}
                disabled={isTestSubmitted}
                onClick={() => handleSelectAnswer(currentQ.id, idx)}
                className={`w-full p-4 rounded-2xl border text-left font-semibold text-xs sm:text-sm flex items-center gap-3 transition-all ${style}`}
              >
                <span className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center text-xs font-mono">
                  {idx + 1}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanations (after submit) */}
        {isTestSubmitted && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 animate-fade-in text-xs">
            <span className="font-bold text-indigo-400 uppercase tracking-wider">
              [해설 / Explanation]
            </span>
            <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}

        {/* Nav Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            disabled={currentQIndex === 0}
            onClick={() => setCurrentQIndex((i) => Math.max(0, i - 1))}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 disabled:opacity-30 flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <button
            disabled={currentQIndex === selectedExam.questions.length - 1}
            onClick={() => setCurrentQIndex((i) => Math.min(selectedExam.questions.length - 1, i + 1))}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 disabled:opacity-30 flex items-center gap-1.5"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
