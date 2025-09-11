# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Hybrid Data Storage Systems Demo 🚀

An interactive React TypeScript demo showcasing comparison between **QsP Quantum Storage** units and traditional server farm infrastructure. This visualization tool helps understand storage capacity, cost efficiency, and scalability differences between next-generation quantum storage and conventional data center solutions.

## 🌟 Features

### Interactive Controls
- **QsP Quantum Storage Configuration**
  - Adjustable capacity per unit (10-200 TB)
  - Variable number of units (10-500)
  - Real-time calculations and visualizations

- **Traditional Server Farm Settings**
  - Configurable storage per server (1-50 TB)  
  - Adjustable rack count (10-200 racks)
  - 12 servers per rack assumption

- **Internet Scale Reference**
  - Total internet data size slider (50-150 ZB)
  - QsP units needed calculation
  - Comparative scale analysis

### Visual Comparisons
- **3D-style QsP Units Grid** with pulsing quantum effects
- **Server Rack Visualization** with animated server status indicators
- **Internet Globe Animation** showing global data scale
- **Real-time Storage Metrics** with capacity and unit counts

### Quantitative Analysis Charts
- **Storage Capacity Bar Chart** - Direct TB comparison
- **Distribution Pie Chart** - Storage allocation visualization  
- **Cost & Power Efficiency Line Chart** - Economic analysis across scales
- **Responsive Recharts Integration** with dark theme styling

### Key Performance Metrics
- **Storage Density Comparison** (TB per unit/server)
- **Power Efficiency Analysis** (Watts per unit)
- **Cost Efficiency Breakdown** ($ per unit)
- **Internet Scale Calculations** (units needed for global data)

## 🛠 Technology Stack

- **React 18** with TypeScript for type-safe component development
- **Vite** build system for fast development and optimized production builds
- **Recharts** for professional data visualization and interactive charts
- **CSS3** with modern features (CSS Grid, Flexbox, Animations, Backdrop Filters)
- **CSS Custom Properties** for consistent theming and responsive design

## 🎨 Design Features

### Visual Design
- **Dark Gradient Background** with radial overlays
- **Glowing Quantum Effects** with animated pulsing and particle effects
- **Professional Color Palette** (Cyan, Blue, Green accents on dark base)
- **Glassmorphism UI Elements** with backdrop blur and transparency
- **Smooth Animations** for QsP units, server racks, and global data visualization

### Responsive Layout
- **CSS Grid & Flexbox** for adaptive layouts across screen sizes
- **Mobile-First Design** with breakpoints at 768px and 480px
- **Flexible Component Sizing** using clamp() and viewport units
- **Touch-Friendly Controls** with larger interactive elements on mobile

## 📱 Responsive Behavior

- **Desktop (1200px+)**: Full 3-column layout with comprehensive charts
- **Tablet (768-1200px)**: 2-column responsive grid with stacked visualizations
- **Mobile (≤768px)**: Single column layout with optimized spacing
- **Small Mobile (≤480px)**: Compact controls and scaled visualizations

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

## 🔧 Configuration Options

### QsP Quantum Storage
- **Capacity Range**: 10-200 TB per unit
- **Unit Count**: 10-500 units
- **Power Consumption**: 100W per unit (assumed)
- **Cost Model**: $1,000 per unit (estimated)

### Traditional Server Infrastructure  
- **Server Storage**: 1-50 TB per server
- **Rack Configuration**: 12 servers per rack standard
- **Power Consumption**: 500W per server (assumed)
- **Cost Model**: $2,000 per server (estimated)

### Internet Scale Reference
- **Global Data**: 50-150 ZB (configurable for different projections)
- **Growth Modeling**: Linear scaling for demonstration
- **QsP Efficiency**: Direct calculation of units needed

## 📊 Key Calculations

### Storage Totals
```typescript
const qspTotalTB = qspCapacity * qspUnits;
const serverTotalTB = serverCapacity * serverRacks * 12;
const totalInternetTB = totalInternetZB * 1000 * 1000;
```

### Efficiency Metrics
```typescript
const qspUnitsToHoldInternet = Math.ceil(totalInternetTB / qspCapacity);
const costEfficiency = qspCost / serverCost;
const powerEfficiency = qspPower / serverPower;
```

## 🎯 Use Cases

### Educational
- **Technology Comparison** for understanding next-gen vs traditional storage
- **Scale Visualization** to comprehend internet-scale data requirements
- **Cost Analysis** for infrastructure planning and decision making

### Professional  
- **Infrastructure Planning** with interactive capacity modeling
- **Investment Analysis** using cost and efficiency comparisons
- **Technology Evaluation** for enterprise storage solutions

### Demonstration
- **Concept Visualization** for quantum storage technology presentations
- **Interactive Showcase** for technology exhibitions and demos
- **Scalability Analysis** for understanding growth implications

## ⚡ Performance Optimizations

- **React.useMemo** for expensive calculations caching
- **Efficient Re-renders** with proper dependency arrays
- **CSS Animations** using transform and opacity for smooth performance
- **Recharts Responsive** containers for optimal chart rendering

## 🌐 Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **CSS Features**: Grid, Flexbox, Custom Properties, Backdrop Filter
- **JavaScript**: ES2020+ features with Vite transpilation
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+

## 📝 Disclaimer

This interactive demo is conceptual and intended for visualization and comparison purposes. The user-entered numbers drive the calculations. Claims such as "holding all internet data" are illustrative – adjust the inputs to explore different scenarios and consult measured specifications for engineering decisions.

The cost and power consumption figures are estimated for demonstration purposes and should not be used for actual infrastructure planning without consulting current market specifications and vendor documentation.

## 🔮 Future Enhancements

### Planned Features
- **Multi-scenario Comparison** with saved configuration presets
- **Advanced Cost Modeling** with market data integration
- **Real-time Data Updates** for internet size and storage costs
- **Export Functionality** for charts and configuration data

### Technical Improvements
- **WebGL Visualizations** for more immersive 3D effects
- **Progressive Web App** features for offline functionality
- **Advanced Analytics** with trend analysis and projections
- **API Integration** for real-time technology specifications

---

**Built with** ⚡ Vite + React + TypeScript + Recharts

*Hybrid Data Storage Systems Demo - Visualizing the future of data infrastructure*

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
