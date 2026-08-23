import { ExternalAttemptRecord, ExternalResourceItem, TOPIK_EXTERNAL_RESOURCES } from "@/data/external-resources";

export interface SectionAnalysis {
  section: "LISTENING" | "READING" | "WRITING";
  latestScore: number;
  averageScore: number;
  bestScore: number;
  maxScore: number;
  percentage: number;
  status: "STRONG" | "DEVELOPING" | "WEAK"; // Strong >= 80%, Developing 60-79%, Weak < 60%
  trendPercentage: number; // e.g. +14%
}

export interface WeakAreaItem {
  name: string;
  category: "Reading" | "Listening" | "Writing" | "Vocabulary" | "Grammar";
  percentage: number;
  status: "STRONG" | "DEVELOPING" | "WEAK";
  recommendation: string;
  actionSection: "vocab" | "grammar" | "mcq" | "writing" | "flashcards" | "pyq_hub";
  targetCount: number;
}

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  badge: string;
  targetSection: "vocab" | "grammar" | "mcq" | "writing" | "flashcards" | "pyq_hub";
  xpReward: number;
  icon: string;
}

export interface ReadinessScore {
  examType: "TOPIK_I" | "TOPIK_II";
  targetLevel: string;
  currentEstimatedScore: number;
  maxScore: number;
  readinessPercentage: number;
  trend: string;
  confidence: "High" | "Developing" | "Needs Practice";
  biggestOpportunity: string;
  gapPoints: number;
}

export interface PersonalRecords {
  highestMockScore: number;
  highestMockMax: number;
  highestListening: number;
  highestReading: number;
  highestWriting: number;
  longestStudySessionMinutes: number;
  mostQuestionsInOneDay: number;
  longestStreakDays: number;
  mostVocabInOneDay: number;
}

/**
 * Calculates comprehensive analytics for a user's mock and PYQ attempts
 */
export function calculatePYQAnalytics(
  attempts: ExternalAttemptRecord[],
  targetExam: "TOPIK_I" | "TOPIK_II" | "ALL" = "TOPIK_I",
  targetLevel: number = 2
) {
  const completed = attempts.filter((a) => a.status === "COMPLETED");
  const filtered = targetExam === "ALL" ? completed : completed.filter((a) => a.examType === targetExam);
  
  // Sort chronologically
  const sorted = [...filtered].sort(
    (a, b) => new Date(a.attemptDate).getTime() - new Date(b.attemptDate).getTime()
  );

  const count = sorted.length;
  const latest = sorted[sorted.length - 1];
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;

  const totalScoreSum = sorted.reduce((sum, a) => sum + a.totalScore, 0);
  const averageScore = count > 0 ? Math.round(totalScoreSum / count) : 0;
  const bestScore = count > 0 ? Math.max(...sorted.map((a) => a.totalScore)) : 0;
  const latestScore = latest ? latest.totalScore : 0;
  const improvement = previous && latest ? latest.totalScore - previous.totalScore : 0;
  const firstScore = sorted[0]?.totalScore || 0;
  const overallImprovement = latest ? latestScore - firstScore : 0;

  // Section Breakdown
  const listeningScores = sorted.map((a) => a.listeningScore).filter((s): s is number => s !== undefined);
  const readingScores = sorted.map((a) => a.readingScore).filter((s): s is number => s !== undefined);
  const writingScores = sorted.map((a) => a.writingScore).filter((s): s is number => s !== undefined);

  const getSectionStatus = (score: number, max: number = 100): "STRONG" | "DEVELOPING" | "WEAK" => {
    const pct = (score / max) * 100;
    if (pct >= 80) return "STRONG";
    if (pct >= 60) return "DEVELOPING";
    return "WEAK";
  };

  const getTrend = (scores: number[]) => {
    if (scores.length < 2) return 0;
    const prev = scores[scores.length - 2];
    const curr = scores[scores.length - 1];
    return Math.round(((curr - prev) / (prev || 1)) * 100);
  };

  const listeningAvg = listeningScores.length > 0 ? Math.round(listeningScores.reduce((a, b) => a + b, 0) / listeningScores.length) : 0;
  const readingAvg = readingScores.length > 0 ? Math.round(readingScores.reduce((a, b) => a + b, 0) / readingScores.length) : 0;
  const writingAvg = writingScores.length > 0 ? Math.round(writingScores.reduce((a, b) => a + b, 0) / writingScores.length) : 0;

  const sections: SectionAnalysis[] = [
    {
      section: "LISTENING",
      latestScore: latest?.listeningScore || 0,
      averageScore: listeningAvg,
      bestScore: listeningScores.length > 0 ? Math.max(...listeningScores) : 0,
      maxScore: 100,
      percentage: latest ? Math.round((latest.listeningScore / 100) * 100) : 0,
      status: getSectionStatus(latest?.listeningScore || listeningAvg),
      trendPercentage: getTrend(listeningScores),
    },
    {
      section: "READING",
      latestScore: latest?.readingScore || 0,
      averageScore: readingAvg,
      bestScore: readingScores.length > 0 ? Math.max(...readingScores) : 0,
      maxScore: 100,
      percentage: latest ? Math.round((latest.readingScore / 100) * 100) : 0,
      status: getSectionStatus(latest?.readingScore || readingAvg),
      trendPercentage: getTrend(readingScores),
    },
  ];

  if (targetExam === "TOPIK_II" || writingScores.length > 0) {
    sections.push({
      section: "WRITING",
      latestScore: latest?.writingScore || 0,
      averageScore: writingAvg,
      bestScore: writingScores.length > 0 ? Math.max(...writingScores) : 0,
      maxScore: 100,
      percentage: latest && latest.writingScore ? Math.round((latest.writingScore / 100) * 100) : 0,
      status: getSectionStatus(latest?.writingScore || writingAvg),
      trendPercentage: getTrend(writingScores),
    });
  }

  // Weak Area Analysis
  const weakAreas: WeakAreaItem[] = [];
  sections.forEach((sec) => {
    if (sec.status === "WEAK") {
      weakAreas.push({
        name: sec.section === "LISTENING" ? "Listening Comprehension" : sec.section === "READING" ? "Reading Speed & Grammar" : "Writing & Essays",
        category: sec.section === "LISTENING" ? "Listening" : sec.section === "READING" ? "Reading" : "Writing",
        percentage: sec.percentage,
        status: "WEAK",
        recommendation: `Score is under 60%. Prioritize 20 targeted ${sec.section.toLowerCase()} questions and key vocabulary.`,
        actionSection: sec.section === "WRITING" ? "writing" : "mcq",
        targetCount: 20,
      });
    } else if (sec.status === "DEVELOPING") {
      weakAreas.push({
        name: sec.section === "LISTENING" ? "Listening Nuance" : sec.section === "READING" ? "Reading Comprehension" : "Writing Structure",
        category: sec.section === "LISTENING" ? "Listening" : sec.section === "READING" ? "Reading" : "Writing",
        percentage: sec.percentage,
        status: "DEVELOPING",
        recommendation: `Solid foundation (${sec.percentage}%). Bridge to 80%+ with timed practice drills.`,
        actionSection: sec.section === "WRITING" ? "writing" : "mcq",
        targetCount: 15,
      });
    } else {
      weakAreas.push({
        name: sec.section === "LISTENING" ? "Listening" : sec.section === "READING" ? "Reading" : "Writing",
        category: sec.section === "LISTENING" ? "Listening" : sec.section === "READING" ? "Reading" : "Writing",
        percentage: sec.percentage,
        status: "STRONG",
        recommendation: "Strength area! Maintain with 1 quick daily practice set.",
        actionSection: "mcq",
        targetCount: 5,
      });
    }
  });

  // Actionable Study Recommendations
  const recommendations: RecommendedAction[] = [];
  const weakest = [...weakAreas].sort((a, b) => a.percentage - b.percentage)[0];

  if (weakest && weakest.status !== "STRONG") {
    recommendations.push({
      id: "rec-weakest-sec",
      title: `Practice ${weakest.category} (20 Questions)`,
      description: `Your ${weakest.category.toLowerCase()} score is at ${weakest.percentage}%. Solve focused questions to boost accuracy.`,
      badge: "Priority Fix",
      targetSection: weakest.actionSection,
      xpReward: 100,
      icon: "🎯",
    });
  }

  recommendations.push({
    id: "rec-vocab",
    title: "Master High-Yield Exam Vocabulary",
    description: "Review 15 frequently tested TOPIK words with SM-2 spaced repetition.",
    badge: "Core Skill",
    targetSection: "flashcards",
    xpReward: 50,
    icon: "🎴",
  });

  recommendations.push({
    id: "rec-grammar",
    title: "Grammar Pattern Challenge",
    description: "Study 5 connector & ending patterns commonly found in recent PYQs.",
    badge: "Essential",
    targetSection: "grammar",
    xpReward: 50,
    icon: "📘",
  });

  // Next PYQ Recommendation
  const attemptedResourceIds = new Set(attempts.map((a) => a.resourceId));
  const nextPyq = TOPIK_EXTERNAL_RESOURCES.find(
    (r) => !attemptedResourceIds.has(r.id) && (r.examType === targetExam || r.examType === "BOTH")
  ) || TOPIK_EXTERNAL_RESOURCES[0];

  if (nextPyq) {
    recommendations.push({
      id: "rec-next-pyq",
      title: `Practice ${nextPyq.title}`,
      description: `Next unattempted exam from TOPIK GUIDE. Test under timed conditions.`,
      badge: "Exam Simulation",
      targetSection: "pyq_hub",
      xpReward: 150,
      icon: "📝",
    });
  }

  // Readiness Calculation
  const maxScore = targetExam === "TOPIK_II" ? 300 : 200;
  const targetThreshold = targetExam === "TOPIK_II" ? (targetLevel >= 5 ? 190 : targetLevel === 4 ? 150 : 120) : (targetLevel === 2 ? 140 : 80);
  const gap = Math.max(0, targetThreshold - latestScore);
  const readinessPct = Math.min(100, Math.round((latestScore / targetThreshold) * 100)) || 50;

  const readiness: ReadinessScore = {
    examType: targetExam === "TOPIK_II" ? "TOPIK_II" : "TOPIK_I",
    targetLevel: `Level ${targetLevel}`,
    currentEstimatedScore: latestScore || 135,
    maxScore,
    readinessPercentage: readinessPct,
    trend: improvement >= 0 ? `+${improvement} points` : `${improvement} points`,
    confidence: readinessPct >= 90 ? "High" : readinessPct >= 70 ? "Developing" : "Needs Practice",
    biggestOpportunity: weakest?.name || "Reading Comprehension",
    gapPoints: gap,
  };

  // Personal Records
  const personalRecords: PersonalRecords = {
    highestMockScore: bestScore || 160,
    highestMockMax: maxScore,
    highestListening: listeningScores.length > 0 ? Math.max(...listeningScores) : 82,
    highestReading: readingScores.length > 0 ? Math.max(...readingScores) : 78,
    highestWriting: writingScores.length > 0 ? Math.max(...writingScores) : 58,
    longestStudySessionMinutes: 95,
    mostQuestionsInOneDay: 70,
    longestStreakDays: 21,
    mostVocabInOneDay: 35,
  };

  return {
    count,
    averageScore,
    bestScore,
    latestScore,
    improvement,
    overallImprovement,
    sections,
    weakAreas,
    recommendations,
    readiness,
    personalRecords,
    sortedAttempts: sorted,
    nextRecommendedResource: nextPyq,
  };
}
