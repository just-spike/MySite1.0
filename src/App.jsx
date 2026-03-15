import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import DesignSystemPreview from '../DesignSystem/index';
import FigmaButtonPreview from '../DesignSystem/FigmaButtonPreview';
import SpotlightHome from './components/SpotlightHome';
import PacmanHome from './components/PacmanHome';
import PageToc from './components/PageToc';
import AvatarHero from './components/AvatarHero';
import BioHeader from './components/BioHeader';
import PortfolioGallery from './components/PortfolioGallery';
import GlobalFooter from './components/GlobalFooter';

function PortfolioPage({ mode }) {
  return (
    <div className="flex flex-col gap-12 pb-12 pl-toc-sm min-[900px]:pl-toc min-h-screen">
      <PageToc />
      <main className="flex flex-col gap-12 w-full">
        {/* Placeholder for header or spacing if needed */}
        <div className="h-12"></div>
        <PortfolioGallery />
        <GlobalFooter />
      </main>
    </div>
  );
}

function MainContent() {
  const [showHome, setShowHome] = useState(true);
  const [mode, setMode] = useState('pixel');
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('mode-modern', mode === 'modern');
    root.classList.toggle('mode-pixel', mode === 'pixel');
  }, [mode]);

  useEffect(() => {
    if (location.state?.skipIntro) {
      setShowHome(false);
    } else if (location.state?.showIntro) {
      setShowHome(true);
    }
  }, [location]);

  const toggleMode = () => setMode(m => (m === 'pixel' ? 'modern' : 'pixel'));

  // Shared mode toggle button
  const ModeToggle = () => (
    <button
      type="button"
      onClick={toggleMode}
      className="fixed left-4 bottom-4 z-50 px-3 py-2 rounded-md border border-border bg-gray-block text-fg text-sm hover:opacity-90 active:opacity-80"
      aria-pressed={mode === 'modern'}
    >
      {mode === 'pixel' ? '切换到现代风' : '切换到像素风'}
    </button>
  );

  return (
    <Routes>
      <Route path="/" element={
        <div className="min-h-screen">
          {showHome ? (
            <PacmanHome onEnter={() => setShowHome(false)} />
          ) : (
            <div className="flex flex-col gap-12 pb-12 pl-toc-sm min-[900px]:pl-toc min-h-screen">
              <PageToc />
              <main className="flex flex-col gap-12 w-full">
                <AvatarHero mode={mode} />
                <BioHeader />
                <GlobalFooter />
              </main>
            </div>
          )}
          <ModeToggle />
        </div>
      } />
      <Route path="/portfolio" element={
        <div className="min-h-screen">
           <PortfolioPage mode={mode} />
           <ModeToggle />
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/design-system" element={<DesignSystemPreview />} />
      <Route path="/figma-button" element={<FigmaButtonPreview />} />
      <Route path="/*" element={<MainContent />} />
    </Routes>
  );
}

export default App;
