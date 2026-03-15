import React, { useEffect, useRef, useState } from 'react';

// Configuration
const SPEED_PACMAN = 0.003; // Tiles per ms
const SPEED_GHOST = 0.002;  // Tiles per ms
const WALL_COLOR = '#333333ff';
const DOT_COLOR = '#bebebeff';
const TILE_SIZE = 16;

// Maze map: 1=Wall, 0=Dot, 2=Empty, 3=Power, 4=Pacman, 5=Ghost
// Adjusted to be more game-like with interesting paths
const MAZE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1],
  [1,0,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1],
  [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
  [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,1,0,1],
  [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,0,1,1,0,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1],
  [2,2,2,2,2,1,0,1,1,0,1,2,2,2,1,1,1,5,5,5,1,1,1,2,2,2,1,1,0,1,1,0,1,2,2,2,2,2,2,2,2],
  [1,1,1,1,1,1,0,1,1,0,1,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,1,2,2,2,1,1,1,1,1,1,1,1,1,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
  [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const DIRS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

const GHOST_COLORS = [
    { fill: '#FF0000', glow: 'rgba(255, 0, 0, 0.6)' }, // Blinky
    { fill: '#FFB8FF', glow: 'rgba(255, 184, 255, 0.6)' }, // Pinky
    { fill: '#00FFFF', glow: 'rgba(0, 255, 255, 0.6)' }, // Inky
    { fill: '#FFB852', glow: 'rgba(255, 184, 82, 0.6)' }  // Clyde
];

const PacmanGame = ({ active, fixedSize = false, maxWidth = 0.6, maxHeight = 0.75 }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  
  // Responsive Tile Size
  const [tileSize, setTileSize] = useState(TILE_SIZE);
  const tileSizeRef = useRef(TILE_SIZE);

  // Game state stored in ref to avoid re-renders during game loop
  const gameState = useRef({
    pacman: { x: 20, y: 15, dir: DIRS.LEFT, nextDir: DIRS.LEFT, mouthOpen: 0 },
    ghosts: [],
    dots: [],
    particles: [],
    walls: [],
    lastTime: 0
  });

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
        // Always use fixed tile size as requested
        setTileSize(TILE_SIZE);
        tileSizeRef.current = TILE_SIZE;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [maxWidth, maxHeight, fixedSize]);

  // Input handling
  useEffect(() => {
    // Keyboard support
    const handleKey = (e) => {
      if (!active || gameOver || win) return;
      
      let nextDir = null;
      if (e.key === 'ArrowUp') nextDir = DIRS.UP;
      if (e.key === 'ArrowDown') nextDir = DIRS.DOWN;
      if (e.key === 'ArrowLeft') nextDir = DIRS.LEFT;
      if (e.key === 'ArrowRight') nextDir = DIRS.RIGHT;
      
      if (nextDir) {
        e.preventDefault();
        gameState.current.pacman.nextDir = nextDir;
      }
    };
    
    // Mouse movement support
    const handleMouseMove = (e) => {
        if (!active || gameOver || win || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        
        // Calculate mouse position relative to canvas (visual space)
        // We use clientX/Y which is relative to viewport, subtracting rect.left/top gets us canvas-relative
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Use the current visual tile size for calculation
        // The canvas is scaled by CSS, so we need to account for that if intrinsic size differs from display size
        // But here we set width/height style to match canvas width/height, so 1:1 mapping usually
        // However, let's be safe and use ratio
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const canvasX = mouseX * scaleX;
        const canvasY = mouseY * scaleY;
        
        // Calculate grid position
        const gridX = canvasX / tileSizeRef.current;
        const gridY = canvasY / tileSizeRef.current;
        
        const pacman = gameState.current.pacman;
        const diffX = gridX - pacman.x;
        const diffY = gridY - pacman.y;
        
        // Only change direction if the mouse is far enough
        if (Math.abs(diffX) > 0.5 || Math.abs(diffY) > 0.5) {
            if (Math.abs(diffX) > Math.abs(diffY)) {
                gameState.current.pacman.nextDir = diffX > 0 ? DIRS.RIGHT : DIRS.LEFT;
            } else {
                gameState.current.pacman.nextDir = diffY > 0 ? DIRS.DOWN : DIRS.UP;
            }
        }
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
        window.removeEventListener('keydown', handleKey);
        window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [active, gameOver, win]);

  // Main Game Logic & Loop
  useEffect(() => {
    if (!active) return;

    // Initialize Game
    const dots = [];
    const walls = [];
    let pacmanStart = { x: 1, y: 1 };
    const ghostStarts = [];
    
    MAZE.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === 1) walls.push({ x, y });
            if (cell === 0) dots.push({ x, y, type: 'dot' });
            if (cell === 3) dots.push({ x, y, type: 'power' });
            if (cell === 4) pacmanStart = { x, y };
            if (cell === 5) ghostStarts.push({ x, y });
        });
    });

    // Fallback if no ghosts defined in map
    if (ghostStarts.length === 0) {
        // Try to find a safe spot or use defaults
        ghostStarts.push({ x: 13.5, y: 12 }, { x: 14.5, y: 12 });
    }

    // Reset State
    gameState.current = {
        pacman: { x: pacmanStart.x, y: pacmanStart.y, dir: DIRS.LEFT, nextDir: DIRS.LEFT, mouthOpen: 0 },
        ghosts: ghostStarts.map((pos, idx) => ({
            x: pos.x, 
            y: pos.y, 
            dir: DIRS.UP, 
            color: GHOST_COLORS[idx % GHOST_COLORS.length]
        })),
        dots,
        particles: [],
        walls,
        lastTime: performance.now()
    };
    setScore(0);
    setGameOver(false);
    setWin(false);

    let animationFrameId;

    const loop = (time) => {
        if (gameOver || win) return;

        const dt = Math.min(time - gameState.current.lastTime, 50);
        gameState.current.lastTime = time;

        update(dt);
        draw(); // Uses tileSizeRef.current

        if (!gameOver && !win) {
            animationFrameId = requestAnimationFrame(loop);
        }
    };

    const update = (dt) => {
        const state = gameState.current;
        
        // --- Pacman Movement ---
        moveEntity(state.pacman, SPEED_PACMAN, dt, true);
        state.pacman.mouthOpen = Math.abs(Math.sin(Date.now() / 100));

        // --- Ghost Movement ---
        state.ghosts.forEach(ghost => {
            moveEntity(ghost, SPEED_GHOST, dt, false);
        });

        // --- Collision: Dots ---
        const px = state.pacman.x;
        const py = state.pacman.y;
        
        for (let i = state.dots.length - 1; i >= 0; i--) {
            const dot = state.dots[i];
            const dist = Math.sqrt(Math.pow(px - dot.x, 2) + Math.pow(py - dot.y, 2));
            
            if (dist < 0.4) {
                state.dots.splice(i, 1);
                setScore(s => s + (dot.type === 'power' ? 50 : 10));
                // Spawn particles
                for(let j=0; j<5; j++) {
                    state.particles.push({
                        x: dot.x, y: dot.y,
                        vx: (Math.random() - 0.5) * 0.01,
                        vy: (Math.random() - 0.5) * 0.01,
                        life: 1.0,
                        color: dot.type === 'power' ? '#ffb8ae' : '#ffb8ae'
                    });
                }
            }
        }
        if (state.dots.length === 0) setWin(true);

        // --- Collision: Ghosts ---
        state.ghosts.forEach(g => {
             const dist = Math.sqrt(Math.pow(px - g.x, 2) + Math.pow(py - g.y, 2));
             if (dist < 0.6) {
                 setGameOver(true);
             }
        });

        // --- Particles ---
        for (let i = state.particles.length - 1; i >= 0; i--) {
            const p = state.particles[i];
            p.life -= dt * 0.002;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            if (p.life <= 0) state.particles.splice(i, 1);
        }
    };

    const moveEntity = (entity, speed, dt, isPlayer) => {
        const moveDist = speed * dt;
        
        if (isPlayer && entity.nextDir !== entity.dir) {
            const centeredX = Math.round(entity.x);
            const centeredY = Math.round(entity.y);
            const distToCenter = Math.sqrt(Math.pow(entity.x - centeredX, 2) + Math.pow(entity.y - centeredY, 2));
            
            if (distToCenter < 0.1) {
                if (!isWall(centeredX + entity.nextDir.x, centeredY + entity.nextDir.y)) {
                    entity.x = centeredX;
                    entity.y = centeredY;
                    entity.dir = entity.nextDir;
                }
            }
        }

        const nextX = entity.x + entity.dir.x * moveDist;
        const nextY = entity.y + entity.dir.y * moveDist;
        
        const checkX = Math.floor(nextX + entity.dir.x * 0.4 + 0.5);
        const checkY = Math.floor(nextY + entity.dir.y * 0.4 + 0.5);

        if (isWall(checkX, checkY)) {
            entity.x = Math.round(entity.x);
            entity.y = Math.round(entity.y);
            
            if (!isPlayer) {
                const dirs = [DIRS.UP, DIRS.DOWN, DIRS.LEFT, DIRS.RIGHT];
                const validDirs = dirs.filter(d => !isWall(Math.round(entity.x) + d.x, Math.round(entity.y) + d.y));
                if (validDirs.length > 0) {
                    entity.dir = validDirs[Math.floor(Math.random() * validDirs.length)];
                } else {
                    entity.dir = { x: -entity.dir.x, y: -entity.dir.y };
                }
            }
        } else {
            entity.x = nextX;
            entity.y = nextY;
            
            if (!isPlayer) {
                const centeredX = Math.round(entity.x);
                const centeredY = Math.round(entity.y);
                const distToCenter = Math.sqrt(Math.pow(entity.x - centeredX, 2) + Math.pow(entity.y - centeredY, 2));
                
                if (distToCenter < 0.1 && Math.random() < 0.05) {
                     const dirs = [DIRS.UP, DIRS.DOWN, DIRS.LEFT, DIRS.RIGHT];
                     const validDirs = dirs.filter(d => !isWall(centeredX + d.x, centeredY + d.y) && (d.x !== -entity.dir.x || d.y !== -entity.dir.y));
                     if (validDirs.length > 0) {
                         entity.dir = validDirs[Math.floor(Math.random() * validDirs.length)];
                     }
                }
            }
        }
        
        if (entity.x < 0) entity.x = MAZE[0].length - 1;
        if (entity.x >= MAZE[0].length) entity.x = 0;
    };

    const isWall = (x, y) => {
        if (y < 0 || y >= MAZE.length || x < 0 || x >= MAZE[0].length) return true;
        return MAZE[y][x] === 1;
    };

    gameState.current.lastTime = performance.now();
    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [active, gameOver, win]);

  // Draw Function (Accessible to both effects)
  const draw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    
    const state = gameState.current;
    const ts = tileSizeRef.current; // Use current tile size

    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw Walls
    ctx.fillStyle = WALL_COLOR;
    ctx.beginPath();
    const wallSize = ts * 0.3; // 20% of tile size - much thinner
    const offset = (ts - wallSize) / 2;

    state.walls.forEach(w => {
        const x = w.x;
        const y = w.y;

        // Draw smaller wall block (centered)
        ctx.fillRect(w.x * ts + offset, w.y * ts + offset, wallSize, wallSize);
        
        // Connect walls to neighbors for cleaner look
        // Check neighbors in maze
        
        // Right neighbor
        if (x < MAZE[0].length - 1 && MAZE[y][x+1] === 1) {
             ctx.fillRect(w.x * ts + offset + wallSize, w.y * ts + offset, offset + 1, wallSize);
        }
        // Left neighbor
        if (x > 0 && MAZE[y][x-1] === 1) {
             ctx.fillRect(w.x * ts - 1, w.y * ts + offset, offset + 1, wallSize);
        }
        // Bottom neighbor
        if (y < MAZE.length - 1 && MAZE[y+1][x] === 1) {
             ctx.fillRect(w.x * ts + offset, w.y * ts + offset + wallSize, wallSize, offset + 1);
        }
        // Top neighbor
        if (y > 0 && MAZE[y-1][x] === 1) {
             ctx.fillRect(w.x * ts + offset, w.y * ts - 1, wallSize, offset + 1);
        }
    });
    
    // Outer boundary removed as requested
    // ctx.strokeStyle = WALL_COLOR;
    // ctx.lineWidth = 4;
    // ctx.strokeRect(2, 2, MAZE[0].length * ts - 4, MAZE.length * ts - 4);
    
    ctx.shadowBlur = 0;

    // Draw Dots
    ctx.fillStyle = DOT_COLOR;
    state.dots.forEach(d => {
        ctx.beginPath();
        const radius = d.type === 'power' ? ts * 0.25 : ts * 0.1;
        if (d.type === 'power') {
            ctx.shadowBlur = 5;
            ctx.shadowColor = DOT_COLOR;
        }
        ctx.arc(d.x * ts + ts/2, d.y * ts + ts/2, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    // Draw Particles
    state.particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x * ts + ts/2, p.y * ts + ts/2, ts * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    });

    // Draw Ghosts
    state.ghosts.forEach(g => {
        const x = g.x * ts + ts/2;
        const y = g.y * ts + ts/2;
        const r = ts * 0.35;
        
        ctx.fillStyle = g.color.fill;
        ctx.shadowBlur = 10;
        ctx.shadowColor = g.color.glow;
        
        ctx.beginPath();
        ctx.arc(x, y - 2, r, Math.PI, 0);
        ctx.lineTo(x + r, y + r);
        ctx.lineTo(x - r, y + r);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x - r*0.4, y - r*0.2, r*0.35, 0, Math.PI * 2);
        ctx.arc(x + r*0.4, y - r*0.2, r*0.35, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        const dx = g.dir.x * r * 0.2;
        const dy = g.dir.y * r * 0.2;
        ctx.arc(x - r*0.4 + dx, y - r*0.2 + dy, r*0.15, 0, Math.PI * 2);
        ctx.arc(x + r*0.4 + dx, y - r*0.2 + dy, r*0.15, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw Pacman
    const px = state.pacman.x * ts + ts/2;
    const py = state.pacman.y * ts + ts/2;
    const pr = ts * 0.4;
    
    ctx.fillStyle = '#FFFF00';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(255, 255, 0, 0.5)';
    
    ctx.beginPath();
    let rotation = 0;
    if (state.pacman.dir === DIRS.UP) rotation = -Math.PI/2;
    if (state.pacman.dir === DIRS.DOWN) rotation = Math.PI/2;
    if (state.pacman.dir === DIRS.LEFT) rotation = Math.PI;
    
    const mouthSize = 0.2 + state.pacman.mouthOpen * 0.2;
    
    ctx.arc(px, py, pr, rotation + mouthSize * Math.PI, rotation + (2 - mouthSize) * Math.PI);
    ctx.lineTo(px, py);
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  // Render initial static frame if not active
  useEffect(() => {
    if (!active) {
        // Init walls/dots for drawing even if game logic isn't running
        const walls = [];
        const dots = [];
        let pacmanStart = { x: 1, y: 1 };
        const ghostStarts = [];
        
        MAZE.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 1) walls.push({ x, y });
                if (cell === 0) dots.push({ x, y, type: 'dot' });
                if (cell === 4) pacmanStart = { x, y };
                if (cell === 5) ghostStarts.push({ x, y });
            });
        });

        if (ghostStarts.length === 0) {
            ghostStarts.push({ x: 13.5, y: 12 }, { x: 14.5, y: 12 });
        }

        // Temp state for render
        gameState.current.walls = walls;
        gameState.current.dots = dots;
        gameState.current.pacman = { x: pacmanStart.x, y: pacmanStart.y, dir: DIRS.LEFT, nextDir: DIRS.LEFT, mouthOpen: 0 };
        gameState.current.ghosts = ghostStarts.map((pos, idx) => ({
             x: pos.x, 
             y: pos.y, 
             dir: DIRS.UP, 
             color: GHOST_COLORS[idx % GHOST_COLORS.length]
        }));
        draw();
    }
  }, [active, tileSize]);

  return (
    <div className="relative mx-auto font-pixel" style={{ width: MAZE[0].length * tileSize, height: MAZE.length * tileSize }}>
      <canvas
        ref={canvasRef}
        width={MAZE[0].length * tileSize}
        height={MAZE.length * tileSize}
        className="block bg-black"
      />
      
      {/* UI Overlay */}
      {/* Score removed as requested */}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 backdrop-blur-sm">
            <h2 className="text-red-500 font-bold mb-4 tracking-widest animate-pulse" style={{ fontSize: Math.max(24, tileSize * 2) + 'px' }}>GAME OVER</h2>
            <p className="text-gray-400 tracking-wider" style={{ fontSize: Math.max(12, tileSize * 0.6) + 'px' }}>REFRESH TO TRY AGAIN</p>
        </div>
      )}

      {/* Win Screen */}
      {win && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 backdrop-blur-sm">
            <h2 className="text-green-500 font-bold mb-4 tracking-widest animate-bounce" style={{ fontSize: Math.max(24, tileSize * 2) + 'px' }}>YOU WIN!</h2>
            <p className="text-white mb-2" style={{ fontSize: Math.max(16, tileSize) + 'px' }}>SCORE: {score}</p>
        </div>
      )}
    </div>
  );
};

export default PacmanGame;
