import type { Question } from "@/types";

/**
 * Domain weights the CDR blueprint assigns to the RDN exam, matching the
 * percentages shown in the study guides (see src/app/study-guides/page.tsx).
 */
export const CDR_BLUEPRINT: Record<string, number> = {
    "Domain I": 0.21,
    "Domain II": 0.45,
    "Domain III": 0.21,
    "Domain IV": 0.13,
};

export const DOMAIN_BY_MODULE_ID: Record<string, string> = {
    "1": "Domain I",
    "2": "Domain II",
    "3": "Domain III",
    "4": "Domain IV",
};

/** FNV-1a: stable 32-bit string hash, so a given id always mixes the same way. */
function hashString(str: string): number {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
}

/** mulberry32: small seeded PRNG, plenty for shuffling four options. */
function mulberry32(seed: number): () => number {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function newSessionSeed(): number {
    return (Math.random() * 0xffffffff) >>> 0;
}

function seededShuffle<T>(arr: T[], rand: () => number): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Reorders a question's options and remaps correctIndex to match.
 *
 * The authored bank is badly skewed: 88% of answer keys sit on B or C, and blindly
 * answering "B" scores 52%. Shuffling on read spreads the key evenly across all four
 * positions without editing 870 records, and since every caller compares against the
 * returned correctIndex, no downstream logic changes.
 *
 * Deterministic in (question.id, seed): stable across re-renders inside one session,
 * different between sessions, so a remembered position never becomes the answer.
 */
export function shuffleQuestionOptions<T extends Question>(question: T, seed: number): T {
    const rand = mulberry32(hashString(question.id) ^ seed);
    const order = seededShuffle(question.options.map((_, i) => i), rand);

    const options = order.map(i => question.options[i]) as [string, string, string, string];
    const correctIndex = order.indexOf(question.correctIndex);

    const shuffled: T = { ...question, options, correctIndex };

    // CdrQuestion carries a denormalized answer key; keep it consistent with the new order.
    if ("correctLetter" in shuffled) {
        (shuffled as T & { correctLetter: string }).correctLetter = String.fromCharCode(65 + correctIndex);
    }
    if ("correctText" in shuffled) {
        (shuffled as T & { correctText: string }).correctText = options[correctIndex];
    }

    return shuffled;
}

/**
 * Draws `count` questions honouring the CDR domain weights instead of sampling the bank
 * uniformly. The bank itself is skewed (Domain II is 34.5% of it but 45% of the real exam),
 * so a uniform draw under-tests the heaviest domain by ~15 questions per 145-question mock.
 *
 * If a domain pool cannot fill its quota, the shortfall is backfilled from the remaining
 * questions so the caller still gets `count` items.
 */
export function sampleByBlueprint(
    pool: Question[],
    count: number,
    seed: number,
    seen?: Record<string, number>
): Question[] {
    const rand = mulberry32(seed);

    const byDomain = new Map<string, Question[]>();
    for (const q of pool) {
        const list = byDomain.get(q.domain);
        if (list) list.push(q);
        else byDomain.set(q.domain, [q]);
    }
    for (const list of byDomain.values()) {
        seededShuffle(list, rand);
        // A score on remembered questions measures memory, not readiness. Put never-attempted
        // questions first, then the ones attempted longest ago. The sort is stable, so the
        // shuffle still randomizes order within each group.
        if (seen) list.sort((a, b) => (seen[a.id] ?? -Infinity) - (seen[b.id] ?? -Infinity));
    }

    const domains = Object.keys(CDR_BLUEPRINT);

    // Largest-remainder allocation so the per-domain targets sum to exactly `count`.
    const targets = new Map(domains.map(d => [d, Math.floor(CDR_BLUEPRINT[d] * count)]));
    let assigned = [...targets.values()].reduce((a, b) => a + b, 0);
    const byRemainder = [...domains].sort((a, b) =>
        ((CDR_BLUEPRINT[b] * count) % 1) - ((CDR_BLUEPRINT[a] * count) % 1)
    );
    for (const d of byRemainder) {
        if (assigned >= count) break;
        targets.set(d, targets.get(d)! + 1);
        assigned++;
    }

    const picked: Question[] = [];
    const leftovers: Question[] = [];

    for (const d of domains) {
        const available = byDomain.get(d) ?? [];
        const target = targets.get(d)!;
        picked.push(...available.slice(0, target));
        leftovers.push(...available.slice(target));
    }
    // Questions in domains outside the blueprint are still eligible as backfill.
    for (const [d, list] of byDomain) {
        if (!(d in CDR_BLUEPRINT)) leftovers.push(...list);
    }

    if (picked.length < count) {
        picked.push(...seededShuffle(leftovers, rand).slice(0, count - picked.length));
    }

    return seededShuffle(picked, rand);
}
