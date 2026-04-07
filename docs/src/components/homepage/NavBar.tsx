import { SERIF, SANS } from './tokens';

export default function NavBar(): JSX.Element {
  return (
    <nav
      className="anim-nav"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#ffffff',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          maxWidth: 1600,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: 60,
        }}
      >
        <a
          href="/"
          style={{
            fontFamily: SERIF,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#1c1e21',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.opacity = '1';
          }}
        >
          okp
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <NavLink href="/why-okp" label="Docs" />
          <NavLink
            href="https://github.com/AdityaDutta02/open-knowledge-protocol"
            label="GitHub"
            external
          />
          <span
            className="anim-pill-glow"
            style={{
              background: '#e46b39',
              color: '#ffffff',
              fontSize: 14,
              fontFamily: SANS,
              fontWeight: 700,
              padding: '6px 16px',
              borderRadius: 9999,
              cursor: 'default',
            }}
          >
            v0.1.0
          </span>
        </div>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  external?: boolean;
}

function NavLink({ href, label, external = false }: NavLinkProps): JSX.Element {
  const extraProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <a
      href={href}
      {...extraProps}
      className="nav-link-group"
      style={{
        fontFamily: SANS,
        fontSize: 16,
        fontWeight: 400,
        color: '#1c1e21',
        textDecoration: 'none',
        letterSpacing: '0.02em',
        textTransform: 'uppercase' as const,
        position: 'relative' as const,
      }}
      onMouseEnter={(e) => {
        const anchor = e.currentTarget as HTMLAnchorElement;
        anchor.style.color = '#e46b39';
        const bar = anchor.querySelector('.nav-underline') as HTMLSpanElement | null;
        if (bar) bar.style.width = '100%';
      }}
      onMouseLeave={(e) => {
        const anchor = e.currentTarget as HTMLAnchorElement;
        anchor.style.color = '#1c1e21';
        const bar = anchor.querySelector('.nav-underline') as HTMLSpanElement | null;
        if (bar) bar.style.width = '0%';
      }}
    >
      {label}
      <span
        className="nav-underline"
        style={{
          position: 'absolute',
          bottom: -2,
          left: 0,
          width: '0%',
          height: 2,
          background: '#e46b39',
          transition: 'width 0.3s ease',
        }}
      />
    </a>
  );
}
