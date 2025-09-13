import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts';

const AmplitudeGeodeticSimulator = () => {
  const [frequency, setFrequency] = useState(5.8e14); // Hz (green light)
  const [curvatureRadius, setCurvatureRadius] = useState(1000); // km
  const [spacetimeDensity, setSpacetimeDensity] = useState(1.0);
  const [_observerDistance, _setObserverDistance] = useState(1.0); // meters
  const [exposureTime, setExposureTime] = useState(0.1); // seconds
  const [tissueSensitivity, setTissueSensitivity] = useState(1.0);
  const [viewMode, setViewMode] = useState('geodesic_curvature');
  const [animationTime, setAnimationTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lightframePerspective, setLightframePerspective] = useState(false);

  // Physical constants
  const c = 299792458; // m/s
  const h = 6.62607015e-34; // J⋅s
  const kB = 1.380649e-23; // J/K
  const criticalTemp = 66.63; // K

  // STO Framework constants
  const baseSequence = 297531864;
  const _energyConstant = 383.997935003;
  const _thermalBase = 319.6;
  const _mixingAngle = 7.5; // degrees
  const _rotationalGradient = 54.0; // degrees

  // Animation effect
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setAnimationTime(prev => prev + 0.1);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  // Calculate geodesic curvature parameters
  const geodesicParams = useMemo(() => {
    // Angular magnitude from frequency
    const angularMagnitude = (c * c) / frequency;
    
    // Curvature from spacetime density
    const intrinsicCurvature = spacetimeDensity / (curvatureRadius * 1000); // Convert km to m
    
    // Geodesic deviation
    const geodesicDeviation = Math.sqrt(intrinsicCurvature) * Math.sin(animationTime * frequency / baseSequence);
    
    // Amplitude as revealed curvature
    const amplitude = geodesicDeviation * Math.sqrt(h * frequency / (2 * Math.PI));
    
    return {
      angularMagnitude,
      intrinsicCurvature,
      geodesicDeviation,
      amplitude,
      wavelength: c / frequency,
      photonEnergy: h * frequency
    };
  }, [frequency, curvatureRadius, spacetimeDensity, animationTime]);

  // Calculate PICT (Pain-Indexed Coherence Threshold)
  const pictAnalysis = useMemo(() => {
    const photonEnergy = h * frequency;
    const area = Math.PI * Math.pow(0.005, 2); // 5mm diameter eye exposure area
    const focusScalar = 0.7; // Partially focused
    
    // Entropy threshold from STO framework
    const etaThreshold = (c * c * h) / (kB * Math.log(2) * criticalTemp);
    
    // PICT calculation
    const pictValue = (photonEnergy * focusScalar) / (area * exposureTime);
    const entropyRatio = pictValue / etaThreshold;
    
    // Pain level determination
    let painLevel = 0;
    let painDescription = "Subthreshold";
    
    if (entropyRatio > 0.5) painLevel = 1, painDescription = "Sensory irritation";
    if (entropyRatio > 0.75) painLevel = 2, painDescription = "Discomfort";
    if (entropyRatio > 1.0) painLevel = 3, painDescription = "Reflexive resistance";
    if (entropyRatio > 1.3) painLevel = 4, painDescription = "Tissue destabilization";
    if (entropyRatio > 1.5) painLevel = 5, painDescription = "Microdamage";
    if (entropyRatio > 2.0) painLevel = 6, painDescription = "Irreversible breakdown";
    
    return {
      photonEnergy,
      pictValue,
      etaThreshold,
      entropyRatio,
      painLevel,
      painDescription,
      safetyFactor: Math.max(0, 1 - entropyRatio)
    };
  }, [frequency, exposureTime, tissueSensitivity]);

  // Generate geodesic path visualization
  const geodesicPath = useMemo(() => {
    const points = [];
    const steps = 100;
    
    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * 4 * Math.PI + animationTime;
      const _x = t;
      
      // Flat geodesic (no curvature)
      const flatY = 0;
      
      // Curved geodesic (spacetime curvature)
      const curvatureAmplitude = geodesicParams.amplitude * 1e6; // Scale for visibility
      const curvedY = curvatureAmplitude * Math.sin(frequency * t / c + animationTime);
      
      // Observable amplitude (traditional wave view)
      const traditionalY = Math.sin(t) * 0.5;
      
      points.push({
        x: i,
        flat: flatY,
        curved: curvedY,
        traditional: traditionalY,
        phase: t,
        curvature: geodesicParams.intrinsicCurvature * Math.sin(t)
      });
    }
    
    return points;
  }, [geodesicParams, frequency, animationTime]);

  // Lightframe perspective calculation
  const lightframeView = useMemo(() => {
    if (!lightframePerspective) return null;
    
    // From photon perspective: no time, no space
    return {
      timeExperienced: 0,
      spaceTraversed: 0,
      universalConnectivity: 1,
      angularMagnitude: 0,
      curvatureVisible: "All points connected",
      informationDelay: 0
    };
  }, [lightframePerspective]);

  // Skin twisting entropy demonstration
  const skinTwistingDemo = useMemo(() => {
    const twistAngle = Math.sin(animationTime) * Math.PI / 4; // ±45 degrees
    const frictionForce = Math.abs(twistAngle) * tissueSensitivity;
    const heatGenerated = frictionForce * frictionForce; // Quadratic heating
    const staticCharge = frictionForce * 0.1; // Electrostatic buildup
    
    return {
      twistAngle: twistAngle * (180 / Math.PI), // Convert to degrees
      frictionForce,
      heatGenerated,
      staticCharge,
      entropyGenerated: heatGenerated * kB,
      informationResistance: frictionForce / Math.max(0.1, Math.abs(twistAngle))
    };
  }, [animationTime, tissueSensitivity]);

  // Electromagnetic spectrum with STO interpretation
  const emSpectrum = useMemo(() => {
    const bands = [
      { name: "Radio", freq: 1e6, color: "#FF0000" },
      { name: "Microwave", freq: 1e9, color: "#FF8000" },
      { name: "Infrared", freq: 1e12, color: "#FF0080" },
      { name: "Visible", freq: 5e14, color: "#00FF00" },
      { name: "UV", freq: 1e15, color: "#8000FF" },
      { name: "X-ray", freq: 1e18, color: "#0080FF" },
      { name: "Gamma", freq: 1e21, color: "#FFFFFF" }
    ];
    
    return bands.map(band => {
      const angularMagnitude = (c * c) / band.freq;
      const curvatureIndex = band.freq / c; // Higher freq = higher curvature visibility
      const geodesicTightness = Math.log10(band.freq / 1e6);
      
      return {
        ...band,
        angularMagnitude,
        curvatureIndex,
        geodesicTightness,
        photonEnergy: h * band.freq,
        isCurrent: Math.abs(Math.log10(band.freq) - Math.log10(frequency)) < 0.5
      };
    });
  }, [frequency]);

  return (
    <div className="w-full p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
          Amplitude as Geodesic Curvature
        </h1>
        <p className="text-center text-gray-300 mb-8">
          STO Framework: Electromagnetic oscillation as revealed spacetime curvature
        </p>

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400">Electromagnetic Parameters</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Frequency: {frequency.toExponential(2)} Hz
              </label>
              <input
                type="range"
                min="12"
                max="21"
                step="0.1"
                value={Math.log10(frequency)}
                onChange={(e) => setFrequency(Math.pow(10, parseFloat(e.target.value)))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-gray-400 mt-1">
                λ = {(c / frequency * 1e9).toFixed(2)} nm
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Spacetime Curvature Radius: {curvatureRadius} km
              </label>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={curvatureRadius}
                onChange={(e) => setCurvatureRadius(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Spacetime Density: {spacetimeDensity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={spacetimeDensity}
                onChange={(e) => setSpacetimeDensity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-green-400">PICT Analysis</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Exposure Time: {exposureTime.toFixed(3)} s
              </label>
              <input
                type="range"
                min="0.001"
                max="1.0"
                step="0.001"
                value={exposureTime}
                onChange={(e) => setExposureTime(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Tissue Sensitivity: {tissueSensitivity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={tissueSensitivity}
                onChange={(e) => setTissueSensitivity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="bg-gray-700 p-3 rounded">
              <div className="text-sm font-semibold text-yellow-400 mb-2">Current PICT Status:</div>
              <div className="text-lg font-bold" style={{
                color: pictAnalysis.painLevel === 0 ? '#10B981' :
                       pictAnalysis.painLevel <= 2 ? '#F59E0B' :
                       pictAnalysis.painLevel <= 4 ? '#EF4444' : '#DC2626'
              }}>
                Level {pictAnalysis.painLevel}: {pictAnalysis.painDescription}
              </div>
              <div className="text-xs text-gray-300 mt-1">
                Entropy Ratio: {pictAnalysis.entropyRatio.toFixed(3)}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">Geodesic Properties</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Angular Magnitude:</span>
                <span className="font-mono">{geodesicParams.angularMagnitude.toExponential(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Intrinsic Curvature:</span>
                <span className="font-mono">{geodesicParams.intrinsicCurvature.toExponential(3)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Revealed Amplitude:</span>
                <span className="font-mono text-cyan-400">{geodesicParams.amplitude.toExponential(3)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Photon Energy:</span>
                <span className="font-mono">{geodesicParams.photonEnergy.toExponential(3)} J</span>
              </div>
              
              <div className="flex justify-between">
                <span>Wavelength:</span>
                <span className="font-mono">{geodesicParams.wavelength.toExponential(3)} m</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="lightframe"
                  checked={lightframePerspective}
                  onChange={(e) => setLightframePerspective(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="lightframe" className="text-sm">Lightframe Perspective</label>
              </div>
              
              {lightframeView && (
                <div className="bg-gray-700 p-2 rounded text-xs">
                  <div className="text-purple-400 font-semibold">From Photon's View:</div>
                  <div>Time: {lightframeView.timeExperienced} s</div>
                  <div>Space: {lightframeView.spaceTraversed} m</div>
                  <div>All points: Connected</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Simulation Control</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">View Mode</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="geodesic_curvature">Geodesic Curvature</option>
                <option value="pict_analysis">PICT Analysis</option>
                <option value="em_spectrum">EM Spectrum STO</option>
                <option value="skin_twisting">Skin Twisting Demo</option>
                <option value="lightframe">Lightframe Theory</option>
              </select>
            </div>

            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors mb-2"
            >
              {isAnimating ? 'Pause' : 'Start'} Animation
            </button>

            <button
              onClick={() => setAnimationTime(0)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Reset
            </button>

            <div className="mt-4 text-xs text-gray-300">
              <div className="text-yellow-400 font-semibold mb-1">Key Insight:</div>
              <p>Amplitude is not field oscillation but revealed geodesic curvature through spacetime.</p>
            </div>
          </div>
        </div>

        {/* Visualization Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {viewMode === 'geodesic_curvature' && (
            <>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">Geodesic Path Comparison</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={geodesicPath} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                      <Line type="monotone" dataKey="flat" stroke="#6B7280" name="Flat Spacetime" strokeDasharray="5 5" dot={false} />
                      <Line type="monotone" dataKey="curved" stroke="#06B6D4" name="Curved Geodesic (STO)" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="traditional" stroke="#F59E0B" name="Traditional Wave" strokeWidth={1} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-green-400">Curvature Deviation</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={geodesicPath} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                      <Area dataKey="curvature" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-gray-300">
                  <p>Shows spacetime curvature deviation that manifests as observable amplitude.</p>
                </div>
              </div>
            </>
          )}

          {viewMode === 'pict_analysis' && (
            <>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-red-400">PICT Pain Scale</h3>
                <div className="space-y-4">
                  {[0, 1, 2, 3, 4, 5, 6].map(level => {
                    const isActive = pictAnalysis.painLevel === level;
                    const descriptions = [
                      "Subthreshold", "Sensory irritation", "Discomfort", 
                      "Reflexive resistance", "Tissue destabilization", 
                      "Microdamage", "Irreversible breakdown"
                    ];
                    
                    return (
                      <div key={level} className={`p-3 rounded ${isActive ? 'bg-red-900 border border-red-400' : 'bg-gray-700'}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Level {level}</span>
                          <span className="text-sm">{descriptions[level]}</span>
                        </div>
                        {isActive && (
                          <div className="mt-2 text-sm text-red-300">
                            Current entropy ratio: {pictAnalysis.entropyRatio.toFixed(3)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-orange-400">Entropy Threshold Analysis</h3>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-yellow-400 mb-2">Current Exposure:</div>
                    <div className="text-xs space-y-1">
                      <div>Photon Energy: {pictAnalysis.photonEnergy.toExponential(3)} J</div>
                      <div>PICT Value: {pictAnalysis.pictValue.toExponential(3)}</div>
                      <div>η Threshold: {pictAnalysis.etaThreshold.toExponential(3)}</div>
                      <div>Safety Factor: {pictAnalysis.safetyFactor.toFixed(3)}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-green-400 mb-2">Universal Applications:</div>
                    <div className="text-xs space-y-1 text-gray-300">
                      <p>• Cross-species optical safety</p>
                      <p>• AI sensor calibration</p>
                      <p>• Biological damage assessment</p>
                      <p>• Interstellar communication limits</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {viewMode === 'em_spectrum' && (
            <>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">EM Spectrum Geodesic Properties</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={emSpectrum} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="geodesicTightness" stroke="#9CA3AF" />
                      <YAxis dataKey="curvatureIndex" stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Scatter fill="#3B82F6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Spectrum Analysis</h3>
                <div className="space-y-3">
                  {emSpectrum.map((band, idx) => (
                    <div key={idx} className={`p-3 rounded ${band.isCurrent ? 'bg-purple-900 border border-purple-400' : 'bg-gray-700'}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold" style={{ color: band.color }}>{band.name}</span>
                        <span className="text-xs">{band.freq.toExponential(1)} Hz</span>
                      </div>
                      <div className="text-xs text-gray-300 mt-1">
                        Angular Magnitude: {band.angularMagnitude.toExponential(2)}
                      </div>
                      <div className="text-xs text-gray-300">
                        Geodesic Tightness: {band.geodesicTightness.toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {viewMode === 'skin_twisting' && (
            <>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-red-400">Skin Twisting Entropy Demo</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[{
                      time: animationTime,
                      twistAngle: skinTwistingDemo.twistAngle,
                      frictionForce: skinTwistingDemo.frictionForce * 10,
                      heatGenerated: skinTwistingDemo.heatGenerated * 100,
                      staticCharge: skinTwistingDemo.staticCharge * 1000
                    }]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
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
                      <Line type="monotone" dataKey="twistAngle" stroke="#EF4444" name="Twist Angle (°)" strokeWidth={2} />
                      <Line type="monotone" dataKey="frictionForce" stroke="#F59E0B" name="Friction (×10)" strokeWidth={2} />
                      <Line type="monotone" dataKey="heatGenerated" stroke="#DC2626" name="Heat (×100)" strokeWidth={2} />
                      <Line type="monotone" dataKey="staticCharge" stroke="#8B5CF6" name="Static (×1000)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-orange-400">Entropic Transfer Analysis</h3>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-red-400 mb-2">Current State:</div>
                    <div className="text-xs space-y-1">
                      <div>Twist Angle: {skinTwistingDemo.twistAngle.toFixed(1)}°</div>
                      <div>Friction Force: {skinTwistingDemo.frictionForce.toFixed(3)}</div>
                      <div>Heat Generated: {skinTwistingDemo.heatGenerated.toFixed(3)}</div>
                      <div>Static Charge: {skinTwistingDemo.staticCharge.toFixed(3)}</div>
                      <div>Entropy Generated: {skinTwistingDemo.entropyGenerated.toExponential(3)} J/K</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-yellow-400 mb-2">Physical Demonstration:</div>
                    <div className="text-xs space-y-1 text-gray-300">
                      <p>• Motion → Information propagation</p>
                      <p>• Friction → Spacetime resistance</p>
                      <p>• Heat → Energy from time compression</p>
                      <p>• Static → Electromagnetic geodesic</p>
                      <p>• Pain → Universal entropy threshold</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theoretical Framework Summary */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-red-400">STO Electromagnetic Framework</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-cyan-400">Core Reinterpretation</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• Amplitude = Revealed geodesic curvature</p>
                <p>• Light follows curved null paths</p>
                <p>• Oscillation from spacetime geometry</p>
                <p>• No intrinsic field properties needed</p>
                <p>• Einstein + Maxwell unified</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-green-400">PICT Universal Standard</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• Pain as entropy threshold indicator</p>
                <p>• Cross-species optical safety</p>
                <p>• η = C²h/(kBLn2T) threshold</p>
                <p>• Universal damage assessment</p>
                <p>• Biological-physical bridge</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-purple-400">Lightframe Perspective</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• θ = 0: No time, no space for photons</p>
                <p>• All points connected at c</p>
                <p>• Absolute frame (Newton) at lightspeed</p>
                <p>• Curvature = deviation from lightframe</p>
                <p>• Information resistance as entropy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmplitudeGeodeticSimulator;