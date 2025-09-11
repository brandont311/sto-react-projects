// ClientApp/src/components/QsPVisualization.tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

type Props = { onHover?: (text: string | null) => void };

export default function QsPVisualization({ onHover }: Props) {
  return (
    <div className="viz-container">
      <Canvas camera={{ position: [4, 3, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />
        <group>
          {/* Thermal Memory Layer */}
          <HoverMesh
            onHover={onHover}
            label="Thermal Memory Layer\nGraphene composite + crystals enable high conductivity and nanoscale gradients."
            position={[0, 0, 0]}
          >
            <mesh>
              <sphereGeometry args={[1.2, 48, 48]} />
              <meshStandardMaterial
                color={"#f39c12"}
                emissive={"#e74c3c"}
                emissiveIntensity={0.25}
                roughness={0.35}
                metalness={0.1}
                wireframe={false}
              />
            </mesh>
          </HoverMesh>

          {/* Quantum Coherence Layer */}
          <HoverMesh
            onHover={onHover}
            label="Quantum Coherence Layer\nSuperconducting ceramics maintain coherence > 0.986."
            position={[0, 0, 0]}
          >
            <mesh rotation={[Math.PI / 2.2, 0, 0]}>
              <torusGeometry args={[1.8, 0.12, 24, 160]} />
              <meshStandardMaterial
                color={"#2980b9"}
                emissive={"#00ffff"}
                emissiveIntensity={0.25}
                metalness={0.2}
                roughness={0.4}
              />
            </mesh>
          </HoverMesh>

          {/* Z-Factor Optimization Core */}
          <HoverMesh
            onHover={onHover}
            label="Z-Factor Optimization Core\nThermodynamic optimizer that reuses heat and balances modes."
            position={[0, 0, 0]}
          >
            <mesh>
              <boxGeometry args={[0.9, 0.9, 0.9]} />
              <meshStandardMaterial
                color={"#8e44ad"}
                emissive={"#c0392b"}
                emissiveIntensity={0.2}
                metalness={0.35}
                roughness={0.35}
              />
            </mesh>
          </HoverMesh>
        </group>

        {/* Ground & Controls */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <shadowMaterial opacity={0.15} />
        </mesh>
        <OrbitControls enablePan enableZoom enableRotate />
        <Html position={[0, -1.55, 0]} center>
          <div className="viz-controls">Drag to rotate • Scroll to zoom</div>
        </Html>
      </Canvas>
    </div>
  );
}

function HoverMesh({
  children,
  onHover,
  label,
  position,
}: {
  children: React.ReactNode;
  onHover?: (text: string | null) => void;
  label: string;
  position?: [number, number, number];
}) {
  const ref = useRef<THREE.Group>(null!);
  return (
    <group
      ref={ref}
      position={position || [0, 0, 0]}
      onPointerOver={() => onHover?.(label)}
      onPointerOut={() => onHover?.(null)}
    >
      {children}
    </group>
  );
}
