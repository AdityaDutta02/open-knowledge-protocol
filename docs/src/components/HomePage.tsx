// Assembled in Task 5 once all sections are ready.
// CodeSnippet and Cards are created by parallel Task 3 and Task 4.
import NavBar from './homepage/NavBar';
import Hero from './homepage/Hero';
import { BG, TEXT } from './homepage/tokens';

// Lazy imports — these files are created by parallel tasks 3 and 4
// and wired up in Task 5. Leave as stubs to avoid build errors now.
const CodeSnippet = () => null;
const Cards = () => null;
const Footer = () => null;

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
