import { motion } from 'framer-motion';
import { SERIF } from './tokens';

const lineVariants = {
  hidden: { opacity: 0, y: 60, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

export default function Hero(): JSX.Element {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 120,
        paddingBottom: 60,
        paddingLeft: 24,
        paddingRight: 24,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Line 1 — italic serif */}
        <motion.div
          style={{ overflow: 'hidden' }}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <h1
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(60px, 10vw, 150px)',
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              fontStyle: 'italic',
              textAlign: 'center',
              color: '#1c1e21',
              margin: 0,
            }}
          >
            The knowledge layer
          </h1>
        </motion.div>

        {/* Line 2 — with bobbing emoji */}
        <motion.div
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(12px, 2vw, 20px)',
          }}
        >
          <span
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(60px, 10vw, 150px)',
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              color: '#1c1e21',
            }}
          >
            for the
          </span>
          <motion.span
            animate={{ y: [0, -8, 4, 0], rotate: [0, -3, 2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              fontSize: 'clamp(45px, 7.5vw, 110px)',
              userSelect: 'none',
              display: 'inline-block',
            }}
            aria-hidden="true"
          >
            🧠
          </motion.span>
          <span
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(60px, 10vw, 150px)',
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              color: '#1c1e21',
            }}
          >
            agentic
          </span>
        </motion.div>

        {/* Line 3 */}
        <motion.div
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
        >
          <span
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(60px, 10vw, 150px)',
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              color: '#1c1e21',
            }}
          >
            web.
          </span>
        </motion.div>

      </div>
    </section>
  );
}
