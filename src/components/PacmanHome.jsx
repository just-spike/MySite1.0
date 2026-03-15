import React, { useEffect, useRef, useState } from 'react';
import PacmanGame from './PacmanGame';
import { useNavigate } from 'react-router-dom';

const PacmanHome = ({ onEnter }) => {
  const navigate = useNavigate();
  const [isGameHovered, setIsGameHovered] = useState(false);
  const hoverLeaveTimerRef = useRef(null);
  // Game automatically starts
  const gameStarted = true;
  const TITLE_RESTORE_DELAY_MS = 2000;
  
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

  // --- 布局尺寸变量 ---
  const NAV_GAP = 20;       // 游戏与导航按钮之间的间距 (px)

  const handleGameHoverChange = (hovered) => {
    if (hoverLeaveTimerRef.current) {
      clearTimeout(hoverLeaveTimerRef.current);
      hoverLeaveTimerRef.current = null;
    }
    if (hovered) {
      setIsGameHovered(true);
      return;
    }
    hoverLeaveTimerRef.current = setTimeout(() => {
      setIsGameHovered(false);
      hoverLeaveTimerRef.current = null;
    }, TITLE_RESTORE_DELAY_MS);
  };

  useEffect(() => {
    return () => {
      if (hoverLeaveTimerRef.current) {
        clearTimeout(hoverLeaveTimerRef.current);
        hoverLeaveTimerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="h-screen w-full bg-black text-white font-pixel flex flex-col items-center justify-center p-0 overflow-hidden relative">
      
      {/* Centered Content */}
      <div className="flex flex-col items-center justify-center z-20 flex-grow relative">
        
        {/* Game & Title Area */}
        <div
          className="relative inline-block"
          style={{ marginBottom: `${NAV_GAP}px` }}
        >
          <div className="overflow-hidden">
            <PacmanGame active={gameStarted} fixedSize={false} maxWidth={1.0} maxHeight={1.0} onHoverChange={handleGameHoverChange} />
          </div>

          {/* Title - Absolutely centered over game */}
          <h1 className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10 whitespace-nowrap pointer-events-none select-none will-change-[opacity,transform,filter] transition-[opacity,transform,filter] duration-500 ease-out ${isGameHovered ? 'opacity-0 -translate-y-[52%] scale-95 blur-[2px]' : 'opacity-100 -translate-y-1/2 scale-100 blur-0'}`}>
            Hello, World
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center items-center gap-y-4 px-4">
          {navItems.map((item, index) => (
            <div key={item.path} className="flex items-center">
              <button
                onClick={() => handleNavClick(item)}
                className="text-white/70 hover:text-white hover:scale-110 transition-all duration-300 font-pixel tracking-widest text-sm md:text-base border-b border-transparent hover:border-white pb-1"
              >
                {item.label}
              </button>
              {index < navItems.length - 1 && (
                <span className="mx-5 md:mx-7 h-4 md:h-5 w-px bg-white/25" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default PacmanHome;
