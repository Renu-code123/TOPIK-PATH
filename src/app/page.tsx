"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AuthPage } from "@/components/auth/AuthPage";
import { Sidebar, ActiveSection } from "@/components/navigation/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { VocabExplorer } from "@/components/vocabulary/VocabExplorer";
import { FlashcardsStudio } from "@/components/practice/FlashcardsStudio";
import { MCQEngine, MistakeItem } from "@/components/practice/MCQEngine";
import { GrammarExplorer } from "@/components/grammar/GrammarExplorer";
import { MockTestCenter } from "@/components/mock/MockTestCenter";
import { WritingLab } from "@/components/writing/WritingLab";
import { MistakeNotebook } from "@/components/review/MistakeNotebook";
import { StudyPlanner } from "@/components/planner/StudyPlanner";
import { AchievementsModal } from "@/components/gamification/AchievementsModal";
import { PYQHub } from "@/components/pyq/PYQHub";
import { ProfileView } from "@/components/profile/ProfileView";
import { LogResultModal } from "@/components/pyq/LogResultModal";
import { TOPIK_I_VOCABULARY } from "@/data/topik-i-vocabulary";
import { TOPIK_II_VOCABULARY } from "@/data/topik-ii-vocabulary";
import { ExternalAttemptRecord, INITIAL_SEED_ATTEMPTS } from "@/data/external-resources";
import { ArrowRight, LayoutDashboard, Sparkles } from "lucide-react";

interface CurrentUser {
  name: string;
  email: string;
  targetLevel: string;
  xp: number;
  streak: number;
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showPublicHome, setShowPublicHome] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>("dashboard");
  const [selectedTarget, setSelectedTarget] = useState<"ALL" | "TOPIK_I" | "TOPIK_II">("ALL");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Clean initial state for new learners (zero state)
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [masteredIds, setMasteredIds] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [mockTestsCompleted, setMockTestsCompleted] = useState<number>(0);
  const [writingsCompleted, setWritingsCompleted] = useState<number>(0);
  const [quizAttempts, setQuizAttempts] = useState<number>(0);

  // External PYQ & Mock Attempts State (User's own recorded attempts)
  const [attempts, setAttempts] = useState<ExternalAttemptRecord[]>([]);
  const [isGlobalLogModalOpen, setIsGlobalLogModalOpen] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("topikpath_current_user");
      if (storedUser) {
        const parsed: CurrentUser = JSON.parse(storedUser);
        setCurrentUser(parsed);
        if (parsed.targetLevel) {
          setSelectedTarget(parsed.targetLevel as "ALL" | "TOPIK_I" | "TOPIK_II");
        }
        loadUserProgress(parsed.email);
      }
    } catch (e) {
      // No session
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const loadUserProgress = (email: string) => {
    try {
      const key = `topikpath_progress_${email}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const progress = JSON.parse(saved);
        setXp(progress.xp || 0);
        setStreak(progress.streak || 0);
        setMasteredIds(progress.masteredIds || []);
        setMistakes(progress.mistakes || []);
        setMockTestsCompleted(progress.mockTestsCompleted || 0);
        setWritingsCompleted(progress.writingsCompleted || 0);
        setQuizAttempts(progress.quizAttempts || 0);
      } else {
        setXp(0);
        setStreak(0);
        setMasteredIds([]);
        setMistakes([]);
        setMockTestsCompleted(0);
        setWritingsCompleted(0);
        setQuizAttempts(0);
      }

      // Load attempts
      const attemptKey = `topikpath_attempts_${email}`;
      const savedAttempts = localStorage.getItem(attemptKey);
      if (savedAttempts) {
        setAttempts(JSON.parse(savedAttempts));
      } else {
        setAttempts([]);
      }
    } catch (e) {}
  };

  const saveUserProgress = (email: string, data: object) => {
    try {
      const key = `topikpath_progress_${email}`;
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {}
  };

  const saveUserAttempts = (email: string, attemptsList: ExternalAttemptRecord[]) => {
    try {
      const key = `topikpath_attempts_${email}`;
      localStorage.setItem(key, JSON.stringify(attemptsList));
    } catch (e) {}
  };

  // Save to local storage on changes
  useEffect(() => {
    if (!currentUser) return;
    saveUserProgress(currentUser.email, {
      xp,
      streak,
      masteredIds,
      mistakes,
      mockTestsCompleted,
      writingsCompleted,
      quizAttempts,
    });
  }, [xp, streak, masteredIds, mistakes, mockTestsCompleted, writingsCompleted, quizAttempts, currentUser]);

  const handleAuthSuccess = (user: CurrentUser, targetSection?: ActiveSection) => {
    setCurrentUser(user);
    if (user.targetLevel) {
      setSelectedTarget(user.targetLevel as "ALL" | "TOPIK_I" | "TOPIK_II");
    }
    loadUserProgress(user.email);
    if (targetSection) {
      setActiveSection(targetSection);
    }
    setShowPublicHome(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("topikpath_current_user");
    setCurrentUser(null);
    setShowPublicHome(false);
    setActiveSection("dashboard");
  };

  // Save New External Attempt
  const handleSaveAttempt = (newAttemptData: Omit<ExternalAttemptRecord, "id">) => {
    const newAttempt: ExternalAttemptRecord = {
      ...newAttemptData,
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };

    setAttempts((prev) => {
      const updated = [...prev, newAttempt];
      if (currentUser) {
        saveUserAttempts(currentUser.email, updated);
      }
      return updated;
    });

    const xpEarned = newAttempt.isPersonalBest ? 200 : 100;
    setXp((prev) => prev + xpEarned);
    setMockTestsCompleted((c) => c + 1);
  };

  // Combined Vocabulary Pool
  const allVocab = useMemo(() => {
    return [...TOPIK_I_VOCABULARY, ...TOPIK_II_VOCABULARY];
  }, []);

  const handleToggleMastery = (id: number) => {
    setMasteredIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        setXp((x) => x + 20);
        return [...prev, id];
      }
    });
  };

  const handleAwardXp = (amount: number) => {
    setXp((prev) => prev + amount);
  };

  const handleAddMistake = (mistake: MistakeItem) => {
    setMistakes((prev) => {
      const exists = prev.some((m) => m.korean === mistake.korean);
      if (exists) return prev;
      return [mistake, ...prev];
    });
    setQuizAttempts((q) => q + 1);
  };

  const handleRemoveMistake = (id: string) => {
    setMistakes((prev) => prev.filter((m) => m.id !== id));
    setXp((x) => x + 15);
  };

  const handleClearAllMistakes = () => {
    setMistakes([]);
  };

  // Loading splash
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#070a11] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-semibold">Loading TOPIKPath...</p>
      </div>
    );
  }

  // Show Public Landing/Auth Page if not logged in OR if user clicked "View Homepage"
  if (!currentUser || showPublicHome) {
    return (
      <div className="relative">
        <AuthPage onAuthSuccess={handleAuthSuccess} />
        {currentUser && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setShowPublicHome(false)}
              className="px-5 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-2xl shadow-blue-600/50 flex items-center gap-2 border border-white/20 transition-all hover:scale-105 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Return to Dashboard ({currentUser.name})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Authenticated Workspace
  return (
    <div className="flex h-screen bg-[#070a11] text-slate-100 font-sans overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Desktop Sidebar Navigation */}
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          xp={xp}
          streak={streak}
          mistakesCount={mistakes.length}
          onGoToHome={() => setShowPublicHome(true)}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-72 h-full bg-[#090d16] border-r border-slate-800"
          >
            <Sidebar
              activeSection={activeSection}
              onSelectSection={(sec) => {
                setActiveSection(sec);
                setMobileMenuOpen(false);
              }}
              xp={xp}
              streak={streak}
              mistakesCount={mistakes.length}
              onGoToHome={() => {
                setShowPublicHome(true);
                setMobileMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* TopBar */}
        <TopBar
          xp={xp}
          streak={streak}
          masteredCount={masteredIds.length}
          selectedTarget={selectedTarget}
          onSelectTarget={setSelectedTarget}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          userName={currentUser.name}
          onLogout={handleLogout}
          onGoToHome={() => setShowPublicHome(true)}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-6 pb-24 lg:pb-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            {activeSection === "dashboard" && (
              <DashboardView
                xp={xp}
                streak={streak}
                masteredVocab={masteredIds.length}
                totalVocabCount={allVocab.length}
                mistakesCount={mistakes.length}
                attempts={attempts}
                onNavigate={setActiveSection}
                onStartQuickPractice={() => setActiveSection("mcq")}
                userName={currentUser.name}
                targetLevel={currentUser.targetLevel}
              />
            )}

            {activeSection === "profile" && (
              <ProfileView
                userName={currentUser.name}
                email={currentUser.email}
                targetLevel={currentUser.targetLevel}
                xp={xp}
                streak={streak}
                masteredVocabCount={masteredIds.length}
                totalVocabCount={allVocab.length}
                attempts={attempts}
                onNavigate={setActiveSection}
                onOpenLogModal={() => setIsGlobalLogModalOpen(true)}
              />
            )}

            {activeSection === "pyq_hub" && (
              <PYQHub
                attempts={attempts}
                onSaveAttempt={handleSaveAttempt}
                onAwardXp={handleAwardXp}
                onNavigate={setActiveSection}
              />
            )}

            {activeSection === "vocab" && (
              <VocabExplorer
                vocabulary={allVocab}
                masteredIds={masteredIds}
                onToggleMastery={handleToggleMastery}
                selectedTarget={selectedTarget}
              />
            )}

            {activeSection === "flashcards" && (
              <FlashcardsStudio
                vocabulary={allVocab}
                masteredIds={masteredIds}
                onToggleMastery={handleToggleMastery}
                onAwardXp={handleAwardXp}
                selectedTarget={selectedTarget}
              />
            )}

            {activeSection === "mcq" && (
              <MCQEngine
                vocabulary={allVocab}
                onAwardXp={handleAwardXp}
                onAddMistake={handleAddMistake}
                selectedTarget={selectedTarget}
              />
            )}

            {activeSection === "grammar" && (
              <GrammarExplorer selectedTarget={selectedTarget} />
            )}

            {activeSection === "mock_tests" && (
              <MockTestCenter
                onAwardXp={handleAwardXp}
                onIncrementMockTests={() => setMockTestsCompleted((c) => c + 1)}
              />
            )}

            {activeSection === "writing" && (
              <WritingLab
                onAwardXp={handleAwardXp}
                onIncrementWritings={() => setWritingsCompleted((w) => w + 1)}
              />
            )}

            {activeSection === "mistakes" && (
              <MistakeNotebook
                mistakes={mistakes}
                onRemoveMistake={handleRemoveMistake}
                onClearAll={handleClearAllMistakes}
                onStartPracticeMistakes={() => setActiveSection("mcq")}
              />
            )}

            {activeSection === "planner" && <StudyPlanner />}

            {activeSection === "achievements" && (
              <AchievementsModal
                stats={{
                  xp,
                  streak,
                  masteredVocabCount: masteredIds.length,
                  quizAttemptCount: quizAttempts,
                  mockTestsCompleted,
                  writingsCompleted,
                  accuracyRate: 88,
                }}
              />
            )}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav activeSection={activeSection} onSelectSection={setActiveSection} />

        {/* Global Log Result Modal */}
        <LogResultModal
          isOpen={isGlobalLogModalOpen}
          onClose={() => setIsGlobalLogModalOpen(false)}
          previousAttempts={attempts}
          onSaveAttempt={handleSaveAttempt}
        />
      </div>
    </div>
  );
}
