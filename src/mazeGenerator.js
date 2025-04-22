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
  console.log(`Generating maze with dimensions: ${width}x${height}`);

  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    console.error(`Invalid dimensions received: width=${width}, height=${height}. Returning empty grid.`);
    return [];
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
    if (y > 0 && !grid[y - 1][x].visited) potentialNeighbors.push(grid[y - 1][x]);
    if (x < width - 1 && !grid[y][x + 1].visited) potentialNeighbors.push(grid[y][x + 1]);
    if (y < height - 1 && !grid[y + 1][x].visited) potentialNeighbors.push(grid[y + 1][x]);
    if (x > 0 && !grid[y][x - 1].visited) potentialNeighbors.push(grid[y][x - 1]);

    if (potentialNeighbors.length > 0) {
      const shuffledNeighbors = shuffleArray(potentialNeighbors);
      const nextCell = shuffledNeighbors[0];
      stack.push(currentCell);

      if (nextCell.y < currentCell.y) { currentCell.top = false; nextCell.bottom = false; }
      else if (nextCell.x > currentCell.x) { currentCell.right = false; nextCell.left = false; }
      else if (nextCell.y > currentCell.y) { currentCell.bottom = false; nextCell.top = false; }
      else if (nextCell.x < currentCell.x) { currentCell.left = false; nextCell.right = false; }

      nextCell.visited = true;
      currentCell = nextCell;
      visitedCount++;
    } else if (stack.length > 0) {
      currentCell = stack.pop();
    } else {
       console.warn("Maze generation stopped: Stack empty but not all cells visited.");
       break;
    }
  }

  // Define entry and exit points
  if (grid.length > 0 && grid[0]?.length > 0) {
      if (grid[0][0]) grid[0][0].left = false; // Entry
       const lastRowIndex = height - 1;
       const lastColIndex = width - 1;
       if (grid[lastRowIndex]?.[lastColIndex]) { // Optional chaining for safety
           grid[lastRowIndex][lastColIndex].right = false; // Exit
       } else {
            console.warn(`Could not set exit point for ${width}x${height} maze at [${lastRowIndex}][${lastColIndex}]`);
       }
  } else {
      console.warn("Grid is empty, cannot set entry/exit points.");
  }

  console.log("Maze generation complete."); // Removed grid log for brevity
  return grid;
};