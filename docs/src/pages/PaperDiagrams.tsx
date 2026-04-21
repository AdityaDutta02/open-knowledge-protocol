import { useEffect, useRef, useState } from 'react';

// ── StatGrid ─────────────────────────────────────────────────────────────────

interface StatDatum {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
  source: string;
}

const STATS: StatDatum[] = [
  {
    value: 37,
    suffix: '%',
    label: 'Incorrect answer rate',
    source: 'Perplexity AI (Tow Center, 2025)',
  },
  {
    value: 45,
    prefix: 'up to ',
    suffix: '%',
    label: 'RAG accuracy drop on multi-hop queries',
    source: 'UT Austin, 2024',
  },
  {
    value: 3.4,
    suffix: 'x',
    label: 'GraphRAG outperforms vector RAG',
    source: 'Diffbot KG-LM Benchmark',
  },
  {
    value: 0.18,
    suffix: '%',
    label: 'Web pages with schema.org/Article JSON-LD',
    source: 'HTTP Archive Web Almanac 2024',
  },
];

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function formatValue(value: number): string {
  if (value < 1 && value > 0) return value.toFixed(2);
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1);
}

function AnimatedNumber({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    function step(timestamp: number) {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setCurrent(eased * target);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setCurrent(target);
      }
    }
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return <>{formatValue(current)}</>;
}

export function StatGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTriggered(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stat-grid" ref={ref} data-testid="stat-grid">
      {STATS.map((stat) => (
        <div className="stat-card" key={stat.label}>
          <div className="stat-value">
            {stat.prefix && <span className="stat-prefix">{stat.prefix}</span>}
            {triggered ? <AnimatedNumber target={stat.value} /> : formatValue(0)}
            {stat.suffix}
          </div>
          <div className="stat-label">{stat.label}</div>
          <div className="stat-source">{stat.source}</div>
        </div>
      ))}
    </div>
  );
}

// ── DeficiencyMatrix ──────────────────────────────────────────────────────────

interface DeficiencyDatum {
  number: string;
  name: string;
  short: string;
  expanded: string;
  effect: string;
  prevalence: string;
  color: string;
}

const DEFICIENCIES: DeficiencyDatum[] = [
  {
    number: '01',
    name: 'Absent Semantic Identity',
    short: 'No stable conceptId across publishers',
    expanded:
      'Without a stable conceptId, AI agents cannot deduplicate, version, or attribute claims across publishers. Two articles about "transformer architecture" on different sites are invisible to each other. Result: citation fabrication and identity merging.',
    effect: 'Citation hallucination',
    prevalence: '~0% of web pages',
    color: '#e46b39',
  },
  {
    number: '02',
    name: 'Absent Relational Context',
    short: 'Links are not typed edges',
    expanded:
      'HTML hyperlinks convey existence of a relationship but not its type. Is this link a prerequisite, an alternative, a contradiction? Without typed edges (prerequisite, enables, contradicts), multi-hop traversal is impossible. Result: 30–45% accuracy drop on multi-hop queries.',
    effect: 'Multi-hop failure',
    prevalence: '~0% typed edges on the web',
    color: '#7c6ff7',
  },
  {
    number: '03',
    name: 'Absent Temporal Validity',
    short: 'No machine-readable expiry or review dates',
    expanded:
      'datePublished exists on ~41% of pages. reviewBy and expiresAt exist on ~15%. Without temporal validity signals, agents blend 2020 claims with 2025 facts and produce confident hallucinations. The Perplexity 37% error rate has a significant temporal component.',
    effect: 'Temporal hallucination',
    prevalence: '~15% partial (reviewBy/expires)',
    color: '#2a9d8f',
  },
  {
    number: '04',
    name: 'Absent Confidence Metadata',
    short: 'No epistemic status declaration',
    expanded:
      'A speculative prediction and a peer-reviewed finding look identical in HTML. Without confidence fields (current / outdated / disputed / speculative), agents cannot calibrate how much weight to give a source. The ReDeEP benchmark showed hallucination even when retrieved context was accurate.',
    effect: 'Confidence calibration failure',
    prevalence: '~0% of web pages',
    color: '#e9c46a',
  },
  {
    number: '05',
    name: 'Absent Graph Connectivity',
    short: 'No cross-publisher knowledge graph',
    expanded:
      "No existing standard defines typed, machine-traversable edges between articles across publishers. Each publisher's content is an island. GraphRAG outperforms vector RAG 3.4x on multi-hop tasks — but requires a structured graph as input. OKP provides that graph.",
    effect: 'Graph traversal impossible',
    prevalence: '~0% cross-publisher edges',
    color: '#e76f51',
  },
];

export function DeficiencyMatrix() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  function handleCardClick(index: number) {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }

  return (
    <div className="deficiency-grid" data-testid="deficiency-matrix">
      {DEFICIENCIES.map((deficiency, index) => {
        const isExpanded = expandedIndex === index;
        return (
          <div key={deficiency.number} className="deficiency-card-wrapper">
            <button
              className={`deficiency-card ${isExpanded ? 'deficiency-card--expanded' : ''}`}
              onClick={() => handleCardClick(index)}
              aria-expanded={isExpanded}
              aria-controls={`deficiency-detail-${deficiency.number}`}
              style={{ '--deficiency-color': deficiency.color } as React.CSSProperties}
            >
              <div className="deficiency-number" style={{ color: deficiency.color }}>
                {deficiency.number}
              </div>
              <div className="deficiency-name">{deficiency.name}</div>
              <div className="deficiency-short">{deficiency.short}</div>
              <div
                className="deficiency-effect-badge"
                style={{ background: `${deficiency.color}18`, color: deficiency.color }}
              >
                {deficiency.effect}
              </div>
            </button>
            <div
              id={`deficiency-detail-${deficiency.number}`}
              className={`deficiency-detail ${isExpanded ? 'deficiency-detail--open' : ''}`}
            >
              <div className="deficiency-detail-inner">
                <p className="deficiency-detail-text">{deficiency.expanded}</p>
                <div className="deficiency-prevalence">
                  <span className="deficiency-prevalence-label">Prevalence</span>
                  <span className="deficiency-prevalence-value">{deficiency.prevalence}</span>
                </div>
                <button
                  className="deficiency-close"
                  onClick={() => setExpandedIndex(null)}
                  aria-label="Close detail"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── StandardsTimeline ─────────────────────────────────────────────────────────

interface StandardDatum {
  year: string;
  name: string;
  tagline: string;
  gap: string | null;
  color: string;
  current?: boolean;
}

const STANDARDS: StandardDatum[] = [
  { year: '2000', name: 'RSS', tagline: 'Solved syndication', gap: 'No semantics', color: '#8a8580' },
  {
    year: '2011',
    name: 'JSON-LD',
    tagline: 'Solved search indexing',
    gap: 'No graph structure',
    color: '#8a8580',
  },
  {
    year: '2024',
    name: 'llms.txt',
    tagline: 'Solved AI orientation',
    gap: 'No knowledge structure',
    color: '#8a8580',
  },
  {
    year: '2024',
    name: 'MCP',
    tagline: 'Solved tool invocation',
    gap: 'No payload semantics',
    color: '#8a8580',
  },
  {
    year: '2026',
    name: 'OKP',
    tagline: 'Solves knowledge structure',
    gap: null,
    color: '#e46b39',
    current: true,
  },
];

export function StandardsTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`timeline-wrap ${visible ? 'timeline-wrap--visible' : ''}`} ref={ref} data-testid="standards-timeline">
      <div className="timeline-track">
        {STANDARDS.map((standard, index) => (
          <div
            key={standard.name}
            className={`timeline-node ${standard.current ? 'timeline-node--current' : ''}`}
            style={{ '--node-delay': `${index * 0.12}s` } as React.CSSProperties}
          >
            <div className="timeline-year">{standard.year}</div>
            <div className="timeline-dot" style={{ background: standard.color, borderColor: standard.color }} />
            <div className="timeline-label">
              <div className="timeline-name" style={{ color: standard.color }}>
                {standard.name}
              </div>
              <div className="timeline-tagline">{standard.tagline}</div>
              {standard.gap && (
                <div className="timeline-gap-chip">{standard.gap}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
