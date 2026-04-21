import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

// ── Markdown file imports (Vite raw loader) ───────────────────────────────────

const docModules = import.meta.glob('../content/docs/**/*.md', { query: '?raw', import: 'default' });

// ── Sidebar nav structure ────────────────────────────────────────────────────

interface NavItem {
  label: string;
  path: string;
}
interface NavGroup {
  label: string;
  items: NavItem[];
}
type NavEntry = NavItem | NavGroup;

function isGroup(e: NavEntry): e is NavGroup {
  return 'items' in e;
}

const NAV: NavEntry[] = [
  { label: 'Why OKP', path: '/why-okp' },
  {
    label: 'Quickstart',
    items: [
      { label: 'Next.js + Sanity', path: '/quickstart/nextjs-sanity' },
      { label: 'Next.js + Contentful', path: '/quickstart/nextjs-contentful' },
      { label: 'Astro + Markdown', path: '/quickstart/astro-md' },
    ],
  },
  {
    label: 'Packages',
    items: [
      { label: '@okp/schema', path: '/packages/schema' },
      { label: '@okp/mcp-server', path: '/packages/mcp-server' },
      { label: '@okp/llms-txt', path: '/packages/llms-txt' },
      { label: '@okp/devtools', path: '/packages/devtools' },
      { label: '@okp/validate', path: '/packages/validate' },
    ],
  },
  { label: 'Spec (v0)', path: '/spec/v0' },
  { label: 'Showcase', path: '/showcase' },
  { label: 'Paper', path: '/paper' },
];

// Maps URL path → markdown file path relative to glob base
function pathToFile(section: string | undefined, slug: string | undefined): string {
  if (section) return `../content/docs/${section}/${slug}.md`;
  return `../content/docs/${slug}.md`;
}

// ── TOC extraction ────────────────────────────────────────────────────────────

interface TocItem {
  id: string;
  text: string;
  depth: number;
}

// M-5: Strip inline markdown before generating IDs so they match nodeText-based heading IDs
function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split('\n');
  const items: TocItem[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const depth = match[1].length;
      // Strip inline markdown: code, bold, italic, links
      const rawText = match[2].trim()
        .replace(/`([^`]+)`/g, '$1')           // inline code
        .replace(/\*\*([^*]+)\*\*/g, '$1')     // bold
        .replace(/\*([^*]+)\*/g, '$1')          // italic
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // links
      const id = slugify(rawText);
      items.push({ id, text: rawText, depth });
    }
  }
  return items;
}

// ── Heading slugify (must match remark-slug behavior) ────────────────────────

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
}

// M-5: Recursively extract plain text from React children to get accurate heading IDs
function nodeText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(nodeText).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    const element = children as React.ReactElement;
    return nodeText((element.props as { children?: React.ReactNode }).children);
  }
  return '';
}

// ── Strip frontmatter ─────────────────────────────────────────────────────────

function stripFrontmatter(raw: string): string {
  if (!raw.startsWith('---')) return raw;
  const end = raw.indexOf('---', 3);
  if (end === -1) return raw;
  return raw.slice(end + 3).trimStart();
}

// H-5: Extract the first H1 heading from markdown for document.title
function extractTitle(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '';
}

// ── Copy button with microanimation ──────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      className={`doc-copy-btn ${copied ? 'doc-copy-btn--copied' : ''}`}
      onClick={handleCopy}
      aria-label={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="4" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M4 4V3a1 1 0 011-1h6a1 1 0 011 1v8a1 1 0 01-1 1h-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )}
    </button>
  );
}

// ── Collapsible code block ────────────────────────────────────────────────────

function CodeBlock({ children, className }: { children?: React.ReactNode; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const text = typeof children === 'string' ? children : '';
  const lineCount = text ? text.split('\n').filter((_, i, arr) => i < arr.length - 1 || arr[i] !== '').length : 0;
  const collapsible = lineCount > 5;

  return (
    <div className={`doc-code-wrap ${collapsible ? 'doc-code-collapsible' : ''} ${expanded ? 'doc-code-expanded' : ''}`}>
      <CopyButton text={text} />
      <div className="doc-code-inner">
        <pre className="doc-pre">
          <code className={`doc-code-block ${className ?? ''}`}>{children}</code>
        </pre>
      </div>
      {collapsible && (
        <div className="doc-code-fade">
          <button
            className="doc-code-toggle"
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? '↑ Collapse' : '↓ Show all'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Markdown components ───────────────────────────────────────────────────────

function makeComponents(): Components {
  return {
    // M-5: Use nodeText instead of String(children) to handle inline code/bold in headings
    h1: ({ children }) => <h1 id={slugify(nodeText(children))} className="doc-h1">{children}</h1>,
    h2: ({ children }) => <h2 id={slugify(nodeText(children))} className="doc-h2">{children}</h2>,
    h3: ({ children }) => <h3 id={slugify(nodeText(children))} className="doc-h3">{children}</h3>,
    p: ({ children }) => <p className="doc-p">{children}</p>,
    a: ({ href, children }) => <a href={href} className="doc-a">{children}</a>,
    code: ({ children, className }) => {
      const isBlock = className?.startsWith('language-');
      if (isBlock) {
        return <CodeBlock className={className}>{children}</CodeBlock>;
      }
      return <code className="doc-code-inline">{children}</code>;
    },
    pre: ({ children }) => <>{children}</>,
    ul: ({ children }) => <ul className="doc-ul">{children}</ul>,
    ol: ({ children }) => <ol className="doc-ol">{children}</ol>,
    li: ({ children }) => <li className="doc-li">{children}</li>,
    blockquote: ({ children }) => <blockquote className="doc-blockquote">{children}</blockquote>,
    hr: () => <hr className="doc-hr" />,
    strong: ({ children }) => <strong className="doc-strong">{children}</strong>,
    table: ({ children }) => (
      <div className="doc-table-wrap">
        <table className="doc-table">{children}</table>
      </div>
    ),
    th: ({ children }) => <th className="doc-th">{children}</th>,
    td: ({ children }) => <td className="doc-td">{children}</td>,
  };
}

const MD_COMPONENTS = makeComponents();

// ── Sidebar ───────────────────────────────────────────────────────────────────

// C-1: Accept optional onLinkClick to close mobile drawer on navigation
function Sidebar({ currentPath, onLinkClick }: { currentPath: string; onLinkClick?: () => void }) {
  return (
    <aside className="docs-sidebar">
      {NAV.map((entry) => {
        if (!isGroup(entry)) {
          const active = currentPath === entry.path || currentPath === entry.path + '/';
          return (
            <div key={entry.path} className="sidebar-top-link">
              <Link
                to={entry.path}
                className={`sidebar-item sidebar-item--top ${active ? 'sidebar-item--active' : ''}`}
                onClick={onLinkClick}
              >
                {entry.label}
              </Link>
            </div>
          );
        }
        return (
          <div key={entry.label} className="sidebar-group">
            <div className="sidebar-group-header">
              <span className="sidebar-group-title">{entry.label}</span>
            </div>
            <ul className="sidebar-items">
              {entry.items.map((item) => {
                const active = currentPath === item.path || currentPath === item.path + '/';
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`sidebar-item ${active ? 'sidebar-item--active' : ''}`}
                      onClick={onLinkClick}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </aside>
  );
}

// ── TOC Panel ─────────────────────────────────────────────────────────────────

function TocPanel({ items, activeId }: { items: TocItem[]; activeId: string }) {
  if (!items.length) return null;
  return (
    <aside className="docs-toc">
      <p className="toc-label">On this page</p>
      <ul className="toc-list">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`toc-item ${item.depth > 1 ? 'toc-item--nested' : ''} ${activeId === item.id ? 'toc-item--active' : ''}`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const { slug, section } = useParams<{ slug: string; section: string }>();
  const location = useLocation();
  const [content, setContent] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeId, setActiveId] = useState('');
  // C-1: Mobile nav drawer state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentPath = location.pathname;
  const toc = content ? extractToc(content) : [];

  // Load markdown
  useEffect(() => {
    setContent(null);
    setNotFound(false);
    const filePath = pathToFile(section, slug);
    const loader = docModules[filePath];
    if (!loader) {
      setNotFound(true);
      // H-5: Update document title for not-found state
      document.title = 'Page Not Found — OKP';
      return;
    }
    loader().then((raw) => {
      const stripped = stripFrontmatter(raw as string);
      setContent(stripped);
      // H-5: Update document title from first H1 heading
      const title = extractTitle(stripped);
      document.title = title ? `${title} — OKP` : 'Open Knowledge Protocol';
    });
  }, [slug, section]);

  // Scroll-spy TOC
  useEffect(() => {
    if (!contentRef.current || !toc.length) return;
    const headings = toc
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 },
    );
    headings.forEach((h) => observer.observe(h));
    if (headings[0]) setActiveId(headings[0].id);
    return () => observer.disconnect();
  }, [content]);

  // Scroll to top on nav change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="docs-root">
      {/* M-7: Skip navigation link for keyboard/screen-reader users */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* C-1: Mobile nav overlay — closes drawer when tapping outside */}
      {mobileNavOpen && (
        <div className="docs-mobile-overlay" onClick={() => setMobileNavOpen(false)} />
      )}

      {/* C-1: Mobile nav drawer */}
      <div className={`docs-mobile-drawer ${mobileNavOpen ? 'docs-mobile-drawer--open' : ''}`}>
        <button
          className="docs-mobile-drawer-close"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close navigation menu"
        >
          ×
        </button>
        <Sidebar currentPath={currentPath} onLinkClick={() => setMobileNavOpen(false)} />
      </div>

      {/* Header */}
      <header className="docs-header">
        {/* C-1: Hamburger button — visible only on mobile */}
        <button
          className="docs-mobile-menu-btn"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileNavOpen}
        >
          <span className="docs-hamburger" />
        </button>
        <Link to="/" className="docs-logo">okp</Link>
        <div className="docs-header-right">
          <a
            href="https://github.com/AdityaDutta02/open-knowledge-protocol"
            target="_blank"
            rel="noopener noreferrer"
            className="docs-header-link"
          >
            GitHub
          </a>
          <span className="docs-header-version">v0.1.0</span>
        </div>
      </header>

      {/* Body */}
      <div className="docs-body">
        <Sidebar currentPath={currentPath} />

        {/* M-7: id="main-content" for skip link target */}
        <main className="docs-main" id="main-content" ref={contentRef}>
          {notFound && (
            <div className="doc-not-found">
              <h2>Page not found</h2>
              <p><Link to="/why-okp">Start with Why OKP →</Link></p>
            </div>
          )}
          {content && (
            <article className="doc-article">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
                {content}
              </ReactMarkdown>
            </article>
          )}
          {content === null && !notFound && (
            <div className="doc-loading">Loading…</div>
          )}
        </main>

        <TocPanel items={toc} activeId={activeId} />
      </div>
    </div>
  );
}
