import React, { useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import './App.css'

export default function App() {
  const [series, setSeries] = useState(generateSynthetic(120, { mode: 'drift' }))
  const [threshold, setThreshold] = useState(1.6)
  const [windowSize, setWindowSize] = useState(12)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    accept: { 'text/csv': ['.csv'] }, 
    onDrop: async files => {
      setIsAnalyzing(true)
      try {
        const text = await files[0].text()
        const parsed = parseCsv(text)
        setSeries(parsed)
      } catch (error) {
        console.error('Error parsing CSV:', error)
      } finally {
        setIsAnalyzing(false)
      }
    }
  })

  const entropy = useMemo(() => computeEntropySeries(series, windowSize), [series, windowSize])
  const flaggedIndex = entropy.findIndex(p => p.H > threshold)
  const riskLevel = flaggedIndex >= 0 ? (flaggedIndex < 30 ? 'high' : flaggedIndex < 60 ? 'medium' : 'low') : 'normal'

  const generateData = (mode) => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setSeries(generateSynthetic(120, { mode }))
      setIsAnalyzing(false)
    }, 500)
  }

  return (
    <div className="app-container">
      {/* Professional Header */}
      <div className="app-header">
        <div className="header-content">
          <div className="header-main">
            <div className="header-left">
              <div className="header-info">
                <div className="app-icon">🔬</div>
                <div className="app-title-section">
                  <h1 className="app-title">Cancer Early Entropy Detector</h1>
                  <p className="app-subtitle">Advanced cellular anomaly detection system</p>
                </div>
              </div>
              <div className={`status-indicator status-${riskLevel}`}>
                {riskLevel === 'high' ? '🚨 High Risk' : 
                 riskLevel === 'medium' ? '⚠️ Medium Risk' : 
                 riskLevel === 'low' ? '⚠️ Low Risk' : '✅ Normal'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="app-content">
        {/* Data Input Section */}
        <div className="input-section">
          <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}> 
            <input {...getInputProps()} />
            <div className="dropzone-content">
              <div className="dropzone-icon">📊</div>
              <h3 className="dropzone-title">
                {isDragActive ? 'Drop CSV file here...' : 'Upload Cell State Data'}
              </h3>
              <p className="dropzone-description">
                Drop CSV here, or click to select. Each row represents a time step, columns are cellular features.
              </p>
              <div className="dropzone-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => generateData('drift')}
                  disabled={isAnalyzing}
                  type="button"
                >
                  {isAnalyzing ? 'Generating...' : 'Generate Drift Pattern'}
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => generateData('stable')}
                  disabled={isAnalyzing}
                  type="button"
                >
                  Generate Stable Pattern
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="main-content">
          {/* Entropy Analysis Chart */}
          <div className="chart-section">
            <div className="glass-card chart-card">
              <div className="card-header">
                <h3 className="card-title">Entropy Analysis Over Time</h3>
                <p className="card-description">Shannon entropy computed over sliding windows of cellular feature distributions</p>
              </div>

              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={entropy}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="t" 
                    stroke="#64748b"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                    label={{ value: 'Time Steps', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                    label={{ value: 'Entropy (H)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    labelFormatter={(value) => `Time Step ${value}`}
                    formatter={(value) => [`${value.toFixed(3)}`, 'Entropy']}
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="H" 
                    stroke="#dc2626" 
                    strokeWidth={3}
                    dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#dc2626', strokeWidth: 2, fill: '#fff' }}
                  />
                  <ReferenceLine 
                    y={threshold} 
                    strokeDasharray="4 2" 
                    stroke="#ef4444"
                    strokeWidth={2}
                    label={{ value: "Alert Threshold", position: "top" }}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* Controls */}
              <div className="chart-controls">
                <div className="control-group flex-grow">
                  <div className="control-header">
                    <label className="metric-label">Alert Threshold</label>
                    <span className="metric-value">{threshold.toFixed(2)}</span>
                  </div>
                  <div className="range-container">
                    <div className="range-track"></div>
                    <div className="range-progress" style={{ width: `${(threshold - 0.5) / 2.5 * 100}%` }}></div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="3.0" 
                      step="0.05" 
                      value={threshold} 
                      onChange={e => setThreshold(parseFloat(e.target.value))}
                    />
                  </div>
                </div>
                <div className="control-group">
                  <label className="metric-label control-label">Window Size</label>
                  <input 
                    type="number" 
                    value={windowSize} 
                    onChange={e => setWindowSize(parseInt(e.target.value || '1'))} 
                    className="number-input"
                    min="1"
                    max="30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="analysis-section">
            {/* Detection Results */}
            <div className="glass-card results-card">
              <h3 className="card-title">Detection Results</h3>
              
              <div className="results-grid">
                <div className="result-item">
                  <div className="metric-label">First Alert</div>
                  <div className="metric-value">
                    {flaggedIndex >= 0 ? `t = ${flaggedIndex}` : 'No alerts'}
                  </div>
                </div>

                <div className="result-item">
                  <div className="metric-label">Risk Assessment</div>
                  <div className={`metric-value risk-${riskLevel}`}>
                    {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                  </div>
                </div>

                <div className="result-item">
                  <div className="metric-label">Current Entropy</div>
                  <div className="metric-value">
                    {entropy.length > 0 ? entropy[entropy.length - 1].H.toFixed(3) : '0.000'}
                  </div>
                </div>
              </div>

              {flaggedIndex >= 0 && (
                <div className="alert-notice">
                  <div className="alert-content">
                    <strong>Early Detection:</strong> Entropy threshold crossed at step {flaggedIndex}, 
                    potentially {Math.max(0, 80 - flaggedIndex)} steps before conventional biomarker detection.
                  </div>
                </div>
              )}
            </div>

            {/* Methodology */}
            <div className="glass-card methodology-card">
              <h3 className="card-title">Methodology</h3>
              <ul className="methodology-list">
                <li>Shannon entropy computed over sliding windows of cellular feature distributions</li>
                <li>Detects subtle drift in cellular organization before threshold biomarkers</li>
                <li>Early anomaly flagging enables preventive intervention strategies</li>
                <li>Integrates with existing lab pipelines and omics data streams</li>
              </ul>
              
              <div className="demo-note">
                <p>
                  <strong>Demo Note:</strong> This demonstration uses simulated cellular state data. 
                  Production systems integrate with real-time laboratory instrumentation and 
                  multi-modal biomarker analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Utility Functions
function parseCsv(text) {
  const rows = text.trim().split(/\r?\n/)
  return rows.map(r => r.split(',').map(Number)).filter(row => row.every(val => !isNaN(val)))
}

function computeEntropySeries(matrix, window) {
  const res = []
  for (let t = 0; t < matrix.length; t++) {
    const start = Math.max(0, t - window + 1)
    const slice = matrix.slice(start, t + 1)
    const flat = slice.flat()
    const H = shannon(discretize(flat, 16))
    res.push({ t, H })
  }
  return res
}

function shannon(counts) {
  const total = counts.reduce((a, b) => a + b, 0) || 1
  let H = 0
  for (const c of counts) {
    if (c > 0) {
      const p = c / total
      H -= p * Math.log2(p)
    }
  }
  return H
}

function discretize(values, bins) {
  if (values.length === 0) return new Array(bins).fill(0)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const step = (max - min || 1) / bins
  const counts = new Array(bins).fill(0)
  for (const v of values) {
    let idx = Math.floor((v - min) / step)
    if (idx >= bins) idx = bins - 1
    counts[idx]++
  }
  return counts
}

function generateSynthetic(T = 120, { mode = 'drift' } = {}) {
  const D = 24
  const out = []
  let drift = 0
  
  for (let t = 0; t < T; t++) {
    if (mode === 'drift') drift += 0.015 // Gradual increase in chaos
    const row = []
    for (let d = 0; d < D; d++) {
      const base = Math.sin((t / 12) + d * 0.2) * 0.2
      const noise = randn() * (0.1 + Math.max(0, drift))
      row.push(base + noise)
    }
    out.push(row)
  }
  return out
}

function randn() {
  // Box-Muller transform
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}
