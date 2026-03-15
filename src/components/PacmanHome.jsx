import React from 'react';
import PacmanGame from './PacmanGame';
import { useNavigate } from 'react-router-dom';

const PacmanHome = ({ onEnter }) => {
  const navigate = useNavigate();
  // Game automatically starts
  const gameStarted = true;
  
  // Navigation items for the bottom
  const navItems = [
    { label: '关于我', id: 'bio-header', path: '/' },
    { label: '作品集', id: 'portfolio-gallery', path: '/portfolio' },
    { label: '游戏', id: 'games', path: '/games' },
    { label: '工具', id: 'tools', path: '/tools' }
  ];

  const handleNavClick = (item) => {
    // If it's the home page/bio, trigger onEnter animation
    if (item.path === '/') {
        onEnter();
        // Wait for animation then scroll
        setTimeout(() => {
            const el = document.getElementById(item.id);
            if (el) {
                const rectTop = el.getBoundingClientRect().top + window.pageYOffset;
                const target = rectTop - window.innerHeight * 0.3;
                window.scrollTo({ top: target, behavior: 'smooth' });
            }
        }, 100);
    } else {
        // For other pages, navigate directly
        navigate(item.path);
    }
  };

  return (
    <div className="h-screen w-full bg-black text-white font-pixel flex flex-col items-center justify-center p-0 overflow-hidden relative">
      
      {/* Centered Content */}
      <div className="flex flex-col items-center justify-center gap-8 z-20 flex-grow relative">
        
        {/* Game Area - Positioned behind title */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[-1] opacity-60 pointer-events-none flex items-center justify-center">
             <div className="w-[120vw] md:w-[800px] h-[300px] flex items-center justify-center overflow-hidden mask-image-gradient">
                 <PacmanGame active={gameStarted} fixedSize={false} maxWidth={1.0} maxHeight={1.0} />
             </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] animate-pulse cursor-pointer relative z-10" onClick={onEnter}>
          Hello, World
        </h1>

      </div>

      {/* Bottom Navigation Links */}
      <div className="absolute bottom-12 z-20 w-full flex justify-center">
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 px-4">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavClick(item)}
              className="text-white/70 hover:text-white hover:scale-110 transition-all duration-300 font-pixel tracking-widest text-sm md:text-base border-b border-transparent hover:border-white pb-1"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Background Gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none z-10" />
      
    </div>
  );
};

export default PacmanHome;
