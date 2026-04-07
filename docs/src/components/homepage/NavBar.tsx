import { motion } from 'framer-motion';
import { TEXT, TEXT_MUTED, BORDER, SERIF, SANS } from './tokens';

export default function NavBar() {
  const links: [string, string][] = [
    ['Why OKP', '/why-okp'],
    ['Quickstart', '/quickstart/nextjs-sanity'],
    ['Spec', '/spec/v0'],
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${BORDER}`,
        background: 'rgba(25,16,52,0.85)',
        padding: '0 32px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <a
        href="/"
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 20,
          color: TEXT,
          textDecoration: 'none',
          letterSpacing: '-0.3px',
          fontWeight: 500,
        }}
      >
        okp
      </a>

      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            style={{
              fontFamily: SANS,
              fontSize: 14.5,
              color: TEXT_MUTED,
              textDecoration: 'none',
              fontWeight: 400,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = TEXT)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = TEXT_MUTED)}
          >
            {label}
          </a>
        ))}
        <a
          href="https://github.com/AdityaDutta02/open-knowledge-protocol"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: SANS,
            fontSize: 14.5,
            color: TEXT,
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          GitHub →
        </a>
      </div>
    </motion.nav>
  );
}
