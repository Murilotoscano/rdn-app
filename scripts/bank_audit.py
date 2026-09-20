#!/usr/bin/env python3
"""Audit the question bank in src/lib/questions.ts.

Run:  python3 scripts/bank_audit.py            # summary to stdout
      python3 scripts/bank_audit.py --markdown docs/bank_audit.md

Three checks, all reproducible from this file alone:

1. INTEGRITY  unique ids, exactly 4 distinct options, correctIndex in range, no option
   that points at another option by letter (options are shuffled at runtime, so
   "Both B and C" would be wrong for most students), no non-Latin characters.

2. LENGTH CUE  whether option length gives the answer away. Measured two ways
   (characters and words) over the whole bank. Ties are handled explicitly: a
   "strictly longest" option has no tie, and the guessing strategies split ties at
   random (1/k when k options tie). Chance is 25%.

3. TOPIC COVERAGE  for each high-yield topic, the questions that actually TRAIN it:
   the pattern must match the stem or the correct answer. A word appearing only in a
   distractor or in the explanation does not count, because the student can answer the
   item without ever engaging the topic.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BANK = ROOT / "src" / "lib" / "questions.ts"
HEAD = "SAMPLE_QUESTIONS: Question[] = ["


def load():
    src = BANK.read_text(encoding="utf-8")
    start = src.index(HEAD) + len(HEAD) - 1
    end = src.rindex("\n];") + 2
    return json.loads(src[start:end])


def integrity(qs):
    problems = []
    seen = set()
    # Case-sensitive on purpose: lowercase "both a water-loving and a fat-loving end" is
    # ordinary English, while "Both B and C" points at another option.
    letter_ref = re.compile(r"\b(?:[Bb]oth|[Ee]ither|[Nn]either|[Oo]ption|[Cc]hoice)s? [A-D]\b|\b[A-D] (?:and|or) [A-D]\b")
    # Reviewed and kept: the letters name SAMPLES in a sensory test, not answer options.
    letter_ref_ok = {"m1-rc-025"}
    for q in qs:
        qid = q.get("id", "?")
        if qid in seen:
            problems.append(f"{qid}: duplicate id")
        seen.add(qid)
        opts = q.get("options", [])
        if len(opts) != 4:
            problems.append(f"{qid}: {len(opts)} options")
        if len({o.strip().lower() for o in opts}) != len(opts):
            problems.append(f"{qid}: duplicate option text")
        if not 0 <= q.get("correctIndex", -1) < len(opts):
            problems.append(f"{qid}: correctIndex out of range")
        for i, o in enumerate(opts):
            if letter_ref.search(o) and qid not in letter_ref_ok:
                problems.append(f"{qid}: option {'ABCD'[i]} refers to another option by letter")
            if re.search(r"[Ѐ-ӿ　-鿿]", o):
                problems.append(f"{qid}: option {'ABCD'[i]} has non-Latin characters")
        if not q.get("explanation"):
            problems.append(f"{qid}: no explanation")
    return problems


def length_cue(qs, unit="chars"):
    def size(o):
        return len(o) if unit == "chars" else len(o.split())

    n = len(qs)
    strict_longest = strict_shortest = 0
    rank_hit = [0.0, 0.0, 0.0, 0.0]
    visible_fires = visible_hits = 0
    for q in qs:
        lens = [size(o) for o in q["options"]]
        k = q["correctIndex"]
        if lens[k] == max(lens) and lens.count(max(lens)) == 1:
            strict_longest += 1
        if lens[k] == min(lens) and lens.count(min(lens)) == 1:
            strict_shortest += 1
        order = sorted(range(4), key=lambda i: -lens[i])
        for r in range(4):  # "always pick the r-th longest", ties split evenly
            v = lens[order[r]]
            tied = [i for i in range(4) if lens[i] == v]
            rank_hit[r] += (1 / len(tied)) if k in tied else 0
        # "pick the option that LOOKS longest": only when it beats the runner-up by >10%
        if lens[order[0]] >= lens[order[1]] * 1.10:
            visible_fires += 1
            visible_hits += 1 if order[0] == k else 0
    return {
        "n": n,
        "strict_longest_pct": strict_longest / n * 100,
        "strict_shortest_pct": strict_shortest / n * 100,
        "rank_pct": [r / n * 100 for r in rank_hit],
        "visible_fires": visible_fires,
        "visible_hit_pct": (visible_hits / visible_fires * 100) if visible_fires else 0.0,
        "visible_strategy_pct": ((visible_hits + 0.25 * (n - visible_fires)) / n) * 100,
    }


# Topic -> regex. Matched against the stem and the correct answer only.
TOPICS = [
    ("1. Break-even point", r"break-?even"),
    ("2. EP/AP yield and purchasing quantities", r"edible portion|as purchased|yield (factor|test|percent)|\bEP\b|\bAP\b"),
    ("3. Forecasting and moving averages", r"forecast|moving average"),
    ("4. Employee turnover rate", r"turnover"),
    ("5. Food cost, selling price, profit margin", r"food cost|cost per meal|selling price|profit margin|contribution margin|markup"),
    ("6. Meals per labor hour", r"meals per labor|labor hour|productivity"),
    ("7. Foodservice temperatures", r"danger zone|internal temperature|hot holding|cold holding|165|155|145|135|41 degrees|reheat"),
    ("8. Motion economy and work simplification", r"motion economy|work simplification|process flow chart|pathway chart"),
    ("9. Indirect and fixed costs", r"fixed cost|indirect cost|overhead|variable cost"),
    ("10. Leadership styles in a crisis", r"autocratic|situational leadership|hersey|leadership style"),
    ("11. Commissary, transport and HACCP", r"commissary|cook-?chill|satellite|critical control point|HACCP"),
    ("12. Labor relations and union arrangements", r"union shop|agency shop|closed shop|collective bargaining|right-to-work|picket|arbitration|arbitrator|\\bmediation\\b|\\bmediator\\b|\\bunion\\b"),
    ("13. FLSA and Civil Rights Act", r"fair labor standards|civil rights act|title vii|minimum wage|overtime|ADA\b|FMLA"),
    ("14. Can sizes, yields and case packs", r"#10 can|#303|can size|case pack"),
    ("15. Additives, antioxidants, preservatives, emulsifiers", r"\bBHA\b|\bBHT\b|tocopherol|lecithin|pectin|sulfite|benzoate|propionate|nitrite|sequestrant|emulsifier|humectant|antioxidant"),
    ("16. Processing, preservation, packaging", r"pasteuri|irradiat|retort|aseptic|water activity|modified atmosphere|blanch|canning|high pressure processing"),
    ("17. MNT for PKU", r"\bPKU\b|phenylketonuria|phenylalanine"),
    ("18. MNT for cystic fibrosis", r"cystic fibrosis|pancreatic enzyme"),
    ("19. MNT for MSUD", r"\bMSUD\b|maple syrup urine|branched-chain amino acid"),
    ("20. Differentiating anemias", r"anemia|ferritin|\bMCV\b|megaloblastic|koilonychia"),
    ("21. Renal physiology and labs", r"\bGFR\b|creatinine|\bBUN\b|dialysis|nephron|glomerul"),
    ("22. Celiac disease and food choices", r"celiac|gluten"),
    ("23. Nutrition diagnosis in pressure injuries", r"pressure (injury|ulcer)"),
    ("24. Parenteral nutrition calculations", r"NPC:N|nitrogen|dextrose|osmolarity|parenteral"),
    ("25. Enteral volume, free water, fluid needs", r"free water|fluid need|mL/kg|flush|formula volume"),
    ("26. Intermittent vs continuous enteral delivery", r"bolus|continuous (feed|infusion)|infusion rate|mL/hour"),
    ("27. Glycolysis, gluconeogenesis, glycogenolysis", r"glycolysis|gluconeogenesis|glycogenolysis|glycogenesis|Cori Cycle"),
    ("28. Pregnancy and lactation requirements", r"pregnan|lactation|breastfeed|gestational"),
    ("29. Sodium and potassium reference intakes", r"sodium intake|potassium intake|2,?300 mg|mEq|sodium restriction"),
    ("30. Warfarin and vitamin K", r"warfarin|vitamin K"),
    ("31. Eating disorder terminology and assessment", r"anorexia nervosa|bulimia|binge|ARFID|refeeding"),
    ("32. PCOS", r"polycystic|\bPCOS\b"),
    ("33. Addison disease", r"addison|adrenal"),
    ("34. Vegan and lacto-vegetarian nutrition", r"vegan|vegetarian|complementary protein"),
    ("35. Physical signs of deficiency", r"koilonychia|corkscrew|glossitis|cheilosis|Bitot|physical exam|temporalis|muscle wasting|fat loss"),
    ("36. FOCUS process improvement", r"FOCUS-PDSA|FOCUS model|\\bPDSA\\b|\\bPDCA\\b|FADE model|continuous quality improvement"),
    ("37. B-vitamin deficiencies", r"thiamin|riboflavin|niacin|pyridoxine|B12|folate|beriberi|pellagra"),
    ("38. Education, needs assessment, program planning", r"needs assessment|program planning|logic model|learning objective|formative evaluation|summative"),
    ("39. Counseling and motivational interviewing", r"motivational interviewing|stages of change|transtheoretical|OARS|sustain talk|counseling"),
    ("40. Dietary assessment and anthropometry", r"24-hour recall|food frequency|diet history|anthropometric|BMI|skinfold|waist circumference"),
    ("41. Cross-sectional, RCT and cohort designs", r"cross-sectional|randomized controlled|cohort|case-control"),
    ("42. Null hypothesis", r"null hypothesis|type I error|type II error"),
    ("43. Causation versus association", r"causation|correlation|confounder|odds ratio|relative risk"),
    ("44. Prevalence and epidemiology", r"prevalence|incidence|mortality|morbidity"),
    ("45. Medical terminology", r"medical terminology|prefix|suffix|dysphagia|-emia|hepatomegaly|oliguria|pancytopenia"),
    ("46. Communication and technology in education", r"teach-back|health literacy|telehealth|readability|handout|learning style"),
    ("47. Choosing a communication channel", r"interpreter|literacy|cultural|channel|written material"),
    ("48. Management and leadership", r"\\bleadership\\b|\\bdelegat|span of control|Theory [XYZ]\\b|management skill|scalar principle|chain of command"),
    ("49. Best-answer applied cases (skill)", r"\bBEST\b|most appropriate|most likely"),
    ("50. First-action prioritisation (skill)", r"\bFIRST\b|initial step|first step"),
]


def coverage(qs):
    rows = []
    for name, pat in TOPICS:
        # Acronyms are matched case-sensitively so that the ordinary word "focus" does not
        # count as a FOCUS-PDSA question.
        rx = re.compile(pat) if "FOCUS" in pat else re.compile(pat, re.I)
        ids = [q["id"] for q in qs if rx.search(q["text"]) or rx.search(q["options"][q["correctIndex"]])]
        doms = sorted({q["domain"] for q in qs if q["id"] in set(ids)})
        rows.append((name, ids, doms))
    return rows


def main():
    qs = load()
    problems = integrity(qs)
    chars = length_cue(qs, "chars")
    words = length_cue(qs, "words")
    rows = coverage(qs)

    out = []
    out.append(f"# Question bank audit\n")
    out.append(f"Bank: `src/lib/questions.ts` - {len(qs)} questions.\n")
    out.append("## 1. Integrity\n")
    out.append("No problems found.\n" if not problems else "\n".join(f"- {p}" for p in problems) + "\n")
    out.append("## 2. Answer-length cue\n")
    out.append("Method: option length measured in characters and, separately, in words. "
               "'Strictly longest' means no other option ties it. The guessing strategies split "
               "ties at random, so a four-way tie contributes 0.25. Chance = 25%.\n")
    for unit, m in (("characters", chars), ("words", words)):
        out.append(f"\n**By {unit}** (n = {m['n']})\n")
        out.append(f"- Key is strictly the longest option: {m['strict_longest_pct']:.1f}%")
        out.append(f"- Key is strictly the shortest option: {m['strict_shortest_pct']:.1f}%")
        out.append("- Always pick the Nth longest: " + ", ".join(
            f"{i+1}st={p:.1f}%" if i == 0 else f"{i+1}th={p:.1f}%" for i, p in enumerate(m["rank_pct"])))
        out.append(f"- 'Pick the visibly longest' (>10% longer than the runner-up): rule fires on "
                   f"{m['visible_fires']} questions and is right {m['visible_hit_pct']:.1f}% of the time there; "
                   f"guessing elsewhere the whole strategy scores {m['visible_strategy_pct']:.1f}%\n")
    out.append("\nLength is only one cue. Grammar agreement, absurd distractors and excess detail are "
               "reviewed by reading items, not by this script.\n")
    out.append("\n## 3. Topic coverage\n")
    out.append("A question counts for a topic only when the pattern matches the STEM or the CORRECT "
               "ANSWER. Matches confined to a distractor or an explanation are excluded.\n")
    out.append("\n| Topic | n | Domains | Sample ids |")
    out.append("| --- | ---: | --- | --- |")
    for name, ids, doms in rows:
        sample = ", ".join(ids[:4]) + (" ..." if len(ids) > 4 else "")
        out.append(f"| {name} | {len(ids)} | {', '.join(d.replace('Domain ', '') for d in doms) or '-'} | {sample} |")
    thin = [(n, len(i)) for n, i, _ in rows if len(i) < 4]
    out.append("\n**Under 4 questions (operational alert, not proof of mastery):** "
               + (", ".join(f"{n} ({c})" for n, c in thin) if thin else "none") + "\n")
    text = "\n".join(out)

    if "--markdown" in sys.argv:
        dest = ROOT / sys.argv[sys.argv.index("--markdown") + 1]
        dest.write_text(text, encoding="utf-8")
        print(f"wrote {dest}")
    print(text if "--markdown" not in sys.argv else
          f"{len(qs)} questions, {len(problems)} integrity problems, "
          f"key strictly longest {chars['strict_longest_pct']:.1f}% (chars) / {words['strict_longest_pct']:.1f}% (words)")


if __name__ == "__main__":
    main()
