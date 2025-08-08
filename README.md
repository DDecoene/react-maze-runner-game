# React Maze Runner Game

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A web application built with React and Vite that generates playable mazes using the Recursive Backtracking algorithm and allows users to navigate them using keyboard or touch controls.


## Live Demo

Live at: **https://ddecoene.github.io/react-maze-runner-game/**

## Features

*   **Maze Generation:** Creates perfect mazes (no loops) using the Recursive Backtracking algorithm.
*   **Customizable Dimensions:** Set the width and height of the maze (min 2x2).
*   **Interactive Gameplay:**
    *   **Keyboard:** Navigate using Arrow Keys or WASD.
    *   **Touch:** Drag your finger on the maze in the desired direction to move.
*   **Collision Detection:** Prevents movement through walls.
*   **Timer:** Tracks the time taken to solve the maze, starting from the first move.
*   **Win Condition:** Detects when the player reaches the end point and displays a success message.
*   **Mobile Friendly:** Basic responsive design and touch controls implemented.

## Tech Stack

*   **Frontend:** React 19+
*   **Build Tool:** Vite
*   **Package Manager:** pnpm
*   **Language:** JavaScript (ES6+), CSS3
*   **Algorithm:** Recursive Backtracking (Depth-First Search)

## Getting Started (Local Development)

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/DDecoene/react-maze-runner-game.git
    cd react-maze-runner-game
    ```

2.  **Install dependencies using pnpm:**
    ```bash
    pnpm install
    ```

3.  **Start the development server:**
    ```bash
    pnpm dev
    ```
    This will typically open the application in your browser at `http://localhost:5173/react-maze-runner-game/` (note the base path).

## How to Play

1.  Adjust the desired `Width` and `Height` if needed (minimum 2 for each).
2.  Click "Generate New Maze".
3.  Use the **Arrow Keys** / **W A S D** keys or **drag your finger** on the maze itself to move the player marker (blue/purple circle).
4.  Navigate from the start cell (green, top-left) to the end cell (red/purple, bottom-right).
5.  The timer starts automatically on your first valid move.
6.  Reach the end to stop the timer and see your time!

## Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages:

1.  **Ensure `base` is set in `vite.config.js`:** The `base` property should be `/react-maze-runner-game/`.
2.  **Run the deploy script:**
    ```bash
    pnpm deploy
    ```
    This builds the project and pushes the `dist` folder contents to the `gh-pages` branch.
3.  **Configure GitHub Repo Settings:**
    *   Go to your repository Settings > Pages.
    *   Under "Build and deployment" > Source, select "Deploy from a branch".
    *   Set the branch to `gh-pages` and the folder to `/ (root)`.
    *   Save the changes.
    *   Wait a few minutes for the site to become active at the URL mentioned in the "Live Demo" section above.

## Future Enhancements

*   Implement pathfinding to show the solution.
*   Add different maze generation algorithms (e.g., Prim's, Kruskal's).
*   Introduce difficulty levels/presets.
*   Add visual animations for maze generation or player movement.
*   Visual feedback during touch drag.

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
*   `gh-pages` package
*   Recursive Backtracking Algorithm resources
