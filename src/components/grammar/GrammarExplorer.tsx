"use client";

import React, { useState, useMemo } from "react";
import { Search, Volume2, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { TOPIK_GRAMMAR_POINTS, GrammarPoint } from "@/data/topik-grammar";

interface GrammarExplorerProps {
  selectedTarget: "ALL" | "TOPIK_I" | "TOPIK_II";
}

export const GrammarExplorer: React.FC<GrammarExplorerProps> = ({ selectedTarget }) => {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("ALL");
  const [expandedId, setExpandedId] = useState<string | null>("g1");

  const categories = useMemo(() => {
    const set = new Set<string>();
    TOPIK_GRAMMAR_POINTS.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return ["ALL", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return TOPIK_GRAMMAR_POINTS.filter((item) => {
      const matchTarget = selectedTarget === "ALL" || item.level === selectedTarget;
      const matchCat = selectedCat === "ALL" || item.category === selectedCat;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.pattern.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.explanation.toLowerCase().includes(q);
      return matchTarget && matchCat && matchSearch;
    });
  }, [selectedTarget, selectedCat, search]);

  const playAudio = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <span>📑</span> Core Grammar Patterns
          </h2>
          <p className="text-xs text-slate-400">
            Formulas, conjugation rules, sentence examples with speech, and common pitfall notes.
          </p>
        </div>
        <div className="text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 self-start">
          Showing <strong className="text-indigo-400">{filtered.length}</strong> patterns
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-900/70 p-4 rounded-2xl border border-slate-800/90">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search grammar pattern (e.g. ~(으)ㄹ 수 있다) or meaning (e.g. ability, because)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "ALL" ? "📂 All Categories" : `📂 ${c}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grammar Cards Accordion */}
      <div className="space-y-3">
        {filtered.map((g) => {
          const isExpanded = expandedId === g.id;
          return (
            <div
              key={g.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? "bg-slate-900/90 border-indigo-500/50 shadow-xl"
                  : "bg-slate-900/50 hover:bg-slate-850 border-slate-800"
              }`}
            >
              {/* Card Header Bar */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : g.id)}
                className="p-5 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                    {g.level.replace("_", " ")} • L{g.topikLevel}
                  </span>
                  <div>
                    <h3 className="text-xl font-black text-white">{g.pattern}</h3>
                    <p className="text-xs font-semibold text-sky-300 mt-0.5">{g.meaning}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-xs text-slate-400">{g.category}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-indigo-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Breakdown */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-4 animate-fade-in text-xs">
                  {/* Formation formula */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Conjugation Formula:
                    </span>
                    <p className="font-mono text-indigo-300 font-semibold">{g.formation}</p>
                  </div>

                  {/* Detailed explanation */}
                  <p className="text-slate-300 leading-relaxed">{g.explanation}</p>

                  {/* Example sentences */}
                  <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">{g.exampleKo}</p>
                      <p className="text-slate-400">{g.exampleEn}</p>
                    </div>
                    <button
                      onClick={() => playAudio(g.exampleKo)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all shrink-0"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Pitfalls note */}
                  {g.commonMistakes && (
                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-300/90 flex items-start gap-2 text-[11px]">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Common Pitfall:</strong> {g.commonMistakes}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
