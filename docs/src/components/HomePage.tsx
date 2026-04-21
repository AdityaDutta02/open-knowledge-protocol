import { useState } from 'react';
import { Link } from 'react-router-dom';

// ── Inline SVG icons ──────────────────────────────────────────────────────────

function IconLayers({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconArrowUpRight({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function IconCopy({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconCheck({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('npm i @okp/schema').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="grid-bg anim-grid-drift"
      style={{ minHeight: '100dvh', background: '#f6f6f6', position: 'relative', overflow: 'hidden' }}
    >
      {/* ── Nav ── */}
      <nav
        className="anim-nav"
        style={{ position: 'sticky', top: 0, zIndex: 50, background: '#ffffff', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }}
      >
        <div style={{ maxWidth: 1600, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 60 }}>
          <a
            href="/"
            className="nav-logo"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: '#1c1e21', textDecoration: 'none', transition: 'opacity 0.2s ease' }}
          >
            okp
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/why-okp" className="nav-link">
              Docs
              <span className="nav-link__underline" />
            </Link>
            <Link to="/paper" className="nav-link nav-link--paper">
              Paper
              <span className="nav-paper-badge">working paper</span>
              <span className="nav-link__underline" />
            </Link>
            <a
              href="https://github.com/AdityaDutta02/open-knowledge-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              GitHub
              <span className="nav-link__underline" />
            </a>
            <span
              className="anim-pill-glow"
              style={{ background: '#e46b39', color: '#ffffff', fontSize: 14, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 700, padding: '6px 16px', borderRadius: 9999, cursor: 'default' }}
            >
              v0.1.0
            </span>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        className="hero-section"
        style={{ maxWidth: 1600, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 120, paddingBottom: 60, paddingLeft: 24, paddingRight: 24, position: 'relative', overflow: 'hidden' }}
      >

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>

          {/* Line 1 — italic */}
          <div className="anim-hero-1" style={{ overflow: 'hidden' }}>
            <h1 className="hero-title" style={{ fontStyle: 'italic', textAlign: 'center', margin: 0 }}>
              The knowledge layer
            </h1>
          </div>

          {/* Line 2 — with emoji */}
          <div className="anim-hero-2 hero-line-2">
            <span className="hero-title">for the</span>
            <span className="hero-emoji anim-bob" aria-hidden="true">🧠</span>
            <span className="hero-title">agentic</span>
          </div>

          {/* Line 3 */}
          <div className="anim-hero-3">
            <span className="hero-title" style={{ textAlign: 'center', display: 'block' }}>web.</span>
          </div>

        </div>
      </section>

      {/* ── Cards ── */}
      <section style={{ maxWidth: 1600, margin: '0 auto', padding: '0 24px 80px' }}>
        <div className="cards-flex">

          {/* Card 1 — Open Standard (gray) */}
          <a
            href="/why-okp"
            className="card-base card-hover anim-card-1 card-link"
            style={{ background: '#e5e7eb', borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textDecoration: 'none', color: 'inherit' }}
          >
            <span
              className="badge-hover"
              style={{ gap: 8, border: '1px solid #1c1e21', borderRadius: 9999, padding: '8px 16px', width: 'fit-content', color: '#1c1e21', fontSize: 16, fontWeight: 500 }}
            >
              <IconLayers size={18} />
              Open Standard
            </span>
            <div>
              <h3 style={{ color: '#1c1e21', fontSize: 24, fontWeight: 700, lineHeight: 1.25, textTransform: 'uppercase', margin: '0 0 4px' }}>
                Why OKP?
              </h3>
              <p style={{ color: '#e46b39', fontSize: 24, fontWeight: 700, lineHeight: 1.25, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                Read the story
                <IconArrowUpRight size={20} />
              </p>
            </div>
          </a>

          {/* Card 2 — Stats (purple) */}
          <div
            className="card-base card-hover anim-card-2"
            style={{ background: '#5252b8', borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}
          >
            {/* Install bar */}
            <div
              className="install-shimmer"
              style={{ width: '100%', height: 52, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}
            >
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 500, color: '#1c1e21' }}>
                npm i @okp/schema
              </span>
              <button
                onClick={handleCopy}
                aria-label={copied ? 'Copied!' : 'Copy install command'}
                className="copy-btn"
              >
                {copied ? (
                  <span className="anim-pop" style={{ display: 'inline-block' }}><IconCheck size={18} /></span>
                ) : (
                  <IconCopy size={18} />
                )}
              </button>
            </div>

            {/* Editorial prose — replaces isolated stat grid */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ color: '#ffffff', fontSize: 28, fontWeight: 700, lineHeight: 1.3, margin: '0 0 12px' }}>
                Five packages. Three tiers. One open spec.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, fontWeight: 400, lineHeight: 1.6, margin: 0 }}>
                Built for the way AI agents actually read the web.
              </p>
            </div>

            {/* Decorative shapes */}
            <div
              className="anim-bob"
              aria-hidden="true"
              style={{ position: 'absolute', bottom: -24, left: -24, width: 96, height: 96, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', pointerEvents: 'none' }}
            />
            <div
              aria-hidden="true"
              style={{ position: 'absolute', top: 40, right: -16, width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', animation: 'bob 5s ease-in-out infinite 1s', pointerEvents: 'none' }}
            />
          </div>

          {/* Card 3 — Feature (orange) */}
          <div
            className="card-base card-base--narrow card-hover anim-card-3"
            style={{ background: '#e46b39', borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ color: '#ffffff', fontSize: 24, fontWeight: 700, margin: 0 }}>ConceptDNA</h3>
              <Link to="/spec/v0" className="read-spec-btn">Read spec</Link>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ color: '#ffffff', fontSize: 18, lineHeight: 1.6, marginBottom: 12, fontWeight: 500, opacity: 0.9 }}>
                A structured metadata layer — JSON-LD that AI agents can parse, traverse, and reason about.
              </p>
              <div style={{ color: '#ffffff', fontSize: 28, fontWeight: 700, lineHeight: 1.25 }}>
                No scraping.<br />No guessing.
              </div>
            </div>

            {/* Decorative glow */}
            <div
              aria-hidden="true"
              style={{ position: 'absolute', bottom: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', animation: 'bob 6s ease-in-out infinite 0.5s', pointerEvents: 'none' }}
            />
          </div>

        </div>
      </section>

      {/* ── Whitepaper CTA ── */}
      <section style={{
        borderTop: '1px solid var(--color-border, #e8e3de)',
        borderBottom: '1px solid var(--color-border, #e8e3de)',
        padding: '56px 0',
        margin: '0',
        background: 'var(--color-surface, #ffffff)',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 560 }}>
            <div style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-faint, #8a8580)',
              marginBottom: 12,
            }}>Working Paper — April 2026</div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--color-ink, #1c1e21)',
              lineHeight: 1.25,
              marginBottom: 12,
            }}>The Knowledge Gap</h2>
            <p style={{
              fontSize: '0.9375rem',
              lineHeight: 1.7,
              color: 'var(--color-ink-subtle, #5a5550)',
              marginBottom: 0,
            }}>
              Structural deficiencies in web content for autonomous AI agents — a formal characterization with empirical measurement and the OKP specification as remedy.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
            <Link
              to="/paper"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--color-ink, #1c1e21)',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'opacity 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Read the paper →
            </Link>
            <div style={{ display: 'flex', gap: 24, fontSize: '0.75rem', color: 'var(--color-ink-faint, #8a8580)' }}>
              <span>~25 min read</span>
              <span>9 sections</span>
              <span>16 references</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{ borderTop: '1px solid rgba(28,30,33,0.12)', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span style={{ fontSize: 14, color: '#6b6f75', fontWeight: 400 }}>
          OKP is open source. MIT license.
        </span>
        <a
          href="https://github.com/AdityaDutta02/open-knowledge-protocol"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 14, color: '#6b6f75', textDecoration: 'none', transition: 'color 0.15s ease' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#1c1e21'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#6b6f75'; }}
        >
          GitHub →
        </a>
      </footer>
    </div>
  );
}
