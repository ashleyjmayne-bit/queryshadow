import { readFile } from "node:fs/promises";
import { analyzeCustomTrace, extractSignals, sanitizeQuery } from "../app/analyzer.ts";

const cases = JSON.parse(
  await readFile(new URL("../evals/cases.json", import.meta.url), "utf8"),
);

let expectedSignals = 0;
let recoveredSignals = 0;
let unexpectedSignals = 0;
let rewriteChecks = 0;
let rewritePasses = 0;

const signalDetails = cases.signalCases.map((fixture) => {
  const found = extractSignals(fixture.query);
  const actualKinds = [...new Set(found.map((item) => item.kind))];
  const expected = new Set(fixture.expectedKinds);
  const actual = new Set(actualKinds);
  const recovered = fixture.expectedKinds.filter((kind) => actual.has(kind));
  const unexpected = actualKinds.filter((kind) => !expected.has(kind));
  const safe = sanitizeQuery(fixture.query);
  const removed = fixture.mustRemove.filter(
    (value) => !safe.toLowerCase().includes(value.toLowerCase()),
  );

  expectedSignals += fixture.expectedKinds.length;
  recoveredSignals += recovered.length;
  unexpectedSignals += unexpected.length;
  rewriteChecks += fixture.mustRemove.length;
  rewritePasses += removed.length;

  return {
    id: fixture.id,
    expectedKinds: fixture.expectedKinds,
    actualKinds,
    rewriteChecks: fixture.mustRemove.length,
    rewritePasses: removed.length,
  };
});

const benignDetails = cases.benignCases.map((query) => ({
  query,
  signals: extractSignals(query).map((item) => item.kind),
}));
const benignFalseAlarms = benignDetails.filter((item) => item.signals.length > 0).length;

const traceDetails = cases.traceCases.map((fixture) => {
  const result = analyzeCustomTrace(fixture.queries.join("\n"));
  const pass =
    result.risk >= fixture.minimumObservedRisk &&
    result.safeRisk <= fixture.maximumSafeRisk &&
    result.safeRisk < result.risk;
  return {
    id: fixture.id,
    observedRisk: result.risk,
    safeRisk: result.safeRisk,
    expected: {
      minimumObservedRisk: fixture.minimumObservedRisk,
      maximumSafeRisk: fixture.maximumSafeRisk,
    },
    pass,
  };
});

const signalRecall = expectedSignals ? recoveredSignals / expectedSignals : 1;
const signalPrecision = recoveredSignals + unexpectedSignals
  ? recoveredSignals / (recoveredSignals + unexpectedSignals)
  : 1;
const rewritePassRate = rewriteChecks ? rewritePasses / rewriteChecks : 1;
const tracePassRate = traceDetails.filter((item) => item.pass).length / traceDetails.length;

const report = {
  fixtureVersion: 1,
  signalCases: cases.signalCases.length,
  benignCases: cases.benignCases.length,
  traceCases: cases.traceCases.length,
  metrics: {
    signalRecall: Number(signalRecall.toFixed(3)),
    signalPrecision: Number(signalPrecision.toFixed(3)),
    benignFalseAlarmRate: Number((benignFalseAlarms / cases.benignCases.length).toFixed(3)),
    rewritePassRate: Number(rewritePassRate.toFixed(3)),
    tracePassRate: Number(tracePassRate.toFixed(3)),
  },
  signalDetails,
  benignDetails,
  traceDetails,
  caveat: "Synthetic regression fixtures; not a calibrated real-world privacy benchmark.",
};

console.log(JSON.stringify(report, null, 2));

if (
  signalRecall < 1 ||
  signalPrecision < 0.95 ||
  benignFalseAlarms > 0 ||
  rewritePassRate < 1 ||
  tracePassRate < 1
) {
  process.exitCode = 1;
}

