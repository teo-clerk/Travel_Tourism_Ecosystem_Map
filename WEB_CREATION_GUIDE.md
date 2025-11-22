# How I Built the Travel Ecosystem Map (Beginner's Guide)

Hello! This guide explains step-by-step how I created this interactive web application and the logic behind it. I've written this for someone who is new to web development.

## 1. The "Ingredients" (Tech Stack)

Just like cooking, we need ingredients. Here are the tools I used:

*   **React**: A library for building user interfaces. Think of it as Lego blocks. Instead of writing one giant file, we build small "components" (like a button, a panel, a graph) and put them together.
*   **TypeScript**: A version of JavaScript that adds rules (types). It helps prevent bugs by ensuring, for example, that if a function expects a number, you don't accidentally give it a word.
*   **D3.js**: The magic behind the graph. It's a powerful library for visualizing data. It handles the math to make the nodes float, repel each other, and connect with lines.
*   **Vite**: A tool that runs our website on your computer while we build it. It's super fast.

## 2. The Process: Step-by-Step

### Step 1: Setting up the Kitchen (Project Initialization)
I started by creating a blank project using `Vite`. This gave me a basic folder structure with `index.html` (the main page), `src/App.tsx` (the main logic), and `package.json` (the list of ingredients/dependencies).

### Step 2: Preparing the Ingredients (Data Parsing)
You gave me a raw text file with a list of companies. Computers can't read paragraphs like humans do, so I had to translate it.
*   **The Problem**: The data was unstructured text (e.g., "P001: Ryanair...").
*   **The Solution**: I wrote a Python script (`parse_data.py`) to read the text line-by-line.
*   **The Logic**:
    *   "If a line starts with 'P', it's a new player." -> Create a new node.
    *   "If a line says 'Archetype:', grab the text after it." -> Assign a category.
    *   "If a line says 'Connections:', find the IDs." -> Create links.
*   **Result**: A clean `data.json` file that the website can easily read.

### Step 3: Building the Visualization (The Graph)
This was the hardest part. I used **D3.js** to create a "Force Simulation".
*   **Gravity**: Nodes are pulled toward the center so they don't fly away.
*   **Repulsion**: Nodes push each other away (like magnets) so they don't overlap.
*   **Links**: Connected nodes are pulled closer together.
*   **Rendering**: I used an SVG (Scalable Vector Graphics) to draw circles for nodes and lines for links.

### Step 4: Adding Style (The "Premium" Look)
A plain graph looks boring. I added:
*   **Dark Mode**: Dark backgrounds make colors pop and feel modern.
*   **Glassmorphism**: The panels look like frosted glass. This is done using CSS `backdrop-filter: blur()`.
*   **Neon Glows**: I added CSS shadows and SVG filters to make the nodes look like they are glowing.

### Step 5: Making it Interactive
A map is useless if you can't touch it.
*   **Click**: When you click a node, React updates a "state" variable called `selectedNode`. The `InfoPanel` component sees this change and slides onto the screen.
*   **Search**: When you type in the search bar, I filter the list of nodes and dim the ones that don't match.
*   **Drag**: D3 allows us to "grab" a node and move it. The simulation pauses while you hold it and resumes when you let go.

## 3. The Logic Behind the Code

The app is structured like a tree:

*   **App (The Root)**: Holds the "State" (What is selected? What is the search term?).
    *   **Controls**: The search bar and legend. It tells App "Hey, the user typed 'Uber'".
    *   **Graph**: The visual map. It receives data from App and draws it. It tells App "Hey, the user clicked P001".
    *   **InfoPanel**: The details box. It only shows up if App says "There is a selected node".
    *   **HelpModal**: The "How to Use" popup.

## 4. How to Learn More
If you want to learn to build this yourself, I recommend starting with:
1.  **HTML & CSS**: Learn how to structure and style a page.
2.  **JavaScript**: Learn the logic (if/else, loops, functions).
3.  **React**: Learn how to build components.
4.  **D3.js**: (Advanced) Learn this only after you are comfortable with the basics.

Enjoy exploring your map!
