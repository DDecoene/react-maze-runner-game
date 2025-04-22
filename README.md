# React Maze Runner Game

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A web application built with React and Vite that generates playable mazes using the Recursive Backtracking algorithm and allows users to navigate them like a runner.

**(Optional: Add a Screenshot or GIF here!)**
<!-- ![Maze Gameplay Screenshot](./path/to/your/screenshot.png) -->
<!-- It's highly recommended to add a visual demonstration! -->

## Features

*   **Maze Generation:** Creates perfect mazes (no loops) using the Recursive Backtracking algorithm.
*   **Customizable Dimensions:** Set the width and height of the maze.
*   **Interactive Gameplay:** Navigate the maze from start (top-left) to end (bottom-right) using keyboard controls (Arrow keys or WASD).
*   **Collision Detection:** Prevents movement through walls.
*   **Timer:** Tracks the time taken to solve the maze, starting from the first move.
*   **Win Condition:** Detects when the player reaches the end point and displays a success message.
*   **Responsive (Basic):** Controls layout adapts somewhat to different screen sizes.

## Live Demo

**(Optional: Add link if you deploy it!)**
<!-- You can deploy this easily on platforms like Netlify, Vercel, or GitHub Pages. -->
<!-- [Try it out here!](https://your-deployment-link.com) -->

## Tech Stack

*   **Frontend:** React 18+
*   **Build Tool:** Vite
*   **Package Manager:** pnpm
*   **Language:** JavaScript (ES6+), CSS3
*   **Algorithm:** Recursive Backtracking (Depth-First Search)

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/react-maze-runner-game.git
    cd react-maze-runner-game
    ```
    *(Replace `your-username`)*

2.  **Install dependencies using pnpm:**
    ```bash
    pnpm install
    ```

3.  **Start the development server:**
    ```bash
    pnpm dev
    ```
    This will typically open the application in your browser at `http://localhost:5173`.

## How to Play

1.  Adjust the desired `Width` and `Height` if needed.
2.  Click "Generate New Maze".
3.  Use the **Arrow Keys** or **W A S D** keys on your keyboard to move the player marker (blue/purple circle).
4.  Navigate from the start cell (green, top-left) to the end cell (red/purple, bottom-right).
5.  The timer starts automatically on your first valid move.
6.  Reach the end to stop the timer and see your time!

## Future Enhancements

*   Implement pathfinding to show the solution.
*   Add different maze generation algorithms (e.g., Prim's, Kruskal's).
*   Introduce difficulty levels/presets.
*   Add visual animations for maze generation or player movement.
*   Improve mobile responsiveness and add touch controls.

## Contributing

Contributions are welcome! If you have suggestions or find bugs, please open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` file for more information.

## Acknowledgements

*   React Documentation
*   Vite Documentation
*   Recursive Backtracking Algorithm resources (e.g., Wikipedia, various blogs)