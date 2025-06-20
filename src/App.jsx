import { useEffect, useRef } from "react";
import * as THREE from "three";
import { loadGLTF } from "./loadGLTF";

export default function App() {
  const containerRef = useRef();

  useEffect(() => {
    const start = async () => {
      const mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: containerRef.current,
        imageTargetSrc: "/target.mind"
      });

      const { renderer, scene, camera } = mindarThree;
      const anchor = mindarThree.addAnchor(0);

      const model = await loadGLTF("/plato1.glb");
      model.scene.scale.set(0.4, 0.4, 0.4);
      model.scene.position.set(0, 0, 0);
      anchor.group.add(model.scene);

      await mindarThree.start();
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    };

    start();
  }, []);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
}
