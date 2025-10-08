import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, useProgress, Html } from "@react-three/drei";
import Earth from "./Earth";
import Moon from "./components/Moon";
import Rocket from "./components/Rocket";
import SpaceObjects from "./components/SpaceObjects";
import Pixelation from "./Pixelation";

function Loader() {
  const { active, progress } = useProgress();
  return (
    <Html center>
      <div className="text-white text-center">
        {active ? `Loading ${Math.round(progress)}%` : "Loading..."}
      </div>
    </Html>
  );
}

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        const related = data.RelatedTopics?.flatMap((item) => {
          if (item.Text) return item.Text;
          if (item.Topics) return item.Topics.map((t) => t.Text);
          return [];
        });
        setSuggestions(related?.slice(0, 10) || []);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [query]);

  return (
    <div className="w-screen h-screen relative">
      <Canvas
        shadows
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 8], fov: 50 }}
      >
        <ambientLight intensity={4} color={0xffffff} />

        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={1}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        <pointLight position={[0, 5, 5]} intensity={0.6} color={0xffeecc} distance={15} decay={2} />

        <pointLight position={[-5, -5, -5]} intensity={0.3} color={0xffed66} />

        <Suspense fallback={<Loader />}>
          <Stars radius={100} depth={50} count={5000} factor={7} fade />
          <Earth />
          <Moon position={[0, -0.25, 0]} radius={4.5} scale={0.45} speed={0.175} />

          <Rocket orbitRadius={6.5} orbitSpeed={0.4} scale={0.2} />
          <SpaceObjects spawnInterval={15000} lifetime={12000} maxObjects={5} />

          <Pixelation />
        </Suspense>

        <OrbitControls enablePan={false} minDistance={4.25} maxDistance={7} />
      </Canvas>


      <div className="absolute bottom-16 w-full flex justify-center z-10">
        <div className="relative w-[85%] md:w-[40rem]">
          {suggestions.length > 0 && (
            <div className="absolute bottom-full mb-3 left-0 w-full max-h-52 overflow-y-auto bg-base-100/80 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-base-300 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            action="https://www.google.com/search"
            method="GET"
            target="_blank"
            className="bg-base-100/70 backdrop-blur-lg border border-white/20 rounded-xl px-6 py-4 flex items-center gap-3 shadow-2xl transition-all duration-500 hover:scale-[1.02]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
            </svg>

            <input
              type="text"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Where do you want to go today?"
              className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm md:text-md lg:text-lg outline-none"
              autoComplete="off"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
