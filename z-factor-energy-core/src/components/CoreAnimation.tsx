import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function ZFactorCore() {
  return (
    <group>
      {/* Main Core Sphere */}
      <mesh rotation={[0.4, 0.6, 0]}>
        {/* Outer glass shell */}
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial
          transmission={1}
          transparent
          roughness={0}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          color="#00f6ff"
          opacity={0.3}
        />
      </mesh>

      {/* Inner Energy Ring */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[1, 0.2, 16, 100]} />
        <meshBasicMaterial color="#00f6ff" wireframe />
      </mesh>

      {/* Second Ring - Perpendicular */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.15, 16, 100]} />
        <meshBasicMaterial color="#ff3366" wireframe />
      </mesh>

      {/* Third Ring - Diagonal */}
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[0.6, 0.1, 16, 100]} />
        <meshBasicMaterial color="#ffaa00" wireframe />
      </mesh>

      {/* Central Core */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color="#ffffff"
          emissive="#00f6ff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

export default function CoreAnimation() {
  return (
    <div className="core-canvas">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#00f6ff" />
        <ZFactorCore />
        <OrbitControls 
          autoRotate 
          autoRotateSpeed={0.5} 
          enablePan 
          enableZoom 
          enableRotate 
        />
      </Canvas>
    </div>
  );
}
