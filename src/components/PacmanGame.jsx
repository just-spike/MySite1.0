import React, { useEffect, useRef, useState } from 'react';

// --- 游戏尺寸与配置变量（你主要调整这里）---
const TILE_SIZE = 26;        // 单格像素大小（固定，不随画布尺寸变化）
const CANVAS_WIDTH = 800;   // 画布宽度（像素，可独立修改）
const CANVAS_HEIGHT = 240;   // 画布高度（像素，可独立修改）
const MAZE_COLS = Math.max(7, Math.floor(CANVAS_WIDTH / TILE_SIZE));   // 迷宫列数（按画布宽度自动计算）
const MAZE_ROWS = Math.max(7, Math.floor(CANVAS_HEIGHT / TILE_SIZE));  // 迷宫行数（按画布高度自动计算）
const CANVAS_WIDTH_USED = MAZE_COLS * TILE_SIZE;   // 实际画布宽度（对齐到格子倍数，确保地图填满）
const CANVAS_HEIGHT_USED = MAZE_ROWS * TILE_SIZE;  // 实际画布高度（对齐到格子倍数，确保地图填满）
const GAME_OPACITY = 0.4;   // 吃豆人游戏整体透明度（0~1）
const SCORE_OPACITY = 0.75; // 分数透明度（0~1）
const SCORE_TOP_PX = 20;     // 分数相对画布的垂直偏移（像素，可为负）

const SPEED_PACMAN = 0.002; // 吃豆人移动速度（每毫秒移动的格子数）
const SPEED_GHOST = 0.001;  // 幽灵移动速度（每毫秒移动的格子数）
const WALL_COLOR = '#373737ff'; // 墙壁颜色
const DOT_COLOR = '#bebebeff';  // 普通豆颜色
const POWER_DOT_COLOR = '#ffb86b'; // 能量豆颜色
const WALL_STROKE_RATIO = 0.2; // 墙线粗细占单格比例（0~1）
const RANDOM_WALL_DENSITY = 0.06; // 随机区域生成墙的概率（越大越“密”）
const MIN_SPAWN_DISTANCE_PX = 100; // 生成起点的最小距离（像素）
const GHOST_COUNT = 2;            // 幽灵数量
const CENTER_EMPTY_WIDTH = 0;   // 中间“封闭留空区”的宽度（格子数，包含外圈墙）
const CENTER_EMPTY_HEIGHT = 0;   // 中间“封闭留空区”的高度（格子数，包含外圈墙）

// 迷宫模板（可选）：你可以在不改 MAZE_COLS/ROWS 的情况下微调迷宫结构
// 值含义：1=墙，0=豆，2=空地，3=能量豆，4=吃豆人起点，5=幽灵
const MAZE_TEMPLATE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
  [1,0,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
  [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
  [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
  [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,0,1,1,0,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,1,1,1,1,1,1,1,1,1],
  [2,2,2,2,2,1,0,1,1,0,1,2,2,2,1,1,1,5,5,5,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,1,2,2,2,2,2,2,2,2],
  [1,1,1,1,1,1,0,1,1,0,1,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,1,2,2,2,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const buildMaze = (rows, cols) => {
  const maze = Array.from({ length: rows }, () => Array(cols).fill(1));
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  };

  const carveMazeByDFS = () => {
    const ox = cols % 2 === 0 ? 2 : 1;
    const oy = rows % 2 === 0 ? 2 : 1;
    const start = { x: Math.min(cols - 2, ox), y: Math.min(rows - 2, oy) };
    maze[start.y][start.x] = 0;
    const stack = [start];

    while (stack.length > 0) {
      const cur = stack[stack.length - 1];
      const dirs = shuffle([
        { x: 2, y: 0 },
        { x: -2, y: 0 },
        { x: 0, y: 2 },
        { x: 0, y: -2 }
      ]);

      let moved = false;
      for (const d of dirs) {
        const nx = cur.x + d.x;
        const ny = cur.y + d.y;
        if (nx <= 0 || nx >= cols - 1 || ny <= 0 || ny >= rows - 1) continue;
        if (maze[ny][nx] !== 1) continue;
        maze[cur.y + d.y / 2][cur.x + d.x / 2] = 0;
        maze[ny][nx] = 0;
        stack.push({ x: nx, y: ny });
        moved = true;
        break;
      }
      if (!moved) stack.pop();
    }

    for (let y = 1; y < rows - 1; y++) {
      for (let x = 1; x < cols - 1; x++) {
        if (maze[y][x] === 1 && Math.random() < RANDOM_WALL_DENSITY) {
          maze[y][x] = 0;
        }
      }
    }
  };

  carveMazeByDFS();

  const cx = Math.floor(cols / 2);
  const cy = Math.floor(rows / 2);
  const roomW = Math.max(0, Math.min(CENTER_EMPTY_WIDTH, cols - 2));
  const roomH = Math.max(0, Math.min(CENTER_EMPTY_HEIGHT, rows - 2));
  const roomX0 = Math.min(Math.max(1, cx - Math.floor(roomW / 2)), cols - 2);
  const roomY0 = Math.min(Math.max(1, cy - Math.floor(roomH / 2)), rows - 2);
  const roomX1 = Math.min(cols - 2, roomX0 + roomW - 1);
  const roomY1 = Math.min(rows - 2, roomY0 + roomH - 1);

  if (roomW >= 3 && roomH >= 3) {
    for (let y = roomY0; y <= roomY1; y++) {
      for (let x = roomX0; x <= roomX1; x++) {
        maze[y][x] = (y === roomY0 || y === roomY1 || x === roomX0 || x === roomX1) ? 1 : 2;
      }
    }
  }

  const roomInnerX0 = roomX0 + 1;
  const roomInnerY0 = roomY0 + 1;
  const roomInnerX1 = roomX1 - 1;
  const roomInnerY1 = roomY1 - 1;
  const isInRoomInner = (x, y) => roomW >= 3 && roomH >= 3 && x >= roomInnerX0 && x <= roomInnerX1 && y >= roomInnerY0 && y <= roomInnerY1;
  const isPassable = (x, y) => maze[y][x] !== 1 && !isInRoomInner(x, y);

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const queue = [];
  let seed = null;
  for (let y = 1; y < rows - 1 && !seed; y++) {
    for (let x = 1; x < cols - 1; x++) {
      if (isPassable(x, y)) {
        seed = { x, y };
        break;
      }
    }
  }
  if (seed) {
    queue.push(seed);
    visited[seed.y][seed.x] = true;
    for (let i = 0; i < queue.length; i++) {
      const cur = queue[i];
      const nbs = [
        { x: cur.x + 1, y: cur.y },
        { x: cur.x - 1, y: cur.y },
        { x: cur.x, y: cur.y + 1 },
        { x: cur.x, y: cur.y - 1 }
      ];
      for (const nb of nbs) {
        if (nb.x <= 0 || nb.x >= cols - 1 || nb.y <= 0 || nb.y >= rows - 1) continue;
        if (visited[nb.y][nb.x] || !isPassable(nb.x, nb.y)) continue;
        visited[nb.y][nb.x] = true;
        queue.push(nb);
      }
    }
  }

  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      if (isInRoomInner(x, y)) continue;
      if (maze[y][x] !== 1 && !visited[y][x]) maze[y][x] = 1;
    }
  }

  const minDistTiles = MIN_SPAWN_DISTANCE_PX / TILE_SIZE;
  const candidates = [];
  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      if (visited[y][x] && isPassable(x, y)) candidates.push({ x, y });
    }
  }
  shuffle(candidates);

  const distOk = (a, b) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy) >= minDistTiles;
  };

  let pacmanPos = candidates[0] ?? { x: Math.max(1, Math.floor(cols / 2)), y: Math.max(1, Math.floor(rows / 2)) };
  let ghostPositions = [];
  for (const c of candidates) {
    if (c.x === pacmanPos.x && c.y === pacmanPos.y) continue;
    if (!distOk(c, pacmanPos)) continue;
    let ok = true;
    for (const g of ghostPositions) {
      if (!distOk(c, g)) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    ghostPositions.push(c);
    if (ghostPositions.length >= GHOST_COUNT) break;
  }

  maze[pacmanPos.y][pacmanPos.x] = 4;
  for (const g of ghostPositions) {
    maze[g.y][g.x] = 5;
  }

  const powerCandidates = [];
  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      if (maze[y][x] !== 0) continue;
      if (x === pacmanPos.x && y === pacmanPos.y) continue;
      if (ghostPositions.some((g) => g.x === x && g.y === y)) continue;
      powerCandidates.push({ x, y });
    }
  }
  shuffle(powerCandidates);
  const powerDotCount = Math.min(powerCandidates.length, 1 + Math.floor(Math.random() * 3));
  for (let i = 0; i < powerDotCount; i++) {
    const p = powerCandidates[i];
    maze[p.y][p.x] = 3;
  }

  return maze;
};

// MAZE 会根据 MAZE_ROWS / MAZE_COLS 自动生成，并且居中扩展（两侧同时增加），四周自动封闭墙体
const MAZE = buildMaze(MAZE_ROWS, MAZE_COLS);

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

const makeArrowCursor = (path) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'><path d='${path}' fill='none' stroke='black' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' opacity='0.35'/><path d='${path}' fill='none' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/></svg>`)}") 14 14, auto`;
const CURSOR_ARROW_RIGHT = makeArrowCursor('M5 14H21 M15 8L21 14L15 20');
const CURSOR_ARROW_LEFT = makeArrowCursor('M23 14H7 M13 8L7 14L13 20');
const CURSOR_ARROW_UP = makeArrowCursor('M14 23V7 M8 13L14 7L20 13');
const CURSOR_ARROW_DOWN = makeArrowCursor('M14 5V21 M8 15L14 21L20 15');

const PacmanGame = ({ active, fixedSize = false, maxWidth = 0.6, maxHeight = 0.75, onHoverChange }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  
  const tileSize = TILE_SIZE;
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

  // Input handling
  useEffect(() => {
    const resolveDirFromDiff = (diffX, diffY) => {
      if (Math.abs(diffX) <= 0.5 && Math.abs(diffY) <= 0.5) return null;
      if (Math.abs(diffX) > Math.abs(diffY)) return diffX > 0 ? DIRS.RIGHT : DIRS.LEFT;
      return diffY > 0 ? DIRS.DOWN : DIRS.UP;
    };

    const resolveCursorByDir = (dir) => {
      if (dir === DIRS.LEFT) return CURSOR_ARROW_LEFT;
      if (dir === DIRS.RIGHT) return CURSOR_ARROW_RIGHT;
      if (dir === DIRS.UP) return CURSOR_ARROW_UP;
      if (dir === DIRS.DOWN) return CURSOR_ARROW_DOWN;
      return 'default';
    };

    const setCanvasCursor = (cursor) => {
      if (!canvasRef.current) return;
      canvasRef.current.style.cursor = cursor;
    };

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
        if (!active || gameOver || win || !canvasRef.current) {
            setCanvasCursor('default');
            return;
        }
        
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
        const ts = tileSizeRef.current;
        const offsetX = (CANVAS_WIDTH_USED - MAZE_COLS * ts) / 2;
        const offsetY = (CANVAS_HEIGHT_USED - MAZE_ROWS * ts) / 2;
        const gridX = (canvasX - offsetX) / ts;
        const gridY = (canvasY - offsetY) / ts;
        if (gridX < 0 || gridX >= MAZE_COLS || gridY < 0 || gridY >= MAZE_ROWS) {
            setCanvasCursor('default');
            return;
        }
        
        const pacman = gameState.current.pacman;
        const diffX = gridX - pacman.x;
        const diffY = gridY - pacman.y;
        const nextDir = resolveDirFromDiff(diffX, diffY);
        if (nextDir) gameState.current.pacman.nextDir = nextDir;
        setCanvasCursor(resolveCursorByDir(nextDir ?? pacman.nextDir ?? pacman.dir));
    };

    const handleCanvasEnter = () => {
      if (typeof onHoverChange === 'function') onHoverChange(true);
    };
    const handleCanvasLeave = () => {
      setCanvasCursor('default');
      if (typeof onHoverChange === 'function') onHoverChange(false);
    };

    window.addEventListener('keydown', handleKey);
    canvasRef.current?.addEventListener('mousemove', handleMouseMove);
    canvasRef.current?.addEventListener('mouseenter', handleCanvasEnter);
    canvasRef.current?.addEventListener('mouseleave', handleCanvasLeave);
    
    return () => {
        window.removeEventListener('keydown', handleKey);
        canvasRef.current?.removeEventListener('mousemove', handleMouseMove);
        canvasRef.current?.removeEventListener('mouseenter', handleCanvasEnter);
        canvasRef.current?.removeEventListener('mouseleave', handleCanvasLeave);
        setCanvasCursor('default');
    };
  }, [active, gameOver, win, MAZE, MAZE_ROWS, MAZE_COLS, CANVAS_WIDTH_USED, CANVAS_HEIGHT_USED, onHoverChange]);

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
        const prevX = state.pacman.x;
        const prevY = state.pacman.y;
        moveEntity(state.pacman, SPEED_PACMAN, dt, true);
        const moved = Math.abs(state.pacman.x - prevX) + Math.abs(state.pacman.y - prevY);
        state.pacman.mouthOpen = moved > 0.0001 ? Math.abs(Math.sin(Date.now() / 100)) : 0;

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
                setScore(s => s + (dot.type === 'power' ? 10 : 1));
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
        if (isPlayer) return;
            
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
        
        if (entity.x < 0) entity.x = MAZE_COLS - 1;
        if (entity.x >= MAZE_COLS) entity.x = 0;
    };

    const isWall = (x, y) => {
        if (y < 0 || y >= MAZE_ROWS || x < 0 || x >= MAZE_COLS) return true;
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
    const offsetX = (CANVAS_WIDTH_USED - MAZE_COLS * ts) / 2;
    const offsetY = (CANVAS_HEIGHT_USED - MAZE_ROWS * ts) / 2;

    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.strokeStyle = WALL_COLOR;
    const wallStroke = Math.max(1, ts * WALL_STROKE_RATIO);
    ctx.lineWidth = wallStroke;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let y = 0; y < MAZE_ROWS; y++) {
      for (let x = 0; x < MAZE_COLS; x++) {
        if (MAZE[y][x] !== 1) continue;
        const x0 = x * ts + offsetX;
        const y0 = y * ts + offsetY;
        const x1 = (x + 1) * ts + offsetX;
        const y1 = (y + 1) * ts + offsetY;

        if (y > 0 && MAZE[y - 1][x] !== 1) {
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y0);
        }
        if (y < MAZE_ROWS - 1 && MAZE[y + 1][x] !== 1) {
          ctx.moveTo(x0, y1);
          ctx.lineTo(x1, y1);
        }
        if (x > 0 && MAZE[y][x - 1] !== 1) {
          ctx.moveTo(x0, y0);
          ctx.lineTo(x0, y1);
        }
        if (x < MAZE_COLS - 1 && MAZE[y][x + 1] !== 1) {
          ctx.moveTo(x1, y0);
          ctx.lineTo(x1, y1);
        }
      }
    }
    ctx.stroke();
    
    ctx.shadowBlur = 0;

    // Draw Dots
    state.dots.forEach(d => {
        ctx.beginPath();
        const radius = d.type === 'power' ? ts * 0.25 : ts * 0.1;
        if (d.type === 'power') {
            ctx.fillStyle = POWER_DOT_COLOR;
            ctx.shadowBlur = 5;
            ctx.shadowColor = POWER_DOT_COLOR;
        } else {
            ctx.fillStyle = DOT_COLOR;
        }
        ctx.arc(d.x * ts + offsetX + ts/2, d.y * ts + offsetY + ts/2, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    // Draw Particles
    state.particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x * ts + offsetX + ts/2, p.y * ts + offsetY + ts/2, ts * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    });

    // Draw Ghosts
    state.ghosts.forEach(g => {
        const x = g.x * ts + offsetX + ts/2;
        const y = g.y * ts + offsetY + ts/2;
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
    const px = state.pacman.x * ts + offsetX + ts/2;
    const py = state.pacman.y * ts + offsetY + ts/2;
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
                if (cell === 3) dots.push({ x, y, type: 'power' });
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
  }, [active, tileSize, MAZE, MAZE_ROWS, MAZE_COLS, CANVAS_WIDTH_USED, CANVAS_HEIGHT_USED]);

  return (
    <div className="mx-auto flex flex-col items-center font-pixel" style={{ opacity: GAME_OPACITY }}>
      <div
        className="z-10 text-white font-pixel tracking-widest pointer-events-none select-none"
        style={{ opacity: SCORE_OPACITY, fontSize: Math.max(16, tileSize * 0.8) + 'px', transform: `translateY(${SCORE_TOP_PX}px)` }}
      >
        {String(score).padStart(3, '0')}
      </div>

      <div className="relative" style={{ width: CANVAS_WIDTH_USED, height: CANVAS_HEIGHT_USED }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH_USED}
          height={CANVAS_HEIGHT_USED}
          className="block bg-black"
        />

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
              <p className="text-white mb-2" style={{ fontSize: Math.max(16, tileSize) + 'px' }}>{String(score).padStart(3, '0')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PacmanGame;
