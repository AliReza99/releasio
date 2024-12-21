import React, { useEffect, useId, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

function renderScene(canvas: HTMLCanvasElement) {
  // consts
  const sizes = {
    width: 600,
    height: 600,
  };

  // scene
  const scene = new THREE.Scene();

  // camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

  camera.position.set(0, 0, 3);

  // object (mesh = material + shape)
  const material = new THREE.MeshBasicMaterial({
    color: "#0288D1",
    wireframe: true,
  });
  const box = new THREE.BoxGeometry(1, 1, 1);

  const mesh = new THREE.Mesh(box, material);

  scene.add(mesh, camera);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  // addAxisHelper(scene);

  renderer.setSize(sizes.width, sizes.height);
  // renderer.render(scene, camera);

  // let time = Date.now();

  const clock = new THREE.Clock();

  function updater() {
    const elapsedTime = clock.getElapsedTime();

    // mesh.rotation.x = -elapsedTime * Math.PI * 0.25;
    mesh.position.x = Math.sin(elapsedTime);
    mesh.position.y = Math.cos(elapsedTime);
    mesh.position.x = Math.sin(elapsedTime);

    renderer.render(scene, camera);
    requestAnimationFrame(updater);
  }

  updater();
}

function addAxisHelper(scene: THREE.Scene) {
  const axesHelper = new THREE.AxesHelper(3);

  scene.add(axesHelper);
}

export const ThreeStarter = () => {
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
