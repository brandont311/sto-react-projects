
import { useEffect } from 'react'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Area, AreaChart, BarChart, Bar } from 'recharts'
import { useLuckStore, useLuckLoop } from './state'

export default function App(){
  const { running, toggleRunning, reset, timeframe, setTimeframe, series, metrics, params, setParam, takeAction, logInsight } = useLuckStore()
  useLuckLoop()

  useEffect(() => {
    document.title = `Luck Training — ${running ? 'Live' : 'Paused'}`
  }, [running])

  return (
    <div className="container">
      <div className="header">
        <div>
          <div className="title">Luck Training</div>
          <div className="subtitle">Interactive practice of luck surface area: actions × exposure × reflection × network.</div>
        </div>
        <div className="toolbar">
          <button className={"btn " + (running ? '' : 'primary')} onClick={toggleRunning}>{running ? 'Pause' : 'Start'}</button>
          <button className="btn" onClick={takeAction}>Take Action</button>
          <button className="btn" onClick={logInsight}>Log Insight</button>
          <button className="btn" onClick={reset}>Reset</button>
        </div>
      </div>

      <section className="kpi">
        <div className="kpi-item">
          <div className="kpi-label">Luck Score</div>
          <div className="kpi-value">{'{'}metrics.luck.toFixed(2){'}'}</div>
        </div>
        <div className="kpi-item">
          <div className="kpi-label">Streak</div>
          <div className="kpi-value">{'{'}metrics.streak{'}'} days</div>
        </div>
        <div className="kpi-item">
          <div className="kpi-label">Opportunities</div>
          <div className="kpi-value">{'{'}metrics.opportunities{'}'}</div>
        </div>
        <div className="kpi-item">
          <div className="kpi-label">Insights</div>
          <div className="kpi-value">{'{'}metrics.insights{'}'}</div>
        </div>
      </section>

      <div className="grid">
        <div className="card">
          <div className="subtitle" style={{marginBottom:8}}>Luck Score Over Time</div>
          <div style={{width:'100%', height: 320}}>
            <ResponsiveContainer>
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a8ff78" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#a8ff78" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="luck" stroke="#a8ff78" fill="url(#g1)" strokeWidth={2} />
                <CartesianGrid stroke="rgba(255,255,255,.06)"/>
                <XAxis dataKey="t" tick={{ fill:'#94a3b8', fontSize:12 }} />
                <YAxis domain={['auto','auto']} tick={{ fill:'#94a3b8', fontSize:12 }}/>
                <Tooltip contentStyle={{ background:'#0b1425', border:'1px solid rgba(255,255,255,.12)', borderRadius:12 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="subtitle" style={{marginBottom:8}}>Controls</div>
          <Controls />
        </div>
      </div>

      <div className="card" style={{marginTop:16}}>
        <div className="subtitle" style={{marginBottom:8}}>Opportunity vs Insight</div>
        <div style={{width:'100%', height: 240}}>
          <ResponsiveContainer>
            <BarChart data={[{label:'Opportunity', value: metrics.opportunities}, {label:'Insights', value: metrics.insights}]}>
              <CartesianGrid stroke="rgba(255,255,255,.06)"/>
              <XAxis dataKey="label" tick={{ fill:'#94a3b8', fontSize:12 }} />
              <YAxis allowDecimals={false} tick={{ fill:'#94a3b8', fontSize:12 }}/>
              <Tooltip contentStyle={{ background:'#0b1425', border:'1px solid rgba(255,255,255,.12)', borderRadius:12 }} />
              <Bar dataKey="value" stroke="#78ffd6" fill="#78ffd6" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <footer>© {new Date().getFullYear()} Luck Training demo • Vite • React 18 • Recharts</footer>
    </div>
  )
}

function Controls(){
  const { params, setParam } = useLuckStore()
  return (
    <div className="row align-stretch">
      <div className="kpi-item kpi-flex">
        <div className="kpi-label">Practice Intensity</div>
        <input className="range" type="range" min="0" max="1" step="0.01" value={params.practice} onChange={e => setParam('practice', parseFloat(e.target.value))} title="Practice Intensity" />
        <div className="kpi-value">{'{'}params.practice.toFixed(2){'}'}</div>
      </div>
      <div className="kpi-item kpi-flex-220">
        <div className="kpi-label">Network Exposure</div>
        <input className="range" type="range" min="0" max="1" step="0.01" value={params.network} onChange={e => setParam('network', parseFloat(e.target.value))} title="Network Exposure" />
        <div className="kpi-value">{'{'}params.network.toFixed(2){'}'}</div>
      </div>
      <div className="kpi-item kpi-flex-220">
        <div className="kpi-label">Risk Posture</div>
        <input className="range" type="range" min="0" max="1" step="0.01" value={params.risk} onChange={e => setParam('risk', parseFloat(e.target.value))} title="Risk Posture" />
        <div className="kpi-value">{'{'}params.risk.toFixed(2){'}'}</div>
      </div>
      <div className="kpi-item kpi-flex-220">
        <div className="kpi-label">Reflection Cadence</div>
        <input className="range" type="range" min="0" max="1" step="0.01" value={params.reflection} onChange={e => setParam('reflection', parseFloat(e.target.value))} title="Reflection Cadence" />
        <div className="kpi-value">{'{'}params.reflection.toFixed(2){'}'}</div>
      </div>
      <div className="kpi-item kpi-flex-220">
        <div className="kpi-label">Randomness (σ)</div>
        <input className="range" type="range" min="0" max="2" step="0.01" value={params.sigma} onChange={e => setParam('sigma', parseFloat(e.target.value))} title="Randomness (σ)" />
        <div className="kpi-value">{'{'}params.sigma.toFixed(2){'}'}</div>
      </div>
      <div className="kpi-item kpi-flex-220">
        <div className="kpi-label">Tick Latency (ms)</div>
        <input className="range" type="range" min="50" max="1000" step="10" value={params.latency} onChange={e => setParam('latency', parseInt(e.target.value))} title="Tick Latency (ms)" />
        <div className="kpi-value">{'{'}params.latency{'}'} ms</div>
      </div>
    </div>
  )
}
