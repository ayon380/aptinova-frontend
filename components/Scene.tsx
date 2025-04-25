import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";

function HexGrid({ count = 30 }) {
  return Array.from({ length: count }).map((_, i) => (
    <Float
      key={i}
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={0.5}
      position={[
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5,
      ]}
    >
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 6]} />
        <meshStandardMaterial
          color={Math.random() > 0.5 ? "#f59e0b" : "#ea580c"}
          opacity={0.7}
          transparent
        />
      </mesh>
    </Float>
  ));
}

export default function Scene() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Suspense fallback={null}>
        <HexGrid />
      </Suspense>
    </Canvas>
  );
}
