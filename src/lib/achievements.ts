export interface AchievementItem {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  icon: string;
  category: "STREAK" | "VOCAB" | "QUIZ" | "TEST" | "WRITING";
  xpReward: number;
  unlockedIf: (stats: UserStats) => boolean;
}

export interface UserStats {
  xp: number;
  streak: number;
  masteredVocabCount: number;
  quizAttemptCount: number;
  mockTestsCompleted: number;
  writingsCompleted: number;
  accuracyRate: number;
}

export const ACHIEVEMENTS_LIST: AchievementItem[] = [
  {
    id: "first_step",
    name: "First Steps (첫걸음)",
    nameKo: "첫걸음",
    description: "Learn and master your first 5 Korean vocabulary words.",
    icon: "🌱",
    category: "VOCAB",
    xpReward: 50,
    unlockedIf: (s) => s.masteredVocabCount >= 5,
  },
  {
    id: "vocab_50",
    name: "Word Collector (어휘 수집가)",
    nameKo: "어휘 수집가",
    description: "Master 50 official TOPIK vocabulary words.",
    icon: "📚",
    category: "VOCAB",
    xpReward: 150,
    unlockedIf: (s) => s.masteredVocabCount >= 50,
  },
  {
    id: "vocab_200",
    name: "Vocabulary Titan (어휘의 달인)",
    nameKo: "어휘의 달인",
    description: "Master 200 TOPIK words with high confidence.",
    icon: "🏛️",
    category: "VOCAB",
    xpReward: 500,
    unlockedIf: (s) => s.masteredVocabCount >= 200,
  },
  {
    id: "streak_3",
    name: "Consistent Learner (작심삼일 극복)",
    nameKo: "작심삼일 극복",
    description: "Maintain a 3-day continuous daily study streak.",
    icon: "🔥",
    category: "STREAK",
    xpReward: 100,
    unlockedIf: (s) => s.streak >= 3,
  },
  {
    id: "streak_7",
    name: "Habit Master (일주일의 기적)",
    nameKo: "일주일의 기적",
    description: "Complete a full 7-day study streak.",
    icon: "⚡",
    category: "STREAK",
    xpReward: 250,
    unlockedIf: (s) => s.streak >= 7,
  },
  {
    id: "quiz_pro",
    name: "Quiz Sharp-Shooter (퀴즈 백발백중)",
    nameKo: "퀴즈 백발백중",
    description: "Answer at least 20 practice questions.",
    icon: "🎯",
    category: "QUIZ",
    xpReward: 150,
    unlockedIf: (s) => s.quizAttemptCount >= 20,
  },
  {
    id: "mock_first",
    name: "Exam Ready (모의고사 첫 도전)",
    nameKo: "모의고사 첫 도전",
    description: "Complete your first timed TOPIK full mock test.",
    icon: "📝",
    category: "TEST",
    xpReward: 200,
    unlockedIf: (s) => s.mockTestsCompleted >= 1,
  },
  {
    id: "writer_first",
    name: "Essayist (작문 시작)",
    nameKo: "작문 시작",
    description: "Submit your first writing task submission.",
    icon: "✍️",
    category: "WRITING",
    xpReward: 120,
    unlockedIf: (s) => s.writingsCompleted >= 1,
  },
];
