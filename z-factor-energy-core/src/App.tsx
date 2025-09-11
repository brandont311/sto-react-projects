import "./App.css";
import CoreAnimation from "./components/CoreAnimation";
import PerformanceDial from "./components/PerformanceDial";

function App() {
  return (
    <div className="app">
      <header className="hero">
        <h1>Z-Factor Energy Core</h1>
        <p>Advanced quantum thermodynamic optimization with real-time performance monitoring</p>
      </header>
      
      <div className="demo-grid">
        <div className="demo-section">
          <h2>Z-Factor Core Visualization</h2>
          <div className="core-container">
            <CoreAnimation />
          </div>
          <p className="description">
            Interactive 3D quantum core with transparent energy shell and rotating plasma rings
          </p>
        </div>
        
        <div className="demo-section">
          <h2>Live Performance Monitor</h2>
          <div className="dial-container">
            <PerformanceDial />
          </div>
          <p className="description">
            Real-time energy output fluctuating between 70-100 kW with quantum efficiency optimization
          </p>
        </div>
      </div>

      <footer className="footer">
        <small>© {new Date().getFullYear()} Z-Factor Systems • Advanced Energy Core Demo</small>
      </footer>
    </div>
  );
}

export default App;
