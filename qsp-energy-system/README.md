# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# QsP Hybrid Data/Energy Storage System

Revolutionary quantum coherence technology with thermal memory layers and Z-Factor optimization for unprecedented efficiency.

## 🔬 **Technology Features**

- **Thermal Memory Layer**: Graphene composite + crystals with high conductivity
- **Quantum Coherence Layer**: Superconducting ceramics maintaining coherence > 0.986  
- **Z-Factor Optimization Core**: Thermodynamic optimizer for heat reuse and mode balancing

## 📊 **Performance Metrics**

- **85%+ Energy Efficiency** (vs 72% Li-Ion, 68% Thermal)
- **Coherence > 0.986** (vs 0.0 for competitors)
- **< 71ms Mode Switching** (vs 120ms Li-Ion, 180ms Thermal)
- **Unified Footprint** (1.0 relative vs 2.5+ competitors)

## 🚀 **Live Demo Features**

- **Interactive 3D Visualization** with Three.js
- **Hover tooltips** explaining each technology layer
- **Animated advantage cards** with Framer Motion
- **Competitive analysis charts** with Recharts
- **Professional dark sci-fi design**

## 🛠 **Tech Stack**

- **Frontend**: React + TypeScript + Vite
- **3D Graphics**: Three.js + react-three-fiber + drei
- **Animation**: Framer Motion  
- **Charts**: Recharts
- **Styling**: Pure CSS with CSS variables

## 📦 **Deployment Ready**

- ✅ Production build optimized (1.5MB bundle)
- ✅ SEO meta tags configured
- ✅ Netlify configuration files included
- ✅ SPA routing with redirects
- ✅ Responsive design for all devices

## 🌐 **Manual Netlify Deployment**

1. **Drag & Drop Method**:
   - Open [netlify.com](https://netlify.com) 
   - Drag the `dist/` folder to the deployment area
   - Site will be live in ~30 seconds

2. **Git Integration** (Recommended):
   - Push this repository to GitHub
   - Connect repository in Netlify dashboard
   - Auto-deploy enabled with `netlify.toml`

---

*Part of the STO Demo Suite alongside Cancer Entropy Detector and Protein Folding Accelerator*

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
