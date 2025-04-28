// src/hooks/useMaze.js
import { useState, useCallback } from 'react';
import { generateMaze } from '../mazeGenerator'; // Adjust path if needed

const getStartPos = () => ({ x: 0, y: 0 });
const getEndPos = (width, height) => ({ x: width - 1, y: height - 1 });

export function useMaze(initialWidth = 20, initialHeight = 15) {
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [grid, setGrid] = useState(null);
  const [startPos, setStartPos] = useState(getStartPos());
  const [endPos, setEndPos] = useState(getEndPos(initialWidth, initialHeight));
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNewMaze = useCallback((w, h) => {
    // Added internal check for valid dimensions before proceeding
    const numericWidth = parseInt(w, 10);
    const numericHeight = parseInt(h, 10);
    if (isNaN(numericWidth) || isNaN(numericHeight) || numericWidth < 2 || numericHeight < 2) {
        console.warn(`useMaze: Attempted to generate with invalid dimensions: ${w}x${h}`);
        return Promise.reject(new Error(`Invalid dimensions: ${w}x${h}. Min size is 2x2.`));
    }

    console.log(`useMaze: Generating ${numericWidth}x${numericHeight}`);
    setIsGenerating(true);
    setGrid(null); // Clear grid

    return new Promise((resolve, reject) => {
        // Use setTimeout to allow UI update & prevent potential blocking
        setTimeout(() => {
            try {
                const newGrid = generateMaze(numericWidth, numericHeight);
                if (!newGrid || newGrid.length === 0 || !newGrid[0] || newGrid[0].length === 0) {
                    throw new Error("Maze generation internal function failed.");
                }
                const newStart = getStartPos();
                const newEnd = getEndPos(numericWidth, numericHeight);

                setGrid(newGrid);
                setStartPos(newStart);
                setEndPos(newEnd);
                setIsGenerating(false);
                console.log("useMaze: Generation complete.");
                resolve({ grid: newGrid, start: newStart, end: newEnd });
            } catch (error) {
                console.error("useMaze: Error during generateMaze call:", error);
                setGrid(null);
                setStartPos(getStartPos()); // Reset
                setEndPos(getEndPos(w, h)); // Use original requested size for reset?
                setIsGenerating(false);
                reject(error);
            }
        }, 10);
    });
  }, []); // generateMaze is pure, no dependencies needed here

  return {
    grid,
    startPos,
    endPos,
    width,
    height,
    setWidth, // Expose setters
    setHeight,
    isGenerating,
    generateNewMaze,
  };
}