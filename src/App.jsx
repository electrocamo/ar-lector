import { useRef, useState } from "react";
import * as THREE from "three";
import { loadGLTF } from "./loadGLTF";

export default function App() {
  const containerRef = useRef();
  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: containerRef.current,
      imageTargetSrc: `${import.meta.env.BASE_URL}target.mind`,
    });

    const { renderer, scene, camera } = mindarThree;
    const anchor = mindarThree.addAnchor(0);

    // ✅ Añadir luces aquí
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // ✅ Saber cuándo se reconoce el target
    anchor.onTargetFound = () => {
      console.log("🎯 Target reconocido");
    };

    // ✅ Cargar modelo
    const model = await loadGLTF(`${import.meta.env.BASE_URL}bandeja_paisa.glb`);
    model.scene.scale.set(0.2, 0.2, 0.2);
    model.scene.position.set(0, 0, 0);
    model.scene.rotation.set(0, -Math.PI / 2, 0); // ejemplo: rotar 90° en X
    anchor.group.add(model.scene);

    await mindarThree.start();
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
          Iniciar experiencia RA
        </button>
      )}
      <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />
    </div>
  );
}
