/**
 * TOPIKPath — External TOPIK Resources & Previous Question Papers (PYQs)
 * 
 * Sources:
 * - TOPIK GUIDE Previous Papers: https://www.topikguide.com/previous-papers/
 * - TOPIK GUIDE Online Mock Tests: https://www.topikguide.com/topik-mock-tests/
 * 
 * Note: TOPIKPath provides resource discovery, practice redirection, and 
 * progress tracking. All external practice takes place on TOPIK GUIDE.
 */

export interface ExternalResourceItem {
  id: string;
  provider: "TOPIK_GUIDE" | "OFFICIAL_TOPIK";
  providerName: string;
  title: string;
  examNumber: number; // e.g. 96, 91, 83, 64, 60...
  year: number;
  examType: "TOPIK_I" | "TOPIK_II" | "BOTH";
  format: "NEW_FORMAT" | "OLD_FORMAT";
  resourceType: "PREVIOUS_PAPER" | "MOCK_TEST";
  hasListening: boolean;
  hasReading: boolean;
  hasWriting: boolean;
  hasAnswerKey: boolean;
  externalUrl: string;
  mockUrl?: string;
  timeLimitMins?: number;
  questionCount?: number;
  description: string;
  recommendedFor: string;
}

export interface ExternalAttemptRecord {
  id: string;
  resourceId: string;
  resourceTitle: string;
  providerName: string;
  examType: "TOPIK_I" | "TOPIK_II";
  examNumber: number;
  year: number;
  format: "NEW_FORMAT" | "OLD_FORMAT";
  attemptNumber: number;
  attemptDate: string; // YYYY-MM-DD
  startedAt: string;
  completedAt?: string;
  listeningScore: number;
  readingScore: number;
  writingScore?: number;
  totalScore: number;
  maxScore: number;
  writingScoreSource?: "SELF" | "TEACHER" | "AI" | "EXTERNAL";
  listeningCorrect?: number;
  listeningTotal?: number;
  readingCorrect?: number;
  readingTotal?: number;
  timeTakenMinutes?: number;
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  notes?: string;
  resultSource: "MANUAL" | "EXTERNAL_API" | "IMPORTED";
  isPersonalBest?: boolean;
}

export const TOPIK_EXTERNAL_RESOURCES: ExternalResourceItem[] = [
  // ── 96th TOPIK (2025) ───────────────────────────────────────────────────────
  {
    id: "topik-96-paper",
    provider: "TOPIK_GUIDE",
    providerName: "TOPIK GUIDE",
    title: "96th TOPIK Previous Paper",
    examNumber: 96,
    year: 2025,
    examType: "BOTH",
    format: "NEW_FORMAT",
    resourceType: "PREVIOUS_PAPER",
    hasListening: true,
    hasReading: true,
    hasWriting: true,
    hasAnswerKey: true,
    externalUrl: "https://www.topikguide.com/previous-papers/",
    description: "Official 96th TOPIK examination paper. Includes full test sheets, audio files, and verified answer keys for both levels.",
    recommendedFor: "High-yield recent exam practice before test day.",
  },
  {
    id: "topik-96-mock-1",
    provider: "TOPIK_GUIDE",
    providerName: "TOPIK GUIDE",
    title: "96th TOPIK I Online Mock Test",
    examNumber: 96,
    year: 2025,
    examType: "TOPIK_I",
    format: "NEW_FORMAT",
    resourceType: "MOCK_TEST",
    hasListening: true,
    hasReading: true,
    hasWriting: false,
    hasAnswerKey: true,
    externalUrl: "https://www.topikguide.com/topik-mock-tests/",
    mockUrl: "https://www.topikguide.com/topik-mock-tests/",
    timeLimitMins: 100,
    questionCount: 70,
    description: "Full-length timed simulation of 96th TOPIK I. 30 Listening + 40 Reading questions with real-time countdown timer.",
    recommendedFor: "Full test simulation under realistic exam pressure.",
  },
  {
    id: "topik-96-mock-2",
    provider: "TOPIK_GUIDE",
    providerName: "TOPIK GUIDE",
    title: "96th TOPIK II Online Mock Test",
    examNumber: 96,
    year: 2025,
    examType: "TOPIK_II",
    format: "NEW_FORMAT",
    resourceType: "MOCK_TEST",
    hasListening: true,
    hasReading: true,
    hasWriting: true,
    hasAnswerKey: true,
    externalUrl: "https://www.topikguide.com/topik-mock-tests/",
    mockUrl: "https://www.topikguide.com/topik-mock-tests/",
    timeLimitMins: 180,
    questionCount: 104,
    description: "Full-length timed simulation of 96th TOPIK II. 50 Listening + 4 Writing + 50 Reading questions with section breakdown.",
    recommendedFor: "Mastering pacing and endurance for Intermediate/Advanced test.",
  },

  // ── 91st TOPIK (2024) ───────────────────────────────────────────────────────
  {
    id: "topik-91-paper",
    provider: "TOPIK_GUIDE",
    providerName: "TOPIK GUIDE",
    title: "91st TOPIK Previous Paper",
    examNumber: 91,
    year: 2024,
    examType: "BOTH",
    format: "NEW_FORMAT",
    resourceType: "PREVIOUS_PAPER",
    hasListening: true,
    hasReading: true,
    hasWriting: true,
    hasAnswerKey: true,
    externalUrl: "https://www.topikguide.com/previous-papers/",
    description: "Full past paper sets for 91st TOPIK with official audio recordings and answer sheets.",
    recommendedFor: "Comprehensive question type review.",
  },
  {
    id: "topik-91-mock-1",
    provider: "TOPIK_GUIDE",
    providerName: "TOPIK GUIDE",
    title: "91st TOPIK I Online Mock Test",
    examNumber: 91,
    year: 2024,
    examType: "TOPIK_I",
    format: "NEW_FORMAT",
    resourceType: "MOCK_TEST",
    hasListening: true,
    hasReading: true,
    hasWriting: false,
    hasAnswerKey: true,
    externalUrl: "https://www.topikguide.com/topik-mock-tests/",
    mockUrl: "https://www.topikguide.com/topik-mock-tests/",
    timeLimitMins: 100,
    questionCount: 70,
    description: "Interactive timed mock test covering 91st TOPIK I standard questions.",
    recommendedFor: "Benchmark testing after 1 month of vocabulary study.",
  },
  {
    id: "topik-91-mock-2",
    provider: "TOPIK_GUIDE",
    providerName: "TOPIK GUIDE",
    title: "91st TOPIK II Online Mock Test",
    examNumber: 91,
    year: 2024,
    examType: "TOPIK_II",
    format: "NEW_FORMAT",
    resourceType: "MOCK_TEST",
    hasListening: true,
    hasReading: true,
    hasWriting: true,
    hasAnswerKey: true,
    externalUrl: "https://www.topikguide.com/topik-mock-tests/",
    mockUrl: "https://www.topikguide.com/topik-mock-tests/",
    timeLimitMins: 180,
    questionCount: 104,
    description: "Complete TOPIK II timed mock test. Test your speed across 50 reading questions.",
    recommendedFor: "Level 3-4 transition diagnostics.",
  },

  // ── 83rd TOPIK (2023) ───────────────────────────────────────────────────────
  {
    id: "topik-83-paper",
    provider: "TOPIK_GUIDE",
    providerName: "TOPIK GUIDE",
    title: "83rd TOPIK Previous Paper",
    examNumber: 83,
    year: 2023,
    examType: "BOTH",
    format: "NEW_FORMAT",
    resourceType: "PREVIOUS_PAPER",
    hasListening: true,
    hasReading: true,
    hasWriting: true,
    hasAnswerKey: true,
    externalUrl: "https://www.topikguide.com/previous-papers/",
    description: "Official 83rd examination sets with listening scripts and grammar point references.",
    recommendedFor: "Intermediate test strategies.",
  },
  {
    id: "topik-83-mock-1",
    provider: "TOPIK_GUIDE",
    providerName: "TOPIK GUIDE",
    title: "83rd TOPIK I Online Mock Test",
    examNumber: 83,
    year: 2023,
    examType: "TOPIK_I",
    format: "NEW_FORMAT",
    resourceType: "MOCK_TEST",
    hasListening: true,
    hasReading: true,
    hasWriting: false,
    hasAnswerKey: true,
    externalUrl: "https://www.topikguide.com/topik-mock-tests/",
    mockUrl: "https://www.topikguide.com/topik-mock-tests/",
    timeLimitMins: 100,
    questionCount: 70,
    description: "Standard TOPIK I format mock test with immediate score breakdown upon completion.",
    recommendedFor: "Tracking monthly score trajectory.",
  },
  {
    id: "topik-83-mock-2",
    provider: "TOPIK_GUIDE",
    providerName: "TOPIK GUIDE",
    title: "83rd TOPIK II Online Mock Test",
    examNumber: 83,
    year: 2023,
    examType: "TOPIK_II",
    format: "NEW_FORMAT",
    resourceType: "MOCK_TEST",
    hasListening: true,
    hasReading: true,
    hasWriting: true,
    hasAnswerKey: true,
    externalUrl: "https://www.topikguide.com/topik-mock-tests/",
    mockUrl: "https://www.topikguide.com/topik-mock-tests/",
    timeLimitMins: 180,
    questionCount: 104,
    description: "Full TOPIK II mock with academic passages, newspaper excerpts, and complex dialogs.",
    recommendedFor: "Level 4-6 aspirants testing advanced reading comprehension.",
  },

  // ── 64th TOPIK (2019) ───────────────────────────────────────────────────────
  {
    id: "topik-64-paper",
    provider: "TOPIK_GUIDE",
    providerName: "TOPIK GUIDE",
    title: "64th TOPIK Previous Paper",
    examNumber: 64,
    year: 2019,
    examType: "BOTH",
    format: "NEW_FORMAT",
    resourceType: "PREVIOUS_PAPER",
    hasListening: true,
    hasReading: true,
    hasWriting: true,
    hasAnswerKey: true,
    externalUrl: "https://www.topikguide.com/previous-papers/",
    description: "Widely cited past exam paper with classic TOPIK question structures and high frequency vocabulary.",
    recommendedFor: "Core foundational past paper review.",
  },
  {
    id: "topik-64-mock-1",
    provider: "TOPIK_GUIDE",
    providerName: "TOPIK GUIDE",
    title: "64th TOPIK I Online Mock Test",
    examNumber: 64,
    year: 2019,
    examType: "TOPIK_I",
    format: "NEW_FORMAT",
    resourceType: "MOCK_TEST",
    hasListening: true,
    hasReading: true,
    hasWriting: false,
    hasAnswerKey: true,
    externalUrl: "https://www.topikguide.com/topik-mock-tests/",
    mockUrl: "https://www.topikguide.com/topik-mock-tests/",
    timeLimitMins: 100,
    questionCount: 70,
    description: "Classic TOPIK I online mock exam.",
    recommendedFor: "Beginner confidence building.",
  },

  // ── 60th TOPIK (2018) ───────────────────────────────────────────────────────
  {
    id: "topik-60-paper",
    provider: "TOPIK_GUIDE",
    providerName: "TOPIK GUIDE",
    title: "60th TOPIK Previous Paper",
    examNumber: 60,
    year: 2018,
    examType: "BOTH",
    format: "NEW_FORMAT",
    resourceType: "PREVIOUS_PAPER",
    hasListening: true,
    hasReading: true,
    hasWriting: true,
    hasAnswerKey: true,
    externalUrl: "https://www.topikguide.com/previous-papers/",
    description: "Official 60th exam paper with verified listening MP3 files and transcripts.",
    recommendedFor: "Listening speed drills and vocabulary reinforcement.",
  },

  // ── 52nd TOPIK (2017) ───────────────────────────────────────────────────────
  {
    id: "topik-52-paper",
    provider: "TOPIK_GUIDE",
    providerName: "TOPIK GUIDE",
    title: "52nd TOPIK Previous Paper",
    examNumber: 52,
    year: 2017,
    examType: "BOTH",
    format: "NEW_FORMAT",
    resourceType: "PREVIOUS_PAPER",
    hasListening: true,
    hasReading: true,
    hasWriting: true,
    hasAnswerKey: true,
    externalUrl: "https://www.topikguide.com/previous-papers/",
    description: "52nd TOPIK official questions, reading passages, and official scoring guidelines.",
    recommendedFor: "Grammar pattern recognition.",
  },

  // ── 47th TOPIK (2016) ───────────────────────────────────────────────────────
  {
    id: "topik-47-paper",
    provider: "TOPIK_GUIDE",
    providerName: "TOPIK GUIDE",
    title: "47th TOPIK Previous Paper",
    examNumber: 47,
    year: 2016,
    examType: "BOTH",
    format: "NEW_FORMAT",
    resourceType: "PREVIOUS_PAPER",
    hasListening: true,
    hasReading: true,
    hasWriting: true,
    hasAnswerKey: true,
    externalUrl: "https://www.topikguide.com/previous-papers/",
    description: "47th examination papers for TOPIK I and TOPIK II.",
    recommendedFor: "Extensive question bank drill.",
  },

  // ── 41st TOPIK (2015) ───────────────────────────────────────────────────────
  {
    id: "topik-41-paper",
    provider: "TOPIK_GUIDE",
    providerName: "TOPIK GUIDE",
    title: "41st TOPIK Previous Paper",
    examNumber: 41,
    year: 2015,
    examType: "BOTH",
    format: "NEW_FORMAT",
    resourceType: "PREVIOUS_PAPER",
    hasListening: true,
    hasReading: true,
    hasWriting: true,
    hasAnswerKey: true,
    externalUrl: "https://www.topikguide.com/previous-papers/",
    description: "41st past exam papers with full answer keys.",
    recommendedFor: "Pattern and idiom practice.",
  },

  // ── 37th TOPIK (2014) - Transition to New Format ───────────────────────────
  {
    id: "topik-37-paper",
    provider: "TOPIK_GUIDE",
    providerName: "TOPIK GUIDE",
    title: "37th TOPIK Previous Paper",
    examNumber: 37,
    year: 2014,
    examType: "BOTH",
    format: "NEW_FORMAT",
    resourceType: "PREVIOUS_PAPER",
    hasListening: true,
    hasReading: true,
    hasWriting: true,
    hasAnswerKey: true,
    externalUrl: "https://www.topikguide.com/previous-papers/",
    description: "First generation of the revamped New TOPIK Format introduced in 2014.",
    recommendedFor: "Historical format comparison and extra problem sets.",
  },

  // ── 35th TOPIK (2014) - Old Format ──────────────────────────────────────────
  {
    id: "topik-35-paper",
    provider: "TOPIK_GUIDE",
    providerName: "TOPIK GUIDE",
    title: "35th TOPIK Previous Paper (Old Format)",
    examNumber: 35,
    year: 2014,
    examType: "BOTH",
    format: "OLD_FORMAT",
    resourceType: "PREVIOUS_PAPER",
    hasListening: true,
    hasReading: true,
    hasWriting: true,
    hasAnswerKey: true,
    externalUrl: "https://www.topikguide.com/previous-papers/",
    description: "Previous format TOPIK exam (Beginner, Intermediate, Advanced 3-tier structure). Valuable for grammar and vocabulary drills.",
    recommendedFor: "Extra grammar vocabulary drill bank.",
  },
];

// Sample Initial Seed Attempts for realistic starter analytics
export const INITIAL_SEED_ATTEMPTS: ExternalAttemptRecord[] = [
  {
    id: "att-seed-1",
    resourceId: "topik-83-mock-1",
    resourceTitle: "83rd TOPIK I Online Mock Test",
    providerName: "TOPIK GUIDE",
    examType: "TOPIK_I",
    examNumber: 83,
    year: 2023,
    format: "NEW_FORMAT",
    attemptNumber: 1,
    attemptDate: "2026-08-10",
    startedAt: "2026-08-10T14:00:00Z",
    completedAt: "2026-08-10T15:35:00Z",
    listeningScore: 70,
    readingScore: 68,
    totalScore: 138,
    maxScore: 200,
    listeningCorrect: 21,
    listeningTotal: 30,
    readingCorrect: 27,
    readingTotal: 40,
    timeTakenMinutes: 95,
    status: "COMPLETED",
    notes: "First full attempt. Ran out of time on last 4 reading questions.",
    resultSource: "MANUAL",
    isPersonalBest: true,
  },
  {
    id: "att-seed-2",
    resourceId: "topik-91-mock-1",
    resourceTitle: "91st TOPIK I Online Mock Test",
    providerName: "TOPIK GUIDE",
    examType: "TOPIK_I",
    examNumber: 91,
    year: 2024,
    format: "NEW_FORMAT",
    attemptNumber: 1,
    attemptDate: "2026-08-18",
    startedAt: "2026-08-18T10:15:00Z",
    completedAt: "2026-08-18T11:45:00Z",
    listeningScore: 76,
    readingScore: 72,
    totalScore: 148,
    maxScore: 200,
    listeningCorrect: 23,
    listeningTotal: 30,
    readingCorrect: 29,
    readingTotal: 40,
    timeTakenMinutes: 90,
    status: "COMPLETED",
    notes: "Reading speed improved significantly. Vocabulary practice helped!",
    resultSource: "MANUAL",
    isPersonalBest: true,
  },
  {
    id: "att-seed-3",
    resourceId: "topik-96-mock-1",
    resourceTitle: "96th TOPIK I Online Mock Test",
    providerName: "TOPIK GUIDE",
    examType: "TOPIK_I",
    examNumber: 96,
    year: 2025,
    format: "NEW_FORMAT",
    attemptNumber: 1,
    attemptDate: "2026-08-23",
    startedAt: "2026-08-23T08:00:00Z",
    completedAt: "2026-08-23T09:34:00Z",
    listeningScore: 82,
    readingScore: 78,
    totalScore: 160,
    maxScore: 200,
    listeningCorrect: 25,
    listeningTotal: 30,
    readingCorrect: 31,
    readingTotal: 40,
    timeTakenMinutes: 94,
    status: "COMPLETED",
    notes: "Great listening score! Struggled slightly with long dialogue passages in reading.",
    resultSource: "MANUAL",
    isPersonalBest: true,
  },
];
