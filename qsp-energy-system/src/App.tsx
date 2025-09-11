import { useState } from "react";
import "./App.css";
import QsPVisualization from "./components/QsPVisualization";
import ComparisonChart from "./components/ComparisonChart";
import ProsSection from "./components/ProsSection";

export default function App() {
  const [tooltip, setTooltip] = useState<string | null>(null);

  return (
    <div className="site">
      {/* Hero */}
      <header className="hero">
        <h1>QsP Hybrid Data/Energy System</h1>
        <p>Unifying energy and information with quantum coherence & Z-Factor thermodynamics.</p>
        <div className="ctaRow">
          <a className="btn" href="#science">See the Science</a>
          <a className="btn alt" href="#compare">Compare vs Competitors</a>
        </div>
      </header>

      {/* Science / 3D */}
      <section id="science" className="section">
        <h2>How the Science Works</h2>
        <p className="sub">
          Explore the Thermal Memory Layer, Quantum Coherence Layer, and Z-Factor Optimization Core.
        </p>
        <div className="vizWrap">
          <QsPVisualization onHover={setTooltip} />
          {tooltip && <div className="tooltip">{tooltip}</div>}
        </div>
        <div className="legend">
          <div><span className="dot thermal" /> Thermal Memory Layer</div>
          <div><span className="dot quantum" /> Quantum Coherence Layer</div>
          <div><span className="dot zfactor" /> Z-Factor Optimization Core</div>
        </div>
      </section>

      {/* Pros (animated) */}
      <section className="section">
        <h2>Why QsP Wins</h2>
        <ProsSection />
      </section>

      {/* Comparison */}
      <section id="compare" className="section">
        <h2>QsP vs Competitors</h2>
        <p className="sub">
          Side-by-side on efficiency, coherence, mode-switching, footprint, and lifecycle cost.
        </p>
        <ComparisonChart />
      </section>

      <footer className="footer">
        <small>© {new Date().getFullYear()} QsP Systems • Demo site</small>
      </footer>
    </div>
  );
}
