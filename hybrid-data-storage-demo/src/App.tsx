import { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import './App.css';

export default function App() {
  const [qspCapacity, setQspCapacity] = useState(50); // TB per unit
  const [qspUnits, setQspUnits] = useState(100);
  const [serverCapacity, setServerCapacity] = useState(10); // TB per server
  const [serverRacks, setServerRacks] = useState(50);
  const [totalInternetZB, setTotalInternetZB] = useState(64); // Zettabytes

  // Calculations
  const calculations = useMemo(() => {
    const qspTotalTB = qspCapacity * qspUnits;
    const serverTotalTB = serverCapacity * serverRacks * 12; // 12 servers per rack
    const totalInternetTB = totalInternetZB * 1000 * 1000; // ZB to TB
    const qspUnitsToHoldInternet = Math.ceil(totalInternetTB / qspCapacity);
    
    const chartData = [
      {
        name: 'Storage Capacity (TB)',
        'QsP Units': qspTotalTB,
        'Server Farm': serverTotalTB,
        'All Internet': Math.min(totalInternetTB, 100000) // Cap for visualization
      }
    ];

    const pieData = [
      { name: 'QsP Storage', value: qspTotalTB, color: '#10b981' },
      { name: 'Server Farm', value: serverTotalTB, color: '#2563eb' },
    ];

    const efficiencyData = Array.from({ length: 10 }, (_, i) => ({
      units: (i + 1) * 20,
      qspCost: (i + 1) * 20 * 1000, // $1000 per unit
      serverCost: (i + 1) * 20 * 50 * 2000, // 50 servers per 20 units equivalent, $2000 each
      qspPower: (i + 1) * 20 * 100, // 100W per unit
      serverPower: (i + 1) * 20 * 50 * 500 // 500W per server
    }));

    return {
      qspTotalTB,
      serverTotalTB,
      totalInternetTB,
      qspUnitsToHoldInternet,
      chartData,
      pieData,
      efficiencyData
    };
  }, [qspCapacity, qspUnits, serverCapacity, serverRacks, totalInternetZB]);

  const formatLarge = (num: number): string => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div>
            <h1 className="title">Hybrid Data Storage Systems</h1>
            <p className="subtitle">QsP Quantum Storage vs Traditional Server Infrastructure • Interactive Comparison Demo</p>
          </div>
          <div className="badge">
            Next-Gen Storage
          </div>
        </header>

        {/* Controls Section */}
        <section className="controls-section">
          <h2 className="section-title">Configuration Controls</h2>
          <div className="controls-grid">
            <div className="control-group">
              <h3>QsP Quantum Storage</h3>
              <div className="control-panel">
                <div className="control-item">
                  <label>Capacity per Unit (TB)</label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={qspCapacity}
                    onChange={(e) => setQspCapacity(parseInt(e.target.value))}
                    className="slider"
                    aria-label="QsP capacity per unit in terabytes"
                  />
                  <span className="value">{qspCapacity} TB</span>
                </div>
                <div className="control-item">
                  <label>Number of Units</label>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    value={qspUnits}
                    onChange={(e) => setQspUnits(parseInt(e.target.value))}
                    className="slider"
                    aria-label="Number of QsP units"
                  />
                  <span className="value">{qspUnits} units</span>
                </div>
              </div>
            </div>

            <div className="control-group">
              <h3>Traditional Server Farm</h3>
              <div className="control-panel">
                <div className="control-item">
                  <label>Storage per Server (TB)</label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={serverCapacity}
                    onChange={(e) => setServerCapacity(parseInt(e.target.value))}
                    className="slider"
                    aria-label="Storage capacity per server in terabytes"
                  />
                  <span className="value">{serverCapacity} TB</span>
                </div>
                <div className="control-item">
                  <label>Number of Racks</label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={serverRacks}
                    onChange={(e) => setServerRacks(parseInt(e.target.value))}
                    className="slider"
                    aria-label="Number of server racks"
                  />
                  <span className="value">{serverRacks} racks</span>
                </div>
              </div>
            </div>

            <div className="control-group">
              <h3>Internet Scale Reference</h3>
              <div className="control-panel">
                <div className="control-item">
                  <label>Total Internet Data (ZB)</label>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={totalInternetZB}
                    onChange={(e) => setTotalInternetZB(parseInt(e.target.value))}
                    className="slider"
                    aria-label="Total internet data in zettabytes"
                  />
                  <span className="value">{totalInternetZB} ZB</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Comparison */}
        <section className="visualization-section">
          <h2 className="section-title">Storage Infrastructure Visualization</h2>
          <div className="comparison-grid">
            {/* QsP Units Visualization */}
            <div className="storage-viz">
              <h3>QsP Quantum Units</h3>
              <div className="qsp-container">
                <div className="units-grid">
                  {Array.from({ length: Math.min(qspUnits, 24) }).map((_, i) => (
                    <div key={i} className="qsp-unit">
                      <div className="unit-glow"></div>
                      <span>QsP</span>
                    </div>
                  ))}
                </div>
                <div className="total-info">
                  <div className="metric">
                    <span className="metric-value">{formatLarge(calculations.qspTotalTB)}</span>
                    <span className="metric-label">TB Total</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{qspUnits}</span>
                    <span className="metric-label">Units</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Server Farm Visualization */}
            <div className="storage-viz">
              <h3>Traditional Server Farm</h3>
              <div className="server-container">
                <div className="racks-grid">
                  {Array.from({ length: Math.min(serverRacks, 12) }).map((_, i) => (
                    <div key={i} className="server-rack">
                      <div className="rack-servers">
                        {Array.from({ length: 12 }).map((_, j) => (
                          <div key={j} className="server-unit"></div>
                        ))}
                      </div>
                      <span>Rack {i + 1}</span>
                    </div>
                  ))}
                </div>
                <div className="total-info">
                  <div className="metric">
                    <span className="metric-value">{formatLarge(calculations.serverTotalTB)}</span>
                    <span className="metric-label">TB Total</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{serverRacks * 12}</span>
                    <span className="metric-label">Servers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Internet Scale Reference */}
            <div className="storage-viz">
              <h3>Internet Scale (Reference)</h3>
              <div className="internet-viz">
                <div className="internet-globe">
                  <div className="globe-inner">
                    <span className="internet-size">{totalInternetZB} ZB</span>
                    <span className="internet-label">All Internet Data</span>
                  </div>
                </div>
                <div className="scale-info">
                  <p>QsP units needed: <strong>{formatLarge(calculations.qspUnitsToHoldInternet)}</strong></p>
                  <p>= {formatLarge(calculations.totalInternetTB)} TB</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="charts-section">
          <h2 className="section-title">Quantitative Analysis</h2>
          
          <div className="charts-grid">
            {/* Storage Comparison Bar Chart */}
            <div className="chart-container">
              <h3>Storage Capacity Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={calculations.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                  <YAxis tick={{ fill: '#9ca3af' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="QsP Units" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Server Farm" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Distribution Pie Chart */}
            <div className="chart-container">
              <h3>Storage Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={calculations.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {calculations.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatLarge(value as number) + ' TB'} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Efficiency Analysis */}
            <div className="chart-container chart-wide">
              <h3>Cost & Power Efficiency Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={calculations.efficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="units" tick={{ fill: '#9ca3af' }} label={{ value: 'Storage Units', position: 'insideBottom', offset: -5 }} />
                  <YAxis tick={{ fill: '#9ca3af' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="qspCost" stroke="#10b981" strokeWidth={3} name="QsP Cost ($)" />
                  <Line type="monotone" dataKey="serverCost" stroke="#2563eb" strokeWidth={3} name="Server Cost ($)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="metrics-section">
          <h2 className="section-title">Key Performance Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">🚀</div>
              <div className="metric-content">
                <h4>Storage Density</h4>
                <div className="metric-comparison">
                  <div>QsP: <strong>{qspCapacity} TB/unit</strong></div>
                  <div>Server: <strong>{serverCapacity} TB/server</strong></div>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">⚡</div>
              <div className="metric-content">
                <h4>Power Efficiency</h4>
                <div className="metric-comparison">
                  <div>QsP: <strong>100W/unit</strong></div>
                  <div>Server: <strong>500W/server</strong></div>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">💰</div>
              <div className="metric-content">
                <h4>Cost Efficiency</h4>
                <div className="metric-comparison">
                  <div>QsP: <strong>$1K/unit</strong></div>
                  <div>Server: <strong>$2K/server</strong></div>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🌐</div>
              <div className="metric-content">
                <h4>Internet Scale</h4>
                <div className="metric-value">
                  <strong>{formatLarge(calculations.qspUnitsToHoldInternet)}</strong>
                  <span>QsP units needed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="disclaimer">
            <strong>Disclaimer:</strong> This interactive demo is conceptual and intended for visualization and
            comparison. The user-entered numbers drive the calculations. Claims such as "holding all internet data"
            are illustrative – adjust the inputs to explore different scenarios and consult measured specs for
            engineering decisions.
          </div>
          <div className="footer-info">
            © {new Date().getFullYear()} Hybrid Data Storage Demo • React 18 • TypeScript • Recharts
          </div>
        </footer>
      </div>
    </div>
  );
}
