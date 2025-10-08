import { useGLTF } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Rocket({
  orbitRadius = 6,
  orbitSpeed = 0.25,
  scale = 0.15,
  rotationOffset = { x: Math.PI / 2, y: 0, z: 1.5 },
  smokeOffset = new THREE.Vector3(0, -0.4, 0), 
}) {
  const { scene } = useGLTF("/brunpage/models/rocket.glb");

  const rocketGroup = useRef(); 
  const rocketModel = useRef();
  const [direction, setDirection] = useState(1);
  const [angle, setAngle] = useState(Math.PI); 

  const smokeRef = useRef();
  const smokePositions = useMemo(() => new Float32Array(200 * 3), []);
  const smokeGeom = useMemo(() => new THREE.BufferGeometry(), []);
  const smokeMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.07,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
    []
  );

  useEffect(() => {
    smokeGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(smokePositions, 3)
    );
  }, [smokeGeom, smokePositions]);

  useEffect(() => {
    setDirection(Math.random() < 0.5 ? 1 : -1);
  }, []);

  useFrame((state, delta) => {
    if (!rocketGroup.current || !rocketModel.current) return;

    const newAngle = angle + direction * orbitSpeed * delta;
    setAngle(newAngle);

    const x = Math.cos(newAngle) * orbitRadius;
    const z = Math.sin(newAngle) * orbitRadius;
    const y = Math.sin(newAngle * 0.7) * 0.5;
    rocketGroup.current.position.set(x, y, z);

    rocketGroup.current.lookAt(0, 0, 0);
    rocketModel.current.rotation.x = rotationOffset.x;
    rocketModel.current.rotation.y = rotationOffset.y;
    rocketModel.current.rotation.z =
      rotationOffset.z + (direction === 1 ? Math.PI : 0);

    rocketGroup.current.rotation.z += delta * 0.3 * direction;

    const rocketWorldPos = new THREE.Vector3();
    const smokeWorldPos = new THREE.Vector3();
    rocketModel.current.getWorldPosition(rocketWorldPos);
    smokeWorldPos.copy(smokeOffset).applyMatrix4(rocketModel.current.matrixWorld);

    const positions = smokeGeom.attributes.position.array;
    for (let i = positions.length - 3; i >= 3; i--) {
      positions[i] = positions[i - 3];
    }
    positions[0] = smokeWorldPos.x;
    positions[1] = smokeWorldPos.y;
    positions[2] = smokeWorldPos.z;
    smokeGeom.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <group ref={rocketGroup}>
        <primitive
          ref={rocketModel}
          object={scene}
          scale={scale}
          castShadow
          receiveShadow
        />
      </group>
      <points ref={smokeRef} geometry={smokeGeom} material={smokeMat} />
    </>
  );
}

useGLTF.preload("/brunpage/models/rocket.glb");
