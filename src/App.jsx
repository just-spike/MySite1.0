import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import DesignSystemPreview from '../DesignSystem/index';
import FigmaButtonPreview from '../DesignSystem/FigmaButtonPreview';
import PacmanHome from './components/PacmanHome';
import PageToc from './components/PageToc';
import AvatarHero from './components/AvatarHero';
import BioHeader from './components/BioHeader';
import PortfolioGallery from './components/PortfolioGallery';
import GlobalFooter from './components/GlobalFooter';

function PortfolioPage() {
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
  const [mode, setMode] = useState('modern');
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

  const ModeToggle = () => (
    <div className="fixed left-3 bottom-3 z-50 flex items-center rounded-md bg-gray-block/65 p-1 backdrop-blur-[2px]">
      <button
        type="button"
        onClick={() => setMode('modern')}
        className={`h-12 w-12 rounded-sm border border-transparent flex items-center justify-center transition-all ${mode === 'modern' ? 'bg-black/20 opacity-90' : 'opacity-60 hover:opacity-85'} hover:border-border`}
        aria-pressed={mode === 'modern'}
        aria-label="现代风"
      >
        <svg viewBox="0 0 24 24" className="h-9 w-9 scale-110 text-fg" aria-hidden="true" fill="currentColor">
          <path d="M6 18V11a6 6 0 1 1 12 0v7l-2-2-2 2-2-2-2 2-2-2-2 2Z" />
          <circle cx="10" cy="11" r="1.2" fill="var(--bg)" />
          <circle cx="14" cy="11" r="1.2" fill="var(--bg)" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setMode('pixel')}
        className={`h-12 w-12 rounded-sm border border-transparent flex items-center justify-center transition-all ${mode === 'pixel' ? 'bg-black/20 opacity-90' : 'opacity-60 hover:opacity-85'} hover:border-border`}
        aria-pressed={mode === 'pixel'}
        aria-label="像素风"
      >
        <svg viewBox="0 0 1024 1024" className="h-9 w-9 text-fg" aria-hidden="true" fill="currentColor">
          <path d="M419.16 187.22c61.96-0.08 123.92 0 185.88-0.04 0.12 15.5-0.04 31-0.06 46.5 30.8-0.2 61.58-0.08 92.38-0.16 0.44 15.34 0.16 30.7 0.08 46.06 15.72 1.66 31.56 0.44 47.34 0.92-0.04 15.4-0.1 30.8-0.22 46.2 15.48 0.04 30.96 0.42 46.44 0.28 0.18 46.46-0.14 92.92 0.02 139.4 15.5-0.02 31-0.02 46.5 0-0.06 108.22 0.06 216.44-0.04 324.66-15.52-0.04-31.02-0.04-46.54-0.02 0.02 15.48 0.1 30.94 0.1 46.4-30.86 0.04-61.74 0-92.6 0.02 0.02-15.46 0.08-30.92 0.08-46.38-15.68-0.12-31.36 0.04-47.04-0.12-0.16-15.26 0.56-30.54-0.06-45.8-15.48-0.62-30.98-0.02-46.46-0.22 0.08 15.36 0.16 30.72 0.1 46.08-15.46 0-30.9 0.02-46.36 0-0.08 15.46 0.04 30.94 0.02 46.42-31.12-0.04-62.24 0.16-93.36-0.1 0.08-15.46 0.22-30.9 0.12-46.34-15.44 0.04-30.9 0.06-46.36 0 0.04-15.36 0.1-30.7 0.18-46.04-15.58-0.04-31.16-0.02-46.72-0.02 0.06 15.34 0.1 30.7 0.1 46.04-15.62 0.12-31.24-0.02-46.84 0.08-0.7 15.46-0.08 30.94-0.26 46.4-30.9 0-61.78-0.04-92.66 0.02-0.02-15.48 0.18-30.98 0.12-46.46-15.44 0.02-30.88 0-46.32 0.02 0.06-108.22 0.14-216.42-0.04-324.64 15.44-0.02 30.88-0.02 46.32 0 0.18-46.56-0.08-93.12-0.12-139.66 15.64 0 31.28 0.4 46.92 0.26-0.02-15.52 0-31.06-0.1-46.58 15.62 0 31.24 0.02 46.86 0 0.14-15.7-0.28-31.4 0.18-47.1 17.08 2.1 34.18-0.44 51.28 0.98 13.76-0.84 27.54-0.82 41.32-0.8-0.14-15.42-0.2-30.84-0.18-46.26m139.62 232.12c-0.16 61.98 0.06 123.96-0.02 185.94 61.92-0.06 123.84 0.16 185.76-0.1 0.3-15.44 0.36-30.9 0.36-46.34-31.2-0.02-62.4 0.08-93.6-0.06 0.12-30.78 0.16-61.54 0-92.3 31.08-0.22 62.18-0.1 93.28-0.08 0.76 30.4-0.32 60.8 0.48 91.2 0.54-46.08-0.14-92.14-0.32-138.2-61.98-0.1-123.96 0-185.94-0.06m-279.34 0.9c0.08 61.66 0.18 123.32 0.08 185 61.8 0.2 123.6-0.16 185.42 0.24 0.62-15.54 0.28-31.12 0.36-46.68-30.9 0.08-61.78 0.02-92.68 0.04 0.12-30.82 0.14-61.64 0.02-92.46 30.88 0.02 61.74-0.1 92.62 0.06 0.12-15.4 0.02-30.8 0.02-46.2h-185.84z" />
        </svg>
      </button>
    </div>
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
           <PortfolioPage />
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
