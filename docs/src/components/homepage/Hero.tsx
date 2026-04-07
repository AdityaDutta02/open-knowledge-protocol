import { SERIF } from './tokens';

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
        <div className="anim-hero-1" style={{ overflow: 'hidden' }}>
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
        </div>

        {/* Line 2 — with bobbing emoji */}
        <div
          className="anim-hero-2"
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
          <span
            className="anim-bob"
            style={{
              fontSize: 'clamp(45px, 7.5vw, 110px)',
              userSelect: 'none',
              display: 'inline-block',
            }}
            aria-hidden="true"
          >
            🧠
          </span>
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
        </div>

        {/* Line 3 */}
        <div className="anim-hero-3">
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
        </div>

      </div>
    </section>
  );
}
