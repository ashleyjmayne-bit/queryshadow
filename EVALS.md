# QueryShadow evaluation notes

The prototype uses a transparent heuristic analyzer. Its evals are designed to catch implementation regressions and overclaiming—not to present an academic benchmark.

Current synthetic fixture run (20 July 2026): 8/8 signal cases recovered, 0/6 benign false alarms, 8/8 targeted bridge details removed, and 3/3 trace-level thresholds passed. These perfect fixture results show that the declared rules behave as specified on this small suite; they do **not** estimate performance on unseen real-world traces.

## What is measured

- Expected signal classes are recovered from synthetic outbound queries.
- Benign queries do not receive sensitive markers in the small fixture set.
- Exact bridge details targeted by a rewrite no longer appear in the safe query.
- Cumulative risk is monotonic within a trace.
- Safe-plan risk is lower than observed-plan risk.
- Identical imports produce identical audit IDs.
- The server-rendered page contains the complete no-login judge path and no starter skeleton.

## What is not measured yet

- Whether a real search provider or adversary reconstructs the seeded claim.
- Calibrated probability of inference.
- Downstream task accuracy after every rewrite.
- Indirect semantic clues that do not match a transparent rule.
- Organisation-specific sensitivity policy.

## Why the fixtures are synthetic

A privacy tool should not need real confidential data to prove its interaction. The three built-in traces are fictional and intentionally span corporate, clinical, and product contexts.

## Run

```bash
npm test
npm run eval
```

The eval runner reads `evals/cases.json` and prints machine-readable results.
