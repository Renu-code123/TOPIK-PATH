"use client";

import React, { useState, useMemo } from "react";
import { Volume2, CheckCircle2, XCircle, ArrowRight, Zap, RefreshCw, Trophy, Bookmark } from "lucide-react";
import { VocabEntry } from "@/data/topik-i-vocabulary";
import { TOPIK_GRAMMAR_POINTS } from "@/data/topik-grammar";

export interface MistakeItem {
  id: string;
  korean: string;
  english: string;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  date: string;
}

interface MCQEngineProps {
  vocabulary: VocabEntry[];
  onAwardXp: (amount: number) => void;
  onAddMistake: (mistake: MistakeItem) => void;
  selectedTarget: "ALL" | "TOPIK_I" | "TOPIK_II";
}

export const MCQEngine: React.FC<MCQEngineProps> = ({
  vocabulary,
  onAwardXp,
  onAddMistake,
  selectedTarget,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizLength] = useState(10);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const activePool = useMemo(() => {
    const list = vocabulary.filter((v) => selectedTarget === "ALL" || v.level === selectedTarget);
    return list.length > 0 ? list : vocabulary;
  }, [vocabulary, selectedTarget]);

  // Generate 10 diverse questions
  const questions = useMemo(() => {
    const pool = [...activePool].sort(() => 0.5 - Math.random()).slice(0, 30);
    const qList = [];

    for (let i = 0; i < Math.min(quizLength, pool.length); i++) {
      const target = pool[i];
      const distractors = pool
        .filter((w) => w.originalNumber !== target.originalNumber)
        .slice(0, 3)
        .map((w) => w.english);

      const options = [...distractors, target.english].sort(() => 0.5 - Math.random());

      // Alternate question type
      const type = i % 3 === 0 ? "FILL_BLANK" : i % 3 === 1 ? "KO_TO_EN" : "EN_TO_KO";

      let prompt = `What is the correct meaning of "${target.korean}"?`;
      let displayedPrompt = target.korean;

      if (type === "FILL_BLANK" && target.exampleSentence) {
        prompt = `Fill in the blank:`;
        displayedPrompt = target.exampleSentence.replace(target.korean, "( ____ )");
      }

      qList.push({
        id: `q-${target.originalNumber}`,
        type,
        korean: target.korean,
        romanization: target.romanization,
        prompt,
        displayedPrompt,
        correctAnswer: target.english,
        options,
        example: target.exampleSentence,
        exampleTranslation: target.exampleTranslation,
      });
    }

    return qList;
  }, [activePool, quizLength]);

  const currentQ = questions[questionIndex % questions.length] || questions[0];

  const playAudio = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      setScore((s) => s + 1);
      onAwardXp(25);
    } else {
      // Record mistake
      onAddMistake({
        id: `mistake-${Date.now()}-${currentQ.korean}`,
        korean: currentQ.korean,
        english: currentQ.correctAnswer,
        selectedAnswer: option,
        correctAnswer: currentQ.correctAnswer,
        explanation: currentQ.example
          ? `Example: ${currentQ.example} (${currentQ.exampleTranslation})`
          : `Correct meaning is "${currentQ.correctAnswer}".`,
        date: new Date().toISOString().split("T")[0],
      });
    }
  };

  const handleNext = () => {
    if (questionIndex + 1 >= questions.length) {
      setSessionCompleted(true);
    } else {
      setIsAnswered(false);
      setSelectedOption(null);
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const restartQuiz = () => {
    setQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setSessionCompleted(false);
  };

  if (sessionCompleted) {
    const accuracy = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-md mx-auto p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-6 animate-scale-up">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-3xl">
          🏆
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white">Quiz Completed!</h2>
          <p className="text-xs text-slate-400">Great practice session for your TOPIK goal.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-2xl font-black text-white">{score}/{questions.length}</div>
            <div className="text-[11px] text-slate-400">Correct Answers</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-2xl font-black text-indigo-400">+{score * 25} XP</div>
            <div className="text-[11px] text-slate-400">Earned Experience</div>
          </div>
        </div>

        <button
          onClick={restartQuiz}
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Practice Another Set
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <span>🎯</span> MCQ Practice Engine
          </h2>
          <p className="text-xs text-slate-400">
            Timed 4-choice questions with real-time feedback & mistake logging.
          </p>
        </div>
        <div className="text-xs font-bold text-amber-300 bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-500/30">
          Score: {score}/{questions.length}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Question {questionIndex + 1} of {questions.length}</span>
          <span>{Math.round(((questionIndex + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-300"
            style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
        {/* Question Prompt */}
        <div className="text-center py-6 px-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
            {currentQ.prompt}
          </p>
          <h3 className="text-3xl sm:text-4xl font-black text-white">{currentQ.displayedPrompt}</h3>
          {currentQ.romanization && (
            <p className="text-xs text-slate-400 italic">[{currentQ.romanization}]</p>
          )}
          <button
            onClick={() => playAudio(currentQ.korean)}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-indigo-600 text-xs text-slate-300 hover:text-white transition-all"
          >
            <Volume2 className="w-3.5 h-3.5" /> Listen Audio
          </button>
        </div>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((opt, idx) => {
            let style = "bg-slate-850 hover:bg-slate-800 border-slate-750 text-slate-200";

            if (isAnswered) {
              if (opt === currentQ.correctAnswer) {
                style = "bg-emerald-600/90 text-white border-emerald-400 ring-2 ring-emerald-400";
              } else if (opt === selectedOption) {
                style = "bg-rose-600/90 text-white border-rose-400";
              } else {
                style = "bg-slate-900/40 text-slate-500 border-slate-800 opacity-40";
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(opt)}
                className={`p-4 rounded-2xl border text-left font-semibold text-sm transition-all duration-150 flex items-center justify-between ${style}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center text-xs font-mono text-slate-400">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
                {isAnswered && opt === currentQ.correctAnswer && (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                )}
                {isAnswered && opt === selectedOption && opt !== currentQ.correctAnswer && (
                  <XCircle className="w-4 h-4 text-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Trigger */}
        {isAnswered && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-fade-in">
            <div className="flex items-center gap-2">
              {selectedOption === currentQ.correctAnswer ? (
                <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> Correct Answer! (+25 XP)
                </span>
              ) : (
                <span className="text-rose-400 font-bold text-sm">
                  Saved to Mistake Notebook. Correct: <strong className="underline">{currentQ.correctAnswer}</strong>
                </span>
              )}
            </div>

            {currentQ.example && (
              <div className="text-xs text-slate-300 space-y-0.5 bg-slate-900/80 p-3 rounded-xl">
                <p className="font-semibold text-slate-200">Context: {currentQ.example}</p>
                <p className="text-slate-400">{currentQ.exampleTranslation}</p>
              </div>
            )}

            <button
              onClick={handleNext}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            >
              Next Question <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
