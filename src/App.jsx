import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import Earth from './Earth'
import Pixelation from './Pixelation'

function App() {
  return (
    <div className="w-screen h-screen relative">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={6.5} />
        <pointLight position={[10, 10, 10]} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={4} 
          castShadow 
        />
        <pointLight
          position={[2, 3, 2]}
          intensity={3}
          distance={10}
          decay={6}
        />
        <Stars />
        <Earth />
        <OrbitControls 
          enablePan={false} 
          minDistance={4.25} 
          maxDistance={6} 
        />
        <Pixelation />
      </Canvas>

      <div className="absolute bottom-16 w-full flex justify-center z-10">
        <form 
          action="https://www.google.com/search"
          method="GET"
          target="_blank"
          className="w-[85%] md:w-[40rem] bg-base-100/70 backdrop-blur-lg border border-white/20 rounded-xl px-6 py-4 flex items-center gap-3 shadow-2xl transition-all duration-500 hover:scale-[1.02]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
          </svg>

          <input 
            type="text" 
            name="q" 
            placeholder="Where do you want to go today?" 
            className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm md:text-md lg:text-lg outline-none"
          />
        </form>
      </div>
    </div>
  )
}

export default App
