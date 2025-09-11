// ClientApp/src/components/ComparisonChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Energy Efficiency (%)", QsP: 85, LiIon: 72, Thermal: 68 },
  { name: "Coherence (0–1)", QsP: 0.986, LiIon: 0.0, Thermal: 0.0 },
  { name: "Switch Speed (ms) ↓", QsP: 71, LiIon: 120, Thermal: 180 },
  { name: "Footprint (relative) ↓", QsP: 1.0, LiIon: 2.5, Thermal: 3.0 },
  { name: "Lifecycle Cost ↓", QsP: 1.0, LiIon: 1.6, Thermal: 1.4 },
];

export default function ComparisonChart() {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="QsP" fill="#10b981" />
          <Bar dataKey="LiIon" fill="#f59e0b" />
          <Bar dataKey="Thermal" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
      <div className="chart-note">
        ↓ Lower is better for Switch Speed, Footprint, and Lifecycle Cost.
      </div>
    </div>
  );
}
