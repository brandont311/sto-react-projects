import { useState, useEffect } from 'react';
import CoreAnimation from './components/CoreAnimation';
import PerformanceDial from './components/PerformanceDial';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <h1 className="title">Z-Factor Energy Core</h1>
            <p className="subtitle">Advanced Quantum Energy Visualization • Real-Time Performance Monitoring</p>
          </div>
          <div className="header-info">
            <div className="time-display">{currentTime}</div>
            <div className="system-badge">SYSTEM ACTIVE</div>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="main-grid">
          {/* 3D Core Visualization */}
          <section className="visualization-section">
            <div className="section-header">
              <h2 className="section-title">Z-Factor Core Visualization</h2>
              <div className="core-status">
                <div className="status-dot active"></div>
                <span>Core Online</span>
              </div>
            </div>
            <div className="core-container">
              <CoreAnimation />
            </div>
            <div className="core-info">
              <div className="info-card">
                <h4>Quantum Field</h4>
                <p>Stable plasma containment with energy ring oscillation</p>
              </div>
              <div className="info-card">
                <h4>Magnetic Levitation</h4>
                <p>Core suspended in electromagnetic field matrix</p>
              </div>
              <div className="info-card">
                <h4>Energy Extraction</h4>
                <p>Multi-ring harvesting system operational</p>
              </div>
            </div>
          </section>

          {/* Performance Dashboard */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Live Performance Dashboard</h2>
              <div className="refresh-indicator">
                <div className="refresh-dot"></div>
                <span>Real-Time</span>
              </div>
            </div>
            <div className="dashboard-container">
              <PerformanceDial />
            </div>
            <div className="system-alerts">
              <div className="alert-item">
                <div className="alert-icon">⚡</div>
                <div className="alert-content">
                  <span className="alert-title">Power Grid Sync</span>
                  <span className="alert-status">Synchronized</span>
                </div>
              </div>
              <div className="alert-item">
                <div className="alert-icon">🔋</div>
                <div className="alert-content">
                  <span className="alert-title">Energy Storage</span>
                  <span className="alert-status">87% Capacity</span>
                </div>
              </div>
              <div className="alert-item">
                <div className="alert-icon">🌡️</div>
                <div className="alert-content">
                  <span className="alert-title">Cooling System</span>
                  <span className="alert-status">Optimal</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Control Panel */}
        <section className="control-panel">
          <h3 className="panel-title">System Controls</h3>
          <div className="controls-grid">
            <button className="control-btn active">
              <div className="btn-icon">🔄</div>
              <span>Auto Rotation</span>
            </button>
            <button className="control-btn">
              <div className="btn-icon">⚙️</div>
              <span>Manual Override</span>
            </button>
            <button className="control-btn">
              <div className="btn-icon">📊</div>
              <span>Data Export</span>
            </button>
            <button className="control-btn">
              <div className="btn-icon">🔧</div>
              <span>Diagnostics</span>
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="tech-specs">
              <strong>Technical Specifications:</strong> Z-Factor Quantum Core v2.1 • 
              Three.js 3D Rendering • React Performance Monitoring • 
              Real-time Energy Analytics
            </div>
            <div className="copyright">
              © {new Date().getFullYear()} Z-Factor Energy Systems • Advanced Quantum Technology Demo
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
