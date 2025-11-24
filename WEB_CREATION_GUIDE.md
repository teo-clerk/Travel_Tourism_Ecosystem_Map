# Web Creation Guide - Travel & Tourism Ecosystem Map

## Project Overview

This project is an interactive, force-directed graph visualization of the Travel & Tourism ecosystem. It is built using React, Vite, and D3.js (via `react-force-graph`).

## Key Features

- **Interactive Graph**: Zoom, pan, and drag nodes.
- **Search**: Filter nodes by name.
- **Archetype Filtering**: Filter nodes by their role in the ecosystem.
- **Detailed Info Panel**: Click on a node to view detailed information, including revenue, business model, and connections.
- **Mobile Responsiveness**: Optimized for mobile devices with a popup legend and fullscreen info panel.

## Tech Stack

- **Framework**: React + Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS (Glassmorphism design system)
- **Visualization**: `react-force-graph-2d`

## Mobile Experience

The application is designed to be fully functional on mobile devices:

- **Controls**: The search bar remains at the top. The "Archetypes" legend is hidden by default and can be accessed via a "Filter" button (hamburger menu icon).
- **Popup Legend**: On mobile, the Archetypes list opens as a centered popup modal for easy selection.
- **Fullscreen Info Panel**: When a node is selected, the details panel opens in fullscreen mode for better readability. A large "Close" button is provided for easy dismissal.

## Development Commands

- `npm install`: Install dependencies.
- `npm run dev`: Start the development server.
- `npm run build`: Build for production.

## File Structure

- `src/App.tsx`: Main application component.
- `src/App.css`: Global styles and responsive definitions.
- `src/components/Graph.tsx`: The force-directed graph component.
- `src/components/Controls.tsx`: Search bar and archetype filters.
- `src/components/InfoPanel.tsx`: Detailed view for selected nodes.
- `src/data.json`: The graph data (nodes and links).

## Design System

- **Background**: Deep space blue/black with a radial gradient.
- **Glassmorphism**: Panels use semi-transparent backgrounds with blur effects (`backdrop-filter`).
- **Colors**: Each archetype has a distinct color code defined in `Controls.tsx` and `data.json`.
