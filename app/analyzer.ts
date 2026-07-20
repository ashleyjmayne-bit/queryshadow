export type SignalKind =
  | "identity"
  | "intent"
  | "money"
  | "metric"
  | "time"
  | "location"
  | "health"
  | "people";

export type TraceSignal = {
  kind: SignalKind;
  label: string;
  evidence: string;
  weight: number;
};

export type TraceQuery = {
  id: string;
  text: string;
  safeText: string;
  destination: string;
  elapsed: string;
  individualRisk: number;
  cumulativeRisk: number;
  safeRisk: number;
  signals: TraceSignal[];
  rationale: string;
};

export type TraceScenario = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  agent: string;
  duration: string;
  privateContext: string;
  reconstruction: string;
  reconstructionShort: string;
  risk: number;
  safeRisk: number;
  utility: number;
  confidence: number;
  auditId: string;
  queries: TraceQuery[];
  inference: Array<{ label: string; value: string; confidence: number }>;
};

const signal = (
  kind: SignalKind,
  label: string,
  evidence: string,
  weight: number,
): TraceSignal => ({ kind, label, evidence, weight });

export const DEMO_SCENARIOS: TraceScenario[] = [
  {
    id: "northstar",
    eyebrow: "M&A diligence",
    title: "Project Northstar",
    description: "A research agent cross-checks a confidential acquisition brief against the public web.",
    agent: "Market research agent",
    duration: "00:42",
    privateContext:
      "Atlas Energy is considering a A$68m acquisition of Kestrel Thermal. The board review is 9 October. Internal concerns are 14% churn and founder retention.",
    reconstruction:
      "Atlas Energy is likely preparing a roughly A$68m acquisition of Kestrel Thermal, with customer churn and founder-retention concerns, for an October board decision.",
    reconstructionShort: "Atlas Energy → Kestrel Thermal · ~A$68m · October decision",
    risk: 91,
    safeRisk: 19,
    utility: 93,
    confidence: 89,
    auditId: "QS-7A41-NORTHSTAR",
    inference: [
      { label: "Intent", value: "Acquisition diligence", confidence: 97 },
      { label: "Target", value: "Kestrel Thermal", confidence: 91 },
      { label: "Value", value: "Approximately A$68m", confidence: 86 },
      { label: "Decision window", value: "October board review", confidence: 82 },
    ],
    queries: [
      {
        id: "n1",
        text: "Australian grid software firms 41–60 employees recurring revenue 2025",
        safeText: "renewable operations software recurring revenue benchmarks 2025",
        destination: "search.api",
        elapsed: "00:03",
        individualRisk: 11,
        cumulativeRisk: 11,
        safeRisk: 5,
        signals: [
          signal("location", "Market", "Australian", 2),
          signal("metric", "Company cohort", "41–60 employees", 3),
          signal("intent", "Sector", "grid software", 2),
        ],
        rationale: "The cohort is narrow enough to reduce the target set, but does not expose the deal alone.",
      },
      {
        id: "n2",
        text: "founder retention clauses 18 month acquisition clean-energy SaaS",
        safeText: "standard founder retention clauses for mid-market software acquisitions",
        destination: "legal-index.io",
        elapsed: "00:08",
        individualRisk: 13,
        cumulativeRisk: 24,
        safeRisk: 8,
        signals: [
          signal("intent", "Transaction", "acquisition", 4),
          signal("people", "Retention concern", "founder retention", 3),
          signal("metric", "Term", "18 month", 2),
        ],
        rationale: "This exposes transaction intent and a negotiation issue. Combined with the cohort, it becomes identifying.",
      },
      {
        id: "n3",
        text: "ACCC notification threshold private acquisition 68 million AUD",
        safeText: "ACCC notification thresholds for mid-market private acquisitions",
        destination: "search.api",
        elapsed: "00:14",
        individualRisk: 18,
        cumulativeRisk: 47,
        safeRisk: 10,
        signals: [
          signal("money", "Deal value", "68 million AUD", 5),
          signal("intent", "Transaction", "private acquisition", 4),
          signal("location", "Regulator", "ACCC", 2),
        ],
        rationale: "An exact value is a strong bridge entity. It links the legal research to a specific confidential deal.",
      },
      {
        id: "n4",
        text: "14% customer churn clean energy platform acquisition benchmark",
        safeText: "customer churn benchmarks for acquired clean-energy software businesses",
        destination: "benchmarks.dev",
        elapsed: "00:21",
        individualRisk: 16,
        cumulativeRisk: 63,
        safeRisk: 13,
        signals: [
          signal("metric", "Internal concern", "14% customer churn", 5),
          signal("intent", "Transaction", "acquisition", 3),
        ],
        rationale: "The exact internal metric confirms the diligence focus when joined with the deal value.",
      },
      {
        id: "n5",
        text: "Sydney board acquisition approval agenda 9 October 2026",
        safeText: "Australian board approval process and agenda for private acquisitions",
        destination: "governance.au",
        elapsed: "00:31",
        individualRisk: 17,
        cumulativeRisk: 78,
        safeRisk: 16,
        signals: [
          signal("time", "Decision date", "9 October 2026", 5),
          signal("location", "Board location", "Sydney", 2),
          signal("intent", "Decision", "acquisition approval", 3),
        ],
        rationale: "A precise date turns a broad transaction hypothesis into a time-bounded corporate event.",
      },
      {
        id: "n6",
        text: "Kestrel Thermal customer concentration founder profile",
        safeText: "customer concentration and founder-dependency benchmarks in climate software",
        destination: "company-graph.com",
        elapsed: "00:42",
        individualRisk: 22,
        cumulativeRisk: 91,
        safeRisk: 19,
        signals: [
          signal("identity", "Target", "Kestrel Thermal", 7),
          signal("people", "Key-person risk", "founder profile", 2),
        ],
        rationale: "The final query supplies the missing identity. Earlier fragments now reconstruct the private brief.",
      },
    ],
  },
  {
    id: "harbour",
    eyebrow: "Clinical research",
    title: "Project Harbour",
    description: "A literature agent validates a restricted trial-planning memo using external sources.",
    agent: "Clinical evidence agent",
    duration: "01:06",
    privateContext:
      "A Westmead pilot for a rare paediatric condition plans 24 participants. The internal stop rule is more than two severe adverse events, with recruitment opening 3 November.",
    reconstruction:
      "A 24-participant paediatric rare-disease pilot appears planned at Westmead for early November, with a confidential safety stop after more than two severe adverse events.",
    reconstructionShort: "Westmead rare-disease pilot · n=24 · internal safety threshold",
    risk: 86,
    safeRisk: 22,
    utility: 91,
    confidence: 84,
    auditId: "QS-91B8-HARBOUR",
    inference: [
      { label: "Intent", value: "Pre-trial planning", confidence: 95 },
      { label: "Site", value: "Westmead", confidence: 90 },
      { label: "Cohort", value: "24 paediatric participants", confidence: 87 },
      { label: "Stop rule", value: ">2 severe adverse events", confidence: 79 },
    ],
    queries: [
      {
        id: "h1",
        text: "rare paediatric neuromuscular condition Australia incidence",
        safeText: "paediatric rare-disease incidence Australia",
        destination: "pubmed.index",
        elapsed: "00:06",
        individualRisk: 10,
        cumulativeRisk: 10,
        safeRisk: 5,
        signals: [signal("health", "Condition class", "rare paediatric neuromuscular", 4)],
        rationale: "The disease class is broad, but establishes a sensitive research domain.",
      },
      {
        id: "h2",
        text: "single-site pilot sample size 24 rare disease power",
        safeText: "small single-site rare-disease pilot sample-size methods",
        destination: "scholar.search",
        elapsed: "00:17",
        individualRisk: 12,
        cumulativeRisk: 25,
        safeRisk: 8,
        signals: [signal("metric", "Cohort size", "sample size 24", 4)],
        rationale: "An exact cohort size narrows the possible protocol when paired with the disease class.",
      },
      {
        id: "h3",
        text: "Westmead paediatric clinical trial governance November 2026",
        safeText: "NSW paediatric clinical-trial governance timelines",
        destination: "health.nsw",
        elapsed: "00:29",
        individualRisk: 17,
        cumulativeRisk: 48,
        safeRisk: 12,
        signals: [
          signal("identity", "Site", "Westmead", 5),
          signal("time", "Window", "November 2026", 3),
        ],
        rationale: "Site plus month creates a strong linkage key for observers of the query trail.",
      },
      {
        id: "h4",
        text: "trial stopping rule more than 2 severe adverse events",
        safeText: "conservative severe-adverse-event stopping rules for small pilots",
        destination: "trials.registry",
        elapsed: "00:41",
        individualRisk: 19,
        cumulativeRisk: 68,
        safeRisk: 16,
        signals: [
          signal("health", "Safety event", "severe adverse events", 4),
          signal("metric", "Internal threshold", "more than 2", 5),
        ],
        rationale: "The unpublished safety threshold is itself confidential protocol information.",
      },
      {
        id: "h5",
        text: "Westmead recruitment opening 3 November paediatric trial",
        safeText: "best practices for opening paediatric trial recruitment",
        destination: "search.api",
        elapsed: "01:06",
        individualRisk: 21,
        cumulativeRisk: 86,
        safeRisk: 22,
        signals: [
          signal("identity", "Site", "Westmead", 5),
          signal("time", "Opening date", "3 November", 5),
        ],
        rationale: "The repeated site and exact opening date complete a plausible protocol reconstruction.",
      },
    ],
  },
  {
    id: "signal",
    eyebrow: "Product launch",
    title: "Project Signal",
    description: "A pricing agent prepares a launch memo from unreleased commercial plans.",
    agent: "Go-to-market agent",
    duration: "00:37",
    privateContext:
      "Peregrine Health will launch an Australia-only enterprise tier at A$399 per user on 17 September, starting with a Melbourne design partner.",
    reconstruction:
      "Peregrine Health is preparing an Australia-only enterprise launch around 17 September at A$399 per user, probably with a Melbourne design partner.",
    reconstructionShort: "Peregrine Health · AU enterprise tier · A$399 · 17 September",
    risk: 83,
    safeRisk: 17,
    utility: 95,
    confidence: 81,
    auditId: "QS-C227-SIGNAL",
    inference: [
      { label: "Intent", value: "Enterprise launch", confidence: 94 },
      { label: "Company", value: "Peregrine Health", confidence: 88 },
      { label: "Price", value: "A$399 per user", confidence: 85 },
      { label: "Market/date", value: "Australia · 17 September", confidence: 80 },
    ],
    queries: [
      {
        id: "s1",
        text: "Australian health SaaS enterprise per-user pricing",
        safeText: "enterprise software per-user pricing benchmarks APAC",
        destination: "pricing-index.io",
        elapsed: "00:04",
        individualRisk: 8,
        cumulativeRisk: 8,
        safeRisk: 4,
        signals: [
          signal("location", "Market", "Australian", 2),
          signal("intent", "Segment", "health SaaS enterprise", 3),
        ],
        rationale: "This establishes market and segment but remains non-identifying alone.",
      },
      {
        id: "s2",
        text: "GST treatment software subscription 399 AUD per user",
        safeText: "GST treatment for mid-hundreds software subscriptions",
        destination: "tax.search",
        elapsed: "00:11",
        individualRisk: 16,
        cumulativeRisk: 27,
        safeRisk: 7,
        signals: [signal("money", "Launch price", "399 AUD per user", 5)],
        rationale: "The exact unreleased price links tax research to a launch plan.",
      },
      {
        id: "s3",
        text: "Melbourne health network design partnership announcement examples",
        safeText: "health-network design partnership announcement examples Australia",
        destination: "search.api",
        elapsed: "00:19",
        individualRisk: 12,
        cumulativeRisk: 41,
        safeRisk: 10,
        signals: [
          signal("location", "Partner location", "Melbourne", 3),
          signal("intent", "Partner type", "design partnership", 3),
        ],
        rationale: "Geography and partnership type shrink the set of plausible counterparties.",
      },
      {
        id: "s4",
        text: "enterprise software launch 17 September Australia press timing",
        safeText: "enterprise software launch press-timing best practices",
        destination: "media-index.com",
        elapsed: "00:28",
        individualRisk: 17,
        cumulativeRisk: 62,
        safeRisk: 13,
        signals: [
          signal("time", "Launch date", "17 September", 5),
          signal("location", "Market", "Australia", 2),
        ],
        rationale: "The exact date allows correlation with calendars, events and vendor activity.",
      },
      {
        id: "s5",
        text: "Peregrine Health enterprise tier competitor comparison",
        safeText: "health software enterprise-tier competitor comparison Australia",
        destination: "company-graph.com",
        elapsed: "00:37",
        individualRisk: 22,
        cumulativeRisk: 83,
        safeRisk: 17,
        signals: [
          signal("identity", "Company", "Peregrine Health", 7),
          signal("intent", "Product", "enterprise tier", 3),
        ],
        rationale: "The company name completes the mosaic built from price, market, partner and date.",
      },
    ],
  },
];

const PATTERNS: Array<{
  kind: SignalKind;
  label: string;
  weight: number;
  re: RegExp;
}> = [
  { kind: "money", label: "Exact amount", weight: 5, re: /(?:(?:A?\$|USD|AUD|EUR|GBP)\s?\d[\d,.]*(?:\s?(?:m|million|bn|billion))?|\d[\d,.]*(?:\s?(?:m|million|bn|billion))?\s?(?:USD|AUD|EUR|GBP))/gi },
  { kind: "metric", label: "Exact metric", weight: 4, re: /\b\d+(?:\.\d+)?%(?!\w)/gi },
  { kind: "metric", label: "Exact threshold", weight: 4, re: /\b(?:sample size|cohort(?: of)?|threshold(?: of)?|more than|fewer than|at least|at most|n\s*=)\s*\d+(?:\.\d+)?\b/gi },
  { kind: "time", label: "Exact date", weight: 4, re: /\b(?:\d{1,2}\s+)?(?:january|february|march|april|may|june|july|august|september|october|november|december)(?:\s+\d{4})?\b/gi },
  { kind: "intent", label: "Sensitive intent", weight: 4, re: /\b(?:acquisition|merger|layoff|launch|trial|investigation|lawsuit|breach|restructur(?:e|ing)|patent)\b/gi },
  { kind: "health", label: "Health context", weight: 4, re: /\b(?:patient|clinical|diagnos(?:is|ed)|disease|adverse event|treatment|cohort|trial)\b/gi },
  { kind: "people", label: "People context", weight: 3, re: /\b(?:founder|employee|candidate|patient|executive|board)\b/gi },
  { kind: "location", label: "Specific market", weight: 2, re: /\b(?:Sydney|Melbourne|Brisbane|Perth|Australia|Australian|Westmead|London|New York|Singapore)\b/gi },
  { kind: "identity", label: "Named entity", weight: 6, re: /\b[A-Z][a-z]+(?:\s+(?:Energy|Health|Thermal|Labs|Systems|Software|Holdings|Group|Inc|Corp|Limited|Ltd))\b/g },
];

function uniqueSignals(signals: TraceSignal[]) {
  const seen = new Set<string>();
  return signals.filter((item) => {
    const key = `${item.kind}:${item.evidence.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function extractSignals(text: string): TraceSignal[] {
  const found: TraceSignal[] = [];
  for (const pattern of PATTERNS) {
    pattern.re.lastIndex = 0;
    for (const match of text.matchAll(pattern.re)) {
      found.push(signal(pattern.kind, pattern.label, match[0], pattern.weight));
    }
  }
  return uniqueSignals(found);
}

export function sanitizeQuery(text: string) {
  let result = text
    .replace(/(?:(?:A?\$|USD|AUD|EUR|GBP)\s?\d[\d,.]*(?:\s?(?:m|million|bn|billion))?|\d[\d,.]*(?:\s?(?:m|million|bn|billion))?\s?(?:USD|AUD|EUR|GBP))/gi, "a comparable value range")
    .replace(/\b\d+(?:\.\d+)?%(?!\w)/g, "a benchmark range")
    .replace(/\b(?:sample size|cohort(?: of)?|threshold(?: of)?|more than|fewer than|at least|at most|n\s*=)\s*\d+(?:\.\d+)?\b/gi, "a representative cohort or threshold")
    .replace(/\b(?:\d{1,2}\s+)?(?:january|february|march|april|may|june|july|august|september|october|november|december)(?:\s+\d{4})?\b/gi, "the target period")
    .replace(/\b(?:Sydney|Melbourne|Brisbane|Perth|Westmead|London|New York|Singapore)\b/gi, "the target region")
    .replace(/\b[A-Z][a-z]+(?:\s+(?:Energy|Health|Thermal|Labs|Systems|Software|Holdings|Group|Inc|Corp|Limited|Ltd))\b/g, "the organisation")
    .replace(/\s+/g, " ")
    .trim();
  if (result === text) {
    result = text.replace(/\b\d+(?:\.\d+)?\b/g, "a representative range");
  }
  return result;
}

function clamp(value: number, min = 0, max = 99) {
  return Math.min(max, Math.max(min, value));
}

function shortHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

export function analyzeCustomTrace(raw: string): TraceScenario {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*]|\d+[.)])\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 12);
  const allSignals: TraceSignal[] = [];
  const seenKinds = new Set<SignalKind>();
  let cumulative = 5;

  const queries: TraceQuery[] = lines.map((text, index) => {
    const signals = extractSignals(text);
    allSignals.push(...signals);
    signals.forEach((item) => seenKinds.add(item.kind));
    const individualRisk = clamp(4 + signals.reduce((sum, item) => sum + item.weight, 0), 4, 38);
    const mosaicBonus = Math.max(0, seenKinds.size - 1) * 4 + Math.max(0, index - 1) * 3;
    const sensitiveCombinationBonus =
      seenKinds.has("health") &&
      seenKinds.has("metric") &&
      (seenKinds.has("location") || seenKinds.has("time"))
        ? 10
        : seenKinds.has("identity") && seenKinds.has("intent")
          ? 8
          : seenKinds.has("money") && seenKinds.has("intent")
            ? 6
            : 0;
    cumulative = clamp(
      Math.max(cumulative, individualRisk + mosaicBonus + sensitiveCombinationBonus + index * 2),
    );
    const safeText = sanitizeQuery(text);
    const safeSignals = extractSignals(safeText);
    const safeRisk = clamp(3 + safeSignals.reduce((sum, item) => sum + Math.max(1, item.weight - 2), 0) + index, 3, 39);
    return {
      id: `custom-${index + 1}`,
      text,
      safeText,
      destination: index % 3 === 0 ? "search.api" : index % 3 === 1 ? "external-index" : "public-web",
      elapsed: `00:${String((index + 1) * 7).padStart(2, "0")}`,
      individualRisk,
      cumulativeRisk: cumulative,
      safeRisk,
      signals,
      rationale: signals.length
        ? `${signals.map((item) => item.label.toLowerCase()).join(", ")} become more revealing when correlated with earlier calls.`
        : "Low direct sensitivity, but sequence and repetition can still expose the agent’s intent.",
    };
  });

  const kinds = [...new Set(allSignals.map((item) => item.kind))];
  const evidence = uniqueSignals(allSignals)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 4);
  const risk = queries.at(-1)?.cumulativeRisk ?? 0;
  const safeRisk = queries.at(-1)?.safeRisk ?? 0;
  const reconstruction = evidence.length
    ? `An observer could correlate ${evidence.map((item) => item.evidence).join(", ")} to infer the agent’s private research intent.`
    : "The trace contains too few explicit markers for a confident reconstruction, but still reveals a sequence of research intent.";

  return {
    id: `custom-${shortHash(lines.join("|"))}`,
    eyebrow: "Imported trace",
    title: "Local trace analysis",
    description: "A browser-local audit of the external queries you supplied.",
    agent: "Imported agent",
    duration: queries.at(-1)?.elapsed ?? "00:00",
    privateContext: "Not supplied. QueryShadow estimates what an external observer could infer from the query trail alone.",
    reconstruction,
    reconstructionShort: evidence.map((item) => item.evidence).join(" · ") || "Low-confidence intent pattern",
    risk,
    safeRisk,
    utility: clamp(98 - Math.max(0, risk - safeRisk) * 0.08, 82, 98),
    confidence: clamp(32 + kinds.length * 8 + evidence.length * 4, 28, 91),
    auditId: `QS-${shortHash(lines.join("\n"))}-LOCAL`,
    queries,
    inference: evidence.map((item) => ({
      label: item.label,
      value: item.evidence,
      confidence: clamp(48 + item.weight * 7 + lines.length * 2, 45, 94),
    })),
  };
}

export function getRiskBand(score: number) {
  if (score >= 80) return "critical";
  if (score >= 55) return "high";
  if (score >= 30) return "guarded";
  return "contained";
}
