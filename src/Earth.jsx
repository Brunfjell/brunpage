import { useFrame, useLoader } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { TextureLoader } from 'three'

const Earth = () => {
  const earthRef = useRef()
  const cloudsRef = useRef()

  const [colorMap, bumpMap, specMap, cloudMap] = useLoader(TextureLoader, [
    '/brunpage/textures/earth_daymap.jpg',
    '/brunpage/textures/earth_bump.jpg',
    '/brunpage/textures/earth_specular.jpg',
    '/brunpage/textures/earth_clouds.png'
  ])

  useFrame(() => {
    if (earthRef.current) earthRef.current.rotation.y += 0.001
    if (cloudsRef.current) cloudsRef.current.rotation.y += 0.0015 
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
    </>
  )
}

export default Earth
