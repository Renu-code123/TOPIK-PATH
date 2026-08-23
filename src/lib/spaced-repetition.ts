/**
 * SuperMemo 2 (SM-2) Spaced Repetition Algorithm
 */

export interface SM2Input {
  repetition: number;     // Number of consecutive correct reviews
  interval: number;       // In days
  easinessFactor: number; // Default 2.5
  grade: number;          // 0 to 5 (0-2: Fail, 3: Hard, 4: Good, 5: Easy)
}

export interface SM2Output {
  repetition: number;
  interval: number;
  easinessFactor: number;
  nextReview: Date;
}

export function calculateSM2({
  repetition,
  interval,
  easinessFactor,
  grade,
}: SM2Input): SM2Output {
  let nextRepetition = repetition;
  let nextInterval = interval;
  let nextEF = easinessFactor;

  // Calculate new Easiness Factor (EF)
  nextEF = nextEF + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (nextEF < 1.3) nextEF = 1.3;

  if (grade >= 3) {
    // Correct response
    if (nextRepetition === 0) {
      nextInterval = 1;
    } else if (nextRepetition === 1) {
      nextInterval = 6;
    } else {
      nextInterval = Math.round(interval * nextEF);
    }
    nextRepetition += 1;
  } else {
    // Incorrect response, reset repetitions
    nextRepetition = 0;
    nextInterval = 1;
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + nextInterval);

  return {
    repetition: nextRepetition,
    interval: nextInterval,
    easinessFactor: Number(nextEF.toFixed(2)),
    nextReview,
  };
}
