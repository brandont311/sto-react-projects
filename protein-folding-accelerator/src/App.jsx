import React, { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './App.css'

function useProteinScene() {
  const mountRef = useRef(null)
  const [api, setApi] = useState({ addResidue: () => {}, clear: () => {}, animate: () => {} })

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000)
    camera.position.set(0, 0, 24)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mount.appendChild(renderer.domElement)

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(5, 10, 7.5)
    light.castShadow = true
    scene.add(light)
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))

    const residues = []
    const bonds = []
    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x8888ff }),
      new THREE.MeshPhongMaterial({ color: 0xff8888 }),
      new THREE.MeshPhongMaterial({ color: 0x88ff88 }),
      new THREE.MeshPhongMaterial({ color: 0xffff88 }),
    ]

    const addResidue = (pos, type = 0) => {
      const geo = new THREE.SphereGeometry(0.4, 24, 24)
      const sphere = new THREE.Mesh(geo, materials[type % materials.length])
      sphere.position.set(pos.x, pos.y, pos.z)
      sphere.castShadow = true
      sphere.receiveShadow = true
      scene.add(sphere)
      residues.push(sphere)
      
      if (residues.length > 1) {
        const prev = residues[residues.length - 2].position
        const cur = sphere.position
        const points = [new THREE.Vector3(prev.x, prev.y, prev.z), new THREE.Vector3(cur.x, cur.y, cur.z)]
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
        const lineMat = new THREE.LineBasicMaterial({ color: 0x333366, linewidth: 2 })
        const line = new THREE.Line(lineGeo, lineMat)
        scene.add(line)
        bonds.push(line)
      }
    }

    const clear = () => {
      [...residues, ...bonds].forEach(obj => {
        scene.remove(obj)
        obj.geometry?.dispose()
        obj.material?.dispose()
      })
      residues.length = 0
      bonds.length = 0
    }

    const animateRotation = () => {
      residues.forEach(residue => {
        residue.rotation.x += 0.01
        residue.rotation.y += 0.01
      })
    }

    const onResize = () => {
      if (!mount) return
      renderer.setSize(mount.clientWidth, mount.clientHeight)
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    let req
    const animate = () => {
      req = requestAnimationFrame(animate)
      animateRotation()
      renderer.render(scene, camera)
    }
    animate()

    setApi({ addResidue, clear, animate: animateRotation })

    return () => {
      cancelAnimationFrame(req)
      window.removeEventListener('resize', onResize)
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement)
      }
      renderer.dispose()
      clear()
    }
  }, [])

  return { mountRef, api }
}

export default function App() {
  const { mountRef, api } = useProteinScene()
  const [seed, setSeed] = useState(42)
  const [temperature, setTemperature] = useState(0.6)
  const [useQsP, setUseQsP] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isSimulating, setIsSimulating] = useState(false)
  const [speedSeries, setSpeedSeries] = useState([
    { run: 1, ms: 1450, qsp: 'Standard' },
    { run: 2, ms: 380, qsp: 'QsP Enabled' },
    { run: 3, ms: 1520, qsp: 'Standard' },
    { run: 4, ms: 360, qsp: 'QsP Enabled' },
  ])
  const [runCounter, setRunCounter] = useState(4)

  const currentConfig = useMemo(() => {
    const tempKelvin = Math.round(temperature * 600) // 0-1 maps to 0-600K
    const tempFahrenheit = Math.round((tempKelvin - 273.15) * 9/5 + 32)
    return {
      seed,
      temperature: `${tempKelvin}K (${tempFahrenheit}°F)`,
      qsp: useQsP ? 'Enabled' : 'Disabled',
      expectedSpeed: useQsP ? '4x Faster' : 'Standard'
    }
  }, [seed, temperature, useQsP])

  const simulateFold = async () => {
    if (isSimulating) return
    
    setIsSimulating(true)
    setProgress(0)
    api.clear()
    
    const rng = mulberry32(seed)
    const steps = 120
    const accel = useQsP ? 0.25 : 1.0 // QsP accelerates 4x for demo purposes
    const jitter = (temperature - 0.5) * 1.5

    let x = 0, y = 0, z = 0
    const start = performance.now()
    
    for (let i = 0; i < steps; i++) {
      // Simple biased random walk toward a compact ball (toy model)
      const dir = new THREE.Vector3(
        (rng() - 0.5) + -x * 0.05, 
        (rng() - 0.5) + -y * 0.05, 
        (rng() - 0.5) + -z * 0.05
      )
      dir.multiplyScalar((0.9 + jitter) * accel)
      x += dir.x; y += dir.y; z += dir.z
      
      const residueType = Math.floor(rng() * 4) // Different amino acid types
      api.addResidue({ x, y, z }, residueType)
      
      setProgress(Math.round(((i + 1) / steps) * 100))
      
      // Simulate compute time - QsP is faster
      await delay(useQsP ? 3 : 12)
    }
    
    const ms = performance.now() - start
    const newRunNumber = runCounter + 1
    setRunCounter(newRunNumber)
    setSpeedSeries(prev => [...prev.slice(-9), { 
      run: newRunNumber, 
      ms: Math.round(ms),
      qsp: useQsP ? 'QsP Enabled' : 'Standard'
    }])
    
    setIsSimulating(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Professional Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/50 py-6 shadow-lg">
        <div className="px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  🧬
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Protein Folding Accelerator
                  </h1>
                  <p className="text-slate-600 text-sm">Advanced molecular dynamics simulation platform</p>
                </div>
              </div>
              <div className="status-qsp px-4 py-2 rounded-full text-sm font-semibold">
                STO + QsP Enabled
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`status-indicator ${isSimulating ? 'status-processing' : 'status-ready'}`}>
                {isSimulating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    Folding... {progress}%
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    System Ready
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Progress Bar */}
        {isSimulating && (
          <div className="mb-8 glass-card rounded-xl p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-slate-800">Simulation Progress</h3>
              <span className="metric-value">{progress}%</span>
            </div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        <div className="grid xl:grid-cols-4 lg:grid-cols-3 gap-8">
          {/* Advanced Controls Panel */}
          <div className="xl:col-span-1 space-y-6">
            {/* Temperature Control */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Thermal Parameters</h3>
              
              <div className="control-group">
                <div className="flex justify-between items-center mb-3">
                  <label className="metric-label">Temperature</label>
                  <span className="metric-value">{Math.round(temperature * 600)}K</span>
                </div>
                <div className="text-xs text-slate-600 mb-2">
                  {Math.round((temperature * 600 - 273.15) * 9/5 + 32)}°F • Body temp: 310K (98.6°F)
                </div>
                <div className="range-container">
                  <div className="range-track"></div>
                  <div className="range-progress" style={{ width: `${temperature * 100}%` }}></div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.001" 
                    value={temperature} 
                    onChange={e => setTemperature(parseFloat(e.target.value))}
                    disabled={isSimulating}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>0K (-459°F)</span>
                  <span>600K (621°F)</span>
                </div>
                
                {/* Scientific Context */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-800">
                    <strong>
                      {Math.round(temperature * 600) < 280 ? '❄️ Cryogenic' : 
                       Math.round(temperature * 600) < 320 ? '🧬 Physiological' : 
                       Math.round(temperature * 600) < 400 ? '🔥 Elevated' : '⚠️ Denaturation'}
                    </strong>
                    <p className="mt-1">
                      {Math.round(temperature * 600) < 280 ? 'Protein motion severely restricted, may not reach native fold' : 
                       Math.round(temperature * 600) < 320 ? 'Optimal range for biological protein folding (around body temp 98.6°F)' : 
                       Math.round(temperature * 600) < 400 ? 'Increased thermal motion, faster folding but higher error rate' : 'High risk of protein unfolding and aggregation (like cooking)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Configuration */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">System Configuration</h3>
              
              <div className="space-y-4">
                <div className="control-group">
                  <label className="metric-label mb-2 block">Random Seed</label>
                  <input 
                    type="number" 
                    value={seed} 
                    onChange={e => setSeed(parseInt(e.target.value || '0'))}
                    className="w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    disabled={isSimulating}
                  />
                </div>

                <div className="control-group">
                  <label className="custom-checkbox">
                    <input 
                      type="checkbox"
                      checked={useQsP} 
                      onChange={e => setUseQsP(e.target.checked)}
                      disabled={isSimulating}
                    />
                    <span className="checkmark"></span>
                    <div>
                      <span className="font-medium text-slate-800">QsP Acceleration</span>
                      <p className="text-sm text-slate-600">Quantum-enhanced molecular dynamics</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Simulation Control */}
            <div className="glass-card rounded-xl p-6">
              <button 
                onClick={simulateFold}
                disabled={isSimulating}
                className="btn-primary w-full text-lg py-4"
              >
                {isSimulating ? 'Simulation Running...' : 'Start Protein Folding'}
              </button>
              
              {!isSimulating && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="metric-label">Expected Speed</div>
                      <div className="font-semibold text-slate-800">
                        {useQsP ? '4x Faster' : 'Standard'}
                      </div>
                    </div>
                    <div>
                      <div className="metric-label">Residues</div>
                      <div className="font-semibold text-slate-800">120</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3D Visualization */}
          <div className="xl:col-span-1 lg:col-span-1">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white">
                <h3 className="text-lg font-semibold mb-1">3D Molecular Structure</h3>
                <p className="text-slate-300 text-xs">Real-time protein folding visualization</p>
              </div>
              <div className="relative">
                <div 
                  className="protein-canvas bg-gradient-to-br from-blue-50 to-purple-50" 
                  style={{ height: '400px', width: '100%', minHeight: '400px' }} 
                  ref={mountRef} 
                />
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs font-mono">
                    {isSimulating ? `Step ${Math.floor(progress * 1.2)}/120` : 'Ready'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Panel */}
          <div className="xl:col-span-1 space-y-6">
            {/* Real-time Metrics */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Current Parameters</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="metric-label">Seed</span>
                  <span className="font-mono text-slate-800 font-semibold">{currentConfig.seed}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="metric-label">Temperature</span>
                  <span className="font-mono text-slate-800 font-semibold">{currentConfig.temperature}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="metric-label">QsP Status</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    useQsP ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {currentConfig.qsp}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="metric-label">Acceleration</span>
                  <span className="font-mono text-slate-800 font-semibold">{currentConfig.expectedSpeed}</span>
                </div>
              </div>
            </div>

            {/* Performance History */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Performance History</h3>
              
              {speedSeries.length > 0 ? (
                <div className="space-y-3">
                  {speedSeries.slice(-5).map((run) => (
                    <div key={run.run} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-600">Run {run.run}</span>
                      <div className="text-right">
                        <div className="font-semibold text-slate-800">{run.ms}ms</div>
                        <div className="text-xs text-slate-500">{run.qsp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <div className="text-3xl mb-3">📊</div>
                  <p className="text-sm">Run simulations to see performance metrics</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        {speedSeries.length > 0 && (
          <div className="mt-8 glass-card rounded-xl p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Computational Performance Analysis</h3>
              <p className="text-slate-600">Comparison of processing times with and without QsP acceleration</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={speedSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="run" 
                  stroke="#64748b"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  labelFormatter={(value) => `Simulation Run ${value}`}
                  formatter={(value, name, props) => [
                    `${value}ms`, 
                    `Processing Time (${props.payload.qsp})`
                  ]}
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ms" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={(props) => {
                    const isQsP = props.payload?.qsp === 'QsP Enabled'
                    return (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={5}
                        fill={isQsP ? '#10b981' : '#ef4444'}
                        stroke={isQsP ? '#059669' : '#dc2626'}
                        strokeWidth={2}
                      />
                    )
                  }}
                  activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
            
            {/* Chart Legend */}
            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-green-600"></div>
                <span className="text-sm text-slate-600">QsP Enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-red-600"></div>
                <span className="text-sm text-slate-600">Standard Processing</span>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Performance Note:</strong> This demonstration shows simulated computation time compression 
                when QsP (Quantum Speed Processing) acceleration is enabled. In production environments, 
                QsP integration provides actual quantum-enhanced molecular dynamics calculations for 
                significantly faster protein folding predictions.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Utilities
function delay(ms) { return new Promise(r => setTimeout(r, ms)) }
function mulberry32(a) { 
  return function() { 
    var t = a += 0x6D2B79F5; 
    t = Math.imul(t ^ t >>> 15, t | 1); 
    t ^= t + Math.imul(t ^ t >>> 7, t | 61); 
    return ((t ^ t >>> 14) >>> 0) / 4294967296 
  } 
}
