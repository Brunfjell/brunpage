import { useGLTF } from "@react-three/drei";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Moon({
  radius = 2.5,
  speed = 0.25,
  scale = 0.5,
  position = [0, 0, 0],
}) {
  const { scene: rawScene } = useGLTF("/brunpage/models/moon.glb");
  const moonRef = useRef();
  const atmosphereRef = useRef();

  const scene = useMemo(() => {
    const clone = rawScene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) child.material.side = THREE.DoubleSide;
      }
    });
    return clone;
  }, [rawScene]);

  const posVector = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    if (!moonRef.current || !atmosphereRef.current) return;

    const t = clock.getElapsedTime() * speed;
    const x = position[0] + Math.cos(t) * radius;
    const z = position[2] + Math.sin(t) * radius;

    posVector.set(x, position[1], z);
    moonRef.current.position.copy(posVector);
    atmosphereRef.current.position.copy(posVector);
  });

  return (
    <>
      <primitive ref={moonRef} object={scene} scale={scale} />

      <mesh ref={atmosphereRef} scale={scale * 1.05}>
        <sphereGeometry args={[1, 32, 32]} /> 
        <meshBasicMaterial
          color="#fafafa"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

useGLTF.preload("/brunpage/models/moon.glb");
