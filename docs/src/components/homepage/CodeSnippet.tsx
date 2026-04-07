import { motion } from 'framer-motion';
import { BG_DARKER, TEXT_MUTED, BORDER, SHADOW, SANS, MONO } from './tokens';

type CodeLine = { text: string; color: string };

const C_TAG = '#f9a8d4';
const C_PROP = '#c4b5fd';
const C_CTX = '#86efac';

function makeLine(text: string, color: string): CodeLine {
  return { text, color };
}

function getConceptDnaLines(): CodeLine[] {
  return [
    makeLine('<script type="application/ld+json">', C_TAG),
    makeLine('{', C_PROP),
    makeLine('  "@context": "https://okp.theadityadutta.com/schema/v0#",', C_CTX),
    makeLine('  "@type": "ConceptDNA",', C_CTX),
    makeLine('  "conceptId": "transformer-attention",', C_PROP),
    makeLine('  "title": "How Transformer Attention Works",', C_PROP),
    makeLine('  "summary": "Self-attention allows each token to attend to all others\u2026",', C_PROP),
    makeLine('  "keyTerms": ["attention", "softmax", "query", "key", "value"],', C_PROP),
    makeLine('  "enables": ["fine-tuning", "rag-retrieval"],', C_PROP),
    makeLine('  "confidence": "current",', C_PROP),
    makeLine('  "temporalValidity": { "publishedAt": "2024-01-15" }', C_PROP),
    makeLine('}', C_PROP),
    makeLine('</script>', C_TAG),
  ];
}

const CONCEPT_DNA_LINES = getConceptDnaLines();

const TRAFFIC_RED = '#ff5f57';
const TRAFFIC_YELLOW = '#febc2e';
const TRAFFIC_GREEN = '#28c840';

function TrafficLights() {
  const dots = [TRAFFIC_RED, TRAFFIC_YELLOW, TRAFFIC_GREEN];
  return (
    <>
      {dots.map((c) => (
        <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
      ))}
    </>
  );
}

function WindowChrome() {
  return (
    <div
      style={{
        borderBottom: `1px solid ${BORDER}`,
        padding: '10px 16px',
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <TrafficLights />
      <span
        style={{
          fontFamily: MONO,
          fontSize: 12,
          color: TEXT_MUTED,
          marginLeft: 8,
          opacity: 0.7,
        }}
      >
        _layout.astro
      </span>
    </div>
  );
}

function CodeBlock() {
  return (
    <pre
      style={{
        fontFamily: MONO,
        fontSize: 13,
        lineHeight: 1.75,
        padding: '20px 24px',
        margin: 0,
        overflowX: 'auto',
      }}
    >
      {CONCEPT_DNA_LINES.map((line, i) => (
        <span key={i} style={{ display: 'block', color: line.color }}>
          {line.text}
        </span>
      ))}
    </pre>
  );
}

export default function CodeSnippet() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ maxWidth: 680, margin: '0 auto 96px', padding: '0 24px' }}
    >
      <p
        style={{
          fontFamily: SANS,
          fontSize: 12,
          fontWeight: 500,
          color: TEXT_MUTED,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 16,
          textAlign: 'center',
        }}
      >
        Drop this in any page
      </p>

      <div
        style={{
          background: BG_DARKER,
          border: `1px solid ${BORDER}`,
          borderRadius: 10,
          overflow: 'hidden',
          boxShadow: SHADOW,
        }}
      >
        <WindowChrome />
        <CodeBlock />
      </div>
    </motion.section>
  );
}
