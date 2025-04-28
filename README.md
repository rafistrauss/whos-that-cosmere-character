# Who's That Cosmere Character

## Overview
"Who's That Cosmere Character" is a web-based game inspired by Brandon Sanderson's Cosmere universe. Players guess characters based on clues provided, making it an engaging experience for fans of the series. The game is designed to be lightweight, fast, and accessible, leveraging modern web technologies.

## Features
- **Gameplay**: Players guess Cosmere characters based on provided clues.
- **Static Clues**: Clues are re-built every hour to ensure consistent and up-to-date gameplay.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Firebase Integration**: Backend powered by Firebase for real-time updates.

## Technologies Used
- **Frontend**: Svelte
- **Backend**: Firebase (Authentication, Firestore)
- **Build Tool**: Bun
- **Deployment**: GitHub Pages

## Setup Instructions

### Prerequisites
- Bun (v1.2.4 or later)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd whos-that-cosmere-character
   ```
2. Install dependencies using Bun:
   ```bash
   bun install
   ```

### Development
To start the development server:
```bash
bun dev
```

### Build
To create a production build:
```bash
bun build
```

### Deployment
The project is deployed on GitHub Pages. To deploy:
1. Build the project:
   ```bash
   bun build
   ```
2. Push the `build/` directory to the `gh-pages` branch of your repository.

## Project Structure
- **src/**: Contains the source code for the application.
  - **routes/**: Svelte components for gameplay and admin pages.
  - **lib/**: Reusable assets like images.
  - **scripts/**: Utility scripts for generating static data.
- **static/**: Static assets like images and stylesheets.
- **build/**: Generated build files for deployment.

## Firebase Configuration
Ensure you have a Firebase project set up. Add your Firebase configuration to `src/routes/firebase.ts`.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed description of your changes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
- Inspired by Brandon Sanderson's Cosmere universe.
- Built with love by the community of fans.