import React, { useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea } from 'recharts'
import './App.css'

export default function App(){
  const [scenario, setScenario] = useState('normal')
  const [T, setT] = useState(150)
  const series = useMemo(()=> simulate(scenario, T), [scenario, T])

  const collapseIdx = series.findIndex(p=> p.H > 2.0)

  return (
    <div className="wrap">
      <header className="header">
        <h1>Cellular Entropy Trajectory</h1>
        <span className="badge">STO Biotech</span>
      </header>
      
      <div className="controls">
        <div className="control-group">
          <label>Timeline Steps</label>
          <input type="number" value={T} onChange={e=>setT(parseInt(e.target.value||'10'))} className="input-number"/>
        </div>
        
        <div className="scenario-buttons">
          <button 
            className={`btn ${scenario === 'normal' ? 'active' : ''}`} 
            onClick={()=>setScenario('normal')}
          >
            Normal
          </button>
          <button 
            className={`btn ${scenario === 'oxidative' ? 'active' : ''}`} 
            onClick={()=>setScenario('oxidative')}
          >
            Oxidative Stress
          </button>
          <button 
            className={`btn ${scenario === 'drug' ? 'active' : ''}`} 
            onClick={()=>setScenario('drug')}
          >
            Drug Treatment
          </button>
        </div>
      </div>

      <div className="chart-container">
        <h2>Entropy Evolution H(t)</h2>
        <div className="chart-wrapper">
          <LineChart width={900} height={400} data={series}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
            <XAxis 
              dataKey="t" 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              label={{ value: 'Time Steps', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              label={{ value: 'Shannon Entropy H(t)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e0e4e7',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
              formatter={value => [value.toFixed(3), 'Entropy']}
              labelFormatter={(t) => `Time: ${t}`}
            />
            <Line 
              type="monotone" 
              dataKey="H" 
              stroke={getScenarioColor(scenario)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: getScenarioColor(scenario), fill: '#fff' }}
            />
            {/* Collapse threshold line */}
            <ReferenceArea y1={2.0} y2={4.0} fill="rgba(239, 68, 68, 0.1)" />
          </LineChart>
        </div>
        
        <div className="analysis">
          <div className={`status-indicator ${getStatusClass(collapseIdx, scenario)}`}>
            <div className="status-dot"></div>
            <span className="status-text">
              {collapseIdx >= 0 
                ? `System Collapse Detected at t=${collapseIdx} (H > 2.0)`
                : 'System Stable - No Collapse Detected'
              }
            </span>
          </div>
        </div>
      </div>

      <div className="info-panels">
        <div className="info-panel">
          <h3>Scenario Details</h3>
          <div className="scenario-info">
            {getScenarioDescription(scenario)}
          </div>
        </div>
        
        <div className="info-panel">
          <h3>Entropy Analysis</h3>
          <ul className="analysis-points">
            <li>Shannon entropy H computed from discretized cellular state vectors</li>
            <li>Different scenarios modify variance and correlation patterns over time</li>
            <li><strong>Stable Phase</strong>: Flat entropy indicates homeostasis</li>
            <li><strong>Drift Phase</strong>: Rising entropy shows system instability</li>
            <li><strong>Collapse Phase</strong>: H {'>'} 2.0 indicates critical dysfunction</li>
          </ul>
        </div>
      </div>

      <footer className="footer">
        <p className="mono">
          Demo-only simulation • Connect to real cellular data streams (omics, imaging, LIMS) later
        </p>
      </footer>
    </div>
  )
}

function getScenarioColor(scenario) {
  switch(scenario) {
    case 'normal': return '#10b981'
    case 'oxidative': return '#f59e0b'
    case 'drug': return '#3b82f6'
    default: return '#6b7280'
  }
}

function getStatusClass(collapseIdx, scenario) {
  if (collapseIdx >= 0) return 'collapse'
  return scenario === 'normal' ? 'stable' : 'drift'
}

function getScenarioDescription(scenario) {
  switch(scenario) {
    case 'normal':
      return (
        <div>
          <p><strong>Baseline Cellular State</strong></p>
          <p>Homeostatic conditions with minimal entropy drift. System maintains stable energy metabolism and protein synthesis patterns.</p>
        </div>
      )
    case 'oxidative':
      return (
        <div>
          <p><strong>Oxidative Stress Response</strong></p>
          <p>Progressive cellular damage from reactive oxygen species. Entropy increases steadily as antioxidant defenses become overwhelmed.</p>
        </div>
      )
    case 'drug':
      return (
        <div>
          <p><strong>Pharmaceutical Intervention</strong></p>
          <p>Initial therapeutic stress followed by recovery. Entropy rises during drug uptake, then stabilizes as treatment takes effect.</p>
        </div>
      )
    default:
      return null
  }
}

// --- Simulation Functions ---

function simulate(mode, T){
  const D = 16 // feature dimensions
  let drift = 0
  const out = []
  
  for(let t=0; t<T; t++){
    // Different drift patterns for each scenario
    if(mode==='oxidative') {
      drift += 0.015 // steady increase
    }
    if(mode==='drug') {
      // Initial increase then recovery
      drift += (t < T*0.4 ? 0.02 : -0.025)
    }
    
    const row = []
    for(let d=0; d<D; d++){
      const base = Math.sin((t/10) + d*0.12) * 0.15
      const noise = randn() * (0.08 + Math.max(0, drift))
      row.push(base + noise)
    }
    
    const H = shannon(discretize(row, 16))
    out.push({ t, H })
  }
  return out
}

function shannon(counts){
  const total = counts.reduce((a,b)=>a+b,0) || 1
  let H = 0
  for(const c of counts){ 
    if(c>0){ 
      const p = c/total
      H -= p * Math.log2(p) 
    } 
  }
  return H
}

function discretize(values, bins){
  const min = Math.min(...values)
  const max = Math.max(...values)
  const step = (max-min || 1)/bins
  const counts = new Array(bins).fill(0)
  
  for(const v of values){
    let idx = Math.floor((v-min)/step)
    if(idx>=bins) idx=bins-1
    counts[idx]++
  }
  return counts
}

function randn(){
  // Box-Muller transformation
  let u=0, v=0
  while(u===0) u = Math.random()
  while(v===0) v = Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}
