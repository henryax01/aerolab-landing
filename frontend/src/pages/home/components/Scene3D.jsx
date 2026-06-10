import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';

function ParallaxGroup({ children }) {
  const group = useRef(null);
  useFrame((state) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    group.current.rotation.y += (x * 0.4 - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (-y * 0.2 - group.current.rotation.x) * 0.04;
  });
  return <group ref={group}>{children}</group>;
}

const METAL = { color: '#a8bdd4', metalness: 0.75, roughness: 0.18 };
const DARK  = { color: '#1e293b', metalness: 0.9,  roughness: 0.08 };
const CYAN  = { color: '#22d3ee', emissive: '#22d3ee', emissiveIntensity: 2.2, metalness: 0, roughness: 0 };
const AMBER = { color: '#f59e0b', emissive: '#f59e0b', emissiveIntensity: 1.5, metalness: 0, roughness: 0 };

function Robot() {
  const leftArmRef    = useRef();
  const rightArmRef   = useRef();
  const ringRef       = useRef();
  const eyeRef        = useRef();
  const antennaTipRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (leftArmRef.current)  leftArmRef.current.rotation.x  = Math.sin(t * 1.6) * 0.18;
    if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(t * 1.6 + Math.PI) * 0.18;
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.7;
      ringRef.current.rotation.z = t * 0.3;
    }
    if (eyeRef.current) {
      const intensity = 1.8 + Math.sin(t * 2.5) * 0.8;
      eyeRef.current.children.forEach((mesh) => {
        if (mesh.material) mesh.material.emissiveIntensity = intensity;
      });
    }
    if (antennaTipRef.current?.material) {
      antennaTipRef.current.material.emissiveIntensity = 2.5 + Math.sin(t * 3.5) * 1.2;
    }
  });

  return (
    <group>
      {/* Antenna */}
      <mesh position={[0, 2.88, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.55, 8]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
      <mesh ref={antennaTipRef} position={[0, 3.18, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial {...CYAN} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 2.3, 0]}>
        <boxGeometry args={[1.05, 0.88, 0.9]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Head visor strip */}
      <mesh position={[0, 2.3, 0.46]}>
        <boxGeometry args={[0.88, 0.22, 0.02]} />
        <meshStandardMaterial color="#0f172a" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Eyes */}
      <group ref={eyeRef} position={[0, 2.3, 0.47]}>
        <mesh position={[-0.22, 0, 0]}>
          <boxGeometry args={[0.22, 0.13, 0.02]} />
          <meshStandardMaterial {...CYAN} />
        </mesh>
        <mesh position={[0.22, 0, 0]}>
          <boxGeometry args={[0.22, 0.13, 0.02]} />
          <meshStandardMaterial {...CYAN} />
        </mesh>
      </group>
      {/* Mouth slot */}
      <mesh position={[0, 2.02, 0.46]}>
        <boxGeometry args={[0.44, 0.05, 0.02]} />
        <meshStandardMaterial {...DARK} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.83, 0]}>
        <cylinderGeometry args={[0.14, 0.18, 0.18, 12]} />
        <meshStandardMaterial {...DARK} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[1.5, 1.5, 1.1]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Chest panel */}
      <mesh position={[0, 1.08, 0.56]}>
        <boxGeometry args={[0.82, 0.72, 0.04]} />
        <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Chest core orb */}
      <mesh position={[0, 1.15, 0.6]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial {...CYAN} />
      </mesh>
      {/* Chest grid lines */}
      <mesh position={[0, 0.84, 0.61]}>
        <boxGeometry args={[0.62, 0.03, 0.01]} />
        <meshStandardMaterial {...AMBER} />
      </mesh>
      <mesh position={[0, 0.75, 0.61]}>
        <boxGeometry args={[0.62, 0.03, 0.01]} />
        <meshStandardMaterial {...AMBER} />
      </mesh>

      {/* Shoulder joints */}
      <mesh position={[-0.92, 1.55, 0]}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
      <mesh position={[0.92, 1.55, 0]}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial {...DARK} />
      </mesh>

      {/* Left arm */}
      <group ref={leftArmRef} position={[-0.92, 1.1, 0]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.15, 1.2, 12]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <mesh position={[0, -0.55, 0]}>
          <torusGeometry args={[0.19, 0.04, 8, 20]} />
          <meshStandardMaterial {...DARK} />
        </mesh>
        <mesh position={[0, -1.0, 0]}>
          <cylinderGeometry args={[0.14, 0.12, 0.7, 12]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <mesh position={[0, -1.5, 0]}>
          <boxGeometry args={[0.28, 0.28, 0.3]} />
          <meshStandardMaterial {...DARK} />
        </mesh>
        <mesh position={[0, -1.5, 0.16]}>
          <boxGeometry args={[0.2, 0.06, 0.02]} />
          <meshStandardMaterial {...CYAN} />
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={rightArmRef} position={[0.92, 1.1, 0]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.15, 1.2, 12]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <mesh position={[0, -0.55, 0]}>
          <torusGeometry args={[0.19, 0.04, 8, 20]} />
          <meshStandardMaterial {...DARK} />
        </mesh>
        <mesh position={[0, -1.0, 0]}>
          <cylinderGeometry args={[0.14, 0.12, 0.7, 12]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <mesh position={[0, -1.5, 0]}>
          <boxGeometry args={[0.28, 0.28, 0.3]} />
          <meshStandardMaterial {...DARK} />
        </mesh>
        <mesh position={[0, -1.5, 0.16]}>
          <boxGeometry args={[0.2, 0.06, 0.02]} />
          <meshStandardMaterial {...CYAN} />
        </mesh>
      </group>

      {/* Hip belt */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.3, 0.26, 0.95]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
      <mesh position={[0, 0.2, 0.49]}>
        <boxGeometry args={[0.5, 0.1, 0.02]} />
        <meshStandardMaterial {...AMBER} />
      </mesh>

      {/* Upper legs */}
      <mesh position={[-0.4, -0.55, 0]}>
        <cylinderGeometry args={[0.24, 0.2, 1.1, 12]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0.4, -0.55, 0]}>
        <cylinderGeometry args={[0.24, 0.2, 1.1, 12]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Knee rings */}
      <mesh position={[-0.4, -0.95, 0]}>
        <torusGeometry args={[0.23, 0.05, 8, 20]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
      <mesh position={[0.4, -0.95, 0]}>
        <torusGeometry args={[0.23, 0.05, 8, 20]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
      {/* Lower legs */}
      <mesh position={[-0.4, -1.42, 0]}>
        <cylinderGeometry args={[0.19, 0.17, 0.7, 12]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0.4, -1.42, 0]}>
        <cylinderGeometry args={[0.19, 0.17, 0.7, 12]} />
        <meshStandardMaterial {...METAL} />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.4, -1.88, 0.1]}>
        <boxGeometry args={[0.46, 0.22, 0.68]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
      <mesh position={[0.4, -1.88, 0.1]}>
        <boxGeometry args={[0.46, 0.22, 0.68]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
      {/* Foot accent strips */}
      <mesh position={[-0.4, -1.78, 0.45]}>
        <boxGeometry args={[0.32, 0.04, 0.02]} />
        <meshStandardMaterial {...CYAN} />
      </mesh>
      <mesh position={[0.4, -1.78, 0.45]}>
        <boxGeometry args={[0.32, 0.04, 0.02]} />
        <meshStandardMaterial {...CYAN} />
      </mesh>

      {/* Orbital scan ring */}
      <mesh ref={ringRef} position={[0, 0.2, 0]}>
        <torusGeometry args={[2.4, 0.025, 8, 80]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.8} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

export default function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 7.5], fov: 48 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} />
      <pointLight position={[-4, 2, 3]} intensity={0.6} color="#60a5fa" />
      <pointLight position={[0, 1, 4]} intensity={0.9} color="#22d3ee" />
      <pointLight position={[0, -2, 2]} intensity={0.4} color="#0ea5e9" />

      <ParallaxGroup>
        <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.6}>
          <Robot />
        </Float>
        <Sparkles count={60} scale={5} size={1.2} speed={0.4} color="#22d3ee" opacity={0.6} />
      </ParallaxGroup>
    </Canvas>
  );
}
