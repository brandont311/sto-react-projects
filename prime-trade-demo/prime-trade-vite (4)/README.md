
# Prime Trade (React + Vite + TS)

A professional, mobile‑responsive demo app showing an interactive mock market stream, order actions, and live P&L.

## Quick start

```bash
# 1) Install
npm install

# 2) Run locally
npm run dev

# 3) Build for production
npm run build
npm run preview
```

## Deploy

- **Vercel**: Import the repo, framework: Vite, build command: `npm run build`, output: `dist`.
- **Netlify**: New site from Git, build: `npm run build`, publish directory: `dist`.
- **GitHub Pages**:
  ```bash
  npm i -D gh-pages
  # add to package.json:
  # "homepage": "https://<user>.github.io/<repo>"
  # "scripts": { "predeploy": "npm run build", "deploy": "gh-pages -d dist" }
  npm run deploy
  ```

## Notes
- Responsive layout via CSS grid and fluid type.
- React hooks power the live price feed (raf loop) and state with Zustand.
- Charts by Recharts using `ResponsiveContainer` for mobile friendliness.
