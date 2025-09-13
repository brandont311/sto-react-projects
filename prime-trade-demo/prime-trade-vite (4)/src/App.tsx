
import { useEffect } from 'react'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Area, AreaChart } from 'recharts'
import { usePrimeTradeStore, usePriceFeed } from './state'

export default function App(){
  const { running, toggleRunning, reset, timeframe, setTimeframe, prices, pnl, capital, positions, placeMarketOrder } = usePrimeTradeStore()
  usePriceFeed()

  useEffect(() => {
    document.title = `Prime Trade — ${running ? 'Live' : 'Paused'}`
  }, [running])

  return (
    <div className="container">
      <div className="header">
        <div>
          <div className="title">Prime Trade</div>
          <div className="subtitle">Quantum‑inspired demo — mock market stream, interactive orders, and live P&amp;L.</div>
        </div>
        <div className="toolbar">
          <button className={"btn " + (running ? '' : 'primary')} onClick={toggleRunning}>{running ? 'Pause' : 'Start'}</button>
          <button className="btn" onClick={() => placeMarketOrder('BUY')}>Buy</button>
          <button className="btn" onClick={() => placeMarketOrder('SELL')}>Sell</button>
          <button className="btn danger" onClick={reset}>Reset</button>
        </div>
      </div>

      <section className="kpi">
        <div className="kpi-item">
          <div className="kpi-label">Capital</div>
          <div className="kpi-value">${'{'}capital.toFixed(2){'}'}</div>
        </div>
        <div className="kpi-item">
          <div className="kpi-label">Unrealized P&amp;L</div>
          <div className="kpi-value">${'{'}pnl.toFixed(2){'}'}</div>
        </div>
        <div className="kpi-item">
          <div className="kpi-label">Position</div>
          <div className="kpi-value">{'{'}positions.qty{'}'} @ ${'{'}positions.avg.toFixed(2){'}'}</div>
        </div>
        <div className="kpi-item">
          <div className="kpi-label">Timeframe</div>
          <select className="select" value={timeframe} onChange={e => setTimeframe(parseInt(e.target.value))}>
            {[60, 120, 240, 480].map(t => <option key={t} value={t}>{t}s</option>)}
          </select>
        </div>
      </section>

      <div className="grid">
        <div className="card">
          <div className="row" style={{justifyContent:'space-between', marginBottom:12}}>
            <div className="badge"><span className={'dot ' + (prices.change >= 0 ? 'up':'down')}></span> Price</div>
            <div className="subtitle">Last: ${'{'}prices.last.toFixed(2){'}'} • Δ { '{'}prices.change.toFixed(2){'}'} • Vol { '{'}prices.volatility.toFixed(2){'}'}</div>
          </div>
          <div style={{width:'100%', height: 320}}>
            <ResponsiveContainer>
              <AreaChart data={prices.series}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4cc9f0" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#4cc9f0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="price" stroke="#4cc9f0" fill="url(#g1)" strokeWidth={2} />
                <CartesianGrid stroke="rgba(255,255,255,.06)"/>
                <XAxis dataKey="t" tick={{ fill:'#94a3b8', fontSize:12 }} />
                <YAxis domain={['auto','auto']} tick={{ fill:'#94a3b8', fontSize:12 }}/>
                <Tooltip contentStyle={{ background:'#0b1425', border:'1px solid rgba(255,255,255,.12)', borderRadius:12 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="subtitle" style={{marginBottom:8}}>Strategy Controls</div>
          <StrategyPanel />
        </div>
      </div>

      <div className="card" style={{marginTop:16}}>
        <div className="subtitle" style={{marginBottom:8}}>P&amp;L</div>
        <div style={{width:'100%', height: 220}}>
          <ResponsiveContainer>
            <LineChart data={prices.series}>
              <Line type="monotone" dataKey="equity" stroke="#f72585" strokeWidth={2} dot={false}/>
              <CartesianGrid stroke="rgba(255,255,255,.06)"/>
              <XAxis dataKey="t" tick={{ fill:'#94a3b8', fontSize:12 }} />
              <YAxis domain={['auto','auto']} tick={{ fill:'#94a3b8', fontSize:12 }}/>
              <Tooltip contentStyle={{ background:'#0b1425', border:'1px solid rgba(255,255,255,.12)', borderRadius:12 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <footer>© {new Date().getFullYear()} Prime Trade demo • Vite • React 18 • Recharts</footer>
    </div>
  )
}

function StrategyPanel(){
  const { params, setParam } = usePrimeTradeStore()
  return (
    <div className="row" style={{alignItems:'stretch'}}>
      <label className="kpi-item" style={{flex:'1 1 140px'}}>
        <div className="kpi-label">Drift</div>
        <input className="input" type="number" step=".001" value={params.drift} onChange={e => setParam('drift', parseFloat(e.target.value))} />
      </label>
      <label className="kpi-item" style={{flex:'1 1 140px'}}>
        <div className="kpi-label">Volatility</div>
        <input className="input" type="number" step=".001" value={params.sigma} onChange={e => setParam('sigma', parseFloat(e.target.value))} />
      </label>
      <label className="kpi-item" style={{flex:'1 1 140px'}}>
        <div className="kpi-label">Order Size</div>
        <input className="input" type="number" step="1" value={params.size} onChange={e => setParam('size', parseInt(e.target.value))} />
      </label>
      <label className="kpi-item" style={{flex:'1 1 140px'}}>
        <div className="kpi-label">Latency (ms)</div>
        <input className="input" type="number" step="10" value={params.latency} onChange={e => setParam('latency', parseInt(e.target.value))} />
      </label>
    </div>
  )
}
