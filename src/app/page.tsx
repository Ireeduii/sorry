"use client";

import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Float,
  Stars,
  MeshDistortMaterial,
} from "@react-three/drei";
import * as THREE from "three";

function createHeartShape() {
  const shape = new THREE.Shape();

  const x = 0,
    y = 0;

  shape.moveTo(x, y + 0.5);
  shape.bezierCurveTo(x, y + 0.5, x, y + 1, x - 1, y + 1);
  shape.bezierCurveTo(x - 2, y + 1, x - 2, y, x - 2, y);
  shape.bezierCurveTo(x - 2, y - 1, x - 1.5, y - 1.7, x, y - 2.5);
  shape.bezierCurveTo(x + 1.5, y - 1.7, x + 2, y - 1, x + 2, y);
  shape.bezierCurveTo(x + 2, y, x + 2, y + 1, x + 1, y + 1);
  shape.bezierCurveTo(x, y + 1, x, y + 0.5, x, y + 0.5);

  return shape;
}

function FloatingHeart() {
  const mesh = useRef<THREE.Mesh>(null);

  const heartShape = useMemo(() => createHeartShape(), []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.4,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    }),
    [],
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.4;

      mesh.current.position.y = Math.sin(t / 1.5) * 0.2;
    }
  });

  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={mesh} rotation={[Math.PI, 0, 0]} scale={0.5}>
        <extrudeGeometry args={[heartShape, extrudeSettings]} />

        <MeshDistortMaterial
          color="#ff1144"
          speed={2}
          distort={0.3}
          radius={1}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-[#030303] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.3} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          <Stars
            radius={100}
            depth={50}
            count={6000}
            factor={4}
            saturation={0}
            fade
            speed={1.2}
          />

          <Suspense fallback={null}>
            <Center>
              <FloatingHeart />
            </Center>
          </Suspense>

          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 pointer-events-none">
        <h1 className="text-white text-6xl md:text-8xl font-bold tracking-tighter drop-shadow-[0_5px_15px_rgba(255,17,68,0.5)]">
          Уучлаарай...
        </h1>
        <div className="mt-8 space-y-3">
          <p className="text-pink-400 text-xl md:text-2xl font-light italic animate-pulse">
            Намайг үнэхээр уучлаарай ❤️
          </p>
          <p className="text-gray-500 text-sm tracking-[0.3em] uppercase mt-6 opacity-70">
            (Намайг эргүүлээд үзээрэй)
          </p>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-80 pointer-events-none" />
    </main>
  );
}

import { Center } from "@react-three/drei";
