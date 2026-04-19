# Mesh Circular Shift Visualizer

Interactive web application for visualizing circular q-shift on a 2D mesh topology.

**Live Demo:** `<your-vercel-url-here>`

## What It Does

Simulates and visualizes the two-stage circular shift algorithm on a √p × √p mesh:
- **Stage 1 (Row Shift):** each node shifts within its row by `q mod √p` positions
- **Stage 2 (Column Shift):** each node shifts within its column by `⌊q / √p⌋` positions

## Features

- Input controls for p (4–64, perfect square) and q (1 to p−1) with validation
- Animated step-by-step visualization with direction arrows
- Before / After Stage 1 / Final state panels
- Real-time Complexity Panel comparing Mesh steps vs Ring steps
- Formula display and comparison table

## Project Structure

```
mesh-shift-visualizer/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── MeshGrid.jsx        ← grid rendering + animation
│   │   ├── ControlPanel.jsx    ← user inputs + validation
│   │   └── ComplexityPanel.jsx ← analysis panel + bar chart
│   ├── utils/
│   │   └── shiftLogic.js       ← pure shift algorithm (testable)
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── README.md
└── package.json
```

## Run Locally

```bash
npm install
npm start
```
Open [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
```

## Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

Or connect your GitHub repo on [vercel.com](https://vercel.com) for automatic deployments.

## Algorithm

For a p-node mesh with shift q:
- **Row shift** = `q mod √p`
- **Col shift** = `⌊q / √p⌋`
- **Mesh steps** = row shift + col shift
- **Ring steps** = `min(q, p − q)`

The mesh is more efficient because it splits the shift into two independent dimensions,
reducing total communication steps from O(p) to O(√p).
