export interface LevelTier {
  level: number;
  title: string;
  minXp: number;
  icon: string;
  color: string;
}

export const LEVEL_TIERS: LevelTier[] = [
  { level: 1, title: "Hangeul Beginner (입문)", minXp: 0, icon: "🌱", color: "text-emerald-400" },
  { level: 2, title: "TOPIK I Explorer (초급 1)", minXp: 150, icon: "🌿", color: "text-teal-400" },
  { level: 3, title: "TOPIK I Scholar (초급 2)", minXp: 450, icon: "📘", color: "text-sky-400" },
  { level: 4, title: "TOPIK II Challenger (중급 3)", minXp: 1000, icon: "🔥", color: "text-indigo-400" },
  { level: 5, title: "TOPIK II Adept (중급 4)", minXp: 2000, icon: "⚡", color: "text-purple-400" },
  { level: 6, title: "TOPIK Master (고급 5-6)", minXp: 4000, icon: "👑", color: "text-amber-400" },
];

export function getLevelFromXp(xp: number): LevelTier {
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TIERS[i].minXp) {
      return LEVEL_TIERS[i];
    }
  }
  return LEVEL_TIERS[0];
}

export function getNextLevelProgress(xp: number) {
  const current = getLevelFromXp(xp);
  const nextIdx = LEVEL_TIERS.findIndex((t) => t.level === current.level) + 1;
  if (nextIdx >= LEVEL_TIERS.length) {
    return { current, next: current, progressPercent: 100, xpNeeded: 0 };
  }
  const next = LEVEL_TIERS[nextIdx];
  const progressPercent = Math.min(
    100,
    Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100)
  );
  return {
    current,
    next,
    progressPercent,
    xpNeeded: next.minXp - xp,
  };
}

export const XP_REWARDS = {
  VOCAB_LEARN: 15,
  VOCAB_MASTER: 30,
  QUIZ_CORRECT: 25,
  GRAMMAR_PRACTICE: 20,
  MOCK_TEST_COMPLETE: 150,
  DAILY_TASK_COMPLETE: 50,
  WRITING_SUBMISSION: 80,
  STREAK_BONUS_PER_DAY: 10,
};
