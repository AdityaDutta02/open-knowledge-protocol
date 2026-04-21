import NavBar from './homepage/NavBar';
import Hero from './homepage/Hero';
import Cards from './homepage/Cards';
import Footer from './homepage/Footer';

export default function HomePage(): JSX.Element {
  return (
    <div
      className="grid-bg anim-grid-drift"
      style={{
        minHeight: '100dvh',
        background: '#f6f6f6',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <NavBar />
      <Hero />
      <Cards />
      <Footer />
    </div>
  );
}
