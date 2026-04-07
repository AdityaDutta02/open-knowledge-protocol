'use client';

import { useState } from 'react';
import { SERIF, SANS, MONO } from './tokens';

// Inline SVG icons (lucide-react not installed)
function IconLayers({ size = 18 }: { size?: number }): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconArrowUpRight({ size = 20 }: { size?: number }): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function IconCopy({ size = 18 }: { size?: number }): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconCheck({ size = 18 }: { size?: number }): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// Card 1 — Open Standard (gray)
function CardOpenStandard(): JSX.Element {
  return (
    <a
      href="/why-okp"
      className="card-hover anim-card-1"
      data-testid="card-open-standard"
      style={{
        width: '100%',
        maxWidth: 500,
        height: 350,
        background: '#e5e5eb',
        borderRadius: 24,
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <span
        className="badge-hover"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          border: '1px solid #1c1e21',
          borderRadius: 9999,
          padding: '8px 16px',
          width: 'fit-content',
          color: '#1c1e21',
          fontSize: 16,
          fontFamily: SANS,
          fontWeight: 500,
        }}
      >
        <IconLayers size={18} />
        Open Standard
      </span>

      <div>
        <h3
          style={{
            fontFamily: SANS,
            color: '#1c1e21',
            fontSize: 24,
            fontWeight: 700,
            lineHeight: 1.25,
            textTransform: 'uppercase',
            margin: '0 0 4px',
          }}
        >
          Why OKP?
        </h3>
        <p
          style={{
            fontFamily: SANS,
            color: '#e46b39',
            fontSize: 24,
            fontWeight: 700,
            lineHeight: 1.25,
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            margin: 0,
          }}
        >
          Read the story
          <IconArrowUpRight size={20} />
        </p>
      </div>
    </a>
  );
}

// Card 2 — Stats (purple)
function CardStats(): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = (): void => {
    navigator.clipboard.writeText('npm i @okp/schema').catch(() => {
      // Clipboard API not available — silently skip
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="card-hover anim-card-2"
      data-testid="card-stats"
      style={{
        width: '100%',
        maxWidth: 500,
        height: 350,
        background: '#a7a7f5',
        borderRadius: 24,
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Install command bar */}
      <div
        className="install-shimmer"
        style={{
          width: '100%',
          maxWidth: 436,
          height: 52,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          marginBottom: 32,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 16,
            fontWeight: 500,
            color: '#1c1e21',
          }}
        >
          npm i @okp/schema
        </span>
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Copied!' : 'Copy install command'}
          data-testid="copy-button"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#1c1e21',
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            transition: 'color 0.15s, transform 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#666';
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#1c1e21';
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          }}
        >
          {copied ? (
            <span className="anim-pop" style={{ display: 'inline-block' }}>
              <IconCheck size={18} />
            </span>
          ) : (
            <IconCopy size={18} />
          )}
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          width: '100%',
          gap: 8,
          paddingRight: 16,
        }}
      >
        <StatRow value="5" label="Packages" />
        <StatRow value="3" label="Tiers" />
        <StatRow value="v0" label="Spec" />
      </div>

      {/* Decorative floating shapes */}
      <div
        className="anim-bob"
        style={{
          position: 'absolute',
          bottom: -24,
          left: -24,
          width: 96,
          height: 96,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: -16,
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          animation: 'bob 5s ease-in-out infinite 1s',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
    </div>
  );
}

interface StatRowProps {
  value: string;
  label: string;
}

function StatRow({ value, label }: StatRowProps): JSX.Element {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span
        className="stat-number"
        style={{
          color: '#ffffff',
          fontSize: 56,
          fontFamily: SANS,
          fontWeight: 700,
          lineHeight: 1,
          cursor: 'default',
        }}
      >
        {value}
      </span>
      <span
        style={{
          color: '#1c1e21',
          fontSize: 28,
          fontFamily: SANS,
          fontWeight: 700,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// Card 3 — Feature highlight (orange)
function CardFeature(): JSX.Element {
  return (
    <div
      className="card-hover anim-card-3"
      data-testid="card-feature"
      style={{
        width: '100%',
        maxWidth: 450,
        height: 350,
        background: '#e46b39',
        borderRadius: 24,
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <h3
          style={{
            fontFamily: SANS,
            color: '#ffffff',
            fontSize: 24,
            fontWeight: 700,
            margin: 0,
          }}
        >
          ConceptDNA
        </h3>
        <a
          href="/why-okp"
          style={{
            background: '#1c1e21',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: 9999,
            fontSize: 14,
            fontFamily: SANS,
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'background 0.2s, color 0.2s, transform 0.2s',
            display: 'inline-block',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = '#ffffff';
            el.style.color = '#1c1e21';
            el.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = '#1c1e21';
            el.style.color = '#ffffff';
            el.style.transform = 'scale(1)';
          }}
        >
          Read spec
        </a>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <p
          style={{
            fontFamily: SANS,
            color: '#ffffff',
            fontSize: 18,
            lineHeight: 1.6,
            marginBottom: 12,
            opacity: 0.9,
          }}
        >
          A structured metadata layer — JSON-LD that AI agents can parse,
          traverse, and reason about.
        </p>
        <div
          style={{
            fontFamily: SANS,
            color: '#ffffff',
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1.25,
          }}
        >
          No scraping.
          <br />
          No guessing.
        </div>
      </div>

      {/* Decorative glow */}
      <div
        style={{
          position: 'absolute',
          bottom: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          animation: 'bob 6s ease-in-out infinite 0.5s',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Dots */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
        aria-hidden="true"
      >
        <div
          className="anim-dot-1"
          style={{ width: 8, height: 8, borderRadius: '50%', background: '#1c1e21' }}
        />
        <div
          className="anim-dot-2"
          style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }}
        />
        <div
          className="anim-dot-3"
          style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }}
        />
        <div
          className="anim-dot-4"
          style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }}
        />
      </div>
    </div>
  );
}

export default function Cards(): JSX.Element {
  return (
    <section
      style={{
        maxWidth: 1600,
        margin: '0 auto',
        padding: '0 24px 80px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
        className="cards-row"
        data-testid="cards-section"
      >
        <CardOpenStandard />
        <CardStats />
        <CardFeature />
      </div>
    </section>
  );
}
