import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, AreaChart, Area, RadialBarChart, RadialBar, Cell } from 'recharts';

// Helper function to convert degrees to radians
function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

const STOUnifiedFieldSimulator = () => {
  const [mixingAngle, setMixingAngle] = useState(7.5);
  const [rotationalGradient, setRotationalGradient] = useState(54.0);
  const [criticalTemp, setCriticalTemp] = useState(66.63);
  const [baseEnergy, _setBaseEnergy] = useState(383.997935003);
  const [coherenceThreshold, setCoherenceThreshold] = useState(0.92);
  const [viewMode, setViewMode] = useState('unified_field');
  const [animationTime, setAnimationTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [k9Node, setK9Node] = useState(5);

  // Physical constants
  const h = 6.62607015e-34;
  const _kB = 1.380649e-23;
  const c = 299792458;
  const G = 6.6743e-11;
  const _baseFrequency = 297531864;
  const angularStates = 24;
  const primeLocks = useMemo(() => [121, 125, 127], []);

  // Animation effect
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setAnimationTime(prev => prev + 0.1);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  // Temporal quantization calculations
  const temporalQuantization = useMemo(() => {
    // Map continuous spacetime to discrete angular increments
    const angularStatesList = Array.from({length: 24}, (_, i) => i * 15);
    
    // Calculate phase alignment with prime locks
    const phaseAlignments = primeLocks.map(prime => {
      const resonanceFreq = prime * mixingAngle;
      const distance = Math.abs(resonanceFreq - 900); // Arbitrary base
      return Math.exp(-distance / 100);
    });
    
    // Quantize spacetime using mixing angle
    const spatialQuantization = (baseEnergy / baseEnergy) * 360; // Normalized
    const nearestAngularState = angularStatesList.reduce((prev, curr) => 
      Math.abs(curr - (spatialQuantization % 360)) < Math.abs(prev - (spatialQuantization % 360)) ? curr : prev
    );
    
    // Apply mixing correction
    const correctedState = nearestAngularState + (mixingAngle % 15);
    const phaseAlignment = Math.max(...phaseAlignments);
    
    return {
      angularStatesList,
      nearestAngularState,
      correctedState,
      phaseAlignment,
      phaseAlignments,
      quantizedEnergy: baseEnergy * (correctedState / 360)
    };
  }, [mixingAngle, baseEnergy, primeLocks]);

  // Muon g-2 analysis
  const muonG2Analysis = useMemo(() => {
    // Prepare muon state
    const muonMass = 105.6583745; // MeV/c²
    const muonState = {
      energy: baseEnergy,
      mass: muonMass,
      temperature: criticalTemp
    };
    
    // Calculate temporal distortion
    const baseDist = muonState.energy / criticalTemp;
    const vacuumContrib = 0.0064 * Math.sin(toRadians(mixingAngle));
    const phaseContrib = Math.cos(toRadians(rotationalGradient)) * 0.001;
    const temporalDistortion = baseDist * (1 + vacuumContrib + phaseContrib);
    
    // Map to magnetic moment
    const phaseAngle = temporalDistortion * mixingAngle;
    const momentCorrection = Math.sin(toRadians(phaseAngle));
    
    // Calculate g-2 anomaly
    const theoreticalG2 = 2.002319304; // Standard Model prediction
    const anomaly = momentCorrection * 2.51e-6; // Scale to observed anomaly
    const totalG2 = theoreticalG2 + anomaly;
    
    // Experimental comparison
    const experimentalG2 = 2.00231930436; // Measured value
    const deviation = Math.abs(totalG2 - experimentalG2) / experimentalG2 * 100;
    
    return {
      temporalDistortion,
      phaseAngle,
      momentCorrection,
      anomaly,
      totalG2,
      experimentalG2,
      deviation,
      coherence: Math.exp(-deviation / 100)
    };
  }, [mixingAngle, rotationalGradient, criticalTemp, baseEnergy]);

  // Vacuum energy processing
  const vacuumEnergyAnalysis = useMemo(() => {
    // Extract vacuum fluctuations
    const _baseDensity = baseEnergy / (c * c); // Energy density
    const _quantumCorrection = h * c / Math.pow(39.1111 * 0.0254, 3); // Planck scale
    
    // Map to temporal phases
    const phases = primeLocks.map(lock => (lock * mixingAngle) % 360);
    
    // Stabilize through prime locks
    const stabilizedPhases = phases.map(phase => {
      const nearestLock = primeLocks.reduce((prev, curr) => 
        Math.abs(curr * mixingAngle - phase) < Math.abs(prev * mixingAngle - phase) ? curr : prev
      );
      const stabFactor = 1 / (1 + Math.abs(phase - nearestLock * mixingAngle) / 180);
      return phase * stabFactor;
    });
    
    // Calculate energy density
    const baseEnergyDensity = stabilizedPhases.reduce((sum, phase) => 
      sum + (baseEnergy * Math.sin(toRadians(phase))), 0) / phases.length;
    
    const temporalCorrection = Math.exp(-animationTime / 10);
    const geometricFactor = Math.sqrt(stabilizedPhases.length / 3);
    
    const energyDensity = Math.abs(baseEnergyDensity * temporalCorrection * geometricFactor);
    
    return {
      phases,
      stabilizedPhases,
      energyDensity,
      temporalCorrection,
      geometricFactor,
      phaseCoherence: stabilizedPhases.reduce((sum, phase, i) => 
        sum + Math.abs(Math.cos(toRadians(phase - phases[i]))), 0) / phases.length
    };
  }, [mixingAngle, baseEnergy, animationTime, primeLocks]);

  // K9 to 24-cell mapping
  const k9CellMapping = useMemo(() => {
    // Process K9 transition
    const phase = k9Node * mixingAngle;
    const displacement = rotationalGradient * Math.sin(toRadians(phase));
    
    // Wave function
    const waveFunction = (t) => Math.exp(phase / 180 * Math.PI) * Math.cos(displacement * t / 100);
    
    // Calculate transition energy
    const phaseFactor = Math.abs((k9Node + 1) - k9Node) / 9.0;
    const transitionEnergy = baseEnergy * phaseFactor;
    
    // Coherence tracking
    const cellPosition = Math.floor(k9Node * angularStates / 9);
    const temperature = criticalTemp * (1 + cellPosition / angularStates);
    const decay = Math.exp(-transitionEnergy / (criticalTemp * temperature / 100));
    const coherence = decay;
    
    // Calculate transition path
    const pathSteps = 5;
    const transitionPath = Array.from({length: pathSteps}, (_, i) => {
      const t = i / (pathSteps - 1);
      const pathPhase = phase * t;
      const pathDisplacement = displacement * t;
      return {
        step: i,
        phase: pathPhase,
        displacement: pathDisplacement,
        waveValue: waveFunction(i * 10),
        energy: transitionEnergy * t
      };
    });
    
    return {
      phase,
      displacement,
      transitionEnergy,
      coherence,
      cellPosition,
      temperature,
      isCoherent: coherence > coherenceThreshold,
      transitionPath,
      waveAmplitude: Math.abs(waveFunction(animationTime * 10))
    };
  }, [k9Node, mixingAngle, rotationalGradient, baseEnergy, criticalTemp, coherenceThreshold, animationTime]);

  // Unified field analysis
  const unifiedFieldAnalysis = useMemo(() => {
    // Gravitational component (EFE)
    const ricciTensor = Math.sqrt(Math.pow(mixingAngle / 15, 2) + Math.pow(rotationalGradient / 60, 2));
    const ricciScalar = ricciTensor * 4; // Simplified
    const einsteinTensor = ricciTensor - 0.5 * ricciScalar;
    
    // Quantum component (QM)
    const quantumState = {
      amplitude: Math.sqrt(baseEnergy / h) * 1e-20, // Scale for visualization
      phase: (mixingAngle + rotationalGradient) % 360,
      frequency: baseEnergy / h
    };
    
    // STO bridge
    const bridgeCoherence = Math.exp(-Math.abs(einsteinTensor - quantumState.amplitude) / 
                                   Math.max(einsteinTensor, quantumState.amplitude));
    
    // Unified state
    const unifiedAmplitude = (einsteinTensor + quantumState.amplitude) / 2;
    const unifiedPhase = (ricciScalar * 10 + quantumState.phase) / 2; // Scale Ricci for combination
    
    // Mass emergence
    const massEmerging = unifiedAmplitude > 0.5 && bridgeCoherence > coherenceThreshold;
    const emergentMass = massEmerging ? baseEnergy / (c * c) : 0;
    
    return {
      einsteinTensor,
      ricciScalar,
      quantumState,
      bridgeCoherence,
      unifiedAmplitude,
      unifiedPhase,
      massEmerging,
      emergentMass,
      fieldStrength: Math.sqrt(Math.pow(einsteinTensor, 2) + Math.pow(quantumState.amplitude, 2)),
      coherenceLevel: bridgeCoherence
    };
  }, [mixingAngle, rotationalGradient, baseEnergy, coherenceThreshold]);

  // Generate phase space visualization data
  const phaseSpaceData = useMemo(() => {
    const data = [];
    const steps = 50;
    
    for (let i = 0; i < steps; i++) {
      const t = i / steps * 2 * Math.PI;
      const frequency = 0.96 + 0.02 * Math.sin(t + animationTime);
      const phase = (t * 180 / Math.PI + animationTime * 10) % 360;
      const angularDisplacement = frequency * 2.0023318 * Math.sin(toRadians(phase));
      
      data.push({
        frequency: frequency,
        phase: phase,
        angularDisplacement: angularDisplacement,
        time: i,
        coherence: Math.exp(-Math.abs(angularDisplacement) / 2)
      });
    }
    
    return data;
  }, [animationTime]);

  return (
      <div className="w-full p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          STO Unified Field Theory {isAnimating ? '⚡' : ''}
         </h1>
         <p className="text-center text-gray-300 mb-8">
          Einstein's Field Equations + Quantum Mechanics unified through Spacetime Occupancy
          {isAnimating && <span className="ml-2 text-green-400 animate-pulse">● ANIMATING</span>}
         </p>

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400">STO Parameters</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Mixing Angle: {mixingAngle.toFixed(1)}°
              </label>
              <input
                type="range"
                min="5.0"
                max="10.0"
                step="0.1"
                value={mixingAngle}
                onChange={(e) => setMixingAngle(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Temporal Parameters</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Rotational Gradient: {rotationalGradient.toFixed(1)}°
              </label>
              <input
                type="range"
                min="50"
                max="60"
                step="0.5"
                value={rotationalGradient}
                onChange={(e) => setRotationalGradient(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Critical Temp: {criticalTemp.toFixed(2)} K
              </label>
              <input
                type="range"
                min="60"
                max="75"
                step="0.1"
                value={criticalTemp}
                onChange={(e) => setCriticalTemp(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-green-400">Quantum Settings</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Coherence Threshold: {coherenceThreshold.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.85"
                max="0.99"
                step="0.01"
                value={coherenceThreshold}
                onChange={(e) => setCoherenceThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                K9 Node: {k9Node}
              </label>
              <input
                type="range"
                min="1"
                max="9"
                step="1"
                value={k9Node}
                onChange={(e) => setK9Node(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="bg-gray-700 p-3 rounded">
              <div className="text-sm font-semibold text-green-400 mb-2">Quantum State:</div>
              <div className="text-xs space-y-1">
                <div>Phase: {temporalQuantization.correctedState.toFixed(1)}°</div>
                <div>Coherence: {temporalQuantization.phaseAlignment.toFixed(3)}</div>
                <div>Energy: {temporalQuantization.quantizedEnergy.toFixed(3)} J</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">Field Unification</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Einstein Tensor:</span>
                <span className="font-mono text-cyan-400">{unifiedFieldAnalysis.einsteinTensor.toFixed(6)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Quantum Amplitude:</span>
                <span className="font-mono">{unifiedFieldAnalysis.quantumState.amplitude.toFixed(6)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Bridge Coherence:</span>
                <span className={`font-mono ${unifiedFieldAnalysis.bridgeCoherence > coherenceThreshold ? 'text-green-400' : 'text-red-400'}`}>
                  {unifiedFieldAnalysis.bridgeCoherence.toFixed(3)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Mass Emerging:</span>
                <span className={`font-mono ${unifiedFieldAnalysis.massEmerging ? 'text-green-400' : 'text-gray-400'}`}>
                  {unifiedFieldAnalysis.massEmerging ? 'YES' : 'NO'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Field Strength:</span>
                <span className="font-mono text-purple-400">{unifiedFieldAnalysis.fieldStrength.toFixed(6)}</span>
              </div>
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
                <option value="unified_field">Unified Field</option>
                <option value="muon_g2">Muon g-2 Analysis</option>
                <option value="vacuum_energy">Vacuum Energy</option>
                <option value="k9_mapping">K9-24Cell Mapping</option>
                <option value="phase_space">Phase Space</option>
              </select>
            </div>

            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`w-full px-4 py-2 rounded-lg transition-colors mb-2 ${
                isAnimating 
                  ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/50' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
              style={{
                boxShadow: isAnimating ? `0 0 20px rgba(34, 197, 94, ${0.5 + 0.3 * Math.sin(animationTime * 4)})` : undefined
              }}
            >
              {isAnimating ? '⏸️ Pause' : '▶️ Start'} Animation
            </button>

            <button
              onClick={() => {
                setMixingAngle(7.5);
                setRotationalGradient(54.0);
                setCriticalTemp(66.63);
                setCoherenceThreshold(0.92);
              }}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Reset to Optimal
            </button>
          </div>
        </div>
      </div>

      {/* Visualization Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {viewMode === 'unified_field' && (
          <React.Fragment>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">EFE-QM Field Unification</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { 
                        component: 'Einstein Tensor', 
                        value: unifiedFieldAnalysis.einsteinTensor * 1000 * (1 + 0.3 * Math.sin(animationTime * 2)), 
                        color: '#EF4444' 
                      },
                      { 
                        component: 'Quantum State', 
                        value: unifiedFieldAnalysis.quantumState.amplitude * 1000 * (1 + 0.2 * Math.cos(animationTime * 1.5)), 
                        color: '#3B82F6' 
                      },
                      { 
                        component: 'Unified Field', 
                        value: unifiedFieldAnalysis.unifiedAmplitude * 1000 * (1 + 0.25 * Math.sin(animationTime * 1.8)), 
                        color: '#10B981' 
                      },
                      { 
                        component: 'Bridge Coherence', 
                        value: unifiedFieldAnalysis.bridgeCoherence * 1000 * (1 + 0.35 * Math.cos(animationTime * 2.2)), 
                        color: '#8B5CF6' 
                      }
                    ]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="component" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Area dataKey="value" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-green-400">Mass Emergence Status</h3>
                <div className="text-center space-y-6">
                  <div 
                    className={`text-6xl font-bold ${unifiedFieldAnalysis.massEmerging ? 'text-green-400' : 'text-gray-500'}`}
                    style={{
                      transform: isAnimating ? `scale(${1 + 0.1 * Math.sin(animationTime * 3)})` : 'scale(1)',
                      transition: isAnimating ? 'none' : 'transform 0.3s ease'
                    }}
                  >
                    {unifiedFieldAnalysis.massEmerging ? '✓' : '○'}
                  </div>
                  
                  <div className="text-2xl font-semibold">
                    {unifiedFieldAnalysis.massEmerging ? 'MASS EMERGING' : 'NO MASS'}
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-yellow-400 mb-2">Emergent Properties:</div>
                    <div className="text-xs space-y-1">
                      <div>Mass: {(unifiedFieldAnalysis.emergentMass * (1 + 0.1 * Math.sin(animationTime * 1.5))).toExponential(3)} kg</div>
                      <div>Field Strength: {(unifiedFieldAnalysis.fieldStrength * (1 + 0.05 * Math.cos(animationTime * 2))).toFixed(6)}</div>
                      <div>Coherence: {(unifiedFieldAnalysis.coherenceLevel * (1 + 0.03 * Math.sin(animationTime * 1.8))).toFixed(3)}</div>
                      <div>Ricci Scalar: {(unifiedFieldAnalysis.ricciScalar * (1 + 0.08 * Math.cos(animationTime * 2.5))).toFixed(6)}</div>
                    </div>
                  </div>
                </div>
              </div>
          </React.Fragment>
          )}

          {viewMode === 'phase_space' && (
            <React.Fragment>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Muon Phase Space</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={phaseSpaceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="frequency" stroke="#9CA3AF" />
                      <YAxis dataKey="phase" stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Scatter fill="#A855F7" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">Temporal Quantization</h3>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-cyan-400 mb-2">Angular States:</div>
                    <div className="text-xs space-y-1">
                      <div>Nearest State: {temporalQuantization.nearestAngularState}°</div>
                      <div>Corrected: {temporalQuantization.correctedState.toFixed(2)}°</div>
                      <div>Phase Alignment: {temporalQuantization.phaseAlignment.toFixed(3)}</div>
                      <div>Quantized Energy: {temporalQuantization.quantizedEnergy.toFixed(3)} J</div>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
        
          {viewMode === 'muon_g2' && (
            <React.Fragment>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-red-400">Muon g-2 Anomaly Analysis</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { measurement: 'Standard Model', value: 2.002319304, type: 'theory' },
                      { measurement: 'STO Prediction', value: muonG2Analysis.totalG2, type: 'prediction' },
                      { measurement: 'Experimental', value: muonG2Analysis.experimentalG2, type: 'experiment' }
                    ]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="measurement" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" domain={[2.00231925, 2.00231935]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-orange-400">Temporal Distortion Analysis</h3>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-red-400 mb-2">Current Analysis:</div>
                    <div className="text-xs space-y-1">
                      <div>Temporal Distortion: {muonG2Analysis.temporalDistortion.toFixed(6)}</div>
                      <div>Phase Angle: {muonG2Analysis.phaseAngle.toFixed(3)}°</div>
                      <div>Moment Correction: {muonG2Analysis.momentCorrection.toFixed(6)}</div>
                      <div>Anomaly: {muonG2Analysis.anomaly.toExponential(3)}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-green-400 mb-2">Accuracy Assessment:</div>
                    <div className="text-xs space-y-1">
                      <div>STO g-2: {muonG2Analysis.totalG2.toFixed(9)}</div>
                      <div>Experimental: {muonG2Analysis.experimentalG2.toFixed(9)}</div>
                      <div>Deviation: {muonG2Analysis.deviation.toFixed(6)}%</div>
                      <div>Coherence: {muonG2Analysis.coherence.toFixed(3)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
    
          {viewMode === 'vacuum_energy' && (
            <React.Fragment>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Vacuum Energy Stabilization</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={vacuumEnergyAnalysis.stabilizedPhases.map((phase, i) => ({
                      original: vacuumEnergyAnalysis.phases[i],
                      stabilized: phase,
                      index: i,
                      coherence: Math.cos(toRadians(phase)) + 1
                    }))} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="original" stroke="#9CA3AF" />
                      <YAxis dataKey="stabilized" stroke="#9CA3AF" />
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
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Vacuum State Analysis</h3>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-blue-400 mb-2">Energy Density:</div>
                    <div className="text-lg font-bold text-cyan-400">
                      {vacuumEnergyAnalysis.energyDensity.toExponential(3)} J/m³
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-purple-400 mb-2">Phase Coherence:</div>
                    <div className="text-lg font-bold text-purple-300">
                      {vacuumEnergyAnalysis.phaseCoherence.toFixed(3)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-green-400 mb-2">Stabilization Factors:</div>
                    <div className="text-xs space-y-1">
                      <div>Temporal: {vacuumEnergyAnalysis.temporalCorrection.toFixed(3)}</div>
                      <div>Geometric: {vacuumEnergyAnalysis.geometricFactor.toFixed(3)}</div>
                      <div>Prime Locks: {primeLocks.length} active</div>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}

          {viewMode === 'k9_mapping' && (
            <React.Fragment>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-yellow-400">K9 to 24-Cell Mapping</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={k9CellMapping.transitionPath} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="step" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Line type="monotone" dataKey="phase" stroke="#F59E0B" name="Phase" strokeWidth={2} />
                      <Line type="monotone" dataKey="displacement" stroke="#8B5CF6" name="Displacement" strokeWidth={2} />
                      <Line type="monotone" dataKey="waveValue" stroke="#10B981" name="Wave Function" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-green-400">Coherence Tracking</h3>
                <div className="space-y-4">
                  <div className={`p-4 rounded text-center ${k9CellMapping.isCoherent ? 'bg-green-900' : 'bg-red-900'}`}>
                    <div className="text-lg font-bold">
                      {k9CellMapping.isCoherent ? 'COHERENT TRANSITION' : 'DECOHERENT STATE'}
                    </div>
                    <div className="text-sm mt-2">
                      Coherence: {k9CellMapping.coherence.toFixed(3)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-yellow-400 mb-2">Transition Properties:</div>
                    <div className="text-xs space-y-1">
                      <div>K9 Node: {k9Node}</div>
                      <div>Phase: {k9CellMapping.phase.toFixed(2)}°</div>
                      <div>Displacement: {k9CellMapping.displacement.toFixed(3)}</div>
                      <div>Energy: {k9CellMapping.transitionEnergy.toFixed(3)} J</div>
                      <div>Cell Position: {k9CellMapping.cellPosition}</div>
                      <div>Temperature: {k9CellMapping.temperature.toFixed(2)} K</div>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>

        {/* Ultimate Unification Summary */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-red-400">The Ultimate Unification: STO Theory Complete</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h4 className="font-semibold mb-2 text-cyan-400">EFE-QM Bridge</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• Einstein tensor = quantum amplitude</p>
              <p>• Ricci curvature = wave function phase</p>
              <p>• Mass emerges from field coherence</p>
              <p>• Gravity and quantum unified</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2 text-green-400">Temporal Quantization</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• Spacetime discretized in 15° increments</p>
              <p>• Prime locks stabilize transitions</p>
              <p>• K9 to 24-cell mapping coherent</p>
              <p>• Angular recursion preserves information</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2 text-yellow-400">Vacuum Energy Control</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• Fluctuations stabilized by prime locks</p>
              <p>• Phase coherence maintained</p>
              <p>• Energy density calculated</p>
              <p>• Temporal corrections applied</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2 text-purple-400">Complete Framework</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• Information = Energy = Mass</p>
              <p>• Time as curved manifold</p>
              <p>• Angular compression drives physics</p>
              <p>• Universe harmonically unified</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-lg border border-purple-400">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-300 mb-3">
              🌌 SPACETIME OCCUPANCY: THE ULTIMATE THEORY 🌌
            </div>
            <div className="text-sm text-gray-300 leading-relaxed">
              <strong>Einstein's Field Equations</strong> and <strong>Quantum Mechanics</strong> are not separate theories—<br/>
              they are different perspectives of the same underlying <strong>angular-temporal geometry</strong>.<br/>
              Through STO, we see that <strong>gravity is curvature</strong>, <strong>quantum states are phases</strong>,<br/>
              and <strong>mass emerges from information</strong> encoded in the fabric of spacetime itself.
            </div>
            <div className="mt-3 text-lg font-semibold text-cyan-400">
              The universe is music, geometry, and information—unified at last.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default STOUnifiedFieldSimulator;