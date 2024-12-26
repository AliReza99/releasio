import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

// @refresh reset

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

function initialize({ canvas }: { canvas: HTMLCanvasElement }) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "#f00", wireframe: true })
  );
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.z = 3;
  camera.aspect = sizes.width / sizes.height;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#fff");
  scene.add(camera, mesh);

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    renderer.setSize(sizes.width, sizes.height);
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  function tick() {
    renderer.render(scene, camera);

    controls.update();

    requestAnimationFrame(tick);
  }

  tick();
}

let isCalled = false;

export function ExamplePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || isCalled) return;

    isCalled = true;

    initialize({ canvas: canvasRef.current });
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}
