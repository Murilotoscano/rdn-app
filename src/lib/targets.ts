/**
 * Practice benchmark, not the real passing standard. The CDR reports a scaled score
 * (25 on a 1-50 scale) from an adaptive exam and publishes no raw-percentage cutoff,
 * so this is the lower bound of the 75-80% target the Day 30 study plan recommends.
 *
 * Every screen that judges a score against a target reads it from here, so the
 * verdict on the result page and the line on the dashboard chart cannot drift apart.
 */
export const PRACTICE_TARGET_PCT = 75;
