import { motion } from 'framer-motion';
import { TEXT, TEXT_MUTED, ACCENT, BORDER, SERIF, SANS, fadeUp, stagger } from './tokens';

export default function Hero() {
  const lines = ['The web knows things.', "AI agents can't read it yet."];

  return (
    <section
      style={{
        maxWidth: 680,
        margin: '0 auto',
        padding: '120px 24px 80px',
        textAlign: 'center',
      }}
    >
      <motion.div variants={stagger(0)} initial="hidden" animate="visible">
        {lines.map((line) => (
          <motion.h1
            key={line}
            variants={fadeUp}
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 500,
              letterSpacing: '-0.45px',
              lineHeight: 1.2,
              color: TEXT,
              margin: '0 0 4px',
            }}
          >
            {line}
          </motion.h1>
        ))}

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: SANS,
            fontSize: 18,
            color: TEXT_MUTED,
            lineHeight: 1.75,
            margin: '32px 0 40px',
            fontWeight: 400,
          }}
        >
          OKP is an open standard that structures your content into a graph AI
          agents can query, traverse, and reason about — without scraping,
          hallucinating, or guessing.
        </motion.p>

        <motion.div
          variants={fadeUp}
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <motion.a
            href="/spec/v0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              fontFamily: SANS,
              fontSize: 15,
              fontWeight: 500,
              color: TEXT,
              background: ACCENT,
              padding: '11px 24px',
              borderRadius: 8,
              textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 4px 14px rgba(112,44,221,0.4)',
            }}
          >
            Read the spec →
          </motion.a>
          <motion.a
            href="/quickstart/nextjs-sanity"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              fontFamily: SANS,
              fontSize: 15,
              fontWeight: 400,
              color: TEXT_MUTED,
              background: 'transparent',
              border: `1px solid ${BORDER}`,
              padding: '11px 24px',
              borderRadius: 8,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Get started in 15 min →
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
