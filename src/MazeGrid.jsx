// src/MazeGrid.jsx
import React from 'react';
import Cell from './Cell';
import './MazeGrid.css';

// Keep the component definition the same
const MazeGridComponent = ({ grid, playerPosition, startPos, endPos }) => {
  console.log('MazeGrid Rendering...'); // We expect this less often now

  if (!grid || grid.length === 0 || !grid[0] || grid[0].length === 0) {
    console.error('MazeGrid received invalid grid data');
    return <div className="error-message">Error: Invalid maze data received.</div>;
  }

  const width = grid[0].length;
  const gridStyle = { gridTemplateColumns: `repeat(${width}, auto)` };

  return (
    <div className="maze-grid-container">
      <div className="maze-grid" style={gridStyle}>
        {grid.map((row, rowIndex) => {
          if (!row || !Array.isArray(row)) {
              console.warn(`Invalid row data at index ${rowIndex}`);
              return null;
          }
          return row.map((cellData, colIndex) => {
            if (!cellData || typeof cellData !== 'object') {
                console.warn(`Invalid cell data at row ${rowIndex}, col ${colIndex}`);
                return <div key={`${rowIndex}-${colIndex}`} className="cell error-cell">!</div>;
            }
            const isPlayer = playerPosition.x === colIndex && playerPosition.y === rowIndex;
            const isStart = startPos.x === colIndex && startPos.y === rowIndex;
            const isEnd = endPos.x === colIndex && endPos.y === rowIndex;

            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                data={cellData}
                isPlayer={isPlayer}
                isStart={isStart}
                isEnd={isEnd}
              />
            );
          });
         })}
      </div>
    </div>
  );
};

// *** Custom comparison function for React.memo ***
function propsAreEqual(prevProps, nextProps) {
  // Perform strict equality checks (reference comparison)
  const gridEqual = prevProps.grid === nextProps.grid;
  const playerPosEqual = prevProps.playerPosition === nextProps.playerPosition;
  const startPosEqual = prevProps.startPos === nextProps.startPos;
  const endPosEqual = prevProps.endPos === nextProps.endPos;

  // Log which prop changed IF a re-render is about to happen
  if (!gridEqual || !playerPosEqual || !startPosEqual || !endPosEqual) {
      console.log("--- MazeGrid Memo Check: Re-rendering ---");
      if (!gridEqual) console.log(" -> Reason: 'grid' prop reference changed.");
      if (!playerPosEqual) console.log(" -> Reason: 'playerPosition' prop reference changed.");
      if (!startPosEqual) console.log(" -> Reason: 'startPos' prop reference changed.");
      if (!endPosEqual) console.log(" -> Reason: 'endPos' prop reference changed.");
  } else {
      // console.log("--- MazeGrid Memo Check: Props are equal, skipping re-render ---"); // Optional: Log skips
  }


  // Return true if ALL props are strictly equal (shallow comparison passed)
  // Returning true tells React NOT to re-render.
  return gridEqual && playerPosEqual && startPosEqual && endPosEqual;
}

// Export using React.memo with the custom comparison function
const MazeGrid = React.memo(MazeGridComponent, propsAreEqual);

export default MazeGrid;    