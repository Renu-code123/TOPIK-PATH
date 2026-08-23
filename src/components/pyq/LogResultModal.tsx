"use client";

import React, { useState, useEffect } from "react";
import { ExternalResourceItem, ExternalAttemptRecord, TOPIK_EXTERNAL_RESOURCES } from "@/data/external-resources";
import { X, CheckCircle2, Award, Sparkles, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

interface LogResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialResource?: ExternalResourceItem | null;
  onSaveAttempt: (attempt: Omit<ExternalAttemptRecord, "id">) => void;
  previousAttempts: ExternalAttemptRecord[];
}

export const LogResultModal: React.FC<LogResultModalProps> = ({
  isOpen,
  onClose,
  initialResource,
  onSaveAttempt,
  previousAttempts,
}) => {
  const [selectedResourceId, setSelectedResourceId] = useState<string>(
    initialResource?.id || TOPIK_EXTERNAL_RESOURCES[0].id
  );
  const [attemptDate, setAttemptDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [listeningScore, setListeningScore] = useState<string>("");
  const [readingScore, setReadingScore] = useState<string>("");
  const [writingScore, setWritingScore] = useState<string>("");
  const [writingSource, setWritingSource] = useState<"SELF" | "TEACHER" | "AI" | "EXTERNAL">("SELF");

  // Optional Advanced Fields
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [listeningCorrect, setListeningCorrect] = useState<string>("");
  const [readingCorrect, setReadingCorrect] = useState<string>("");
  const [timeTaken, setTimeTaken] = useState<string>("90");
  const [notes, setNotes] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (initialResource) {
      setSelectedResourceId(initialResource.id);
    }
  }, [initialResource]);

  if (!isOpen) return null;

  const currentResource =
    TOPIK_EXTERNAL_RESOURCES.find((r) => r.id === selectedResourceId) ||
    TOPIK_EXTERNAL_RESOURCES[0];

  const isTopik2 = currentResource.examType === "TOPIK_II";
  const maxScore = isTopik2 ? 300 : 200;

  // Real-time automatic total calculation (strictly enforced)
  const numListening = Math.min(100, Math.max(0, parseInt(listeningScore, 10) || 0));
  const numReading = Math.min(100, Math.max(0, parseInt(readingScore, 10) || 0));
  const numWriting = isTopik2 ? Math.min(100, Math.max(0, parseInt(writingScore, 10) || 0)) : 0;
  const calculatedTotal = numListening + numReading + numWriting;

  // Check personal best
  const previousSameLevel = previousAttempts.filter((a) => a.examType === (isTopik2 ? "TOPIK_II" : "TOPIK_I"));
  const previousBest = previousSameLevel.length > 0 ? Math.max(...previousSameLevel.map((a) => a.totalScore)) : 0;
  const isPersonalBest = calculatedTotal > previousBest && calculatedTotal > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (listeningScore === "" || readingScore === "") {
      setError("Please enter both Listening and Reading scores.");
      return;
    }

    if (isTopik2 && writingScore === "") {
      setError("Please enter a Writing score for TOPIK II.");
      return;
    }

    const previousAttemptsForThisResource = previousAttempts.filter(
      (a) => a.resourceId === currentResource.id
    );

    const newAttempt: Omit<ExternalAttemptRecord, "id"> = {
      resourceId: currentResource.id,
      resourceTitle: currentResource.title,
      providerName: currentResource.providerName,
      examType: isTopik2 ? "TOPIK_II" : "TOPIK_I",
      examNumber: currentResource.examNumber,
      year: currentResource.year,
      format: currentResource.format,
      attemptNumber: previousAttemptsForThisResource.length + 1,
      attemptDate,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      listeningScore: numListening,
      readingScore: numReading,
      writingScore: isTopik2 ? numWriting : undefined,
      totalScore: calculatedTotal,
      maxScore,
      writingScoreSource: isTopik2 ? writingSource : undefined,
      listeningCorrect: listeningCorrect ? parseInt(listeningCorrect, 10) : undefined,
      listeningTotal: isTopik2 ? 50 : 30,
      readingCorrect: readingCorrect ? parseInt(readingCorrect, 10) : undefined,
      readingTotal: isTopik2 ? 50 : 40,
      timeTakenMinutes: timeTaken ? parseInt(timeTaken, 10) : undefined,
      status: "COMPLETED",
      notes: notes.trim() || undefined,
      resultSource: "MANUAL",
      isPersonalBest,
    };

    onSaveAttempt(newAttempt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b101b] border border-slate-700/80 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-8 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-2xl">
            📝
          </div>
          <div>
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Record External Exam Score
            </div>
            <h3 className="text-lg font-black text-white">Log Your Practice Result</h3>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Test & Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Exam Paper / Mock Test
              </label>
              <select
                value={selectedResourceId}
                onChange={(e) => setSelectedResourceId(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {TOPIK_EXTERNAL_RESOURCES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.year})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Attempt Date
              </label>
              <input
                type="date"
                value={attemptDate}
                onChange={(e) => setAttemptDate(e.target.value)}
                required
                className="w-full bg-slate-950/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Section Score Inputs */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Section Scores (Out of 100 each)
              </span>
              <span className="text-[11px] text-indigo-400 font-semibold">
                Target: {currentResource.examType.replace("_", " ")}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Listening Score */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  🎧 Listening (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 82"
                  value={listeningScore}
                  onChange={(e) => setListeningScore(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Reading Score */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  📖 Reading (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 78"
                  value={readingScore}
                  onChange={(e) => setReadingScore(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Writing Score (for TOPIK II) */}
              {isTopik2 && (
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    ✍️ Writing (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g. 55"
                    value={writingScore}
                    onChange={(e) => setWritingScore(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Writing Evaluation Source for TOPIK II */}
            {isTopik2 && (
              <div className="pt-2 border-t border-slate-800">
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  Writing Score Evaluation Source
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { id: "SELF", label: "Self Evaluation" },
                    { id: "TEACHER", label: "Teacher / Tutor" },
                    { id: "AI", label: "TOPIKPath AI" },
                    { id: "EXTERNAL", label: "External Result" },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setWritingSource(opt.id as any)}
                      className={`p-2 rounded-xl border text-center font-semibold transition-all ${
                        writingSource === opt.id
                          ? "bg-indigo-600 border-indigo-400 text-white"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Automatic Total Calculation Banner */}
            <div className="p-3.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-indigo-300">
                  Total Score (Auto Calculated)
                </div>
                <div className="text-2xl font-black text-white">
                  {calculatedTotal} <span className="text-sm font-normal text-slate-400">/ {maxScore}</span>
                </div>
              </div>

              {isPersonalBest && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold animate-bounce">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>New Personal Best! (+100 XP)</span>
                </div>
              )}
            </div>
          </div>

          {/* Collapsible Advanced Questions & Notes */}
          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-3 flex items-center justify-between text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span>Detailed Question Statistics & Review Notes (Optional)</span>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAdvanced && (
              <div className="p-4 pt-1 space-y-3 border-t border-slate-800 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">
                      Listening Correct Qs
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 24 / 30"
                      value={listeningCorrect}
                      onChange={(e) => setListeningCorrect(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">
                      Reading Correct Qs
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 31 / 40"
                      value={readingCorrect}
                      onChange={(e) => setReadingCorrect(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">
                      Time Taken (Minutes)
                    </label>
                    <input
                      type="number"
                      value={timeTaken}
                      onChange={(e) => setTimeTaken(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">
                    Reflections & Notes (e.g. "Struggled with Q25-30 or environment vocabulary")
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Note down specific difficulties to receive tailored study recommendations..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submission Button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-2xl bg-[#2563EB] hover:bg-blue-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-102"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Update Analytics (+100 XP)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
