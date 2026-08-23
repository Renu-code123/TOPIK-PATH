"use client";

import React, { useState, useMemo } from "react";
import { Search, Volume2, Check, Bookmark, Sparkles, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { VocabEntry } from "@/data/topik-i-vocabulary";

interface VocabExplorerProps {
  vocabulary: VocabEntry[];
  masteredIds: number[];
  onToggleMastery: (id: number) => void;
  selectedTarget: "ALL" | "TOPIK_I" | "TOPIK_II";
}

export const VocabExplorer: React.FC<VocabExplorerProps> = ({
  vocabulary,
  masteredIds,
  onToggleMastery,
  selectedTarget,
}) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedPos, setSelectedPos] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModalWord, setActiveModalWord] = useState<VocabEntry | null>(null);
  const pageSize = 15;

  // Extract unique categories & POS
  const categories = useMemo(() => {
    const set = new Set<string>();
    vocabulary.forEach((v) => {
      if (v.category) set.add(v.category);
    });
    return ["ALL", ...Array.from(set)];
  }, [vocabulary]);

  const partsOfSpeech = useMemo(() => {
    const set = new Set<string>();
    vocabulary.forEach((v) => {
      if (v.partOfSpeech) set.add(v.partOfSpeech);
    });
    return ["ALL", ...Array.from(set)];
  }, [vocabulary]);

  // Filtered List
  const filtered = useMemo(() => {
    return vocabulary.filter((item) => {
      const matchTarget = selectedTarget === "ALL" || item.level === selectedTarget;
      const matchCat = selectedCategory === "ALL" || item.category === selectedCategory;
      const matchPos = selectedPos === "ALL" || item.partOfSpeech === selectedPos;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.korean.toLowerCase().includes(q) ||
        item.english.toLowerCase().includes(q) ||
        (item.romanization && item.romanization.toLowerCase().includes(q));
      return matchTarget && matchCat && matchPos && matchSearch;
    });
  }, [vocabulary, selectedTarget, selectedCategory, selectedPos, search]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const playAudio = (koreanText: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(koreanText);
      utterance.lang = "ko-KR";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <span>📚</span> Vocabulary Explorer
          </h2>
          <p className="text-xs text-slate-400">
            Browse and master official TOPIK word sets with native pronunciation and sentence context.
          </p>
        </div>
        <div className="text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          Showing <strong className="text-indigo-400">{filtered.length}</strong> words (
          <span className="text-emerald-400">
            {masteredIds.filter((id) => filtered.some((f) => f.originalNumber === id)).length} mastered
          </span>
          )
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-900/70 p-4 rounded-2xl border border-slate-800/90">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search Hangul (e.g. 공부), English (e.g. study), or Romanization..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category Select */}
        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "ALL" ? "📂 All Categories" : `📂 ${cat}`}
              </option>
            ))}
          </select>
        </div>

        {/* Part of Speech */}
        <div className="sm:col-span-3">
          <select
            value={selectedPos}
            onChange={(e) => {
              setSelectedPos(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {partsOfSpeech.map((pos) => (
              <option key={pos} value={pos}>
                {pos === "ALL" ? "🏷️ All Parts of Speech" : `🏷️ ${pos}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Word Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginated.map((item) => {
          const isMastered = masteredIds.includes(item.originalNumber);
          return (
            <div
              key={item.originalNumber}
              onClick={() => setActiveModalWord(item)}
              className={`cursor-pointer group relative p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isMastered
                  ? "bg-emerald-950/15 border-emerald-500/30 hover:border-emerald-500/50"
                  : "bg-slate-900/60 hover:bg-slate-850 border-slate-800 hover:border-indigo-500/40"
              }`}
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-3 text-[11px]">
                  <span className="font-bold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                    {item.level.replace("_", " ")} • L{item.topikLevel}
                  </span>
                  <span className="text-slate-400 font-medium truncate max-w-[120px]">
                    {item.category}
                  </span>
                </div>

                {/* Korean + Audio */}
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-black text-white group-hover:text-indigo-300 transition-colors">
                      {item.korean}
                    </h3>
                    {item.romanization && (
                      <span className="text-xs text-slate-400 italic">[{item.romanization}]</span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio(item.korean);
                    }}
                    title="Pronounce"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all shrink-0"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* English */}
                <p className="mt-2 text-sm font-semibold text-sky-200">{item.english}</p>

                {/* Example sentence */}
                {item.exampleSentence && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/70 text-xs space-y-0.5">
                    <p className="text-slate-200 font-medium">{item.exampleSentence}</p>
                    <p className="text-slate-400 text-[11px]">{item.exampleTranslation}</p>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs">
                <span className="text-slate-400 capitalize">{item.partOfSpeech || "Vocabulary"}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMastery(item.originalNumber);
                  }}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all flex items-center gap-1 ${
                    isMastered
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  {isMastered ? "Mastered" : "Mark Known"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 disabled:opacity-30 hover:bg-slate-800 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <span className="text-xs font-medium text-slate-400 px-3">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 disabled:opacity-30 hover:bg-slate-800 flex items-center gap-1"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Word Detail Modal */}
      {activeModalWord && (
        <div
          onClick={() => setActiveModalWord(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0f172a] border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-scale-up"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                {activeModalWord.level.replace("_", " ")} • Level {activeModalWord.topikLevel}
              </span>
              <button
                onClick={() => setActiveModalWord(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black text-white">{activeModalWord.korean}</h2>
              {activeModalWord.romanization && (
                <p className="text-sm text-slate-400 italic">[{activeModalWord.romanization}]</p>
              )}
              <button
                onClick={() => playAudio(activeModalWord.korean)}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md"
              >
                <Volume2 className="w-4 h-4" /> Listen Audio
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Meaning</div>
              <div className="text-lg font-bold text-sky-300">{activeModalWord.english}</div>
            </div>

            {activeModalWord.exampleSentence && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Example Usage</div>
                <p className="text-sm font-semibold text-slate-200">{activeModalWord.exampleSentence}</p>
                <p className="text-xs text-slate-400">{activeModalWord.exampleTranslation}</p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  onToggleMastery(activeModalWord.originalNumber);
                }}
                className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${
                  masteredIds.includes(activeModalWord.originalNumber)
                    ? "bg-emerald-600 text-white"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                }`}
              >
                {masteredIds.includes(activeModalWord.originalNumber) ? "✓ Mastered" : "+ Mark Known (+15 XP)"}
              </button>
              <button
                onClick={() => setActiveModalWord(null)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
