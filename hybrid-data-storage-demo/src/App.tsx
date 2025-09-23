import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// QsP Showcase - Single-file React component (Tailwind CSS assumed)
// Default export component. Drop into a React app (Vite/CRA) and install 'recharts'.

export default function QsPShowcase() {
  // Inputs (defaults chosen for demonstration; user can edit live)
  const [qspDataTB, setQspDataTB] = useState<number>(10_000); // TB per QsP unit (example)
  const [qspEnergykWh, setQspEnergykWh] = useState<number>(50); // kWh stored per QsP unit
  const [qspVolumeM3, setQspVolumeM3] = useState<number>(0.02); // cubic meters (shoebox-sized)

  const [serverRacks, setServerRacks] = useState<number>(200); // number of racks in a comparable small farm
  const [tbPerRack, setTbPerRack] = useState<number>(100); // TB per rack
  const [rackFootprintM2, setRackFootprintM2] = useState<number>(1.5); // footprint per rack (m^2)
  const [rackEnergykWh] = useState<number>(20); // UPS energy capacity per rack (kWh)

  const [totalInternetZB, setTotalInternetZB] = useState<number>(120); // zettabytes (user-editable estimate)

  // Conversions
  const totalInternetTB = totalInternetZB * 1e9; // 1 ZB = 1e9 TB

  // Derived metrics
  const qspUnitsToHoldInternet = Math.max(1, totalInternetTB / qspDataTB);
  const serverFarmTotalTB = serverRacks * tbPerRack;
  const qspTotalVolumeM3 = qspUnitsToHoldInternet * qspVolumeM3;
  const serverFarmFootprintM2 = serverRacks * rackFootprintM2;

  // Chart data comparing: single QsP, small server farm (the whole farm as configured), and 'All Internet'
  const chartData = [
    { name: "Data (TB)", "QsP Unit": qspDataTB, "Server Farm (total)": serverFarmTotalTB, "All Internet (TB)": totalInternetTB },
    { name: "Energy (kWh)", "QsP Unit": qspEnergykWh, "Server Farm (total)": serverRacks * rackEnergykWh, "All Internet (TB)": 0 },
    { name: "Volume (m3)", "QsP Unit": qspVolumeM3, "Server Farm (total)": serverRacks * 0.5, "All Internet (TB)": 0 },
  ];

  // Readable format helper
  function formatLarge(num: number) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + " B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + " M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + " K";
    return num.toString();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold">QsP Hybrid Data + Energy Showcase</h1>
          <p className="mt-2 text-slate-300 max-w-2xl mx-auto">
            Interactive demo comparing a single QsP unit vs a small server farm and the scale required to hold all
            (user-estimated) internet data. All values are editable – this is an illustrative model.
          </p>
        </header>

        {/* Controls */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
            <h3 className="font-bold mb-3">QsP Unit (editable)</h3>
            <label className="block text-sm text-slate-300">Data capacity (TB)</label>
            <input type="number" className="w-full p-2 rounded mt-1 bg-slate-800 border border-slate-700" placeholder="TB per QsP unit" title="Data capacity (TB)" value={qspDataTB} onChange={e => setQspDataTB(Number(e.target.value) || 0)} />

            <label className="block text-sm text-slate-300 mt-3">Energy capacity (kWh)</label>
            <input type="number" className="w-full p-2 rounded mt-1 bg-slate-800 border border-slate-700" placeholder="kWh per QsP unit" title="Energy capacity (kWh)" value={qspEnergykWh} onChange={e => setQspEnergykWh(Number(e.target.value) || 0)} />

            <label className="block text-sm text-slate-300 mt-3">Unit volume (m³)</label>
            <input type="number" step="0.01" className="w-full p-2 rounded mt-1 bg-slate-800 border border-slate-700" placeholder="m³ per QsP unit" title="Unit volume (m³)" value={qspVolumeM3} onChange={e => setQspVolumeM3(Number(e.target.value) || 0)} />
          </div>

          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
            <h3 className="font-bold mb-3">Comparable Server Farm (editable)</h3>
            <label className="block text-sm text-slate-300">Number of racks</label>
            <input type="number" className="w-full p-2 rounded mt-1 bg-slate-800 border border-slate-700" placeholder="Number of racks" title="Number of racks" value={serverRacks} onChange={e => setServerRacks(Number(e.target.value) || 0)} />

            <label className="block text-sm text-slate-300 mt-3">TB per rack</label>
            <input type="number" className="w-full p-2 rounded mt-1 bg-slate-800 border border-slate-700" placeholder="TB per rack" title="TB per rack" value={tbPerRack} onChange={e => setTbPerRack(Number(e.target.value) || 0)} />

            <label className="block text-sm text-slate-300 mt-3">Footprint per rack (m²)</label>
            <input type="number" step="0.1" className="w-full p-2 rounded mt-1 bg-slate-800 border border-slate-700" placeholder="m² per rack" title="Footprint per rack (m²)" value={rackFootprintM2} onChange={e => setRackFootprintM2(Number(e.target.value) || 0)} />
          </div>
        </section>

        {/* Internet size input */}
        <section className="bg-slate-900 p-4 rounded-lg border border-slate-700 mb-8">
          <h3 className="font-bold mb-2">Total Internet Data (estimate)</h3>
          <div className="flex gap-3 items-center">
            <input type="number" step="1" className="w-40 p-2 rounded bg-slate-800 border border-slate-700" placeholder="ZB" title="Total Internet Data (ZB)" value={totalInternetZB} onChange={e => setTotalInternetZB(Number(e.target.value) || 0)} />
            <div className="text-slate-300">Zettabytes (ZB). Default = 120 ZB (editable).</div>
          </div>
          <p className="mt-2 text-sm text-amber-200">Note: This demo uses a user-editable estimate for total internet data. Adjust to explore different scenarios.</p>
        </section>

        {/* Results summary */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-700/20 to-slate-900 p-4 rounded-lg border border-emerald-600">
            <h4 className="font-semibold">QsP Units required to hold Internet</h4>
            <div className="text-3xl font-bold mt-3">{formatLarge(Math.ceil(qspUnitsToHoldInternet))}</div>
            <div className="text-sm text-slate-200 mt-2">(Based on {qspDataTB.toLocaleString()} TB per QsP unit)</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-700/15 to-slate-900 p-4 rounded-lg border border-indigo-600">
            <h4 className="font-semibold">Server farm equivalents required</h4>
            <div className="text-3xl font-bold mt-3">{formatLarge(Math.ceil(totalInternetTB / serverFarmTotalTB))} farms</div>
            <div className="text-sm text-slate-200 mt-2">(Based on {serverRacks} racks × {tbPerRack} TB)</div>
          </div>

          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
            <h4 className="font-semibold">Estimated footprint comparison</h4>
            <div className="mt-3">
              <div className="text-lg">Server farm footprint (m²): <strong>{serverFarmFootprintM2.toLocaleString()}</strong></div>
              <div className="text-lg mt-2">QsP total volume (m³): <strong>{qspTotalVolumeM3.toLocaleString()}</strong></div>
            </div>
            <p className="text-sm text-amber-200 mt-2">This is a conceptual area/volume comparison for visualization only.</p>
          </div>
        </section>

        {/* Visual comparison area */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-3">Visual Comparison</h3>
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 flex flex-col lg:flex-row gap-6">
            {/* QsP small box */}
            <div className="flex-1 flex flex-col items-center">
              <div className="text-slate-300 mb-2">Single QsP Unit (scale sketch)</div>
              <div className="w-40 h-28 bg-gradient-to-br from-emerald-600/40 to-emerald-700/10 border border-emerald-500 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <div className="font-semibold">QsP</div>
                  <div className="text-sm">{qspDataTB.toLocaleString()} TB</div>
                </div>
              </div>

              <div className="mt-4 text-slate-300">Unit volume: {qspVolumeM3} m³</div>
            </div>

            {/* Server farm sketch */}
            <div className="flex-1 flex flex-col items-center">
              <div className="text-slate-300 mb-2">Comparable Server Farm (configured)</div>
              <div className="w-full max-w-md bg-gradient-to-br from-slate-700/40 to-slate-800 p-6 rounded-lg border border-slate-600">
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: Math.min(serverRacks, 12) }).map((_, i) => (
                    <div key={i} className="h-20 bg-slate-900 rounded border border-slate-700 flex items-center justify-center text-sm">
                      Rack
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-sm text-slate-300">({serverRacks} racks total)</div>
              </div>
            </div>

            {/* All Internet box */}
            <div className="flex-1 flex flex-col items-center">
              <div className="text-slate-300 mb-2">All Internet (for scale)</div>
              <div className="w-full max-w-xs h-40 bg-amber-700/10 border border-amber-500 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <div className="font-semibold">{totalInternetZB} ZB</div>
                  <div className="text-sm">= {formatLarge(totalInternetTB)} TB</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-amber-200">Units required: {formatLarge(Math.ceil(qspUnitsToHoldInternet))}</div>
            </div>
          </div>
        </section>

        {/* Chart */}
        <section className="mb-12">
          <h3 className="text-xl font-bold mb-3">Quantitative Comparison Chart</h3>
          <div className="bg-slate-900 p-4 rounded border border-slate-700 h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="QsP Unit" stackId="a" fill="#10b981" />
                <Bar dataKey="Server Farm (total)" stackId="a" fill="#2563eb" />
                <Bar dataKey="All Internet (TB)" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Footer / disclaimer */}
        <footer className="text-center text-sm text-slate-400 py-6">
          <div className="max-w-3xl mx-auto">
            <p>
              <strong>Disclaimer:</strong> This interactive demo is conceptual and intended for visualization and
              comparison. The user-entered numbers drive the calculations. Claims such as "holding all internet data"
              are illustrative – adjust the inputs to explore different scenarios and consult measured specs for
              engineering decisions.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
