import { motion } from 'framer-motion';
import { BG_CARD, TEXT, TEXT_MUTED, ACCENT, BORDER, SHADOW, SERIF, SANS } from './tokens';

const CARDS: { title: string; body: string; href: string; label: string }[] = [
  {
    title: 'Why OKP',
    body: 'The web has been retrofitted for machine consumption three times. Each time, a different gap went unclosed.',
    href: '/why-okp',
    label: 'Read the story →',
  },
  {
    title: 'Quickstart',
    body: 'Add OKP to a Next.js + Sanity site in about 15 minutes. No new infrastructure required.',
    href: '/quickstart/nextjs-sanity',
    label: 'Start building →',
  },
  {
    title: 'Packages',
    body: 'Five npm packages. Install what you need — schema, MCP server, validator, devtools, llms.txt.',
    href: '/packages/schema',
    label: 'Browse packages →',
  },
  {
    title: 'Spec v0',
    body: 'The protocol RFC. ConceptDNA schema, graph semantics, compliance tiers, and extension points.',
    href: '/spec/v0',
    label: 'Read the spec →',
  },
];

const cardContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Cards() {
  return (
    <motion.section
      variants={cardContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      style={{
        maxWidth: 800,
        margin: '0 auto 96px',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 24,
      }}
    >
      {CARDS.map((card) => (
        <motion.a
          key={card.title}
          href={card.href}
          variants={cardItem}
          whileHover={{
            y: -3,
            boxShadow: '0 20px 48px rgba(91,33,182,0.22), 0 0 0 1px rgba(112,44,221,0.3)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            background: BG_CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
            padding: '24px',
            textDecoration: 'none',
            display: 'block',
            boxShadow: SHADOW,
          }}
        >
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 20,
              fontWeight: 500,
              color: TEXT,
              margin: '0 0 10px',
              letterSpacing: '-0.2px',
            }}
          >
            {card.title}
          </h3>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 14.5,
              color: TEXT_MUTED,
              lineHeight: 1.65,
              margin: '0 0 20px',
              fontWeight: 400,
            }}
          >
            {card.body}
          </p>
          <span style={{ fontFamily: SANS, fontSize: 14, color: ACCENT, fontWeight: 500 }}>
            {card.label}
          </span>
        </motion.a>
      ))}
    </motion.section>
  );
}
