# News Aggregation and Reading Platform

A modern, responsive Single Page Application (SPA) built with React and Vite for browsing and reading news articles.

## Features

- **Category Browsing**: Filter news by categories like Technology, Business, Health, etc.
- **Article Reading**: innovative reader view for a comfortable reading experience.
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices.
- **Performance**: Uses `React.memo` and efficient re-rendering strategies.
- **Robust Error Handling**: Graceful handling of loading states, errors, and empty data.

## Architecture

The project follows a component-based architecture:

- **`src/components`**: Reusable UI components (Navbar, ArticleCard, Loader).
- **`src/pages`**: specific views (HomePage, CategoryPage, ArticleReader).
- **`src/hooks`**: Custom hooks for logic reuse (`useNews`).
- **`src/data`**: Mock data service simulating an API.

## technologies Used

- React 18
- React Router DOM 6
- CSS Variables for theming
- Vite for build tooling

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```
