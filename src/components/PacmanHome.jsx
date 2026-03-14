import React, { useState } from 'react';
import PacmanGame from './PacmanGame';

const PacmanHome = ({ onEnter }) => {
  const [gameStarted, setGameStarted] = useState(false);
  
  // Configuration
  const h1FontSize = "text-xl md:text-2xl"; 

  return (
    <div className="h-screen w-full bg-black text-white font-pixel flex flex-col items-center justify-center p-0 overflow-hidden relative">
      
      {/* Centered Container */}
      <div className="flex flex-col items-center justify-center">
        
        {/* Game Area */}
        <div 
          className="relative bg-black flex items-center justify-center"
          onClick={() => !gameStarted && setGameStarted(true)}
        >
          <div className="relative flex items-center justify-center">
              {!gameStarted && (
              <div className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer bg-gradient-to-b from-black/60 via-black/80 to-black">
                  <div className="text-center">
                    <div className="relative">
                      <p className="text-2xl text-yellow-400 mb-2 font-pixel animate-pulse">CLICK TO START</p>
                      <p className="text-sm text-gray-400 font-pixel animate-bounce">INSERT COIN</p>
                      {/* Decorative pixel elements */}
                      <div className="absolute -left-8 top-0 text-yellow-400/30 text-lg">◄</div>
                      <div className="absolute -right-8 top-0 text-yellow-400/30 text-lg">►</div>
                    </div>
                  </div>
              </div>
              )}
              {/* Fixed size game for consistency */}
              <PacmanGame active={gameStarted} fixedSize={true} />
          </div>
        </div>

        {/* Bottom Gradient Overlay - Smooth transition from game to content */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />

        {/* Bottom Info Section (Text + Button) */}
        <div 
            className="absolute bottom-8 left-0 w-full px-8 flex flex-col items-center"
            style={{ maxWidth: '900px' }} 
        >
            {/* Title and Button Row */}
            <div className="flex flex-row items-center justify-between w-full">
                <h1 className={`${h1FontSize} leading-relaxed text-white font-pixel text-left pointer-events-none`} style={{ fontFamily: '"Fusion Pixel 10px Mono ja", monospace' }}>
                    欢迎来到<br/>
                    粟鹏的数字空间
                </h1>
                
                {/* Entry Button - Enhanced with animation */}
                <button
                    onClick={onEnter}
                    className="relative group flex items-center gap-4 px-8 py-4 bg-[#333333] text-white transition-all duration-300 hover:bg-[#444444] overflow-hidden font-pixel text-sm tracking-widest"
                >
                    {/* Animated background fill */}
                    <span className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <span className="relative z-10 group-hover:text-black transition-colors duration-300 flex items-center gap-4">
                        <span>进入</span>
                        <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                </button>
            </div>
            
            {/* Subtitle */}
            <p className="text-xs text-gray-500 font-pixel tracking-wider text-left mt-3 pointer-events-none w-full">Since 2025</p>
        </div>

      </div>
    </div>
  );
};

export default PacmanHome;
