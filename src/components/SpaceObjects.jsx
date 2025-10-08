import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState, useMemo, useEffect, useRef } from "react";
import * as THREE from "three";

const ASTEROIDS = [
  "/brunpage/models/asteroid1.glb",
  "/brunpage/models/asteroid2.glb",
  "/brunpage/models/asteroid3.glb",
];

const rand = (min, max) => Math.random() * (max - min) + min;

export default function SpaceObjects({
  spawnInterval = 16000,
  lifetime = 10000,
  maxObjects = 1,
}) {
  const [asteroids, setAsteroids] = useState([]);
  const gltfs = useMemo(() => ASTEROIDS.map((path) => useGLTF(path)), []);

  const spawnAsteroid = () => {
    const modelIndex = Math.floor(Math.random() * gltfs.length);
    const id = crypto.randomUUID();

    const baseZ = -40;
    const position = new THREE.Vector3(
      rand(-10, 10),
      rand(-4, 4),
      baseZ + rand(-5, 5)
    );

    const velocity = new THREE.Vector3(
      rand(-0.1, 0.1),
      rand(-0.1, 0.1),
      rand(0.08, 0.15)
    );

    const hasTrail = Math.random() < 0.8;
    const flaming = hasTrail && Math.random() < 0.6;
    const scale = rand(0.05, 0.15);

    const trailGeometry = new THREE.BufferGeometry();
    const maxTrailPoints = 25;
    const trailPositions = new Float32Array(maxTrailPoints * 3);
    trailGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(trailPositions, 3)
    );

    const trailMaterial = new THREE.PointsMaterial({
      color: flaming ? 0xff5500 : 0xffffff,
      size: flaming ? 0.2 : 0.1,
      transparent: true,
      opacity: flaming ? 0.9 : 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    setAsteroids((prev) => [
      ...prev,
      {
        id,
        modelIndex,
        position,
        velocity,
        rotation: new THREE.Euler(rand(0, Math.PI), rand(0, Math.PI), rand(0, Math.PI)),
        angularVel: new THREE.Vector3(rand(-0.01, 0.01), rand(-0.01, 0.01), rand(-0.01, 0.01)),
        hasTrail,
        flaming,
        scale,
        birthTime: performance.now(),
        trailPositions,
        trailGeometry,
        trailMaterial,
        trailIndex: 0,
      },
    ]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAsteroids((prev) => {
        if (prev.length < maxObjects) spawnAsteroid();
        return prev;
      });
    }, spawnInterval);
    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    const now = performance.now();
    asteroids.forEach((a) => {
      a.position.add(a.velocity);
      a.rotation.x += a.angularVel.x;
      a.rotation.y += a.angularVel.y;
      a.rotation.z += a.angularVel.z;

      if (a.hasTrail) {
        a.trailIndex = (a.trailIndex + 1) % 25;
        a.trailPositions[a.trailIndex * 3] = a.position.x;
        a.trailPositions[a.trailIndex * 3 + 1] = a.position.y;
        a.trailPositions[a.trailIndex * 3 + 2] = a.position.z;
        a.trailGeometry.attributes.position.needsUpdate = true;
      }
    });

    setAsteroids((prev) => prev.filter((a) => now - a.birthTime < lifetime));
  });

  return (
    <>
      {asteroids.map((a) => {
        const model = gltfs[a.modelIndex]?.scene.clone();

        return (
          <group key={a.id}>
            <primitive object={model} position={a.position} rotation={a.rotation} scale={a.scale} />
            {a.hasTrail && (
              <points geometry={a.trailGeometry} material={a.trailMaterial} />
            )}
            {a.flaming && (
              <pointLight color={0xff5500} intensity={1.2} distance={4} position={a.position} />
            )}
          </group>
        );
      })}
    </>
  );
}

ASTEROIDS.forEach(useGLTF.preload);
