import { useRef, useState } from "react";
import * as THREE from "three";
import { loadGLTF } from "./loadGLTF";

export default function App() {
  const containerRef = useRef();
  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    if (!navigator.xr) {
      alert("Tu navegador no soporta WebXR");
      return;
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.xr.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    // ✅ Luces
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // ✅ Modelo
    const model = await loadGLTF(`${import.meta.env.BASE_URL}pieza.gltf`);
    model.scene.scale.set(0.2, 0.2, 0.2);
    model.scene.position.set(0, 0, -0.5); // medio metro al frente de la cámara
    scene.add(model.scene);

    // ✅ Sesión de AR
    const session = await navigator.xr.requestSession("immersive-ar", {
      requiredFeatures: ["hit-test", "local-floor"],
    });

    renderer.xr.setSession(session);

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    setStarted(true);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {!started && (
        <button
          onClick={handleStart}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "1rem 2rem",
            fontSize: "1.2rem",
            zIndex: 10,
          }}
        >
          Iniciar AR sin marcador
        </button>
      )}
      <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />
    </div>
  );
}
