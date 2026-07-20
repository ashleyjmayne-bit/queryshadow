import assert from "node:assert/strict";
import test from "node:test";
import {
  analyzeCustomTrace,
  DEMO_SCENARIOS,
  extractSignals,
  getRiskBand,
  sanitizeQuery,
} from "../app/analyzer.ts";

test("seeded traces become riskier cumulatively but safer after rewriting", () => {
  for (const scenario of DEMO_SCENARIOS) {
    const cumulative = scenario.queries.map((query) => query.cumulativeRisk);
    assert.deepEqual(cumulative, [...cumulative].sort((a, b) => a - b));
    assert.equal(scenario.risk, cumulative.at(-1));
    assert.ok(scenario.safeRisk < scenario.risk - 50);
    assert.ok(scenario.utility >= 90);
    assert.ok(scenario.queries.every((query) => query.safeRisk < query.cumulativeRisk || query.cumulativeRisk < 10));
  }
});

test("extracts bridge facts that are weak alone and risky in combination", () => {
  const signals = extractSignals(
    "Atlas Energy acquisition 68 million AUD in Sydney on 9 October 2026 with 14% churn",
  );
  const kinds = new Set(signals.map((item) => item.kind));
  assert.ok(kinds.has("identity"));
  assert.ok(kinds.has("intent"));
  assert.ok(kinds.has("money"));
  assert.ok(kinds.has("location"));
  assert.ok(kinds.has("time"));
  assert.ok(kinds.has("metric"));
});

test("sanitizer removes exact bridge identities, values, locations and dates", () => {
  const safe = sanitizeQuery(
    "Atlas Energy acquisition A$68 million Sydney board review 9 October 2026",
  );
  assert.doesNotMatch(safe, /Atlas Energy|A\$68|Sydney|9 October/i);
  assert.match(safe, /organisation|comparable value range|target region|target period/i);
});

test("custom analysis is deterministic and preserves trace order", () => {
  const raw = [
    "Australian fintech acquisition benchmarks",
    "42 million AUD notification threshold",
    "Melbourne board review 22 October 2026",
  ].join("\n");
  const first = analyzeCustomTrace(raw);
  const second = analyzeCustomTrace(raw);
  assert.equal(first.auditId, second.auditId);
  assert.equal(first.queries.length, 3);
  assert.ok(first.queries[2].cumulativeRisk >= first.queries[0].cumulativeRisk);
  assert.ok(first.safeRisk < first.risk);
});

test("risk bands expose review priority without implying certainty", () => {
  assert.equal(getRiskBand(12), "contained");
  assert.equal(getRiskBand(30), "guarded");
  assert.equal(getRiskBand(55), "high");
  assert.equal(getRiskBand(80), "critical");
});

