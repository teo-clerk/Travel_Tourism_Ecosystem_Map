# How to Build the Travel & Tourism Ecosystem Map: A Beginner's Guide

Welcome! This guide will take you through the entire process of creating the **Travel & Tourism Ecosystem Map**. We will build an interactive, beautiful web application that visualizes complex relationships between companies using a "Force-Directed Graph."

Even if you are new to web development, this guide breaks down the mechanics, the code, and the "why" behind every step.

---

## 1. The Concept: What are we building?

We are building a **Single Page Application (SPA)** that displays a network of companies (Nodes) and how they connect to each other (Links).

**Key Features:**

- **Interactive Graph:** Nodes float and move naturally (physics-based).
- **Search & Filter:** Find specific players or filter by category.
- **Details Panel:** Click a node to see revenue, business models, and connections.
- **Responsive Design:** Works on laptops and mobile phones.

---

## 2. The Tech Stack (The Tools)

We use modern, industry-standard tools:

1.  **React**: A JavaScript library for building user interfaces. It lets us build reusable "components" (like a Lego set).
2.  **TypeScript**: A version of JavaScript that adds "types." It helps catch errors early (e.g., telling you "Hey, you forgot to give this node a name!").
3.  **Vite**: A build tool that sets up our project quickly and runs a super-fast local server.
4.  **D3.js**: The most powerful library for data visualization. We use it to calculate the physics of the graph.
5.  **CSS**: For styling (colors, glass effects, animations).

---

## 3. Step-by-Step Build Process

### Step 1: Setting Up the Project

First, we need a folder structure and the basic files. We use **Vite** to do this automatically.

**Command:**

```bash
npm create vite@latest my-graph-app -- --template react-ts
```

- `npm`: Node Package Manager (comes with Node.js).
- `react-ts`: Tells Vite we want React with TypeScript.

After running this, we install the extra tools we need:

```bash
npm install d3 @types/d3
```

- `d3`: The visualization library.
- `@types/d3`: Helps TypeScript understand D3 code.

### Step 2: The Data (`src/data.json`)

Before writing code, we need data. We structure it as **JSON** (JavaScript Object Notation).

**Structure:**

- **Nodes**: The circles (Companies). Each has an `id`, `name`, `group`, etc.
- **Links**: The lines (Connections). Each has a `source` (start) and `target` (end).

**Example:**

```json
{
  "nodes": [
    { "id": "P001", "name": "Ryanair", "group": "Airline" },
    { "id": "P007", "name": "Booking.com", "group": "OTA" }
  ],
  "links": [
    { "source": "P001", "target": "P007" } // Ryanair connects to Booking.com
  ]
}
```

### Step 3: The Core - The Graph Component (`src/components/Graph.tsx`)

This is the most complex part. We need to make React (which likes static HTML) work with D3 (which likes to manipulate the DOM directly).

**The Mechanics:**

1.  **`useRef`**: We create a reference to an `<svg>` element. This gives D3 a place to draw.
2.  **`useEffect`**: This React hook runs code _after_ the screen loads. We put our D3 logic here.
3.  **D3 Force Simulation**:
    - `forceManyBody`: Makes nodes repel each other (like magnets) so they don't overlap.
    - `forceLink`: Pulls connected nodes together (like springs).
    - `forceCenter`: Keeps the whole graph in the middle of the screen.

**Code Snippet (Simplified):**

```typescript
const simulation = d3
  .forceSimulation(nodes)
  .force(
    "link",
    d3.forceLink(links).id((d) => d.id)
  )
  .force("charge", d3.forceManyBody().strength(-300)) // Repel
  .force("center", d3.forceCenter(width / 2, height / 2));
```

### Step 4: Adding Interactivity

A static picture is boring. We want to click and drag!

1.  **Dragging**: D3 has a drag behavior. We tell it: "When the user grabs a node, update its X/Y position to follow the mouse."
2.  **Clicking**: We add an `onClick` event to every node. When clicked, it calls a function `onNodeClick` passed down from the parent (`App.tsx`).
3.  **Highlighting**: When a node is selected, we dim all other nodes (reduce `opacity`) and keep the selected one bright.

### Step 5: The UI Components

We build separate components for the interface to keep code clean.

- **`Controls.tsx`**:
  - Contains the **Search Bar** (updates a `searchTerm` state).
  - Contains the **Archetype Legend** (updates a `filterArchetype` state).
- **`InfoPanel.tsx`**:
  - A side panel that shows details.
  - It receives the `selectedNode` as a "prop" (property).
  - If `selectedNode` is null, it hides. If it has data, it slides in.

### Step 6: State Management (`App.tsx`)

`App.tsx` is the "Brain" of the application. It holds the **State** (the current status of the app).

**Key States:**

1.  `selectedNode`: Who is currently clicked?
2.  `filterArchetype`: Are we only showing "Airlines"?
3.  `searchTerm`: What is the user typing?

`App.tsx` passes these states down to the children:

- Passes `searchTerm` to **Graph** (so it knows which nodes to highlight).
- Passes `selectedNode` to **InfoPanel** (so it knows what text to show).

### Step 7: Styling & Glassmorphism (`App.css`)

We want it to look modern. We use **Glassmorphism**:

- Semi-transparent backgrounds (`rgba(255, 255, 255, 0.1)`).
- Background blur (`backdrop-filter: blur(10px)`).
- Subtle borders.

We also use **CSS Variables** for colors to make it easy to change the theme later.

### Step 8: Mobile Responsiveness

The graph is huge, but phones are small. We use **Media Queries** in CSS.

**The Logic:**

- **Desktop**: InfoPanel is a sidebar on the right. Legend is a list on the left.
- **Mobile (`max-width: 768px`)**:
  - InfoPanel becomes a **Fullscreen Modal**.
  - Legend becomes a **Popup** (hidden behind a hamburger menu).
  - Controls move to the top to save space.

---

## 4. How to Run It

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
3.  **Open Browser**: Go to the URL shown (usually `http://localhost:5173`).

---

## 5. Summary of Files

- `src/main.tsx`: The entry point. Starts React.
- `src/App.tsx`: The main container. Manages state.
- `src/components/Graph.tsx`: The D3 visualization.
- `src/components/Controls.tsx`: Search and filters.
- `src/components/InfoPanel.tsx`: The details sidebar.
- `src/data.json`: The database of companies.
- `src/App.css`: All the styling rules.

---

## Conclusion

You have now built a professional-grade data visualization app! You learned how to combine the logic of **React** with the powerful math of **D3.js**, styled it with modern **CSS**, and made it work on **Mobile**.

Happy Coding! 🚀
