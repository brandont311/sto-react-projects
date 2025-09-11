// ClientApp/src/components/ProsSection.tsx
import { motion } from "framer-motion";

const pros = [
  {
    title: "85%+ Energy Efficiency",
    desc: "Reuses thermal energy instead of wasting it.",
    icon: "⚡",
  },
  {
    title: "Coherence > 0.986",
    desc: "Quantum-level data integrity during energy operations.",
    icon: "🔬",
  },
  {
    title: "< 71 ms Mode Switching",
    desc: "Seamless transitions: Energy ↔ Info ↔ Hybrid.",
    icon: "⚡",
  },
  {
    title: "Unified Footprint",
    desc: "One device for energy + data reduces space and hassle.",
    icon: "📦",
  },
];

export default function ProsSection() {
  return (
    <div className="prosGrid">
      {pros.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.35 }}
          className="prosCard"
        >
          <div className="prosIcon">{p.icon}</div>
          <div className="prosTitle">{p.title}</div>
          <div className="prosDesc">{p.desc}</div>
        </motion.div>
      ))}
    </div>
  );
}
