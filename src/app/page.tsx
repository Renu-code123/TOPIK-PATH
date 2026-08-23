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
  const [activeSection, setActiveSection] = useState<ActiveSection>("dashboard");
  const [selectedTarget, setSelectedTarget] = useState<"ALL" | "TOPIK_I" | "TOPIK_II">("ALL");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Persistent User Progress State
  const [xp, setXp] = useState<number>(4280);
  const [streak, setStreak] = useState<number>(21);
  const [masteredIds, setMasteredIds] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [mockTestsCompleted, setMockTestsCompleted] = useState<number>(3);
  const [writingsCompleted, setWritingsCompleted] = useState<number>(1);
  const [quizAttempts, setQuizAttempts] = useState<number>(24);

  // External PYQ & Mock Attempts State
  const [attempts, setAttempts] = useState<ExternalAttemptRecord[]>(INITIAL_SEED_ATTEMPTS);
  const [isGlobalLogModalOpen, setIsGlobalLogModalOpen] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("topikpath_current_user");
      if (storedUser) {
        const parsed: CurrentUser = JSON.parse(storedUser);
        setCurrentUser(parsed);
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
        if (progress.xp !== undefined) setXp(progress.xp);
        if (progress.streak !== undefined) setStreak(progress.streak);
        if (progress.masteredIds) setMasteredIds(progress.masteredIds);
        if (progress.mistakes) setMistakes(progress.mistakes);
        if (progress.mockTestsCompleted !== undefined) setMockTestsCompleted(progress.mockTestsCompleted);
        if (progress.writingsCompleted !== undefined) setWritingsCompleted(progress.writingsCompleted);
        if (progress.quizAttempts !== undefined) setQuizAttempts(progress.quizAttempts);
      }

      // Load attempts
      const attemptKey = `topikpath_attempts_${email}`;
      const savedAttempts = localStorage.getItem(attemptKey);
      if (savedAttempts) {
        setAttempts(JSON.parse(savedAttempts));
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

  const handleAuthSuccess = (user: CurrentUser) => {
    setCurrentUser(user);
    if (user.targetLevel) {
      setSelectedTarget(user.targetLevel as "ALL" | "TOPIK_I" | "TOPIK_II");
    }
    loadUserProgress(user.email);
  };

  const handleLogout = () => {
    localStorage.removeItem("topikpath_current_user");
    setCurrentUser(null);
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

  // Show Landing/Auth if not logged in
  if (!currentUser) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
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
