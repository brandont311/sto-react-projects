import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Torus } from "@react-three/drei";
import * as THREE from "three";
import "./CoreAnimation.css";

function ZFactorCore() {
  const coreRef = useRef<THREE.Group>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 1.5;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.8;
    }
  });

  return (
    <group ref={coreRef} rotation={[0.2, 0, 0]}>
      {/* Outer glass shell */}
      <Sphere args={[2, 64, 64]}>
        <meshPhysicalMaterial
          transmission={0.9}
          transparent
          roughness={0.05}
          thickness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
          color="#00f6ff"
          opacity={0.3}
        />
      </Sphere>
      
      {/* Inner energy core */}
      <Sphere args={[1.2, 32, 32]}>
        <meshStandardMaterial
          color="#00ffff"
          emissive="#004466"
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </Sphere>

      {/* Energy rings */}
      <mesh ref={ringRef} position={[0, 0, 0]}>
        <Torus args={[1.5, 0.15, 16, 100]}>
          <meshStandardMaterial
            color="#00f6ff"
            emissive="#00f6ff"
            emissiveIntensity={0.8}
            wireframe={false}
          />
        </Torus>
      </mesh>

      {/* Second energy ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <Torus args={[1.3, 0.1, 12, 80]}>
          <meshStandardMaterial
            color="#66ffff"
            emissive="#0088aa"
            emissiveIntensity={0.6}
            wireframe
          />
        </Torus>
      </mesh>

      {/* Plasma streams */}
      <mesh rotation={[0, 0, Math.PI / 4]} position={[0, 0, 0]}>
        <Torus args={[0.8, 0.05, 8, 60]}>
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={1.2}
          />
        </Torus>
      </mesh>
    </group>
  );
}

function BackgroundParticles() {
  const particlesRef = useRef<THREE.Points>(null!);
  
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#00aaff" size={0.02} sizeAttenuation />
    </points>
  );
}

export default function CoreAnimation() {
  return (
    <div className="core-animation-container">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f6ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0088ff" />
        <spotLight 
          position={[0, 5, 5]} 
          intensity={2} 
          color="#00ffff"
          angle={0.3}
          penumbra={1}
        />
        
        {/* Background particles */}
        <BackgroundParticles />
        
        {/* Main Z-Factor Core */}
        <ZFactorCore />
        
        {/* Orbit controls for interaction */}
        <OrbitControls 
          autoRotate 
          autoRotateSpeed={0.3}
          enableZoom={true}
          enablePan={false}
          maxDistance={15}
          minDistance={5}
        />
      </Canvas>
    </div>
  );
}
