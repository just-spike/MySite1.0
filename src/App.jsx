import React, { useEffect, useState } from 'react';
import SpotlightHome from './components/SpotlightHome';
import PacmanHome from './components/PacmanHome';
import PageToc from './components/PageToc';
import AvatarHero from './components/AvatarHero';
import BioHeader from './components/BioHeader';
import ResumeTimeline from './components/ResumeTimeline';
import PortfolioGallery from './components/PortfolioGallery';
import GlobalFooter from './components/GlobalFooter';

function App() {
  const [showHome, setShowHome] = useState(true);
  const [mode, setMode] = useState('pixel');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('mode-modern', mode === 'modern');
    root.classList.toggle('mode-pixel', mode === 'pixel');
  }, [mode]);

  const toggleMode = () => setMode(m => (m === 'pixel' ? 'modern' : 'pixel'));

  return (
    <div className="min-h-screen">
      {showHome ? (
        <PacmanHome onEnter={() => setShowHome(false)} />
      ) : (
        <div className="flex flex-col gap-12 pb-12 pl-toc-sm min-[900px]:pl-toc min-h-screen">
          <PageToc />
          <main className="flex flex-col gap-12 w-full">
            <AvatarHero mode={mode} />
            <BioHeader />
            <ResumeTimeline />
            <PortfolioGallery />
            <GlobalFooter />
          </main>
        </div>
      )}
      <button
        type="button"
        onClick={toggleMode}
        className="fixed left-4 bottom-4 z-50 px-3 py-2 rounded-md border border-border bg-gray-block text-fg text-sm hover:opacity-90 active:opacity-80"
        aria-pressed={mode === 'modern'}
      >
        {mode === 'pixel' ? '切换到现代风' : '切换到像素风'}
      </button>
    </div>
  );
}

export default App;
