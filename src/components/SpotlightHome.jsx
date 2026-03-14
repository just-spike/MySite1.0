import React, { useEffect, useRef, useState } from 'react';

// Common Chinese characters
const CHARS = "的一是了我不人在他有这个上们来到时大地为子中你说生国年着就那和要她出也得里后自以会家可下而过天去能对小多然于心学之都好看起发当没成只如事把还用第样道想作种开美总从无情己面最女但现前些所同日手又行意动方期它头经长儿回位分爱老因很给名法间斯知世什两次使身者被高已亲其进此话常与活正感";
const CHAR_SIZE = 24; // Slightly larger for Chinese characters

const Pos_X_EnterBtn = 66; // Distance from bottom in pixels

const SpotlightHome = ({ onEnter }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  // Store grid in ref to persist between renders but allow updates on resize
  const gridRef = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    
    // Set initial position to center
    setPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Canvas for the text grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initGrid();
    };

    const initGrid = () => {
      const cols = Math.ceil(canvas.width / CHAR_SIZE);
      const rows = Math.ceil(canvas.height / CHAR_SIZE);
      gridRef.current = [];
      
      const centerX = Math.floor(cols / 2);
      const centerY = Math.floor(rows / 3); // Position planet slightly higher
      const planetRadius = Math.min(cols, rows) / 5; // Radius in grid cells
      
      for (let i = 0; i < cols; i++) {
        gridRef.current[i] = [];
        for (let j = 0; j < rows; j++) {
          // Check distance from planet center to create negative space
          const dx = i - centerX;
          const dy = j - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Planet negative space logic
          // Main sphere + ring or just a sphere
          // Let's do a simple circle negative space first
          if (dist < planetRadius) {
            gridRef.current[i][j] = ''; // Empty space for planet
          } else if (dist > planetRadius && dist < planetRadius + 1) {
             // Optional: Border characters if desired, or just random
             gridRef.current[i][j] = CHARS[Math.floor(Math.random() * CHARS.length)];
          } else {
            // Check for Ring (Saturn-like)
            // Ring equation: x^2/a^2 + y^2/b^2 = 1 (rotated)
            // Simplified ring check
            const ringDist = Math.sqrt((dx * 2) * (dx * 2) + dy * dy);
            const isRing = ringDist > planetRadius * 2.5 && ringDist < planetRadius * 3.5;
            
            // We want negative space for the ring too, but only the parts NOT behind the planet
            // Actually user asked for negative space planet pattern.
            // Let's keep it simple: A circle of emptiness in the sea of text.
            
             gridRef.current[i][j] = CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
      }
      
      // Post-processing for Ring negative space to make it look like a planet
      // Add a ring of empty space
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const dx = i - centerX;
            const dy = j - centerY;
            // Tilted ring logic
            // Rotate coordinates by 30 degrees
            const angle = -Math.PI / 6;
            const rx = dx * Math.cos(angle) - dy * Math.sin(angle);
            const ry = dx * Math.sin(angle) + dy * Math.cos(angle);
            
            // Ellipse equation for ring: (rx/a)^2 + (ry/b)^2 = 1
            // a = planetRadius * 2, b = planetRadius * 0.4
            const a = planetRadius * 2.2;
            const b = planetRadius * 0.5;
            
            const ringEq = (rx * rx) / (a * a) + (ry * ry) / (b * b);
            
            if (ringEq >= 0.8 && ringEq <= 1.2) {
                 // Don't cut through the planet body itself (visual preference), 
                 // or do cut it to show the ring in front?
                 // Let's just make the ring negative space too
                 const dist = Math.sqrt(dx * dx + dy * dy);
                 if (dist > planetRadius) { // Only show ring outside planet
                    gridRef.current[i][j] = '';
                 } else if (ry > 0) { // Show ring in front of planet (bottom half)
                    gridRef.current[i][j] = '';
                 }
            }
        }
      }
    };

    const draw = () => {
      // Clear canvas with black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / CHAR_SIZE);
      const rows = Math.ceil(canvas.height / CHAR_SIZE);

      ctx.font = '14px "Fusion Pixel 12px Proportional SC", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const char = gridRef.current[i]?.[j];
          if (!char) continue; // Skip empty space (planet)

          const x = i * CHAR_SIZE + CHAR_SIZE / 2;
          const y = j * CHAR_SIZE + CHAR_SIZE / 2;
          
          // Calculate distance from mouse
          const dx = x - pos.x;
          const dy = y - pos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Spotlight radius
          const radius = 250;
          
          if (dist < radius) {
            // Calculate brightness based on distance (closer = brighter)
            const intensity = 1 - (dist / radius);
            const r = Math.floor(51 + (255 - 51) * intensity);
            const g = Math.floor(51 + (255 - 51) * intensity);
            const b = Math.floor(51 + (255 - 51) * intensity);
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          } else {
            // Default gray color
            ctx.fillStyle = '#333333';
          }
          
          ctx.fillText(char, x, y);
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resizeCanvas);
    // Initial setup
    resizeCanvas();

    // Start loop
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Remove pos from dependency array so grid doesn't re-init on move

  // Separate effect for drawing to avoid re-calculating grid on every mouse move
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Check if grid is ready
    if (gridRef.current.length === 0) return;

    let animationFrameId;

    const draw = () => {
      // Clear canvas with black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / CHAR_SIZE);
      const rows = Math.ceil(canvas.height / CHAR_SIZE);

      ctx.font = '14px "Fusion Pixel 12px Proportional SC", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const char = gridRef.current[i]?.[j];
          if (!char) continue; // Skip empty space (planet)

          const x = i * CHAR_SIZE + CHAR_SIZE / 2;
          const y = j * CHAR_SIZE + CHAR_SIZE / 2;
          
          // Calculate distance from mouse
          const dx = x - pos.x;
          const dy = y - pos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Spotlight radius
          const radius = 250;
          
          if (dist < radius) {
            // Calculate brightness based on distance (closer = brighter)
            const intensity = 1 - (dist / radius);
            const r = Math.floor(51 + (255 - 51) * intensity);
            const g = Math.floor(51 + (255 - 51) * intensity);
            const b = Math.floor(51 + (255 - 51) * intensity);
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          } else {
            // Default gray color
            ctx.fillStyle = '#333333';
          }
          
          ctx.fillText(char, x, y);
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, [pos]); // Re-draw when mouse moves

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black text-white overflow-hidden cursor-none flex flex-col items-center justify-center font-pixel"
    >
      {/* Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none"
      />

      {/* Bottom Gradient Overlay */}
      <div 
        className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10"
      />

      {/* Enter Button at bottom - Always visible */}
      <button
        onClick={onEnter}
        className="absolute group flex items-center justify-center gap-4 text-white/70 hover:text-black transition-all duration-300 tracking-[0.2em] text-lg cursor-none pointer-events-auto z-20 font-pixel"
        style={{ bottom: Pos_X_EnterBtn }}
      >
        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-60 scale-x-0 group-hover:scale-x-105 transition-all duration-300 origin-center" />
        <span className="relative z-10 px-6 py-2">[ 进入系统 ]</span>
      </button>

      {/* Custom Pixel Arrow Cursor */}
      <div 
        className="fixed pointer-events-none z-[100] mix-blend-difference"
        style={{ 
          left: pos.x, 
          top: pos.y,
          // Adjust so the tip of the arrow is at the cursor position
          transform: 'translate(0, 0)', 
        }}
      >
        {/* Pixel Arrow Shape */}
        <div className="relative">
             {/* 
                Simple Arrow Pixel Art using box-shadow 
                10x10 grid roughly
             */}
             <div className="w-1 h-1 bg-white shadow-[0px_0px_0_white,0px_1px_0_white,0px_2px_0_white,0px_3px_0_white,0px_4px_0_white,0px_5px_0_white,0px_6px_0_white,0px_7px_0_white,0px_8px_0_white,1px_1px_0_white,1px_6px_0_white,1px_7px_0_white,2px_2px_0_white,2px_5px_0_white,2px_6px_0_white,3px_3px_0_white,3px_4px_0_white,3px_5px_0_white,4px_4px_0_white]" />
        </div>
      </div>
      
      {/* Spotlight ring (optional visual guide) */}
      <div 
        className="fixed w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none z-40"
        style={{ 
          left: pos.x, 
          top: pos.y,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)'
        }}
      />
    </div>
  );
};

export default SpotlightHome;
