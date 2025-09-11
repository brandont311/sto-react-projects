import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function PerformanceDial() {
  const [value, setValue] = useState(75);
  const [efficiency, setEfficiency] = useState(87);
  const [temperature, setTemperature] = useState(2.3);

  useEffect(() => {
    const interval = setInterval(() => {
      // Main power output: 70-100 kW
      setValue(Math.floor(70 + Math.random() * 30));
      
      // Efficiency: 85-95%
      setEfficiency(Math.floor(85 + Math.random() * 10));
      
      // Core temperature: 2.0-2.8K (superconducting range)
      setTemperature(Math.round((2.0 + Math.random() * 0.8) * 10) / 10);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);

  const getColorByValue = (val: number) => {
    if (val >= 90) return "#00ff88";
    if (val >= 80) return "#00f6ff"; 
    if (val >= 70) return "#ffaa00";
    return "#ff3366";
  };

  const getEfficiencyClass = (eff: number) => {
    return eff >= 90 ? "high-efficiency" : "";
  };

  const getTemperatureClass = (temp: number) => {
    return temp < 2.5 ? "optimal-temp" : "warning-temp";
  };

  return (
    <div className="performance-monitor">
      {/* Main Power Dial */}
      <div className="dial-main">
        <CircularProgressbar
          value={value}
          text={`${value} kW`}
          styles={buildStyles({
            textColor: getColorByValue(value),
            pathColor: getColorByValue(value),
            trailColor: "#1a1a1a",
            textSize: "16px",
          })}
        />
        <div className="dial-label">Power Output</div>
      </div>

      {/* Secondary Metrics */}
      <div className="metrics-grid">
        <div className="metric-item">
          <div className={`metric-value ${getEfficiencyClass(efficiency)}`}>
            {efficiency}%
          </div>
          <div className="metric-label">Efficiency</div>
        </div>
        
        <div className="metric-item">
          <div className={`metric-value ${getTemperatureClass(temperature)}`}>
            {temperature}K
          </div>
          <div className="metric-label">Core Temp</div>
        </div>
        
        <div className="metric-item">
          <div className="metric-value optimal-status">
            OPTIMAL
          </div>
          <div className="metric-label">Z-Factor</div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="status-indicators">
        <div className="status-dot active"></div>
        <span>Quantum Coherence Active</span>
      </div>
    </div>
  );
}
