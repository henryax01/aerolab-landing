import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';

function ParallaxGroup({ children }) {
  const group = useRef(null);
  useFrame((state) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    group.current.rotation.y += (x * 0.35 - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (-y * 0.18 - group.current.rotation.x) * 0.05;
  });
  return <group ref={group}>{children}</group>;
}

const METAL  = { color: '#7ba3c0', metalness: 0.85, roughness: 0.12 };
const DARK   = { color: '#0f1f35', metalness: 0.95, roughness: 0.06 };
const PANEL  = { color: '#071525', metalness: 0.5,  roughness: 0.4 };
const CYAN   = { color: '#00f0ff', emissive: '#00f0ff', emissiveIntensity: 2.8, metalness: 0, roughness: 0 };
const PURPLE = { color: '#c084fc', emissive: '#c084fc', emissiveIntensity: 2.4, metalness: 0, roughness: 0 };
const AMBER  = { color: '#fbbf24', emissive: '#fbbf24', emissiveIntensity: 1.6, metalness: 0, roughness: 0 };

function HexPanel({ position, rotation, scale = 1 }) {
  const ref = useRef();
  const offset = position[0] * 13.7 + position[1] * 7.3;
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.material.opacity = 0.18 + Math.abs(Math.sin(t * 0.7 + offset)) * 0.25;
  });
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <ringGeometry args={[0.18 * scale, 0.28 * scale, 6]} />
      <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.2} transparent opacity={0.3} />
    </mesh>
  );
}

function Robot() {
  const leftArmRef    = useRef();
  const rightArmRef   = useRef();
  const ring1Ref      = useRef();
  const ring2Ref      = useRef();
  const ring3Ref      = useRef();
  const headRef       = useRef();
  const eyeRef        = useRef();
  const antennaTipRef = useRef();
  const coreRef       = useRef();
  const basePulseRef  = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (leftArmRef.current)  leftArmRef.current.rotation.x  = Math.sin(t * 1.4) * 0.22;
    if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(t * 1.4 + Math.PI) * 0.22;

    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.18;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = t * 0.8;
      ring1Ref.current.rotation.z = t * 0.25;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = t * 0.6;
      ring2Ref.current.rotation.z = -t * 0.4;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = -t * 0.5;
      ring3Ref.current.rotation.x = t * 0.35;
    }

    if (eyeRef.current) {
      const intensity = 2.2 + Math.sin(t * 2.8) * 1.0;
      eyeRef.current.children.forEach((mesh) => {
        if (mesh.material) mesh.material.emissiveIntensity = intensity;
      });
    }

    if (antennaTipRef.current?.material) {
      antennaTipRef.current.material.emissiveIntensity = 3.0 + Math.sin(t * 4.0) * 1.5;
    }

    if (coreRef.current) {
      const s = 1 + Math.sin(t * 2.2) * 0.18;
      coreRef.current.scale.setScalar(s);
      if (coreRef.current.material)
        coreRef.current.material.emissiveIntensity = 2.5 + Math.sin(t * 2.2) * 1.2;
    }

    if (basePulseRef.current?.material) {
      basePulseRef.current.material.opacity = 0.25 + Math.abs(Math.sin(t * 1.3)) * 0.35;
    }
  });

  return (
    <group>
      {/* === BASE PLATFORM === */}
      <mesh position={[0, -2.3, 0]}>
        <cylinderGeometry args={[1.1, 1.3, 0.12, 32]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
      <mesh ref={basePulseRef} position={[0, -2.24, 0]}>
        <ringGeometry args={[0.7, 1.1, 64]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, -2.24, 0]}>
        <ringGeometry args={[0.2, 0.5, 64]} />
        <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={1.5} transparent opacity={0.2} />
      </mesh>

      {/* === ANTENNA === */}
      <mesh position={[0, 3.0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.6, 8]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
      <mesh ref={antennaTipRef} position={[0, 3.34, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial {...CYAN} />
      </mesh>
      {/* Antenna rings */}
      <mesh position={[0, 3.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.09, 0.018, 8, 20]} />
        <meshStandardMaterial {...PURPLE} />
      </mesh>

      {/* === HEAD === */}
      <group ref={headRef} position={[0, 2.35, 0]}>
        {/* Main head box */}
        <mesh>
          <boxGeometry args={[1.08, 0.9, 0.92]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        {/* Side ear plates */}
        <mesh position={[-0.62, 0, 0]}>
          <boxGeometry args={[0.12, 0.55, 0.55]} />
          <meshStandardMaterial {...DARK} />
        </mesh>
        <mesh position={[0.62, 0, 0]}>
          <boxGeometry args={[0.12, 0.55, 0.55]} />
          <meshStandardMaterial {...DARK} />
        </mesh>
        {/* Ear accent dots */}
        <mesh position={[-0.69, 0, 0]}>
          <sphereGeometry args={[0.055, 10, 10]} />
          <meshStandardMaterial {...PURPLE} />
        </mesh>
        <mesh position={[0.69, 0, 0]}>
          <sphereGeometry args={[0.055, 10, 10]} />
          <meshStandardMaterial {...PURPLE} />
        </mesh>
        {/* Visor strip */}
        <mesh position={[0, 0.06, 0.47]}>
          <boxGeometry args={[0.9, 0.28, 0.02]} />
          <meshStandardMaterial {...PANEL} />
        </mesh>
        {/* Eyes */}
        <group ref={eyeRef} position={[0, 0.06, 0.48]}>
          <mesh position={[-0.22, 0, 0]}>
            <boxGeometry args={[0.26, 0.12, 0.02]} />
            <meshStandardMaterial {...CYAN} />
          </mesh>
          <mesh position={[0.22, 0, 0]}>
            <boxGeometry args={[0.26, 0.12, 0.02]} />
            <meshStandardMaterial {...CYAN} />
          </mesh>
        </group>
        {/* Mouth grill */}
        <mesh position={[0, -0.24, 0.47]}>
          <boxGeometry args={[0.52, 0.06, 0.02]} />
          <meshStandardMaterial {...DARK} />
        </mesh>
        {[- 0.17, 0, 0.17].map((x, i) => (
          <mesh key={i} position={[x, -0.24, 0.475]}>
            <boxGeometry args={[0.03, 0.05, 0.01]} />
            <meshStandardMaterial {...AMBER} />
          </mesh>
        ))}
        {/* Top head ridge */}
        <mesh position={[0, 0.48, 0]}>
          <boxGeometry args={[0.7, 0.06, 0.7]} />
          <meshStandardMaterial {...DARK} />
        </mesh>
      </group>

      {/* === NECK === */}
      <mesh position={[0, 1.85, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.2, 12]} />
        <meshStandardMaterial {...DARK} />
      </mesh>

      {/* === TORSO === */}
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[1.55, 1.55, 1.12]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Chest panel */}
      <mesh position={[0, 1.1, 0.57]}>
        <boxGeometry args={[0.9, 0.78, 0.04]} />
        <meshStandardMaterial {...PANEL} />
      </mesh>
      {/* Core orb */}
      <mesh ref={coreRef} position={[0, 1.18, 0.62]}>
        <sphereGeometry args={[0.14, 20, 20]} />
        <meshStandardMaterial {...CYAN} />
      </mesh>
      {/* Core ring */}
      <mesh position={[0, 1.18, 0.61]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.21, 0.025, 8, 32]} />
        <meshStandardMaterial {...PURPLE} />
      </mesh>
      {/* Chest data lines */}
      {[0.76, 0.64, 0.52].map((y, i) => (
        <mesh key={i} position={[0, y, 0.62]}>
          <boxGeometry args={[0.68, 0.025, 0.01]} />
          <meshStandardMaterial {...AMBER} />
        </mesh>
      ))}
      {/* Side armor vents */}
      <mesh position={[-0.79, 1.0, 0]}>
        <boxGeometry args={[0.04, 0.7, 0.7]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
      <mesh position={[0.79, 1.0, 0]}>
        <boxGeometry args={[0.04, 0.7, 0.7]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
      {[-0.79, 0.79].map((x, si) => (
        [0.2, 0.0, -0.2].map((dy, i) => (
          <mesh key={`vent-${si}-${i}`} position={[x, 1.0 + dy, 0.35]}>
            <boxGeometry args={[0.05, 0.06, 0.3]} />
            <meshStandardMaterial {...CYAN} />
          </mesh>
        ))
      ))}

      {/* === SHOULDERS === */}
      <mesh position={[-0.96, 1.6, 0]}>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
      <mesh position={[0.96, 1.6, 0]}>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
      {/* Shoulder accent */}
      <mesh position={[-0.96, 1.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.27, 0.03, 8, 24]} />
        <meshStandardMaterial {...PURPLE} />
      </mesh>
      <mesh position={[0.96, 1.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.27, 0.03, 8, 24]} />
        <meshStandardMaterial {...PURPLE} />
      </mesh>

      {/* === LEFT ARM === */}
      <group ref={leftArmRef} position={[-0.96, 1.1, 0]}>
        <mesh>
          <cylinderGeometry args={[0.21, 0.16, 1.2, 12]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <mesh position={[0, -0.58, 0]}>
          <torusGeometry args={[0.2, 0.045, 8, 20]} />
          <meshStandardMaterial {...DARK} />
        </mesh>
        <mesh position={[0, -1.04, 0]}>
          <cylinderGeometry args={[0.15, 0.13, 0.75, 12]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -1.52, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.32]} />
          <meshStandardMaterial {...DARK} />
        </mesh>
        <mesh position={[0, -1.52, 0.17]}>
          <boxGeometry args={[0.22, 0.07, 0.02]} />
          <meshStandardMaterial {...CYAN} />
        </mesh>
        {/* Finger tips */}
        {[-0.08, 0, 0.08].map((x, i) => (
          <mesh key={i} position={[x, -1.7, 0.1]}>
            <boxGeometry args={[0.06, 0.1, 0.06]} />
            <meshStandardMaterial {...DARK} />
          </mesh>
        ))}
      </group>

      {/* === RIGHT ARM === */}
      <group ref={rightArmRef} position={[0.96, 1.1, 0]}>
        <mesh>
          <cylinderGeometry args={[0.21, 0.16, 1.2, 12]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <mesh position={[0, -0.58, 0]}>
          <torusGeometry args={[0.2, 0.045, 8, 20]} />
          <meshStandardMaterial {...DARK} />
        </mesh>
        <mesh position={[0, -1.04, 0]}>
          <cylinderGeometry args={[0.15, 0.13, 0.75, 12]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -1.52, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.32]} />
          <meshStandardMaterial {...DARK} />
        </mesh>
        <mesh position={[0, -1.52, 0.17]}>
          <boxGeometry args={[0.22, 0.07, 0.02]} />
          <meshStandardMaterial {...CYAN} />
        </mesh>
        {[-0.08, 0, 0.08].map((x, i) => (
          <mesh key={i} position={[x, -1.7, 0.1]}>
            <boxGeometry args={[0.06, 0.1, 0.06]} />
            <meshStandardMaterial {...DARK} />
          </mesh>
        ))}
      </group>

      {/* === HIP BELT === */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[1.35, 0.28, 0.98]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
      <mesh position={[0, 0.18, 0.5]}>
        <boxGeometry args={[0.55, 0.1, 0.02]} />
        <meshStandardMaterial {...AMBER} />
      </mesh>
      {/* Hip side grips */}
      {[-0.55, 0.55].map((x, i) => (
        <mesh key={i} position={[x, 0.18, 0.48]}>
          <boxGeometry args={[0.08, 0.22, 0.04]} />
          <meshStandardMaterial {...PURPLE} />
        </mesh>
      ))}

      {/* === LEGS === */}
      {[-0.42, 0.42].map((x, i) => (
        <group key={i}>
          <mesh position={[x, -0.55, 0]}>
            <cylinderGeometry args={[0.25, 0.21, 1.1, 12]} />
            <meshStandardMaterial {...METAL} />
          </mesh>
          <mesh position={[x, -0.98, 0]}>
            <torusGeometry args={[0.24, 0.055, 8, 20]} />
            <meshStandardMaterial {...DARK} />
          </mesh>
          <mesh position={[x, -1.45, 0]}>
            <cylinderGeometry args={[0.2, 0.18, 0.72, 12]} />
            <meshStandardMaterial {...METAL} />
          </mesh>
          {/* Leg accent stripe */}
          <mesh position={[x, -1.22, 0.19]}>
            <boxGeometry args={[0.06, 0.5, 0.03]} />
            <meshStandardMaterial {...CYAN} />
          </mesh>
          {/* Foot */}
          <mesh position={[x, -1.92, 0.1]}>
            <boxGeometry args={[0.5, 0.24, 0.72]} />
            <meshStandardMaterial {...DARK} />
          </mesh>
          <mesh position={[x, -1.8, 0.47]}>
            <boxGeometry args={[0.36, 0.05, 0.02]} />
            <meshStandardMaterial {...CYAN} />
          </mesh>
        </group>
      ))}

      {/* === ORBITAL RINGS === */}
      <mesh ref={ring1Ref} position={[0, 0.2, 0]}>
        <torusGeometry args={[2.6, 0.022, 8, 100]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.2} transparent opacity={0.6} />
      </mesh>
      <mesh ref={ring2Ref} position={[0, 0.2, 0]}>
        <torusGeometry args={[2.1, 0.018, 8, 80]} />
        <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={2.0} transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring3Ref} position={[0, 0.4, 0]}>
        <torusGeometry args={[1.7, 0.014, 8, 60]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.4} transparent opacity={0.4} />
      </mesh>

      {/* === FLOATING HEX PANELS === */}
      <HexPanel position={[2.2, 1.2, -0.5]}  rotation={[0.3, -0.5, 0.2]}  scale={1.5} />
      <HexPanel position={[-2.1, 0.5, -0.3]} rotation={[-0.2, 0.6, -0.1]} scale={1.2} />
      <HexPanel position={[1.8, -0.6, 0.4]}  rotation={[0.5, 0.3, -0.3]}  scale={1.0} />
      <HexPanel position={[-1.6, 1.8, 0.2]}  rotation={[-0.4, -0.3, 0.5]} scale={0.9} />
      <HexPanel position={[0.4, 2.5, -1.0]}  rotation={[0.6, 0.1, -0.2]}  scale={0.8} />
    </group>
  );
}

export default function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 46 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 4]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-4, 3, 3]}  intensity={1.2} color="#00f0ff" />
      <pointLight position={[4, 1, 3]}   intensity={0.8} color="#c084fc" />
      <pointLight position={[0, -2, 3]}  intensity={0.6} color="#0ea5e9" />
      <pointLight position={[0, 4, -2]}  intensity={0.5} color="#c084fc" />

      <ParallaxGroup>
        <Float speed={1.0} rotationIntensity={0.08} floatIntensity={0.5}>
          <Robot />
        </Float>
        <Sparkles count={80}  scale={6}   size={1.0} speed={0.35} color="#00f0ff" opacity={0.55} />
        <Sparkles count={40}  scale={5}   size={0.8} speed={0.5}  color="#c084fc" opacity={0.45} />
      </ParallaxGroup>
    </Canvas>
  );
}
