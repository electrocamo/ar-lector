import { useRef, useState } from "react";
import * as THREE from "three";
import { loadGLTF } from "./loadGLTF";

export default function App() {
  const containerRef = useRef();
  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: containerRef.current,
      imageTargetSrc: "/target.mind",
    });

    const { renderer, scene, camera } = mindarThree;
    const anchor = mindarThree.addAnchor(0);

    const model = await loadGLTF("/public/plato1.glb");
    model.scene.scale.set(0.4, 0.4, 0.4);
    model.scene.position.set(0, 0, 0);
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
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
