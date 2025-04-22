// src/App.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateMaze } from './mazeGenerator';
import MazeGrid from './MazeGrid';
import './App.css';

const getStartPos = () => ({ x: 0, y: 0 });
const getEndPos = (width, height) => ({ x: width - 1, y: height - 1 });

function App() {
  // --- State ---
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(15);
  const [grid, setGrid] = useState(null);
  const [generating, setGenerating] = useState(true);
  const [startPos, setStartPos] = useState(getStartPos());
  const [endPos, setEndPos] = useState(getEndPos(width, height));
  const [playerPosition, setPlayerPosition] = useState(startPos);
  const [gameStatus, setGameStatus] = useState('generating');
  const [elapsedTime, setElapsedTime] = useState(0);

  // --- Refs ---
  const intervalRef = useRef(null);
  const mazeContainerRef = useRef(null);
  const playerPositionRef = useRef(playerPosition);
  const gameStatusRef = useRef(gameStatus);
  const gridRef = useRef(grid);
  const endPosRef = useRef(endPos);

  // --- Effect to keep state refs updated ---
  useEffect(() => {
    playerPositionRef.current = playerPosition;
    gameStatusRef.current = gameStatus;
    gridRef.current = grid;
    endPosRef.current = endPos;
  }, [playerPosition, gameStatus, grid, endPos]);

  // --- Timer Control Functions ---
  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

   const startTimer = useCallback(() => {
     stopTimer();
     setElapsedTime(0);
     intervalRef.current = setInterval(() => {
       setElapsedTime(prevTime => prevTime + 1);
     }, 1000);
   }, [stopTimer]);

  // --- Maze Generation ---
  const handleGenerateMaze = useCallback(() => {
    stopTimer();
    setElapsedTime(0);
    setGenerating(true);
    setGameStatus('generating');
    setGrid(null);

    setTimeout(() => {
      try {
        const numericWidth = parseInt(width, 10);
        const numericHeight = parseInt(height, 10);
        if (isNaN(numericWidth) || isNaN(numericHeight) || numericWidth <= 0 || numericHeight <= 0) {
            throw new Error(`Invalid dimensions: ${width}x${height}`);
        }
        const newGrid = generateMaze(numericWidth, numericHeight);
        if (!newGrid || newGrid.length === 0 || !newGrid[0] || newGrid[0].length === 0) {
            throw new Error("Maze generation failed.");
        }
        const newStartPos = getStartPos();
        const newEndPos = getEndPos(numericWidth, numericHeight);

        setGrid(newGrid);
        setStartPos(newStartPos);
        setEndPos(newEndPos);
        setPlayerPosition(newStartPos);
        setGameStatus('ready');
        mazeContainerRef.current?.focus();

      } catch (error) {
        console.error("Error during maze generation:", error);
        setGrid(null);
        setGameStatus('error');
        alert(`Failed to generate maze: ${error.message}. Check console.`);
      } finally {
        setGenerating(false);
      }
    }, 50);
  }, [width, height, stopTimer]);

  // --- Effect for Initial Generation & Dimension Changes ---
  useEffect(() => {
    handleGenerateMaze();
  }, [handleGenerateMaze, width, height]);

  // --- Effect for Player Movement & Game Logic ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      const currentStatus = gameStatusRef.current;
      const currentGrid = gridRef.current;
      const currentPlayerPos = playerPositionRef.current;
      const currentEndPos = endPosRef.current;

      if (!currentGrid || currentGrid.length === 0 || !currentGrid[0] || currentGrid[0].length === 0 || currentStatus === 'won' || currentStatus === 'generating' || currentStatus === 'error') {
        return;
      }

      if (currentStatus === 'ready') {
          setGameStatus('playing');
          startTimer();
      }

      const { x, y } = currentPlayerPos;
      if (y < 0 || y >= currentGrid.length || x < 0 || x >= currentGrid[0].length || !currentGrid[y]?.[x]) { return; }

      const currentCell = currentGrid[y][x];
      let newPos = { ...currentPlayerPos };
      let moved = false;

      switch (event.key) {
        case 'ArrowUp': case 'w': if (!currentCell.top && y > 0) { newPos.y -= 1; moved = true; } break;
        case 'ArrowDown': case 's': if (!currentCell.bottom && y < currentGrid.length - 1) { newPos.y += 1; moved = true; } break;
        case 'ArrowLeft': case 'a': if (!currentCell.left && x > 0) { newPos.x -= 1; moved = true; } break;
        case 'ArrowRight': case 'd': if (!currentCell.right && x < currentGrid[0].length - 1) { newPos.x += 1; moved = true; } break;
        default: return;
      }

       if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); }

      if (moved) {
        setPlayerPosition(newPos);

        if (newPos.x === currentEndPos.x && newPos.y === currentEndPos.y) {
          setGameStatus('won');
          stopTimer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopTimer();
    };
  }, [startTimer, stopTimer]);


  // --- Input Handlers ---
  const handleWidthChange = (event) => {
    const newWidth = event.target.value;
    if (newWidth === "" || (/^\d+$/.test(newWidth) && parseInt(newWidth, 10) <= 100)) {
         setWidth(newWidth);
    }
  };
  const handleHeightChange = (event) => {
     const newHeight = event.target.value;
     if (newHeight === "" || (/^\d+$/.test(newHeight) && parseInt(newHeight, 10) <= 100)) {
         setHeight(newHeight);
     }
  };
  const isValidDimension = (dim) => {
      const num = parseInt(dim, 10);
      return !isNaN(num) && num >= 2 && num <= 100;
  };

  // --- Render ---
  return (
    <div className="main-container">
        {/* *** UPDATED H1 *** */}
        <h1>React Maze Runner Game</h1>

        {/* Controls */}
        <div className="controls">
            <label>Width: <input type="number" value={width} onChange={handleWidthChange} min="2" max="100" disabled={generating}/> </label>
            <label>Height: <input type="number" value={height} onChange={handleHeightChange} min="2" max="100" disabled={generating} /></label>
            <button onClick={handleGenerateMaze} disabled={generating || !isValidDimension(width) || !isValidDimension(height)}>
            {generating ? 'Generating...' : 'Generate New Maze'}
            </button>
        </div>

        {/* Game Info */}
        <div className="game-info">
            { (gameStatus === 'playing' || gameStatus === 'won') && ( <p className="timer">Time: {elapsedTime}s</p> )}
            {gameStatus === 'won' && <h2 className="win-message">You Escaped! 🎉</h2>}
        </div>

        {/* Maze Area container */}
        <div className="maze-area">
            <div ref={mazeContainerRef} tabIndex={-1} style={{ outline: 'none' }}>
                {grid && grid.length > 0 && grid[0]?.length > 0 && gameStatus !== 'error' ? (
                    <MazeGrid grid={grid} playerPosition={playerPosition} startPos={startPos} endPos={endPos} />
                ) : (
                    <p className="status-message">
                    {generating ? 'Generating maze...' :
                    gameStatus === 'error' ? 'Error loading maze...' :
                    'Loading maze...'}
                    </p>
                )}
            </div>

            {/* Instructions */}
            {(gameStatus === 'ready' || gameStatus === 'playing') && <p className="instructions">Use Arrow Keys (or WASD) to move.</p>}
        </div>
    </div> // End main-container
  );
}

export default App;