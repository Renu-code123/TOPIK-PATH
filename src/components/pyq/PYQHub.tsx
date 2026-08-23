"use client";

import React, { useState, useMemo } from "react";
import {
  ExternalResourceItem,
  ExternalAttemptRecord,
  TOPIK_EXTERNAL_RESOURCES,
} from "@/data/external-resources";
import {
  BookOpen,
  Clock,
  Award,
  ExternalLink,
  CheckCircle2,
  Filter,
  Search,
  Bookmark,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Calendar,
  RotateCcw,
  Check,
} from "lucide-react";
import { StartMockModal } from "./StartMockModal";
import { LogResultModal } from "./LogResultModal";
import { AttemptDetailModal } from "./AttemptDetailModal";
import { ActiveSection } from "../navigation/Sidebar";

interface PYQHubProps {
  attempts: ExternalAttemptRecord[];
  onSaveAttempt: (attempt: Omit<ExternalAttemptRecord, "id">) => void;
  onAwardXp: (amount: number) => void;
  onNavigate: (section: ActiveSection) => void;
  initialTab?: "papers" | "mocks" | "attempts";
}

export const PYQHub: React.FC<PYQHubProps> = ({
  attempts,
  onSaveAttempt,
  onAwardXp,
  onNavigate,
  initialTab = "papers",
}) => {
  const [activeTab, setActiveTab] = useState<"papers" | "mocks" | "attempts">(initialTab);

  // Filters State
  const [filterExam, setFilterExam] = useState<string>("ALL");
  const [filterFormat, setFilterFormat] = useState<string>("ALL");
  const [filterSection, setFilterSection] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("topikpath_pyq_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // In-Progress Ongoing Test Tracking
  const [ongoingTest, setOngoingTest] = useState<{
    resource: ExternalResourceItem;
    startedAt: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem("topikpath_ongoing_test");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modals
  const [startModalResource, setStartModalResource] = useState<ExternalResourceItem | null>(null);
  const [logResultResource, setLogResultResource] = useState<ExternalResourceItem | null>(null);
  const [isLogResultOpen, setIsLogResultOpen] = useState(false);
  const [detailAttempt, setDetailAttempt] = useState<ExternalAttemptRecord | null>(null);

  // Toggle Bookmark
  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("topikpath_pyq_bookmarks", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Start External Practice Flow
  const handleConfirmStart = () => {
    if (!startModalResource) return;
    const testSession = {
      resource: startModalResource,
      startedAt: new Date().toISOString(),
    };
    setOngoingTest(testSession);
    try {
      localStorage.setItem("topikpath_ongoing_test", JSON.stringify(testSession));
    } catch {}

    // Open in external browser tab
    window.open(startModalResource.mockUrl || startModalResource.externalUrl, "_blank", "noopener,noreferrer");
    setStartModalResource(null);
  };

  const handleDismissOngoing = () => {
    setOngoingTest(null);
    try {
      localStorage.removeItem("topikpath_ongoing_test");
    } catch {}
  };

  const handleCompleteOngoing = () => {
    if (ongoingTest) {
      setLogResultResource(ongoingTest.resource);
      setIsLogResultOpen(true);
      handleDismissOngoing();
    }
  };

  // Filtered resources for Previous Papers tab
  const filteredPapers = useMemo(() => {
    return TOPIK_EXTERNAL_RESOURCES.filter((r) => {
      if (r.resourceType !== "PREVIOUS_PAPER") return false;

      // Exam Filter
      if (filterExam !== "ALL" && r.examType !== filterExam && r.examType !== "BOTH") return false;

      // Format Filter
      if (filterFormat !== "ALL" && r.format !== filterFormat) return false;

      // Section Filter
      if (filterSection === "LISTENING" && !r.hasListening) return false;
      if (filterSection === "READING" && !r.hasReading) return false;
      if (filterSection === "WRITING" && !r.hasWriting) return false;

      // Status Filter
      const hasCompleted = attempts.some((a) => a.resourceId === r.id && a.status === "COMPLETED");
      if (filterStatus === "COMPLETED" && !hasCompleted) return false;
      if (filterStatus === "NOT_ATTEMPTED" && hasCompleted) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchDesc = r.description.toLowerCase().includes(q);
        const matchNumber = `${r.examNumber}`.includes(q);
        if (!matchTitle && !matchDesc && !matchNumber) return false;
      }

      return true;
    });
  }, [filterExam, filterFormat, filterSection, filterStatus, searchQuery, attempts]);

  // Filtered resources for Mock Tests tab
  const filteredMocks = useMemo(() => {
    return TOPIK_EXTERNAL_RESOURCES.filter((r) => {
      if (r.resourceType !== "MOCK_TEST") return false;

      if (filterExam !== "ALL" && r.examType !== filterExam && r.examType !== "BOTH") return false;
      if (filterFormat !== "ALL" && r.format !== filterFormat) return false;

      const hasCompleted = attempts.some((a) => a.resourceId === r.id && a.status === "COMPLETED");
      if (filterStatus === "COMPLETED" && !hasCompleted) return false;
      if (filterStatus === "NOT_ATTEMPTED" && hasCompleted) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return r.title.toLowerCase().includes(q) || `${r.examNumber}`.includes(q);
      }

      return true;
    });
  }, [filterExam, filterFormat, filterStatus, searchQuery, attempts]);

  // Stats calculation
  const totalCompletedCount = attempts.filter((a) => a.status === "COMPLETED").length;
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.totalScore)) : 0;
  const latestAttempt = attempts[attempts.length - 1];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── 1. HERO SECTION ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950/80 via-[#0e162b] to-indigo-950/70 border border-blue-500/30 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold">
            <span>📝</span> Official Past Papers & Timed Mocks
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Practice the Real TOPIK
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                Build exam endurance with official previous question papers and timed mock tests. Complete tests on trusted external resources, then log your scores to update your TOPIKPath profile and study analytics.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setActiveTab("papers");
                  setFilterStatus("ALL");
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                <BookOpen className="w-4 h-4" /> Explore Previous Papers
              </button>
              <button
                onClick={() => {
                  setActiveTab("mocks");
                }}
                className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all"
              >
                <Clock className="w-4 h-4" /> Start a Mock Test
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>External practice provided via verified third-party resources (TOPIK GUIDE). Results logged securely to your profile.</span>
            </div>
            <div className="flex items-center gap-4 font-semibold text-slate-300">
              <span>📚 12+ Past Papers</span>
              <span>•</span>
              <span>⏱️ Timed Simulations</span>
              <span>•</span>
              <span>📈 Auto Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. ONGOING IN-PROGRESS TEST BANNER ── */}
      {ongoingTest && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl shrink-0 animate-pulse">
              ⏱️
            </div>
            <div>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Unfinished External Test In Progress
              </div>
              <div className="font-bold text-white text-sm">
                Did you complete the {ongoingTest.resource.title}?
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Started on {new Date(ongoingTest.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • Ready to log your score?
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleCompleteOngoing}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Enter My Result</span>
            </button>
            <button
              onClick={handleDismissOngoing}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
            >
              Mark Not Completed
            </button>
          </div>
        </div>
      )}

      {/* ── 3. NAVIGATION TABS & QUICK LOG BUTTON ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs sm:text-sm font-bold">
          {[
            { id: "papers", label: "📚 Previous Papers", count: filteredPapers.length },
            { id: "mocks", label: "⏱ Online Mock Tests", count: filteredMocks.length },
            { id: "attempts", label: "⭐ My Attempts", count: attempts.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === tab.id ? "bg-indigo-700 text-white" : "bg-slate-800 text-slate-400"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setLogResultResource(null);
            setIsLogResultOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-102"
        >
          <Award className="w-3.5 h-3.5" />
          <span>+ Log Any Test Result</span>
        </button>
      </div>

      {/* ── 4. FILTER BAR (for Papers and Mocks tabs) ── */}
      {activeTab !== "attempts" && (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search exam (e.g. 96th, 91st, reading, mock)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Exam Level Filter */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              {[
                { id: "ALL", label: "All Levels" },
                { id: "TOPIK_I", label: "TOPIK I" },
                { id: "TOPIK_II", label: "TOPIK II" },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setFilterExam(lvl.id)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    filterExam === lvl.id ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Filters Row */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-semibold text-[11px]">
              <Filter className="w-3 h-3 text-slate-400" /> Filter by:
            </span>

            {/* Format Filter */}
            <select
              value={filterFormat}
              onChange={(e) => setFilterFormat(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-medium text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Formats</option>
              <option value="NEW_FORMAT">New Format (2014-Present)</option>
              <option value="OLD_FORMAT">Old Format (Pre-2014)</option>
            </select>

            {/* Section Filter (Only for papers tab) */}
            {activeTab === "papers" && (
              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-medium text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Sections</option>
                <option value="LISTENING">🎧 Listening Available</option>
                <option value="READING">📖 Reading Available</option>
                <option value="WRITING">✍️ Writing Available</option>
              </select>
            )}

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-medium text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="NOT_ATTEMPTED">Not Attempted</option>
              <option value="COMPLETED">Completed</option>
            </select>

            {(filterExam !== "ALL" || filterFormat !== "ALL" || filterSection !== "ALL" || filterStatus !== "ALL" || searchQuery) && (
              <button
                onClick={() => {
                  setFilterExam("ALL");
                  setFilterFormat("ALL");
                  setFilterSection("ALL");
                  setFilterStatus("ALL");
                  setSearchQuery("");
                }}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 underline ml-auto font-medium"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── 5. TAB CONTENT: PREVIOUS PAPERS ── */}
      {activeTab === "papers" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span>Available Previous TOPIK Papers ({filteredPapers.length})</span>
            </h2>
            <span className="text-xs text-slate-400">Released official past examinations</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPapers.map((paper) => {
              const previousAttempts = attempts.filter((a) => a.resourceId === paper.id && a.status === "COMPLETED");
              const isCompleted = previousAttempts.length > 0;
              const bestAttempt = [...previousAttempts].sort((a, b) => b.totalScore - a.totalScore)[0];
              const isBookmarked = bookmarkedIds.includes(paper.id);

              return (
                <div
                  key={paper.id}
                  className="rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-blue-500/40 p-5 space-y-4 transition-all duration-200 group relative"
                >
                  {/* Top Row: Year, Exam Number, Bookmark */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 font-mono font-bold text-xs">
                          {paper.examNumber}th TOPIK
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">{paper.year}</span>
                        {paper.format === "OLD_FORMAT" && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                            Old Format
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                        {paper.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => toggleBookmark(paper.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        isBookmarked ? "text-amber-400 bg-amber-500/10" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                      }`}
                      title={isBookmarked ? "Remove Bookmark" : "Save Paper"}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {paper.description}
                  </p>

                  {/* Badges: Levels & Resources */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 font-bold">
                      {paper.examType === "BOTH" ? "TOPIK I & II" : paper.examType.replace("_", " ")}
                    </span>
                    {paper.hasListening && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 font-semibold">
                        🎧 Listening
                      </span>
                    )}
                    {paper.hasReading && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 font-semibold">
                        📖 Reading
                      </span>
                    )}
                    {paper.hasWriting && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 font-semibold">
                        ✍️ Writing
                      </span>
                    )}
                    {paper.hasAnswerKey && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-emerald-400 font-semibold">
                        🔑 Answer Key
                      </span>
                    )}
                  </div>

                  {/* Attempt Status Bar */}
                  {isCompleted && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed ({previousAttempts.length} attempt{previousAttempts.length > 1 ? "s" : ""})</span>
                      </div>
                      <div className="text-slate-300 font-bold">
                        Best: <span className="text-white">{bestAttempt.totalScore}</span> / {bestAttempt.maxScore}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={paper.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Practice on TOPIK GUIDE</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>

                    <button
                      onClick={() => {
                        setLogResultResource(paper);
                        setIsLogResultOpen(true);
                      }}
                      className="py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all hover:scale-102"
                    >
                      {isCompleted ? "Log Retake" : "Log Result"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 6. TAB CONTENT: TIMED ONLINE MOCK TESTS ── */}
      {activeTab === "mocks" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span>Interactive Timed Mock Tests ({filteredMocks.length})</span>
            </h2>
            <span className="text-xs text-slate-400">Based on official TOPIK exam sets</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMocks.map((mock) => {
              const previousAttempts = attempts.filter((a) => a.resourceId === mock.id && a.status === "COMPLETED");
              const isCompleted = previousAttempts.length > 0;
              const bestAttempt = [...previousAttempts].sort((a, b) => b.totalScore - a.totalScore)[0];

              return (
                <div
                  key={mock.id}
                  className="rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-indigo-500/40 p-5 space-y-4 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono font-bold text-xs">
                          {mock.examType.replace("_", " ")} Mock
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">{mock.year}</span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {mock.title}
                      </h3>
                    </div>

                    <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
                      ⏱ {mock.timeLimitMins}m
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {mock.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-bold">EXAM SET</div>
                      <div className="font-bold text-slate-200 mt-0.5">{mock.examNumber}th TOPIK</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-bold">QUESTIONS</div>
                      <div className="font-bold text-slate-200 mt-0.5">{mock.questionCount} Qs</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-bold">FEEDBACK</div>
                      <div className="font-bold text-emerald-400 mt-0.5">Instant</div>
                    </div>
                  </div>

                  {isCompleted && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Attempted ({previousAttempts.length}x)</span>
                      </div>
                      <div className="text-slate-300 font-bold">
                        Best: <span className="text-white">{bestAttempt.totalScore}</span> / {bestAttempt.maxScore}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setStartModalResource(mock)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 transition-all hover:scale-102"
                    >
                      <span>Start Mock on TOPIK GUIDE</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setLogResultResource(mock);
                        setIsLogResultOpen(true);
                      }}
                      className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
                    >
                      Log Result
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 7. TAB CONTENT: MY ATTEMPTS HISTORY ── */}
      {activeTab === "attempts" && (
        <div className="space-y-6">
          {/* Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Attempts</div>
              <div className="text-2xl font-black text-white mt-1">{attempts.length}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">Personal Best</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {bestScore} <span className="text-xs font-normal text-slate-400">/ 200</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">Average Score</div>
              <div className="text-2xl font-black text-indigo-300 mt-1">
                {attempts.length > 0 ? Math.round(attempts.reduce((s, a) => s + a.totalScore, 0) / attempts.length) : 0}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">Readiness Score</div>
              <div className="text-2xl font-black text-amber-300 mt-1">
                {attempts.length > 0 ? `${Math.min(100, Math.round(((latestAttempt?.totalScore || 0) / 140) * 100))}%` : "—"}
              </div>
            </div>
          </div>

          {/* Attempts Table */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Recorded Attempt History</span>
              </h3>
              <span className="text-xs text-slate-400">Click any attempt to view detailed analysis</span>
            </div>

            {attempts.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">No attempts logged yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Practice on TOPIK GUIDE and log your first score to build your history!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Test Paper</th>
                      <th className="py-3 px-4">Exam</th>
                      <th className="py-3 px-4 text-center">Listening</th>
                      <th className="py-3 px-4 text-center">Reading</th>
                      <th className="py-3 px-4 text-center">Writing</th>
                      <th className="py-3 px-4 text-center">Total Score</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {[...attempts]
                      .reverse()
                      .map((att) => {
                        const scorePct = (att.totalScore / att.maxScore) * 100;
                        const statusDot =
                          scorePct >= 80 ? "🟢" : scorePct >= 60 ? "🟡" : "🔴";

                        return (
                          <tr
                            key={att.id}
                            onClick={() => setDetailAttempt(att)}
                            className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                          >
                            <td className="py-3.5 px-4 font-mono text-slate-400">{att.attemptDate}</td>
                            <td className="py-3.5 px-4 font-bold text-white flex items-center gap-1.5">
                              <span>{att.resourceTitle || `${att.examNumber}th TOPIK`}</span>
                              {att.isPersonalBest && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 font-black">
                                  PB
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-slate-300 font-semibold">{att.examType.replace("_", " ")}</td>
                            <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-200">
                              {att.listeningScore}
                            </td>
                            <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-200">
                              {att.readingScore}
                            </td>
                            <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                              {att.writingScore !== undefined ? att.writingScore : "—"}
                            </td>
                            <td className="py-3.5 px-4 text-center font-black text-white text-sm">
                              {att.totalScore} <span className="text-[10px] text-slate-500 font-normal">/ {att.maxScore}</span>
                            </td>
                            <td className="py-3.5 px-4 text-center">{statusDot}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 8. EXTERNAL RESOURCE DISCLAIMER FOOTER ── */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 space-y-1">
        <div className="font-bold text-slate-300 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>External Resource Disclaimer</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Some practice resources open on external websites (such as TOPIK GUIDE). TOPIKPath does not host or reproduce third-party test content unless authorized. Your TOPIKPath progress records and study analytics are maintained separately in your account.
        </p>
      </div>

      {/* ── 9. MODALS ── */}
      {startModalResource && (
        <StartMockModal
          resource={startModalResource}
          isOpen={Boolean(startModalResource)}
          onClose={() => setStartModalResource(null)}
          onConfirm={handleConfirmStart}
        />
      )}

      <LogResultModal
        isOpen={isLogResultOpen}
        onClose={() => setIsLogResultOpen(false)}
        initialResource={logResultResource}
        previousAttempts={attempts}
        onSaveAttempt={(att) => {
          onSaveAttempt(att);
          onAwardXp(att.isPersonalBest ? 200 : 100);
        }}
      />

      <AttemptDetailModal
        attempt={detailAttempt}
        isOpen={Boolean(detailAttempt)}
        onClose={() => setDetailAttempt(null)}
        onNavigate={onNavigate}
        onRetake={(resourceId) => {
          const res = TOPIK_EXTERNAL_RESOURCES.find((r) => r.id === resourceId);
          if (res) {
            setStartModalResource(res);
          }
        }}
      />
    </div>
  );
};
