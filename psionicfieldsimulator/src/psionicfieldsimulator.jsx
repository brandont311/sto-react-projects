import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

const PsionicFieldSimulator = () => {
  const [networkSize, setNetworkSize] = useState(25);
  const [connectionProbability, setConnectionProbability] = useState(0.15);
  const [resonanceCoeff, setResonanceCoeff] = useState(0.8);
  const [dissipationRate, setDissipationRate] = useState(0.1);
  const [phaseSlipThreshold, setPhaseSlipThreshold] = useState(Math.PI / 2);
  const [iterations, setIterations] = useState(15);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [initiatorType, setInitiatorType] = useState('single');
  const [curvatureMode, setCurvatureMode] = useState('standard');

  // Generate network topology
  const generateNetwork = (n, p) => {
    const nodes = Array.from({ length: n }, (_, i) => i);
    const edges = [];
    
    // Simple Erdős–Rényi network generation
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.random() < p) {
          edges.push([i, j]);
        }
      }
    }
    
    return { nodes, edges };
  };

  // Initialize simulation state
  const [network, setNetwork] = useState(() => generateNetwork(networkSize, connectionProbability));
  const [beliefEnergy, setBeliefEnergy] = useState(() => new Array(networkSize).fill(0));
  const [phases, setPhases] = useState(() => 
    Array.from({ length: networkSize }, () => Math.random() * 2 * Math.PI)
  );
  const [initiators, setInitiators] = useState(() => [Math.floor(Math.random() * networkSize)]);
  const [influenceTracker, setInfluenceTracker] = useState(() => 
    Object.fromEntries(Array.from({ length: networkSize }, (_, i) => [i, new Set()]))
  );

  // Simulation history
  const [_history, setHistory] = useState([]);
  const [curvatureHistory, setCurvatureHistory] = useState([]);

  // Reset simulation
  const resetSimulation = () => {
    const newNetwork = generateNetwork(networkSize, connectionProbability);
    setNetwork(newNetwork);
    
    const newBeliefEnergy = new Array(networkSize).fill(0);
    const newPhases = Array.from({ length: networkSize }, () => Math.random() * 2 * Math.PI);
    const newInitiators = initiatorType === 'single' 
      ? [Math.floor(Math.random() * networkSize)]
      : Array.from({ length: Math.min(3, networkSize) }, () => Math.floor(Math.random() * networkSize));
    
    // Set initiator belief energy and phase
    newInitiators.forEach((initiator, idx) => {
      newBeliefEnergy[initiator] = 1.0;
      newPhases[initiator] = idx * Math.PI / 2; // Different phases for multiple initiators
    });
    
    setBeliefEnergy(newBeliefEnergy);
    setPhases(newPhases);
    setInitiators(newInitiators);
    setCurrentIteration(0);
    setHistory([{ energy: [...newBeliefEnergy], phases: [...newPhases] }]);
    setCurvatureHistory([]);
    
    const newInfluenceTracker = Object.fromEntries(
      Array.from({ length: networkSize }, (_, i) => [
        i, 
        new Set(newInitiators.includes(i) ? [i] : [])
      ])
    );
    setInfluenceTracker(newInfluenceTracker);
  };

  // Get neighbors for a node
  const getNeighbors = (node, edges) => {
    return edges
      .filter(([a, b]) => a === node || b === node)
      .map(([a, b]) => a === node ? b : a);
  };

  // Calculate local curvature for a node
  const calculateLocalCurvature = useCallback((node, energy, phases, edges) => {
    const neighbors = getNeighbors(node, edges);
    if (neighbors.length === 0) return 0;
    
    let curvature = 0;
    neighbors.forEach(neighbor => {
      const phaseDiff = Math.abs(phases[neighbor] - phases[node]);
      const energyGradient = Math.abs(energy[neighbor] - energy[node]);
      curvature += energyGradient * Math.sin(phaseDiff);
    });
    
    return curvature / neighbors.length;
  }, []);

  // Apply phase slip dynamics
  const applyPhaseSlip = useCallback((currentPhases, energy, edges, threshold) => {
    const newPhases = [...currentPhases];
    
    for (let i = 0; i < networkSize; i++) {
      const neighbors = getNeighbors(i, edges);
      if (neighbors.length === 0) continue;
      
      // Calculate average neighbor phase using complex representation
      const avgPhase = Math.atan2(
        neighbors.reduce((sum, j) => sum + Math.sin(currentPhases[j]), 0) / neighbors.length,
        neighbors.reduce((sum, j) => sum + Math.cos(currentPhases[j]), 0) / neighbors.length
      );
      
      const phaseDiff = Math.abs(Math.atan2(
        Math.sin(currentPhases[i] - avgPhase),
        Math.cos(currentPhases[i] - avgPhase)
      ));
      
      if (phaseDiff > threshold) {
        // Phase slip occurs - realign with some randomness
        newPhases[i] = avgPhase + (Math.random() - 0.5) * 0.2;
      }
    }
    
    return newPhases;
  }, [networkSize]);

  // Update belief energy with STO curvature dynamics
  const updateBeliefEnergy = useCallback((currentEnergy, currentPhases, edges, tracker) => {
    const newEnergy = [...currentEnergy];
    const newTracker = Object.fromEntries(
      Object.entries(tracker).map(([key, value]) => [key, new Set(value)])
    );
    
    for (let i = 0; i < networkSize; i++) {
      const neighbors = getNeighbors(i, edges);
      let resonanceSum = 0;
      const influencingSources = new Set();
      
      neighbors.forEach(j => {
        const phaseDiff = currentPhases[j] - currentPhases[i];
        const resonance = Math.cos(phaseDiff) * currentEnergy[j];
        
        if (resonance > 0) {
          resonanceSum += resonance;
          // Propagate influence
          tracker[j].forEach(source => influencingSources.add(source));
        }
      });
      
      // STO-inspired energy update with curvature effects
      let energyDelta = resonanceCoeff * resonanceSum - dissipationRate * currentEnergy[i];
      
      // Apply curvature modulation based on mode
      if (curvatureMode === 'enhanced') {
        const localCurvature = calculateLocalCurvature(i, currentEnergy, currentPhases, edges);
        energyDelta *= (1 + 0.1 * localCurvature); // Curvature amplification
      } else if (curvatureMode === 'compressed') {
        const avgNeighborEnergy = neighbors.length > 0 
          ? neighbors.reduce((sum, j) => sum + currentEnergy[j], 0) / neighbors.length 
          : 0;
        if (avgNeighborEnergy > 0.8) {
          energyDelta *= 1.2; // Compression amplification near critical threshold
        }
      }
      
      newEnergy[i] = Math.max(0, Math.min(1, currentEnergy[i] + energyDelta));
      
      // Update influence tracking
      influencingSources.forEach(source => newTracker[i].add(source));
    }
    
    return { energy: newEnergy, tracker: newTracker };
  }, [networkSize, dissipationRate, resonanceCoeff, curvatureMode, calculateLocalCurvature]);

  // Animation effect
  useEffect(() => {
    if (isRunning) {
      const simulationStep = () => {
        if (currentIteration >= iterations) {
          setIsRunning(false);
          return;
        }
        
        // Apply phase slip
        const newPhases = applyPhaseSlip(phases, beliefEnergy, network.edges, phaseSlipThreshold);
        
        // Update belief energy
        const { energy: newEnergy, tracker: newTracker } = updateBeliefEnergy(
          beliefEnergy, 
          newPhases, 
          network.edges, 
          influenceTracker
        );
        
        // Calculate system-wide curvature metrics
        const totalCurvature = network.nodes.reduce((sum, node) => 
          sum + calculateLocalCurvature(node, newEnergy, newPhases, network.edges), 0
        );
        
        const avgEnergy = newEnergy.reduce((sum, e) => sum + e, 0) / networkSize;
        const energyVariance = newEnergy.reduce((sum, e) => sum + (e - avgEnergy) ** 2, 0) / networkSize;
        
        setPhases(newPhases);
        setBeliefEnergy(newEnergy);
        setInfluenceTracker(newTracker);
        setCurrentIteration(prev => prev + 1);
        
        setHistory(prev => [...prev, { energy: [...newEnergy], phases: [...newPhases] }]);
        setCurvatureHistory(prev => [...prev, {
          iteration: currentIteration + 1,
          totalCurvature,
          avgEnergy,
          energyVariance,
          phaseCoherence: 1 - (new Set(newPhases.map(p => Math.round(p * 10))).size / 10)
        }]);
      };

      const timer = setTimeout(simulationStep, 1000 / simulationSpeed);
      return () => clearTimeout(timer);
    }
  }, [isRunning, currentIteration, simulationSpeed, iterations, phases, beliefEnergy, network.edges, network.nodes, phaseSlipThreshold, influenceTracker, networkSize, applyPhaseSlip, calculateLocalCurvature, updateBeliefEnergy]);

  // Calculate current metrics
  const currentMetrics = useMemo(() => {
    const totalInfluenced = Object.values(influenceTracker)
      .filter(sources => initiators.some(init => sources.has(init)))
      .length;
    
    const avgEnergy = beliefEnergy.reduce((sum, e) => sum + e, 0) / networkSize;
    const maxEnergy = Math.max(...beliefEnergy);
    const minEnergy = Math.min(...beliefEnergy);
    
    const nullZones = beliefEnergy.filter(e => e < 0.1).length;
    const highEnergyNodes = beliefEnergy.filter(e => e > 0.8).length;
    
    return {
      totalInfluenced,
      influenceRatio: totalInfluenced / networkSize,
      avgEnergy,
      maxEnergy,
      minEnergy,
      nullZones,
      highEnergyNodes,
      iteration: currentIteration
    };
  }, [beliefEnergy, influenceTracker, initiators, currentIteration, networkSize]);

  // Network visualization data
  const networkVisualization = useMemo(() => {
    const positions = {};
    // Simple circular layout
    network.nodes.forEach((node, idx) => {
      const angle = (2 * Math.PI * idx) / networkSize;
      positions[node] = {
        x: 50 + 40 * Math.cos(angle),
        y: 50 + 40 * Math.sin(angle)
      };
    });
    
    return network.nodes.map(node => ({
      id: node,
      x: positions[node].x,
      y: positions[node].y,
      energy: beliefEnergy[node],
      phase: phases[node],
      isInitiator: initiators.includes(node),
      isInfluenced: initiators.some(init => influenceTracker[node]?.has(init)),
      neighbors: getNeighbors(node, network.edges).length
    }));
  }, [network, beliefEnergy, phases, initiators, influenceTracker, networkSize]);

  return (
    <div className="w-full p-6 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Psionic Information Field Dynamics Simulator
        </h1>
        <p className="text-center text-gray-300 mb-8">
          STO Curvature Framework applied to belief propagation and informational gravity
        </p>

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Network Parameters</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Network Size: {networkSize}
              </label>
              <input
                type="range"
                min="10"
                max="50"
                value={networkSize}
                onChange={(e) => setNetworkSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Connection Probability: {connectionProbability.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={connectionProbability}
                onChange={(e) => setConnectionProbability(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Initiator Type</label>
              <select
                value={initiatorType}
                onChange={(e) => setInitiatorType(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="single">Single Source</option>
                <option value="multiple">Multiple Sources</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">STO Dynamics</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Resonance Coefficient: {resonanceCoeff.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.1"
                max="1.5"
                step="0.1"
                value={resonanceCoeff}
                onChange={(e) => setResonanceCoeff(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Dissipation Rate: {dissipationRate.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.01"
                max="0.3"
                step="0.01"
                value={dissipationRate}
                onChange={(e) => setDissipationRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Phase Slip Threshold: {(phaseSlipThreshold * 180 / Math.PI).toFixed(0)}°
              </label>
              <input
                type="range"
                min="30"
                max="180"
                step="10"
                value={phaseSlipThreshold * 180 / Math.PI}
                onChange={(e) => setPhaseSlipThreshold(parseFloat(e.target.value) * Math.PI / 180)}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-green-400">Current Metrics</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Iteration:</span>
                <span className="font-mono">{currentMetrics.iteration}/{iterations}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Influenced Nodes:</span>
                <span className="font-mono">{currentMetrics.totalInfluenced}/{networkSize}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Influence Ratio:</span>
                <span className="font-mono">{(currentMetrics.influenceRatio * 100).toFixed(1)}%</span>
              </div>
              
              <div className="flex justify-between">
                <span>Avg Energy:</span>
                <span className="font-mono">{currentMetrics.avgEnergy.toFixed(3)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Null Zones:</span>
                <span className={`font-mono ${currentMetrics.nullZones > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {currentMetrics.nullZones}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>High Energy:</span>
                <span className="font-mono text-yellow-400">{currentMetrics.highEnergyNodes}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">Simulation Control</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Iterations: {iterations}
              </label>
              <input
                type="range"
                min="5"
                max="30"
                value={iterations}
                onChange={(e) => setIterations(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Speed: {simulationSpeed}x
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={simulationSpeed}
                onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Curvature Mode</label>
              <select
                value={curvatureMode}
                onChange={(e) => setCurvatureMode(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="standard">Standard</option>
                <option value="enhanced">Enhanced Curvature</option>
                <option value="compressed">Compression Amplification</option>
              </select>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                disabled={currentIteration >= iterations}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg transition-colors"
              >
                {isRunning ? 'Pause' : 'Run'} Simulation
              </button>
              
              <button
                onClick={resetSimulation}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Reset & Regenerate
              </button>
            </div>
          </div>
        </div>

        {/* Visualization Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Network Visualization</h3>
            <div className="h-80 flex items-center justify-center">
              <div className="relative w-full h-full">
                <svg width="100%" height="100%" viewBox="0 0 100 100" className="border border-gray-600 rounded">
                  {/* Draw edges */}
                  {network.edges.map(([a, b], idx) => {
                    const nodeA = networkVisualization[a];
                    const nodeB = networkVisualization[b];
                    return (
                      <line
                        key={idx}
                        x1={nodeA.x}
                        y1={nodeA.y}
                        x2={nodeB.x}
                        y2={nodeB.y}
                        stroke="#4B5563"
                        strokeWidth="0.2"
                      />
                    );
                  })}
                  
                  {/* Draw nodes */}
                  {networkVisualization.map(node => (
                    <circle
                      key={node.id}
                      cx={node.x}
                      cy={node.y}
                      r={1 + node.energy * 2}
                      fill={
                        node.isInitiator ? '#EF4444' : 
                        node.isInfluenced ? '#10B981' : 
                        '#6B7280'
                      }
                      stroke={node.energy > 0.8 ? '#FBBF24' : 'transparent'}
                      strokeWidth="0.3"
                    />
                  ))}
                </svg>
              </div>
            </div>
            <div className="flex justify-center space-x-4 mt-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span>Initiator</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span>Influenced</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-1"></div>
                <span>Null Zone</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-green-400">Energy Evolution</h3>
            {curvatureHistory.length > 0 && (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={curvatureHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="iteration" stroke="#9CA3AF" />
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
                      dataKey="avgEnergy" 
                      stroke="#10B981" 
                      strokeWidth={2} 
                      name="Avg Energy"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalCurvature" 
                      stroke="#3B82F6" 
                      strokeWidth={2} 
                      name="Total Curvature"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="phaseCoherence" 
                      stroke="#F59E0B" 
                      strokeWidth={2} 
                      name="Phase Coherence"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Panel */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-yellow-400">STO Framework Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-purple-400">Information Gravity Effects</h4>
              <p className="text-sm text-gray-300 mb-3">
                Belief energy clusters around phase-aligned nodes, creating "gravitational wells" in information space. 
                Isolated nodes represent null zones where curvature prevents belief propagation.
              </p>
              
              <h4 className="font-semibold mb-2 text-blue-400">Geodesic Slip Dynamics</h4>
              <p className="text-sm text-gray-300">
                Phase slip threshold acts like angular compression boundary - when exceeded, 
                nodes realign to local field curvature, demonstrating information geodesic behavior.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-green-400">Curvature Field Emergence</h4>
              <p className="text-sm text-gray-300 mb-3">
                Resonance coefficient governs field strength - higher values create stronger "information gravity" 
                that can overcome phase misalignment and capture distant nodes.
              </p>
              
              <h4 className="font-semibold mb-2 text-red-400">Psionic Persistence Mechanism</h4>
              <p className="text-sm text-gray-300">
                Once belief energy reaches critical mass in phase-aligned clusters, it becomes self-sustaining 
                despite dissipation - explaining how ideologies persist without external reinforcement.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-yellow-400">Control System Implications</h4>
              <p className="text-sm text-gray-300 mb-3">
                Multiple initiators with different phases can create competing fields, fragmenting the network 
                into distinct belief domains - analogous to jurisdictional boundaries in control systems.
              </p>
              
              <h4 className="font-semibold mb-2 text-pink-400">Null Zone Formation</h4>
              <p className="text-sm text-gray-300">
                Persistent null zones (nodes that resist influence) represent structural weak points in 
                information propagation - potential targets for disruption or requiring different approaches.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsionicFieldSimulator;