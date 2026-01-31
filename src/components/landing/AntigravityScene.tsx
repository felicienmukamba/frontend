'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Stars, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function AnimatedBlob({ position, color, speed, distort }: { position: [number, number, number], color: string, speed: number, distort: number }) {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        meshRef.current.position.y = position[1] + Math.sin(t * speed) * 0.5;
        meshRef.current.rotation.x = t * 0.2;
    });

    return (
        <Float speed={speed * 2} rotationIntensity={0.5} floatIntensity={1}>
            <Sphere ref={meshRef} position={position} args={[1, 64, 64]}>
                <MeshDistortMaterial
                    color={color}
                    speed={speed * 5}
                    distort={distort}
                    radius={1}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    );
}

export function AntigravityScene() {
    return (
        <div className="absolute inset-0 -z-5 h-full w-full pointer-events-none opacity-60">
            <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#8b5cf6" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />

                <AnimatedBlob position={[-5, 2, -2]} color="#a855f7" speed={0.4} distort={0.4} />
                <AnimatedBlob position={[6, -3, 0]} color="#06b6d4" speed={0.6} distort={0.5} />
                <AnimatedBlob position={[0, 4, -5]} color="#ec4899" speed={0.3} distort={0.3} />
                <AnimatedBlob position={[-7, -4, -3]} color="#8b5cf6" speed={0.5} distort={0.6} />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            </Canvas>
        </div>
    );
}
