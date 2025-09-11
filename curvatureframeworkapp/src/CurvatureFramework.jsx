import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CurvatureFramework = () => {
  const [theta, setTheta] = useState(359.4);
  const [manifoldLevel, setManifoldLevel] = useState(2);
  const [waveformType, setWaveformType] = useState('sonoluminescence');
  const [showNullZones, setShowNullZones] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [timeStep, setTimeStep] = useState(0);

  // Physical constants
  const C = 299792458; // m/s
  const h = 6.62607015e-34; // Planck constant
  const kB = 1.380649e-23; // Boltzmann constant
  const sqrtC = Math.sqrt(C);

  // STO Framework calculations
  const calculateTemperature = (thetaDeg) => {
    if (thetaDeg <= 0) return 0;
    return (C * C * h) / (kB * Math.log(2) * thetaDeg);
  };

  const calculateCurvatureRank = (fd, rho, sigmaE) => {
    return (fd * rho) / (sigmaE || 1);
  };

  const calculatePhaseSlipVelocity = (thetaDeg, ricciCurvature) => {
    const thetaRad = (thetaDeg * Math.PI) / 180;
    return C * Math.cos(thetaRad) / Math.sqrt(ricciCurvature + 0.001);
  };

  // Geodesic Slip Tensor components
  const calculateGSTComponent = (mu, nu, ricciCurvature, velocity) => {
    const metric = mu === nu ? 1 : 0;
    const velocityTerm = (velocity * velocity) / (C * C);
    return (1 / Math.sqrt(ricciCurvature)) * (metric - velocityTerm);
  };

  // Angular thresholds from the framework
  const angularThresholds = [
    { theta: 93394.10, temp: 66.63, description: "Mass gap threshold" },
    { theta: 22454.07, temp: 277.13, description: "Water density max" },
    { theta: 21600, temp: 288.09, description: "Earth surface avg" },
    { theta: 20837.73, temp: 298.63, description: "Sound/Water coherence" },
    { theta: 360.11, temp: 17280, description: "Rotational segment" },
    { theta: 359.4, temp: sqrtC, description: "Critical symmetry point" }
  ];

  // Manifold hierarchy
  const manifolds = [
    { name: "Vacuum", ricciCurvature: 0.001, color: "#1f1f1f" },
    { name: "Plasma", ricciCurvature: 0.1, color: "#ff6b35" },
    { name: "Atmosphere", ricciCurvature: 0.5, color: "#87ceeb" },
    { name: "Water", ricciCurvature: 1.2, color: "#4682b4" },
    { name: "Earth", ricciCurvature: 2.5, color: "#8b4513" }
  ];

  // Animation effect
  useEffect(() => {
    if (animationSpeed > 0) {
      const interval = setInterval(() => {
        setTimeStep(prev => prev + animationSpeed * 0.1);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [animationSpeed]);

  // Generate waveform data
  const waveformData = useMemo(() => {
    const data = [];
    const currentManifold = manifolds[manifoldLevel];
    
    for (let i = 0; i < 100; i++) {
      const x = (i / 100) * 4 * Math.PI;
      const time = x + timeStep;
      
      let amplitude = 0;
      let phaseShift = 0;
      
      switch (waveformType) {
        case 'sonoluminescence':
          amplitude = Math.sin(time) * Math.exp(-0.1 * Math.abs(time - 2 * Math.PI));
          phaseShift = Math.sin(3 * time) * 0.2;
          break;
        case 'hawking':
          amplitude = Math.sin(time) * (1 + 0.3 * Math.sin(0.5 * time));
          phaseShift = Math.cos(time) * 0.1;
          break;
        case 'transverse':
          amplitude = Math.sin(2 * time) + 0.5 * Math.sin(8 * time);
          phaseShift = Math.sin(time + Math.PI/6) * 0.15;
          break;
        default:
          amplitude = Math.sin(time);
      }
      
      const currentTheta = theta + phaseShift * 10;
      const temperature = calculateTemperature(currentTheta);
      const phaseVelocity = calculatePhaseSlipVelocity(currentTheta, currentManifold.ricciCurvature);
      const angularStress = Math.abs(Math.sin(2 * time));
      
      // Detect null zones
      const isNullZone = showNullZones && (
        Math.abs(currentTheta - 359.4) < 1.0 || 
        angularStress < 0.3
      );
      
      data.push({
        x: i,
        amplitude: parseFloat(amplitude.toFixed(4)),
        temperature: Math.min(temperature || 0, 1000000),
        phaseVelocity: parseFloat((phaseVelocity / C).toFixed(6)),
        angularStress: parseFloat(angularStress.toFixed(4)),
        isNullZone,
        theta: parseFloat(currentTheta.toFixed(2))
      });
    }
    
    return data;
  }, [theta, manifoldLevel, waveformType, timeStep, showNullZones]);

  // Calculate current metrics
  const currentTemp = calculateTemperature(theta);
  const currentManifold = manifolds[manifoldLevel];
  const currentPhaseVel = calculatePhaseSlipVelocity(theta, currentManifold.ricciCurvature);
  const gstComponent = calculateGSTComponent(0, 0, currentManifold.ricciCurvature, currentPhaseVel);

  return (
    <>
      <div className="bg-blue-500 text-white p-4 rounded">Tailwind Direct Test</div>
      <div className="w-full p-6 bg-gradient-to-br from-gray-900 to-blue-900 text-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            STO Curvature Framework Simulator
          </h1>
          <p className="text-center text-gray-300 mb-8">
            Interactive visualization of Space-Time Occupancy principles and Geodesic Slip Tensor dynamics
          </p>

          {/* Control Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Angular Parameters</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Angular Magnitude θ (degrees): {theta.toFixed(2)}°
                </label>
                <input
                  type="range"
                  min="350"
                  max="370"
                  step="0.1"
                  value={theta}
                  onChange={(e) => setTheta(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Manifold Level: {currentManifold.name}
                </label>
                <select
                  value={manifoldLevel}
                  onChange={(e) => setManifoldLevel(parseInt(e.target.value))}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  {manifolds.map((manifold, index) => (
                    <option key={index} value={index}>{manifold.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Waveform Type</label>
                <select
                  value={waveformType}
                  onChange={(e) => setWaveformType(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="sonoluminescence">Sonoluminescence</option>
                  <option value="hawking">Hawking Radiation</option>
                  <option value="transverse">Transverse Time Wave</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-green-400">Current Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Temperature (K):</span>
                  <span className="font-mono">{currentTemp > 1000000 ? '∞' : currentTemp.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phase Velocity (C):</span>
                  <span className="font-mono">{(currentPhaseVel / C).toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ricci Curvature:</span>
                  <span className="font-mono">{currentManifold.ricciCurvature}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Component:</span>
                  <span className="font-mono">{gstComponent.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>√C Proximity:</span>
                  <span className={`font-mono ${Math.abs(currentTemp - sqrtC) < 1000 ? 'text-red-400' : 'text-green-400'}`}>
                    {Math.abs(currentTemp - sqrtC).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Simulation Controls</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Animation Speed: {animationSpeed}x
                </label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="nullZones"
                  checked={showNullZones}
                  onChange={(e) => setShowNullZones(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="nullZones" className="text-sm">Show Null Zones (TANZ)</label>
              </div>
              <button
                onClick={() => setTimeStep(0)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Reset Animation
              </button>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Waveform Analysis</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={waveformData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="x" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="amplitude" 
                      stroke="#3B82F6" 
                      strokeWidth={2} 
                      name="Amplitude"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="angularStress" 
                      stroke="#EF4444" 
                      strokeWidth={1} 
                      name="Angular Stress"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-green-400">Phase Velocity Dynamics</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={waveformData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="x" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="phaseVelocity" 
                      stroke="#10B981" 
                      strokeWidth={2} 
                      name="Phase Velocity (C)"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Angular Thresholds Table */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">STO Angular Thresholds</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-2">θ (deg/arcmin)</th>
                    <th className="text-left p-2">Temperature (K)</th>
                    <th className="text-left p-2">Description</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {angularThresholds.map((threshold, index) => {
                    const isActive = Math.abs(theta - threshold.theta) < 5;
                    return (
                      <tr key={index} className={`border-b border-gray-700 ${isActive ? 'bg-blue-900/30' : ''}`}>
                        <td className="p-2 font-mono">{threshold.theta}</td>
                        <td className="p-2 font-mono">{threshold.temp}</td>
                        <td className="p-2">{threshold.description}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                          }`}>
                            {isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Framework Summary */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">STO Framework Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-blue-400">Core Principle</h4>
                <p className="text-sm text-gray-300 mb-4">
                  C is not the speed of light, but the angular compression boundary of spacetime curvature - 
                  the maximum permissible recursion rate of time-encoded information before coherence collapses into emission.
                </p>
                <h4 className="font-semibold mb-2 text-green-400">TASL (Thermal Angular Symmetry Law)</h4>
                <p className="text-sm text-gray-300">
                  K = C²h/(kBLn2θ) - All thermodynamic temperatures map to angular curvature compression, 
                  with √C as the crossover point where λ=f.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-purple-400">Geodesic Slip Tensor</h4>
                <p className="text-sm text-gray-300 mb-4">
                  S^μν = (1/√R) × (g^μν - v^μv^ν/C²) - Encodes local geodesic curvature deformation 
                  and phase velocity slip across nested manifolds.
                </p>
                <h4 className="font-semibold mb-2 text-red-400">Null Zone Detection (TANZ)</h4>
                <p className="text-sm text-gray-300">
                  When angular capacity is saturated (θ ≈ 359.4°), null zones form and release photons, 
                  explaining sonoluminescence and Hawking radiation as curvature overflow events.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CurvatureFramework;