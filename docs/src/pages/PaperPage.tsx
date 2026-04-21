import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  SectionStats,
  SectionAbstract,
  SectionIntroduction,
  SectionBackground,
  SectionKnowledgeGap,
  SectionDeficiencies,
  SectionOKP,
  SectionImplementation,
  SectionRelatedWork,
  SectionDiscussion,
  SectionConclusion,
  SectionReferences,
} from './PaperContent';
import '../styles/paper.css';

// ── TOC config ────────────────────────────────────────────────────────────────

interface TocEntry {
  id: string;
  label: string;
}

const TOC_ITEMS: TocEntry[] = [
  { id: 'abstract', label: 'Abstract' },
  { id: 'introduction', label: '1. Introduction' },
  { id: 'background', label: '2. Background' },
  { id: 'knowledge-gap', label: '3. The Knowledge Gap' },
  { id: 'deficiencies', label: '4. Five Deficiencies' },
  { id: 'okp', label: '5. Open Knowledge Protocol' },
  { id: 'schema', label: '5.2 ConceptDNA Schema' },
  { id: 'implementation', label: '6. Implementation' },
  { id: 'related', label: '7. Related Work' },
  { id: 'discussion', label: '8. Discussion' },
  { id: 'conclusion', label: '9. Conclusion' },
  { id: 'references', label: 'References' },
];

// ── ReadingProgress ───────────────────────────────────────────────────────────

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(scrollTop / docHeight, 1));
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="paper-progress-bar" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
      <div className="paper-progress-fill" style={{ width: `${progress * 100}%` }} />
    </div>
  );
}

// ── PaperToc ──────────────────────────────────────────────────────────────────

function PaperToc({ activeId }: { activeId: string }) {
  return (
    <aside className="paper-toc" aria-label="Table of contents" data-testid="paper-toc">
      <p className="paper-toc-label">On this page</p>
      <ul className="paper-toc-list">
        {TOC_ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`paper-toc-item ${activeId === item.id ? 'paper-toc-item--active' : ''} ${item.id === 'schema' ? 'paper-toc-item--nested' : ''}`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// ── PaperPage ─────────────────────────────────────────────────────────────────

export default function PaperPage() {
  const [activeId, setActiveId] = useState('abstract');
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.title = 'The Knowledge Gap — OKP Working Paper';
    window.scrollTo(0, 0);
  }, []);

  // Scroll-spy: observe all section headings
  useEffect(() => {
    const sectionIds = TOC_ITEMS.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-10% 0px -75% 0px', threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="paper-root" data-testid="paper-page">
      <ReadingProgress />

      {/* Skip link for accessibility */}
      <a href="#paper-main-content" className="skip-link">Skip to content</a>

      {/* Header */}
      <header className="paper-header">
        <Link to="/" className="paper-back" aria-label="Back to OKP home">
          &larr; okp
        </Link>
        <span className="paper-header-label">Working Paper</span>
      </header>

      <div className="paper-body">
        <main className="paper-main" id="paper-main-content" ref={mainRef}>

          {/* Hero */}
          <div className="paper-hero">
            <div className="paper-meta-row">
              <span className="paper-status">Working Paper</span>
              <span className="paper-dot" aria-hidden="true">&middot;</span>
              <span className="paper-date">April 2026</span>
              <span className="paper-dot" aria-hidden="true">&middot;</span>
              <span className="paper-readtime">~25 min read</span>
            </div>
            <h1 className="paper-title">
              The Knowledge Gap
              <span className="paper-title-sub">
                Structural Deficiencies in Web Content for Autonomous AI Agents
              </span>
            </h1>
            <div className="paper-author-card">
              <div className="paper-author-avatar" aria-hidden="true">AD</div>
              <div>
                <div className="paper-author-name">Aditya Dutta</div>
                <div className="paper-author-affil">Open Knowledge Protocol</div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <SectionStats />

          {/* All sections */}
          <SectionAbstract />
          <SectionIntroduction />
          <SectionBackground />
          <SectionKnowledgeGap />
          <SectionDeficiencies />
          <SectionOKP />
          <SectionImplementation />
          <SectionRelatedWork />
          <SectionDiscussion />
          <SectionConclusion />
          <SectionReferences />

        </main>

        <PaperToc activeId={activeId} />
      </div>
    </div>
  );
}
