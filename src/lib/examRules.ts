/**
 * Rules of the real RD exam, from the CDR 2026 Candidate RD Exam Handbook
 * (https://www.cdrnet.org/rd-handbook). Mock exams in "real conditions" read these so
 * practice matches test day instead of rewarding habits the exam does not allow.
 *
 * - "Candidates will have three (3) hours to complete the examination."
 * - Between 125 and 145 questions are administered (computer adaptive).
 * - "If less than 125 items are answered when the three (3) hour testing period has
 *   ended, the candidate will receive a failed score."
 * - "Are candidates allowed to change question responses, skip questions, or review
 *   question responses? No."
 */
export const EXAM_MINUTES = 180;
export const EXAM_MAX_QUESTIONS = 145;
export const EXAM_MIN_ANSWERED = 125;
