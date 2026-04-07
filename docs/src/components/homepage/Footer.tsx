import { SANS } from './tokens';

export default function Footer(): JSX.Element {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(28,30,33,0.12)',
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          fontFamily: SANS,
          fontSize: 14,
          color: '#6b6f75',
          fontWeight: 400,
        }}
      >
        OKP is open source. MIT license.
      </span>
      <a
        href="https://github.com/AdityaDutta02/open-knowledge-protocol"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: SANS,
          fontSize: 14,
          color: '#6b6f75',
          textDecoration: 'none',
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color = '#1c1e21';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color = '#6b6f75';
        }}
      >
        GitHub →
      </a>
    </footer>
  );
}
