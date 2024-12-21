import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const sizes = {
  width: 800,
  height: 800,
};

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

function renderScene(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();

  // Object
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    })
  );
  scene.add(mesh);

  // Camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  // camera.position.x = 2;
  // camera.position.y = 2;
  camera.position.z = 3;
  camera.lookAt(mesh.position);
  scene.add(camera);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(sizes.width, sizes.height);

  // using orbit controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const animation = () => {
    renderer.render(scene, camera);
    // update camera manually
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    // camera.position.y = -cursor.y * 3;
    // camera.lookAt(mesh.position);

    // update camera by controls
    controls.update();

    window.requestAnimationFrame(animation);
  };

  animation();
}

export const Example3 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    renderScene(canvas);
  }, [renderScene]);
  //

  return (
    <div className="flex">
      <div className="flex">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};
