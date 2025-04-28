// src/App.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useMaze } from './hooks/useMaze'; // Import custom hooks
import { useGameTimer } from './hooks/useGameTimer';
import { useMazeRunnerControls } from './hooks/useMazeRunnerControls';
import MazeGrid from './MazeGrid';
import './App.css';

// Validation function
const isValidDimension = (dim) => {
    const num = parseInt(dim, 10);
    return !isNaN(num) && num >= 2 && num <= 100;
};

function App() {
  // --- State Management via Hooks ---
  const {
    grid,
    startPos,
    endPos,
    width,
    height,
    setWidth,
    setHeight,
    isGenerating,
    generateNewMaze,
  } = useMaze(20, 15); // Default dimensions

  const { elapsedTime, startTimer, stopTimer, resetTimer } = useGameTimer();

  const [gameStatus, setGameStatus] = useState('generating'); // 'generating', 'ready', 'playing', 'won', 'error'
  const mazeContainerRef = useRef(null); // Ref for touch events

  // --- Game State Callbacks ---
  const handleGameStart = useCallback(() => {
      // Only change to playing if currently ready
      setGameStatus(prevStatus => (prevStatus === 'ready' ? 'playing' : prevStatus));
  }, []);

  const handleGameWin = useCallback(() => {
      setGameStatus('won');
      stopTimer();
  }, [stopTimer]);

  // --- Setup Controls Hook ---
  const { playerPosition } = useMazeRunnerControls(
      startPos,
      grid,
      endPos,
      gameStatus,
      handleGameStart, // Pass callbacks
      handleGameWin,
      mazeContainerRef
  );

  // --- Effect to Generate Maze on Load & Dimension Change ---
  useEffect(() => {
    setGameStatus('generating');
    resetTimer();
    generateNewMaze(width, height)
      .then(() => {
        setGameStatus('ready');
        // Focus logic removed, less critical now
        // mazeContainerRef.current?.focus();
      })
      .catch(error => {
        console.error("App: Maze generation failed", error);
        setGameStatus('error');
        alert(`Failed to generate maze: ${error.message}. Check console.`);
      });
  }, [width, height, generateNewMaze, resetTimer]); // Dependencies seem correct

  // --- Effect to Start Game Timer ---
  useEffect(() => {
      if(gameStatus === 'playing') {
          startTimer();
      }
      // Timer is stopped via handleGameWin callback
  }, [gameStatus, startTimer]);


  // --- Input Handlers for Dimension Controls ---
  const handleWidthChange = (event) => {
    const value = event.target.value;
    // Allow empty string or valid numbers
    if (value === "" || (/^\d+$/.test(value) && parseInt(value, 10) <= 100)) {
      setWidth(value === "" ? 0 : parseInt(value, 10)); // Set 0 if empty, trigger validation later
    }
  };
  const handleHeightChange = (event) => {
     const value = event.target.value;
     if (value === "" || (/^\d+$/.test(value) && parseInt(value, 10) <= 100)) {
        setHeight(value === "" ? 0 : parseInt(value, 10));
     }
  };

  // --- Trigger Generation Button Handler ---
   const handleGenerateButtonClick = useCallback(() => {
        // Only proceed if dimensions are valid
       if (!isValidDimension(width) || !isValidDimension(height)) return;

       console.log("Manual Generation Triggered");
        setGameStatus('generating');
        resetTimer();
        generateNewMaze(width, height)
          .then(() => { setGameStatus('ready'); })
          .catch(error => {
            console.error("App: Maze generation failed on button click", error);
            setGameStatus('error');
            alert(`Failed to generate maze: ${error.message}. Check console.`);
          });
   }, [width, height, generateNewMaze, resetTimer]); // Dependencies for the handler


  // --- Render ---
  return (
    <div className="main-container">
        <h1>React Maze Runner Game</h1>

        {/* Config Controls */}
        <div className="controls">
            <label>Width: <input type="number" value={width || ''} onChange={handleWidthChange} min="2" max="100" disabled={isGenerating} placeholder="2-100"/> </label>
            <label>Height: <input type="number" value={height || ''} onChange={handleHeightChange} min="2" max="100" disabled={isGenerating} placeholder="2-100"/></label>
            <button onClick={handleGenerateButtonClick} disabled={isGenerating || !isValidDimension(width) || !isValidDimension(height)}>
            {isGenerating ? 'Generating...' : 'Generate New Maze'}
            </button>
        </div>

        {/* Game Info */}
        <div className="game-info">
            { (gameStatus === 'playing' || gameStatus === 'won') && ( <p className="timer">Time: {elapsedTime}s</p> )}
            {gameStatus === 'won' && <h2 className="win-message">You Escaped! 🎉</h2>}
        </div>

        {/* Maze Area */}
        <div className="maze-area">
            <div ref={mazeContainerRef} tabIndex={-1} style={{ outline: 'none', touchAction: 'none', cursor: 'grab' }}>
                {grid && gameStatus !== 'generating' && gameStatus !== 'error' ? (
                    <MazeGrid
                        grid={grid}
                        playerPosition={playerPosition}
                        startPos={startPos}
                        endPos={endPos} />
                ) : (
                    <p className="status-message">
                        {isGenerating ? 'Generating maze...' :
                         gameStatus === 'error' ? 'Error loading maze...' :
                         'Loading maze...'}
                    </p>
                )}
            </div>

            {/* Instructions */}
            {(gameStatus === 'ready' || gameStatus === 'playing') && <p className="instructions">Use Keyboard (Arrows/WASD) or Drag on the Maze.</p>}
        </div>
    </div> // End main-container
  );
}

export default App;