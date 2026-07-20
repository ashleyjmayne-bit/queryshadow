# QueryShadow

> See what your agent’s searches reveal together.

QueryShadow is a local-first privacy debugger for AI agents that mix confidential context with public search. It catches **mosaic leakage**: a sequence in which every outbound query looks defensible on its own, but the complete trail reveals a private fact.

The no-login demo replays an agent trace, shows what a plausible observer could reconstruct, identifies the bridge facts that made the reconstruction possible, and rewrites only those details. The result is an exportable mitigation receipt with estimated residual exposure and retained research utility.

**OpenAI Build Week track:** Developer Tools  
**Runtime:** Browser-local, deterministic, no API key  
**Status:** Competition prototype; synthetic data only

**Live demo:** [queryshadow.ashleyjmayne.chatgpt.site](https://queryshadow.ashleyjmayne.chatgpt.site)  
**Public source:** [github.com/ashleyjmayne-bit/queryshadow](https://github.com/ashleyjmayne-bit/queryshadow)  
**Narrated demo:** [youtu.be/UsNllG7mQE4](https://youtu.be/UsNllG7mQE4)

![QueryShadow social preview](public/og.png)

## The problem

Deep-research agents increasingly read private files and call external tools in the same workflow. A search provider may never receive the source document, yet it sees the queries derived from that document.

Recent research formalised this as the mosaic effect: seemingly harmless queries become revealing in aggregate. The [MosaicLeaks paper](https://arxiv.org/abs/2605.30727) evaluated 1,001 multi-hop tasks and found that prompting for privacy reduced but did not eliminate leakage. Optimising only for task performance could worsen it.

Most controls inspect a single prompt, file, or tool call. QueryShadow treats the **ordered query trail** as the security boundary.

## The 30-second product loop

1. Replay an AI agent’s external queries.
2. Watch cumulative exposure rise even when individual-call risk stays low.
3. Inspect the private claim a plausible observer could reconstruct and the exact bridge evidence behind it.
4. Generate a safer plan that generalises identities, exact values, dates, locations, and unpublished thresholds.
5. Export a transparent mitigation receipt.

No account, upload, API key, or external service is needed for the judge path.

## What is implemented

- Three synthetic, domain-distinct traces: M&A diligence, clinical research, and product launch.
- A replayable cumulative exposure timeline.
- Per-query signal extraction across identity, intent, money, metric, time, location, health, and people context.
- An adversary-reconstruction panel with evidence-specific confidence.
- Privacy-budget accounting across the complete trace.
- Safer query rewrites with estimated retained utility.
- A browser-local trace importer for one-query-per-line logs.
- Downloadable JSON audits and copyable enforcement policy.
- Responsive UI, reduced-motion support, keyboard focus states, and no-login sample path.
- Explicit limitations in the product, not buried in documentation.

## Run locally

Prerequisites: Node.js 22.13 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production checks:

```bash
npm run lint
node node_modules/typescript/bin/tsc --noEmit
npm test
```

The direct Node paths in `package.json` make the scripts work consistently on Windows even when npm does not generate `.bin` shims.

## How the deterministic analyzer works

QueryShadow deliberately does not emit a mysterious model score.

1. **Extract signals.** Transparent rules identify bridge facts such as named entities, transaction intent, exact currency amounts, percentages, dates, sensitive domains, and locations.
2. **Accumulate context.** Risk rises as the trace gains distinct signal classes and linking queries. Ordering is preserved.
3. **Expose evidence.** Every finding shown in the UI links to literal query evidence.
4. **Rewrite minimally.** Exact bridge details are generalised while the research category is preserved.
5. **Bound the claim.** The score is a review-priority heuristic. It does not claim a provider actually made the inference.

The analyzer lives in [`app/analyzer.ts`](app/analyzer.ts). Seed traces and their safe plans are defined in the same typed schema, making the full demonstration inspectable.

## Architecture

```text
agent trace
    │
    ├── query-level signal extraction
    │       identity · value · date · intent · metric · location
    │
    ├── sequence accumulator
    │       cumulative exposure · bridge-entity joins · privacy budget
    │
    ├── observer reconstruction
    │       inferred claim · supporting fragments · confidence
    │
    └── mitigation planner
            safer rewrites · residual exposure · utility estimate · receipt
```

- UI: React 19, TypeScript, Vinext/Vite.
- Deployment target: OpenAI Sites / Cloudflare Workers.
- State: in-memory browser state; imported traces are not persisted or transmitted.
- Runtime AI: none. This is intentional for a private, instant, failure-free judge path.

## Evaluation

`tests/analyzer.test.mjs` covers:

- monotonically increasing cumulative risk;
- lower exposure after rewrite;
- bridge-signal extraction;
- removal of exact identity, value, location, date, and percentage details;
- deterministic audit IDs;
- honest risk-band boundaries.

`tests/rendered-html.test.mjs` verifies the complete server-rendered judge path and rejects starter/skeleton content.

Run the fixture evaluation with:

```bash
npm run eval
```

See [`EVALS.md`](EVALS.md) for scope and limitations.

## Built with Codex and GPT-5.6

The core project was created in a single primary Codex task using **GPT-5.6 Sol at Ultra effort**.

Codex/GPT-5.6 materially contributed to:

- parallel public-web gap research and collision checks;
- discovery of the very recent mosaic-leak threat model;
- comparison against meeting-alignment, education, accessibility, and generic agent-security concepts;
- the product decision to visualise cumulative inference rather than build another DLP dashboard;
- deterministic risk and rewrite rules;
- three synthetic adversarial traces;
- interface, copy, accessibility, tests, build repair, and submission packaging;
- an original social-preview asset generated through the built-in image workflow.

Important decisions made during the collaboration:

- The first concept was rejected after a search found a close commercial collision.
- Runtime LLM calls were excluded so a judge can test the complete product with no secret, cost, latency, or network dependency.
- Scores were framed as review priority rather than proof of surveillance or inference.
- Synthetic scenarios were used to avoid demonstrating privacy tooling with real private data.

**Required `/feedback` session ID:** `019f7d95-4905-7150-947d-788faff49562`

## Limitations

- QueryShadow is not a production DLP gateway and does not intercept live agent traffic in this prototype.
- The deterministic rules can miss indirect semantic clues and can flag benign exact details.
- Confidence values in seeded scenarios are scenario fixtures, not calibrated probabilities.
- Utility retention is an estimate until tested against the downstream research task.
- Production use should add organisation-specific sensitivity labels, adversarial reconstruction evals, policy review, and live trace adapters.

Those boundaries are also visible inside the app under **Method** and **Transparent limitations**.

## Project files

- [`app/QueryShadowApp.tsx`](app/QueryShadowApp.tsx) — interactive product UI.
- [`app/analyzer.ts`](app/analyzer.ts) — typed traces, detection, rewrites, scoring, and audit IDs.
- [`app/globals.css`](app/globals.css) — responsive visual system.
- [`tests/`](tests) — analyzer and rendered-page tests.
- [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md) — a timed sub-three-minute recording plan.
- [`SUBMISSION.md`](SUBMISSION.md) — Devpost-ready factual copy and checklist.

## License

MIT. See [`LICENSE`](LICENSE).
