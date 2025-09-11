# Cellular Entropy Trajectory Dashboard

**STO Biotech Demo Suite** - Advanced cellular entropy analysis with real-time phase transition monitoring

## 🔬 Overview

This dashboard simulates cellular entropy evolution across different biological scenarios, providing critical insights into cellular health, stress responses, and therapeutic interventions. Using Shannon entropy calculations on discretized cellular state vectors, the system can detect early signs of cellular dysfunction before clinical symptoms appear.

## ✨ Key Features

### 🧬 Scenario Modeling
- **Normal Baseline**: Homeostatic cellular conditions with minimal entropy drift
- **Oxidative Stress**: Progressive cellular damage from reactive oxygen species
- **Drug Treatment**: Pharmaceutical intervention with initial stress followed by recovery

### 📊 Real-time Analysis
- **Shannon Entropy Calculation**: Mathematical analysis of cellular state complexity
- **Phase Transition Detection**: Automatic identification of critical entropy thresholds (H > 2.0)
- **Interactive Timeline**: Adjustable simulation duration (10-300 time steps)

### 🎨 Professional Interface
- **Glass-morphism Design**: Modern scientific aesthetic with backdrop blur effects
- **Responsive Charts**: Interactive entropy trajectory visualization with Recharts
- **Status Indicators**: Real-time system health monitoring with color-coded alerts

## 🚀 Technical Architecture

### Frontend Stack
- **React 18** with modern hooks (useState, useMemo)
- **Recharts** for professional data visualization
- **Pure CSS** with glass-morphism effects (Safari compatible)
- **Vite** for optimized builds and fast development

### Simulation Engine
- **Shannon Entropy**: H = -Σ(p_i * log₂(p_i)) for cellular state analysis
- **Discretization**: 16-bin histogram analysis of multi-dimensional cellular features
- **Stochastic Modeling**: Box-Muller transformation for realistic biological noise
- **Scenario Parameters**: Differential drift patterns based on biological conditions

### Production Optimizations
- **Bundle Size**: 475KB JavaScript, 6KB CSS
- **Netlify Ready**: SPA routing configuration included
- **Cross-browser**: Safari, Chrome, Firefox, Edge compatibility

## 📈 Scientific Applications

### Early Detection Systems
- **Cancer Screening**: Entropy spikes indicate cellular dysregulation
- **Drug Efficacy**: Monitor therapeutic response in real-time  
- **Biomarker Discovery**: Identify entropy patterns linked to disease states

### Research Integration
- **Omics Data**: Connect to genomics, proteomics, metabolomics streams
- **Imaging Systems**: Integrate with microscopy and medical imaging
- **LIMS Connection**: Laboratory Information Management System compatibility

### Clinical Deployment
- **Point-of-care**: Rapid entropy analysis in clinical settings
- **Population Health**: Large-scale cellular health monitoring
- **Precision Medicine**: Personalized treatment based on entropy profiles

## 🛠️ Development

### Quick Start
```bash
npm install
npm run dev     # Development server at http://localhost:5173
npm run build   # Production build in dist/
npm run preview # Preview production build
```

### Project Structure
```
src/
├── App.jsx          # Main dashboard component with scenario controls
├── App.css          # Glass-morphism styling with STO Biotech theme  
└── assets/          # Static assets and icons
```

### Key Functions
- `simulate()`: Cellular entropy trajectory generation
- `shannon()`: Shannon entropy calculation from probability distributions
- `discretize()`: Multi-dimensional cellular state binning
- `randn()`: Box-Muller random number generation

## 🔬 STO Biotech Integration

This dashboard completes the **STO Biotech Demo Suite** alongside:
- **Protein Folding Accelerator**: Quantum-enhanced 3D protein simulations
- **Cancer Entropy Detector**: Early detection through cellular entropy analysis
- **QsP Energy Systems**: Hybrid data/energy storage with quantum coherence
- **Z-Factor Energy Core**: Thermodynamic optimization with performance monitoring

## 📊 Entropy Interpretation Guide

### Phase Classifications
- **Stable Phase** (H < 1.0): Healthy cellular homeostasis
- **Drift Phase** (1.0 ≤ H < 2.0): Cellular stress response activated  
- **Collapse Phase** (H ≥ 2.0): Critical dysfunction requiring intervention

### Scenario Patterns
- **Normal**: Flat entropy trajectory indicating healthy metabolism
- **Oxidative**: Steady entropy increase as antioxidant defenses fail
- **Drug Treatment**: Initial spike during drug uptake, then stabilization

## 🌐 Deployment

### Netlify Deployment
1. Build the project: `npm run build`
2. Deploy the `dist/` folder to Netlify
3. SPA routing is pre-configured in `netlify.toml`

### Production URL
Ready for deployment at: `cellular-entropy-dashboard.netlify.app`

---

**Demo Environment Notice**: This is a demonstration using simulated data. Connect to real cellular data streams (omics, imaging, LIMS) for production deployment.

*Part of the STO Biotech advanced simulation suite - pushing the boundaries of cellular analysis and biomedical innovation.*+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
