import { TEXT, TEXT_MUTED, BORDER, SANS } from './tokens';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: `1px solid ${BORDER}`,
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span style={{ fontFamily: SANS, fontSize: 14, color: TEXT_MUTED, fontWeight: 400 }}>
        OKP is open source. MIT license.
      </span>
      <a
        href="https://github.com/AdityaDutta02/open-knowledge-protocol"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: SANS,
          fontSize: 14,
          color: TEXT_MUTED,
          textDecoration: 'none',
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = TEXT)}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = TEXT_MUTED)}
      >
        GitHub →
      </a>
    </footer>
  );
}
