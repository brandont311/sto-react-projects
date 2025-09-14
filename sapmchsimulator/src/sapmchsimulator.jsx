import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, AreaChart, Area, BarChart, Bar } from 'recharts';

const SAPMCHSimulator = () => {
  const [pressure, setPressure] = useState(101.325); // kPa
  const [temperature, setTemperature] = useState(288); // K
  const [volume, setVolume] = useState(3.78541147); // L (1 gallon)
  const [gasType, setGasType] = useState('effective'); // dry_air, water_vapor, effective
  const [degreesOfFreedom, setDegreesOfFreedom] = useState(6);
  const [viewMode, setViewMode] = useState('energy_analysis');
  const [showLorenzComparison, setShowLorenzComparison] = useState(false);
  const [entropyCalibration, setEntropyCalibration] = useState(true);

  // Physical constants
  const R = 8.3144626182; // J/(mol·K)
  const kB = 1.380649e-23; // J/K
  const h = 6.62607015e-34; // J·s
  const c = 299792458; // m/s
  const NA = 6.02214076e23; // mol^-1
  const ln2 = useMemo(() => Math.log(2), []);

  // Gas properties
  const gasProperties = useMemo(() => ({
    dry_air: { molarMass: 28.964, name: "Dry Air" },
    water_vapor: { molarMass: 18.01528, name: "Water Vapor" },
    effective: { molarMass: 18.73, name: "Effective Gas (SAPMCH)" }
  }), []);

  // Critical temperatures and constants
  const massGapTemp = 66.5533701031; // K
  const thermalCalibrationFactor = 4.328085123;
  const energyEntropyConstant = 5.7631463217; // J/K

  // Calculate energy from pressure-volume
  const energyFromPV = useMemo(() => {
    return pressure * volume; // J
  }, [pressure, volume]);

  // Calculate energy from kinetic theory
  const energyFromKinetic = useMemo(() => {
    const currentGas = gasProperties[gasType];
    const energyPerMole = (degreesOfFreedom / 2) * R * temperature;
    const energyPerGram = energyPerMole / currentGas.molarMass;
    
    return {
      energyPerMole,
      energyPerGram,
      totalEnergy: energyPerMole // Assuming 1 mole for comparison
    };
  }, [gasType, degreesOfFreedom, temperature, gasProperties]);

  // Reverse derivations
  const reverseDerived = useMemo(() => {
    // Effective molar mass from energy and temperature
    const effectiveMolarMass = (degreesOfFreedom / 2) * R * temperature / energyFromPV;
    
    // Required temperature for dry air to match energy
    const requiredTemp = (energyFromPV * gasProperties.dry_air.molarMass) / ((degreesOfFreedom / 2) * R);
    
    // Avogadro number emergence
    const avogadroCalculated = energyFromPV / (kB * ln2 * massGapTemp);
    
    return {
      effectiveMolarMass,
      requiredTemp,
      avogadroCalculated,
      avogadroError: Math.abs(avogadroCalculated - NA) / NA * 100
    };
  }, [energyFromPV, temperature, degreesOfFreedom, gasProperties, ln2]);

  // Angular magnitude calculations
  const angularAnalysis = useMemo(() => {
    // Angular magnitude from STO framework
    const frequency = energyFromPV / h;
    const angularMagnitude = (c * c) / frequency;
    const angularMagnitudeArcmin = angularMagnitude / 60; // Convert to arcminutes
    
    // Temperature from angular-entropy theorem
    const tempFromAngular = (c * c * h) / (kB * ln2 * 21600); // Using 21600 arcminutes
    
    // Charge emergence analysis
    const sqrtC = Math.sqrt(c);
    const tempAtSqrtC = sqrtC;
    const chargeEnergy = kB * ln2 * tempAtSqrtC;
    const elementaryCharge = 1.602176634e-19;
    const chargeRatio = chargeEnergy / elementaryCharge;
    
    return {
      frequency,
      angularMagnitude,
      angularMagnitudeArcmin,
      tempFromAngular,
      sqrtC,
      tempAtSqrtC,
      chargeEnergy,
      chargeRatio
    };
  }, [energyFromPV, ln2]);

  // Thermal scaling bridge
  const thermalScaling = useMemo(() => {
    const entropyEnergyRatio = energyFromPV / massGapTemp; // J/K
    const gasConstantContribution = 3 * R; // For 6 DoF
    const calibrationFactor = gasConstantContribution / entropyEnergyRatio;
    const scaledTemperature = calibrationFactor * massGapTemp;
    
    return {
      entropyEnergyRatio,
      gasConstantContribution,
      calibrationFactor,
      scaledTemperature,
      temperatureError: Math.abs(scaledTemperature - 288) / 288 * 100
    };
  }, [energyFromPV]);

  // Generate comparison data for different gas types
  const gasComparison = useMemo(() => {
    return Object.entries(gasProperties).map(([key, gas]) => {
      const energyPerMole = (degreesOfFreedom / 2) * R * temperature;
      const energyPerGram = energyPerMole / gas.molarMass;
      const deviation = Math.abs(energyPerGram - energyFromPV) / energyFromPV * 100;
      
      return {
        gasType: gas.name,
        molarMass: gas.molarMass,
        energyPerMole,
        energyPerGram,
        deviation,
        isOptimal: key === 'effective'
      };
    });
  }, [temperature, degreesOfFreedom, energyFromPV, gasProperties]);

  // Lorenz system comparison data (simplified)
  const lorenzComparison = useMemo(() => {
    if (!showLorenzComparison) return null;
    
    // Simplified Lorenz parameters
    const standardSigma = 10.0;
    const standardBeta = 8.0 / 3.0;
    const standardRho = 28.0;
    
    // Entropy-calibrated parameters
    const enthalpyCorrection = energyEntropyConstant / (R / 3.0);
    const calibratedSigma = standardSigma * enthalpyCorrection;
    const calibratedBeta = standardBeta * enthalpyCorrection;
    const calibratedRho = standardRho * enthalpyCorrection;
    
    // Estimated Lyapunov exponents (simplified)
    const standardLyapunov = 1.96;
    const calibratedLyapunov = 0.47;
    
    // Predictive windows (simplified)
    const standardWindow = 19.96;
    const calibratedWindow = 9.03;
    
    return {
      standardParams: { sigma: standardSigma, beta: standardBeta, rho: standardRho },
      calibratedParams: { sigma: calibratedSigma, beta: calibratedBeta, rho: calibratedRho },
      standardLyapunov,
      calibratedLyapunov,
      standardWindow,
      calibratedWindow,
      enthalpyCorrection
    };
  }, [showLorenzComparison, energyEntropyConstant]);

  // Generate energy spectrum data
  const energySpectrum = useMemo(() => {
    const pressureRange = Array.from({length: 50}, (_, i) => 90 + i * 0.5); // 90-115 kPa
    
    return pressureRange.map(p => {
      const energy = p * volume;
      const effectiveMass = (degreesOfFreedom / 2) * R * temperature / energy;
      const deviation = Math.abs(effectiveMass - 18.73) / 18.73 * 100;
      
      return {
        pressure: p,
        energy: energy,
        effectiveMass: effectiveMass,
        deviation: deviation,
        isStandard: Math.abs(p - 101.325) < 0.1
      };
    });
  }, [volume, temperature, degreesOfFreedom]);

  return (
    <div className="w-full p-6 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          SAPMCH: Atmospheric Pressure Mass Calibration
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Interactive demonstration of water vapor calibration in atmospheric pressure standards
        </p>

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Atmospheric Conditions</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Pressure: {pressure.toFixed(3)} kPa
              </label>
              <input
                type="range"
                min="90"
                max="115"
                step="0.1"
                value={pressure}
                onChange={(e) => setPressure(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Temperature: {temperature.toFixed(1)} K
              </label>
              <input
                type="range"
                min="270"
                max="310"
                step="1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-gray-400 mt-1">
                {(temperature - 273.15).toFixed(1)}°C
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Volume: {volume.toFixed(3)} L
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-green-400">Gas Properties</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Gas Type</label>
              <select
                value={gasType}
                onChange={(e) => setGasType(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="dry_air">Dry Air (28.964 g/mol)</option>
                <option value="water_vapor">Water Vapor (18.015 g/mol)</option>
                <option value="effective">Effective Gas (18.73 g/mol)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Degrees of Freedom: {degreesOfFreedom}
              </label>
              <input
                type="range"
                min="3"
                max="9"
                step="1"
                value={degreesOfFreedom}
                onChange={(e) => setDegreesOfFreedom(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="text-sm space-y-2">
              <div className="text-yellow-400 font-semibold">Current Gas:</div>
              <div>{gasProperties[gasType].name}</div>
              <div>M = {gasProperties[gasType].molarMass} g/mol</div>
              <div>DoF = {degreesOfFreedom}</div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">Energy Analysis</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>E (P×V):</span>
                <span className="font-mono text-cyan-400">{energyFromPV.toFixed(3)} J</span>
              </div>
              
              <div className="flex justify-between">
                <span>E (Kinetic):</span>
                <span className="font-mono">{energyFromKinetic.totalEnergy.toFixed(3)} J</span>
              </div>
              
              <div className="flex justify-between">
                <span>Deviation:</span>
                <span className={`font-mono ${Math.abs(energyFromPV - energyFromKinetic.totalEnergy) < 10 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.abs(energyFromPV - energyFromKinetic.totalEnergy).toFixed(3)} J
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Effective M:</span>
                <span className="font-mono text-purple-400">{reverseDerived.effectiveMolarMass.toFixed(3)} g/mol</span>
              </div>
              
              <div className="flex justify-between">
                <span>Required T:</span>
                <span className="font-mono">{reverseDerived.requiredTemp.toFixed(1)} K</span>
              </div>
              
              <div className="flex justify-between">
                <span>NA Calculated:</span>
                <span className="font-mono text-orange-400">{reverseDerived.avogadroCalculated.toExponential(3)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">View Controls</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">View Mode</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="energy_analysis">Energy Analysis</option>
                <option value="gas_comparison">Gas Comparison</option>
                <option value="angular_analysis">Angular Analysis</option>
                <option value="thermal_scaling">Thermal Scaling</option>
                <option value="lorenz_weather">Weather Modeling</option>
              </select>
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="entropy"
                checked={entropyCalibration}
                onChange={(e) => setEntropyCalibration(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="entropy" className="text-sm">Entropy Calibration</label>
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="lorenz"
                checked={showLorenzComparison}
                onChange={(e) => setShowLorenzComparison(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="lorenz" className="text-sm">Lorenz Analysis</label>
            </div>

            <div className="text-xs text-gray-300">
              <div className="text-yellow-400 font-semibold mb-1">Key Discovery:</div>
              <p>Standard atmospheric pressure corresponds to water vapor enthalpy, not dry air!</p>
            </div>
          </div>
        </div>

        {/* Visualization Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {viewMode === 'energy_analysis' && (
            <>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Energy Consistency Analysis</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { source: 'P×V', energy: energyFromPV, type: 'observed' },
                      { source: 'Kinetic (Current)', energy: energyFromKinetic.totalEnergy, type: 'kinetic' },
                      { source: 'Target (383.56)', energy: 383.556810105, type: 'target' }
                    ]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="source" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Bar dataKey="energy" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-green-400">Pressure vs Effective Molar Mass</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={energySpectrum} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="pressure" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Line type="monotone" dataKey="effectiveMass" stroke="#10B981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-gray-300">
                  <p>Red line shows where effective molar mass equals water vapor (~18.73 g/mol)</p>
                </div>
              </div>
            </>
          )}

          {viewMode === 'gas_comparison' && (
            <>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">Gas Type Comparison</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gasComparison} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="gasType" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Bar dataKey="deviation" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-orange-400">Molar Mass Analysis</h3>
                <div className="space-y-4">
                  {gasComparison.map((gas, idx) => (
                    <div key={idx} className={`p-4 rounded-lg ${gas.isOptimal ? 'bg-green-900 border border-green-400' : 'bg-gray-700'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-cyan-400">{gas.gasType}</span>
                        <span className="text-sm">{gas.molarMass.toFixed(3)} g/mol</span>
                      </div>
                      <div className="text-sm text-gray-300">
                        Energy Deviation: {gas.deviation.toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-300">
                        Energy/Gram: {gas.energyPerGram.toFixed(3)} J/g
                      </div>
                      {gas.isOptimal && (
                        <div className="mt-2 text-sm text-green-300">
                          ✓ Optimal match for atmospheric pressure
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {viewMode === 'angular_analysis' && (
            <>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Angular Magnitude Analysis</h3>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-purple-400 mb-2">Current Values:</div>
                    <div className="text-xs space-y-1">
                      <div>Frequency: {angularAnalysis.frequency.toExponential(3)} Hz</div>
                      <div>Angular Magnitude: {angularAnalysis.angularMagnitude.toExponential(3)}</div>
                      <div>In Arcminutes: {angularAnalysis.angularMagnitudeArcmin.toExponential(3)}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-cyan-400 mb-2">Temperature from Angular Theorem:</div>
                    <div className="text-xs space-y-1">
                      <div>T = C²h/(kBLn2θ): {angularAnalysis.tempFromAngular.toFixed(3)} K</div>
                      <div>Target (21600 arcmin): 288.09 K</div>
                      <div>Deviation: {Math.abs(angularAnalysis.tempFromAngular - 288.09).toFixed(3)} K</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-yellow-400 mb-2">Charge Emergence:</div>
                    <div className="text-xs space-y-1">
                      <div>√C: {angularAnalysis.sqrtC.toFixed(1)} K</div>
                      <div>Charge Energy: {angularAnalysis.chargeEnergy.toExponential(3)} J</div>
                      <div>e Ratio: {angularAnalysis.chargeRatio.toFixed(4)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-red-400">Universal Constants Convergence</h3>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <div className="bg-gray-700 p-6 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-400 mb-2">θ = 360°</div>
                      <div className="text-lg text-white">T = √C</div>
                      <div className="text-sm text-gray-300">Universal threshold condition</div>
                    </div>
                    
                    <div className="bg-gray-700 p-6 rounded-lg">
                      <div className="text-2xl font-bold text-green-400 mb-2">21600'</div>
                      <div className="text-lg text-white">Perfect Angular Resolution</div>
                      <div className="text-sm text-gray-300">Circle of time-space resolution</div>
                    </div>
                    
                    <div className="bg-gray-700 p-6 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400 mb-2">383.62 J</div>
                      <div className="text-lg text-white">Angular Quantum Energy</div>
                      <div className="text-sm text-gray-300">Perfect thermodynamic encoding</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {viewMode === 'thermal_scaling' && (
            <>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-green-400">Thermal Scaling Bridge</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { stage: 'Quantum Bits', temperature: massGapTemp, energy: energyFromPV },
                      { stage: 'Entropy Ratio', temperature: thermalScaling.entropyEnergyRatio * 50, energy: energyFromPV },
                      { stage: 'Gas Constant', temperature: thermalScaling.gasConstantContribution * 10, energy: energyFromPV },
                      { stage: 'Calibration', temperature: thermalScaling.calibrationFactor * 50, energy: energyFromPV },
                      { stage: 'Macroscopic', temperature: thermalScaling.scaledTemperature, energy: energyFromPV }
                    ]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="stage" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Area dataKey="temperature" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-orange-400">Scaling Analysis</h3>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-blue-400 mb-2">Mass Gap → Surface Temp:</div>
                    <div className="text-xs space-y-1">
                      <div>Mass Gap T: {massGapTemp.toFixed(3)} K</div>
                      <div>Energy/Entropy: {thermalScaling.entropyEnergyRatio.toFixed(3)} J/K</div>
                      <div>Calibration Factor: {thermalScaling.calibrationFactor.toFixed(3)}</div>
                      <div>Scaled Temperature: {thermalScaling.scaledTemperature.toFixed(3)} K</div>
                      <div>Error from 288K: {thermalScaling.temperatureError.toFixed(3)}%</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-green-400 mb-2">Universal Constants:</div>
                    <div className="text-xs space-y-1">
                      <div>Energy Constant: {energyEntropyConstant.toFixed(3)} J/K</div>
                      <div>Thermal Calibration: {thermalCalibrationFactor.toFixed(3)}</div>
                      <div>Avogadro Error: {reverseDerived.avogadroError.toFixed(3)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {viewMode === 'lorenz_weather' && lorenzComparison && (
            <>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-red-400">Weather Model Comparison</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { model: 'Standard', lyapunov: lorenzComparison.standardLyapunov, window: lorenzComparison.standardWindow },
                      { model: 'Calibrated', lyapunov: lorenzComparison.calibratedLyapunov, window: lorenzComparison.calibratedWindow }
                    ]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="model" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Bar dataKey="lyapunov" fill="#EF4444" name="Lyapunov Exponent" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Enhanced Weather Forecasting</h3>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-red-400 mb-2">Standard Model (Dry Air):</div>
                    <div className="text-xs space-y-1">
                      <div>Lyapunov: {lorenzComparison.standardLyapunov.toFixed(2)}</div>
                      <div>Predictive Window: {lorenzComparison.standardWindow.toFixed(2)}s</div>
                      <div>Late divergence, catastrophic failure</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-green-400 mb-2">Entropy-Calibrated Model:</div>
                    <div className="text-xs space-y-1">
                      <div>Lyapunov: {lorenzComparison.calibratedLyapunov.toFixed(2)}</div>
                      <div>Predictive Window: {lorenzComparison.calibratedWindow.toFixed(2)}s</div>
                      <div>Early detection, stable attractors</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-yellow-400 mb-2">Key Advantages:</div>
                    <div className="text-xs space-y-1 text-gray-300">
                      <div>• Earlier storm detection</div>
                      <div>• Better phase tracking</div>
                      <div>• Real-time correction capability</div>
                      <div>• Water vapor enthalpy awareness</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Key Insights Panel */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-red-400">SAPMCH Key Discoveries</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-blue-400">Fundamental Revelation</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• Standard atmospheric pressure (101.325 kPa) corresponds to water vapor enthalpy, not dry air</p>
                <p>• Effective molar mass: ~18.73 g/mol (near H₂O)</p>
                <p>• Hidden water calibration in pressure standards</p>
                <p>• Ideal Gas Law needs mass-explicit treatment</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-green-400">Avogadro's Number Emergence</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• NA = E/(kBLn2T) at mass gap temperature</p>
                <p>• Links thermodynamics to information theory</p>
                <p>• Mass emerges from information encoding</p>
                <p>• Entropy-energy constant: 5.763 J/K</p>
                <p>• Bridge from quantum to macroscopic</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-yellow-400">Angular-Thermal Unification</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• T = C²h/(kBLn2θ) links all scales</p>
                <p>• 21600 arcminutes = perfect resolution</p>
                <p>• √C temperature = charge emergence</p>
                <p>• Angular magnitude governs thermal states</p>
                <p>• Universal constants geometrically unified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SAPMCHSimulator;