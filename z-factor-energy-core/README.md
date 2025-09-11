# Z-Factor Energy Core

Advanced quantum thermodynamic optimization system with real-time performance monitoring and interactive 3D visualization.

## 🔬 **Core Technology**

- **Transparent Quantum Shell**: Glass-like outer sphere with quantum transmission properties
- **Multi-Ring Energy System**: Rotating plasma rings in multiple orientations (X, Y, Z axes)
- **Real-Time Performance Monitoring**: Live kW output with efficiency and temperature tracking
- **Superconducting Core**: Central energy sphere with optimized thermodynamic properties

## ⚡ **Live Demo Features**

### **Interactive 3D Visualization**
- **Main Core Sphere**: Transparent glass shell with quantum properties
- **Energy Ring System**: Three rotating torus rings (cyan, red, orange)
- **Central Power Core**: Glowing superconducting center
- **Orbital Controls**: Auto-rotation with manual camera control

### **Real-Time Performance Monitor**
- **Power Output**: Live fluctuation between 70-100 kW
- **Efficiency Rating**: Dynamic 85-95% optimization
- **Core Temperature**: Superconducting range 2.0-2.8K
- **Z-Factor Status**: Quantum coherence monitoring

## 🎨 **Visual Design**

- **Dark Quantum Aesthetic**: Deep space gradient background
- **Cyan/Green Color Scheme**: High-tech energy visualization
- **Glass Morphism Effects**: Professional scientific interface
- **Animated Status Indicators**: Real-time system monitoring

## 🛠 **Tech Stack**

- **Frontend**: React + TypeScript + Vite
- **3D Graphics**: Three.js + react-three-fiber + drei
- **Performance Dials**: react-circular-progressbar
- **Styling**: Pure CSS with CSS variables and animations
- **Build System**: Vite with TypeScript compilation

## 📊 **Performance Metrics**

- **Bundle Size**: 1.08 MB optimized JavaScript
- **3D Rendering**: 60 FPS with WebGL acceleration  
- **Real-Time Updates**: 1.5-second intervals
- **Responsive Design**: Mobile and desktop optimized

## 🚀 **Production Ready**

- ✅ TypeScript compilation successful
- ✅ Production build optimized (611 modules)
- ✅ SEO meta tags configured
- ✅ Netlify configuration files included
- ✅ SPA routing with redirects support

## 🌐 **Manual Netlify Deployment**

1. **Drag & Drop Method**:
   - Open [netlify.com](https://netlify.com) 
   - Drag the `dist/` folder to the deployment area
   - Site will be live in ~30 seconds

2. **Git Integration**:
   - Push this repository to GitHub
   - Connect repository in Netlify dashboard  
   - Auto-deploy enabled with `netlify.toml`

## 🎯 **Demo Components**

### **Z-Factor Core Animation**
```
Left Panel: Interactive 3D quantum energy core
- Transparent outer shell with quantum properties
- Multi-axis rotating energy rings
- Central superconducting power sphere
- Auto-rotation with manual controls
```

### **Live Performance Monitor**  
```
Right Panel: Real-time energy system monitoring
- Circular power output dial (kW)
- Efficiency percentage tracker
- Core temperature in Kelvin
- Quantum coherence status indicator
```

---

*Part of the STO Demo Suite alongside Cancer Entropy Detector, Protein Folding Accelerator, and QsP Hybrid Energy System*

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
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
