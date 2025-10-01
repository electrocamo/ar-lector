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

    // Crear renderer con soporte XR
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.xr.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Escena y cámara
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    // Luces
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(hemiLight);

    // Cargar modelo GLTF
    const model = await loadGLTF(`${import.meta.env.BASE_URL}pieza.glb`);
    model.scene.scale.set(0.2, 0.2, 0.2);
    model.scene.position.set(0, 0, -0.5); // medio metro enfrente
    scene.add(model.scene);

    // Iniciar sesión AR (sin marcador)
    const session = await navigator.xr.requestSession("immersive-ar", {
      requiredFeatures: ["local-floor"], // “hit-test” si luego quieres colocarlo en el suelo
    });

    renderer.xr.setSession(session);

    // Animación
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

