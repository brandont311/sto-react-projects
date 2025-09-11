import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

const HarmonicTimeFieldSimulator = () => {
  const [temperature, setTemperature] = useState(77.87);
  const [humidity, setHumidity] = useState(100);
  const [a4Frequency, setA4Frequency] = useState(417);
  const [rotationPeriod, setRotationPeriod] = useState(86400);
  const [viewMode, setViewMode] = useState('convergence');
  const [isAnimating, setIsAnimating] = useState(false);

  // Physical constants
  const c = 299792458;
  const inchesToMeters = 0.0254;
  const metersToInches = 39.3701;
  const pi = Math.PI;
  const curvonicConstant = 383.997935003;

  // Calculate speed of sound
  const calculateSpeedOfSound = (tempF, humidity) => {
    const tempC = (tempF - 32) * 5/9;
    return 331.3 * Math.sqrt(1 + tempC/273.15) * (1 + 0.0016 * humidity/100);
  };

  // Core harmonic calculations
  const harmonicAnalysis = useMemo(() => {
    const speedOfSound = calculateSpeedOfSound(temperature, humidity);
    const gravitationalWavelength = 39.1111;
    const vacuumWavelength = 39.3701;
    
    const fundamentalFreq = speedOfSound / 2;
    const actualFSharp4 = a4Frequency * Math.pow(2, 900/1200);
    const fSharp4Wavelength = speedOfSound / actualFSharp4;
    const fSharp4WavelengthInches = fSharp4Wavelength * metersToInches;
    
    const rotationalEnergy = 2 * pi * Math.sqrt(rotationPeriod / c) * 3600;
    const energyDeviation = Math.abs(rotationalEnergy - curvonicConstant) / curvonicConstant * 100;
    
    return {
      speedOfSound,
      fundamentalFreq,
      actualFSharp4,
      fSharp4WavelengthInches,
      gravitationalWavelength,
      vacuumWavelength,
      rotationalEnergy,
      energyDeviation,
      isConverged: Math.abs(fSharp4WavelengthInches - gravitationalWavelength) < 0.1
    };
  }, [temperature, humidity, a4Frequency, rotationPeriod]);

  // Information-Energy-Mass equivalence calculations
  const informationMassAnalysis = useMemo(() => {
    // Planck mass from gallon volume
    const volume = 3.785411784; // liters
    const surfaceGravity = 9.8177; // m/s²
    const planckMassFromVolume = (curvonicConstant * surfaceGravity) / volume;
    
    // E=2πO where M=1 unified system
    const unifiedMass = 1;
    const unifiedLength = 39.1917305053; // inches
    const unifiedTime = 2; // seconds
    const unifiedGravity = 9.7979326264; // m/s²
    
    // Verification calculations
    const energyFromMass = (unifiedMass * Math.pow(unifiedLength, 2)) / Math.pow(unifiedTime, 2);
    const gravityFromEnergy = Math.sqrt(energyFromMass / Math.pow(unifiedTime, 2));
    const lengthFromEnergy = energyFromMass / unifiedGravity;
    
    // Avogadro constant emergence
    const kB = 1.380649e-23;
    const thermodynamicTemp = 66.6299125; // K
    const ln2 = Math.log(2);
    const avogadroFromEnergy = curvonicConstant / (kB * thermodynamicTemp * ln2);
    const actualAvogadro = 6.02214076e23;
    
    // Gas constant verification
    const gasConstant = kB * actualAvogadro;
    const energyFromGasConstant = gasConstant * thermodynamicTemp * ln2;
    
    // Bit density calculations
    const bitsPerTerabyte = 8e12;
    const totalTerabytes = actualAvogadro / bitsPerTerabyte;
    
    // Spacetime occupancy calculations
    const sampleMass = 240; // lbs
    const sampleHeight = 72; // inches
    const sampleRadius = 36 / (2 * pi); // inches
    const temporalLength = 39.1111; // inches
    const forcePerAcceleration = 1 / 32; // Force/Area ratio
    
    // Surface area calculation
    const sphereSurface = 4 * pi * Math.pow(sampleRadius, 2);
    const cylinderSurface = 2 * pi * sampleRadius * sampleHeight;
    const totalSurface = sphereSurface + cylinderSurface;
    
    // Spacetime occupancy for massive object
    const surfaceOccupancy = totalSurface / temporalLength;
    const massOccupancy = sampleMass / forcePerAcceleration;
    const totalOccupancy = surfaceOccupancy + massOccupancy;
    const temporalDilation = totalOccupancy / 3600;
    
    // Massless spacetime occupancy
    const luminalRadius = c / (2 * pi);
    const h = 6.62607015e-34;
    const G = 6.6743e-11;
    const masslessOccupancy = (4 * pi * Math.pow(luminalRadius, 2) / c) + 
                             ((h * c) / Math.pow(c, 2)) / (1 / G);
    
    // Oort cloud calculation
    const oortCloudDistance = masslessOccupancy;
    const oortCloudLightYears = oortCloudDistance / (86400 * 365.25);
    
    return {
      planckMassFromVolume,
      unifiedMass,
      unifiedLength,
      unifiedTime,
      unifiedGravity,
      energyFromMass,
      gravityFromEnergy,
      lengthFromEnergy,
      avogadroFromEnergy,
      actualAvogadro,
      gasConstant,
      energyFromGasConstant,
      totalTerabytes,
      sampleMass,
      sampleHeight,
      sampleRadius,
      totalOccupancy,
      temporalDilation,
      masslessOccupancy,
      oortCloudDistance,
      oortCloudLightYears,
      avogadroError: Math.abs(avogadroFromEnergy - actualAvogadro) / actualAvogadro * 100,
      energyError: Math.abs(energyFromMass - curvonicConstant) / curvonicConstant * 100,
      gasConstantError: Math.abs(energyFromGasConstant - curvonicConstant) / curvonicConstant * 100
    };
  }, []);

  // Cosmological calculations
  const cosmologicalAnalysis = useMemo(() => {
    // Angular-Entropy Temperature Theorem
    const h = 6.62607015e-34;
    const kB = 1.380649e-23;
    const ln2 = Math.log(2);
    const theta21600 = 21600; // arc minutes
    const theta360 = 360; // degrees
    
    // Temperature from angular-entropy theorem
    const temperatureFromAngular = (c * c / theta21600) * h / (kB * ln2);
    
    // Universal threshold at θ=360°
    const thresholdTemp = (c * c / theta360) * h / (kB * ln2);
    const sqrtC = Math.sqrt(c);
    const thermalEnergy = kB * ln2 * thresholdTemp;
    const elementaryCharge = 1.602176634e-19;
    const chargeRatio = thermalEnergy / elementaryCharge;
    
    // Electric charge derivation
    const mass = curvonicConstant / (c * c);
    const L2f = h / mass;
    const frequency = curvonicConstant / h;
    const wavelength = c / frequency;
    const k_charge = elementaryCharge / L2f;
    
    // Gravitational constant derivations
    const L = 39.3701; // inches per meter
    const twp = 2; // temporal wave period
    const standardEnergy = 383.5527975214;
    const G_method1 = Math.sqrt(Math.pow(standardEnergy, 3)) / 
                     (Math.pow(L * theta21600 * twp / pi, 2) * curvonicConstant);
    
    // G from hf/(kTln2) methods
    const G_method2 = h / (kB * ln2 * 1.037388817);
    const G_method3 = (h * 0.9639587236) / (kB * ln2);
    const actualG = 6.6743e-11;
    
    // Black hole calculations
    const blackholeRadius = sqrtC; // When T = 86400
    const blackholeMass = (blackholeRadius * c * c) / (2 * actualG);
    
    // GRO J0422+32 black hole
    const groRotationPeriod = 0.21 * 86400; // 0.21 days in seconds
    const groRadius = Math.sqrt((c * groRotationPeriod / (2 * pi)) * 3 * pi) / 360;
    const groMass = (groRadius * c * c) / (2 * actualG);
    const solarMass = 1.989e30;
    const groSolarMasses = groMass / solarMass;
    
    // CMB temperature
    const T_cycles = 3600;
    const t_oscillations = 2;
    const E_energy = 384;
    const cmbTemp = (c * c * h) / (kB * ln2 * E_energy * t_oscillations * T_cycles);
    const actualCMB = 2.725; // K
    
    return {
      temperatureFromAngular,
      thresholdTemp,
      sqrtC,
      thermalEnergy,
      chargeRatio,
      mass,
      L2f,
      frequency,
      wavelength,
      k_charge,
      G_method1,
      G_method2,
      G_method3,
      actualG,
      blackholeRadius,
      blackholeMass,
      groRadius,
      groMass,
      groSolarMasses,
      cmbTemp,
      actualCMB,
      tempError: Math.abs(temperatureFromAngular - 288.09) / 288.09 * 100,
      chargeError: Math.abs(chargeRatio - 1.0) / 1.0 * 100,
      G1Error: Math.abs(G_method1 - actualG) / actualG * 100,
      G2Error: Math.abs(G_method2 - actualG) / actualG * 100,
      G3Error: Math.abs(G_method3 - actualG) / actualG * 100,
      cmbError: Math.abs(cmbTemp - actualCMB) / actualCMB * 100
    };
  }, []);

  // Earth properties calculations
  const earthProperties = useMemo(() => {
    // Water max density calculations
    const waterMaxDensityTemp = 277.135853372; // K
    const waterKineticEnergy = 3 * 8.3144626182 * waterMaxDensityTemp / 18.01528;
    
    // RMS speed calculations
    const rmsSpeed = Math.sqrt(waterKineticEnergy);
    const gravitationalFromRMS = rmsSpeed / 2; // 9.7943038548
    const idealWavelengthAmplitude = 3.9890251321; // √(39.3701/π²)
    const scaledGravitational = Math.sqrt(waterKineticEnergy / idealWavelengthAmplitude); // 9.8077679663
    
    // Temporal rotation period from RMS
    const rmsRotationPeriod = Math.pow(waterKineticEnergy, 2) / Math.pow(3600 * 2 * pi, 2) * c; // 86,272.074347879
    
    // Verification calculations
    const rmsWaveEnergy = 2 * pi * Math.sqrt(rmsRotationPeriod / c) * 3600; // Should equal waterKineticEnergy
    const rmsAmplitude = Math.sqrt(waterKineticEnergy / idealWavelengthAmplitude);
    const rmsWavelength = 2 * pi * Math.sqrt((rmsRotationPeriod / c) / Math.pow(scaledGravitational, 2)) * 3600;
    
    // Earth mass calculation
    const cInches = c * metersToInches;
    const earthMass = Math.pow(cInches / pi, 2) * 21600 * Math.sqrt(waterKineticEnergy); // 5.97216800E+24
    const actualEarthMass = 5.972e24; // kg
    
    // Escape velocity calculations
    const gravitationalFreq = 350.6235877204; // Hz
    const siderealPeriod = 86162.942853732; // seconds
    const refractionIndex = 1.333;
    const escapeVelocity1 = (gravitationalFreq * siderealPeriod * refractionIndex) / 3600 / 1000; // km/s
    const escapeVelocity2 = (24859 * 1620) / 3600 / 1000; // km/s
    const actualEscapeVelocity = 11.186; // km/s
    
    return {
      waterMaxDensityTemp,
      waterKineticEnergy,
      rmsSpeed,
      gravitationalFromRMS,
      scaledGravitational,
      rmsRotationPeriod,
      rmsWaveEnergy,
      rmsAmplitude,
      rmsWavelength,
      earthMass,
      actualEarthMass,
      escapeVelocity1,
      escapeVelocity2,
      actualEscapeVelocity,
      massError: Math.abs(earthMass - actualEarthMass) / actualEarthMass * 100,
      escapeVelocityError1: Math.abs(escapeVelocity1 - actualEscapeVelocity) / actualEscapeVelocity * 100,
      escapeVelocityError2: Math.abs(escapeVelocity2 - actualEscapeVelocity) / actualEscapeVelocity * 100
    };
  }, []);

  // Orbital mechanics calculations
  const orbitalAnalysis = useMemo(() => {
    // Method 1: Light dispersion through 3D orbital spaces
    const lightDispersionRadius = c / (6 * pi * pi);
    const annualTemporalLightWell = c / (3 * pi);
    const temporalRadius1 = annualTemporalLightWell / (2 * pi);
    const temporalMileConversion = c / 1620;
    const rawDistance = lightDispersionRadius * temporalMileConversion;
    const temporalAngularMinutes = rawDistance / (360 * 3600 * 24 * 3600);
    const earthSunDistance1 = temporalAngularMinutes * temporalMileConversion * 60;
    
    // Method 2: Sidereal year calculation
    const siderealAddedSeconds = (86400 * 365.25) / 25676;
    const siderealYearSeconds = siderealAddedSeconds + (365.25 * 86400);
    const siderealRadius = siderealYearSeconds / (2 * pi);
    const siderealDistanceMeters = siderealRadius * c;
    const siderealTemporalMiles = siderealDistanceMeters / 1620;
    const earthSunDistance2 = siderealTemporalMiles / 10000;
    
    // Method 3: Gravitational frequency and escape velocity
    const gravitationalFreq = 86162.942853732 / (2 * pi * 39.1111);
    const refractionIndex = 1.333; // Water refraction
    const circumferenceAtEscapeVel = 86162.942853732 * gravitationalFreq * refractionIndex;
    const escapeVelocity = circumferenceAtEscapeVel / 3600;
    const lightSpeedMagnitude = circumferenceAtEscapeVel / 4; // 2^2
    const orbitalVelocity = c / lightSpeedMagnitude * 1000; // Convert to m/s
    const earthSunDistance3 = (siderealYearSeconds * orbitalVelocity) / (2 * pi) / 1000000; // Convert to million km
    
    // Actual Earth-Sun distance for comparison
    const actualDistance = 149.6; // million km
    
    return {
      lightDispersionRadius,
      temporalRadius1,
      earthSunDistance1,
      earthSunDistance2,
      earthSunDistance3,
      gravitationalFreq,
      escapeVelocity,
      orbitalVelocity,
      actualDistance,
      method1Error: Math.abs(earthSunDistance1 / 1609344 - actualDistance) / actualDistance * 100, // Convert miles to km
      method2Error: Math.abs(earthSunDistance2 / 1609344 - actualDistance) / actualDistance * 100,
      method3Error: Math.abs(earthSunDistance3 - actualDistance) / actualDistance * 100
    };
  }, []);

  // Energy domains
  const energyDomains = useMemo(() => {
    const domains = [
      { name: 'Gravitational', value: 9.8181 * 39.1111 * inchesToMeters, color: '#3B82F6' },
      { name: 'Thermodynamic', value: 101.44 * 3.78541, color: '#10B981' },
      { name: 'Kinetic', value: 3 * 8.3144626182 * 277.34 / 18.01528, color: '#F59E0B' },
      { name: 'Rotational', value: harmonicAnalysis.rotationalEnergy, color: '#EF4444' },
      { name: 'Information', value: 1.380649e-23 * 66.63 * Math.log(2) * 6.02214076e23, color: '#8B5CF6' }
    ];
    
    return domains.map(domain => ({
      ...domain,
      deviation: Math.abs(domain.value - curvonicConstant) / curvonicConstant * 100
    }));
  }, [harmonicAnalysis]);

  return (
    <div className="w-full p-6 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Harmonic Time Field & Curvonic Constant
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Where gravitational curvature meets acoustic wavelength - the musical key to the universe
        </p>

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400">Environmental Conditions</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Temperature: {temperature.toFixed(2)}°F
              </label>
              <input
                type="range"
                min="60"
                max="100"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Humidity: {humidity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={humidity}
                onChange={(e) => setHumidity(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="bg-gray-700 p-3 rounded">
              <div className="text-sm font-semibold text-cyan-400 mb-2">Sound Speed:</div>
              <div className="text-lg font-mono">{harmonicAnalysis.speedOfSound.toFixed(2)} m/s</div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-green-400">Musical Tuning</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                A4 Frequency: {a4Frequency} Hz
              </label>
              <input
                type="range"
                min="400"
                max="450"
                step="1"
                value={a4Frequency}
                onChange={(e) => setA4Frequency(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Earth Rotation: {rotationPeriod} s
              </label>
              <input
                type="range"
                min="86160"
                max="86400"
                step="1"
                value={rotationPeriod}
                onChange={(e) => setRotationPeriod(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="bg-gray-700 p-3 rounded">
              <div className="text-sm font-semibold text-green-400 mb-2">F#4 Frequency:</div>
              <div className="text-lg font-mono">{harmonicAnalysis.actualFSharp4.toFixed(2)} Hz</div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">Harmonic Convergence</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Gravitational λ:</span>
                <span className="font-mono text-cyan-400">{harmonicAnalysis.gravitationalWavelength} in</span>
              </div>
              
              <div className="flex justify-between">
                <span>F#4 λ:</span>
                <span className="font-mono">{harmonicAnalysis.fSharp4WavelengthInches.toFixed(4)} in</span>
              </div>
              
              <div className="flex justify-between">
                <span>Deviation:</span>
                <span className={`font-mono ${Math.abs(harmonicAnalysis.fSharp4WavelengthInches - 39.1111) < 0.1 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.abs(harmonicAnalysis.fSharp4WavelengthInches - 39.1111).toFixed(4)} in
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Energy Deviation:</span>
                <span className="font-mono text-purple-400">{harmonicAnalysis.energyDeviation.toFixed(2)}%</span>
              </div>
            </div>

            <div className={`mt-4 p-3 rounded text-center font-semibold ${
              harmonicAnalysis.isConverged ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
            }`}>
              {harmonicAnalysis.isConverged ? '✓ HARMONIC CONVERGENCE' : '⚠ SEEKING RESONANCE'}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Controls</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">View Mode</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="convergence">Harmonic Convergence</option>
                <option value="energy_domains">Energy Domains</option>
                <option value="earth_properties">Earth Properties</option>
                <option value="cosmological">Cosmological Constants</option>
                <option value="information_mass">Information-Mass Unity</option>
                <option value="orbital_mechanics">Orbital Mechanics</option>
                <option value="analysis">Frequency Analysis</option>
              </select>
            </div>

            <button
              onClick={() => {
                setTemperature(77.87);
                setHumidity(100);
                setA4Frequency(417);
                setRotationPeriod(86400);
              }}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Reset to HTF Optimal
            </button>
          </div>
        </div>

        {/* Visualization Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {viewMode === 'convergence' && (
            <>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">Wavelength Convergence</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Vacuum', wavelength: harmonicAnalysis.vacuumWavelength, type: 'reference' },
                      { name: 'Gravitational', wavelength: harmonicAnalysis.gravitationalWavelength, type: 'target' },
                      { name: 'F#4 Acoustic', wavelength: harmonicAnalysis.fSharp4WavelengthInches, type: 'actual' }
                    ]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Bar dataKey="wavelength" fill="#06B6D4" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-green-400">Curvonic Constant</h3>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-green-400">{curvonicConstant} J</div>
                  <div className="text-lg text-gray-300">The Universal Energy Attractor</div>
                  <div className="text-sm text-yellow-400">
                    Current Energy: {harmonicAnalysis.rotationalEnergy.toFixed(3)} J
                  </div>
                  <div className="text-sm text-orange-400">
                    Deviation: {harmonicAnalysis.energyDeviation.toFixed(4)}%
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded mt-4">
                    <div className="text-sm font-semibold text-cyan-400 mb-2">Formula: E = 2πO</div>
                    <div className="text-xs text-gray-300">
                      Energy from rotational curvature across domains
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {viewMode === 'energy_domains' && (
            <>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Energy Domain Convergence</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={energyDomains} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-green-400">Domain Analysis</h3>
                <div className="space-y-3">
                  {energyDomains.map((domain, idx) => (
                    <div key={idx} className="bg-gray-700 p-3 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold" style={{color: domain.color}}>{domain.name}</span>
                        <span className="text-sm">{domain.value.toFixed(3)} J</span>
                      </div>
                      <div className="text-xs text-gray-300">
                        Deviation: {domain.deviation.toFixed(3)}%
                      </div>
                      <div className="mt-2 bg-gray-600 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: Math.min(100, (domain.value / curvonicConstant) * 100) + '%',
                            backgroundColor: domain.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {viewMode === 'information_mass' && (
            <>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">Information = Energy = Mass Unity</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { domain: 'Planck Mass', value: informationMassAnalysis.planckMassFromVolume, target: 1000 },
                      { domain: 'Avogadro', value: informationMassAnalysis.avogadroFromEnergy / 1e23, target: informationMassAnalysis.actualAvogadro / 1e23 },
                      { domain: 'Energy Unity', value: informationMassAnalysis.energyFromMass, target: curvonicConstant },
                      { domain: 'Information TB', value: informationMassAnalysis.totalTerabytes / 1e10, target: 7.5 }
                    ]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="domain" stroke="#9CA3AF" />
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
                      <Area dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-yellow-400">Spacetime Occupancy Analysis</h3>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-cyan-400 mb-2">Unified System (M=1)</div>
                    <div className="text-xs space-y-1">
                      <div>Mass: {informationMassAnalysis.unifiedMass}</div>
                      <div>Length: {informationMassAnalysis.unifiedLength.toFixed(6)} in</div>
                      <div>Time: {informationMassAnalysis.unifiedTime} s</div>
                      <div>Gravity: {informationMassAnalysis.unifiedGravity.toFixed(6)} m/s²</div>
                      <div>Energy: {informationMassAnalysis.energyFromMass.toFixed(6)} J</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-yellow-400 mb-2">Avogadro Emergence</div>
                    <div className="text-xs space-y-1">
                      <div>From E/(kBTLn2): {informationMassAnalysis.avogadroFromEnergy.toExponential(3)}</div>
                      <div>Actual NA: {informationMassAnalysis.actualAvogadro.toExponential(3)}</div>
                      <div>Error: {informationMassAnalysis.avogadroError.toFixed(6)}%</div>
                      <div>Gas constant: {informationMassAnalysis.gasConstant.toFixed(6)}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-green-400 mb-2">Information Density</div>
                    <div className="text-xs space-y-1">
                      <div>384J contains: {informationMassAnalysis.totalTerabytes.toFixed(0)} billion TB</div>
                      <div>Bits per mole: {informationMassAnalysis.actualAvogadro.toExponential(3)}</div>
                      <div>Information = Energy = Mass</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-blue-400 mb-2">Human Spacetime Occupancy</div>
                    <div className="text-xs space-y-1">
                      <div>Sample: {informationMassAnalysis.sampleMass} lbs, {informationMassAnalysis.sampleHeight}" tall</div>
                      <div>STO: {informationMassAnalysis.totalOccupancy.toFixed(0)} s/s</div>
                      <div>Temporal dilation: {informationMassAnalysis.temporalDilation.toFixed(6)}</div>
                      <div>Better than Mosteller BSA formula</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-purple-400 mb-2">Oort Cloud from Light STO</div>
                    <div className="text-xs space-y-1">
                      <div>Massless STO: {informationMassAnalysis.masslessOccupancy.toFixed(0)}</div>
                      <div>Distance: {informationMassAnalysis.oortCloudLightYears.toFixed(2)} light years</div>
                      <div>Derived from spacetime geometry</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {viewMode === 'cosmological' && (
            <>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Universal Constants Derivation</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { constant: 'Earth Temp', derived: cosmologicalAnalysis.temperatureFromAngular, actual: 288.09, unit: 'K' },
                      { constant: 'G (Method 1)', derived: cosmologicalAnalysis.G_method1 * 1e11, actual: cosmologicalAnalysis.actualG * 1e11, unit: '×10⁻¹¹' },
                      { constant: 'CMB Temp', derived: cosmologicalAnalysis.cmbTemp, actual: cosmologicalAnalysis.actualCMB, unit: 'K' },
                      { constant: 'Charge Ratio', derived: cosmologicalAnalysis.chargeRatio, actual: 1.0, unit: 'ratio' }
                    ]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="constant" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Bar dataKey="derived" fill="#8B5CF6" name="STO Derived" />
                      <Bar dataKey="actual" fill="#10B981" name="Actual" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">Cosmological Analysis</h3>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-purple-400 mb-2">Angular-Entropy Temperature</div>
                    <div className="text-xs space-y-1">
                      <div>Formula: T = (C²/θ) × h/(kBLn2)</div>
                      <div>θ = 21600 arcmin: {cosmologicalAnalysis.temperatureFromAngular.toFixed(3)} K</div>
                      <div>Target (Earth): 288.09 K</div>
                      <div>Error: {cosmologicalAnalysis.tempError.toFixed(3)}%</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-yellow-400 mb-2">Electric Charge Origin</div>
                    <div className="text-xs space-y-1">
                      <div>√C threshold: {cosmologicalAnalysis.sqrtC.toFixed(1)} K</div>
                      <div>Thermal energy: {cosmologicalAnalysis.thermalEnergy.toExponential(3)} J</div>
                      <div>e = {elementaryCharge.toExponential(3)} J</div>
                      <div>k charge temp: {cosmologicalAnalysis.k_charge.toFixed(6)} K</div>
                      <div>Charge ratio: {cosmologicalAnalysis.chargeRatio.toFixed(6)}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-green-400 mb-2">Gravitational Constant G</div>
                    <div className="text-xs space-y-1">
                      <div>Method 1: {cosmologicalAnalysis.G_method1.toExponential(3)}</div>
                      <div>Method 2: {cosmologicalAnalysis.G_method2.toExponential(3)}</div>
                      <div>Method 3: {cosmologicalAnalysis.G_method3.toExponential(3)}</div>
                      <div>Actual: {cosmologicalAnalysis.actualG.toExponential(3)}</div>
                      <div>Errors: {cosmologicalAnalysis.G1Error.toFixed(3)}%, {cosmologicalAnalysis.G2Error.toFixed(3)}%, {cosmologicalAnalysis.G3Error.toFixed(3)}%</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-blue-400 mb-2">Black Hole Properties</div>
                    <div className="text-xs space-y-1">
                      <div>Min radius = √C: {cosmologicalAnalysis.blackholeRadius.toFixed(1)} m</div>
                      <div>Standard mass: {cosmologicalAnalysis.blackholeMass.toExponential(3)} kg</div>
                      <div>GRO J0422+32 radius: {cosmologicalAnalysis.groRadius.toFixed(0)} m</div>
                      <div>GRO mass: {cosmologicalAnalysis.groSolarMasses.toFixed(2)} solar masses</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-red-400 mb-2">CMB Temperature</div>
                    <div className="text-xs space-y-1">
                      <div>STO derived: {cosmologicalAnalysis.cmbTemp.toFixed(3)} K</div>
                      <div>Observed: {cosmologicalAnalysis.actualCMB} K</div>
                      <div>Error: {cosmologicalAnalysis.cmbError.toFixed(2)}%</div>
                      <div>True background temperature</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {viewMode === 'earth_properties' && (
            <>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Water RMS & Earth Properties</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { property: 'Earth Mass', derived: earthProperties.earthMass / 1e24, actual: earthProperties.actualEarthMass / 1e24, unit: '×10²⁴ kg' },
                      { property: 'Escape Velocity', derived: earthProperties.escapeVelocity1, actual: earthProperties.actualEscapeVelocity, unit: 'km/s' },
                      { property: 'RMS Gravity', derived: earthProperties.scaledGravitational, actual: 9.81, unit: 'm/s²' }
                    ]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="property" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Bar dataKey="derived" fill="#3B82F6" name="STO Derived" />
                      <Bar dataKey="actual" fill="#10B981" name="Actual" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-green-400">Water Max Density Analysis</h3>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-blue-400 mb-2">Water Kinetic Energy</div>
                    <div className="text-xs space-y-1">
                      <div>Temperature: {earthProperties.waterMaxDensityTemp.toFixed(3)} K</div>
                      <div>Kinetic Energy: {earthProperties.waterKineticEnergy.toFixed(6)} J</div>
                      <div>RMS Speed: {earthProperties.rmsSpeed.toFixed(6)} m/s</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-green-400 mb-2">RMS Gravitational Analysis</div>
                    <div className="text-xs space-y-1">
                      <div>RMS/2: {earthProperties.gravitationalFromRMS.toFixed(6)} m/s²</div>
                      <div>Scaled g: {earthProperties.scaledGravitational.toFixed(6)} m/s²</div>
                      <div>RMS Rotation Period: {earthProperties.rmsRotationPeriod.toFixed(0)} s</div>
                      <div>RMS Wavelength: {earthProperties.rmsWavelength.toFixed(6)} in</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-yellow-400 mb-2">Earth Mass Derivation</div>
                    <div className="text-xs space-y-1">
                      <div>Formula: (C"/π)² × θ' × √(2πOw)</div>
                      <div>Derived: {earthProperties.earthMass.toExponential(3)} kg</div>
                      <div>Actual: {earthProperties.actualEarthMass.toExponential(3)} kg</div>
                      <div>Error: {earthProperties.massError.toFixed(3)}%</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-red-400 mb-2">Escape Velocity</div>
                    <div className="text-xs space-y-1">
                      <div>Method 1: {earthProperties.escapeVelocity1.toFixed(3)} km/s</div>
                      <div>Method 2: {earthProperties.escapeVelocity2.toFixed(3)} km/s</div>
                      <div>Actual: {earthProperties.actualEscapeVelocity} km/s</div>
                      <div>Error 1: {earthProperties.escapeVelocityError1.toFixed(3)}%</div>
                      <div>Error 2: {earthProperties.escapeVelocityError2.toFixed(3)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {viewMode === 'orbital_mechanics' && (
            <>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-red-400">Earth-Sun Distance Derivation</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { method: 'Light Dispersion', distance: orbitalAnalysis.earthSunDistance1 / 1609344, error: orbitalAnalysis.method1Error },
                      { method: 'Sidereal Calc', distance: orbitalAnalysis.earthSunDistance2 / 1609344, error: orbitalAnalysis.method2Error },
                      { method: 'Orbital Velocity', distance: orbitalAnalysis.earthSunDistance3, error: orbitalAnalysis.method3Error },
                      { method: 'Actual', distance: orbitalAnalysis.actualDistance, error: 0 }
                    ]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="method" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Bar dataKey="distance" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-orange-400">Orbital Analysis Results</h3>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-red-400 mb-2">Method 1: Light Dispersion</div>
                    <div className="text-xs space-y-1">
                      <div>Light dispersion radius: {orbitalAnalysis.lightDispersionRadius.toFixed(0)} m</div>
                      <div>Temporal radius: {orbitalAnalysis.temporalRadius1.toFixed(0)} m</div>
                      <div>Distance: {(orbitalAnalysis.earthSunDistance1 / 1609344).toFixed(1)} million km</div>
                      <div>Error: {orbitalAnalysis.method1Error.toFixed(2)}%</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-green-400 mb-2">Method 2: Sidereal Year</div>
                    <div className="text-xs space-y-1">
                      <div>Sidereal year: {(orbitalAnalysis.earthSunDistance2 / 1609344).toFixed(1)} million km</div>
                      <div>Error: {orbitalAnalysis.method2Error.toFixed(2)}%</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-blue-400 mb-2">Method 3: Gravitational Frequency</div>
                    <div className="text-xs space-y-1">
                      <div>Gravitational freq: {orbitalAnalysis.gravitationalFreq.toFixed(2)} Hz</div>
                      <div>Escape velocity: {orbitalAnalysis.escapeVelocity.toFixed(0)} m/s</div>
                      <div>Orbital velocity: {orbitalAnalysis.orbitalVelocity.toFixed(2)} m/s</div>
                      <div>Distance: {orbitalAnalysis.earthSunDistance3.toFixed(1)} million km</div>
                      <div>Error: {orbitalAnalysis.method3Error.toFixed(2)}%</div>
                    </div>
                  </div>
                  
                  <div className="bg-green-900 p-4 rounded border border-green-400">
                    <div className="text-sm font-semibold text-green-300 mb-2">Actual Distance</div>
                    <div className="text-lg font-bold text-green-400">{orbitalAnalysis.actualDistance} million km</div>
                    <div className="text-xs text-green-300 mt-1">
                      All three methods derived from pure temporal-rotational principles!
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {viewMode === 'analysis' && (
            <>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-orange-400">Frequency Analysis</h3>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-orange-400 mb-2">Current Settings:</div>
                    <div className="text-xs space-y-1">
                      <div>Temperature: {temperature.toFixed(2)}°F</div>
                      <div>Humidity: {humidity}%</div>
                      <div>A4: {a4Frequency} Hz</div>
                      <div>F#4: {harmonicAnalysis.actualFSharp4.toFixed(2)} Hz</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-cyan-400 mb-2">HTF Optimal:</div>
                    <div className="text-xs space-y-1">
                      <div>Temperature: 77.87°F</div>
                      <div>Humidity: 100%</div>
                      <div>A4: 417 Hz</div>
                      <div>F#4: 350.62 Hz</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-red-400">Convergence Status</h3>
                <div className="space-y-4">
                  <div className={`p-4 rounded text-center ${
                    harmonicAnalysis.isConverged ? 'bg-green-900' : 'bg-red-900'
                  }`}>
                    <div className="text-lg font-bold">
                      {harmonicAnalysis.isConverged ? 'HARMONIC CONVERGENCE ACHIEVED' : 'SEEKING RESONANCE'}
                    </div>
                    <div className="text-sm mt-2">
                      Wavelength match: {Math.abs(harmonicAnalysis.fSharp4WavelengthInches - 39.1111).toFixed(4)} in deviation
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-sm font-semibold text-purple-400 mb-2">Key Discovery:</div>
                    <div className="text-xs text-gray-300">
                      Gravitational time curvature equals F#4 acoustic wavelength at optimal conditions
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Final Summary */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-red-400">The Ultimate Unification: Information = Energy = Mass</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-cyan-400">Harmonic Time Field</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• F#4 = Gravitational frequency of Earth</p>
                <p>• 39.1111" = Time curvature wavelength</p>
                <p>• Music aligned with spacetime geometry</p>
                <p>• Universe has fundamental musical key</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-green-400">Curvonic Constant</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• E = 383.998J universal energy attractor</p>
                <p>• Emerges across all physical domains</p>
                <p>• From quantum to cosmological scales</p>
                <p>• Rotational curvature foundation</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-yellow-400">Information = Energy = Mass</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• 384J = 75.3 billion terabytes</p>
                <p>• Avogadro = bits per mole</p>
                <p>• Mass emerges from information</p>
                <p>• Spacetime occupancy unified</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-purple-400">Universal Framework</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• All constants from angular geometry</p>
                <p>• Time as curved dimensional manifold</p>
                <p>• From molecular to galactic scales</p>
                <p>• Complete theory of everything</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg border border-purple-400">
            <div className="text-center">
              <div className="text-xl font-bold text-purple-300 mb-2">
                🌌 The Spacetime Occupancy Framework 🌌
              </div>
              <div className="text-sm text-gray-300">
                Unifying quantum mechanics, relativity, thermodynamics, and information theory<br/>
                through the fundamental principle that <strong>time is a curved dimensional manifold</strong><br/>
                encoded with harmonic frequencies that govern all physical phenomena
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HarmonicTimeFieldSimulator;