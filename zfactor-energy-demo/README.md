# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Z-Factor Energy Core Demo ⚡

An immersive React TypeScript demonstration featuring a **3D quantum energy core visualization** with real-time performance monitoring. This advanced demo showcases futuristic energy technology with interactive Three.js 3D graphics, animated performance dials, and a comprehensive system dashboard.

## 🚀 Features

### 3D Quantum Core Visualization
- **Interactive 3D Energy Core** with rotating plasma rings and magnetic levitation effects
- **Glass Shell Rendering** with realistic light transmission and refraction
- **Multi-Layer Energy Rings** with independent rotation and pulsing animations
- **Particle Field Background** with floating energy particles
- **Orbital Camera Controls** with auto-rotation and zoom capabilities
- **Dynamic Lighting System** with multiple colored light sources

### Real-Time Performance Dashboard
- **Live Power Output Dial** fluctuating between 50-100 kW with realistic variations
- **System Efficiency Monitor** tracking performance metrics (85-98%)
- **Core Temperature Gauge** with visual warnings for overheating conditions
- **Status Indicators** with color-coded alerts (Optimal/Warning/Critical)
- **Real-Time Data Feed** displaying power factor, load balance, and system status
- **System Alerts Panel** showing grid sync, energy storage, and cooling status

### Advanced UI Components
- **Glassmorphism Design** with backdrop blur effects and transparency
- **Animated Status Indicators** with pulsing lights and smooth transitions
- **Responsive Control Panel** with interactive system management buttons
- **Live Clock Display** showing current system time
- **Technical Information Cards** explaining quantum field operations
- **Professional Color Scheme** with cyan/blue energy aesthetics

## 🛠 Technology Stack

- **React 18** with TypeScript for type-safe component development
- **Three.js** for advanced 3D graphics and WebGL rendering
- **@react-three/fiber** React renderer for Three.js with declarative 3D scenes
- **@react-three/drei** utility components for enhanced 3D functionality
- **react-circular-progressbar** for professional dial and gauge components
- **Vite** build system for fast development and optimized production builds
- **CSS3** with modern features (Grid, Flexbox, Animations, Backdrop Filters)

## 🎨 Visual Design

### 3D Core Effects
- **Quantum Energy Core** with translucent glass shell and internal plasma
- **Magnetic Levitation Rings** with independent rotation axes and speeds  
- **Energy Extraction System** showing multi-ring harvesting mechanism
- **Particle Field Animation** with floating background elements
- **Dynamic Light Sources** creating realistic illumination and shadows

### Performance Monitoring
- **Circular Progress Dials** with smooth animations and gradient colors
- **Real-Time Value Updates** with realistic fluctuation patterns
- **Status Color Coding** (Green=Optimal, Orange=Warning, Red=Critical)
- **System Alert Badges** with pulsing animations and status indicators
- **Technical Data Display** with monospace font styling

### Interface Design
- **Dark Space Theme** with gradient backgrounds and starfield effects
- **Glassmorphism UI Elements** with blur effects and semi-transparency
- **Neon Accent Colors** (Cyan #00f6ff, Blue #0088ff, Teal #00cc88)
- **Smooth Animations** using CSS transforms and opacity transitions
- **Professional Typography** mixing sans-serif and monospace fonts

## 📱 Responsive Behavior

- **Desktop (1200px+)**: Side-by-side 3D visualization and performance dashboard
- **Tablet (768-1200px)**: Stacked layout with dashboard prioritized above 3D view
- **Mobile (≤768px)**: Single column layout with optimized dial sizes and spacing
- **Touch Controls**: Three.js orbit controls adapted for mobile touch interaction

## 🎯 Interactive Elements

### 3D Scene Interaction
- **Orbit Controls**: Click and drag to rotate around the energy core
- **Zoom Functionality**: Mouse wheel or pinch gestures for closer inspection
- **Auto-Rotation**: Automatic scene rotation when not actively interacting
- **Particle Animation**: Background particles rotate independently of main core

### Dashboard Controls
- **System Status Monitoring**: Real-time updates every 800ms
- **Control Panel Buttons**: Auto Rotation, Manual Override, Data Export, Diagnostics
- **Alert System**: Live status indicators for power grid, energy storage, cooling
- **Performance Metrics**: Dynamic power output, efficiency, and temperature readings

## 🚀 Getting Started

### Development
```bash
npm install
npm run dev
```
Access at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```
Production preview at `http://localhost:4173`

## 🔧 Technical Specifications

### 3D Rendering Engine
- **WebGL Renderer**: Hardware-accelerated 3D graphics
- **Scene Complexity**: Multiple mesh objects with transparent materials
- **Animation System**: 60fps smooth animations with requestAnimationFrame
- **Material Effects**: Physical materials with transmission and clearcoat
- **Lighting Setup**: Ambient, point, and spotlight combinations

### Performance Monitoring System
- **Real-Time Updates**: 800ms interval with smooth value transitions
- **Data Simulation**: Realistic fluctuation patterns with sine wave variations
- **Alert Logic**: Dynamic status calculation based on temperature and efficiency
- **Visual Feedback**: Color-coded indicators with pulsing animations

### Responsive Design Features
- **CSS Grid & Flexbox**: Advanced layout systems for all screen sizes
- **Viewport Units**: Fluid typography using clamp() function
- **Touch-Friendly**: Optimized button sizes and spacing for mobile
- **Performance Optimization**: Reduced particle count on smaller screens

## ⚡ Performance Optimizations

- **React Optimization**: useRef for Three.js object references and useFrame for animations
- **Three.js Efficiency**: Geometry reuse and material sharing
- **CSS Performance**: Transform-based animations avoiding layout thrashing
- **Memory Management**: Proper cleanup of Three.js objects and event listeners

## 🌐 Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **WebGL Support**: Required for 3D visualization functionality
- **CSS Features**: Backdrop filter, CSS Grid, Custom Properties, Flexbox
- **JavaScript**: ES2020+ features with Vite transpilation

## 🔮 Advanced Features

### Quantum Core Physics
- **Multi-Ring System**: Three independent energy rings with realistic physics
- **Plasma Containment**: Visual representation of magnetic field interactions
- **Energy Extraction**: Animated harvesting mechanism with particle effects
- **Field Stability**: Dynamic core positioning with electromagnetic suspension

### System Integration
- **Live Data Simulation**: Realistic power grid fluctuations and system responses
- **Alert Management**: Intelligent status monitoring with predictive warnings
- **Performance Analytics**: Real-time calculation of efficiency metrics
- **System Controls**: Interactive panel for hypothetical system management

### Visual Effects
- **Particle Systems**: Background energy field with floating elements
- **Material Shaders**: Advanced Three.js materials with transparency effects
- **Dynamic Lighting**: Multiple light sources creating realistic illumination
- **Post-Processing**: Glow effects and color grading for futuristic aesthetics

## 📊 Demo Capabilities

### Educational Value
- **3D Technology Demonstration**: Showcase of React Three.js integration
- **Real-Time Monitoring**: Professional dashboard design patterns
- **Interactive 3D Graphics**: WebGL and Three.js implementation examples
- **Responsive Design**: Modern CSS layout techniques

### Professional Applications  
- **Energy System Visualization**: Template for industrial monitoring interfaces
- **3D Data Representation**: Interactive visualization of complex systems
- **Performance Dashboard Design**: Real-time monitoring UI patterns
- **Futuristic Interface Design**: Advanced glassmorphism and neon aesthetics

## 📝 Disclaimer

This demonstration is a conceptual visualization of advanced energy technology. The Z-Factor quantum core is a fictional system designed for educational and demonstration purposes. Performance metrics and system behaviors are simulated for visual effect and should not be interpreted as real technical specifications.

---

**Built with** ⚡ Vite + React + TypeScript + Three.js + React Three Fiber

*Z-Factor Energy Core Demo - Visualizing the future of quantum energy systems*

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
