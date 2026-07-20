"use client";

import { useEffect, useMemo, useState } from "react";
import {
  analyzeCustomTrace,
  DEMO_SCENARIOS,
  getRiskBand,
  type TraceQuery,
  type TraceScenario,
} from "./analyzer";

type Mode = "observed" | "safe";

const EXAMPLE_TRACE = `Australian fintech firms 80-100 employees revenue 2025
founder retention clause 24 month acquisition
ASIC notification private acquisition 42 million AUD
11% customer churn fintech benchmark
Melbourne board approval 22 October 2026`;

function RiskMeter({ score, label }: { score: number; label: string }) {
  const band = getRiskBand(score);
  return (
    <div className={`risk-meter risk-${band}`} aria-label={`${label}: ${score} out of 100`}>
      <div className="risk-number">
        <strong>{score}</strong>
        <span>/100</span>
      </div>
      <div className="risk-copy">
        <span>{label}</span>
        <b>{band}</b>
      </div>
    </div>
  );
}

function SignalPill({ kind, evidence }: { kind: string; evidence: string }) {
  return (
    <span className={`signal-pill signal-${kind}`}>
      <i aria-hidden="true" />
      {evidence}
    </span>
  );
}

function QueryCard({
  query,
  index,
  mode,
  selected,
  onSelect,
}: {
  query: TraceQuery;
  index: number;
  mode: Mode;
  selected: boolean;
  onSelect: () => void;
}) {
  const score = mode === "safe" ? query.safeRisk : query.cumulativeRisk;
  return (
    <button
      className={`query-card ${selected ? "is-selected" : ""}`}
      onClick={onSelect}
      type="button"
    >
      <span className="query-index">Q{String(index + 1).padStart(2, "0")}</span>
      <span className="query-card-copy">
        <span className="query-destination">
          {query.destination} <em>{query.elapsed}</em>
        </span>
        <strong>{mode === "safe" ? query.safeText : query.text}</strong>
      </span>
      <span className={`query-score ${getRiskBand(score)}`}>{score}</span>
    </button>
  );
}

export default function QueryShadowApp() {
  const [scenarios, setScenarios] = useState<TraceScenario[]>(DEMO_SCENARIOS);
  const [scenarioId, setScenarioId] = useState(DEMO_SCENARIOS[0].id);
  const [mode, setMode] = useState<Mode>("observed");
  const [visibleCount, setVisibleCount] = useState(DEMO_SCENARIOS[0].queries.length);
  const [selectedIndex, setSelectedIndex] = useState(DEMO_SCENARIOS[0].queries.length - 1);
  const [playing, setPlaying] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const [traceInput, setTraceInput] = useState(EXAMPLE_TRACE);
  const [traceError, setTraceError] = useState("");
  const [copied, setCopied] = useState(false);

  const scenario = useMemo(
    () => scenarios.find((item) => item.id === scenarioId) ?? scenarios[0],
    [scenarioId, scenarios],
  );

  useEffect(() => {
    if (!playing || visibleCount >= scenario.queries.length) return;
    const timer = window.setTimeout(() => {
      const nextCount = visibleCount + 1;
      setVisibleCount(nextCount);
      setSelectedIndex(nextCount - 1);
      if (nextCount >= scenario.queries.length) setPlaying(false);
    }, 620);
    return () => window.clearTimeout(timer);
  }, [playing, scenario.queries.length, visibleCount]);

  const visibleQueries = scenario.queries.slice(0, visibleCount);
  const selectedQuery = scenario.queries[Math.min(selectedIndex, scenario.queries.length - 1)];
  const currentQuery = visibleQueries.at(-1);
  const currentRisk = currentQuery
    ? mode === "safe"
      ? currentQuery.safeRisk
      : currentQuery.cumulativeRisk
    : 0;
  const riskDelta = Math.max(0, scenario.risk - scenario.safeRisk);

  function replay() {
    setMode("observed");
    setVisibleCount(1);
    setSelectedIndex(0);
    setPlaying(true);
  }

  function selectScenario(nextScenario: TraceScenario) {
    setScenarioId(nextScenario.id);
    setMode("observed");
    setPlaying(false);
    setVisibleCount(nextScenario.queries.length);
    setSelectedIndex(Math.max(0, nextScenario.queries.length - 1));
  }

  function toggleSafePlan() {
    setPlaying(false);
    setVisibleCount(scenario.queries.length);
    setSelectedIndex(scenario.queries.length - 1);
    setMode((value) => (value === "observed" ? "safe" : "observed"));
  }

  function importTrace() {
    const lines = traceInput.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length < 2) {
      setTraceError("Add at least two external queries so there is a sequence to inspect.");
      return;
    }
    const custom = analyzeCustomTrace(traceInput);
    setScenarios((current) => [custom, ...current.filter((item) => !item.id.startsWith("custom-"))]);
    selectScenario(custom);
    setImportOpen(false);
    setTraceError("");
  }

  function exportAudit() {
    const payload = {
      product: "QueryShadow",
      generatedAt: new Date().toISOString(),
      auditId: scenario.auditId,
      trace: scenario.title,
      mode,
      observedRisk: scenario.risk,
      mitigatedRisk: scenario.safeRisk,
      estimatedUtility: scenario.utility,
      reconstruction: scenario.reconstruction,
      queries: scenario.queries.map((query) => ({
        original: query.text,
        saferRewrite: query.safeText,
        cumulativeRisk: query.cumulativeRisk,
        mitigatedRisk: query.safeRisk,
        signals: query.signals,
      })),
      limitation:
        "Heuristic local analysis. Scores indicate review priority, not proof that a third party made this inference.",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${scenario.auditId.toLowerCase()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function copyPolicy() {
    const policy = `Before any external query, remove direct identities, generalise exact values and dates, and score the cumulative trail—not only the next call. Privacy budget: ${scenario.safeRisk}/100. Audit: ${scenario.auditId}.`;
    await navigator.clipboard.writeText(policy);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className={`app-shell mode-${mode}`}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="QueryShadow home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>QUERY<b>SHADOW</b></span>
        </a>
        <div className="topbar-status">
          <span className="privacy-dot" />
          Local analysis · trace stays in this browser
        </div>
        <nav className="topbar-actions" aria-label="Product actions">
          <button type="button" className="text-button" onClick={() => setMethodOpen(true)}>Method</button>
          <button type="button" className="outline-button" onClick={() => setImportOpen(true)}>Import trace</button>
        </nav>
      </header>

      <div className="workspace" id="top">
        <aside className="scenario-rail">
          <div className="rail-heading">
            <span>TRACE LIBRARY</span>
            <b>{scenarios.length}</b>
          </div>
          <div className="scenario-list">
            {scenarios.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`scenario-button ${item.id === scenario.id ? "is-active" : ""}`}
                onClick={() => selectScenario(item)}
              >
                <span className="scenario-letter">{item.title.charAt(0)}</span>
                <span>
                  <small>{item.eyebrow}</small>
                  <strong>{item.title}</strong>
                </span>
                <em>{item.risk}</em>
              </button>
            ))}
          </div>
          <div className="rail-note">
            <span className="note-label">WHY THIS EXISTS</span>
            <p>A search provider sees the trail. It does not need your private files to infer what is inside them.</p>
            <button type="button" onClick={() => setMethodOpen(true)}>Read the threat model →</button>
          </div>
        </aside>

        <section className="main-stage">
          <div className="stage-header">
            <div>
              <div className="stage-kicker">
                <span>{scenario.eyebrow}</span>
                <i />
                <span>{scenario.agent}</span>
                <i />
                <span>{scenario.duration}</span>
              </div>
              <h1>{scenario.title}</h1>
              <p>{scenario.description}</p>
            </div>
            <div className="stage-actions">
              <button className="outline-button replay-button" type="button" onClick={replay}>
                <span aria-hidden="true">↻</span>{playing ? "Tracing…" : "Replay leak"}
              </button>
              <button className="primary-button" type="button" onClick={toggleSafePlan}>
                {mode === "observed" ? "Generate safer plan" : "Show observed trace"}
              </button>
            </div>
          </div>

          <section className="mode-banner" aria-live="polite">
            <div>
              <span className="mode-icon" aria-hidden="true">{mode === "observed" ? "!" : "✓"}</span>
              <span>
                <small>{mode === "observed" ? "OBSERVED PLAN" : "PRIVACY-AWARE PLAN"}</small>
                <strong>
                  {mode === "observed"
                    ? "Each call looks defensible. The sequence does not."
                    : `${riskDelta} risk points removed while preserving ${scenario.utility}% estimated research utility.`}
                </strong>
              </span>
            </div>
            <span className="audit-chip">Audit {scenario.auditId}</span>
          </section>

          <section className="summary-grid">
            <RiskMeter score={currentRisk} label={mode === "observed" ? "Cumulative exposure" : "Residual exposure"} />
            <div className="summary-card adversary-card">
              <span className="card-label">OBSERVER CAN RECONSTRUCT</span>
              <p>{mode === "observed" ? scenario.reconstructionShort : "Broad research intent · no bridge identity · no exact private metric"}</p>
              <div className="confidence-row">
                <span>Inference confidence</span>
                <div><i style={{ width: `${mode === "observed" ? scenario.confidence : 31}%` }} /></div>
                <b>{mode === "observed" ? scenario.confidence : 31}%</b>
              </div>
            </div>
            <div className="summary-card budget-card">
              <span className="card-label">PRIVACY BUDGET</span>
              <div className="budget-numbers"><strong>{mode === "observed" ? Math.max(0, 100 - currentRisk) : 100 - scenario.safeRisk}</strong><span>points left</span></div>
              <div className="budget-segments" aria-hidden="true">
                {Array.from({ length: 10 }, (_, index) => (
                  <i key={index} className={index < Math.ceil(currentRisk / 10) ? "spent" : ""} />
                ))}
              </div>
            </div>
          </section>

          <section className="analysis-grid">
            <div className="trace-panel">
              <div className="panel-heading">
                <div>
                  <span className="panel-number">01</span>
                  <span><small>OUTBOUND SURFACE</small><strong>Query trail</strong></span>
                </div>
                <span className="query-count">{visibleQueries.length}/{scenario.queries.length} calls visible</span>
              </div>
              <div className="query-list">
                {visibleQueries.map((query, index) => (
                  <QueryCard
                    key={query.id}
                    query={query}
                    index={index}
                    mode={mode}
                    selected={index === selectedIndex}
                    onSelect={() => setSelectedIndex(index)}
                  />
                ))}
                {Array.from({ length: scenario.queries.length - visibleQueries.length }, (_, index) => (
                  <div className="query-placeholder" key={`placeholder-${index}`}><i /><span>Waiting for agent call…</span></div>
                ))}
              </div>
              <div className="trace-legend">
                <span><i className="dot-contained" /> contained</span>
                <span><i className="dot-guarded" /> guarded</span>
                <span><i className="dot-high" /> high</span>
                <span><i className="dot-critical" /> critical</span>
                <em>Score is cumulative →</em>
              </div>
            </div>

            <div className="detail-stack">
              <article className="reconstruction-panel">
                <div className="panel-heading compact">
                  <div>
                    <span className="panel-number">02</span>
                    <span><small>MOSAIC EFFECT</small><strong>Adversary reconstruction</strong></span>
                  </div>
                  <span className={`severity-badge ${mode === "safe" ? "safe" : ""}`}>{mode === "safe" ? "CONTAINED" : "HIGH CONFIDENCE"}</span>
                </div>
                <blockquote>
                  “{mode === "observed" ? scenario.reconstruction : "The observer can identify a general research category, but exact identity, value and decision timing no longer join."}”
                </blockquote>
                <div className="inference-list">
                  {scenario.inference.map((item, index) => (
                    <div key={`${item.label}-${item.value}`} className={mode === "safe" && index > 0 ? "is-muted" : ""}>
                      <span>{item.label}</span>
                      <strong>{mode === "safe" && index > 0 ? "withheld by rewrite" : item.value}</strong>
                      <em>{mode === "safe" ? (index === 0 ? 54 : 12) : item.confidence}%</em>
                    </div>
                  ))}
                </div>
              </article>

              <article className="query-inspector">
                <div className="inspector-heading">
                  <span>SELECTED CALL · {selectedQuery?.id.toUpperCase()}</span>
                  <b>{mode === "safe" ? selectedQuery?.safeRisk : selectedQuery?.cumulativeRisk}/100 cumulative</b>
                </div>
                <p>{selectedQuery?.rationale}</p>
                <div className="signal-row">
                  {selectedQuery?.signals.length ? selectedQuery.signals.map((item) => (
                    <SignalPill key={`${item.kind}-${item.evidence}`} kind={item.kind} evidence={item.evidence} />
                  )) : <span className="no-signals">No direct sensitive marker found</span>}
                </div>
                {mode === "safe" && selectedQuery && (
                  <div className="rewrite-diff">
                    <span>REWRITE</span>
                    <p>{selectedQuery.safeText}</p>
                  </div>
                )}
              </article>
            </div>
          </section>

          <section className="receipt-panel">
            <div className="receipt-title">
              <span className="receipt-mark">QS</span>
              <span><small>MITIGATION RECEIPT</small><strong>{mode === "safe" ? "Ready to enforce" : "Plan not yet hardened"}</strong></span>
            </div>
            <div className="receipt-stat"><small>EXPOSURE</small><strong>{scenario.risk} → {scenario.safeRisk}</strong></div>
            <div className="receipt-stat"><small>UTILITY KEPT</small><strong>{scenario.utility}%</strong></div>
            <div className="receipt-stat"><small>RULES</small><strong>Identity · exact value · time</strong></div>
            <div className="receipt-actions">
              <button type="button" onClick={copyPolicy}>{copied ? "Copied" : "Copy policy"}</button>
              <button type="button" onClick={exportAudit}>Export audit ↓</button>
            </div>
          </section>
        </section>
      </div>

      <footer className="site-footer">
        <span>QUERYSHADOW · LOCAL-FIRST AGENT PRIVACY DEBUGGER</span>
        <span>Inspired by the mosaic-leak threat model · Synthetic demo data</span>
        <button type="button" onClick={() => setMethodOpen(true)}>Transparent limitations</button>
      </footer>

      {importOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setImportOpen(false)}>
          <section className="modal-card import-modal" role="dialog" aria-modal="true" aria-labelledby="import-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setImportOpen(false)} aria-label="Close">×</button>
            <span className="modal-kicker">LOCAL TRACE ANALYSIS</span>
            <h2 id="import-title">What do your agent’s searches reveal together?</h2>
            <p>Paste one outbound query per line. Analysis and safer rewrites run entirely in your browser.</p>
            <label htmlFor="trace-input">External query trail</label>
            <textarea id="trace-input" value={traceInput} onChange={(event) => setTraceInput(event.target.value)} spellCheck="false" />
            <div className="modal-meta"><span>{traceInput.split(/\r?\n/).filter((line) => line.trim()).length} queries</span><span>Nothing uploaded</span></div>
            {traceError && <p className="trace-error">{traceError}</p>}
            <button className="primary-button wide" type="button" onClick={importTrace}>Analyze mosaic exposure</button>
          </section>
        </div>
      )}

      {methodOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setMethodOpen(false)}>
          <section className="modal-card method-modal" role="dialog" aria-modal="true" aria-labelledby="method-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setMethodOpen(false)} aria-label="Close">×</button>
            <span className="modal-kicker">THREAT MODEL</span>
            <h2 id="method-title">The leak is in the sequence.</h2>
            <p>Deep-research agents combine private context with public tools. The external provider cannot see the private document—but it can see every query.</p>
            <ol className="method-steps">
              <li><b>1</b><span><strong>Extract</strong>Identify exact identities, values, dates, sensitive intents and bridge entities in each call.</span></li>
              <li><b>2</b><span><strong>Accumulate</strong>Score how fragments join across the entire trace, instead of approving every query in isolation.</span></li>
              <li><b>3</b><span><strong>Reconstruct</strong>Show the private claim a plausible observer could infer, with explicit confidence and evidence.</span></li>
              <li><b>4</b><span><strong>Rewrite</strong>Generalise only the bridge details, then estimate how much research utility survives.</span></li>
            </ol>
            <div className="limitation-box">
              <strong>Honest boundary</strong>
              <p>QueryShadow is a transparent heuristic debugger, not proof that a provider made an inference. Its score prioritises traces for human review. Production use would pair these rules with organisation-specific labels and adversarial evals.</p>
            </div>
            <button className="primary-button wide" type="button" onClick={() => setMethodOpen(false)}>Inspect the demo</button>
          </section>
        </div>
      )}
    </main>
  );
}
