import { useThree, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { ShaderMaterial, Vector2 } from 'three'

const Pixelation = () => {
  const { gl, scene, camera, size } = useThree()
  const composer = useRef()

  const pixelShader = {
    uniforms: {
      tDiffuse: { value: null },
      resolution: { value: new Vector2(size.width, size.height) },
      pixelSize: { value: 3.5 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float pixelSize;
      uniform vec2 resolution;
      varying vec2 vUv;
      void main() {
        vec2 dxy = pixelSize / resolution;
        vec2 coord = dxy * floor(vUv / dxy);
        gl_FragColor = texture2D(tDiffuse, coord);
      }
    `
  }

  useEffect(() => {
    composer.current = new EffectComposer(gl)
    composer.current.setSize(size.width, size.height)
    composer.current.addPass(new RenderPass(scene, camera))

    const shaderPass = new ShaderPass(
      new ShaderMaterial({
        uniforms: pixelShader.uniforms,
        vertexShader: pixelShader.vertexShader,
        fragmentShader: pixelShader.fragmentShader
      })
    )
    shaderPass.renderToScreen = true
    composer.current.addPass(shaderPass)

    const handleResize = () => {
      composer.current.setSize(window.innerWidth, window.innerHeight)
      pixelShader.uniforms.resolution.value.set(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [gl, scene, camera, size])

  useFrame(() => {
    composer.current?.render()
  }, 1)

  return null
}

export default Pixelation
