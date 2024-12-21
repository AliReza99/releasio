import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

// enable double click toggle fullscreen
window.addEventListener("dblclick", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.body.requestFullscreen();
  }
});

function renderScene(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();

  // Object
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 3, 3, 3),
    new THREE.MeshBasicMaterial({
      color: "#0288D1",
      wireframe: true,
    })
  );
  scene.add(mesh);

  // Camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  // camera.position.x = 2;
  // camera.position.y = 2;
  // camera.aspect = sizes.width / sizes.height;
  camera.position.z = 3;
  camera.lookAt(mesh.position);
  scene.add(camera);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
    // controls.update();

    window.requestAnimationFrame(animation);
  };

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    // handle 2 monitor with different pixel ratios
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

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
