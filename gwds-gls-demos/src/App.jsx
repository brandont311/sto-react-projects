import { useState, useMemo } from "react";
import { Slider } from "./components/ui/slider";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function App() {
  const [entropy, setEntropy] = useState(50);
  // Removed unused frequency state
  const [phase, setPhase] = useState(50);
  const [temp, setTemp] = useState(25);
  const [humidity, setHumidity] = useState(60);
  const [waveType, setWaveType] = useState("sine");
  const [angle, setAngle] = useState(45);

  // Sample graph data for GWDS + GLS mockups - using useMemo to prevent flickering
  const gwdsData = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    x: i,
    noisy: Math.sin(i / 2) * 50 + (Math.sin(i + entropy) * 20),
    clean: Math.sin(i / 2) * 50
  })), [entropy]);

  const weatherData = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    time: i,
    standard: Math.sin(i / 2) * 30 + 20 + (temp - 25) * 0.5,
    gwds: Math.sin(i / 2) * 30 + 10 + (humidity - 60) * 0.2
  })), [temp, humidity]);

  const waveformData = useMemo(() => Array.from({ length: 20 }, (_, i) => {
    let val = 0;
    if (waveType === "sine") val = Math.sin(i / 2) * 50;
    if (waveType === "square") val = (i % 4 < 2 ? 40 : -40);
    if (waveType === "triangle") val = ((i % 10) - 5) * 10;
    return { x: i, wave: val + Math.sin(i * 0.5) * 5 };
  }), [waveType]);

  const glsResonanceData = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    freq: i,
    resonance: Math.max(0, 100 - Math.abs(i * 5 - phase))
  })), [phase]);

  const trajectoryData = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    x: i,
    altitude: angle > 30 && angle < 70 ? i * 5 : i * 2
  })), [angle]);

  const compareData = [
    { name: "Rocket", cost: 65 },
    { name: "GLS", cost: 1.2 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* GWDS Demo 1 */}
      <Card className="shadow-xl">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">🌌 GWDS – Curvature Anomaly Detector</h2>
          <p className="text-sm mb-4">Adjust entropy filtering to reveal hidden signals in noisy data.</p>
          <Slider value={[entropy]} max={100} onValueChange={(val) => setEntropy(val[0])} />
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={gwdsData}>
              <Line type="monotone" dataKey="noisy" stroke="#8884d8" />
              <Line type="monotone" dataKey="clean" stroke="#82ca9d" strokeWidth={2} />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-2 text-sm">Detection clarity: {entropy + 30}%</p>
        </CardContent>
      </Card>

      {/* GWDS Demo 2 */}
      <Card className="shadow-xl">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">🌦️ GWDS – Entropy Weather Predictor</h2>
          <p className="text-sm mb-4">Set conditions and see how GWDS improves storm prediction.</p>
          <div className="space-y-2">
            <p className="text-sm">Temperature: {temp}°C</p>
            <Slider value={[temp]} max={50} onValueChange={(val) => setTemp(val[0])} />
            <p className="text-sm">Humidity: {humidity}%</p>
            <Slider value={[humidity]} max={100} onValueChange={(val) => setHumidity(val[0])} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weatherData}>
              <Line type="monotone" dataKey="standard" stroke="#8884d8" />
              <Line type="monotone" dataKey="gwds" stroke="#ff7300" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-2 text-sm">GWDS detects in 9s vs Standard 19s</p>
        </CardContent>
      </Card>

      {/* GWDS Demo 3 */}
      <Card className="shadow-xl">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">📡 GWDS – Waveform Explorer</h2>
          <p className="text-sm mb-4">Experiment with different wave types and see what GWDS detects.</p>
          <div className="flex gap-2 mb-2">
            <Button onClick={() => setWaveType("sine")}>Sine</Button>
            <Button onClick={() => setWaveType("square")}>Square</Button>
            <Button onClick={() => setWaveType("triangle")}>Triangle</Button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={waveformData}>
              <Line type="monotone" dataKey="wave" stroke="#00C49F" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-2 text-sm">Wave type: {waveType}</p>
        </CardContent>
      </Card>

      {/* GLS Demo 1 */}
      <Card className="shadow-xl">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">🚀 GLS – Resonance Launch Simulator</h2>
          <p className="text-sm mb-4">Tune resonance frequency and phase alignment to achieve lift.</p>
          <Slider value={[phase]} max={100} onValueChange={(val) => setPhase(val[0])} />
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={glsResonanceData}>
              <Line type="monotone" dataKey="resonance" stroke="#ff7300" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="freq" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-2 text-sm">Launch status: {phase > 45 && phase < 55 ? "Success! 🚀" : "Not aligned"}</p>
        </CardContent>
      </Card>

      {/* GLS Demo 2 */}
      <Card className="shadow-xl">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">🛰️ GLS – Orbital Path Designer</h2>
          <p className="text-sm mb-4">Adjust launch angle and see trajectory results.</p>
          <p className="text-sm">Angle: {angle}°</p>
          <Slider value={[angle]} max={90} onValueChange={(val) => setAngle(val[0])} />
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trajectoryData}>
              <Line type="monotone" dataKey="altitude" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-2 text-sm">{angle > 30 && angle < 70 ? "Stable orbit achieved" : "Trajectory failed"}</p>
        </CardContent>
      </Card>

      {/* GLS Demo 3 */}
      <Card className="shadow-xl md:col-span-2">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">⚡ GLS – Energy Efficiency Challenge</h2>
          <p className="text-sm mb-4">Compare rocket vs. GLS launch costs per ton.</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={compareData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cost" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-2 text-sm">Savings: ${compareData[0].cost - compareData[1].cost}M per ton</p>
        </CardContent>
      </Card>
    </div>
  );
}
