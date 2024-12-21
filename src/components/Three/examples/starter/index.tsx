import React, { useEffect, useId, useRef } from "react";
import * as THREE from "three";

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

  camera.position.z = 2;

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
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);
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
      <div className="flex bg-emerald-50">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};
