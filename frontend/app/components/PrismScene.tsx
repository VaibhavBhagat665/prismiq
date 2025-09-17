"use client";
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function Prism() {
  return (
    <mesh>
      <coneGeometry args={[1, 1.4, 4]} />
      <meshStandardMaterial color="#3b82f6" transparent opacity={0.4} />
    </mesh>
  )
}

export default function PrismScene() {
  return (
    <Canvas frameloop="demand" camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[3,3,3]} />
      <Prism />
      <OrbitControls enablePan={false} enableZoom={false} />
    </Canvas>
  )
}
