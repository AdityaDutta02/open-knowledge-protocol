import NavBar from './homepage/NavBar';
import Hero from './homepage/Hero';
import CodeSnippet from './homepage/CodeSnippet';
import Cards from './homepage/Cards';
import Footer from './homepage/Footer';
import { BG, TEXT } from './homepage/tokens';

export default function HomePage() {
  return (
    <div style={{ background: BG, minHeight: '100vh', color: TEXT }}>
      <NavBar />
      <Hero />
      <CodeSnippet />
      <Cards />
      <Footer />
    </div>
  );
}
