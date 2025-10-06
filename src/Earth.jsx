import { useFrame, useLoader } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { TextureLoader } from 'three'

const Earth = () => {
  const earthRef = useRef()
  const cloudsRef = useRef()
  const atmosphereRef = useRef()

  const [colorMap, bumpMap, specMap, cloudMap] = useLoader(TextureLoader, [
    '/brunpage/textures/earth_daymap.jpg',
    '/brunpage/textures/earth_bump.jpg',
    '/brunpage/textures/earth_specular.jpg',
    '/brunpage/textures/earth_clouds.png'
  ])

  useFrame(() => {
    if (earthRef.current) earthRef.current.rotation.y += 0.0015
    if (cloudsRef.current) cloudsRef.current.rotation.y -= 0.002
    if (atmosphereRef.current) atmosphereRef.current.rotation.y += 0.0003
  })

  return (
    <>
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.05}
          specularMap={specMap}
          specular={new THREE.Color('grey')}
        />
      </mesh>

      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.01, 64, 64]} />
        <meshPhongMaterial
          map={cloudMap}
          transparent={true}
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.05, 64, 64]} />
        <meshBasicMaterial
          color="#4db2ff"
          transparent={true}
          opacity={0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}

export default Earth
