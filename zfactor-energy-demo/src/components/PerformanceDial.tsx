import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface PerformanceData {
  power: number;
  efficiency: number;
  temperature: number;
  status: 'optimal' | 'warning' | 'critical';
}

export default function PerformanceDial() {
  const [data, setData] = useState<PerformanceData>({
    power: 75,
    efficiency: 92,
    temperature: 68,
    status: 'optimal'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const basePower = 75 + Math.sin(Date.now() / 2000) * 15;
      const fluctuation = Math.random() * 10 - 5;
      const newPower = Math.max(50, Math.min(100, basePower + fluctuation));
      
      const efficiency = Math.max(85, Math.min(98, 92 + Math.random() * 6 - 3));
      const temperature = Math.max(60, Math.min(85, 68 + Math.random() * 10 - 5));
      
      let status: 'optimal' | 'warning' | 'critical' = 'optimal';
      if (temperature > 75 || efficiency < 88) status = 'warning';
      if (temperature > 80 || efficiency < 85) status = 'critical';

      setData({
        power: Math.round(newPower),
        efficiency: Math.round(efficiency),
        temperature: Math.round(temperature),
        status
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (data.status) {
      case 'optimal': return '#00f6ff';
      case 'warning': return '#ffaa00';
      case 'critical': return '#ff4444';
      default: return '#00f6ff';
    }
  };

  return (
    <div className="performance-dashboard">
      {/* Main Power Output Dial */}
      <div className="main-dial">
        <div className="dial-container">
          <CircularProgressbar
            value={data.power}
            text={`${data.power} kW`}
            styles={buildStyles({
              textColor: getStatusColor(),
              pathColor: getStatusColor(),
              trailColor: '#1a1a1a',
              textSize: '14px',
              pathTransitionDuration: 0.5,
            })}
          />
        </div>
        <h3 className="dial-title">Z-Factor Output</h3>
      </div>

      {/* Secondary Metrics */}
      <div className="metrics-grid">
        {/* Efficiency Dial */}
        <div className="metric-dial">
          <div className="small-dial-container">
            <CircularProgressbar
              value={data.efficiency}
              text={`${data.efficiency}%`}
              styles={buildStyles({
                textColor: '#00cc88',
                pathColor: '#00cc88',
                trailColor: '#1a1a1a',
                textSize: '12px',
                pathTransitionDuration: 0.5,
              })}
            />
          </div>
          <span className="metric-label">Efficiency</span>
        </div>

        {/* Temperature Gauge */}
        <div className="metric-dial">
          <div className="small-dial-container">
            <CircularProgressbar
              value={(data.temperature - 60) / (85 - 60) * 100}
              text={`${data.temperature}°C`}
              styles={buildStyles({
                textColor: data.temperature > 75 ? '#ff6666' : '#66aaff',
                pathColor: data.temperature > 75 ? '#ff6666' : '#66aaff',
                trailColor: '#1a1a1a',
                textSize: '10px',
                pathTransitionDuration: 0.5,
              })}
            />
          </div>
          <span className="metric-label">Core Temp</span>
        </div>
      </div>

      {/* Status Indicator */}
      <div className={`status-indicator status-${data.status}`}>
        <div className="status-light"></div>
        <span className="status-text">
          {data.status === 'optimal' && 'OPTIMAL PERFORMANCE'}
          {data.status === 'warning' && 'CAUTION - MONITOR'}
          {data.status === 'critical' && 'CRITICAL - CHECK SYSTEM'}
        </span>
      </div>

      {/* Live Data Feed */}
      <div className="data-feed">
        <div className="data-row">
          <span className="data-label">Power Factor:</span>
          <span className="data-value">{(data.power / 100).toFixed(2)}</span>
        </div>
        <div className="data-row">
          <span className="data-label">Load Balance:</span>
          <span className="data-value">{data.efficiency}%</span>
        </div>
        <div className="data-row">
          <span className="data-label">Core Status:</span>
          <span className={`data-value status-${data.status}`}>
            {data.status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
