import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import DocsPage from './pages/DocsPage';
import PaperPage from './pages/PaperPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/paper" element={<PaperPage />} />
        <Route path="/:slug" element={<DocsPage />} />
        <Route path="/:section/:slug" element={<DocsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
