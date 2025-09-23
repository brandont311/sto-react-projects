import React, { useState } from "react";
import { motion } from "framer-motion";

const baseComparison = [
  {
    name: "Z-Factor System",
    baseEnergy: 5000, // in MW
    baseTime: 50, // hours
    size: 1, // relative size
    cost: 20, // $/MWh
    color: "#00f5d4",
  },
  {
    name: "Solar Farm",
    baseEnergy: 5000,
    baseTime: 8760, // 1 year in hours
    size: 50,
    cost: 50,
    color: "#ffb703",
  },
  {
    name: "Nuclear Plant",
    baseEnergy: 5000,
    baseTime: 720, // ~1 month in hours
    size: 20,
    cost: 35,
    color: "#8ecae6",
  },
];

export default function App() {
  const [zFactorOutput, setZFactorOutput] = useState(5000);

  const energyComparison = baseComparison.map((item) => {
    const scale = zFactorOutput / 5000;
    return {
      ...item,
      energy: item.baseEnergy * scale,
      time: item.baseTime / scale,
      size: item.size,
      totalCost: (item.baseEnergy * scale * item.baseTime) * (item.cost / 1000),
    };
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-10 space-y-16">
      {/* Futuristic Energy Core Animation */}
      <div className="relative flex justify-center items-center w-72 h-72 mb-16">
        <motion.div
          className="absolute rounded-full w-40 h-40"
          style={{ background: "radial-gradient(circle, #00f5d4, #006466)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        <motion.div
          className="absolute rounded-full w-56 h-56 border-4 border-cyan-400"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        />
        <motion.div
          className="absolute rounded-full w-72 h-72 border-2 border-cyan-600"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
        />
        <motion.div
          className="absolute flex items-center justify-center w-28 h-28 rounded-full bg-gray-900 border-2 border-cyan-400 text-cyan-200 text-lg font-bold"
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        >
          {zFactorOutput} MW
        </motion.div>
        <p className="absolute bottom-0 text-cyan-200 text-lg font-semibold">Z-Factor Core</p>
      </div>

      {/* Interactive Slider */}
      <div className="w-full max-w-2xl mb-10">
        <label htmlFor="zfactor-slider" className="block text-center mb-2 font-medium text-cyan-200">
          Adjust Z-Factor Output
        </label>
        <input
          id="zfactor-slider"
          type="range"
          min="1000"
          max="10000"
          step="100"
          value={zFactorOutput}
          onChange={(e) => setZFactorOutput(Number(e.target.value))}
          className="w-full"
          title="Z-Factor Output Slider"
        />
        <p className="text-center mt-2">Adjust Z-Factor Output: {zFactorOutput} MW</p>
      </div>

      {/* Energy Output Comparison */}
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Energy Output Comparison</h2>
        <div className="flex space-x-6 justify-center">
          {energyComparison.map((item) => (
            <div key={item.name} className="flex flex-col items-center">
              <motion.div
                className="w-20 rounded-md"
                style={{ backgroundColor: item.color }}
                initial={{ height: 0 }}
                animate={{ height: item.energy / 20 }}
                transition={{ duration: 2 }}
              />
              <p className="mt-2 text-sm text-center">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Time to Generate Equivalent Energy */}
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Time to Generate Same Energy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {energyComparison.map((item, idx) => (
            <motion.div
              key={item.name}
              className="p-6 bg-gray-800 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p>{item.time.toFixed(1)} hours</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Size Comparison */}
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Size Comparison</h2>
        <div className="flex space-x-6 justify-center items-end">
          {energyComparison.map((item) => (
            <motion.div
              key={item.name}
              className="bg-gray-700 text-center text-xs flex items-end justify-center rounded-md"
              initial={{ height: 0 }}
              animate={{ height: item.size * 5 + 40, width: item.size * 5 + 40 }}
              transition={{ duration: 2 }}
            >
              <p className="p-1">{item.name}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cost Savings Comparison */}
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Cost Comparison ($/MWh)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {energyComparison.map((item, idx) => (
            <motion.div
              key={item.name}
              className="p-6 bg-gray-800 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p>{item.cost} $/MWh</p>
              <p className="text-sm text-gray-400 mt-2">Est. Total Cost: ${item.totalCost.toLocaleString()}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <motion.div
        className="mt-16 p-8 bg-gradient-to-r from-cyan-600 to-blue-800 rounded-2xl shadow-xl text-center max-w-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold mb-4">The Future of Clean Energy</h2>
        <p className="mb-6 text-cyan-100">
          The Z-Factor Energy System outperforms traditional sources in speed, safety, and cost � compact, modular, and futuristic.
        </p>
        <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold rounded-full shadow-lg">
          Learn More
        </button>
      </motion.div>
    </div>
  );
}
