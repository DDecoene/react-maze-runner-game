// src/hooks/useMazeRunnerControls.js
import { useState, useEffect, useCallback, useRef } from 'react';

const DRAG_ACTIVE_THRESHOLD = 25;
const MOVE_INTERVAL_MS = 200; // Speed of repeated moves (lower is faster)

export function useMazeRunnerControls(
    initialPosition,
    grid,
    endPos,
    gameStatus,
    onGameStart, // Callback when game should transition from 'ready' to 'playing'
    onGameWin, // Callback when win condition is met
    mazeContainerRef // Ref to the DOM element where touch happens
) {
  const [playerPosition, setPlayerPosition] = useState(initialPosition);
  const touchStartCoordsRef = useRef(null);
  const currentMoveDirectionRef = useRef(null); // Stores the direction of the ACTIVE interval
  const moveIntervalRef = useRef(null);

  // Update player position if the initial position changes (e.g., new maze)
  useEffect(() => {
      if (initialPosition) { // Only reset if initialPosition is valid
          setPlayerPosition(initialPosition);
      }
  }, [initialPosition]);

  // --- Movement Interval Control ---
  const clearMoveInterval = useCallback(() => {
      if (moveIntervalRef.current) {
          clearInterval(moveIntervalRef.current);
          moveIntervalRef.current = null;
      }
      currentMoveDirectionRef.current = null;
  }, []); // Stable

  // --- Centralized Movement Attempt Logic ---
  const attemptMove = useCallback((direction) => {
      // Check basic conditions first
      if (!grid || !endPos || gameStatus === 'won' || gameStatus === 'generating' || gameStatus === 'error') {
          return false;
      }

      const currentGrid = grid; // Use prop directly
      const currentPlayerPos = playerPosition; // Use state directly
      const currentEndPos = endPos; // Use prop directly

      const { x, y } = currentPlayerPos;
      if (y < 0 || y >= currentGrid.length || x < 0 || x >= currentGrid[0].length || !currentGrid[y]?.[x]) {
          return false; // Out of bounds or invalid cell
      }

      // Check if the game needs to be started
      if (gameStatus === 'ready') {
          onGameStart(); // Signal game start to App
      }

      const currentCell = currentGrid[y][x];
      let newPos = { ...currentPlayerPos };
      let moved = false;

      switch (direction) {
          case 'up':    if (!currentCell.top && y > 0) { newPos.y -= 1; moved = true; } break;
          case 'down':  if (!currentCell.bottom && y < currentGrid.length - 1) { newPos.y += 1; moved = true; } break;
          case 'left':  if (!currentCell.left && x > 0) { newPos.x -= 1; moved = true; } break;
          case 'right': if (!currentCell.right && x < currentGrid[0].length - 1) { newPos.x += 1; moved = true; } break;
          default: return false;
      }

      if (moved) {
          setPlayerPosition(newPos); // Update internal state
          // Check for win condition immediately after updating position
          if (newPos.x === currentEndPos.x && newPos.y === currentEndPos.y) {
              clearMoveInterval(); // Stop touch movement
              onGameWin(); // Signal game win to App
          }
          return true; // Move succeeded
      }
      return false; // Move blocked
  // Dependencies: Include all external values and internal state/callbacks used
  }, [grid, endPos, gameStatus, playerPosition, onGameStart, onGameWin, clearMoveInterval]);


  // --- Start/Update Movement Interval ---
  const startMoveInterval = useCallback((direction) => {
      if (moveIntervalRef.current && currentMoveDirectionRef.current === direction) {
          return; // Already moving this way
      }
      clearMoveInterval(); // Clear previous
      currentMoveDirectionRef.current = direction;
      const moved = attemptMove(direction); // Try one immediate move
      if (!moved) { // If blocked instantly, don't set interval
          clearMoveInterval();
          return;
      }
      // Set interval for repeated moves
      moveIntervalRef.current = setInterval(() => {
          if (currentMoveDirectionRef.current) {
              if (!attemptMove(currentMoveDirectionRef.current)) {
                   clearMoveInterval(); // Stop if move fails (hits wall)
              }
          } else { clearMoveInterval(); } // Safety check
      }, MOVE_INTERVAL_MS);
  }, [clearMoveInterval, attemptMove]); // Depends on stable callbacks


  // --- Keyboard Event Listener ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Allow keyboard control only when game is ready or playing
      if (gameStatus !== 'ready' && gameStatus !== 'playing') return;

      let direction = null;
      switch (event.key) {
        case 'ArrowUp': case 'w': direction = 'up'; break;
        case 'ArrowDown': case 's': direction = 'down'; break;
        case 'ArrowLeft': case 'a': direction = 'left'; break;
        case 'ArrowRight': case 'd': direction = 'right'; break;
        default: return;
      }
       if (direction) {
           event.preventDefault();
           attemptMove(direction); // Use the single attempt function for keyboard
       }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, [gameStatus, attemptMove]); // Add gameStatus dependency

  // --- Touch Event Listener ---
  useEffect(() => {
    const mazeElement = mazeContainerRef.current;
    if (!mazeElement) return;

    const handleTouchStart = (event) => {
        if (gameStatus === 'won' || gameStatus === 'generating' || gameStatus === 'error') return;
        clearMoveInterval();
        const touch = event.touches[0];
        touchStartCoordsRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (event) => {
        if (!touchStartCoordsRef.current || gameStatus === 'won' || gameStatus === 'generating' || gameStatus === 'error') return;
        event.preventDefault(); // Prevent scroll during drag
        const touch = event.touches[0];
        const currentCoords = { x: touch.clientX, y: touch.clientY };
        const start = touchStartCoordsRef.current;
        const deltaX = currentCoords.x - start.x;
        const deltaY = currentCoords.y - start.y;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        let intendedDirection = null;
        if (Math.max(absDeltaX, absDeltaY) >= DRAG_ACTIVE_THRESHOLD) {
             if (absDeltaY > absDeltaX) { intendedDirection = deltaY > 0 ? 'down' : 'up'; }
             else { intendedDirection = deltaX > 0 ? 'right' : 'left'; }
        }
        if (intendedDirection && intendedDirection !== currentMoveDirectionRef.current) {
            startMoveInterval(intendedDirection);
        } else if (!intendedDirection && currentMoveDirectionRef.current !== null) {
             clearMoveInterval();
        }
    };

    const handleTouchEnd = () => {
        clearMoveInterval();
        touchStartCoordsRef.current = null;
    };

    mazeElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    mazeElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    mazeElement.addEventListener('touchend', handleTouchEnd);
    mazeElement.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      clearMoveInterval(); // Cleanup on unmount
      mazeElement.removeEventListener('touchstart', handleTouchStart);
      mazeElement.removeEventListener('touchmove', handleTouchMove);
      mazeElement.removeEventListener('touchend', handleTouchEnd);
      mazeElement.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [gameStatus, startMoveInterval, clearMoveInterval, mazeContainerRef]);

   // Cleanup interval if game status changes externally
   useEffect(() => {
       if (gameStatus === 'generating' || gameStatus === 'won' || gameStatus === 'error') {
           clearMoveInterval();
       }
   }, [gameStatus, clearMoveInterval]);

  return { playerPosition }; // Return the player position state
}