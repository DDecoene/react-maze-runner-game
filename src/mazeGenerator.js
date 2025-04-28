// src/mazeGenerator.js

// Helper to get random integer up to max (exclusive)
const getRandomInt = (max) => Math.floor(Math.random() * max);

// Helper to shuffle an array (Fisher-Yates)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Main Maze Generation Function (Recursive Backtracker)
export const generateMaze = (width, height) => {
  // console.log(`Generating maze with dimensions: ${width}x${height}`); // Keep for debugging if needed

  // Already validated in useMaze hook, but double check is fine
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 2 || height < 2) {
    console.error(`GenerateMaze received invalid dimensions: width=${width}, height=${height}.`);
    return []; // Return empty grid
  }

  const grid = Array(height)
    .fill(null)
    .map((_, y) =>
      Array(width)
        .fill(null)
        .map((_, x) => ({
          x, y, top: true, right: true, bottom: true, left: true, visited: false,
        }))
    );

  const stack = [];
  let currentCell = grid[0][0];
  currentCell.visited = true;
  let visitedCount = 1;
  const totalCells = width * height;

  while (visitedCount < totalCells) {
    const { x, y } = currentCell;
    const potentialNeighbors = [];
    // Find unvisited neighbors
    if (y > 0 && !grid[y - 1][x].visited) potentialNeighbors.push(grid[y - 1][x]);
    if (x < width - 1 && !grid[y][x + 1].visited) potentialNeighbors.push(grid[y][x + 1]);
    if (y < height - 1 && !grid[y + 1][x].visited) potentialNeighbors.push(grid[y + 1][x]);
    if (x > 0 && !grid[y][x - 1].visited) potentialNeighbors.push(grid[y][x - 1]);

    if (potentialNeighbors.length > 0) {
      const shuffledNeighbors = shuffleArray(potentialNeighbors);
      const nextCell = shuffledNeighbors[0];
      stack.push(currentCell);

      // Remove walls between current and next
      if (nextCell.y < currentCell.y) { currentCell.top = false; nextCell.bottom = false; } // Above
      else if (nextCell.x > currentCell.x) { currentCell.right = false; nextCell.left = false; } // Right
      else if (nextCell.y > currentCell.y) { currentCell.bottom = false; nextCell.top = false; } // Below
      else if (nextCell.x < currentCell.x) { currentCell.left = false; nextCell.right = false; } // Left

      nextCell.visited = true;
      currentCell = nextCell;
      visitedCount++;
    } else if (stack.length > 0) {
      currentCell = stack.pop(); // Backtrack
    } else {
       console.warn("Maze generation stopped unexpectedly: Stack empty but not all cells visited.");
       break; // Should not happen in a standard grid
    }
  }

  // Define entry and exit points reliably
  if (grid[0]?.[0]) grid[0][0].left = false; // Entry at top-left
  const lastRowIndex = height - 1;
  const lastColIndex = width - 1;
  if (grid[lastRowIndex]?.[lastColIndex]) {
      grid[lastRowIndex][lastColIndex].right = false; // Exit at bottom-right
  }

  // console.log("Maze generation complete."); // Keep if needed
  return grid;
};